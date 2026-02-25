'use client'
import { useState } from 'react'
import { useSession } from 'next-auth/react'
import { formatDistanceToNow } from 'date-fns'
import Link from 'next/link'
import { Heart, CornerDownRight, ChevronDown, ChevronUp } from 'lucide-react'

interface Comment {
  id: string
  content: string
  createdAt: Date | string
  author: { id: string; name: string; username: string; reputation: number; avatar?: string | null }
  _count: { likes: number; replies: number }
  replies?: Comment[]
}

function CommentItem({ comment, level = 0 }: { comment: Comment; level?: number }) {
  const [showReplies, setShowReplies] = useState(level < 1)
  const [replyOpen, setReplyOpen] = useState(false)
  const [replyContent, setReplyContent] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const { data: session } = useSession()

  const handleReply = async () => {
    if (!replyContent.trim() || submitting) return
    setSubmitting(true)
    try {
      const res = await fetch('/api/comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ postId: comment.id, content: replyContent, parentId: comment.id }),
      })
      if (res.ok) {
        setReplyContent('')
        setReplyOpen(false)
        window.location.reload()
      }
    } catch (e) {}
    setSubmitting(false)
  }

  return (
    <div className={`${level > 0 ? 'ml-6 border-l border-border pl-4' : ''}`}>
      <div className="bg-bg-card border border-border rounded-xl p-4 mb-3">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-7 h-7 rounded-lg bg-accent-glow border border-accent/30 flex items-center justify-center text-xs font-bold text-accent-light shrink-0">
            {comment.author.name[0].toUpperCase()}
          </div>
          <Link href={`/user/${comment.author.username}`}
            className="text-sm font-semibold text-text hover:text-accent-light transition-colors">
            {comment.author.username}
          </Link>
          <span className="text-xs text-text-faint">
            {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
          </span>
          <span className="text-xs font-mono text-accent-light ml-auto">{comment.author.reputation} rep</span>
        </div>

        <div className="text-sm text-text-muted leading-relaxed mb-3">
          {comment.content}
        </div>

        <div className="flex items-center gap-2">
          <button className="flex items-center gap-1 btn-ghost text-xs">
            <Heart size={12} /> {comment._count.likes}
          </button>
          {session && (
            <button onClick={() => setReplyOpen(!replyOpen)} className="btn-ghost text-xs flex items-center gap-1">
              <CornerDownRight size={12} /> Reply
            </button>
          )}
          {comment.replies && comment.replies.length > 0 && (
            <button onClick={() => setShowReplies(!showReplies)} className="btn-ghost text-xs flex items-center gap-1 ml-auto">
              {showReplies ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
              {comment.replies.length} {comment.replies.length === 1 ? 'reply' : 'replies'}
            </button>
          )}
        </div>

        {replyOpen && (
          <div className="mt-3 pt-3 border-t border-border">
            <textarea
              value={replyContent}
              onChange={e => setReplyContent(e.target.value)}
              placeholder="Write a reply..."
              rows={2}
              className="input-gaming resize-none text-sm"
            />
            <div className="flex gap-2 mt-2">
              <button onClick={handleReply} disabled={submitting} className="btn-primary text-xs py-1.5">
                {submitting ? 'Posting...' : 'Post Reply'}
              </button>
              <button onClick={() => setReplyOpen(false)} className="btn-secondary text-xs py-1.5">Cancel</button>
            </div>
          </div>
        )}
      </div>

      {showReplies && comment.replies?.map(reply => (
        <CommentItem key={reply.id} comment={reply} level={level + 1} />
      ))}
    </div>
  )
}

export function CommentSection({ postId, comments, locked }: {
  postId: string
  comments: Comment[]
  locked: boolean
}) {
  const { data: session } = useSession()
  const [content, setContent] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async () => {
    if (!content.trim() || submitting) return
    setSubmitting(true)
    try {
      const res = await fetch('/api/comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ postId, content }),
      })
      if (res.ok) {
        setContent('')
        window.location.reload()
      }
    } catch (e) {}
    setSubmitting(false)
  }

  return (
    <section className="space-y-4">
      <h2 className="font-display text-xl font-bold text-white uppercase tracking-wider">
        {comments.length} {comments.length === 1 ? 'Reply' : 'Replies'}
      </h2>

      {/* Reply form */}
      {!locked && (
        <div className="bg-bg-card border border-border rounded-xl p-4">
          {session ? (
            <>
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-lg bg-accent-glow border border-accent/30 flex items-center justify-center text-sm font-bold text-accent-light shrink-0">
                  {session.user.name[0].toUpperCase()}
                </div>
                <textarea
                  value={content}
                  onChange={e => setContent(e.target.value)}
                  placeholder="Share your thoughts..."
                  rows={3}
                  className="input-gaming resize-none text-sm"
                />
              </div>
              <div className="flex justify-end mt-3">
                <button onClick={handleSubmit} disabled={submitting || !content.trim()} className="btn-primary text-sm">
                  {submitting ? 'Posting...' : 'Post Reply'}
                </button>
              </div>
            </>
          ) : (
            <p className="text-center text-sm text-text-muted">
              <Link href="/login" className="text-accent-light hover:text-accent">Sign in</Link> to join the discussion
            </p>
          )}
        </div>
      )}

      {locked && (
        <div className="bg-bg-card border border-red-500/20 rounded-xl p-4 text-center">
          <p className="text-sm text-red-400">🔒 This post is locked. No new replies can be added.</p>
        </div>
      )}

      {/* Comments */}
      <div>
        {comments.length === 0 ? (
          <div className="text-center py-10 text-text-muted">
            <p className="text-3xl mb-2">💬</p>
            <p className="font-display text-text">No replies yet</p>
            <p className="text-sm mt-1">Be the first to share your thoughts!</p>
          </div>
        ) : (
          comments.map(comment => <CommentItem key={comment.id} comment={comment} />)
        )}
      </div>
    </section>
  )
}
