---
layout: entry
title: CCG Markup
---

*Nathan Schneider &amp; Reut Tsarfaty<br/>17 Oct 2014*

## Table of Contents

* [Introduction](#introduction)
* [Example](#example)
* [Special notation in categories](#special-notation-in-categories)
* [Reserved symbols](#reserved-symbols)

## Introduction

This document proposes a mini-language for notating CCG derivations in plain text. 
A rendering engine will automatically convert ASCII or Unicode text in this notation to HTML.

Rationale: We plan to build collaborative documention of how CCG can be applied to various constructions. Documentation pages will be written in Markdown, a popular readable text markup language that can be rendered in HTML. Example CCG derivations within the Markdown will be rendered appropriately. (Others may wish to write converters to other formats, such as LaTeX.)

WORK IN PROGRESS. SUBJECT TO CHANGE.

## Example

First, a simple derivation without semantics:

<table style="text-align: center; border-collapse: separate; border-spacing: 5px 0px;">
<tr><td colspan="4" style="border: none; border-bottom: solid 1px #000; position: relative;">S<span style="position: absolute; bottom: -10px; right: -10px;">&gt;</span></td></tr>
<tr><td colspan="3" style="border: none; border-bottom: solid 1px #000; position: relative;">S/NP<span style="position: absolute; bottom: -10px; right: -20px;">B&gt;</span></td></tr>
<tr><td colspan="2" style="border: none; border-bottom: solid 1px #000; position: relative;">S/(S\NP)<span style="position: absolute; bottom: -10px; right: -20px;">T&gt;</span></td></tr>
<tr><td colspan="2" style="border: none; border-bottom: solid 1px #000; position: relative;">NP<span style="position: absolute; bottom: -10px; right: -10px;">&gt;</span></td></tr>
<tr><td style="border: none; border-bottom: solid 1px #000; position: relative;">NP/N</td><td style="border: none; border-bottom: solid 1px #000;">N</td><td style="border: none; border-bottom: solid 1px #000;">(S\NP)/NP</td><td style="border: none; border-bottom: solid 1px #000;">NP</td></tr>
<tr><th style="border: none;">the</th><th style="border: none;">dog</th><th style="border: none;">bit</th><th style="border: none;">John</th></tr>
</table>

### Notation for this example: Alternative 1

    the dog bit John

    the : NP/N 
    dog :  N
    bit : (S\NP)/NP
    John : NP

    the dog          :         the > dog   => NP
                     :            T>       => S/(S\NP)
    the dog bit      :    the dog B> bit   => S/NP
    the dog bit John : the dog bit > John  => S

The first line is the __sentence__. The next four lines indicate __lexical entries__. The last four lines are the __rules__ applied in the derivation.

Lexical entries and rules begin with an __identifier__, which must match one or more tokens in the sentence (the yield of the derivation). Each identifier corresponds to a CCG "constituent", i.e., span of one or more words with syntactic status in the analysis.

(Identifier names are not required to contain contiguous words or to order them in the same way as the sentence, but they must be consistent: e.g., `the dog` and `dog the` cannot both be used as identifiers in the same derivation.)

Syntactic information follows the identifier, separated by a spaced colon (` : `). For lexical entries, the only syntactic information is the category. The syntactic part of rules consists of identifiers, combinators, and the resulting catergory. Combinators are marked inline, between identifiers of the constituents being combined. The resulting category is preceded by the spaced `=>` operator.

For unary rules that are not lexical entries, the syntactic part of the rule omits constituent identifiers (because the constituent is clear from the first part of the rule). Where multiple rules apply to the same constituent (e.g., _the dog_ in the example), they are given in order on successive lines: the consituent identifier only appears on the first of these lines, but the colon is repeated on each line. Otherwise, there are no requirements for the ordering of lines.

### Multiple occurrences of the same word or phrase

Because constituents are identified simply by their component words, 
if the sentence contains repeated words, there needs to be a way to tell 
which of them is being referred to in a particular derivation step. 
This is determined by aligning the order of the derivation steps to the sentence order: 
where a constituent definition has multiple possible matches in the sentence, 
it is taken to refer to the earliest (leftmost, in LTR scripts) match that is not already  
encompassed by a constituent. 
Binary derivation steps require their component constituents to be adjacent, 
thus eliminating ambiguity once the resulting constituent's span is identified.

For example (leaving out the categories):

    the big dog smelled the other big dog
    
    the : .
    big : .
    dog : . 
    smelled : .
    the : .
    other : .
    big : .
    dog : .
    
    big dog : .
    big dog : .
    the big dog : the > big dog => .
    the other big dog : the other > big dog => .

If the annotator wishes to leave an earlier occurrence 
of a word or phrase unanalyzed, the double colon operator `::` can be used in the earlier occurrence:

    that ice cream doesn't smell like ice cream
    
    ice cream ::
    ice cream : N

### Alternative 2

A variant under consideration is:

    the dog bit John

    the : NP/N 
    dog :  N 
    bit : (S\NP)/NP
    John : NP

    the dog : NP/N > N => NP 
            : NP T> => S/(S\NP)
    the dog bit : S/(S\NP) B> (S\NP)/NP => S/NP 
    the dog bit John : S/NP > NP => S

The difference is that instead of repeating the words of the sentence in the syntactic part of the rule, the categories of the constituents are repeated. This also goes for unary rules.

### With semantics

Following lexical entries and rules with an additional spaced colon makes room for semantics. Note that the notation offers ASCII shorthand for special symbols, including `!` for λ, `&&` for ∧, and `%` for ∃.

    the dog bit John

    the : NP/N  : !x. x
    dog :  N : %x. dog'(x)
    bit : (S\NP)/NP : !x. !y. bit'(x,y)
    John : NP : John'

    the dog          :         the > dog   => NP : %x. dog'(x)
                     :            T>       => S/(S\NP) : !p . !y. %x. dog'(x) && p(x,y)
    the dog bit      :    the dog B> bit   => S/NP : !y . %x. dog'(x) && bit'(x,y)
    the dog bit John : the dog bit > John  => S : %x. dog'(x) && bit'(x,John') 

<table style="text-align: center; border-collapse: separate; border-spacing: 5px 0px;">
<tr><td colspan="4" style="border: none; border-bottom: solid 1px #000; position: relative;">S : ∃x. dog′(x) ∧ bit′(x,John′)<span style="position: absolute; bottom: -10px; right: -10px;">&gt;</span></td></tr>
<tr><td colspan="3" style="border: none; border-bottom: solid 1px #000; position: relative;">S/NP : λy . ∃x. dog′(x) ∧ bit′(x,y)<span style="position: absolute; bottom: -10px; right: -20px;">B&gt;</span></td></tr>
<tr><td colspan="2" style="border: none; border-bottom: solid 1px #000; position: relative;">S/(S\NP) : λp . λy. ∃x. dog′(x) ∧ p(x,y)<span style="position: absolute; bottom: -10px; right: -20px;">T&gt;</span></td></tr>
<tr><td colspan="2" style="border: none; border-bottom: solid 1px #000; position: relative;">NP : ∃x. dog′(x)<span style="position: absolute; bottom: -10px; right: -10px;">&gt;</span></td></tr>
<tr><td style="border: none; border-bottom: solid 1px #000; position: relative;">NP/N : λx. x</td><td style="border: none; border-bottom: solid 1px #000;">N : ∃x. dog′(x)</td><td style="border: none; border-bottom: solid 1px #000;">(S\NP)/NP : λx. λy. bit′(x,y)</td><td style="border: none; border-bottom: solid 1px #000;">NP : John′</td></tr>
<tr><th style="border: none;">the</th><th style="border: none;">dog</th><th style="border: none;">bit</th><th style="border: none;">John</th></tr>
</table>

For viewing in a web browser, we can consider richer and interactive forms of rendering the derivation—e.g., showing semantics only on hover.

## Special notation in categories

Heads and features (to be displayed as subscripts) can be indicated in categories with square brackets:

    VP/NP[book]
    VP/NP[+acc]
    VP/NP[case=acc number=sg]
    VP/NP[book +acc]

There is also arrow notation for type-raised categories: `NP^` renders as NP↑.

We have not worked out a system for notating diamond operators or other bells and whistles used in certain varieties of CCG.

## Reserved symbols

These characters have special meanings in the notation and are therefore restricted in how they may be used.

### ASCII-abbreviated symbols

As a convenience, we specify ASCII abbreviations for non-ASCII symbols:

<table style="text-align: center;"><tr><th>ASCII</th><th>Renders as</th></tr>
<tr><td style="font-family: monospace;">!</td><td>λ</td></tr>
<tr><td style="font-family: monospace;">@</td><td>∀</td></tr>
<tr><td style="font-family: monospace;">%</td><td>∃</td></tr>
<tr><td style="font-family: monospace;">&amp;&amp;</td><td>∧</td></tr>
<tr><td style="font-family: monospace;">||</td><td>∨</td></tr>
<tr><td style="font-family: monospace;">^</td><td>↑</td></tr>
<tr><td style="font-family: monospace;">~</td><td>¬</td></tr>
<tr><td style="font-family: monospace;">'</td><td>′ (in semantics only)</td></tr>
</table>

The ASCII symbols will simply be replaced by Unicode equivalents in processing the markup. The Unicode symbols may be included directly for more readable markup.

### Other reserved symbols

* Reserved for use in category names: `/ \ | ( ) [ ] { }` (categories may contain spaces; unmatched brackets trigger a warning)

* Reserved for use in combinators: `< >` (exception: the `=>` operator)

* Reserved for delimiter in statements: `:`

* Starts an HTML entity (for escaping special characters): `&` (exception: `&&` operator and `<&>` combinator)
