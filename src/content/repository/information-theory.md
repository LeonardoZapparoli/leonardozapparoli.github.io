---
title: "Introduction to Information Theory"
code: InfoTheory
description: "Entropy, relative entropy, mutual information, and the asymptotic equipartition property."
date: 2026-07-29
---

An introduction to the basic quantities of information theory for discrete
random variables, following the spirit of Cover and Thomas. Throughout,
$X$ is a discrete random variable taking values in a finite alphabet
$\mathcal{X}$ with probability mass function $p$, and $\log$ denotes the
base-2 logarithm.

## Entropy

:::definition{#entropy-def}
The **entropy** of $X$ is

$$
H(X) = - \sum_{x \in \mathcal{X}} p(x) \log p(x),
$$
{#entropy}

with the convention $0 \log 0 = 0$. Entropy is measured in bits and depends
only on the distribution $p$, not on the values $X$ takes.
:::

:::example{#coin-example}
If $X$ is a Bernoulli($\theta$) variable, then
$H(X) = -\theta \log \theta - (1-\theta) \log (1-\theta)$. This is maximized
at $\theta = \tfrac{1}{2}$, where $H(X) = 1$ bit: a fair coin is the most
unpredictable binary experiment.
:::

:::proposition{#entropy-bounds}
For any $X$ on a finite alphabet $\mathcal{X}$,

$$
0 \le H(X) \le \log \abs{\mathcal{X}},
$$

with $H(X) = 0$ iff $X$ is deterministic, and
$H(X) = \log \abs{\mathcal{X}}$ iff $X$ is uniform on $\mathcal{X}$.
:::

:::proof
Non-negativity holds term by term since $p(x) \le 1$. The upper bound
follows from [[#kl-nonneg]] applied to $p$ and the uniform distribution $u$:
$0 \le D(p \,\|\, u) = \log \abs{\mathcal{X}} - H(X)$.
:::

## Relative entropy and mutual information

:::definition{#kl-def}
The **relative entropy** (or Kullback–Leibler divergence) between two
probability mass functions $p$ and $q$ on $\mathcal{X}$ is

$$
D(p \,\|\, q) = \sum_{x \in \mathcal{X}} p(x) \log \frac{p(x)}{q(x)},
$$
{#kl}

with the conventions $0 \log \tfrac{0}{q} = 0$ and
$p \log \tfrac{p}{0} = \infty$ for $p > 0$.
:::

:::lemma{#jensen title="Jensen's inequality"}
Let $f$ be convex on an interval $I$ and let $X$ be a random variable taking
values in $I$ with $\E \abs{X} < \infty$. Then

$$
f\left( \E[X] \right) \le \E\left[ f(X) \right],
$$

and if $f$ is strictly convex, equality holds iff $X$ is almost surely
constant.
:::

:::theorem{#kl-nonneg title="Information inequality"}
For any probability mass functions $p$ and $q$ on $\mathcal{X}$,

$$
D(p \,\|\, q) \ge 0,
$$

with equality iff $p = q$.
:::

:::proof
Let $S = \{ x : p(x) > 0 \}$. Applying [[#jensen]] to the strictly convex
function $t \mapsto -\log t$,

$$
D(p \,\|\, q)
= \E_p \left[ - \log \frac{q(X)}{p(X)} \right]
\ge - \log \E_p \left[ \frac{q(X)}{p(X)} \right]
= - \log \sum_{x \in S} q(x)
\ge - \log 1 = 0 .
$$

Equality forces $q(x)/p(x)$ to be constant on $S$ and $q(S) = 1$, hence
$p = q$.
:::

:::definition{#mutual-info-def}
The **mutual information** between $X$ and $Y$ with joint pmf $p(x, y)$ and
marginals $p(x)$, $p(y)$ is

$$
I(X; Y) = D\left( p(x,y) \,\|\, p(x)\,p(y) \right)
= \sum_{x, y} p(x,y) \log \frac{p(x,y)}{p(x)\,p(y)}.
$$
{#mutual-info}
:::

:::remark{#geometry-remark}
By [[#kl-nonneg]], $I(X;Y) \ge 0$ with equality iff $X$ and $Y$ are
independent — mutual information is a nonnegative measure of dependence.
Compare the role of the Cauchy–Schwarz inequality [[LinAlg:cauchy-schwarz]]
in bounding correlation: the bound [[LinAlg:cs-inequality]] controls *linear*
dependence, while $I(X;Y)$ detects dependence of any form.
:::

## The asymptotic equipartition property

:::theorem{#aep title="AEP"}
Let $X_1, X_2, \dots$ be i.i.d. with pmf $p$. Then

$$
- \frac{1}{n} \log p(X_1, X_2, \dots, X_n) \longrightarrow H(X)
\quad \text{in probability.}
$$
{#aep-limit}
:::

:::proof
Since the $X_i$ are i.i.d.,
$-\tfrac{1}{n} \log p(X_1, \dots, X_n) = \tfrac{1}{n} \sum_{i=1}^n
\left( -\log p(X_i) \right)$ is an average of i.i.d. random variables with
mean $\E[-\log p(X_1)] = H(X)$, so the weak law of large numbers applies.
:::

:::remark{#typical-sets}
The AEP is the statement that long i.i.d. strings are overwhelmingly likely
to be "typical": their probability is close to $2^{-n H(X)}$, as given by
[[#aep-limit]]. Counting typical strings is what makes entropy
[[#entropy]] the fundamental limit of lossless compression.
:::
