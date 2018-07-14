---
layout: post
title: "I have overwritten a file in an ext filesystem. What now?"
date: 2018-07-06 13:37:10 +0200 
image: /assets/car_crash.jpg
seo_description: "Short guide how to restore file in ext filesystem."
categories: working
---
![Car crash]({{ site.url }}/assets/car_crash.jpg)

I was preparing to write a small analysis of [my first Code Kata exercise][1],
created a run script for it and:

{% highlight bash %}
mv run.sh /binary_search/1/binary.groovy
{% endhighlight %}

NOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOO!!!

It wasn't versioned yet!

So essentially I have overwritten the entire file I was working on yesterday!
That was 15 minutes of work, but recreate the same code without afterthoughts
I have done already in my would be almost impossible!

I was pissed off. My [gf][2] was like "you have to write it once again, not a
big deal". I googled "how to undelete a file in linux". It wasn't a recipe that I
was looking for - it was only about files that were just removed, not
overwritten.  

There is a solution though.

<!-- more -->

### Prerequisites 

* overwritten file
* linux (ext3 partition) - I am the Ubuntu guy
* head (preferably yours)
* separate partition with data (essentially you'll have to run live cd/usb to
  make the same result)

### Step 1: umount the partition

This is crucial for the entire process. As long as you do any writes to the
partition you can overwrite existing loose file. This will make your data
unrecoverable. So, just do:

{% highlight bash %}
sudo umount /dev/sda1
{% endhighlight %}

Of course, if it's different partition (in my case it was `/dev/sdb1`) you have
to use a different one.

This makes you a little safer, the real data won't be overwritten by an accident now.

### Step 2: install [extundelete][3]

The tool called [extundelete][3] is available in your apt repository already:

{% highlight bash %}
sudo apt-get install extundelete
{% endhighlight %}

It's relatively lightweight so don't worry if you will install on your system partition.

### Step 3: recover *all* files!

This is the point I haven't found in docs. The overwritten file is no longer existing as 
a node with the particular path, therefore you can't find it in the specific one, using:

{% highlight bash %}
sudo extundelete --restore-path code_kata/binary_search/1/binary.groovy -o restore /dev/sdb1

# fuck you, there is no that file in recovery. No files were recovered.
{% endhighlight %}

Oh, I am devastated. But the point is I have overwritten the old file and it's
really existing so there is nothing to recover! Does it make sense? A little.

So what I had to do was to recover all files:

{% highlight bash %}
sudo extundelete --restore-all -o restore /dev/sdb1

# whoo-hoo 1231264 files restored in restore directory. Have fun there, you fucker!
{% endhighlight %}

And that was the best part. Equipped with the experience I have noticed that
there are like 123124 files names like `file1234324`. This was a God's sign
definitely, so I have started to search through them using grep.


{% highlight bash %}
grep -RI restore rightBoundary
{% endhighlight %}

This was fun because I remember the stupid name I gave for one of the
variables. And I have found it, put it back to my beloved folder, committed and
pushed to the Github repo forever. Finally!

I hope you will find way out of your accident as well so happy!

[1]: https://github.com/puradawid/code_kata/blob/master/binary_search/1/binary.groovy
[2]: https://kociamadka.pl
[3]: http://extundelete.sourceforge.net/
