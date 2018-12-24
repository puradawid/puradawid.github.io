---
layout: post
title:  "Bug się rodzi - the most common Java bugs"
date:   2018-12-22 08:00:00 +0200
image:  /assets/xmas.jpg
seo_description: The list of 5 most common bugs in Java code.
categories: java
---

![Santa with laptop]({{ site.url }}/assets/xmas.jpg)

Hello, fellow programmers! First of all, I wish you all Merry Christmas! Spend this time well, there is not many moments in the year for rebuilding family bounds these days. This is the special, Christmas blog post. I named it that because it's fun comparison with one of the most known Polish carols (listen it [here][1], play it now) - "Bóg się rodzi". The name is "God Is Born". Polish word for God - "Bóg" - reads as same as "Bug". How programming-ready this language is!

Today, we are going to discover the most common Java bugs I have seen in my Java journey. Hope you won't find them under the Christmas Tree :D (that's another polish tradition - we are putting presents under the tree).

<!-- more -->

## `==` and `equals` methods

Classic one, right? Who didn't make this mistake yet is not experienced enough!

```
String first = "Merry Christmas!";
String second = "Merry Christmas!";
first == second // true or false?
```

This particular case - it depends. If your JVM keeps Strings with the same values as the same objects (String pooling) you are fine. Otherwise, well, these are different objects. It might simply not work on other machine. You are welcome!

Essentially the problem is Java. Sorry, my old friend, but this is your fault. `==` is comparing references instead of values. Therefore, `equals` is for checking objects equality and `==` should be for checking the particular instance.

I keep thinking that `==` returns `true` only for subset of cases which `equals` would. Happy to say that the most of IDEs and static checkers would inform you about this inequality of `equals` and `==`.

## `null`? Who cares!

Consider this poor `equals` method:

```
boolean doSome(Something o) {
  return o.whateverNeeded();
}
```

Put null in `o` and see how it fails with `NullPointerException`. If this is too obvious consider having maps that returns null because there is no such value there:

```
doSome(map.get(someOtherKeyDynamicallyAssigned)); // there is no assigned with this key, but this code looks legit, no?
```

Remember to check nulls where it is appropriate. It's nice to use `@Nullable` and `@NonNull` annotations with your static code checker these days.

## Empty `catch` block

Alright mate, I need file reading so:

```
new FileInputStream(new File(filename));
//some other activities below
```

But the compiler is saying the exception is not catched. Cool, let's catch it:


```
try {
  new FileInputStream(new File(filename));
  //some other activities below
} catch (Exception ex) {
  //what could possibly happen bad here? Empty!
}
```

It happens a lot for programmers that are in rush. This kind of code might even go to production. Imagine finding a root cause why some data is empty.

## Sloppy overriding base class methods

This one is exciting - mostly because it's hard to find out.

```
class First {

  String saveToFile() {
    String filename = getName() + ".txt";
  }

  String getName() {
    return "someName"; // imagine it's generated
  }
}

class Second extends First {

  @Override
  String getName() {
    return "Wow!!!1111111oneone$!!@#$%^&&"; // I need a fancy name here for toString method
  }
}
```

It's actually bidirectional fault - both `First`'s and `Second`'s. First should declare its method as final or hide it entirely. Or use internal method for both cases, like that:


```
class First {

  String saveToFile() {
    String filename = name() + ".txt";
  }

  String getName() {
    return name();
  }

  private String name() {
    return "someName"; // imagine it's generated
  }
}

class Second extends First {

  @Override
  String getName() {
    return "Wow!!!1111111oneone$!!@#$%^&&"; // I need a fancy name here for toString method
  }
}
```

The Second class should not override that method otherwise. You need to know the codebase you are working on.

## Nested `for` loopz `i` `j` `l`

Nested loops are visually weird.

```
for (int i = 0; i < size; i++) {
  for (int j = 0; l < i; j++) {
    for (int l = 0; l < j; l++) {
      doSomeOperationHere(i, j, l);
    }
  }
}
```

Any issue here? You probably get my point here already. It's better to name it differently a little if needed. It's hard to understand which value represents which dimension or what is the meaning.

## Erm, the default constructor?

That's not your fault. There are few frameworks that requires default constructor to instantiate the class or do some other weird operations. That's fine, however there are moments that you don't need default constructor at all (which is at the same access level as the class itself).

```
public class AwesomeUtil {
  static int a = 1;
  static int b = 2;

  public static int calculate() {
    return a + b;
  }
}

// somewhere else...
Awesome a = new Awesome(); // woow
```

Yeah, so in this case you want to declare non-arg constructor as a private one.

## Anyway...

It was a short list - things that first come to my mind when I am looking for "bugs" that I have done many times. Even today, if something is not working my first "scrolling" across the code is for looking these nasty mistakes. Probably I won't learn to trust myself :)

Hope you will avoid these basic mistakes - you probably already do. I wish you the best - Merry Christmas!

[1]: https://www.youtube.com/watch?v=SX5xO4BPRIo
