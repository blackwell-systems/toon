# GCF Token Efficiency Benchmark

16 datasets representing real LLM tool response payloads. Same tokenizer (o200k_base), deterministic data generation, spec-compliant encoders for all formats.

## Results

### All Datasets

| # | Dataset | GCF | TOON | JSON | GCF vs TOON | GCF vs JSON | Winner |
|---|---------|-----|------|------|-------------|-------------|--------|
| 1 | Employee records (flat) | 49,061 | 49,966 | 127,050 | -1.8% | -61.4% | GCF |
| 2 | E-commerce orders (nested) | 50,343 | 73,246 | 109,574 | -31.3% | -54.1% | GCF |
| 3 | Analytics time-series (flat) | 8,404 | 9,127 | 22,257 | -7.9% | -62.2% | GCF |
| 4 | GitHub repositories (flat) | 8,599 | 8,744 | 15,144 | -1.7% | -43.2% | GCF |
| 5 | Event logs (semi-uniform) | 95,193 | 154,032 | 181,141 | -38.2% | -47.4% | GCF |
| 6 | Nested config (pure key-value) | 617 | 618 | 905 | -0.2% | -31.8% | GCF |
| 7 | LSP symbol search | 5,442 | 5,365 | 12,580 | +1.4% | -56.7% | TOON |
| 8 | PR file changes | 2,623 | 2,657 | 5,891 | -1.3% | -55.5% | GCF |
| 9 | Distributed trace | 4,318 | 4,959 | 9,442 | -12.9% | -54.3% | GCF |
| 10 | Database query results (wide) | 17,716 | 17,969 | 45,012 | -1.4% | -60.6% | GCF |
| 11 | File tree + diagnostics | 6,018 | 6,894 | 14,221 | -12.7% | -57.7% | GCF |
| 12 | Multi-tool agent composite | 3,131 | 3,192 | 6,844 | -1.9% | -54.3% | GCF |
| 13 | Order history (shared schemas) | 13,295 | 16,454 | 38,112 | -19.2% | -65.1% | GCF |
| 14 | Blast radius response | 6,561 | 7,831 | 16,003 | -16.2% | -59.0% | GCF |
| 15 | Kubernetes pod status | 40,097 | 60,603 | 100,236 | -33.8% | -60.0% | GCF |
| 16 | Enterprise org hierarchy | 222,196 | 330,486 | 504,169 | -32.8% | -55.9% | GCF |
| | **TOTAL** | **533,614** | **752,143** | **1,213,581** | **-29.0%** | **-56.0%** | **GCF** |

**GCF wins 15/16 vs TOON. Wins 16/16 vs JSON.**

TOON's one win: LSP symbol search (77 tokens, 1.4%, tokenizer artifact where `|` delimiter tokenizes slightly worse than `,` on this specific data shape).

### By Category

| Category | Datasets | GCF vs TOON | GCF vs JSON |
|----------|----------|-------------|-------------|
| Flat tabular (100% arrays) | 1, 3, 4, 10 | -3.2% | -58.0% |
| Nested/mixed (arrays + objects) | 2, 5, 6, 8, 9, 11, 13, 14, 15, 16 | -26.5% | -54.8% |
| Code intelligence | 7, 11, 14 | -9.8% | -57.8% |
| Multi-tool/composite | 12 | -1.9% | -54.3% |

## Why GCF Wins

GCF's optimizations directly target the structure of LLM tool responses:

1. **Nested object flattening (v3.2)**: fixed-shape nested objects become `>` path columns. One header, pure tabular rows. No attachment blocks for uniform nesting.
2. **Inline object schemas**: nested objects with 3+ fields that can't be flattened (different keys across rows) use positional `^{fields}` encoding.
3. **Shared array schemas**: identical nested arrays across rows declare fields once.
4. **Tabular encoding**: one field declaration replaces N*M field name repetitions.

## Reproducing

```bash
cd benchmarks
npx tsx scripts/token-efficiency-benchmark.ts
```

Requires `@blackwell-systems/gcf` v2.2.0+ (spec v3.2 with flattening).
