---
layout: post
title:  "Accessible Clamp.js fork"
date:   2019-09-22 08:00:00 +0200
image: /assets/clamp/clamp.png
seo_description: Fork of Clamp.js that supports accessible screen readers experience
categories: javascript
---

![Accessible Clamp.js](/assets/clamp/clamp.png)

[Clamp.js](https://github.com/josephschmitt/Clamp.js/) has just one purpose: it monitors a container. If text inside doesn't fit into it, the overflowing part of the text is replaced with ellipsis. Simple, right? It supports only block containers, because of its dependency on `clientHeight` property. The library is very useful, especially when content suddenly overflows from the design that has been done and signed-off months ago. In a such situation, it's very hard to step back. At this point, it's engineer's responsibility to support that ugly corner case.

This is the very good piece of code I used before - it is 9 years old already! Moreover, it supports browsers which do not support the native `line-clamp` (AKA `-webkit-line-clamp`) CSS feature.

In the 21st century, when accessibility is quite important, developers are asking different questions that 9 years ago. How does Clamp.js work with various devices, especially screen readers? Do they read the entire text or just the clamped one? Is it safe to use in WCAG compliant websites?

<!-- more -->

## How does it work?

At the very first step, function checks if monitored container has more lines of text than declared in function. If it's fine, it stops right there. Otherwise, clamping comes into action!

The entire clamping process is based on an experiment: it splits container's text into chunks. It uses separator list which is provided by parameter or default, from the most general (dots - sentences, commas, etc.) to the very specific one (`''` - it gives list of single characters). Then, it removes the last chunk, adds ellipsis and additional HTML text if provided and checks if such content fits into specified line restriction.

If the text still doesn't fit, it tries another separator and removes the last chunks iteratively. Figuratively speaking, it is doing the experiment in browser runtime, but don't worry - it is invisible for modern browsers (unless `animate` option is `true`, then every iteration is paused for 10ms which looks like wrapping text animation).

## The difference between Clamp.js and `text-overflow: hidden`

Here's the problem: the function removes the entire text beyond the ellipsis. It returns the `originalText` property as part of the `$clamp` function result, but that makes the entire operation just a bit more revertable. Additionally, it *doesn't support another nodes inside of the target element*. The broadly-used `text-overflow: ellipsis` property is not working in the same way, as screen reader is still able to *read* the hidden text.

## How Clamp.js can work

In screen reader usage case, markup can have some portion of text invisible for screen readers (as long as these elements are not actionable items, like buttons or links!). They are also able to do the other way around: make some text visible only for screen readers (without actionable elements, of course). 

Therefore, let's consider that original text:

```
<p>This is the way too long text that has to take only 2 lines instead of milion</p>
```

and the clamped one with Clamp.js:

```
<p>This is the way too long text that has…</p>
```

It doesn't contain the same information as the previous one. However, the screen reader is absolutely fine with the markup below:

```
<p>This is the way too long text that has<span aria-disabled="true">…</span><span class="srt"> to take only 2 lines instead of milion</span></p>
```

Keep in mind that `srt` class has CSS definition like: 

```
.srt {
  border: 0;
  clip: rect(0 0 0 0);
  height: 1px;
  margin: -1px;
  overflow: hidden;
  padding: 0;
  position: absolute;
  width: 1px;
}
```

I have prepared [a fork of Clamp.js library](https://github.com/puradawid/clamp-js-main). I am looking forward for your feedback, another forks, improvements. I appreciate any help with the project. 

[The original Joe Smchmitt's post about Clamp.js](https://joe.sh/clamp-js) explains the implementation a bit deeper, I recommend you to read it! And if you don't care about accessibility (you shouldn't unless you are doing some very internal work) it's definitely better to use [the most currently supported fork of the library](https://github.com/jmenglis/clamp-js-main) created by Josh English - by the way, Josh -  thanks for maintaining the repository!

## Limitations and controversy

There is one, but very important, limitation: it's just wrong. Website should be designed in a way which is not limiting text size in any way. If some text doesn't fit in app's design, the problem root problem is the design itself, and content glitch is just the symptom. Sharing information is the very basic feature of the entire Web development. We, as website developers, should keep the information clean and accessible for everyone, but also try to keep the value and form of good looking pages. 

Here's a good heuristic: use `Clamp.js` only if you tried to change the design in a first place. Later on, when the time will come and it will be possible to rebuild website, just remove the library. Sooner the better, believe me.
