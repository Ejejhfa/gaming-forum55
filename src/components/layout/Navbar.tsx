'use client'
import { useState } from 'react'
import Link from 'next/link'
import { useSession, signOut } from 'next-auth/react'
import { Search, Bell, ChevronDown, LogOut, User, Settings, Shield, Menu, X, Zap } from 'lucide-react'

export function Navbar() {
  const { data: session } = useSession()
  const [menuOpen, setMenuOpen] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  return (
    <nav className="sticky top-0 z-50 border-b border-border bg-bg/80 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center gap-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 shrink-0">
          <div className="w-8 h-8 rounded-lg bg-accent flex items-center justify-center glow-purple">
            <Zap size={16} className="text-white" />
          </div>
          <span className="font-display text-xl font-bold text-white tracking-wide">
            GAME<span className="text-accent-light">HUB</span>
          </span>
        </Link>

        {/* Search */}
        <div className="flex-1 max-w-md hidden md:flex">
          <div className="relative w-full">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
            <input
              type="text"
              placeholder="Search posts, games, users..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input-gaming pl-9 py-2 text-sm"
              onKeyDown={(e) => {
                if (e.key === 'Enter' && searchQuery.trim()) {
                  window.location.href = `/search?q=${encodeURIComponent(searchQuery)}`
                }
              }}
            />
          </div>
        </div>

        {/* Nav links */}
        <div className="hidden md:flex items-center gap-1 ml-auto">
          <Link href="/categories" className="btn-ghost text-sm">Categories</Link>
          <Link href="/latest" className="btn-ghost text-sm">Latest</Link>
          <Link href="/top" className="btn-ghost text-sm">Top</Link>
          <Link href="/streamers" className="btn-ghost text-sm">🎥 Streamers</Link>
          <Link href="/discord-servers" className="btn-ghost text-sm">💬 Discord</Link>
        </div>

        {/* Auth section */}
        <div className="flex items-center gap-2 ml-2">
          {session ? (
            <>
              {/* New Post */}
              <Link href="/post/new" className="btn-primary hidden md:flex text-sm py-2">
                + New Post
              </Link>
              
              {/* Notifications */}
              <button className="btn-ghost p-2 relative">
                <Bell size={18} />
                <span className="absolute top-1 right-1 w-2 h-2 bg-accent rounded-full" />
              </button>

              {/* User menu */}
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-2 btn-ghost py-1.5"
                >
                  <div className="w-7 h-7 rounded-lg bg-accent-glow border border-accent/30 flex items-center justify-center text-xs font-bold text-accent-light">
                    {session.user.name?.[0]?.toUpperCase()}
                  </div>
                  <span className="hidden md:block text-sm font-medium text-text">
                    {session.user.username}
                  </span>
                  <ChevronDown size={14} className="hidden md:block text-text-muted" />
                </button>

                {userMenuOpen && (
                  <div className="absolute right-0 top-full mt-2 w-52 bg-bg-card border border-border rounded-xl shadow-2xl overflow-hidden animate-slide-up">
                    <div className="p-3 border-b border-border">
                      <p className="text-sm font-semibold text-text">{session.user.name}</p>
                      <p className="text-xs text-text-muted">@{session.user.username}</p>
                    </div>
                    <div className="p-1">
                      <Link href={`/user/${session.user.username}`} onClick={() => setUserMenuOpen(false)}
                        className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-text-muted hover:bg-bg-tertiary hover:text-text transition-colors">
                        <User size={14} /> Profile
                      </Link>
                      <Link href="/settings" onClick={() => setUserMenuOpen(false)}
                        className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-text-muted hover:bg-bg-tertiary hover:text-text transition-colors">
                        <Settings size={14} /> Settings
                      </Link>
                      {session.user.role === 'ADMIN' && (
                        <Link href="/admin" onClick={() => setUserMenuOpen(false)}
                          className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-text-muted hover:bg-bg-tertiary hover:text-text transition-colors">
                          <Shield size={14} /> Admin Panel
                        </Link>
                      )}
                    </div>
                    <div className="p-1 border-t border-border">
                      <button onClick={() => signOut({ callbackUrl: '/' })}
                        className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-red-400 hover:bg-red-500/10 w-full transition-colors">
                        <LogOut size={14} /> Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="flex items-center gap-2">
              <Link href="/login" className="btn-ghost text-sm">Login</Link>
              <Link href="/register" className="btn-primary text-sm py-2">Join Now</Link>
            </div>
          )}

          {/* Mobile menu */}
          <button onClick={() => setMenuOpen(!menuOpen)} className="btn-ghost p-2 md:hidden">
            {menuOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden border-t border-border bg-bg-secondary p-4 space-y-2">
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
            <input type="text" placeholder="Search..." className="input-gaming pl-9 text-sm" />
          </div>
          <Link href="/categories" className="block btn-ghost text-sm">Categories</Link>
          <Link href="/latest" className="block btn-ghost text-sm">Latest</Link>
          <Link href="/top" className="block btn-ghost text-sm">Top</Link>
          {session && <Link href="/post/new" className="btn-primary text-sm justify-center w-full">+ New Post</Link>}
        </div>
      )}
    </nav>
  )
}
