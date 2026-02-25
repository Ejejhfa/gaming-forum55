'use client'
import Link from 'next/link'
import { formatDistanceToNow } from 'date-fns'
import { MessageSquare, Eye, Heart, Pin, Lock, ChevronRight } from 'lucide-react'
import { PostWithDetails } from '@/types'
import clsx from 'clsx'

export function PostCard({ post }: { post: PostWithDetails }) {
  const isNew = new Date(post.createdAt) > new Date(Date.now() - 24 * 60 * 60 * 1000)

  return (
    <Link href={`/post/${post.slug}`}>
      <article className={clsx(
        'bg-bg-card border rounded-xl p-4 card-hover cursor-pointer',
        post.pinned ? 'border-accent/30' : 'border-border'
      )}>
        <div className="flex gap-3">
          {/* Avatar */}
          <div className="w-9 h-9 rounded-lg bg-accent-glow border border-accent/30 flex items-center justify-center text-sm font-bold text-accent-light shrink-0 mt-0.5">
            {post.author.name[0].toUpperCase()}
          </div>

          <div className="flex-1 min-w-0">
            {/* Meta */}
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <span className="text-xs px-2 py-0.5 rounded-md font-medium"
                style={{ background: (post.category.color ?? '#7c3aed') + '20', color: post.category.color ?? '#7c3aed' }}>
                {post.category.icon} {post.category.name}
              </span>
              {post.pinned && (
                <span className="badge bg-accent/20 text-accent-light border border-accent/30">
                  <Pin size={9} className="mr-1" /> Pinned
                </span>
              )}
              {post.locked && (
                <span className="badge bg-red-500/20 text-red-400 border border-red-500/30">
                  <Lock size={9} className="mr-1" /> Locked
                </span>
              )}
              {isNew && (
                <span className="badge bg-neon-green/20 text-neon-green border border-neon-green/30">New</span>
              )}
            </div>

            {/* Title */}
            <h3 className="font-display text-base font-semibold text-text leading-snug mb-1 group-hover:text-white line-clamp-2">
              {post.title}
            </h3>

            {/* Author & Date */}
            <div className="flex items-center gap-2 text-xs text-text-muted mb-2">
              <span className="font-medium text-text-muted hover:text-accent-light">{post.author.username}</span>
              <span>·</span>
              <span>{formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}</span>
            </div>

            {/* Tags */}
            {post.tags.length > 0 && (
              <div className="flex gap-1 flex-wrap mb-2">
                {post.tags.slice(0, 4).map(tag => (
                  <span key={tag.id} className="text-xs px-2 py-0.5 bg-bg-tertiary text-text-muted rounded-md hover:bg-accent/10 hover:text-accent-light transition-colors">
                    #{tag.name}
                  </span>
                ))}
              </div>
            )}

            {/* Stats */}
            <div className="flex items-center gap-4 text-xs text-text-faint">
              <span className="flex items-center gap-1">
                <Eye size={12} /> {post.views.toLocaleString()}
              </span>
              <span className="flex items-center gap-1">
                <Heart size={12} /> {post._count.likes}
              </span>
              <span className="flex items-center gap-1">
                <MessageSquare size={12} /> {post._count.comments}
              </span>
            </div>
          </div>

          <ChevronRight size={16} className="text-text-faint shrink-0 mt-2 self-start" />
        </div>
      </article>
    </Link>
  )
}
