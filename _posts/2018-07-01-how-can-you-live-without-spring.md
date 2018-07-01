---
layout: post
title:  "Should you replace Spring framework with libraries today?"
date:   2018-01-26 13:37:10 +0200 
image:  /assets/krtek.jpg
seo_description: "Confitura 2018 - Maciej Próchniak's talk review"
categories: working
---
![Krtek]({{ site.url }}/assets/krtek.jpg)

Spring is not the only solution for building web-based applications. There are few
alternatives to functions it's delivering.

Spring is a heart of many web (but not only) projects. Most programmers
are like "start.spring.io is the only place where I kick off every project".
Telling them they could work without it will end up with bruises and a loose
tooth.

But it's not about why Spring is wrong. Is there any alternative to it? Why we
love it so much that nothing is good enough to use? [Maciej Próchniak][1]
presented yesterday at Confitura conference few alternatives to the most used
framework in the Web world. It is not a surprise since Maciej is a big fan of
OSGi and he mentioned it multiple times in previous talks. I was really looking
forward to his talk this year and I wasn't disappointed at all.

<!-- more -->

I don't want to go through them. That was Maciej's job and he did it perfectly.
This is the thing I love about this uber-experienced guys: they know there is not
short answer and no ideal solution or tool in programming that can solve
everyone's problems.  My career was lucky enough to use things like GWT, Spark,
Felix, Jackrabbit/Oak and actually Spring was not the only thing I could use in
projects. These alternatives mostly are quite familiar, so after each Maciej's
slide I was smiling more and more and more... Personally, this was the best
tech talk on Confitura this year (with [Wojciech Seliga][2] and [Jakub
Nabrdalik][3] in different categories). I am always happy when people are
proposing alternatives that are reducing programming by coincidence or
cargo-cult.

Anyway, Maciej split Spring into few areas (I am a big fan of saying "functions"):

- persistence
- dependency injection
- web server
- health checks
- security
- transactions

I agree that these are the most important parts for most programmers.

Personally, I don't believe that dependency injection is something that every
projects needs (are constructors not enough?). If setting up dependency injection
or making classes injectable through it is the first things to do in your project,
that is simply wrong. Focus on real function of your application is the only thing
you should spend your time on.

My top-favourite was using JDBC instead of the persistence layer. Seriously, why to
use JPA or other Spring-Data module for just a few queries? BTW - probably you
are doing them wrong.  In the age of event sourcing and things like "understand
your r/w" Repository pattern is so popular and applications are sophisticated
enough you don't need `getAllObjects()` method. Counting size from it is not 
the best way to do as well. People are like "well but I don't have to write these
bloody SQL queries anymore!". Normally I would agree but I have seen how many times
the persistence layer made trivial database scheme so complex and hard to debug,
I would do the table flip and get back to learn SQL once again.

The other important take away is not that enthusiastic: you need to use popular
libs for security and transactions. No doubts. I haven't seen people that are
implementing transactions once again. This would be the terrible picture: flying
"fucks" around and begging all the gods for a stroke. Yes, you don't want to do
this at home.

I wasn't always convinced to any approach more than 1 day: should you reuse as
much as possible even in the cost of making more complex solution than the problem is?
Or maybe you should write everything from scratch and control your entire
codebase because you are the brightest one and no one will tell you what to do.
I haven't seen any project that was using purely one approach after few months of
iteration so there is not even anecdotal evidence it's working well in some case.

Non-functional (i.e. not working, trolololo) requirements should drive this
kind of decision: what's the frequency of making new releases, how quick is
a response for a change, what's the level of security and so on. Also, the
existing state is the important thing and removing Spring today maybe would not be
the best idea especially there is no business reason to do so (see my post
about [how developers are spoiling projects]({% post_url
2017-09-04-how-devs-are-spoiling-your-project %})).

I think Maciej's presentation purpose was to show alternatives to use things
like OSGi, Java-around standards (JPA, JTA, Servlet 3.0) rather than focusing
on one delivered framework. If you are working with a really long-time project
(like I am working with Jira now) this is not appropriate for us, but maybe it
would be worth considering when yet bootstrapping brand-new project with a
fancy Spring Boot dependency. 

On the other hand: do we really need a bazooka to kill some mosquito?

[1]: https://twitter.com/mpproch
[2]: https://twitter.com/wseliga
[3]: https://twitter.com/jnabrdalik
