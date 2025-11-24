#!/usr/bin/env node
// Runtime schema application without drizzle-kit
const { Client } = require('pg')

async function apply() {
  const connectionString = process.env.POSTGRES_URL
  if (!connectionString) {
    console.error('POSTGRES_URL not set')
    process.exit(1)
  }
  const client = new Client({ connectionString })
  await client.connect()
  // Simple idempotent table creation matching drizzle schema
  const sql = `CREATE TABLE IF NOT EXISTS redirects (
    id varchar PRIMARY KEY,
    slug varchar UNIQUE NOT NULL,
    url varchar NOT NULL
  );`
  await client.query(sql)
  await client.end()
  console.log('Schema ensured (redirects table)')
}

apply().catch(err => {
  console.error('Schema application failed', err)
  process.exit(1)
})
