import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'

const postsDir = path.join(process.cwd(), 'content/blog')

export interface PostMeta {
  slug: string
  title: string
  excerpt: string
  category: string
  date: string
  published: boolean
  featured_image: string | null
  read_time: number
}

export interface Post extends PostMeta {
  body: string
}

function estimateReadTime(body: string): number {
  const words = body.trim().split(/\s+/).length
  return Math.max(1, Math.ceil(words / 200))
}

export function getAllPosts(): PostMeta[] {
  if (!fs.existsSync(postsDir)) return []

  const files = fs.readdirSync(postsDir).filter((f) => f.endsWith('.md'))

  return files
    .map((filename) => {
      const slug = filename.replace(/\.md$/, '')
      const raw = fs.readFileSync(path.join(postsDir, filename), 'utf-8')
      const { data, content } = matter(raw)

      return {
        slug,
        title: data.title ?? '',
        excerpt: data.excerpt ?? '',
        category: data.category ?? 'The Inner Work',
        date: data.date ?? '',
        published: data.published ?? false,
        featured_image: data.featured_image ?? null,
        read_time: estimateReadTime(content),
      } as PostMeta
    })
    .filter((p) => p.published)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
}

export function getPost(slug: string): Post | null {
  const filePath = path.join(postsDir, `${slug}.md`)
  if (!fs.existsSync(filePath)) return null

  const raw = fs.readFileSync(filePath, 'utf-8')
  const { data, content } = matter(raw)

  return {
    slug,
    title: data.title ?? '',
    excerpt: data.excerpt ?? '',
    category: data.category ?? 'The Inner Work',
    date: data.date ?? '',
    published: data.published ?? false,
    featured_image: data.featured_image ?? null,
    read_time: estimateReadTime(content),
    body: content,
  }
}
