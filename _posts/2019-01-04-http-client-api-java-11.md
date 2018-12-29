---
layout: post
title:  "HTTP Client (java.net.http) Java 11 API - a practical example"
date:   2019-01-04 08:00:00 +0200
image:  /assets/java_logo.jpg
seo_description: Quick overview on Java 11's HTTP Client API
categories: java
---

![Java logo in binary code](/assets/java_logo.jpg)

I personally hate using a library Http Client in Java. Comparing to other technologies like Groovy have built-in APIs and libraries that helps you a lot with choosing the client in a first place. Many people use Apache HttpClient API for trivial tasks like testing, which I consider as a rape on minds because of difficult usage and useless other things. When the HTTP client was introduced as an incubation in Java 9 I was like "finally, we have OUR HTTP client, at least for testing!".

<!-- more -->

So the API was de-incubated in Java 11 and guess what? It looks nice.   

Recently, I wrote an example script for testing newsletter service - which is, by the way, used in this blog. In order to test it Apache http-commons (which is an actual better version of Apache's HttpClient API in every sense) was doing the bloody HTTP work for me. It is quite fine, check this out:

```
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
```

This is a pretty simple Apache http-commons API used here. That's what I really like - an object of request and a result returned. Oh, not really - there is a mutable `PostMethod` object. Yup. I hate it a little but it's still better than normal HttpClient API.

So here is a brand new API in Java 11. It is the same test, doing exactly the same thing but with `java.net.http` package: 

```
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
```

Advantages? Fluent API, an actual result (not a mutable request object).

Disadvantages? Lack of urlencoded handling on its own.

Java 11 has many new APIs that we can benefit with - without using additional dependencies, which is even more awesome. How the new HTTP Client Java API is different?

* HTTP/2 support
* WebSockets support
* async and sync API


## `HttpClient` class

Class of the client. You can set up a connection way - proxy, SSL setup, etc.

## `HttpRequest` class

Request for remote. It has defined all HTTP request specifics - URL, headers and content.

## `HttpResponse` class

Response of request produced by `HttpClient`.

## HTTP async

There is one thing that I have missed here. Asynchronous calls. Considering example above making these requests asynchronous makes no sense, however let's make it asynchronous as hell:

```
make it asynchronous
```

[1]: https://docs.oracle.com/en/java/javase/11/docs/api/java.net.http/java/net/http/package-summary.html
[2]: https://github.com/puradawid/newsletter-signup-service
[3]: https://github.com/puradawid/newsletter-signup-service/blob/master/http-client-testing/src/test/java/io/github/puradawid/newsletter/signup/io/ServiceTest.java
