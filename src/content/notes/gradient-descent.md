---
title: "Gradient Descent"
code: GD
description: "Why gradient descent is slow on ill-conditioned functions, stated through the eigenvalues of the Hessian, and how preconditioning, Newton's method, and the adaptive stochastic methods respond."
date: 2026-11-12
---

**Reference(s):** [*Probabilistic Machine Learning: An Introduction*](https://probml.github.io/pml-book/book1.html) by Kevin Murphy (Chapter 8); [*Convex Optimization*](https://web.stanford.edu/~boyd/cvxbook/) by Boyd and Vandenberghe (Chapter 9); [lecture notes on adaptive regularization](https://www.cs.princeton.edu/courses/archive/fall18/cos597G/lecnotes/lecture5.pdf) by Sanjeev Arora.

This entry studies the gradient descent iteration for minimizing a smooth function, and the methods derived from it. Part I treats the deterministic iteration. Its behaviour is governed by the Hessian: the quadratic form of the Hessian gives the curvature of the function in each direction, a single gradient step multiplies each component of the gradient by a factor determined by one such curvature, and the ratio of the largest curvature to the smallest determines the number of steps. Preconditioning, of which Newton's method is the extreme case, is a change of coordinates that brings this ratio toward one. Part II treats the stochastic iteration and the adaptive methods built on it (AdaGrad, RMSProp, Adam), which are diagonal preconditioners constructed from past gradients.

The results are stated for general twice continuously differentiable functions. Functions with constant Hessian appear only as the special case in which the general statements simplify, and as the examples showing that the general bounds cannot be improved. The entry uses the spectral theorem and related facts about symmetric matrices from [[LinAlg]]. Unconstrained problems only are considered; constrained problems are the subject of [[Opt]].

# Part I: Deterministic Gradient Descent

## Setup

Throughout, $f : \R^n \to \R$ is twice continuously differentiable. Its gradient at $\theta$ is $\nabla f(\theta) \in \R^n$ and its Hessian is the matrix $H(\theta) = \nabla^2 f(\theta)$ with entries $H(\theta)_{jk} = \partial_j \partial_k f(\theta)$. Because the second partial derivatives are continuous, they commute, so $H(\theta)$ is symmetric. The Euclidean inner product is $\ip{x}{y} = x^T y$ and the Euclidean norm is $\nm{x}$.

:::definition{#gradient-descent title="Gradient Descent"}
Let $f : \R^n \to \R$ be differentiable, let $\theta_0 \in \R^n$, and let $\eta > 0$. **Gradient descent** with **step size** $\eta$ is the iteration

$$
\theta_{t+1} = \theta_t - \eta\, \nabla f(\theta_t), \qquad t = 0, 1, 2, \ldots
$$
{#gd-iteration}

We write $g_t = \nabla f(\theta_t)$ for the gradient at the $t$-th iterate.
:::

Two questions organize Part I. What limits the step size $\eta$? And, once $\eta$ is chosen, how many steps are needed? Both answers are expressed through the eigenvalues of the Hessian. The largest eigenvalue limits the step size, and the ratio of the largest eigenvalue to the smallest determines the number of steps.

## Curvature and the Hessian

### Slope and curvature along a line

To study $f$ near a point $\theta$, restrict it to a line through $\theta$. The restriction is a function of one variable, and its first and second derivatives are computed from the gradient and the Hessian.

:::proposition{#line-restriction title="Derivatives Along a Line"}
Let $f : \R^n \to \R$ be twice continuously differentiable, let $\theta, h \in \R^n$, and define $\varphi(s) = f(\theta + s h)$ for $s \in \R$. Then

$$
\varphi'(s) = \ip{\nabla f(\theta + sh)}{h}, \qquad \varphi''(s) = h^T H(\theta + sh)\, h .
$$
:::

:::proof
By the chain rule, $\varphi'(s) = \sum_j \partial_j f(\theta + sh)\, h_j$, which is the first formula. Applying the chain rule to each term, $\varphi''(s) = \sum_j \sum_k \partial_k \partial_j f(\theta + sh)\, h_k h_j = h^T H(\theta + sh)\, h$.
:::

:::definition{#slope-curvature title="Slope and Curvature in a Direction"}
Let $f : \R^n \to \R$ be twice continuously differentiable, let $\theta \in \R^n$, and let $u \in \R^n$ be a unit vector. With $\varphi(s) = f(\theta + su)$, the **slope** of $f$ at $\theta$ in the direction $u$ is $\varphi'(0) = \ip{\nabla f(\theta)}{u}$, and the **curvature** of $f$ at $\theta$ in the direction $u$ is $\varphi''(0) = u^T H(\theta)\, u$.
:::

The slope is the rate at which $f$ changes as one moves from $\theta$ in the direction $u$. The curvature is the rate at which that slope itself changes. By [[#line-restriction]], the Hessian is the object that returns the curvature in every direction: the curvature in the direction $u$ is the value of the quadratic form $u \mapsto u^T H(\theta) u$.

### Extreme curvatures are eigenvalues

The quadratic form of a symmetric matrix is controlled by its eigenvalues. The following facts are used repeatedly. They are short consequences of the spectral theorem, and the proofs are included to keep the entry self-contained.

:::proposition{#symmetric-facts title="Quadratic Forms of Symmetric Matrices"}
Let $S \in \R^{n \times n}$ be symmetric, with orthonormal eigenvectors $e_1, \ldots, e_n$ and eigenvalues $\lambda_1 \geq \cdots \geq \lambda_n$, $S e_k = \lambda_k e_k$.

(i) For every $x \in \R^n$, $x^T S x = \sum_k \lambda_k \ip{x}{e_k}^2$. Consequently $\lambda_n \nm{x}^2 \leq x^T S x \leq \lambda_1 \nm{x}^2$, with equality on the left at $x = e_n$ and on the right at $x = e_1$.

(ii) For every $x \in \R^n$, $\nm{Sx} \leq \max_k \abs{\lambda_k}\, \nm{x}$. Moreover $\max_k \abs{\lambda_k} = \max_{\nm{u} = 1} \abs{u^T S u} = \max_{\nm{u}=1} \nm{Su}$.

(iii) If $c \leq u^T S u \leq C$ for every unit vector $u$, then every eigenvalue of $S$ lies in $[c, C]$.
:::

:::proof
An orthonormal eigenbasis exists by the real spectral theorem ([[LinAlg:real-spectral-theorem]]). Write $x = \sum_k c_k e_k$ with $c_k = \ip{x}{e_k}$, so that $\nm{x}^2 = \sum_k c_k^2$ and $Sx = \sum_k \lambda_k c_k e_k$.

(i) By orthonormality, $x^T S x = \ip{x}{Sx} = \sum_k \lambda_k c_k^2$. Since the weights $c_k^2$ are nonnegative and sum to $\nm{x}^2$, the sum lies between $\lambda_n \nm{x}^2$ and $\lambda_1 \nm{x}^2$. At $x = e_k$ it equals $\lambda_k$.

(ii) $\nm{Sx}^2 = \sum_k \lambda_k^2 c_k^2 \leq \max_k \lambda_k^2 \, \nm{x}^2$, with equality when $x$ is an eigenvector for an eigenvalue of largest absolute value. This gives the inequality and the last equality. For the middle expression, (i) gives $\abs{u^T S u} \leq \max_k \abs{\lambda_k}$ for unit $u$, with equality at the same eigenvector.

(iii) Take $u = e_k$ and use $e_k^T S e_k = \lambda_k$.
:::

Applied to $S = H(\theta)$, part (i) says that the curvature of $f$ at $\theta$ in a unit direction $u$ is a weighted average of the eigenvalues of $H(\theta)$, with weights $\ip{u}{e_k}^2$. The largest curvature in any direction is the largest eigenvalue, attained along its eigenvector, and the smallest curvature is the smallest eigenvalue, attained along its eigenvector.

### Curvature bounds and the condition number

:::definition{#curvature-bounds title="Curvature Bounds and Condition Number"}
Let $f : \R^n \to \R$ be twice continuously differentiable with Hessian $H$, and let $m \leq L$ be real numbers. We say that $f$ has **curvature at most $L$** if $u^T H(\theta) u \leq L$ for every $\theta \in \R^n$ and every unit vector $u$, and **curvature at least $m$** if $u^T H(\theta) u \geq m$ for every $\theta$ and every unit $u$. If both hold, $f$ has **curvature bounds** $[m, L]$. When $m > 0$, the ratio

$$
\kappa = \frac{L}{m} \geq 1
$$

is the **condition number** of $f$ with respect to these bounds.
:::

By [[#symmetric-facts]](i) and (iii), $f$ has curvature bounds $[m, L]$ if and only if every eigenvalue of every Hessian $H(\theta)$ lies in $[m, L]$. In the literature an upper bound of this kind is called $L$-smoothness and a positive lower bound is called $m$-strong convexity. A function with curvature at least $0$ is convex.

:::remark{#condition-number-of-function title="Condition Number of a Function and of a Matrix"}
For a symmetric positive definite matrix the singular values are the eigenvalues, so the matrix condition number of a Hessian $H(\theta)$ is $\lambda_{\max}(H(\theta)) / \lambda_{\min}(H(\theta))$: the ratio of the largest curvature to the smallest *at the point* $\theta$. The condition number $\kappa = L/m$ of [[#curvature-bounds]] compares the largest curvature at *any* point with the smallest curvature at *any* point, so it is at least as large as the condition number of each individual Hessian. The two agree when the Hessian is constant.
:::

A function is called **ill conditioned** when $\kappa$ is large: in some direction, somewhere, it curves sharply, and in some direction, somewhere, it is nearly flat.

## The Mean Value Theorem for the Gradient

Gradient descent moves from $\theta_t$ to $\theta_{t+1}$ using the gradient at $\theta_t$. To analyse a step one needs to know how the gradient at $\theta_{t+1}$ differs from the gradient at $\theta_t$. For a function of one variable, the fundamental theorem of calculus expresses the change of a function as the integral of its derivative. The same argument applied to each component of the gradient, along the segment joining the two points, expresses the change of the gradient through the Hessian.

:::theorem{#gradient-mvt title="Mean Value Theorem for the Gradient"}
Let $f : \R^n \to \R$ be twice continuously differentiable with Hessian $H$, and let $\theta, h \in \R^n$. Define the **averaged Hessian** along the segment from $\theta$ to $\theta + h$ by

$$
\bar H = \int_0^1 H(\theta + s h)\, ds ,
$$
{#averaged-hessian}

where the integral is taken entry by entry. Then

$$
\nabla f(\theta + h) - \nabla f(\theta) = \bar H\, h .
$$
{#gradient-change}

:::

:::proof
Fix a coordinate $j$ and define $\psi_j(s) = \partial_j f(\theta + sh)$ for $s \in [0,1]$, the $j$-th component of the gradient along the segment. By the chain rule,

$$
\psi_j'(s) = \sum_k \partial_k \partial_j f(\theta + sh)\, h_k = \big( H(\theta + sh)\, h \big)_j ,
$$

which is continuous in $s$. By the fundamental theorem of calculus,

$$
\partial_j f(\theta + h) - \partial_j f(\theta) = \psi_j(1) - \psi_j(0) = \int_0^1 \big( H(\theta + sh)\, h \big)_j \, ds = \sum_k \Big( \int_0^1 H(\theta + sh)_{jk}\, ds \Big) h_k = (\bar H h)_j ,
$$

where the third equality is linearity of the integral. This holds for every $j$.
:::

In words, the change in the gradient over a displacement $h$ is a matrix applied to $h$, and the matrix is the average of the Hessians met along the way. If the Hessian is constant, the average is that constant matrix. In general the average depends on both endpoints of the segment.

:::proposition{#averaged-hessian-properties title="Properties of the Averaged Hessian"}
Let $f : \R^n \to \R$ be twice continuously differentiable with Hessian $H$, let $\theta, h \in \R^n$, and let $\bar H = \int_0^1 H(\theta + sh)\, ds$.

(i) $\bar H$ is symmetric.

(ii) For every $u \in \R^n$, $u^T \bar H u = \int_0^1 u^T H(\theta + sh)\, u \, ds$.

(iii) If $c \leq u^T H(\theta + sh)\, u \leq C$ for every $s \in [0,1]$ and every unit vector $u$, then every eigenvalue of $\bar H$ lies in $[c, C]$. In particular, if $f$ has curvature bounds $[m, L]$, every eigenvalue of $\bar H$ lies in $[m, L]$.
:::

:::proof
(i) Each $H(\theta + sh)$ is symmetric, and the integral is taken entry by entry. (ii) $u^T \bar H u = \sum_{j,k} u_j u_k \int_0^1 H(\theta+sh)_{jk}\, ds$, and the finite sum passes inside the integral. (iii) By (ii), for unit $u$ the number $u^T \bar H u$ is an average over $s$ of numbers in $[c, C]$, so it lies in $[c, C]$. Since $\bar H$ is symmetric, [[#symmetric-facts]](iii) applies.
:::

The averaged Hessian therefore has curvatures in the same range as the Hessians it averages, and all the facts about symmetric matrices apply to it.

## One Step of Gradient Descent

### The exact one-step identity

:::theorem{#one-step title="One Step of Gradient Descent"}
Let $f : \R^n \to \R$ be twice continuously differentiable, let $\theta_t \in \R^n$, $g_t = \nabla f(\theta_t)$, and $\theta_{t+1} = \theta_t - \eta g_t$ with $\eta > 0$. Let $\bar H_t = \int_0^1 H(\theta_t - s \eta g_t)\, ds$ be the averaged Hessian along the segment from $\theta_t$ to $\theta_{t+1}$. Then

$$
g_{t+1} = (I - \eta \bar H_t)\, g_t .
$$
{#one-step-identity}

:::

:::proof
Apply [[#gradient-mvt]] with $\theta = \theta_t$ and $h = -\eta g_t$. This gives $g_{t+1} - g_t = \bar H_t (-\eta g_t)$.
:::

The identity is exact. No term has been discarded and no assumption on $f$ beyond two continuous derivatives has been made.

There is a companion identity for the distance to a stationary point, obtained by applying the same theorem to the segment from the stationary point to the current iterate.

:::proposition{#error-identity title="One Step in Terms of the Error"}
Let $f : \R^n \to \R$ be twice continuously differentiable and let $\theta^\star$ satisfy $\nabla f(\theta^\star) = 0$. For $\theta_t \in \R^n$ let $\tilde H_t = \int_0^1 H\big(\theta^\star + s(\theta_t - \theta^\star)\big)\, ds$ be the averaged Hessian along the segment from $\theta^\star$ to $\theta_t$. Then $\nabla f(\theta_t) = \tilde H_t (\theta_t - \theta^\star)$, and one step of gradient descent with step size $\eta$ satisfies

$$
\theta_{t+1} - \theta^\star = (I - \eta \tilde H_t)(\theta_t - \theta^\star) .
$$
{#error-step}

:::

:::proof
By [[#gradient-mvt]] with $\theta = \theta^\star$ and $h = \theta_t - \theta^\star$, $\nabla f(\theta_t) - 0 = \tilde H_t (\theta_t - \theta^\star)$. Substituting into $\theta_{t+1} - \theta^\star = (\theta_t - \theta^\star) - \eta \nabla f(\theta_t)$ gives [[#error-step]].
:::

### Decoupling along eigendirections

:::corollary{#decoupling title="Decoupling of a Gradient Step"}
In the setting of [[#one-step]], let $w_1, \ldots, w_n$ be an orthonormal basis of eigenvectors of $\bar H_t$ with eigenvalues $\mu_1, \ldots, \mu_n$. Then for each $i$,

$$
\ip{g_{t+1}}{w_i} = (1 - \eta \mu_i)\, \ip{g_t}{w_i} ,
$$
{#decoupled-step}

and therefore $\nm{g_{t+1}}^2 = \sum_i (1 - \eta \mu_i)^2\, \ip{g_t}{w_i}^2$.
:::

:::proof
$\bar H_t$ is symmetric by [[#averaged-hessian-properties]](i), so the basis exists and $I - \eta \bar H_t$ is symmetric with $(I - \eta \bar H_t) w_i = (1 - \eta\mu_i) w_i$. By [[#one-step-identity]], $\ip{g_{t+1}}{w_i} = \ip{(I - \eta \bar H_t) g_t}{w_i} = \ip{g_t}{(I - \eta \bar H_t) w_i} = (1 - \eta \mu_i) \ip{g_t}{w_i}$. The formula for the norm is the expansion of $g_{t+1}$ in the orthonormal basis.
:::

This is the precise sense in which gradient descent decouples. Measured along the eigenvectors of the averaged Hessian, a step acts on each component of the gradient separately, multiplying the $i$-th component by the scalar $1 - \eta \mu_i$, where $\mu_i$ is the curvature of the averaged Hessian in that direction. The components do not interact within the step.

:::remark{#decoupling-scope title="What Is Fixed and What Changes"}
The decoupling of [[#decoupling]] holds exactly for every step of gradient descent on every twice continuously differentiable function. The eigenvectors $w_i$ and eigenvalues $\mu_i$ belong to $\bar H_t$, which depends on the step, so in general the directions along which the step decouples change from one step to the next. If the Hessian is constant, $H(\theta) = H$ for all $\theta$, then $\bar H_t = H$ for every $t$, the directions are fixed, and [[#decoupled-step]] iterates to $\ip{g_t}{e_k} = (1 - \eta\lambda_k)^t \ip{g_0}{e_k}$ for the eigenpairs $(\lambda_k, e_k)$ of $H$: each component follows its own geometric sequence for the whole run. The same statements hold for the error $\theta_t - \theta^\star$ with $\tilde H_t$ in place of $\bar H_t$, by [[#error-identity]].
:::

### One step size, many curvatures

Two observations explain what [[#decoupling]] means for the choice of $\eta$.

First, a gradient step moves, in every direction, a distance proportional to the slope in that direction, with the same constant of proportionality. For a unit vector $u$,

$$
\ip{\theta_{t+1} - \theta_t}{u} = -\eta\, \ip{\nabla f(\theta_t)}{u} ,
$$

which is $-\eta$ times the slope of $f$ at $\theta_t$ in the direction $u$.

Second, the factor $1 - \eta\mu_i$ in [[#decoupled-step]] vanishes exactly when $\eta = 1/\mu_i$. For $\mu_i > 0$, the $i$-th component of the gradient shrinks in absolute value when $0 < \eta < 2/\mu_i$, changes sign when $\eta > 1/\mu_i$, and grows in absolute value when $\eta > 2/\mu_i$. The step size that suits the direction $w_i$ is the reciprocal of the curvature in that direction.

:::moral{title="One Step Size, Many Curvatures"}
Gradient descent uses one step size for all directions, while each direction calls for the reciprocal of its own curvature. A step size small enough to keep the direction of largest curvature from growing is then far smaller than the directions of small curvature call for, and the components of the gradient in those directions shrink slowly. This mismatch, and nothing else, is the inefficiency of gradient descent. Its size is the ratio of the largest curvature to the smallest.
:::

<figure class="fig">
  <img src="/figures/gradient-descent/gd-conditioning.svg" alt="Gradient descent paths on the contour plots of three quadratic functions: a round bowl, a narrow valley with a step size below the cap, and the same valley with a step size above the cap">
</figure>

*Gradient descent on $f(\theta) = \tfrac12 \theta^T H \theta$, from the square to the star. Left: both curvatures equal $1$. Centre: curvatures $20$ and $1$ with $\eta = 0.09$, just below the cap $2/20$ of [[#step-size-cap]]; the component across the valley changes sign at every step while the component along the valley shrinks by the factor $0.91$. Right: the same function with $\eta = 0.105$, just above the cap; the component across the valley grows by the factor $1.1$ per step.*

## Why Gradient Descent Is Slow

This section turns the one-step identity into statements about the whole run. The direction of largest curvature limits the step size, and with the step size so limited, the number of steps is governed by the condition number.

### Descent directions

:::definition{#descent-direction title="Descent Direction"}
Let $f : \R^n \to \R$ and $\theta \in \R^n$. A vector $d \in \R^n$ is a **descent direction** for $f$ at $\theta$ if there is $\bar s > 0$ such that $f(\theta + s d) < f(\theta)$ for all $0 < s < \bar s$.
:::

:::proposition{#descent-sufficient title="Negative Slope Implies Descent"}
Let $f : \R^n \to \R$ be differentiable at $\theta$. If $\ip{\nabla f(\theta)}{d} < 0$, then $d$ is a descent direction for $f$ at $\theta$. In particular, if $\nabla f(\theta) \neq 0$ then $-\nabla f(\theta)$ is a descent direction, and so is $-P \nabla f(\theta)$ for every symmetric positive definite matrix $P$.
:::

:::proof
By differentiability, $f(\theta + s d) - f(\theta) = s \ip{\nabla f(\theta)}{d} + r(s)$ with $r(s)/s \to 0$ as $s \to 0$. Dividing by $s > 0$, the quotient $(f(\theta + sd) - f(\theta))/s$ converges to $\ip{\nabla f(\theta)}{d} < 0$, so it is negative for all sufficiently small $s > 0$. For the last statement, $\ip{\nabla f(\theta)}{-P\nabla f(\theta)} = -\nabla f(\theta)^T P\, \nabla f(\theta) < 0$ when $\nabla f(\theta) \neq 0$; the case $P = I$ gives $-\nm{\nabla f(\theta)}^2$.
:::

:::example{#descent-converse-fails title="The Converse Fails"}
Let $f(x) = -x^3$ on $\R$, $\theta = 0$ and $d = 1$. Then $f(s) - f(0) = -s^3 < 0$ for every $s > 0$, so $d$ is a descent direction, while $\ip{\nabla f(0)}{d} = f'(0) = 0$. When the slope in a direction is zero, the first derivative gives no information and higher-order terms decide.
:::

### The descent lemma and the step-size cap

[[#descent-sufficient]] guarantees a decrease for sufficiently small steps and does not say how small. A bound on the curvature makes the statement quantitative.

:::lemma{#quadratic-bounds title="Quadratic Upper and Lower Bounds"}
Let $f : \R^n \to \R$ be twice continuously differentiable and let $\theta, h \in \R^n$.

(i) If $f$ has curvature at most $L$, then $f(\theta + h) \leq f(\theta) + \ip{\nabla f(\theta)}{h} + \tfrac{L}{2} \nm{h}^2$.

(ii) If $f$ has curvature at least $m$, then $f(\theta + h) \geq f(\theta) + \ip{\nabla f(\theta)}{h} + \tfrac{m}{2} \nm{h}^2$.
:::

:::proof
Let $\varphi(s) = f(\theta + sh)$. Integration by parts gives $\int_0^1 (1 - s)\varphi''(s)\, ds = -\varphi'(0) + \int_0^1 \varphi'(s)\, ds = -\varphi'(0) + \varphi(1) - \varphi(0)$, that is,

$$
f(\theta + h) = f(\theta) + \ip{\nabla f(\theta)}{h} + \int_0^1 (1-s)\, h^T H(\theta + sh)\, h \, ds ,
$$

using [[#line-restriction]] for $\varphi'(0)$ and $\varphi''(s)$. If $f$ has curvature at most $L$, then $h^T H(\theta + sh) h \leq L \nm{h}^2$ (apply the bound to the unit vector $h/\nm{h}$ when $h \neq 0$), and $\int_0^1 (1-s)\, ds = \tfrac12$ gives (i). Part (ii) is the same with the inequality reversed.
:::

Part (i) is known as the descent lemma. Part (ii) with $m = 0$ is the statement that a convex function lies above its tangent planes.

:::corollary{#step-size-cap title="Guaranteed Decrease and the Step-Size Cap"}
Let $f : \R^n \to \R$ be twice continuously differentiable with curvature at most $L$, where $L > 0$. For every $\theta \in \R^n$ and $\eta > 0$, with $g = \nabla f(\theta)$,

$$
f(\theta - \eta g) \leq f(\theta) - \eta \Big( 1 - \frac{\eta L}{2} \Big) \nm{g}^2 .
$$
{#guaranteed-decrease}

In particular, if $0 < \eta < 2/L$ and $g \neq 0$, then $f(\theta - \eta g) < f(\theta)$. The guaranteed decrease is largest at $\eta = 1/L$, where it equals $\nm{g}^2 / (2L)$.
:::

:::proof
Put $h = -\eta g$ in [[#quadratic-bounds]](i): $f(\theta - \eta g) \leq f(\theta) - \eta \nm{g}^2 + \tfrac{L}{2}\eta^2 \nm{g}^2$. The function $\eta \mapsto \eta(1 - \eta L/2)$ is positive on $(0, 2/L)$ and is maximized at $\eta = 1/L$ with value $1/(2L)$.
:::

The second-order term $\tfrac{L}{2}\eta^2\nm{g}^2$ is the price of using a gradient that goes out of date along the step. It grows with the square of the step size, while the first-order gain grows linearly, and $2/L$ is where the bound stops guaranteeing a gain. [[#sharpness]] shows that the cap $2/L$ cannot be raised.

### Convergence to stationarity

:::theorem{#stationarity title="Convergence to Stationarity"}
Let $f : \R^n \to \R$ be twice continuously differentiable with curvature at most $L$, where $L > 0$, and suppose $f$ is bounded below, $f(\theta) \geq f_{\inf}$ for all $\theta$. Let $(\theta_t)$ be gradient descent with step size $\eta = 1/L$ from any $\theta_0$. Then for every $T \geq 1$,

$$
\sum_{t=0}^{T-1} \nm{g_t}^2 \leq 2L \big( f(\theta_0) - f_{\inf} \big) .
$$

Consequently $g_t \to 0$ as $t \to \infty$, and $\min_{0 \leq t < T} \nm{g_t} \leq \sqrt{2L(f(\theta_0) - f_{\inf})/T}$.
:::

:::proof
By [[#step-size-cap]] with $\eta = 1/L$, $\nm{g_t}^2 \leq 2L\big( f(\theta_t) - f(\theta_{t+1}) \big)$. Summing over $t = 0, \ldots, T-1$, the right side telescopes to $2L(f(\theta_0) - f(\theta_T)) \leq 2L(f(\theta_0) - f_{\inf})$. A series of nonnegative terms with bounded partial sums has terms tending to zero. The smallest of $T$ nonnegative numbers is at most their average.
:::

:::remark{#stationarity-not-optimality title="Stationarity Is Not Optimality"}
[[#stationarity]] assumes no convexity, and its conclusion is correspondingly limited: the gradient tends to zero. It does not assert that $f(\theta_t)$ tends to the infimum of $f$, nor that $\theta_t$ converges. A function with two local minima of different depths satisfies the hypotheses, and from a starting point near the shallower one gradient descent converges to it. Stronger conclusions require hypotheses that exclude unwanted stationary points, such as the positive lower curvature bound used next.
:::

### The contraction rate

:::theorem{#contraction title="Contraction of the Gradient"}
Let $f : \R^n \to \R$ be twice continuously differentiable with curvature bounds $[m, L]$, $0 < m \leq L$, and let $\kappa = L/m$. Let $(\theta_t)$ be gradient descent with step size $\eta > 0$. Then for every $t$,

$$
\nm{g_{t+1}} \leq \rho(\eta)\, \nm{g_t}, \qquad \rho(\eta) = \max\big( \abs{1 - \eta m},\, \abs{1 - \eta L} \big) .
$$
{#contraction-factor}

In particular $\rho(1/L) = 1 - 1/\kappa$, and $\rho$ is smallest at $\eta = 2/(m+L)$, where $\rho = (\kappa - 1)/(\kappa + 1)$.
:::

:::proof
Let $\mu_1, \ldots, \mu_n$ be the eigenvalues of the averaged Hessian $\bar H_t$ of [[#one-step]], with orthonormal eigenvectors $w_i$. By [[#averaged-hessian-properties]](iii), each $\mu_i \in [m, L]$. The function $\mu \mapsto \abs{1 - \eta\mu}$ is convex, so on $[m, L]$ it is largest at an endpoint, and $\abs{1 - \eta\mu_i} \leq \rho(\eta)$. By [[#decoupling]],

$$
\nm{g_{t+1}}^2 = \sum_i (1 - \eta\mu_i)^2 \ip{g_t}{w_i}^2 \leq \rho(\eta)^2 \sum_i \ip{g_t}{w_i}^2 = \rho(\eta)^2 \nm{g_t}^2 .
$$

For $\eta = 1/L$ the two endpoint values are $1 - m/L$ and $0$. For the best $\eta$, note that $\abs{1 - \eta m}$ is decreasing and $\abs{1 - \eta L}$ is increasing in $\eta$ once $\eta \geq 1/L$, so their maximum is smallest where $1 - \eta m = \eta L - 1$, that is $\eta = 2/(m+L)$, giving $\rho = (L - m)/(L + m)$.
:::

:::corollary{#convergence-to-minimizer title="Convergence to the Minimizer"}
Let $f : \R^n \to \R$ be twice continuously differentiable with curvature bounds $[m, L]$, $0 < m \leq L$, and let $(\theta_t)$ be gradient descent with a step size $\eta$ for which $\rho = \rho(\eta) < 1$ in [[#contraction-factor]] (that is, $0 < \eta < 2/L$). Then $f$ has a unique stationary point $\theta^\star$, it is the unique global minimizer of $f$, and for every $t$,

$$
\nm{\theta_t - \theta^\star} \leq \frac{1}{m} \nm{g_t} \leq \frac{\rho^t}{m} \nm{g_0} .
$$
:::

:::proof
*Existence.* By [[#contraction]], $\nm{g_t} \leq \rho^t \nm{g_0}$. Since $\nm{\theta_{t+1} - \theta_t} = \eta \nm{g_t}$, the steps are summable, so $(\theta_t)$ is a Cauchy sequence and converges to some $\theta^\star$. By continuity of the gradient, $\nabla f(\theta^\star) = \lim g_t = 0$.

*The distance bound and uniqueness.* For any $\theta$, [[#gradient-mvt]] applied to the segment from $\theta^\star$ to $\theta$ gives $\nabla f(\theta) = \tilde H(\theta - \theta^\star)$ with $\tilde H$ symmetric and all eigenvalues in $[m, L]$. Expanding $\theta - \theta^\star$ in an orthonormal eigenbasis of $\tilde H$ shows $\nm{\tilde H(\theta - \theta^\star)} \geq m \nm{\theta - \theta^\star}$. Hence $\nm{\theta - \theta^\star} \leq \nm{\nabla f(\theta)}/m$. Taking $\theta = \theta_t$ gives the displayed bound, and taking $\theta$ to be any stationary point gives $\theta = \theta^\star$.

*Minimality.* By [[#quadratic-bounds]](ii) at $\theta^\star$, $f(\theta) \geq f(\theta^\star) + \tfrac{m}{2}\nm{\theta - \theta^\star}^2$ for all $\theta$.
:::

With $\eta = 1/L$ the gradient norm, and with it the bound on the distance to the minimizer, is multiplied by at most $1 - 1/\kappa$ at each step. Since $(1 - 1/\kappa)^t \leq e^{-t/\kappa}$, reducing it by a factor $\eps$ takes at most $\kappa \ln(1/\eps)$ steps. The number of steps is proportional to the condition number.

### Sharpness

The cap and the rate of the preceding results are attained by functions with constant Hessian, so they cannot be improved for the class of functions with curvature bounds $[m, L]$.

:::example{#sharpness title="The Bounds Are Attained"}
Let $H \in \R^{n\times n}$ be symmetric with largest eigenvalue $L$ and smallest eigenvalue $m > 0$, with unit eigenvectors $e_L$ and $e_m$, and let $f(\theta) = \tfrac12 \theta^T H \theta$. Differentiating, $\partial_k f(\theta) = \tfrac12 \big( \sum_j H_{kj}\theta_j + \sum_i H_{ik}\theta_i \big) = (H\theta)_k$, so $\nabla f(\theta) = H\theta$, the Hessian is $H$ at every point, $f$ has curvature bounds $[m, L]$, and by [[#decoupling-scope]] the component of $g_t$ along an eigenvector with eigenvalue $\lambda$ is $(1 - \eta\lambda)^t$ times its initial value.

(i) *The cap.* If $\eta > 2/L$ and $g_0$ is a nonzero multiple of $e_L$, then $\nm{g_t} = \abs{1 - \eta L}^t \nm{g_0} \to \infty$.

(ii) *The rate at $\eta = 1/L$.* If $g_0$ is a multiple of $e_m$, then $\nm{g_t} = (1 - 1/\kappa)^t \nm{g_0}$, with equality in [[#contraction]].

(iii) *No fixed step size does better than $(\kappa-1)/(\kappa+1)$.* For any $\eta > 0$, starting with $g_0$ along $e_m$ or along $e_L$ gives $\nm{g_t} = \abs{1 - \eta m}^t\nm{g_0}$ or $\abs{1 - \eta L}^t \nm{g_0}$. If $\eta \leq 2/(m+L)$ then $1 - \eta m \geq (L-m)/(L+m)$, and otherwise $\eta L - 1 > (L - m)/(L+m)$. So for every step size some starting point contracts no faster than $(\kappa - 1)/(\kappa+1)$ per step.
:::

### The local rate at a minimizer

The contraction theorem requires curvature bounds at every point. Near a minimizer no global hypothesis is needed: the rate is governed by the eigenvalues of the Hessian at the minimizer alone.

:::theorem{#local-rate title="Local Rate of Gradient Descent"}
Let $f : \R^n \to \R$ be twice continuously differentiable, and let $\theta^\star$ satisfy $\nabla f(\theta^\star) = 0$ with $H(\theta^\star)$ positive definite, with eigenvalues $\lambda_1 \geq \cdots \geq \lambda_n > 0$. Let $0 < \eta < 2/\lambda_1$ and $\rho = \max_k \abs{1 - \eta\lambda_k} < 1$. Then for every $\eps > 0$ there is $r > 0$ such that, if $\nm{\theta_0 - \theta^\star} \leq r$, gradient descent with step size $\eta$ satisfies

$$
\nm{\theta_{t+1} - \theta^\star} \leq (\rho + \eps)\, \nm{\theta_t - \theta^\star} \qquad \text{for all } t \geq 0 .
$$
:::

:::proof
Replacing $\eps$ by a smaller number if necessary, assume $\rho + \eps < 1$. Write $H^\star = H(\theta^\star)$. The entries of $H$ are continuous, and $\abs{u^T E u} \leq n \max_{j,k}\abs{E_{jk}}$ for a unit vector $u$ and a matrix $E$, so there is $r > 0$ such that $\abs{u^T (H(\theta) - H^\star) u} \leq \eps/\eta$ for every unit $u$ whenever $\nm{\theta - \theta^\star} \leq r$.

Suppose $\nm{\theta_t - \theta^\star} \leq r$. The segment from $\theta^\star$ to $\theta_t$ lies in the ball of radius $r$, so the averaged Hessian $\tilde H_t$ of [[#error-identity]] satisfies $\abs{u^T(\tilde H_t - H^\star)u} \leq \eps/\eta$ for unit $u$, by [[#averaged-hessian-properties]](ii). The matrix $E = \tilde H_t - H^\star$ is symmetric, so $\max_{\nm{u}=1}\nm{Eu} \leq \eps/\eta$ by [[#symmetric-facts]](ii). The matrix $I - \eta H^\star$ is symmetric with eigenvalues $1 - \eta\lambda_k$, so $\nm{(I - \eta H^\star)x} \leq \rho\nm{x}$ for every $x$, again by [[#symmetric-facts]](ii).

By [[#error-step]], $\theta_{t+1} - \theta^\star = (I - \eta\tilde H_t)(\theta_t - \theta^\star)$. Writing $I - \eta\tilde H_t = (I - \eta H^\star) - \eta E$ and $x = \theta_t - \theta^\star$, the triangle inequality gives $\nm{\theta_{t+1} - \theta^\star} \leq \nm{(I - \eta H^\star)x} + \eta\nm{Ex} \leq (\rho + \eps)\nm{x}$. In particular $\nm{\theta_{t+1} - \theta^\star} \leq r$, and the argument repeats by induction.
:::

The best local factor, obtained at $\eta = 2/(\lambda_1 + \lambda_n)$, is $(\kappa^\star - 1)/(\kappa^\star+1)$ with $\kappa^\star = \lambda_1/\lambda_n$ the condition number of the matrix $H(\theta^\star)$. The theorem applies to non-convex functions near any local minimizer with positive definite Hessian.

## Preconditioning

The inefficiency identified above is a mismatch between one step size and many curvatures. Preconditioning removes the mismatch by changing the coordinates in which gradient descent is run, so that the curvatures in the new coordinates are closer to one another.

### Preconditioned descent as a change of coordinates

:::definition{#preconditioned-gd title="Preconditioned Gradient Descent"}
Let $f : \R^n \to \R$ be differentiable, let $P \in \R^{n\times n}$ be symmetric positive definite, and let $\eta > 0$. **Preconditioned gradient descent** with **preconditioner** $P$ is the iteration

$$
\theta_{t+1} = \theta_t - \eta\, P\, \nabla f(\theta_t) .
$$
{#pgd-iteration}

:::

By [[#descent-sufficient]], $-P\nabla f(\theta)$ is a descent direction whenever $\nabla f(\theta) \neq 0$.

:::proposition{#change-of-coordinates title="Preconditioning Is a Change of Coordinates"}
Let $f : \R^n \to \R$ be twice continuously differentiable with Hessian $H$, let $A \in \R^{n \times n}$ be invertible, and define $F(z) = f(Az)$ for $z \in \R^n$.

(i) $\nabla F(z) = A^T \nabla f(Az)$ and $\nabla^2 F(z) = A^T H(Az)\, A$.

(ii) If $(z_t)$ is gradient descent on $F$ with step size $\eta$, then $\theta_t = A z_t$ is preconditioned gradient descent on $f$ with step size $\eta$ and preconditioner $P = A A^T$.

(iii) Every symmetric positive definite $P$ arises in this way, with $A = P^{1/2}$ the positive definite square root of $P$.
:::

:::proof
(i) By the chain rule, $\partial_j F(z) = \sum_k \partial_k f(Az)\, A_{kj} = (A^T \nabla f(Az))_j$. Differentiating again, $\partial_i\partial_j F(z) = \sum_k \sum_l \partial_l\partial_k f(Az)\, A_{li} A_{kj} = (A^T H(Az) A)_{ij}$.

(ii) Multiply $z_{t+1} = z_t - \eta A^T \nabla f(A z_t)$ on the left by $A$ to get $\theta_{t+1} = \theta_t - \eta A A^T \nabla f(\theta_t)$. The matrix $AA^T$ is symmetric, and positive definite because $x^T A A^T x = \nm{A^T x}^2 > 0$ for $x \neq 0$.

(iii) A positive definite matrix $P$ has a positive semidefinite square root $P^{1/2}$ ([[LinAlg:positive-square-root]]). It is symmetric, and it is invertible because its square $P$ is, and $P^{1/2}(P^{1/2})^T = P$.
:::

Preconditioned gradient descent is therefore not a different method. It is gradient descent, run in the coordinates $z = A^{-1}\theta$.

### What preconditioning achieves

Since preconditioned descent on $f$ is plain descent on $F$, every result of the two preceding sections applies to it, with the Hessian $A^T H A$ of $F$ in place of $H$.

:::corollary{#preconditioned-rate title="Rate of Preconditioned Gradient Descent"}
Let $f : \R^n \to \R$ be twice continuously differentiable with Hessian $H$, let $P$ be symmetric positive definite, and suppose there are $0 < m_P \leq L_P$ such that every eigenvalue of $P^{1/2} H(\theta) P^{1/2}$ lies in $[m_P, L_P]$ for every $\theta$. Then preconditioned gradient descent with preconditioner $P$ and step size $\eta = 1/L_P$ satisfies

$$
\nm{P^{1/2} g_{t+1}} \leq \Big( 1 - \frac{m_P}{L_P} \Big) \nm{P^{1/2} g_t} .
$$
:::

:::proof
Let $A = P^{1/2}$ and $F(z) = f(Az)$. By [[#change-of-coordinates]](i), the Hessian of $F$ at $z$ is $P^{1/2}H(Az)P^{1/2}$, so $F$ has curvature bounds $[m_P, L_P]$, and $\nabla F(z_t) = P^{1/2} g_t$. Apply [[#contraction]] to $F$ and use [[#change-of-coordinates]](ii).
:::

The rate is governed by the condition number $L_P/m_P$ of the function in the new coordinates. Plain gradient descent is the case $P = I$, with condition number $L/m$. A preconditioner is good to the extent that the eigenvalues of $P^{1/2}H(\theta)P^{1/2}$ are close to one another.

:::example{#ideal-preconditioner title="The Ideal Preconditioner for a Constant Hessian"}
Let $f(\theta) = \tfrac12\theta^T H\theta$ with $H$ symmetric positive definite, and take $P = H^{-1}$. Then $P^{1/2} H P^{1/2} = H^{-1/2} H H^{-1/2} = I$: in the new coordinates every curvature equals $1$, and the condition number is $1$. With $\eta = 1$, the iteration [[#pgd-iteration]] gives $\theta_1 = \theta_0 - H^{-1}H\theta_0 = 0$, the minimizer, in one step from any starting point. In the eigenbasis of $H$, the step $-H^{-1}\nabla f(\theta)$ has component $-\ip{\nabla f(\theta)}{e_k}/\lambda_k$ along $e_k$: each direction receives the step size $1/\lambda_k$, the reciprocal of its own curvature, which is exactly what one step size could not provide.
:::

<figure class="fig">
  <img src="/figures/gradient-descent/gd-preconditioning.svg" alt="Left: contour plot of a narrow valley with a gradient step pointing across the valley and a preconditioned step pointing at the minimum. Right: the same function in rescaled coordinates, where the contours are circles">
</figure>

*Left: for $f(x, y) = \tfrac12(10x^2 + \tfrac12 y^2)$ at the point $(1.2, 1.8)$, the gradient step $-\eta\nabla f$ (with $\eta = 0.19$) points almost entirely across the valley, while the preconditioned step $-H^{-1}\nabla f$ is the displacement to the minimizer. Right: in the coordinates $z = H^{1/2}\theta$ the level sets are circles, and the ordinary gradient step points at the minimizer, as in [[#ideal-preconditioner]].*

:::remark{#diagonal-preconditioners title="Diagonal Preconditioners"}
A diagonal $P$ assigns a separate step size to each coordinate, which is cheap to store and apply, and corresponds to rescaling the coordinate axes. If the Hessian is diagonal, the diagonal preconditioner $P = H^{-1}$ is the ideal one. A diagonal preconditioner cannot rotate the axes, however. For $H = \begin{pmatrix} 2 & 1 \\ 1 & 2 \end{pmatrix}$, with eigenvalues $3$ and $1$ along the diagonals of the plane, the diagonal entries are equal, so the diagonal preconditioner $P = \operatorname{diag}(H)^{-1} = \tfrac12 I$ only rescales the step size and leaves the condition number at $3$. The adaptive methods of Part II are diagonal preconditioners.
:::

### Steepest descent depends on the coordinates

The negative gradient is often described as the direction of steepest descent. The description is correct with respect to the Euclidean norm, and each choice of norm gives its own steepest direction.

:::proposition{#steepest-direction title="Steepest Descent with Respect to a Norm"}
Let $M \in \R^{n\times n}$ be symmetric positive definite, with associated norm $\nm{d}_M = \sqrt{d^T M d}$, and let $g \in \R^n$ be nonzero. Among all $d$ with $\nm{d}_M = 1$, the slope $\ip{g}{d}$ is smallest for

$$
d = -\frac{M^{-1} g}{\nm{M^{-1}g}_M} ,
$$

and for no other $d$.
:::

:::proof
The form $\ip{x}{y}_M = x^T M y$ is an inner product. For any $d$, $\ip{g}{d} = (M^{-1}g)^T M d = \ip{M^{-1}g}{d}_M$. By the Cauchy–Schwarz inequality for this inner product, $\ip{M^{-1}g}{d}_M \geq -\nm{M^{-1}g}_M \nm{d}_M$, with equality exactly when $d$ is a negative multiple of $M^{-1}g$.
:::

With $M = I$ the steepest direction is $-g$. With a general $M$ it is the preconditioned direction $-Pg$ with $P = M^{-1}$. This matches [[#change-of-coordinates]]: for $\theta = Az$, the Euclidean length of $z$ is $\nm{z} = \nm{\theta}_M$ with $M = (AA^T)^{-1} = P^{-1}$. The gradient direction is thus the steepest direction only relative to the coordinates in which the problem happens to be written, and preconditioned descent is steepest descent relative to coordinates chosen to suit the function.

### Newton's method

Newton's method uses the inverse of the current Hessian as the preconditioner, with step size one.

:::definition{#newton title="Newton's Method"}
Let $f : \R^n \to \R$ be twice continuously differentiable with Hessian $H$, and suppose $H(\theta_t)$ is invertible. The **Newton step** at $\theta_t$ is $h_t = -H(\theta_t)^{-1}\nabla f(\theta_t)$, and **Newton's method** is the iteration $\theta_{t+1} = \theta_t + h_t$. Equivalently, $h_t$ is the unique stationary point of the **quadratic model**

$$
q_t(h) = f(\theta_t) + \ip{\nabla f(\theta_t)}{h} + \tfrac12 h^T H(\theta_t)\, h ,
$$
{#quadratic-model}

since $\nabla q_t(h) = \nabla f(\theta_t) + H(\theta_t) h$.
:::

Unlike the preconditioner of [[#preconditioned-gd]], the matrix $H(\theta_t)^{-1}$ changes from step to step. The one-step identity shows what this buys. For gradient descent, $g_{t+1} = (I - \eta\bar H_t)g_t$, and the factor $I - \eta\bar H_t$ has norm at least $(\kappa-1)/(\kappa+1)$ in the worst case. For Newton's method the corresponding factor is the difference between the Hessian at the start of the step and its average along the step, which is small when the step is short.

:::theorem{#newton-quadratic title="Quadratic Convergence of Newton's Method"}
Let $f : \R^n \to \R$ be twice continuously differentiable with Hessian $H$. Suppose $f$ has curvature at least $m > 0$, and that the Hessian is Lipschitz with constant $M$ in the sense that $\abs{u^T (H(\theta) - H(\theta'))u} \leq M \nm{\theta - \theta'}$ for all $\theta, \theta'$ and all unit vectors $u$. Then the iterates of Newton's method satisfy

$$
\nm{g_{t+1}} \leq \frac{M}{2m^2}\, \nm{g_t}^2 .
$$

Consequently, with $c = M/(2m^2)$, if $c\,\nm{g_0} < 1$ then $c\,\nm{g_t} \leq (c\,\nm{g_0})^{2^t}$ for all $t$.
:::

:::proof
Write $H_t = H(\theta_t)$ and $h_t = -H_t^{-1}g_t$, so $g_t = -H_t h_t$. Every eigenvalue of $H_t$ is at least $m$, so $H_t$ is invertible, the eigenvalues of $H_t^{-1}$ are at most $1/m$, and $\nm{h_t} \leq \nm{g_t}/m$ by [[#symmetric-facts]](ii). By [[#gradient-mvt]] with averaged Hessian $\bar H_t = \int_0^1 H(\theta_t + sh_t)\,ds$,

$$
g_{t+1} = g_t + \bar H_t h_t = (\bar H_t - H_t)\, h_t .
$$

For a unit vector $u$, by [[#averaged-hessian-properties]](ii) and the Lipschitz hypothesis,

$$
\abs{u^T(\bar H_t - H_t)u} \leq \int_0^1 \abs{u^T\big(H(\theta_t + sh_t) - H(\theta_t)\big)u}\, ds \leq \int_0^1 M s \nm{h_t}\, ds = \frac{M}{2}\nm{h_t} .
$$

Since $\bar H_t - H_t$ is symmetric, [[#symmetric-facts]](ii) gives $\nm{(\bar H_t - H_t)h_t} \leq \tfrac{M}{2}\nm{h_t}^2 \leq \tfrac{M}{2m^2}\nm{g_t}^2$. The last statement follows by induction: $c\nm{g_{t+1}} \leq (c\nm{g_t})^2$.
:::

The gradient norm is squared at each step, up to a constant, so the number of correct digits roughly doubles per step once $c\,\nm{g_t} < 1$. The condition number does not appear in the exponent. The first-order factor that limited gradient descent has been removed entirely, and what remains is controlled by how fast the Hessian varies.

The convergence is local: the theorem gives nothing unless $c\,\nm{g_0} < 1$. The next proposition explains the second restriction, that the Hessian be positive definite.

:::proposition{#newton-needs-pd title="The Newton Step and the Sign of the Curvature"}
Let $H = H(\theta)$ be invertible with orthonormal eigenvectors $e_k$ and eigenvalues $\lambda_k \neq 0$, let $g = \nabla f(\theta)$ with components $g_k = \ip{g}{e_k}$, and let $h = -H^{-1}g$ be the Newton step.

(i) $\ip{h}{e_k} = -g_k/\lambda_k$ for each $k$, and $\ip{g}{h} = -\sum_k g_k^2/\lambda_k$.

(ii) If $H$ is positive definite and $g \neq 0$, then $h$ is a descent direction for $f$ at $\theta$, and $h$ is the unique minimizer of the quadratic model [[#quadratic-model]].

(iii) If $g$ is a nonzero multiple of an eigenvector $e_k$ with $\lambda_k < 0$, then $\ip{g}{h} > 0$, and $-h$ is a descent direction: the Newton step points uphill.
:::

:::proof
(i) $H^{-1}$ has the same eigenvectors with eigenvalues $1/\lambda_k$, so $h = -\sum_k (g_k/\lambda_k)e_k$, and $\ip{g}{h} = -\sum_k g_k^2/\lambda_k$ by orthonormality.

(ii) All $\lambda_k > 0$, so $\ip{g}{h} < 0$ and [[#descent-sufficient]] applies. For any $d$, since $\nabla q(h) = 0$ and $q$ is quadratic, $q(h + d) = q(h) + \tfrac12 d^T H d > q(h)$ when $d \neq 0$.

(iii) Here $\ip{g}{h} = -g_k^2/\lambda_k > 0$, so $\ip{g}{-h} < 0$ and [[#descent-sufficient]] applies to $-h$.
:::

Along an eigendirection the quadratic model is the parabola $s \mapsto g_k s + \tfrac12\lambda_k s^2$, with stationary point $s = -g_k/\lambda_k$. When $\lambda_k > 0$ the parabola opens upward and its stationary point is its minimum. When $\lambda_k < 0$ it opens downward and its stationary point is its maximum. The Newton step goes to the stationary point of the model in every eigendirection, whichever kind it is.

:::remark{#newton-in-practice title="Newton's Method in Practice"}
Three modifications are standard, stated here without proof. A step size $\eta < 1$ chosen by a line search (damped Newton) secures a decrease of $f$ far from a minimizer, where the quadratic model is unreliable. Replacing $H(\theta_t)$ by $H(\theta_t) + \lambda I$ with $\lambda > 0$ large enough to make it positive definite restores a descent direction; large $\lambda$ makes the step a short gradient step and small $\lambda$ a Newton step. Quasi-Newton methods such as BFGS build a positive definite approximation to the inverse Hessian from differences of successive gradients. For details see Chapter 9 of Boyd and Vandenberghe. The Hessian has $n^2$ entries and solving with it costs on the order of $n^3$ operations, which rules these methods out when $n$ is in the millions and motivates the diagonal preconditioners of Part II.
:::

# Part II: Stochastic and Adaptive Methods

## Stochastic Gradient Descent

### Stochastic gradients

In statistical learning the objective is an average over data,

$$
f(\theta) = \frac{1}{N}\sum_{i=1}^N f_i(\theta) ,
$$
{#finite-sum}

where $f_i$ is the loss on the $i$-th example. Computing $\nabla f$ costs one gradient evaluation per example. Stochastic gradient descent replaces the gradient by a cheap random estimate of it.

:::definition{#sgd title="Stochastic Gradient Descent"}
Let $f : \R^n \to \R$ be differentiable. **Stochastic gradient descent** (SGD) with step sizes $\eta_t > 0$ is the iteration

$$
\theta_{t+1} = \theta_t - \eta_t\, \hat g_t ,
$$

where $\hat g_t$ is a random vector, the **stochastic gradient**. Let $\E_t$ denote conditional expectation given $\theta_0, \hat g_0, \ldots, \hat g_{t-1}$, which together determine $\theta_t$. The stochastic gradient is **unbiased** if $\E_t[\hat g_t] = \nabla f(\theta_t)$ for every $t$.
:::

:::proposition{#minibatch title="Minibatch Gradients"}
Let $f$ be the average [[#finite-sum]] of differentiable functions $f_1, \ldots, f_N$, let $\theta \in \R^n$, and let $i_1, \ldots, i_b$ be independent and uniformly distributed on $\{1, \ldots, N\}$. The **minibatch gradient** $\hat g = \frac{1}{b}\sum_{j=1}^b \nabla f_{i_j}(\theta)$ satisfies

$$
\E[\hat g] = \nabla f(\theta), \qquad \E\nm{\hat g - \nabla f(\theta)}^2 = \frac{\sigma^2(\theta)}{b}, \qquad \sigma^2(\theta) = \frac{1}{N}\sum_{i=1}^N \nm{\nabla f_i(\theta) - \nabla f(\theta)}^2 .
$$
:::

:::proof
Each $\nabla f_{i_j}(\theta)$ takes the value $\nabla f_i(\theta)$ with probability $1/N$, so its expectation is $\nabla f(\theta)$ and its deviation $X_j = \nabla f_{i_j}(\theta) - \nabla f(\theta)$ has $\E\nm{X_j}^2 = \sigma^2(\theta)$. The $X_j$ are independent with mean zero, so $\E\ip{X_j}{X_l} = 0$ for $j \neq l$ and $\E\nm{\frac1b\sum_j X_j}^2 = \frac{1}{b^2}\sum_j \E\nm{X_j}^2 = \sigma^2(\theta)/b$.
:::

A minibatch of size $b$ costs $b$ gradient evaluations in place of $N$, and its squared error decreases only as $1/b$.

### What the noise changes

:::proposition{#sgd-one-step title="Expected Decrease of One SGD Step"}
Let $f : \R^n \to \R$ be twice continuously differentiable with curvature at most $L$, where $L > 0$. Suppose the stochastic gradient is unbiased and $\E_t\nm{\hat g_t - g_t}^2 \leq \sigma^2$, where $g_t = \nabla f(\theta_t)$. Then for a step size $\eta > 0$,

$$
\E_t\big[ f(\theta_{t+1}) \big] \leq f(\theta_t) - \eta\Big(1 - \frac{\eta L}{2}\Big)\nm{g_t}^2 + \frac{\eta^2 L}{2}\sigma^2 .
$$
{#sgd-decrease}

:::

:::proof
By [[#quadratic-bounds]](i) with $h = -\eta\hat g_t$, $f(\theta_{t+1}) \leq f(\theta_t) - \eta\ip{g_t}{\hat g_t} + \tfrac{L}{2}\eta^2\nm{\hat g_t}^2$. Take $\E_t$. By unbiasedness, $\E_t\ip{g_t}{\hat g_t} = \nm{g_t}^2$ and $\E_t\nm{\hat g_t}^2 = \nm{g_t}^2 + \E_t\nm{\hat g_t - g_t}^2 \leq \nm{g_t}^2 + \sigma^2$.
:::

Compared with [[#guaranteed-decrease]], the bound has one new term, $\tfrac{\eta^2 L}{2}\sigma^2$, which does not shrink as the gradient shrinks. The bound promises a decrease only while $\nm{g_t}^2$ exceeds roughly $\tfrac{\eta L}{2}\sigma^2$. With a constant step size, SGD makes progress until the gradient reaches a noise floor proportional to $\eta$, and then fluctuates. Lowering the floor requires a smaller step size, or a larger minibatch, which reduces $\sigma^2$ by [[#minibatch]].

:::theorem{#sgd-nonconvex title="SGD with Constant Step Size"}
Let $f : \R^n \to \R$ be twice continuously differentiable with curvature at most $L$, $L > 0$, and bounded below by $f_{\inf}$. Suppose the stochastic gradient is unbiased with $\E_t\nm{\hat g_t - g_t}^2 \leq \sigma^2$ for all $t$. Then SGD with constant step size $0 < \eta \leq 1/L$ satisfies, for every $T \geq 1$,

$$
\frac{1}{T}\sum_{t=0}^{T-1}\E\nm{g_t}^2 \leq \frac{2\big(f(\theta_0) - f_{\inf}\big)}{\eta T} + \eta L \sigma^2 .
$$
:::

:::proof
Since $\eta L \leq 1$, [[#sgd-decrease]] gives $\E_t[f(\theta_{t+1})] \leq f(\theta_t) - \tfrac{\eta}{2}\nm{g_t}^2 + \tfrac{\eta^2L}{2}\sigma^2$. Taking expectations and summing over $t = 0, \ldots, T-1$, the function values telescope: $\tfrac{\eta}{2}\sum_t \E\nm{g_t}^2 \leq f(\theta_0) - f_{\inf} + T\tfrac{\eta^2 L}{2}\sigma^2$. Divide by $\eta T/2$.
:::

The first term is the deterministic rate of [[#stationarity]] and decreases as $T$ grows. The second is the noise floor and does not. Choosing $\eta$ proportional to $1/\sqrt{T}$ balances the two and gives an average squared gradient of order $1/\sqrt{T}$.

### Convergence for convex functions

:::theorem{#sgd-convex title="SGD for Convex Functions"}
Let $f : \R^n \to \R$ be twice continuously differentiable with curvature at least $0$, and let $\theta^\star$ be a minimizer of $f$. Suppose the stochastic gradient is unbiased and $\E_t\nm{\hat g_t}^2 \leq G^2$ for all $t$, and let $D = \nm{\theta_0 - \theta^\star}$. Then SGD with constant step size $\eta > 0$ satisfies, for the average iterate $\bar\theta_T = \frac1T\sum_{t=0}^{T-1}\theta_t$,

$$
\E\big[f(\bar\theta_T)\big] - f(\theta^\star) \leq \frac{D^2}{2\eta T} + \frac{\eta G^2}{2} .
$$

With $\eta = D/(G\sqrt{T})$ the right side equals $DG/\sqrt{T}$.
:::

:::proof
Expanding the square, $\nm{\theta_{t+1} - \theta^\star}^2 = \nm{\theta_t - \theta^\star}^2 - 2\eta\ip{\hat g_t}{\theta_t - \theta^\star} + \eta^2\nm{\hat g_t}^2$. Apply $\E_t$; since $\theta_t$ is determined by the past, $\E_t\ip{\hat g_t}{\theta_t - \theta^\star} = \ip{g_t}{\theta_t - \theta^\star}$. By [[#quadratic-bounds]](ii) with $m = 0$ and $h = \theta^\star - \theta_t$, $f(\theta^\star) \geq f(\theta_t) + \ip{g_t}{\theta^\star - \theta_t}$, that is, $\ip{g_t}{\theta_t - \theta^\star} \geq f(\theta_t) - f(\theta^\star)$. Hence

$$
\E_t\nm{\theta_{t+1} - \theta^\star}^2 \leq \nm{\theta_t - \theta^\star}^2 - 2\eta\big(f(\theta_t) - f(\theta^\star)\big) + \eta^2 G^2 .
$$

Taking expectations, rearranging, and summing over $t = 0, \ldots, T-1$, the squared distances telescope: $\sum_t \E[f(\theta_t) - f(\theta^\star)] \leq \frac{D^2}{2\eta} + \frac{T\eta G^2}{2}$. Finally $f(\bar\theta_T) \leq \frac1T\sum_t f(\theta_t)$ because $f$ is convex.
:::

The rate $1/\sqrt{T}$ is much slower than the geometric rate of [[#contraction]]. It is the price of noisy gradients and of assuming no positive lower bound on the curvature.

### Step-size schedules

A constant step size leaves a noise floor. Convergence to a minimizer requires step sizes that decrease, slowly enough that the iterates can still travel any distance. The classical sufficient conditions, due to Robbins and Monro and stated here without proof, are

$$
\sum_{t} \eta_t = \infty, \qquad \sum_t \eta_t^2 < \infty ,
$$

satisfied for instance by $\eta_t = \eta_0/(t+1)$. A full treatment is in the survey [*Optimization Methods for Large-Scale Machine Learning*](https://arxiv.org/abs/1606.04838) by Bottou, Curtis and Nocedal.

## AdaGrad

SGD inherits the inefficiency of Part I: one step size for all directions. AdaGrad gives each coordinate its own step size, computed from the history of that coordinate's gradients.

### The algorithm

:::definition{#adagrad title="AdaGrad (Diagonal Form)"}
Let $\hat g_0, \hat g_1, \ldots$ be the (stochastic) gradients at the iterates, with coordinates $\hat g_{t,i}$, and let $\eta > 0$. **AdaGrad** is the iteration

$$
s_{t,i} = \sum_{\tau = 0}^{t} \hat g_{\tau,i}^2, \qquad \theta_{t+1,i} = \theta_{t,i} - \eta\, \frac{\hat g_{t,i}}{\sqrt{s_{t,i}}}, \qquad i = 1, \ldots, n ,
$$
{#adagrad-update}

with the convention that the fraction is $0$ when $s_{t,i} = 0$. Implementations add a small constant $\eps > 0$ to the denominator.
:::

In the language of Part I, AdaGrad is preconditioned descent [[#pgd-iteration]] with the diagonal preconditioner $P_t = \operatorname{diag}(s_{t,1}^{-1/2}, \ldots, s_{t,n}^{-1/2})$, which changes with $t$. A coordinate whose gradients have been large receives a small step size, and a coordinate whose gradients have been small receives a large one.

The following special case shows the effect in the setting of Part I.

:::proposition{#adagrad-scale-free title="AdaGrad Removes Axis-Aligned Ill Conditioning"}
Let $f(\theta) = \tfrac12\sum_{i=1}^n \lambda_i\theta_i^2$ with all $\lambda_i > 0$. The iterates of AdaGrad with exact gradients satisfy

$$
\theta_{t+1,i} = \theta_{t,i} - \eta\,\frac{\theta_{t,i}}{\sqrt{\sum_{\tau=0}^t\theta_{\tau,i}^2}} ,
$$

and therefore do not depend on $\lambda_1, \ldots, \lambda_n$.
:::

:::proof
Here $\hat g_{t,i} = \lambda_i\theta_{t,i}$, so $s_{t,i} = \lambda_i^2\sum_{\tau\leq t}\theta_{\tau,i}^2$, and the factor $\lambda_i$ cancels in $\hat g_{t,i}/\sqrt{s_{t,i}}$.
:::

For this function gradient descent needs a number of steps proportional to $\kappa = \max_i\lambda_i/\min_i\lambda_i$, by [[#sharpness]], while AdaGrad behaves identically for every value of $\kappa$. The cancellation relies on the Hessian being diagonal, in line with [[#diagonal-preconditioners]].

### The guarantee

:::lemma{#sqrt-sum title="A Sum Inequality"}
Let $a_0, \ldots, a_{T-1} \geq 0$ and $S_t = \sum_{\tau=0}^t a_\tau$. Then $\sum_{t=0}^{T-1} a_t/\sqrt{S_t} \leq 2\sqrt{S_{T-1}}$, where terms with $S_t = 0$ are read as $0$.
:::

:::proof
With $S_{-1} = 0$, for $S_t > 0$ we have $a_t = S_t - S_{t-1} = (\sqrt{S_t} - \sqrt{S_{t-1}})(\sqrt{S_t} + \sqrt{S_{t-1}}) \leq 2\sqrt{S_t}\,(\sqrt{S_t} - \sqrt{S_{t-1}})$. Divide by $\sqrt{S_t}$ and sum; the right side telescopes.
:::

:::theorem{#adagrad-bound title="Convergence Bound for AdaGrad"}
Let $f : \R^n \to \R$ be twice continuously differentiable with curvature at least $0$, with minimizer $\theta^\star$, and let the stochastic gradients be unbiased. Suppose the AdaGrad iterates satisfy $\abs{\theta_{t,i} - \theta^\star_i} \leq D_\infty$ for all $t$ and $i$. Then for the average iterate $\bar\theta_T = \frac1T\sum_{t=0}^{T-1}\theta_t$,

$$
\E\big[f(\bar\theta_T)\big] - f(\theta^\star) \leq \frac{1}{T}\Big(\frac{D_\infty^2}{2\eta} + \eta\Big)\, \E\Big[\sum_{i=1}^n\sqrt{\sum_{t=0}^{T-1}\hat g_{t,i}^2}\,\Big] .
$$

With $\eta = D_\infty/\sqrt2$ the constant in parentheses is $\sqrt2\, D_\infty$.
:::

:::proof
Fix a coordinate $i$ and write $e_t = \theta_{t,i} - \theta^\star_i$, $\gamma_t = \hat g_{t,i}$ and $d_t = \sqrt{s_{t,i}}$, so that $e_{t+1} = e_t - \eta\gamma_t/d_t$ and $d_t$ is nondecreasing in $t$. Squaring and rearranging,

$$
\gamma_t e_t = \frac{d_t}{2\eta}\big(e_t^2 - e_{t+1}^2\big) + \frac{\eta}{2}\,\frac{\gamma_t^2}{d_t} .
$$

Sum over $t = 0, \ldots, T-1$. For the first term, summation by parts gives

$$
\sum_{t=0}^{T-1} d_t\big(e_t^2 - e_{t+1}^2\big) = d_0e_0^2 + \sum_{t=1}^{T-1}(d_t - d_{t-1})e_t^2 - d_{T-1}e_T^2 \leq D_\infty^2\Big(d_0 + \sum_{t=1}^{T-1}(d_t - d_{t-1})\Big) = D_\infty^2\, d_{T-1} ,
$$

using $d_t - d_{t-1} \geq 0$ and $e_t^2 \leq D_\infty^2$. For the second term, [[#sqrt-sum]] with $a_t = \gamma_t^2$ gives $\sum_t\gamma_t^2/d_t \leq 2d_{T-1}$. Hence $\sum_t\hat g_{t,i}(\theta_{t,i} - \theta_i^\star) \leq \big(\frac{D_\infty^2}{2\eta} + \eta\big)\sqrt{s_{T-1,i}}$. Summing over $i$,

$$
\sum_{t=0}^{T-1}\ip{\hat g_t}{\theta_t - \theta^\star} \leq \Big(\frac{D_\infty^2}{2\eta} + \eta\Big)\sum_{i=1}^n\sqrt{s_{T-1,i}} .
$$

Take expectations. As in the proof of [[#sgd-convex]], $\E\ip{\hat g_t}{\theta_t - \theta^\star} = \E\ip{g_t}{\theta_t - \theta^\star} \geq \E[f(\theta_t) - f(\theta^\star)]$, and $f(\bar\theta_T) \leq \frac1T\sum_tf(\theta_t)$ by convexity.
:::

The boundedness of the iterates is an assumption of the theorem. Standard treatments enforce it by projecting each iterate onto a bounded set, which changes the proof only slightly.

If $\abs{\hat g_{t,i}} \leq G_i$ for all $t$, the bound is at most $\sqrt2\,D_\infty\sum_iG_i/\sqrt T$, again of order $1/\sqrt T$. The gain over SGD is in the constant, which adapts to the gradients observed. The next proposition makes this precise.

:::proposition{#adagrad-hindsight title="Comparison with the Best Fixed Diagonal Preconditioner"}
Let $p_1, \ldots, p_n > 0$ and $\eta > 0$, and consider the iteration $\theta_{t+1,i} = \theta_{t,i} - \eta\, p_i\, \hat g_{t,i}$ with a fixed diagonal preconditioner. Let $\theta^\star \in \R^n$ with $\abs{\theta_{0,i} - \theta_i^\star} \leq D_\infty$ for all $i$, and let $a_i = \big(\sum_{t=0}^{T-1}\hat g_{t,i}^2\big)^{1/2}$.

(i) The iterates satisfy

$$
\sum_{t=0}^{T-1}\ip{\hat g_t}{\theta_t - \theta^\star} \leq \frac{D_\infty^2}{2\eta}\sum_{i=1}^n\frac{1}{p_i} + \frac{\eta}{2}\sum_{i=1}^np_i\,a_i^2 .
$$
{#fixed-diagonal-bound}

(ii) For given positive numbers $a_1, \ldots, a_n$, the smallest value of the right side of [[#fixed-diagonal-bound]] over all $\eta > 0$ and $p_1, \ldots, p_n > 0$ is $D_\infty\sum_ia_i$, and it is attained when $p_i$ is proportional to $1/a_i$.
:::

:::proof
(i) Fix a coordinate $i$ and write $e_t = \theta_{t,i} - \theta_i^\star$ and $\gamma_t = \hat g_{t,i}$. Squaring $e_{t+1} = e_t - \eta p_i\gamma_t$ and rearranging gives $\gamma_te_t = \frac{1}{2\eta p_i}(e_t^2 - e_{t+1}^2) + \frac{\eta p_i}{2}\gamma_t^2$. Summing over $t$, the first term telescopes to at most $e_0^2/(2\eta p_i) \leq D_\infty^2/(2\eta p_i)$, and the second sums to $\frac{\eta p_i}{2}a_i^2$. Sum over $i$.

(ii) For $x, y > 0$, the function $\eta \mapsto \frac{x}{2\eta} + \frac{\eta y}{2}$ has minimum value $\sqrt{xy}$, attained at $\eta = \sqrt{x/y}$. Minimizing over $\eta$ therefore gives $D_\infty\big(\sum_i1/p_i\big)^{1/2}\big(\sum_ip_ia_i^2\big)^{1/2}$. By the Cauchy–Schwarz inequality,

$$
\sum_ia_i = \sum_ip_i^{-1/2}\,\big(p_i^{1/2}a_i\big) \leq \Big(\sum_i\frac{1}{p_i}\Big)^{1/2}\Big(\sum_ip_ia_i^2\Big)^{1/2} ,
$$

with equality exactly when $p_i^{1/2}a_i$ is proportional to $p_i^{-1/2}$, that is, when $p_i$ is proportional to $1/a_i$.
:::

The bound of [[#adagrad-bound]], with its best step size, is $\sqrt2\,D_\infty\sum_ia_i$. AdaGrad therefore obtains, without knowing the $a_i$ in advance, a guarantee within the factor $\sqrt2$ of the best guarantee of this form available to any fixed diagonal preconditioner chosen with full knowledge of the gradients. The comparison is between upper bounds, each evaluated on the gradients of its own run. It is not a statement that AdaGrad's iterates are better than those of every fixed preconditioner.

:::remark{#squared-gradients-not-curvature title="Squared Gradients Are Not Curvature"}
The ideal preconditioner of Part I is built from curvature. AdaGrad's is built from the size of past gradients, which is a different quantity. For $f(\theta) = \tfrac12\sum_i\lambda_i\theta_i^2$ the two are tied together, because the $i$-th gradient component $\lambda_i\theta_i$ is proportional to the curvature $\lambda_i$, and this is what makes [[#adagrad-scale-free]] work. In general they are not. The function $f(\theta) = c\,\theta$ on $\R$ has curvature zero everywhere, and AdaGrad takes the steps $\eta/\sqrt{t+1}$ on it whatever the value of $c > 0$. What AdaGrad does in general is make the iteration insensitive to the scale of each coordinate: replacing $\hat g_{t,i}$ by $c_i\hat g_{t,i}$ for constants $c_i > 0$ leaves [[#adagrad-update]] unchanged.
:::

:::remark{#adagrad-decay title="The Step Sizes Only Decrease"}
The sum $s_{t,i}$ never decreases, so the effective step size $\eta/\sqrt{s_{t,i}}$ of each coordinate never increases. If the gradients in a coordinate stay near a constant size, it decays like $1/\sqrt{t}$. This is the schedule that the convex analysis calls for. On non-convex problems, where the appropriate scale may change as the iterates move to a different region, gradients seen long ago continue to suppress the step size. RMSProp and Adam address this by forgetting old gradients.
:::

## RMSProp and Adam

### Exponential moving averages

:::definition{#ema title="Exponential Moving Average"}
Let $x_0, x_1, \ldots$ be real numbers and $0 \leq \beta < 1$. The **exponential moving average** of the sequence with decay $\beta$ is defined by $y_{-1} = 0$ and

$$
y_t = \beta\,y_{t-1} + (1 - \beta)\,x_t, \qquad t = 0, 1, 2, \ldots
$$
:::

:::proposition{#ema-bias title="Bias of an Exponential Moving Average"}
Let $(y_t)$ be the exponential moving average of $(x_t)$ with decay $\beta \in [0, 1)$. Then

$$
y_t = (1 - \beta)\sum_{k=0}^{t}\beta^{k}\,x_{t-k}, \qquad (1-\beta)\sum_{k=0}^t\beta^k = 1 - \beta^{t+1} .
$$

Consequently, if the $x_t$ are random variables with a common mean $\mu$, then $\E[y_t] = (1 - \beta^{t+1})\,\mu$, and $\hat y_t = y_t/(1 - \beta^{t+1})$ satisfies $\E[\hat y_t] = \mu$.
:::

:::proof
The formula for $y_t$ follows by induction: it holds for $t = 0$, where $y_0 = (1-\beta)x_0$, and $\beta y_{t-1} + (1-\beta)x_t = (1-\beta)\sum_{k=0}^{t-1}\beta^{k+1}x_{t-1-k} + (1-\beta)x_t$, which is the formula at $t$. The sum of the weights is a geometric sum. The statement about expectations follows by linearity.
:::

The average $y_t$ is a weighted sum of past values in which the value from $k$ steps ago has weight $(1-\beta)\beta^k$. The weights decay geometrically, so values older than a few multiples of $1/(1-\beta)$ steps contribute little. Because the recursion starts from zero, the weights sum to $1 - \beta^{t+1}$ and not to $1$: for small $t$ the average is biased toward zero, and dividing by $1 - \beta^{t+1}$ removes the bias. This is the **bias correction**.

### RMSProp

:::definition{#rmsprop title="RMSProp"}
Let $\eta > 0$, $0 \leq \beta < 1$ and $\eps > 0$. **RMSProp** is the iteration, for $i = 1, \ldots, n$,

$$
v_{t,i} = \beta\,v_{t-1,i} + (1-\beta)\,\hat g_{t,i}^2, \qquad \theta_{t+1,i} = \theta_{t,i} - \eta\,\frac{\hat g_{t,i}}{\sqrt{v_{t,i}} + \eps} ,
$$

with $v_{-1,i} = 0$.
:::

RMSProp is AdaGrad with the sum of squared gradients replaced by their exponential moving average. The denominator $\sqrt{v_{t,i}}$ is a root mean square of recent gradients in coordinate $i$, which can decrease as well as increase, so the step size recovers when the gradients become small. The method was proposed by Tieleman and Hinton in lecture notes (2012) and is not accompanied by a convergence theorem of the kind proved above for AdaGrad.

### Adam

:::definition{#adam title="Adam"}
Let $\eta > 0$, $0 \leq \beta_1 < 1$, $0 \leq \beta_2 < 1$ and $\eps > 0$. **Adam** is the iteration, for $i = 1, \ldots, n$,

$$
\begin{aligned}
m_{t,i} &= \beta_1\,m_{t-1,i} + (1-\beta_1)\,\hat g_{t,i}, & \hat m_{t,i} &= \frac{m_{t,i}}{1 - \beta_1^{t+1}}, \\
v_{t,i} &= \beta_2\,v_{t-1,i} + (1-\beta_2)\,\hat g_{t,i}^2, & \hat v_{t,i} &= \frac{v_{t,i}}{1 - \beta_2^{t+1}},
\end{aligned}
\qquad
\theta_{t+1,i} = \theta_{t,i} - \eta\,\frac{\hat m_{t,i}}{\sqrt{\hat v_{t,i}} + \eps} ,
$$
{#adam-update}

with $m_{-1,i} = v_{-1,i} = 0$. The values proposed by its authors are $\beta_1 = 0.9$, $\beta_2 = 0.999$ and $\eps = 10^{-8}$.
:::

Adam differs from RMSProp in two respects. The numerator is the exponential moving average $m_t$ of the gradients in place of the current gradient, which averages out part of the noise in the stochastic gradients. And both averages are bias corrected as in [[#ema-bias]]. The correction matters most for $v_t$: with $\beta_2 = 0.999$, the uncorrected $v_0$ is $0.001\,\hat g_0^2$, so without correction the first steps would be about $\sqrt{1000} \approx 32$ times too long.

The following properties describe the length of an Adam step. They are stated with $\eps = 0$, which is the idealized method.

:::proposition{#adam-step-size title="Scale Invariance and Bounded Steps of Adam"}
Consider Adam with $\eps = 0$, and suppose $v_{t,i} > 0$.

(i) *Scale invariance.* If every gradient $\hat g_{\tau,i}$, $\tau \leq t$, is replaced by $c\,\hat g_{\tau,i}$ for a constant $c > 0$, the step $\theta_{t+1,i} - \theta_{t,i}$ is unchanged.

(ii) *Constant gradients.* If $\hat g_{\tau,i} = \gamma \neq 0$ for all $\tau \leq t$, then $\theta_{t+1,i} - \theta_{t,i} = -\eta\,\gamma/\abs{\gamma}$: the step has length exactly $\eta$.

(iii) *Bounded steps.* If $\beta_1^2 < \beta_2$, then for every sequence of gradients

$$
\frac{\abs{m_{t,i}}}{\sqrt{v_{t,i}}} \leq \frac{1 - \beta_1}{\sqrt{(1-\beta_2)(1 - \beta_1^2/\beta_2)}} .
$$
:::

:::proof
(i) Both $\hat m_{t,i}$ and $\sqrt{\hat v_{t,i}}$ are multiplied by $c$. (ii) By [[#ema-bias]], $\hat m_{t,i} = \gamma$ and $\hat v_{t,i} = \gamma^2$. (iii) Write $x_k = \hat g_{t-k,i}$. By [[#ema-bias]] and the Cauchy–Schwarz inequality,

$$
m_{t,i}^2 = (1-\beta_1)^2\Big(\sum_{k=0}^t\frac{\beta_1^k}{\beta_2^{k/2}}\cdot\beta_2^{k/2}x_k\Big)^2 \leq (1-\beta_1)^2\Big(\sum_{k=0}^{t}\Big(\frac{\beta_1^2}{\beta_2}\Big)^k\Big)\Big(\sum_{k=0}^t\beta_2^k x_k^2\Big) \leq \frac{(1-\beta_1)^2}{1 - \beta_1^2/\beta_2}\cdot\frac{v_{t,i}}{1-\beta_2} .
$$
:::

For the proposed values of $\beta_1$ and $\beta_2$ the bound in (iii) is about $7.3$. Together these properties say that the length of an Adam step in each coordinate is set by $\eta$ and by how consistent the recent gradients are in sign, and not by how large the gradients are. When recent gradients in a coordinate agree, the step is close to $\eta$. When they alternate in sign, $m_t$ is small relative to $\sqrt{v_t}$ and the step is short. This makes $\eta$ a direct bound on how far each parameter moves per step, which is one reason a single value of $\eta$ works across problems of very different scales. As with AdaGrad ([[#squared-gradients-not-curvature]]), the preconditioner is diagonal and is built from gradient magnitudes, not from curvature.

:::remark{#adam-convergence title="Convergence of Adam"}
The following facts are stated without proof. The convergence proof in the original paper of [Kingma and Ba](https://arxiv.org/abs/1412.6980) contains an error. [Reddi, Kale and Kumar](https://arxiv.org/abs/1904.09237) exhibited a one-dimensional convex problem on which Adam does not converge to the minimizer. The cause is that $v_t$, unlike AdaGrad's $s_t$, can decrease, so the effective step size can increase after a rare large gradient has been forgotten. Their modification, AMSGrad, divides by the running maximum of $\hat v_{t,i}$ and satisfies a bound of the AdaGrad type. In practice the unmodified method is the one in general use.
:::

### Weight decay and AdamW

A common regularizer adds a multiple of $\nm{\theta}^2$ to the objective. For plain gradient descent this is the same as shrinking the parameters at every step. Under a preconditioner the two operations differ.

:::proposition{#weight-decay title="Penalty and Weight Decay Under a Preconditioner"}
Let $f : \R^n \to \R$ be differentiable, $\lambda > 0$, $\eta > 0$, and let $P$ be a symmetric positive definite matrix. Let $f_\lambda(\theta) = f(\theta) + \tfrac{\lambda}{2}\nm{\theta}^2$ and $g = \nabla f(\theta)$.

(i) One step of preconditioned gradient descent on $f_\lambda$ from $\theta$ gives $\theta^{+} = (I - \eta\lambda P)\,\theta - \eta\,P g$.

(ii) One step of preconditioned gradient descent on $f$ followed by **weight decay**, that is, $\theta^{+} = (1 - \eta\lambda)\,\theta - \eta\,Pg$, agrees with (i) for every $\theta$ if and only if $P = I$.
:::

:::proof
(i) $\nabla f_\lambda(\theta) = g + \lambda\theta$, so $\theta^+ = \theta - \eta P(g + \lambda\theta)$. (ii) The two updates differ by $\eta\lambda(P - I)\theta$, which vanishes for every $\theta$ exactly when $P = I$.
:::

With a diagonal preconditioner, the penalty shrinks coordinate $i$ by the factor $1 - \eta\lambda p_i$ in place of $1 - \eta\lambda$. In an adaptive method $p_i$ is small for coordinates with large gradients, so those coordinates are regularized less than the others, and the amount of regularization depends on the gradient history. In Adam the penalty has a further effect, since its gradient $\lambda\theta$ enters the averages $m_t$ and $v_t$. **AdamW**, due to [Loshchilov and Hutter](https://arxiv.org/abs/1711.05101), applies the Adam update [[#adam-update]] to the gradients of $f$ alone and then multiplies the parameters by $1 - \eta\lambda$, so that every coordinate is shrunk at the same rate. It is the standard optimizer for training transformers.

## Practical Devices

The devices of this section are used with all the methods above. They are described in terms of the results of Part I, and no theorems are proved about them. The explanations offered are the accepted heuristics, and should be read as such.

**Step-size decay.** By [[#sgd-nonconvex]], a constant step size $\eta$ leaves a noise floor proportional to $\eta$, and the deterministic term decreases faster when $\eta$ is larger. This suggests a large step size while the gradient is large compared with the noise, and a smaller one later. Common schedules reduce the step size by a constant factor at chosen times (step decay), or continuously along half a period of a cosine from its initial value to zero (cosine decay).

**Warm-up.** A warm-up schedule increases the step size from near zero to its working value over the first few thousand steps. Two reasons are usually given. First, by [[#step-size-cap]] a step decreases $f$ only if $\eta$ is below $2$ divided by the curvature along the step, and at a random initialization the curvature in some directions can be much larger than it is later in training, so a step size that is stable later can be unstable at the start. Second, in Adam the average $v_t$ is formed from very few gradients in the first steps, so the preconditioner is unreliable there, and short steps limit the damage.

**Gradient clipping.** Clipping replaces the stochastic gradient $\hat g_t$ by

$$
\hat g_t\,\min\Big(1,\, \frac{c}{\nm{\hat g_t}}\Big)
$$

for a threshold $c > 0$. The direction is unchanged and the length of an SGD step is at most $\eta c$. Its purpose is to survive regions where the gradient changes very quickly: there the step $\eta\hat g_t$ exceeds what the local curvature permits in the sense of [[#step-size-cap]], and a single such step can undo much previous progress. Clipping bounds the length of the step without requiring the small step size everywhere.

## Summary

**Curvature.** The curvature of $f$ at a point in a unit direction $u$ is $u^TH u$ ([[#slope-curvature]]). Its extreme values over directions are the extreme eigenvalues of the Hessian ([[#symmetric-facts]]).

**The averaged Hessian.** The gradient changes over a displacement $h$ by $\bar H h$, where $\bar H$ is the average of the Hessians along the segment ([[#gradient-mvt]]). It is symmetric and its eigenvalues obey the same bounds as those of the Hessians averaged ([[#averaged-hessian-properties]]).

**Decoupling.** One gradient step multiplies the component of the gradient along each eigenvector of $\bar H_t$ by $1 - \eta\mu_i$ ([[#decoupling]]). The eigenvectors change from step to step unless the Hessian is constant.

**The inefficiency.** Each direction calls for the step size $1/\mu_i$, and gradient descent has one. The largest curvature caps the step size at $2/L$ ([[#step-size-cap]]), and then directions of curvature $m$ contract by only $1 - m/L$ per step ([[#contraction]]). The number of steps is proportional to $\kappa = L/m$, and this cannot be improved for a fixed step size ([[#sharpness]]). Near a minimizer the rate is set by the eigenvalues of the Hessian there ([[#local-rate]]).

**Preconditioning.** The iteration $\theta_{t+1} = \theta_t - \eta P\nabla f(\theta_t)$ is gradient descent in the coordinates $z = P^{-1/2}\theta$, where the Hessian is $P^{1/2}HP^{1/2}$ ([[#change-of-coordinates]]). Its rate is governed by the condition number in those coordinates ([[#preconditioned-rate]]). With $P = H^{-1}$ every direction receives the reciprocal of its own curvature; this is Newton's method, which converges quadratically near a minimizer ([[#newton-quadratic]]) and requires a positive definite Hessian ([[#newton-needs-pd]]).

**Stochastic gradients.** Noise adds a term to the one-step decrease that does not shrink with the gradient ([[#sgd-one-step]]), which produces a noise floor at constant step size and the rate $1/\sqrt{T}$ ([[#sgd-nonconvex]], [[#sgd-convex]]).

**Adaptive methods.** AdaGrad, RMSProp and Adam are diagonal preconditioners built from the magnitudes of past gradients. AdaGrad's guarantee is within a constant factor of the best fixed diagonal preconditioner's ([[#adagrad-bound]], [[#adagrad-hindsight]]). RMSProp and Adam forget old gradients, at the cost of that guarantee ([[#adam-convergence]]). None of them uses curvature directly, and none can correct ill conditioning that is not aligned with the coordinate axes ([[#diagonal-preconditioners]]).
