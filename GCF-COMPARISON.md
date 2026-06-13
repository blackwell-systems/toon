# GCF Token Efficiency Benchmark

14 datasets representing real LLM tool response payloads. Same tokenizer (o200k_base), deterministic data generation, spec-compliant encoders for all formats.

## Results

### All Datasets

| # | Dataset | GCF | TOON | JSON | GCF vs TOON | GCF vs JSON | Winner |
|---|---------|-----|------|------|-------------|-------------|--------|
| 1 | Employee records (flat) | 49,061 | 49,966 | 127,050 | -1.8% | -61.4% | GCF |
| 2 | E-commerce orders (nested) | 51,334 | 73,246 | 109,574 | -29.9% | -53.1% | GCF |
| 3 | Analytics time-series (flat) | 8,404 | 9,127 | 22,257 | -7.9% | -62.2% | GCF |
| 4 | GitHub repositories (flat) | 8,582 | 8,744 | 15,144 | -1.9% | -43.3% | GCF |
| 5 | Event logs (semi-uniform) | 95,635 | 154,032 | 181,141 | -37.9% | -47.2% | GCF |
| 6 | Nested config (pure key-value) | 645 | 618 | 905 | +4.4% | -28.7% | TOON |
| 7 | LSP symbol search | 5,442 | 5,365 | 12,580 | +1.4% | -56.7% | TOON |
| 8 | PR file changes | 2,623 | 2,657 | 5,891 | -1.3% | -55.5% | GCF |
| 9 | Distributed trace | 4,318 | 4,959 | 9,442 | -12.9% | -54.3% | GCF |
| 10 | Database query results (wide) | 17,716 | 17,969 | 45,012 | -1.4% | -60.6% | GCF |
| 11 | File tree + diagnostics | 6,018 | 6,894 | 14,221 | -12.7% | -57.7% | GCF |
| 12 | Multi-tool agent composite | 3,131 | 3,192 | 6,844 | -1.9% | -54.3% | GCF |
| 13 | Order history (shared schemas) | 13,295 | 16,454 | 38,112 | -19.2% | -65.1% | GCF |
| 14 | Blast radius response | 6,561 | 7,831 | 16,003 | -16.2% | -59.0% | GCF |
| | **TOTAL** | **272,765** | **361,054** | **604,176** | **-24.5%** | **-54.8%** | **GCF** |

**GCF wins 12/14 vs TOON. Wins 14/14 vs JSON.**

TOON's two wins: nested config (27 tokens, pure key-value tree with zero arrays) and LSP symbol search (77 tokens, tokenizer artifact where `|` delimiter tokenizes slightly worse than `,`).

### By Category

| Category | Datasets | GCF vs TOON | GCF vs JSON |
|----------|----------|-------------|-------------|
| Flat tabular (100% arrays) | 1, 3, 4, 10 | -3.2% | -58.0% |
| Nested/mixed (arrays + objects) | 2, 5, 8, 9, 11, 13, 14 | -21.4% | -55.7% |
| Pure key-value (0% arrays) | 6 | +4.4% | -28.7% |
| Code intelligence | 7, 11, 14 | -9.8% | -57.8% |
| Multi-tool/composite | 12 | -1.9% | -54.3% |

## Why GCF Wins

GCF's optimizations directly target the structure of LLM tool responses:

1. **Inline object schemas**: nested objects with 3+ fields are encoded positionally. Schema declared once on first row, bare `^` on subsequent rows.
2. **Shared array schemas**: when nested arrays have identical structure across rows (e.g., order items, symbol callers), the field header appears once.
3. **No attachment indentation**: saves 2 bytes per attachment line.
4. **Tabular encoding**: one field declaration replaces N*M field name repetitions.

## Reproducing

```bash
git clone https://github.com/blackwell-systems/toon-benchmark
cd toon-benchmark
pnpm install
node --experimental-strip-types benchmarks/scripts/token-efficiency-benchmark.ts
```

## Datasets

All datasets use deterministic generation (faker.js, seed 12345) or static data files. The benchmark includes:

- **Real API shapes**: GitHub PR files, database query results, distributed traces
- **Code intelligence**: LSP symbols, blast radius, file diagnostics
- **E-commerce**: orders with nested customers and line items
- **Observability**: event logs, OpenTelemetry spans
- **Agent workflows**: multi-tool composite responses

No dataset was cherry-picked to favor any format. The mix reflects the actual distribution of LLM tool response structures in production agent systems.
