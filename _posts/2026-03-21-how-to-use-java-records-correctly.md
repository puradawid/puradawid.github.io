---
layout: post
title: "How to use Java records correctly"
date: 2026-03-21 08:00:00 +0100
author: "Dawid Pura"
categories:
  - java
  - working
tags:
  - java
  - records
  - design
  - architecture
image: /assets/records.png
image_alt: "A technical cover image for a blog post about Java records"
seo_description: "Java records are great for immutable value data, but they are the wrong tool for entities, mutable models, and types whose meaning depends on lifecycle or framework behavior."
---

![How to use Java records correctly](/assets/records.png)

Java records are easy to like. They remove a lot of constructor and accessor noise, they make intent visible in one line, and they push code toward immutability. That combination is strong enough that many teams start treating `record` as a better `class`.

That is the first mistake.

`record` is not a shorter syntax for every model type in your system. It is a very specific statement: this type is a transparent carrier of values, and its identity is fully described by those values. When that statement is true, records are excellent. When it is false, records make the code look cleaner while making the design worse.

<!-- more -->

## What a record really means

This record:

```java
public record Money(BigDecimal amount, Currency currency) {
}
```

is not just shorthand for "please generate boilerplate". It also says a few important things:

- the state is fixed after construction
- `equals()` and `hashCode()` are based on all components
- the public API is the declared state
- the type is primarily about data, not lifecycle

That is why records work best for values. If two instances with the same state should be treated as equivalent, a record is usually a good fit. If the type has a more complicated identity story than "these fields together", stop and think harder.

In practice, a record is a good choice when the whole meaning of the type can be reduced to: "this set of values, validated once, then safely passed around".

## Where records fit naturally

The easiest wins are DTO-style types and small value objects.

```java
public record CreateUserCommand(
        String email,
        String displayName,
        Locale preferredLocale
) {
    public CreateUserCommand {
        Objects.requireNonNull(email);
        Objects.requireNonNull(displayName);
        Objects.requireNonNull(preferredLocale);
    }
}
```

This is a solid record because:

- it has one clear purpose
- the fields define the whole meaning
- immutability is helpful
- value-based equality is not surprising

Other strong candidates are:

- request and response models at service boundaries
- configuration snapshots
- event payloads
- query results
- small domain values like `Money`, `EmailAddress`, `Coordinates`, or `DateRange`

These are all cases where a type mostly exists to carry validated state through the system without hidden behavior.

## Validation belongs in the constructor, not somewhere later

One common misuse is to make a record look immutable while allowing invalid state to sneak in.

```java
public record Percentage(int value) {
    public Percentage {
        if (value < 0 || value > 100) {
            throw new IllegalArgumentException("Percentage must be between 0 and 100");
        }
    }
}
```

This is the right direction. The record either exists in a valid form or it does not exist at all.

The wrong direction is to create a record with unchecked data and then rely on some service, mapper, or controller to "fix it later". That turns a record into a polite-looking bag of risk. If you want a value type, enforce the value rules at construction time.

This is especially important because record accessors are trivial by design. If validation is missing in the constructor, there is no other natural place for the type to defend itself.

## Records are a bad fit for entities

A lot of problems start when teams use records for persistence entities or aggregate roots because the syntax looks attractive.

```java
public record Customer(Long id, String email, CustomerStatus status) {
}
```

This looks neat, but most real entities are not value objects.

An entity usually has:

- identity that survives field changes
- lifecycle transitions
- framework requirements around proxies, lazy loading, or no-arg construction
- behavior that is not reducible to "all fields are public state"

If a customer changes email address, is it still the same customer? Of course it is. That already tells you the type has identity semantics, not pure value semantics. Record-generated equality on every component is usually the wrong story there.

Many ORM-heavy designs also interact badly with records. Some frameworks support records in limited places, some do not, and some technically support them while still making the resulting mapping awkward. Even when you can force the integration to work, it does not mean the model is conceptually right.

If a type lives in a persistence lifecycle, think twice before turning it into a record just to save boilerplate.

## Records are also poor containers for mutable state

Another trap is placing mutable components inside a record and assuming the record itself is therefore deeply immutable.

```java
public record BatchJob(String name, List<String> steps) {
}
```

This record is only shallowly immutable. The `steps` reference cannot change, but the list itself can still be modified by anyone holding it.

That leads to a dangerous mismatch between how the code reads and how it behaves. Readers see `record` and expect safe, value-like data. What they actually get is shared mutable state wearing a clean suit.

If you put collections inside records, prefer defensive copying:

```java
public record BatchJob(String name, List<String> steps) {
    public BatchJob {
        steps = List.copyOf(steps);
    }
}
```

The same warning applies to arrays, mutable date types, and any object whose contents can change behind your back.

## Derived behavior is fine, hidden semantics are not

Some developers become too strict and conclude that records must contain no methods at all. That is also wrong.

Methods on records are fine when they preserve the "transparent value" model.

```java
public record DateRange(LocalDate from, LocalDate to) {
    public DateRange {
        if (from.isAfter(to)) {
            throw new IllegalArgumentException("from must not be after to");
        }
    }

    public boolean contains(LocalDate date) {
        return !date.isBefore(from) && !date.isAfter(to);
    }
}
```

This is good record usage. The method expresses logic derived directly from the components.

The design starts getting worse when the record becomes responsible for orchestration, database access, caching, retries, or business workflows. At that point the type is no longer a value carrier with some convenient logic. It is turning into a service with a misleading shape.

The useful rule is simple: behavior that explains the value is good; behavior that manages a lifecycle is a sign you probably want a class.

## Public records can freeze bad APIs

Records are very explicit. That is helpful internally, but it can become a liability at public boundaries.

When you publish a record in a long-lived API, every component becomes part of the visible contract. Reordering, renaming, splitting, or rethinking components later can be much more painful than it first appears.

This matters in:

- public libraries
- integration contracts between teams
- serialized events
- external REST or messaging schemas

The pitfall is not that records are unstable. The pitfall is that they make it very easy to expose your current internal shape as if it were the correct long-term shape.

Sometimes that is fine. Sometimes you really do want a transparent, stable contract. But if the model is still evolving, a record can lock in accidental decisions early.

## Records do not remove framework friction

There is also a practical pitfall: records reduce Java boilerplate, but they do not erase framework assumptions.

A team adopts records and expects everything else to become simpler. Then reality arrives:

- one framework wants a no-argument constructor
- another tool expects mutable bean setters
- a serializer needs specific annotations
- a mapper produces awkward conversions

None of this means records are bad. It means records have semantics, and old frameworks were often built around a different object model.

That tradeoff is acceptable for boundary DTOs or internal values. It is less acceptable when the type sits in the center of a framework-heavy design and every surrounding tool needs special handling.

If using a record creates adapters only at the edges, that is usually fine. If the whole stack starts fighting the choice, the syntax win is not worth it.

## A practical decision rule

Use a record when all of these are true:

- the type is primarily data
- the full state is known at construction time
- value-based equality is correct
- immutability is desired
- exposing the components is not a design leak

Use a class when one or more of these are true:

- identity matters more than current field values
- the object has lifecycle transitions
- mutation is part of the design
- the framework model pushes strongly against records
- the type contains behavior that goes beyond interpreting its own state

That is the distinction that matters. Not "can I technically express this as a record?" but "does this type actually behave like a value?"

## Conclusion

Java records are not a universal replacement for classes. They are a precise tool for value-shaped types, and they are very good at that job.

Use them for commands, responses, events, configuration snapshots, and small domain values. Be careful with entities, mutable models, public contracts, and framework-centric types. The cleaner syntax is real, but it is not the main benefit. The real benefit is making value semantics explicit.

If the whole meaning of a type is "these values together", a record is probably the right answer. If the type is really about identity, lifecycle, or hidden framework rules, a normal class will be more honest.
