import MiniSearch from 'minisearch'
import GithubSlugger from 'github-slugger'
import { unified } from 'unified'
import remarkParse from 'remark-parse'
import { toString as mdastToString } from 'mdast-util-to-string'
import { navigation } from '../../docs/data/navigation'

// Load all raw markdown docs via Vite glob map (supports subfolders)
const rawDocs = import.meta.glob('../../docs/content/**/*.md', {
  query: '?raw',
  import: 'default',
  eager: true,
})

function customTokenizer(text) {
  if (!text) return []
  const str = String(text).toLowerCase()
  const tokens = new Set()

  const words = str.split(/[^a-z0-9]+/i).filter(Boolean)
  for (const word of words) {
    tokens.add(word)
    // Split camelCase or snake_case
    const subWords = word
      .replace(/([a-z0-9])([A-Z])/g, '$1 $2')
      .split(/[^a-z0-9]+/i)
      .filter(Boolean)
    for (const sub of subWords) {
      tokens.add(sub.toLowerCase())
    }
  }
  return Array.from(tokens)
}

let miniSearchInstance = null

export function buildSearchIndex() {
  if (miniSearchInstance) return miniSearchInstance

  const miniSearch = new MiniSearch({
    fields: ['title', 'keywords', 'heading', 'text', 'code'],
    storeFields: ['id', 'type', 'slug', 'pageTitle', 'group', 'heading', 'anchor', 'text', 'code'],
    tokenize: customTokenizer,
    processTerm: (term) => term.toLowerCase(),
    searchOptions: {
      boost: { title: 4, keywords: 3, heading: 2.5, text: 1, code: 0.5 },
      prefix: true,
      fuzzy: 0.2,
      combineWith: 'AND',
    },
  })

  const records = []

  // Create lookup map of active navigation items
  const navMap = new Map()
  navigation.forEach((group) => {
    group.items.forEach((item) => {
      if (!item.disabled) {
        navMap.set(item.slug, { ...item, group: group.group })
      }
    })
  })

  const processor = unified().use(remarkParse)

  for (const [pathKey, rawContent] of Object.entries(rawDocs)) {
    const slug = pathKey.replace(/^.*[\\/]/, '').replace(/\.md$/, '')
    const navItem = navMap.get(slug)
    if (!navItem) continue // Skip unmapped or disabled pages

    const slugger = new GithubSlugger()
    const tree = processor.parse(rawContent)

    let pageIntro = ''
    let currentSection = null
    const sections = []

    for (const node of tree.children) {
      if (node.type === 'heading' && (node.depth === 2 || node.depth === 3)) {
        if (currentSection) {
          sections.push(currentSection)
        }

        const headingText = mdastToString(node).trim()
        const anchor = slugger.slug(headingText)

        currentSection = {
          id: `section:${slug}:${anchor}`,
          type: 'section',
          slug,
          pageTitle: navItem.title,
          group: navItem.group,
          heading: headingText,
          anchor,
          text: '',
          code: '',
        }
      } else {
        const textContent = mdastToString(node).trim()
        if (!currentSection) {
          if (node.type !== 'heading' && textContent) {
            pageIntro += (pageIntro ? ' ' : '') + textContent
          }
        } else {
          if (node.type === 'code') {
            currentSection.code += (currentSection.code ? ' ' : '') + node.value
          } else if (textContent) {
            currentSection.text += (currentSection.text ? ' ' : '') + textContent
          }
        }
      }
    }

    if (currentSection) {
      sections.push(currentSection)
    }

    // Page level record
    records.push({
      id: `page:${slug}`,
      type: 'page',
      slug,
      title: navItem.title,
      pageTitle: navItem.title,
      group: navItem.group,
      keywords: (navItem.keywords || []).join(' '),
      heading: navItem.title,
      anchor: '',
      text: pageIntro,
      code: '',
    })

    // Section records
    records.push(...sections)
  }

  miniSearch.addAll(records)
  miniSearchInstance = miniSearch
  return miniSearch
}

export function searchDocs(query) {
  if (!query || !query.trim()) return []

  const index = buildSearchIndex()

  let rawResults = index.search(query.trim(), {
    combineWith: 'AND',
    prefix: true,
    fuzzy: 0.2,
    boost: { title: 4, keywords: 3, heading: 2.5, text: 1, code: 0.5 },
  })

  // Fallback to OR if AND returns 0 matches
  if (rawResults.length === 0) {
    rawResults = index.search(query.trim(), {
      combineWith: 'OR',
      prefix: true,
      fuzzy: 0.2,
      boost: { title: 4, keywords: 3, heading: 2.5, text: 1, code: 0.5 },
    })
  }

  // Group by page slug (max 8 pages, max 3 sections per page)
  const pageGroups = new Map()

  for (const item of rawResults) {
    const slug = item.slug
    if (!pageGroups.has(slug)) {
      pageGroups.set(slug, {
        slug,
        group: item.group,
        pageTitle: item.pageTitle,
        pageRecord: null,
        sections: [],
      })
    }

    const groupObj = pageGroups.get(slug)

    if (item.type === 'page') {
      if (!groupObj.pageRecord) {
        groupObj.pageRecord = item
      }
    } else if (item.type === 'section') {
      if (groupObj.sections.length < 3) {
        groupObj.sections.push(item)
      }
    }
  }

  const formattedResults = []
  let pageCount = 0

  for (const groupObj of pageGroups.values()) {
    if (pageCount >= 8) break
    pageCount++

    if (groupObj.pageRecord) {
      formattedResults.push(groupObj.pageRecord)
    }

    for (const sec of groupObj.sections) {
      formattedResults.push(sec)
    }
  }

  return formattedResults
}

// Extract snippet and safe highlight chunks
export function getHighlightedChunks(text, query, maxLen = 120) {
  if (!text) return [{ text: '', isMatch: false }]
  if (!query || !query.trim()) {
    return [{ text: text.slice(0, maxLen), isMatch: false }]
  }

  const queryTerms = query
    .trim()
    .toLowerCase()
    .split(/[^a-z0-9]+/i)
    .filter(Boolean)

  if (queryTerms.length === 0) {
    return [{ text: text.slice(0, maxLen), isMatch: false }]
  }

  const lowerText = text.toLowerCase()
  let matchIndex = -1

  for (const term of queryTerms) {
    const idx = lowerText.indexOf(term)
    if (idx !== -1 && (matchIndex === -1 || idx < matchIndex)) {
      matchIndex = idx
    }
  }

  let start = 0
  let end = text.length

  if (matchIndex !== -1 && text.length > maxLen) {
    start = Math.max(0, matchIndex - 30)
    end = Math.min(text.length, start + maxLen)
    if (end - start < maxLen && start > 0) {
      start = Math.max(0, end - maxLen)
    }
  } else if (text.length > maxLen) {
    end = maxLen
  }

  let snippet = text.slice(start, end)
  if (start > 0) snippet = '...' + snippet
  if (end < text.length) snippet = snippet + '...'

  const pattern = new RegExp(`(${queryTerms.map(escapeRegExp).join('|')})`, 'gi')
  const parts = snippet.split(pattern)

  return parts.filter(Boolean).map((part) => ({
    text: part,
    isMatch: queryTerms.some((t) => part.toLowerCase() === t.toLowerCase()),
  }))
}

function escapeRegExp(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}
