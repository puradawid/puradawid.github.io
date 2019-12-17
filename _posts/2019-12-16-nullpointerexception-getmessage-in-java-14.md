---
layout: post
title:  "NullPointerException :: getMessage() in Java 14 - a helpful tool or an useless feature?"
date:   2019-12-16 18:50:00 +0200
image: /assets/npes/header.png
seo_description: NullPointerExceptions are hard to investigate - especially on production. How to do it much better in Java 14?
categories: java
---

![OpenJDK 14 Helpful NullPointerExceptions](/assets/npes/header.png)

Java 14 is coming with a new feature - NPE's `getMessage()` method will return a description which object is null and, therefore, a cause of an error. The feature is called "helpful NullPointerExceptions" which sounds very nice. But is it really helpful? How is it working? Are there some downsides? 

<!-- more -->

### The Problem - NPE comes with high investigation time cost

Let's consider this: a `NullPointerException` has been thrown from the line below:

{% highlight java %}
myClassMember.doSomeWork();
{% endhighlight %}

It's very easy to find out which object is null here. It's obviously the `myClassMember` - 100% accuracy.

Let's consider a similar scenario but with a different code line:

{% highlight java %}
myClassMember.doSomeWork().getResultsAsArray()[a][b][c].toString();
{% endhighlight %}

I am really curious how you are investigating such exceptions. I have a few solutions:

| Environment        | It's My Own Code                     | It's 3rd-party library                |
|--------------------|--------------------------------------|---------------------------------------|
| local              | replace with mutliline code OR debug | debug                                 |
| remote (no access) | replace with multiline code          | I am fucked - hard investigation only |


It's all traceable at the end of the day - you'll figure it out. The problem may seem more sophisticated when it's happening on production instances. Additionally, if you have no remote access you are fucked - at least the next release has to happen - but still the investigation is possible. Should we care about just time cost?

Yes, we should!

All Java programmers are constantly having this problem - `NullPointerException` fired on production and no one can say precisely which object caused it. So in Java 14 there is "Helpful Nullpointers" feature that improves usability of NPEs by introducing additional message to the exception, like:

{% highlight text %}
Cannot invoke "MyClass.doSomeWork()" because "myClassMember" is null
{% endhighlight %}

So all of the problems with investigation just vanished in no time! How cool is that?

### How to use/enable it?

I have prepared some [NPE code example that you can run](https://github.com/puradawid/puradawid-pro-helpful-npes). Just run with `make compile; make run`. The key ingredients are:
* [JDK 14](https://jdk.java.net/14/)
* Java runs with `-XX:+ShowCodeDetailsInExceptionMessages` flag

Then `getMessage()` method invoked on NPE object will return similar message to that I showed you a few lines above - it can't do some work because it some value is null. I really recommend you to try it, but it looks like these:

* Cannot invoke "Object.toString()" because "object" is null
* Cannot invoke "Object.toString()" because the return value of "NPEGenerator.getEmpty()" is null
* Cannot invoke "java.lang.Integer.toString()" because "this.field" is null
* Cannot invoke "Object.getClass()" because the return value of "NPEGenerator.getEmpty()" is null
* Cannot invoke "String.toString()" because "strings[i]" is null
* Cannot invoke "String.toString()" because "strings[i][0]" is null

...and so on and so forth. It looks very nice but there is one question - how the heck it's working?

### How it works?

First of all, the message is not computed with NPE object creation. It is getting calculated only when `getMessage()` method is invoked. You won't observe any performance differences on your JVM when that method is not invoked. Therefore, if your code generates gazillions of NPEs but it swallows them without printing out their messages, it won't change your performance at all.

The new error message is built with two parts: the consequence and the reason. Obviously, the reason is the key thing we are looking as it pinpoints place which an investigator needs to fix and the consequence is which method or field can't be accessed because of the reason. Both messages are generated from NPE's bytecode backtrace, but the mechanisms are slightly different:
* the consequence directly comes from the instruction that generated the error, like `invokespecial` means that method parameter cannot be invoked.
* the reason have to be investigated by checking a few more instructions before the error has happened - because it's getting the whole chain of executions which leads to the exception.

Thus, in order to get NPE message the `getMessage()` (which is actually `getExtendedNPEMessage()`) has to have an access to bytecode.

The information is quite crippled anyway. Because of indicies and other local variables that are getting destroyed during code execution, there is no way to get:
* local indicies of used array (so it will be like `array[i]` instead `array[12]` which may require additional investigation :-(
* local field name if the code was compiled without debug information (for example no `-g` flag provided with `javac` command for Java) so you will get `<local1>` instead of local variable name :-(

You can read [this JEP-358](https://openjdk.java.net/jeps/358) for getting more information.

### When it doesn't work?

There are mutliple cases where bytecode of the NPE is unreachable:
* programmer thrown the exception manually, like `throw new NullPointerException()`
* the root of the exception is a hidden method (not just by polymorphism, but these are native methods for things like strings concatenation)
* the code has been executed by RMI, as deserialized NPE doesn't have bytecode included
* the bytecode has been changed by tools like JVMTI

The most of them are advanced scenarios, so it doesn't hurt that much and their reasons to not show error details are quite understandable.

### Potential downsides of "Helpful NullPointerExceptions"

Well, apart from the scenarios which still won't show any details there are a few concerns which are worth to mention.

First of all: **performance**. getMessage method is quite expensive (comparing to not having it), thus if your application heavily prints out error messages or relies on them in any other way, it's better to keep that feature off (as long as you aren't done with performance testing)

**Security**. As a rule of thumb, noone wants to print out such information for public. The information is actually additional piece of source code which should not be so easily available for people outside of your organisation. If you want to use this feature in your production instance it's better to make sure you are not presenting exceptions for users.

The message **changes NPE format**. It might impact complex log analyzers that are based on regular expressions or do some analysis based on exception's message. Make sure your monitoring system is ready for the new detail messages, otherwise it might require some risky on-fly changes when the feature will be enabled on production.

### Conclusion

What can I say? "Helpful NullPointerExceptions" is definitely a good feature, improving especially the time for investigation the most common type of bugs. I can argue it will be more helpful for production errors than for local instances/development process - because replication of specific event bring a risk and it's time-consuming. 

There are few cases when messages are not working though. I think the lack of index values is the most painful one. On the other hand, these messages weren't there before, so I can't say it's a regression of some sort. 

Just keep in mind that **this feature can't be just enabled on production**. You need to check security and performance of your app. It doesn't cost nothing and it's going to be quite difficult to convince your Product Owner to spend some time on it - unless you are upgrading to Java 14 and you need to do these activities anyway.

Good luck with new, helpful NullPointerExceptions!

`I.can.say().goodbye.and(you.will.know().where(is.nullpointer))`
