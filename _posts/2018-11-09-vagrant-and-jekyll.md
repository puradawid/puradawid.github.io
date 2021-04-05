---
layout: post
title: "Jekyll on Vagrant"
date: 2018-11-13 13:37:10 +0200 
image: /assets/jekyll-on-vagrant-small.png
seo_description: "Vagrant image for Jekyll development"
categories: blogging
---

![Jekyll on Vagrant](/assets/jekyll-on-vagrant-small.png)

Writing this blog is time-boxed due to my actual work. It's around 20-30 minutes a day. Yet the outcome satisfies me, at least in terms of my learn-how-to-write progress.

That's why I hate problems with tools. Recently, this laptop didn't leave my home through the window because one of my cats likes to sleep on it. Ubuntu 18.04 upgrade took Jekyll and other Ruby-based apps down for a long while. Googling, investigating and fixing the problem took me the whole time which I should spend on writing another blog post (about my first Kata exercise notes). Jekyll server wasn't working so previewing the blog as well. I was getting mad and I asked myself "why I am not able to fix that problem for ever? How come I am not able to isolate the Jekyll service from my laptop's issues?". The answer was hidden in the question.

<!-- more -->

### The answer is...

Isolation. I wrote a simple Vagrant script to run Jekyll on a virtual machine. Provisioning meant to be based on relatively trivial actions: install needed packages and run the server. However, as it turned out, it is never that simple! 

The command `jekyll s` is working perfectly on local machine. However, it looks like users are not taking the serve command too seriously. I have never ran this on production server at all - why do even bother? Apache is quite more stable and popular to use. Jekyll `serve` stars with listening on, surprise, surprise, `127.0.0.1` - it denies calls from other hosts. Changing the `--host` parameter to `0.0.0.0` [breaks image URLs][1] especially when the port is forwarded to other machine.

Well, there was a solution in my head. I had to use some HTTP server and continuous build of Jekyll's repository as a separated processes. Having two services in Vagrant is pretty easy task to do, which wouldn't be that easy in docker. Provisioning script is extended with installing http-server from node package (including the npm and nodejs).It serves content from the `_site` folder. 

It works well. I am not worried about the machine upgrade now. I could throw this piece of silicon out and buy a new one. Who knows?

I put [the script on GitHub][2], where you can fork and use it for your Jekyll blog posting. Hope you enjoy it!

[1]: https://stackoverflow.com/questions/16608466/connect-to-a-locally-built-jekyll-server-using-mobile-devices-in-the-lan#comment86327520_16608698
[2]: https://github.com/puradawid/jekyll-vagrant
