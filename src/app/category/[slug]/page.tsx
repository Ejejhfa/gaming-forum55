export const dynamic = 'force-dynamic'
// src/app/category/[slug]/page.tsx
import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { PostCard } from '@/components/posts/PostCard'
import Link from 'next/link'

export default async function CategoryPage({ params }: { params: { slug: string } }) {
  const category = await prisma.category.findUnique({
    where: { slug: params.slug },
    include: { _count: { select: { posts: true } } },
  })

  if (!category) notFound()

  const posts = await prisma.post.findMany({
    where: { categoryId: category.id },
    include: {
      author: { select: { id: true, name: true, username: true, avatar: true, reputation: true, gamertag: true } },
      category: true,
      tags: true,
      _count: { select: { comments: true, likes: true } },
    },
    orderBy: [{ pinned: 'desc' }, { createdAt: 'desc' }],
  })

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="bg-bg-card border border-border rounded-xl p-6">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            <div className="text-4xl">{category.icon}</div>
            <div>
              <h1 className="font-display text-2xl font-bold text-white">{category.name}</h1>
              <p className="text-text-muted text-sm mt-1">{category.description}</p>
              <p className="text-xs text-text-faint mt-2">{category._count.posts} posts</p>
            </div>
          </div>
          <Link href="/post/new" className="btn-primary text-sm">
            + New Post
          </Link>
        </div>
      </div>

      {/* Posts */}
      {posts.length === 0 ? (
        <div className="text-center py-16 text-text-muted">
          <p className="text-4xl mb-3">🎮</p>
          <p className="font-display text-lg text-text">No posts yet</p>
          <p className="text-sm mt-1">Be the first to post in this category!</p>
          <Link href="/post/new" className="btn-primary mt-4 inline-flex">Create Post</Link>
        </div>
      ) : (
        <div className="space-y-3">
          {posts.map(post => <PostCard key={post.id} post={post} />)}
        </div>
      )}
    </div>
  )
}
