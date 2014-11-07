---
layout: entry
title: Verb Phrase MWEs
langs: en
---

## Overview

This discusses idioms that lexicalize (at least) a verb and a complement noun. In the literature, various subcategories of VP idioms are known as Verb-Noun Constructions (VNCs), Light Verb Constructions (LVCs), Support Verb Constructions, and phrasal idioms. Such constructions possess varying degrees of fixedness/productivity.

## LVCs: a simple approach

Light verb constructions, in which the noun is eventive and the verb adds no or little meaning about that event, are quite frequent, so it makes sense to tackle them first. Issues:

### How to constrain the combination of allowed verb and eventive noun?
 
Some light verbs are productive: e.g., it seems there is a frequent function of 'take' that can work with almost any single-argument activity noun. Ideally, a CCG lexicon would license light verb–noun combinations based on their semantic compatibility, but this does not look simple to accomplish, either theoretically or practically with broad coverage.

As a first step, let us consider the following two alternative simplifications:

1. In the lexicon, a fixed list of light verbs and a fixed list of eventive nouns. Any LV is allowed to combine with any eventive noun.
2. In the lexicon, a fixed list of licensed LVCs.

**Option 1** would produce analyses like:

~~~ ccg
Nobody paid attention to me , so I took a long bath .

Nobody : NP
paid : ((S\NP)/PP)/NP[+evt]
attention : NP[+evt]
to : PP/NP
me : NP
I : NP
took : (S\NP)/NP[+evt]
a : NP[+evt]/N[+evt]
long : N[+evt]/N[+evt]
bath : N[+evt]

paid attention : paid > attention => (S\NP)/PP
to me : to > me => PP
paid attention to me : paid attention > to me => S\NP
Nobody paid attention to me : Nobody < paid attention to me => S
long bath : long > bath => N[+evt]
a long bath : a > long bath => NP[+evt]
took a long bath : took > a long bath => S\NP
I took a long bath : I < took a long bath => S
~~~

where `[+evt]` marks the noun's potential to appear in an LVC. Determiners and adjectives would have to be designed so as to propagate this feature up to the full NP.

If we are doing parsing, it may not matter too much if the grammar overgenerates LVCs (_*make a bath_, etc.).

**Option 2** would constrain LVCs to hard-coded lexical combinations:

~~~ ccg
Nobody paid attention to me , so I took a long bath .

Nobody : NP
paid : ((S\NP)/PP)/NP[attention]
attention : NP
to : PP/NP
me : NP
I : NP
took : (S\NP)/NP[bath]
a : NP/N
long : N/N
bath : N

paid attention : paid > attention => (S\NP)/PP
to me : to > me => PP
paid attention to me : paid attention > to me => S\NP
Nobody paid attention to me : Nobody < paid attention to me => S
long bath : long > bath => N
a long bath : a > long bath => NP
took a long bath : took > a long bath => S\NP
I took a long bath : I < took a long bath => S
~~~

Option 2 would disallow _*paid a bath_ and _*made attention_. It is thus higher precision, lower recall.

Both solutions assume there is a one-to-one correspondence between light verbs and eventive nouns. It does not consider, e.g., _I took a walk, then a nap_, or the [zeugmatic](http://en.wikipedia.org/wiki/Zeugma#Type_2) _??I took a picture, then a nap_.

### How to make the LVC semantics equivalent to its heavy verb paraphrase?

From a semantic parsing perspective, the value in treating LVCs specially is to reduce sparsity by assigning the same semantics to an LVC (_take a bath_) as to its paraphrase with a heavy verb (_bathe_).

The simplest approach is for the light verb to simply take on the semantics of the NP. To actually reduce sparsity, the semantic predicate associated with the noun should match that of a heavy verb in the lexicon. In many cases this will be orthographically identical (_walk_, _nap_, _lecture_, etc.), but in some cases the noun will be different (_attention_ → _attend_, _bath_ → _bathe_, _decision_ → _decide_, _speech_ → _speak_, etc.). There are existing resources from which we can extract lists of these correspondences.

As long as light verbs are distinguished from heavy verbs in the lexicon, this will work equally well for Options 1 and 2 above. Here is the Option 2 example with rough semantics added:

~~~ ccg
Nobody paid attention to me , so I took a long bath .

Nobody : NP : nobody
paid : ((S\NP)/PP)/NP[attention] : !x. x
attention : NP : !x!y. attend(x,y)
to : PP/NP : !x. x (??)
me : NP : me
I : NP : i
took : (S\NP)/NP[bath] : !x. x
a : NP/N
long : N/N : !x!y. long(y(x))
bath : N : !x. bathe(x)

paid attention : paid > attention => (S\NP)/PP : !x!y. attend(x,y)
to me : to > me => PP : me
paid attention to me : paid attention > to me => S\NP : !x. attend(x,me)
Nobody paid attention to me : Nobody < paid attention to me => S : attend(nobody,me)
long bath : long > bath => N : !x. long(bathe(x))
a long bath : a > long bath => NP : !x. long(bathe(x))
took a long bath : took > a long bath => S\NP : !x. long(bathe(x))
I took a long bath : I < took a long bath => S : long(bathe(i))
~~~

The non-eventive entry for _bath_ will not have any arguments, so it will not work semantically with _take_.

## Further examples

### _take_ LVCs

- take a walk (swim, shower, break, ...): any eventive noun for a durative activity with one (non-denoted) participant. AmE. (TODO: check CU work on 'take' LVCs)
- take a {picture,photo}
- take s.t. for granted/take for granted s.t.: similar to a [VPC](vpc.html)?

### _attention_ SVCs

- pay attention (to NP)
- give one's attention to NP
- give NP one's attention
- pay no {heed, mind}

### _give_ ditransitives

- give s.o. their due
  * possessive pronoun's antecedent is the indirect object
- give s.t. one's best shot
  * possessive pronoun's antecedent is the subject

### phrasal idioms

- kick the bucket
- spill the beans [decomposable]

## References

- Regarding _take_ LVCs: Claire Bonial's dissertation (in prep.)
- Regarding idiom decomposability: Nunberg, Gibbs
