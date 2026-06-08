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

## LLM Comprehension (23 runs, 10 models, 3 providers)

Token efficiency is only half the story. Can the model actually read the format at scale?

500 symbols, 200 edges, 13 extraction questions, zero format instructions. 1,300+ evaluations across Claude Opus/Sonnet/Haiku, GPT-5.5/5.4/5.4-mini, Gemini 2.5 Flash/Pro, Gemini 3.1 Pro, and Gemini 3.5 Flash.

| | GCF | TOON | JSON |
|---|---|---|---|
| **Avg accuracy** | **90.7%** | 68.5% | 53.6% |
| **Input tokens** (500 sym) | **11,090** | 16,378 | 53,341 |

GCF wins 22 of 23 runs (1 tie, 0 losses). Four models achieve 100%: Sonnet, Gemini 2.5 Pro, Gemini 3.1 Pro, Gemini 3.5 Flash.

Full results: [gcformat.com/guide/benchmarks](https://gcformat.com/guide/benchmarks.html)

## LLM Generation (28 runs, 9 models)

Can models produce valid output in each format? 3-line primer, validated through real decoders.

| Model | GCF | TOON | JSON |
|-------|-----|------|------|
| Claude Opus 4.6 | **5/5** | 0/5 | 5/5 |
| Claude Sonnet 4.6 | **5/5** | 2-3/5 | 5/5 |
| GPT-5.5 | **4-5/5** | 1-2/5 | 5/5 |
| GPT-5.4 | **5/5** | 0/5 | 5/5 |
| Gemini 2.5 Pro | **5/5** | 1/5 | 5/5 |
| Gemini 3.1 Pro | **5/5** | 0/5 | 5/5 |

TOON's official decoder rejects LLM-generated output on 7 of 9 models. The error is always the same: the model writes `target` where TOON expects the integer `0`. No model has ever been trained on GCF, yet every frontier model produces valid output on first exposure.

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

- [GCF Specification](https://github.com/blackwell-systems/gcf) (DOI: [10.5281/zenodo.20579817](https://doi.org/10.5281/zenodo.20579817))
- [Documentation and Benchmarks](https://gcformat.com/)
- [Playground (live three-way comparison)](https://gcformat.com/playground.html)
- [Full Eval Results (all 23 runs)](https://gcformat.com/guide/eval-results.html)
- [GCF Proxy (wrap any MCP server)](https://github.com/blackwell-systems/gcf-proxy): `pip install gcf-proxy`
- Implementations: [Go](https://github.com/blackwell-systems/gcf-go) | [TypeScript](https://github.com/blackwell-systems/gcf-typescript) | [Python](https://github.com/blackwell-systems/gcf-python) | [Rust](https://github.com/blackwell-systems/gcf-rust) | [Swift](https://github.com/blackwell-systems/gcf-swift) | [Kotlin](https://github.com/blackwell-systems/gcf-kotlin)
- [TOON Specification](https://github.com/toon-format/spec)
