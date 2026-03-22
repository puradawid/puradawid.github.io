---
layout: post
title: "Highly coupled classes are hard to understand and harder to test"
date: 2026-03-21 09:30:00 +0100
author: "Dawid Pura"
categories:
  - java
  - working
tags:
  - java
  - testing
  - design
  - coupling
image: /assets/coupling.jpg
image_alt: "A technical cover image for a post about highly coupled classes"
seo_description: "Highly coupled classes look busy in production and become worse in tests. A focused example shows why they are hard to reason about and how a small test harness can make the design cleaner."
---

![Highly coupled classes are hard to understand and harder to test](/assets/coupling.jpg)

You can usually spot a highly coupled class before you measure anything. It is the class no one wants to touch on Friday afternoon, the one with eight constructor arguments, three feature flags, two repositories, one HTTP client, and enough branching to make a simple change feel like bomb disposal.

The damage is not only architectural. Highly coupled code is difficult to read because the logic is spread across other classes, hidden conventions, and call ordering. It is difficult to test because every test needs half the system just to exercise one business rule.

That is the real pitfall: coupling does not just make code "less clean". It raises the cost of understanding and verifying behavior every single time the class changes.

<!-- more -->

## Coupling is about knowledge, not just references

It is easy to reduce coupling to a dependency count.

That count matters, but it is not the whole story. A class becomes dangerously coupled when it knows too much about how its collaborators work internally, in what order they must be called, which states they expose, and which side effects they trigger.

This class is already suspicious:

```java
class CheckoutService {
    CheckoutService(
            CartRepository carts,
            ProductRepository products,
            DiscountPolicy discounts,
            PaymentGateway payments,
            OrderRepository orders,
            InventoryClient inventory,
            AuditLog auditLog,
            Clock clock
    ) {
        // ...
    }
}
```

Maybe all of these dependencies are justified. Maybe not. The more important question is this: does `CheckoutService` coordinate a clean use case, or does it know too much about everybody else's rules?

That difference decides whether the class stays understandable.

## A small example that becomes hard to read very quickly

Here is the kind of code that often appears after a few iterations of "just add one more rule":

```java
class CheckoutService {

    Receipt checkout(String cartId, String paymentToken) {
        Cart cart = carts.findById(cartId)
                .orElseThrow(() -> new IllegalArgumentException("Cart not found"));

        if (cart.items().isEmpty()) {
            throw new IllegalStateException("Cart is empty");
        }

        CustomerProfile customer = profiles.load(cart.customerId());
        Discount discount = discounts.resolveDiscount(
                customer.tier(),
                cart.totalValue(),
                clock.instant());

        Money discountedTotal = cart.totalValue().subtract(discount.amount());

        if (!inventory.isReservationRequired(cart.warehouseId())) {
            auditLog.log("Skipping reservation for warehouse " + cart.warehouseId());
        } else {
            for (CartItem item : cart.items()) {
                InventorySnapshot snapshot = inventory.getSnapshot(item.sku());
                if (snapshot.available() < item.quantity()) {
                    auditLog.log("Stock too low for " + item.sku());
                    throw new IllegalStateException("Insufficient stock");
                }
            }
        }

        PaymentResult paymentResult = payments.charge(
                customer.paymentAccountId(),
                discountedTotal,
                paymentToken);

        if (!paymentResult.accepted()) {
            auditLog.log("Payment rejected for cart " + cartId);
            throw new IllegalStateException("Payment rejected");
        }

        Order order = orders.save(Order.from(cart, discount, clock.instant()));

        if (inventory.isReservationRequired(cart.warehouseId())) {
            for (CartItem item : cart.items()) {
                inventory.reserve(item.sku(), item.quantity(), order.id());
            }
        }

        carts.markCheckedOut(cartId);
        auditLog.log("Checkout completed for order " + order.id());

        return Receipt.from(order, paymentResult.authorizationId());
    }
}
```

None of these lines look exotic on their own. The problem is the combined mental load.

To understand `checkout()`, the reader must track:

- cart loading rules
- discount resolution rules
- warehouse reservation policy
- inventory snapshot semantics
- payment gateway behavior
- order persistence side effects
- audit logging noise mixed with the actual business flow

The method is not only long. It forces the reader to simulate multiple subsystems at once. That is what high coupling feels like in practice.

## The test story is usually worse than the production story

Now imagine writing tests for the method above.

You want one test that verifies checkout succeeds when stock is available and payment is accepted. Another test should cover rejected payment. Another should cover warehouses that skip reservation. Another should check stock failure. Another should verify discount application.

Very quickly your tests start looking like this:

```java
class CheckoutServiceTest {

    @Test
    void shouldCheckoutCart() {
        when(carts.findById("C-1")).thenReturn(Optional.of(cart()));
        when(profiles.load("customer-1")).thenReturn(profile());
        when(discounts.resolveDiscount(any(), any(), any())).thenReturn(new Discount(Money.of(10)));
        when(inventory.isReservationRequired("warehouse-1")).thenReturn(true);
        when(inventory.getSnapshot("keyboard")).thenReturn(new InventorySnapshot(20));
        when(payments.charge(any(), any(), any())).thenReturn(PaymentResult.accepted("AUTH-1"));
        when(orders.save(any())).thenReturn(savedOrder());

        Receipt receipt = service.checkout("C-1", "token");

        assertThat(receipt.orderId()).isEqualTo("O-1");
        verify(inventory).reserve("keyboard", 1, "O-1");
        verify(carts).markCheckedOut("C-1");
    }
}
```

This test is not documenting business behavior very well. It is mostly documenting the implementation structure.

The test knows too much:

- which collaborators are queried
- in which order some conditions are checked
- which intermediate data must be manufactured
- which side effects happen directly in the method

When a test becomes a ceremony of mocks, stubs, and verification details, it is often exposing a design problem rather than a testing problem.

## The refactor is not "extract more methods"

Splitting `checkout()` into five private methods can improve formatting, but it usually does not reduce coupling. The same class still knows everything.

A better direction is to reduce what one unit needs to know.

For example:

- one component prepares a `CheckoutRequest`
- one component validates stock policy
- one component performs payment
- one component persists the final order

The application service keeps the use-case flow, but each step talks to a narrower abstraction.

```java
class CheckoutService {

    private final CheckoutContextLoader contextLoader;
    private final StockGuard stockGuard;
    private final PaymentProcessor paymentProcessor;
    private final OrderFinalizer orderFinalizer;

    Receipt checkout(String cartId, String paymentToken) {
        CheckoutContext context = contextLoader.load(cartId);
        stockGuard.ensureAvailable(context);
        PaymentConfirmation payment = paymentProcessor.charge(context, paymentToken);
        return orderFinalizer.finish(context, payment);
    }
}
```

This is still orchestration, but the orchestration is readable. More importantly, each dependency now hides a coherent rule set instead of leaking five smaller decisions into one big method.

## A test harness helps when the use case still matters as one flow

There is a common trap here too. Developers refactor the production code, but tests remain a pile of low-level mocks.

When you want to test a use case end to end at the application-service level, a small test harness is often the right compromise. It gives you a single place to assemble fakes, defaults, and readable scenario setup.

```java
class CheckoutHarness {

    final InMemoryCartRepository carts = new InMemoryCartRepository();
    final StubCheckoutContextLoader contextLoader = new StubCheckoutContextLoader();
    final StubStockGuard stockGuard = new StubStockGuard();
    final StubPaymentProcessor payments = new StubPaymentProcessor();
    final FakeOrderFinalizer orders = new FakeOrderFinalizer();

    final CheckoutService service = new CheckoutService(
            contextLoader,
            stockGuard,
            payments,
            orders
    );

    CheckoutHarness withSuccessfulCheckout() {
        contextLoader.with(defaultContext());
        payments.accept("AUTH-1");
        return this;
    }

    Receipt checkout() {
        return service.checkout("C-1", "token");
    }
}
```

And then the test becomes about behavior again:

```java
class CheckoutServiceTest {

    @Test
    void shouldReturnReceiptForSuccessfulCheckout() {
        CheckoutHarness harness = new CheckoutHarness()
                .withSuccessfulCheckout();

        Receipt receipt = harness.checkout();

        assertThat(receipt.authorizationId()).isEqualTo("AUTH-1");
        assertThat(harness.orders.savedOrders()).hasSize(1);
    }
}
```

This is not magic. The harness works because the design got narrower first. If the service still depended on eight low-level collaborators with complicated interactions, the harness would just become another large object graph.

But once the use case is shaped around a few meaningful boundaries, the harness gives you three benefits:

- readable scenario setup
- reusable defaults for the happy path
- tests that describe outcomes instead of implementation trivia

## Why the harness is worth keeping

Some teams avoid test harnesses because they look like extra code. That is short-term thinking.

If a use case matters enough to deserve many tests, it usually deserves a clear testing interface too. Otherwise every test reassembles the same collaborators, defaults, and mock behavior in slightly different ways. The duplication spreads, and eventually changing one rule means repairing ten tests by hand.

A good harness is not a testing trick. It is a pressure valve for design complexity.

It also exposes whether the production code is still too coupled. If building the harness is painful, the system is telling you something useful.

## A practical rule for spotting dangerous coupling

Be suspicious when a class:

- needs many collaborators just to execute one business action
- branches on the internal state or policy of other subsystems
- mixes validation, orchestration, persistence, remote calls, and logging in one method
- requires tests with many mocks just to cover a basic scenario
- becomes clearer only after you explain surrounding classes for ten minutes

None of these signals alone proves the design is wrong. Together they usually mean one class is carrying too much knowledge.

## Conclusion

Highly coupled classes are dangerous because they fail twice. First they are hard to understand in production. Then they are hard to verify in tests.

The fix is rarely more mocking and rarely just extracting private methods. The useful move is to reduce how much one class needs to know, push detailed policies behind narrower abstractions, and give important use cases a small test harness that keeps tests readable.

When a class knows too much, every change becomes detective work. When the boundaries are cleaner, both the code and the tests start telling the same story.
