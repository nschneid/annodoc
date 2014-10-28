---
layout: entry
title: Multiword Expressions
---

## Pages

<ul>
{% for p in site.mwe %}
  {% if p.title != page.title %}<li><a href="{{ p.title }}.html" class="doclabel">{{ p.title }}</a></li>{% endif %}
{% endfor %}
</ul>

## Definition

## General issues to consider

1. Which of the (lexicalized) words is the _syntactic_ head, i.e., it takes all the other lexicalized words 
as dependents in the derivation and bears inflections?

2. Which of the words is the _semantic_ head, i.e., it specifies any idiosyncratic aspects of the meaning?

3. How to treat the semantics of lexicalized words other than the semantic head? 
Do they have null semantics?

4. How to assign categories such that the idosyncratic lexical entries are limited to instances of the MWE?

## References

- Baldwin & Kim 2010
