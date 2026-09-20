---
title: "A Bridge to Measure-Theoretic Probability"
code: Prob
description: "A motivated bridge to measure-theoretic probability: sigma algebras, Radon–Nikodym derivative, Kolmogorov conditional expectation, and conditional laws."
date: 2026-09-12
---

*Elementary probability*, as taught in a first course, defines conditional probability by division, $\P(A \mid B) = \P(A \cap B)/\P(B)$; conditional expectation given a random variable $Y$ by averaging over the level sets $\{Y = y\}$; a density as a function one integrates to get probabilities; and conditional distributions as a ratio of sums or integrals. While these definitions are completely correct in the setting of countable probability spaces, they are often extended to the general uncountable setting via analogy, without much explanation. A proper treatment requires measure-theoretic probability.

*Measure-theoretic probability*, in the form given by Kolmogorov in 1933, replaces these definitions with ones phrased in terms of measures, measurable functions, and $\sigma$-algebras: a probability is a measure, a random variable is a measurable function, a state of information is a $\sigma$-algebra, and conditioning is a Radon–Nikodym derivative. 

Measure-theoretic probability is often taught in a confusing and unintuitive way, as if the entire practice were the terse manipulation of symbols. In these notes we motivate its foundational ideas to demonstrate that they are intuitive and, in many ways *forced*, once one asks the right questions. These notes are meant to be a bridge for someone who understands elementary probability well, has had some exposure to measure-theoretic probability, but struggles to put the big picture together.

## Conditioning on Events

### The elementary definition is forced

Let $(\Omega, \cF, \P)$ be a probability space and let $B \in \cF$ with $\P(B) > 0$. We are told that $B$ has occurred and we want to replace $\P$ by a probability measure $\P_B$ on $(\Omega, \cF)$ that reflects this information. We make two requirements that are forced by the meaning of the situation.

(C1) *Outcomes outside $B$ are ruled out:* $\P_B(B) = 1$.

(C2) *Relative weights inside $B$ are unchanged:* for $A_1, A_2 \subseteq B$ the odds $\P_B(A_1) : \P_B(A_2)$ equal the odds $\P(A_1) : \P(A_2)$.

Condition (C2) is the substantive one. It says that the information "$B$ occurred" says nothing about *where inside $B$* the outcome lies; if, before learning $B$, one part of $B$ was twice as likely as another, learning only that the outcome is somewhere in $B$ gives no reason to change that. Conditioning must delete mass outside $B$, but it may not rebalance mass within $B$.

:::proposition{#elementary-conditioning title="Elementary Conditioning Is Forced"}
Let $B \in \cF$ with $\P(B) > 0$. The unique probability measure $\P_B$ on $(\Omega, \cF)$ satisfying (C1) $\P_B(B) = 1$ and (C2) $\P_B(A_1) : \P_B(A_2) = \P(A_1) : \P(A_2)$ for all $A_1, A_2 \subseteq B$ is

$$
\P_B(A) = \frac{\P(A \cap B)}{\P(B)}, \qquad A \in \cF .
$$
:::

:::proof
Taking $A_2 = B$ in (C2) and using (C1) gives $\P_B(A_1) = \P(A_1)/\P(B)$ for any $A_1 \subseteq B$. For general $A_1$, additivity and (C1) give $\P_B(A_1) = \P_B(A_1 \cap B) + \P_B(A_1 \cap B^c) = \P(A_1 \cap B)/\P(B) + 0$. The displayed formula is a probability measure and satisfies (C1), (C2).
:::

We write $\P(A \mid B)$ for $\P_B(A)$. The formula is usually presented as a definition, but we see from the proposition that there is really no other choice.

The result can be restated in the form that will recur throughout our notes: $\P_B$ is $\P$ multiplied by the function $\ind{B}/\P(B)$,

$$
\P_B(A) = \int_A \frac{\ind{B}}{\P(B)} \dd\P .
$$

Conditioning is reweighting. The conditional measure has a density with respect to the original one, here $\ind{B}/\P(B)$, which deletes mass outside $B$ and rescales mass inside $B$ uniformly. The section on the Radon–Nikodym theorem studies densities in general, and conditioning on events of probability zero will amount to finding the right density when division is no longer available.

### Multiplication rule, total probability, Bayes' theorem

:::proposition{#chain-rule title="Chain Rule"}
If $\P(A_1 \cap \cdots \cap A_{n-1}) > 0$, then

$$
\P(A_1 \cap \cdots \cap A_n)
= \P(A_1)\,\P(A_2 \mid A_1)\,\P(A_3 \mid A_1 \cap A_2)\cdots
\P(A_n \mid A_1 \cap \cdots \cap A_{n-1}) .
$$
:::

:::proof
For $n = 2$ this is the definition rearranged, $\P(A \cap B) = \P(A \mid B)\,\P(B)$; induct on $n$.
:::

:::theorem{#bayes-elementary title="Total Probability and Bayes' Theorem, Elementary Form"}
Let $(B_i)_{i \in I}$ be a countable partition of $\Omega$ into events of positive probability. Then for every $A \in \cF$,

$$
\P(A) = \sum_{i \in I} \P(A \mid B_i)\,\P(B_i),
$$

and if $\P(A) > 0$,

$$
\P(B_j \mid A) = \frac{\P(A \mid B_j)\,\P(B_j)}{\sum_{i \in I} \P(A \mid B_i)\,\P(B_i)} \qquad (j \in I) .
$$
{#bayes-elementary-formula}
:::

:::proof
$\P(A) = \sum_i \P(A \cap B_i)$ by countable additivity, and $\P(A \cap B_i) = \P(A \mid B_i)\P(B_i)$. Then $\P(B_j \mid A) = \P(A \cap B_j)/\P(A)$ with numerator and denominator rewritten by the first two identities.
:::

Note that the proof requires both hypotheses: countability of the partition for countable additivity, and positivity of the $\P(B_i)$ so that the conditional probabilities exist.

The content of Bayes' theorem is in how it is read. Regard the $B_j$ as hypotheses, $\P(B_j)$ as prior weights, and $\P(A \mid B_j)$ as the *likelihood* of the observation $A$ under $B_j$. Then [[#bayes-elementary-formula]] says that observing $A$ multiplies each prior weight by its likelihood and renormalizes:

$$
\text{posterior} \propto \text{likelihood} \times \text{prior} .
$$

### Independence

:::definition{#independence title="Independence"}
Events $A, B$ are **independent** if $\P(A \cap B) = \P(A)\P(B)$. A family of events is independent if the product formula holds for every finite subfamily. Sub-$\sigma$-algebras $\cG_1, \dots, \cG_n$ are independent if $\P(A_1 \cap \cdots \cap A_n) = \prod_i \P(A_i)$ whenever $A_i \in \cG_i$, and random variables are independent if the $\sigma$-algebras they generate are. If $\P(C) > 0$, events $A, B$ are **conditionally independent given $C$** if $\P(A \cap B \mid C) = \P(A \mid C)\,\P(B \mid C)$, i.e. if they are independent under $\P_C$.
:::

If $\P(B) > 0$, independence of $A$ and $B$ says $\P(A \mid B) = \P(A)$: learning $B$ does not change the probability of $A$. To check independence of $\sigma$-algebras it suffices to check the product formula on $\pi$-systems generating them (Dynkin's $\pi$–$\lambda$ theorem), which is why independence of real random variables can be verified on the events $\{X_i \le x_i\}$.

### Conditional expectation given an event, a partition, or a discrete random variable

:::definition{#elementary-conditional-expectation title="Elementary Conditional Expectation"}
Let $X \in L^1$.

(a) For $B \in \cF$ with $\P(B) > 0$, the conditional expectation of $X$ given $B$ is its expectation under $\P_B$:

$$
\E[X \mid B] = \int X \dd\P_B = \frac{\E[X \ind{B}]}{\P(B)}
= \frac{1}{\P(B)} \int_B X \dd\P ,
$$

the average of $X$ over $B$.

(b) For a countable partition $\cP = (B_i)_{i \in I}$ of $\Omega$ into events of positive probability, the conditional expectation of $X$ given $\cP$ is the random variable obtained by averaging $X$ over whichever cell contains the outcome:

$$
\E[X \mid \cP](\omega) = \E[X \mid B_i] \qquad \text{for } \omega \in B_i .
$$

(c) For a random variable $Y$ taking countably many values, let $\cP_Y = \{\{Y = y\} : \P(Y = y) > 0\}$, the partition of $\Omega$ (up to a null set) into the level sets of $Y$. The conditional expectation of $X$ given $Y$ is $\E[X \mid Y] \coloneqq \E[X \mid \cP_Y]$, and for $\P(Y = y) > 0$ one writes

$$
\E[X \mid Y = y] \coloneqq \E[X \mid \{Y = y\}]
= \frac{\E[X \ind{\{Y = y\}}]}{\P(Y = y)} .
$$
:::

Part (c) is the definition given in introductory courses: to condition on a random variable, condition on the partition of $\Omega$ into its level sets. Writing $g(y) = \E[X \mid Y = y]$, one has $\E[X \mid Y] = g(Y)$ on $\bigcup_{\P(Y = y) > 0} \{Y = y\}$, whose complement is a countable union of null sets and hence null; so $\E[X \mid Y]$ is a function of $Y$, defined a.s. The hypothesis that $Y$ takes countably many values is essential: without it the level sets are null, the cell averages are undefined, and the complement of the positive-probability level sets need not be null.

:::proposition{#elementary-ce-properties title="Properties of the Elementary Conditional Expectation"}
Let $\cP = (B_i)_{i \in I}$ be a countable partition of $\Omega$ into events of positive probability, let $\sigma(\cP)$ be the $\sigma$-algebra it generates (which consists of the unions of cells), and let $X \in L^1$.

(i) $\E[X \mid \cP]$ is constant on each cell, i.e. it is $\sigma(\cP)$-measurable.

(ii) $\displaystyle \int_A \E[X \mid \cP] \dd\P = \int_A X \dd\P$ for every $A \in \sigma(\cP)$.

(iii) $\E[X \mid \cP]$ is the unique function with properties (i) and (ii).

(iv) *(Total expectation)* $\E\big[\E[X \mid \cP]\big] = \E X$. For $Y$ countably valued, $\E X = \sum_{y :\, \P(Y = y) > 0} \E[X \mid Y = y]\,\P(Y = y)$.

(v) *(Tower)* If $\cP'$ is a coarser partition (each cell of $\cP'$ is a union of cells of $\cP$), then $\E\big[\E[X \mid \cP] \,\big|\, \cP'\big] = \E[X \mid \cP']$.
:::

:::proof
(i) is immediate from the definition. For (ii), on each cell $\int_{B_i} \E[X \mid \cP] = \E[X \mid B_i]\,\P(B_i) = \int_{B_i} X$, and a set in $\sigma(\cP)$ is a countable disjoint union of cells, so the identity extends by countable additivity. For (iii), a function constant on cells with $\int_{B_i} (\cdot) = \int_{B_i} X$ has the value $\E[X \mid B_i]$ on $B_i$. (iv) is (ii) with $A = \Omega$, and the formula for $Y$ is (ii) written out cell by cell. For (v), each cell $C$ of $\cP'$ lies in $\sigma(\cP)$, so by (ii) $\frac{1}{\P(C)} \int_C \E[X \mid \cP] = \frac{1}{\P(C)} \int_C X$, which says the two sides of (v) agree on $C$.
:::

### The obstruction: events of probability zero

Let $X$ have a continuous distribution, so that $\P(X = x) = 0$ for every $x$. [[#elementary-conditional-expectation]](c) does not apply: the partition $\{X = x\}_{x \in \R}$ is uncountable and every cell is null, so the cell average $\E[Y \mid X = x]$ is $0/0$, and even if each cell were assigned a value there is no countable additivity to turn the values into an integral identity. Yet "the conditional density of $Y$ given $X = x$" is a standard object, computed in every statistics course as $f(x,y)/f_X(x)$ and used as if $\E[Y \mid X = x] = \int y\, f(x,y)\dd y / f_X(x)$ were an instance of [[#elementary-conditional-expectation]]. It is not; in an elementary course it is a separate definition, adopted by analogy.

## Measure-Theoretic Preliminaries

Throughout, $(\Omega, \cF, \P)$ is a probability space and $\cB(\R)$ is the Borel $\sigma$-algebra of $\R$. Sub-$\sigma$-algebras are sub-$\sigma$-algebras of $\cF$ unless stated otherwise. For sub-$\sigma$-algebras $\cG, \cH$ we write $\cG \vee \cH$ for the $\sigma$-algebra generated by $\cG \cup \cH$.

### σ-algebras as information

A sub-$\sigma$-algebra $\cH \subseteq \cF$ should be thought of as a body of information: the collection of yes/no questions about $\omega$ that can be answered. An event $A \in \cH$ is a question whose answer $\ind{A}(\omega)$ is available. The closure properties of a $\sigma$-algebra are the closure of answerable questions under negation and countable disjunction.

:::definition{#h-measurable title="Measurability with Respect to a Sub-σ-Algebra"}
Let $\cH \subseteq \cF$ be a sub-$\sigma$-algebra. A function $X : \Omega \to \R$ is **$\cH$-measurable** if $\{X \in B\} \in \cH$ for all $B \in \cB(\R)$; equivalently $\sigma(X) \subseteq \cH$, where $\sigma(X) = \{X^{-1}(B) : B \in \cB(\R)\}$.
:::

In the information reading, $X$ is $\cH$-measurable iff every question "is $X \in B$?" can be answered from $\cH$; equivalently, the value of $X$ is determined by the information in $\cH$. It suffices to check $\{X \le q\} \in \cH$ for rational $q$, since $\{B : X^{-1}(B) \in \cH\}$ is a $\sigma$-algebra containing the half-lines, which generate $\cB(\R)$.

:::example{#measurability-examples title="Measurability as Information"}
On $\Omega = \{HH, HT, TH, TT\}$ with $\cH$ generated by the first coin, the first coin is $\cH$-measurable and the second is not. On $\Omega = \R$ with $\cH$ generated by the bins $[n, n+1)$, $n \in \Z$, a function is $\cH$-measurable iff it is constant on each bin. With $\cH$ generated by the sign of $\omega$, the sign is $\cH$-measurable and $\abs{\omega}$ is not.
:::

:::remark{#knowing-rv title="What it means to know"}
An observer is said to "know" $X$ iff he can determine whether $\{X \in B\}$ occurred, for all Borel sets $B$. For example, if a random variable $X: \Omega \to \R$ is $\cH$-measurable, an observer with $\cH$ information *does* know $X$, because each question $\{X \in B\}$ is a question contained in $\cH$ (by the $\cH$-measurability of $X$), whose answer the observer knows.
:::


### Almost-sure identification

:::definition{#almost-sure-identification title="Convention: Almost-Sure Identification"}
Random variables are identified when they agree $\P$-almost surely. "To know $X$" means to know its a.s.-equivalence class, and a theorem asserting that some data determine $X$ asserts that the class is determined.
:::

No probabilistic quantity distinguishes a.s.-equal random variables, so the class is the most that probabilistic data could ever determine. 

Knowing the *law* of $X$ is much less than knowing $X$. For example, on $[0,1]$ with Lebesgue measure, $X(\omega) = \omega$ and $X'(\omega) = 1 - \omega$ have the same law and are almost nowhere equal.

### The uniqueness lemma

The following lemma is used repeatedly.

:::lemma{#uniqueness-lemma title="Uniqueness Lemma"}
Let $(\Omega, \cG, \mu)$ be $\sigma$-finite and let $f, g$ be $\cG$-measurable, either both in $L^1(\mu)$ or both nonnegative. If

$$
\int_A f \dd\mu = \int_A g \dd\mu \qquad \text{for all } A \in \cG,
$$

then $f = g$ $\mu$-a.e.
:::

:::proof
Suppose $f, g \in L^1$ and let $D = f - g$. Since $D$ is $\cG$-measurable, $\{D > 1/n\} \in \cG$, and

$$
0 = \int_{\{D > 1/n\}} D \dd\mu \ge \frac1n\,\mu(D > 1/n),
$$

so $\mu(D > 1/n) = 0$ for every $n$ and $\mu(D > 0) = 0$. Symmetrically $\mu(D < 0) = 0$.

Suppose instead $f, g \ge 0$. Let $(\Omega_k)$ exhaust $\Omega$ with $\mu(\Omega_k) < \infty$, and for $m, k \in \N$ let $A = \{f > g\} \cap \{g \le m\} \cap \Omega_k$. Then $\int_A f = \int_A g \le m\,\mu(\Omega_k) < \infty$, so both integrals are finite and $\int_A (f - g) \dd\mu = 0$ with $f - g > 0$ on $A$; hence $\mu(A) = 0$. Taking the union over $m, k$ gives $\mu(f > g) = 0$, and symmetrically $\mu(f < g) = 0$.
:::

The proof tests the difference against its own super-level sets, which is possible because the difference is $\cG$-measurable. The hypothesis cannot be dropped: a function that is not $\cG$-measurable can have the same $\cG$-integrals as some $\cG$-measurable function without equalling it.

### The Doob–Dynkin lemma

:::lemma{#doob-dynkin title="Doob–Dynkin"}
Let $(T, \cT)$ be a measurable space, $Y : \Omega \to T$ measurable, and $X : \Omega \to \R$. Then $X$ is $\sigma(Y)$-measurable if and only if $X = g(Y)$ for some measurable $g : T \to \R$.
:::

:::proof
If $X = g(Y)$ then $X^{-1}(B) = Y^{-1}(g^{-1}(B)) \in \sigma(Y)$, so $X$ is $\sigma(Y)$-measurable.

Conversely, for each $q \in \Q$ choose $B_q \in \cT$ with $\{X \le q\} = Y^{-1}(B_q)$, and replace $B_q$ by $\widetilde B_q = \bigcap_{r \in \Q,\, r \ge q} B_r$. Since $\{X \le q\} = \bigcap_{r \ge q} \{X \le r\}$, still $Y^{-1}(\widetilde B_q) = \{X \le q\}$, and now $\widetilde B_q \subseteq \widetilde B_r$ for $q \le r$. Define $g_0(t) = \inf\{q \in \Q : t \in \widetilde B_q\} \in [-\infty, \infty]$. By monotonicity $\{g_0 \le s\} = \bigcap_{q \in \Q,\, q > s} \widetilde B_q$, so $g_0$ is measurable, and the sets $\{g_0 = \pm\infty\}$ are measurable and disjoint from the range of $Y$ (for $t = Y(\omega)$, the set of $q$ with $t \in \widetilde B_q$ is $\{q : X(\omega) \le q\}$, nonempty and bounded below). Let $g = g_0$ on $\{\abs{g_0} < \infty\}$ and $g = 0$ elsewhere. Then $g$ is measurable and $g(Y(\omega)) = \inf\{q : X(\omega) \le q\} = X(\omega)$.
:::

The lemma says that "$X$ uses only the information in $Y$" and "$X$ is a function of $Y$" are the same statement.

### The standard machine

Many identities below are linear in a test function and are proved by the same strategy: verify the identity for indicators of measurable sets, extend to simple functions by linearity, to nonnegative functions by monotone convergence, and to general functions by writing $Z = Z^+ - Z^-$. We call this the **standard machine**. 

An analog of the standard machine also exists for statements asserting an identity between two measures (rather than two integrals). It is called **Dynkin's $\pi$–$\lambda$ theorem**: two probability measures agreeing on a $\pi$-system agree on the $\sigma$-algebra it generates.

### Product measures, Fubini, change of variables

:::theorem{#fubini-tonelli title="Fubini–Tonelli"}
Let $(S, \cS, \mu)$ and $(T, \cT, \nu)$ be $\sigma$-finite. There is a unique measure $\mu \otimes \nu$ on $\cS \otimes \cT$ with $(\mu \otimes \nu)(A \times B) = \mu(A)\nu(B)$. For measurable $f \ge 0$ on $S \times T$ the functions $s \mapsto \int f(s,t)\,\nu(dt)$ and $t \mapsto \int f(s,t)\,\mu(ds)$ are measurable and

$$
\int f \dd(\mu \otimes \nu)
= \int \Big( \int f(s,t)\, \nu(dt) \Big) \mu(ds)
= \int \Big( \int f(s,t)\, \mu(ds) \Big) \nu(dt) .
$$

The same holds for $f \in L^1(\mu \otimes \nu)$, and then the inner integrals are finite a.e. and integrable.
:::

Real random variables $X_1, \dots, X_n$ are independent iff the law of $(X_1, \dots, X_n)$ is the product of the marginal laws; when the joint law has a density, iff the density factors a.e. as a product of functions of the separate variables.

:::theorem{#pushforward title="Pushforward; Change of Variables"}
Let $X : \Omega \to S$ be measurable into a measurable space $(S, \cS)$. The **law** of $X$ is $\P_X = \P \circ X^{-1}$, and for measurable $g \ge 0$ (or $g(X) \in L^1$),

$$
\E[g(X)] = \int_S g \dd\P_X .
$$

If $S = \R^n$, $\P_X$ has density $f_X$ with respect to Lebesgue measure, and $\varphi : U \to V$ is a $C^1$ diffeomorphism between open sets with $\P(X \in U) = 1$, then $Y = \varphi(X)$ has density

$$
f_Y(y) = f_X(\varphi^{-1}(y))\, \abs{\det D\varphi^{-1}(y)}, \qquad y \in V .
$$
:::


The first statement is the definition of $\P_X$ for indicators followed by the standard machine; the second is the substitution formula for multiple integrals. In the language of the next section, "$X$ has density $f_X$" means $f_X = d\P_X/d\mathrm{Leb}$, and the change of variables formula describes how Radon–Nikodym derivatives transform under smooth maps. Discrete random variables fit the same framework: a probability mass function is the density of $\P_X$ with respect to counting measure. There is one theory of densities, not two.

## The Radon–Nikodym Theorem

### Statement and meaning

:::definition{#absolute-continuity title="Absolute Continuity and Singularity"}
Let $\mu, \nu$ be measures on $(\Omega, \cG)$. Then $\nu$ is **absolutely continuous** with respect to $\mu$, written $\nu \ll \mu$, if $\mu(A) = 0$ implies $\nu(A) = 0$; and $\nu$ is **singular** with respect to $\mu$, written $\nu \perp \mu$, if there is $B \in \cG$ with $\mu(B) = 0$ and $\nu(B^c) = 0$.
:::

:::theorem{#radon-nikodym title="Lebesgue Decomposition; Radon–Nikodym"}
Let $\mu, \nu$ be $\sigma$-finite measures on $(\Omega, \cG)$. Then $\nu$ decomposes uniquely as $\nu = \nu_{\mathrm{ac}} + \nu_{\mathrm{s}}$ with $\nu_{\mathrm{ac}} \ll \mu$ and $\nu_{\mathrm{s}} \perp \mu$, and there is a $\cG$-measurable $f \ge 0$, unique $\mu$-a.e., with

$$
\nu_{\mathrm{ac}}(A) = \int_A f \dd\mu \qquad \text{for all } A \in \cG .
$$

In particular, if $\nu \ll \mu$ then $\nu(A) = \int_A f \dd\mu$ for all $A$. One writes $f = d\nu/d\mu$ and calls $f$ the **Radon–Nikodym derivative** or **density** of $\nu$ with respect to $\mu$. If $\nu$ is finite then $f \in L^1(\mu)$.
:::

:::proof
The proof is omitted. Standard arguments use either the Riesz representation theorem or martingale convergence.
:::

The theorem answers the question: when is one measure a reweighting of another? A reweighting cannot create mass where $\mu$ has none, so $\nu \ll \mu$ is necessary; the theorem says it is also sufficient. The density should be thought of as a pointwise exchange rate: near $\omega$, an amount $d\mu$ of $\mu$-mass is worth $f(\omega)\,d\mu$ of $\nu$-mass. The name is justified by the change-of-measure formula, which follows from the defining identity by the standard machine:

$$
\int g \dd\nu = \int g\, \frac{d\nu}{d\mu} \dd\mu
\qquad \text{for all measurable } g \ge 0 .
$$
{#change-of-measure}

There are two readings of the Radon-Nikodym derivative $f$.

- *Global:* $f$ is the unique function whose integrals over sets reproduce $\nu$.
- *Local:* when the measures live on $\R^n$ and $\mu$ is Lebesgue measure, $f(x) = \lim_{\eps \downarrow 0} \nu(B_\eps(x))/\mu(B_\eps(x))$ for $\mu$-a.e. $x$, by the Lebesgue differentiation theorem ([[#lebesgue-differentiation]]). This gives a moral justification of the derivative notation: $f$ is a limit of ratios of masses of shrinking sets, finite although both masses tend to zero.

:::remark{#densities-elementary title="Densities in Elementary Probability"}
In elementary probability a random variable $X$ "has a density $f_X$" if $\P(X \in B) = \int_B f_X(x) \dd x$ for all Borel $B$. In the present language this says exactly that $\P_X \ll \mathrm{Leb}$ with $f_X = d\P_X/d\mathrm{Leb}$: the probability density function of elementary probability is the Radon–Nikodym derivative of the law of $X$ with respect to Lebesgue measure. Likewise a probability mass function is $d\P_X/d\#$, the derivative with respect to counting measure, and a joint density on $\R^2$ is $d\P_{(X,Y)}/d\mathrm{Leb}^2$. The theorem then tells us exactly which random variables have densities: those whose law gives probability zero to every Lebesgue-null set, and no others.
:::

### Likelihood ratios and change of measure

In statistics the Radon–Nikodym derivative appears under the more familiar name of the *likelihood ratio*. Let $P$ and $Q$ be two candidate distributions for the same data on a sample space $(S, \cS)$, both absolutely continuous with respect to a $\sigma$-finite reference measure $\lambda$, with densities $p = dP/d\lambda$ and $q = dQ/d\lambda$.

(a) *Chain rule.* If $\nu \ll \lambda \ll \mu$ then $\nu \ll \mu$ and $\frac{d\nu}{d\mu} = \frac{d\nu}{d\lambda}\,\frac{d\lambda}{d\mu}$ $\mu$-a.e. (Apply [[#change-of-measure]] twice.)

(b) *Likelihood ratio.* $Q \ll P$ iff $q = 0$ $\lambda$-a.e. on $\{p = 0\}$, and then $\frac{dQ}{dP} = \frac{q}{p}$ on $\{p > 0\}$. (For the formula: $\int_A \frac{q}{p}\,p \dd\lambda = \int_A q \dd\lambda = Q(A)$ for $A \subseteq \{p > 0\}$, and $P$ is carried by $\{p > 0\}$.)

(c) *Change of measure.* For $X \ge 0$ or $X \in L^1(Q)$, $\E_Q[X] = \E_P\big[X\, \tfrac{dQ}{dP}\big]$: expectations under one model can be computed by sampling from another and reweighting by the likelihood ratio (importance sampling). This is [[#change-of-measure]].

In words: a likelihood ratio is a local correction factor. At each sample point $x$ it says by how much to multiply $P$-mass near $x$ to obtain $Q$-mass near $x$, and integrating $P$ against it reproduces $Q$. That is precisely what a Radon–Nikodym derivative is; the likelihood ratio of elementary statistics *is* $dQ/dP$, computed as $q/p$ when both models are described by probability density functions. This is also the mechanism underlying Girsanov's theorem from stochastic calculus and the Kullback–Leibler divergence $D(Q \Vert P) = \E_Q[\log \frac{dQ}{dP}]$ from information theory (see [[InfoTheory]]).

## Conditional Expectation

### What an observer with partial information can measure

Fix a sub-$\sigma$-algebra $\cH \subseteq \cF$ and an integrable random variable $X$ defined on $\Omega$. An experiment is performed with law $\P$, yielding an outcome $\omega \in \Omega$. An oracle reports the value $X(\omega)$, but $\omega$ itself is concealed. Consider an observer who has $\cH$-information: for every $A \in \cH$, they know whether $A$ occurred. Equivalently, they can compute the value of any bounded $\cH$-measurable function $Z$, a weighted filter chosen on the basis of $\cH$-information. We call such a bounded $\cH$-measurable function $Z$ an **$\cH$-test**.

What is the observer's best guess, $V$ (a random variable on $\Omega$), for the random variable $X$? Two properties are forced.
1. The observer forms $V$ on the basis of what they know: on each run, they take the $\cH$-answers and produce a number. So $V(\omega)$ is determined by the set of $\cH$-answers at $\omega$. Therefore, the observer can always determine the answer to $\{ V \in B\}$ for all Borel $B$. This implies that the observer's best guess RV $V$ is $\cH$-measurable.
2. The observer's best guess ought to be consistent with $X$ given the information they *do* have: the observer can always compute $ZV$ and $ZX$, so there ought to be no detectable bias between them. In other words, the **$\cH$-observable averages** of $X$ must agree with those of $V$: $\E[ZV] = \E[ZX]$ for every $\cH$-test $Z$.

These two properties define the conditional expectation.

The basic tests are indicators $Z = \ind{A}$ with $A \in \cH$, for which $\E[\ind{A} X] = \int_A X \dd\P$ is the total of $X$ over the identifiable subpopulation $A$. They generate all the others.

:::proposition{#testing title="Testing Characterizes Partial Averaging"}
Let $\cH \subseteq \cF$ be a sub-$\sigma$-algebra and $X, Y \in L^1$; recall that an $\cH$-test is a bounded $\cH$-measurable random variable $Z$. Then

$$
\E[Z\,Y] = \E[Z\,X] \qquad \text{for every $\cH$-test } Z
$$
{#test-identity}

if and only if $\int_A Y \dd\P = \int_A X \dd\P$ for every $A \in \cH$.
:::

:::proof
Indicators of $\cH$-sets are $\cH$-tests, which gives one direction. For the other, the identity $\E[ZY] = \E[ZX]$ is linear in $Z$ and holds for indicators of $\cH$-sets by hypothesis; extend it by the standard machine, using dominated convergence for the limit steps (the simple approximants of a bounded $Z$ are uniformly bounded and $X, Y \in L^1$).
:::

### Definition, existence, uniqueness

:::definition{#conditional-expectation title="Conditional Expectation Given a σ-Algebra"}
Let $X \in L^1(\Omega, \cF, \P)$ and let $\cH \subseteq \cF$ be a sub-$\sigma$-algebra. A **conditional expectation of $X$ given $\cH$** is a random variable $Y$ such that

(CE1) $Y$ is $\cH$-measurable and integrable;

(CE2) $\displaystyle \int_A Y \dd\P = \int_A X \dd\P$ for all $A \in \cH$.

Any two such $Y$ agree a.s. ([[#ce-existence-uniqueness]]); the class is denoted $\E[X \mid \cH]$. For $B \in \cF$ we define $\P(B \mid \cH) = \E[\ind{B} \mid \cH]$. Conditioning on a random variable is defined below as conditioning on the $\sigma$-algebra it generates.
:::

Condition (CE2) is called **partial averaging**. By [[#testing]] it is the same as [[#test-identity]]: no $\cH$-test distinguishes $\E[X \mid \cH]$ from $X$. The two conditions are also exactly properties (i) and (ii) of [[#elementary-ce-properties]], with an arbitrary $\sigma$-algebra in place of a partition; for a partition, "averages over $\cH$-sets" means averages over unions of cells, and the only $\sigma(\cP)$-measurable function with the right cell averages is the step function of cell means.

<figure class="fig">
  <img src="/figures/measure-theoretic-probability/local-averaging.png" alt="A function on [0,1] together with its conditional expectations given two nested partition σ-algebras, shown as step functions of cell averages">
</figure>

*Conditional expectation with respect to a $\sigma$-algebra. In this example the probability space $(\Omega, \cF, \P)$ is the $[0,1]$ interval with the Lebesgue measure. We define the following $\sigma$-algebras: $\cA = \cF$; $\cB$ is the $\sigma$-algebra generated by the intervals with end-points $0, \tfrac14, \tfrac12, \tfrac34, 1$; and $\cC$ is the $\sigma$-algebra generated by the intervals with end-points $0, \tfrac12, 1$. Here the conditional expectation is effectively the average over the minimal sets of the $\sigma$-algebra. (Source: Wikipedia.)*

The figure above is the picture to keep in mind. The observer with information $\cA = \cF$ can evaluate $X$ itself. The observer with $\cB$ can only tell which quarter of $[0,1]$ the outcome fell in; the best they can do is the step function whose value on each quarter is the average of $X$ there, and this is the only function constant on quarters that no $\cB$-test can distinguish from $X$. The observer with $\cC$ sees only halves and gets a coarser step function. On every cell the area under the step function equals the area under $X$; coarsening the $\sigma$-algebra averages again and flattens further; and the trivial $\sigma$-algebra $\{\emptyset, \Omega\}$ gives the constant $\E X$. In the general case the cells may be null and the step-function description is not literally available, but (CE1)–(CE2) say the same thing without referring to cells.

:::theorem{#ce-existence-uniqueness title="Existence and Uniqueness of Conditional Expectation"}
For every $X \in L^1(\Omega, \cF, \P)$ and every sub-$\sigma$-algebra $\cH \subseteq \cF$, a conditional expectation $\E[X \mid \cH]$ exists, and any two versions agree a.s.
:::

:::proof
Uniqueness is [[#uniqueness-lemma]] on $(\Omega, \cH, \P|_\cH)$.

For existence suppose first $X \ge 0$ and define a finite measure on $(\Omega, \cH)$ by $\nu(A) = \int_A X \dd\P$, $A \in \cH$. If $\P(A) = 0$ then $\nu(A) = 0$, so $\nu \ll \P|_\cH$. [[#radon-nikodym]], applied on the measurable space $(\Omega, \cH)$, gives an $\cH$-measurable $Y \ge 0$ with $\nu(A) = \int_A Y \dd\P$ for all $A \in \cH$, and $\int Y \dd\P = \nu(\Omega) = \E X < \infty$. For general $X$ put $\E[X \mid \cH] = \E[X^+ \mid \cH] - \E[X^- \mid \cH]$; both conditions are linear in $X$.
:::

:::remark{#radon-nikodym-ce title="Conditional Expectation in Radon-Nikodym Form"}
The proof of the theorem exhibits $\E[X \mid \cH]$ as a density. For $X \ge 0$ integrable, the measure $X \, d\P$, defined by $A \mapsto \int_A X \, d\P$, and the measure $\P$ are both defined on $\cF$; restrict each to the sub-$\sigma$-algebra $\cH$, that is, retain their values on sets in $\cH$ and discard the rest. Both restrictions are measures on the measurable space $(\Omega, \cH)$, and $(X \, d\P)|_\cH \ll \P|_\cH$. The Radon--Nikodym theorem on $(\Omega, \cH)$ then gives 
$$
\E[X \mid \cH] = \frac{d\,(X \, d\P)|_{\cH}}{d\,\P|_{\cH}}
$$
and for general $X \in L^1$ the same holds with $X$ replaced by $X^+$ and
$X^-$ separately.
:::

:::example{#ce-examples title="Conditional Expectation in the Elementary Cases"}
For $\cH = \{\emptyset, \Omega\}$, $\E[X \mid \cH] = \E X$. For $\cH = \sigma(\cP)$ generated by a countable partition into cells of positive probability, $\E[X \mid \cH] = \E[X \mid \cP]$ of [[#elementary-conditional-expectation]]; in particular for $\cH = \{\emptyset, B, B^c, \Omega\}$ with $0 < \P(B) < 1$, $\E[X \mid \cH] = \E[X \mid B]\,\ind{B} + \E[X \mid B^c]\,\ind{B^c}$. For $\cH = \cF$, $\E[X \mid \cH] = X$. The general definition agrees with the elementary one wherever the elementary one applies.
:::

### Conditioning on a random variable

Let $X : \Omega \to \R$ be an integrable random variable, and let $Y : \Omega \to T$ be a measurable map into a measurable space $(T, \cT)$; in the most common case $T = \R^n$ with its Borel $\sigma$-algebra, but nothing below depends on this. We want to condition $X$ on the value of $Y$. The $\sigma$-algebra generated by $Y$ is

$$
\sigma(Y) = \{Y^{-1}(B) : B \in \cT\} = \{\{Y \in B\} : B \in \cT\} ,
$$

the collection of events that can be decided by observing $Y$. The law of $Y$ is the probability measure $\P_Y = \P \circ Y^{-1}$ on $(T, \cT)$, so $\P_Y(B) = \P(Y \in B)$, and integrals against $\P_Y$ are related to integrals against $\P$ by the pushforward formula ([[#pushforward]]): for measurable $h : T \to \R$ with $h(Y) \in L^1$,

$$
\int_\Omega h(Y(\omega))\; \P(d\omega) = \int_T h(y)\; \P_Y(dy) .
$$
{#pushforward-y}

:::definition{#ce-given-rv title="Conditional Expectation Given a Random Variable"}
Let $X \in L^1$ and let $Y : \Omega \to T$ be a measurable map into a measurable space $(T, \cT)$. The **conditional expectation of $X$ given $Y$** is the conditional expectation of $X$ given the $\sigma$-algebra generated by $Y$:

$$
\E[X \mid Y] \coloneqq \E[X \mid \sigma(Y)] .
$$

Likewise $\P(A \mid Y) \coloneqq \P(A \mid \sigma(Y))$ for $A \in \cF$.
:::

Conditioning on a random variable is thus a special case of conditioning on a $\sigma$-algebra, with the information taken to be exactly what $Y$ reveals. By [[#conditional-expectation]], $\E[X \mid Y]$ is the a.s.-unique integrable random variable that is $\sigma(Y)$-measurable and satisfies partial averaging over $\sigma(Y)$:

$$
\int_{\{Y \in B\}} \E[X \mid Y] \dd\P = \int_{\{Y \in B\}} X \dd\P
\qquad \text{for all } B \in \cT .
$$
{#ce-rv-partial-averaging}

We now transfer this from $\Omega$ to $T$. By Doob–Dynkin ([[#doob-dynkin]]), $\sigma(Y)$-measurability of $\E[X \mid Y]$ means that there is a measurable $g : T \to \R$ with

$$
\E[X \mid Y] = g(Y) \qquad \text{a.s.},
$$

and we rewrite [[#ce-rv-partial-averaging]] in terms of $g$. The left side of [[#ce-rv-partial-averaging]] is an integral over $\Omega$ of a function of $Y$, so it can be pushed forward to $T$ by [[#pushforward-y]] with $h = \ind{B}\, g$:

$$
\int_{\{Y \in B\}} \E[X \mid Y] \dd\P
= \int_\Omega \ind{B}(Y(\omega))\, g(Y(\omega))\; \P(d\omega)
= \int_T \ind{B}(y)\, g(y)\; \P_Y(dy)
= \int_B g \dd\P_Y .
$$

The right side of [[#ce-rv-partial-averaging]] is $\E[X \ind{\{Y \in B\}}]$, an integral over $\Omega$ that involves $X$ and cannot be pushed forward (it is not a function of $Y$ alone). Hence [[#ce-rv-partial-averaging]] becomes

$$
\int_B g \dd\P_Y = \E\big[X\,\ind{\{Y \in B\}}\big]
\qquad \text{for all } B \in \cT .
$$
{#ce-rv-rn}

Identity [[#ce-rv-rn]] characterizes $g$ as a Radon–Nikodym derivative on $T$. The right side, as a function of $B$, is a finite signed measure $\mu_X$ on $(T, \cT)$ (write $X = X^+ - X^-$ to see it as a difference of two finite measures), and it is absolutely continuous with respect to $\P_Y$: if $\P_Y(B) = 0$ then $\ind{\{Y \in B\}} = 0$ a.s. and $\mu_X(B) = 0$. So [[#ce-rv-rn]] says precisely that $g = d\mu_X / d\P_Y$, and by [[#radon-nikodym]] such a $g$ exists and is unique $\P_Y$-a.e. One defines

$$
\E[X \mid Y = y] \coloneqq g(y), \qquad y \in T ,
\qquad \text{so that} \qquad
\E[X \mid Y] = \E[X \mid Y = y]\big|_{y = Y(\omega)} \quad \text{a.s.}
$$

This is the general form of the elementary $\E[X \mid Y = y]$ of [[#elementary-conditional-expectation]](c). The function $y \mapsto \E[X \mid Y = y]$ is defined only up to $\P_Y$-null sets, and this cannot be improved: for a value $y$ with $\P(Y = y) = 0$ the identity [[#ce-rv-rn]] places no constraint on $g(y)$, while for a value with $\P(Y = y) > 0$, taking $B = \{y\}$ in [[#ce-rv-rn]] gives $g(y) = \E[X \ind{\{Y = y\}}]/\P(Y = y)$, the elementary conditional expectation given the event $\{Y = y\}$. Taking $B = T$ in [[#ce-rv-rn]] gives the *law of total expectation* in function form,

$$
\E X = \int_T \E[X \mid Y = y]\; \P_Y(dy) .
$$

:::definition{#ce-given-value title="Conditional Expectation Given $Y = y$"}
Let $X \in L^1$ and let $Y : \Omega \to T$ be a measurable map into a measurable space $(T, \cT)$, with law $\P_Y$. The **conditional expectation of $X$ given $Y = y$** is

$$
\E[X \mid Y = y] \coloneqq g(y), \qquad y \in T ,
$$

where $g : T \to \R$ is the $\P_Y$-a.e. unique measurable function satisfying [[#ce-rv-rn]], i.e. $\int_B g \dd\P_Y = \E\big[X\,\ind{\{Y \in B\}}\big]$ for all $B \in \cT$. Equivalently, $g = d\mu_X / d\P_Y$ with $\mu_X(B) = \E\big[X\,\ind{\{Y \in B\}}\big]$, and $\E[X \mid Y] = g(Y)$ a.s.
:::

### Properties

:::proposition{#ce-properties title="Properties of Conditional Expectation"}
Let $\cH \subseteq \cF$ be a sub-$\sigma$-algebra, $X, X', X_n \in L^1$, and $a, b \in \R$. All identities hold a.s.

(a) *Linearity:* $\E[aX + bX' \mid \cH] = a\E[X \mid \cH] + b\E[X' \mid \cH]$.

(b) *Monotonicity:* $X \le X'$ implies $\E[X \mid \cH] \le \E[X' \mid \cH]$; hence $\abs{\E[X \mid \cH]} \le \E[\abs{X} \mid \cH]$.

(c) *Total expectation:* $\E\big[\E[X \mid \cH]\big] = \E X$.

(d) *Tower:* if $\cG \subseteq \cH$ then $\E\big[\E[X \mid \cH] \,\big|\, \cG\big] = \E[X \mid \cG]$.

(e) *Pull-out:* if $Z$ is $\cH$-measurable and $ZX \in L^1$ then $\E[ZX \mid \cH] = Z\,\E[X \mid \cH]$; in particular $\E[X \mid \cH] = X$ if $X$ is $\cH$-measurable.

(f) *Independence:* if $\sigma(X)$ is independent of $\cH$ then $\E[X \mid \cH] = \E X$.

(g) *Monotone convergence:* if $0 \le X_n \uparrow X \in L^1$ then $\E[X_n \mid \cH] \uparrow \E[X \mid \cH]$.

(h) *Dominated convergence:* if $X_n \to X$ a.s. and $\abs{X_n} \le W \in L^1$ then $\E[X_n \mid \cH] \to \E[X \mid \cH]$ a.s.

(i) *Jensen:* if $\varphi : \R \to \R$ is convex and $\varphi(X) \in L^1$ then $\varphi(\E[X \mid \cH]) \le \E[\varphi(X) \mid \cH]$.

(j) *Contraction:* $\norm{\E[X \mid \cH]}_p \le \norm{X}_p$ for $p \ge 1$.
:::

:::proof
Each proof exhibits an $\cH$-measurable candidate satisfying (CE2) and invokes uniqueness.

(a) The right side satisfies (CE2) for $aX + bX'$ by linearity of the integral.

(b) With $D = \E[X' \mid \cH] - \E[X \mid \cH]$ and $A = \{D \le -1/n\} \in \cH$, $0 \le \int_A (X' - X) = \int_A D \le -\P(A)/n$, so $\P(A) = 0$.

(c) Take $A = \Omega$ in (CE2).

(d) $\E[X \mid \cG]$ is $\cG$-measurable, and for $A \in \cG \subseteq \cH$, $\int_A \E[X \mid \cG] = \int_A X = \int_A \E[X \mid \cH]$.

(e) For bounded $Z$ and $A \in \cH$, $\E[\ind{A} Z\, \E[X \mid \cH]] = \E[\ind{A} Z X]$ is [[#testing]] with test $\ind{A} Z$. For general $Z$ with $ZX \in L^1$, run the standard machine in $Z$.

(f) For $A \in \cH$, $\int_A X = \E[X \ind{A}] = \E X \cdot \P(A) = \int_A \E X$ by independence.

(g) By (b), $Y_n = \E[X_n \mid \cH]$ increases a.s. to an $\cH$-measurable $Y_\infty$, and for $A \in \cH$ monotone convergence gives $\int_A Y_\infty = \lim_n \int_A X_n = \int_A X$.

(h) Put $L_n = \inf_{k \ge n} X_k$ and $U_n = \sup_{k \ge n} X_k$, so $-W \le L_n \le X_n \le U_n \le W$ and $L_n \uparrow X$, $U_n \downarrow X$. Applying (g) to $L_n + W$ and to $W - U_n$ gives $\E[L_n \mid \cH] \uparrow \E[X \mid \cH]$ and $\E[U_n \mid \cH] \downarrow \E[X \mid \cH]$, and (b) squeezes $\E[X_n \mid \cH]$ between them.

(i) A convex $\varphi$ on $\R$ is continuous and is the supremum of the countable family of supporting lines $a_r x + b_r$ at rational $r$ (with $a_r$ a subgradient at $r$ and $b_r = \varphi(r) - a_r r$). For each $r$, $a_r \E[X \mid \cH] + b_r = \E[a_r X + b_r \mid \cH] \le \E[\varphi(X) \mid \cH]$ by (a) and (b); take the supremum over $r$.

(j) Apply (i) with $\varphi(x) = \abs{x}^p$ and then (c).
:::

:::remark{#properties-in-words title="Intuition"}
To reinforce intuition, it is helpful to prove the tower and pull-out properties in words, directly from the picture of $\cH$-tests. Recall that, by definition, $\E[X \mid \cH]$ is the $\cH$-measurable random variable that passes every $\cH$-test that $X$ passes, i.e. has the same $\cH$-observable averages as $X$.

*Tower.* Let $\cG \subseteq \cH$, so the $\cG$-observer is coarser than the $\cH$-observer, and every $\cG$-test is an $\cH$-test. Write $V = \E[X \mid \cH]$ and $U = \E[V \mid \cG]$.

1. $V$ has the same $\cH$-observable averages as $X$ (definition of $V$). Since $\cG$-tests are $\cH$-tests, in particular $V$ has the same $\cG$-observable averages as $X$.
2. $U$ is $\cG$-measurable and has the same $\cG$-observable averages as $V$ (definition of $U$).
3. Combining (1) and (2): $U$ is $\cG$-measurable and has the same $\cG$-observable averages as $X$.

But (3) is exactly the definition of $\E[X \mid \cG]$, and by uniqueness there is only one such random variable. Hence $U = \E[X \mid \cG]$, which is the tower property. In words: summarizing $X$ at fine resolution and then summarizing the result at coarse resolution gives the same thing as summarizing $X$ directly at coarse resolution, because the coarse observer cannot see any difference between $X$ and the finer summary to begin with.

*Pull-out.* Let $Z$ be a bounded $\cH$-measurable random variable, a quantity the $\cH$-observer knows. The claim is that $Z\,\E[X \mid \cH]$ is the $\cH$-summary of $ZX$. It is $\cH$-measurable, being a product of $\cH$-measurable functions, so it remains to check that it has the same $\cH$-observable averages as $ZX$. Take any $\cH$-test $W$. The product $ZW$ is again bounded and $\cH$-measurable, hence again an $\cH$-test, and

$$
\E\big[W \cdot ZX\big] = \E\big[(ZW)\, X\big]
= \E\big[(ZW)\, \E[X \mid \cH]\big]
= \E\big[W \cdot Z\,\E[X \mid \cH]\big],
$$

the middle equality because $\E[X \mid \cH]$ passes the $\cH$-test $ZW$. So $Z\,\E[X \mid \cH]$ passes every $\cH$-test that $ZX$ passes, and by uniqueness it is $\E[ZX \mid \cH]$. In words: testing $ZX$ with a weight $W$ is the same as testing $X$ with the weight $ZW$, which is still a weight the observer can construct; so a factor the observer knows can be moved outside the summary, exactly as a constant can be moved outside an expectation. (For unbounded $Z$ with $ZX \in L^1$ the same argument applies to truncations of $Z$, and the standard machine passes to the limit.)
:::

### Conditional variance and the law of total variance

For $X \in L^2$ the **conditional variance** is defined as

$$
\Var(X \mid \cH) = \E\big[(X - \E[X \mid \cH])^2 \,\big|\, \cH\big].
$$
Let's take a moment to interpret and digest this definition. It is useful and generalizable to think of the variance of a random variable as *the dispersion around the best available guess, assessed with the available information*. For example, when no information is available (i.e. when conditioning on the trivial sigma algebra $\cH = \{\emptyset, \Omega \}$), our best guess is $\E[X]$, the true dispersion of $X$ around our best guess is $(X-\E[X])^2$, and our best guess for this true dispersion is $\E[(X-\E[X])^2]$. 

Now let's generalize to the case where we have $\cH$-information: our best guess for $X$ is now the random variable $\E[X \mid \cH]$, the true dispersion of $X$ around our best guess is the random variable $(X - \E[X \mid \cH])^2$, and our best guess for this true dispersion is the random variable $\E[(X - \E[X \mid \cH])^2 \mid \cH]$. This is where the definition comes from.

Expanding the square and using the pull-out property from [[#ce-properties]], one sees that
$$
\Var(X \mid \cH) = \E[X^2 \mid \cH] - \E[X \mid \cH]^2.
$$

Taking expectations on both sides and doing some algebra, we obtain **the law of total variance**:

$$
\Var(X) = \E\big[\Var(X \mid \cH)\big] + \Var\big(\E[X \mid \cH]\big) .
$$
{#total-variance}

In words, this says "total dispersion = average residual uncertainty after learning $\cH$ + dispersion of the guess itself across information states". The second term is the part of the variance that $\cH$ accounts for. The first is what remains at resolution $\cH$.

### The L² picture and regression

In the case where $X \in L^2$, one has an inner product space with rich geometric structure. The conditional expectation $\E[X \mid \cH]$ has a simple and intuitive geometric characterization.

:::theorem{#l2-projection title="Conditional Expectation as Orthogonal Projection"}
Let $X \in L^2$ and let $\cH \subseteq \cF$ be a sub-$\sigma$-algebra. Then $\E[X \mid \cH] \in L^2$ and for every $\cH$-measurable $W \in L^2$,

$$
\E[(X - W)^2] = \E\big[(X - \E[X \mid \cH])^2\big]
+ \E\big[(\E[X \mid \cH] - W)^2\big] .
$$

Hence $\E[X \mid \cH]$ is the orthogonal projection of $X$ onto the closed subspace $L^2(\Omega, \cH, \P)$, and the unique minimizer of $\E[(X - W)^2]$ over $\cH$-measurable $W \in L^2$.
:::

:::proof
$\E[X \mid \cH] \in L^2$ by contraction. Write $\hat X = \E[X \mid \cH]$ and expand $\E[(X - W)^2] = \E[(X - \hat X)^2] + 2\E[(X - \hat X)(\hat X - W)] + \E[(\hat X - W)^2]$. The cross term is $\E[(X - \hat X) Z]$ with $Z = \hat X - W \in L^2(\cH)$, which vanishes: for bounded $Z$ by [[#testing]], and for $Z \in L^2(\cH)$ by truncating $Z$ and passing to the limit with Cauchy–Schwarz. The identity shows the minimum over $W$ is attained exactly at $W = \hat X$.
:::

<figure class="fig">
  <img src="/figures/measure-theoretic-probability/projection.svg" alt="X projected orthogonally onto the plane of H-measurable random variables; the foot of the perpendicular is the conditional expectation">
</figure>

*Conditional expectation as orthogonal projection. The plane represents the closed subspace $L^2(\Omega, \cH, \P)$ of $L^2(\Omega, \cF, \P)$. The residual $X - \E[X \mid \cH]$ is orthogonal to the whole plane (this is the testing condition [[#test-identity]] with $Z \in L^2(\cH)$), so for any other $\cH$-measurable $W$ the triangle with vertices $X$, $\E[X \mid \cH]$, $W$ has a right angle at $\E[X \mid \cH]$, and $\E[(X - W)^2] = \E[(X - \E[X \mid \cH])^2] + \E[(\E[X \mid \cH] - W)^2]$ is Pythagoras. The foot of the perpendicular is the closest point of the plane to $X$.*

The figure is the picture. The residual $X - \E[X \mid \cH]$ is the part of $X$ that no $\cH$-test can detect, since it is orthogonal to every $\cH$-measurable $Z$; $\E[X \mid \cH]$ is the part that lies entirely within the observer's reach. Among all random variables the observer can evaluate, it is the closest to $X$ in mean square, and the distance $\E[(X - \E[X \mid \cH])^2] = \E[\Var(X \mid \cH)]$ is the part of the variance of $X$ that the observer cannot resolve.

With $\cH = \sigma(X_1, \dots, X_d)$ and a response $Y \in L^2$, the theorem says that $\E[Y \mid X_1, \dots, X_d] = g(X_1, \dots, X_d)$ is the best predictor of $Y$ from the covariates in mean square, over all measurable functions $g$. This $g$ is the **regression function**, and it is the object approximated by supervised learning: linear regression, trees and neural networks restrict $g$ to a subclass and minimize an empirical version of $\E[(Y - g(X))^2]$, but the population target of every such method is the conditional expectation. The identity of the theorem, with $W = g(X)$ for a candidate predictor, decomposes the prediction error into an *approximation error* $\E[(\E[Y \mid X] - g(X))^2]$ and an *irreducible error* $\E[(Y - \E[Y \mid X])^2] = \E[\Var(Y \mid X)]$ which no predictor based on $X$ can reduce.

One caution: conditional expectation does not minimize $\E\abs{X - W}$; the $L^1$-optimal summary is a conditional median. The mean is the $L^2$-optimizer and, more fundamentally, the unique matcher of linear averages.

## Conditional Expectation from a Joint Density

Introductory courses state that when $(X, Y)$ has a joint density $f$, the conditional expectation of $Y$ given $X = x$ is

$$
\E[Y \mid X = x] = \int_\R y\, f_{Y \mid X}(y \mid x) \dd y,
\qquad f_{Y \mid X}(y \mid x) = \frac{f(x,y)}{f_X(x)} .
$$

In such a course this is presented as a definition, adopted by analogy with the discrete formula of [[#elementary-conditional-expectation]](c), because the event $\{X = x\}$ has probability zero and the elementary definition does not apply. In this section, we prove it is a theorem: the formula computes the Kolmogorov conditional expectation of the previous section, in the sense of conditioning on a random variable.

Note that the roles of $X$ and $Y$ are reversed relative to the previous section: following the convention of regression, we now condition $Y$ on $X$, so $\mu_Y(B) = \E\big[Y \ind{\{X \in B\}}\big]$ and $\P_X$ play the roles that $\mu_X$ and $\P_Y$ played there.

Let $(X, Y)$ be real random variables with joint density $f$ with respect to Lebesgue measure on $\R^2$, let $f_X(x) = \int_\R f(x,y) \dd y$ be the marginal density of $X$, and assume $Y \in L^1$, i.e. $\iint \abs{y} f(x,y) \dd x \dd y < \infty$.

:::theorem{#ce-from-density title="Conditional Expectation from a Joint Density"}
Let $(X, Y)$ be real random variables with joint density $f$ with respect to Lebesgue measure on $\R^2$, let $f_X(x) = \int_\R f(x,y) \dd y$ be the marginal density of $X$, and assume $Y \in L^1$. Define

$$
h(x) =
\begin{dcases}
\frac{\displaystyle \int_\R y\, f(x,y) \dd y}{f_X(x)}, & f_X(x) > 0, \\[1.2em]
0, & f_X(x) = 0 .
\end{dcases}
$$

Then $h$ is Borel, $h(X) \in L^1$, and $\E[Y \mid X] = h(X)$ a.s.; that is, $\E[Y \mid X = x] = h(x)$ for $\P_X$-a.e. $x$.
:::

### Proof

By the previous section the task is to find a Borel $h$ satisfying [[#ce-rv-rn]], which here reads

$$
\int_{\{X \in B\}} h(X) \dd\P = \int_{\{X \in B\}} Y \dd\P
\qquad \text{for all Borel } B \subseteq \R ,
$$
{#density-task}

and uniqueness then identifies $h(X)$ as $\E[Y \mid X]$.

:::proof
Write $N(x) = \int_\R y\, f(x,y) \dd y$. By Tonelli,

$$
\int_\R \Big( \int_\R \abs{y}\, f(x,y) \dd y \Big) \dd x = \E\abs{Y} < \infty,
$$

so $\int \abs{y} f(x, \cdot) < \infty$ for a.e. $x$; hence $N$ is finite a.e., and $N$ and $f_X$ are Borel by [[#fubini-tonelli]]. So $h = (N/f_X)\ind{\{f_X > 0\}}$ is Borel.

Compute both sides of [[#density-task]]. By Fubini,

$$
\int_{\{X \in B\}} Y \dd\P = \iint \ind{B}(x)\, y\, f(x,y) \dd y \dd x
= \int_B N(x) \dd x ,
$$

and since $X$ has density $f_X$,

$$
\int_{\{X \in B\}} h(X) \dd\P = \int_B h(x)\, f_X(x) \dd x .
$$

Thus [[#density-task]] holds for all $B$ iff $\int_B h f_X = \int_B N$ for all Borel $B$, iff ([[#uniqueness-lemma]] on $(\R, \cB(\R), \mathrm{Leb})$)

$$
h(x)\, f_X(x) = N(x) \qquad \text{for a.e. } x .
$$
{#cleared}

This is the definition of $h$ with the denominator cleared. On $\{f_X = 0\}$ both sides vanish: $f(x, \cdot) \ge 0$ has integral $0$, so it is $0$ for a.e. $y$ and $N(x) = 0$, while $h(x) f_X(x) = 0$ whatever $h(x)$ is. Finally $\E\abs{h(X)} = \int \abs{h} f_X \le \int \abs{N} \le \E\abs{Y}$.
:::

The value of $h$ on $\{f_X = 0\}$ is arbitrary because $\P(X \in \{f_X = 0\}) = \int_{\{f_X = 0\}} f_X = 0$; the formula defines $h$ only $\P_X$-a.e., which is all that can be asked. As a check, if $X$ is discrete with mass function $p_X$ and $(X,Y)$ has joint mass function $p$ (densities with respect to counting measure in $x$), the same computation gives $\E[Y \mid X = x] = \sum_y y\, p(x,y)/p_X(x)$, which is the elementary $\E[Y \ind{\{X = x\}}]/\P(X = x)$.

### Another explanation

Let $X$ and $Y$ be real random variables with $Y \in L^1$, and let $\P_X = \P \circ X^{-1}$ be the law of $X$, a probability measure on $\cB(\R)$ with $\P_X(B) = \P(X \in B)$. No density is assumed in this subsection. By [[#ce-given-value]] (with the roles of $X$ and $Y$ exchanged), $\E[Y \mid X = x]$ is the
Radon--Nikodym derivative
$$
g = \frac{d\mu_Y}{d\P_X}, \qquad \mu_Y(B) = \E\big[ Y \, \ind{\{X \in B\}} \big],
$$
where $\mu_Y$ is a finite signed measure on $\R$ with $\mu_Y \ll \P_X$. The following theorem from real analysis evaluates such a derivative pointwise as a limit of ratios of masses of shrinking intervals.

:::theorem{#differentiation-of-measures title="Differentiation of Measures"}
Let $\mu$ be a finite Borel measure on $\R$ and let $\nu$ be a finite Borel measure with $\nu \ll \mu$. Then for $\mu$-a.e. $x$, $\mu\big((x - \eps, x + \eps)\big) > 0$ for every $\eps > 0$, and
$$
\frac{d\nu}{d\mu}(x) = \lim_{\eps \downarrow 0}
\frac{\nu\big((x - \eps, x + \eps)\big)}{\mu\big((x - \eps, x + \eps)\big)} .
$$
:::

Applying the theorem to $\mu = \P_X$ and $\nu = \mu_Y$ yields the below, alternative characterization of the conditional expectation. 

:::theorem{#conditional-expectation-as-limit title="Conditional Expectation as a Limit of Elementary Conditional Expectations"}
Let $X, Y$ be real random variables with $Y \in L^1$, and let $\P_X$ be the law of $X$. For $\P_X$-a.e. $x$, the events $\{\abs{X - x} < \eps\}$ have positive probability for every $\eps > 0$, the limit
$$
\lim_{\eps \downarrow 0} \E\big[ Y \,\big|\, \abs{X - x} < \eps \big] = \lim_{\eps \downarrow 0} \frac{\E\big[ Y \, \ind{\{\abs{X - x} < \eps\}} \big]}{\P(\abs{X - x} < \eps)}
$$
of elementary conditional expectations exists, and it equals $\, \E[Y \mid X = x]$.
:::

:::proof
Apply [[#differentiation-of-measures]] with $\mu = \P_X$ and $\nu = \mu_{Y^+}$, then with $\nu = \mu_{Y^-}$, and subtract. For every $x$, $\mu_Y\big((x - \eps, x + \eps)\big) = \E[Y \, \ind{\{\abs{X - x} < \eps\}}]$ and $\P_X\big((x - \eps, x + \eps)\big) = \P(\abs{X - x} < \eps)$, so the ratio in the theorem is the ratio displayed, and its limit is $g(x) = \E[Y \mid X = x]$ for $\P_X$-a.e. $x$.
:::
When a joint density exists the rates can be computed, and [[#conditional-expectation-as-limit]] becomes a formula. Suppose $(X, Y)$ has a joint density $f$ with respect to Lebesgue measure on $\R^2$, let $f_X(x) = \int_\R f(x, y) \dd y$ be the marginal density of $X$, and write
$$
N(x) = \int_\R y \, f(x, y) \dd y
$$
for the $Y$-weighted slice at $x$. By Tonelli, $\int_\R \int_\R \abs{y} \, f(x,y) \dd y \dd x = \E\abs{Y} < \infty$, so $N \in L^1(\R)$; and by Fubini, for every interval $I$,
$$
\mu_Y(I) = \iint \ind{I}(x) \, y \, f(x, y) \dd y \dd x = \int_I N(u) \dd u ,
\qquad
\P_X(I) = \int_I f_X(u) \dd u .
$$
So $N$ and $f_X$ are the densities, with respect to Lebesgue measure, of the two measures whose ratio [[#conditional-expectation-as-limit]] differentiates, and the following theorem evaluates the limit.

:::theorem{#lebesgue-differentiation title="Lebesgue Differentiation"}
If $\psi \in L^1_{\mathrm{loc}}(\R)$, then for Lebesgue-a.e. $x$,
$$
\lim_{\eps \downarrow 0} \frac{1}{2\eps} \int_{x - \eps}^{x + \eps} \psi(u) \dd u = \psi(x) .
$$
:::

:::theorem{#conditional-expectation-joint-density title="Conditional Expectation from a Joint Density, as a Ratio of Rates"}
Let $(X, Y)$ be real random variables with joint density $f$ with respect to Lebesgue measure on $\R^2$ and $Y \in L^1$, and write $f_X(x) = \int_\R f(x, y) \dd y$ and $N(x) = \int_\R y \, f(x, y) \dd y$. Then for $\P_X$-a.e. $x$,
$$
\E[Y \mid X = x] = \frac{\int_\R y \, f(x, y) \dd y}{f_X(x)} = \frac{N(x)}{f_X(x)} .
$$
:::

:::proof
By the Fubini identities, for every $x$ and $\eps > 0$,
$$
\frac{\mu_Y\big((x - \eps, x + \eps)\big)}{\P_X\big((x - \eps, x + \eps)\big)}
= \frac{\frac{1}{2\eps} \int_{x - \eps}^{x + \eps} N(u) \dd u}
       {\frac{1}{2\eps} \int_{x - \eps}^{x + \eps} f_X(u) \dd u} .
$$
By [[#lebesgue-differentiation]] applied to $N$ and to $f_X$, the numerator tends to $N(x)$ and the denominator to $f_X(x)$ for Lebesgue-a.e. $x$, so the ratio tends to $N(x)/f_X(x)$ wherever $f_X(x) > 0$. The set $\{f_X = 0\}$ is $\P_X$-null, since $\P(X \in \{f_X = 0\}) = \int_{\{f_X = 0\}} f_X = 0$. By [[#conditional-expectation-as-limit]] the same ratio tends to $\E[Y \mid X = x]$ for $\P_X$-a.e. $x$, and the two limits agree.
:::

The formula reads
$$
\E[Y \mid X = x] = \frac{N(x)}{f_X(x)}
= \frac{\text{rate at which $Y$-mass accumulates per unit } x}
       {\text{rate at which probability accumulates per unit } x}.
$$

## Conditional Distributions

In a first course in elementary probability, the order of ideas is: define the conditional distribution of $X$ given $Y = y$ (a conditional mass function or conditional density), and then define the conditional expectation as its mean. Kolmogorov's theory reverses this order. Conditional *expectation* comes first: it is one Radon–Nikodym derivative, it exists on every probability space for every sub-$\sigma$-algebra, and no distribution was needed to define it. The conditional *distribution* comes second, and it is a theorem rather than a definition: it is the assertion that the conditional probabilities $\P(X \in A \mid \cH)$, one for each set $A$, can be assembled into a genuine probability measure. Assembling them requires uncountably many Radon–Nikodym derivatives to be chosen consistently, and that consistency requirement is the subject of this section.

It's important to keep in mind that *no new notion of conditioning is introduced in this section*. The basic object throughout is the conditional expectation from [[#conditional-expectation]], applied to indicators:

$$
\P(X \in A \mid \cH) \;=\; \E\big[\ind{\{X \in A\}} \,\big|\, \cH\big],
\qquad A \in \cS ,
$$

an $\cH$-measurable random variable for each $A$, unique up to a null set, characterized by partial averaging: $\int_H \P(X \in A \mid \cH) \dd\P = \P(\{X \in A\} \cap H)$ for all $H \in \cH$.

The section is organized as follows. The first subsection states what conditional expectation provides and what is missing. The second introduces kernels, the kind of object a conditional distribution would have to be; it is pure measure theory. The next two define the regular conditional distribution, prove it unique, re-index it by the value of a conditioning variable, and prove it exists on standard Borel spaces. Then integrating against it is shown to recover every $\E[g(X) \mid \cH]$, a general case of the familiar *Law of the Unconscious Statistician* from elementary probability. The remaining subsections treat the density case, conditional independence, Bayes' theorem, Bayesian decision theory, and the Borel–Kolmogorov paradox.

The figure below shows how the objects of the section depend on one another.

<figure class="fig">
  <img src="/figures/measure-theoretic-probability/section-map.svg" alt="Dependency diagram: conditional expectation at the top, conditional probabilities, kernels, the regular conditional distribution, integration, the conditional law given a random variable, and the instances at the bottom">
</figure>

### Conditional probabilities and the choice of versions

Fix $X : \Omega \to S$ measurable and $\cH \subseteq \cF$. For each $A \in \cS$, [[#conditional-expectation]] provides the random variable $\P(X \in A \mid \cH)$. Consider the collection of all of them as a function of $A$, holding $\omega$ fixed:

$$
A \;\longmapsto\; \P(X \in A \mid \cH)(\omega) .
$$

One would like this to be a probability measure on $S$ — "the distribution of $X$ given the information $\cH$, at the outcome $\omega$." Conditional expectation nearly provides this. By monotonicity and conditional monotone convergence ([[#ce-properties]](b),(g)):

- $0 \le \P(X \in A \mid \cH) \le 1$ a.s., and $\P(X \in S \mid \cH) = 1$ a.s.;
- for disjoint $A_1, A_2, \dots$, $\P(X \in \bigcup_n A_n \mid \cH) = \sum_n \P(X \in A_n \mid \cH)$ a.s.

These are the axioms of a probability measure, each holding almost surely. The difficulty lies in the qualifier "almost surely." Each statement holds off its own null set, and there are uncountably many statements: one for each $A$, one for each disjoint sequence. The union of uncountably many null sets might well be the entire universe $\Omega$: one could have a situation in which there is no single $\omega$ at which all the statements hold at once.

The problem is therefore not one of definition but of *choice of versions*. Each $\P(X \in A \mid \cH)$ is an a.s.-class, and one is free to pick a representative. The question is whether representatives can be picked, for all $A$ simultaneously, so that the result is a probability measure at every $\omega$. When $\cH = \sigma(\cP)$ for a countable partition there is no difficulty: on each cell $B_i$ the natural version is the elementary $\P(X \in A \mid B_i)$, which is a probability measure in $A$ because $\P(\cdot \mid B_i)$ is. In general the answer is affirmative when $S$ is a standard Borel space and negative otherwise; the construction is given in the existence subsection.

### Kernels and composition

This subsection involves no probability. It defines the kind of object a conditional distribution would have to be, and the one operation on such objects that will be needed.

:::definition{#kernel title="Probability Kernel"}
Let $(T, \cT)$ and $(S, \cS)$ be measurable spaces. A **(Markov) probability kernel** from $T$ to $S$ is a map $\kappa : T \times \cS \to [0,1]$ such that

(K1) for each $t$, $A \mapsto \kappa(t, A)$ is a probability measure on $(S, \cS)$;

(K2) for each $A \in \cS$, $t \mapsto \kappa(t, A)$ is $\cT$-measurable.
:::

In words, a kernel is a measurable family of probability measures on $S$ indexed by $t \in T$: for each $t$ one has a distribution $\kappa(t, \cdot)$ on $S$, and the dependence on $t$ is measurable. This is the mathematical form of "the distribution of $X$ given $W = t$."

The operation is *composition* of a measure with a kernel: from the distribution $\pi$ of $W$ and a kernel $\kappa$, produce a joint distribution on $T \times S$. In elementary terms, $p(t, x) = p(t)\,p(x \mid t)$, so the slogan to keep in mind is "we can assemble one distribution and one conditional distribution into a joint distribution".

:::lemma{#composition title="Composition of a Measure and a Kernel"}
Let $\pi$ be a probability measure on $(T, \cT)$ and $\kappa$ a probability kernel from $T$ to $S$. There is a unique probability measure $\pi \otimes \kappa$ on $(T \times S, \cT \otimes \cS)$ with

$$
(\pi \otimes \kappa)(B \times A) = \int_B \kappa(t, A)\; \pi(dt)
\qquad \text{for all } B \in \cT,\ A \in \cS ,
$$

and for measurable $g \ge 0$ on $T \times S$, $\int g \dd(\pi \otimes \kappa) = \int_T \int_S g(t, s)\, \kappa(t, ds)\, \pi(dt)$. Its first marginal is $\pi$ and its second marginal is $\pi\kappa(A) \coloneqq \int_T \kappa(t, A)\, \pi(dt)$.
:::

:::proof
For $C \in \cT \otimes \cS$ let $C_t = \{s : (t,s) \in C\}$ be the section. The class of $C$ for which $t \mapsto \kappa(t, C_t)$ is measurable contains the rectangles and is a $\lambda$-system (by (K1) and limits of measurable functions), so it is all of $\cT \otimes \cS$. Define $(\pi \otimes \kappa)(C) = \int_T \kappa(t, C_t)\, \pi(dt)$; countable additivity follows from that of $\kappa(t, \cdot)$ and monotone convergence. Uniqueness holds because rectangles form a $\pi$-system generating $\cT \otimes \cS$. The integral formula is the standard machine, and the marginals are read off from $C = B \times S$ and $C = T \times A$.
:::

The second marginal $\pi\kappa$ is the *mixture* of the kernel by $\pi$, the elementary $p(x) = \int p(t)\,p(x \mid t)\dd t$. When $\kappa(t, \cdot) = \nu$ does not depend on $t$, $\pi \otimes \kappa$ is the product measure $\pi \otimes \nu$ and the lemma is Fubini: a constant kernel is independence.

### The regular conditional distribution

The first subsection posed the question: can versions of the random variables $\P(X \in A \mid \cH)$ be chosen so that, for every $\omega$, $A \mapsto \P(X \in A \mid \cH)(\omega)$ is a probability measure? The previous subsection supplied the appropriate notion: such a choice is a kernel from $(\Omega, \cH)$ to $(S, \cS)$. This leads to the following definition.

:::definition{#rcd title="Regular Conditional Distribution Given a σ-Algebra"}
Let $(S, \cS)$ be a measurable space, $X : \Omega \to S$ measurable, and $\cH \subseteq \cF$ a sub-$\sigma$-algebra. A **regular conditional distribution (RCD) of $X$ given $\cH$** is a probability kernel $\kappa$ from $(\Omega, \cH)$ to $(S, \cS)$ such that for every $A \in \cS$, the random variable $\kappa(\,\cdot\,, A) : \omega \mapsto \kappa(\omega, A)$ is a version of the conditional probability $\P(X \in A \mid \cH)$:

$$
\kappa(\omega, A) = \P(X \in A \mid \cH)(\omega)
\qquad \text{for $\P$-a.e. } \omega .
$$
:::

The two conditions in the definition correspond to the two requirements of the first subsection. That $\kappa$ is a kernel from $(\Omega, \cH)$ means that at every $\omega$, $\kappa(\omega, \cdot)$ is a probability measure (K1), and that for each $A$ the function $\kappa(\cdot, A)$ is $\cH$-measurable (K2), so that it is a candidate for a version of the $\cH$-measurable random variable $\P(X \in A \mid \cH)$. The displayed identity says that it is a version, for each $A$. The right side is the conditional probability of the section on conditional expectation; the definition introduces no new notion of conditioning. What it requires is that the versions can be chosen consistently across all $A$, so as to form a measure at every $\omega$. The word "regular" refers to this requirement. An RCD may or may not exist; when it does, it answers the question posed above.

Thus $\kappa$ is a *random probability measure*: a measurable map $\omega \mapsto \kappa(\omega, \cdot)$ into the distributions on $S$, depending on $\omega$ only through $\cH$-information, whose value is the distribution assigned to $X$ once all $\cH$-questions are answered. In elementary terms it is the conditional mass function $p_{X \mid Y}(\cdot \mid y)$ or conditional density $f_{X \mid Y}(\cdot \mid y)$, a whole distribution for $X$ attached to each state of the conditioning information, with the conditioning variable replaced by a $\sigma$-algebra and no discreteness or density assumed. For $\cH = \sigma(\cP)$, $\kappa(\omega, A) = \P(X \in A \mid B_i)$ on the cell $B_i \ni \omega$; in the density case $\kappa(\omega, A) = \int_A f_{X \mid Y}(x \mid Y(\omega)) \dd x$.

:::proposition{#rcd-uniqueness title="Uniqueness of the RCD"}
Suppose $\cS$ is countably generated (such as, for example, the Borel $\sigma$-algebra). If $\kappa, \kappa'$ are two RCDs of $X$ given $\cH$, then $\kappa(\omega, \cdot) = \kappa'(\omega, \cdot)$ for a.e. $\omega$.
:::

:::proof
Let $\cA_0$ be a countable algebra generating $\cS$. For each $A \in \cA_0$, both $\kappa(\cdot, A)$ and $\kappa'(\cdot, A)$ are versions of $\P(X \in A \mid \cH)$, so they agree off a null set $N_A$. Off the null set $\bigcup_{A \in \cA_0} N_A$, the probability measures $\kappa(\omega, \cdot)$ and $\kappa'(\omega, \cdot)$ agree on the $\pi$-system $\cA_0$, hence on $\sigma(\cA_0) = \cS$.
:::

The proof shows that uniqueness is inherited from the a.s. uniqueness of each $\P(X \in A \mid \cH)$ ([[#uniqueness-lemma]]), and that countable generation is what allows the countably many null sets to be collected into one.

Existence is proved two subsections below. First we describe the same object indexed by the value of a random variable.

**Re-indexing by the value of a random variable.** When $\cH = \sigma(W)$ for a random variable $W : \Omega \to T$, every $\sigma(W)$-measurable quantity is a function of $W$ (Doob–Dynkin), and it is natural to index the family of conditional distributions by the *value* $t$ of $W$ rather than by $\omega$. This is the passage from $\E[X \mid Y]$ to $\E[X \mid Y = y]$, applied to a random measure instead of a random variable. Its characterizing identity is partial averaging (CE2), written on the range of $W$.

:::definition{#conditional-law title="Conditional Law Given a Random Variable"}
Let $X : \Omega \to S$ and $W : \Omega \to T$ be measurable, and let $\P_W$ be the law of $W$. A **conditional law of $X$ given $W = t$** is a probability kernel $\kappa$ from $T$ to $S$ such that

$$
\P(X \in A,\, W \in B) = \int_B \kappa(t, A)\; \P_W(dt)
\qquad \text{for all } A \in \cS,\ B \in \cT ;
$$
{#disintegration}

equivalently, the law of $(W, X)$ is the composition $\P_W \otimes \kappa$. One writes $\kappa(t, A) = \P(X \in A \mid W = t)$ and calls [[#disintegration]] the **disintegration** of the joint law of $(W, X)$ along $W$.
:::

To see that this is the same object as [[#rcd]] and not a new one, let $W$ be a coin flip, so that $\sigma(W) = \{\emptyset, \{W = H\}, \{W = T\}, \Omega\}$. An RCD of $X$ given $\sigma(W)$ is a kernel $\kappa_0(\omega, \cdot)$ indexed by outcomes $\omega \in \Omega$, but $\sigma(W)$-measurability forces it to take only two values: one distribution for every $\omega$ with $W(\omega) = H$, another for every $\omega$ with $W(\omega) = T$. A conditional law of $X$ given $W = t$ is a kernel $\kappa(t, \cdot)$ indexed by $t \in \{H, T\}$: the same two distributions, now labelled by the value of the coin. The two are related by $\kappa_0(\omega, \cdot) = \kappa(W(\omega), \cdot)$, and this is the general relationship: the conditional law given $W = t$ is the RCD given $\sigma(W)$ with the index $\omega$ replaced by the value $W(\omega)$, exactly as $\E[X \mid Y = y]$ is $\E[X \mid Y]$ with $\omega$ replaced by $Y(\omega)$.

:::proposition{#two-definitions title="Equivalence of the Two Definitions"}
In the setting of [[#conditional-law]] (with $X : \Omega \to S$ and $W : \Omega \to T$ measurable), let $\kappa$ be a kernel from $T$ to $S$ and put $\kappa_0(\omega, A) = \kappa(W(\omega), A)$. Then $\kappa$ is a conditional law of $X$ given $W = t$ if and only if $\kappa_0$ is an RCD of $X$ given $\sigma(W)$. Conversely, if $\cS$ is countably generated, every RCD of $X$ given $\sigma(W)$ is a.s. of the form $\kappa_0$ for some conditional law $\kappa$.
:::

:::proof
$\kappa_0$ is a kernel from $(\Omega, \sigma(W))$ to $S$: (K1) is inherited from $\kappa$, and $\omega \mapsto \kappa(W(\omega), A)$ is $\sigma(W)$-measurable as a measurable function of $W$. Fix $A$. The $\sigma(W)$-sets are exactly the sets $\{W \in B\}$, $B \in \cT$, so by (CE2) the random variable $\kappa_0(\cdot, A)$ is a version of $\P(X \in A \mid \sigma(W))$ if and only if

$$
\int_{\{W \in B\}} \kappa(W(\omega), A)\; \P(d\omega)
= \P\big(\{X \in A\} \cap \{W \in B\}\big)
\qquad \text{for all } B \in \cT .
$$

By the pushforward formula ([[#pushforward]]) the left side is $\int_B \kappa(t, A)\, \P_W(dt)$, so this is [[#disintegration]] for the given $A$. For the converse, see the proof of [[#rcd-standard-borel]].
:::

Thus [[#conditional-law]] is [[#rcd]] with $\cH = \sigma(W)$, transported from $\Omega$ to the range of $W$, and [[#disintegration]] is partial averaging written on the range. The two forms serve different purposes. The $\sigma$-algebra form applies to arbitrary $\sigma$-algebra $\cH$ (such as a filtration, or information not generated by a single variable). The random-variable form is the one in which an observed value $t$ is substituted, and is the form most commonly used in statistics (e.g. Bayes' theorem).

Three remarks on [[#disintegration]].

*It is the multiplication rule.* In the discrete case, conditioning is governed by $\P(X \in A, W = t) = \P(X \in A \mid W = t)\,\P(W = t)$. Summing over $t \in B$ gives [[#disintegration]] with a sum in place of the integral. Disintegration and composition are inverse operations, the general forms of $p(x \mid t) = p(t,x)/p(t)$ and $p(t,x) = p(t)\,p(x \mid t)$. When densities exist, [[#disintegration]] is $f(t,x) = f_W(t)\, f_{X \mid W}(x \mid t)$ integrated over $B \times A$, with $\kappa(t, A) = \int_A f_{X \mid W}(x \mid t) \dd x$.

*It is the meaning of conditioning on a null event.* "The conditional law of $X$ given $W = t$" is defined for all $t$ at once, as a measurable rule, by the requirement that mixing the rule against the law of $W$ reproduces the joint law. No single event $\{W = t\}$ is ever conditioned on. This is the same replacement that the section on conditional expectation made for expectations: we condition on $\sigma(W)$, which has meaning, rather than on $\{W = t\}$, which does not.

*Its solution is unique a.e.* If $\kappa, \kappa'$ both satisfy [[#disintegration]] and $\cS$ is countably generated, then for each $A$ in a countable generating algebra the functions $\kappa(\cdot, A), \kappa'(\cdot, A)$ have equal $\P_W$-integrals over every $B$, hence agree $\P_W$-a.e. by [[#uniqueness-lemma]], and the countably many null sets combine. In elementary terms, $f_{X \mid W}(\cdot \mid t)$ may be changed on a $\P_W$-null set of $t$ without effect, which is the usual convention that $f(t,x)/f_W(t)$ is arbitrary where $f_W(t) = 0$. The function $t \mapsto \kappa(t, \cdot)$ is determined up to $\P_W$-null sets; an individual value $\kappa(t, \cdot)$ is not.

### Existence

:::theorem{#rcd-existence title="Existence of the RCD for Real Random Variables"}
If $X : \Omega \to \R$ is a random variable and $\cH \subseteq \cF$ is any sub-$\sigma$-algebra, an RCD of $X$ given $\cH$ exists.
:::

:::proof
The plan: define a conditional distribution function at rational points from conditional expectations, repair its defects on one null set, extend to a measure for each $\omega$, and verify the required properties.

*Step 1.* For each $q \in \Q$ fix a version $F_q$ of $\P(X \le q \mid \cH)$ with values in $[0,1]$ (possible by monotonicity applied to $0 \le \ind{\{X \le q\}} \le 1$).

*Step 2.* By monotonicity and conditional dominated convergence ([[#ce-properties]](b),(h)) the following hold a.s.: (i) $F_q \le F_r$ for rationals $q \le r$; (ii) $F_q \to 1$ as $q \to +\infty$ and $F_q \to 0$ as $q \to -\infty$ along rationals; (iii) $\inf_{r \in \Q,\, r > q} F_r = F_q$ for each $q \in \Q$. These are countably many a.s. statements; let $N \in \cH$ be the union of their exceptional sets, so $\P(N) = 0$. For $\omega \notin N$ define

$$
F(\omega, x) = \inf_{q \in \Q,\, q > x} F_q(\omega), \qquad x \in \R ,
$$

and for $\omega \in N$ let $F(\omega, \cdot)$ be the distribution function of $\delta_0$. For $\omega \notin N$, $F(\omega, \cdot)$ is nondecreasing by (i), right-continuous because it is an infimum over $q > x$, and has limits $0$ and $1$ at $\mp\infty$ by (ii). So $F(\omega, \cdot)$ is a distribution function for every $\omega$.

*Step 3.* For each $\omega$ let $\kappa(\omega, \cdot)$ be the unique Borel probability measure with distribution function $F(\omega, \cdot)$ (Carathéodory). This is (K1).

*Step 4: (K2).* Let $\cC$ be the class of Borel $A$ for which $\omega \mapsto \kappa(\omega, A)$ is $\cH$-measurable. Half-lines $(-\infty, x]$ belong to $\cC$, since $\kappa(\cdot, (-\infty, x]) = F(\cdot, x)$ is a countable infimum of $\cH$-measurable functions modified on $N \in \cH$. Half-lines form a $\pi$-system generating $\cB(\R)$, and $\cC$ is a $\lambda$-system (closed under complements and increasing unions because each $\kappa(\omega, \cdot)$ is a probability measure and limits of measurable functions are measurable). So $\cC = \cB(\R)$.

*Step 5: the defining identity.* Let $\cD$ be the class of Borel $A$ with $\kappa(\cdot, A) = \P(X \in A \mid \cH)$ a.s. For $A = (-\infty, q]$ with $q \in \Q$ this holds by (iii) and the definition of $F$; for real $x$ take rationals $q \downarrow x$ and use conditional dominated convergence on the right and right-continuity on the left. $\cD$ is a $\lambda$-system: for complements use that both sides are probabilities; for $A_n \uparrow A$ with $A_n \in \cD$ the left side converges pointwise and the right side a.s. by conditional monotone convergence. So $\cD = \cB(\R)$.
:::

:::theorem{#rcd-standard-borel title="Existence on Standard Borel Spaces"}
Let $(S, \cS)$ be a **standard Borel space**: a measurable space isomorphic to a Borel subset of a Polish space with its Borel $\sigma$-algebra. (Examples: $\R^n$, any Polish space, $C[0,1]$; by the Borel isomorphism theorem every uncountable standard Borel space is isomorphic to $\R$.) Then for any measurable $X : \Omega \to S$ and any $\cH$ an RCD of $X$ given $\cH$ exists; and for any measurable $W : \Omega \to T$ a conditional law of $X$ given $W = t$ exists and is $\P_W$-a.e. unique.
:::

:::proof{title="Proof sketch"}
Let $\varphi : S \to S' \subseteq \R$ be a Borel isomorphism onto a Borel set. Apply [[#rcd-existence]] to $\varphi(X)$ to obtain $\tilde\kappa$; since $\tilde\kappa(\omega, S') = \P(\varphi(X) \in S' \mid \cH) = 1$ a.s., modify $\tilde\kappa$ on an $\cH$-null set to have $\tilde\kappa(\omega, S') = 1$ everywhere, and set $\kappa(\omega, A) = \tilde\kappa(\omega, \varphi(A))$. Properties transport along $\varphi$.

For the conditional law given $W$, take an RCD $\kappa_0$ of $X$ given $\sigma(W)$ and a countable generating algebra $\cA_0$ of $\cS$. For $A \in \cA_0$, Doob–Dynkin gives $\kappa_0(\cdot, A) = g_A(W)$ with $g_A : T \to [0,1]$ measurable. By countably many applications of [[#uniqueness-lemma]] there is a $\P_W$-null set off which $A \mapsto g_A(t)$ is finitely additive, monotone and normalized on $\cA_0$; there it extends to a probability measure $\kappa(t, \cdot)$ on $\cS$ (Carathéodory, using the regularity of measures on standard Borel spaces), and elsewhere set $\kappa(t, \cdot)$ to a fixed measure. Measurability in $t$ and [[#disintegration]] hold on $\cA_0$ by construction and extend to $\cS$ by $\pi$–$\lambda$. Uniqueness was shown after [[#conditional-law]].
:::

Some hypothesis on $S$ is necessary: there are probability spaces and sub-$\sigma$-algebras for which no RCD exists. Standard Borel spaces include all the spaces that arise in practice. The contrast with conditional expectation should be noted: a single conditional expectation exists with no hypothesis on the target space, whereas a conditional distribution, which requires uncountably many conditional probabilities to be chosen consistently, does not.

### Integration against the conditional law (Law of the Unconscious Statistician)

The preceding subsections built a distribution out of the conditional probabilities. This subsection shows that every conditional expectation of a function of $X$ is an integral against that distribution.

:::theorem{#LOTUS title="Law of the Unconscious Statistician"}
Let $\kappa$ be an RCD of $X$ given $\cH$ and let $g : S \to \R$ be measurable with $g(X) \in L^1$. Then

$$
\E[g(X) \mid \cH](\omega) = \int_S g(s)\, \kappa(\omega, ds)
\qquad \text{for a.e. } \omega .
$$

If instead $\kappa$ is a conditional law of $X$ given $W = t$ ([[#conditional-law]]), then $\E[g(X) \mid W = t] = \int_S g \dd\kappa(t, \cdot)$ for $\P_W$-a.e. $t$.
:::

:::proof
Standard machine in $g$. For indicators this is [[#rcd]]; extend by linearity; for $g \ge 0$ take simple $g_n \uparrow g$ and use conditional monotone convergence on the left and monotone convergence for $\kappa(\omega, \cdot)$ on the right; split $g = g^+ - g^-$.
:::

Conditional expectation given $\cH$ is thus an ordinary expectation with respect to the conditional distribution at the realized information state. The elementary order of ideas, in which the conditional expectation is the mean of the conditional distribution, is recovered as a theorem.

*The density case.* Let $(X, Y)$ have joint density $f$, and define $\kappa(x, A) = \int_A f_{Y \mid X}(y \mid x) \dd y$ for $f_X(x) > 0$, with $\kappa(x, \cdot) = \delta_0$, say, on the $\P_X$-null set $\{f_X = 0\}$. This is a kernel from $\R$ to $\R$ (K2 by Fubini), and for Borel $A, B$,

$$
\int_B \kappa(x, A)\, \P_X(dx) = \int_B \int_A \frac{f(x,y)}{f_X(x)} \dd y\; f_X(x) \dd x = \iint_{B \times A} f = \P(X \in B,\, Y \in A),
$$

which is [[#disintegration]]. So $\kappa$ is the conditional law of $Y$ given $X = x$, and the elementary conditional density is its density, as stated earlier. [[#LOTUS]] with $g(y) = y$ is [[#ce-from-density]]. The three objects are related as follows: the kernel is the conditional distribution, the conditional expectation is its mean, and the conditional density is its density when one exists.

*Conditioning with an independent variable.* If $X$ is independent of $\cH$ and $Z$ is $\cH$-measurable, then for measurable $g$ with $g(X, Z) \in L^1$,

$$
\E[g(X, Z) \mid \cH] = G(Z), \qquad G(z) = \E[g(X, z)] .
$$
{#freezing}

(Both sides are $\cH$-measurable; for $g = \ind{A \times C}$ the identity is $\P(X \in A)\ind{C}(Z)$ on both sides by independence and pull-out, and the class of $g$ for which it holds is closed under the operations of the standard machine and monotone class arguments.) In the language of this section: the conditional law of $X$ given $\cH$ is the constant kernel $\P_X$, and [[#freezing]] is [[#LOTUS]] for $g(\cdot, Z(\omega))$ with $Z$ held fixed at its realized value.

### Independence and conditional independence

Random variables $X$ and $W$ are independent iff the conditional law of $X$ given $W = t$ does not depend on $t$, i.e. $\kappa(t, \cdot) = \P_X$ for $\P_W$-a.e. $t$: this is [[#disintegration]] with right side $\P_X(A) \P_W(B)$. In terms of conditional expectations, independence of $\sigma(X)$ and $\cH$ is equivalent to $\E[g(X) \mid \cH] = \E[g(X)]$ for all bounded measurable $g$.

:::definition{#conditional-independence-def title="Conditional Independence"}
Sub-$\sigma$-algebras $\cG_1, \cG_2$ are **conditionally independent given $\cH$**, written $\cG_1 \indep \cG_2 \mid \cH$, if

$$
\P(A_1 \cap A_2 \mid \cH) = \P(A_1 \mid \cH)\,\P(A_2 \mid \cH)
\qquad \text{a.s., for all } A_1 \in \cG_1,\ A_2 \in \cG_2 .
$$

Random variables are conditionally independent given $Z$ if the $\sigma$-algebras they generate are conditionally independent given $\sigma(Z)$.
:::

This is defined in terms of conditional probabilities alone; no regular conditional distribution is needed.

:::proposition{#conditional-independence title="Characterizations of Conditional Independence"}
Let $\cG_1, \cG_2, \cH$ be sub-$\sigma$-algebras of $\cF$. The following are equivalent.

(a) $\cG_1 \indep \cG_2 \mid \cH$.

(b) $\E[g_1 g_2 \mid \cH] = \E[g_1 \mid \cH]\,\E[g_2 \mid \cH]$ for bounded $\cG_i$-measurable $g_i$.

(c) $\P(A_1 \mid \cH \vee \cG_2) = \P(A_1 \mid \cH)$ a.s. for all $A_1 \in \cG_1$.
:::

:::proof
(a)$\Leftrightarrow$(b) is the standard machine in $g_1$ and $g_2$ separately. (a)$\Rightarrow$(c): $\P(A_1 \mid \cH)$ is $\cH \vee \cG_2$-measurable, and for $H \in \cH$, $A_2 \in \cG_2$, by tower and pull-out,

$$
\E\big[\ind{A_1} \ind{H \cap A_2}\big]
= \E\big[\ind{H}\, \E[\ind{A_1}\ind{A_2} \mid \cH]\big]
= \E\big[\ind{H}\, \P(A_1 \mid \cH)\, \P(A_2 \mid \cH)\big]
= \E\big[\ind{H \cap A_2}\, \P(A_1 \mid \cH)\big] ,
$$

so $\P(A_1 \mid \cH)$ satisfies partial averaging on the $\pi$-system $\{H \cap A_2\}$, which generates $\cH \vee \cG_2$; extend by $\pi$–$\lambda$. (c)$\Rightarrow$(a): $\P(A_1 \cap A_2 \mid \cH) = \E[\ind{A_2}\,\P(A_1 \mid \cH \vee \cG_2) \mid \cH] = \E[\ind{A_2}\,\P(A_1 \mid \cH) \mid \cH] = \P(A_1 \mid \cH)\P(A_2 \mid \cH)$ by tower and pull-out.
:::

Form (c) is the operational meaning: given $\cH$, further information from $\cG_2$ does not change the conditional probabilities of $\cG_1$-events. When conditional densities exist it reads $f_{X_1 \mid Z, X_2} = f_{X_1 \mid Z}$, equivalently $f_{X_1, X_2 \mid Z} = f_{X_1 \mid Z}\, f_{X_2 \mid Z}$; in kernel language, the conditional law of $(X_1, X_2)$ given $Z = z$ is the product of the conditional laws of $X_1$ and of $X_2$ given $Z = z$. This is the notion behind Markov chains ($X_{n+1} \indep (X_0, \dots, X_{n-1}) \mid X_n$), graphical models (each variable is conditionally independent of its non-descendants given its parents), and the assumption that observations are i.i.d. given the parameter.

### Bayes' theorem

Bayes' theorem expresses the fact that composition and disintegration are inverse operations: a joint law is constructed by composition along the parameter and then disintegrated along the data.

A parameter $\Theta$ takes values in a standard Borel space $(T, \cT)$ with **prior** law $\pi$. Given $\Theta = \theta$, the data $X$ in a standard Borel space $(S, \cS)$ are drawn from a **likelihood** kernel $K(\theta, \cdot)$ from $T$ to $S$. The model is the joint law of $(\Theta, X)$, built by composition:

$$
\P(\Theta \in B,\, X \in A) = (\pi \otimes K)(B \times A) = \int_B K(\theta, A)\; \pi(d\theta) .
$$

This is [[#disintegration]] with $W = \Theta$: the likelihood kernel is, by construction, the conditional law of $X$ given $\Theta = \theta$. The **marginal** law of the data is the mixture $m = \pi K$, $m(A) = \int_T K(\theta, A)\, \pi(d\theta)$. Bayes' theorem disintegrates the same joint law along $X$ instead of along $\Theta$.

:::theorem{#bayes title="Bayes' Theorem"}
Let $\Theta$ take values in a standard Borel space $(T, \cT)$ with prior law $\pi$; let $K$ be a likelihood kernel from $T$ to a standard Borel space $(S, \cS)$, so that $(\Theta, X)$ has joint law $J = \pi \otimes K$; and let $m = \pi K$ be the marginal law of the data. Then:

(a) There is a kernel $\, \Pi$ from $S$ to $T$, the **posterior**, unique $m$-a.e., with

$$
\P(\Theta \in B,\, X \in A) = \int_A \Pi(x, B)\; m(dx)
\qquad \text{for all } A \in \cS,\ B \in \cT ;
$$

that is, $\Pi(x, \cdot)$ is the conditional law of $\Theta$ given $X = x$, and $\Pi(X, B) = \P(\Theta \in B \mid X)$ a.s. for every $B$.

(b) Suppose the likelihoods are dominated: there are a $\sigma$-finite measure $\nu$ on $S$ and a jointly measurable $p : T \times S \to [0, \infty)$ with $K(\theta, A) = \int_A p(\theta, x)\, \nu(dx)$ for all $\theta$. Then $m$ has density $m(x) = \int_T p(\theta, x)\, \pi(d\theta)$ with respect to $\nu$, and for $m$-a.e. $x$,

$$
\Pi(x, B) = \frac{\int_B p(\theta, x)\; \pi(d\theta)}{m(x)},
\qquad \text{i.e.}\qquad
\frac{d\,\Pi(x, \cdot)}{d\pi}(\theta) = \frac{p(\theta, x)}{m(x)} .
$$

(c) If moreover $\pi$ has density $\pi(\theta)$ with respect to a $\sigma$-finite $\lambda$ on $T$, the posterior has density

$$
\pi(\theta \mid x) = \frac{p(\theta, x)\, \pi(\theta)}{\int_T p(\theta', x)\, \pi(\theta')\, \lambda(d\theta')}
$$

with respect to $\lambda$.
:::

:::proof
(a) is [[#rcd-standard-borel]] applied to $\Theta$ conditioned on $X$, and [[#two-definitions]] for the last identity.

(b) By Tonelli, $m(A) = \int_T \int_A p(\theta, x)\, \nu(dx)\, \pi(d\theta) = \int_A m(x)\, \nu(dx)$, so $m$ has the stated density; since $\int m \dd\nu = 1$, $m(x) < \infty$ for $\nu$-a.e. $x$, and $\{m = 0\}$ is $m$-null. Define $\Pi(x, B)$ by the displayed formula where $0 < m(x) < \infty$ and let $\Pi(x, \cdot) = \pi$ elsewhere (an $m$-null set). Then $\Pi(x, \cdot)$ is a probability measure for each $x$, and $x \mapsto \Pi(x, B)$ is measurable by Tonelli. For the disintegration identity, Tonelli again gives

$$
\begin{aligned}
\int_A \Pi(x, B)\, m(dx)
&= \int_A \frac{\int_B p(\theta, x)\, \pi(d\theta)}{m(x)}\, m(x)\, \nu(dx) \\
&= \int_B \int_A p(\theta, x)\, \nu(dx)\, \pi(d\theta)
= \int_B K(\theta, A)\, \pi(d\theta) ,
\end{aligned}
$$

which is $\P(\Theta \in B, X \in A)$. By uniqueness this $\Pi$ is the posterior.

(c) Substitute $\pi(d\theta) = \pi(\theta)\lambda(d\theta)$ in (b).
:::

Part (b) is the precise form of "posterior $\propto$ likelihood $\times$ prior": the posterior is the prior reweighted by the density $\theta \mapsto p(\theta, x)/m(x)$, a Radon–Nikodym derivative with respect to the prior. This is the mechanism of [[#elementary-conditioning]] and [[#bayes-elementary-formula]], with the conditioning event $\{X = x\}$ allowed to be null and the ratio $p(\theta, x)/m(x)$ a ratio of densities rather than of probabilities. Part (a) shows the posterior exists as a kernel even when there is no dominating measure and hence no formula. Part (b) is the case that admits computation, such as in Bayesian statistics.

It is useful to know that if the data are $x = (x_1, \dots, x_n)$ with components conditionally i.i.d. given $\Theta$, so that $p(\theta, x) = \prod_i p_1(\theta, x_i)$, then the posterior can be computed sequentially, each posterior serving as the prior for the next observation; this is the chain rule for densities together with the tower property.

**Interpretation.** By part (a), $\Pi(X, B) = \P(\Theta \in B \mid X)$: the posterior is the conditional law of $\Theta$ given $\sigma(X)$, determined by the model $J = \pi \otimes K$ alone up to a null set of data values, and $x \mapsto \Pi(x, \cdot)$ is its representative on the range of $X$. Rearranged for a data event $A$ with $m(A) > 0$, the disintegration identity reads

$$
\P(\Theta \in B \mid X \in A) = \frac{1}{m(A)} \int_A \Pi(x, B)\, m(dx) :
$$

the elementary posterior given any data event of positive probability is the average of the pointwise posterior over that event. By [[#uniqueness-lemma]] this determines $\Pi$ $m$-a.e.; the posterior is the unique updating rule that agrees with elementary conditioning on every event of positive probability.

### Bayesian decision theory

Bayesian inference is used to make decisions: to estimate $\Theta$, to predict a future observation, to choose an action whose consequences depend on $\Theta$. This subsection sets out the decision-theoretic framework and proves the result that governs all such uses: the optimal decision rule is obtained by minimizing posterior expected loss. It is helpful to go through the proof, because it clarifies common misconceptions about the Bayesian framework and its guarantees.

**The commitment.** Let $(\mathcal A, \Sigma)$ be a measurable space of **actions**, and let $L : T \times \mathcal A \to [0, \infty)$ be a measurable **loss function**: $L(\theta, a)$ is the loss incurred by taking action $a$ when the parameter is $\theta$. A **decision rule** is a measurable map $\delta : S \to \mathcal A$, a prescription of an action for every possible value of the data. The **Bayes risk** of a decision rule $\delta$ is its expected loss under the model:

$$
r(\delta) = \E\big[L(\Theta, \delta(X))\big]
= \int_{T \times S} L(\theta, \delta(x))\; J(d\theta, dx),
\qquad J = \pi \otimes K .
$$
{#bayes-risk}

A **Bayes rule** is a decision rule that minimizes $r$.

We make two observations about [[#bayes-risk]]. First, it is an unconditional expectation of a well-defined random variable, $L(\Theta, \delta(X))$. No conditioning occurs in it, no null events appear, and no posterior has been mentioned. Second, it is a functional of the *rule $\delta$ as a whole, not of its value at any one data point*. These two facts are the whole of what a Bayesian analysis commits one to: a joint law for the parameter and data, and the criterion of minimal expected loss under that law. Everything else is a consequence.

**The theorem.** For a version $\Pi$ of the posterior kernel and $a \in \mathcal A$, define the **posterior expected loss**

$$
\rho(x, a) = \int_T L(\theta, a)\; \Pi(x, d\theta), \qquad x \in S .
$$

:::theorem{#bayes-rules title="Bayes Rules"}
In the setting of [[#bayes]], let $L : T \times \mathcal A \to [0, \infty)$ be a measurable loss function on a measurable space of actions $(\mathcal A, \Sigma)$, and let $r(\delta) = \E\big[L(\Theta, \delta(X))\big]$ be the Bayes risk of a decision rule $\delta : S \to \mathcal A$. Let $\Pi$ be any version of the posterior kernel, with posterior expected loss $\rho(x, a) = \int_T L(\theta, a)\; \Pi(x, d\theta)$.

(a) For every decision rule $\delta$,

$$
r(\delta) = \int_S \rho\big(x, \delta(x)\big)\; m(dx) .
$$

(b) If $\delta^*$ is a decision rule with $\rho(x, \delta^*(x)) = \inf_{a \in \mathcal A} \rho(x, a)$ for $m$-a.e. $x$, then $r(\delta^*) \le r(\delta)$ for every decision rule $\delta$; that is, $\delta^*$ is a Bayes rule.

(c) The Bayes risk $r(\delta)$ of every rule, and hence the set of Bayes rules, does not depend on the version of $\Pi$ used to define $\rho$. Two Bayes rules obtained from different versions agree for $m$-a.e. $x$ whenever the minimizer of $\rho(x, \cdot)$ is unique.
:::

:::proof
(a) [[#bayes]](a) says that the law of the pair $(X, \Theta)$ on $S \times T$ is the composition $m \otimes \Pi$ of the marginal law of the data $m$ with the posterior kernel $\Pi$. The function $g(x, \theta) = L(\theta, \delta(x))$ on $S \times T$ is jointly measurable, so by the definition of the law of $(X, \Theta)$ and the integral formula of [[#composition]],

$$
\begin{aligned}
r(\delta) = \E\big[g(X, \Theta)\big]
&= \int_{S \times T} g \dd(m \otimes \Pi) \\
&= \int_S \Big( \int_T L(\theta, \delta(x))\; \Pi(x, d\theta) \Big) m(dx)
= \int_S \rho(x, \delta(x))\; m(dx) .
\end{aligned}
$$

(b) For every $\delta$ and $m$-a.e. $x$, $\rho(x, \delta^*(x)) \le \rho(x, \delta(x))$ by the choice of $\delta^*$; integrate against $m$ and apply (a).

(c) Two versions of $\Pi$ agree for $m$-a.e. $x$, so the corresponding functions $\rho$ agree for $m$-a.e. $x$ and every $a$, and the integrals in (a) coincide. If $\rho(x, \cdot)$ has a unique minimizer for $m$-a.e. $x$, the pointwise minimizers from two versions agree wherever the versions do.
:::

In the discrete case the theorem is the observation that

$$
\E\big[L(\Theta, \delta(X))\big]
= \sum_x \Big[ \sum_\theta L(\theta, \delta(x))\, \P(\Theta = \theta \mid X = x) \Big] \P(X = x)
$$

by the multiplication rule, and that minimizing the bracket for each $x$ minimizes the sum. The general theorem is the same statement with disintegration in place of the multiplication rule and an integral in place of the sum.

Part (b) presupposes that a *measurable* pointwise minimizer $\delta^*$ exists. This is a technical condition, not a conceptual one, and it holds in the cases of interest: when $\mathcal A$ is finite or countable, a measurable minimizer can be selected by taking the smallest index achieving the minimum; under squared loss the minimizer is the posterior mean, which is measurable in $x$ by [[#LOTUS]]; and measurable selection theorems cover the general case under mild conditions on $\mathcal A$ and $L$.

**What the theorem says about the posterior.** The rule "act so as to minimize posterior expected loss" is the content of the theorem. When the one quantity the Bayesian has committed to minimizing, the expected loss [[#bayes-risk]], is written as an iterated integral by disintegrating $J$ along the data, the inner integral is the posterior expected loss, and minimizing an integrand pointwise minimizes the integral.

This is the sense in which the posterior is the object of interest in Bayesian inference. Every standard inferential quantity is an instance of [[#bayes-rules]](b) for a particular loss:

- With $\mathcal A = \R$ and $L(\theta, a) = (h(\theta) - a)^2$, the Bayes rule is the posterior mean $\delta^*(x) = \int h \dd\Pi(x, \cdot) = \E[h(\Theta) \mid X = x]$. This is [[#l2-projection]]: the conditional expectation is the best mean-square predictor.
- With $h = \ind{B}$ in the previous item, the Bayes rule is the posterior probability $\Pi(x, B) = \P(\Theta \in B \mid X = x)$, the best mean-square forecast of whether the hypothesis $B$ is true; and by the testing characterization it is also the unique data-based forecast that no data-based test can distinguish from $\ind{\{\Theta \in B\}}$.
- With $L(\theta, a) = \abs{h(\theta) - a}$ the Bayes rule is a posterior median; with $L(\theta, a) = \ind{\{\theta \notin a\}} + c\,\lambda(a)$ over sets $a$, the Bayes rules are credible sets of highest posterior density; with actions being distributions for a future observation $X'$ and a proper scoring rule as loss, the Bayes rule is the posterior predictive law $\int K(\theta, \cdot)\, \Pi(x, d\theta)$.

In each case the posterior is used because integrating a loss against it and minimizing is, by the theorem, the same as minimizing expected loss under the model.

**What about the realized data?** Two versions of the posterior differ on an $m$-null set of data values, and the observed data $x_0$ is a single point, so for any $x_0$ there is a version that has been modified there. The framework therefore assigns no meaning to $\Pi(x_0, \cdot)$ in isolation.

[[#bayes-rules]] makes this harmless without appeal to any property of the point $x_0$. The action taken at $x_0$ is justified not by a belief about the posterior at $x_0$ but as the output, at the observed data, of a rule $\delta^*$ with minimal expected loss under the model. Two Bayes rules may prescribe different actions at $x_0$, but only if $x_0$ lies in an $m$-null set on which they differ (much like how the conditional expectation from [[#conditional-expectation]] exists only as an a.s. class). This does not change the overall Bayes' risk, as an $m$-null set has no impact on it.

The same considerations apply, without change, to the likelihood function $\theta \mapsto p(\theta, x_0)$ of any statistical analysis, Bayesian or not: it is a density evaluated at a point and is determined only for $\nu$-a.e. $x_0$. Every method that uses a likelihood function is in the same position as the Bayesian, and is justified in the same way, by the properties of the procedure as a function of the data.

Three facts about the conditional distribution have now been established. The conditional distribution is determined by the model and the information ([[#rcd-uniqueness]]), it determines every conditional expectation ([[#LOTUS]]), and expected loss under the model is minimized by minimizing against it ([[#bayes-rules]]).

:::remark{#canonical-version title="Selecting a Canonical Version"}
If one wants a distinguished version of the posterior — a way of resolving the indifference on null sets — one must add a principle outside expected loss. The usual one is regularity of the model in the data: if $\nu$ is Lebesgue measure and $x \mapsto p(\theta, x)$ is continuous with suitable domination, then the Bayes formula defines a version continuous in $x$, any two continuous versions agree at every $x$ in the support of $m$, and at every such $x$ the value is the limit of the elementary posteriors $\P(\Theta \in \cdot \mid X \in B_\eps(x))$ as $\eps \downarrow 0$. This selects a canonical version and gives its point values an interpretation, but it is a convention added to the theory.
:::

### The Borel–Kolmogorov paradox

The a.e.-uniqueness of conditional distributions has a consequence that is easy to get wrong: a null event does not have a conditional distribution. Only a random variable does, and two random variables that share a null fiber can assign different conditional distributions to it. The following paradox is a classic that illustrates this idea using the example of a point chosen uniformly on the surface of a sphere.

**Coordinates on the sphere.** The figure below shows the sphere with the two coordinates used to describe a point on it. The **latitude** $\Phi$ of a point measures how far north or south it lies: $\Phi = 0$ on the **equator**, the great circle midway between the poles; $\Phi$ increases to $\pi/2$ at the north pole and decreases to $-\pi/2$ at the south pole. The set of points at a fixed latitude is a **circle of latitude**, a horizontal circle; these circles are large near the equator and shrink to a point at each pole. The **longitude** $\Lambda$ of a point measures how far east or west it lies around the axis, $\Lambda \in (-\pi, \pi]$. The set of points at a fixed longitude is a **meridian**, a half-circle running from the north pole to the south pole; all meridians meet at the poles. A meridian together with the meridian on the opposite side of the sphere forms a great circle through both poles, and every great circle through the poles arises this way.

<figure class="fig">
  <img src="/figures/measure-theoretic-probability/sphere-coordinates.svg" alt="A sphere with the equator, a highlighted circle of latitude, and a highlighted meridian, with poles labelled">
</figure>

*Latitude $\Phi$ and longitude $\Lambda$ on the sphere. The set of points with a fixed latitude $\Phi = \phi_0$ is a circle of latitude (red), horizontal, shrinking toward the poles; the equator (blue) is the circle of latitude $\Phi = 0$. The set of points with a fixed longitude $\Lambda = \lambda_0$ is a meridian (green), a half-circle from pole to pole. Gray curves are other circles of latitude and other meridians.*

**The example.** Let $P$ be a point chosen uniformly on the unit sphere: $\P(P \in R) = \operatorname{area}(R)/4\pi$ for Borel $R \subseteq S^2$, where $\operatorname{area}$ is surface area. This law is invariant under rotations. In the coordinates of the figure, surface area is $\operatorname{area}(dA) = \cos\phi\, d\phi\, d\lambda$, so the latitude and longitude $(\Phi, \Lambda)$ of $P$ have joint density

$$
f(\phi, \lambda) = \tfrac{1}{4\pi} \cos\phi, \qquad
f_\Phi(\phi) = \tfrac12 \cos\phi, \qquad
f_\Lambda(\lambda) = \tfrac{1}{2\pi} .
$$

By the elementary conditional density formula, the conditional densities are

$$
f_{\Lambda \mid \Phi}(\lambda \mid \phi) = \frac{f(\phi,\lambda)}{f_\Phi(\phi)}
= \frac{1}{2\pi},
\qquad
f_{\Phi \mid \Lambda}(\phi \mid \lambda) = \frac{f(\phi,\lambda)}{f_\Lambda(\lambda)}
= \tfrac12 \cos\phi .
$$

Given $\Phi = 0$, the point is uniformly distributed along the equator. Given $\Lambda = \lambda_0$, the point is distributed along the meridian with density $\tfrac12 \cos\phi$: most likely near the equator, least likely near the poles, not uniform.

The equator $E = \{\Phi = 0\}$ is a great circle. But so is the meridian at $\lambda_0$ together with the meridian opposite it, the set $M = \{\Lambda \in \{\lambda_0, \lambda_0 + \pi\}\}$, which is a fiber of the random variable $\Lambda \bmod \pi$. A rotation $\rho$ carries $M$ onto $E$ and preserves the law of $P$, so it seems that "the conditional distribution of $P$ given that $P$ lies on a great circle" should be the same for both, up to rotation. Yet it is not: the conditional distribution is uniform on $E$, and $\cos\phi$-weighted on $M$. That is the paradox.

To state the conflict on a single circle, write $\Lambda' = (\Lambda \bmod \pi) \circ \rho^{-1}$ for longitude measured with respect to the rotated axis, so that the equator $E$ is a fiber of $\Lambda'$ as well as of $\Phi$.

The resolution is that nothing requires them to agree. Both are $\P_P$-null, and, as we now know, a conditional law is assigned not to a null set but to a random variable. $\P(P \in \cdot \mid \sigma(\Phi))$ and $\P(P \in \cdot \mid \sigma(\Lambda'))$ are the conditional laws given two different $\sigma$-algebras, each determined only for a.e. value of its variable, and $E$ is a null fiber of each. Nothing in the definitions relates the two kernels on a set that both happen to contain as a fiber. The symmetry argument conditioned on the set $E$, which is not information.

> The concept of a conditional probability with regard to an isolated hypothesis whose probability equals 0 is inadmissible. For we can obtain a probability distribution for [the latitude] on the meridian circle only if we regard this circle as an element of the decomposition of the entire spherical surface onto meridian circles with the given poles.
>
> — Andrey Kolmogorov

<figure class="fig">
  <img src="/figures/measure-theoretic-probability/band-wedge.svg" alt="Two spheres: a thin band around the equator of constant width, and a thin wedge between two meridians pinching at the poles">
</figure>

*The events of positive probability that shrink to a great circle under the two conditionings. The band contains equal area over every stretch of the equator. The wedge contains much more area near the equator than near the poles.*

**Why the two answers differ.** Each conditional law is what elementary conditioning on a positive probability event becomes as the event shrinks to the circle, and the two events are the band and the wedge of the figure above. For an interval $I$ of longitudes,

$$
\P\big(\Lambda \in I \;\big|\; \abs{\Phi} < \eps\big)
= \frac{\int_I \int_{-\eps}^{\eps} \cos\phi \dd\phi \dd\lambda}
       {\int_{-\pi}^{\pi} \int_{-\eps}^{\eps} \cos\phi \dd\phi \dd\lambda}
= \frac{\abs{I}}{2\pi} ,
$$

because the band has the same width $2\sin\eps$ over every stretch of the equator and the width cancels. For an interval $J$ of latitudes,

$$
\P\big(\Phi \in J \;\big|\; \abs{\Lambda - \lambda_0} < \eps\big)
= \frac{\int_{\lambda_0-\eps}^{\lambda_0+\eps} \int_J \cos\phi \dd\phi \dd\lambda}
       {\int_{\lambda_0-\eps}^{\lambda_0+\eps} \int_{-\pi/2}^{\pi/2} \cos\phi \dd\phi \dd\lambda}
= \tfrac12 \int_J \cos\phi \dd\phi ,
$$

because the wedge has width $2\eps\cos\phi$ at latitude $\phi$ and the $\cos\phi$ does not cancel: the wedge holds area in proportion to $\cos\phi$. Both events shrink to a great circle, but they distribute area along it differently, and the conditional distribution on the circle is the limit of one family of events or the other, never of the circle alone.

> … the term 'great circle' is ambiguous until we specify what limiting operation is to produce it. The intuitive symmetry argument presupposes the equatorial limit; yet one eating slices of an orange might presuppose the other.
>
> — E. T. Jaynes

**Takeaways.** The example teaches three things, which apply much more generally.

*There is no such thing as conditioning on a null event.* There is only conditioning on a $\sigma$-algebra, and a null event $E$ may be a fiber of a random variable generating that $\sigma$-algebra. The conditional law is a property of the $\sigma$-algebra — of the whole family of fibers — and its value at the fiber $E$ is inherited from that family. If one conditions on a different $\sigma$-algebra that also has $E$ as a fiber, the two values at $E$ need not agree, and in general they do not. (Conditioning on the $\sigma$-algebra $\{\emptyset, E, E^c, \Omega\}$ generated by $E$ itself is well-defined but empty: it gives $\P(\cdot)$ off $E$ and nothing on $E$.) Latitude $\Phi$ and the rotated longitude $\Lambda'$ generate two $\sigma$-algebras with the equator as a common fiber, and their conditional laws there differ.

*"The distribution given that $P$ lies on the equator" is not a well-defined statement, for two separate reasons.* First, it does not say which random variable placed $P$ there: $\Phi$ and $\Lambda'$ give different laws on the same circle, and no convention removes this. Second, even once $\Phi$ is fixed, the conditional law $\kappa_\Phi(\phi, \cdot)$ is determined only for $\P_\Phi$-a.e. $\phi$, and $\{0\}$ is a $\P_\Phi$-null set of values; so "given $\Phi = 0$" is the value of an a.e.-defined rule at a single point, which a different version may alter. This is the same situation as the posterior at the observed data. What is well-defined is the rule $\phi \mapsto \kappa_\Phi(\phi, \cdot)$; the statement "uniform on the equator" is that rule evaluated at $0$ for the version given by the density formula, with both the random variable and the version understood.

*This does not make conditional distributions arbitrary.* Given the $\sigma$-algebra, the conditional law is determined ([[#rcd-uniqueness]]), and every quantity computed or decided with it is invariant under versions ([[#bayes-rules]]). The indeterminacy is confined to two places: the specification of what one conditions on, which is a modelling input that the user must supply, and null sets of values, which no criterion in the framework can distinguish.