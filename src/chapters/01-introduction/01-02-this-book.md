---
layout: layouts/chapter.njk
title: Reading this Book
description: How to read and understand the layout of this book
chapter: introduction
chapterNumber: 1
sectionNumber: 2
---

## Typography

This book uses some consistent text elements to draw attention to notable content and distinguish input from output. It is important to get familiar with the concepts below.

### Shell Commands

Shell commands appear in a code block with a title in the top left indicating they are to be run on a system. Like this:

{% command %}
echo "Hello, world!"
{% endcommand %}

Not every command may be run on the server. You may need to execute an `ssh` or `curl` command from your local machine. Chapter context will make it clear where you need to execute the command but there will not be a visual difference.

### File Editing

File content appears in a box similar to shell commands. The difference is that the title of the box is the file path, styled as lowercase mono-space font.

The surrounding chapter context will make it clear how you must manipulate the file. It may say something like the following, telling you to replace the content in full:

_"Replace the entire content of the `hello.txt` file with the following content"_

{% codefile "/tmp/greeting.txt" %}
Hello, world!
{% endcodefile %}

It may also tell you to edit the file, keeping in mind to replace some variables:

_"Edit the `security_file` to include your user"_


{% codefile "/etc/security_file" %}
PermittedUsers admin, $YOUR_USER # Replace $YOUR_USER with your user
{% endcodefile %}

Or maybe even highlighting that only a subsection of the content must be edited:

_"Navigate to the HorizontalScaleConfigurer stanza and add the name of your service"_

{% codefile "/var/service_config.yaml" %}
HorizontalScaleConfigurer:
 - existing-service
 - new-service # Add your new service
{% endcodefile %}

Similar to the shell commands, it should be obvious what is required to be done.