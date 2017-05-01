---
layout: post
title:  "AEM Component DSL - The Idea"
date:   2016-10-01 13:37:10 +0200
categories: adobe experience manager aem programming dsl
---

Recently I am working mostly with Adobe Experience Manager product which is quite extended and complex CMS based on Apache Sling. This powerful tool is well-organised but has some features that I didn"t get as far.

# Component in AEM

Component, in a matter of AEM, is generally a one piece of website that can be drag&dropped by developer to particular page and configured. Generally it contains some kind of data. As an author (which means that I am creating page) I want to store/alter some data here and it should be displayed or somehow different affects the final web page I am working on.

Component is based on:

* Data model (not necessarily but often written as Java/JavaScript class/object)
* Dialog (XML file) contains a definition for Author"s form input (configuration per instance)
* Template (XML file) initial data for component (what is fulfilled in JCR after author drops component on page (parsys))
* Additional EditConfig (which defines how component can behave in a matter of AEM editor) XML file

After a more than year working with AEM and those component I am concerned about such approach. First of all, all those files have to contain a specific knowledge about data structure in component and its not validated in any way (it might be by testing, automatic or manual) against real structure (anyway its hard to predict which one is correct - model? Possibly.)

Today I am working on [Kutlang][0] project to define a DSL based on Scala to generate all those files in one working script. For example:

{% highlight scala %}
val componentStructure = Structure(
  StringField("name", WithDefault("MyComponentName")),
  NodeField("myNode",
    StringField("additionalData"))
)

val dialog = DefaultDialog(
  TextField(componentStructure.pn("name"), WithTooltip("Add name")),
  For(componentStructure.pn("myNode"), node => TextField(node.pn("additionalData"), Required))
)

Component(
  "/apps/myCompany/components/newComponent",
  HtlRenderer("defaultRenderer.html"),
  componentStructure,
  dialog,
  Settings(Action.Edit, Action.Insert, Action.Delete)
  WrapperTagClass("my-component-class-name")
)

{% endhighlight %}

Generally, its a concept to create a automatically generated components source (plain one as far) - prevents consistency, easy to maintain and verify correct behaviour.


[0]: https://github.com/puradawid/kutlang
