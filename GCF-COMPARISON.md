# GCF vs TOON: Running TOON's Own Benchmark

This fork adds [GCF (Graph Compact Format)](https://github.com/blackwell-systems/gcf) to TOON's token efficiency benchmark. Same datasets, same tokenizer (o200k_base), same methodology. The only change is one additional formatter.

## Results

### Mixed-Structure Track (nested + semi-uniform data)

| Dataset | GCF | TOON | Winner |
|---------|-----|------|--------|
| E-commerce orders | 61,593 | 73,246 | **GCF (19% smaller)** |
| Semi-uniform event logs | 108,158 | 154,032 | **GCF (42% smaller)** |
| Deeply nested config | 616 | 618 | **GCF (0.3% smaller)** |
| **Total** | **170,367** | **227,896** | **GCF (34% smaller)** |

### Flat-Only Track (pure tabular data)

| Dataset | GCF | TOON | CSV | Winner |
|---------|-----|------|-----|--------|
| Employee records | 49,054 | 49,966 | 47,137 | CSV (GCF 2nd) |
| Analytics time-series | 8,397 | 9,127 | 8,395 | **GCF ties CSV** |
| GitHub repositories | 8,575 | 8,744 | 8,512 | CSV (GCF 2nd) |
| **Total** | **66,026** | **67,837** | **64,044** | CSV (GCF 2nd, TOON 3rd) |

### Summary

| Track | GCF vs TOON |
|-------|-------------|
| Mixed-structure | **GCF 34% smaller** |
| Flat-only | **GCF 3% smaller** |
| Overall | **GCF 20% smaller** |

GCF beats TOON on both tracks and all 6 datasets. TOON has no token efficiency advantage on any data shape. The closest result is deeply nested config (616 vs 618, a 2-token difference).

## Why GCF Wins on Semi-Uniform Data

TOON's tabular format requires uniform arrays (identical fields per row). When data is semi-uniform (e.g., event logs where 50% have nested error objects), TOON falls back to its less efficient nested encoding for the entire array.

GCF handles semi-uniformity natively: primitive fields encode as positional rows, nested fields attach inline only when present. No format-level decision between "tabular mode" and "nested mode" is required.

## Comprehension Accuracy

Separately from token efficiency, GCF also matches or beats TOON on LLM comprehension. At 500 symbols:

| Format | Accuracy | Tokens |
|--------|----------|--------|
| **GCF** | **100%** (13/13) | **11,090** |
| TOON | 92.3% (12/13) | 16,378 |
| JSON | 76.9% (10/13) | 53,341 |

GCF is the only format with 100% accuracy, at 32% fewer tokens than TOON. Eval: [gcf-go/eval](https://github.com/blackwell-systems/gcf-go/tree/main/eval)

## Reproducing

```bash
git clone https://github.com/blackwell-systems/toon.git
cd toon && git checkout gcf-comparison
cd benchmarks && pnpm install && pnpm benchmark:tokens
```

## What Was Changed

Three files modified, one file added:

1. `benchmarks/src/gcf-formatter.ts` (new): GCF encoder for generic structured data
2. `benchmarks/src/formatters.ts`: Added GCF to the formatter registry
3. `benchmarks/src/evaluate.ts`: Added GCF primer and fence tag
4. `benchmarks/src/constants.ts`: Added GCF display name
5. `benchmarks/scripts/token-efficiency-benchmark.ts`: Added GCF to comparison order

No changes to TOON's encoding, datasets, tokenization, or measurement methodology.

## Links

- [GCF Specification](https://github.com/blackwell-systems/gcf)
- [GCF Go Implementation](https://github.com/blackwell-systems/gcf-go)
- [TOON Specification](https://github.com/toon-format/spec)
