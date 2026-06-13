# TOON Token Efficiency Benchmark (with GCF comparison)

Fork of [toon-format/toon](https://github.com/toon-format/toon) with [GCF (Graph Compact Format)](https://github.com/blackwell-systems/gcf) added as a formatter. Same datasets, same tokenizer, same methodology. One additional format.

**Branch:** `gcf-comparison`

## Results

GCF uses the published `@blackwell-systems/gcf` library ([npm](https://www.npmjs.com/package/@blackwell-systems/gcf)). TOON uses the upstream `@toon-format/toon` from this repo. Token counts use `gpt-tokenizer` with `o200k_base` encoding.

### Mixed-Structure Track

```
Semi-uniform event logs (2000 records):
  TOON   ████████████████████████████████████████████████████  154,032
  GCF    ███████████████████████████████████░░░░░░░░░░░░░░░░░  108,158  ◀ 30% smaller

E-commerce orders (500 orders, nested items):
  TOON   ████████████████████████████████████████████████████   73,246
  GCF    ████████████████████████████████████████████░░░░░░░░   61,593  ◀ 16% smaller

Deeply nested configuration:
  TOON   ████████████████████████████████████████████████████      618
  GCF    █████████████████████████████████████████████████████░    616  ◀ 0.3% smaller

Mixed total:
  TOON   ████████████████████████████████████████████████████  227,896
  GCF    ██████████████████████████████████░░░░░░░░░░░░░░░░░░  170,367  ◀ 34% smaller
```

### Flat-Only Track

```
Employee records (2000 rows):
  TOON   ████████████████████████████████████████████████████   49,966
  GCF    ██████████████████████████████████████████████████░░   49,055  ◀ 2% smaller

Analytics time-series (365 days):
  TOON   ████████████████████████████████████████████████████    9,127
  GCF    ████████████████████████████████████████████████░░░░    8,398  ◀ 8% smaller

GitHub repos (100 rows):
  TOON   ████████████████████████████████████████████████████    8,744
  GCF    ██████████████████████████████████████████████████░░    8,576  ◀ 2% smaller

Flat total:
  TOON   ████████████████████████████████████████████████████   67,837
  GCF    ██████████████████████████████████████████████████░░   66,029  ◀ 3% smaller
```

### Summary

| Dataset | GCF | TOON | Winner |
|---------|-----|------|--------|
| Semi-uniform event logs | 108,158 | 154,032 | **GCF 30% smaller** |
| E-commerce orders | 61,593 | 73,246 | **GCF 16% smaller** |
| Deeply nested config | 616 | 618 | **GCF 0.3% smaller** |
| Employee records | 49,055 | 49,966 | **GCF 2% smaller** |
| Analytics time-series | 8,398 | 9,127 | **GCF 8% smaller** |
| GitHub repos | 8,576 | 8,744 | **GCF 2% smaller** |

GCF wins on all 6 datasets.

## What changed

One file: `benchmarks/src/formatters.ts`.

```typescript
import { encodeGeneric as encodeGCF } from '@blackwell-systems/gcf'
```

No other changes. Datasets, tokenizer, benchmark harness, and TOON encoder are all upstream code.

## Reproduce

```bash
git clone https://github.com/blackwell-systems/toon.git
cd toon && git checkout gcf-comparison
cd benchmarks && pnpm install && pnpm benchmark:tokens
```

## What this benchmark does NOT test

This tests the **tabular/generic** profile only. GCF's largest advantages come from features TOON does not have:

- **Local IDs and edge encoding** (`@0<@1 calls`): ~4 tokens/edge vs ~100 for repeated identifiers
- **Session deduplication**: 92.7% savings by the 5th tool call
- **Delta encoding**: 81.2% savings on re-queries

These are tested in the [GCF comprehension eval](https://github.com/blackwell-systems/gcf-go/tree/main/eval).

## Beyond Token Efficiency

This benchmark only tests token counts. GCF's full advantage includes LLM comprehension (90.7% avg across 10 models vs TOON's 68.5%) and generation (TOON's decoder rejects LLM output on 7 of 9 models). See [GCF-COMPARISON.md](GCF-COMPARISON.md) for the full analysis.

## Links

- [GCF Specification](https://github.com/blackwell-systems/gcf) (DOI: [10.5281/zenodo.20579817](https://doi.org/10.5281/zenodo.20579817))
- [Documentation and Benchmarks](https://gcformat.com/)
- [Full Eval Results](https://gcformat.com/guide/eval-results.html)
- [GCF vs TOON](https://gcformat.com/guide/vs-toon.html)
- [Playground](https://gcformat.com/playground.html)
- [GCF Proxy](https://github.com/blackwell-systems/gcf-proxy): `pip install gcf-proxy` (wrap any MCP server, zero code changes)
- [TOON upstream](https://github.com/toon-format/toon)
