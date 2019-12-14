---
layout: post
title:  "3 things to do to before crunch time will suck the life out of you"
date:   2019-12-14 08:00:00 +0200
image: /assets/depression/depressed-woman.jpg
seo_description: 3 action you can take to avoid crunch time in software project management.
categories: working
---

![Depression after go-live](/assets/depression/depressed-woman.jpg)

Overtime, exhaustion, internal pressure and suicidal thoughts - we all have been there. The project you're working on is "almost done" and you just need to fix up a few things. But at the very last moment it turns out that there are "another few" things to change. What can you do? Your website is going live in a month! That means you and your team is going to take an overtime and try to do all at once. You are in "crunch time" now. Could you do some activities in advance to avoid such situation?

<!-- more -->

### What is "crunch time"?

![Crunch time means working very hard and fast](/assets/depression/computers.png)

"Crunch time" comes from the gaming industry, the most hated and loved piece of software industry. When team is in "crunch mode" that means they are doing overtime or other activities for go-live. In fact, they are trying to meet the soonest deadline or improve application to the standard their users can accept. It isn't different in web app industry as well - we just don't call it that way. Anyway, the consequences are usually more work done - with a price of introducing some trivial bugs, todo list is getting bigger and bigger as there are urgent but undetected before items. Additionally, it turns out that audits or business reviews put a lot of pressure on things that weren't pointed out before even these people were reviewing the progress on a daily basis.

I was there recently for a while - that's why you haven't seen any new blog posts here. The project went life and the team did what we can in order to not miss the deadline. It was a crazy ride. Consequences are serious - because of depression and exhaustion, I can't write new blog posts, I cancelled my Convert Byte to Word podcast project, life doesn't make any sense anymore. Now, I am in a recovery mode and hopefully that blog post will be a good start for successes I need so desperately.

The good thing is I was able to retrospectively go through things that we have faced and I prepared a list of things to do before the project is going under "crunch time". I hope this knowledge will save someone's time and energy. The only thing I want to mention is the context - so these activities especially apply to web-app projects in complex organizations which have internal and external dependencies, release process and sign-off procedures before going live. I don't think the same actions could be taken for embedded systems or off-the-shelf merchandise.

The list was organised for doing top things earlier, as they will benefit more when done at the beginning of the project.

### #1 Deploy to production as soon as possible

![Deploy to production NOW!](/assets/depression/bombs.jpg)

Setting up production environment in day one is hard and expensive, but it's worth it. Stakeholders might suggest a concern that it's not something that you should do at the start of the project, but it's actually a thing that can save a lot of stakeholder's stress put in very long email chains. It's for their wellness. And yours.

There is no need to publish the website yet - but it's worth to keep all settings and code working, in the place everyone involved can easily enter and use. The key thing is to keep as smallest list of outstanding things as possible. Do often releases there - but treat that environment as the live one, so you can't just remove everything from there - that will train your releases skills and procedures. Even if your are part of the bigger product, you can merge the code and make it as a dark feature - it is still there but can't be used with current version. Making your product ready for such releases is a good step for canary releases in the future.

Do you have people that are involved in the project but not necessarily using it (managers, some consultants, maybe your scrum master)? Ask them to click through production - you can collect very interesting feedback and data from them. If you are doing demos that's great - but do it on production each time. Developers tend to do demos on their envs in order to be sure that "nothing can go wrong". You all need to fail fast - even if that means spectacular failure in front on 100 pairs of eyes. Don't be ashamed though - all of them want to see the best quality of your product working on production.

There are things to do before going live but you can't do it earlier? Make a list. Review it weekly. Check up which things are going to be missed, make plans if something won't work at the end of the project. Applying plan B is bad but having it in a first place is the best thing the team can do. Eventually, you want to do something if you will miss sub domain setup or SSL certs.

### #2 Bring your users to the table now

![Talk with your users](/assets/depression/talking-people.jpg)

Every software product has it's users. This inevitable fact brings us to the conclusion that you have to test your product with real users. You don't have them? Maybe you can do corridor testing sessions? The most important thing is to test your project against your assumptions. At the very beginning you don't need quantitative data but qualitative one. Does this interface make sense? Can user take the action before going through "comprehensive manual"?

If you have multiple business stakeholders or product owner - ask them do use your application. This will avoid the situation that "oh this doesn't make any sense" at the end of the project while doing the last reviews before go live. It's often hard to force this kind of people to use something that is not done yet - but it will benefit sooner than you think. At the very end of each demo ask your attendants to do the same on production instance. Seeing something (especially dull engineer showing the feature) doesn't mean doing the same thing.

Keep in mind that Product Owner testing won't cover the real user's perspective. It's very good to have PO's review but it's not enough. You need people from outside, which are not tightly related with application as well. They aren't requirements or directions providers but can point out things you haven't seen even they were there for a long, long time. You don't have to do whatever users say but observe them, their actions on and with product. That's not easy, it requires you brain, but it's beneficial in a long run.

### #3 Do audits on regular basis

![Audits are helpful](/assets/depression/inspection.jpg)

Is your company doing some audits or sign off before you can put things live? You don't think so? Well, if the company you are working for is not a small startup in very small or deregulated country, you probably will have some legal sign-off at least. There are other reviews/signoffs/audits done quite often: accessibility, design (whether you app following the global brand), security, etc. These steps should be detected and ideally done much earlier and multiple times in the development phase. It's very likely you are not aware yet of such processes and you'll figure their existence out right before putting website live. Ask people around or some managers - they should be aware of such things in advance.

Anyway, all audits are going to fail when you are not following their standards - so don't be surprised you are going to fail accessibility or security review when you haven't asked what things are going to be checked up. The team needs to follow some standards in order to pass audits and they have to be part of your quality measurement and testing.

Don't be afraid that often audits might drive your architecture or product - you will master "mocking up" things because they are fully functional in order to pass high-level reviews of your app. That's actually good - you can proof usefulness before making the app end-to-end developed.

### The Last Resort: Negotiate The Scope

![Scope negotiation](/assets/depression/fight.jpg)

You can negotiate the scope of your go-live product. There are multiple things that aren't needed in first iteration - or they might be disabled. But make sure it's not too late to negotiate the scope - some things might be already announced to wider audience and it would be dramatic failure of the entire company if these things won't show up in the first release. I can't imagine my disappointment when new XBox will support just 4k or will look like the old one. If your release is scheduled for tomorrow it's probably not the best time to drop some features.

You should discuss each feature drop with your stakeholders - and you need to be reliable on that. Show predictions, statistics, ask for review. Don't think they are going to say "ok fine" just right after the meeting or email. It's very important decision and they are taking a risk of not delivering some committed things. Hint: make sure they are aware of when you ware able to introduce that feature to production after release. Week or two is probably something everyone can accept.

When should you negotiate? Well, all the time. The best moment for dropping some features out of go-live scope is NOW. Negotiations take time. You don't want to put more pressure than already is. Ideally, you should drop all not necessary features at day one of you project. Examples? You probably don't need theme change for brighter colours, user can change her name later on, asynchronous pop-up notifications are nice but if users see notifications after reloading page. However, there are things that are not that required at the first glance but absolutely needed: you don't have to introduce login and registering users for a long time in your development phase, but definitely it's needed for live website.

Although, negotiations might not work when you are a vendor which have fixed-price project. Dropping features or negotiating delivery time is going to end up with fines. There might be economical reasons for doing so anyway, but it's better to focus on other things you should do there anyway.

### Bonus: can you negotiate quality?

![Thinking woman about the quality negotiations](/assets/depression/thinking-woman.jpg)

Who haven't heard these before:
* can you stop writing unit tests?
* can you just put it on production?
* can we drop that QA phase?
* can we speed up with doing performance testing after going live?
* can we stop doing code reviews? I thought everyone here is a professional and don't need second pair of eyes.

The rule of thumb is to say no.

However, there are multiple examples of wasting time with that approaches. Most of them are just nitpicking but still it's a great argument in hands of people that want to drag your project down. I would recommend you to review your approaches if you:
follow 100% coverage rule for unit tests
automate every single scenario of application usage
test performance without being aware of performance NFRs or baselines
jump into some lame bikeshedding conversations especially during code reviews

These things may drag you and your project down, show you are unprofessional even if it's just 1% of your time. It won't be true but still will feed people that want to cut project's quality.

### Related articles

* [Stupid code. Why people before you wrote it?]({% post_url 2019-02-02-stupid-code-why-people-before-you-wrote-it %})
* [If programmer would be witchers]({% post_url 2019-01-21-if-programmers-would-be-witchers %})
* [When you shouldn't ask for a raise]({% post_url 2018-12-13-when-you-shoudnt-ask-for-a-raise %})
* [Unit tests that piss me off]({% post_url 2017-11-30-unit-tests-that-piss-me-off %})
