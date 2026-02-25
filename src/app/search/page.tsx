// src/app/search/page.tsx
import { prisma } from '@/lib/prisma'
import { PostCard } from '@/components/posts/PostCard'
import { Search } from 'lucide-react'

export default async function SearchPage({ searchParams }: { searchParams: { q?: string; tag?: string } }) {
  const query = searchParams.q?.trim()
  const tag = searchParams.tag?.trim()

  let posts: any[] = []

  if (query) {
    posts = await prisma.post.findMany({
      where: {
        OR: [
          { title: { contains: query, mode: 'insensitive' } },
          { content: { contains: query, mode: 'insensitive' } },
        ],
      },
      include: {
        author: { select: { id: true, name: true, username: true, avatar: true, reputation: true, gamertag: true } },
        category: true,
        tags: true,
        _count: { select: { comments: true, likes: true } },
      },
      orderBy: { createdAt: 'desc' },
      take: 30,
    })
  } else if (tag) {
    posts = await prisma.post.findMany({
      where: { tags: { some: { name: { equals: tag, mode: 'insensitive' } } } },
      include: {
        author: { select: { id: true, name: true, username: true, avatar: true, reputation: true, gamertag: true } },
        category: true,
        tags: true,
        _count: { select: { comments: true, likes: true } },
      },
      orderBy: { createdAt: 'desc' },
    })
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="font-display text-3xl font-bold text-white uppercase tracking-wider mb-1 flex items-center gap-3">
          <Search className="text-accent-light" /> Search Results
        </h1>
        {query && <p className="text-text-muted text-sm">Showing results for "<span className="text-text">{query}</span>"</p>}
        {tag && <p className="text-text-muted text-sm">Posts tagged <span className="text-accent-light">#{tag}</span></p>}
      </div>

      {posts.length === 0 ? (
        <div className="text-center py-16 bg-bg-card border border-border rounded-xl text-text-muted">
          <p className="text-4xl mb-3">🔍</p>
          <p className="font-display text-lg text-text">No results found</p>
          <p className="text-sm mt-1">Try different keywords or browse categories</p>
        </div>
      ) : (
        <div className="space-y-3">
          <p className="text-xs text-text-muted">{posts.length} result{posts.length !== 1 ? 's' : ''}</p>
          {posts.map(post => <PostCard key={post.id} post={post} />)}
        </div>
      )}
    </div>
  )
}
