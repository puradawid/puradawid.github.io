---
layout: post
title:  "Java 11 HTTP client async call - example"
date:   2019-02-21 19:00:00 +0200
image:  /assets/typing.jpg
seo_description: HttpClient's sendAsync method briefly explained 
categories: working
---

![Typing asynchronously](/assets/typing.jpg)

As I mentioned in my previous post about [Java 11 HTTP client][4], API comes with asynchronous method for making requests. Boom! That's your head, it blows up.

I wanted to write an interesting piece of code so I did partially. An asynchronous website crawler! It isn't very useful though, I don't think Google engineers will be interested even if it makes lovely fart sounds, which it doesn't.

TLDR; I don't find this method very useful for things like crawling websites, especially there is no single point of data exchange, however it looks very useful for not sequence-sensitive activities. The call itself is simple enough to understand and apply to your codebase though.

Here it is: the shiny `HttpClient::sendAsync` method! This time I am going to crawl my girlfriend's [blog about having cats at home][1], which I guess it's worth to check out if you have a nasty fur ball already or going to have one. It's polish language only, but for God sake, can't you use Google translator? I am writing this blog with its help all the time. You're welcome :).

<!-- more -->

[The code][3] below is based on recursive reviewing every HTML page it enters, listing all links and going  deep down.

{% highlight java %}
class AsyncCrawl implements Crawling {

    private HttpClient client = HttpClient.newBuilder().build();

    @Override
    public Set<String> allPages(String host, String path) {
        return getUrls(new HashSet<>(), host, path).join();
    }

    private CompletableFuture<Set<String>> getUrls(Set<String> known, String host, String path) {
        if (known.contains(path)) {
            return CompletableFuture.completedFuture(known);
        }
        Set<String> withCurrent = new HashSet<>(known);
        withCurrent.add(path);

        HttpRequest getRequest = HttpRequest.newBuilder(URI.create(host + path)).GET().build();
        return client.sendAsync(getRequest, HttpResponse.BodyHandlers.ofString()).thenApply(r -> {
               List<String> links = new Page(r.body(), host).links();
               return links.parallelStream()
                    .map(x -> {
                        Set<String> allBut = new HashSet<>(links);
                        allBut.remove(x);
                        allBut.addAll(withCurrent);
                        return getUrls(allBut, host, x);
                    })
                    .collect(() -> new HashSet<>(),
                        (a, b) -> a.addAll(b.join()),
                        (a, b) -> a.addAll(b));
            }
        );
    }
}
{% endhighlight %}

So the [`CompletableFuture`][2] class is coming from `java.util.concurrent` package and every Java enthusiast should be familiar with it. In this particular case, I put all of future responses into a collection and joining (waiting for completion) them afterwards. It's not the best solution here but as I know you will come up with better solution in this case as well. I count on you!

I was using few asynchronous API for fetching data. They were relatively harder to use than this one. I am really happy to announce that we have a proper tool for making HTTP request **built into** JDK framework. You have to know really little to use it. Now, go play!

[1]: https://kociamadka.pl
[2]: https://docs.oracle.com/javase/8/docs/api/java/util/concurrent/CompletableFuture.html
[3]: https://github.com/puradawid/simple-http-crawler-java11
[4]: {% post_url 2019-01-04-http-client-api-java-11 %}
