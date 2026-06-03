/**
 * GCF (Graph Compact Format) encoder for generic structured data.
 *
 * GCF achieves token efficiency through:
 * 1. Positional fields (no field names repeated per row)
 * 2. Local IDs (@N) for cross-referencing
 * 3. Section headers (## name) for grouping
 * 4. Type-aware value encoding (omit quotes for numbers/booleans)
 *
 * Specification: https://github.com/blackwell-systems/gcf
 */

/**
 * Encode any JavaScript value into GCF format.
 *
 * Strategy:
 * - Arrays of uniform objects -> tabular encoding (header + positional rows)
 * - Nested objects -> key: value with indentation
 * - Primitives -> direct value
 */
export function encodeGCF(data: unknown): string {
  if (data === null || data === undefined) return ''
  if (typeof data !== 'object') return String(data)

  const lines: string[] = []

  if (Array.isArray(data)) {
    encodeArray(data, '', lines, 0)
  } else {
    encodeObject(data as Record<string, unknown>, lines, 0)
  }

  return lines.join('\n')
}

function encodeObject(obj: Record<string, unknown>, lines: string[], depth: number): void {
  for (const [key, value] of Object.entries(obj)) {
    if (value === null || value === undefined) continue

    if (Array.isArray(value)) {
      encodeArray(value, key, lines, depth)
    } else if (typeof value === 'object') {
      lines.push(`${indent(depth)}## ${key}`)
      encodeObject(value as Record<string, unknown>, lines, depth + 1)
    } else {
      lines.push(`${indent(depth)}${key}=${formatValue(value)}`)
    }
  }
}

function encodeArray(arr: unknown[], name: string, lines: string[], depth: number): void {
  if (arr.length === 0) {
    if (name) lines.push(`${indent(depth)}## ${name} [0]`)
    return
  }

  // Check if array is uniform objects (tabular)
  if (isUniformObjectArray(arr)) {
    encodeTabular(arr as Record<string, unknown>[], name, lines, depth)
    return
  }

  // Non-uniform: encode each item
  if (name) lines.push(`${indent(depth)}## ${name} [${arr.length}]`)
  for (let i = 0; i < arr.length; i++) {
    const item = arr[i]
    if (typeof item === 'object' && item !== null && !Array.isArray(item)) {
      lines.push(`${indent(depth)}@${i}`)
      encodeObject(item as Record<string, unknown>, lines, depth + 1)
    } else if (Array.isArray(item)) {
      encodeArray(item, `${i}`, lines, depth + 1)
    } else {
      lines.push(`${indent(depth)}@${i} ${formatValue(item)}`)
    }
  }
}

/**
 * Tabular encoding: the core of GCF's efficiency for arrays of objects.
 *
 * Format (flat, no nested fields):
 *   ## name [count]{field1,field2,field3}
 *   value1|value2|value3
 *   value1|value2|value3
 *
 * Format (with nested fields, needs IDs for cross-reference):
 *   ## name [count]{field1,field2}
 *   @0 value1|value2
 *     .nested
 *       key=val
 *
 * One field declaration replaces N*M field name repetitions.
 * Pipe separator with no spaces: minimal delimiter cost.
 */
function encodeTabular(arr: Record<string, unknown>[], name: string, lines: string[], depth: number): void {
  // Get all field names from first record (uniform array, so all have same keys)
  const fields = Object.keys(arr[0]!)

  // Separate primitive fields from nested fields
  const primitiveFields: string[] = []
  const nestedFields: string[] = []

  for (const field of fields) {
    const sampleValue = arr[0]![field]
    if (typeof sampleValue === 'object' && sampleValue !== null) {
      nestedFields.push(field)
    } else {
      primitiveFields.push(field)
    }
  }

  // Header with count and field declaration
  const header = name
    ? `## ${name} [${arr.length}]{${primitiveFields.join(',')}}`
    : `## [${arr.length}]{${primitiveFields.join(',')}}`
  lines.push(`${indent(depth)}${header}`)

  // Pure flat: no IDs, no spaces around pipe (maximum density)
  const hasNested = nestedFields.length > 0

  for (let i = 0; i < arr.length; i++) {
    const row = arr[i]!
    const values = primitiveFields.map(f => formatValue(row[f]))

    if (hasNested) {
      // Need @N for cross-referencing nested sub-objects
      lines.push(`${indent(depth)}@${i} ${values.join('|')}`)
    } else {
      // Pure flat: bare positional row, no ID overhead
      lines.push(`${indent(depth)}${values.join('|')}`)
    }

    // Nested fields inline after the row
    if (hasNested) {
      for (const nestedField of nestedFields) {
        const nestedValue = row[nestedField]
        if (nestedValue === null || nestedValue === undefined) continue

        if (Array.isArray(nestedValue)) {
          encodeArray(nestedValue, nestedField, lines, depth + 1)
        } else if (typeof nestedValue === 'object') {
          lines.push(`${indent(depth + 1)}.${nestedField}`)
          encodeObject(nestedValue as Record<string, unknown>, lines, depth + 2)
        }
      }
    }
  }
}

function isUniformObjectArray(arr: unknown[]): boolean {
  if (arr.length === 0) return false

  const first = arr[0]
  if (typeof first !== 'object' || first === null || Array.isArray(first)) return false

  const firstKeys = Object.keys(first).sort().join(',')

  // Check first few items for uniformity (sample, don't check all)
  const checkCount = Math.min(arr.length, 5)
  for (let i = 1; i < checkCount; i++) {
    const item = arr[i]
    if (typeof item !== 'object' || item === null || Array.isArray(item)) return false
    const itemKeys = Object.keys(item).sort().join(',')
    // Allow minor differences (semi-uniform with optional fields)
    if (itemKeys !== firstKeys) {
      // Check if it's a subset/superset (semi-uniform)
      const firstSet = new Set(Object.keys(first))
      const itemSet = new Set(Object.keys(item as object))
      const overlap = [...firstSet].filter(k => itemSet.has(k))
      if (overlap.length < firstSet.size * 0.7) return false
    }
  }

  return true
}

function formatValue(value: unknown): string {
  if (value === null || value === undefined) return '-'
  if (typeof value === 'number') return String(value)
  if (typeof value === 'boolean') return value ? 'true' : 'false'
  const str = String(value)
  // Quote if contains delimiter or whitespace
  if (str.includes(' | ') || str.includes('\n') || str === '') {
    return `"${str.replace(/"/g, '\\"')}"`
  }
  return str
}

function indent(depth: number): string {
  return depth > 0 ? '  '.repeat(depth) : ''
}
