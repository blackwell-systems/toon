#### Mixed-Structure Track

Datasets with nested or semi-uniform structures. CSV excluded as it cannot properly represent these structures.

```
🛒 E-commerce orders with nested structures  ┊  Tabular: 33%
   │
   TOON                █████████████░░░░░░░    73,246 tokens
   ├─ vs JSON          (−33.2%)               109,574 tokens
   ├─ vs JSON compact  (+5.3%)                 69,528 tokens
   ├─ vs GCF           (+45.5%)                50,343 tokens
   ├─ vs PLOON         (+38.1%)                53,026 tokens
   ├─ vs YAML          (−14.3%)                85,451 tokens
   └─ vs XML           (−40.6%)               123,272 tokens

🧾 Semi-uniform event logs  ┊  Tabular: 50%
   │
   TOON                █████████████████░░░   154,032 tokens
   ├─ vs JSON          (−15.0%)               181,141 tokens
   ├─ vs JSON compact  (+19.9%)               128,480 tokens
   ├─ vs GCF           (+61.8%)                95,193 tokens
   ├─ vs PLOON         (+53.4%)               100,403 tokens
   ├─ vs YAML          (−0.8%)                155,346 tokens
   └─ vs XML           (−25.2%)               205,796 tokens

🧩 Deeply nested configuration  ┊  Tabular: 0%
   │
   TOON                ██████████████░░░░░░       618 tokens
   ├─ vs JSON          (−31.7%)                   905 tokens
   ├─ vs JSON compact  (+12.0%)                   552 tokens
   ├─ vs GCF           (+0.2%)                    617 tokens
   ├─ vs PLOON         (+3.5%)                    597 tokens
   ├─ vs YAML          (−6.6%)                    662 tokens
   └─ vs XML           (−38.0%)                   997 tokens

📊 Pull request file change summary  ┊  Tabular: 80%
   │
   TOON                ████████████░░░░░░░░     2,657 tokens
   ├─ vs JSON          (−41.2%)                 4,521 tokens
   ├─ vs JSON compact  (−21.8%)                 3,399 tokens
   ├─ vs GCF           (+1.3%)                  2,623 tokens
   ├─ vs PLOON         (−0.9%)                  2,680 tokens
   ├─ vs YAML          (−33.0%)                 3,968 tokens
   └─ vs XML           (−45.3%)                 4,860 tokens

📊 Distributed trace spans for an API error  ┊  Tabular: 40%
   │
   TOON                ████████████████░░░░     4,959 tokens
   ├─ vs JSON          (−20.9%)                 6,266 tokens
   ├─ vs JSON compact  (+9.2%)                  4,541 tokens
   ├─ vs GCF           (+14.8%)                 4,318 tokens
   ├─ vs PLOON         (+41.8%)                 3,497 tokens
   ├─ vs YAML          (−3.8%)                  5,154 tokens
   └─ vs XML           (−30.0%)                 7,084 tokens

📊 Project file tree with LSP diagnostics  ┊  Tabular: 55%
   │
   TOON                █████████████░░░░░░░     6,894 tokens
   ├─ vs JSON          (−36.9%)                10,918 tokens
   ├─ vs JSON compact  (−3.2%)                  7,123 tokens
   ├─ vs GCF           (+14.6%)                 6,018 tokens
   ├─ vs PLOON         (+25.9%)                 5,474 tokens
   ├─ vs YAML          (−18.8%)                 8,490 tokens
   └─ vs XML           (−44.5%)                12,411 tokens

📊 Multi-tool agent session with heterogeneous results  ┊  Tabular: 45%
   │
   TOON                █████████████░░░░░░░     3,192 tokens
   ├─ vs JSON          (−35.8%)                 4,969 tokens
   ├─ vs JSON compact  (−10.4%)                 3,561 tokens
   ├─ vs GCF           (+1.9%)                  3,131 tokens
   ├─ vs PLOON         (+6.3%)                  3,003 tokens
   ├─ vs YAML          (−20.9%)                 4,033 tokens
   └─ vs XML           (−43.2%)                 5,624 tokens

📊 Order history testing shared array schema optimization  ┊  Tabular: 70%
   │
   TOON                ████████████░░░░░░░░    16,454 tokens
   ├─ vs JSON          (−37.7%)                26,429 tokens
   ├─ vs JSON compact  (−4.6%)                 17,254 tokens
   ├─ vs GCF           (+23.8%)                13,295 tokens
   ├─ vs PLOON         (+17.0%)                14,062 tokens
   ├─ vs YAML          (−21.4%)                20,934 tokens
   └─ vs XML           (−44.9%)                29,860 tokens

📊 Blast radius response testing shared caller schema  ┊  Tabular: 65%
   │
   TOON                ███████████░░░░░░░░░     7,831 tokens
   ├─ vs JSON          (−46.0%)                14,515 tokens
   ├─ vs JSON compact  (−14.4%)                 9,153 tokens
   ├─ vs GCF           (+19.4%)                 6,561 tokens
   ├─ vs PLOON         (+11.9%)                 6,998 tokens
   ├─ vs YAML          (−28.9%)                11,021 tokens
   └─ vs XML           (−55.1%)                17,443 tokens

📊 Exact 500-order payload from comprehension eval (same data models are tested on)  ┊  Tabular: 70%
   │
   TOON                ████████████░░░░░░░░    60,603 tokens
   ├─ vs JSON          (−37.5%)                97,034 tokens
   ├─ vs JSON compact  (+4.4%)                 58,030 tokens
   ├─ vs GCF           (+51.1%)                40,097 tokens
   ├─ vs PLOON         (+40.7%)                43,061 tokens
   ├─ vs YAML          (−16.5%)                72,602 tokens
   └─ vs XML           (−44.9%)               109,900 tokens

──────────────────────────────────── Total ────────────────────────────────────
   TOON                ██████████████░░░░░░   330,486 tokens
   ├─ vs JSON          (−27.6%)               456,272 tokens
   ├─ vs JSON compact  (+9.6%)                301,621 tokens
   ├─ vs GCF           (+48.7%)               222,196 tokens
   ├─ vs PLOON         (+42.0%)               232,801 tokens
   ├─ vs YAML          (−10.1%)               367,661 tokens
   └─ vs XML           (−36.1%)               517,247 tokens
```

#### Flat-Only Track

Datasets with flat tabular structures where CSV is applicable.

```
👥 Uniform employee records  ┊  Tabular: 100%
   │
   CSV                 ███████████████████░    47,137 tokens
   TOON                ████████████████████    49,966 tokens   (+6.0% vs CSV)
   ├─ vs JSON          (−60.7%)               127,050 tokens
   ├─ vs JSON compact  (−36.8%)                79,046 tokens
   ├─ vs GCF           (+1.8%)                 49,061 tokens
   ├─ vs PLOON         (−13.9%)                58,057 tokens
   ├─ vs YAML          (−50.1%)               100,033 tokens
   └─ vs XML           (−65.9%)               146,596 tokens

📈 Time-series analytics data  ┊  Tabular: 100%
   │
   CSV                 ██████████████████░░     8,395 tokens
   TOON                ████████████████████     9,127 tokens   (+8.7% vs CSV)
   ├─ vs JSON          (−59.0%)                22,257 tokens
   ├─ vs JSON compact  (−35.8%)                14,223 tokens
   ├─ vs GCF           (+8.6%)                  8,404 tokens
   ├─ vs PLOON         (−7.4%)                  9,858 tokens
   ├─ vs YAML          (−48.9%)                17,870 tokens
   └─ vs XML           (−65.7%)                26,628 tokens

⭐ Top 100 GitHub repositories  ┊  Tabular: 100%
   │
   CSV                 ███████████████████░     8,512 tokens
   TOON                ████████████████████     8,744 tokens   (+2.7% vs CSV)
   ├─ vs JSON          (−42.3%)                15,144 tokens
   ├─ vs JSON compact  (−23.7%)                11,454 tokens
   ├─ vs GCF           (+1.7%)                  8,599 tokens
   ├─ vs PLOON         (−2.6%)                  8,982 tokens
   ├─ vs YAML          (−33.4%)                13,128 tokens
   └─ vs XML           (−48.9%)                17,095 tokens

📊 LSP workspace symbol search results  ┊  Tabular: 95%
   │
   CSV                 ███████████████████░     5,012 tokens
   TOON                ████████████████████     5,365 tokens   (+7.0% vs CSV)
   ├─ vs JSON          (−62.9%)                14,444 tokens
   ├─ vs JSON compact  (−41.6%)                 9,184 tokens
   ├─ vs GCF           (−1.4%)                  5,442 tokens
   ├─ vs PLOON         (−11.0%)                 6,026 tokens
   ├─ vs YAML          (−53.1%)                11,431 tokens
   └─ vs XML           (−68.1%)                16,835 tokens

📊 Wide-table database query results with 15 columns  ┊  Tabular: 97%
   │
   CSV                 ████████████████████    17,552 tokens
   TOON                ████████████████████    17,969 tokens   (+2.4% vs CSV)
   ├─ vs JSON          (−51.6%)                37,091 tokens
   ├─ vs JSON compact  (−33.8%)                27,134 tokens
   ├─ vs GCF           (+1.4%)                 17,716 tokens
   ├─ vs PLOON         (+10595.8%)                168 tokens
   ├─ vs YAML          (−42.3%)                31,157 tokens
   └─ vs XML           (−59.0%)                43,850 tokens

──────────────────────────────────── Total ────────────────────────────────────
   CSV                 ███████████████████░    86,608 tokens
   TOON                ████████████████████    91,171 tokens   (+5.3% vs CSV)
   ├─ vs JSON          (−57.8%)               215,986 tokens
   ├─ vs JSON compact  (−35.4%)               141,041 tokens
   ├─ vs GCF           (+2.2%)                 89,222 tokens
   ├─ vs PLOON         (+9.7%)                 83,091 tokens
   ├─ vs YAML          (−47.5%)               173,619 tokens
   └─ vs XML           (−63.7%)               251,004 tokens
```

<details>
<summary><strong>Show detailed examples</strong></summary>

#### 📈 Time-series analytics data

**Savings:** 13,130 tokens (59.0% reduction vs JSON)

**JSON** (22,257 tokens):

```json
{
  "metrics": [
    {
      "date": "2025-01-01",
      "views": 4369,
      "clicks": 278,
      "conversions": 22,
      "revenue": 2108.75,
      "bounceRate": 0.48
    },
    {
      "date": "2025-01-02",
      "views": 5958,
      "clicks": 193,
      "conversions": 27,
      "revenue": 7353.88,
      "bounceRate": 0.61
    },
    {
      "date": "2025-01-03",
      "views": 6958,
      "clicks": 349,
      "conversions": 43,
      "revenue": 5512.87,
      "bounceRate": 0.41
    },
    {
      "date": "2025-01-04",
      "views": 6520,
      "clicks": 388,
      "conversions": 47,
      "revenue": 9381.99,
      "bounceRate": 0.42
    },
    {
      "date": "2025-01-05",
      "views": 4158,
      "clicks": 110,
      "conversions": 15,
      "revenue": 3849.04,
      "bounceRate": 0.35
    }
  ]
}
```

**TOON** (9,127 tokens):

```
metrics[5]{date,views,clicks,conversions,revenue,bounceRate}:
  2025-01-01,4369,278,22,2108.75,0.48
  2025-01-02,5958,193,27,7353.88,0.61
  2025-01-03,6958,349,43,5512.87,0.41
  2025-01-04,6520,388,47,9381.99,0.42
  2025-01-05,4158,110,15,3849.04,0.35
```

---

#### ⭐ Top 100 GitHub repositories

**Savings:** 6,400 tokens (42.3% reduction vs JSON)

**JSON** (15,144 tokens):

```json
{
  "repositories": [
    {
      "id": 28457823,
      "name": "freeCodeCamp",
      "repo": "freeCodeCamp/freeCodeCamp",
      "description": "freeCodeCamp.org's open-source codebase and curriculum. Learn math, programming,…",
      "createdAt": "2014-12-24T17:49:19Z",
      "updatedAt": "2025-10-28T11:58:08Z",
      "pushedAt": "2025-10-28T10:17:16Z",
      "stars": 430886,
      "watchers": 8583,
      "forks": 42146,
      "defaultBranch": "main"
    },
    {
      "id": 132750724,
      "name": "build-your-own-x",
      "repo": "codecrafters-io/build-your-own-x",
      "description": "Master programming by recreating your favorite technologies from scratch.",
      "createdAt": "2018-05-09T12:03:18Z",
      "updatedAt": "2025-10-28T12:37:11Z",
      "pushedAt": "2025-10-10T18:45:01Z",
      "stars": 430877,
      "watchers": 6332,
      "forks": 40453,
      "defaultBranch": "master"
    },
    {
      "id": 21737465,
      "name": "awesome",
      "repo": "sindresorhus/awesome",
      "description": "😎 Awesome lists about all kinds of interesting topics",
      "createdAt": "2014-07-11T13:42:37Z",
      "updatedAt": "2025-10-28T12:40:21Z",
      "pushedAt": "2025-10-27T17:57:31Z",
      "stars": 410052,
      "watchers": 8017,
      "forks": 32029,
      "defaultBranch": "main"
    }
  ]
}
```

**TOON** (8,744 tokens):

```
repositories[3]{id,name,repo,description,createdAt,updatedAt,pushedAt,stars,watchers,forks,defaultBranch}:
  28457823,freeCodeCamp,freeCodeCamp/freeCodeCamp,"freeCodeCamp.org's open-source codebase and curriculum. Learn math, programming,…","2014-12-24T17:49:19Z","2025-10-28T11:58:08Z","2025-10-28T10:17:16Z",430886,8583,42146,main
  132750724,build-your-own-x,codecrafters-io/build-your-own-x,Master programming by recreating your favorite technologies from scratch.,"2018-05-09T12:03:18Z","2025-10-28T12:37:11Z","2025-10-10T18:45:01Z",430877,6332,40453,master
  21737465,awesome,sindresorhus/awesome,😎 Awesome lists about all kinds of interesting topics,"2014-07-11T13:42:37Z","2025-10-28T12:40:21Z","2025-10-27T17:57:31Z",410052,8017,32029,main
```

</details>
