'use client'
import { useState } from 'react'
import { useSession } from 'next-auth/react'
import { Heart } from 'lucide-react'

export function LikeButton({ postId, initialLikes }: { postId: string; initialLikes: number }) {
  const { data: session } = useSession()
  const [liked, setLiked] = useState(false)
  const [likes, setLikes] = useState(initialLikes)
  const [loading, setLoading] = useState(false)

  const handleLike = async () => {
    if (!session) {
      window.location.href = '/login'
      return
    }
    if (loading) return
    setLoading(true)
    try {
      const res = await fetch('/api/posts/like', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ postId }),
      })
      const data = await res.json()
      if (data.liked !== undefined) {
        setLiked(data.liked)
        setLikes(prev => prev + (data.liked ? 1 : -1))
      }
    } catch (e) {}
    setLoading(false)
  }

  return (
    <button onClick={handleLike} disabled={loading}
      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
        liked ? 'bg-red-500/20 text-red-400 border border-red-500/30' : 'btn-ghost'
      }`}>
      <Heart size={14} className={liked ? 'fill-current' : ''} />
      {likes}
    </button>
  )
}
