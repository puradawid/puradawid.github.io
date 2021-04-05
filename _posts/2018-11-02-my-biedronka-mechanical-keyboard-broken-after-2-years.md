---
layout: post
title: "The Poor Programmer #1: cheap Biedronka mechanical keyboard broke down after 2 years"
date: 2018-11-05 13:37:10 +0200 
image: /assets/keyboard.jpg
seo_description: "Hykker X Range keyboard from Biedronka broke after 2 years. Here is how to fix it."
categories: remote_tools
---

![Keyboard](/assets/keyboard.jpg)

I got a brand new Hykker X Range keyboard as a gift. Its *click* and *clack* sounds are nice. It turns out that I love mechanical keyboards and won't replace my Hykker X Range for any non-mechanical keyboard, especially for typing shitload of code and full of hate emails.

This two years period was really great, especially it helped me a lot with my wrist pain. My fingers weren't swollen after 8 hours of working anymore which was a significant accomplishment.

Now, after two years of *click* and *clacks* which can rise from the dead, it's broken. The space key is not working at all. Few others, like tilde, are hanging up sometimes and then I need to push them harder. I thought this is just a human feature, but it looks like pushing harder applies to switches as well. 

Because of my laziness, I haven't considered buying the second keyboard so far, especially this model isn't longer [available in Biedronka][hykker-biedronka]. Primal soldering skill woke up inside me and told me I need to fix the keyboard on my own. 

<!-- more --> 

## What's wrong?

I took off the back cover which required screwing off few front screws. It turns out that the USB cable is attached to PCB by 4-pin plug. Plug helps to test keyboard without the back cover, it would be much harder with soldered cable.

I was worried the problem is related with broken tracks on PCB. It would be a nightmare if I have to look for every single break. Luckily for me, the PCB is fine and just specific switches are broken. I tested them by pushing and checking with outcome on the terminal which was savage but effective enough. Broken parts were marked with... blue, permanent marker. Clever, huh?

## Remove bad parts.

I had to desolder them (there are just 2 pins for each) and remove from board.

![Keyboard disassembled]({{ site.url }}/assets/keyboard_disassembled.jpg)

I have tried to fix the switch directly - because of the construction, it's simply two pieces of copper-like metal pushed by the key part (the blue one). It helped for a while, but after several clicks they started to hang up again. My time isn't worth to fixing them in next few weeks.

## Order new ones.

There are plenty of switches out there. Especially the Aliexpress. I have ordered around 20 switches which costs me $10, including shipping. Not a big deal but it is going to raise the keyboard value by 40%. 

![Keyboard switch]({{ site.url }}/assets/keyboard_switch.jpg)

I am waiting for the delivery, probably will receive it after the next week. Will let you know how the soldering and rest of the assembly stuff will go on.

Stay tuned!

[hykker-biedronka]: http://www.biedronka.pl/pl/product,id,31430,name,klawiatura-mechaniczna-hykker-x-range
