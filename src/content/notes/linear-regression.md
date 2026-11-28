---
title: "Linear Regression"
code: LinReg
description: "Least squares as orthogonal projection onto the column space of the design matrix, the properties of the fit that follow from it, weighted least squares, and the Frisch-Waugh-Lovell theorem."
date: 2026-11-26
---

**Reference(s):** [*Probabilistic Machine Learning: An Introduction*](https://probml.github.io/pml-book/book1.html) by Kevin Murphy (Chapter 11); the Wikipedia article on the [Frisch–Waugh–Lovell theorem](https://en.wikipedia.org/wiki/Frisch%E2%80%93Waugh%E2%80%93Lovell_theorem).

This entry develops linear regression from one geometric fact. Fitting a linear model by least squares is the same as finding the point of a subspace closest to a given vector, and that point is the orthogonal projection. The normal equations, the orthogonality of the residuals, the behaviour of the coefficients when features are rescaled, and the Frisch–Waugh–Lovell theorem, which says what a single coefficient in a multiple regression measures, are all consequences of that fact.

Most of the entry is linear algebra and holds for any data, with no probabilistic assumption. A probabilistic model enters in two places only, and is stated explicitly there: to explain where the least squares criterion comes from, and to compute the sampling error of a coefficient. The entry uses inner products, orthogonal complements and orthogonal projections from [[LinAlg]].

## The Least Squares Problem

### Data, predictions, and residuals

The data consist of $N$ examples. Example $n$ has a vector of $D$ features $x_n \in \R^D$ and a response $y_n \in \R$. A linear model predicts the response by a fixed linear combination of the features, $\hat y_n = x_n^T w$, with one weight vector $w \in \R^D$ for all examples. Stacking the examples puts all $N$ predictions into one matrix product.

:::definition{#design-matrix title="Design Matrix, Predictions, Residuals"}
The **design matrix** is the matrix $X \in \R^{N \times D}$ whose $n$-th row is $x_n^T$. Its $j$-th column, written $f_j \in \R^N$, holds the values of feature $j$ across all examples. The **response vector** is $y = (y_1, \ldots, y_N)^T \in \R^N$. For a weight vector $w \in \R^D$, the **prediction vector** is $Xw \in \R^N$, and the **residual vector** is $y - Xw$.
:::

The product $Xw$ can be read in two ways, and both are used throughout.

*By rows.* The $n$-th entry of $Xw$ is $x_n^T w$, the prediction for example $n$. So $Xw$ is the list of all predictions.

*By columns.* $Xw = w_1 f_1 + \cdots + w_D f_D$, a linear combination of the feature columns with the weights as coefficients. So $Xw$ is a point of the subspace of $\R^N$ spanned by the columns of $X$.

:::definition{#intercept-convention title="Convention: The Intercept"}
A model with an intercept, $\hat y_n = b + x_n^T w$, is written in the form $\hat y_n = x_n^T w$ by including among the features one that equals $1$ for every example. The design matrix then has the constant column $\one = (1, \ldots, 1)^T$, and the weight on that column is the intercept. Statements that require an intercept say so explicitly.
:::

:::definition{#least-squares-problem title="Least Squares"}
Let $X \in \R^{N \times D}$ and $y \in \R^N$. The **residual sum of squares** of a weight vector $w \in \R^D$ is

$$
\operatorname{RSS}(w) = \frac12 \sum_{n=1}^N (y_n - x_n^T w)^2 = \frac12 \nm{y - Xw}^2 .
$$
{#rss}

A **least squares estimate** is a minimizer $\hat w$ of $\operatorname{RSS}$. The corresponding **fitted vector** is $\hat y = X \hat w$ and the **residual** is $e = y - \hat y$. Computing $\hat w$ is called **regressing $y$ on $X$**, or ordinary least squares.
:::

### Where the criterion comes from

The squared error is the criterion that maximum likelihood produces when the noise is Gaussian with the same variance for every example.

:::definition{#gaussian-linear-model title="Gaussian Linear Model"}
The **Gaussian linear model** with weights $w \in \R^D$ and noise variance $\sigma^2 > 0$ states that, given the features, the responses are independent with

$$
y_n = x_n^T w + \eps_n, \qquad \eps_n \sim \mathcal{N}(0, \sigma^2) .
$$

The features are conditioned on and are not modelled.
:::

:::proposition{#mle-is-least-squares title="Maximum Likelihood Is Least Squares"}
Under the Gaussian linear model, the negative log-likelihood of the responses given the features is

$$
\operatorname{NLL}(w, \sigma^2) = \frac{1}{\sigma^2} \operatorname{RSS}(w) + \frac{N}{2} \log(2 \pi \sigma^2) .
$$

Consequently, for every value of $\sigma^2$, the weight vectors that maximize the likelihood are exactly the least squares estimates, and they do not depend on $\sigma^2$.
:::

:::proof
The density of $y_n$ is $(2\pi\sigma^2)^{-1/2} \exp\big(-(y_n - x_n^T w)^2 / (2\sigma^2)\big)$. Taking minus the logarithm and summing over the independent responses gives $\frac{1}{2\sigma^2} \sum_n (y_n - x_n^T w)^2 + \frac{N}{2}\log(2\pi\sigma^2)$, which is the stated expression by [[#rss]]. The second term does not involve $w$, and the first is $\operatorname{RSS}(w)$ multiplied by the positive constant $1/\sigma^2$. Multiplying a function by a positive constant does not change where it is minimized.
:::

The least squares problem itself makes no reference to this model. The next two sections concern the problem as stated in [[#least-squares-problem]], for arbitrary $X$ and $y$.

## Least Squares as Orthogonal Projection

### The geometric problem

As $w$ ranges over $\R^D$, the prediction vector $Xw$ ranges over all linear combinations of the columns of $X$. This set is the **column space** of $X$,

$$
\rng(X) = \{ Xw : w \in \R^D \} = \spn\{f_1, \ldots, f_D\} \subseteq \R^N ,
$$

a subspace of $\R^N$. Minimizing $\nm{y - Xw}$ over $w$ therefore splits into two questions. Which point of the subspace $\rng(X)$ is closest to $y$? And which weights produce that point? The first question does not involve the weights at all, and its answer is the orthogonal projection.

:::theorem{#closest-point title="Closest Point in a Subspace"}
Let $U$ be a subspace of $\R^N$ and let $y \in \R^N$.

(i) A point $\hat u \in U$ satisfies $\nm{y - \hat u} \leq \nm{y - u}$ for all $u \in U$ if and only if $y - \hat u$ is orthogonal to every vector of $U$.

(ii) There is exactly one such point. It is the orthogonal projection $P_U y$ of $y$ onto $U$.
:::

:::proof
By the orthogonal decomposition $\R^N = U \oplus U^\perp$ ([[LinAlg:orthogonal-direct-sum-decomposition]]), $y$ can be written as $y = P_U y + r$ with $P_U y \in U$ and $r$ orthogonal to $U$. So a point of $U$ with orthogonal residual exists.

Suppose $\hat u \in U$ and $y - \hat u$ is orthogonal to $U$. For any $u \in U$,

$$
y - u = (y - \hat u) + (\hat u - u) .
$$

The second term lies in $U$ and the first is orthogonal to $U$, so by the Pythagorean theorem ([[LinAlg:pythagorean-cauchy-schwarz]]), $\nm{y - u}^2 = \nm{y - \hat u}^2 + \nm{\hat u - u}^2$. Hence $\nm{y - u} \geq \nm{y - \hat u}$, with equality only when $u = \hat u$. This shows that a point with orthogonal residual is a minimizer, and that it is the only minimizer.

Since $P_U y$ has orthogonal residual, it is the unique minimizer. Any minimizer therefore equals $P_U y$, and so has orthogonal residual. This proves (i) and (ii).
:::

The argument turns on one observation. If the residual is perpendicular to the subspace, then moving to any other point of the subspace adds a leg to a right triangle whose other leg is the residual, and the hypotenuse is longer than either leg.

<figure class="fig">
  <img src="/figures/linear-regression/projection-column-space.svg" alt="A vector y above a plane, its orthogonal projection onto the plane, and the residual perpendicular to the plane">
</figure>

*Least squares with two feature columns $f_1, f_2$. The column space $\rng(X)$ is the plane they span. The fitted vector $\hat y = X \hat w$ is the point of the plane closest to $y$, and the residual $e = y - \hat y$ is perpendicular to the plane, hence to both columns. Any other point $u$ of the plane is farther from $y$, by [[#closest-point]].*

### The normal equations

The orthogonality condition of [[#closest-point]] becomes a linear system for the weights.

:::lemma{#gram-invertible title="Invertibility of the Gram Matrix"}
Let $X \in \R^{N \times D}$. The matrix $X^T X$ is invertible if and only if the columns of $X$ are linearly independent.
:::

:::proof
If $X^T X c = 0$, then $0 = c^T X^T X c = \nm{Xc}^2$, so $Xc = 0$. Conversely $Xc = 0$ implies $X^T X c = 0$. So $X^T X$ and $X$ have the same null space. The square matrix $X^T X$ is invertible exactly when its null space is $\{0\}$, and the columns of $X$ are linearly independent exactly when $Xc = 0$ forces $c = 0$.
:::

We say that $X$ has **full column rank** when its columns are linearly independent.

:::theorem{#normal-equations title="Normal Equations"}
Let $X \in \R^{N \times D}$ and $y \in \R^N$.

(i) A vector $w \in \R^D$ is a least squares estimate if and only if the residual $y - Xw$ is orthogonal to every column of $X$, that is, if and only if

$$
X^T X w = X^T y .
$$
{#normal-eq}

(ii) A least squares estimate exists. All least squares estimates have the same fitted vector $\hat y$, and $\hat y = P_{\rng(X)}\, y$, the orthogonal projection of $y$ onto the column space of $X$.

(iii) If $X$ has full column rank, the least squares estimate is unique and equals $\hat w = (X^T X)^{-1} X^T y$.
:::

:::proof
(i) By definition, $w$ is a least squares estimate exactly when $Xw$ is a point of $\rng(X)$ closest to $y$. By [[#closest-point]](i), this holds exactly when $y - Xw$ is orthogonal to $\rng(X)$. A vector is orthogonal to the span of $f_1, \ldots, f_D$ exactly when it is orthogonal to each $f_j$, and the $D$ conditions $f_j^T (y - Xw) = 0$ are the rows of the equation $X^T (y - Xw) = 0$.

(ii) By [[#closest-point]](ii), the closest point of $\rng(X)$ to $y$ exists, is unique, and equals $P_{\rng(X)}\, y$. Being a point of $\rng(X)$, it equals $Xw$ for at least one $w$, and each such $w$ is a least squares estimate.

(iii) By [[#gram-invertible]], $X^T X$ is invertible, so [[#normal-eq]] has the single solution $(X^T X)^{-1} X^T y$.
:::

The equations [[#normal-eq]] are called the **normal equations**, because they say that the residual is normal (perpendicular) to the column space.

:::remark{#calculus-derivation title="The Same Equations by Calculus"}
Expanding [[#rss]] gives $\operatorname{RSS}(w) = \frac12 w^T X^T X w - w^T X^T y + \frac12 y^T y$, a quadratic function with gradient $X^T X w - X^T y$ and constant Hessian $X^T X$. The normal equations state that the gradient vanishes. The Hessian is positive semidefinite, since $c^T X^T X c = \nm{Xc}^2 \geq 0$, so the function is convex and its stationary points are its minimizers. When least squares is solved by gradient descent, the rate of convergence is governed by the ratio of the largest to the smallest eigenvalue of $X^T X$ ([[GD:contraction]]).
:::

### The projection matrix

When $X$ has full column rank, the fitted vector is $\hat y = X (X^T X)^{-1} X^T y$, a fixed matrix applied to $y$.

:::definition{#projection-and-residual-maker title="Projection Matrix and Residual Maker"}
Let $X \in \R^{N \times D}$ have full column rank. The **projection matrix** (or **hat matrix**) of $X$ and its **residual maker** are the $N \times N$ matrices

$$
P_X = X (X^T X)^{-1} X^T, \qquad M_X = I - P_X .
$$
:::

:::proposition{#projection-matrix-properties title="Properties of the Projection Matrix"}
Let $X \in \R^{N \times D}$ have full column rank, and let $v \in \R^N$.

(i) $P_X v$ is the orthogonal projection of $v$ onto $\rng(X)$, which is the fitted vector from regressing $v$ on $X$. $M_X v$ is the residual of that regression, and is orthogonal to $\rng(X)$.

(ii) $P_X$ and $M_X$ are symmetric, and $P_X^2 = P_X$, $M_X^2 = M_X$.

(iii) $P_X X = X$ and $M_X X = 0$. If $v$ is orthogonal to $\rng(X)$, then $P_X v = 0$ and $M_X v = v$.

(iv) $P_X$ depends only on the column space of $X$. If $Z$ is another matrix with full column rank and $\rng(Z) = \rng(X)$, then $P_Z = P_X$.
:::

:::proof
(i) By [[#normal-equations]](iii) applied to $v$ in place of $y$, the least squares estimate is $(X^T X)^{-1} X^T v$ and the fitted vector is $P_X v$, which by [[#normal-equations]](ii) is the orthogonal projection. The residual is $v - P_X v = M_X v$.

(ii) $(X^T X)^{-1}$ is symmetric because $X^T X$ is, so $P_X^T = P_X$. Next, $P_X^2 = X (X^T X)^{-1} (X^T X) (X^T X)^{-1} X^T = P_X$. Then $M_X$ is symmetric and $M_X^2 = I - 2 P_X + P_X^2 = M_X$.

(iii) $P_X X = X (X^T X)^{-1} X^T X = X$, hence $M_X X = 0$. If $v$ is orthogonal to $\rng(X)$ then $X^T v = 0$, so $P_X v = 0$.

(iv) By (i), $P_X v$ and $P_Z v$ are both the orthogonal projection of $v$ onto the same subspace, which is unique by [[#closest-point]]. So $P_X v = P_Z v$ for every $v$.
:::

In geometric terms, the residual maker removes from a vector everything that the columns of $X$ can account for linearly, and leaves the part perpendicular to them. Applying it to a column of $X$ leaves nothing, and applying it to a vector already perpendicular to the columns changes nothing.

:::corollary{#residual-orthogonality title="Orthogonality of the Residual"}
Let $X \in \R^{N \times D}$, $y \in \R^N$, and let $\hat y$ and $e = y - \hat y$ be the fitted vector and residual of the regression of $y$ on $X$.

(i) $f_j^T e = 0$ for every column $f_j$ of $X$.

(ii) $\hat y^T e = 0$, and $\nm{y}^2 = \nm{\hat y}^2 + \nm{e}^2$.

(iii) If $X$ contains the constant column $\one$, then the residuals sum to zero, $\sum_n e_n = 0$, and the fitted values have the same mean as the responses, $\frac1N \sum_n \hat y_n = \frac1N \sum_n y_n$.
:::

:::proof
(i) is [[#normal-equations]](i). For (ii), $\hat y$ is a combination of the columns, so it is orthogonal to $e$ by (i), and the Pythagorean theorem applies to $y = \hat y + e$. For (iii), take $f_j = \one$ in (i) to get $\one^T e = \sum_n e_n = 0$, and sum the entries of $y = \hat y + e$.
:::

:::remark{#rank-deficient title="Dependent Columns"}
If the columns of $X$ are linearly dependent, the fitted vector is still unique, by [[#normal-equations]](ii), and the weights are not. If $Xc = 0$ with $c \neq 0$, then $\hat w + c$ produces the same fitted vector as $\hat w$. The data determine the point of the column space and cannot determine which of several descriptions of that point to use. The case of columns that are nearly dependent is taken up in [[#fwl-takeaways]].
:::

:::remark{#redundant-feature title="A Redundant Feature Adds Nothing"}
A linear model forms linear combinations of its features. A new feature that is itself a linear combination of the existing ones therefore makes available no prediction vector that was not available already. Precisely, let $X \in \R^{N \times D}$ have full column rank with least squares estimate $\hat w$ for a response $y$, and let $g = Xc$ for some $c \in \R^D$. The matrix $[X \;\; g]$ has the same column space as $X$, so the regression of $y$ on it has the same fitted vector and the same residual. Its least squares estimates are exactly the vectors $(\hat w - tc,\; t)$ with $t \in \R$. Each of these reproduces the fitted vector, since $X(\hat w - tc) + t g = X \hat w$, and conversely $Xa + tg = X \hat w$ gives $X(a + tc) = X \hat w$, hence $a = \hat w - tc$. Any weight $t$ may be placed on the new feature, provided the weights on the others are shifted by $-tc$ to compensate, and the data cannot distinguish among these choices. The redundant feature contributes nothing to the fit, and its only effect is that the weights are no longer unique.
:::

## Properties of the Fit

### Changing the columns without changing the column space

The fitted vector depends only on the column space. The weights describe the fitted vector in terms of a particular set of columns, so they change when the columns do. The following statement makes both halves precise, and the proof of the Frisch–Waugh–Lovell theorem below uses the same two ideas.

:::proposition{#reparametrization title="Invariance Under a Change of Columns"}
Let $X \in \R^{N \times D}$ have full column rank with least squares estimate $\hat w$ for a response $y \in \R^N$. Let $B \in \R^{D \times D}$ be invertible and $Z = XB$. Then $Z$ has full column rank, the regression of $y$ on $Z$ has the same fitted vector and the same residual as the regression of $y$ on $X$, and its least squares estimate is $B^{-1} \hat w$.
:::

:::proof
Each column of $Z$ is a combination of columns of $X$, and since $X = Z B^{-1}$ the converse holds too, so $\rng(Z) = \rng(X)$. If $Zc = 0$ then $X(Bc) = 0$, so $Bc = 0$ and $c = 0$; thus $Z$ has full column rank. Both regressions project $y$ onto the same subspace, so they have the same fitted vector $\hat y$ and the same residual. Finally $Z (B^{-1} \hat w) = X \hat w = \hat y$, and the weights expressing $\hat y$ in terms of the independent columns of $Z$ are unique.
:::

:::corollary{#rescaling-and-shifting title="Rescaling and Shifting a Feature"}
Let $X \in \R^{N \times D}$ have full column rank, with columns $f_1, \ldots, f_D$ and least squares estimate $\hat w$ for a response $y$.

(i) If the column $f_j$ is replaced by $c f_j$ with $c \neq 0$, the fitted vector is unchanged, the weight on that column becomes $\hat w_j / c$, and the other weights are unchanged.

(ii) Suppose $f_1 = \one$. If a column $f_j$ with $j \neq 1$ is replaced by $f_j + a \one$ for a constant $a$, the fitted vector is unchanged, the intercept becomes $\hat w_1 - a \hat w_j$, and all other weights are unchanged.
:::

:::proof
In both cases the new columns span the same space and are independent, as in [[#reparametrization]], so it suffices to exhibit weights that reproduce $\hat y = \sum_k \hat w_k f_k$. For (i), $\hat w_j f_j = (\hat w_j / c)(c f_j)$. For (ii), $\hat w_1 \one + \hat w_j f_j = (\hat w_1 - a \hat w_j) \one + \hat w_j (f_j + a \one)$.
:::

:::remark{#standardization title="Standardizing the Features"}
To **standardize** a feature is to subtract its mean and divide by its standard deviation. By [[#rescaling-and-shifting]], in a model with an intercept this changes none of the predictions of ordinary least squares. It matters for other reasons.

*Conditioning.* Features on very different scales give columns of very different lengths, which makes $X^T X$ ill conditioned and slows iterative solvers. Standardizing rescales each axis separately, so it acts as a diagonal preconditioner ([[GD:diagonal-preconditioners]]).

*Penalties.* Ridge and lasso regression penalize the size of the weights. By [[#rescaling-and-shifting]](i) the size of a weight depends on the units of its feature, so the penalty treats features unequally unless they are first put on a common scale.

*Comparison.* After standardizing, each weight is the change in the prediction per standard deviation of its feature, so the magnitudes of different weights are comparable.

Standardizing rescales the columns individually and does nothing about near-dependence among them.
:::

:::remark{#numerical-solution title="Computing the Estimate"}
The formula $(X^T X)^{-1} X^T y$ is not how the estimate is computed, because forming and inverting $X^T X$ loses accuracy when that matrix is ill conditioned. A standard method factors $X = QR$, where $Q \in \R^{N \times D}$ has orthonormal columns, $Q^T Q = I$, and $R \in \R^{D \times D}$ is upper triangular and invertible. Then $X^T X = R^T R$ and $X^T y = R^T Q^T y$, so the normal equations reduce to the triangular system $R \hat w = Q^T y$, and $P_X = Q Q^T$. When the columns are dependent, the pseudoinverse selects the least squares estimate of smallest norm ([[LinAlg:properties-of-the-pseudoinverse]]).
:::

### Weighted least squares

In [[#mle-is-least-squares]] the noise variance had no effect on the estimate because it was the same for every example. When the variances differ, they do affect it.

:::proposition{#weighted-least-squares title="Weighted Least Squares"}
Suppose that, given the features, the responses are independent with $y_n = x_n^T w + \eps_n$ and $\eps_n \sim \mathcal{N}(0, \sigma_n^2)$, where the variances $\sigma_n^2 > 0$ are known. Let $\lambda_n = 1/\sigma_n^2$ and $\Lambda = \operatorname{diag}(\lambda_1, \ldots, \lambda_N)$, and suppose $X$ has full column rank.

(i) The maximum likelihood estimate of $w$ is the minimizer of the weighted sum of squares $\sum_n \lambda_n (y_n - x_n^T w)^2$.

(ii) It equals the ordinary least squares estimate for the rescaled data $\Lambda^{1/2} X$ and $\Lambda^{1/2} y$, in which row $n$ is divided by $\sigma_n$.

(iii) It is given by $\hat w = (X^T \Lambda X)^{-1} X^T \Lambda y$, and it is unchanged if all the variances are multiplied by a common positive factor.
:::

:::proof
(i) The negative log-likelihood is $\frac12 \sum_n \lambda_n (y_n - x_n^T w)^2 + \frac12 \sum_n \log(2 \pi \sigma_n^2)$, and the second sum does not involve $w$.

(ii) $\sum_n \lambda_n (y_n - x_n^T w)^2 = \nm{\Lambda^{1/2} (y - Xw)}^2 = \nm{\Lambda^{1/2} y - (\Lambda^{1/2} X) w}^2$.

(iii) $\Lambda^{1/2}$ is invertible, so $\Lambda^{1/2} X$ has full column rank, and [[#normal-equations]](iii) gives $\hat w = (X^T \Lambda X)^{-1} X^T \Lambda y$. Multiplying every $\lambda_n$ by the same constant multiplies $X^T \Lambda X$ and $X^T \Lambda y$ by that constant, which cancels.
:::

With a common variance the weights $\lambda_n$ are all equal, the criterion is a constant multiple of $\operatorname{RSS}$, and the constant is irrelevant. With unequal variances the weights cannot be factored out of the sum. A residual on a precisely measured example costs more than the same residual on a noisy one, and the minimizer moves accordingly.

:::example{#inverse-variance-average title="Inverse-Variance Weighted Average"}
Let $X = \one$, so the model is $y_n = \mu + \eps_n$ with a single unknown $\mu$. Then $X^T \Lambda X = \sum_n \lambda_n$ and $X^T \Lambda y = \sum_n \lambda_n y_n$, so

$$
\hat \mu = \frac{\sum_n y_n / \sigma_n^2}{\sum_n 1 / \sigma_n^2} .
$$

Each measurement is weighted by the reciprocal of its variance. With equal variances this is the sample mean.
:::

:::remark{#ols-under-heteroskedasticity title="Ordinary Least Squares with Unequal Variances"}
If the variances are unequal and ordinary least squares is used anyway, the estimate is still unbiased whenever $\E[y] = Xw$, since then $\E[\hat w] = (X^T X)^{-1} X^T X w = w$. It is, however, less precise than the weighted estimate, and the usual formula for its covariance is not valid. These last two statements are not proved here.
:::

## The Frisch–Waugh–Lovell Theorem

Suppose the features are split into two groups. The theorem of this section answers the following question. In a regression on both groups together, what determines the weights on the first group? The answer is that they are the weights obtained by regressing on the first group alone, after everything that the second group can account for linearly has been removed from it.

Throughout this section, $X = [X_1 \;\; X_2] \in \R^{N \times D}$ has full column rank, where $X_1$ consists of $D_1$ of the columns and $X_2$ of the remaining $D_2$. The response is $y \in \R^N$. The least squares estimate for the regression of $y$ on $X$ is written $\hat w = (\hat w_1, \hat w_2)$ with $\hat w_1 \in \R^{D_1}$ and $\hat w_2 \in \R^{D_2}$, so that

$$
\hat y = X_1 \hat w_1 + X_2 \hat w_2, \qquad e = y - \hat y .
$$
{#full-fit}

We call this the **full regression**.

### Residualizing one block on the other

:::definition{#residualized-block title="Residualized Block"}
Let $X = [X_1 \;\; X_2]$ have full column rank and let $M_2 = M_{X_2}$ be the residual maker of $X_2$. The **residualized** block is

$$
\tilde X_1 = M_2 X_1 .
$$

Each column of $\tilde X_1$ is the residual from regressing the corresponding column of $X_1$ on $X_2$. Likewise $\tilde y = M_2 y$ is the residual from regressing $y$ on $X_2$.
:::

Two properties of $\tilde X_1$ follow at once from [[#projection-matrix-properties]] and are used repeatedly.

*Orthogonality.* Every column of $\tilde X_1$ is orthogonal to every column of $X_2$, that is, $X_2^T \tilde X_1 = 0$.

*Relation to the original block.* Each column of $X_1$ is its residual plus its fitted vector, and the fitted vector is a combination of the columns of $X_2$. In matrix form,

$$
X_1 = \tilde X_1 + X_2 A, \qquad A = (X_2^T X_2)^{-1} X_2^T X_1 \in \R^{D_2 \times D_1} .
$$
{#block-split}

The $k$-th column of $A$ holds the weights from regressing the $k$-th column of $X_1$ on $X_2$.

### Three lemmas

The proof of the theorem has three steps, isolated here as lemmas. The first says that residualizing does not change the space being projected onto. The second says that it does not change the weights on the first block. The third is a general fact about projecting onto two orthogonal subspaces at once.

:::lemma{#same-column-space title="Residualizing Preserves the Column Space"}
Let $X = [X_1 \;\; X_2]$ have full column rank and $\tilde X_1 = M_{X_2} X_1$. Then

$$
\rng\big([\tilde X_1 \;\; X_2]\big) = \rng\big([X_1 \;\; X_2]\big),
$$

and the matrix $[\tilde X_1 \;\; X_2]$ has full column rank. In particular $\tilde X_1$ has full column rank.
:::

:::proof
By [[#block-split]], each column of $\tilde X_1$ is a column of $X_1$ minus a combination of columns of $X_2$, so it lies in $\rng(X)$. By the same equation, each column of $X_1$ is a column of $\tilde X_1$ plus a combination of columns of $X_2$, so it lies in $\rng([\tilde X_1 \;\; X_2])$. Each set of columns can be built from the other, so the two column spaces are equal. This space has dimension $D$, because the $D$ columns of $X$ are independent. The $D$ columns of $[\tilde X_1 \;\; X_2]$ span a space of dimension $D$, so they are independent, and so is any subset of them.
:::

:::lemma{#first-block-weights title="The Weights on the First Block Are Unchanged"}
Let $X = [X_1 \;\; X_2]$ have full column rank, let $(\hat w_1, \hat w_2)$ be the least squares estimate for the regression of $y$ on $X$, and let $A$ be as in [[#block-split]]. Then the regression of $y$ on $[\tilde X_1 \;\; X_2]$ has the same fitted vector $\hat y$, and its least squares estimate is $(\hat w_1,\; \hat w_2 + A \hat w_1)$. That is,

$$
\hat y = \tilde X_1 \hat w_1 + X_2 (\hat w_2 + A \hat w_1) .
$$
{#residualized-fit}

:::

:::proof
By [[#same-column-space]] the two regressions project $y$ onto the same subspace, so they have the same fitted vector $\hat y$. Substituting [[#block-split]] into [[#full-fit]],

$$
\hat y = (\tilde X_1 + X_2 A) \hat w_1 + X_2 \hat w_2 = \tilde X_1 \hat w_1 + X_2 (\hat w_2 + A \hat w_1) .
$$

This writes $\hat y$ as a combination of the columns of $[\tilde X_1 \;\; X_2]$. Those columns are independent by [[#same-column-space]], so the weights in such a combination are unique, and they are the least squares estimate.
:::

This lemma is the step at which "the same space" becomes "the same weights". Projecting onto the same subspace gives the same fitted vector, but the weights describing that vector depend on the columns used, and in general they change. Here the weights on the first block survive, because each column of $X_1$ differs from its residualized version only by a vector in the column space of $X_2$, and that difference is absorbed by the weights on $X_2$. Those weights do change, from $\hat w_2$ to $\hat w_2 + A \hat w_1$.

:::lemma{#orthogonal-sum-projection title="Projection onto a Sum of Orthogonal Subspaces"}
Let $U$ and $V$ be subspaces of $\R^N$ such that every vector of $U$ is orthogonal to every vector of $V$, and let $y \in \R^N$.

(i) Every vector of $U + V$ can be written as $u + v$ with $u \in U$ and $v \in V$ in exactly one way.

(ii) The orthogonal projection of $y$ onto $U + V$ is the sum of its projections onto $U$ and onto $V$,

$$
P_{U + V}\, y = P_U y + P_V y .
$$
:::

:::proof
(i) If $u + v = u' + v'$ with $u, u' \in U$ and $v, v' \in V$, then $u - u' = v' - v$ lies in both $U$ and $V$. A vector in both is orthogonal to itself, so it is zero. Hence $u = u'$ and $v = v'$.

(ii) The vector $P_U y + P_V y$ lies in $U + V$. By [[#closest-point]], it remains to show that $y - P_U y - P_V y$ is orthogonal to $U + V$. Write it as $(y - P_U y) - P_V y$. The first part is orthogonal to $U$ because $P_U y$ is the projection onto $U$. The second part lies in $V$, hence is orthogonal to $U$. So the whole vector is orthogonal to $U$. Exchanging the roles of $U$ and $V$, it is orthogonal to $V$. A vector orthogonal to both $U$ and $V$ is orthogonal to every sum $u + v$.
:::

The lemma fails without orthogonality. If $U$ and $V$ are not orthogonal, the projection onto $U$ already has a component along $V$, and adding the projection onto $V$ counts that component twice.

### The theorem

:::theorem{#fwl title="Frisch–Waugh–Lovell"}
Let $X = [X_1 \;\; X_2] \in \R^{N \times D}$ have full column rank and let $y \in \R^N$. Let $(\hat w_1, \hat w_2)$ be the least squares estimate and $e$ the residual of the full regression of $y$ on $X$. Let $M_2$ be the residual maker of $X_2$, and let $\tilde X_1 = M_2 X_1$ and $\tilde y = M_2 y$.

(i) The regression of $y$ on $\tilde X_1$ alone has least squares estimate $\hat w_1$.

(ii) The regression of $\tilde y$ on $\tilde X_1$ has least squares estimate $\hat w_1$ and residual $e$.

In formulas,

$$
\hat w_1 = (\tilde X_1^T \tilde X_1)^{-1} \tilde X_1^T y = (\tilde X_1^T \tilde X_1)^{-1} \tilde X_1^T \tilde y .
$$
{#fwl-formula}

:::

:::proof
Let $U = \rng(\tilde X_1)$ and $V = \rng(X_2)$. Every vector of $U$ is orthogonal to every vector of $V$, because $X_2^T \tilde X_1 = 0$. By [[#same-column-space]], $U + V = \rng(X)$.

*Two descriptions of the fitted vector.* The fitted vector $\hat y$ of the full regression is the projection of $y$ onto $\rng(X) = U + V$. By [[#orthogonal-sum-projection]](ii),

$$
\hat y = P_U y + P_V y .
$$

By [[#first-block-weights]],

$$
\hat y = \tilde X_1 \hat w_1 + X_2 (\hat w_2 + A \hat w_1) .
$$

Each expression writes $\hat y$ as a vector of $U$ plus a vector of $V$. By [[#orthogonal-sum-projection]](i) there is only one way to do this, so the parts agree,

$$
\tilde X_1 \hat w_1 = P_U y, \qquad X_2 (\hat w_2 + A \hat w_1) = P_V y .
$$
{#two-components}

*Proof of (i).* The regression of $y$ on $\tilde X_1$ has fitted vector $P_U y$, by [[#normal-equations]](ii). The first equation of [[#two-components]] says that the weights $\hat w_1$ produce this fitted vector. Since $\tilde X_1$ has full column rank by [[#same-column-space]], the weights producing it are unique. So $\hat w_1$ is the least squares estimate of that regression.

*Proof of (ii).* The vectors $y$ and $\tilde y$ differ by $y - \tilde y = P_V y$, which lies in $V$ and is therefore orthogonal to $U$. Its projection onto $U$ is zero, so $P_U \tilde y = P_U y = \tilde X_1 \hat w_1$. As in (i), $\hat w_1$ is the least squares estimate of the regression of $\tilde y$ on $\tilde X_1$. Its residual is

$$
\tilde y - \tilde X_1 \hat w_1 = (y - P_V y) - P_U y = y - \hat y = e .
$$

The formulas [[#fwl-formula]] are [[#normal-equations]](iii) applied to the two regressions.
:::

In words, the weights on $X_1$ in the full regression are found by removing from $X_1$ everything that $X_2$ can account for linearly, and regressing $y$ on what remains. Whether the same removal is applied to $y$ makes no difference to the weights, because the part of $y$ that is removed lies in the column space of $X_2$, which is perpendicular to the residualized columns and so contributes nothing to a regression on them. Removing it does make the residual of the small regression equal to the residual of the full one.

<figure class="fig">
  <img src="/figures/linear-regression/fwl-decomposition.svg" alt="The fitted vector in the plane of two feature columns, decomposed once along the two original columns and once along the residualized first column and the second column">
</figure>

*The plane $\rng(X)$ for two feature columns $f_1$ and $f_2$, with $X_1 = f_1$ and $X_2 = f_2$. The residualized column $\tilde f_1$ is the part of $f_1$ perpendicular to $f_2$. The fitted vector $\hat y$ is decomposed in two ways. Along $f_1$ and $f_2$ (dashed parallelogram) it is $\hat w_1 f_1 + \hat w_2 f_2$. Along $\tilde f_1$ and $f_2$ (dotted rectangle) it is $\hat w_1 \tilde f_1 + (\hat w_2 + A \hat w_1) f_2$. The vectors $\hat w_1 f_1$ and $\hat w_1 \tilde f_1$ have the same height above the line of $f_2$, which is why the weight $\hat w_1$ is the same in both, as in [[#first-block-weights]]. Since $\tilde f_1 \perp f_2$, the component $\hat w_1 \tilde f_1$ is the projection of $\hat y$, and hence of $y$, onto the line of $\tilde f_1$.*

### Consequences

The first consequence is the case in which the first block is a single column.

:::corollary{#single-coefficient title="A Single Weight as a Simple Regression"}
Let $X \in \R^{N \times D}$ have full column rank with columns $f_1, \ldots, f_D$, and let $\hat w$ be the least squares estimate for a response $y$. For each $j$, let $\tilde f_j$ be the residual from regressing $f_j$ on the other $D - 1$ columns. Then

$$
\hat w_j = \frac{\tilde f_j^T y}{\nm{\tilde f_j}^2} .
$$
:::

:::proof
Apply [[#fwl]](i) with $X_1 = f_j$ and $X_2$ the matrix of the other columns. Then $\tilde X_1 = \tilde f_j$ is a single column and [[#fwl-formula]] reads $\hat w_j = (\tilde f_j^T \tilde f_j)^{-1} \tilde f_j^T y$.
:::

The second is the case in which the second block is the constant column. It shows that fitting an intercept is the same as centering the data.

:::corollary{#centering title="The Intercept and Centering"}
Let $X = [F \;\; \one] \in \R^{N \times D}$ have full column rank, where $F \in \R^{N \times (D-1)}$ holds the non-constant features. Let $\hat w$ be the weights on $F$ and $\hat b$ the intercept in the regression of $y$ on $X$. Let $\bar y = \frac1N \sum_n y_n$, let $m \in \R^{D-1}$ be the vector of column means of $F$, and let $F_c = F - \one m^T$ and $y_c = y - \bar y \one$ be the centered features and responses. Then

$$
\hat w = (F_c^T F_c)^{-1} F_c^T y_c, \qquad \hat b = \bar y - m^T \hat w .
$$

For a single feature with values $x_1, \ldots, x_N$ and mean $\bar x$, the slope is

$$
\hat w = \frac{\sum_n (x_n - \bar x)(y_n - \bar y)}{\sum_n (x_n - \bar x)^2} .
$$
:::

:::proof
Take $X_1 = F$ and $X_2 = \one$. The projection of a vector $v$ onto the line spanned by $\one$ is $\one (\one^T \one)^{-1} \one^T v = \bar v \one$, where $\bar v$ is the mean of the entries of $v$. So the residual maker of $\one$ subtracts the mean, $\tilde X_1 = F_c$ and $\tilde y = y_c$, and [[#fwl-formula]] gives the formula for $\hat w$. Here $A = (\one^T \one)^{-1} \one^T F = m^T$, so the second equation of [[#two-components]] reads $\one (\hat b + m^T \hat w) = \bar y \one$, which gives $\hat b$. The single-feature formula is the case $D = 2$.
:::

The third describes what happens to the weights on one block when the other block is left out of the regression.

:::corollary{#omitted-block title="Omitting a Block"}
Let $X = [X_1 \;\; X_2]$ have full column rank, let $(\hat w_1, \hat w_2)$ be the least squares estimate for the regression of $y$ on $X$, and let $A = (X_2^T X_2)^{-1} X_2^T X_1$. The regression of $y$ on $X_2$ alone has least squares estimate

$$
\hat w_2 + A \hat w_1 .
$$
:::

:::proof
The regression of $y$ on $X_2$ has fitted vector $P_V y$ with $V = \rng(X_2)$. By the second equation of [[#two-components]], the weights $\hat w_2 + A \hat w_1$ produce it, and $X_2$ has full column rank.
:::

The last consequence requires a model for the responses, and gives the precision of the weights.

:::proposition{#weight-sampling-error title="Sampling Error of the Weights on a Block"}
Let $X = [X_1 \;\; X_2]$ be a fixed matrix with full column rank, and suppose $y = X_1 w_1 + X_2 w_2 + \eps$, where $\eps$ is a random vector with $\E[\eps] = 0$ and $\Cov(\eps) = \sigma^2 I$. Then the least squares estimate satisfies

$$
\hat w_1 = w_1 + (\tilde X_1^T \tilde X_1)^{-1} \tilde X_1^T \eps, \qquad \E[\hat w_1] = w_1, \qquad \Cov(\hat w_1) = \sigma^2 (\tilde X_1^T \tilde X_1)^{-1} .
$$

In particular, for a single column $f_j$ with residualized version $\tilde f_j$ as in [[#single-coefficient]], $\Var(\hat w_j) = \sigma^2 / \nm{\tilde f_j}^2$.
:::

:::proof
Substitute the model into [[#fwl-formula]]. Since $\tilde X_1^T X_2 = 0$, and by [[#block-split]] $\tilde X_1^T X_1 = \tilde X_1^T \tilde X_1 + \tilde X_1^T X_2 A = \tilde X_1^T \tilde X_1$,

$$
\tilde X_1^T y = \tilde X_1^T \tilde X_1\, w_1 + \tilde X_1^T \eps ,
$$

which gives the first formula. The expectation follows from $\E[\eps] = 0$. Writing $G = (\tilde X_1^T \tilde X_1)^{-1} \tilde X_1^T$, the covariance of $G \eps$ is $G (\sigma^2 I) G^T = \sigma^2 (\tilde X_1^T \tilde X_1)^{-1}$.
:::

:::remark{#fwl-takeaways title="Consequences and Takeaways"}
*What "holding the other features constant" means.* By [[#single-coefficient]], the weight $\hat w_j$ in a multiple regression is the slope of a regression through the origin of $y$ on the single vector $\tilde f_j$. That vector is the variation in feature $j$ that the other features cannot predict linearly. The weight measures how the response moves with that part of the feature and with nothing else.

*A weight belongs to a feature within a set of features.* The vector $\tilde f_j$ depends on which other columns are present. Adding or removing a feature changes $\tilde f_j$ for every $j$, and with it the weights. By [[#omitted-block]], leaving out the block $X_1$ changes the weights on $X_2$ by $A \hat w_1$. They are unaffected only when $A \hat w_1 = 0$, which holds in particular if the omitted features are orthogonal to the retained ones, so that $A = 0$, or have zero weight. This identity is the source of omitted-variable bias.

*Orthogonal blocks do not interact.* If $X_1^T X_2 = 0$ then $\tilde X_1 = X_1$, and the weights on each block are those obtained by regressing on that block alone.

*Near-dependence makes a weight imprecise.* If feature $j$ is almost a linear combination of the others, $\tilde f_j$ is short. By [[#weight-sampling-error]], the variance of $\hat w_j$ is $\sigma^2 / \nm{\tilde f_j}^2$, which is then large. The weight is determined by a small amount of variation, so small changes in $y$ move it a great deal. In the limit of exact dependence $\tilde f_j = 0$ and the weight is undetermined, as in [[#rank-deficient]].

*Residualizing the response is optional for the weights.* By [[#fwl]], the regressions of $y$ and of $\tilde y$ on $\tilde X_1$ give the same weights. Only the second reproduces the residual of the full regression.

*The scope of the theorem.* The theorem is an identity of linear algebra. It holds for every $X$ of full column rank and every $y$, with no assumption about noise or about the correctness of the model. The removal of the influence of $X_2$ is linear and removes nothing else. Whether a weight has a causal meaning is a separate question that the theorem does not address.
:::
