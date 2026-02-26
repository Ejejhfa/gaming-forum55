// src/components/layout/Sidebar.tsx
'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { TrendingUp, Users, Crown, Gamepad2 } from 'lucide-react'

export function Sidebar() {
  const [stats, setStats] = useState({ userCount: 0, postCount: 0, commentCount: 0 })
  const [trending, setTrending] = useState<any[]>([])
  const [topUsers, setTopUsers] = useState<any[]>([])

  useEffect(() => {
    fetch('/api/sidebar').then(r => r.json()).then(data => {
      setStats(data.stats)
      setTrending(data.trending)
      setTopUsers(data.topUsers)
    }).catch(() => {})
  }, [])

  return (
    <aside className="hidden lg:block w-72 shrink-0 space-y-4">
      <div className="bg-bg-card border border-border rounded-xl p-4">
        <h3 className="font-display font-bold text-white text-sm uppercase tracking-wider mb-3 flex items-center gap-2">
          <Gamepad2 size={14} className="text-accent-light" /> Community Stats
        </h3>
        <div className="grid grid-cols-3 gap-2">
          <div className="text-center p-2 bg-bg-tertiary rounded-lg">
            <p className="text-lg font-display font-bold text-white">{stats.userCount.toLocaleString()}</p>
            <p className="text-xs text-text-muted">Members</p>
          </div>
          <div className="text-center p-2 bg-bg-tertiary rounded-lg">
            <p className="text-lg font-display font-bold text-white">{stats.postCount.toLocaleString()}</p>
            <p className="text-xs text-text-muted">Posts</p>
          </div>
          <div className="text-center p-2 bg-bg-tertiary rounded-lg">
            <p className="text-lg font-display font-bold text-white">{stats.commentCount.toLocaleString()}</p>
            <p className="text-xs text-text-muted">Replies</p>
          </div>
        </div>
        <div className="mt-3 flex items-center gap-2">
          <div className="w-2 h-2 bg-neon-green rounded-full animate-pulse" />
          <span className="text-xs text-text-muted">Community is <span className="text-neon-green font-medium">online</span></span>
        </div>
      </div>

      {trending.length > 0 && (
        <div className="bg-bg-card border border-border rounded-xl p-4">
          <h3 className="font-display font-bold text-white text-sm uppercase tracking-wider mb-3 flex items-center gap-2">
            <TrendingUp size={14} className="text-accent-light" /> Trending
          </h3>
          <div className="space-y-2">
            {trending.map((post: any, i: number) => (
              <Link key={post.id} href={`/post/${post.slug}`} className="flex items-start gap-2 group">
                <span className="text-lg font-display font-bold text-text-faint group-hover:text-accent-light transition-colors leading-none mt-0.5">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <div>
                  <p className="text-xs text-text-muted group-hover:text-text transition-colors line-clamp-2 leading-relaxed">
                    {post.title}
                  </p>
                  <p className="text-xs text-text-faint mt-0.5">{post.views} views</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {topUsers.length > 0 && (
        <div className="bg-bg-card border border-border rounded-xl p-4">
          <h3 className="font-display font-bold text-white text-sm uppercase tracking-wider mb-3 flex items-center gap-2">
            <Crown size={14} className="text-accent-light" /> Top Members
          </h3>
          <div className="space-y-2">
            {topUsers.map((user: any, i: number) => (
              <Link key={user.id} href={`/user/${user.username}`} className="flex items-center gap-2 group">
                <span className="text-xs font-mono text-text-faint w-4">{i + 1}</span>
                <div className="w-6 h-6 rounded-md bg-accent-glow border border-accent/30 flex items-center justify-center text-xs font-bold text-accent-light shrink-0">
                  {user.name[0].toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-text-muted group-hover:text-text transition-colors truncate">{user.username}</p>
                </div>
                <span className="text-xs text-accent-light font-mono">{user.reputation.toLocaleString()}</span>
              </Link>
            ))}
          </div>
        </div>
      )}

      <div className="bg-bg-card border border-border rounded-xl p-4">
        <h3 className="font-display font-bold text-white text-sm uppercase tracking-wider mb-3">Quick Links</h3>
        <div className="space-y-1">
          {[
            { href: '/categories', label: 'All Categories' },
            { href: '/latest', label: 'Latest Posts' },
            { href: '/top', label: 'Top Posts' },
            { href: '/streamers', label: '🎥 Streamers' },
            { href: '/discord-servers', label: '💬 Discord Servers' },
            { href: '/post/new', label: '+ Create Post' },
          ].map(link => (
            <Link key={link.href} href={link.href}
              className="block text-xs text-text-muted hover:text-accent-light transition-colors py-1 hover:pl-2 transition-all">
              {link.label}
            </Link>
          ))}
        </div>
      </div>
    </aside>
  )
}
