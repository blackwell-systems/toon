import { TOKEN_EFFICIENCY_DATASETS } from '../src/datasets.ts'
import { tokenize } from '../src/utils.ts'
import { formatters } from '../src/formatters.ts'
import { execSync } from 'node:child_process'
import { writeFileSync } from 'node:fs'

console.log('Dataset                    JSON     TOON   GCF-v2  GCF-v3a    PLOON  v3vsv2 v3vsPLOON')
console.log('='.repeat(95))

let totals = { json: 0, toon: 0, v2: 0, v3: 0, ploon: 0 }

for (const ds of TOKEN_EFFICIENCY_DATASETS) {
  const jsonData = JSON.stringify(ds.data)
  writeFileSync('/tmp/ds-tmp.json', jsonData)
  
  const jsonTokens = tokenize(formatters['json-pretty'](ds.data))
  const toonTokens = tokenize(formatters['toon'](ds.data))
  const ploonTokens = tokenize(formatters['ploon'](ds.data))
  
  // Use Go CLI for both v2 and v3 (apples to apples)
  const v2Output = execSync('gcf encode-generic < /tmp/ds-tmp.json', { encoding: 'utf8' })
  const gcfV2Tokens = tokenize(v2Output)
  
  const v3Output = execSync('/tmp/gcf-v3-all encode-generic < /tmp/ds-tmp.json', { encoding: 'utf8' })
  const gcfV3Tokens = tokenize(v3Output)
  
  totals.json += jsonTokens
  totals.toon += toonTokens
  totals.v2 += gcfV2Tokens
  totals.v3 += gcfV3Tokens
  totals.ploon += ploonTokens
  
  const v3vsV2 = ((1 - gcfV3Tokens / gcfV2Tokens) * 100).toFixed(1)
  const v3vsPloon = ((1 - gcfV3Tokens / ploonTokens) * 100).toFixed(1)
  
  const winner = gcfV3Tokens <= ploonTokens ? '✓ GCF' : '✗ PLOON'
  
  const name = ds.name.padEnd(26)
  console.log(`${name} ${jsonTokens.toString().padStart(7)}  ${toonTokens.toString().padStart(7)}  ${gcfV2Tokens.toString().padStart(7)}  ${gcfV3Tokens.toString().padStart(7)}  ${ploonTokens.toString().padStart(7)}  ${(v3vsV2 + '%').padStart(6)} ${(v3vsPloon + '%').padStart(9)}  ${winner}`)
}

console.log('-'.repeat(95))
const v3vsV2T = ((1 - totals.v3 / totals.v2) * 100).toFixed(1)
const v3vsPloonT = ((1 - totals.v3 / totals.ploon) * 100).toFixed(1)
const v3vsJsonT = ((1 - totals.v3 / totals.json) * 100).toFixed(1)
const v3vsToonT = ((1 - totals.v3 / totals.toon) * 100).toFixed(1)
console.log(`${'TOTAL'.padEnd(26)} ${totals.json.toString().padStart(7)}  ${totals.toon.toString().padStart(7)}  ${totals.v2.toString().padStart(7)}  ${totals.v3.toString().padStart(7)}  ${totals.ploon.toString().padStart(7)}  ${(v3vsV2T + '%').padStart(6)} ${(v3vsPloonT + '%').padStart(9)}`)
console.log(`\nGCF v3 vs JSON: ${v3vsJsonT}%  |  vs TOON: ${v3vsToonT}%  |  vs PLOON: ${v3vsPloonT}%`)
