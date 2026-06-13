import { TOKEN_EFFICIENCY_DATASETS } from '../src/datasets.ts'
import { writeFileSync } from 'node:fs'
for (const ds of TOKEN_EFFICIENCY_DATASETS) {
  writeFileSync(`/tmp/bench-${ds.name}.json`, JSON.stringify(ds.data))
  console.log(`${ds.name}: ${JSON.stringify(ds.data).length} bytes`)
}
