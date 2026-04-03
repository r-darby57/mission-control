import { readFile, readdir } from 'node:fs/promises'
import path from 'node:path'
import { NextResponse } from 'next/server'

const workspaceRoot = path.resolve(process.cwd(), '..')
const memoryDir = path.join(workspaceRoot, 'memory')
const projectsDir = path.join(memoryDir, 'projects')

type MemoryEntryType = 'conversation' | 'decision' | 'insight' | 'task' | 'briefing'
type MemoryEntryImportance = 'low' | 'medium' | 'high' | 'critical'
type MemoryScope = 'long-term' | 'daily' | 'open-loops' | 'decisions' | 'projects'

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

  return Array.from(new Set(raw.filter((word) => !['daily', 'log', 'system', 'events', 'notes', 'actions', 'taken', 'open', 'loops', 'update'].includes(word)))).slice(0, 8)
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

async function readJson(relativePath: string) {
  try {
    const fullPath = path.join(workspaceRoot, relativePath)
    return JSON.parse(await readFile(fullPath, 'utf8'))
  } catch {
    return null
  }
}

async function readMarkdownMemoryEntries() {
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
        const sourceFile = `memory/${fileName}`
        const timestamp = `${fileDate}T12:${String(idx).padStart(2, '0')}:00Z`
        const inferredType = inferType(section.title, section.content)
        const scope: MemoryScope = inferredType === 'decision' ? 'decisions' : 'daily'

        entries.push({
          id: `${fileName}-${idx}`,
          type: inferredType,
          title: section.title,
          content: section.content,
          timestamp,
          tags: buildTags(section.title, section.content, fileName),
          agent: 'RJ',
          importance: inferImportance(section.title, section.content),
          searchable: `${section.title} ${section.content} ${fileName}`.toLowerCase(),
          sourceFile,
          scope,
        })
      })
    }
  } catch {
    return []
  }

  return entries
}

async function readLongTermMemoryEntry() {
  const memoryMdPath = path.join(workspaceRoot, 'MEMORY.md')
  try {
    const raw = await readFile(memoryMdPath, 'utf8')
    return [{
      id: 'memory-md-overview',
      type: 'briefing' as MemoryEntryType,
      title: 'Long-term memory overview',
      content: raw,
      timestamp: new Date().toISOString(),
      tags: ['memory', 'long-term', 'profile', 'identity'],
      agent: 'RJ',
      importance: 'critical' as MemoryEntryImportance,
      searchable: raw.toLowerCase(),
      sourceFile: 'MEMORY.md',
      scope: 'long-term' as MemoryScope,
    }]
  } catch {
    return []
  }
}

async function readOpenLoopEntries() {
  const raw = await readJson(path.join('memory', 'open-loops.json'))
  try {
    const items = Array.isArray(raw?.items) ? raw.items : []
    return items.map((item: any, idx: number) => ({
      id: item.id || `open-loop-${idx}`,
      type: 'task' as MemoryEntryType,
      title: item.title || `Open loop ${idx + 1}`,
      content: `${item.summary || ''}\n\nNext action: ${item.nextAction || 'No next action recorded.'}`.trim(),
      timestamp: item.lastUpdated || raw.updatedAt || new Date().toISOString(),
      tags: [item.area, item.priority, item.status].filter(Boolean),
      agent: item.owner || 'RJ',
      importance: item.priority === 'high' ? 'critical' : 'high',
      searchable: `${item.title || ''} ${item.summary || ''} ${item.nextAction || ''}`.toLowerCase(),
      sourceFile: 'memory/open-loops.json',
      scope: 'open-loops' as MemoryScope,
      status: item.status || 'unknown',
      nextAction: item.nextAction || null,
    }))
  } catch {
    return []
  }
}

async function readDecisionEntries() {
  const raw = await readJson(path.join('memory', 'decisions.json'))
  const items = Array.isArray(raw?.items) ? raw.items : []

  return items.map((item: any) => ({
    id: item.id,
    type: 'decision' as MemoryEntryType,
    title: item.decision,
    content: `Reasoning: ${item.reasoning || 'No reasoning recorded.'}`,
    timestamp: item.date ? `${item.date}T12:00:00Z` : raw?.updatedAt || new Date().toISOString(),
    tags: ['decision', item.status].filter(Boolean),
    agent: 'RJ',
    importance: 'high' as MemoryEntryImportance,
    searchable: `${item.decision || ''} ${item.reasoning || ''}`.toLowerCase(),
    sourceFile: 'memory/decisions.json',
    scope: 'decisions' as MemoryScope,
  }))
}

async function readProjectEntries() {
  try {
    const files = (await readdir(projectsDir)).filter((file) => file.endsWith('.md')).sort()
    const entries: any[] = []

    for (const fileName of files) {
      const raw = await readFile(path.join(projectsDir, fileName), 'utf8')
      entries.push({
        id: `project-${fileName}`,
        type: 'briefing' as MemoryEntryType,
        title: raw.split('\n')[0]?.replace(/^#\s*/, '').trim() || fileName.replace('.md', ''),
        content: raw,
        timestamp: new Date().toISOString(),
        tags: buildTags(fileName, raw, fileName),
        agent: 'RJ',
        importance: 'high' as MemoryEntryImportance,
        searchable: `${fileName} ${raw}`.toLowerCase(),
        sourceFile: `memory/projects/${fileName}`,
        scope: 'projects' as MemoryScope,
      })
    }

    return entries
  } catch {
    return []
  }
}

async function readMemoryEntries() {
  const [markdownEntries, longTermEntries, openLoopEntries, decisionEntries, projectEntries] = await Promise.all([
    readMarkdownMemoryEntries(),
    readLongTermMemoryEntry(),
    readOpenLoopEntries(),
    readDecisionEntries(),
    readProjectEntries(),
  ])

  return [...openLoopEntries, ...decisionEntries, ...projectEntries, ...longTermEntries, ...markdownEntries]
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
}

async function buildProfile(entries: any[]) {
  const profile = await readJson(path.join('memory', 'profile.json'))

  const staticProfile = profile ? [
    `Assistant: ${profile.identity?.assistantName || 'RJ'} — ${profile.identity?.role || 'operator'}`,
    `User: ${profile.user?.name || 'Ryan Darby'} — ${profile.user?.career || 'unknown'}`,
    `Operating model: ${profile.user?.preferences?.operatingModel || 'unknown'}`,
    `Primary model: ${profile.system?.primaryModel || 'unknown'}`,
    ...(profile.user?.focus || []).slice(0, 4).map((item: string) => `Focus: ${item}`),
  ] : []

  const recent = entries.filter((entry) => entry.scope !== 'long-term').slice(0, 6).map((entry) => `${entry.title}: ${entry.content.split('\n')[0]?.slice(0, 140) || ''}`)
  const openLoops = entries.filter((entry) => entry.scope === 'open-loops').slice(0, 4).map((entry) => entry.title)
  const projectThreads = entries.filter((entry) => entry.scope === 'projects').slice(0, 6).map((entry) => entry.title)

  return {
    static: staticProfile,
    dynamic: recent,
    openLoops,
    projects: projectThreads,
    summary: 'Canonical-first local memory profile synthesized from profile.json, decisions.json, project files, and recent logs.',
  }
}

function buildIndex(entries: any[]) {
  const scopes = ['long-term', 'daily', 'open-loops', 'decisions', 'projects'].map((scope) => ({
    scope,
    count: entries.filter((entry) => entry.scope === scope).length,
  }))

  const tagCounts = entries.reduce<Map<string, number>>((acc, entry) => {
    for (const tag of entry.tags || []) {
      acc.set(tag, (acc.get(tag) || 0) + 1)
    }
    return acc
  }, new Map<string, number>())

  return {
    scopes,
    recentTitles: entries.slice(0, 10).map((entry) => ({
      title: entry.title,
      scope: entry.scope,
      timestamp: entry.timestamp,
    })),
    topTags: Array.from(tagCounts.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 12)
      .map(([tag, count]) => ({ tag, count })),
  }
}

export async function GET() {
  const entries = await readMemoryEntries()
  const profile = await buildProfile(entries)
  const index = buildIndex(entries)

  return NextResponse.json({
    items: entries,
    profile,
    index,
    meta: {
      source: 'canonical-memory-first',
      total: entries.length,
      generatedAt: new Date().toISOString(),
    },
  })
}
