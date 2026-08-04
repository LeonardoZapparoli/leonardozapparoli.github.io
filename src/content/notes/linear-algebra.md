---
title: "Linear Algebra"
code: LinAlg
description: "Finite-dimensional linear algebra: vector spaces, linear maps, spectral theory, and matrix factorizations."
date: 2026-07-30
---

**Reference:** [*Linear Algebra Done Right*](https://linear.axler.net/LADR4e.pdf) by Sheldon Axler.

## Vector Spaces

:::definition{#vector-space-over-a-field title="Vector Space over a Field $\F$"}
A **vector space** $V$ over a field $\F$ (usually $\R$ or $\C$ in this document) is a set equipped with addition and scalar multiplication satisfying eight axioms (commutativity, associativity, distributivity, additive/multiplicative identities and inverses). Elements of $V$ are **vectors**; elements of $\F$ are **scalars**. Vector spaces are closed under **linear combinations**, meaning for any set of vectors $v_1,...,v_k \in V$ and scalars $a_1,...,a_k \in \F$, the element $\sum_i a_iv_i$ is again an element of the vector space.
:::

Many times we are interested in vector spaces that are nested within a larger vector space. These are called subspaces.

:::definition{#subspace title="Subspace"}
$U \subseteq V$ is a **subspace** iff it satisfies three conditions:

(1) $0 \in U$; (2) closed under addition; (3) closed under scalar multiplication.

Checking these three conditions is sufficient; the remaining vector space axioms are automatically inherited from $V$.
:::

:::definition{#sum-and-direct-sum-of-subspaces title="Sum and Direct Sum of Subspaces"}
The **sum** of subspaces $V_1,\ldots,V_m \subseteq V$ is the set of all element-wise sums:

$$
V_1 + \cdots + V_m \;=\; \{v_1 + \cdots + v_m \;\mid\; v_i \in V_i\;\forall i\}.
$$

The sum is said to be a **direct sum**, written $V_1 \oplus \cdots \oplus V_m$, iff every element has a *unique* decomposition as $v_1 + \cdots + v_m$ — equivalently, iff **the only way to write $0$ is $0 + \cdots + 0$**.

**Two subspaces:** $U + W$ is direct $\iff U \cap W = \{0\}$. (This clean criterion fails for three or more subspaces.)

*Intuition: a direct sum is a decomposition with zero redundancy. The canonical example ([[#orthogonal-direct-sum-decomposition]]) is $V = U \oplus U^\perp$. For instance, the Euclidean plane $\R^2$ is a direct sum of the $x$- and $y$-axes.*
:::

:::definition{#span-linear-independence-basis-dimension title="Span, Linear Independence, Basis, Dimension"}
**Span:** $\spn(v_1,\ldots,v_m)$ = all linear combinations of the $v_i$, i.e. "everything you can reach." Always a subspace.

**Linear independence:** $v_1,\ldots,v_n$ are linearly independent iff $\sum a_i v_i = 0 \Rightarrow a_1 = \cdots = a_n = 0$, meaning the only way to write the $0$ vector is as a sum of zeros. Equivalently: there is a *unique* way to write any given vector in $\spn(v_1,..,v_n)$.

**Basis:** A linearly independent spanning list. Equivalently: every $v \in V$ is *uniquely* $v = \sum a_i v_i$.

**Dimension:** Any two bases have the same length, called $\dim V$.
:::

The following lemma is incredibly intuitive yet powerful. It says, in words, that if a list of vectors is redundant in the sense of linear dependence, you can find a *first* redundant one whose removal doesn't affect the span.

:::lemma{#linear-independence-lemma title="Linear Independence Lemma"}
If $v_1,\ldots,v_m$ is linearly *dependent*, then $\exists\, k$ with $v_k \in \spn(v_1,\ldots,v_{k-1})$. Removing $v_k$ leaves the span unchanged.
:::

:::proof
Dependence gives a nontrivial relation $\sum_{i=1}^m a_i v_i = 0$. Let $k$ be the *largest* index with $a_k \neq 0$. Rearranging:

$$
v_k = -\frac{a_1}{a_k}v_1 - \cdots - \frac{a_{k-1}}{a_k}v_{k-1}.
$$

So $v_k$ lies in the span of its predecessors and is therefore redundant: any linear combination using $v_k$ can substitute the expression above, leaving the span unchanged.
:::

:::theorem{#length-of-lin-indep-list-length title="Length of Lin. Indep. List $\leq$ Length of Spanning List"}
In any finite-dimensional $V$: every linearly independent list has length $\leq$ every spanning list.
:::

:::proof
*Exchange argument.* Start with a spanning list $w_1,\ldots,w_n$. Take the linearly independent list $v_1,\ldots,v_m$. Insert $v_1$ at the front: $v_1, w_1,\ldots,w_n$ is spanning and now linearly dependent (since $v_1 \in \spn\{w_i\}$). By the Independence Lemma, some $w_j$ can be removed while preserving the span. Repeat: insert $v_2$, remove some $w_{j'}$. After $m$ steps we have inserted all $v_i$ and removed $m$ of the $w$'s. Since we never run out of $w$'s, $m \leq n$.
:::

:::theorem{#basis-existence-and-dimension-facts title="Basis Existence and Dimension Facts"}
The following results are used constantly and should be internalized.

1. **Any two bases have the same length.**
2. **Every spanning list contains a basis.**
3. **Every linearly independent list extends to a basis.**
4. **A linearly independent list of length $\dim V$ is already a basis.**
5. **A spanning list of length $\dim V$ is already a basis.**

:::

:::proof
(1): *Any two bases have the same length.* Let $B_1$ and $B_2$ be two bases of $V$. Since $B_1$ is linearly independent and $B_2$ spans $V$, the length inequality gives $|B_1| \leq |B_2|$. By symmetry $|B_2| \leq |B_1|$. Hence $|B_1| = |B_2|$.

(2): *Every spanning list contains a basis.* Given a spanning list, if it is already linearly independent we are done. Otherwise, apply the Independence Lemma: remove a redundant vector without changing the span. Since each step keeps the span unchanged, the process cannot go on indefinitely (the empty list has no span) and must terminate. When it terminates, we are left with a linearly independent list that is spanning; i.e. a basis.

(3): *Every linearly independent list extends to a basis.* Start with a linearly independent list $v_1,\ldots,v_m$. If it already spans $V$, done. Otherwise pick $w \notin \spn(v_1,\ldots,v_m)$ and append it. The extended list is still linearly independent (if a combination including $w$ vanished, we could solve for $w$ in terms of the others, contradicting $w \notin \spn$). Repeat until spanning. This terminates because any linearly independent list has length $\leq \dim V$.

(4) and (5): A linearly independent list of length $\dim V$ automatically spans $V$ (since adding any vector would make the list too long to be independent, hence that vector is already in the span). Dually, a spanning list of length $\dim V$ must be linearly independent (since a dependent spanning list contains a basis of length $< \dim V$, contradicting (1)).
:::

:::theorem{#dimension-of-a-sum-of-subspaces title="Dimension of a Sum of Subspaces"}
For subspaces $U$ and $W$ of $V$:

$$
\dim(U + W) = \dim U + \dim W - \dim(U \cap W).
$$

:::

:::proof
Let $u_1,\ldots,u_k$ be a basis of $U \cap W$. Extend to a basis $u_1,\ldots,u_k, v_1,\ldots,v_r$ of $U$, and to a basis $u_1,\ldots,u_k, w_1,\ldots,w_s$ of $W$. One checks that $u_1,\ldots,u_k,v_1,\ldots,v_r,w_1,\ldots,w_s$ is a basis for $U+W$ (spanning is clear; linear independence requires verifying that any dependence forces all coefficients to vanish, using the fact that a combination of $w_j$'s equals a combination of $u_i$'s and $v_j$'s, hence lies in $W \cap U = \spn\{u_i\}$). The count gives $\dim(U+W) = k + r + s = (k+r) + (k+s) - k = \dim U + \dim W - \dim(U \cap W)$.
:::

## Linear Maps

Linear maps constitute the heart of Linear Algebra. These are functions from one vector space to another that preserve the domain space's structure.

:::definition{#linear-map-and-operator title="Linear Map and Operator"}
$T : V \to W$ is a **linear map** (write $T \in \Lcal(V,W)$) iff:

$$
T(u + v) = Tu + Tv \qquad\text{and}\qquad T(\lambda v) = \lambda Tv \qquad \forall u,v \in V,\; \lambda \in \F.
$$

If $V = W$, $T$ is an **operator** and we write $T \in \Lcal(V)$. The space $\Lcal(V,W)$ is itself a vector space.
:::

:::lemma{#linear-map-lemma title="Linear Map Lemma"}
Given a basis $v_1,\ldots,v_n$ of $V$ and *any* vectors $w_1,\ldots,w_n \in W$, there exists a **unique** $T \in \Lcal(V,W)$ with $Tv_i = w_i$ for all $i$.
:::

:::proof
Define $T\bigl(\sum_i a_i v_i\bigr) := \sum_i a_i w_i$; this is clearly linear. Uniqueness: two linear maps that agree on a basis agree on every linear combination, hence on all of $V$.

*Significance:* A linear map is completely determined by where it sends a set of basis vectors, and there is *total freedom* in that choice. This is why "define $T$ by $Tv_i = w_i$" is a valid proof technique throughout linear algebra.
:::

:::definition{#null-space-and-range title="Null Space and Range"}
For $T \in \Lcal(V,W)$:

$$
\nul(T) = \{v \in V : Tv = 0\} \subseteq V, \qquad \rng(T) = \{Tv : v \in V\} \subseteq W.
$$

Both are subspaces. $T$ **injective** $\iff \nul(T) = \{0\}$;  $T$ **surjective** $\iff \rng(T) = W$.
:::

The following result is so important that it is named a *Fundamental Theorem*.

:::theorem{#fundamental-theorem-of-linear-maps-rank title="Fundamental Theorem of Linear Maps (Rank-Nullity)"}
For $T \in \Lcal(V,W)$ with $V$ finite-dimensional:

$$
\boxed{\dim V \;=\; \dim\nul(T) \;+\; \dim\rng(T).}
$$

In words: dimension of domain = (dimensions destroyed) + (dimensions created).
:::

:::proof
Let $u_1,\ldots,u_m$ be a basis of $\nul(T)$, so that $\dim\nul(T) = m$. Extend this to a basis of $V$: $u_1,\ldots,u_m,v_1,\ldots,v_k$. This is possible by [[#basis-existence-and-dimension-facts]].

**Claim:** $Tv_1,\ldots,Tv_k$ is a basis for $\rng(T)$.

*Spanning:* Any $Tv \in \rng(T)$ with $v = \sum a_i u_i + \sum b_j v_j$ gives $Tv = \sum b_j Tv_j$ (the null-space components vanish under $T$).

*Linear independence:* If $\sum b_j Tv_j = 0$, then $T\bigl(\sum b_j v_j\bigr) = 0$, so $\sum b_j v_j \in \nul(T) = \spn\{u_i\}$. But $\{u_i, v_j\}$ is a basis of $V$, so all coefficients must be 0, giving all $b_j = 0$.

Therefore $\dim\rng(T) = k$, and $\dim V = m + k = \dim\nul(T) + \dim\rng(T)$.
:::

:::corollary{#corollaries-of-rank-nullity title="Corollaries of Rank-Nullity"}

- $\dim V > \dim W$: $T$ is never injective (null space must be nontrivial).
- $\dim V < \dim W$: $T$ is never surjective (range can't fill $W$).
- $T \in \Lcal(V)$ (same domain and codomain): injective $\iff$ surjective $\iff$ invertible. *This is why square matrices are either invertible or singular.*

:::

### The Matrix of a Linear Map

The following definition is among the most central of ideas. Viewing matrices as encoding linear transformations *with respect to specific bases of the domain and codomain*, rather than as a bunch of numbers, makes all subsequent statements about them arise far more naturally. 

:::definition{#matrix-of-a-linear-map title="Matrix of a Linear Map"}
Let $T \in \Lcal(V,W)$ with bases $\{v_k\}_{k=1}^n$ for $V$ and $\{w_j\}_{j=1}^m$ for $W$. The **matrix of $T$ with respect to these bases**, written $\Mop(T, (v_1,\dots,v_n), (w_1,\dots,w_m))$, is the $m \times n$ matrix whose $(j,k)$-entry is defined by:

$$
Tv_k = \sum_{j=1}^m \Mop(T)_{j,k}\; w_j \qquad \text{for each } k = 1,\ldots,n.
$$

**Column $k$ of $\Mop(T)$ = the coordinates of $Tv_k$ in the $\{w_j\}$-basis.**
:::

One can define addition and scalar multiplication with matrices in the obvious way. 

Suppose $S,T \in \Lcal(V,W)$ and $\lambda \in \F$. There are two immediate conclusions we can draw from this definition:
1. $\Mop(S+T) = \Mop(S)+\Mop(T)$
2. $\Mop(\lambda T) = \lambda\Mop(T)$

These show the matrix representation itself is linear. 

:::definition{#matrix-of-a-vector title="Matrix of a Vector"}
Let $V$ be a vector space with basis $\{v_k\}_{k=1}^n$. Let $v \in V$ with respresentation $v = \sum_i b_i v_i$ with respect to this basis. The **matrix of vector $v$ with respect to this basis** is the coordinate column vector $\Mop(v) = (b_1,\ldots,b_n)^T$.
:::

:::definition{#matrix-vector-multiplication title="Muplication of the matrix of a linear map and the matrix of a vector"}
Let $T, \Mop(T), \Mop(v)$ be defined as in the preceding two definitions. The multiplication of $\Mop(T)$ and $\Mop(v)$ is defined as the linear combination of the columns of $\Mop(T)$ with column $i$ receiving weight corresponding to the $i$-th row of $\Mop(v)$.
:::

The picture below tells the full story. $\Mop(T)$ is an $m \times n$ array of numbers whose $k$-th column stores $\Mop(Tv_k)$, the image of the $k$-th domain basis vector under the linear transformation $T$, encoded in the codomain basis $\{w_j\}$. 

Multiplication of the matrix of a linear map $\Mop(T)$ by the matrix of a vector $\Mop(v)$ is *defined* so as to produce the matrix of the image vector $\Mop(Tv)$, **with respect to the chosen codomain basis**. See [[#action-of-a-linear-map-matrix]]. Note that this will only be the case when the domain basis assumed by $\Mop(T)$ matches the basis assumed by $\Mop(v)$.


<figure class="fig">
  <img src="/figures/linear-algebra/matrix-of-linear-map.svg" alt="The matrix of a linear map acting on a coordinate vector">
</figure>

:::theorem{#action-of-a-linear-map-matrix title="Action of a Linear Map = Matrix Multiplication: $\Mop(Tv) = \Mop(T)\Mop(v)$"}
With any choice of bases for $V$ and $W$: the matrix of $Tv$ (the output vector's coordinates) equals $\Mop(T)$ times the matrix of $v$ (the input vector's coordinates). That is, applying $T$ to a vector corresponds to multiplying its coordinate vector by $\Mop(T)$.
:::

:::proof
Reading the result column and using linearity twice:

$$
\Mop(T)\,\Mop(v)
  \;=\; b_1 \Mop(Tv_1) + \cdots + b_n \Mop(Tv_n)
  \;=\; \Mop\bigl(b_1 Tv_1 + \cdots + b_n Tv_n\bigr)
  \;=\; \Mop(Tv).
$$

The first equality is the "linear combination of columns" view of matrix–vector multiplication (visible in the diagram); the second is linearity of the coordinate map $\Mop(\cdot)$; the third is linearity of $T$ applied to $v = \sum_k b_k v_k$.
:::

:::theorem{#matrix-multiplication-represents-composition title="Matrix Multiplication Represents Composition: $\Mop(ST) = \Mop(S)\Mop(T)$"}
Matrix multiplication is **defined so as to** satisfy $\Mop(S \circ T) = \Mop(S)\Mop(T)$. This is the fundamental justification for the definition.
:::

:::proof
Let $T : U \to V$, $S : V \to W$. Choose bases $\{u_\ell\}$, $\{v_i\}$, $\{w_j\}$. 

We know column $k$ of $\Mop(T)$ is defined to be $\Mop(Tu_k)$, the representation of $Tu_k$ in the $\{v_i\}$ basis. Column $k$ of $\Mop(S)\Mop(T)$ will therefore be equal to $\Mop(S)\Mop(Tu_k)$, by the definition of matrix multiplication. Applying [[#action-of-a-linear-map-matrix]], this tells us column $k$ of $\Mop(S)\Mop(T)$ is $\Mop(S(Tu_k))$, which by associativity of linear maps is equal to $\Mop((ST)u_k)$. By definition, then $\Mop(S)\Mop(T)$ is the matrix of the linear map $ST$; that is, $\Mop(S)\Mop(T)=\Mop(ST)$.
:::

:::remark
Three views of matrix multiplication worth memorizing:

- Entry $(j,k)$ of $AB$ = dot product of row $j$ of $A$ with column $k$ of $B$.
- Column $k$ of $AB$ = $A$ times column $k$ of $B$.
- $Ab$ = linear combination of the columns of $A$ with coefficients from $b$.
:::

:::theorem{#column-rank-row-rank title="Column Rank $=$ Row Rank"}
For any $m \times n$ matrix $A$: $\dim(\text{span of columns}) = \dim(\text{span of rows})$, and both equal $\dim\rng(T_A)$ where $T_A : \F^n \to \F^m$ is the associated linear map.
:::

:::proof
This follows cleanly from adjoint theory ([[#null-range-adjoint]]): $\dim\rng(T) = \dim\rng(T^*)$ (proved using $\nul(T^*) = (\rng T)^\perp$). The column rank is $\dim\rng(T)$; the row rank is $\dim\rng(T^T) = \dim\rng(T^*)$. They are equal.
:::

### Change of Basis

:::theorem{#change-of-basis title="Change of Basis"}
Let $\varepsilon = (e_1,\ldots,e_n)$ be the standard basis and $\beta = (v_1,\ldots,v_n)$ any other basis of $V = \R^n$. Write $[T]_\varepsilon$ for the matrix of $T$ in the standard basis, and $[T]_\beta$ for the matrix of $T$ in the $\beta$-basis. Define $Q \in \R^{n\times n}$ to be the **change-of-basis matrix**:

$$
Q_{jk} = (v_k)_j, \qquad \text{i.e., column } k \text{ of } Q = v_k \text{ (coordinates of } v_k \text{ in the standard basis)}.
$$

Then:

$$
[T]_\beta \;=\; Q^{-1}[T]_\varepsilon\, Q.
$$

If $\beta$ is orthonormal, $Q$ is orthogonal ($Q^{-1} = Q^T$), giving $[T]_\beta = Q^T[T]_\varepsilon\, Q$.
:::

:::proof
**What $Q$ does:** Since column $k$ of $Q$ is $v_k$, we have $Qe_k = v_k$ for each $k$. So $Q$ is the matrix of the identity map $I : \R^n \to \R^n$ when the *input* is described in the $\beta$-basis and the *output* is described in the $\varepsilon$-basis. In other words, $Q$ converts $\beta$-coordinates into $\varepsilon$-coordinates:

$$
Q \cdot [\text{coords of }v\text{ in }\beta] \;=\; [\text{coords of }v\text{ in }\varepsilon].
$$

Consequently $Q^{-1}$ converts in the opposite direction: from $\varepsilon$-coordinates to $\beta$-coordinates.

**Proof of the formula.** To find $[T]_\beta$, we must express the action of $T$ entirely in $\beta$-coordinates. Given a vector $v$ with $\beta$-coordinate vector $x$ (so $v = Qx$ in $\varepsilon$-coordinates), the output $Tv$ has $\varepsilon$-coordinate vector $[T]_\varepsilon \cdot Qx$. Converting that back to $\beta$-coordinates gives $Q^{-1}[T]_\varepsilon Qx$. Since this holds for every $x$:

$$
[T]_\beta \;=\; Q^{-1}[T]_\varepsilon\, Q.
$$

Reading right to left: $Q$ converts $\beta$-coordinates to $\varepsilon$-coordinates; $[T]_\varepsilon$ applies $T$ in $\varepsilon$-coordinates; $Q^{-1}$ converts the result back to $\beta$-coordinates.

Note that this theorem contains nothing novel. It is just the composition rule $\Mop(ST) = \Mop(S)\Mop(T)$ applied to the factorization $T = (\text{convert }\varepsilon\to\beta) \circ (\text{apply }T\text{ in }\varepsilon) \circ (\text{convert }\beta\to\varepsilon)$.

**Orthonormal case.** If $v_1,\ldots,v_n$ are orthonormal, then $(Q^TQ)_{ij} = \ip{v_i}{v_j} = \delta_{ij}$, so $Q^TQ = I$, i.e., $Q^{-1} = Q^T$.
:::

## Eigenvalues and Polynomials

:::definition{#eigenvalue-and-eigenvector title="Eigenvalue and Eigenvector"}
$\lambda \in \F$ is an **eigenvalue** of $T \in \Lcal(V)$ if $\exists\, v \neq 0$ with $Tv = \lambda v$. Such $v$ is an **eigenvector** for $\lambda$. The **eigenspace** for the eigenvalue is defined as $E(\lambda,T) = \set{v : Tv = \lambda v}  = \nul(T - \lambda I)$.

The following are equivalent (for operators on finite-dimensional spaces, by rank-nullity):

- $\lambda$ is an eigenvalue of $T$.
- $T - \lambda I$ is not injective ($\iff$ has nontrivial null space).
- $T - \lambda I$ is not surjective.
- $T - \lambda I$ is not invertible.
:::

:::remark
Eigenvalues and eigenvalues are of intersest in the study of linear maps because the eigenspaces $E(\lambda, T)$ for various $\lambda$ correspond to 1-dimensional subspaces left *invariant* by the transformation.
:::

:::theorem{#eigenvectors-for-distinct-eigenvalues-are-linearly title="Eigenvectors for Distinct Eigenvalues Are Linearly Independent"}
If $v_1,\ldots,v_m$ are eigenvectors with *distinct* eigenvalues $\lambda_1,\ldots,\lambda_m$, they are linearly independent.
:::

:::proof
Suppose for contradiction there is a shortest dependence: $\sum_{i=1}^m a_i v_i = 0$ with all $a_i \neq 0$ (and $m$ minimal). Apply $T - \lambda_m I$ to both sides:

$$
\sum_{i=1}^{m-1} a_i (\lambda_i - \lambda_m) v_i = 0.
$$

Since $\lambda_i \neq \lambda_m$ for $i < m$, all factors $(\lambda_i - \lambda_m) \neq 0$, so this is a nontrivial dependence among $v_1,\ldots,v_{m-1}$ — contradicting minimality of $m$.
:::

:::corollary{#eigenvalue-numerical-limit title="Operator cannot have more eigenvalues than dimension of vector space"}
An operator on $V$ has *at most* $\dim V$ distinct eigenvalues (a linearly independent list has length $\leq \dim V$).
:::

:::theorem{#minimal-polynomial title="Minimal Polynomial"}
For $T \in \Lcal(V)$, the **minimal polynomial** of $T$ is the unique monic polynomial $p \in \mathcal{P}(\F)$ of smallest degree with $p(T) = 0$. It satisfies $\deg p \leq \dim V$, and **its zeros are exactly the eigenvalues of $T$**.

Over $\C$: $p(z) = (z - \lambda_1)\cdots(z-\lambda_m)$ for eigenvalues $\lambda_i$ (repetition allowed).
:::

:::theorem{#upper-triangular-and-diagonal-diagonalizable-operators title="Upper-Triangular and Diagonal (Diagonalizable) Operators"}

- $T$ admits an **upper-triangular** matrix w.r.t. some basis $\iff$ the minimal polynomial of $T$ factors into linear factors over $\F$. If such a matrix exists, its diagonal entries are precisely the eigenvalues of $T$ (with repetition).
- Over $\C$: **every** operator admits an upper-triangular matrix (by the Fundamental Theorem of Algebra).
- $T$ is **diagonalizable** (diagonal matrix w.r.t. some basis) $\iff$ min. poly. has *no repeated roots* $\iff$ $V$ is a direct sum of eigenspaces: $V = E(\lambda_1,T) \oplus \cdots \oplus E(\lambda_k, T)$.

:::

:::theorem{#supplementary-no-hidden-eigenvalues title="No Hidden Eigenvalues"}
If $T$ has an ONB of eigenvectors $e_1,\ldots,e_n$ with eigenvalues $\mu_1,\ldots,\mu_n$, then *every* eigenvalue of $T$ is among $\mu_1,\ldots,\mu_n$.
:::

:::proof
Let $Tv = \lambda v$, $v \neq 0$. Expand $v = \sum_k c_k e_k$ in the eigenbasis. Apply $T$:

$$
\lambda \sum_k c_k e_k = Tv = \sum_k c_k \mu_k e_k.
$$

Since the $e_k$ are a basis, equate coefficients: $c_k(\mu_k - \lambda) = 0$ for all $k$. Since $v \neq 0$, some $c_k \neq 0$, forcing $\lambda = \mu_k$ for that $k$.
:::

:::theorem{#supplementary-multiplicity-equals-eigenspace-dimension title="Supplementary: Multiplicity Equals Eigenspace Dimension"}
In any ONB of eigenvectors of a self-adjoint $T$, each eigenvalue $\mu$ appears *exactly* $\dim E(\mu,T)$ times.
:::

:::proof
Let $k$ = number of times $\mu$ appears; the corresponding eigenvectors span a subspace $S \subseteq E(\mu,T)$, so $k \leq \dim E(\mu,T)$.

Conversely, for any $w \in E(\mu,T)$ and any basis vector $e_j$ with $\mu_j \neq \mu$: $\ip{w}{e_j} = 0$ (eigenvectors for distinct eigenvalues are orthogonal in the self-adjoint case — shown in Step 2 of the proof of [[#real-spectral-theorem]]). So expanding $w$ in the ONB, only the $\mu_j = \mu$ terms survive: $w \in S$. Hence $E(\mu,T) \subseteq S$, giving $\dim E(\mu,T) \leq k$.
:::

## Inner Product Spaces

:::definition{#inner-product title="Inner Product"}
An **inner product** on $V$ is a function $\ip{\cdot}{\cdot} : V \times V \to \F$ satisfying:

1. **Positivity:** $\ip{v}{v} \geq 0$ for all $v$.
2. **Definiteness:** $\ip{v}{v} = 0 \iff v = 0$.
3. **Additivity/Homogeneity in first slot:** $\ip{u+v}{w} = \ip{u}{w} + \ip{v}{w}$; $\ip{\lambda u}{v} = \lambda\ip{u}{v}$.
4. **Conjugate symmetry:** $\ip{u}{v} = \overline{\ip{v}{u}}$ (over $\R$: $\ip{u}{v} = \ip{v}{u}$).

The induced **norm** is $\nm{v} = \sqrt{\ip{v}{v}}$. Note: linearity is in the *first* slot; the second slot is conjugate-linear.
:::

:::theorem{#pythagorean-cauchy-schwarz title="Pythagorean Theorem and Cauchy-Schwarz"}
**Pythagorean theorem:** If $u \perp v$ (i.e., $\ip{u}{v} = 0$):

$$
\nm{u + v}^2 = \nm{u}^2 + \nm{v}^2.
$$

**Cauchy-Schwarz inequality:**

$$
|\ip{u}{v}| \;\leq\; \nm{u}\,\nm{v},
$$

with equality iff one of $u, v$ is a scalar multiple of the other.
:::

:::definition{#orthonormal-list-and-onb title="Orthonormal List and ONB"}
A list $e_1,\ldots,e_m$ is **orthonormal** if $\ip{e_i}{e_j} = \delta_{ij}$ (norm 1, pairwise orthogonal).

An orthonormal list that spans $V$ is an **orthonormal basis (ONB)**.
:::

:::theorem{#properties-of-orthonormal-lists title="Properties of Orthonormal Lists"}
Let $e_1,\ldots,e_m$ be an orthonormal list in $V$.

1. **Norm formula:** $\nm{a_1 e_1 + \cdots + a_m e_m}^2 = |a_1|^2 + \cdots + |a_m|^2$.
2. **Linear independence:** Every orthonormal list is linearly independent.
3. **ONB expansion (Parseval):** If $e_1,\ldots,e_n$ is an ONB of $V$, then for any $v \in V$:

   $$
   v = \sum_{i=1}^n \ip{v}{e_i}\,e_i \qquad\text{and}\qquad \nm{v}^2 = \sum_{i=1}^n |\ip{v}{e_i}|^2.
$$

:::

:::proof
(1): $\nm{\sum a_i e_i}^2 = \ip{\sum a_i e_i}{\sum a_j e_j} = \sum_{i,j} a_i \overline{a_j}\,\delta_{ij} = \sum_i |a_i|^2$.

(2): Follows immediately from (1): $\sum a_i e_i = 0 \Rightarrow \sum |a_i|^2 = 0 \Rightarrow$ all $a_i = 0$.

(3): Write $v = \sum_i a_i e_i$ and take $\ip{\cdot}{e_k}$ of both sides. Orthonormality kills all but the $k$-th term: $\ip{v}{e_k} = a_k$.
:::

:::theorem{#gram-schmidt-procedure title="Gram-Schmidt Procedure"}
Given a linearly independent list $v_1,\ldots,v_m$, define $f_1 = v_1$ and for $k \geq 2$:

$$
f_k = v_k - \sum_{j=1}^{k-1} \frac{\ip{v_k}{f_j}}{\nm{f_j}^2}\,f_j \qquad \Bigl(\text{“subtract off the components of }v_k\text{ along }f_1,\ldots,f_{k-1}\text{”}\Bigr).
$$

Set $e_k = f_k/\nm{f_k}$. Then $e_1,\ldots,e_m$ is orthonormal with $\spn(v_1,\ldots,v_k) = \spn(e_1,\ldots,e_k)$ for every $k$.
:::

:::proof
*Orthonormality:* By design $\nm{e_k} = 1$. For $j < k$: take $\ip{\cdot}{f_j}$ of the defining equation for $f_k$:

$$
\ip{f_k}{f_j} = \ip{v_k}{f_j} - \frac{\ip{v_k}{f_j}}{\nm{f_j}^2}\nm{f_j}^2 = 0.
$$

So each new $f_k$ is orthogonal to all previous $f_j$.

*Span equality:* By induction. Base case $k=1$: $\spn(v_1) = \spn(f_1)$ trivially. Inductive step: $f_{k+1} = v_{k+1} - (\text{element of }\spn(f_1,\ldots,f_k))$, so $f_{k+1} \in \spn(v_1,\ldots,v_{k+1})$. Rearranging shows $v_{k+1} \in \spn(f_1,\ldots,f_{k+1})$. By inductive hypothesis $\spn(f_1,\ldots,f_k) = \spn(v_1,\ldots,v_k)$, so $\spn(f_1,\ldots,f_{k+1}) = \spn(v_1,\ldots,v_{k+1})$.
:::

:::remark
In the definition of $f_k$, each RHS term $\frac{\ip{v_k}{f_j}}{\nm{f_j}^2}\,f_j$ is actaully just the projection of $v_k$ onto the 1-d subspace spanned by $f_j$. As such, $f_k$ is manufactured to be orthogonal to each $f_j$. See [[#orthogonal-projection]].
:::

:::theorem{#consequences-of-gram-schmidt title="Consequences of Gram-Schmidt"}

- Every finite-dimensional IPS has an ONB (apply G-S to any basis).
- Every orthonormal list extends to an ONB (extend to a full basis, apply G-S; the first $m$ vectors are unchanged by the G-S recursion since they're already orthonormal).
- **Schur's Theorem:** Every operator on a finite-dimensional *complex* IPS has an upper-triangular matrix w.r.t. some ONB. *Proof sketch: induction. Over $\mathbb{C}$ every operator has an eigenvalue $\lambda_1$ with unit eigenvector $v_1$; define $W = \{v_1\}^\perp$ and check $T|_W$ is well-defined (up to modification) on the $(n-1)$-dimensional space; apply IH and take G-S. The orthonormality comes from applying G-S at each step.*

:::

## Orthogonal Complements and Projections

:::theorem{#riesz-representation-theorem title="Riesz Representation Theorem"}
If $V$ is finite-dimensional and $\varphi : V \to \F$ is a linear functional, then $\exists!$ vector $u \in V$ such that

$$
\varphi(v) = \ip{v}{u} \qquad \forall v \in V.
$$

:::

:::proof
*Existence:* Let $e_1,\ldots,e_n$ be an ONB. Set $u = \sum_i \overline{\varphi(e_i)}\,e_i$. Then for any $v$:
$$
\begin{aligned}
  \ip{v}{u} &= \left\langle v,\; \textstyle\sum_i \overline{\varphi(e_i)}\,e_i\right\rangle
             = \sum_i \varphi(e_i)\,\ip{v}{e_i} \qquad \text{(second slot is conjugate-linear)}\\
             &= \varphi\!\left(\sum_i \ip{v}{e_i}\,e_i\right) = \varphi(v). \quad\text{(ONB expansion + linearity of $\varphi$)}
\end{aligned}
$$
*Uniqueness:* If $\ip{v}{u} = \ip{v}{u'}$ for all $v$, then $\ip{v}{u - u'} = 0$ for all $v$; set $v = u - u'$ to get $u = u'$.

*Note:* The vector $u$ appears to depend on the ONB chosen, but uniqueness tells us it does not.
:::

:::remark
**Why Riesz matters:** It is the key tool used to *define* the adjoint $T^*$ in the next chapter. For fixed $w \in W$, the map $v \mapsto \ip{Tv}{w}$ is a linear functional on $V$. Riesz guarantees a unique vector in $V$ representing it. That vector is defined to be $T^*w$.

Another innocent application of Riesz appears in calculus. For $f : V \to \R$ ($V$ a finite-dimensional inner product space), the derivative of $f$ at $x$ is a linear functional: the unique $f'(x) \in \Lcal(V,\R)$ with $$f(x + \delta x) - f(x) = f'(x)\delta x + o(\nm{\delta x}).$$
By Riesz (6.42), this functional is an inner product against a unique vector, *defined* to be the gradient: $f'(x)\delta x = \ip{\delta x}{\nabla f(x)}, \forall \delta x \in V$. This viewpoint has two payoffs: (i) the interpretation of the gradient as the direction of steepest ascent follows immediately from Cauchy-Schwarz: $\ip{\delta x}{\nabla f(x)} \leq \nm{\delta x}\,\nm{\nabla f(x)}$, with equality iff $\delta x \parallel \nabla f(x)$; (ii) the gradient depends on the *choice of inner product*, while the derivative does not; change the inner product and the same $f'(x)$ gets a different Riesz vector. (``Natural gradient'' methods in ML exploit this.)
:::

:::definition{#orthogonal-complement title="Orthogonal Complement"}
For any subset $U \subseteq V$ (need not be a subspace):

$$
U^\perp = \{v \in V : \ip{v}{u} = 0\;\forall u \in U\}.
$$

$U^\perp$ is always a subspace of $V$.
:::

:::theorem{#orthogonal-direct-sum-decomposition title="Orthogonal Direct Sum Decomposition"}
For any subspace $U \subseteq V$ (finite-dimensional):

$$
V = U \oplus U^\perp, \qquad \dim U^\perp = \dim V - \dim U, \qquad U = (U^\perp)^\perp.
$$

:::

:::proof
Let $e_1,\ldots,e_m$ be an ONB for $U$. Extend to an ONB $e_1,\ldots,e_m,h_1,\ldots,h_k$ for $V$. Then any $v \in V$ writes uniquely as:

$$
v = \underbrace{\sum_{i=1}^m \ip{v}{e_i}\,e_i}_{\in\; U} \;+\; \underbrace{\sum_{j=1}^k \ip{v}{h_j}\,h_j}_{\in\; U^\perp}.
$$

The first piece lies in $U$ (it's a combination of the ONB for $U$); the second is orthogonal to each $e_i$ hence lies in $U^\perp$. Uniqueness: $U \cap U^\perp = \{0\}$ (any $v$ in both satisfies $\nm{v}^2 = \ip{v}{v} = 0$). Dimension: $\dim V = m + k$, so $\dim U^\perp = k = \dim V - \dim U$.
:::

:::definition{#orthogonal-projection title="Orthogonal Projection"}
For a subspace $U \subseteq V$, write each $v \in V$ uniquely as $v = u + w$ with $u \in U$, $w \in U^\perp$ (this is possible by [[#orthogonal-direct-sum-decomposition]]). The **orthogonal projection onto $U$** is the operator $P_U \in \Lcal(V)$ defined by $P_U v = u$.

**Special case** ($U = \spn\{u_0\}$, one-dimensional):

$$
P_U v = \frac{\ip{v}{u_0}}{\nm{u_0}^2}\,u_0.
$$

:::

:::proof{title="of 1-d formula"}
We know $v - P_Uv \perp U$. So we need $\lambda$ such that $v - \lambda u_0 \perp u_0$:
$\ip{v - \lambda u_0}{u_0} = 0 \Rightarrow \ip{v}{u_0} = \lambda\nm{u_0}^2 \Rightarrow \lambda = \ip{v}{u_0}/\nm{u_0}^2$.
:::

<figure class="fig">
  <img src="/figures/linear-algebra/orthogonal-projection.svg" alt="Orthogonal projection of v onto the subspace U">
</figure>

*$P_U v$ = foot of perpendicular from $v$ to $U$.*

:::theorem{#properties-of-and-best-approximation title="Properties of $P_U$ and Best Approximation"}

1. $P_U \in \Lcal(V)$;  $P_U^2 = P_U$ (idempotent);  $\nul(P_U) = U^\perp$;  $\rng(P_U) = U$.
2. If $e_1,\ldots,e_m$ is an ONB for $U$: $\displaystyle P_U v = \sum_{i=1}^m \ip{v}{e_i}\,e_i$.
3. **Best approximation:** $\nm{v - P_U v} \leq \nm{v - u}$ for all $u \in U$, with equality iff $u = P_U v$.

:::

:::proof{title="of (3)"}
For any $u \in U$, write $v - u = (v - P_U v) + (P_U v - u)$. The first term lies in $U^\perp$ (by definition of $P_U$) and the second lies in $U$, so they are orthogonal. By Pythagoras:

$$
\nm{v - u}^2 = \nm{v - P_U v}^2 + \nm{P_U v - u}^2 \;\geq\; \nm{v - P_U v}^2.
$$

Equality iff $\nm{P_U v - u}^2 = 0$, i.e., $u = P_U v$.
:::

:::remark
This is one of the most useful theorems in applied mathematics. Examples:

- **Polynomial approximation:** Best $k$-th degree polynomial approximation to $\sin(x)$ in $L^2[-\pi,\pi]$ = orthogonal projection onto $\spn\{1, x, \ldots, x^k\}$.
- **OLS regression:** The least-squares estimate $\hat\beta = (X^TX)^{-1}X^Ty$ gives $\hat y = X\hat\beta = P_{\rng(X)} y$, the projection of $y$ onto the column space of $X$.

:::

### Pseudoinverse

:::theorem{#any-linear-map-restricts-to-a title="Any Linear Map Restricts to a Bijection"}
For $T \in \Lcal(V,W)$: the restriction $T\big|_{(\nul T)^\perp}$ is a bijection onto $\rng(T)$.
:::

:::proof
Injectivity on $(\nul T)^\perp$: if $Tw = 0$ and $w \in (\nul T)^\perp$, then $w \in \nul T \cap (\nul T)^\perp = \{0\}$. Surjectivity onto $\rng(T)$: any $Tv \in \rng(T)$ has $v = u + w$ with $u \in \nul T$ and $w \in (\nul T)^\perp$; then $Tw = Tv$.
:::

:::definition{#pseudoinverse title="Pseudoinverse"}
The **pseudoinverse** $T^+ \in \Lcal(W,V)$ is:

$$
T^+ w \;=\; \Bigl(T\big|_{(\nul T)^\perp}\Bigr)^{-1}\!\! P_{\rng T}\,w \qquad \forall\, w \in W.
$$

*Intuition:* project $w$ onto $\rng(T)$, then take the unique preimage in $(\nul T)^\perp$.
:::

:::theorem{#properties-of-the-pseudoinverse title="Properties of the Pseudoinverse"}

- **(a)** $T$ invertible $\Rightarrow T^+ = T^{-1}$.
- **(b)** $TT^+ = P_{\rng T}$   (orthogonal projection onto $\rng T$).
- **(c)** $T^+T = P_{(\nul T)^\perp}$   (orthogonal projection onto $(\nul T)^\perp$).
- **(d)** **Best approximate solution:** $T^+w$ minimizes $\nm{Tv - w}$ over all $v \in V$; and among all minimizers, $T^+w$ has the smallest norm.

:::

:::proof
Property (a): Obvious: if $T$ is invertible, $(\nul T)^\perp$ is the whole space.

Property (b): $TT^+w = T \bigl(T|_{(\nul T)^\perp}^{-1} P_{\rng T} w\bigr) = P_{\rng T} w$ since we undo $T^{-1}$ by $T$, exactly on the range. 

Property (c): $T^+Tv = T^+Tu$ where $v = u + n$, $u \in (\nul T)^\perp$, $n \in \nul T$; then $T^+Tu = u = P_{(\nul T)^\perp}v$. 
:::

## Operators on Inner Product Spaces: The Adjoint

:::definition{#the-adjoint title="The Adjoint $T^*$"}
For $T \in \Lcal(V,W)$, the **adjoint** $T^* \in \Lcal(W,V)$ is the unique linear map satisfying:

$$
\ip{Tv}{w} = \ip{v}{T^*w} \qquad \forall v \in V,\; w \in W.
$$

*Existence (via Riesz):* For fixed $w$, the map $v \mapsto \ip{Tv}{w}$ is a linear functional on $V$. By the Riesz Representation Theorem ([[#riesz-representation-theorem]]), there is a unique vector in $V$ representing it.*Define* that vector to be $T^*w$.
:::

:::theorem{#properties-of-the-adjoint title="Properties of the Adjoint"}
$(S + T)^* = S^* + T^*$;  $(\lambda T)^* = \overline{\lambda}\,T^*$;  $(ST)^* = T^*S^*$;  $(T^*)^* = T$.

If $T$ invertible: $(T^{-1})^* = (T^*)^{-1}$.
:::

:::theorem{#null-range-adjoint title="Null Space and Range of $T^*$"}

$$
\nul(T^*) = (\rng T)^\perp \qquad\text{and}\qquad \rng(T^*) = (\nul T)^\perp.
$$

:::

:::proof
$w \in \nul(T^*)$
$\iff T^*w = 0$
$\iff \ip{v}{T^*w} = 0\;\forall v$
$\iff \ip{Tv}{w} = 0\;\forall v$
$\iff w \perp \rng(T)$.

For the second: apply the first to $T^*$ in place of $T$ to get $\nul(T^{**}) = (\rng T^*)^\perp$. Since $T^{**} = T$: $\nul T = (\rng T^*)^\perp$. Take $\perp$ of both sides: $(\nul T)^\perp = \rng T^*$.
:::

:::theorem{#matrix-of-conjugate-transpose-of-matrix title="Matrix of $T^*$ = Conjugate Transpose of Matrix of $T$"}
With respect to ONBs $\{e_k\}$ for $V$ and $\{f_j\}$ for $W$:

$$
\Mop(T^*)_{k,j} = \overline{\Mop(T)_{j,k}}, \qquad\text{i.e., }\; \Mop(T^*) = \Mop(T)^* \;(= \Mop(T)^T\text{ over }\R).
$$

**Caveat:** This only holds for ONBs. For general bases, the matrix of $T^*$ is *not* the conjugate transpose.
:::

:::proof
Since $\{f_j\}$ is orthonormal, the $j$-th coordinate of $Te_k$ is $\ip{Te_k}{f_j}$, so $\Mop(T)_{j,k} = \ip{Te_k}{f_j}$. By the same logic for $T^*$ (using $\{e_k\}$ as ONB for $V$): $\Mop(T^*)_{k,j} = \ip{T^*f_j}{e_k}$. Now use the adjoint identity:

$$
\Mop(T^*)_{k,j} = \ip{T^*f_j}{e_k} = \overline{\ip{e_k}{T^*f_j}} = \overline{\ip{Te_k}{f_j}} = \overline{\Mop(T)_{j,k}}.
$$

:::

:::remark
This is the bridge between the abstract and the concrete: in the abstract, $T^*$ is defined by the inner product identity $\ip{Tv}{w} = \ip{v}{T^*w}$. In coordinates (ONB), it is the conjugate transpose.
:::

## Self-Adjoint and Normal Operators

:::definition{#self-adjoint-hermitian-and-normal-operators title="Self-Adjoint (Hermitian) and Normal Operators"}
$T \in \Lcal(V)$ is:

- **Self-adjoint** (**Hermitian**): $T = T^*$, i.e., $\ip{Tv}{w} = \ip{v}{Tw}$ for all $v,w$. In matrix form (ONB): $A = A^*$ (over $\R$: $A = A^T$, "symmetric").
- **Normal**: $TT^* = T^*T$ (commutes with its adjoint). Self-adjoint $\Rightarrow$ normal, but not conversely. *Example: rotation by $90^\circ$ over $\R$ is normal but not self-adjoint.*

:::

:::theorem{#self-adjoint-operators-have-real-eigenvalues title="Self-Adjoint Operators Have Real Eigenvalues"}
If $T = T^*$ and $Tv = \lambda v$ with $v \neq 0$: then $\lambda \in \R$.
:::

:::proof
$\lambda\nm{v}^2 = \ip{Tv}{v} = \ip{v}{Tv} = \overline{\ip{Tv}{v}} = \bar\lambda\nm{v}^2$. So $\lambda = \bar\lambda$, meaning $\lambda \in \R$.
:::

:::theorem{#characterization-of-normal-operators title="Characterization of Normal Operators"}
$T$ is normal $\iff \nm{Tv} = \nm{T^*v}$ for all $v \in V$.
:::

:::proof
$T$ normal $\iff TT^* - T^*T = 0$. Since $TT^* - T^*T$ is self-adjoint, it equals zero iff its quadratic form is identically zero (this requires the result that a self-adjoint operator with zero quadratic form is the zero map — true over $\R$ directly, and over $\C$ by polarization). So:

$$
T \text{ normal} \iff \ip{(T^*T - TT^*)v}{v} = 0\;\forall v \iff \nm{Tv}^2 = \nm{T^*v}^2\;\forall v.
$$

:::

:::lemma{#key-lemma-for-normal-operators title="Key Lemma for Normal Operators"}
If $T$ is normal and $Tv = \lambda v$ ($v \neq 0$), then $T^*v = \bar\lambda v$.
:::

:::proof
Let $S = T - \lambda I$. Then $S^* = T^* - \bar\lambda I$, and since $T$ is normal:

$$
SS^* = (T-\lambda I)(T^*-\bar\lambda I) = TT^* - \lambda T^* - \bar\lambda T + |\lambda|^2 I = T^*T - \bar\lambda T - \lambda T^* + |\lambda|^2 I = S^*S.
$$

So $S$ is normal too. Now $Sv = Tv - \lambda v = 0$. Since $S$ is normal: $\nm{Sv} = \nm{S^*v}$, so $S^*v = 0$, giving $T^*v = \bar\lambda v$.

*Intuition:* For a normal operator, eigenvectors of $T$ are automatically eigenvectors of $T^*$ (with conjugate eigenvalue).
:::

## Spectral Theorems

:::theorem{#complex-spectral-theorem title="Complex Spectral Theorem"}
Let $\F = \C$ and $T \in \Lcal(V)$. The following are equivalent:

- **(a)** $T$ is normal.
- **(b)** $T$ has a diagonal matrix w.r.t. some ONB of $V$.
- **(c)** $V$ has an ONB of eigenvectors of $T$.

:::

:::proof
(c) $\Rightarrow$ (b) $\Rightarrow$ (a) are straightforward. For (a) $\Rightarrow$ (c): By Schur's theorem, $T$ has an upper-triangular matrix $A$ w.r.t. some ONB $e_1,\ldots,e_n$. Compute $TT^*$ and $T^*T$ from $A$: normality $TT^* = T^*T$ forces $|A_{11}|^2 = |A_{11}|^2 + |A_{12}|^2 + \cdots$, so $A_{1j} = 0$ for all $j > 1$. Continuing down the diagonal, the same argument forces all off-diagonal entries to be zero. So $A$ is diagonal.
:::

:::theorem{#real-spectral-theorem title="Real Spectral Theorem"}
Let $\F = \R$ and $T \in \Lcal(V)$. The following are equivalent:

- **(a)** $T$ is self-adjoint.
- **(b)** $T$ has a diagonal matrix w.r.t. some ONB of $V$.
- **(c)** $V$ has an ONB of eigenvectors of $T$.

In matrix form: $A \in \R^{n\times n}$ symmetric $\iff$ $A = Q\Lambda Q^T$, $Q$ orthogonal, $\Lambda$ real diagonal.
:::

:::proof
(c) $\Rightarrow$ (b) $\Rightarrow$ (a): trivial (a diagonal matrix w.r.t. ONB is self-adjoint since $\Lambda = \Lambda^T$; self-adjointness is basis-independent).

We prove **(a) $\Rightarrow$ (c)** by induction on $n = \dim V$.

**Step 1: $T$ has at least one eigenvector.**

Define the *Rayleigh quotient* $f(v) = \ip{Tv}{v}$ restricted to the unit sphere $S = \{v : \nm{v} = 1\}$. Since $T$ is self-adjoint, $f$ is real-valued (we proved eigenvalues are real, and the same argument gives $f(v) \in \R$ for all $v$). Since $S$ is compact and $f$ is continuous, $f$ attains its maximum at some $v_1 \in S$. Define $\lambda_1 = \max_{\nm{v}=1}\ip{Tv}{v} = \ip{Tv_1}{v_1}$.

**Claim:** $v_1$ is an eigenvector with eigenvalue $\lambda_1$.

Write $Tv_1 = \lambda_1 v_1 + u$ where $u \perp v_1$ (decompose $Tv_1$ into its $v_1$-component and orthogonal remainder; this is possible by [[#orthogonal-direct-sum-decomposition]]). We want to show $u = 0$. The plan of attack is to show that if $u$ were nonzero, then the function $f$ could be increased in the $u$-direction, which would be a contradiction by the definition of $v_1$.

Consider the curve on the unit sphere: $v(t) = \frac{v_1 + tu}{\nm{v_1 + tu}}$. Since $u \perp v_1$: $\nm{v_1 + tu}^2 = 1 + t^2\nm{u}^2$. Compute $f(v(t))$:

$$
\ip{T(v_1 + tu)}{v_1 + tu} = \ip{Tv_1}{v_1} + t\underbrace{\bigl(\ip{Tv_1}{u} + \ip{Tu}{v_1}\bigr)}_{= 2\nm{u}^2\;\text{(see below)}} + t^2\ip{Tu}{u}.
$$

*Why does the cross-term equal $2\nm{u}^2$?*

$$
\ip{Tv_1}{u} = \ip{\lambda_1 v_1 + u}{u} = \nm{u}^2 \quad (\text{since }u \perp v_1),
$$

$$
\ip{Tu}{v_1} = \ip{u}{Tv_1} = \ip{u}{\lambda_1 v_1 + u} = \nm{u}^2 \quad (\text{since }T = T^*, \text{ and }u \perp v_1).
$$

Therefore:

$$
f(v(t)) - \lambda_1 = \frac{t\bigl(2\nm{u}^2 + t(\ip{Tu}{u} - \lambda_1\nm{u}^2)\bigr)}{1 + t^2\nm{u}^2}.
$$

If $u \neq 0$: the numerator factor at $t = 0$ is $2\nm{u}^2 > 0$. By continuity, for small $t > 0$ the whole expression is positive — contradicting the maximality of $v_1$. Hence $u = 0$ and $Tv_1 = \lambda_1 v_1$. ✓

**Step 2: Eigenvectors for distinct eigenvalues are orthogonal.**

If $Tv = \lambda v$ and $Tw = \mu w$ with $\lambda \neq \mu$:

$$
\lambda\ip{v}{w} = \ip{Tv}{w} = \ip{v}{Tw} = \mu\ip{v}{w} \;\Rightarrow\; (\lambda - \mu)\ip{v}{w} = 0 \;\Rightarrow\; \ip{v}{w} = 0.
$$

(Used self-adjointness $\ip{Tv}{w} = \ip{v}{Tw}$, and the fact that eigenvalues are real so $\mu = \bar\mu$.)

**Step 3: Induction on $n = \dim V$.**

*Base case $n = 1$:* any unit vector is an eigenvector.

*Inductive step:* Assume true for dimension $< n$. Let $\dim V = n$. By Step 1, $T$ has a unit eigenvector $v_1$ with eigenvalue $\lambda_1$. Define $W = \{v_1\}^\perp$, which has dimension $n-1$.

$W$ is $T$-invariant: for any $w \in W$, $\ip{Tw}{v_1} = \ip{w}{Tv_1} = \lambda_1\ip{w}{v_1} = 0$ (used $T = T^*$ and $w \perp v_1$). So $Tw \in W$.

$T|_W$ is self-adjoint (inherits $T = T^*$ restricted to $W$).

By the inductive hypothesis, $T|_W$ has an ONB of eigenvectors $\{v_2,\ldots,v_n\} \subset W$.

The combined list $\{v_1, v_2,\ldots,v_n\}$ is an ONB for $V$: each $v_i$ is a unit vector; $v_1 \perp v_j$ for $j \geq 2$ (since $v_j \in W = \{v_1\}^\perp$); $v_i \perp v_j$ for $i,j \geq 2$ (by IH); and they span $V$ ($v_1$ plus an ONB for $W$ spans all of $V$).
:::

:::remark
**Geometric interpretation:** In the eigenbasis $\{v_k\}$, the self-adjoint operator $T$ is a pure coordinate-wise rescaling: it stretches each direction $v_k$ by the real factor $\lambda_k$.

**Statistics connection:** Every covariance matrix $\Sigma = \frac{1}{m-1}X^TX$ is real symmetric PSD. The spectral theorem gives $\Sigma = Q\Lambda Q^T$: there exist $n$ orthogonal uncorrelated directions (the eigenvectors $v_k$) along which the variance is $\lambda_k$. This is the foundation of PCA.
:::

## Positive Operators, Square Roots, and Isometries

:::definition{#positive-semidefinite-psd-operator title="Positive Semidefinite (PSD) Operator"}
$T \in \Lcal(V)$ is **positive semidefinite (PSD)** if $T$ is self-adjoint and $\ip{Tv}{v} \geq 0$ for all $v \in V$.

In matrix form (over $\R$): $A$ PSD iff $A = A^T$ and $x^TAx \geq 0$ for all $x$.

PSD operators have **nonnegative real eigenvalues**.

*Key example:* $T^*T$ is always PSD for any $T \in \Lcal(V,W)$: it is self-adjoint ($(T^*T)^* = T^*(T^*)^* = T^*T$) and $\ip{T^*Tv}{v} = \nm{Tv}^2 \geq 0$.
:::

:::theorem{#properties-of title="Properties of $T^*T$"}
For $T \in \Lcal(V,W)$:

- $\nul(T^*T) = \nul(T)$   [*$T^*Tv = 0 \Rightarrow \nm{Tv}^2 = \ip{T^*Tv}{v} = 0 \Rightarrow Tv = 0$*]
- $\rng(T^*T) = \rng(T^*)$
- $\dim\rng(T) = \dim\rng(T^*) = \dim\rng(T^*T)$

:::

:::theorem{#characterizations-of-positive-operators title="Characterizations of Positive Operators"}
Let $T \in \Lcal(V)$. Then the following are equivalent:

- **(a)** $T$ is a positive operator;
- **(b)** $T$ is self-adjoint and all eigenvalues of $T$ are nonnegative;
- **(c)** with respect to some orthonormal basis of $V$, the matrix of $T$ is diagonal with only nonnegative numbers on the diagonal;
- **(d)** $T$ has a positive square root;
- **(e)** $T$ has a self-adjoint square root;
- **(f)** $T = R^*R$ for some $R \in \Lcal(V)$.

:::

:::proof
We prove (a) $\Rightarrow$ (b) $\Rightarrow$ (c) $\Rightarrow$ (d) $\Rightarrow$ (e) $\Rightarrow$ (f) $\Rightarrow$ (a).

**(a) $\Rightarrow$ (b):** Suppose $T$ is positive, so $T$ is self-adjoint by definition. Suppose $\lambda$ is an eigenvalue of $T$ with eigenvector $v$. Then

$$
0 \leq \ip{Tv}{v} = \ip{\lambda v}{v} = \lambda\ip{v}{v},
$$

so $\lambda \geq 0$ (since $\ip{v}{v} > 0$).

**(b) $\Rightarrow$ (c):** $T$ is self-adjoint with nonnegative eigenvalues. By [[#real-spectral-theorem]], there is an ONB $e_1,\ldots,e_n$ of eigenvectors of $T$ with eigenvalues $\lambda_1,\ldots,\lambda_n \geq 0$. The matrix of $T$ w.r.t. this basis is $\mathrm{diag}(\lambda_1,\ldots,\lambda_n)$ with nonnegative diagonal.

**(c) $\Rightarrow$ (d):** Let $e_1,\ldots,e_n$ be an ONB in which $\Mop(T) = \mathrm{diag}(\lambda_1,\ldots,\lambda_n)$, $\lambda_k \geq 0$. By [[#linear-map-lemma]] there exists $R \in \Lcal(V)$ with

$$
Re_k = \sqrt{\lambda_k}\, e_k \qquad \text{for each } k.
$$

$R$ is a positive operator (diagonal w.r.t. an ONB with nonnegative diagonal entries), and $R^2 e_k = \lambda_k e_k = Te_k$ for each $k$, so $R^2 = T$. Thus $R$ is a positive square root of $T$.

**(d) $\Rightarrow$ (e):** Every positive operator is self-adjoint by definition, so a positive square root is a self-adjoint square root.

**(e) $\Rightarrow$ (f):** If $T = R^2$ with $R$ self-adjoint, then $T = R^*R$ (since $R^* = R$).

**(f) $\Rightarrow$ (a):** Suppose $T = R^*R$. Then $T^* = (R^*R)^* = R^*(R^*)^* = R^*R = T$, so $T$ is self-adjoint. And for every $v \in V$:

$$
\ip{Tv}{v} = \ip{R^*Rv}{v} = \ip{Rv}{Rv} = \nm{Rv}^2 \geq 0.
$$

Thus $T$ is positive.
:::

:::remark
**Every condition applies to a covariance matrix.** A sample covariance matrix $\Sigma = X^TX$ (centered data $X$) satisfies (f) by construction with $R = X$. The theorem then yields all the other conditions for free, and each one is something of relevance in statistics:

- (a): $v^T\Sigma v \geq 0$: the variance of the projection of the data onto direction $v$ is nonnegative. (This quadratic form *is* the variance along $v$.)
- (b): all eigenvalues $\lambda_k \geq 0$: principal component variances are nonnegative.
- (c): $\Sigma = Q\Lambda Q^T$ diagonalizes with $\Lambda \geq 0$: the PCA decomposition.
- (d): the positive square root $\Sigma^{1/2}$ exists: this is used to sample from the multivariate normal: $x = \mu + \Sigma^{1/2}z$ with $z \sim \mathcal{N}(0, I)$ gives $x \sim \mathcal{N}(\mu, \Sigma)$.
- (f): conversely, *any* PSD matrix is a covariance matrix of some dataset (take $X = \Sigma^{1/2}$), so PSD-ness exactly characterizes covariance matrices.

:::

:::theorem{#positive-square-root title="Positive Square Root"}
Every PSD operator $T$ has a **unique** PSD square root: a PSD operator $R$ with $R^2 = T$.
:::

:::proof
*Existence:* Diagonalize $T$ via the spectral theorem: $Te_i = \lambda_i e_i$, $\lambda_i \geq 0$. Define $R$ by $Re_i = \sqrt{\lambda_i}\,e_i$. Then $R^2 e_i = \lambda_i e_i = Te_i$ for all $i$, so $R^2 = T$. $R$ is self-adjoint (diagonal in the same ONB) with nonneg eigenvalues, hence PSD.

*Uniqueness:* Any PSD square root $R'$ satisfies $(R')^2 = T$, so the eigenvalues of $R'$ are square roots of those of $T$ (the "no hidden eigenvalues" result, [[#supplementary-no-hidden-eigenvalues]]), and the eigenvectors must align with those of $T$ (since PSD implies self-adjoint, and eigenspaces of distinct eigenvalues are orthogonal). One checks this forces $R' = R$.
:::

:::definition{#isometry title="Isometry"}
$S \in \Lcal(V,W)$ is an **isometry** if $\nm{Sv} = \nm{v}$ for all $v \in V$; that is, if $S$ *preserves lengths *. Equivalently $S^*S = I$. All isometries are injective.

If $\dim V = \dim W$: isometry $\iff$ **unitary** ($SS^* = S^*S = I$, i.e., $S^{-1} = S^*$). Over $\R$: unitary $=$ **orthogonal** ($Q^{-1} = Q^T$). All singular values of an isometry equal $1$.
:::

## Singular Value Decomposition

:::lemma{#properties-of-t*t title="Properties of $T^*T$"}
Suppose $T \in \Lcal(V,W)$. Then
- **(a)** $T^*T$ is a positive operator on $V$
- **(b)** $\nul T^*T = \nul T$
- **(c)** $\rng T^*T = \rng T^*$
- **(d)** $\dim \rng T = \dim \rng T^* = \dim \rng T^*T$
:::

:::definition{#singular-values title="Singular Values"}
The **singular values** of $T \in \Lcal(V,W)$ are the nonnegative square roots of the eigenvalues of $T^*T$, listed in decreasing order $s_1 \geq s_2 \geq \cdots \geq s_n \geq 0$, each repeated as many times as the dimension of the corresponding eigenspace $E(\cdot, T^*T)$.

There are exactly $n = \dim V$ singular values. The number of *positive* singular values $= \dim\rng(T)$ (i.e., $= \text{rank}(T)$).
:::

:::theorem{#role-of-singular-values title="Role of Positive Singular Values"}
Suppose $T \in \Lcal(V,W)$. Then
- **(a)** $T$ is injective $\iff$ $0$ is not a singular value of $T$
- **(b)** the number of positive singular values of $T$ equals $\dim \rng T$
- **(c)** $T$ is surjective $\iff$ number of positive singular values of $T$ equals $\dim W$ 
:::

:::proof
(a): $T$ is injective $ \iff \nul T = \{0\} \iff \nul T^*T = \{0\} \iff 0$ is not an eigenvalue of $T$ $\iff 0$ is not a singular value of $T$.

(b): The spectral theorem applied to $T^*T$ shows $\dim \rng T^*T$ equals the number of positive eigenvalues of $T^*T$ (with repetition). The lemma, then, implies $\dim \rng T$ is equal to the number of positive singular values of $T$.

(c): immediate by (b).
:::

The next result is incredibly powerful. It shows that *any* linear map between two vector spaces $V$ and $W$ has a beautiful description in terms of its singular values and orthonormal lists in $V$ and $W$.

:::theorem{#singular-value-decomposition-svd title="Singular Value Decomposition (SVD)"}
Let $T \in \Lcal(V,W)$ with positive singular values $s_1 \geq \cdots \geq s_m > 0$ (and $s_{m+1} = \cdots = s_n = 0$). Then there exist orthonormal lists $e_1,\ldots,e_m$ in $V$ and $f_1,\ldots,f_m$ in $W$ such that:

$$
\boxed{Tv \;=\; \sum_{k=1}^m s_k\,\ip{v}{e_k}\,f_k \qquad \forall v \in V.}
$$

**Matrix form:** $A = U\Sigma V^T$ with $U \in \R^{p\times p}$ orthogonal, $\Sigma \in \R^{p \times n}$ diagonal (nonneg entries), $V \in \R^{n\times n}$ orthogonal.
:::

:::proof
**Step 1.** $T^*T$ is PSD, so by the real spectral theorem there exists an ONB $e_1,\ldots,e_n$ of $V$ with $T^*Te_k = s_k^2 e_k$ for all $k$.

**Step 2.** For $k = 1,\ldots,m$ (the positive singular values), define $f_k = Te_k / s_k$.

**Step 3: $\{f_k\}$ is orthonormal.** Compute:

$$
\ip{f_j}{f_k} = \frac{1}{s_j s_k}\ip{Te_j}{Te_k} = \frac{1}{s_j s_k}\ip{e_j}{T^*Te_k} = \frac{s_k^2}{s_j s_k}\ip{e_j}{e_k} = \frac{s_k}{s_j}\,\delta_{jk} = \delta_{jk}.
$$

**Step 4: The SVD formula.** For $k > m$: $s_k = 0$, so $T^*Te_k = 0$, so $\nm{Te_k}^2 = \ip{T^*Te_k}{e_k} = 0$, so $Te_k = 0$. Now expand any $v$ in the ONB $\{e_k\}$ and apply $T$:

$$
Tv = T\!\left(\sum_{k=1}^n \ip{v}{e_k}e_k\right) = \sum_{k=1}^m \ip{v}{e_k}\,Te_k + \underbrace{\sum_{k=m+1}^n \ip{v}{e_k}\,Te_k}_{=\,0} = \sum_{k=1}^m s_k\,\ip{v}{e_k}\,f_k.
$$

:::

:::theorem{#norm-of-a-linear-map title="Norm of a Linear Map $= s_1$"}
$\nm{T} := \max_{\nm{v}=1}\nm{Tv} = s_1$ (largest singular value).
:::

:::proof
From the SVD: $\nm{Tv}^2 = \sum_k s_k^2 |\ip{v}{e_k}|^2 \leq s_1^2 \sum_k |\ip{v}{e_k}|^2 = s_1^2 \nm{v}^2$.

Equality is achieved at $v = e_1$: $Te_1 = s_1 f_1$, so $\nm{Te_1} = s_1\nm{f_1} = s_1$.
:::

:::theorem{#adjoint-and-pseudoinverse-explicitly-from-svd title="Adjoint and Pseudoinverse Explicitly from SVD"}
Given $Tv = \sum_k s_k\ip{v}{e_k}f_k$:

$$
T^*w = \sum_{k=1}^m s_k\,\ip{w}{f_k}\,e_k \qquad\text{and}\qquad T^+w = \sum_{k=1}^m \frac{1}{s_k}\,\ip{w}{f_k}\,e_k.
$$

For $T^*$: swap the roles of $e_k$ and $f_k$, same stretching factors $s_k$.

For $T^+$: same swap, but *invert* the stretching factors (project onto range first, then go back with $1/s_k$).
:::

:::proof
For $T^*$: verify $\ip{Tv}{w} = \ip{v}{T^*w}$:
$\ip{Tv}{w} = \sum_k s_k \ip{v}{e_k}\ip{f_k}{w} = \ip{v}{\sum_k s_k \ip{w}{f_k}e_k}$.

For $T^+$: it inverts $T$ on the range (map $f_k \mapsto (1/s_k)e_k$) and projects onto the range first. The formula follows directly from the definition of pseudoinverse.
:::

:::theorem{#eckart-young-theorem-best-low-rank title="Eckart-Young Theorem (Best Approximation by Linear Map with $\dim \rng \leq k$)"}
Suppose $T \in \Lcal(V,W)$ and $s_1 \geq \dots \geq s_m$ are the positive singular values of $T$. Suppose $k$ is any integer between $1$ and $m$. Then 
$$
\min \{ \nm{T-S} : S \in \Lcal(V,W) \text{ and } \dim \rng S \leq k \} = s_{k+1}.
$$

Furthermore, if
$$
Tv = s_1 \ip{v}{e_1}f_1 + \dots + s_m \ip{v}{e_m}f_m
$$ 
is a SVD of $T$, then the linear map $T_k \in \Lcal(V,W)$ defined by 
$$
T_kv = s_1\ip{v}{e_1}f_1 + \dots + s_k \ip{v}{e_k}f_k
$$
has $\dim \rng T_k = k$ and attains the optimal bound. That is, $\nm{T-T_k} = s_{k+1}$.
:::

:::moral
SVD says every linear map $T : V \to W$ is, in the right pair of orthonormal lists ($\{e_k\}$ for $V$ and $\{f_k\}$ for $W$), a pure diagonal rescaling. The $e_k$-direction is stretched by $s_k$ and mapped to the $f_k$-direction. You need *two* bases because $V \neq W$ in general, unlike the spectral theorem (which is SVD in the special case $V = W$, $T$ self-adjoint, where one basis suffices).

**Connects $T$, $T^*$, $T^+$:** same $s_k$, $e_k$, $f_k$, used differently:
$$
\begin{aligned}
  T&: e_k \mapsto s_k f_k \quad \text{(stretch $s_k$, domain to codomain)}\\
  T^*&: f_k \mapsto s_k e_k \quad \text{(same stretch, reversed direction)}\\
  T^+&: f_k \mapsto \tfrac{1}{s_k} e_k \quad \text{(invert the stretch, codomain to domain)}
\end{aligned}
$$
:::

## Volume, Parallelepipeds, and SVD

:::definition{#parallelepipeds-boxes-and-volume title="Parallelepipeds, Boxes, and Volume"}
The **parallelepiped** spanned by $v_1,\ldots,v_n \in V$ is:

$$
P(v_1,\ldots,v_n) \;=\; \bigl\{t_1 v_1 + \cdots + t_n v_n \;\big|\; t_i \in [0,1]\bigr\}.
$$

A **box** is a parallelepiped $P(r_1 e_1,\ldots,r_n e_n)$ where $e_1,\ldots,e_n$ is an orthonormal basis (ONB) and $r_1,\ldots,r_n \geq 0$. Boxes are the "right-angled" parallelepipeds. The **volume** of such a box is defined to be $r_1 \cdot r_2 \cdots r_n$, the product of its edge lengths. This agrees with our usual notions of length, area, and volume in dimensions 1, 2, and 3. 

Volume of a general subset $\Omega \subseteq V$ is defined by approximating $\Omega$ by a collection of disjoint boxes and summing their volumes (the standard notion from analysis).
:::

:::theorem{#volume-changes-by-the-product-of title="Volume Changes by the Product of the Singular Values"}
Suppose $\F = \R$, $T \in \Lcal(V)$ is invertible, and $\Omega \subseteq V$. Then:

$$
\mathrm{vol}(T(\Omega)) \;=\; (s_1 \cdot s_2 \cdots s_n)\cdot\mathrm{vol}(\Omega),
$$

where $s_1,\ldots,s_n$ are the singular values of $T$.
:::

:::proof
Let $Tv = s_1\ip{v}{e_1}f_1 + \cdots + s_n\ip{v}{e_n}f_n$ be the SVD of $T$, so $e_1,\ldots,e_n$ and $f_1,\ldots,f_n$ are both orthonormal bases of $V$.

Approximate $\Omega$ by boxes of the form $u + P(r_1 e_1,\ldots,r_n e_n)$ (boxes whose edges are parallel to the right singular vectors $e_1,\ldots,e_n$). By the definition of volume of a box ([[#parallelepipeds-boxes-and-volume]]), each such box has volume $r_1\cdots r_n$.

Now compute where $T$ sends such a box. For any $v = u + \sum_k t_k r_k e_k$ with $t_k \in [0,1]$:

$$
Tv \;=\; Tu + \sum_{k=1}^n t_k r_k s_k f_k.
$$

As the $t_k$ range over $[0,1]$, this traces out exactly the box $Tu + P(r_1 s_1 f_1,\ldots, r_n s_n f_n)$. Since $f_1,\ldots,f_n$ are orthonormal (in particular pairwise orthogonal), this is a box whose edges are parallel to the left singular vectors $f_1,\ldots,f_n$, with edge lengths $r_1 s_1,\ldots,r_n s_n$. Its volume is:

$$
(r_1 s_1)(r_2 s_2)\cdots(r_n s_n) \;=\; (s_1\cdots s_n)\cdot(r_1\cdots r_n).
$$

So $T$ maps every approximating box for $\Omega$ (in the $e_k$-basis) to an approximating box for $T(\Omega)$ (in the $f_k$-basis), and each box's volume is scaled by the same factor $s_1\cdots s_n$. Therefore $\mathrm{vol}(T(\Omega)) = (s_1\cdots s_n)\cdot\mathrm{vol}(\Omega)$.
:::

:::moral
**The boxes-to-boxes picture.** The SVD $T = U\Sigma V^T$ decomposes every linear map into three stages: (1) $V^T$ rotates/reflects the domain to align with the right singular vectors; (2) $\Sigma$ stretches each direction $e_k$ by factor $s_k$, turning the unit parallelepiped into an orthogonal box with side lengths $s_1,\ldots,s_n$; (3) $U$ rotates/reflects that box into its final orientation. Steps (1) and (3) don't change volume (isometries). Step (2) scales volume by $s_1 s_2 \cdots s_n$.

<figure class="fig">
  <img src="/figures/linear-algebra/svd-volume.svg" alt="SVD as rotate, stretch, rotate: volume scales by the product of singular values">
</figure>

**Connection to the determinant and calculus:** Once determinants are developed, one proves $|\det T| = s_1\cdots s_n$ directly from the SVD (using multiplicativity of det and $|\det Q| = 1$ for any orthogonal $Q$). The full generality (all parallelepipeds, not just the right-singular-vector one) follows from the identity $\mathrm{vol}(T(P)) = |\det T|\cdot\mathrm{vol}(P)$.

**Degenerate case:** If any $s_k = 0$, then $T$ collapses $\R^n$ into a proper subspace. The product $s_1\cdots s_n = 0$ correctly predicts that any full-dimensional parallelepiped is flattened to zero volume.
:::

## Matrix Factorizations: QR, Cholesky, LU

Beyond the spectral theorem and SVD, several other factorizations are workhorses in numerical linear algebra, statistics, and machine learning.

:::theorem{#qr-factorization title="QR Factorization"}
Suppose $A$ is a square matrix with linearly independent columns. Then there exist **unique** matrices $Q$ and $R$ such that $Q$ is unitary (orthogonal over $\R$), $R$ is upper triangular with only positive numbers on its diagonal, and

$$
A = QR.
$$

:::

:::proof
*Existence.* Let $v_1,\ldots,v_n$ be the columns of $A$. Apply Gram–Schmidt ([[#gram-schmidt-procedure]]) to get an ONB $e_1,\ldots,e_n$ of $\F^n$ with $\spn(v_1,\ldots,v_k) = \spn(e_1,\ldots,e_k)$ for each $k$. Define the matrix $R$ by

$$
R_{j,k} = \ip{v_k}{e_j}.
$$

If $j > k$, then $e_j \perp \spn(e_1,\ldots,e_k) = \spn(v_1,\ldots,v_k)$, so $\ip{v_k}{e_j} = 0$. Thus $R$ is upper triangular.

Let $Q$ be the matrix with columns $e_1,\ldots,e_n$ (unitary, since its columns are an ONB). The $k$-th column of $QR$ is the linear combination of the columns of $Q$ with coefficients from the $k$-th column of $R$:

$$
(QR)_{\cdot,k} = \sum_{j=1}^n R_{j,k}\, e_j = \sum_{j=1}^k \ip{v_k}{e_j}\, e_j = v_k,
$$

where the last step is the ONB expansion of $v_k$ (which lies in $\spn(e_1,\ldots,e_k)$). Thus $QR = A$.

*Positive diagonal.* The Gram–Schmidt equations show each $v_k$ equals a *positive* multiple of $e_k$ plus a combination of $e_1,\ldots,e_{k-1}$ (the normalization step divides by $\nm{f_k} > 0$). Hence $R_{k,k} = \ip{v_k}{e_k} > 0$.

*Uniqueness.* If $A = \hat Q\hat R$ with $\hat Q$ unitary and $\hat R$ upper triangular with positive diagonal, then reading the columns shows each $v_k$ is a combination of the first $k$ columns of $\hat Q$ with positive $k$-th coefficient. These two conditions ($\spn$-matching and positive leading coefficient) uniquely determine an orthonormal list — forcing $\hat Q = Q$ and thus $\hat R = R$.
:::

:::remark
QR decomposition has two canonical uses:

- **Solving $Ax = b$ without Gaussian elimination:** $Ax = b \iff QRx = b \iff Rx = Q^*b$. Computing $Q^*b$ is one matrix–vector multiply; solving $Rx = Q^*b$ is back-substitution (fast, since $R$ is triangular).
- **Least squares done right:** the OLS normal equations $X^TX\hat\beta = X^Ty$ square the condition number. With $X = QR$: $\hat\beta = R^{-1}Q^Ty$, computed by back-substitution. This is numerically far superior and is what standard software actually does.

:::

:::definition{#positive-definite-matrices title="Positive Definite Matrices"}
A self-adjoint $T \in \Lcal(V)$ is **positive invertible** iff $\ip{Tv}{v} > 0$ for every $v \neq 0$ (strict inequality; compare PSD which allows $= 0$).

In matrix language: $B \in \F^{n,n}$ is **positive definite** if $B^* = B$ and $\ip{Bx}{x} > 0$ for every nonzero $x \in \F^n$.

*Proof of the equivalence:* If $T$ is positive and invertible, then $v \neq 0 \Rightarrow Tv \neq 0 \Rightarrow \ip{Tv}{v} \neq 0$ (a positive operator with $\ip{Tv}{v} = 0$ forces $Tv = 0$), hence $> 0$. Conversely if $\ip{Tv}{v} > 0$ for all $v \neq 0$, then $Tv \neq 0$ for all $v \neq 0$, so $T$ is injective, hence invertible.
:::

:::theorem{#cholesky-factorization title="Cholesky Factorization"}
Suppose $B$ is a positive definite matrix. Then there exists a **unique** upper-triangular matrix $R$ with only positive numbers on its diagonal such that

$$
B = R^*R.
$$

:::

:::proof
*Existence.* Because $B$ is positive definite, by [[#characterizations-of-positive-operators]] (f) there exists an *invertible* matrix $A$ with $B = A^*A$ (e.g., $A = B^{1/2}$, the positive square root, invertible since $B$ is). Take the QR factorization $A = QR$ ([[#qr-factorization]]), with $Q$ unitary and $R$ upper triangular with positive diagonal. Then

$$
B = A^*A = (QR)^*(QR) = R^*Q^*QR = R^*R.
$$

*Uniqueness.* Suppose also $B = S^*S$ with $S$ upper triangular with positive diagonal. $S$ is invertible (since $B$ is). Then

$$
(AS^{-1})^*(AS^{-1}) = (S^*)^{-1}A^*A\,S^{-1} = (S^*)^{-1}B\,S^{-1} = (S^*)^{-1}S^*S\,S^{-1} = I,
$$

so $AS^{-1}$ is unitary. Hence $A = (AS^{-1})\,S$ is a factorization of $A$ as unitary $\times$ (upper triangular with positive diagonal). By the *uniqueness* of the QR factorization, $S = R$.
:::

:::remark
**Cholesky is the triangular square root** and is among the most-used factorizations in computational statistics.
:::

:::definition{#lu-factorization title="LU Factorization"}
For an invertible $A \in \F^{n,n}$ (with row pivoting): there exist a permutation matrix $P$, unit lower-triangular $L$, and upper-triangular $U$ with

$$
PA = LU.
$$

*Sketch:* Gaussian elimination reduces $A$ to upper-triangular $U$ by subtracting multiples of rows from later rows; each such row operation is left-multiplication by a unit lower-triangular elementary matrix. Collecting the inverses of these operations gives $L$. Pivoting (the permutation $P$) is needed when a zero (or numerically tiny) pivot appears.
:::

## PCA and Statistical Connections

:::definition{#setup-sample-covariance-matrix title="Setup: Sample Covariance Matrix"}
Let $X \in \R^{m \times n}$ be a data matrix with $m$ observations and $n$ features, with **centered columns** (each feature has zero mean). The **sample covariance matrix** is:

$$
\Sigma = X^TX \;\in\; \R^{n \times n}.
$$

$\Sigma$ is always real symmetric PSD (this is just the key example $T^*T$: symmetric by $(X^TX)^T = X^TX$; PSD since $v^TX^TXv = \nm{Xv}^2 \geq 0$). Its $(i,j)$-entry is $\sum_k X_{ki}X_{kj}$ (the dot product of features $i$ and $j$), so $\Sigma_{ii}$ is the variance of feature $i$ and $\Sigma_{ij}$ is the covariance of features $i$ and $j$.
:::

:::theorem{#pca-via-the-spectral-theorem title="PCA via the Spectral Theorem"}
Let $\Sigma = Q\Lambda Q^T$ with $\lambda_1 \geq \cdots \geq \lambda_n \geq 0$ (from the spectral theorem applied to $\Sigma$).

**First PC:** Maximize variance along a unit direction: $\arg\max_{\nm{q}=1} q^T\Sigma q = v_1$ (top eigenvector). By the Rayleigh quotient argument (Step 1 of the spectral theorem proof), maximized value $= \lambda_1$.

**$k$-th PC:** Maximize variance orthogonal to $v_1,\ldots,v_{k-1}$: $= v_k$ with value $\lambda_k$. (Apply the Rayleigh quotient argument in $\{v_1,\ldots,v_{k-1}\}^\perp$, which is $\Sigma$-invariant by self-adjointness.)

**Total variance in $k$ dimensions:** $\lambda_1 + \cdots + \lambda_k$. The **fraction of variance explained** by $k$ PCs is $\frac{\lambda_1+\cdots+\lambda_k}{\lambda_1+\cdots+\lambda_n} = \frac{\lambda_1+\cdots+\lambda_k}{\mathrm{tr}(\Sigma)}$.
:::

:::theorem{#three-equivalent-formulations-of-pca title="Three Equivalent Formulations of PCA"}
Let $X \in \R^{m\times n}$ be centered, $\Sigma = X^TX$.

1. **Maximize projected variance:** $\displaystyle\max_{\substack{W \subseteq \R^n\\\dim W = k}} \sum_{i=1}^m \nm{P_W x_i}^2 = \lambda_1 + \cdots + \lambda_k$, attained by $W^* = \spn\{v_1,\ldots,v_k\}$.
2. **Minimize reconstruction error:** $\displaystyle\min_{\substack{W \subseteq \R^n\\\dim W = k}} \sum_{i=1}^m \nm{x_i - P_W x_i}^2 = \lambda_{k+1} + \cdots + \lambda_n$. Equivalent to (1) by Pythagoras ($\nm{x_i}^2 = \nm{P_Wx_i}^2 + \nm{x_i-P_Wx_i}^2$).
3. **Best low-rank matrix approximation (Eckart-Young):** $\displaystyle\min_{\mathrm{rank}(\hat X)\leq k}\nm{X - \hat X}_F^2 = s_{k+1}^2 + \cdots + s_n^2$, where $s_i$ are the singular values of $X$. Note $\lambda_i = s_i^2$ (eigenvalues of $X^TX$ = squares of singular values of $X$).

:::

:::remark
Orthogonality of principal components ($v_1,\ldots,v_k$ orthogonal) is *not* imposed by hand. It falls out automatically: the PCs are eigenvectors of $\Sigma$, and self-adjoint operators have orthogonal eigenvectors (for distinct eigenvalues). When eigenvalues repeat, any ONB of the repeated eigenspace can serve as PCs; in this case there is no unique choice.
:::

More to come...
