---
layout: layouts/chapter.njk
title: Reading this Book
description: How to read and understand the layout of this book
chapter: introduction
chapterNumber: 1
sectionNumber: 2
---

## Typography

This book uses consistent text elements to draw attention to notable content and distinguish input from output. They also just look great. Take a moment to familiarize yourself with the following flourishes you'll see throughout the book.

### Shell Commands

Shell commands appear in a code block with a title in the top left indicating they are to be run. They appear like this:

{% command %}
echo "Hello, world!"
{% endcommand %}

There's a button you can use to copy the command to your clipboard, if you have JavaScript enabled.

### File Editing

File content appears in a box similar to shell commands. The difference is that the title of the box is the file path, styled as lowercase monospace font. This box type also has a copy button.

{% codefile "/tmp/greeting.txt" %}
Hello, world!
{% endcodefile %}

It will be clear if the file is meant to be replaced entirely, partially edited, or something else.

### Callouts

Callouts draw attention to important information. There are three types:

{% callout "warning", "Warning" %}
Warning callouts highlight security concerns or actions that could cause data loss if performed incorrectly.
{% endcallout %}

{% callout "info", "Note" %}
Info callouts provide additional context or clarify system requirements.
{% endcallout %}

{% callout "tip", "Pro Tip" %}
Tip callouts share best practices or shortcuts that experienced administrators use.
{% endcallout %}

### Sidenotes

Sidenotes contain any content that I felt didn't fit into a themed callout from above. They're flexible.

{% sidenote %}
Sidenotes provide supplementary information that is helpful but not essential to the main content.
{% endsidenote %}

{% sidenote "Historical Context" %}
Some sidenotes include a label to indicate their purpose.
{% endsidenote %}

### Key Takeaways

{% keytakeaway %}
Key takeaway boxes highlight the most important points from a section.
{% endkeytakeaway %}

### Pullquotes

{% pullquote %}
Pullquotes emphasize memorable statements or guiding principles. I don't use them much because they're a bit over the top.

\-The author
{% endpullquote %}

### Inline Highlights

When important terms or values appear within a sentence, they may be {% hl %}highlighted{% endhl %} to draw attention. This is used sparingly for {% hl %}critical configuration values{% endhl %} or key terminology.