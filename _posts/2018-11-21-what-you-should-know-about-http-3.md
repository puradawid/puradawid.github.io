---
layout: post
title: "What should we know about HTTP/3?"
date: 2018-11-21 13:37:10 +0200 
image: /assets/http3.png
seo_description: "HTTP/3 main difference. How HTTP/3 is different to HTTP/2"
categories: blogging
---

![Jekyll on Vagrant](/assets/http3.png)

The era of HTTP/2 is almost here.

[HTTP/3][2]? Not so fast. The standard is still in progress but big player is using it already. Which one? Google of course - actually they implemented QUIC protocol in... Chrome 29. With 28th of October we are speaking about HTTP/3, not QUIC anymore.

There are few nice docs about the protocol and hints how to build a server. We are going to answer question "what does HTTP/3 means? Should I throw away my knowledge about HTTP stack away and learn something new?"

tl;dr is: no. The Key Difference is the **Transport Protocol**.

<!-- more --> 

HTTP/3 shifts from TCP to UDP. The model of request/response doesn't change anyhow but the technicals about making a connection (or rather "sending a message") are different. The following idea is to make transport protocol more dependent on actual protocol implementation rather leaving everything to TCP: packets lenght and **order**, which are quite different to HTTP/2 multiplexing.

## Performance improvement?

Essentially: yes. Because UDP is less strict about the order of received packets it can now use the HTTP/2 multiplexing even one of the resources are lost. Moreover, the performance with changing network during making requests is improved. 

More flexibility brings also more optimisation. Encryption packets have optimized size and TLS is actually done as a part of connection handshake. How awesome!

## Any downsides?

Yes but not many. The problem is about sending UDP packets across the network. We, humans, used to live with TCP as the most important part of communication. We tuned up routers and other devices to work better with TCP than UDP. What would happen with some old, forgotten devices somewhere out there? They probably are going to be replaced or reconfigured, after some downtime first.

Because QUIC is already used as an experimental protocol in Chrome browser, many people are already complaining on QUIC issues. We know already there are problems with making UDP connections. You can disable this one easily in [Chrome flags][1]. I wouldn't recommend that unless the network is not allowing you to make UDP connection at all.

## So...?

If you never debug HTTP calls on TCP level you probably won't even notice the difference. On the other hand, it's good to know what is the key change coming with HTTP/3 and maybe astonish interviewer on your next interview!

## Next?

I am going to prepare some virtual machine (probably some Vagrant file) to show you how to build simple reverse proxy for HTTP/3 and test your own website locally. Remember, if you want to check HTTP/3 in general out you probably already using it in your Chrome browser when googling stuff!

[1]: chrome://flags/#enable-quic
[2]: https://en.wikipedia.org/wiki/HTTP/3
