---
layout: entry
title: CCG Markup
---

# CCG Markup

*Nathan Schneider &amp; Reut Tsarfaty<br/>17 Oct 2014*

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

The first line is the __sentence__. We assume there are no repeated words (repeated words in the original sentence can be disambiguated as preprocessing). The next four lines indicate __lexical entries__. The last four lines are the __rules__ applied in the derivation.

Lexical entries and rules begin with an __identifier__, which must match one or more tokens in the sentence (the yield of the derivation). Each identifier corresponds to a CCG "constituent", i.e., word or grouping of words with syntactic status in the analysis.

(Identifier names are not required to contain contiguous words or to order them in the same way as the sentence, but they must be consistent: e.g., <tt>the dog</tt> and <tt>dog the</tt> cannot both be used as identifiers in the same derivation.)

Syntactic information follows the identifier, separated by a spaced colon (<tt> : </tt>). For lexical entries, the only syntactic information is the category. The syntactic part of rules consists of identifiers, combinators, and the resulting catergory. Combinators are marked inline, between identifiers of the constituents being combined. The resulting category is preceded by the spaced <tt>=&gt;</tt> operator.

For unary rules that are not lexical entries, the syntactic part of the rule omits constituent identifiers (because the constituent is clear from the first part of the rule). Where multiple rules apply to the same constituent (e.g., _the dog_ in the example), they are given in order on successive lines: the consituent identifier only appears on the first of these lines, but the colon is repeated on each line. Otherwise, there are no requirements for the ordering of lines.

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

Following lexical entries and rules with an additional spaced colon makes room for semantics. Note that the notation offers ASCII shorthand for special symbols, including <tt>!</tt> for λ, <tt>&amp;&amp;</tt> for ∧, and <tt>%</tt> for ∃.

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

There is also arrow notation for type-raised categories: <tt>NP^</tt> renders as NP↑.

We have not worked out a system for notating diamond operators or other bells and whistles used in certain varieties of CCG.

## Reserved Symbols

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

* Reserved for use in category names: <tt>/ \ | ( ) [ ] { }</tt> (categories may contain spaces; unmatched brackets trigger a warning)

* Reserved for use in combinators: <tt>&lt; &gt;</tt> (exception: the <tt>=&gt;</tt> operator)

* Reserved for delimiter in statements: <tt>:</tt>

* Starts an HTML entity (for escaping special characters): <tt>&amp;</tt> (exception: <tt>&amp;&amp;</tt> operator and <tt>&lt;&amp;&gt;</tt> combinator)