import Link from 'next/link'
import { getAllPosts } from '@/lib/blog'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'The Understory',
  description:
    'Honest writing about the deeper work of becoming yourself.',
}

const CATEGORIES = [
  'The Inner Work',
  'The Science of You',
  'Nourish',
  'Real Stories',
  'The Becoming',
]

export default function TheUnderstoryPage() {
  const posts = getAllPosts()

  return (
    <>
      <section className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="max-w-2xl mb-16">
            <h1
              className="text-4xl md:text-5xl font-semibold text-[#1C1C1A] mb-4"
              style={{ fontFamily: 'var(--font-playfair), Georgia, serif' }}
            >
              The Understory
            </h1>
            <p className="text-xl text-[#6B6B65]">
              Honest writing about the deeper work of becoming yourself.
            </p>
          </div>

          {/* Category tags */}
          <div className="flex flex-wrap gap-2 mb-12">
            {CATEGORIES.map((cat) => (
              <span
                key={cat}
                className="text-xs border border-[#2D4A3E]/20 text-[#6B6B65] px-3 py-1 rounded-full"
              >
                {cat}
              </span>
            ))}
          </div>

          {posts.length === 0 ? (
            <div className="text-center py-24">
              <p className="text-[#6B6B65] text-lg italic">
                Writing coming soon. Check back shortly.
              </p>
            </div>
          ) : (
            <div className="grid md:grid-cols-3 gap-8">
              {posts.map((post) => (
                <Link
                  key={post.slug}
                  href={`/the-understory/${post.slug}`}
                  className="group block bg-white rounded-2xl overflow-hidden hover:shadow-sm transition-shadow"
                >
                  {/* Image placeholder */}
                  <div className="bg-[#FAF7F2] h-48 flex items-center justify-center">
                    <span className="text-[#6B6B65] text-xs italic">
                      {post.featured_image ? '' : 'No image'}
                    </span>
                  </div>
                  <div className="p-6">
                    <div className="flex items-center gap-3 mb-3">
                      <span className="text-xs text-[#7A9E8E] border border-[#7A9E8E]/30 px-2 py-0.5 rounded-full">
                        {post.category}
                      </span>
                      <span className="text-xs text-[#6B6B65]">{post.read_time} min read</span>
                    </div>
                    <h2
                      className="text-lg font-semibold text-[#1C1C1A] mb-2 leading-snug group-hover:text-[#2D4A3E] transition-colors"
                      style={{ fontFamily: 'var(--font-playfair), Georgia, serif' }}
                    >
                      {post.title}
                    </h2>
                    <p className="text-[#6B6B65] text-sm leading-relaxed line-clamp-2">
                      {post.excerpt}
                    </p>
                    <p className="text-xs text-[#6B6B65] mt-4">
                      {new Date(post.date).toLocaleDateString('en-GB', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                      })}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  )
}
