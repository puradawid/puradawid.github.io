---
layout: post
title:  "SOLID in Test Automation #2: Liskov Substitution Principle"
date:   2019-08-07 18:00:00 +0200
image: /assets/liskov/banner.png
seo_description: Liskov Substitution Principle - how does it apply to automation tests?
categories: java
---

![Liskov Substitution Principle](/assets/liskov/banner.png)

My mental abilities (actually lack of them) pushed me to software engineering. Seriously. During my childhood and adolescence I had big troubles with remembering things. A poem to learn? No way. Geography or history? In these fields you were a good student if you remember dates, names, locations. I just couldn't remember these things that were coming to me out of blue. Mathematics in primary school was also painful: multiplication tables. That was awful! I remember other kids were just immediately writing a number based on input and I had to perform some calculations in runtime (6 times 9? That's 6 times 10 and minus 6). The funny thing is it turns out that processors are not keeping multiplication tables, oh what a shame, we learnt absolutely useless portion of knowledge. On the other hand, understanding of complex behaviour or systems was relatively easy (as long as I understood the motivation behind: it was damn easy to learn trigonometric functions by unit circle rather than some ridiculous rhyme where cosines is negative). Without a struggle, I learnt physics, somewhat of electronics and programming.

When I was a bit younger, an interviewer (some Java developer) asked me:

> Do you know SOLID, boy? What does `L` stand for?

<!-- more -->

That was it. The whole nightmare of my primary school just came back. Because I prepared myself before the interview, I knew that S is something about having just single responsibility of class, but the rest of them was too difficult to remember. I didn't know what `L` stands for in SOLID. I felt that was my biggest failure those days - as I thought I am not that bad object oriented programmer at all.

Now, when I do understand these principles a bit better, I am 100% sure I shouldn't try to "remember" meanings of these letters: they are not made for just remembering, but they are actual heuristics how class design should look like and what pain points are there. In this article, let's review `L` mentioned already above.

The very first thing to learn is Liskov Substitution principle comes from Barbara Liskov, an American computer scientist. If your native language changes verbs or forms based on gender grammar, keep in mind that Liskov is a woman. Barbara Liskov and Jannete Wing wrote [a whitepaper](http://reports-archive.adm.cs.cmu.edu/anon/1999/CMU-CS-99-156.pdf) which formalised the idea, however the first mentioned happened in [another whitepaper](https://dl.acm.org/citation.cfm?doid=62139.62141) written by Barbara in the first place. I recommend to read both papers, they shed some light about motivation and complexity of taken heuristic.

### Liskov Substitution Principle in classic Java example

Ok, so what's the example of the rule itself? There are plenty of examples in the Internet, so let's use something less abstract (like ducks or rectangles): HTTP request. In this example, there are two types of request''s content: plain text and JSON. JSON is a text so I should do it this way:

{% highlight java %}
class HttpRequest {

  void setContent(String content) {
    // sets cotnent for sending
  }

  String getContent() {
    // returns content
  }
}

class JsonHttpRequest extends HttpRequest {

  @Override
  void setContent(String content) {
    // validates content against Json file; sets it for sending
  }
}
{% endhighlight %}

But it turns out that's a bad design. Regarding to LSP, base class behaviour has been changed as `setContent(String)` method parameter is more restrictive in derived class than the base one. In other words, we can't use `JsonHttpRequest` instance with the code that handles `HttpRequest`. In literature, there is suggestion that you should do that thing:

{% highlight java %}
class BaseHttpRequest { // could be abstract in some cases

  String getContent() {
    // returns content object
  }
}

class PlainTextHttpRequest extends HttpReqeust {

  setContent(String content) {
    // sets plain string as content
  }
}

class JsonHttpRequest extends HttpRequest {

  setContent(String jsonContent) {
    // sets jsonObject as content
  }
}
{% endhighlight %}

I think that the example above is an overkill. I would rather move the content value to the constructor and that would prevent from violating LSP and yet isn't making so much noise about the proper content object. Here's another example:

{% highlight java %}
class BaseHttpRequest { // could be abstract in some cases

  BaseHttpRequest(String content) {
    // sets plain text into content
  }

  String getContent() {
    // returns content object
  }
}

class JsonHttpRequest extends HttpRequest {

  JsonHttpReuest(JsonObject jsonContent) {
    // sets jsonObject as text content inside
  }
}
{% endhighlight %}

Keep in mind that this case might be solved even in simpler way: `Content` class can be extracted from the request and transformed it's content to `String` for `HttpRequest` object and that would be also a good solution (maybe the best one) for mentioned problem.

### Where can I apply LSP for test automation?
Few people construct unit tests using multiple classes located in their test folder. Why does it happen? I have my own hypothesis: there are two reasons:

* programmers don't want to write complex code on tests side (on the other hand, we are fine with using sophisticated external testing frameworks)
* unit tests frameworks (both JUnit and TestNG) are not supporting more sophisticated testing patterns, like Screenplay, out of the box. They limit to write Given, When, Then pattern within the test case scope.

So, where's the place for applying the principle into test code? E2E testing of an application (I strongly believe all of us are doing some) is the right place where complexity hides behind abstraction - usually in form of page objects classes.

As a side note, I don't think there is a relatively significant survey about using PageObjects, so let's do one. I really appreciate your answers. Many thanks!

{::options parse_block_html="true" /}
<blockquote class="twitter-tweet"><p lang="en" dir="ltr">
Software engineers, are you using Page Object pattern in your current project (for testing)?</p>
&mdash; Dawid Pura (@puradawid)
<a href="https://twitter.com/puradawid/status/1159485316836810752?ref_src=twsrc%5Etfw">August 8, 2019</a>
</blockquote>
<script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>
{::options parse_block_html="false" /}

### Page Object LSP violation

Here's another day of my work: I am sitting down to write some base tests for my blog. It's not something I would imagine enjoyable but hey, it's not that bad neither!

So, let's start with base class that will go with navigation around the website:


{% highlight java %}
class BlogPage {

  Navigation getNavigation() {
    // Gets the navigation component
  }

  Footer getFooter() {
    // Gets the footer component
  }

  BlogPage getNext() {
    // Use browser's next function and returns loaded page
  }

  BlogPage getPrevious() {
    // Use browser's back function and returns loaded page
  }
}
{% endhighlight %}

It saves me a lot of time: I don't have to write navigation and window handling every single time, moreover I am able to reduce complexity of my tests, which might be related to many pages (as regression test scenarios):

{% highlight java %}
validateThePage(BlogPage page) {
  validateFooter(page.getFooter());
  validateNavigation(page.getNavigation());
}
{% endhighlight %}

I can add it to all of my scenarios as post checks. Very useful tool, I love this base class. I created classes like `Article`, `Bio`, `HireMe`... It's all done. I was very happy of these work I have done that day, it wasn't that bad after all!

But nothing is forever. Sigh.

I forgot to add modal windows! Ok, that wasn't that hard but here's the werid thing:


{% highlight java %}
class ModalWindow extends BlogPage {

  getFooter() {
    throw new UnsupportedOperationException("Modal window has no footer");
  }

  getNavigation() {
    throw new UnsupportedOperationException("Modal window has no navigation");
  }
}
{% endhighlight %}

My modal windows don't have any navigation or footer. In order to get back to previous page user has to close it somehow. I realised that is not a big deal and I don't want to refactor all classes so I just throw exception with the page.

But... I forgot these post-checks I have implemented for all test cases. Damn it! OK, that's not going to be bad neither. I still don't want to refactor class inheritance so let's do it the simplest way:

{% highlight java %}
validateThePage(BlogPage page) {
  if (!page instanceof ModalWindow) {
    validateFooter(page.getFooter());
    validateNavigation(page.getNavigation());
  }
}
{% endhighlight %}

But now you are coming in, my dear Reader, smashing my head on the table and saying this line:

> That's wrong, you violated Liskov Substitution Principle! You piece of...

Let's leave the rest of this conversation for your imagination only. Luckily for me, the code you told me to write was quite better:

{% highlight java %}
class BasePage {

  BlogPage getNext() {
    // Use browser's next function and returns loaded page
  }

  BlogPage getPrevious() {
    // Use browser's back function and returns loaded page
  }
}

class BlogPage extends BasePage {

  Navigation getNavigation() {
    // Gets the navigation component
  }

  Footer getFooter() {
    // Gets the footer component
  }
}

class ModalWindow extends BasePage {
  // Some other implementation I need for modal windows
}
{% endhighlight %}

So there is a base class that defines **contract** of using browser history (which is absolutely fine) and blog page defines behaviour of page that contains navigation and footer components. It separates the concept of window a bit and I have more classes to maintain, but I can live with it. My class hierarchy got fat a bit.

Well, that solves my problem, as well as my next dentist visit. Thanks!

### Controversy

First of all, it's hard to say which code violates Liskov Substitution Principle. First of all, assesment itself is not tightly coupled with method's signature. We, software engineers, tend to use inheritance (especially this Java crippled one) as code reuse activity. That's not the inheritance itself. We need to understand not only the same methods but also contract, which our class makes with the rest of the object oriented world.

There are few outstanding questions about interfaces, default methods, constructors. Yes, these are important things. Heuristic I will suggest: if something violates LSP, use composition over inheritance. That might be better way to maintain encapsulation on the correct level (i.e. not exposing methods of base class we don't need in derived one).

Eventually, it's up to you. It's not a coincidence software engineers are required to be intelligent and brave. Make decisions on your own! I hope this text above helps a little too.

#### Related links:

* [Open Closed Principle I wrote some time ago]({% post_url 2019-06-20-solid-in-test-automation-1-open-closed-principle %})
* [How to write bad constructor?]({% post_url 2019-03-28-how-to-write-bad-constructor %})
