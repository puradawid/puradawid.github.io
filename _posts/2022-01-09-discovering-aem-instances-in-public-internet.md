---
layout: post
title: "Discover Adobe Experience Manager Instances on The Internet"
date:   2022-01-09 08:00:00 +0200
image: /assets/aem-black-hat.png
seo_description: Discover Adobe Experience Manager websites using simple Scrapy script.
categories: working
---

![My own FT 897 radio rig](/assets/aem-black-hat.png)

Knowing that someone uses a specific software can be used against the user. Sometimes, an attacker has to use sophisticated techniques to guess which software is behind the initial website. These could be 404 requests or some malformed queries to get the detailed stack trace or specific page organisation. It turns out, the number of requests required for detecting AEM equals 1. In this blog post, I will leverage that fact. Here, I present a technique for discovering Adobe Experience Manager using a regular, random web crawler.

<!-- more -->

## Adobe Experience Manager Recognised Easily

AEM is a specific CMS that uses strong path organisation - including how assets, pages, and scripts are stored. In very default configuration, all pages are stored under `/content...`, scripts `/etc.clientlibs` (`/etc/designs...` for older versions) and assets `/content/dam`. Leveraging this fact, I am considering finding out which websites use this CMS available on the public Internet.

## Value of Information

How can this knowledge be used? Organisations that use AEM have high credibility, visibility, and wealth. Instances are not covering the organisation's core activity but informative websites. Even then, disruptions, like increasing the page load time, may take part in a multi-dimensional operation against the target. If the attacker knows the target is AEM upfront, it's certainly easier to prepare a set of attacks for the website. If this is extremely easy to find out, the attacker can pick the target based on that fact.

From another perspective, AEM vendors are fighting for each perimeter of the AEM world - which is very natural in this market. Having a list of AEM websites, they can discover potential customers. I consider this a slight market advantage. The race never ends.

## Existing Solution(s)

[AEM Hacker](https://github.com/0ang3el/aem-hacker) is a project for discovering AEM's vulnerabilities automatically, based on the website name. Developers and testers often use the tool to verify a website's security. One of the scripts can discover the AEM by making special HTTP requests.

In this article, however, I would like to perform a similar discovery based on reading a designed to use response so the attacker cannot be easily discovered in this stage, making a small amount of absolutely legitimate requests.

I use AEM Hacker software for checking the state of the existing website.

## Approach

The hypothesis is: 

> Paths to assets, scripts or websites in HTML disclose AEM website

The test has to go through the Internet, fetch random 200 responses, inspect their bodies, and mark ones that have specific paths within.

Therefore, the highest-level algorithm is as follows:
* read the website
* check if it has any links to `/content` or `/content/dam` or `/etc.clientlibs`
* if the above is true, save the website's hostname
* move to another page (jump to the beginning if possible)
* return list of saved hostnames - here's the list of AEM instances

Scrapping websites perform a graph exploration so that targets are unknown upfront but discovered during crawling. To crawl over the Internet, I have decided to use [Scrapy](https://scrapy.org/), which is a similar tech stack as AEM Hacker (Python executable).

## Testing The Hypothesis

This simple program checks whether the website is AEM or not. For my testing list of websites, the accuracy is 100%.

{% highlight python %}
def check(base_url, debug, proxy):

    response = http_request(base_url)
    result = re.findall('[\w]*[ ]*=[ ]*\"(?:/content/dam/|/etc.clientlibs/)[^\"]+\"', response.text)
    if result:
        return result
    else:
        return []
{% endhighlight %}

This example shows that the check is based only on regular expression that seeks the link of attribute in the entire HTML.

## Implementing The Actual Program

Implementation of the program relies on Scrapy's architecture - that it requires to running the codebase with Spider's derivative.

{% highlight python %}
import scrapy
import re

MAX_DEPTH = 3

class QuotesSpider(scrapy.Spider):
    name = 'quotes'
    start_urls = [
        'https://www.economist.com/',
    ]

    hosts = {}

    def is_in_hosts(self, url, origin):
        if re.search('^/', url):
            host = origin
            print("Host: " + host)
        elif re.search('^(http|https)?:?//', url):
            host = re.search('//([^/]+)/?', url).group(1)
        else:
            host = "None"
        if host not in self.hosts:
            return False

        return self.hosts[host] >= MAX_DEPTH

    def parse(self, response):

        if not re.search('text/html', response.headers['Content-Type'].decode('utf-8')):
            return

        for quote in response.xpath('//*[@*[contains(., \'/etc.clientlibs/\')]]'):
            yield {
                'src': quote.get(),
                'page': response.url,
            }
        for resource in response.xpath('//*[@*[starts-with(., \'/content/dam/\')]]'):
            yield {
                'src': resource.get(),
                'page': response.url,
            }

        host = re.search('//([a-zA-Z0-9.]+)/', response.url).group(1)

        if host not in self.hosts:
            self.hosts[host] = 0

        if host in self.hosts and self.hosts[host] < MAX_DEPTH:
            self.hosts[host] = self.hosts[host] + 1

            next_pages = response.xpath('//a/@href').getall()
            if next_pages is not None:
                for next_page in next_pages:
                    if not (re.search('^(tel|mailto):', next_page) or self.is_in_hosts(next_page, host)):
                        yield response.follow(next_page, self.parse)
{% endhighlight %}

Execute this code using Scrapy's environment by:

{% highlight bash %}
scrapy runspider .\find_pages.py -o result.jl
{% endhighlight %}

Once executed, `result.jl` contains new-line separated JSON objects with the results of crawling. Example:

{% highlight json %}
{
    "src": "<script type=\"text/javascript\" src=\"/etc.clientlibs/digicert/clientlibs/clientlib-base.js\"></script>",
    "page": "https://www.geotrust.com"
}
{% endhighlight %}

I have manually validated those entries before moving any further. Then, I wrote an additional script that combines these into a list of hostnames based on a single map to reduce duplicates:

{% highlight python %}
import json
import re

file = open("./result.jl")

def host(url):
    return re.search('^(?:https?)?:?//([^/]+)', url).group(1)

result = {}

for line in file:
    obj = json.loads(line)
    result[host(obj['page'])] = 1

for domain in result:
    print(domain)
{% endhighlight %}

(I posted the working implementation on Github.)[https://github.com/puradawid/discover-aem]

## Results

After running the script for 30 minutes I have discovered the list of some websites:

* business.adobe.com
* brand.linkedin.com
* legal.twitter.com
* safety.linkedin.com
* about.linkedin.com
* www.admin.ch
* www.edoeb.admin.ch
* www.uvek.admin.ch
* www.rumba.admin.ch
* www.vorbild-energie-klima.admin.ch
* www.naturgefahren.ch
* www.bfe.admin.ch
* www.natural-hazards.ch
* www.pericoli-naturali.ch
* www.privels-natira.ch
* www.stelle.admin.ch
* www.ejpd.admin.ch
* www.ekm.admin.ch
* www.sem.admin.ch
* www.metas.ch
* www.eschk.admin.ch
* www.esbk.admin.ch
* www.nkvf.admin.ch
* www.isc-ejpd.admin.ch
* www.bj.admin.ch
* www.fedpol.admin.ch
* www.ncsc.admin.ch
* www.wbf.admin.ch
* www.efd.admin.ch
* www.vbs.admin.ch
* www.isceco.admin.ch
* www.bk.admin.ch
* www.weko.admin.ch
* www.eda.admin.ch
* www.seco.admin.ch
* www.adobe.com
* www.unilevernotices.com
* www.synopsys.com
* www.bsimm.com
* us.aicpa.org
* www.salesforce.com
* business.amazon.it
* www.geotrust.com
* www.digicert.com
* knowledge.digicert.com

These websites are pretty solid, AEM 6.5 and earlier versions. Can you find those you have been developing or maintaining?

## Potential Enhancements

This script is rudimentary, but it reveals a minor vector people can trace and list AEM instances almost instantly, making some little effort and exploiting that knowledge once it's worth doing so.

To discover that knowledge, one can:
* start from a better website than The Economist (like some Fortune 500s summary with links to these companies)
* improve the limit of pages visited
* add more accurate checks - I would think of using AEM-specific libraries, like Granite
* use a proper infrastructure to crawl the whole Internet
