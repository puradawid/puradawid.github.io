---
layout: post
title:  AEM unit testing might be real
date:   2017-09-25 13:37:10 +0200
image:  /assets/man.jpg
excerpt: TODO need to fulfill that gap
categories: craftsmanship scrum
---

![Happy developer sitting in front of a computer]({{ site.url }}/assets/man.jpg)

## I can't write unit tests for components

Yup - I was the same. It is really complex stuff. At the first glance there is no way to
implement unit testing at all. You can write some shitty redundant code for Java
classes but it is not essentially test that will do anything else besides bugging
in peers.

## Write a problem here why Java Unit Tests are shitty. A really shitty.

Bullshit.

## Write here how to split component into units:
Rethink design of component. This contains:
- Java / JavaScript model class (not necessarily though)
- Renderer (HTL / JSP / any other scripting installed in your AEM instance)
- Dialog (AKA cq:dialog)
- Template (initial JCR structure)
- cq:htmlTag

What you can unit test there:
- configuration (dialog + richtext validation) tests
- display (specific data is doing specific result)
- backend unit tests

# But why write unit tests in a first place?

# Configuration Testing

Is configuration moved into right JCR tree?
Is inputs behaves well?
Is specific custom validation is done right? (especially that one).

# Display Testing

Based on specific JCR representative, render component and check if everything needed is displayed
Different logic tested (view paths).

# Backend Unit Testing

Regular testing just functions that really matters.

# End-User experience testing

The last but not least. It is not an integration testing (almost). Its only checking how this specific component will behave in specific environment.

## The Framework

Everything needs to have a framework for doing stuff.
