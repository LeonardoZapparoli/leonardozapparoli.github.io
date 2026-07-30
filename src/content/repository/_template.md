---
title: "Entry Title Here"
code: MyCode
description: "One-sentence abstract shown in the index and under the title."
date: 2026-01-01
---

Introductory paragraph before the first section.

## First section

Inline math like $\E[X^2] < \infty$ works anywhere. Environments:

:::definition{#my-definition}
Definitions, remarks, and examples render upright.
:::

:::theorem{#my-theorem title="Optional Name"}
Theorems, lemmas, propositions, and corollaries render in italics, and
display math works inside them:

$$
e^{i\pi} + 1 = 0.
$$
:::

:::proof
Proofs are unnumbered and end with a QED box automatically.
:::

A numbered, referenceable equation (the label line goes right after the
closing `$$`):

$$
\Var(X) = \E[X^2] - \E[X]^2 .
$$
{#my-equation}

Reference things in this entry with [[#my-theorem]] and [[#my-equation]].
Reference other entries with [[LinAlg:cauchy-schwarz]].
