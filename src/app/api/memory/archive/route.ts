import { readFile, readdir } from 'node:fs/promises'
import path from 'node:path'
import { NextResponse } from 'next/server'

const workspaceRoot = path.resolve(process.cwd(), '..')
const memoryDir = path.join(workspaceRoot, 'memory')

type MemoryEntryType = 'conversation' | 'decision' | 'insight' | 'task' | 'briefing'
type MemoryEntryImportance = 'low' | 'medium' | 'high' | 'critical'

function inferType(title: string, content: string): MemoryEntryType {
  const text = `${title} ${content}`.toLowerCase()
  if (text.includes('decision')) return 'decision'
  if (text.includes('open loop') || text.includes('next step') || text.includes('next action') || text.includes('todo')) return 'task'
  if (text.includes('brief') || text.includes('report') || text.includes('status')) return 'briefing'
  if (text.includes('insight') || text.includes('lesson') || text.includes('learned')) return 'insight'
  return 'conversation'
}

function inferImportance(title: string, content: string): MemoryEntryImportance {
  const text = `${title} ${content}`.toLowerCase()
  if (text.includes('critical') || text.includes('blocked') || text.includes('deployed') || text.includes('production')) return 'critical'
  if (text.includes('top recommendation') || text.includes('priority') || text.includes('important') || text.includes('decision')) return 'high'
  if (text.includes('note') || text.includes('summary') || text.includes('update')) return 'medium'
  return 'low'
}

function buildTags(title: string, content: string, fileName: string) {
  const raw = `${title} ${content} ${fileName}`
    .toLowerCase()
    .match(/[a-z0-9-]{4,}/g) || []

  return Array.from(new Set(raw.filter((word) => !['daily', 'log', 'system', 'events', 'notes', 'actions', 'taken', 'open', 'loops', 'update'].includes(word)))).slice(0, 6)
}

function splitSections(fileContent: string) {
  const sections = fileContent.split(/^##\s+/m).map((part) => part.trim()).filter(Boolean)
  return sections.map((section, index) => {
    const lines = section.split('\n')
    const title = index === 0 && !section.startsWith('#') ? 'Overview' : lines[0].trim()
    const content = (index === 0 && !section.startsWith('#') ? lines.join('\n') : lines.slice(1).join('\n')).trim()
    return { title, content }
  }).filter((section) => section.content)
}

async function readMemoryEntries() {
  const entries: any[] = []

  try {
    const memoryFiles = await readdir(memoryDir)
    const canonicalFiles = memoryFiles.filter((file) => /^\d{4}-\d{2}-\d{2}\.md$/.test(file)).sort().reverse().slice(0, 10)

    for (const fileName of canonicalFiles) {
      const fullPath = path.join(memoryDir, fileName)
      const raw = await readFile(fullPath, 'utf8')
      const sections = splitSections(raw)
      const fileDate = fileName.replace('.md', '')

      sections.forEach((section, idx) => {
        const timestamp = `${fileDate}T12:${String(idx).padStart(2, '0')}:00Z`
        entries.push({
          id: `${fileName}-${idx}`,
          type: inferType(section.title, section.content),
          title: section.title,
          content: section.content,
          timestamp,
          tags: buildTags(section.title, section.content, fileName),
          agent: 'RJ',
          importance: inferImportance(section.title, section.content),
          searchable: `${section.title} ${section.content} ${fileName}`.toLowerCase(),
          sourceFile: `memory/${fileName}`,
        })
      })
    }
  } catch {
    return []
  }

  return entries.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
}

async function buildProfile(entries: any[]) {
  const memoryMdPath = path.join(workspaceRoot, 'MEMORY.md')
  let longTerm = ''
  try {
    longTerm = await readFile(memoryMdPath, 'utf8')
  } catch {}

  const staticProfile = [
    ...Array.from(longTerm.matchAll(/- \*\*(.+?)\*\*: (.+)/g)).slice(0, 6).map((match) => `${match[1]}: ${match[2]}`),
  ]

  const recent = entries.slice(0, 5).map((entry) => `${entry.title}: ${entry.content.split('\n')[0]?.slice(0, 140) || ''}`)

  return {
    static: staticProfile,
    dynamic: recent,
    summary: 'Local bounded memory profile synthesized from MEMORY.md and recent daily logs.',
  }
}

export async function GET() {
  const entries = await readMemoryEntries()
  const profile = await buildProfile(entries)

  return NextResponse.json({
    items: entries,
    profile,
    meta: {
      source: 'workspace-memory-files',
      total: entries.length,
      generatedAt: new Date().toISOString(),
    },
  })
}
