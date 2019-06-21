---
layout: post
title:  "SOLID in Test Automation #1: The Open Closed Principle"
date:   2019-06-20 19:00:00 +0200
image:  /assets/ocp_tests/ocp.png
seo_description: How to use Opened-Closed Principle in test automation in Java and other programming languages?
categories: java
---

![Open-Closed Principle in Test Automation](/assets/ocp_tests/ocp.png)

I know, your code works, but...

I am going to do the review of SOLID principles for tests, mixing my own experience with top-shelf publications about testing and clean code in general: let's take a look at approaches we can apply in our greenfield or brownfield projects. Do you know how to prevent rewriting all tests when implementation (but not necessarily behavior) is changing?

<!-- more -->

#### Why should I care?

For a long time of my programming career tests weren't something that I was worried about: they were very useful tool for keeping my code working as expected. At the end of the day, tests weren't part of the implementation, so who cares about tests quality? I was very eager to apply all of [Clean Code][6] rules to production code all the time, while tests remained very plain and not really ready for maintaining changes. Using tests I encouraged production code for changes but unfortunately at the same time tests weren't ready for any changes at all. Sometimes, the bad thing has happened - changes are not getting introduced to the system not because of production's tech debt but... the enormous amount of tests that were broken!

After years, my approach has been changed: tests **are** part of the production code! All of these SOLID rules I was applying for "production" classes are also applicable for tests. As [The Clean Architecture Book][2] states: test code depends on production one but not the other way around; it makes test codebase very specific component of the entire architecture but it's definitely an integrated part of the entire solution. But how to use principles like Open-Closed in tests? Test code in programming seems to be very exotic, even procedural. Test cases are recipes rather than collaborations between objects - is it even possible to write them as such?

![Tests depends tightly on production code](/assets/ocp_tests/tests_relation.png)

What is "Open-Closed" principle? It states a situation where a class is considered closed for modification (so once written we can't change it at all) and yet it is ready for extension to the some point (we will get back to that). It is usually considered as a favoring inheritance over modification; still, it doesn't explain to which point these extensions can happen - is there a way to make it 100% closed for, literally, **any** direct modification and do the extension instead?

Regarding to [Uncle Bob's whitepaper about open closed principle][1]:

> It should be clear that no significant program can be 100% closed.(...) In general, no matter how “closed” a module is, there will always be some kind of change against which it is not closed.

That means all components following OCP should define possible "extension" points in advance. Does it have to be inheriting from a base class  and changing its methods implementation in every case? No. You can also introduce patterns which are bases on abstractions, like Strategy Pattern, Method Object, etc. They also make classes opened for extension and closed for modification - at some point. Therefore, having reasonable extension points (or the lack of them) will determine whether component is following the OCP or it isn't.

Ok, so what about automation test's code? What kind of extension point should they have? I bet you know already there is no single answer to that: as long as software engineering is an unrepeatable, hard to record, creational process, multiple case studies can verify different approaches as useful and correct. But here's a general extension point that we know is valid: tests strongly depend on the production code. Hence, the production code is the vector of change we should anticipate!

Let's go with some examples:
- `AnualIncome::calculateTax()` is now using 25% tax fee instead of 20% for calculation
- `Invoice::total()` has been renamed to `Invoice::sum()`
- `OrderWebController` is not using get/set injection anymore - its dependencies are now provided by constructor

It is very clear that first example is a behavior change (actual business rule has been changed), the second one is pure refactoring and the last one is the implementation change only. Which of these changes applied should break extisting tests? In theory, following [Tomek Kaczanowski's book about unit testing][3] tests can have two types: the first one is behavior test, which checks business rules over implementation details, the second one is the collaboration verification, which finds out whether proper communication between objects is happening or not. It strongly depends on your approach and perspective, which tests should anticipate behavior change and which ones are comfortable for implementation changes. The matter of "how to do it" remains open - let's list them out then!

#### Decouple test names from implementation

![Test names that are describing behaviour are better](/assets/ocp_tests/test_naming.png)

Use proper names for your unit tests - especially test cases. Currently we have a massive discussion about keeping names in consistent form, like `testVerificationMethod` or `shouldReturnZeroIfMethodCalculateWasExecuted`. That's a flame war, and there is no right, objective answer for this discussion. Even the consistency improves readability, it doesn't make code less fragile for changes. The implementation of the code can impacts the naming too much, therefore programmer can forget changing the name of the test method in case the production method will change. Hence it's very convenient to describe behavior rather than method execution, like `testTenDollarsWithdrawalWhenNoLocalCurrencyAvailable` over `shouldReturnErrorWhenWithdrawMethodExecutedWithoutNoLocalCurrencyAvailable`. Even the latter is more descriptive, it contains implementation details - and that name might remain unchanged while `withdraw` method gets renamed to `takeTheMoniesOut` ([Fonejacker][4] joke).

#### Do you need this mock?

![Do not create mocks if not necessary](/assets/ocp_tests/test_mocks.png)

In his book, Tomek is explaining this topic to the bare metal, but here's the good rule of thumb - don't mock things you don't need to use for verification. These days Mockito is [verifying unused stubs][5], however I know that few people disabled this warnings (including myself) because there was a complex set up method that were doing all the stubbing for different test cases. That's not something I am specifically proud of! Anyway, such approach might lead to refactoring problems, and tests that don't use that mock will break. It's better to keep classes under testing as empty as possible :). Here's the other problem - there is some sort of phobia for testing more than one class at once. I wouldn't consider mocking internal classes as a good approach - you should mock things that are some sort of ports or adapters for external dependencies. Let me share a code smell heuristic with you: if all of your classes are public, especially because you need to mock them in tests then something bad is happening with your architecture.

#### Create Test API Layer in production code

![Create test API that is doing artificial changes in tested production code](/assets/ocp_tests/test_api.png)

This is very bold and professional approach, however requires a lot of engagement especially for brownfield projects. [Clean Architecture][2] says, there is a way to decouple test away from production code - by introducing testing API layer. Such API is helping with omitting things like security and makes "shortcuts" for tests to get to the point that is really needed for testing. In the same thought, Martin is suggesting to make Test API a separated component, which is only deployed for testing purposes, as it might cause security breach when it will get run on production. I have seen such API working for integration tests and it was amazing how "clean" were very complex tests - that's amazing. No doubts the Test API has to be developed 1:1 with any production code changes, however it is still a good idea to have one big pain point instead of hundreds of minor ones distributed in the entire project.

#### Don't be afraid to make additional classes just for testing
Tests should remain as simple as it is possible. However, thinking that testing code is just `setUp` + actual test method + `tearDown` and nothing more than that is way too strict and leads to misinterpretation. Unit tests are suffering a bit because of this approach - however, integration tests (especially Selenium) don't care about that rule. They are doing the testing code structure separation a bit better by introducing patterns like Page Object or Screenplay. Tests can have their own classes, in order to explain some complex settings, execution process or the entire project structure. Having such encapsulated, reasonable ideas, which are also keeping Demeter's law of course, makes tests more readable and maintainable. At the end of the day, tests should also follow DRY rule where it's convenient. In [Clean Code][6], Uncle Bob even encourages to use the Template Method Pattern for tests if it is possible in order to remove unnecessary code duplication.

#### Improve production code quality
The last - but not the least. It's actually basic TDD thing - to make the production code testable. At the end of the day, production and testing code are part of one system, which has to maintain certain level of quality in order to provide a value and be ready for changes, as they will happen eventually for every living system. Keeping code testable and readable is something that both [Tomek's][3] and [Uncle Bob's][6] books are definitely agreeing with. This topic is obviously way too broad for elaborating in this post, but you can start reading [Clean Code][6] and [Clean Architecture][2] books right now :) 

#### Read more about writing maintainable tests
As you probably noticed I was using the two authors during this time: Tomek Kaczanowski and Robert C. Martin aka Uncle Bob. Both these authors did a remarkable work in promoting test driven development (widely known as TDD) and explaining difficult concepts of writing tests. But there are different points of view as well, and I have to mention discussion between Uncle Bob and James Coplien years ago about the correctness of TDD approach. Here's the video, you can watch it and have fun. Get some popcorn before, as it would be nice a debate and you won't forget it.


{::options parse_block_html="true" /}
<iframe width="564" height="423" src="https://www.youtube.com/embed/KtHQGs3zFAM" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
{::options parse_block_html="false" /}

I honestly agree with James, however I feel like thousands light years away from the proper object-oriented programming. I hope I will get that someday though.

If you are not yet bored about testing, watch [Ian Cooper's talk about TDD revisited][7], which will definitely improve you perspective of writing code and keeping it decoupled with the implementation. That presentation made me to write this blogpost, as I believe this is the most important topic for programmer's excellence and we as a craft are not done with it yet.

#### Advertisement: puradawid.pro first Twitch programming session!

Hey, I am going to do something absolutely crazy and experimental: do the programming session on Twitch! The plan is to refresh [my old project named Voter][9] designed for collecting and analysing feedback data for live presentations (whether they suck or not). We are going to use TDD, DDD and even more meaningless acronyms we will find in the Internet! I am going to order a pizza and have fun with you folks, so appreciate any support, and you can sign up for a event below:

{::options parse_block_html="true" /}
<a target="_blank" href="https://calendar.google.com/event?action=TEMPLATE&amp;tmeid=NG5vdHMzZ2w5MW5lZjI4NDZyYWJuZGduYzEgOTE4M24xZGdnaG5kMjQ4MHM0bnI2ZmY4bzhAZw&amp;tmsrc=9183n1dgghnd2480s4nr6ff8o8%40group.calendar.google.com"><img border="0" src="https://www.google.com/calendar/images/ext/gc_button1_pl.gif"></a>
{::options parse_block_html="false" /}

[1]: https://web.archive.org/web/20060822033314/http://www.objectmentor.com/resources/articles/ocp.pdf
[2]: https://www.amazon.com/Clean-Architecture-Craftsmans-Software-Structure/dp/0134494164
[3]: http://kaczanowscy.pl/books/practical_unit_testing_junit_testng_mockito.html
[4]: https://en.wikipedia.org/wiki/Fonejacker
[5]: https://github.com/mockito/mockito/issues/384
[6]: https://www.amazon.com/Clean-Code-Handbook-Software-Craftsmanship/dp/0132350882
[7]: https://www.youtube.com/watch?v=EZ05e7EMOLM
[9]: https://github.com/puradawid/voter
