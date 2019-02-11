---
layout: post
title:  "How to make Bitcoin node connect to its network?"
date:   2019-02-11 08:00:00 +0200
image:  /assets/bitcoin.jpg
seo_description: Bitcoin node connection to P2P network explained. 
categories: working
---

![Bitcoin is going down](/assets/bitcoin.jpg)

There are a lot of crap flying around about the Bitcoin. Is it going to crush down? Is it worthless? Why did prices go down? Hell I know! Maybe people just found out "cryptocurrency" doesn't mean "privacy" and all history of transactions are public and it's matter of time to find out who did which transaction? Who knows... Don't even ask me these questions, Bitcoin is a nice introduction to the thriving market of numbers aka fintech. But, what I care the most is the technology behind.

I am fine with BTC "distributed" database (blockchain, probably only cats haven't heard about "blockchain"). Each node currently stores about 20G of transactions. It's the same gigantic ledger for every one. Well it's not the redundancy I would normally approve but whatever - it's about money. "Storing money has to be expensive" - said banker. 

Regardless to the market problems, do you know how your Bitcoin node connects to other nodes? I did not.

<!-- more -->

Let's consider [the net.cpp code of Bitcoin][1]:

{% highlight cpp %}

bool CConnman::Start(CScheduler& scheduler, const Options& connOptions)
{
  Init(connOptions);

  // Daw: cleaning up stuff phase - removed

  if (fListen && !InitBinds(connOptions.vBinds, connOptions.vWhiteBinds)) {
    if (clientInterface) {
        clientInterface->ThreadSafeMessageBox(
       _("Failed to listen on any port. Use -listen=0 if you want this."),
       "", CClientUIInterface::MSG_ERROR);
    }
    return false;
  }

  for (const auto& strDest : connOptions.vSeedNodes) {
    AddOneShot(strDest);
  }

  if (clientInterface) {
    clientInterface->InitMessage(_("Loading P2P addresses..."));
  }
  // Load addresses from peers.dat
  int64_t nStart = GetTimeMillis();
  {
    CAddrDB adb;
    if (adb.Read(addrman))
      LogPrintf("Loaded %i addresses from peers.dat  %dms\n", addrman.size(), GetTimeMillis() - nStart);
    else {
      addrman.Clear(); // Addrman can be in an inconsistent state after failure, reset it
      LogPrintf("Invalid or missing peers.dat; recreating\n");
      DumpAddresses();
    }
  }

  uiInterface.InitMessage(_("Starting network threads..."));

  fAddressesInitialized = true;

  if (semOutbound == nullptr) {
    // initialize semaphore
    semOutbound = MakeUnique<CSemaphore>(std::min((nMaxOutbound + nMaxFeeler), nMaxConnections));
  }
  if (semAddnode == nullptr) {
    // initialize semaphore
    semAddnode = MakeUnique<CSemaphore>(nMaxAddnode);
  }

  //
  // Start threads
  //
  assert(m_msgproc);
  InterruptSocks5(false);
  interruptNet.reset();
  flagInterruptMsgProc = false;

  {
    LOCK(mutexMsgProc);
    fMsgProcWake = false;
  }

  // Send and receive from sockets, accept connections
  threadSocketHandler = std::thread(&TraceThread<std::function<void()> >, "net", std::function<void()>(std::bind(&CConnman::ThreadSocketHandler, this)));

  if (!gArgs.GetBoolArg("-dnsseed", true))
    LogPrintf("DNS seeding disabled\n");
  else
    threadDNSAddressSeed = std::thread(&TraceThread<std::function<void()> >, "dnsseed", std::function<void()>(std::bind(&CConnman::ThreadDNSAddressSeed, this)));

  // Initiate outbound connections from -addnode
  threadOpenAddedConnections = std::thread(&TraceThread<std::function<void()> >, "addcon", std::function<void()>(std::bind(&CConnman::ThreadOpenAddedConnections, this)));

  if (connOptions.m_use_addrman_outgoing && !connOptions.m_specified_outgoing.empty()) {
    if (clientInterface) {
        clientInterface->ThreadSafeMessageBox(
       _("Cannot provide specific connections and have addrman find outgoing connections at the same."),
       "", CClientUIInterface::MSG_ERROR);
    }
    return false;
  }
  if (connOptions.m_use_addrman_outgoing || !connOptions.m_specified_outgoing.empty())
    threadOpenConnections = std::thread(&TraceThread<std::function<void()> >, "opencon", std::function<void()>(std::bind(&CConnman::ThreadOpenConnections, this, connOptions.m_specified_outgoing)));

  // Process messages
  threadMessageHandler = std::thread(&TraceThread<std::function<void()> >, "msghand", std::function<void()>(std::bind(&CConnman::ThreadMessageHandler, this)));

  // Dump network addresses
  scheduler.scheduleEvery(std::bind(&CConnman::DumpAddresses, this), DUMP_PEERS_INTERVAL * 1000);

  return true;
}
{% endhighlight %}

For me, JVM-based software engineer, this code looks quite unfamiliar at the first glance. I don't think idiots wrote it though. Anyway, the code is straightforward: 

* read peers (other nodes) from parameters passed to the application
* load a list from `peers.dat` file if exists
* resolve DNS in order to get the public nodes 
* load fixed addresses

Sounds ridiculous, no? It looks like there are actually nodes that are not distributed but there are few points where node can connect. Nice! It completely destroys my view of magic distributed system. 

Loading parameters from args and file are dull so I will leave them without a comment. More important thing is what happening if we don't know locations of other nodes at all.

### Loading from DNS

Here is the code. Few DNS are pre-defined and the actual lookup request is happening. What might be the problem? Well, if you are not VPN your DNS requests (which are UDPs) you can get caught or at least identified by your ISP. Not that safe, huh? 

Here is [`chainparams.cpp`][2]:

{% highlight cpp %}
// Note that of those which support the service bits prefix, most only support a subset of
// possible options.
// This is fine at runtime as we'll fall back to using them as a oneshot if they don't support the
// service bits we want, but we should get them updated to support all service bits wanted by any
// release ASAP to avoid it where possible.
vSeeds.emplace_back("seed.bitcoin.sipa.be"); // Pieter Wuille, only supports x1, x5, x9, and xd
vSeeds.emplace_back("dnsseed.bluematt.me"); // Matt Corallo, only supports x9
vSeeds.emplace_back("dnsseed.bitcoin.dashjr.org"); // Luke Dashjr
vSeeds.emplace_back("seed.bitcoinstats.com"); // Christian Decker, supports x1 - xf
vSeeds.emplace_back("seed.bitcoin.jonasschnelli.ch"); // Jonas Schnelli, only supports x1, x5, x9, and xd
vSeeds.emplace_back("seed.btc.petertodd.org"); // Peter Todd, only supports x1, x5, x9, and xd
vSeeds.emplace_back("seed.bitcoin.sprovoost.nl"); // Sjors Provoost
vSeeds.emplace_back("dnsseed.emzy.de"); // Stephan Oeste
{% endhighlight %}

I am not a network expert, but can you spoof this addresses as being in control over your home network? Let me know in a comments, really appreciate! 

### Fixed addresses 

Well, many of them. Guess what? They are automatically generated with a python script. There is a file `contrib/seeds/nodes_main.txt` that actually contains all addresses and it's just getting translated into but arrays. How clever is that? 

Here is [`chainparamsseed.h`][3]:

{% highlight cpp %}
/*
 * List of fixed seed nodes for the bitcoin network
 * AUTOGENERATED by contrib/seeds/generate-seeds.py
 *
 * Each line contains a 16-byte IPv6 address and a port.
 * IPv4 as well as onion addresses are wrapped inside an IPv6 address accordingly.
 */
static SeedSpec6 pnSeed6_main[] = {
  { {0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0xff,0xff,0x02,0x84,0x64,0x2f}, 8333},
  { {0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0xff,0xff,0x05,0x01,0x61,0x04}, 8333},
  { {0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0xff,0xff,0x05,0x27,0xae,0x74}, 8333},
  { {0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0xff,0xff,0x05,0x2d,0x4f,0x0e}, 8333},
  { {0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0xff,0xff,0x05,0x35,0x10,0x85}, 8333},
  { {0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0xff,0xff,0x05,0x65,0x8b,0xa6}, 8333},
  { {0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0xff,0xff,0x05,0xb2,0x4e,0x8b}, 8333},
  // many, many more. autogenerated
};
{% endhighlight %}

### Conclusion

There is no secret broadcasting or magic in making connection between two nodes through the Internet. All the things are related to DNS or fixed IP stuff. 

I have to admit, all P2P network-ish things were magic to me. I spent two-three evenings to understand this thing. It doesn't look like a major magic or rocket science anymore. I recommend you to check out the code "really important" (well, they are still brainiacs I admit) people wrote. For fun, for learning and for being better. That's a good sign that also just "regular" people like me can do a contribution to the World. I should keep trying :).

[1]: https://github.com/bitcoin/bitcoin/blob/master/src/net.cpp
[2]: https://github.com/bitcoin/bitcoin/blob/master/src/chainparams.cpp
[3]: https://github.com/bitcoin/bitcoin/blob/master/src/chainparamsseed.cpp
