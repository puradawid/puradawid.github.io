---
layout: post
title: "Those Who Did Not Extinct: 3 Things You Can Learn From Ham Radio Operator"
date:   2021-02-27 08:00:00 +0200
image: /assets/ham/ft897.jpg
seo_description: How Amateur Radio Community Is Doing After Almost 100 Years?
categories: working
---

![My own FT 897 radio rig](/assets/ham/ft897.jpg)

Software is a young and exponentially growing industry. Many developers think, especially in my beloved web dev, that we left our scientific culture foundation and moved to something that is driven mostly by fashion.  Can we bring good patterns from other, much older industries? Recently, I joined the ham radio community, became a licensed operator, and I have 3 things to share with you that we should consider in the software development world: conversation schema, openness for change, regular drills. I think these points may sound controversial, hence in this blog post, I am going to explain each of them.

<!-- more -->

## How did I become a ham radio operator?

How did I get interested in ham radio? When the pandemic started, I bought a simple ham radio to keep myself prepared for any comms outage. Such VHF/UHF radio allows you to call services and ask for help if you're in danger, without additional power supply and for a quite good distance, comparing to WiFi or smartphones.  This particular transceiver has also ham frequencies available, so I was able to hear what my local group talks about. I was amused by the topics they were talking about and the "chat mode" they used for it. I will explain it later below.

Then, after some googling, I found out how to get a license and what knowledge and skills are available for the exam. Normally, you would get some training from older colleagues, but given the pandemic, I didn't have such luxury, so I had to learn on my own. I passed the exam and got my license 6 months later, and I became an active participant of ham radio frequencies, local and international. I spoke with most of Europe hams already,  I have managed a couple of calls with both Americas and I really do enjoy these QSOs (contacts in Q code).

The most important thing is, that the first proper representative authority has been founded in 1925, so it's almost 100 years old. Given the oldest institution that is remotely connected with programming and is some sort of oracle in our software world is IEEE, we are still 40 years behind IARU (International Amateur Radio Union). This is a one-generation older community than us, therefore it has more data and experience. It shows we can learn from ham radio, even if it is developing slower as we are. Colleagues from my local community are in the age of my dad or even older, and they had their own old colleagues once they were young! That's amazing and I really admire the maturity of the whole community.

Just to be 100% clear: this is not me showing off ham license, nor being privileged in any way neither. These are things I really admire in the community, it's hard to be represented by a single person.

## #1: Openness and Community Patterns

First of all, hams are engineers who love to experiment. They are happy to use and share their homemade radio rigs, antennas, almost always publish electrical diagrams and schematics on the Internet. The key difference is they are encouraging others to experiment has deep roots in ham's ethic. Thus, the entry-level amateur will always get help from older hams if needed - no one will laugh or judge your skills because of using some home-made antenna or calling stations with a not-that-perfect phonetic alphabet. Your work doesn't have to be ideal on day 1. You don't need to know English very well. You can use and contact people that invested their whole life in ham radio, and yet they'll be happy to give you a couple of advice about your 5m copper cable outside of the window (which I do have, it's a very cheap but effective antenna). From the software perspective, there is a whole community around OpenGD77 (a firmware for a set of very affordable digital radio-telephones) and many needs proper software to communicate, modulate, process signals or just keep the log tidy. Some of them, completely dedicated to amateur radio, created their own companies that sell products for their own community, keeping in mind the ham's spirit.

Programmers love to build new things, and we can incorporate the same rules of not being afraid of experimenting as well. I mention it because we have a large number of people that are ashamed of their code and they don't publish it, even it has no legal/business reasons to keep it secret. I spoke with many developers on interviews and they admit they don't want to publish their code because they think it's just bad. The truth is no one cares what you've written, but many care about the fact you have been doing it. I strongly believe we have to make it straight: in programming, you can write, run and share your code from day 0, don't hesitate to ask for the help of more experienced programmers, and, most importantly, it's okay to not know things and seek for that knowledge when it is needed.

It doesn't matter whether you just started to be a ham operator or not - everyone will like to pick up your call and have a chat. It doesn't really matter who you are, what you do and how old are you. All participants are colleagues regardless of race, faith, region or status.  The same rules are applied to the local community. When entering hams, you forget about talking about politics (you CANNOT talk about it) or religion. You just one of the many hams. That's what matters. I think we naturally get the same attitude, although it would be nice if someone will highlight that, given so many discussions about whether the software industry has some racism/homophobia problems or not. Industry, maybe, but we personally don't.

## #2: The Way Hams Talk

> (me, SP4KOT) CQ, CQ, CQ on twenty meters, this is Sierra Papa Four Kilo Oskar Tango calling for CQ, CQ, CQ
>
> (G0TA) Golf Zero Tango Alfa
>
> (me) Golf Zero Tango Alfa, this is Sierra Papa Four Kilo Oscar Tango, I am receiving you five by nine, fifty nine, very strong and readeable signal, my name is David and I am from Poland, my QTH locator is Kilo Oscar One Three Oscar Delta, Kilo Oscar Thirteen Oscar Delta, Golf Zero Tango Alfa, this is Sierra Papa Four Kilo Oscar Tango, over to you!

How to communicate through a radio that is full of noise, and you don't know who is listening to what you're saying? Before saying the actual message, the ham operator should say the recipient's callsign and then it's own. The same has to happen at the end of each message. You often heard the "over" word over the radio when someone ends talking. It is especially popular in movies or when using a walkie-talkie. It does not mean the end of transmission but it's an abbreviation of the "over to you" phrase. In this way, one side is "passing the microphone" to the other side, meaning they will listen to whatever one will say. In most cases, it is not possible to talk and listen by the same radio, so that's why this system has been put in place. Everyone has to use it, normally it's not so official - people use callsigns, not in every single transmission, but definitely, they do it at the beginning and the end of the chat. The interesting part starts where there are more than two stations, meaning the person speaking has to deliberately choose the next person speaking. If someone wants to interrupt, they can say "break" between messages, and the next person designated should allow this person to speak up.

Have you been on a call recently where people were interrupting one another? This is a way to get around that and pass the speaker to another person, and that's the way which exists 100 years and works very well. Commonly, there are 10 people on a call and just 2 of them speaking. With strong leadership, it's possible to maintain freedom of speech anyway, but it's easier to have a distributed system in place. It may not be ideal for talks when everyone trusts each other, or there is no issue with getting an opinion from everyone, but once you will get the feeling that meetings bring thoughts from one or two attendants only and you had 20 of them on a call, it's better to re-validate the list of participants and check if all of them have a chance to speak up. In ham's world, every attempt to interrupt or jam someone else's signal is considered an awful practice. It happens, but the community itself, without any "call manager", punish for intolerable behaviour - they won't talk with this station this time.

## #3: Performing Drills


In ham's world, experiments come with context: do you have a power supply? What if I am limited to use only 5 watts? What if there is a natural disaster in the area? Hams love to test various scenarios, they like to try turn off their rig and test it. In fact, I am taking part in the *daily* exercise where all local stations are calling the main crisis station and getting the report from it just to check whether which stations are up and running.

There are more complex drills than that, however: national or international emergency drills, where people are playing roles for passing extremely important messages. It can be information about disasters, people in need, outages. The participant which receives it, reports to the next stations, which is eventually passing the right information to emergency services. At the end of the day, information gets validated and all participants find out what exactly can get improved in their rigs or skills. These actions are very wide, well-coordinated and they are a great opportunity to not only test your equipment but skills and your response to such stressful situations. Surprisingly, it has been scientifically proven drills reduce stress and improve effectiveness during real actions!

There are also DX-peditions or just field days, where people go outside and use their mobile equipment, ultra-light antennas, all powered with photovoltaic or mobile batteries.

What was the last time you've been testing your organisation? Sure, there are great systems that test software like chaos monkey and that's great, but you would like to test yourself in such situations. Why not play some database outage on production? Pull the plug, let's see what will happen. I think it would be refreshing for all of you in your team when you'll get some hands-on experience before the real situation actually happens.

Extra info: hams are also having an incredible number of contests all over the year! Contests are usually based on the number of proven QSOs (chats) with certain stations during a specific period - the larger number the better! It's a great opportunity for all of the people to get some new experience or check abilities and skills. It's not as simple as using the biggest antenna and the biggest power - you have to have great operator skills in the first place! 

## Bonus: Licensing

From a legal perspective, you can't even touch a ham radio before getting a license. You can only listen to those licensed hams using radio receivers (I bought my global radio), and record conversations in your logbook. After passing an exam, you can work on someone else's radio station (using her call signs). Once a local authority will register your own station, you can call other stations on ham frequencies within your license level's limitations.

The exam is not very hard: in fact, it contains just basic knowledge about electronics, how radio works, phonetic alphabet, frequency organization and safety rules. I think the list of available bands and their frequencies are the hardest part if you have not listened to all of them. Conversations on digital-only bands are readable only after processing by a computer, or your excellent skills of Morse's alphabet - called Continuous Wave modulation. Therefore, there are several things you have to memorize, but the rest of them you learnt during your primary school career.

Why is licensing so important? Radio is a very open environment. Electromagnetic waves don't care about borders and laws, hence they are unmanageable by any authority. It is possible to track some villain who uses inappropriately high power level (several kilowatts) or just purposefully jams frequencies, but it takes a lot of effort and time. Therefore, it's better to consider all unknown stations unlicensed ones and report their activities. Also, an uninformed ham operator can disturb the communication of emergency services, or, using improperly done radio rig, but other people in danger. This is serious business, and to make people aware of these threats and make them accountable for their actions, the authorities (actually ITU, International Telecommunication Union) created licensing. Familiarity with ham's code of conduct is also a part of the exam.

Licensing for programmers is very controversial: many people claim certificates are useless and mean nothing. Not to mention any higher university degree. Usually, certification sceptics are referring to specialized certificates for certain technology - infamous but decent OCJP for instance - bringing up arguments they're useless and actually doesn't mean a person with such a certificate is any better than a self-taught professional. Personally, I don't have a strong opinion on that - in this case, the idea of licensing, in this case, is detached from certification.

First of all, do we need to have any accountability for things we're doing? Yes, programming comes with responsibility. We write programs that touch legal, security and even health matters. The software saves lives, informs and allows to communicate for billions of people.  However, it does not necessarily have to be vital services only, even simple websites should be safe, readable and free of any illegal activities. I don't have the answer straight away, but I believe it is possible to find out common ground for all programmers, build ethics around it and start license and book people working on code. Once again, the ham radio exam is very basic and cheap (in our case maybe even free of charge if possible), it does assume it is nothing more than a starting point, but it gives knowledge and skills to make you accountable.  Believe me or not, but you are accountable anyway, regardless of whether you are aware of it or not. If we will have a licensing model and a proper international representation, we will make sure everyone aware of that. I see it works for hams very well for years, hence resetting the conversation may help to find some way because the problem becomes more visible.

As a food thought: what knowledge is common for all programmers? Maybe it is one of the base design concepts, like functional or object-oriented programming? Agile methodology? TDD? Let me know in the comments section, I would like to discuss the possibilities.

## Got Interested in Ham Radio?

Here's further reading:

* [IARU Website](https://www.iaru-r1.org/)
* [HAM Spirit Explained](http://www.astrosurf.com/luxorion/qsl-hamspirit.htm)
*
