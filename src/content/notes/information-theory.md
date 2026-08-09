---
title: "Introduction to Information Theory"
code: InfoTheory
description: "Lossless source coding from first principles: prefix codes and Kraft–McMillan, entropy, Huffman and arithmetic coding, the source coding theorem, and cross entropy and KL divergence."
date: 2026-08-09
---

**References:** *Elements of Information Theory* by Cover & Thomas; *Information Theory, Inference, and Learning Algorithms* by MacKay; *Information Theory: From Coding to Learning* by Polyanskiy & Wu; Shannon's 1948 paper *A Mathematical Theory of Communication*.

This entry develops the core of lossless source coding from first principles: what a "source" (or "language") formally is; prefix-free codes and the Kraft–McMillan inequality; entropy as the fundamental limit of compression; how fractional bits are realized operationally (block coding and arithmetic coding); the duality between codes and probability distributions; Shannon's source coding theorem via the asymptotic equipartition property; and cross entropy and the Kullback–Leibler divergence as the cost of coding with the wrong model. A final section treats countably infinite and continuous alphabets carefully — in particular, *why discrete entropy does not survive the passage to the continuum but KL divergence does*. Throughout, $\log$ denotes $\log_2$ and $\ln$ the natural logarithm; entropies are measured in bits. We adopt the convention $0 \log 0 = 0$ (justified by $\lim_{t \downarrow 0} t \log t = 0$).

## The Setup: Sources, Codes, and What "Language" Means

### Sources

Information theory's model of a "language" is deliberately impoverished: it forgets grammar, meaning, and syntax, and keeps only *statistics*. This is a feature. The compression results below hold for *any* statistical source, and everything a compressor can exploit is, by definition, statistical regularity.

:::definition{#source title="Source"}
A **(discrete, memoryless) source** is a pair $(\X, p)$ where $\X$ is a finite or countable set (the **alphabet**; its elements are **symbols**) and $p$ is a probability mass function on $\X$. The source emits an i.i.d. sequence $X_1, X_2, \ldots \sim p$. A **message** of length $n$ is a realization $x^n = (x_1, \ldots, x_n) \in \X^n$.
:::

So when people say "the language English" in this context, they mean something like: $\X$ is a set of characters (or words, or tokens), and $p$ is the frequency distribution with which they occur. The i.i.d. assumption is obviously false for natural language — the symbols are strongly correlated — but nothing is lost by starting there. The fully general model of a source is an arbitrary stochastic process $(X_n)_{n \geq 1}$ with values in $\X$: a probability measure on the sequence space $\X^{\infty}$, whose finite-dimensional laws $\PR(X_1 = x_1, \ldots, X_n = x_n)$ encode all the dependence (that "q" is nearly always followed by "u," and so on); the i.i.d. source is the special case where these laws factorize. Once entropy and conditional entropy are in hand, the subsection on the entropy rate develops the general theory: for *stationary ergodic* processes, every theorem in this document holds with the entropy $H(p)$ replaced by the *entropy rate*. The i.i.d. case simply lets us invoke the law of large numbers where the general case needs the ergodic theorem; no conceptual content is lost.

### Codes

:::definition{#code title="Code"}
Let $\bits^* = \bigcup_{k \geq 0} \bits^k$ denote the set of finite binary strings. A **(binary symbol) code** is a map $C : \X \to \bits^*$. Write $\ell(x) = |C(x)|$ for the length of the codeword of $x$. The **extension** $C^* : \X^* \to \bits^*$ encodes a message by concatenation:
$C^*(x_1 \cdots x_n) = C(x_1) C(x_2) \cdots C(x_n)$.
:::

Concatenation *with no separators* is the crux. Bits are all we get to transmit; there is no "comma" symbol. This forces a hierarchy of injectivity conditions:

:::definition{#code-classes title="Nonsingular, Uniquely Decodable, Prefix-Free"}
A code $C$ is:

(a) **nonsingular** if $C$ is injective on $\X$;

(b) **uniquely decodable** if the extension $C^*$ is injective on $\X^*$;

(c) **prefix-free** (or **instantaneous**) if no codeword is a proper prefix of another codeword.
:::

Prefix-free $\Rightarrow$ uniquely decodable $\Rightarrow$ nonsingular, and both implications are strict. (E.g. $C(a) = 0$, $C(b) = 01$, $C(c) = 11$ is uniquely decodable but not prefix-free: you can always decode, but you may need to look arbitrarily far ahead to know where the current codeword ends.) Prefix-free codes are the ones you can decode *online*, symbol by symbol, the instant each codeword completes — hence "instantaneous." Remarkably, restricting to prefix-free codes costs nothing in expected length ([[#mcmillan]]), so from now on "code" will mean "prefix-free code" unless stated otherwise.

:::definition{#expected-length title="Expected Length; the Objective"}
The **expected length** of a code $C$ under source $p$ is

$$
L(C, p) \;=\; \E_{X \sim p}[\ell(X)] \;=\; \sum_{x \in \X} p(x)\, \ell(x) \quad \text{bits/symbol}.
$$

The lossless compression problem: minimize $L(C,p)$ over uniquely decodable $C$.
:::

That is the entire setup. One map, one constraint (decodability), one objective (expected bits per symbol). Everything else — entropy, cross entropy, KL — will emerge as the answer to, or the cost structure of, this optimization problem.

## Prefix-Free Codes: Trees, Intervals, and Kraft–McMillan

### The tree picture

Identify binary strings with nodes of the infinite rooted binary tree: the root is the empty string; the node $s$ has children $s0$ and $s1$. Then *"$s$ is a prefix of $t$"* $\iff$ *"$t$ is a descendant of $s$."* Consequently:

*A prefix-free code is exactly an antichain in the binary tree: a set of nodes, none of which is an ancestor of another.*

This is the "pick a node and its whole subtree is deleted" picture: the moment you spend a codeword at node $s$, every descendant of $s$ becomes unusable (any descendant would have $s$ as a prefix). Codewords are therefore leaves of the finite tree obtained by pruning at the chosen nodes.

<figure class="fig">
  <img src="/figures/information-theory/code-tree.svg" alt="The prefix-free code {0, 10, 110, 111} as an antichain in the binary tree">
</figure>

*The prefix-free code $\{0,\, 10,\, 110,\, 111\}$ (filled nodes). Choosing $0$ as a codeword deletes its entire subtree (dashed): no other codeword may descend from it. The codeword depths are $(1,2,3,3)$ and $2^{-1}+2^{-2}+2^{-3}+2^{-3} = 1$: the code is complete — it saturates the Kraft inequality.*

### The interval picture

An equivalent geometry, which will pay off twice (in the Kraft converse and in arithmetic coding): map the codeword $c = c_1 c_2 \cdots c_\ell$ to the dyadic interval

$$
I(c) \;=\; \big[\, 0.c_1 c_2 \cdots c_\ell,\; 0.c_1 c_2 \cdots c_\ell + 2^{-\ell} \,\big) \;\subseteq\; [0,1),
$$

i.e., the set of reals in $[0,1)$ whose binary expansion begins with $c$. Its length is $|I(c)| = 2^{-\ell}$. Then $c$ is a prefix of $c'$ $\iff$ $I(c') \subseteq I(c)$, and two binary strings are prefix-incomparable $\iff$ their intervals are disjoint (dyadic intervals are nested or disjoint, never partially overlapping). A codeword of length $\ell$ "costs" $2^{-\ell}$ of a total budget of $1$: short codewords are expensive because they consume large chunks of $[0,1)$.

<figure class="fig">
  <img src="/figures/information-theory/dyadic-intervals.svg" alt="The code {0, 10, 110, 111} as a partition of the unit interval into dyadic intervals">
</figure>

*The same code as the tree figure, viewed as a partition of $[0,1)$ into dyadic intervals of lengths $2^{-\ell(x)}$.*

### Kraft and McMillan

:::theorem{#kraft title="Kraft Inequality"}
**(i)** If $C : \X \to \bits^*$ is prefix-free, then

$$
\sum_{x \in \X} 2^{-\ell(x)} \;\leq\; 1.
$$
{#kraft-ineq}

**(ii)** Conversely, given any lengths $\{\ell_x\}_{x \in \X} \subseteq \N$ (with $\X$ finite or countable) satisfying [[#kraft-ineq]], there exists a prefix-free code with exactly those codeword lengths.
:::

:::proof
(i) The intervals $\{I(C(x))\}_{x \in \X}$ are pairwise disjoint subsets of $[0,1)$, so their total Lebesgue measure $\sum_x 2^{-\ell(x)}$ is at most $1$.

(ii) Order the lengths so that $\ell_1 \leq \ell_2 \leq \cdots$ and allocate intervals greedily left to right: give the $i$-th symbol the interval $[a_i, a_i + 2^{-\ell_i})$ where $a_i = \sum_{j < i} 2^{-\ell_j}$. Since every earlier length satisfies $\ell_j \leq \ell_i$, each $2^{-\ell_j}$ is an integer multiple of $2^{-\ell_i}$; hence $a_i$ is a multiple of $2^{-\ell_i}$, so $[a_i, a_i + 2^{-\ell_i})$ is a genuine dyadic interval, corresponding to a binary string of length $\ell_i$. By [[#kraft-ineq]] we never run past $1$. The intervals are disjoint by construction, so the code is prefix-free. (For countable $\X$ the same greedy construction works; [[#kraft-ineq]] guarantees the partial sums stay in $[0,1]$.)
:::

:::theorem{#mcmillan title="McMillan's Theorem"}
Every *uniquely decodable* code also satisfies [[#kraft-ineq]]. Consequently, for any uniquely decodable code there is a prefix-free code with the same codeword lengths: unique decodability buys nothing beyond prefix-freeness in terms of achievable lengths.
:::

:::proof{title="Proof (finite $\X$; Karush's counting argument)"}
We first fix notation; the proof introduces one auxiliary parameter and two derived objects, and it is worth being pedantic about what each one is.

- $S := \sum_{x \in \X} 2^{-\ell(x)}$ is the Kraft sum: a single fixed real number, determined by the code. The goal is $S \leq 1$.
- $n \in \N$ is a *free parameter*, introduced out of thin air, with no meaning intrinsic to the code. The strategy is to prove, for *every* $n$, an inequality relating $S$ and $n$, and then let $n \to \infty$ at the very end.
- $x^n = (x_1, \ldots, x_n) \in \X^n$ denotes a message of $n$ source symbols. (The superscript is tuple notation, not a power — standard but regrettable information-theory convention.) Its encoding $C^*(x^n) = C(x_1)\cdots C(x_n)$ has bit length $|C^*(x^n)| = \ell(x_1) + \cdots + \ell(x_n)$, since concatenation adds lengths.
- $\ell_{\max} := \max_{x \in \X} \ell(x)$ is the length of the longest codeword (finite because $\X$ is finite). Its only role: every length-$n$ message encodes to at most $n \ell_{\max}$ bits, so $n\ell_{\max}$ is the range of possible encoded lengths.
- $N_m := \#\big\{x^n \in \X^n : |C^*(x^n)| = m\big\}$ counts the length-$n$ messages whose encoding is *exactly* $m$ bits long. (It depends on $n$ as well; we suppress this in the notation since $n$ is fixed until the last line.)

*Step 1: $S^n$ is the Kraft sum of the block code.* Here $S^n$ is literally the number $S$ raised to the $n$-th power. Expanding the $n$-th power of a sum by the distributive law — one term per choice of one summand from each factor, i.e. one term per $n$-tuple —

$$
S^n \;=\; \Bigg(\sum_{x \in \X} 2^{-\ell(x)}\Bigg)^{\!n}
\;=\; \sum_{x_1 \in \X} \cdots \sum_{x_n \in \X} 2^{-\ell(x_1)} \cdots\, 2^{-\ell(x_n)}
\;=\; \sum_{x^n \in \X^n} 2^{-|C^*(x^n)|}.
$$

Interpretation: $S^n$ is the Kraft sum of the induced code $C^*$ on the super-alphabet $\X^n$ of length-$n$ messages.

*Step 2: regroup by encoded length.* Instead of summing message by message, collect together all messages whose encoding has the same length $m$; since $1 \leq |C^*(x^n)| \leq n\ell_{\max}$,

$$
S^n \;=\; \sum_{m=1}^{n \ell_{\max}} N_m\, 2^{-m}.
$$

*Step 3: unique decodability enters — the only time.* Unique decodability says $C^*$ is injective: distinct messages receive distinct bitstrings. But only $2^m$ binary strings of length $m$ exist in the world, and an injective map cannot send more than $2^m$ messages onto them. Hence

$$
N_m \;\leq\; 2^m \qquad \text{for every } m.
$$

*Step 4: exponential versus linear.* Combining Steps 2 and 3,

$$
S^n \;\leq\; \sum_{m=1}^{n\ell_{\max}} 2^m \cdot 2^{-m} \;=\; n\, \ell_{\max} \qquad \text{for every } n \geq 1.
$$

Both $S$ and $\ell_{\max}$ are fixed constants. If $S > 1$, the left side grows exponentially in $n$ while the right side grows linearly — contradiction for large $n$. Equivalently, take $n$-th roots: $S \leq (n \ell_{\max})^{1/n} = 2^{\log(n\ell_{\max})/n} \to 2^0 = 1$, so $S \leq 1$.

Finally, countable $\X$: the restriction of a uniquely decodable code to any finite subalphabet $F \subseteq \X$ is still uniquely decodable (fewer messages to distinguish), so $\sum_{x \in F} 2^{-\ell(x)} \leq 1$ for every finite $F$; take the supremum over $F$.
:::

**Rigorous intuition.** Kraft is a conservation law: codeword lengths are not free-floating integers but shares of a unit budget, with a length-$\ell$ codeword costing $2^{-\ell}$. The tree says why: committing to a shallow node destroys exponentially much of the tree below it. McMillan says this budget constraint is not an artifact of the prefix-free restriction — it binds *any* scheme that can be decoded at all, which is why the entire theory can be phrased in terms of prefix codes without loss.

As for the proof, which looks pulled from thin air (an unmotivated power $S^n$, a mysterious regrouping, a limit): it is in fact forced, and two observations reconstruct it. *First, the only available hypothesis is a counting statement.* The interval proof of Kraft is dead on arrival here — for a merely uniquely decodable code the intervals can nest ($C = \{0, 01, 11\}$ is uniquely decodable but $I(01) \subseteq I(0)$) — and once the geometry is stripped away, the definition of unique decodability provides exactly one thing: $C^*$ is *injective on $\X^n$, for every $n$*. Injectivity into binary strings is intrinsically a counting fact — at most $2^m$ things can be sent to strings of length $m$ — so whatever the proof is, it must be a counting argument; there is no other material to build with. *Second, long blocks must appear, because the single-letter hypothesis is provably too weak.* Injectivity on $\X$ alone (nonsingularity) does not imply Kraft: $C(a) = 0$, $C(b) = 1$, $C(c) = 00$ is injective on $\{a,b,c\}$ with $S = \tfrac12 + \tfrac12 + \tfrac14 > 1$ (and indeed not uniquely decodable: $00$ encodes both $c$ and $aa$). So the force pinning $S \leq 1$ can only come from injectivity on *long* messages — a code with $S > 1$ over-promises short encodings, and the fraud is exposed only when many symbols must be encoded at once and the code runs out of distinct short bitstrings. This dictates the proof's shape before any formula is written: derive one inequality per block length $n$, and extract the conclusion as $n \to \infty$. The parameter $n$ is not clever; it is the hypothesis's own index variable, and the creative act is reading "for every $n$" in the definition not as a burden to verify but as a resource to spend. Everything else is bookkeeping: cashing out injectivity at block length $n$ gives $\sum_m N_m 2^{-m} \leq n\ell_{\max}$, the left side factorizes into $S^n$ because the weight $2^{-\ell}$ is multiplicative under concatenation, and $n$-th roots annihilate the linear slack (the "tensor power trick," the same subexponential-factors-die principle that runs the asymptotics of the source coding theorem). One historical footnote that should itself be reassuring: this is not McMillan's proof — his 1956 original was substantially more involved; the counting argument is Karush's (1961). Slick proofs are usually archaeology, found after the theorem by asking what the first proof was really using.

## Entropy

### Surprisal and the definition

:::definition{#entropy title="Surprisal, Entropy"}
For a source $(\X, p)$, the **surprisal** (or self-information) of the outcome $x$ is $-\log p(x)$ bits. The **entropy** of $X \sim p$ is the expected surprisal:

$$
H(X) \;=\; H(p) \;=\; -\sum_{x \in \X} p(x) \log p(x) \;=\; \E_{X\sim p}\!\left[\log \tfrac{1}{p(X)}\right] \;\;\text{bits}.
$$
:::

Why $-\log p$, and not some other decreasing function of $p$? Two forcing considerations:

1. **Additivity over independence.** If $X \perp Y$, observing the pair should be exactly as surprising as observing each in turn: $s(p(x)p(y)) = s(p(x)) + s(p(y))$. Among monotone functions, only $s(p) = -c \log p$ satisfies $s(pq) = s(p) + s(q)$ (Cauchy's functional equation, with monotonicity ruling out pathological solutions). The base of the log fixes the unit; base $2$ means "bits."
2. **Coding.** As proved below in the section on optimal symbol codes, $-\log p(x)$ is (up to integer rounding, and exactly in the limit) the number of bits an optimal code spends on $x$. Surprisal *is* an optimal codeword length; entropy *is* an optimal expected code length. This is the operational meaning, and it is the one to internalize.

:::remark{#axiomatic title="Axiomatic Characterization"}
One can go further: Shannon (1948), sharpened by Faddeev and by Khinchin, proved that any functional $H(p_1, \ldots, p_m)$ on finite distributions that is (a) continuous in $p$, (b) symmetric, (c) maximized by the uniform distribution among distributions on $m$ atoms, and (d) consistent under grouping —

$$
H(p_1, \ldots, p_m) = H(p_1 + p_2, p_3, \ldots, p_m) + (p_1 + p_2)\, H\!\left(\tfrac{p_1}{p_1+p_2}, \tfrac{p_2}{p_1+p_2}\right)
$$

("decide the coarse question first, then the refinement, weighted by how often you face it") — must equal $-c \sum_i p_i \log p_i$ for some constant $c > 0$. So entropy is not one plausible uncertainty measure among many; modulo units, it is the only one consistent with sequential refinement of questions.
:::

### Basic properties

:::proposition{#entropy-basics title="Range of Entropy"}
Let $\X$ be finite, $|\X| = m$. Then $0 \leq H(p) \leq \log m$. Moreover $H(p) = 0$ iff $p$ is a point mass, and $H(p) = \log m$ iff $p$ is uniform.
:::

:::proof
Each term $-p(x)\log p(x) \geq 0$, with equality iff $p(x) \in \{0,1\}$; this gives the lower bound and its equality case. For the upper bound, let $u$ be uniform on $\X$; then (anticipating the KL divergence)

$$
\log m - H(p) = \sum_x p(x)\log\frac{p(x)}{1/m} = \KL{p}{u} \geq 0,
$$

with equality iff $p = u$, by Gibbs' inequality ([[#gibbs]], whose proof is self-contained).
:::

:::definition{#joint-conditional-entropy title="Joint and Conditional Entropy"}
$H(X,Y) = -\sum_{x,y} p(x,y)\log p(x,y)$ and $H(Y \mid X) = \E_{x \sim p_X}\big[ H(Y \mid X = x)\big] = -\sum_{x,y} p(x,y) \log p(y \mid x)$.
:::

:::proposition{#chain-rule title="Chain Rule"}
$H(X,Y) = H(X) + H(Y \mid X)$. In particular, if $X_1, \ldots, X_n$ are i.i.d. copies of $X$, then $H(X_1, \ldots, X_n) = n\, H(X)$.
:::

:::proof
Expand $\log p(x,y) = \log p(x) + \log p(y \mid x)$ inside the expectation and split. Independence makes the conditional entropies equal the marginal ones; induct.
:::

The chain rule is the algebraic engine behind everything asymptotic: it is why "entropy per symbol" is a stable notion, and (in its conditional form) why context reduces the entropy rate of dependent sources.

:::example{#binary-entropy title="Binary Entropy Function"}
For $X \sim \mathrm{Bern}(\theta)$: $H(X) = h_2(\theta) := -\theta \log \theta - (1-\theta)\log(1-\theta)$, the **binary entropy function**: $h_2(1/2) = 1$ bit, $h_2(0.11) \approx 0.5$ bits, $h_2(0.01) \approx 0.0808$ bits. Keep $h_2(0.01)$ in mind: it says a very skewed coin carries about $1/12$ of a bit per flip — and the section on fractional bits owes us an explanation of how one can possibly *spend* $1/12$ of a bit.
:::

### Beyond i.i.d.: stationarity, ergodicity, and the entropy rate

We can now make good on the earlier promise: the theory does not need the i.i.d. assumption, and this subsection explains exactly what replaces it. A dependent source — a general process $(X_n)_{n \geq 1}$ — poses two separate problems, answered by two separate hypotheses:

(a) *Which single number plays the role of $H$?* For a dependent source there is no one entropy; the answer requires **stationarity** and is called the *entropy rate*.

(b) *Which limit theorem replaces the law of large numbers* in the AEP? The answer requires **ergodicity** and is the Birkhoff/Shannon–McMillan–Breiman circle of theorems.

:::definition{#stationarity title="Stationarity"}
The process $(X_n)_{n \geq 1}$ is **stationary** if its statistics are invariant under time shifts: for every $k \geq 1$ and every $t \geq 0$,

$$
(X_1, \ldots, X_k) \;\overset{d}{=}\; (X_{1+t}, \ldots, X_{k+t}).
$$
:::

Verbally: the probability of seeing any given pattern does not depend on *where* in the stream you look — the digram "th" is exactly as likely starting at position $17$ as at position $90{,}000$. This is a weak assumption: it says nothing whatsoever about independence, only that the source's statistical character does not drift over time. English prose is approximately stationary; a document that begins in English and switches to Mandarin halfway through is not. Every i.i.d. process is stationary; so is every time-homogeneous Markov chain started at equilibrium, every hidden-Markov process at equilibrium, etc.

Why stationarity is precisely the right hypothesis for (a): it makes "entropy per symbol" well-defined. A dependent source offers two competing candidates — the *block average* $\frac1n H(X_1, \ldots, X_n)$ and the *next-symbol conditional* $H(X_n \mid X_1, \ldots, X_{n-1})$ — and the theorem is that stationarity makes both converge, to the same number.

:::theorem{#entropy-rate title="Existence of the Entropy Rate"}
Let $(X_n)$ be stationary with $H(X_1) < \infty$. Then the limits

$$
H(\X) \;:=\; \lim_{n \to \infty} \frac{1}{n}\, H(X_1, \ldots, X_n) \;=\; \lim_{n \to \infty} H(X_n \mid X_1, \ldots, X_{n-1})
$$

both exist and are equal. $H(\X)$ is the **entropy rate** of the source, in bits per symbol.
:::

:::proof
*Step 1 (conditioning cannot increase entropy).* For any discrete $X, Y, Z$: $H(X \mid Y, Z) \leq H(X \mid Z)$. Indeed, the deficit is a conditional mutual information,

$$
H(X \mid Z) - H(X \mid Y, Z) \;=\; I(X; Y \mid Z) \;=\; \E_{z}\Big[\KL{P_{XY \mid Z = z}}{P_{X \mid Z=z} \otimes P_{Y \mid Z=z}}\Big] \;\geq\; 0,
$$

by Gibbs' inequality ([[#gibbs]] — a forward reference, but its proof depends on nothing in this section). More available information can only reduce average uncertainty.

*Step 2 (the conditional entropies decrease).* Set $a_n := H(X_n \mid X_1, \ldots, X_{n-1})$ (with $a_1 = H(X_1)$). Then

$$
a_{n+1} \;=\; H(X_{n+1} \mid X_1, \ldots, X_n)
\;\overset{\text{Step 1}}{\leq}\; H(X_{n+1} \mid X_2, \ldots, X_n)
\;\overset{\text{stat.}}{=}\; H(X_{n} \mid X_1, \ldots, X_{n-1}) \;=\; a_n,
$$

where the inequality discards the conditioning variable $X_1$ and the equality shifts the whole window back by one step — legal exactly because the process is stationary. So $(a_n)$ is nonincreasing and bounded below by $0$, hence converges; call the limit $H(\X)$.

*Step 3 (block averages are Cesàro means).* By the chain rule ([[#chain-rule]], in its general telescoping form $H(X_1,\ldots,X_n) = \sum_{k=1}^{n} H(X_k \mid X_1, \ldots, X_{k-1})$, valid without any independence),

$$
\frac{1}{n} H(X_1, \ldots, X_n) \;=\; \frac{1}{n} \sum_{k=1}^{n} a_k \;\longrightarrow\; H(\X),
$$

since arithmetic means of a convergent sequence converge to the same limit (split the sum at a fixed large $K$: the head contributes $O(K/n) \to 0$, and the tail averages terms all within $\varepsilon$ of the limit).
:::

**Dependence pays.** Step 2 is the quantitative version of "context helps": $H(\X) \leq a_2 \leq a_1 = H(X_1)$, with equality throughout iff consecutive symbols are independent; for i.i.d. sources $H(\X) = H(p)$, recovering the earlier theory as a special case. For English, the marginal character entropy (letter frequencies alone) is about $4.1$ bits, while Shannon's 1951 guessing experiments estimated the entropy *rate* at roughly $0.6$–$1.3$ bits per character: conditioning on context removes some three-quarters of the apparent information. That gap *is* the dependence structure, and it is exactly what any serious text compressor — including a language model driving a conditional arithmetic coder — gets paid for exploiting.

Now problem (b). Stationarity gives a well-defined number $H(\X)$, but the asymptotic theorems need more: they need the sequence you *actually observe* to be statistically representative of the process's law. Stationarity alone does not guarantee this, and the canonical counterexample is worth internalizing.

:::example{#nonergodic title="A Stationary, Non-Ergodic Source"}
At time zero, flip a hidden fair coin once. If heads, emit i.i.d. $\mathrm{Bern}(0.1)$ bits forever; if tails, emit i.i.d. $\mathrm{Bern}(0.3)$ bits forever. This *mixture* process is stationary (each component is, and a convex combination of stationary laws is stationary). But it is pathological for compression: any single realization comes entirely from one component. Its empirical frequency of $1$s converges to $0.1$ or to $0.3$ — each with probability $\tfrac12$ — and *never* to the ensemble mean $0.2$: time averages along one sequence disagree with expectations over the law. Correspondingly, the AEP fails: the normalized surprisal converges to a *random* limit,

$$
-\tfrac{1}{n} \log p(X_1, \ldots, X_n) \;\longrightarrow\; \begin{cases} h_2(0.1) \approx 0.469 & \text{w.p. } \tfrac12,\\[2pt] h_2(0.3) \approx 0.881 & \text{w.p. } \tfrac12,\end{cases}
$$

not to the constant entropy rate, which one can check is the average $H(\X) = \tfrac12 h_2(0.1) + \tfrac12 h_2(0.3) \approx 0.675$ (as $n$ grows, the past reveals which component is active, so the next-symbol conditional entropy tends to the active component's, averaged over the coin). No single number describes the compressibility of a realization; a fixed-rate scheme at, say, $R = 0.7$ bits/symbol succeeds with probability $\tfrac12$ and fails with probability $\tfrac12$, forever — no sharp threshold.
:::

Ergodicity is precisely the exclusion of this phenomenon:

:::definition{#ergodicity title="Ergodicity"}
A stationary process is **ergodic** if any of the following equivalent conditions holds:

(i) (*indecomposability*) its law is not a nontrivial mixture $\lambda P_1 + (1-\lambda) P_2$ of two *distinct* stationary laws — it is an extreme point of the convex set of stationary measures;

(ii) (*measure-theoretic form*) every shift-invariant event (an event whose occurrence is unchanged by deleting the first symbol, such as "the long-run frequency of $1$s exceeds $0.2$") has probability $0$ or $1$;

(iii) (*operational consequence*, via Birkhoff's pointwise ergodic theorem) time averages along a single realization converge almost surely to the corresponding expectations: for integrable $f$,
$\frac1n \sum_{i=1}^n f(X_i, X_{i+1}, \ldots) \to \E[f]$ a.s.
:::

In words: one stream is statistically representative of the whole law. The example above fails (i) by construction, fails (ii) because "the frequency of $1$s tends to $0.1$" is a shift-invariant event of probability $\tfrac12$, and fails (iii) as computed. (The general structure theorem — the *ergodic decomposition* — says every stationary process is a mixture of ergodic ones; so ergodic sources are the atoms of the theory, and the compression rate of any given realization of a stationary source is the entropy rate of the ergodic component it happened to be drawn from.)

With both hypotheses, the AEP survives in full:

:::theorem{#smb title="Shannon–McMillan–Breiman"}
Let $(X_n)$ be a stationary ergodic process on a finite alphabet. Then

$$
-\frac{1}{n} \log p(X_1, \ldots, X_n) \;\longrightarrow\; H(\X) \quad \text{almost surely and in } L^1.
$$
:::

This is [[#aep]] with the law of large numbers upgraded to the ergodic theorem and $H(p)$ replaced by the entropy rate. (The proof — the ergodic theorem applied to conditional surprisals, plus a sandwich argument — is genuinely harder and we omit it; see Cover & Thomas, §16.8.) Everything downstream then goes through verbatim: typical sets of size $\approx 2^{n H(\X)}$ on which the mass equidistributes, the source coding theorem with sharp threshold $H(\X)$, and achievability of the rate by conditional arithmetic coding. The honest summary of the relationship between this subsection and the rest of the document: *the i.i.d. theory is the general theory with the ergodic theorem swapped out for its simplest special case, the law of large numbers.* All the conceptual content lives in the i.i.d. case; the generalization strengthens one probabilistic input and changes nothing else.

## Optimal Symbol Codes

We now solve (to within one bit, then exactly) the problem posed at the start: $\min_C L(C,p)$.

### The lower bound: no code beats entropy

:::theorem{#entropy-lower-bound title="Entropy Lower Bound"}
For every uniquely decodable code $C$ on source $(\X,p)$,

$$
L(C, p) \;\geq\; H(p),
$$

with equality iff $p(x) = 2^{-\ell(x)}$ for all $x$ (a *dyadic* distribution matched by the code).
:::

:::proof
By McMillan, $c := \sum_x 2^{-\ell(x)} \leq 1$. Define the probability distribution $q(x) = 2^{-\ell(x)}/c$. Then

$$
L - H \;=\; \sum_x p(x)\,\ell(x) + \sum_x p(x)\log p(x)
\;=\; \sum_x p(x) \log \frac{p(x)}{2^{-\ell(x)}}
\;=\; \underbrace{\KL{p}{q}}_{\geq\, 0} \;+\; \underbrace{\log \tfrac{1}{c}}_{\geq\, 0} \;\geq\; 0,
$$

using Gibbs' inequality ([[#gibbs]]; its proof uses nothing from this section). Equality forces $c = 1$ and $p = q$, i.e. $p(x) = 2^{-\ell(x)}$.
:::

**Rigorous intuition.** The proof is a change of viewpoint that will become a main theme below: *read the code's lengths as a probability distribution* $q(x) \propto 2^{-\ell(x)}$ (legal precisely because of Kraft/McMillan). Then "expected length minus entropy" is revealed to be a divergence between the true source $p$ and the distribution $q$ the code is implicitly betting on, plus a penalty $\log(1/c)$ for wasting budget ($c<1$ means the code left part of the tree unused). Codes are probabilistic models; suboptimality is model mismatch.

### Achievability: Shannon codes

:::theorem{#shannon-code title="Shannon Codes"}
For any source $(\X, p)$ (finite or countable, $H(p) < \infty$) there is a prefix-free code with $\ell(x) = \ceil{\log \tfrac{1}{p(x)}}$, and it satisfies

$$
H(p) \;\leq\; L(C, p) \;<\; H(p) + 1.
$$
:::

:::proof
The lengths satisfy Kraft: $\sum_x 2^{-\ceil{\log 1/p(x)}} \leq \sum_x 2^{-\log 1/p(x)} = \sum_x p(x) = 1$, so by [[#kraft]](ii) a prefix-free code with these lengths exists. Since $\log\frac{1}{p(x)} \leq \ell(x) < \log\frac{1}{p(x)} + 1$, take expectations.
:::

So the natural recipe — *assign $x$ about $-\log p(x)$ bits* — is exactly right, with the ceiling handling the inconvenient fact that codeword lengths are integers. Rare symbols get long codewords, common symbols short ones, calibrated on a log scale, and the result is within $1$ bit per symbol of the fundamental limit. The tree picture explains the calibration: a symbol of probability $p$ deserves an interval of length $\approx p$ in the interval figure, i.e. a node at depth $\approx \log(1/p)$.

### Exact optimality: Huffman codes

Shannon's code is within one bit of optimal but need not be optimal, and it is worth seeing it fail before fixing it:

:::example{#shannon-waste title="Shannon's Code Wastes"}
Let $p = (0.9,\, 0.1)$. Shannon's recipe assigns lengths $\ceil{\log \frac{1}{0.9}} = \ceil{0.152} = 1$ and $\ceil{\log \frac{1}{0.1}} = \ceil{3.32} = 4$, for $L = 0.9(1) + 0.1(4) = 1.3$ bits/symbol — while the trivial code $\{0, 1\}$ achieves $L = 1$. The top-down rule "read the length off the probability, then round up" is blind to the fact that the budget freed by other symbols' roundings could be recycled.
:::

The exactly optimal symbol code is constructed by Huffman's algorithm (1952), which works *bottom-up*: instead of assigning lengths from probabilities and then building a tree, it builds the tree directly, growing it from the leaves.

:::definition{#huffman-algorithm title="Huffman's Algorithm"}
Maintain a *forest* of binary trees, each carrying a weight. Initially: one single-node tree per symbol $x$, with weight $p(x)$. Repeat until one tree remains:

*remove the two trees of smallest weight; make them the two children (branches labeled $0$ and $1$) of a new root whose weight is the sum of their weights; reinsert.*

After $|\X| - 1$ merges the single surviving tree is the code tree: the symbols sit at its leaves, and the codeword of $x$ is the string of $0/1$ branch labels on the path from the root down to $x$.
:::

:::example{#huffman-worked title="Huffman, Worked"}
Let $\X = \{a,b,c,d,e\}$ with $p = (0.4,\, 0.2,\, 0.2,\, 0.1,\, 0.1)$. The merges:

$$
\begin{array}{lll}
\text{merge } d\,(.1),\, e\,(.1) & \longrightarrow & \text{node } de\,(.2); \quad \text{forest weights } \{.4,\, .2,\, .2,\, .2\}\\
\text{merge } c\,(.2),\, de\,(.2) & \longrightarrow & \text{node } cde\,(.4); \quad \text{forest weights } \{.4,\, .2,\, .4\}\\
\text{merge } b\,(.2),\, cde\,(.4) & \longrightarrow & \text{node } bcde\,(.6); \quad \text{forest weights } \{.4,\, .6\}\\
\text{merge } a\,(.4),\, bcde\,(.6) & \longrightarrow & \text{root } (1.0).
\end{array}
$$

Reading branch labels from the root (see the figure below) gives $a \mapsto 0$, $b \mapsto 10$, $c \mapsto 110$, $d \mapsto 1110$, $e \mapsto 1111$: lengths $(1,2,3,4,4)$ and $L = 0.4 + 0.4 + 0.6 + 0.4 + 0.4 = 2.2$ bits, against $H(p) \approx 2.122$. (Ties in the merge rule may be broken arbitrarily: merging $b$ with $c$ at the second step instead yields the different code lengths $(1,3,3,3,3)$ — but the same $L = 2.2$. Huffman *codes* are not unique; the optimal expected length is.)
:::

<figure class="fig">
  <img src="/figures/information-theory/huffman-tree.svg" alt="The Huffman tree for the worked example, with branch labels and node weights">
</figure>

*The Huffman tree of [[#huffman-worked]]. Internal nodes show their weights — these are exactly the masses merged at each step — and their sum $0.2 + 0.4 + 0.6 + 1.0 = 2.2 = L$, illustrating the toll identity [[#toll]].*

**Why greedy merging of the two *smallest* weights is the sensible rule.** Observe what a single merge does: it hangs the two chosen trees one level deeper, so *every symbol inside the two merged trees gets exactly one bit longer*. The cost of a merge is therefore the total probability mass merged, and summing over the $|\X|-1$ merges — equivalently, over the internal nodes of the final tree, since each merge creates exactly one — gives, for any full code tree,

$$
L(C, p) \;=\; \sum_{x} p(x)\, \ell(x) \;=\; \sum_{\text{internal nodes } v} P(v),
\qquad P(v) := \sum_{\text{leaves } x \text{ below } v} p(x)
$$
{#toll}

(directly: $\ell(x)$ counts the internal-node ancestors of leaf $x$; swap the order of summation). So building an optimal tree means scheduling merges so that the total merged mass is small — and since a tree merged *early* will participate in *many* subsequent merges (accruing depth each time), you want the small probabilities absorbed early and the heavy ones joining as late as possible. Huffman's rule is exactly this instinct; the theorem is that the instinct is exactly right.

:::theorem{#huffman-optimality title="Huffman Optimality"}
The Huffman code minimizes $L(C,p)$ over all uniquely decodable symbol codes on a finite alphabet $\X$.
:::

:::proof
By McMillan ([[#mcmillan]]) it suffices to minimize over prefix-free codes, i.e. over code trees. Throughout, sort $\X = \{x_1, \ldots, x_m\}$ with $p_1 \geq p_2 \geq \cdots \geq p_m$, and note that an optimal code tree is *full* (every internal node has two children): a one-child internal node could be contracted, strictly shortening some codeword.

*Sibling lemma: some optimal code tree has $x_{m-1}$ and $x_m$ as sibling leaves at maximal depth.* Take any optimal tree. (a) If $p(x) > p(y)$ then $\ell(x) \leq \ell(y)$: swapping the two codewords changes $L$ by $(p(x) - p(y))(\ell(y) - \ell(x))$, which would be strictly negative if $\ell(x) > \ell(y)$, contradicting optimality. So the two least probable symbols may be assumed to sit at maximal depth (among symbols of equal probability, swapping codewords is free). (b) By fullness, a maximal-depth leaf has a sibling, and that sibling is also a leaf (an internal sibling would have still-deeper leaves). (c) Swapping labels among leaves at the same depth leaves $L$ unchanged, so relabel to place $x_{m-1}$ and $x_m$ on such a sibling pair.

*Induction on $m$.* For $m = 2$ the code $\{0, 1\}$ is trivially optimal. For $m > 2$, form the merged alphabet $\X' = \{x_1, \ldots, x_{m-2}, z\}$ with $p(z) = p_{m-1} + p_m$ — precisely Huffman's first merge. There is a two-way correspondence:

- any code tree $C'$ for $\X'$ *extends* to a code tree $C$ for $\X$ by growing children $0, 1$ under $z$'s leaf for $x_{m-1}, x_m$; the two symbols each pay one extra bit, so $L(C) = L(C') + (p_{m-1} + p_m)$;
- any code tree for $\X$ with the sibling property *contracts* (delete the sibling pair, put $z$ at their parent) to a code tree for $\X'$, with $L(C') = L(C) - (p_{m-1} + p_m)$ — in the language of [[#toll]], contraction deletes one internal node of toll exactly $p_{m-1} + p_m$.

Since the offset $p_{m-1} + p_m$ is a constant not depending on the code, the two optimization problems have the same minimizers under this correspondence; and by the sibling lemma, the minimum over $\X$-trees is attained *within* the sibling-property class, so nothing is lost by contracting. By the inductive hypothesis, Huffman's algorithm on $\X'$ produces an optimal $C'$; its extension is precisely Huffman's algorithm on $\X$ (the remaining merges of the two runs coincide), hence optimal.
:::

:::remark{#symbol-code-caveat}
"Optimal" here means optimal *among symbol codes* — codes that encode one symbol at a time. Even Huffman generally has $L > H$ strictly; by [[#entropy-lower-bound]], $L = H$ exactly iff $p$ is dyadic ($p(x) = 2^{-\ell_x}$), as in the tree figure above with $p = (\tfrac12, \tfrac14, \tfrac18, \tfrac18)$. The gap $L - H$ can be nearly a full bit ([[#skewed]]), and closing it requires abandoning symbol-by-symbol coding. That is the next section.
:::

## The Fractional-Bit Problem: Blocks and Arithmetic Coding

Here is the puzzle, stated sharply.

:::example{#skewed title="A Very Skewed Coin"}
Let $\X = \{a, b\}$ with $p(a) = 0.99$, $p(b) = 0.01$. Then $H(p) = h_2(0.01) \approx 0.0808$ bits, and the "optimal length" for $a$ is $-\log 0.99 \approx 0.0145$ bits. But every nonempty binary codeword has length $\geq 1$: *any* symbol code, Huffman included, is stuck at $L = 1$ bit/symbol — more than $12\times$ the entropy. In what sense is $0.0145$ bits meaningful?
:::

The resolution is that "$-\log p(x)$ bits" is an *amortized* statement, not a per-codeword one. No single codeword ever has fractional length. There are two ways to realize the amortization, one conceptually simple and one operationally beautiful.

### Resolution 1: block coding

:::definition{#block-code title="Block Code"}
Fix a block length $n$. An **$n$-block code** for the source $(\X, p)$ is nothing but a symbol code in the earlier sense, applied to the enlarged alphabet: the "symbols" are the blocks $x^n = (x_1, \ldots, x_n) \in \X^n$, whose distribution (for an i.i.d. source) is $p^{\otimes n}(x^n) = \prod_{i=1}^n p(x_i)$; a prefix-free map $C_n : \X^n \to \bits^*$ encodes the stream by cutting it into consecutive blocks of $n$ and concatenating their codewords. Its per-symbol rate is $\frac{1}{n}\E[\ell(X^n)]$ bits/symbol. No new machinery is involved: everything so far (Kraft, the entropy bound, Shannon and Huffman codes) applies verbatim with $\X^n$ in place of $\X$.
:::

Before the analysis, an objection worth confronting head-on, because it trips everyone: *there are $|\X|^n$ possible blocks — exponentially many — so surely encoding a block must take many more bits, and the numerousness should hurt?* The objection conflates the number of things to be named with the cost of naming one. Bitstrings are *exponentially expressive*: $m$ bits address $2^m$ distinct names, so naming one object out of a population of $|\X|^n$ costs at most $\ceil{\log |\X|^n} = \ceil{n \log |\X|}$ bits. The population is exponential in $n$; the name *length* is linear in $n$ — that is, *constant per symbol*, $\log|\X| + O(1/n)$, exactly the worst-case rate of naming symbols one at a time. Populations explode; you never pay for the population, only for the length of one name, and lengths scale like logarithms of populations. (It is true that individual block codewords are longer than symbol codewords — on average about $n$ times longer, $\approx nH$ bits — but each buys $n$ symbols, and the only meaningful metric is the ratio.)

The objection has a constructive core, though: if numerousness costs nothing per symbol, it is equally true that blocking, *by itself*, gains nothing per symbol. Where, then, is the gain? Pin it down with the additivity of surprisal over independent symbols:

$$
\E\Big[\log \tfrac{1}{p^{\otimes n}(X^n)}\Big] \;=\; \E\Big[\sum_{i=1}^n \log \tfrac{1}{p(X_i)}\Big] \;=\; n\, \E\Big[\log \tfrac{1}{p(X_1)}\Big] \;=\; n H(p)
$$

(this is [[#chain-rule]] again: $H(p^{\otimes n}) = nH(p)$). So the *ideal*, real-valued cost per symbol is $H(p)$ whether one prices symbols or blocks: blocking does not lower the target. What it lowers is the *overhead above* the target. Apply the Shannon code ([[#shannon-code]]) to the super-alphabet:

$$
nH(p) \;\leq\; \E\big[\ell(X^n)\big] \;<\; nH(p) + 1
\qquad\Longrightarrow\qquad
H(p) \;\leq\; \frac{\E[\ell(X^n)]}{n} \;<\; H(p) + \frac{1}{n}.
$$

The integer-rounding penalty — the sole source of the "$+1$", and the sole obstruction identified in the previous section — is paid *once per block* rather than once per symbol. Block coding is rounding-tax consolidation, nothing more; but that is everything, since the tax was the entire gap.

:::example{#block-two title="Blocking at $n = 2$, Watched Closely"}
Return to $p(a) = 0.99$, $p(b) = 0.01$, where $H \approx 0.0808$ and every symbol code is stuck at $1$ bit/symbol. The block alphabet is $\{aa, ab, ba, bb\}$ with distribution $(0.9801,\ 0.0099,\ 0.0099,\ 0.0001)$. Huffman's algorithm on these four super-symbols yields

$$
aa \mapsto 0, \qquad ab \mapsto 10, \qquad ba \mapsto 110, \qquad bb \mapsto 111,
$$

$$
L_2 = 0.9801(1) + 0.0099(2) + 0.0099(3) + 0.0001(3) = 1.0299 \ \text{bits/block} \;=\; 0.515 \ \text{bits/symbol}.
$$

Merely pairing symbols halved the rate, and the mechanism is visible to the naked eye: the block $aa$ — occurring $98\%$ of the time — receives the codeword "$0$", *one bit covering two symbols*. That is a half-bit-per-symbol codeword realized with no fractional-length magic whatsoever: a short name for a common conjunction. Note also what the code did to the rare blocks: $ba$ and $bb$ got *longer* names ($3$ bits) than any single symbol ever would. The numerous rare blocks really do pay more — and it does not matter, because they almost never occur. Variable-length coding is precisely the license to treat the exploding population of blocks non-uniformly, lavishing short names on the few heavy blocks and shrugging at the many light ones. (This skewing of the block distribution is the finite-$n$ shadow of the AEP: as $n$ grows, essentially all the mass sits on $\sim 2^{nH}$ of the $2^{n\log|\X|}$ blocks, which is also why *fixed*-length coding at rate $H$ becomes possible.)
:::

Scaling up the same picture: with $n = 100$, the block $a^{100}$ has probability $0.99^{100} \approx 0.366$ and receives a Shannon codeword of length $\ceil{\log(1/0.366)} = 2$ bits — two bits for a hundred symbols, $0.02$ bits/symbol for that block, closing in on the surprisal rate $-\log 0.99 \approx 0.0145$. A symbol whose "fair share" is $0.0145$ bits simply pools its share with $99$ neighbors until the pool exceeds an integer. *Fractional bits are bookkeeping for exactly this pooling.*

### Resolution 2: arithmetic coding

Block coding proves the point but is impractical ($|\X|^n$ codewords). Arithmetic coding (Rissanen, Pasco, 1976) achieves the same amortization *sequentially*, and makes "spend $-\log p(x)$ bits on $x$" essentially literal. It is the interval picture, iterated.

Maintain a current interval, initially $[0,1)$. To encode $x_1$: partition $[0,1)$ into subintervals of lengths $p(x)$, $x \in \X$ (in some fixed order), and shrink the current interval to the piece belonging to $x_1$. To encode $x_2$: partition *that* interval in the same proportions, select $x_2$'s piece; and so on. After $n$ symbols the current interval $I(x^n)$ has length exactly

$$
|I(x^n)| \;=\; p(x_1)\, p(x_2) \cdots p(x_n) \;=\; p(x^n).
$$

Each symbol multiplies the interval length by $p(x_i)$ — that is, *costs $\log \tfrac{1}{p(x_i)}$ bits of interval-length budget*, fractional values welcome. Finally, transmit a binary string identifying the interval: one can always find a dyadic interval $I(c) \subseteq I(x^n)$ with

$$
|c| \;\leq\; \ceil{\log \tfrac{1}{p(x^n)}} + 1 \;=\; \sum_{i=1}^n \log\tfrac{1}{p(x_i)} + O(1)
$$

(a dyadic interval of length $\geq \tfrac{1}{4}|I|$ fits inside any interval $I \subseteq [0,1)$; the encoder outputs its binary address, and the whole family of such addresses over all messages of a given length is prefix-free). The decoder, knowing $p$, replays the subdivisions and reads off the symbols. Total cost: the message's surprisal plus *two bits, total, for the entire message*. Expected length per symbol: $H(p) + O(1/n)$.

So the honest answer to "how do you assign $0.0145$ bits to $a$?" is: you narrow an interval by a factor of $0.99$, which will eventually — after enough symbols — force one more bit of address, at the exact exchange rate of $\log(1/0.99)$ bits per occurrence. Bits are the currency; interval length is the bank account; individual symbols make fractional deposits that are only ever withdrawn in integer amounts.

:::remark{#conditional-arithmetic}
Arithmetic coding also dissolves the i.i.d. restriction gracefully: at step $i$, partition the current interval according to the *conditional* distribution $p(\cdot \mid x_1, \ldots, x_{i-1})$. The final interval length is $p(x^n)$ for the joint law, and the code operates at the entropy rate. Any probabilistic model that outputs next-symbol conditionals — including a neural language model — is thereby a lossless compressor. This is the precise sense in which language modeling *is* compression.
:::

## Codes Are Probability Distributions (and Vice Versa)

One sometimes hears that "the source and the compressed language define a probability distribution." The precise statement — already used in the proof of [[#entropy-lower-bound]] — is a two-way dictionary between codes and distributions, mediated by Kraft:

$$
\textbf{prefix-free code, lengths } \ell(x)
\quad \xrightleftharpoons[\;\ell_q(x) \,=\, \lceil \log 1/q(x)\rceil\;]{\;q_C(x)\,=\,2^{-\ell(x)}\;} \quad
\textbf{(sub)probability } q
$$

- **Code $\to$ distribution.** Given a prefix-free (or uniquely decodable) code with lengths $\ell(x)$, set $q_C(x) = 2^{-\ell(x)}$. Kraft–McMillan says $\sum_x q_C(x) \leq 1$: a *sub*probability, with equality (a genuine distribution) iff the code is complete (no unused leaves; see the tree figure). $q_C$ is the distribution *for which this code is exactly optimal* ([[#entropy-lower-bound]]'s equality case). A code is a bet about symbol frequencies; $q_C$ makes the bet explicit. In the interval picture, $q_C(x)$ is literally the Lebesgue measure of $x$'s interval.
- **Distribution $\to$ code.** Given a distribution $q$, the Shannon construction produces a prefix-free code with lengths $\lceil \log \frac{1}{q(x)}\rceil$ — or, via arithmetic coding, a scheme whose amortized cost on $x$ is $\log\frac{1}{q(x)}$ bits exactly. A model is a compressor-in-waiting.

The dictionary is exact up to integer rounding, and exactly exact if one allows arithmetic coding (real-valued amortized lengths) or restricts to dyadic distributions. Under it:

$$
\textbf{optimal code for } p \;\leftrightarrow\; p \text{ itself},
$$

$$
\textbf{expected length of $q$'s code on source $p$} \;\leftrightarrow\; \text{cross entropy } H(p,q),
$$

which is the subject of the cross-entropy section below. One caveat on phrasing: the *compressed output* does not "define" a new interesting distribution so much as the *code itself* does. (There is a nice folklore fact in the vicinity, though: if the code is complete and matched to the source, the output bitstream is i.i.d. $\mathrm{Bern}(1/2)$ — perfectly compressed data is statistically indistinguishable from fair coin flips, since any residual bias would be further compressible.)

## The Source Coding Theorem and the AEP

The previous sections established: *variable-length* lossless codes achieve expected length $\to H(p)$ per symbol and no better. Shannon's 1948 theorem makes a stronger and more surprising claim in the *fixed-length* setting: you can use $\approx nH$ bits for *every* (typical) message of length $n$ — not just on average — at the price of a vanishing error probability, and $nH$ bits is a hard wall. The mechanism, the asymptotic equipartition property (AEP), is the single most useful structural fact about i.i.d. sources.

### The AEP

:::theorem{#aep title="AEP / Weak Law for Surprisals"}
Let $X_1, X_2, \ldots \overset{\text{iid}}{\sim} p$ with $H = H(p) < \infty$. Then

$$
-\frac{1}{n} \log p(X_1, \ldots, X_n) \;=\; \frac{1}{n}\sum_{i=1}^n \log \frac{1}{p(X_i)} \;\xrightarrow{\;\PR\;}\; H .
$$
:::

:::proof
The random variables $Y_i = \log \tfrac{1}{p(X_i)}$ are i.i.d. with $\E Y_i = H < \infty$; apply the weak law of large numbers. (Kolmogorov's strong law upgrades this to a.s. convergence; for stationary ergodic sources the same statement with the entropy rate is the Shannon–McMillan–Breiman theorem, proved via the ergodic theorem.)
:::

The theorem is trivial to prove and profound to interpret: *the probability of the message you actually see behaves like $2^{-nH}$*, regardless of which typical message it is. Formally:

:::definition{#typical-set title="Typical Set"}
For $\varepsilon > 0$, the **typical set** is

$$
A_\varepsilon^{(n)} \;=\; \Big\{ x^n \in \X^n \;:\; 2^{-n(H+\varepsilon)} \leq p(x^n) \leq 2^{-n(H-\varepsilon)} \Big\}.
$$
:::

:::proposition{#typical-structure title="Structure of the Typical Set"}
For every $\varepsilon > 0$:

(i) $\PR\big(X^n \in A_\varepsilon^{(n)}\big) \to 1$ as $n \to \infty$;

(ii) $\big|A_\varepsilon^{(n)}\big| \leq 2^{n(H+\varepsilon)}$;

(iii) for $n$ large, $\big|A_\varepsilon^{(n)}\big| \geq (1-\varepsilon)\, 2^{n(H-\varepsilon)}$.
:::

:::proof
(i) is [[#aep]] restated. (ii): $1 \geq \sum_{x^n \in A_\varepsilon^{(n)}} p(x^n) \geq |A_\varepsilon^{(n)}| \cdot 2^{-n(H+\varepsilon)}$. (iii): for $n$ large, $1 - \varepsilon \leq \PR(A_\varepsilon^{(n)}) \leq |A_\varepsilon^{(n)}| \cdot 2^{-n(H-\varepsilon)}$.
:::

**Rigorous intuition (asymptotic equipartition).** As $n \to \infty$, the source's probability mass concentrates on a set of only $\approx 2^{nH}$ messages — out of $|\X|^n = 2^{n \log |\X|}$ possible, an exponentially vanishing fraction when $H < \log|\X|$ — and on that set the distribution is *nearly uniform* (each element has probability $\approx 2^{-nH}$, up to sub-exponential factors). A generic biased source, blown up to blocks, looks like a uniform distribution on an exponentially smaller set. Uniform distributions on $2^{nH}$ items are trivial to encode: number the items, using $nH$ bits. That is the whole compression story in one sentence, and it explains why the same quantity $H$ answers both "expected optimal codeword length" and "log-cardinality of the effective support." (Amusing consequence of the skewed [[#skewed]]: the single most likely message $a^n$ is *not* typical — $-\tfrac1n\log p(a^n) = 0.0145 \neq H$. Typicality is about aggregate composition, not likelihood ranking; the mass sits on messages with $\approx 1\%$ $b$'s because there are vastly more of them.)

### The theorem

:::theorem{#source-coding title="Shannon's Source Coding Theorem"}
Let $X_i \overset{\text{iid}}{\sim} p$, $H = H(p)$, and let $R > 0$ be a *rate* (bits/symbol). Consider fixed-length schemes: encoders $e_n : \X^n \to \{0,1\}^{\lceil nR \rceil}$ and decoders $d_n$ with error probability $P^{(n)}_{\mathrm{err}} = \PR\big(d_n(e_n(X^n)) \neq X^n\big)$.

(a) **(Achievability.)** If $R > H$, there exist schemes with $P^{(n)}_{\mathrm{err}} \to 0$.

(b) **(Converse.)** If $R < H$, then for *every* sequence of schemes, $P^{(n)}_{\mathrm{err}} \to 1$.
:::

:::proof
(a) Pick $\varepsilon$ with $H + \varepsilon < R$. Enumerate $A_\varepsilon^{(n)}$; by [[#typical-structure]](ii) indices fit in $n(H+\varepsilon) + 1 \leq nR$ bits (for large $n$). Encode typical messages by index and atypical ones arbitrarily; errors occur only off the typical set, so $P^{(n)}_{\mathrm{err}} \leq \PR\big((A_\varepsilon^{(n)})^c\big) \to 0$.

(b) Any scheme at rate $R$ decodes correctly on a set $B_n = \{x^n : d_n(e_n(x^n)) = x^n\}$ of size $|B_n| \leq 2^{\lceil nR\rceil}$. Pick $\varepsilon$ with $R < H - 2\varepsilon$. Then

$$
\PR(X^n \in B_n) \;\leq\; \underbrace{\PR\big(B_n \cap A_\varepsilon^{(n)}\big)}_{\leq\, |B_n| \cdot 2^{-n(H - \varepsilon)} \,\leq\, 2^{nR + 1 - n(H-\varepsilon)}} \;+\; \underbrace{\PR\big((A_\varepsilon^{(n)})^c\big)}_{\to\, 0} \;\longrightarrow\; 0,
$$

since $nR + 1 - n(H - \varepsilon) \leq -n\varepsilon + 1 \to -\infty$. Hence $P^{(n)}_{\mathrm{err}} = 1 - \PR(B_n) \to 1$.
:::

Note what the converse says: below the entropy rate you do not merely do somewhat worse — you fail on essentially *all* messages. A budget of $2^{n(H - \varepsilon)}$ codewords cannot cover a nearly-uniform mass spread over $2^{nH}$ messages; the shortfall is exponential and no cleverness in choosing *which* messages to cover can help. Entropy is a sharp threshold, not a soft tradeoff. Combined with the earlier sections, we now have the full operational characterization:

$$
H(p) \;=\; \text{minimal bits/symbol, in every reasonable sense}
$$

(expected, amortized, fixed-rate with high probability).

:::remark{#channel-coding title="The Other Shannon Theorem"}
For completeness: Shannon's *channel* coding theorem (1948) is the transmission-side twin — every noisy channel has a capacity $C = \max_{p_X} I(X;Y)$ bits/use ($I$ = mutual information, [[#mutual-information]]) such that rates $R < C$ admit codes with error $\to 0$ and rates $R > C$ do not. Source and channel coding compose ("separation theorem"). We stay on the source side, since that is where entropy, cross entropy, and KL live.
:::

## Cross Entropy: Coding with the Wrong Model

:::definition{#cross-entropy title="Cross Entropy"}
For distributions $p, q$ on $\X$ (with $q(x) > 0$ whenever $p(x) > 0$):

$$
H(p, q) \;=\; -\sum_{x} p(x) \log q(x) \;=\; \E_{X \sim p}\!\left[\log \tfrac{1}{q(X)}\right].
$$
:::

Read it as: *the truth is $p$, but you built your code believing $q$*. Under the code–distribution dictionary, believing $q$ means using codeword lengths $\approx \log\frac{1}{q(x)}$; the world then feeds you symbols according to $p$; your average bill is $\E_p[\log \frac{1}{q(X)}] = H(p,q)$ bits/symbol. Precisely:

:::proposition{#cross-entropy-operational title="Operational Meaning"}
**(i)** The Shannon code built from $q$ (lengths $\lceil \log \frac{1}{q(x)} \rceil$), used on source $p$, has

$$
H(p, q) \;\leq\; L \;<\; H(p, q) + 1 .
$$

**(ii)** Arithmetic coding driven by model $q$ on an i.i.d.-$p$ source spends $\log\frac{1}{q(x^n)} + O(1)$ bits on the message $x^n$, hence exactly $H(p,q) + O(1/n)$ expected bits per symbol. Moreover $-\tfrac1n \log q(X^n) \to H(p,q)$ in probability (LLN, as in [[#aep]]).
:::

:::proof
(i) Set $\ell_q(x) = \ceil{\log \frac{1}{q(x)}}$; these lengths satisfy Kraft with respect to $q$ ($\sum_x 2^{-\ell_q(x)} \leq \sum_x q(x) = 1$), so the code exists by [[#kraft]](ii). By the ceiling property $t \leq \ceil{t} < t + 1$ at $t = \log\frac{1}{q(x)}$, pointwise in $x$: $\log\frac{1}{q(x)} \leq \ell_q(x) < \log\frac{1}{q(x)} + 1$; take $\E_p$ (monotonicity of expectation), noting $\E_p[\log \frac{1}{q(X)}] = H(p,q)$ by definition. (ii) Arithmetic coding with $q$-proportions: the final interval has length $q(x^n)$, so the address costs $\ceil{\log \frac{1}{q(x^n)}} + 1$ bits; take expectations under $p$ and use $\E_p[\log \frac{1}{q(X^n)}] = n\,H(p,q)$ (additivity of surprisal over i.i.d. symbols, as in [[#chain-rule]]). The convergence is the weak law applied to the i.i.d. variables $\log\frac{1}{q(X_i)}$, which have mean $H(p,q)$ under $p$.
:::

Two immediate observations. First, $H(p, p) = H(p)$: the right model recovers the entropy. Second — and this is Gibbs' inequality, proved in the next section — $H(p, q) \geq H(p)$ always: *no model outperforms the truth*. The excess is a divergence, and it deserves its own name.

## Kullback–Leibler Divergence

:::definition{#kl title="KL Divergence / Relative Entropy"}
For distributions $p, q$ on $\X$:

$$
\KL{p}{q} \;=\; \sum_{x} p(x) \log \frac{p(x)}{q(x)} \;=\; \E_{X\sim p}\!\left[\log \frac{p(X)}{q(X)}\right],
$$

with the conventions $0 \log \frac{0}{q} = 0$ and $\KL{p}{q} = +\infty$ if $p(x) > 0 = q(x)$ for some $x$ (i.e. if $p \not\ll q$).
:::

Expanding the log of the ratio gives the fundamental decomposition — note the order:

$$
\boxed{\;\KL{p}{q} \;=\; H(p, q) \;-\; H(p)\;}
\qquad\Longleftrightarrow\qquad
H(p,q) \;=\; H(p) + \KL{p}{q}.
$$
{#decomposition}

It is *cross entropy minus entropy*, not the reverse: KL is the *excess* — the expected number of *extra* bits per symbol you pay for compressing a $p$-source with a code designed for $q$, over the $H(p)$ bits an omniscient coder pays. Since waste cannot be negative, this ordering is forced by:

:::theorem{#gibbs title="Gibbs' Inequality / Nonnegativity of KL"}
$\KL{p}{q} \geq 0$, with equality iff $p = q$.
:::

:::proof
Assume $p \ll q$ (else $D = \infty > 0$) and restrict to $S = \{x : p(x) > 0\}$. Since $\log$ is strictly concave, Jensen's inequality gives

$$
-\KL{p}{q} \;=\; \E_p\!\left[\log \frac{q(X)}{p(X)}\right] \;\leq\; \log \E_p\!\left[\frac{q(X)}{p(X)}\right] \;=\; \log \sum_{x \in S} q(x) \;\leq\; \log 1 \;=\; 0 .
$$

Equality in Jensen for a strictly concave function forces the ratio $q(X)/p(X)$ to be $p$-a.s. constant, and equality in the last step forces $\sum_{S} q = 1$; together these give $q = p$ on $S$ and $q \equiv 0$ off it, i.e. $p = q$.
:::

This single inequality is the load-bearing wall of the subject: it delivered the entropy lower bound ([[#entropy-lower-bound]]), the maximality of the uniform distribution ([[#entropy-basics]]), and now $H(p,q) \geq H(p)$. In statistics it reappears as the nonnegativity of expected log-likelihood ratios (the reason MLE is consistent) and in physics as the second law's information-theoretic shadow.

:::remark{#kl-not-metric title="What KL Is Not"}
$D$ is not a metric: it is asymmetric ($\KL{p}{q} \neq \KL{q}{p}$ in general — coding a fair coin with a $0.99$-biased model wastes $\approx 2.96$ bits/flip, while coding the biased coin with a fair model wastes $\approx 0.92$; the mismatch penalties are not symmetric because *which* rare-under-the-model events actually occur is what drives the cost) and it violates the triangle inequality. It does control genuine metrics from above: Pinsker's inequality gives $\|p - q\|_{\mathrm{TV}} \leq \sqrt{\tfrac{\ln 2}{2}\, \KL{p}{q}}$. It also obeys the *data-processing inequality*: applying any (possibly stochastic) map to both arguments cannot increase $D$ — post-processing cannot manufacture distinguishability.
:::

:::remark{#forward-reverse-kl title="Forward vs. Reverse KL, for Later ML Use"}
Minimizing $\KL{p}{q_\theta}$ in $\theta$ ("forward," what MLE does with $p$ = data distribution) punishes $q_\theta(x) \approx 0$ where $p(x) > 0$: the model must *cover* all of $p$'s mass (mass-covering, mean-seeking). Minimizing $\KL{q_\theta}{p}$ ("reverse," what variational inference does) punishes putting $q_\theta$-mass where $p$ has none: the model may collapse onto one mode (zero-forcing, mode-seeking). Same objective family, different argument order, qualitatively different fits — all readable off which distribution sits inside the expectation and which inside the log's denominator.
:::

## Beyond Finite Alphabets: Countable and Continuous

Do these results extend from finite to countable to uncountable alphabets — and are the uncountable definitions "inherent," or mere analogy? The answer has a sharp and somewhat under-advertised structure: **countable is a smooth extension; uncountable is a genuine rupture for entropy, but not for KL.** Entropy, as an absolute quantity, does not survive the continuum — only entropy *differences* do, and KL divergence (with mutual information, which is a KL) is precisely the difference-like object that admits an intrinsic, measure-theoretic definition of which the discrete formula is a special case, not an inspiration.

### Countably infinite alphabets: business as usual, with one caveat

Everything above was stated, where possible, for countable $\X$, and it all holds: Kraft (the interval proof used no finiteness), the Shannon code, the entropy lower bound, the AEP and source coding theorem, cross entropy, KL. The one new phenomenon:

:::example{#infinite-entropy title="Infinite Entropy"}
Entropy can be $+\infty$ on a countable alphabet: take $p(k) = \dfrac{c}{k \log^2 k}$ for $k \geq 2$ (summable, so $c$ exists), but
$\sum_k p(k)\log\frac{1}{p(k)} \asymp \sum_k \frac{\log k}{k \log^2 k} = \sum_k \frac{1}{k\log k} = \infty$.
Such a source is not compressible to finitely many expected bits per symbol — correctly so: the theorems remain true, reading "$L \geq H = \infty$" as "no finite-mean code exists." When $H < \infty$, all results hold verbatim.
:::

So: no analogy needed for countable $\X$; the finite theory *is* the countable theory, with $+\infty$ admitted as a value.

### Uncountable alphabets I: differential entropy and why it is *not* entropy

Let $X$ be a real random variable with density $f$. The formal analogue of entropy,

$$
h(X) \;=\; -\int f(x) \log f(x)\, dx
$$

(*differential entropy*), is obtained by transplanting the discrete formula, $\sum \mapsto \int$. And this is exactly a "defined by analogy" move — and it shows. Three symptoms:

**1. It is not the limit of discrete entropies; the limit is $+\infty$.** Quantize: let $X^{\Delta}$ record which bin $[i\Delta, (i+1)\Delta)$ contains $X$, so $p_i = \int_{i\Delta}^{(i+1)\Delta} f$. Then (for Riemann-integrable $f$, by the mean value theorem $p_i = f(\xi_i)\Delta$ and a Riemann-sum argument)

$$
H(X^\Delta) \;=\; -\sum_i p_i \log p_i \;=\; h(X) + \log\frac{1}{\Delta} + o(1) \;\xrightarrow[\Delta \to 0]{}\; +\infty .
$$

This divergence is not a technical nuisance — it is the truth: *a continuous random variable contains infinitely many bits* (its binary expansion is an infinite fair bitstream, generically), and no lossless finite-bit code for it exists. The operational content of $h$ is only ever *relative*: describing $X$ to precision $\Delta$ costs $\approx h(X) + \log(1/\Delta)$ bits, so $h$ measures how many bits a source costs *compared to a uniform reference at the same precision*. Comparisons and differences of $h$'s are meaningful; the absolute number is an artifact of the Lebesgue reference measure.

**2. It can be negative.** $X \sim \mathrm{Unif}[0, a]$ has $h(X) = \log a$, which is $< 0$ for $a < 1$ (and $\to -\infty$ as $a \downarrow 0$). No "expected optimal code length" can be negative; $h$ is simply not that kind of quantity. (For calibration: $X \sim \mathcal{N}(\mu, \sigma^2)$ has $h = \tfrac{1}{2}\log(2\pi e \sigma^2)$, and the Gaussian maximizes $h$ among densities with fixed variance — one discrete-style fact that does survive, because it is a comparison.)

**3. It is not invariant under reparametrization.** $h(aX) = h(X) + \log|a|$, and more generally $h(g(X)) = h(X) + \E[\log |g'(X)|]$ for smooth bijections $g$. "How uncertain is $X$" should not depend on whether you measure $X$ in meters or feet; $h$ does. Discrete entropy, by contrast, is invariant under *any* relabeling bijection of the alphabet. The dependence enters through the Jacobian, i.e. through the implicit comparison to Lebesgue measure, confirming the diagnosis in item 1.

The honest continuous-alphabet compression theory is *lossy*: fix a distortion tolerance and ask for the minimum bit rate achieving it (Shannon's rate–distortion theory, where the answer is again a mutual-information optimization). Lossless coding of reals is not a well-posed problem, and differential entropy is best regarded as a useful *formal* device — legitimate exactly when it appears inside differences, which is why the quantities built from differences are the ones that generalize intrinsically. To wit:

### Uncountable alphabets II: KL divergence is inherently general

Here is the converse surprise: KL divergence needs no analogy at all. It has an intrinsic definition on an arbitrary measurable space, of which the discrete and continuous formulas are computations in coordinates.

:::definition{#kl-general title="KL Divergence, General Form"}
Let $P, Q$ be probability measures on a measurable space $(\Omega, \mathcal{F})$. If $P \ll Q$, with Radon–Nikodym derivative $\frac{dP}{dQ}$, define

$$
\KL{P}{Q} \;=\; \int_\Omega \log \frac{dP}{dQ} \, dP \;=\; \E_P\!\left[\log \frac{dP}{dQ}\right];
$$

if $P \not\ll Q$, define $\KL{P}{Q} = +\infty$. (The integral is well-defined in $[0,\infty]$: writing $\phi(t)=t\log t$, $\KL{P}{Q} = \int \phi\big(\tfrac{dP}{dQ}\big)\,dQ$ with $\phi$ convex, bounded below, and $\int \tfrac{dP}{dQ}\,dQ = 1$, so Jensen gives $\geq \phi(1) = 0$; equality iff $\frac{dP}{dQ} = 1$ $Q$-a.s., i.e. $P = Q$. Gibbs' inequality is thus native to the general setting.)
:::

**Intuition.** Recall the definition: if $P \ll Q$ (i.e. $Q(A) = 0 \Rightarrow P(A) = 0$), the Radon–Nikodym theorem provides a measurable function $\frac{dP}{dQ} \geq 0$, unique up to $Q$-null sets, with

$$
P(A) \;=\; \int_A \frac{dP}{dQ}\, dQ \quad \text{for every measurable } A
\qquad\Big(\text{equivalently } \E_P[g] = \E_Q\big[g \cdot \tfrac{dP}{dQ}\big]\Big).
$$

So $\frac{dP}{dQ}$ is not a measure but a function on $\Omega$: the *multiplicative correction factor* that converts $Q$ into $P$ — at each point, the local exchange rate between the two measures (on $\R^d$, literally $\frac{dP}{dQ}(x) = \lim_{\varepsilon \downarrow 0} P(B_\varepsilon(x))/Q(B_\varepsilon(x))$ a.e.). And that is exactly what a *likelihood ratio* is. Indeed, "the likelihood of $P$ at $x$" is only defined relative to a chosen dominating measure $\mu$ (it is the density $\frac{dP}{d\mu}(x)$; discrete likelihoods use counting measure, continuous ones use Lebesgue), but in the *ratio* of two likelihoods the reference cancels by the chain rule: $\frac{dP/d\mu}{dQ/d\mu} = \frac{dP}{dQ}$ for every choice of $\mu$. The right general mental model, therefore: *likelihood is a correction factor from one measure to another, and the reference-free comparison of two hypotheses at a data point is the Radon–Nikodym derivative* — the same absolute-vs-relative pattern as entropy vs. KL, one level down.

With that in hand, the definition of $\KL{P}{Q}$ reads itself: the likelihood ratio $\frac{dP}{dQ}(\omega)$ is the *pointwise mass divergence* of $P$ from $Q$ — how over- or under-represented the vicinity of $\omega$ is under $Q$ relative to the truth — and the divergence is this local discrepancy, passed through $\log$ and averaged against $P$. The log is what calibrates "no discrepancy" correctly: where the measures agree locally the ratio is $1$ and must contribute $0$; over- and under-representation should pull with opposite signs; and discrepancies should compose additively over independent coordinates — all three demands are met by $\log$ and essentially only by $\log$. Weighting by $P$ then says: total up the local discrepancies *where the truth actually puts its mass*, so that $\KL{P}{Q}$ measures how much the model misallocates mass in the regions that matter. (Note the pointwise terms are negative wherever $Q$ over-covers, $\frac{dP}{dQ} < 1$; Gibbs' inequality is the nontrivial assertion that, averaged where $P$ lives, the under-covered regions always win — the total is $\geq 0$, vanishing only at $P = Q$.)

When $\Omega$ is countable and $Q$ has pmf $q$, $\frac{dP}{dQ}(x) = \frac{p(x)}{q(x)}$ and [[#kl-general]] reduces to the discrete definition. When $P, Q$ have densities $f, g$ on $\R^d$, $\frac{dP}{dQ} = \frac{f}{g}$ (a.e. on $\{g>0\}$) and $\KL{P}{Q} = \int f \log \frac{f}{g}$. Same object, different coordinates. Three structural facts certify that this is the "right" general definition and not a lucky formula:

:::theorem{#kl-intrinsic title="Why KL Is Intrinsic"}
Let $P, Q$ be probability measures on $(\Omega, \mathcal{F})$.

**(a) (Supremum over discretizations; Gelfand–Yaglom–Perez.)**

$$
\KL{P}{Q} \;=\; \sup_{\pi} \; \sum_{A \in \pi} P(A) \log \frac{P(A)}{Q(A)},
$$

the supremum over all finite measurable partitions $\pi$ of $\Omega$. That is: the general KL is the least upper bound of the *discrete* KLs of all finite quantizations, and refining a partition can only increase the discrete KL. The continuous theory is a completion of the discrete one, not an analogue of it.

**(b) (Invariance.)** If $T : \Omega \to \Omega'$ is a bijective bi-measurable map, then $\KL{P \circ T^{-1}}{Q \circ T^{-1}} = \KL{P}{Q}$. (More generally, for any measurable $T$, $\KL{P\circ T^{-1}}{Q \circ T^{-1}} \leq \KL{P}{Q}$ — the data-processing inequality — with equality when $T$ is invertible.) Unlike differential entropy, KL does not care whether you work in meters or feet: the Jacobians in numerator and denominator cancel inside $\frac{dP}{dQ}$.

**(c) (No reference measure.)** The definition invokes only $P$, $Q$, and the $\sigma$-algebra — no counting measure, no Lebesgue measure. Discrete entropy secretly measures $P$ against counting measure ($H(p) = -\KL{p}{\#}$, formally), differential entropy against Lebesgue; that hidden reference is exactly what breaks under reparametrization and what diverges under refinement. KL carries its reference measure ($Q$) explicitly, which is why it is well-behaved.
:::

:::proof{title="Proof notes"}
(a) "$\geq$": a partition is the map $T(\omega) = [\text{cell containing } \omega]$, so this is the data-processing inequality in (b), which in turn follows from the chain rule for Radon–Nikodym derivatives together with Jensen applied to the conditional expectation $\E_Q[\tfrac{dP}{dQ} \mid \sigma(\pi)]$ (conditioning averages the density ratio, and $\phi(t) = t\log t$ is convex, so averaging before applying $\phi$ can only lose). "$\leq$": martingale convergence — along a refining sequence of partitions generating $\mathcal{F}$, the discretized ratios $\E_Q[\frac{dP}{dQ}\mid \sigma(\pi_n)]$ converge to $\frac{dP}{dQ}$, and lower semicontinuity/monotone convergence passes the divergences to the limit. (b) is immediate from $\frac{d(P\circ T^{-1})}{d(Q \circ T^{-1})} \circ T = \frac{dP}{dQ}$ for bijective bi-measurable $T$, plus the change-of-variables formula. (c) is a reading of the definition.
:::

**What replaces surprisal: relative surprisal.** [[#kl-intrinsic]] certifies that the general definition is right, but does not yet say where its *intuition* lives, given that the discrete intuition ran through the surprisal $-\log p(x)$ — which genuinely breaks in the continuum (points have probability zero; a density is not a probability). The resolution is that the intrinsic primitive was never surprisal but *relative surprisal*,

$$
r(x) \;=\; \log \frac{dP}{dQ}(x) \;=\; \underbrace{\Big({-}\log q(x)\Big)}_{\text{$q$'s surprise}} - \underbrace{\Big({-}\log p(x)\Big)}_{\text{$p$'s surprise}} \quad \text{(discrete case)},
$$

how many more bits model $Q$ is surprised by the outcome than model $P$ is. Discretely this looks like a derived quantity — a difference of two surprisals — but the dependence is backwards: the difference is the primitive, and the individual surprisals were an artifact of countable spaces. Two ways to see it. *(i) Dimensional analysis.* If $X$ is measured in meters, its density $f$ carries units $\mathrm{m}^{-1}$, and $\log f(x)$ is the logarithm of a dimensionful quantity — meaningless, which is exactly the content of $h(aX) = h(X) + \log a$: differential entropy shifts under a change of units because "the" log of a density was never defined without smuggling one in. The ratio $\frac{dP}{dQ} = f/g$ is dimensionless, coordinate-free, and — by Radon–Nikodym — exists with no densities at all. *(ii) A self-standing operational meaning, with no coding in sight.* $\log \frac{dP}{dQ}(x)$ is the log-likelihood ratio: the *evidence* that the observation $x$ provides for hypothesis $P$ over hypothesis $Q$. Bayes' theorem in log-odds form reads

$$
\log \frac{\PR(P \mid x)}{\PR(Q \mid x)} \;=\; \log \frac{\PR(P)}{\PR(Q)} \;+\; \log \frac{dP}{dQ}(x):
$$

relative surprisal is precisely the amount one observation moves a rational agent's beliefs between the two hypotheses. KL divergence is then the *expected evidence per observation when $P$ is true* — and this reading is natively measure-theoretic and comes with its own limit theorems ([[#kl-operational]] below), fully parallel to the coding theorems but never mentioning description lengths.

The coding meaning itself also survives, in the only form it could: *as a difference*. Quantize to precision $\Delta$: coding the quantized source with model $Q$ costs $H(P^\Delta) + \KL{P^\Delta}{Q^\Delta}$ bits per symbol. As $\Delta \to 0$ the first term diverges like $h(P) + \log\frac{1}{\Delta}$ — absolute description length blows up, as it must — while the excess $\KL{P^\Delta}{Q^\Delta}$ *increases to* $\KL{P}{Q}$: this is [[#kl-intrinsic]](a) reread as a statement about refining quantizations. The two infinities are identical and cancel in the difference. "Expected extra bits from using the wrong model" remains exactly correct in the continuum; only "expected bits" alone broke.

This also settles the fate of the decomposition $D = H(p,q) - H(p)$: there is no *intrinsic* version on a general space — neither term exists without a reference measure — but the decomposition holds in every *gauge*, with the gauge-dependence cancelling:

:::proposition{#gauge-decomposition title="Gauge Decomposition of KL"}
Let $\mu$ be a $\sigma$-finite reference measure with $P, Q \ll \mu$, densities $f = \frac{dP}{d\mu}$, $g = \frac{dQ}{d\mu}$, and define the $\mu$-relative entropy and cross entropy $h_\mu(P) := -\E_P[\log f]$ and $H_\mu(P, Q) := -\E_P[\log g]$. Whenever both are finite,

$$
\KL{P}{Q} \;=\; H_\mu(P, Q) \;-\; h_\mu(P).
$$

Under a change of reference $\mu \to \nu$ (mutually absolutely continuous), both terms shift by the *same* constant $\E_P\big[\log \tfrac{d\nu}{d\mu}\big]$, so the difference is invariant. Counting measure recovers the discrete decomposition [[#decomposition]]; Lebesgue measure recovers $H(p,q) = h(p) + \KL{p}{q}$ for densities.
:::

:::proof
By the chain rule for Radon–Nikodym derivatives, $\frac{dP}{dQ} = f/g$ ($P$-a.s.), so $\KL{P}{Q} = \E_P[\log f - \log g] = H_\mu(P,Q) - h_\mu(P)$. For the gauge change, $\frac{dP}{d\nu} = f \cdot \frac{d\mu}{d\nu}$ and likewise for $Q$, so $h_\nu(P) = h_\mu(P) + \E_P[\log \frac{d\nu}{d\mu}]$ and $H_\nu(P,Q) = H_\mu(P,Q) + \E_P[\log \frac{d\nu}{d\mu}]$.
:::

The right mental model is potentials: entropy and cross entropy are like potential energies, defined only relative to a chosen ground, while KL is the potential difference — the measurable thing. Discrete entropy *felt* absolute only because countable sets come equipped with a canonical ground (counting measure); the continuum has none — Lebesgue measure is not canonical under nonlinear reparametrization, which is exactly the Jacobian non-invariance of $h$ diagnosed above.

:::remark{#kl-operational title="KL's Own Operational Theorems — No Coding Required"}
The evidence reading is made quantitative by three classical results, each valid on arbitrary measurable spaces. *(Relative AEP.)* Under $P$, the strong law gives $\frac1n \log \frac{dP^{\otimes n}}{dQ^{\otimes n}}(X^n) = \frac1n \sum_i \log\frac{dP}{dQ}(X_i) \to \KL{P}{Q}$ a.s.: evidence accumulates linearly, at rate $D$ per sample — the AEP survives in the continuum in exactly its *relative* form, because the summands are honest real random variables. *(Chernoff–Stein lemma.)* In optimal hypothesis testing of $P$ against $Q$ from $n$ i.i.d. samples, with the type-I error held fixed, the type-II error decays as $2^{-n \KL{P}{Q}}$: KL is the exponential rate at which data distinguishes the truth from a rival. *(Doubling rate.)* Against a bookmaker whose odds are fair under $Q$, the Kelly bettor who knows the truth $P$ grows log-wealth at exactly $\KL{P}{Q}$ per round; indeed the likelihood-ratio process $\frac{dP^{\otimes n}}{dQ^{\otimes n}}(X^n)$ *is* her wealth process — a martingale under $Q$, growing like $2^{n D}$ under $P$. Evidence accumulation and wealth growth are the same mathematics, and either one furnishes KL with an intrinsic meaning that owes nothing to source coding.
:::

**Rigorous intuition, and the answer to the question posed above.** Which discrete quantities survive the continuum, and how, is completely predicted by one criterion: *does the quantity depend on a reference measure?* Entropy does (counting measure), so its continuum version either diverges (as an honest limit) or becomes reference-dependent and non-invariant (as the formal analogue $h$). KL does not — it is a relation between two measures with no third party — so it passes to arbitrary probability spaces intact, with the discrete formula as the special case and the partition supremum (a) as the bridge guaranteeing nothing was lost or invented in transit. Consequently the quantities *built* from KL also generalize intrinsically:

:::definition{#mutual-information title="Mutual Information"}
For random elements $X, Y$ with joint law $P_{XY}$ and marginals $P_X, P_Y$ on arbitrary spaces,
$I(X; Y) = \KL{P_{XY}}{P_X \otimes P_Y}$ — the divergence of the joint from independence. In the discrete case this equals $H(X) - H(X \mid Y) = H(X) + H(Y) - H(X,Y)$; in the continuous case it equals the same expressions with $h$ in place of $H$ (the reference measures cancel in the differences, as promised); in general it needs neither, and it inherits nonnegativity, invariance, and the partition-supremum characterization from [[#kl-intrinsic]]. Channel capacity, rate–distortion functions, and the information-theoretic side of statistics are all built on $I$, which is why the general theory rests on KL rather than on entropy.
:::

Likewise cross entropy: in the continuum, $H(p, q) := -\int f \log g$ inherits differential entropy's reference-dependence, but the decomposition [[#decomposition]] holds verbatim in the Lebesgue gauge ([[#gauge-decomposition]]), $H(p,q) = h(p) + \KL{p}{q}$, and the reference-dependence lives entirely in the $h(p)$ term — the KL part is gauge-invariant. This is why in ML one may freely minimize "cross entropy" over models $q$ even for continuous data: the objective differs from $\KL{p}{q}$ by a constant in $q$.

## Coda: The Dictionary with Machine Learning

A compact translation table, since these objects keep reappearing (e.g. Murphy, *PML* Vol. 1, Ch. 6):

- **Negative log-likelihood is a code length.** A model $q_\theta$ assigns the observed data $x^n$ the description length $\log \frac{1}{q_\theta(x^n)}$ bits (arithmetic coding + the code–distribution dictionary). Maximizing likelihood $=$ minimizing the number of bits your model needs to compress the data.
- **Cross-entropy loss is empirical cross entropy.** With $\hat{p}_n$ the empirical distribution, $\frac{1}{n}\sum_i \log \frac{1}{q_\theta(x_i)} = H(\hat{p}_n, q_\theta)$; by [[#decomposition]], minimizing it over $\theta$ is minimizing $\KL{\hat p_n}{q_\theta}$, since $H(\hat p_n)$ is a $\theta$-constant. MLE is forward-KL projection of the data onto the model class. As $n \to \infty$ the objective converges to $H(p, q_\theta) = H(p) + \KL{p}{q_\theta}$, whose unique minimizer over all $q$ is the truth (Gibbs): log-loss is a *strictly proper scoring rule*.
- **Test log-loss and perplexity are compression rates.** A language model's per-token log-loss is $H(p, q_\theta)$ in bits (or nats): the rate at which the model would losslessly compress text via arithmetic coding. Perplexity is $2^{H(p,q_\theta)}$ (with $\log_2$): the effective branching factor — the size of the uniform alphabet with the same per-symbol coding cost. The irreducible floor is the entropy rate of the source; everything above the floor is KL-waste, i.e. model misfit.

**Further reading.** Cover & Thomas, *Elements of Information Theory* (2e) — Ch. 2 (entropy, KL), Ch. 3 (AEP), Ch. 5 (coding: Kraft, Huffman, arithmetic), Ch. 8 (differential entropy); MacKay, *Information Theory, Inference, and Learning Algorithms* — Chs. 4–6 for the most vivid treatment of typicality and symbol codes; Polyanskiy & Wu, *Information Theory: From Coding to Learning* for the measure-theoretic general theory (the partition-supremum characterization and $f$-divergences done properly); and Shannon's original 1948 paper, *A Mathematical Theory of Communication*, which remains startlingly readable.
