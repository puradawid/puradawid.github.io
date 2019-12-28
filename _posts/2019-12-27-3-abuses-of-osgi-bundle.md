---
layout: post
title:  "The 3 popular abuses of OSGi bundle"
date:   2019-12-27 18:50:00 +0200
image: /assets/osgi_abuses/xmas.jpg
seo_description:
categories: java
---

![Santa writing another OSGi bugs](/assets/osgi_abuses/xmas.jpg)

The last Christmas article - [about most common Java bugs]({% post_url 2018-12-23-bug-sie-rodzi-the-most-common-bugs-in-java-code %}) - was a success for me and this blog. This time we will take a look into OSGi bundles, which I consider as the vital top architecture for many products (like Eclipse, Jira, Adobe Experience Manager). On the other hand, OSGi is often treated as yet another Dependency Injection container, which is wrong by definition. Let's take look at the tree mistakes developers and architects are making with their OSGi ecosystem's design.

<!-- more -->

### What's OSGi all about?

In a one sentence - OSGi has been made for sorting out ancient Java classpath problem. In other words, when your jar depends on A, B and C and the other library you are using or a team that contribute to the same system is using A, B and C but in different versions and you can't just upgrade them with major cost - OSGi comes as a one of solutions.

Some people will say **that's not true, OSGi is much more than that**. True, it has multiple features I haven't mentioned, but it shouldn't be a reason to use it, just the other way around: if you have multiple teams in your organisation or you want to allow complex, independent plugins - here you go, OSGi may be useful for you. As an alternative, especially in web-based applications, you can jump into micro-services and solve this on a much higher level. Remember, microservices come with cost of putting network between your function calls - which might be unacceptable in some cases.

Therefore, a single bundle should mean a single, independent thus self-organising cell in your organisation. Consider that - in a single JVM OSGi provides a way to talk with different bundles with potentially different class paths. You can't couple them much - as you can't couple your teams - because otherwise they will start to be way too sophisticated. These three issues which I am mentioning below are children of this rule's violation.

### Abuse #1: Non thread-safe services

It seems obvious but not always considered: a service you're using might be executed by multiple threads. Even if that piece of code is just for you, service is getting published across all bundles and might be used in future - *hey, this is a good one, let's just take it an use it!* - someone will eventually say. Your monitoring system will wake up later, when no one expects, giving you a problem that can't be solved overnight.

Designing your service, you may consider things like synchronised blocks, access to static references, thread-safe collections. This brings you another set of troubles though: deadlocks and the rest of crap named "concurrency problems". These problems are far beyond this blog post, so I am leaving them to your professional expertise.

You don't need that service? It's not meant to be used by any external bundle? It's better to not make it a service then. Less services means less troubles with testing, mocking things and pretending you're using OSGi container (which you don't need inside of your bundle).

### Abuse #2: One function - one bundle

A few math functions? Let's make a bundle. Application's database layer? A bundle! Fuck you? Another bundle, but a functional one!

Have you noticed that OSGi container (like Apache Felix) takes ages to get up and running? Oh well, maybe it's because you have 100 bundles created just by your team!

The other consequence is a bit more delicate matter - as you can abuse Spring container and make all classes public and accessible for everyone which leads to spaghetti-like architecture, it's the very same problem for bundles - if your architecture says "everything can be bundle" then you will end up with a potentially single-class bundles system, where unnecessary overhead eats all of available resources. 

Instead of splitting things into different bundles, consider making functions on lower level - use more package-scope isolation, make classes public only when it's absolutely necessary. Then, you bundle will contain a lot of private classes and just a few that are connecting to other bundles.Anyway, people forgot about package-scope modifier, which makes another people sad.

Conway's law suggests that every architecture will eventually reflect a company organisational model. That's why all engineers suppose to speed up that process. If your organisation is actually contributing to one JVM in runtime, it's worth considering making it OSGi and assigning a **one** bundle to a one team. API of these bundles are the conversations which teams are making with each other, concreting the contracts made.

### Abuse #3: Exporting all packages

I have seen that many times in `MANIFEST.MF` files:

```
Export-Packge: my.root.package.*
```

Let me translate it - I want all of my classes to be loaded by class loader in every other bundle that imports any of my packages. All classes are yours forever.

There are two things wrong with that approach. First of all - you don't know which classes are getting used. Moreover, this is even more sophisticated than making some services public - because it's not like making some **instances** available, but entire classes - so other bundles can instantiate, use and inherit them in a runtime. You need to be 100% sure these classes are safe for publish and using them by different bundles is fine.

Don't get me wrong. I am not saying that making things like `this.is.my.api.*` is bad, just it has to be a conscious decision, not because some archetype does it by default. It's better to have just `api` package which exports all interfaces needed. The only exception is when you are having a bundle which is a library - like Apache Commons or something similar. Then, your packages should be exposed, but keep in mind they have to be carefully changed with every version bump.

### Wish you a Happy New Year!

I hope this three points will start healthy conversations about how we should design OSGi bundles and standardise "code smells" for them as well.

For people that support myself and read this blog: thank you! Wish you all my fellow readers all best in 2020, making more good decisions and less bugs this year. I hope it's going to be even more productive year than the current one, which brought me as many good experiences as disappointments and struggles. We all, especially the world-wide community that creates software, make this World better and easier, so let's not stop in these goals and let's move towards them even faster! Happy New 2020!
