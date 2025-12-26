---
layout: layouts/chapter.njk
title: Introduction & Principles
description: Core principles that guide my approach to server management
chapter: introduction
chapterNumber: 1
sectionNumber: 1
---

Welcome! This guide is first and foremost a document for myself to capture what I know about running and managing servers. It is used to document my personal architecture, setup, hardening, and ongoing maintenance procedures for hobby servers. I am publishing this for myself and do not make claims that this is the "best" way to do any of the tasks contained herein (but I am open to feedback if you really disagree with something!). 

The steps in this book are intended to be manually executed. I've experimented with a variety of automation tools to provision new servers (ansible, bash scripts, cloud-init, etc), and while they certainly are _neat_, they don't bring me enough value. Setting up a new server manually takes ~30 minutes if you're decent on the command line (a skill which setting up the server helps improve!) and I have found little to match the familiarity you build with your infrastructure when you configure it manually.

I think of it like a construction project. If you were to do a small to medium sized home renovation, it's likely worth learning the skills to do much of the work yourself. You save money, learn new things, and know exactly what's going on behind the walls. If you outsource the work, you declare the end state you wish to receive and the builder (automation tool in this analogy) makes it so. While this works great for large projects, for small endeavours the overhead of managing the builder, communicating requirements, and trusting work you didn't see happen can outweigh the time saved. Similarly, declarative automation tools require investment in learning their syntax and maintaining their configurations — time that may exceed the manual work they replace, especially when you only provision a server once every few years.

This philosophy works where ultimately the stakes and volume of work are low. If I had to run a business to support my livelihood, or provision tens to hundreds of servers, I would undoubtedly reach for an alternative. 

For personal-use servers, it's great.