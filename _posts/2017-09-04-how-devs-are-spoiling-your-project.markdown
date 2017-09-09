---
layout: post
title:  "How software engineers are spoiling your project?"
date:   2017-09-04 13:37:10 +0200
image:  /assets/man.jpg
excerpt: Software engineers tend to put technical tasks into backlog. What problems it is causing and how to get rid of them?
categories: craftsmanship scrum
---
![Happy developer sitting in front of a computer]({{ site.url }}/assets/man.jpg)

This post might be as redundant as same problem. Don't blame me. From my point of view this needs to be explained once more.

# Before start - make assumptions

1. The Project is driven by the Business for making money (it is not library, backend service nor support documentation project neither[^docpeople]). All thing has to be based on a reliable feedback and goal in a near future. No *RnD* or *experimental* projects are included.
2. It has to happen inside of a big corporation. Small companies and startups (surprise!) are usually not mature enough to have a designated manager who drives entire end-to-end product. Developers have there too much impact on what has to be done. Those assumptions will lead us in a moment to a place where no one wants to be - and it is not writing IE6 compatible single page application in 2017[^devie6hell]. Simply said, Product Owner is not a technical person.
3. Project or, let's say, agile team (bleh!) have a backlog. Or the Backlog - you name it. If Scrum is implemented properly, that is a list of user stories. Pretty simple, isn't it?

Ultimately it has to be just another boring project that everyone has done already somewhere else.

# Why it is getting messy?

I believe every team has to drive project with some kind of plan. It can be split into smaller chunks of work. Reordered. Improved. Using that set of items any team member can imagine which needs product will cover in a future. Anyone is seeing goal all the time. It can be printed out. It can be explained to anyone. Brilliant! Those people that are funding this misery can understand what is the purpose and how complex it is. They will be happy.

*But it is not true anymore*. Developers put there:

* Refactor XYZ class.
* Use YZX framework instead of YZX.
* Change ZYX protocol to XZY.

> Just one combination of X, Y and Z left me. I must be careful.

Alright then, so how that poor guy should order that? How important is it? What will you tell him? How do you explain the value between each task? Last, but not least: **why do you bother him in a first place?**

I have seen that type of projects falling this way. I have heard about ten times more. This model of cooperation is always starting really well. Developers can explain each task - why it is important and how much time it will take. Product Owner expects that. Team expects Product Owner's ability to assign priority. He has to set a place for it in perfectly ordered backlog (or the Backlog). It is not gonna happen. Both sides are terribly wrong.

It is quite easy to imagine developers changing framework they are using (or library) because of some reason. It is happening very often, especially when new people are joining (and they are seniors) or after some conference they attend. Or all existing team was fired. How Product Owner can tell it is right? He need to trust team, but team left him the responsibility without full reason.

Once again, it seems to be trivial for one small *thing* in backlog, right? Multiple ten times. You are in chaos. Make it perpetual. Now it makes backlog useless. Just throw it into a bin. Project is falling down.

I used to have a notebook. I was writing there a lot of things about my current things. I was reading it each day. Unfortunately there was a time when stopped. From that moment notebook started to be *useless* - I couldn't rely on it anymore. Exactly the same thing is happening to dirty backlog - it doesn't have any real value. Maybe there is a need to still maintain it, but it is a pure bureaucracy since items are not understandable to everyone.  

# The Conclusion

There is a really simple solution. Put those things away from backlog.

How to do it? It can be done many ways (really), but I will propose something that worked for me:
* stop putting technical tasks into product backlog immediately. It looks like a rule of thumb but believe me, you will save your project.
    if there is something that has to be done before some user stories, just make it then. Include technical task into user story. Re-estimate other stories later if necessary.
* implement The Boy Scout Rule in daily work - it will remove need for separated refactoring. Just leave it to individuals. Do not blame people for delivering slower because they are making code clearer, faster, better. It is a good rule, you won't regret it. You can even extend it: finder has to fix it instead of complain it - no exceptions.
* need to change framework? Fine, but don't put it into backlog at all. Team needs to agree on special exception for taking calls from developers. If they need to do something technical, they are doing it in the next sprint immediately and they are capable to deliver less from backlog than normally. Sounds risky, right? This one is really serious. It moves all responsibility to developers. Now there is a balance, right? Maybe no one needs actually this new framework or it is really vital to the project and every single person will take that risk to improve product - who knows...

I am not saying that it will fit into any company that are taking scrum-ish or agile-ish approach, but what I need to ask you is to:

> **Review your goddamn backlog, please!** 

Or you will struggle with explaining why using [React][react] is better than having [Angular][angular][^madethisup].

[^docpeople]: Gotcha, I remember you, people-stealing-money-from-company-with-writing-useless-docs!
[^devie6hell]: I wish I just made this up!
[^madethisup]: Fortunately, I made this one up.

[react]: https://github.com/facebook/react
[angular]: https://github.com/angular/angular
