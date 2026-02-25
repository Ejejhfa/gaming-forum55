export const dynamic = 'force-dynamic'
// src/app/post/[slug]/page.tsx
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import { formatDistanceToNow, format } from 'date-fns'
import { Eye, Heart, MessageSquare, Pin, Lock, Share2, Flag, ChevronLeft } from 'lucide-react'
import { CommentSection } from '@/components/posts/CommentSection'
import { LikeButton } from '@/components/posts/LikeButton'

export default async function PostPage({ params }: { params: { slug: string } }) {
  const post = await prisma.post.findUnique({
    where: { slug: params.slug },
    include: {
      author: { select: { id: true, name: true, username: true, avatar: true, reputation: true, gamertag: true, bio: true, createdAt: true } },
      category: true,
      tags: true,
      _count: { select: { comments: true, likes: true } },
    },
  })

  if (!post) notFound()

  // Increment views
  await prisma.post.update({ where: { id: post.id }, data: { views: { increment: 1 } } })

  const comments = await prisma.comment.findMany({
    where: { postId: post.id, parentId: null },
    include: {
      author: { select: { id: true, name: true, username: true, avatar: true, reputation: true } },
      _count: { select: { likes: true, replies: true } },
      replies: {
        include: {
          author: { select: { id: true, name: true, username: true, avatar: true, reputation: true } },
          _count: { select: { likes: true, replies: true } },
        },
        orderBy: { createdAt: 'asc' },
      },
    },
    orderBy: { createdAt: 'asc' },
  })

  // Format content with basic markdown
  const formattedContent = post.content
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/`(.*?)`/g, '<code>$1</code>')
    .replace(/^# (.*?)$/gm, '<h1>$1</h1>')
    .replace(/^## (.*?)$/gm, '<h2>$1</h2>')
    .replace(/^### (.*?)$/gm, '<h3>$1</h3>')
    .replace(/^\d+\. (.*?)$/gm, '<li>$1</li>')
    .replace(/^- (.*?)$/gm, '<li>$1</li>')
    .replace(/\n\n/g, '</p><p>')
    .replace(/^/, '<p>').replace(/$/, '</p>')

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-text-muted">
        <Link href="/" className="hover:text-accent-light transition-colors">Home</Link>
        <span>/</span>
        <Link href={`/category/${post.category.slug}`} className="hover:text-accent-light transition-colors">
          {post.category.name}
        </Link>
        <span>/</span>
        <span className="text-text-faint line-clamp-1">{post.title}</span>
      </div>

      {/* Post */}
      <article className="bg-bg-card border border-border rounded-xl overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-border">
          <div className="flex items-center gap-2 mb-3 flex-wrap">
            <span className="text-xs px-2 py-0.5 rounded-md font-medium"
              style={{ background: post.category.color + '20', color: post.category.color ?? '#7c3aed' }}>
              {post.category.icon} {post.category.name}
            </span>
            {post.pinned && <span className="badge bg-accent/20 text-accent-light border border-accent/30"><Pin size={9} className="mr-1" />Pinned</span>}
            {post.locked && <span className="badge bg-red-500/20 text-red-400 border border-red-500/30"><Lock size={9} className="mr-1" />Locked</span>}
          </div>

          <h1 className="font-display text-3xl font-bold text-white leading-tight mb-4">{post.title}</h1>

          <div className="flex items-center gap-4 flex-wrap">
            <Link href={`/user/${post.author.username}`} className="flex items-center gap-2 group">
              <div className="w-8 h-8 rounded-lg bg-accent-glow border border-accent/30 flex items-center justify-center text-sm font-bold text-accent-light">
                {post.author.name[0].toUpperCase()}
              </div>
              <div>
                <p className="text-sm font-semibold text-text group-hover:text-accent-light transition-colors">{post.author.username}</p>
                {post.author.gamertag && <p className="text-xs text-text-faint">{post.author.gamertag}</p>}
              </div>
            </Link>
            <div className="text-xs text-text-muted">
              Posted {format(new Date(post.createdAt), 'PPP')} · {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="prose-gaming"
            dangerouslySetInnerHTML={{ __html: formattedContent }}
          />

          {/* Tags */}
          {post.tags.length > 0 && (
            <div className="flex gap-2 flex-wrap mt-6 pt-6 border-t border-border">
              {post.tags.map(tag => (
                <Link key={tag.id} href={`/search?tag=${tag.name}`}
                  className="text-xs px-3 py-1 bg-bg-tertiary text-text-muted rounded-lg hover:bg-accent/10 hover:text-accent-light transition-colors">
                  #{tag.name}
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Footer actions */}
        <div className="px-6 py-4 border-t border-border flex items-center justify-between">
          <div className="flex items-center gap-2">
            <LikeButton postId={post.id} initialLikes={post._count.likes} />
            <span className="flex items-center gap-1.5 btn-ghost text-xs">
              <MessageSquare size={14} /> {post._count.comments} replies
            </span>
            <span className="flex items-center gap-1.5 text-xs text-text-faint px-2">
              <Eye size={14} /> {post.views.toLocaleString()} views
            </span>
          </div>
          <div className="flex items-center gap-1">
            <button className="btn-ghost p-2"><Share2 size={14} /></button>
            <button className="btn-ghost p-2"><Flag size={14} /></button>
          </div>
        </div>
      </article>

      {/* Comments */}
      <CommentSection postId={post.id} comments={comments} locked={post.locked} />
    </div>
  )
}
