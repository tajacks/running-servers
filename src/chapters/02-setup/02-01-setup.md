---
layout: layouts/chapter.njk
title: Setup
description: Server setup from initial login through core configurations
chapter: setup
chapterNumber: 2
sectionNumber: 1
---

This section is intended to bring your server from the initial configuration to a hardened base with core configurations that are ready to be built upon.

The commands in this section should be executed as the {% hl %}root user{% endhl %}.

This section prioritizes speed and uses `echo` commands to replace or append to files, as opposed to editing manually.

### Setup Variables

{% callout "info", "Note" %}
Setting shell variables in this step can be skipped if you have configured custom values for all variables by using the button in the header. 
{% endcallout %}

If setting variables in the shell, set the following to non-empty values.

{% command "optionally run" %}
ADMIN_USER=""           # I use 'tjack'
ADMIN_USER_COMMENT=""   # I use 'Thomas Jack'
ADMIN_SSH_KEY=""        # I use my personal SSH key
APP_USER=""             # I use 'app'
SSH_PORT=""             # I use 2222
{% endcommand %}


### System Updates

Update the `apt` cache.

{% command %}
apt update
{% endcommand %}

Upgrade the system, using this upgrade command to remove packages if it is necessary.

{% command %}
apt full-upgrade
{% endcommand %}

Clean the local repository of files that can no longer be downloaded.

{% command %}
apt autoclean 
{% endcommand %}

Remove any packages which were installed as a dependency of another package which are no longer needed.

{% command %}
apt autoremove 
{% endcommand %}

### Essential Packages

Install some core and generally useful software packages onto the server. 

{% termlist "Useful Package Summary" %}
ca-certificates: Common CA certificates
curl: Data transfer tool
fail2ban: Brute-force attack protection
git: Version control system
gnupg: Encryption and signing toolkit
htop: Interactive process viewer
lsb-release: Linux distribution identifier
net-tools: Network utilities
rsync: File synchronization tool
rsyslog: System logging daemon
sysstat: System performance tools
tree: Directory listing tool
ufw: Host-based firewall
unattended-upgrades: Automatic security updates
vim: Text editor
{% endtermlist %}

{% command %}
apt install \
  ca-certificates \
  curl \
  fail2ban \
  git \
  gnupg \
  htop \
  lsb-release \
  net-tools \
  rsync \
  rsyslog \
  sysstat \
  tree \
  ufw \
  unattended-upgrades \
  vim
{% endcommand %}

### Create Admin User

The admin user will have privileged access to the server but does not run applications. This user will be configured to run `sudo` commands without a password prompt.

Create the user with a home directory.

{% command %}
useradd -m -s /usr/bin/bash -c "$ADMIN_USER_COMMENT" "$ADMIN_USER"
{% endcommand %}

Add the user to the `sudo` group:

{% command %}
usermod -aG sudo "$ADMIN_USER"
{% endcommand %}

Configure passwordless `sudo` for the admin user:

{% command %}
echo "$ADMIN_USER ALL=(ALL) NOPASSWD:ALL" > "/etc/sudoers.d/$ADMIN_USER"
chmod 0440 "/etc/sudoers.d/$ADMIN_USER"
{% endcommand %}

Create the admin users SSH directory with proper ownership and file modes. Then, add the admin users key to the
authorized keys file.

{% command %}
mkdir -p "/home/$ADMIN_USER/.ssh"
chmod 700 "/home/$ADMIN_USER/.ssh"
chown "$ADMIN_USER:$ADMIN_USER" "/home/$ADMIN_USER/.ssh"
echo "$ADMIN_SSH_KEY" > "/home/$ADMIN_USER/.ssh/authorized_keys"
chmod 600 "/home/$ADMIN_USER/.ssh/authorized_keys"
chown "$ADMIN_USER:$ADMIN_USER" "/home/$ADMIN_USER/.ssh/authorized_keys"
{% endcommand %}

### Create Application User

The application user will be a non-privileged user that runs containerized applications. This user has no `sudo` access and is isolated from administrative functions.

Create the user with a home directory.

{% command %}
useradd -m -s /usr/bin/bash -c "Application User" "$APP_USER"
{% endcommand %}

### SSH Hardening

Hardening SSH access includes changing the default port, allowing only specific users to connect via SSH, and more. These changes can prevent the bulk of bots and scanners
which constantly attempt to find servers with open or weakly configured SSH access across the internet.

Take a backup of the configuration which shipped with the server before modifying it.

{% command %}
cp /etc/ssh/sshd_config /etc/ssh/sshd_config.bak
{% endcommand %}

Install the configuration, overwriting the current file:

{% codefile "/etc/ssh/sshd_config" %}
# Hardened SSH Configuration
# Network
Port $SSH_PORT 
AddressFamily any
ListenAddress 0.0.0.0
ListenAddress ::
# Host Keys
HostKey /etc/ssh/ssh_host_ed25519_key
HostKey /etc/ssh/ssh_host_ecdsa_key
HostKey /etc/ssh/ssh_host_rsa_key
# Ciphers and keying
KexAlgorithms curve25519-sha256,curve25519-sha256@libssh.org,diffie-hellman-group16-sha512,diffie-hellman-group18-sha512
Ciphers chacha20-poly1305@openssh.com,aes256-gcm@openssh.com,aes128-gcm@openssh.com,aes256-ctr,aes192-ctr,aes128-ctr
MACs hmac-sha2-512-etm@openssh.com,hmac-sha2-256-etm@openssh.com,hmac-sha2-512,hmac-sha2-256
# Authentication
PermitRootLogin no
PubkeyAuthentication yes
PasswordAuthentication no
PermitEmptyPasswords no
ChallengeResponseAuthentication no
UsePAM yes
# Security settings
MaxAuthTries 3
MaxSessions 10
LoginGraceTime 60
ClientAliveInterval 300
ClientAliveCountMax 2
MaxStartups 10:30:60
# Access control
AllowUsers $ADMIN_USER
# Logging
SyslogFacility AUTH
LogLevel VERBOSE
# Disable unnecessary features
X11Forwarding no
PrintMotd no
PrintLastLog yes
TCPKeepAlive yes
AcceptEnv LANG LC_*
# Subsystem
Subsystem sftp /usr/lib/openssh/sftp-server" > /etc/ssh/sshd_config
{% endcodefile %}

Ensure the SSH service is enabled and reload the configuration:

{% command %}
systemctl enable ssh
systemctl reload ssh
{% endcommand %}

{% callout "warning", "Warning" %}
Do not close your current SSH session yet! Open a new terminal and test the connection with the new settings before proceeding:
{% command "Run from your local machine" %}
ssh -p $SSH_PORT $ADMIN_USER@$SERVER_IP
{% endcommand %}
{% endcallout %}


If the connection succeeds, you can safely continue. If it fails, you still have your current session connected to fix any configuration issues.

### Setup fail2ban

fail2ban is a utility which monitors for unsuccesful SSH attempts in your authentication logs and temporarily bans IP
addresses which exceed a threshold. Write the configuration file and restart the service:

{% codefile "/etc/fail2ban/jail.local" %}
[DEFAULT]
bantime = 3600
findtime = 600
maxretry = 5
destemail = root@localhost
sendername = Fail2Ban
action = %(action_)s
[sshd]
enabled = true
port = $SSH_PORT
filter = sshd
logpath = /var/log/auth.log
maxretry = 5
{% endcodefile %}


Set file permissions and ownership.

{% command %}
chmod 644 /etc/fail2ban/jail.local
chown root:root /etc/fail2ban/jail.local
{% endcommand %}

Enable and start fail2ban.

{% command %}
systemctl enable fail2ban
systemctl restart fail2ban
{% endcommand %}

Check if fail2ban is running.

{% command %}
systemctl status fail2ban
{% endcommand %}

### Configure Firewall

`ufw` is the utility used for controlling the host firewall. A good starting place is to allow all outbound traffic,
deny all inbound traffic, and then selectively allow SSH + web traffic to your server. If your server will not serve
web content, those rules can be omitted.

Set default, SSH, and web content rules.

{% command %}
ufw default deny incoming
ufw default allow outgoing
ufw allow "$SSH_PORT/tcp" comment 'SSH'
ufw allow 80/tcp comment 'HTTP'
ufw allow 443/tcp comment 'HTTPS'
{% endcommand %}

Enable the firewall

{% command %}
ufw --force enable
{% endcommand %}

Validate the rules:

{% command %}
ufw status verbose
{% endcommand %}

### Secure File Permissions

Set secure file permissions. The files may already have their permissions set appropriately, but nonetheless, it is good defensive practice to set them explicitly.

{% command %}
chmod 644 /etc/passwd
chmod 640 /etc/shadow
chmod 644 /etc/group
chmod 640 /etc/gshadow
chmod 600 /etc/ssh/sshd_config
{% endcommand %}

### Configure Automatic Updates

The `unattended-upgrades` package automatically installs security updates to keep the system patched without manual intervention. This configuration enables automatic security updates while preventing automatic reboots, giving you control over when the server restarts. Configure the service:

```
echo 'Unattended-Upgrade::Allowed-Origins {
    "${distro_id}:${distro_codename}";
    "${distro_id}:${distro_codename}-security";
};
Unattended-Upgrade::AutoFixInterruptedDpkg "true";
Unattended-Upgrade::MinimalSteps "true";
Unattended-Upgrade::Remove-Unused-Kernel-Packages "true";
Unattended-Upgrade::Remove-Unused-Dependencies "true";
Unattended-Upgrade::Automatic-Reboot "false";' > /etc/apt/apt.conf.d/50unattended-upgrades
chmod 644 /etc/apt/apt.conf.d/50unattended-upgrades
chown root:root /etc/apt/apt.conf.d/50unattended-upgrades

echo 'APT::Periodic::Update-Package-Lists "1";
APT::Periodic::Download-Upgradeable-Packages "1";
APT::Periodic::AutocleanInterval "7";
APT::Periodic::Unattended-Upgrade "1";' > /etc/apt/apt.conf.d/20auto-upgrades
chmod 644 /etc/apt/apt.conf.d/20auto-upgrades
chown root:root /etc/apt/apt.conf.d/20auto-upgrades

systemctl enable unattended-upgrades
systemctl start unattended-upgrades
```

Validate that the service is running:

```
systemctl status unattended-upgrades
```

You should see `active (running)` in the output. Verify the automatic upgrade configuration is recognized:

```
apt-config dump APT::Periodic::Unattended-Upgrade
```

This should return `APT::Periodic::Unattended-Upgrade "1";` confirming automatic upgrades are enabled.

### Enable System Statistics

The `sysstat` package collects system performance and activity data, providing valuable metrics for monitoring CPU, memory, disk I/O, and network usage over time. Enable the service:

{% command %}
systemctl enable sysstat
systemctl start sysstat
{% endcommand %}

Configure sysstat to retain 28 days of history instead of the default 7 days:

```
sed -i 's/^HISTORY=.*/HISTORY=28/' /etc/sysstat/sysstat
```

Verify the configuration change:

```
grep HISTORY /etc/sysstat/sysstat
```

This should return `HISTORY=28`.

### Install Podman

Podman is a container engine and an alternative to Docker. Install the required packages.

{% command %}
apt install podman passt uidmap dbus-user-session systemd-container
{% endcommand %}

Configure subordinate user and group ID ranges for the application user to enable rootless container operation:

```
usermod --add-subuids 100000-165535 "$APP_USER"
usermod --add-subgids 100000-165535 "$APP_USER"
```

Enable lingering for the application user. This allows this users systemd manager to be spawned at boot time and keep running after this user has logged out.

{% command %}
loginctl enable-linger "$APP_USER"
{% endcommand %}

Allow rootless Podman to bind to privileged ports below 1024:

{% command %}
echo "# Allow rootless Podman to bind to privileged ports (< 1024)
net.ipv4.ip_unprivileged_port_start=80" > /etc/sysctl.d/99-podman.conf
sysctl --system
{% endcommand %}

Create the Podman storage configuration for the application user:

```
mkdir -p "/home/$APP_USER/.config/containers"
mkdir -p "/home/$APP_USER/.local/share/containers/storage"
chmod 755 "/home/$APP_USER/.config/containers"
APP_USER_UID=$(id -u "$APP_USER")
echo "[storage]
driver = \"overlay\"
runroot = \"/run/user/$APP_USER_UID/containers\"
graphroot = \"\$HOME/.local/share/containers/storage\"" > "/home/$APP_USER/.config/containers/storage.conf"
chmod 644 "/home/$APP_USER/.config/containers/storage.conf"
chown -R "$APP_USER:$APP_USER" "/home/$APP_USER/.config"
chown -R "$APP_USER:$APP_USER" "/home/$APP_USER/.local"
```

Validate the Podman installation by running a test container as the application user. Use `machinectl` to start a login shell as the application user with proper systemd user session initialization.

{% command %}
machinectl shell "$APP_USER@"
{% endcommand %}

Run a `hello-world` container to ensure Podman is working.

{% command %}
podman run --rm hello-world
{% endcommand %}

If successful, you should see a welcome message from the container. Exit the application user's shell.

{% command %}
exit
{% endcommand %}

### Post Installation Tasks

With the server configuration complete, a reboot ensures all changes take effect cleanly. After rebooting, reconnect using the newly configured admin user and SSH port. With the admin user established, it's time to audit and clean up any provisioning users (like `debian`) that may have been created by the cloud provider, and ensure the `root` account doesn't contain any SSH keys that would allow direct access.

Reboot the server:

{% command %}
reboot
{% endcommand %}

After the server comes back online, reconnect using the admin user on the new SSH port. These variables won't be set
in your host. Replace them with the correct values.

{% command %}
ssh -p $SSH_PORT $ADMIN_USER@1.2.3.4
{% endcommand %}


Once connected, check for other interactive users with login shells that can be deleted:

{% command %}
sudo grep -E '/bin/(bash|sh|fish|zsh)' /etc/passwd
{% endcommand %}


If you see any provisioning users like `debian` that are no longer needed, remove them:

{% command %}
sudo userdel -r debian
{% endcommand %}


Finally, ensure the `root` account doesn't contain any SSH keys in its authorized keys file:

{% command %}
sudo rm /root/.ssh/authorized_keys
{% endcommand %}

