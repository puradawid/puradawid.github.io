---
layout: post
title:  "Confitura 2019 - was it worth spending the whole Saturday?"
date:   2019-06-30 15:00:00 +0200
image:  /assets/confitura_2019/welcome.jpg
seo_description: Confitura 2019 review with Jakub Nabrdalik's and Jaroslaw Ratajski's talks
categories: working
---

![Confitura logo on balloon inside the Expo XII hall](/assets/confitura_2019/welcome.jpg)

> I hope it's worth going there, Dawid.

[Kociamadka][kociamadka] said to me when we were getting up around 5 o'clock, 3-4 hours before Confitura's Grand Opening. That's not the best time to wake up, wash up your arse, make a quick coffee and run for the train - which we barely catch up, by the way.

> Yeah it's going to be fun, love.

To be honest, I was not 100% sure. A few people were like: "yeah, it's not going to be as nice as it was years before", " you can watch it later on at YouTube", etc. That's true without any doubts - I mean, compared to the world-class conferences it's quite local, without major contributors to our Programming World, etc. At the end of the day, it's not a gig when one is paying a monthly salary to get there. Conferences, especially in Poland, recently made a big step forward in being "fucking big gigs".

<!-- more -->

But guess what? No. Fuck it. It's not that simple. Confitura is the place where this whole professional transition, from "code monkeys" to "business-wise engineers" started in Java world (and JVM, in general, later on). The conference is still keeping the old-fashioned rules - you are not paying for it (you do, but this money is not transferred to [Lenart][lenart]'s account for God's sake, it's a donation to charity) and here's a place to almost anyone to speak up - with Polish language, if you can :). I couldn't attend there for a few years, so that was quite refreshing I was going planning to go there this time!

So, we kept up our good mood, got registered (the idea with paper-less QR codes is very admirable), being quite late we went to the Tomek Kucharski's keynote (going through the history of software development industry), took another coffee and... started Confitura for real.

#### [Jakub Nabrdalik][jnabrdalik] - Common mistakes when moving to microservices & cloud

!["Enterprise Architect job description is high-level bullshit says Jakub Nabrdalik"](/assets/confitura_2019/jakub_nabrdalik.jpg)

I was expecting two things: a good joke before the presentation, like it happened at [the one about Java modularity][jnabrdalik_1], and quite different speech about how the microservices are maintained, deployed, documented, etc. Both didn't happen: there was nothing to joke about (apart from suggesting that he never finishes earlier) and the presentation was much more serious than just implementation details. I really did appreciate these twists, Kuba!

Right, so what can go wrong with shifting to microservices? The architecture, of course! Are you doing it the right way in the first place? How can you tell? What's the approach if you are going to have multiple architects or VLSO (Very Large Scale of Organisation, I just made that acronym up but it looks professional)?

The key takeaways are:
- get rid of Enterprise Architect, now
- Conway's law applies, so brace yourself - you have to know your company structure
- make the architectural process company-wide by RFC
- write recommendations, no orders
- read a book about [Software Architecture for Software Developers][jnabrdalik_safd]

What I was missing (maybe literally I missed that, considering that 5 o'clock wake up) though - that not every company needs to take a microservices shift,  as architecture comes from organisation, not the other way around. Maybe that was too obvious but still, we can observe companies failing to do so because of many reasons, including "it turns out we don't need microservices" phrase.

#### [Jarosław Ratajski][jratajski] - Spring, Jakarta EE, CDI and other abominations

!["Annotation magic is GOTO of the modern programming industry"](/assets/confitura_2019/jaroslaw_ratajski.jpg)

> Does this guy hate Spring? - [Kociamadka][kociamadka] asked me right before the presentation - how come engineers hate tools?

> Good question! Gimme a popcorn now.

If someone remembers [my reaction on Maciej Próchniak's talk year ago][mprochniak_1], will recall this conversation about "do you really need dependency injection?". Here's the quote anyway:

> Personally, I don’t believe that dependency injection is something that every projects needs (are constructors not enough?). If setting up dependency injection or making classes injectable through it are the very first things to do in your project, it is simply the wrong approach. Focus on a real function of your application is the only thing you should spend your time on.

So now, Jarek, as opposed to [Maciej][mprochniak] last year, was showing up problems with annotation-based dependency injection, ORM, transactions and aspects in general. So the bottom line was:

> Annotation-based magic, like @Inject or @Transactional, are GOTO statements of modern software engineering.

Fucking hell, they are! He went through all examples I could think about, showing up the problems with the current "magic" that we, lazy engineers, are using in order to cut corners and get all stuff "working" (however, we don't know why it's working, but hey - business people will never ask that!). He took even transactions example which I was considering less harmful, but it turns out I was totally wrong :).

So, the key takeaways are, as follows:
- the usage of annotations and that kind of shortcuts come from servlets and the old days of Java (I have a feeling that filters are actually more harmful)
- you don't have a deep knowledge about how Spring is working (statistically) so don't use it
- your entire team is using it wrong (again, statistically)
- why are you using IoC container in a first place? Can't you just replace it with well-designed constructors?
- ORM? Come on - especially when you do `save()` method for an update
- transactions? When nested, they can be quite unpredictable if you don't understand them
- use libraries over frameworks

From my perspective I would add: we engineers tend to fix technical problems - so we love doing things like setting up Spring container, solving ORM problems, because the most of the time we have an only superficial understanding of the domain we are working for, so it looks dull and we are looking for distractions. Nevertheless, all problems can be solved with a finite number of abstractions - like ORM, dependency injections, etc - which are solving problems that are coming from bad solution design in the first place. Here we are :).

That was a very refreshing talk, especially because Tomek is full of charisma (as well as Kuba) and fun, so he didn't let anyone get bored. I admit, this topic is very hard and it can be rejected by the audience (people can spend most of their lives working with Spring beans, services and controllers) - and yet he put very, very good arguments - so well done!

#### Wrap up

It was a good time, definitely worth spending the whole Saturday! I think everyone found something interesting and inspiring during this edition. Many thanks to all people that were organising the event, for being constant in values and form of Confitura represents and doing a very decent job to get all us back together every year!

Looking forward to the next edition!

[kociamadka]: https://kociamadka.pl
[jnabrdalik_1]: https://www.youtube.com/watch?v=ILBX9fa9aJo&t=
[jnabrdalik]: https://twitter.com/jnabrdalik
[jnabrdalik_safd]: https://softwarearchitecturefordevelopers.com/
[jratajski]: https://twitter.com/jarek000000
[mprochniak_1]: {% post_url 2018-07-01-how-can-you-live-without-spring %}
[mprochniak]: https://twitter.com/mpproch
[lenart]: https://twitter.com/lukaszlenart

