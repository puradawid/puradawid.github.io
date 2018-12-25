---
layout: post
title:  "Testing Java code performance with JMH"
date:   2018-12-28 08:00:00 +0200
image:  /assets/JMH.jpg
seo_description: The list of 5 most common bugs in Java code.
categories: java
---

![JMH on code background](/assets/JMH.jpg)

Recently, I wrote a blog post about [performance of Java Data classes][1]. Many people pointed me out I did not write a JMH test. Instead, I wrote simple microbenchmark on my own, based on the [Java performance book][2]. Because it is, apparently, *unreliable* I had to write JMH test as well and compare results - trying to explain why it's different. Let's answer outstanding questions.

What do you think? Am I, in fact, totally wrong here?

<!-- more -->

## How to run JMH

Not much code has to be used. At first, I had to create a submodule from an archetype:

```
mvn archetype:generate \
  -DarchetypeGroupId=org.openjdk.jmh \
  -DarchetypeArtifactId=jmh-java-benchmark-archetype
```

The submodule already contains all needed things. The pom was missing a dependency to classes for testing, so I added it there.

```
@Fork(10)
@Warmup(iterations = 20)
@Measurement(iterations = 50)
public class MyBenchmark {

    @State(Scope.Benchmark)
    public static class Dimension {
        public int w = 0;
        public int h = 0;
        public int d = 0;
    }

    @OutputTimeUnit(TimeUnit.NANOSECONDS)
    @BenchmarkMode(Mode.AverageTime)
    @Benchmark
    public double testPlainParametersMethod(Dimension d) {
        return new PlainParametersCuboid(d.w++, d.h++, d.d++, 0, 0, 0).volume();
    }

    @OutputTimeUnit(TimeUnit.NANOSECONDS)
    @BenchmarkMode(Mode.AverageTime)
    @Benchmark
    public double testDataStructuredParametersMethod(Dimension d) {
        return new DataStructureParametersCuboid(
            new DataStructureParametersCuboid.Dimension(d.w++, d.h++, d.d++),
            new DataStructureParametersCuboid.Colour(0, 0, 0)).volume();
    }

}
```

Methods are similar to those used in my previous post. I am still using here a state object for having different results in order to not replace cuboids calculation with constant value. Otherwise, it isn't going to be a reliable test at all. Imagine that JIT would figure it out on its own.

## Parameters

I imagine not everyone is familiar with JMH at all. In fact, the [official documentation][3] isn't extensive - that's why people are sometimes confused about JMH in general. Fortunately, I used just several parameters in the code. Let's go through them!

#### Annotation `@Fork(10)`

The number of benchmarking forks to create for testing. JMH will instantiate these and collect results from all of them. More forks mean more accuracy but longer testing.

#### Annotation `@Warmup(iterations = 20)`

Warmup - it's a phase before testing to let JVM apply all just-in-time optimisations it has. Number of iterations means how many times your test will be run before actual, measured test.

#### Annotation `@Measurment(iterations = 50)`

Number of iterations measured for the test. More iterations - it takes more time to run.

#### Annotation `@State(Scope.Benchmark)`

Oh, this is interesting! A state is a class that is used int test, but it isn't meant to be a part of the measurement. I used it here for `Dimension`, which represents different values for every calculation. In this case, I need just one instance for the entire benchmark, so the same object is provided for every benchmark method execution.

#### Annotation `@BenchmarkMode(Mode.AverageTime)`

By default, JMH is returning a result as a number of operations per second. Comparing two results is quite difficult - higher number is a worse one. Fortunately, there is also a way to measure average time. But beware, it's returning results in seconds, so if a method takes nanoseconds result is 1^(-8) second - so you need also to change time measurement by `@OutputTimeUnit(TimeUnit.NANOSECONDS)` annotation.  

#### Annotation `@Benchmark`

The method which has to be measured. If you are not using `main` method, JMH is using for these methods in the class path.

## The results

You can run on your own! Just:

```
mvn clean install && java -jar target/benchmark.jar
```

I encourage you to do so! There might be different results for different machines, JVMs and so on and so forth! Anyway, my results are as follows:

```
# Run complete. Total time: 00:23:28

Benchmark                                       Mode  Cnt   Score   Error  Units
MyBenchmark.testDataStructuredparametersMethod  avgt  500  11.442 ± 0.768  ns/op
MyBenchmark.testPlainParametersMethod           avgt  500   6.259 ± 0.456  ns/op
```

So it's not much different than the test I did before. It's highly probable I did not warm JVM enough. My former tests took around 10 seconds rather than 23 minutes.

Conclusion: JMH framework is really simple to use and less error-prone than writing on your own. Probably if I tried to write a microbenchmark without reading [the Java performance guide][2] it would be absolutely unreliable at all.

Write microbenchmarks, test your code, have fun with performance (or better not, it's only fun for single-threaded applications) - but remember to write a code readable for other humans first!

[1]: /java/2018/12/19/data-classes-in-java-runtime-underpefrmance-vs-code-readability.html
[2]: https://amzn.to/2Cme1m9
[3]: https://openjdk.java.net/projects/code-tools/jmh/
