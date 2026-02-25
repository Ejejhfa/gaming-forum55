export const dynamic = 'force-dynamic'
// src/app/page.tsx
import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import { PostCard } from '@/components/posts/PostCard'
import { CategoryCard } from '@/components/categories/CategoryCard'
import { Zap, Flame, Clock, ChevronRight } from 'lucide-react'

async function getData() {
  const [featuredPosts, latestPosts, categories] = await Promise.all([
    prisma.post.findMany({
      where: { pinned: true },
      include: {
        author: { select: { id: true, name: true, username: true, avatar: true, reputation: true, gamertag: true } },
        category: true,
        tags: true,
        _count: { select: { comments: true, likes: true } },
      },
      orderBy: { createdAt: 'desc' },
      take: 3,
    }),
    prisma.post.findMany({
      include: {
        author: { select: { id: true, name: true, username: true, avatar: true, reputation: true, gamertag: true } },
        category: true,
        tags: true,
        _count: { select: { comments: true, likes: true } },
      },
      orderBy: { createdAt: 'desc' },
      take: 10,
    }),
    prisma.category.findMany({
      orderBy: { order: 'asc' },
      include: { _count: { select: { posts: true } } },
    }),
  ])
  return { featuredPosts, latestPosts, categories }
}

export default async function HomePage() {
  const { featuredPosts, latestPosts, categories } = await getData()

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Hero Banner */}
      <div className="relative overflow-hidden rounded-2xl border border-border bg-bg-card p-8">
        <div className="absolute inset-0 bg-gradient-to-br from-accent/10 via-transparent to-transparent" />
        <div className="absolute -top-20 -right-20 w-64 h-64 bg-accent/5 rounded-full blur-3xl" />
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-3">
            <span className="badge bg-accent/20 text-accent-light border border-accent/30">🎮 Gaming Community</span>
            <div className="flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 bg-neon-green rounded-full animate-pulse" />
              <span className="text-xs text-neon-green font-medium">Live</span>
            </div>
          </div>
          <h1 className="font-display text-4xl md:text-5xl font-bold text-white leading-tight mb-2">
            Welcome to <span className="text-accent-light glow-text">GameHub</span>
          </h1>
          <p className="text-text-muted max-w-lg mb-6">
            The ultimate community for gamers. Discuss strategies, find teammates, share your clips, and connect with millions of players worldwide.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link href="/register" className="btn-primary">
              <Zap size={16} /> Join the Community
            </Link>
            <Link href="/categories" className="btn-secondary">
              Browse Categories <ChevronRight size={16} />
            </Link>
          </div>
        </div>
      </div>

      {/* Categories */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display text-xl font-bold text-white uppercase tracking-wider">Categories</h2>
          <Link href="/categories" className="text-xs text-accent-light hover:text-accent transition-colors flex items-center gap-1">
            View all <ChevronRight size={12} />
          </Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {categories.slice(0, 8).map(cat => (
            <CategoryCard key={cat.id} category={cat} />
          ))}
        </div>
      </section>

      {/* Pinned Posts */}
      {featuredPosts.length > 0 && (
        <section>
          <div className="flex items-center gap-2 mb-4">
            <h2 className="font-display text-xl font-bold text-white uppercase tracking-wider">📌 Pinned</h2>
          </div>
          <div className="space-y-3">
            {featuredPosts.map(post => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        </section>
      )}

      {/* Latest Posts */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display text-xl font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <Clock size={16} className="text-accent-light" /> Latest Posts
          </h2>
          <Link href="/latest" className="text-xs text-accent-light hover:text-accent transition-colors flex items-center gap-1">
            View all <ChevronRight size={12} />
          </Link>
        </div>
        <div className="space-y-3">
          {latestPosts.map(post => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      </section>
    </div>
  )
}
