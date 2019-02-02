---
layout: post
title:  "The Stupid Code - why people before you wrote it?"
date:   2019-02-02 08:00:00 +0200
image:  /assets/angry_geek.jpg
seo_description: Explanation why software engineers are judging legacy code as stupid. 
categories: working
---

![Pissed off geek](/assets/angry_geek.jpg)

Meet Andrew - a software engineer. He is doing a lot of software engineering crap. Everyone likes him. He was a rockstar here and there. Recently, he took over the old project some other people abroad were working on for a few years. Everyone was saying that this project is a nightmare and people were quitting job because of it, but not Andrew. He was the right guy here.

--- Shite, how shitty is this shitty code?! So much, so much, nananana - he was silently singing all the time reading that code. His behaviour wasn't impressive, but people kept thinking he is a genius. Every weirdo has to be one. Unless not. Anyway, he hated that code, which had many nested ifs, not enough code coverage and, which was the worst thing in the Universe, integration tests that took ages every single time someone tried to run it.

Once he asked his manager to throw away the codebase. He would re-write it again. It would be better, shiny code that he and everyone else will understand. No doubts to it. His superior agreed, considering Andrew's fame in the office, to get rid of the entire codebase and re-do the analysis phase, apparently missed or done in two minutes.

That was the moment everything was getting so funny and scary.

<!-- more -->

Andrew started to work with the best people he could hire. They were doing nice job - setting up an automatic formatter, CI, endless AWS containers. It took lot of time. The budget ran away very fast. Nothing has left. Surprisingly, they managed to deliver the entire project, however with the same result as their unknown ancestors. It was the next *shite* in this company. Is there any way to hide the failure?

--- Right, so here is the better version of our project - Andrew said. He knew that it's a total BS. He couldn't tell these people it like that.

--- What did you do better this time? - asked random manager.

--- I'm glad you're asking. There are many metrics we improved: code coverage, build time, etc.

--- Have you improved the *code readability*? I remember you mostly complained about it.

--- Stubborn fucker! - Andrew meant to say that but he didn't - Yes of course, it's more readable for us now, every team member can confirm it!

That's always true. Every single programmer can read his own code, because the necessary context is already in her/his mind. However, if there is no significant context or domain knowledge, code becomes unreadable, but that's a cognitive bias. **Tl;dr; if you think code you read 15 minutes ago is stupid, it's not the code but you**.

We don't know what happened in Andrew's head when he asked for rewriting the project. The most probable explanation is that he has many issues with handling this code in a first place. His overall impression was "this is fucking stupid", his anger got in a position and he decided to fight with that complex and stupid thing. Emotions were taking the wheel, even in our software engineering world.

We also think about ourselves "better than others". Sure, that's what your ego is for. But the entire population's software engineering skill quality has a normal distribution. The same is with being driver: *I am better driver than other 80%*. Well, it is another [cognitive bias][2]. Surprised?

### Cognitive biases

Do you think you are better and these conditions don't impact you? Well, read [this list][1] first. I found few examples my behaviour sometimes applied to, but hey, I am always right, no? I can't even count how many times I stand for some opinion just because it was mine in a first place.

I know it's overwhelming, but hey, your brain will shortly ignore this anyway.

If you are the brightest engineer on Earth though, you probably are thinking now how to put some system in place in order to judge things independently of your ego. Well, you could think about one but it's [another bias][3] anyway. Dead end. Oops.

I am fighting with this problem as well. I am the best one, did I mention that? Anyway, so my idea is to **delay by a day** all important decisions. It sounds simple no? It's getting even better if I wrote down all pros and cons and get back to them later. Mind that you today aren't you tomorrow. You can't fight with yourself right now, because this doesn't make sense and makes cortisol. Tomorrow, that guy would be a stranger for you. I promise.

### How to tell other people they shouldn't judge.

If you can control yourself, how to control other people's biases? Well, you could give them this page to read. If it helps, that's awesome.

There are actual techniques as well. You can delay other's decisions by writing them down, taking them up the next day and standing up for them as they are yours. Other people's lizard brain will try to challenge them, because it's not possessed anymore.

The brightest of you probably have better solutions or techniques, I honestly would love to hear about them.

### How to fix stupid code then?

Here's my the simplest checklist I used to do while "reading" or trying to maintenance "stupid" code:

* Read the code from whatever point you want to.
* Feel endorphins shot because you're so smart and this code is not. 
* Take a break.
* Go through the code again. This time highlight all ridiculous things.
* Force yourself to ask a question: what could happen if **I** would write such code?
* Look for domain advice, if you have a chance.
* Refactor things you think they are actually silly.

This approach has a downside: it's hard to apply for architectural decisions. This is something that has to be sorted out on higher abstraction level, but with going deep into details.

Anyway: **removing the stupid code and writing it from scratch should be decided carefully**. I made that mistake once and I won't let it happen again. Removing existing code is removing the knowledge and experience people before you had. Unless you are doing something else that these people did, it's always a bad decision. 

[1]: https://en.wikipedia.org/wiki/List_of_cognitive_biases
[2]: https://en.wikipedia.org/wiki/Illusory_superiority
[3]: https://en.wikipedia.org/wiki/Automation_bias
