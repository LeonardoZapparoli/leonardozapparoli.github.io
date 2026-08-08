---
title: "Optimization"
code: Opt
description: "Constrained optimization: tangent cones, KKT, Lagrangian, and the envelope theorem."
date: 2026-08-03
---

**Reference(s):** [*Gabriele Farina's lecture notes on nonlinear optimization*](https://www.mit.edu/~gfarina/67220/).

This entry develops the basics of the theory of constrained nonlinear optimization from first principles. The Karush–Kuhn–Tucker (KKT) conditions are derived formally via the geometric route. The multiplers of the KKT conditions are given economic meaning via the envelope theorem, as shadow prices.

The theory developed here has immense applications in economics. In particular, it is the foundation to understand the way electricity prices are set, a topic we explore in [[ElecPricing]].

## Setup and the Driving Question

We consider the problem

$$
\begin{aligned}
\min_{x\in\R^n}\quad & f(x) \\
\st\quad & h_i(x)=0, && i=1,\ldots,s,\\
& g_j(x)\le 0, && j=1,\ldots,r,
\end{aligned}
$$
{#main-problem}

where $f,h_i,g_j:\R^n\to\R$ are continuously differentiable. Denote the feasible set

$$
\Omega:=\{x\in\R^n:h_i(x)=0\text{ for all }i,\ g_j(x)\le 0\text{ for all }j\}.
$$

We make no convexity assumptions on $f,g_j$, or $\Omega$ until the section on convexity. The setting is fully general.

**The question.** Given a local minimizer $x^\star\in\Omega$ of [[#main-problem]], what equation must $\nabla f(x^\star)$ satisfy?

**The answer, which we derive.** Under a mild regularity hypothesis (a "constraint qualification"), there exist numbers $\lambda_j^\star\ge 0$ and $\mu_i^\star\in\R$ such that

$$
-\nabla f(x^\star)=\sum_{i=1}^s \mu_i^\star\nabla h_i(x^\star)+\sum_{j=1}^r \lambda_j^\star\nabla g_j(x^\star),
$$
{#kkt-anticipated}

together with the complementary slackness condition $\lambda_j^\star g_j(x^\star)=0$ for every $j$. These are the KKT conditions. Our goal is to understand why this equation must hold, and what geometric object produces it.

**Steps.** The proof consists of three stages.

1. **From local minimality to a cone condition.** At a local min, $-\nabla f(x^\star)$ cannot have a positive inner product with any direction in which one can move while remaining feasible. Formalizing "direction in which one can move" gives rise to the tangent cone $T_\Omega(x^\star)$, and the condition becomes $-\nabla f(x^\star)\in T_\Omega(x^\star)^\circ$, where $\circ$ denotes the polar cone.
2. **From the tangent cone to constraint gradients.** The tangent cone is defined abstractly via convergent sequences of feasible points. To make [[#kkt-anticipated]] usable, we need to express $T_\Omega(x^\star)$ in terms of the gradients $\nabla h_i(x^\star)$ and $\nabla g_j(x^\star)$. This is where constraint qualifications enter: they are hypotheses that guarantee $T_\Omega(x^\star)$ equals the linearized feasible cone $F(x^\star)$, a polyhedral cone defined directly from the constraint gradients.
3. **From a polar-cone statement to a linear combination.** Once we know $-\nabla f(x^\star)\in F(x^\star)^\circ$ with $F(x^\star)$ polyhedral, Farkas' lemma tells us exactly what this cone looks like: it is the set of nonnegative combinations of the equality-constraint gradients (in both signs) and the active inequality-constraint gradients. Unpacking this polar cone description leads to the KKT conditions [[#kkt-anticipated]].

The Lagrangian function is introduced at the end, as a compact notation for [[#kkt-anticipated]].

## Preliminaries: Cones, Polar Cones, and Separation

We begin with minimal vocabulary from convex geometry.

### Cones and polar cones

:::definition{#cone title="Cone"}
A set $K\subseteq\R^n$ is a **cone** if $td\in K$ for every $d\in K$ and every $t\ge 0$. In particular, $0\in K$. A cone $K$ is **convex** if additionally $d_1+d_2\in K$ for every $d_1,d_2\in K$.
:::

:::definition{#conic-hull title="Conic Hull"}
Given vectors $v_1,\ldots,v_m\in\R^n$, their **conic hull** is the set of nonnegative linear combinations

$$
\cone\{v_1,\ldots,v_m\}:=\left\{\sum_{k=1}^m \alpha_k v_k:\alpha_k\ge 0\right\}.
$$

This is the smallest convex cone containing $v_1,\ldots,v_m$. A set of this form is called a **finitely generated convex cone** or a **polyhedral cone**.
:::

:::definition{#polar-cone title="Polar Cone"}
Let $K\subseteq\R^n$ be any set. Its **polar cone** is

$$
K^\circ:=\{y\in\R^n:\ip{y}{d}\le 0\text{ for all }d\in K\}.
$$
:::

The polar cone of a set $K$ is the set of all vectors that form non-acute angles with all vectors in the set $K$. It formalizes the idea of "directions that are antagonistic to $K$." Some immediate properties:

:::proposition{#polar-properties title="Properties of the Polar Cone"}
For any set $K\subseteq\R^n$:

(i) $K^\circ$ is a closed convex cone.

(ii) If $K_1\subseteq K_2$, then $K_2^\circ\subseteq K_1^\circ$.

(iii) $K^\circ=(\cone K)^\circ=(\cl\cone K)^\circ$.
:::

:::proof
For any fixed $d$, the set $\{y:\ip{y}{d}\le 0\}$ is a closed half-space. $K^\circ$ is the intersection of such half-spaces over all $d\in K$, hence closed, convex, and a cone. If $K_1\subseteq K_2$, then requiring $\ip{y}{d}\le 0$ for all $d\in K_2$ is stronger than requiring it for all $d\in K_1$, so $K_2^\circ\subseteq K_1^\circ$. Finally, if $y\in K^\circ$ and $\sum\alpha_k d_k$ is a nonnegative combination of elements of $K$, then $\ip{y}{\sum\alpha_k d_k}=\sum\alpha_k\ip{y}{d_k}\le 0$, so $y\in(\cone K)^\circ$. The reverse inclusion follows from $K\subseteq\cone K$. Closure is handled by continuity of the inner product.
:::

A key  result about polar cones, which is used repeatedly, is bipolarity.

:::theorem{#bipolar title="Bipolar Theorem"}
For any closed convex cone $K\subseteq\R^n$, we have $K^{\circ\circ}=K$.
:::

A proof requires the separating hyperplane theorem. We state that result now, because it is a crucial result.

### The separating hyperplane theorem

:::theorem{#separating-hyperplane title="Separating Hyperplane Theorem"}
Let $C\subseteq\R^n$ be a nonempty closed convex set, and let $z\notin C$. Then there exist $a\in\R^n$, $a\ne 0$, and $b\in\R$ such that

$$
\ip{a}{z}>b\qquad\text{and}\qquad \ip{a}{x}\le b\quad\text{for all }x\in C.
$$
:::

:::proof
Since $C$ is nonempty and closed and $z\notin C$, the function $x\mapsto \|x-z\|^2$ attains its minimum over $C$ at some $\bar x\in C$. Set $a:=z-\bar x$; since $z\notin C$, $a\ne 0$.

For any $x\in C$ and $t\in[0,1]$, convexity gives $\bar x+t(x-\bar x)\in C$, so

$$
\|z-\bar x\|^2\le \|z-\bar x-t(x-\bar x)\|^2
=\|z-\bar x\|^2-2t\ip{z-\bar x}{x-\bar x}+t^2\|x-\bar x\|^2.
$$

Dividing by $t>0$ and letting $t\downarrow 0$ gives

$$
\ip{a}{x-\bar x}=\ip{z-\bar x}{x-\bar x}\le 0,
$$

that is, $\ip{a}{x}\le \ip{a}{\bar x}$. Set $b:=\ip{a}{\bar x}$. Then $\ip{a}{x}\le b$ for all $x\in C$. Meanwhile,

$$
\ip{a}{z}-b=\ip{a}{z-\bar x}=\ip{a}{a}=\|a\|^2>0.
$$
:::

:::remark
This result is called the separating hyperplane theorem because the set defined by $\{ x \in \R^n : \ip{x}{a} = b\}$ is a hyperplane (for any $x_1,x_2$ in the set, $\ip{x_1-x_2}{a} = \ip{x_1}{a}-\ip{x_2}{a}=b-b=0$, so any difference vector in the set is orthogonal to $a$, making $a$ the *normal vector*), and it separates the point $z$ from the set $C$: $z$ lies in the half-space $H^{++}:=\{x : \ip{a}{x} > b\}$, while the set $C$ lies in the half-space $H^{-}:=\{x : \ip{a}{x} \leq b\}$.
:::

We now prove bipolarity.

:::proof{title="Proof of the Bipolar Theorem"}
The inclusion $K\subseteq K^{\circ\circ}$ holds for any set $K$: if $x\in K$, then $\ip{y}{x}\le 0$ for every $y\in K^\circ$ by definition of $K^\circ$, so $x\in K^{\circ\circ}$.

For the reverse, suppose for contradiction that some $z\in K^{\circ\circ}$ is not in $K$. Since $K$ is closed and convex and $z\notin K$, the separating hyperplane theorem gives $a\ne 0$ and $b\in\R$ with $\ip{a}{z}>b$ and $\ip{a}{x}\le b$ for all $x\in K$. Because $K$ is a cone, $0\in K$, so $b\ge 0$. Also because $K$ is a cone, if $\ip{a}{x}>0$ for some $x\in K$, then $\ip{a}{tx}=t\ip{a}{x}\to+\infty$ as $t\to+\infty$, contradicting $\ip{a}{tx}\le b$. Therefore $\ip{a}{x}\le 0$ for all $x\in K$, i.e. $a\in K^\circ$. But $z\in K^{\circ\circ}$ means $\ip{a}{z}\le 0$, contradicting $\ip{a}{z}>b\ge 0$.
:::

### Farkas' lemma

Farkas' lemma is the concrete description of the polar of a finitely generated cone. It is the tool that will let us convert $-\nabla f\in T^\circ$ into $-\nabla f$ is a nonnegative combination of active constraint gradients."

:::theorem{#farkas-polar title="Farkas' Lemma, Polar Form"}
Let $v_1,\ldots,v_m\in\R^n$, and set $K:=\cone\{v_1,\ldots,v_m\}$. Then

$$
K^\circ=\{y\in\R^n:\ip{y}{v_k}\le 0\text{ for all }k=1,\ldots,m\},
$$

and conversely, if we define $L:=\{y:\ip{y}{v_k}\le 0\text{ for all }k\}$, then

$$
L^\circ=K=\cone\{v_1,\ldots,v_m\}.
$$
:::

:::proof
The first equality is immediate from [[#polar-properties]] (iii): $K=\cone\{v_1,\ldots,v_m\}$, so $y\in K^\circ$ iff $\ip{y}{v_k}\le 0$ for every generator $v_k$.

For the second equality, apply the bipolar theorem. The cone $K=\cone\{v_1,\ldots,v_m\}$ is closed and convex. Hence $K^{\circ\circ}=K$. The first part showed that $K^\circ=L$, hence $K=K^{\circ\circ}=L^\circ$.
:::

:::corollary{#farkas-alternative title="Farkas' Lemma, Alternative Form"}
For $A\in\R^{m\times n}$ and $b\in\R^m$, exactly one of the following holds:

(i) There exists $x\ge 0$ with $Ax=b$.

(ii) There exists $y\in\R^m$ with $A^\top y\ge 0$ and $\ip{b}{y}<0$.
:::

:::proof
Applying the polar form to the columns of $A$, statement (i) says $b$ belongs to the conic hull of the columns of $A$. Its negation means that a separating vector exists. With the sign convention chosen above this is equivalent, after the sign flip $y\mapsto -y$, to $A^\top y\ge 0$ and $\ip{b}{y}<0$. The sign conventions vary across references; the content is identical.
:::

With cones, polars, and Farkas in hand, we turn to the core of the proof: the tangent cone.

## Local Minimality Forces a First Order Condition

Given any closed set $\Omega\subseteq\R^n$ and any differentiable $f$, we derive the first-order necessary condition at a local min $x^\star\in\Omega$ in terms of the intrinsic geometry of $\Omega$.

### The tangent cone

We need a precise notion of "direction in which one can move infinitesimally while staying in $\Omega$."

:::definition{#tangent-cone title="Tangent Cone"}
Let $\Omega\subseteq\R^n$ and $x\in\Omega$. The *Bouligand* **tangent cone** to $\Omega$ at $x$ is

$$
T_\Omega(x):=\left\{d\in\R^n:\ \exists\text{ sequences }x_k\in\Omega,\ t_k\downarrow0,\text{ with }\frac{x_k-x}{t_k}\to d\right\}.
$$
:::

:::remark{#tangent-cone-sequences}
Note that the witnessing sequence $x_k$ must converge to $x$.

Additionally, note that $\frac{x_k-x}{t_k}\to d \iff \frac{x_k - x - dt_k}{t_k} \to 0 \iff x_k - (x+dt_k) = o(t_k)$. That is, the witnessing sequence is an $o(t_k)$-accurate substitution for the ray $x+dt_k$.
:::

**Three pictures.** To make the definition concrete, we look at three examples of progressively increasing subtlety.

**Picture 1: a convex polyhedron.** In the simplest case $\Omega$ is a convex polyhedron and the tangent cone at any point is the closed conic hull of directions from $x$ into $\Omega$. At an interior point, every direction is tangent: $T_\Omega(x)=\R^n$. At a boundary point on a single face, the tangent cone is a half-space. At a vertex where two faces meet, it is a wedge-shaped cone.

<figure class="fig">
  <img src="/figures/optimization/tangent-cone-polyhedron.svg" alt="Tangent cones of a convex polyhedron at an interior point, an edge point, and a vertex">
</figure>

At $x_1$ (interior), every direction is feasible infinitesimally, so the tangent cone is all of $\R^2$. At $x_2$ (on an edge), we can move along the edge in either direction or into the interior; only directions pointing "out" of the polyhedron are excluded, so the tangent cone is a half-plane. At $x_3$ (vertex), only directions into the cone spanned by the two adjacent edges are feasible.

**Picture 2: a nonconvex set with a cusp.** Consider the set

$$
\Omega=\{(x,y)\in\R^2:y\ge0,\ y\le(1-x)^3,\ x\ge0\},
$$

which has a cusp at the point $x^\star=(1,0)$. Locally near $x^\star$, the set is a thin wedge that pinches shut as $x\to1$. The tangent cone captures the only infinitesimal feasible direction: leftward along the $x$-axis.

<figure class="fig">
  <img src="/figures/optimization/tangent-cone-cusp.svg" alt="A cusped feasible set whose tangent cone at the cusp is a single leftward half-line">
</figure>

*Note:* The linearized feasible cone from the constraint gradients would include $\{(a,0):a\in\R\}$ (a full line), because linearization of $y\le(1-x)^3$ at $x^\star$ gives $y\le0$, compatible with moving in direction $(+1,0)$ to first order. But the true tangent cone only contains leftward motion, because the cubic term in $(1-x)^3$ crushes feasibility as soon as $x>1$. This gap is exactly why constraint qualifications are needed: the linearization fails to capture the tangent cone faithfully. We return to this in Stage 2.

**Picture 3: isolated points on a parabola.** Consider

$$
\Omega=\{0\}\cup\{(1/k,1/k^2):k=1,2,3,\ldots\},
$$

the origin together with a sequence of isolated points that accumulate at $0$ along the parabola $y=x^2$. The points do not lie on any line through the origin — they are arranged along a curve with nontrivial second-order structure. Nonetheless, the Bouligand tangent cone at the origin captures a clean first-order direction.

<figure class="fig">
  <img src="/figures/optimization/tangent-cone-parabola.svg" alt="Isolated points on a parabola accumulating at the origin; the tangent cone there contains the horizontal direction">
</figure>

Take $x_k=(1/k,1/k^2)$ and $t_k=1/k$. Then

$$
\frac{x_k-0}{t_k}=(1,1/k)\longrightarrow(1,0),
$$

so $(1,0)\in T_\Omega(0)$. Notice two things. First, the points do not lie on any line through the origin — they live on a parabola. Second, the direction $(1,0)$ captured by the tangent cone is the leading-order direction of approach: the second-order wiggle $1/k^2$ in the $y$-coordinate gets crushed to zero once we divide by $t_k=1/k$. This is exactly the Taylor-expansion scaling at work: the tangent cone extracts first-order information, and higher-order terms vanish under the $1/t_k$ normalization.

No smooth feasible curve connects the origin to these isolated points (they are isolated), so a tangent-cone definition based on "derivatives of smooth feasible paths" would give the trivial cone $\{0\}$ and miss the direction $(1,0)$ entirely. The Bouligand definition, working with sequences instead of curves, correctly captures first-order approach directions even through sets that are not path-connected. This is the technical reason the sequence-based definition is the right one: it extracts the maximum possible first-order information from the feasibility hypothesis, independent of whether the feasible set has any smooth structure.

:::proposition{#tangent-cone-basic title="Basic Properties of the Tangent Cone"}
For any $\Omega\subseteq\R^n$ and $x\in\Omega$, the set $T_\Omega(x)$ is a closed cone containing $0$. It need not be convex if $\Omega$ is not convex.
:::

:::proof
$0\in T_\Omega(x)$ by taking $x_k=x$ for all $k$. For scaling: if $d\in T_\Omega(x)$ via $(x_k,t_k)$, then for any $\alpha>0$, $(x_k-x)/(t_k/\alpha)=\alpha(x_k-x)/t_k\to\alpha d$, so $\alpha d\in T_\Omega(x)$. Closedness follows from a diagonal argument: if $d^{(\ell)}\in T_\Omega(x)$ and $d^{(\ell)}\to d$, a diagonal argument extracts sequences $(x_k,t_k)$ with $(x_k-x)/t_k\to d$.
:::

:::example{#tangent-cone-convex-set title="Tangent Cone of a Convex Set"}
If $\Omega$ is convex, then for any $y\in\Omega$ and $t\in(0,1]$, the point $x+t(y-x)=(1-t)x+ty$ lies in $\Omega$, so $(y-x)$ is a direction of approach (take $x_k=x+(1/k)(y-x)$, $t_k=1/k$). Thus

$$
T_\Omega(x)\supseteq \cone\{y-x:y\in\Omega\}.
$$

The reverse inclusion also holds and the tangent cone equals this closed conic hull.
:::

### The fundamental necessary condition

:::theorem{#geometric-fonc title="First-Order Necessary Condition"}
Let $\Omega\subseteq\R^n$ be any closed set, let $f:\R^n\to\R$ be differentiable at $x^\star\in\Omega$, and suppose $x^\star$ is a local minimizer of $f$ over $\Omega$. Then

$$
-\nabla f(x^\star)\in T_\Omega(x^\star)^\circ,
$$

equivalently, $\ip{\nabla f(x^\star)}{d}\ge0$ for every $d\in T_\Omega(x^\star)$.
:::

:::proof
Suppose some $d\in T_\Omega(x^\star)$ has $\langle\nabla f(x^\star),d\rangle=-c<0$, realized by sequences $x_k\in\Omega$ and $t_k\downarrow0$ with $d_k:=(x_k-x^\star)/t_k\to d$. By differentiability of $f$ at $x^\star$,
$$
f(x_k)-f(x^\star)=t_k\langle\nabla f(x^\star),d_k\rangle+o(\|x_k-x^\star\|).
$$
The first term: $\langle\nabla f(x^\star),d_k\rangle\to-c$ by continuity of the inner product, so it is $\le-\tfrac{c}{2}$ for large $k$. The second term: $\|x_k-x^\star\|/t_k\to\|d\|$, so $\|x_k-x^\star\|=O(t_k)$ and $o(\|x_k-x^\star\|)=o(t_k)$.
Hence for large $k$,
$$
f(x_k)-f(x^\star)\le-\tfrac{c}{2}\,t_k+o(t_k)<0.
$$

So the $x_k$ are feasible points with $f(x_k)<f(x^\star)$ and $x_k\to x^\star$ (every neighborhood around $x^*$ will contain an $x_k$), contradicting local minimality of $x^\star$.
:::

:::remark
This generalizes the usual first-order condition from elementary calculus. Concretely, if $f$ is defined on an open set $U$, then at all points $x^* \in U$ we have $T_{\Omega}(x^*) = \R^n$. The condition from the theorem therefore becomes $\ip{\nabla f(x^\star)}{d}\ge0, \forall d \in \R^n$, which is only satisfied if $\nabla f(x^\star) = 0$.
:::

## The Linearized Feasible Cone and Constraint Qualifications

For the problem [[#main-problem]], define the **active set** at $x^\star\in\Omega$:

$$
I(x^\star):=\{j\in\{1,\ldots,r\}:g_j(x^\star)=0\}.
$$

:::definition{#linearized-feasible-cone title="Linearized Feasible Cone"}
The **linearized feasible cone** of [[#main-problem]] at $x^\star$ is

$$
F(x^\star):=\left\{d\in\R^n:
\ip{\nabla h_i(x^\star)}{d}=0\ \forall i,\quad
\ip{\nabla g_j(x^\star)}{d}\le 0\ \forall j\in I(x^\star)
\right\}.
$$
:::

$F(x^\star)$ is a polyhedral cone, because it is defined by finitely many linear equalities and inequalities. Crucially, it depends only on the constraint *gradients* at $x^\star$, not on the nonlinear curvature of the constraints. This linearization is why its polar cone will be computable via Farkas' lemma.

### The easy inclusion

:::proposition{#tangent-in-linearized}
For any differentiable $h_i,g_j$ and any $x^\star\in\Omega$,

$$
T_\Omega(x^\star)\subseteq F(x^\star).
$$
:::

:::proof
Let $d\in T_\Omega(x^\star)$ via $x_k\in\Omega$, $t_k\downarrow 0$, and

$$
\frac{x_k-x^\star}{t_k}\to d.
$$

Since $x_k\in\Omega$, we have $h_i(x_k)=0$ and $g_j(x_k)\le 0$ for all $k$. By differentiability,

$$
h_i(x_k)=h_i(x^\star)+\ip{\nabla h_i(x^\star)}{x_k-x^\star}+o(\|x_k-x^\star\|).
$$

Since $h_i(x_k)=h_i(x^\star)=0$, dividing by $t_k$ and letting $k\to\infty$ yields

$$
\ip{\nabla h_i(x^\star)}{d}=0.
$$

For $j\in I(x^\star)$, $g_j(x^\star)=0$, so $g_j(x_k)\le 0$ gives

$$
g_j(x_k)-g_j(x^\star)\le 0.
$$

Applying the first-order expansion of $g_j$ at $x^\star$, dividing by $t_k$, and passing to the limit gives

$$
\ip{\nabla g_j(x^\star)}{d}\le 0.
$$

Hence $d\in F(x^\star)$.
:::

### The hard inclusion: constraint qualifications

The reverse inclusion

$$
F(x^\star)\subseteq T_\Omega(x^\star)
$$

can fail. This is exactly the cusp of Picture 2: at $x^\star=(1,0)$ with

$$
g_1(x,y)=y-(1-x)^3\le 0,
\qquad
g_2(x,y)=-y\le 0
$$

both active, the linearized feasible cone is

$$
\{d:d_2\le 0,\ d_2\ge 0\}=\{d:d_2=0\},
$$

a full line. But the true tangent cone is only

$$
\{d:d_1\le 0,\ d_2=0\},
$$

a half-line, because the cubic curvature of $g_1$ prevents motion in the direction $(+1,0)$.

A **constraint qualification** is a hypothesis ensuring $F(x^\star)=T_\Omega(x^\star)$. The simplest and most common is LICQ.

:::definition{#licq title="LICQ"}
The **linear independence constraint qualification** (LICQ) holds at $x^\star$ if the gradients

$$
\{\nabla h_i(x^\star):i=1,\ldots,s\}
\cup
\{\nabla g_j(x^\star):j\in I(x^\star)\}
$$

are linearly independent.
:::

:::theorem{#licq-equality-cones title="LICQ Implies Equality of Cones"}
Suppose $h_i,g_j$ are continuously differentiable in a neighborhood of $x^\star$, and LICQ holds at $x^\star$. Then

$$
T_\Omega(x^\star)=F(x^\star).
$$
:::

:::proof
The inclusion $T_\Omega(x^\star)\subseteq F(x^\star)$ is [[#tangent-in-linearized]]. We prove the reverse inclusion by constructing, for each $d\in F(x^\star)$, a feasible curve through $x^\star$ with initial direction $d$. This construction uses the implicit function theorem, and is the geometric heart of the matter.

Let $d\in F(x^\star)$. Let $A:=I(x^\star)$ be the active inequality indices. Consider the active constraints as a vector-valued map

$$
\Phi:\R^n\to\R^{s+|A|},
$$

whose components are

$$
h_1,\ldots,h_s \quad\text{and}\quad g_j\quad (j\in A).
$$

By LICQ, the Jacobian $D\Phi(x^\star)$ has full row rank. By the implicit function theorem, one can parameterize the level set

$$
\{x:\Phi(x)=\Phi(x^\star)=0\}
$$

locally near $x^\star$ as a smooth manifold of dimension $n-s-|A|$. The tangent space to this manifold at $x^\star$ is exactly

$$
\ker D\Phi(x^\star)
=
\left\{d:
\ip{\nabla h_i(x^\star)}{d}=0\ \forall i,
\quad
\ip{\nabla g_j(x^\star)}{d}=0\ \forall j\in A
\right\}.
$$

*Case 1.* Suppose

$$
\ip{\nabla g_j(x^\star)}{d}=0
\qquad\text{for all }j\in A
$$

as well. Then $d$ is a tangent vector to the manifold, and by the implicit function theorem there is a smooth curve

$$
\gamma:[0,\varepsilon)\to\R^n
$$

with

$$
\gamma(0)=x^\star,
\qquad
\gamma'(0)=d,
\qquad
\Phi(\gamma(t))=0
\quad\text{for all }t\in[0,\varepsilon).
$$

In particular, the active constraints remain satisfied. Since $g_j(x^\star)<0$ for $j\notin A$, continuity gives $g_j(\gamma(t))<0$ for small enough $t$. Hence $\gamma(t)\in\Omega$, and

$$
d=\gamma'(0)=\lim_{t\downarrow0}\frac{\gamma(t)-x^\star}{t}\in T_\Omega(x^\star).
$$

*Case 2.* Some $j\in A$ has

$$
\ip{\nabla g_j(x^\star)}{d}<0.
$$

Let

$$
A_=:=\{j\in A:\ip{\nabla g_j(x^\star)}{d}=0\},
\qquad
A_<:=A\setminus A_=.
$$

Consider the system of equations involving only $h_i$ for all $i$ and $g_j$ for $j\in A_=$. By LICQ their gradients are linearly independent, so we can again invoke the implicit function theorem to find a smooth curve $\gamma$ with

$$
\gamma(0)=x^\star,
\qquad
\gamma'(0)=d,
\qquad
h_i(\gamma(t))=0\quad\text{for all }i,
\qquad
g_j(\gamma(t))=0\quad\text{for }j\in A_=.
$$

For $j\in A_<$,

$$
g_j(\gamma(0))=0
\quad\text{and}\quad
\left.\frac{d}{dt}g_j(\gamma(t))\right|_{t=0}
=
\ip{\nabla g_j(x^\star)}{d}<0,
$$

so $g_j(\gamma(t))<0$ for small $t>0$. For $j\notin A$, $g_j(x^\star)<0$, and continuity gives $g_j(\gamma(t))<0$ for small $t$. Hence $\gamma(t)\in\Omega$ for small $t>0$, and again $d\in T_\Omega(x^\star)$.
:::

:::remark{#weaker-constraint-qualifications}
The "Case 2" construction is subtle: we artificially promote some active inequalities to equalities and drop the rest, relying on LICQ to give us enough freedom. Weaker constraint qualifications — Mangasarian–Fromovitz, Abadie, Guignard — relax LICQ in various ways, each requiring a different but related argument to establish $F\subseteq T_\Omega$. For linear constraints, the equality holds unconditionally: the linearized feasible cone is the tangent cone because straight-line motion stays feasible. This is why the polyhedral case needs no constraint qualification at all.
:::

## Stage 3: Farkas Closes the Loop

We now have the ingredients to prove KKT. Combining [[#geometric-fonc]] and [[#licq-equality-cones]], at a local minimum $x^\star$ under LICQ we have

$$
-\nabla f(x^\star)\in T_\Omega(x^\star)^\circ=F(x^\star)^\circ.
$$

We need to compute $F(x^\star)^\circ$ explicitly.

:::lemma{#polar-of-linearized-cone title="Polar of the Linearized Feasible Cone"}
$$
F(x^\star)^\circ
=
\left\{
\sum_{i=1}^s \mu_i\nabla h_i(x^\star)
+
\sum_{j\in I(x^\star)}\lambda_j\nabla g_j(x^\star)
:
\mu_i\in\R,\ \lambda_j\ge 0
\right\}.
$$
:::

:::proof
Write equality constraints as pairs of inequalities:

$$
\ip{\nabla h_i(x^\star)}{d}=0
\quad\Longleftrightarrow\quad
\ip{\nabla h_i(x^\star)}{d}\le 0
\quad\text{and}\quad
\ip{-\nabla h_i(x^\star)}{d}\le 0.
$$

Then $F(x^\star)$ takes the form

$$
F(x^\star)=\{d: \ip{v_k}{d}\le 0\text{ for all }k=1,\ldots,N\}
$$

for an appropriate finite family $\{v_k\}$: the list contains $\pm\nabla h_i(x^\star)$ for each equality constraint, and $\nabla g_j(x^\star)$ for each active inequality constraint $j\in I(x^\star)$.

By Farkas' lemma, the polar of such a cone is exactly $\cone\{v_k\}$. Substituting the $v_k$'s: the two signed copies $\pm\nabla h_i(x^\star)$, each with nonnegative coefficients, combine to give arbitrary real multiples of $\nabla h_i(x^\star)$; the active inequality gradients $\nabla g_j(x^\star)$ contribute only nonnegative multiples. This is exactly the stated expression.
:::

:::theorem{#kkt-necessary title="KKT Necessary Conditions"}
Let $f,h_i,g_j:\R^n\to\R$ be continuously differentiable, let $x^\star$ be a local minimizer of [[#main-problem]], and suppose LICQ holds at $x^\star$. Then there exist multipliers $\mu^\star\in\R^s$ and $\lambda^\star\in\R^r$ with $\lambda^\star\ge 0$ such that

$$
\begin{aligned}
-\nabla f(x^\star)
&=\sum_{i=1}^s \mu_i^\star\nabla h_i(x^\star)
 +\sum_{j=1}^r \lambda_j^\star\nabla g_j(x^\star)
&&\text{(stationarity)},\\
\lambda_j^\star g_j(x^\star)&=0
&&\text{(complementary slackness)},\\
h_i(x^\star)&=0,\qquad g_j(x^\star)\le 0
&&\text{(primal feasibility)}.
\end{aligned}
$$
:::

:::proof
Primal feasibility is automatic since $x^\star\in\Omega$. By [[#geometric-fonc]], $-\nabla f(x^\star)\in T_\Omega(x^\star)^\circ$. By [[#licq-equality-cones]], $T_\Omega(x^\star)=F(x^\star)$, so

$$
-\nabla f(x^\star)\in F(x^\star)^\circ.
$$

By [[#polar-of-linearized-cone]], there exist $\mu_i^\star\in\R$ and $\widetilde\lambda_j^\star\ge 0$ for $j\in I(x^\star)$ such that

$$
-\nabla f(x^\star)
=
\sum_{i=1}^s \mu_i^\star\nabla h_i(x^\star)
+
\sum_{j\in I(x^\star)}\widetilde\lambda_j^\star\nabla g_j(x^\star).
$$

Extend these active-constraint multipliers to all inequality constraints by setting

$$
\lambda_j^\star:=\widetilde\lambda_j^\star\quad\text{for }j\in I(x^\star),
\qquad
\lambda_j^\star:=0\quad\text{for }j\notin I(x^\star).
$$

Then $\lambda_j^\star\ge 0$ everywhere, the displayed stationarity equation becomes the same equation summed over all $j=1,\ldots,r$ because the added inactive terms have coefficient zero, and complementary slackness holds automatically: for $j\in I(x^\star)$, $g_j(x^\star)=0$; for $j\notin I(x^\star)$, $\lambda_j^\star=0$.
:::

This completes the rigorous proof of KKT necessity. The Lagrangian function never appeared.

## The Lagrangian: What It Is and What It Isn't

:::definition{#lagrangian title="Lagrangian Function"}
The **Lagrangian** of [[#main-problem]] is the function

$$
L:\R^n\times\R^s\times\R^r_{\ge 0}\to\R,
\qquad
L(x;\mu,\lambda):=f(x)+\sum_{i=1}^s \mu_i h_i(x)+\sum_{j=1}^r \lambda_j g_j(x).
$$
:::

Differentiating in $x$ gives

$$
\nabla_x L(x;\mu,\lambda)
=
\nabla f(x)+\sum_{i=1}^s \mu_i\nabla h_i(x)+\sum_{j=1}^r \lambda_j\nabla g_j(x).
$$

The stationarity condition

$$
-\nabla f(x^\star)
=
\sum_{i=1}^s \mu_i^\star\nabla h_i(x^\star)
+
\sum_{j=1}^r \lambda_j^\star\nabla g_j(x^\star)
$$

is exactly

$$
\nabla_x L(x^\star;\mu^\star,\lambda^\star)=0.
$$

This is the entire role the Lagrangian plays in the necessity theorem. It is notation that packages the stationarity equation into a single symbol. Reading a classical textbook's statement of KKT — "$\nabla_xL(x^\star;\mu^\star,\lambda^\star)=0$ plus primal feasibility, dual feasibility, complementary slackness" — one can be led to believe that the Lagrangian is a primitive object from which optimality conditions are derived. The proof above shows the converse: the Lagrangian is a derived notation for the gradient equation that falls out of tangent-cone geometry and Farkas' lemma.

**What stationarity does not say.** Stationarity $\nabla_xL(x^\star;\mu^\star,\lambda^\star)=0$ says $x^\star$ is a critical point of the function $x\mapsto L(x;\mu^\star,\lambda^\star)$. It does not say $x^\star$ is a minimizer of this function. In a nonconvex problem, $x^\star$ is typically a saddle point of the Lagrangian. The identification "$x^\star$ minimizes the Lagrangian over $\R^n$" is a stronger statement that requires additional structure — specifically, convexity, as we see below.

### The KKT theorem, fully self-contained

For reference, we state the complete necessity result in one place, with no references to earlier notation required.

:::theorem{#kkt-self-contained title="KKT Necessary Conditions, Self-Contained Statement"}
Consider the problem

$$
\min_{x\in\R^n} f(x)
\quad\text{subject to}\quad
h_i(x)=0\ (i=1,\ldots,s),
\qquad
g_j(x)\le 0\ (j=1,\ldots,r),
$$

with $f,h_i,g_j:\R^n\to\R$ continuously differentiable. Let $x^\star$ be a local minimizer, and suppose the linear independence constraint qualification holds at $x^\star$: the gradients of the active constraints,

$$
\{\nabla h_i(x^\star)\}_{i=1}^s
\cup
\{\nabla g_j(x^\star):g_j(x^\star)=0\},
$$

are linearly independent.

Then there exist multipliers

$$
\mu^\star=(\mu_1^\star,\ldots,\mu_s^\star)\in\R^s,
\qquad
\lambda^\star=(\lambda_1^\star,\ldots,\lambda_r^\star)\in\R^r
$$

such that

$$
\begin{aligned}
\nabla f(x^\star)
+
\sum_{i=1}^s \mu_i^\star\nabla h_i(x^\star)
+
\sum_{j=1}^r \lambda_j^\star\nabla g_j(x^\star)&=0
&&\text{(stationarity)},\\
\lambda_j^\star&\ge 0\quad\forall j
&&\text{(dual feasibility)},\\
\lambda_j^\star g_j(x^\star)&=0\quad\forall j
&&\text{(complementary slackness)},\\
h_i(x^\star)&=0,\qquad g_j(x^\star)\le 0
&&\text{(primal feasibility)}.
\end{aligned}
$$

Equivalently, defining the Lagrangian

$$
L(x;\mu,\lambda):=f(x)+\sum_i\mu_i h_i(x)+\sum_j\lambda_jg_j(x),
$$

the conditions are

$$
\nabla_x L(x^\star;\mu^\star,\lambda^\star)=0,
\qquad
\lambda^\star\ge 0,
\qquad
\lambda_j^\star g_j(x^\star)=0\ \forall j,
\qquad
x^\star\text{ primal feasible}.
$$
:::

This is the "Lagrangian" theorem in full. Note what it does and does not say:

- It says multipliers *exist* at a local minimizer. It does not say they are unique. Under LICQ they are in fact unique, but weaker CQs such as Mangasarian–Fromovitz only guarantee existence.
- It says $x^\star$ is a *stationary point* of $L(\cdot;\mu^\star,\lambda^\star)$. It does not say $x^\star$ minimizes this function over $\R^n$; that requires convexity.
- It says nothing about *sufficiency*: KKT conditions can hold at points that are not local minima, for example at saddle points or local maxima. For sufficiency we need convexity, as in the next section, or second-order conditions.
- "LICQ" can be replaced by "all constraints affine" as in a linear program, or by Slater's condition in the convex case. Different constraint qualifications suit different problem structures.

[[#kkt-self-contained]] is the unified takeaway of everything we have done: it is what [[#kkt-necessary]] says, restated with no reliance on earlier section notation, and it is the statement one finds in classical references, under slightly different sign conventions, as the definition of KKT. The proof is the three-stage geometric argument of Stages 1–3.

### The Lagrangian-derivatives form of the optimality conditions

Kirschen and Strbac, Bertsekas, Nocedal–Wright, and most applied references state the first-order optimality conditions not as a list of four separate conditions — stationarity, primal feasibility, dual feasibility, complementary slackness — but as a consolidated package of four derivatives of the Lagrangian: at the optimum, every partial derivative of $L$ with respect to every primal and dual variable, with the appropriate sign or complementarity qualifier, vanishes.

The two forms are logically equivalent, but the Lagrangian-derivatives form is the one used in practice because it turns a mixed list of constraint statements (feasibility) and algebraic identities (stationarity) into a uniform list of gradient equations. We give that form here.

Recall the Lagrangian from [[#lagrangian]]:

$$
L(x;\mu,\lambda)=f(x)+\sum_i\mu_i h_i(x)+\sum_j\lambda_jg_j(x),
\qquad
x\in\R^n,
\quad
\mu\in\R^s,
\quad
\lambda\in\R^r_{\ge 0}.
$$

:::theorem{#lagrangian-derivatives-kkt title="Lagrangian-Derivatives Form of KKT"}
Under the hypotheses of [[#kkt-self-contained]] — continuous differentiability, $x^\star$ a local minimizer of [[#main-problem]], and LICQ at $x^\star$ — there exist multipliers $\mu^\star\in\R^s$ and $\lambda^\star\in\R^r_{\ge 0}$ such that all of the following hold at the point $(x^\star,\mu^\star,\lambda^\star)$:

$$
\begin{aligned}
\nabla_x L(x^\star;\mu^\star,\lambda^\star)&=0
&&\text{(primal stationarity)},\\
\frac{\partial L}{\partial\mu_i}(x^\star;\mu^\star,\lambda^\star)&=h_i(x^\star)=0\quad\forall i
&&\text{(equality primal feasibility)},\\
\frac{\partial L}{\partial\lambda_j}(x^\star;\mu^\star,\lambda^\star)&=g_j(x^\star)\le 0\quad\forall j
&&\text{(inequality primal feasibility)},\\
\lambda_j^\star\frac{\partial L}{\partial\lambda_j}(x^\star;\mu^\star,\lambda^\star)&=\lambda_j^\star g_j(x^\star)=0\quad\forall j
&&\text{(complementary slackness)},\\
\lambda_j^\star&\ge 0\quad\forall j
&&\text{(dual feasibility)}.
\end{aligned}
$$
{#lagrangian-kkt-system}
:::

:::proof
The first line of [[#lagrangian-kkt-system]] is literally the stationarity equation

$$
\nabla f(x^\star)+\sum_i\mu_i^\star\nabla h_i(x^\star)+\sum_j\lambda_j^\star\nabla g_j(x^\star)=0
$$

from [[#kkt-self-contained]], rewritten using the Lagrangian. The second and third lines follow from direct computation:

$$
\frac{\partial L}{\partial\mu_i}=h_i(x),
\qquad
\frac{\partial L}{\partial\lambda_j}=g_j(x),
$$

so primal feasibility $h_i(x^\star)=0$ and $g_j(x^\star)\le 0$ translate into statements about $L$-derivatives with respect to the multipliers. The fourth line is complementary slackness; the fifth is dual feasibility. Both come from [[#kkt-self-contained]] directly.
:::

**How this packages the KKT conditions.** The conditions of [[#lagrangian-derivatives-kkt]] are all derivative statements about $L$. Stationarity in $x$ is $\partial L/\partial x=0$; primal feasibility is $\partial L/\partial\mu=0$ and $\partial L/\partial\lambda\le 0$; complementary slackness pairs $\lambda$ with its $L$-derivative; dual feasibility is a sign constraint on $\lambda$. This is what Kirschen and Strbac mean when they write "optimality conditions" as a list of partial derivatives of $L$: it is the KKT theorem packaged around one object.

**Saddle-point characterization.** The Lagrangian-derivatives form makes visible that $(x^\star,\mu^\star,\lambda^\star)$ is a saddle point of $L$ in the following sense: $L$ is stationary in $x$ (primal variables), stationary in $\mu$ (equality multipliers, which would be the "maximizers" in the minimax view since multipliers are unconstrained), and has sign-constrained stationarity in $\lambda$ (inequality multipliers, via complementary slackness). The saddle-point interpretation becomes a strict saddle-point theorem under convexity: for convex $f,g_j$ and affine $h_i$, one has

$$
L(x^\star;\mu,\lambda)
\le
L(x^\star;\mu^\star,\lambda^\star)
\le
L(x;\mu^\star,\lambda^\star)
$$

for all $x$, all $\mu$, and all $\lambda\ge 0$, which is the saddle-point inequality in full form.

**Why applied references state the theorem this way.** When solving real problems by hand or by setting up a solver, one does not recompute the tangent-cone geometry that produced KKT. Instead, one writes the Lagrangian, takes all its partial derivatives, and sets them to zero, with sign conditions where required. The Lagrangian-derivatives form is the recipe; the tangent-cone derivation is the justification. [[#lagrangian-derivatives-kkt]] is what gets used operationally; [[#kkt-self-contained]] and its geometric derivation are what tell us the recipe is correct.

## What Convexity Adds

:::definition{#convex-program title="Convex Program"}
The problem [[#main-problem]] is a **convex program** if $f$ is convex, each $g_j$ is convex, and each $h_i$ is affine.
:::

Under convexity, $\lambda_jg_j(x)$ is convex, since $\lambda_j\ge 0$ and $g_j$ is convex, while $\mu_i h_i(x)$ is affine. Hence, for fixed multipliers $(\mu^\star,\lambda^\star)$, the Lagrangian $L(\cdot;\mu^\star,\lambda^\star)$ is a convex function of $x$. For a convex function, stationarity is equivalent to global minimality:

$$
\nabla_x L(x^\star;\mu^\star,\lambda^\star)=0
\quad\Longleftrightarrow\quad
x^\star\in\operatorname*{arg\,min}_{x\in\R^n}L(x;\mu^\star,\lambda^\star).
$$

Convexity of the objective and constraint functions is what converts *stationarity* of the Lagrangian into *unconstrained minimization* of the Lagrangian. Without convexity, stationarity still follows from the tangent-cone/Farkas argument, but it is only a first-order necessary condition; it does not identify a global minimizer of $L$.

:::theorem{#strong-duality-slater title="Strong Duality under Convexity and Slater"}
Suppose [[#main-problem]] is a convex program, admits a minimizer $x^\star$, and satisfies Slater's condition: there exists $\bar x$ with

$$
g_j(\bar x)<0\quad\text{for all }j,
\qquad
h_i(\bar x)=0\quad\text{for all }i.
$$

Then KKT multipliers $(\mu^\star,\lambda^\star)$ exist, and

$$
f(x^\star)=\min_{x\in\Omega}f(x)
=
\max_{\lambda\ge 0,\mu}\inf_{x\in\R^n}L(x;\mu,\lambda).
$$
:::

The proof of this theorem in full generality requires more work than our space allows. One route is to use Slater's condition as the constraint qualification in a geometric separating-hyperplane argument; another is to develop the convex duality theory directly. The structural conclusion is what matters here: under convexity plus Slater, the primal optimum equals the dual optimum, where the dual optimum is defined by the outer max–inf problem above. Absent convexity, weak duality still holds universally, but a duality gap generically appears.

**What convexity buys, summarized.**

1. **Sufficiency.** In a convex program, the KKT conditions are not only necessary but also sufficient for global optimality.
2. **Global minimization of $L$.** The primal optimum $x^\star$ globally minimizes $L(\cdot;\mu^\star,\lambda^\star)$ over $\R^n$.
3. **Strong duality.** The primal and dual optima coincide.
4. **Global rather than local.** "Local minimum" in KKT becomes "global minimum" automatically.

None of these hold automatically in the nonconvex case, even though KKT necessity ([[#kkt-necessary]]) continues to apply.

## Sensitivity and the Envelope Theorem: Multipliers as Shadow Prices

We have derived the KKT multipliers $\mu^\star,\lambda^\star$ as coefficients in the linear combination that expresses $-\nabla f(x^\star)$ in terms of constraint gradients. This is an algebraic characterization. There is also an economic characterization, equally fundamental: the multipliers measure the *sensitivity of the optimal value to perturbations of the constraints*. This is the envelope theorem, and it is what justifies calling multipliers **shadow prices**.

### The perturbed problem and the value function

Consider the family of problems obtained by right-hand-side perturbation of [[#main-problem]]: for parameters $u\in\R^r$ and $v\in\R^s$,

$$
\begin{aligned}
P(u,v):\quad \min_{x\in\R^n}\quad & f(x)\\
\st\quad & g_j(x)\le u_j, && j=1,\ldots,r,\\
& h_i(x)=v_i, && i=1,\ldots,s.
\end{aligned}
$$
{#perturbed-problem}

The original problem is $P(0,0)$. Define the **value function**

$$
V(u,v):=\inf\{f(x):g_j(x)\le u_j\ \forall j,\ h_i(x)=v_i\ \forall i\}.
$$

If the infimum is not attained, set $V(u,v):=+\infty$ by convention, and likewise if the feasible set is empty. The domain of interest is a neighborhood of $(0,0)$ where the problem remains well posed.

**Intuition.** Increasing $u_j$ relaxes the $j$-th inequality constraint (more slack), so $V$ should weakly decrease in $u_j$. Changing $v_i$ moves the equality constraint, which may help or hurt. The envelope theorem says these partial derivatives exist at $(0,0)$ and equal the KKT multipliers:

$$
\frac{\partial V}{\partial u_j}(0,0)=-\lambda_j^\star,
\qquad
\frac{\partial V}{\partial v_i}(0,0)=-\mu_i^\star.
$$

The signs are a matter of convention (the reversal comes from the sign of $\lambda_j g_j$ and $\mu_i h_i$ in the Lagrangian); the magnitude is what matters. A unit loosening of the $j$-th inequality constraint reduces the optimal cost by $\lambda_j^\star$. That is the shadow price.

### The envelope theorem

:::theorem{#envelope-smooth title="Envelope Theorem, Smooth Case"}
Suppose the perturbed problem $P(u,v)$ has a local minimizer $x^\star(u,v)$ depending continuously differentiably on $(u,v)$ in a neighborhood of $(0,0)$, with KKT multipliers $\lambda^\star(u,v)\ge0$ and $\mu^\star(u,v)\in\R^s$ also depending continuously differentiably on $(u,v)$, and suppose strict complementary slackness holds at $(0,0)$ (i.e., for every active $j$ at $x^\star(0,0)$, $\lambda_j^\star>0$). Then the value function $V$ is continuously differentiable at $(0,0)$, with

$$
\frac{\partial V}{\partial u_j}(0,0)=-\lambda_j^\star,
\qquad
\frac{\partial V}{\partial v_i}(0,0)=-\mu_i^\star.
$$
:::

The proof uses a term-by-term analysis of the chain rule applied to the identity $V(u,v)=L(x^\star(u,v);\mu^\star(u,v),\lambda^\star(u,v);u,v)$. This approach makes transparent why each chain-rule term vanishes or survives, and each vanishing corresponds to one of the KKT conditions: stationarity in $x$, primal feasibility, and complementary slackness. There is only one nontrivial theorem at work — KKT stationarity; the other "vanishings" are restatements of primal feasibility and complementary slackness, not additional stationarity claims.

:::proof
Write the parameterized Lagrangian as

$$
L(x;\mu,\lambda;u,v)
=f(x)+\sum_i\mu_i(h_i(x)-v_i)+\sum_\ell\lambda_\ell(g_\ell(x)-u_\ell).
$$

At the optimum $(x^\star(u,v);\mu^\star(u,v),\lambda^\star(u,v))$, primal feasibility gives $h_i(x^\star)-v_i=0$, and complementary slackness gives

$$
\lambda_\ell^\star\bigl(g_\ell(x^\star)-u_\ell\bigr)=0.
$$

Therefore

$$
L(x^\star;\mu^\star,\lambda^\star;u,v)=f(x^\star)+0+0=V(u,v).
$$

This identity holds for all $(u,v)$ in a neighborhood of $(0,0)$ where the primal-dual pair varies smoothly.

Now differentiate the identity in $u_j$ using the total chain rule, accounting for every way $u_j$ enters:

$$
\frac{\partial V}{\partial u_j}
=
\underbrace{\sum_k\frac{\partial L}{\partial x_k}\frac{\partial x_k^\star}{\partial u_j}}_{(A)}
+
\underbrace{\sum_i\frac{\partial L}{\partial\mu_i}\frac{\partial\mu_i^\star}{\partial u_j}}_{(B)}
+
\underbrace{\sum_\ell\frac{\partial L}{\partial\lambda_\ell}\frac{\partial\lambda_\ell^\star}{\partial u_j}}_{(C)}
+
\underbrace{\frac{\partial L}{\partial u_j}}_{(D)},
$$
{#chain-rule-envelope}

where all partial derivatives of $L$ are evaluated at $(x^\star;\mu^\star,\lambda^\star;u,v)$. We show that $(A)$, $(B)$, and $(C)$ vanish, and $(D)$ gives the shadow price. Each vanishing has a distinct mechanism.

**Why (A) vanishes: KKT stationarity in $x$.** KKT gives $\nabla_xL(x^\star;\mu^\star,\lambda^\star)=0$. Therefore

$$
(A)=\left\langle \nabla_xL,\frac{\partial x^\star}{\partial u_j}\right\rangle
=\left\langle 0,\frac{\partial x^\star}{\partial u_j}\right\rangle=0.
$$

This is the only term whose vanishing uses a nontrivial theorem. The point $x^\star$ is chosen to make the $x$-gradient of $L$ zero, so a first-order perturbation of $x^\star$ produces no first-order change in $L$.

**Why (B) vanishes: primal equality feasibility, not a new stationarity theorem.** Compute $\partial L/\partial\mu_i$ directly from the definition of $L$:

$$
\frac{\partial L}{\partial\mu_i}(x;\mu,\lambda;u,v)=h_i(x)-v_i.
$$

This is just the coefficient of $\mu_i$ in $L$; since $L$ is linear in $\mu$, differentiating in $\mu_i$ picks off that coefficient. Notice that this partial depends only on $x$ and $v$, not on $\mu$ or $\lambda$.

Evaluated at the optimum, $x=x^\star(u,v)$ is primal feasible in $P(u,v)$, so $h_i(x^\star(u,v))=v_i$, giving

$$
\left.\frac{\partial L}{\partial\mu_i}\right|_{\text{optimum}}
=h_i(x^\star(u,v))-v_i=0.
$$

Therefore every term of $(B)$ is $0\cdot(\partial\mu_i^\star/\partial u_j)=0$, and $(B)$ vanishes regardless of what the multiplier derivative $\partial\mu_i^\star/\partial u_j$ is.

The mechanism here is not a new "stationarity in $\mu$" theorem. The coefficient $\partial L/\partial\mu_i$ equals the $i$-th equality-constraint residual by the algebraic form of $L$, and this residual happens to be zero at any primal-feasible point. It is primal feasibility, rewritten using the observation that $\partial L/\partial\mu_i$ is literally the constraint residual.

**Why (C) vanishes: complementary slackness plus strict complementarity.** Similarly, direct computation gives

$$
\frac{\partial L}{\partial\lambda_\ell}(x;\mu,\lambda;u,v)=g_\ell(x)-u_\ell.
$$

Again this is a pure function of $x$ and $u$, not of $\mu$ or $\lambda$. At the optimum, it equals $g_\ell(x^\star)-u_\ell$, which is $\le0$ by primal feasibility — but not necessarily zero. We need to analyze $(C)$ term by term, splitting the index set into active and inactive constraints.

For active constraints, meaning those $\ell$ with $g_\ell(x^\star)=u_\ell$, strict complementary slackness gives $\lambda_\ell^\star>0$. Under continuous dependence of the primal-dual pair on $(u,v)$, $\lambda_\ell^\star$ remains strictly positive in a neighborhood of the current $(u,v)$; hence the constraint stays active: $g_\ell(x^\star(u',v'))=u'_\ell$ identically for $(u',v')$ near $(u,v)$. Therefore

$$
\frac{\partial L}{\partial\lambda_\ell}=g_\ell(x^\star)-u_\ell=0
$$

not just at the current point but in a whole neighborhood, and the $\ell$-th term of $(C)$ vanishes.

For inactive constraints, meaning those $\ell$ with $g_\ell(x^\star)<u_\ell$, complementary slackness gives $\lambda_\ell^\star=0$. By continuity of $\lambda_\ell^\star(u,v)$ and the inequality $\lambda_\ell^\star\ge0$, the only stable local possibility is $\lambda_\ell^\star(u',v')=0$ nearby. If $\lambda_\ell^\star$ became strictly positive somewhere nearby, complementary slackness at that point would force $g_\ell=u'_\ell$, contradicting $g_\ell(x^\star)<u_\ell$ by continuity. Therefore $\partial\lambda_\ell^\star/\partial u_j=0$, and the $\ell$-th term of $(C)$ vanishes.

So $(C)$ vanishes term by term, by two different mechanisms: for active $\ell$, the coefficient $\partial L/\partial\lambda_\ell$ is identically zero; for inactive $\ell$, the multiplier derivative $\partial\lambda_\ell^\star/\partial u_j$ is identically zero. Strict complementary slackness is what ensures the active/inactive classification is stable under small perturbations. Without it, a constraint could flip between active and inactive as $(u,v)$ varies, breaking the clean classification.

**Why (D) survives: the explicit parametric dependence.** Differentiating $L$ in $u_j$ picks off the explicit $-\lambda_j u_j$ term:

$$
\frac{\partial L}{\partial u_j}(x;\mu,\lambda;u,v)=-\lambda_j,
$$

which at the optimum equals $-\lambda_j^\star$.

**Putting it together.** Equation [[#chain-rule-envelope]] reduces to

$$
\frac{\partial V}{\partial u_j}=0+0+0+(-\lambda_j^\star)=-\lambda_j^\star.
$$

An identical argument in $v_i$, where the explicit parametric term is $-\mu_i v_i$, gives

$$
\frac{\partial V}{\partial v_i}=-\mu_i^\star.
$$
:::

**The mechanism in one sentence.** There is exactly one stationarity theorem at work — KKT stationarity in $x$, which kills $(A)$. The vanishing of $(B)$ and $(C)$ uses not a second and third stationarity theorem, but the algebraic observation that $\partial L/\partial\mu_i$ and $\partial L/\partial\lambda_\ell$ are the constraint residuals, which are zero (or forced zero in a neighborhood) by primal feasibility and complementary slackness. The "envelope cancellation" is KKT used three times through the chain rule, once for each block of variables.

:::remark{#fiacco title="Regularity Hypotheses"}
The theorem assumes continuously differentiable dependence of $x^\star$ and the multipliers on $(u,v)$. This differentiability can be established under LICQ, strict complementary slackness, and a second-order sufficient condition, via the implicit function theorem applied to the KKT system — a result known as Fiacco's sensitivity theorem. Weaker forms of the envelope theorem (directional derivatives, subgradients of $V$) hold when these conditions are relaxed, but the clean equality $\partial V/\partial u_j=-\lambda_j^\star$ requires the smoothness assumed above. For linear programming — the setting of the ISO dispatch problem — a simpler sensitivity theory applies and avoids the need for Fiacco's theorem entirely; it is developed in the companion entry on electricity pricing.
:::

### The general parametric envelope theorem

[[#envelope-smooth]] addresses one particular kind of perturbation: shifting the right-hand side of each constraint by an independent parameter. In applications, one often wants to know how $V$ changes with respect to a parameter $a$ that may enter the problem anywhere — in the objective, in any subset of constraints, possibly in several at once. The derivation of locational marginal prices in electricity markets is exactly this case: the demand $D_n$ at node $n$ is a parameter that enters the system balance constraint, the transmission flow constraints, and the loss term simultaneously. The version below handles all such cases uniformly.

**Setup.** Consider a parametric family of optimization problems

$$
\begin{aligned}
V(a)=\min_{x\in\R^n}\quad & f(x,a)\\
\st\quad & g_j(x,a)\le0, && j=1,\ldots,r,\\
& h_i(x,a)=0, && i=1,\ldots,s,
\end{aligned}
$$
{#parametric-problem}

where $a\in\R^p$ is a vector of parameters, and $f,g_j,h_i$ are continuously differentiable functions of $(x,a)$. Define the parametric Lagrangian

$$
L(x;\mu,\lambda;a):=f(x,a)+\sum_i\mu_i h_i(x,a)+\sum_j\lambda_j g_j(x,a).
$$

:::theorem{#general-envelope title="General Parametric Envelope Theorem"}
Let $a_0\in\R^p$. Suppose problem [[#parametric-problem]] has a local minimizer $x^\star(a)$, with KKT multipliers $(\mu^\star(a),\lambda^\star(a))$ satisfying the KKT conditions at each $a$, and suppose $x^\star$, $\mu^\star$, and $\lambda^\star$ are continuously differentiable in $a$ in a neighborhood of $a_0$, with strict complementary slackness at $a_0$. Then $V$ is continuously differentiable at $a_0$, and

$$
\frac{\partial V}{\partial a_k}(a_0)
=
\left.\frac{\partial L}{\partial a_k}\right|_{(x^\star(a_0);\mu^\star(a_0),\lambda^\star(a_0);a_0)}
$$

for each component $a_k$ of $a$. The right-hand side is the *total direct partial*: differentiate $L$ with respect to $a_k$ holding $x,\mu,\lambda$ fixed, picking up every place $a_k$ appears explicitly in $L$.
:::

:::proof
The proof is the same term-by-term chain-rule argument as [[#envelope-smooth]]. At the optimum, primal feasibility gives $h_i(x^\star(a),a)=0$ for all $a$ nearby, and complementary slackness gives $\lambda_j^\star(a)g_j(x^\star(a),a)=0$. Therefore

$$
L(x^\star(a);\mu^\star(a),\lambda^\star(a);a)=f(x^\star(a),a)=V(a)
$$

in a neighborhood of $a_0$. Differentiating this identity in $a_k$ by the total chain rule gives

$$
\frac{\partial V}{\partial a_k}
=
\underbrace{\sum_\ell\frac{\partial L}{\partial x_\ell}\frac{\partial x_\ell^\star}{\partial a_k}}_{(A)}
+
\underbrace{\sum_i\frac{\partial L}{\partial\mu_i}\frac{\partial\mu_i^\star}{\partial a_k}}_{(B)}
+
\underbrace{\sum_j\frac{\partial L}{\partial\lambda_j}\frac{\partial\lambda_j^\star}{\partial a_k}}_{(C)}
+
\underbrace{\frac{\partial L}{\partial a_k}}_{(D)}.
$$

Term $(A)$ vanishes by KKT stationarity in $x$: $\nabla_xL=0$ at the optimum. Term $(B)$ vanishes because $\partial L/\partial\mu_i=h_i(x,a)=0$ at any primal-feasible $x^\star(a)$. Term $(C)$ vanishes by the active/inactive split from the proof of [[#envelope-smooth]]: for active $j$, $\partial L/\partial\lambda_j=g_j(x^\star(a),a)=0$ nearby by strict complementarity; for inactive $j$, $\lambda_j^\star(a)=0$ nearby, so $\partial\lambda_j^\star/\partial a_k=0$. Only $(D)$ survives.
:::

**Interpretation in words.** The general envelope theorem says: to find how the optimal value changes with a parameter, differentiate the Lagrangian with respect to that parameter, treating the primal and dual variables as fixed at their optimal values. Every term in the Lagrangian that explicitly contains $a_k$ contributes; terms that do not contain $a_k$ contribute nothing. This is the *total direct partial* — "direct" because we do not chase $a_k$'s indirect effect on $x^\star,\mu^\star,\lambda^\star$, and "total" because we sum over every explicit appearance of $a_k$ in $L$.

**Recovering [[#envelope-smooth]] as a special case.** When $a=(u,v)$ perturbs only constraint right-hand sides, $g_j(x)-u_j$ depends on $u_j$ only in the $-u_j$ term, so $\partial L/\partial u_j=-\lambda_j$. Similarly, $\partial L/\partial v_i=-\mu_i$. One appearance of $u_j$ per constraint gives one multiplier per constraint's shadow price. The verbal form "the multiplier is the shadow price of its constraint's RHS" is exactly this special case.

**What changes when $a_k$ appears in multiple constraints.** If $a_k$ appears in several constraints — say it shifts the right-hand side of constraint $j_1$ and appears in the body of constraint $j_2$ — each appearance contributes to $\partial L/\partial a_k$ through its corresponding multiplier. The effect on $V$ is a *sum* of contributions, not a single shadow price. This is what happens in the PTDF formulation of the electricity dispatch LP: the parameter $D_n$ appears in the system balance constraint, in the loss term, and in every transmission flow constraint that uses the net injection

$$
I_n=\sum_{i\in\mathcal G_n}P_i-D_n.
$$

Summing the contributions gives the three-component LMP decomposition. The per-node formulation instead places $D_n$ in exactly one constraint (node $n$'s balance), recovering the single-shadow-price form $\mathrm{LMP}_n=\lambda_n$. Both routes are valid applications of [[#general-envelope]]; they give the same $\partial V/\partial D_n$ because the two formulations are equivalent reparameterizations of the same problem.

**What does not contribute.** Constraints in which $a_k$ does not appear contribute zero to $\partial V/\partial a_k$, regardless of whether those constraints are binding and regardless of the magnitude of their multipliers. A ramp constraint

$$
|P_i(t)-P_i(t-1)|\le \Delta P_i^{\max}
$$

with a large binding multiplier $\rho$ does not appear directly in $\partial V/\partial D_n$ if $D_n$ does not appear in the ramp constraint. The ramp constraint can still affect $V$ *indirectly* — it changes the global KKT solution, which changes the values of $\lambda_n^\star$ and other multipliers — but this indirect effect is captured through the already-optimized multiplier values, not through a new additive term in the envelope formula.

### Shadow prices: the general principle

The envelope theorem elevates KKT multipliers from algebraic coefficients to genuine prices: the marginal cost of tightening a constraint. The interpretation

$$
\frac{\partial V}{\partial u_j}=-\lambda_j^\star
$$

means that a unit loosening of the $j$-th inequality constraint reduces the optimal cost by $\lambda_j^\star$. This is the shadow-price interpretation.

The principle applies everywhere KKT multipliers are computed. In production planning, the multiplier on a resource constraint is the marginal value of one additional unit of that resource. In portfolio optimization with a risk constraint, the multiplier on the risk budget is the marginal return forgone by the risk limit. In consumer utility maximization with a budget constraint, the multiplier is the marginal utility of wealth (Lagrange's original 1788 application). The shadow-price interpretation is a consequence of [[#envelope-smooth]], not a separate modeling postulate.

The most consequential modern application is in electricity markets: locational marginal prices (LMPs) are the shadow prices of the nodal power balance constraints in the ISO dispatch optimization. The companion entry *The Mathematics of Electricity Pricing* (forthcoming) develops this application from scratch, including the transmission network model, the two-step clearing procedure, and the rigorous derivation of the LMP decomposition.

## Synopsis

The chain of reasoning, distilled:

1. At a local minimum $x^\star$, the directional derivative of $f$ in any feasible direction is nonnegative. Formalizing "feasible direction" gives $-\nabla f(x^\star)\in T_\Omega(x^\star)^\circ$. This is the one real geometric fact. See [[#geometric-fonc]].

2. The abstract tangent cone $T_\Omega(x^\star)$ is not directly computable from the constraint functions. Under a constraint qualification such as LICQ, it equals the linearized feasible cone $F(x^\star)$, which is defined explicitly from the gradients $\nabla h_i(x^\star)$ and $\nabla g_j(x^\star)$. The equality $T_\Omega=F$ is proved via the implicit function theorem. See [[#licq-equality-cones]].

3. The polar of the polyhedral cone $F(x^\star)$ is computed by Farkas' lemma: it is the set of linear combinations $\sum_i \mu_i \nabla h_i(x^\star)+\sum_j \lambda_j \nabla g_j(x^\star)$ with $\lambda_j\ge 0$, summed over active inequality constraints. See [[#polar-of-linearized-cone]].

4. Combining: at a KKT point, $-\nabla f(x^\star)$ is expressible as a nonnegative combination of the active constraint gradients, with real coefficients on equality constraints. Extending to all $j$ by setting $\lambda_j^\star=0$ on inactive constraints yields complementary slackness for free. See [[#kkt-necessary]], restated self-contained as [[#kkt-self-contained]].

5. The equation $-\nabla f(x^\star)=\sum_i \mu_i^\star\nabla h_i(x^\star)+\sum_j \lambda_j^\star\nabla g_j(x^\star)$ is rewritten compactly as $\nabla_x L(x^\star;\mu^\star,\lambda^\star)=0$, where $L$ is the Lagrangian. The Lagrangian is a notational convenience, not a primitive.

6. Under convexity plus Slater's condition, stationarity of $L$ becomes global minimality of $L$, KKT becomes sufficient as well as necessary, and the primal and dual values coincide. See [[#strong-duality-slater]].

7. The KKT multipliers admit an economic interpretation via the envelope theorem: for right-hand-side perturbations, $\lambda_j^\star=-\partial V/\partial u_j$ and $\mu_i^\star=-\partial V/\partial v_i$, and more generally $\partial V/\partial a_k=\partial L/\partial a_k$ at the optimum for any parameter $a_k$ that appears anywhere in the problem. The proof uses KKT stationarity once; the other terms vanish by primal feasibility and complementary slackness. See [[#envelope-smooth]] and [[#general-envelope]].

The three-stage chain — geometry $\to$ linearization $\to$ Farkas — is due to the Bouligand–Kuhn–Tucker line of development. Classical references organized around the Lagrangian (Bertsekas, Nocedal–Wright) prove the same theorem by the same argument, but present it in reverse, starting with the Lagrangian as a given.
