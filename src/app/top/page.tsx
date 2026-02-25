// src/app/top/page.tsx
import { prisma } from '@/lib/prisma'
import { PostCard } from '@/components/posts/PostCard'
import { TrendingUp } from 'lucide-react'

export default async function TopPage() {
  const posts = await prisma.post.findMany({
    include: {
      author: { select: { id: true, name: true, username: true, avatar: true, reputation: true, gamertag: true } },
      category: true,
      tags: true,
      _count: { select: { comments: true, likes: true } },
    },
    orderBy: { views: 'desc' },
    take: 50,
  })

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="font-display text-3xl font-bold text-white uppercase tracking-wider mb-1 flex items-center gap-3">
          <TrendingUp className="text-accent-light" /> Top Posts
        </h1>
        <p className="text-text-muted text-sm">The most viewed posts from the community</p>
      </div>
      <div className="space-y-3">
        {posts.map(post => <PostCard key={post.id} post={post} />)}
      </div>
    </div>
  )
}
