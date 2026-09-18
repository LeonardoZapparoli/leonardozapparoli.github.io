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

## Step 1: Local Minimality Forces a First Order Condition

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

**Example 1: a convex polyhedron.** In the simplest case $\Omega$ is a convex polyhedron and the tangent cone at any point is the closed conic hull of directions from $x$ into $\Omega$. At an interior point, every direction is tangent: $T_\Omega(x)=\R^n$. At a boundary point on a single face, the tangent cone is a half-space. At a vertex where two faces meet, it is a wedge-shaped cone.

<figure class="fig">
  <img src="/figures/optimization/tangent-cone-polyhedron.svg" alt="Tangent cones of a convex polyhedron at an interior point, an edge point, and a vertex">
</figure>

**Example 2: a nonconvex set with a cusp.** Consider the set

$$
\Omega=\{(x,y)\in\R^2:y\ge0,\ y\le(1-x)^3,\ x\ge0\},
$$

which has a cusp at the point $x^\star=(1,0)$. Locally near $x^\star$, the set is a thin wedge that pinches shut as $x\to1$. The tangent cone captures the only infinitesimal feasible direction: leftward along the $x$-axis.

<figure class="fig">
  <img src="/figures/optimization/tangent-cone-cusp.svg" alt="A cusped feasible set whose tangent cone at the cusp is a single leftward half-line">
</figure>

**Example 3: isolated points on a parabola.** Consider

$$
\Omega=\{0\}\cup\{(1/k,1/k^2):k=1,2,3,\ldots\},
$$

the origin together with a sequence of isolated points that accumulate at $0$ along the parabola $y=x^2$. The points do not lie on any line through the origin.

Take $x_k=(1/k,1/k^2)$ and $t_k=1/k$. Then

$$
\frac{x_k-0}{t_k}=(1,1/k)\longrightarrow(1,0),
$$

so $(1,0)\in T_\Omega(0)$. No smooth feasible curve connects the origin to these isolated points (they are isolated), so a tangent-cone definition based on "derivatives of smooth feasible paths" would give the trivial cone $\{0\}$ and miss the direction $(1,0)$. The Bouligand definition, working with sequences instead of curves, correctly captures first-order approach directions even through sets that are not path-connected. 

<figure class="fig">
  <img src="/figures/optimization/tangent-cone-parabola.svg" alt="Isolated points on a parabola accumulating at the origin; the tangent cone there contains the horizontal direction">
</figure>

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

## Step 2: The Linearized Feasible Cone and Constraint Qualifications

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

locally near $x^\star$ as a smooth manifold of dimension $n-s-|A|$. The tangent space to this manifold at $x^\star$ is

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
Weaker constraint qualifications relax LICQ in various ways, each requiring a different but related argument to establish $F\subseteq T_\Omega$. 

For linear constraints, the equality holds unconditionally: the linearized feasible cone is the tangent cone because straight-line motion stays feasible. This is why the polyhedral case needs no constraint qualification at all.
:::

## Step 3: From Polar Cones to Linear Combinations

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

By Farkas' lemma, the polar of such a cone is exactly $\cone\{v_k\}$. Substituting the $v_k$'s: the two signed copies $\pm\nabla h_i(x^\star)$, each with nonnegative coefficients, combine to give arbitrary real multiples of $\nabla h_i(x^\star)$; the active inequality gradients $\nabla g_j(x^\star)$ contribute only nonnegative multiples. This is the stated expression.
:::

### KKT Conditions

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

## The Lagrangian

:::definition{#lagrangian title="Lagrangian Function"}
The **Lagrangian** of [[#main-problem]] is the function

$$
L:\R^n\times\R^s\times\R^r_{\ge 0}\to\R,
\qquad
L(x;\mu,\lambda):=f(x)+\sum_{i=1}^s \mu_i h_i(x)+\sum_{j=1}^r \lambda_j g_j(x).
$$
:::

Since $L$ is linear in the multipliers, its partial derivatives are

$$
\nabla_x L(x;\mu,\lambda)
=\nabla f(x)+\sum_{i=1}^s \mu_i\nabla h_i(x)+\sum_{j=1}^r \lambda_j\nabla g_j(x),
\qquad
\frac{\partial L}{\partial\mu_i}=h_i(x),
\qquad
\frac{\partial L}{\partial\lambda_j}=g_j(x);
$$

differentiating in a multiplier picks off the constraint function it multiplies. Consequently, every condition in [[#kkt-necessary]] is a statement about a partial derivative of $L$: stationarity is $\nabla_xL=0$, primal feasibility is $\partial L/\partial\mu_i=0$ and $\partial L/\partial\lambda_j\le 0$, and complementary slackness pairs each $\lambda_j$ with its own $L$-derivative. 

This leads to an equivalent way to formulate the KKT necessary conditions, in terms of the Lagrangian.

### Lagrangian Form of KKT

:::theorem{#kkt-self-contained title="KKT Necessary Conditions, Lagrangian Form"}
Consider the problem

$$
\min_{x\in\R^n} f(x)
\quad\text{subject to}\quad
h_i(x)=0\ (i=1,\ldots,s),
\qquad
g_j(x)\le 0\ (j=1,\ldots,r),
$$

with $f,h_i,g_j:\R^n\to\R$ continuously differentiable, and let

$$
L(x;\mu,\lambda):=f(x)+\sum_{i=1}^s\mu_i h_i(x)+\sum_{j=1}^r\lambda_jg_j(x)
$$

be its Lagrangian. Let $x^\star$ be a local minimizer at which LICQ holds. Then there exist multipliers $\mu^\star\in\R^s$ and $\lambda^\star\in\R^r$ such that, at $(x^\star,\mu^\star,\lambda^\star)$,

$$
\begin{aligned}
\nabla_x L(x^\star;\mu^\star,\lambda^\star)&=0
&&\text{(primal stationarity)},\\
\frac{\partial L}{\partial\mu_i}(x^\star;\mu^\star,\lambda^\star)&=0\quad\forall i
&&\text{(equality primal feasibility)},\\
\frac{\partial L}{\partial\lambda_j}(x^\star;\mu^\star,\lambda^\star)&\le 0\quad\forall j
&&\text{(inequality primal feasibility)},\\
\lambda_j^\star\,\frac{\partial L}{\partial\lambda_j}(x^\star;\mu^\star,\lambda^\star)&=0\quad\forall j
&&\text{(complementary slackness)},\\
\lambda_j^\star&\ge 0\quad\forall j
&&\text{(dual feasibility)}.
\end{aligned}
$$
{#lagrangian-kkt-system}
:::

:::proof
We prove the system [[#lagrangian-kkt-system]] is equivalent to the KKT necessary conditions in [[#kkt-necessary]].

$L$ is linear in $(\mu,\lambda)$ with coefficients $h_i(x)$ and $g_j(x)$, so

$$
\nabla_x L=\nabla f(x)+\sum_i\mu_i\nabla h_i(x)+\sum_j\lambda_j\nabla g_j(x),
\qquad
\frac{\partial L}{\partial\mu_i}=h_i(x),
\qquad
\frac{\partial L}{\partial\lambda_j}=g_j(x).
$$

Substituting these identities into [[#lagrangian-kkt-system]] line by line: primal stationarity becomes the gradient equation; equality primal feasibility becomes $h_i(x^\star)=0$; inequality primal feasibility becomes $g_j(x^\star)\le 0$; complementary slackness becomes $\lambda_j^\star g_j(x^\star)=0$; dual feasibility is unchanged. Each substitution is an identity of functions, so the two systems have the same solution set.
:::

:::remark
- The above theorem  says multipliers *exist* at a local minimizer. It does not say they are unique. Under LICQ they are in fact unique, but there are weaker constraint qualifications that only guarantee existence.
- It says $x^\star$ is a *stationary point* of $x\mapsto L(x;\mu^\star,\lambda^\star)$. It does not say $x^\star$ minimizes this function over $\R^n$; in a nonconvex problem, $x^\star$ is typically a saddle point of the Lagrangian. The identification "$x^\star$ minimizes the Lagrangian" is a stronger statement requiring convexity.
- It says nothing about *sufficiency*: the KKT conditions can hold at points that are not local minima, for example at saddle points or local maxima. Sufficiency requires convexity, or second-order conditions.
- "LICQ" can be replaced by "all constraints affine," as in a linear program, or by Slater's condition in the convex case. Different constraint qualifications suit different problem structures.
:::

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

:::proof
Ommitted; see [*Convex Optimization*](https://web.stanford.edu/~boyd/cvxbook/) by Boyd & Vandenberghe.
:::

In summary, convexity buys:

1. **Sufficiency.** In a convex program, the KKT conditions are not only necessary but also sufficient for global optimality.
2. **Global minimization of $L$.** The primal optimum $x^\star$ globally minimizes $L(\cdot;\mu^\star,\lambda^\star)$ over $\R^n$.
3. **Strong duality.** The primal and dual optima coincide.
4. **Global rather than local.** "Local minimum" in KKT becomes "global minimum" automatically.

None of these hold automatically in the nonconvex case, even though KKT necessity ([[#kkt-necessary]]) continues to apply.

## Sensitivity and the Envelope Theorem: Multipliers as Shadow Prices

We have derived the KKT multipliers $\mu^\star,\lambda^\star$ as coefficients in the linear combination that expresses $-\nabla f(x^\star)$ in terms of constraint gradients. This is an algebraic characterization. There is also an economic characterization, equally fundamental: the multipliers measure the *sensitivity of the optimal value to perturbations of the problem*. This is the envelope theorem, and it is what justifies calling multipliers **shadow prices**.

### The parametric problem and the value function

Consider a parametric family of optimization problems

$$
\begin{aligned}
\min_{x\in\R^n}\quad & f(x,a)\\
\st\quad & g_j(x,a)\le0, && j=1,\ldots,r,\\
& h_i(x,a)=0, && i=1,\ldots,s,
\end{aligned}
$$
{#parametric-problem}

where $a\in\R^p$ is a vector of parameters and $f,g_j,h_i$ are continuously differentiable in $(x,a)$. The parameter may enter the problem anywhere, such as in the objective, in any subset of constraints, possibly in several at once. In the derivation of locational marginal prices in electricity markets, for example, the demand $D_n$ at network node $n$ enters the system balance constraint, the transmission flow constraints, and the loss term simultaneously. 

Define the **value function**

$$
V(a):=\inf\{f(x,a):g_j(x,a)\le0\ \forall j,\ h_i(x,a)=0\ \forall i\},
$$

with the convention $V(a):=+\infty$ if the feasible set is empty; the domain of interest is a neighborhood of a base point $a_0$ where the problem is well posed.

Define also the parametric Lagrangian

$$
L(x;\mu,\lambda;a):=f(x,a)+\sum_i\mu_i h_i(x,a)+\sum_j\lambda_j g_j(x,a).
$$

The classical special case, from which the term "shadow price" originates, perturbs only the constraint right-hand sides. It is derived in [[#shadow-prices]].

### The envelope theorem

The proof is a term-by-term analysis of the chain rule applied to the identity $V(a)=L(x^\star(a);\mu^\star(a),\lambda^\star(a);a)$. This approach makes transparent why each chain-rule term vanishes or survives, and each vanishing corresponds to one of the KKT conditions: stationarity in $x$, primal feasibility, and complementary slackness.

:::theorem{#general-envelope title="Envelope Theorem"}
Let $a_0\in\R^p$. Suppose that for every $a$ in a neighborhood of $a_0$, problem [[#parametric-problem]] attains its value $V(a)$ at a minimizer $x^\star(a)$ admitting KKT multipliers $(\mu^\star(a),\lambda^\star(a))$; that the maps $a\mapsto x^\star(a),\mu^\star(a),\lambda^\star(a)$ are continuously differentiable near $a_0$; and that strict complementary slackness holds at $a_0$: $\lambda_j^\star(a_0)>0$ for every $j$ with $g_j(x^\star(a_0),a_0)=0$. Then $V$ is continuously differentiable at $a_0$, and for each component $a_k$ of $a$,

$$
\frac{\partial V}{\partial a_k}(a_0)
=
\left.\frac{\partial L}{\partial a_k}\right|_{(x^\star(a_0);\,\mu^\star(a_0),\,\lambda^\star(a_0);\,a_0)}.
$$

The right-hand side is the *total direct partial*: differentiate $L$ with respect to $a_k$ holding $x,\mu,\lambda$ fixed, picking up every place $a_k$ appears explicitly in $L$.
:::

:::proof
At the optimum, primal feasibility gives $h_i(x^\star(a),a)=0$, and complementary slackness gives $\lambda_j^\star(a)\,g_j(x^\star(a),a)=0$. Therefore

$$
L(x^\star(a);\mu^\star(a),\lambda^\star(a);a)=f(x^\star(a),a)+0+0=V(a)
$$

for all $a$ in a neighborhood of $a_0$. Differentiating this identity in $a_k$ by the total chain rule, accounting for every way $a_k$ enters,

$$
\frac{\partial V}{\partial a_k}
=
\underbrace{\sum_\ell\frac{\partial L}{\partial x_\ell}\frac{\partial x_\ell^\star}{\partial a_k}}_{(A)}
+
\underbrace{\sum_i\frac{\partial L}{\partial\mu_i}\frac{\partial\mu_i^\star}{\partial a_k}}_{(B)}
+
\underbrace{\sum_j\frac{\partial L}{\partial\lambda_j}\frac{\partial\lambda_j^\star}{\partial a_k}}_{(C)}
+
\underbrace{\frac{\partial L}{\partial a_k}}_{(D)},
$$
{#chain-rule-envelope}

where all partial derivatives of $L$ are evaluated at $(x^\star(a);\mu^\star(a),\lambda^\star(a);a)$. We show that $(A)$, $(B)$, and $(C)$ vanish, and $(D)$ is the claimed formula.

**Why $(A)$ vanishes: KKT stationarity in $x$.** KKT gives $\nabla_xL(x^\star;\mu^\star,\lambda^\star;a)=0$, so

$$
(A)=\left\langle\nabla_xL,\frac{\partial x^\star}{\partial a_k}\right\rangle
=\left\langle0,\frac{\partial x^\star}{\partial a_k}\right\rangle=0.
$$

This is the only term whose vanishing uses a nontrivial theorem. The point $x^\star$ is chosen to make the $x$-gradient of $L$ zero, so a first-order perturbation of $x^\star$ produces no first-order change in $L$.

**Why $(B)$ vanishes: primal feasibility.** $L$ is linear in $\mu$, so differentiating in $\mu_i$ picks off its coefficient:

$$
\frac{\partial L}{\partial\mu_i}(x;\mu,\lambda;a)=h_i(x,a),
$$

a function of $(x,a)$ alone. Evaluated at the optimum, $x^\star(a)$ is primal feasible, so $h_i(x^\star(a),a)=0$. Every term of $(B)$ is therefore $0\cdot(\partial\mu_i^\star/\partial a_k)=0$, regardless of the multiplier derivative.

**Why $(C)$ vanishes: complementary slackness plus strict complementarity.** Similarly,

$$
\frac{\partial L}{\partial\lambda_j}(x;\mu,\lambda;a)=g_j(x,a),
$$

which at the optimum is $\le0$ by primal feasibility — but not necessarily zero. Split the index set by activity at $a_0$.

For active $j$ (those with $g_j(x^\star(a_0),a_0)=0$), strict complementary slackness gives $\lambda_j^\star(a_0)>0$. By continuity of $\lambda_j^\star(\cdot)$, $\lambda_j^\star(a)>0$ for $a$ near $a_0$, and complementary slackness then forces $g_j(x^\star(a),a)=0$ identically nearby. The coefficient $\partial L/\partial\lambda_j$ is identically zero in a neighborhood, and the $j$-th term of $(C)$ vanishes.

For inactive $j$ (those with $g_j(x^\star(a_0),a_0)<0$), complementary slackness gives $\lambda_j^\star(a_0)=0$. If $\lambda_j^\star$ became strictly positive somewhere nearby, complementary slackness at that point would force $g_j(x^\star(a),a)=0$, contradicting $g_j<0$ by continuity. Hence $\lambda_j^\star(a)=0$ identically near $a_0$, so $\partial\lambda_j^\star/\partial a_k=0$, and the $j$-th term of $(C)$ vanishes.

So $(C)$ vanishes term by term, via two different mechanisms: for active $j$, the coefficient $\partial L/\partial\lambda_j$ is identically zero; for inactive $j$, the multiplier derivative is identically zero. Strict complementary slackness ensures the active/inactive classification is stable under small perturbations of $a$; without it, a constraint could flip between active and inactive as $a$ varies, breaking the classification.
:::

:::remark{#fiacco title="Regularity Hypotheses"}
The theorem assumes continuously differentiable dependence of $x^\star$ and the multipliers on $a$. This differentiability can be established under LICQ, strict complementary slackness, and a second-order sufficient condition, via the implicit function theorem applied to the KKT system. Weaker forms of the envelope theorem hold when these conditions are relaxed, but the equality above requires the smoothness assumed here. For linear programming (the setting of the electrical generator dispatch problem) a simpler sensitivity theory applies.
:::

**Interpretation in words.** To find how the optimal value changes with a parameter, differentiate the Lagrangian with respect to that parameter, treating the primal and dual variables as fixed at their optimal values. Every term of $L$ that explicitly contains $a_k$ contributes; terms that do not contain $a_k$ contribute nothing. This is the *total direct partial*: "direct" because we do not chase $a_k$'s indirect effect on $x^\star,\mu^\star,\lambda^\star$, and "total" because we sum over every explicit appearance of $a_k$ in $L$.

### Right-hand-side perturbations: shadow prices

:::corollary{#shadow-prices title="Shadow Prices"}
Specialize [[#parametric-problem]] to right-hand-side perturbations of [[#main-problem]]: with $a=(u,v)\in\R^r\times\R^s$,

$$
\begin{aligned}
V(u,v)=\min_{x\in\R^n}\quad & f(x)\\
\st\quad & g_j(x)\le u_j, && j=1,\ldots,r,\\
& h_i(x)=v_i, && i=1,\ldots,s.
\end{aligned}
$$

Under the hypotheses of [[#general-envelope]] at $(u,v)=(0,0)$,

$$
\frac{\partial V}{\partial u_j}(0,0)=-\lambda_j^\star,
\qquad
\frac{\partial V}{\partial v_i}(0,0)=-\mu_i^\star.
$$
:::

:::proof
The parametric Lagrangian is $L=f(x)+\sum_i\mu_i(h_i(x)-v_i)+\sum_j\lambda_j(g_j(x)-u_j)$. The parameter $u_j$ appears exactly once, in the term $-\lambda_ju_j$, so $\partial L/\partial u_j=-\lambda_j$; similarly $\partial L/\partial v_i=-\mu_i$. Apply [[#general-envelope]].
:::

A unit loosening of the $j$-th inequality constraint reduces the optimal cost by $\lambda_j^\star$: that is the shadow price.

**What does not contribute.** Constraints in which $a_k$ does not appear contribute zero to $\partial V/\partial a_k$, regardless of whether those constraints are binding and regardless of the magnitude of their multipliers.

### Shadow prices: the general principle

The envelope theorem elevates KKT multipliers from algebraic coefficients to economic prices: the marginal cost of tightening a constraint. The principle applies everywhere KKT multipliers are computed. In production planning, the multiplier on a resource constraint is the marginal value of one additional unit of that resource. In portfolio optimization with a risk constraint, the multiplier on the risk budget is the marginal return forgone by the risk limit. In electrical dispatch, the multiplier on a node $v$'s power balance constraint (that the sum of all generation at that node, less demand at that node, must equal power flowing out of the node) is the marginal cost of meeting an extra unit of demand at $v$, and it *sets* the price of electricity at $v$.

## Summary

1. At a local minimum $x^\star$, the directional derivative of $f$ in any feasible direction is nonnegative. Formalizing "feasible direction" gives $-\nabla f(x^\star)\in T_\Omega(x^\star)^\circ$. This is the one real geometric fact. See [[#geometric-fonc]].

2. The abstract tangent cone $T_\Omega(x^\star)$ is not directly computable from the constraint functions. Under a constraint qualification such as LICQ, it equals the linearized feasible cone $F(x^\star)$, which is defined explicitly from the gradients $\nabla h_i(x^\star)$ and $\nabla g_j(x^\star)$. The equality $T_\Omega=F$ is proved via the implicit function theorem. See [[#licq-equality-cones]].

3. The polar of the polyhedral cone $F(x^\star)$ is computed by Farkas' lemma: it is the set of linear combinations $\sum_i \mu_i \nabla h_i(x^\star)+\sum_j \lambda_j \nabla g_j(x^\star)$ with $\lambda_j\ge 0$, summed over active inequality constraints. See [[#polar-of-linearized-cone]].

4. Combining: at a KKT point, $-\nabla f(x^\star)$ is expressible as a nonnegative combination of the active constraint gradients, with real coefficients on equality constraints. Extending to all $j$ by setting $\lambda_j^\star=0$ on inactive constraints yields complementary slackness. See [[#kkt-necessary]] and [[#kkt-self-contained]].

5. The equation $-\nabla f(x^\star)=\sum_i \mu_i^\star\nabla h_i(x^\star)+\sum_j \lambda_j^\star\nabla g_j(x^\star)$ is rewritten compactly as $\nabla_x L(x^\star;\mu^\star,\lambda^\star)=0$, where $L$ is the Lagrangian.

6. Under convexity plus Slater's condition, stationarity of $L$ becomes global minimality of $L$, KKT becomes sufficient as well as necessary, and the primal and dual values coincide. See [[#strong-duality-slater]].

7. The KKT multipliers admit an economic interpretation via the envelope theorem: for right-hand-side perturbations, $\lambda_j^\star=-\partial V/\partial u_j$ and $\mu_i^\star=-\partial V/\partial v_i$, and more generally $\partial V/\partial a_k=\partial L/\partial a_k$ at the optimum for any parameter $a_k$ that appears anywhere in the problem. The proof uses KKT stationarity once; the other terms vanish by primal feasibility and complementary slackness. See [[#general-envelope]].
