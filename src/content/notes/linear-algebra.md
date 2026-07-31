---
title: "Notes on Linear Algebra"
code: LinAlg
description: "Inner product spaces, the fundamental dimension theorems, and the spectral theorem for symmetric matrices."
date: 2026-07-29
---

These notes collect the parts of linear algebra I find myself reusing most
often: the geometry of inner product spaces, the rank–nullity theorem, and
spectral theory for real symmetric matrices.

## Inner product spaces

Throughout, $V$ denotes a vector space over $\R$.

:::definition{#inner-product}
An **inner product** on $V$ is a map $\inner{\cdot}{\cdot} : V \times V \to \R$
satisfying, for all $x, y, z \in V$ and $\alpha \in \R$:

1. *Symmetry:* $\inner{x}{y} = \inner{y}{x}$;
2. *Linearity:* $\inner{\alpha x + z}{y} = \alpha \inner{x}{y} + \inner{z}{y}$;
3. *Positive-definiteness:* $\inner{x}{x} \ge 0$, with equality iff $x = 0$.

The pair $(V, \inner{\cdot}{\cdot})$ is called an **inner product space**, and
the **induced norm** is $\norm{x} = \sqrt{\inner{x}{x}}$.
:::

The single most useful fact about inner products is the following.

:::theorem{#cauchy-schwarz title="Cauchy–Schwarz inequality"}
Let $(V, \inner{\cdot}{\cdot})$ be an inner product space. Then for all
$x, y \in V$,

$$
\abs{\inner{x}{y}} \le \norm{x} \, \norm{y},
$$
{#cs-inequality}

with equality iff $x$ and $y$ are linearly dependent.
:::

:::proof
If $y = 0$ both sides vanish, so assume $y \neq 0$. For $t \in \R$ define

$$
p(t) = \norm{x + t y}^2 = \norm{x}^2 + 2t \inner{x}{y} + t^2 \norm{y}^2 .
$$

Since $p(t) \ge 0$ for all $t$, this quadratic in $t$ has at most one real
root, so its discriminant is non-positive:

$$
4 \inner{x}{y}^2 - 4 \norm{x}^2 \norm{y}^2 \le 0,
$$

which rearranges to [[#cs-inequality]]. Equality holds iff $p$ has a real
root $t^*$, i.e. iff $x = -t^* y$.
:::

:::corollary{#triangle title="Triangle inequality"}
For all $x, y \in V$,

$$
\norm{x + y} \le \norm{x} + \norm{y}.
$$
{#triangle-inequality}
:::

:::proof
Expanding and applying [[#cauchy-schwarz]],

$$
\norm{x+y}^2 = \norm{x}^2 + 2\inner{x}{y} + \norm{y}^2
\le \norm{x}^2 + 2\norm{x}\norm{y} + \norm{y}^2
= \left( \norm{x} + \norm{y} \right)^2 .
$$
:::

:::remark{#probabilistic-cs}
On the space of square-integrable random variables,
$\inner{X}{Y} = \E[XY]$ defines an inner product (identifying variables that
agree almost surely), and [[#cs-inequality]] becomes
$\abs{\E[XY]} \le \sqrt{\E[X^2]}\sqrt{\E[Y^2]}$. Applied to centered
variables this bounds the covariance and shows the correlation coefficient
lies in $[-1, 1]$. A different convexity argument in the same spirit gives
the non-negativity of relative entropy; see [[InfoTheory:kl-nonneg]].
:::

## Linear maps and dimension

:::definition{#rank-def}
Let $T : V \to W$ be linear, with $V$ finite-dimensional. The **rank** of $T$
is $\rank T = \dim \operatorname{im} T$, and the **nullity** of $T$ is
$\dim \ker T$.
:::

:::theorem{#rank-nullity title="Rank–nullity theorem"}
Let $T : V \to W$ be linear with $\dim V = n < \infty$. Then

$$
\rank T + \dim \ker T = n.
$$
{#rank-nullity-eq}
:::

:::proof
Let $\{u_1, \dots, u_k\}$ be a basis of $\ker T$ and extend it to a basis
$\{u_1, \dots, u_k, v_1, \dots, v_{n-k}\}$ of $V$. It suffices to show that
$\{T v_1, \dots, T v_{n-k}\}$ is a basis of $\operatorname{im} T$. Spanning is
immediate since $T u_i = 0$. For independence, suppose
$\sum_i c_i T v_i = 0$; then $\sum_i c_i v_i \in \ker T$, so it is a linear
combination of the $u_j$, which by independence of the full basis forces all
$c_i = 0$.
:::

## Spectral theory

:::definition{#eigenvalue-def}
Let $A \in \R^{n \times n}$. A scalar $\lambda \in \C$ is an **eigenvalue** of
$A$ if $A v = \lambda v$ for some nonzero $v$, called an **eigenvector** for
$\lambda$.
:::

:::theorem{#spectral title="Spectral theorem"}
Let $A \in \R^{n \times n}$ be symmetric. Then all eigenvalues of $A$ are
real, and there exists an orthogonal matrix $Q$ (whose columns are
eigenvectors of $A$) and a diagonal matrix
$\Lambda = \operatorname{diag}(\lambda_1, \dots, \lambda_n)$ such that

$$
A = Q \Lambda Q^{\mathsf{T}}.
$$
{#eigendecomposition}
:::

:::proposition{#rayleigh title="Rayleigh quotient"}
Let $A \in \R^{n \times n}$ be symmetric with eigenvalues
$\lambda_1 \ge \dots \ge \lambda_n$. Then

$$
\lambda_1 = \max_{x \neq 0} \frac{x^{\mathsf{T}} A x}{x^{\mathsf{T}} x},
\qquad
\lambda_n = \min_{x \neq 0} \frac{x^{\mathsf{T}} A x}{x^{\mathsf{T}} x}.
$$
:::

:::proof
Write $x = Q y$ with $Q$ as in [[#spectral]]; since $Q$ is orthogonal,
$x^{\mathsf{T}} x = y^{\mathsf{T}} y$ and
$x^{\mathsf{T}} A x = y^{\mathsf{T}} \Lambda y = \sum_i \lambda_i y_i^2$. The
quotient is thus a convex combination of the eigenvalues, maximized (resp.
minimized) by putting all weight on $\lambda_1$ (resp. $\lambda_n$).
:::

:::example{#spectral-example}
For $A = \begin{pmatrix} 2 & 1 \\ 1 & 2 \end{pmatrix}$, the characteristic
polynomial is $(2-\lambda)^2 - 1$, giving $\lambda_1 = 3$ and
$\lambda_2 = 1$ with orthogonal eigenvectors $(1, 1)^{\mathsf{T}}$ and
$(1, -1)^{\mathsf{T}}$, as guaranteed by [[#spectral]].
:::
