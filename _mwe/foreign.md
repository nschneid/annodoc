---
layout: entry
title: Foreign MWEs
langs: en
---

## Overview

Multiword expressions may be borrowed wholesale from another language. They tend to be completely fixed.

## Examples

- _et cetera_
- _coup d'état_
- _déjà vu_

Unaware of any evidence that these can ever be split or internally modified, we treat these as multiword lexical items:

~~~ ccg
The nation is so prone to coup d'état -s that each of them feels like a déjà vu .

coup d'état : N[+sg -pl]
-s : NP[+pl]\N[+sg]
a : NP[+sg]/N[-pl]
déjà vu : N[+sg -pl]

coup d'état -s : coup d'état < -s => NP[+pl]
a déjà vu : a > déjà vu => NP[+sg]
~~~

(I am not sure about the particulars of the categories. - Nathan)

## References
