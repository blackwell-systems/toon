import type { Dataset } from './types.ts'
import { faker } from '@faker-js/faker'
import githubRepos from '../data/github-repos.json' with { type: 'json' }
import comprehensionEvalPayload from '../data/comprehension-eval-500orders.json' with { type: 'json' }

// Seed for reproducibility
faker.seed(12345)

/**
 * Employee record structure for tabular dataset
 */
export interface Employee {
  id: number
  name: string
  email: string
  department: string
  salary: number
  yearsExperience: number
  active: boolean
}

/**
 * E-commerce order structure for nested dataset
 */
export interface Order {
  orderId: string
  customer: {
    id: number
    name: string
    email: string
    phone: string
  }
  items: {
    sku: string
    name: string
    quantity: number
    price: number
  }[]
  subtotal: number
  tax: number
  total: number
  status: string
  orderDate?: string
  createdAt?: string
}

/**
 * Analytics metric structure for time-series dataset
 */
export interface AnalyticsMetric {
  date: string
  views: number
  clicks: number
  conversions: number
  revenue: number
  bounceRate: number
}

/**
 * GitHub repository structure for real-world dataset
 */
export interface Repository {
  id: number
  name: string
  repo: string
  description: string
  stars: number
  watchers: number
  forks: number
  defaultBranch: string
  createdAt: string
  updatedAt: string
  pushedAt: string
}

/**
 * Event log structure for semi-uniform dataset
 */
export interface EventLog {
  timestamp: string
  level: 'info' | 'warn' | 'error'
  endpoint: string
  statusCode: number
  responseTime: number
  userId: number
  error?: {
    message: string
    stack: string
    retryable: boolean
  }
}

/**
 * Nested configuration structure for deeply nested dataset
 */
export interface NestedConfig {
  environment: string
  version: string
  database: {
    host: string
    port: number
    name: string
    pool: {
      min: number
      max: number
      idleTimeout: number
    }
    replicas: {
      host: string
      port: number
      priority: number
    }[]
  }
  features: Record<string, {
    enabled: boolean
    rollout: number
    variants: {
      name: string
      weight: number
      config: Record<string, any>
    }[]
  }>
  authentication: {
    providers: {
      name: string
      clientId: string
      scopes: string[]
      config: Record<string, any>
    }[]
    session: {
      secret: string
      duration: number
      refreshThreshold: number
    }
  }
  permissions: {
    roles: Record<string, {
      permissions: string[]
      inherits: string[]
    }>
    groups: Record<string, {
      members: string[]
      roles: string[]
    }>
  }
}

/**
 * Product structure for large uniform arrays
 */
export interface Product {
  sku: string
  name: string
  category: string
  price: number
  qty: number
  lastUpdated: string
}

/**
 * Internal types for structural validation pattern generation
 */
type StructuralValidationType = 'truncated' | 'extra-rows' | 'width-mismatch' | 'missing-fields'

interface StructuralValidationFixture {
  type: StructuralValidationType
  description: string
  data: Record<string, unknown>
  isValid: boolean
}

/**
 * Generate analytics time-series data
 */
export function generateAnalyticsData(days: number, startDate = '2025-01-01'): {
  metrics: AnalyticsMetric[]
} {
  const date = new Date(startDate)

  return {
    metrics: Array.from({ length: days }, (_, i) => {
      const currentDate = new Date(date)
      currentDate.setDate(currentDate.getDate() + i)

      // Simulate realistic web traffic with some variation
      const baseViews = 5000
      const weekendMultiplier = currentDate.getDay() === 0 || currentDate.getDay() === 6 ? 0.7 : 1.0
      const views = Math.round(baseViews * weekendMultiplier + faker.number.int({ min: -1000, max: 3000 }))
      const clicks = Math.round(views * faker.number.float({ min: 0.02, max: 0.08 }))
      const conversions = Math.round(clicks * faker.number.float({ min: 0.05, max: 0.15 }))
      const avgOrderValue = faker.number.float({ min: 49.99, max: 299.99 })
      const revenue = Number((conversions * avgOrderValue).toFixed(2))

      return {
        date: currentDate.toISOString().split('T')[0]!,
        views,
        clicks,
        conversions,
        revenue,
        bounceRate: faker.number.float({ min: 0.3, max: 0.7, fractionDigits: 2 }),
      }
    }),
  }
}

/**
 * Generate employee data (uniform tabular structure)
 */
const departments = ['Engineering', 'Sales', 'Marketing', 'HR', 'Operations', 'Finance'] as const

function generateEmployees(count: number): { employees: Employee[] } {
  return {
    employees: Array.from({ length: count }, (_, i): Employee => {
      const yearsExp = faker.number.int({ min: 1, max: 25 })
      return {
        id: i + 1,
        name: faker.person.fullName(),
        email: faker.internet.email().toLowerCase(),
        department: departments[i % departments.length]!,
        salary: faker.number.int({ min: 45000, max: 150000 }),
        yearsExperience: yearsExp,
        active: faker.datatype.boolean(0.8), // 80% active
      }
    }),
  }
}

/**
 * Tabular dataset: Uniform employee records
 *
 * @remarks
 * Tests TOON's tabular array format.
 */
const tabularDataset: Dataset = {
  name: 'tabular',
  description: 'Uniform employee records',
  data: generateEmployees(100),
  metadata: {
    supportsCSV: true,
    structureClass: 'uniform',
    tabularEligibility: 100, // All arrays contain uniform objects with primitive values only
  },
}

/**
 * Generate e-commerce orders (nested structure)
 */
const PRODUCT_NAMES = ['Wireless Mouse', 'USB Cable', 'Laptop Stand', 'Keyboard', 'Webcam', 'Headphones', 'Monitor', 'Desk Lamp'] as const
const ORDER_STATUSES = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'] as const

function generateOrders(count: number): { orders: Order[] } {
  return {
    orders: Array.from({ length: count }, (_, i) => {
      const customerId = (i % 20) + 1 // Rotate through 20 customers
      const itemCount = faker.number.int({ min: 1, max: 4 }) // 1-4 items per order

      const items = Array.from({ length: itemCount }, (_, j) => {
        const price = faker.number.float({
          min: 9.99,
          max: 199.99,
          fractionDigits: 2,
        })
        const quantity = faker.number.int({ min: 1, max: 5 })
        return {
          sku: `SKU-${faker.string.alphanumeric({ length: 6 }).toUpperCase()}`,
          name: PRODUCT_NAMES[j % PRODUCT_NAMES.length]!,
          quantity,
          price,
        }
      })

      const subtotal = Number(items.reduce((sum, item) => sum + (item.price * item.quantity), 0).toFixed(2))
      const tax = Number((subtotal * 0.08).toFixed(2)) // 8% tax rate
      const total = Number((subtotal + tax).toFixed(2))

      return {
        orderId: `ORD-${String(i + 1).padStart(4, '0')}`,
        customer: {
          id: customerId,
          name: faker.person.fullName(),
          email: faker.internet.email().toLowerCase(),
          phone: faker.phone.number(),
        },
        items,
        subtotal,
        tax,
        total,
        status: ORDER_STATUSES[i % ORDER_STATUSES.length]!,
        orderDate: faker.date.recent({ days: 90 }).toISOString().split('T')[0],
      }
    }),
  }
}

/**
 * Nested dataset: E-commerce orders with nested structures
 *
 * @remarks
 * Tests TOON's handling of complex nested objects.
 */
const nestedDataset: Dataset = {
  name: 'nested',
  description: 'E-commerce orders with nested structures',
  data: generateOrders(50),
  metadata: {
    supportsCSV: false,
    structureClass: 'nested',
    tabularEligibility: 33, // Top-level orders array has nested objects (not tabular), but nested items arrays are tabular
  },
}

/**
 * Analytics dataset: Time-series metrics
 *
 * @remarks
 * Tests TOON's handling of numeric data and date fields.
 */
const analyticsDataset: Dataset = {
  name: 'analytics',
  description: 'Time-series analytics data',
  data: generateAnalyticsData(60),
  metadata: {
    supportsCSV: true,
    structureClass: 'uniform',
    tabularEligibility: 100, // Uniform time-series records with consistent primitive fields
  },
}

/**
 * Real-world dataset: Top 100 starred GitHub repositories
 *
 * @remarks
 * Tests TOON's tabular format with real data.
 */
const githubDataset: Dataset = {
  name: 'github',
  description: 'Top 100 GitHub repositories',
  data: {
    repositories: githubRepos,
  },
  metadata: {
    supportsCSV: true,
    structureClass: 'uniform',
    tabularEligibility: 100, // Repository array contains uniform objects with primitive values
  },
}

/**
 * Generate a single e-commerce order with nested structure
 *
 * @remarks
 * Used for token efficiency benchmarks.
 */
export function generateOrderData(): Order {
  return {
    orderId: faker.string.alphanumeric({ length: 12, casing: 'upper' }),
    customer: {
      id: faker.number.int({ min: 1000, max: 9999 }),
      name: faker.person.fullName(),
      email: faker.internet.email(),
      phone: faker.phone.number(),
    },
    items: Array.from({ length: faker.number.int({ min: 2, max: 5 }) }, () => ({
      sku: faker.string.alphanumeric({ length: 8, casing: 'upper' }),
      name: faker.commerce.productName(),
      quantity: faker.number.int({ min: 1, max: 5 }),
      price: Number(faker.commerce.price({ min: 10, max: 200 })),
    })),
    subtotal: Number(faker.commerce.price({ min: 100, max: 500 })),
    tax: Number(faker.commerce.price({ min: 10, max: 50 })),
    total: Number(faker.commerce.price({ min: 110, max: 550 })),
    status: faker.helpers.arrayElement(['pending', 'processing', 'shipped', 'delivered']),
    createdAt: faker.date.recent({ days: 7 }).toISOString(),
  }
}

/**
 * Generate event logs (semi-uniform structure)
 *
 * @remarks
 * Approximately 50% of logs include nested error objects, 50% are flat.
 * This creates ~45% tabular eligibility.
 */
export function generateEventLogs(count: number): { logs: EventLog[] } {
  const endpoints = ['/api/users', '/api/orders', '/api/products', '/api/auth', '/api/payments']
  const levels = ['info', 'warn', 'error'] as const

  return {
    logs: Array.from({ length: count }, () => {
      const level = faker.helpers.arrayElement(levels)
      const hasError = level === 'error' || (level === 'warn' && faker.datatype.boolean(0.3))

      const log: EventLog = {
        timestamp: faker.date.recent({ days: 7 }).toISOString(),
        level,
        endpoint: faker.helpers.arrayElement(endpoints),
        statusCode: hasError
          ? faker.number.int({ min: 400, max: 599 })
          : faker.number.int({ min: 200, max: 299 }),
        responseTime: faker.number.int({ min: 10, max: 5000 }),
        userId: faker.number.int({ min: 1000, max: 9999 }),
      }

      if (hasError) {
        log.error = {
          message: faker.helpers.arrayElement([
            'Database connection timeout',
            'Invalid authentication token',
            'Resource not found',
            'Internal server error',
            'Rate limit exceeded',
          ]),
          stack: `Error: ${faker.lorem.sentence()}\n  at ${faker.lorem.word()}\n  at ${faker.lorem.word()}`,
          retryable: faker.datatype.boolean(0.6),
        }
      }

      return log
    }),
  }
}

/**
 * Generate deeply nested configuration
 *
 * @remarks
 * Creates a complex nested structure with minimal tabular eligibility (~0%).
 */
export function generateNestedConfig(): NestedConfig {
  return {
    environment: faker.helpers.arrayElement(['production', 'staging', 'development']),
    version: faker.system.semver(),
    database: {
      host: faker.internet.domainName(),
      port: 5432,
      name: faker.database.type(),
      pool: {
        min: 2,
        max: faker.number.int({ min: 10, max: 50 }),
        idleTimeout: 30000,
      },
      replicas: Array.from({ length: 3 }, (_, i) => ({
        host: `replica-${i + 1}.${faker.internet.domainName()}`,
        port: 5432,
        priority: i + 1,
      })),
    },
    features: {
      darkMode: {
        enabled: faker.datatype.boolean(),
        rollout: faker.number.int({ min: 0, max: 100 }),
        variants: [
          {
            name: 'default',
            weight: 70,
            config: { theme: 'dark', animations: true },
          },
          {
            name: 'minimal',
            weight: 30,
            config: { theme: 'dark', animations: false },
          },
        ],
      },
      analytics: {
        enabled: faker.datatype.boolean(),
        rollout: faker.number.int({ min: 0, max: 100 }),
        variants: [
          {
            name: 'full',
            weight: 100,
            config: { tracking: 'all', sampling: 1.0 },
          },
        ],
      },
    },
    authentication: {
      providers: [
        {
          name: 'oauth2',
          clientId: faker.string.uuid(),
          scopes: ['read', 'write', 'admin'],
          config: {
            authUrl: faker.internet.url(),
            tokenUrl: faker.internet.url(),
          },
        },
        {
          name: 'saml',
          clientId: faker.string.uuid(),
          scopes: ['read'],
          config: {
            entryPoint: faker.internet.url(),
            cert: faker.string.alphanumeric({ length: 64 }),
          },
        },
      ],
      session: {
        secret: faker.string.alphanumeric({ length: 32 }),
        duration: 86400,
        refreshThreshold: 3600,
      },
    },
    permissions: {
      roles: {
        admin: {
          permissions: ['read', 'write', 'delete', 'manage_users', 'manage_roles'],
          inherits: [],
        },
        editor: {
          permissions: ['read', 'write'],
          inherits: ['viewer'],
        },
        viewer: {
          permissions: ['read'],
          inherits: [],
        },
      },
      groups: {
        engineering: {
          members: Array.from({ length: 5 }, () => faker.internet.email()),
          roles: ['admin', 'editor'],
        },
        support: {
          members: Array.from({ length: 3 }, () => faker.internet.email()),
          roles: ['viewer'],
        },
      },
    },
  }
}

/**
 * Generate large uniform product array (5000+ rows)
 *
 * @remarks
 * Tests TOON's token efficiency and structural reliability at scale.
 */
export function generateProducts(count: number): { products: Product[] } {
  const categories = ['Electronics', 'Clothing', 'Home & Garden', 'Sports', 'Books', 'Toys'] as const

  return {
    products: Array.from({ length: count }, (_, i): Product => ({
      sku: `SKU-${String(i + 1).padStart(6, '0')}`,
      name: faker.commerce.productName(),
      category: categories[i % categories.length]!,
      price: Number(faker.commerce.price({ min: 5, max: 500 })),
      qty: faker.number.int({ min: 0, max: 1000 }),
      lastUpdated: faker.date.recent({ days: 30 }).toISOString().split('T')[0]!,
    })),
  }
}

/**
 * Generate structural validation fixtures from employee data
 *
 * @remarks
 * Creates deliberately corrupted datasets to test TOON's structural validation
 * capabilities via [N] length declarations and {fields} headers.
 * Internal function used to generate structural validation datasets.
 */
function generateStructuralValidationFixtures(): StructuralValidationFixture[] {
  const baseData = generateEmployees(20)

  return [
    // Valid baseline
    {
      type: 'truncated' as const,
      description: 'Valid complete dataset (control)',
      data: { employees: baseData.employees },
      isValid: true,
    },
    // Truncated array (missing last 3 rows)
    {
      type: 'truncated' as const,
      description: 'Array truncated: 3 rows removed from end',
      data: { employees: baseData.employees.slice(0, -3) },
      isValid: false, // [N] won't match actual row count in TOON
    },
    // Extra rows (3 more than original)
    {
      type: 'extra-rows' as const,
      description: 'Extra rows added beyond declared length',
      data: {
        employees: [
          ...baseData.employees,
          ...generateEmployees(3).employees,
        ],
      },
      isValid: false, // [N] won't match actual row count in TOON
    },
    // Width mismatch (inconsistent field count)
    {
      type: 'width-mismatch' as const,
      description: 'Inconsistent field count (missing salary in row 10)',
      data: {
        employees: baseData.employees.map((emp, i) => {
          if (i === 9) {
            // Row 10, missing salary field
            const { salary, ...rest } = emp
            return rest
          }
          return emp
        }),
      },
      isValid: false, // Not all objects have same fields (tabular requirement)
    },
    // Missing required fields
    {
      type: 'missing-fields' as const,
      description: 'Missing required fields (no email in multiple rows)',
      data: {
        employees: baseData.employees.map((emp, i) => {
          if (i % 5 === 0) {
            // Every 5th row, missing email
            const { email, ...rest } = emp
            return rest
          }
          return emp
        }),
      },
      isValid: false, // Not all objects have same fields (tabular requirement)
    },
  ]
}

/**
 * Event logs dataset: Semi-uniform structure
 *
 * @remarks
 * Tests TOON with semi-uniform data (~50% flat, ~50% with nested errors).
 */
const eventLogsDataset: Dataset = {
  name: 'event-logs',
  description: 'Semi-uniform event logs',
  data: generateEventLogs(75),
  metadata: {
    supportsCSV: false,
    structureClass: 'semi-uniform',
    tabularEligibility: 50, // Top-level logs array is tabular, but ~50% have nested optional error objects
  },
}

/**
 * Nested config dataset: Deeply nested structure
 *
 * @remarks
 * Tests TOON's worst-case scenario with deeply nested configuration.
 */
const nestedConfigDataset: Dataset = {
  name: 'nested-config',
  description: 'Deeply nested configuration',
  data: generateNestedConfig(),
  metadata: {
    supportsCSV: false,
    structureClass: 'deep',
    tabularEligibility: 0, // Deeply nested configuration with no tabular arrays
  },
}

/**
 * Structural validation datasets: Tests ability to detect incomplete, truncated, or corrupted data
 *
 * @remarks
 * These datasets test TOON's structural validation advantages via [N] length declarations
 * and {fields} headers. CSV is included to demonstrate its lack of structural metadata.
 */
const structuralValidationDatasets: Dataset[] = generateStructuralValidationFixtures().map((fixture, index) => {
  const datasetNames = [
    'structural-validation-control',
    'structural-validation-truncated',
    'structural-validation-extra-rows',
    'structural-validation-width-mismatch',
    'structural-validation-missing-fields',
  ] as const

  return {
    name: datasetNames[index]!,
    description: fixture.description,
    data: fixture.data,
    metadata: {
      supportsCSV: true, // Include CSV to show it can't validate structure
      structureClass: 'uniform',
      tabularEligibility: 100,
    },
  }
})

/**
 * Datasets for accuracy benchmarks (smaller sizes for faster evaluation)
 */
export const ACCURACY_DATASETS: Dataset[] = [
  tabularDataset, // 100 employees
  nestedDataset, // 50 orders
  analyticsDataset, // 60 days
  githubDataset, // 100 repos
  eventLogsDataset, // 75 logs
  nestedConfigDataset, // 1 config
  ...structuralValidationDatasets, // 5 validation fixtures
]

/**
 * Generate LSP symbol search results (150 symbols)
 */
function generateLspSymbolSearch() {
  const symbolKinds = ['function', 'class', 'method', 'interface', 'variable'] as const
  const packages = ['controllers', 'services', 'models', 'middleware', 'utils', 'handlers', 'validators'] as const
  const fileExtensions = ['.ts', '.tsx', '.js'] as const
  const directories = ['src/auth', 'src/api', 'src/core', 'src/db', 'src/routes', 'src/utils', 'src/middleware', 'lib/shared'] as const

  const symbols = Array.from({ length: 150 }, (_, i) => {
    const kind = symbolKinds[i % symbolKinds.length]!
    const pkg = packages[i % packages.length]!
    const dir = directories[i % directories.length]!
    const ext = fileExtensions[i % fileExtensions.length]!
    const name = faker.helpers.arrayElement(['get', 'set', 'create', 'update', 'delete', 'validate', 'parse', 'handle', 'process', 'check']) + faker.lorem.word({ length: { min: 4, max: 10 } }).replace(/^\w/, c => c.toUpperCase())

    return {
      id: i + 1,
      name,
      qualifiedName: `pkg.${pkg}.${name}`,
      kind,
      containerName: pkg,
      file: `${dir}/${faker.lorem.word({ length: { min: 4, max: 12 } })}${ext}`,
      line: faker.number.int({ min: 1, max: 500 }),
      column: faker.number.int({ min: 1, max: 80 }),
      score: Number(faker.number.float({ min: 0.0, max: 1.0, fractionDigits: 3 })),
      exported: faker.datatype.boolean(0.7),
      deprecated: faker.datatype.boolean(0.1),
    }
  })

  return {
    query: 'auth middleware handler',
    file: 'src/auth/middleware.ts',
    symbols,
  }
}

/**
 * Generate PR file changes (45 files)
 */
function generatePrFileChanges() {
  const statuses = ['added', 'modified', 'removed', 'renamed'] as const
  const directories = ['src/api', 'src/components', 'src/utils', 'src/models', 'src/services', 'tests', 'lib', 'config'] as const
  const extensions = ['.ts', '.tsx', '.js', '.json', '.css', '.md'] as const

  const files = Array.from({ length: 45 }, (_, i) => {
    const status = i < 8 ? 'added' : i < 35 ? 'modified' : i < 40 ? 'removed' : 'renamed'
    const dir = directories[i % directories.length]!
    const ext = extensions[i % extensions.length]!
    const filename = `${dir}/${faker.lorem.word({ length: { min: 4, max: 12 } })}${ext}`
    const additions = status === 'removed' ? 0 : faker.number.int({ min: 1, max: 150 })
    const deletions = status === 'added' ? 0 : faker.number.int({ min: 1, max: 80 })

    return {
      filename,
      status,
      additions,
      deletions,
      changes: additions + deletions,
      patch: `@@ -${faker.number.int({ min: 1, max: 50 })},${faker.number.int({ min: 3, max: 10 })} +${faker.number.int({ min: 1, max: 50 })},${faker.number.int({ min: 3, max: 10 })} @@\n-${faker.lorem.sentence({ min: 3, max: 8 })}\n+${faker.lorem.sentence({ min: 3, max: 8 })}`,
      previousFilename: status === 'renamed' ? `${dir}/${faker.lorem.word({ length: { min: 4, max: 12 } })}${ext}` : null,
    }
  })

  const totalAdditions = files.reduce((sum, f) => sum + f.additions, 0)
  const totalDeletions = files.reduce((sum, f) => sum + f.deletions, 0)

  return {
    pullRequest: {
      number: faker.number.int({ min: 100, max: 9999 }),
      title: faker.git.commitMessage(),
      author: faker.internet.username(),
      baseBranch: 'main',
      headBranch: `feature/${faker.lorem.slug(3)}`,
    },
    summary: {
      totalFiles: files.length,
      additions: totalAdditions,
      deletions: totalDeletions,
    },
    files,
  }
}

/**
 * Generate distributed trace with 30 spans
 */
function generateDistributedTrace() {
  const services = ['api-gateway', 'auth-service', 'user-service', 'order-service', 'payment-service', 'notification-service'] as const
  const operations = ['HTTP GET', 'HTTP POST', 'db.query', 'cache.get', 'cache.set', 'queue.publish', 'grpc.call', 'validate', 'serialize'] as const
  const spanStatuses = ['ok', 'error', 'timeout'] as const

  function hexId(length: number): string {
    return faker.string.hexadecimal({ length, casing: 'lower', prefix: '' })
  }

  const traceId = hexId(32)
  const baseTime = new Date('2025-03-15T14:30:00.000Z')

  const spans = Array.from({ length: 30 }, (_, i) => {
    const status = i === 0 ? 'error' : faker.helpers.weightedArrayElement([
      { value: 'ok' as const, weight: 70 },
      { value: 'error' as const, weight: 20 },
      { value: 'timeout' as const, weight: 10 },
    ])
    const service = services[i % services.length]!
    const operation = operations[i % operations.length]!
    const startTime = new Date(baseTime.getTime() + i * faker.number.int({ min: 5, max: 50 }))
    const duration = faker.number.int({ min: 1, max: 2500 })

    const httpMethod = faker.helpers.arrayElement(['GET', 'POST', 'PUT', 'DELETE'])
    const httpStatus = status === 'error' ? faker.number.int({ min: 400, max: 599 }) : faker.number.int({ min: 200, max: 299 })

    const tags: Record<string, string | number> = {
      'http.method': httpMethod,
      'http.url': `/api/${faker.lorem.slug(2)}`,
      'http.status_code': httpStatus,
    }
    if (operation.startsWith('db')) {
      tags['db.statement'] = `SELECT * FROM ${faker.lorem.word()} WHERE id = $1`
      tags['db.type'] = 'postgresql'
    }

    const eventCount = faker.number.int({ min: 0, max: 3 })
    const events = Array.from({ length: eventCount }, () => ({
      timestamp: new Date(startTime.getTime() + faker.number.int({ min: 1, max: duration })).toISOString(),
      name: faker.helpers.arrayElement(['log', 'exception', 'retry', 'timeout', 'cache_miss']),
      message: faker.lorem.sentence({ min: 3, max: 8 }),
    }))

    return {
      spanId: hexId(16),
      parentSpanId: i === 0 ? null : hexId(16),
      operationName: `${service}.${operation}`,
      serviceName: service,
      startTime: startTime.toISOString(),
      duration,
      status,
      tags,
      events,
    }
  })

  return {
    traceId,
    rootSpan: spans[0]!.spanId,
    duration: faker.number.int({ min: 800, max: 5000 }),
    status: 'error',
    spans,
  }
}

/**
 * Generate database query results (200 rows, 15 columns)
 */
function generateDatabaseQueryResults() {
  const roles = ['admin', 'editor', 'viewer', 'manager', 'support'] as const
  const teams = ['Platform', 'Growth', 'Infrastructure', 'Mobile', 'Data', 'Security', 'Frontend', 'Backend'] as const
  const payments = ['credit_card', 'paypal', 'bank_transfer', 'crypto', 'apple_pay'] as const
  const tiers = ['bronze', 'silver', 'gold', 'platinum'] as const
  const statuses = ['active', 'inactive', 'suspended', 'pending_verification'] as const

  const columns = [
    { name: 'userId', type: 'integer' },
    { name: 'email', type: 'varchar(255)' },
    { name: 'displayName', type: 'varchar(100)' },
    { name: 'role', type: 'varchar(50)' },
    { name: 'team', type: 'varchar(50)' },
    { name: 'lastLogin', type: 'timestamp' },
    { name: 'signupDate', type: 'timestamp' },
    { name: 'totalOrders', type: 'integer' },
    { name: 'totalSpent', type: 'decimal(10,2)' },
    { name: 'avgOrderValue', type: 'decimal(10,2)' },
    { name: 'lastOrderDate', type: 'timestamp' },
    { name: 'preferredPayment', type: 'varchar(50)' },
    { name: 'loyaltyTier', type: 'varchar(20)' },
    { name: 'referralCount', type: 'integer' },
    { name: 'accountStatus', type: 'varchar(30)' },
  ]

  const rows = Array.from({ length: 200 }, (_, i) => {
    const totalOrders = faker.number.int({ min: 0, max: 200 })
    const avgOrderValue = Number(faker.number.float({ min: 15, max: 500, fractionDigits: 2 }))
    const totalSpent = Number((totalOrders * avgOrderValue).toFixed(2))

    return {
      userId: i + 1,
      email: faker.internet.email().toLowerCase(),
      displayName: faker.person.fullName(),
      role: roles[i % roles.length]!,
      team: teams[i % teams.length]!,
      lastLogin: faker.date.recent({ days: 30 }).toISOString(),
      signupDate: faker.date.past({ years: 3 }).toISOString(),
      totalOrders,
      totalSpent,
      avgOrderValue,
      lastOrderDate: faker.date.recent({ days: 60 }).toISOString(),
      preferredPayment: payments[i % payments.length]!,
      loyaltyTier: tiers[Math.min(Math.floor(totalOrders / 50), 3)]!,
      referralCount: faker.number.int({ min: 0, max: 25 }),
      accountStatus: statuses[i % statuses.length]!,
    }
  })

  return {
    query: 'SELECT * FROM users JOIN order_stats ON users.id = order_stats.user_id ORDER BY total_spent DESC LIMIT 200',
    executionTime: faker.number.float({ min: 12, max: 250, fractionDigits: 1 }),
    rowCount: 200,
    columns,
    rows,
  }
}

/**
 * Generate file tree with diagnostics (80 files)
 */
function generateFileTreeDiagnostics() {
  const languages = ['typescript', 'javascript', 'css', 'json', 'markdown', 'html'] as const
  const severities = ['error', 'warning', 'information', 'hint'] as const
  const diagnosticSources = ['ts', 'eslint', 'prettier', 'stylelint'] as const
  const directories = [
    'src/components', 'src/hooks', 'src/utils', 'src/api', 'src/store',
    'src/types', 'src/pages', 'tests/unit', 'tests/integration', 'lib',
  ] as const

  const diagnosticMessages = [
    'Type \'{0}\' is not assignable to type \'{1}\'',
    'Property \'{0}\' does not exist on type \'{1}\'',
    'Unused variable \'{0}\'',
    'Missing return type on function',
    'Unexpected any. Specify a different type',
    'Prefer const over let when variable is never reassigned',
    'Import \'{0}\' is declared but never used',
    'Expected indentation of 2 spaces but found 4',
    'Missing semicolon',
    'Function has too many parameters (5). Maximum allowed is 4',
  ] as const

  let totalDiagnostics = 0
  const files = Array.from({ length: 80 }, (_, i) => {
    const dir = directories[i % directories.length]!
    const lang = languages[i % languages.length]!
    const ext = lang === 'typescript' ? '.ts' : lang === 'javascript' ? '.js' : lang === 'css' ? '.css' : lang === 'json' ? '.json' : lang === 'markdown' ? '.md' : '.html'
    const hasDiagnostics = faker.datatype.boolean(0.4)
    const diagCount = hasDiagnostics ? faker.number.int({ min: 1, max: 5 }) : 0
    totalDiagnostics += diagCount

    const diagnostics = Array.from({ length: diagCount }, () => ({
      line: faker.number.int({ min: 1, max: 300 }),
      column: faker.number.int({ min: 1, max: 80 }),
      severity: faker.helpers.arrayElement(severities),
      code: faker.helpers.arrayElement(['TS2322', 'TS2339', 'TS6133', 'no-unused-vars', 'prefer-const', 'semi', 'indent']),
      message: faker.helpers.arrayElement(diagnosticMessages).replace('{0}', faker.lorem.word()).replace('{1}', faker.lorem.word()),
      source: faker.helpers.arrayElement(diagnosticSources),
    }))

    return {
      path: `${dir}/${faker.lorem.word({ length: { min: 4, max: 14 } })}${ext}`,
      language: lang,
      size: faker.number.int({ min: 200, max: 50000 }),
      lastModified: faker.date.recent({ days: 14 }).toISOString(),
      diagnostics,
    }
  })

  return {
    workspace: '/home/user/projects/acme-dashboard',
    totalFiles: 80,
    totalDiagnostics,
    files,
  }
}

/**
 * Generate multi-tool agent composite (5 tool calls with varied results)
 */
function generateMultiToolAgent() {
  const symbolKinds = ['function', 'class', 'method', 'interface', 'variable'] as const

  // Tool 1: find_symbol (20 symbols)
  const findSymbolResult = {
    symbols: Array.from({ length: 20 }, () => ({
      name: faker.helpers.arrayElement(['handle', 'create', 'validate', 'process', 'parse']) + faker.lorem.word({ length: { min: 4, max: 10 } }).replace(/^\w/, c => c.toUpperCase()),
      kind: faker.helpers.arrayElement(symbolKinds),
      file: `src/${faker.lorem.word()}/${faker.lorem.word()}.ts`,
      line: faker.number.int({ min: 1, max: 400 }),
      score: Number(faker.number.float({ min: 0.3, max: 1.0, fractionDigits: 3 })),
    })),
  }

  // Tool 2: get_diagnostics (10 files)
  const getDiagnosticsResult = {
    files: Array.from({ length: 10 }, () => ({
      path: `src/${faker.lorem.word()}/${faker.lorem.word()}.ts`,
      diagnostics: Array.from({ length: faker.number.int({ min: 1, max: 4 }) }, () => ({
        line: faker.number.int({ min: 1, max: 200 }),
        severity: faker.helpers.arrayElement(['error', 'warning', 'information']),
        message: faker.helpers.arrayElement([
          'Type mismatch: expected string, got number',
          'Property does not exist on type',
          'Unused import declaration',
          'Missing return statement',
          'Cannot find name',
        ]),
      })),
    })),
  }

  // Tool 3: read_file (50 lines of code)
  const codeLines = Array.from({ length: 50 }, (_, i) => {
    if (i === 0) return `import { ${faker.lorem.word()} } from './${faker.lorem.word()}'`
    if (i === 2) return `export function ${faker.lorem.word()}(${faker.lorem.word()}: string): void {`
    if (i % 5 === 0) return `  const ${faker.lorem.word()} = ${faker.helpers.arrayElement(['await', ''])} ${faker.lorem.word()}()`
    if (i % 7 === 0) return `  if (${faker.lorem.word()}) {`
    if (i % 7 === 1 && i > 7) return '  }'
    return `  ${faker.lorem.word()}.${faker.lorem.word()}(${faker.lorem.word()})`
  }).join('\n')

  const readFileResult = {
    content: codeLines,
    language: 'typescript',
    lines: 50,
  }

  // Tool 4: git_log (15 commits)
  const gitLogResult = {
    commits: Array.from({ length: 15 }, () => ({
      hash: faker.git.commitSha(),
      author: faker.person.fullName(),
      date: faker.date.recent({ days: 14 }).toISOString(),
      message: faker.git.commitMessage(),
      filesChanged: faker.number.int({ min: 1, max: 12 }),
    })),
  }

  // Tool 5: web_search (10 results)
  const webSearchResult = {
    results: Array.from({ length: 10 }, () => ({
      title: faker.lorem.sentence({ min: 4, max: 8 }),
      url: faker.internet.url(),
      snippet: faker.lorem.paragraph({ min: 1, max: 2 }),
      relevance: Number(faker.number.float({ min: 0.4, max: 1.0, fractionDigits: 3 })),
    })),
  }

  const toolCalls = [
    {
      toolName: 'find_symbol',
      callId: faker.string.uuid(),
      duration: faker.number.int({ min: 50, max: 300 }),
      status: 'success',
      result: findSymbolResult,
    },
    {
      toolName: 'get_diagnostics',
      callId: faker.string.uuid(),
      duration: faker.number.int({ min: 100, max: 500 }),
      status: 'success',
      result: getDiagnosticsResult,
    },
    {
      toolName: 'read_file',
      callId: faker.string.uuid(),
      duration: faker.number.int({ min: 10, max: 50 }),
      status: 'success',
      result: readFileResult,
    },
    {
      toolName: 'git_log',
      callId: faker.string.uuid(),
      duration: faker.number.int({ min: 80, max: 400 }),
      status: 'success',
      result: gitLogResult,
    },
    {
      toolName: 'web_search',
      callId: faker.string.uuid(),
      duration: faker.number.int({ min: 200, max: 1500 }),
      status: 'success',
      result: webSearchResult,
    },
  ]

  return {
    sessionId: faker.string.uuid(),
    timestamp: faker.date.recent({ days: 1 }).toISOString(),
    toolCalls,
    context: {
      currentFile: 'src/auth/middleware.ts',
      recentFiles: Array.from({ length: 5 }, () => `src/${faker.lorem.word()}/${faker.lorem.word()}.ts`),
      activeSymbol: 'AuthMiddleware.validateToken',
      gitBranch: `feature/${faker.lorem.slug(3)}`,
    },
  }
}

/**
 * Generate order history with shared item schema (100 orders)
 *
 * @remarks
 * Tests GCF's shared array schema optimization: every order's items array
 * has the identical {sku, name, qty, price} schema, declared once.
 */
function generateOrderHistorySharedSchema() {
  const orderStatuses = ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled', 'refunded'] as const

  const orders = Array.from({ length: 100 }, (_, i) => {
    const itemCount = faker.number.int({ min: 3, max: 5 })
    const items = Array.from({ length: itemCount }, () => ({
      sku: `SKU-${faker.string.alphanumeric({ length: 8, casing: 'upper' })}`,
      name: faker.commerce.productName(),
      qty: faker.number.int({ min: 1, max: 10 }),
      price: Number(faker.commerce.price({ min: 5, max: 200 })),
    }))

    const subtotal = Number(items.reduce((sum, item) => sum + item.price * item.qty, 0).toFixed(2))
    const tax = Number((subtotal * 0.085).toFixed(2))
    const total = Number((subtotal + tax).toFixed(2))

    return {
      orderId: `ORD-${String(i + 1).padStart(5, '0')}`,
      customerId: `CUST-${faker.string.alphanumeric({ length: 6, casing: 'upper' })}`,
      date: faker.date.past({ years: 2 }).toISOString(),
      status: orderStatuses[i % orderStatuses.length]!,
      subtotal,
      tax,
      total,
      items,
    }
  })

  return {
    accountId: faker.string.uuid(),
    orders,
  }
}

/**
 * Generate blast radius response (50 symbols with callers)
 *
 * @remarks
 * Tests shared array schema on code intelligence data: every symbol's callers
 * array has the identical {file, line, kind, qualifiedName} schema.
 */
function generateBlastRadiusResponse() {
  const symbolKinds = ['function', 'class', 'method', 'interface', 'type', 'variable'] as const
  const callerKinds = ['function', 'method', 'class', 'test'] as const
  const packages = ['controllers', 'services', 'models', 'handlers', 'middleware', 'utils', 'validators', 'routes'] as const

  let totalCallers = 0
  const symbols = Array.from({ length: 50 }, (_, i) => {
    const pkg = packages[i % packages.length]!
    const kind = symbolKinds[i % symbolKinds.length]!
    const name = faker.helpers.arrayElement(['get', 'set', 'create', 'update', 'delete', 'validate', 'handle', 'process']) + faker.lorem.word({ length: { min: 4, max: 10 } }).replace(/^\w/, c => c.toUpperCase())
    const callerCount = faker.number.int({ min: 3, max: 8 })
    totalCallers += callerCount

    const callers = Array.from({ length: callerCount }, () => {
      const callerPkg = faker.helpers.arrayElement(packages)
      const callerName = faker.helpers.arrayElement(['handle', 'process', 'test', 'validate', 'run']) + faker.lorem.word({ length: { min: 4, max: 10 } }).replace(/^\w/, c => c.toUpperCase())
      return {
        file: `src/${callerPkg}/${faker.lorem.word({ length: { min: 4, max: 12 } })}.ts`,
        line: faker.number.int({ min: 1, max: 500 }),
        kind: faker.helpers.arrayElement(callerKinds),
        qualifiedName: `pkg.${callerPkg}.${callerName}`,
      }
    })

    return {
      id: i + 1,
      qualifiedName: `pkg.${pkg}.${name}`,
      kind,
      file: `src/${pkg}/${faker.lorem.word({ length: { min: 4, max: 12 } })}.ts`,
      line: faker.number.int({ min: 1, max: 500 }),
      exported: faker.datatype.boolean(0.8),
      score: Number(faker.number.float({ min: 0.1, max: 1.0, fractionDigits: 3 })),
      callers,
    }
  })

  return {
    changedFile: 'src/services/auth-handler.ts',
    totalSymbols: 50,
    totalCallers,
    symbols,
  }
}

/**
 * Datasets for token efficiency benchmarks (larger sizes to amplify token differences)
 */
export const TOKEN_EFFICIENCY_DATASETS: Dataset[] = [
  // Tabular: 2000 employees
  {
    name: 'tabular',
    description: 'Uniform employee records',
    data: generateEmployees(2000),
    metadata: {
      supportsCSV: true,
      structureClass: 'uniform',
      tabularEligibility: 100, // All arrays contain uniform objects with primitive values only
    },
  },
  // Nested: 500 orders
  {
    name: 'nested',
    description: 'E-commerce orders with nested structures',
    data: generateOrders(500),
    metadata: {
      supportsCSV: false,
      structureClass: 'nested',
      tabularEligibility: 33, // Top-level orders array has nested objects (not tabular), but nested items arrays are tabular
    },
  },
  // Analytics: 365 days
  {
    name: 'analytics',
    description: 'Time-series analytics data',
    data: generateAnalyticsData(365),
    metadata: {
      supportsCSV: true,
      structureClass: 'uniform',
      tabularEligibility: 100, // Uniform time-series records with consistent primitive fields
    },
  },
  // GitHub: 100 repos (same as accuracy)
  githubDataset,
  // Event logs: 2000 logs
  {
    name: 'event-logs',
    description: 'Semi-uniform event logs',
    data: generateEventLogs(2000),
    metadata: {
      supportsCSV: false,
      structureClass: 'semi-uniform',
      tabularEligibility: 50, // Top-level logs array is tabular, but ~50% have nested optional error objects
    },
  },
  // Nested config: 1 config (same as accuracy)
  nestedConfigDataset,
  // Dataset 7: LSP Symbol Search Results
  {
    name: 'lsp-symbol-search',
    description: 'LSP workspace symbol search results',
    data: generateLspSymbolSearch(),
    metadata: {
      supportsCSV: true,
      structureClass: 'uniform',
      tabularEligibility: 95,
    },
  },
  // Dataset 8: PR File Changes
  {
    name: 'pr-file-changes',
    description: 'Pull request file change summary',
    data: generatePrFileChanges(),
    metadata: {
      supportsCSV: false,
      structureClass: 'nested',
      tabularEligibility: 80,
    },
  },
  // Dataset 9: Distributed Trace (API Error)
  {
    name: 'distributed-trace',
    description: 'Distributed trace spans for an API error',
    data: generateDistributedTrace(),
    metadata: {
      supportsCSV: false,
      structureClass: 'nested',
      tabularEligibility: 40,
    },
  },
  // Dataset 10: Database Query Results (Wide Table)
  {
    name: 'database-query-results',
    description: 'Wide-table database query results with 15 columns',
    data: generateDatabaseQueryResults(),
    metadata: {
      supportsCSV: true,
      structureClass: 'uniform',
      tabularEligibility: 97,
    },
  },
  // Dataset 11: File Tree with Diagnostics
  {
    name: 'file-tree-diagnostics',
    description: 'Project file tree with LSP diagnostics',
    data: generateFileTreeDiagnostics(),
    metadata: {
      supportsCSV: false,
      structureClass: 'semi-uniform',
      tabularEligibility: 55,
    },
  },
  // Dataset 12: Multi-Tool Agent Composite
  {
    name: 'multi-tool-agent',
    description: 'Multi-tool agent session with heterogeneous results',
    data: generateMultiToolAgent(),
    metadata: {
      supportsCSV: false,
      structureClass: 'deep',
      tabularEligibility: 45,
    },
  },
  // Dataset 13: Order History with Shared Item Schema
  {
    name: 'order-history-shared-schema',
    description: 'Order history testing shared array schema optimization',
    data: generateOrderHistorySharedSchema(),
    metadata: {
      supportsCSV: false,
      structureClass: 'nested',
      tabularEligibility: 70,
    },
  },
  // Dataset 14: Blast Radius Response
  {
    name: 'blast-radius-response',
    description: 'Blast radius response testing shared caller schema',
    data: generateBlastRadiusResponse(),
    metadata: {
      supportsCSV: false,
      structureClass: 'nested',
      tabularEligibility: 65,
    },
  },
  // Dataset 15: Comprehension Eval Payload (exact fixture used in LLM eval)
  {
    name: 'comprehension-eval-payload',
    description: 'Exact 500-order payload from comprehension eval (same data models are tested on)',
    data: comprehensionEvalPayload,
    metadata: {
      supportsCSV: false,
      structureClass: 'nested',
      tabularEligibility: 70,
    },
  },
]
