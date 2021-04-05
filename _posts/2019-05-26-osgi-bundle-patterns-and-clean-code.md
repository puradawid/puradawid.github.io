---
layout: post
title:  "OSGi clean code and bundle patterns"
date:   2019-05-26 10:00:00 +0200
image:  /assets/osgi_patterns/SlingGetServlet.png
seo_description: List of OSGi bundle architectural patterns and OSGi clean code rules
categories: java
---

![SlingGetServlet code screenshot](/assets/osgi_patterns/SlingGetServlet.png)

Eclipse, Adobe Experience Manager, Jira - what do they have in common? They all are using OSGi container. OSGi is a container of bundles. There is a very important bit of bundles architecture then.
Keep in mind, that OSGi is nothing similar to classic DI mechanisms, as it defines another layer of isolation: bundles. Guice or Spring still can be used within OSGi container separately for just a one bundle. Within the bundle, the framework provides special Class Loader which is loading all classes based on the configuration of the bundle and a context of its execution. You can think about single bundle as an isolated runtime environment with components, explicitly defined packages and services as an external way of communication.

<!-- more -->

### Patterns

In this section I am going to introduce some OSGi patterns I found very useful in order to architect or categorise bundles and actually understand how they are talking to each other. A team should create more than one bundle if its work is well organised and is not suffering from Conway's Law Mismatch - i.e. the codebase architecture that they are delivering is not reflecting the structure of the entire organisation. Nevertheless, I think that clean code and OSGi pattern usage can be applied to almost all applications created for existence in OSGi environment.

#### Application

![Application OSGi Bundle Pattern](/assets/osgi_patterns/ApplicationPattern.png)

This is the most common approach for developers that are making bundle which has to be just an application that uses OSGi container. It is usually importing a lot of other packages as its dependencies. It heavily uses Services as outputs and Components as loaders for other components. It is some sort of glue code, full of business classes that should not be exported or used anywhere else.

#### Library

![Library OSGi Bundle Pattern](/assets/osgi_patterns/LibraryPatternT.png)

This bundle exports all classes known as API. It doesn't, however, provide services nor bundles neither. It's designed to deliver classes that are used for other bundles freely. There are many examples of that kind of pattern, like Guava, Apache Commons bundles and so on. It has one very important bit: necessity of correct semantic versioning. It applies to other types of bundles as well but in this case breaking it would have more severe consequences. Library should not consume or register any services.

#### Service Provider

![Service OSGi Bundle Pattern](/assets/osgi_patterns/ServicePattern.png)

Highly specified, usually I/O oriented bundle for one purpose. That's very useful pattern for things like HTTP servers or other technical services that has to be used for application. It supposed to have just one single entry point for a service or load specific services for one component. These both patterns can be mixed, of course, but that's not the clean architecture at all.

### Clean Code Practices

There are a few practices I believe are quite important in OSGi bundles development. Additionally I encourage you to read examples of [bad contructors][constructors] as well as a part of clean code approach. Here's the list of things we should do while developing bundles:

#### Don't export all classes by default

If you are delivering a bundle that its architecture seems to be the application pattern (so business logic), you probably don't need to export anything. There are two patterns that explain how bundles operates with their each other's instances but there is no need to export all classes/packages for your codebase. That makes your code vulnerable for reusing away from your scope, which you might find quite disturbing in terms of future upgrades or class removal - your exported classes are always a potential API for all of other bundles in the system.

#### Make services thread safe

Does it sound like cliche? Sure, but it happens quite often: someone missed that bit and the bundle consumer has a big problem with synchronising its own code. All methods and instances itself of every service might be used in concurrent environment and there is no way to avoid it (well, you can make ThreadLocals all over the place, or create a ServiceProvider that will instantiate just one instance per thread, but that's not right).

#### Import Major Version

Well, I don't want to see you doing that all the time - although it's better to have the reliability on your libraries/service providers that they are not going to break existing API in major versions. I encourage you to set up the bundle manifest to import/use classes that are major version dependent rather than using specific one. It helps a lot with upgrades, especially when you have some major security issues found with used third-party library.

#### Use Services When They Are Services

There is quite bad pattern I see all around Sling code sometimes: some services classes are not meant to be used outside the bundle but yet they are services. Components are the best choice there. Remember, service means some other bundle can execute it's methods so make sure it's exactly what are you going to have. Otherwise, if your class have to be populated with just other services, make it just a component.

#### Don't use your services within other services

Sometimes we "need to expose" a service within a bundle to make this accessible for other service within the same bundle (sounds complex, doesn't it?). That's wrong - you don't have to do it. Having the class instantiated as just regular one, thus hidden, inside your service is better idea. Remember - you have to keep your number of services and even components as small as possible. Sometimes, you even don't have to create more than one-two services. OSGi container are not the best choice if you think about using Dependency Injection pattern. It's feasible to do (and because of that it's the most tempting thing) but at the same point it's publishing the service to the wider audience (aka other bundles).

### What's next?

Do you want to learn more? I highly recommend you reading [the whitepaper about OSGi service platform][osgi_whitepaper], it contains an extensive explanation how the proper OSGi design should look like. Don't forget about the proper clean Java code! You can also read my blog post about [the perfomrance impact on creating readable data classes in Java][data_classes]. I wish you working with well designed OSGi bundles only!

[constructors]: {% post_url 2019-03-28-how-to-write-bad-constructor %}
[data_classes]: {% post_url 2018-12-19-data-classes-in-java-runtime-underpefrmance-vs-code-readability %}
[osgi_whitepaper]: https://www.osgi.org/wp-content/uploads/OSGiTechnicalWhitePaper1.pdf
