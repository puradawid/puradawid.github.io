---
layout: post
title:  "Data classes in Java - runtime underperformance vs code readability"
date:   2018-12-19 08:00:00 +0200
image:  /assets/programming_post.jpg
seo_description: How does creating data classes impact on JVM performance?
categories: java
---

![Screen with some code](/assets/programming_post.jpg)

> BTW: Funny thing. Let's go back to the day I started writing this blog. I thought I would never find enough topics to blog weekly. Now, the number is amazing. Optimistically, I should write about all of them in 2090. I am just saying - regardless to many people's opinion, the blog exists.

I recently wrote a constructor:

    Cuboid(double width, double height, double depth, byte r, byte g, byte b)

It doesn't look right. There are many values of the same (and similar, like bytes-doubles) type. On the other hand, what can be wrong with many parameters? I started to instantiate these cuboids. The order of parameters was obvious but I had to check it few times - it's very painful. And, yet, I wrote it myself! What if someone else will try to use it?

But hey, I can create additional data classes, right? So, I created two POJOs (Dimension and Colour) and changed the constructor to:

    Cuboid(Dimension dimension, Colour colour)

Parameters now are related to the purposes they serve: dimension and colour. During the code review I received an honest but scary feedback though:

> Classic Daw. Are you mad? This is really inefficient way, you are creating new instances! R U MAD?!?!?!?!?!?!

It made me nervous. Is creating these classes a bad thing? We are not writing here some serious, highly-performing stuff, just regular code that helps other people to solve their problems. I was really confused - is the guy right? Many people would say that object instantiation takes too much time in JVM. They are correct, however, the next question is: "How long?".

I needed to know. It is obviously an additional work to a computer but the advantage is significant for other programmers' work. I had to test in on my own. Let's do the microbenchmarking.

<!-- more -->

It is a simple benchmark. Durations of creating an instance by plain-parameters constructor:

    PlainParametersCuboid cuboid = new PlainParametersCuboid(w++, h++, d++, 1, 1, 1);

and the data-structured one:

    DataStructureParametersCuboid
                cuboid = new DataStructureParametersCuboid(new DataStructureParametersCuboid.Dimension(w++, h++, d++), new DataStructureParametersCuboid.Colour(1, 1, 1));

are measured with also doing a simple calculation of volume (width * height * depth) in order to not let JVM optimize bytecode and remove these parameters as useless. 

The code looks simple ([here][1] is the GitHub repo):

    public class App {
        private static final int WARMUP_CYCLES = 100000;
        private static final int TRIAL_CYCLES = 1000;

        private static volatile double t;

        public static void main(String[] args) {
            PerformanceTest pt;

            if ("non-struct".equals(args[0])) {
                pt = new PlainValuesConstructorPerformanceTest();
            } else {
                pt = new DataStructuredConstructorPerformanceTest();
            }

            double sum = 0.0;

            for (int i = 0; i < WARMUP_CYCLES; i++) {
                pt.perform(10000);
            }

            for (int i = 0; i < TRIAL_CYCLES; i++) {
                double singleResult = pt.perform(10000);
                sum += singleResult;
            }

            System.out.println("Avg. result = " + (sum / TRIAL_CYCLES));
        }

        private static abstract class PerformanceTest {
            double perform(int howManyTimes) {
                int w = 1;
                int h = 1;
                int d = 1;
                long start = System.nanoTime();
                for (int i = 0; i < howManyTimes; i++) {
                    t = createAndCalculate(w++, h++, d++);
                }
                long stop = System.nanoTime();
                return (stop - start) / (double) howManyTimes;
            }

            abstract double createAndCalculate(int w, int h, int d);
        }

        private static class DataStructuredConstructorPerformanceTest extends PerformanceTest {

            @Override
            double createAndCalculate(int w, int h, int d) {
                DataStructureParametersCuboid
                    cuboid = new DataStructureParametersCuboid(
                    new DataStructureParametersCuboid.Dimension(w, h, d),
                    new DataStructureParametersCuboid.Colour(1, 1, 1));
                return cuboid.volume();
            }

        }

        private static class PlainValuesConstructorPerformanceTest extends PerformanceTest {

            @Override
            double createAndCalculate(int w, int h, int d) {
                PlainParametersCuboid cuboid = new PlainParametersCuboid(w, h, d, 1, 1, 1);
                return cuboid.volume();
            }

        }
    }

There are two things that has to be explained: `PerformanceTest` class and usage of volatile. 

#### `PerformanceTest` class

The abstract class is not an optimisation of any sort. Both performance tests are the same in terms of repeating steps and counting results - they differ only in instantiating objects and performing calculation. I could use the model Strategy Pattern here, however having an abstract method is quite enough to remove the duplication I faced here.

#### Use `volatile double t` instead of `double t` or not using it at all

It's a hack for JVM optimisation. Normally, this loop would be enrolled by a compiler. JVM will notice that we don't care about previous values so it can remove the function evaluation in a first place. The performance test should not benefit from this operation - every execution has to be evaluated and measured afterwards. `volatile` forces this behaviour.

### The Results

Let's run both tests:

    $ java -jar test.jar non-struct
    Avg. result = 2.902031499999995

    $ java -jar test.jar struct
    Avg. result = 11.091340899999997

Data structured (so creating additional instances of classes only for having clearer code) takes 11 nanoseconds comparing to raw data passing which takes 3 nanoseconds. It's almost 4 times more, however I suspect 10 or 100 at least. Where is the "omg instantiating new objects will ruin performance" thing?

Obviously, it costs few nanoseconds. If you are doing some super-duper-performing real-time operations that cares about these, you probably need to enroll data classes into direct values. Otherwise, well, I see no point in having code hard to read and understand at first glance. If you can use 2-3-4 parameters methods with only ints or strings - it's only because you used to it. No one else did. Job stability looks really nice as I [found out on the reddit][2] but come one you don't need to artificially boost it.

## Further reading about microbenchmarking

Have you ever benchmarked code on your own? Do you know how to measure performance properly and be the geekest geek other geeks know? I recommend you ["Java performance: The Definitive Guide"][3] - it's starting from really fundamentals how to measure code and system performance, metrics of it, what are the downsides of being more performant and when optimise things.

If you disagree or have a better idea how to make these constructors more readable and fast at once, let me know in the comments section below.

[1]: https://github.com/puradawid/java-constructor-microbenchmark
[2]: https://www.reddit.com/r/programming/comments/a6opy6/thoughts_on_interviewing_at_big_tech_companies/ebx5mn3/
[3]: https://amzn.to/2Cme1m9
