---
layout: post
title:  "How to write bad Java constructors"
date:   2019-03-28 17:00:00 +0200
image:  /assets/constructors.jpg
seo_description: Bad smells in Java constructor's code 
categories: java
---

![Design Patterns book](/assets/constructors.jpg)

Constructors in object oriented programming are very important static methods - they start an existence of every object. Regular Java code is full of constructors, and we actually used to them as well. But can constructors be better and worse? Sure. I made a list of 4 bad constructor rules that came up first to my head.

Good practices are so boring so let's see how we can make other engineers' life worse!

<!-- more -->

### Bad Constructor Rule #1: Do The Heavy Lifting

Have you seen that before? A long code constructors mean they are doing a lot of important stuff. Don't let people read code straightforward - make it hard to understand. Remember - your job security is the top priority here.

![lifting](/assets/lifting.gif)

#### Things To Do

* make constructor responsible for as much business logic as you can
* include I/O operations (even asynchronous like [Java 11 Http Client calls][async])

#### Consequences

* IoC containers (Spring, etc.) will have a lot of trouble with instantiating these classes
* Readers will get confused trying to understand massive block of code

#### Party Breakers

* use builder pattern to solve complex logic
* move I/O operations to methods, postpone them or get rid of them entirely (if possible)

### Bad Constructor Rule #2: Mess With Primitive Types

Primitive types are very popular. You can use them to define contextless values like height, length, subtotal tax calculation, etc. The only thing that determines theirs use is the name and position in function signature. Here's a very nice example:

{% highlight java %}

class Vector {
  Vector(int x, int y, int z, double length) { }
}

{% endhighlight %}

The idea is to use them as much as possible! Don't make Reader 100% sure about parameter's order without checking it with the IDE or documentation!

{% highlight java %}

class EncryptedMessage {
  EncryptedMessage(String filename, String fileSeparator, String fileAccess, String cipher, String cipherType, String cipherSalt) { }
}

{% endhighlight %}

#### Things To Do

* use as many values of the same primitive type as possible
* make them cryptic - use very ambiguous names for these parameters

#### Consequences

* hard reading
* writing new invocation is even harder (checking with the docs/IDE hints all the time)
* you will be the only one that actually can remember the order of parameters

#### Party Breakers

* use [readable data classes][dataClasses]
* put meaningful names, yik!

### Bad Constructor Rule #3: Hide Optional Parameter Inside

Usually, constructors are overloaded for making part of parameters optional. Objects don't necessarily need some `NastyController` in every case. So let's mess up with the reader and put the optional value between mandatory ones! 

{% highlight java %}
class Vector {
  Vector(int x, int y, int z) { }
  Vector(int x, int length, int y, int z) { }
}
{% endhighlight %}

How fun is that, huh?

#### Things To Do

* put the optional parameter in extended constructor's signature as the beginning
* **[Level up!]** do it randomly

#### Consequences

* using these constructors will be madness
* 100% you will piss off yourself in near future

#### Party Breakers

* put the optional argument as the last one

### Bad Constructor Rule #4: Make All Parameters `@Nullable`

Some of constructor's parameters are marked as `@Nullable` - it's alright. Specific domain can force such situations, like:

{% highlight java %}

class Invoice {
  /**
  * Creates new invoice
  * @param signature can be null, not every invoice has one
  **/
  Invoice(User buyer, User seller, List<Items> items, @Nullable Signature signature) { }
}

{% endhighlight %}

However, it's the Bad Constructor when all of your parameters are optional. It's just because you haven't done any upfront class design. It looks really cool though:

{% highlight java %}

class ChannelController {
  ChannelController(@Nullable Source source1, @Nullable Source source2, @Nullable Output output1, @Nullable Output output2, @Nullable SafePrinter printer, @Nullable DataLogger logger) { }
}

{% endhighlight %}

![Nulls](/assets/nulls.jpg)

#### Things To Do

* make all parameters `@Nullable`
* **[Level up!]** don't mark them as `@Nullable` but treat like ones

#### Consequences

* various possible states of null parameters makes code hard to debug
* complex class' code or constructor itself

#### Party Breakers

* review the class in context of Single Responsibility Principle
* split the class up
* use [data classes][dataClasses] as parameters

## Do you have better ideas?

Does anything come to your mind? Have you seen worse examples? Did your mate do something worse? Share your Bad Constructor in the comments section below!

[dataClasses]: {% post_url 2018-12-19-data-classes-in-java-runtime-underpefrmance-vs-code-readability %}
[async]: {% post_url 2019-02-21-http-java-11-client-async-api %}
