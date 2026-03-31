import { appendFile, mkdir } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const workspaceRoot = path.resolve(path.resolve(__dirname, '..'), '..')
const logDir = path.join(workspaceRoot, 'night-watch', 'logs')
const logPath = path.join(logDir, 'publish-status.jsonl')

const [status = 'unknown', detail = ''] = process.argv.slice(2)

const entry = {
  ts: new Date().toISOString(),
  status,
  detail,
}

await mkdir(logDir, { recursive: true })
await appendFile(logPath, `${JSON.stringify(entry)}\n`, 'utf8')
console.log(`Logged publish status: ${status}`)
