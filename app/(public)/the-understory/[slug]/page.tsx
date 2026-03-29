import { notFound } from 'next/navigation'
import Link from 'next/link'
import ReactMarkdown from 'react-markdown'
import { getPost, getAllPosts } from '@/lib/blog'
import type { Metadata } from 'next'

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  const posts = getAllPosts()
  return posts.map((p) => ({ slug: p.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const post = getPost(slug)
  if (!post) return {}
  return {
    title: post.title,
    description: post.excerpt,
  }
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params
  const post = getPost(slug)
  if (!post) notFound()

  return (
    <>
      <article className="py-24 px-6">
        <div className="max-w-[700px] mx-auto">
          {/* Back link */}
          <Link
            href="/the-understory"
            className="text-sm text-[#6B6B65] hover:text-[#2D4A3E] transition-colors inline-flex items-center gap-2 mb-12"
          >
            <span>←</span> The Understory
          </Link>

          {/* Meta */}
          <div className="flex items-center gap-4 mb-6">
            <span className="text-xs text-[#7A9E8E] border border-[#7A9E8E]/30 px-2 py-0.5 rounded-full">
              {post.category}
            </span>
            <span className="text-xs text-[#6B6B65]">{post.read_time} min read</span>
            <span className="text-xs text-[#6B6B65]">
              {new Date(post.date).toLocaleDateString('en-GB', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
              })}
            </span>
          </div>

          {/* Title */}
          <h1
            className="text-4xl md:text-5xl font-semibold text-[#1C1C1A] leading-tight mb-8"
            style={{ fontFamily: 'var(--font-playfair), Georgia, serif' }}
          >
            {post.title}
          </h1>

          <p className="text-sm text-[#6B6B65] mb-12">By Ayelen</p>

          {/* Body */}
          <div
            className="prose-deepbloom"
            style={{ lineHeight: '1.8' }}
          >
            <ReactMarkdown
              components={{
                h2: ({ children }) => (
                  <h2
                    className="text-2xl font-semibold text-[#1C1C1A] mt-12 mb-4"
                    style={{ fontFamily: 'var(--font-playfair), Georgia, serif' }}
                  >
                    {children}
                  </h2>
                ),
                h3: ({ children }) => (
                  <h3
                    className="text-xl font-semibold text-[#1C1C1A] mt-8 mb-3"
                    style={{ fontFamily: 'var(--font-playfair), Georgia, serif' }}
                  >
                    {children}
                  </h3>
                ),
                p: ({ children }) => (
                  <p className="text-[#6B6B65] text-lg leading-[1.8] mb-6">{children}</p>
                ),
                strong: ({ children }) => (
                  <strong className="text-[#1C1C1A] font-semibold">{children}</strong>
                ),
                em: ({ children }) => (
                  <em className="text-[#1C1C1A] italic">{children}</em>
                ),
                ul: ({ children }) => (
                  <ul className="space-y-2 mb-6 pl-4">{children}</ul>
                ),
                li: ({ children }) => (
                  <li className="text-[#6B6B65] text-lg flex gap-2">
                    <span className="text-[#7A9E8E] mt-1.5">•</span>
                    <span>{children}</span>
                  </li>
                ),
              }}
            >
              {post.body}
            </ReactMarkdown>
          </div>

          {/* Soft CTA */}
          <div className="mt-16 pt-10 border-t border-[#2D4A3E]/10">
            <p className="text-[#6B6B65] text-base italic mb-4">
              If this resonated, The First Root might be a good next step.
            </p>
            <Link
              href="/first-root"
              className="text-[#2D4A3E] text-sm hover:text-[#7A9E8E] transition-colors inline-flex items-center gap-2"
            >
              Book a free conversation <span>→</span>
            </Link>
          </div>
        </div>
      </article>
    </>
  )
}
