'use client'
import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { PenLine, Tag, X } from 'lucide-react'

export default function NewPostPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [categories, setCategories] = useState<any[]>([])
  const [form, setForm] = useState({ title: '', content: '', categoryId: '', tags: '' })
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (status === 'unauthenticated') router.push('/login')
    fetch('/api/categories').then(r => r.json()).then(setCategories)
  }, [status])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.title.trim() || !form.content.trim() || !form.categoryId) {
      setError('Please fill in all required fields')
      return
    }
    setSubmitting(true)
    setError('')
    try {
      const res = await fetch('/api/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = await res.json()
      if (res.ok) {
        router.push(`/post/${data.slug}`)
      } else {
        setError(data.error || 'Failed to create post')
      }
    } catch (e) {
      setError('Something went wrong')
    }
    setSubmitting(false)
  }

  if (status === 'loading') return <div className="text-text-muted text-center py-20">Loading...</div>

  return (
    <div className="max-w-2xl space-y-6 animate-fade-in">
      <div>
        <h1 className="font-display text-3xl font-bold text-white uppercase tracking-wider mb-1 flex items-center gap-3">
          <PenLine className="text-accent-light" /> Create Post
        </h1>
        <p className="text-text-muted text-sm">Share something with the community</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="bg-bg-card border border-border rounded-xl p-6 space-y-4">
          {/* Title */}
          <div>
            <label className="block text-xs font-semibold text-text-muted uppercase tracking-wider mb-2">
              Title <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              value={form.title}
              onChange={e => setForm(prev => ({ ...prev, title: e.target.value }))}
              placeholder="Write a clear, descriptive title..."
              maxLength={200}
              className="input-gaming text-base font-medium"
            />
            <p className="text-xs text-text-faint mt-1">{form.title.length}/200</p>
          </div>

          {/* Category */}
          <div>
            <label className="block text-xs font-semibold text-text-muted uppercase tracking-wider mb-2">
              Category <span className="text-red-400">*</span>
            </label>
            <select
              value={form.categoryId}
              onChange={e => setForm(prev => ({ ...prev, categoryId: e.target.value }))}
              className="input-gaming"
            >
              <option value="">Select a category...</option>
              {categories.map((cat: any) => (
                <option key={cat.id} value={cat.id}>{cat.icon} {cat.name}</option>
              ))}
            </select>
          </div>

          {/* Content */}
          <div>
            <label className="block text-xs font-semibold text-text-muted uppercase tracking-wider mb-2">
              Content <span className="text-red-400">*</span>
            </label>
            <textarea
              value={form.content}
              onChange={e => setForm(prev => ({ ...prev, content: e.target.value }))}
              placeholder="Write your post here... (supports **bold**, *italic*, `code`, # headers)"
              rows={12}
              className="input-gaming resize-y min-h-48 leading-relaxed"
            />
            <p className="text-xs text-text-faint mt-1">Markdown is supported: **bold**, *italic*, `code`, # Heading</p>
          </div>

          {/* Tags */}
          <div>
            <label className="block text-xs font-semibold text-text-muted uppercase tracking-wider mb-2 flex items-center gap-1">
              <Tag size={11} /> Tags (optional)
            </label>
            <input
              type="text"
              value={form.tags}
              onChange={e => setForm(prev => ({ ...prev, tags: e.target.value }))}
              placeholder="valorant, tips, beginner (comma separated)"
              className="input-gaming"
            />
          </div>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-3 text-sm text-red-400">
            {error}
          </div>
        )}

        <div className="flex gap-3">
          <button type="submit" disabled={submitting} className="btn-primary">
            {submitting ? 'Publishing...' : '🚀 Publish Post'}
          </button>
          <button type="button" onClick={() => router.back()} className="btn-secondary">
            Cancel
          </button>
        </div>
      </form>
    </div>
  )
}
