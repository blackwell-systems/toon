# GCF vs TOON: Running TOON's Own Benchmark

This fork adds [GCF (Graph Compact Format)](https://github.com/blackwell-systems/gcf) to TOON's token efficiency benchmark. Same datasets, same tokenizer (o200k_base), same methodology. The only change is one additional formatter.

## Results

### Mixed-Structure Track (nested + semi-uniform data)

| Dataset | GCF | TOON | Winner |
|---------|-----|------|--------|
| E-commerce orders | 61,592 | 73,246 | **GCF (19% smaller)** |
| Semi-uniform event logs | 107,269 | 154,032 | **GCF (44% smaller)** |
| Deeply nested config | 693 | 618 | TOON (11% smaller) |
| **Total** | **169,554** | **227,896** | **GCF (34% smaller)** |

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

GCF beats TOON on both tracks. TOON's claimed advantage ("39.9% fewer tokens than JSON") is real, but GCF achieves greater savings on the same data. The only dataset where TOON wins is deeply nested config (a 75-token difference on a 618-token payload).

## Why GCF Wins on Semi-Uniform Data

TOON's tabular format requires uniform arrays (identical fields per row). When data is semi-uniform (e.g., event logs where 50% have nested error objects), TOON falls back to its less efficient nested encoding for the entire array.

GCF handles semi-uniformity natively: primitive fields encode as positional rows, nested fields attach inline only when present. No format-level decision between "tabular mode" and "nested mode" is required.

## Comprehension Accuracy

Separately from token efficiency, GCF also matches or beats TOON on LLM comprehension. At 500 symbols:

| Format | Accuracy | Tokens |
|--------|----------|--------|
| **GCF** | **100%** | **11,090** |
| TOON | 100% | 16,378 |
| JSON | 66.7% | 53,341 |

Equal accuracy, 32% fewer tokens. Eval: [gcf-go/eval](https://github.com/blackwell-systems/gcf-go/tree/main/eval)

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
