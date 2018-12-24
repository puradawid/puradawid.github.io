---
layout: post
title:  "Unit tests that piss me off"
date:   2017-09-04 13:37:10 +0200
image:  /assets/angry_s.jpg
seo_description: Some thing that turbo-fans of TDD are doing wrong
categories: craftsmanship
---
![Anger](/assets/angry_s.jpg)

First of all - I am not against writing tests or doing [TDD][tdd]. This might
be misinterpreted and [Uncle Bob and his TDD
approach](https://www.youtube.com/watch?v=AoIfc5NwRks) will come here and smash
my face. I can't understand effort put in writing useless tests. This post
presents only my personal opinion and if you are writing exactly that type of
tests you can rethink those or simply disagree. Having different opinion is not
a crime. In both directions.

<!-- more -->

Another important thing: examples used here are written in [Java][java]-like language.
Although it can be applicable to almost any language in the World I know (apart
from [Brainfuck][brainfuck] or similar "really-fun-but-noone-is-laughing-you-nerd"
programming languages).

{% highlight java %}
// here it comes - control class that is doing nothing apart from 
// redirecting stream of control. This same model can be applied to any
// known classes that are calling one method instead of another because of
// some specific reason
class UberController {

  private static final Subject subject;

  public UberController(Subject s) { 
    subject = s;
  }

  void control(Event e) {
    if (someTest(e)) { 
      s.rightMethod();
    } else {
      s.leftMethod();
    }
  }

  private boolean someTest(Event e) {
    // ... really complex method (or not)
  }
}
{% endhighlight %}

You would ask me - what the heck?! This class is quite easy and I know what
can be tested here! Well. Let's see:

{% highlight java %}
// mocking from JUnit framework boilerplate a little; don't mind
public void shouldExecuteRightMethodIfPassesTest() {
  Subject mock = mock(Subject.class);
  UberController controller = new UberController(mock);
  controller.control(TRUE_OBJECT);
  verify(mock.rightMethod()).calledOnlyOnce();
  vetify(mock.leftMethod()).neverCalled();
}

// used crtl+c ctrl+v - damn it!
public void shouldExecuteRightMethodIfFailsTest() {
  Subject mock = mock(Subject.class);
  UberController controller = new UberController(mock);
  controller.control(FALSE_OBJECT);
  verify(mock.leftMethod()).calledOnlyOnce();
  vetify(mock.rightMethod()).neverCalled();
}
{% endhighlight %}

This code makes sense. It looks like really well-written code just from another
TDD book. I agree with concept of testing things to prove this will work after
refactoring code, etc. Let's assume that this code is some kind of knowledge.
Most of known programming techniques are based on DRY rule which stands for
[Don't Repeat Yourself][DRY]. This is solely rule of every thing that keeps us
deliver more and yet not wasting additional time to do it. But this case
clearly shows that this knowledge is getting written twice at least in two
entirely different forms. Code changes? Doubled. What if I would say I have got
a machine that can generate those tests just from method code and it will get
regenerated each time you will change the code? I would say [WOOW][agitarone]!
But what is the point? If I am changing something in this code I would be quite
sure that I have made a change and that would be... well, a change? No need to
confirm that my new code is behaving differently when I have made it that way.

Just to be clear: I am referring only to situations test affects just one class
or function and its not getting populated to different unit tests. Otherwise,
testing classes that use directly our `UberController` class should cover those
cases. But this is entirely different topic and these tests are not pissing me
off at all.

Don't double. Write a good tests that prove code is working.

[^madethisup]: Fortunately, I made this one up.

[react]: https://github.com/facebook/react
[angular]: https://github.com/angular/angular
[tdd]: https://www.goodreads.com/book/show/387190.Test_Driven_Development
[java]: https://docs.oracle.com/javase/8/
[brainfuck]: http://esoteric.sange.fi/brainfuck/README.txt
[DRY]: http://www.artima.com/intv/dry.html
[agitarone]: http://www.agitar.com/solutions/products/agitarone.html
