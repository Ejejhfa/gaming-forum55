export const dynamic = 'force-dynamic'
// src/app/user/[username]/page.tsx
import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { PostCard } from '@/components/posts/PostCard'
import { format } from 'date-fns'
import { Star, MessageSquare, FileText, Calendar, Gamepad2 } from 'lucide-react'

export default async function UserProfilePage({ params }: { params: { username: string } }) {
  const user = await prisma.user.findUnique({
    where: { username: params.username },
    include: {
      _count: { select: { posts: true, comments: true } },
    },
  })

  if (!user) notFound()

  const posts = await prisma.post.findMany({
    where: { authorId: user.id },
    include: {
      author: { select: { id: true, name: true, username: true, avatar: true, reputation: true, gamertag: true } },
      category: true,
      tags: true,
      _count: { select: { comments: true, likes: true } },
    },
    orderBy: { createdAt: 'desc' },
    take: 20,
  })

  const roleBadge = {
    ADMIN: { label: 'Admin', color: 'bg-red-500/20 text-red-400 border-red-500/30' },
    MODERATOR: { label: 'Mod', color: 'bg-blue-500/20 text-blue-400 border-blue-500/30' },
    USER: { label: 'Member', color: 'bg-accent/20 text-accent-light border-accent/30' },
  }[user.role]

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Profile Header */}
      <div className="bg-bg-card border border-border rounded-xl overflow-hidden">
        {/* Banner */}
        <div className="h-24 bg-gradient-to-r from-accent/20 via-purple-900/20 to-bg-tertiary" />
        <div className="p-6 -mt-10">
          <div className="flex items-end justify-between mb-4">
            <div className="w-16 h-16 rounded-2xl bg-accent-glow border-2 border-bg-card flex items-center justify-center text-2xl font-bold text-accent-light font-display">
              {user.name[0].toUpperCase()}
            </div>
            <span className={`badge border ${roleBadge.color}`}>{roleBadge.label}</span>
          </div>

          <h1 className="font-display text-2xl font-bold text-white">{user.name}</h1>
          <p className="text-text-muted text-sm">@{user.username}</p>
          {user.gamertag && (
            <p className="text-xs text-accent-light mt-1 flex items-center gap-1">
              <Gamepad2 size={12} /> {user.gamertag}
            </p>
          )}
          {user.bio && <p className="text-sm text-text-muted mt-3">{user.bio}</p>}

          <div className="grid grid-cols-3 gap-3 mt-6">
            <div className="text-center p-3 bg-bg-tertiary rounded-xl">
              <Star size={14} className="text-accent-light mx-auto mb-1" />
              <p className="font-display font-bold text-white">{user.reputation.toLocaleString()}</p>
              <p className="text-xs text-text-muted">Reputation</p>
            </div>
            <div className="text-center p-3 bg-bg-tertiary rounded-xl">
              <FileText size={14} className="text-accent-light mx-auto mb-1" />
              <p className="font-display font-bold text-white">{user._count.posts}</p>
              <p className="text-xs text-text-muted">Posts</p>
            </div>
            <div className="text-center p-3 bg-bg-tertiary rounded-xl">
              <MessageSquare size={14} className="text-accent-light mx-auto mb-1" />
              <p className="font-display font-bold text-white">{user._count.comments}</p>
              <p className="text-xs text-text-muted">Replies</p>
            </div>
          </div>

          <p className="text-xs text-text-faint mt-4 flex items-center gap-1">
            <Calendar size={11} /> Member since {format(new Date(user.createdAt), 'MMMM yyyy')}
          </p>
        </div>
      </div>

      {/* Posts */}
      <section>
        <h2 className="font-display text-xl font-bold text-white uppercase tracking-wider mb-4">Posts by {user.username}</h2>
        {posts.length === 0 ? (
          <div className="text-center py-12 text-text-muted bg-bg-card border border-border rounded-xl">
            <p className="text-3xl mb-2">📝</p>
            <p>No posts yet</p>
          </div>
        ) : (
          <div className="space-y-3">
            {posts.map(post => <PostCard key={post.id} post={post} />)}
          </div>
        )}
      </section>
    </div>
  )
}
