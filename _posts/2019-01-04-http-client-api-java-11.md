---
layout: post
title:  "HTTP Client (java.net.http) Java 11 API - the practical example"
date:   2019-01-04 08:00:00 +0200
image:  /assets/java_logo.jpg
seo_description: A quick overview on Java 11's HTTP Client API
categories: java
---

![Java logo in binary code](/assets/java_logo.jpg)

Any HTTP Client library in Java is a hell to me. Comparing to other technologies like Groovy which have built-in APIs, Java sucks. Projects use Apache HttpClient API for trivial tasks like testing, which I consider as a brain rape because of the usage difficulties. When the HTTP client was introduced and incubated in Java 9 I was like:

> Finally, we have our HTTP client, at least for testing!.

Now it's officially moved to `java.net.http` package. I had to try it on my own in the home laboratory.

<!-- more -->

[HTTP client API][1] was de-incubated in Java 11 and guess what? It looks nice.

Recently, I wrote an example newsletter service - which is, by the way, used in this blog. In order to test it, Apache http-commons library (which is an actual better version of Apache's HttpClient API in every sense) was doing the HTTP work for me. Here is the test code:

{% highlight java %}
@Test
public void shouldReturn404OnWrongRequest() throws Exception {
  HttpClient client = new HttpClient();
  GetMethod get = new GetMethod("http://localhost:8080");
  client.executeMethod(get);
  assertThat(get.getStatusCode(), is(404));
}

@Test
public void shouldReturn200WhenSendingCorrectEmail() throws Exception {
  HttpClient client = new HttpClient();
  PostMethod get = new PostMethod("http://localhost:8080/signup");
  get.addParameter("Content-Type", "application/x-www-form-urlencoded");
  get.addParameter("email", "correct@email.com");
  client.executeMethod(get);
  assertThat(get.getStatusCode(), is(200));
  FileReader fr = new FileReader(new File(f.getPath()));
  try (BufferedReader reader = new BufferedReader(fr)) {
    assertThat(reader.readLine(), is("correct@email.com"));
  }
}
{% endhighlight %}

This is a pretty simple usage of Apache http-commons API. That's what I really like - an object of request and a result returned. Wait... Not really - there is a mutable `PostMethod` object. It's not even an actual method but a call, for God's sake! I hate it a little but it's still better than normal HttpClient API.

How does the same thing look like in Java 11's `java.net.http` library? Here it is:

{% highlight java %}
@Test
public void shouldReturn404OnWrongRequest() throws Exception {
  HttpClient client = HttpClient.newBuilder().build();
  HttpRequest request = HttpRequest
    .newBuilder(URI.create("http://localhost:8080/signup"))
    .GET()
    .build();
  HttpResponse<Stream<String>> response =
    client.send(request, HttpResponse.BodyHandlers.ofLines());
  assertThat(response.statusCode(), is(404));
}

@Test
public void shouldReturn200WhenSendingCorrectEmail() throws Exception {
  HttpClient client = HttpClient.newBuilder().build();
  HttpRequest request = HttpRequest.
    newBuilder(URI.create("http://localhost:8080/signup"))
    .POST(HttpRequest.BodyPublishers.ofString("email=correct@email.com"))
    .header("Content-Type", "application/x-www-form-urlencoded")
    .build();
  HttpResponse<Stream<String>> response =
    client.send(request, HttpResponse.BodyHandlers.ofLines());
  assertThat(response.statusCode(), is(200));
  FileReader fr = new FileReader(new File(f.getPath()));
  try (BufferedReader reader = new BufferedReader(fr)) {
    assertThat(reader.readLine(), is("correct@email.com"));
  }
}
{% endhighlight %}

Advantages? Fluent API, an actual result (not a mutable request object).

Disadvantages? Lack of urlencoded handling on its own. I had to write an actual `=` in the body.

How the new HTTP Client Java API is different from other HTTP clients?

* HTTP/2 support
* WebSocket calls
* async and sync API

### [HttpClient][HttpClient] class

The root class of the entire client. You can set up here a connection like proxy, SSL setup, following redirects (or not) and authentication. Because of the good object-oriented design, the HttpClient's constructor is protected. All configuration parameters and `HttpClient` instantiation have to be provided by [`HttpClient.Builder`][HttpClient.Builder] class. `HttpClient` is also immutable.

### [HttpRequest][HttpRequest] class

The HTTP request is created by `newBuilder` methods. The request is also immutable and created through the builder pattern. The main advantage of this approach is using a `copy()` method for creating more than one instance of request (however the one request can be used many times) - for example:

{% highlight java %}
HttpRequest.Builder blueprint = HttpRequest.newBuilder(someUrl)
  .header("SomeSpecificHeaderIHaveToUseThere", "ValueOfThisHeader");
HttpRequest.Builder getRequest = blueprint.copy().GET();
HttpRequest.Builder postReqeust = blueprint.copy().POST(somePublisher);
{% endhighlight %}

Two different methods don't have to declare the specific header twice. The example is trivial, however more complex expressions like passing through the HTTP builder for some dynamic operations seem legitimate to me.

The other important subclass here is [`HttpRequest.BodyPublisher`][HttpRequest.BodyPublisher]. It feeds body content with some value using (primarily) a `ByteBuffer`. The entire concept of subscriber/publisher used in the API is worth exploring and I recommend you to see [the documentation about Publishers from `java.util.concurrent` package][subscriber/publisher]. Software engineers or architects might consider using this concept in their own API instead of homemade sub-pub layers.

Anyway, if one is looking for ready-to-use publishers (no one wants to write one), a few are located in [HttpRequest.BodyPublishers][HttpRequest.BodyPublishers] class. In my case above, I used `BodyPublishers.ofString(urlEncodedBody)`. I found this difficult to send form-alike data. It applies especially to url-encoded ones. Providing a key-value map as a body doesn't work here (by default). The good part of `BodyPublishers` methods is a possibility to reuse existing `Flow.Publisher` object with `fromPublisher` method.

### [HttpResponse][HttpResponse] class

It is the only generic class here. Generic class depends on `HttpResponse.BodyHandler` instance provided in `HttpClient::send` or `HttpClient::sendAsync`. This guy depends on `BodySubscriber` class which transforms `List<ByteBuffer>` of response body into whatever class is needed. `BodyHandler` is the class you need especially when handling asynchronous request - it puts `HttpResponse.ResponseInfo` object through this function interface. The method can process or discard the response (because of code fault of whatever other reason software engineer meant). We will look closer to the `BodyHandler` in the next blog post.

### Should I migrate to the `java.net.http` now?

Tldr; no. Let's consider two examples:

#### Test code

HTTP Client is used as integration testing tool. Fluent API is the only profit of migration - not sure is your priceless time worth to migrate things around. I don't think migration to Java 11 is now beneficial though.

#### Production code

Are you using the HTTP client that doesn't support HTTP/2? Consider the migration in your future plans. The Web is going to use HTTP/2 more and if your code is based on calling multiple unknown websites, the benefits can be significant and worth investing. Most of software engineers don't have such project, therefore the heuristic is "no, you don't need to migrate".

Regardless to the API is not a good idea for an ongoing project. However, for greenfield projects, it might be tempting. The migration can be considered as a good move. I recommend using the `java.net.http` library in that case.

Important observation though: all API's methods are not `getXxx` format anymore! It looks like the Java community is already tired of `getUri`, `getRequest`, etc. People are already telling me about the `get` keyword redundancy. I know it's bad. The `set` method format is a different story though. Aesthetic is not a case in this situation.

### HTTP async

There is one thing that I have missed here: asynchronous calls. I am going to publish an async crawler for websites based on Java 11 HTTP Client API in the next Thursday. I published already the [Crawler Github repository][4]. Stay tuned!

### Resources

* [GitHub repository of newsletter signup service][2]
* [The `java.net.http` documentation][1]

[1]: https://docs.oracle.com/en/java/javase/11/docs/api/java.net.http/java/net/http/package-summary.html
[2]: https://github.com/puradawid/newsletter-signup-service
[3]: https://github.com/puradawid/newsletter-signup-service/blob/master/http-client-testing/src/test/java/io/github/puradawid/newsletter/signup/io/ServiceTest.java
[4]: https://github.com/puradawid/simple-http-crawler-java11
[HttpClient]: https://docs.oracle.com/en/java/javase/11/docs/api/java.net.http/java/net/http/HttpClient.html
[HttpClient.Builder]: https://docs.oracle.com/en/java/javase/11/docs/api/java.net.http/java/net/http/HttpClient.Builder.html
[HttpRequest.BodyPublisher]: https://docs.oracle.com/en/java/javase/11/docs/api/java.net.http/java/net/http/HttpRequest.BodyPublisher.html
[HttpRequest.BodyPublishers]: https://docs.oracle.com/en/java/javase/11/docs/api/java.net.http/java/net/http/HttpRequest.BodyPublishers.html
[subscriber/publisher]: https://docs.oracle.com/en/java/javase/11/docs/api/java.base/java/util/concurrent/Flow.Publisher.html
[HttpRequest]: https://docs.oracle.com/en/java/javase/11/docs/api/java.net.http/java/net/http/HttpRequest.html
[HttpResponse]: https://docs.oracle.com/en/java/javase/11/docs/api/java.net.http/java/net/http/HttpResponse.html
