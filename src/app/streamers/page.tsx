// src/app/streamers/page.tsx
import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import { Tv, Users, ChevronRight, Twitch, Youtube } from 'lucide-react'

export default async function StreamersPage() {
  const streamers = await prisma.streamerApplication.findMany({
    where: { status: 'APPROVED' },
    include: { user: { select: { username: true, avatar: true, name: true } } },
    orderBy: { createdAt: 'desc' },
  })

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="relative overflow-hidden rounded-2xl border border-border bg-bg-card p-8">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-600/10 via-transparent to-transparent" />
        <div className="absolute -top-10 -right-10 w-48 h-48 bg-purple-600/5 rounded-full blur-3xl" />
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-3">
            <span className="badge bg-purple-500/20 text-purple-400 border border-purple-500/30">🎥 Featured Streamers</span>
          </div>
          <h1 className="font-display text-4xl font-bold text-white mb-2">Community Streamers</h1>
          <p className="text-text-muted max-w-lg mb-6">
            Ontdek streamers uit onze community. Wil jij ook gepromoot worden op GameHub?
          </p>
          <Link href="/streamers/apply" className="btn-primary">
            🎮 Aanmelden als Streamer
          </Link>
        </div>
      </div>

      {/* Streamers grid */}
      {streamers.length === 0 ? (
        <div className="text-center py-16 bg-bg-card border border-border rounded-xl text-text-muted">
          <p className="text-4xl mb-3">🎥</p>
          <p className="font-display text-lg text-text">Nog geen streamers</p>
          <p className="text-sm mt-1">Wees de eerste en meld je aan!</p>
          <Link href="/streamers/apply" className="btn-primary mt-4 inline-flex">Aanmelden</Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {streamers.map(streamer => (
            <div key={streamer.id} className="bg-bg-card border border-border rounded-xl p-5 card-hover">
              <div className="flex items-start gap-4">
                {/* Avatar */}
                <div className="w-14 h-14 rounded-xl bg-accent-glow border border-accent/30 flex items-center justify-center text-xl font-bold text-accent-light shrink-0">
                  {streamer.name[0].toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="font-display font-bold text-white text-lg">{streamer.name}</h3>
                    <span className="text-xs text-text-muted font-mono">{streamer.followers} volgers</span>
                  </div>
                  <p className="text-xs text-accent-light mb-2">by @{streamer.user.username}</p>
                  <p className="text-sm text-text-muted line-clamp-2 mb-3">{streamer.description}</p>
                  <div className="flex items-center gap-1 flex-wrap mb-3">
                    {streamer.games.split(',').slice(0, 3).map(game => (
                      <span key={game} className="text-xs px-2 py-0.5 bg-bg-tertiary text-text-muted rounded-md">
                        {game.trim()}
                      </span>
                    ))}
                  </div>
                  <div className="flex items-center gap-2">
                    {streamer.twitchUrl && (
                      <a href={streamer.twitchUrl} target="_blank" rel="noopener noreferrer"
                        className="flex items-center gap-1.5 text-xs px-3 py-1.5 bg-purple-600/20 text-purple-400 border border-purple-600/30 rounded-lg hover:bg-purple-600/30 transition-colors">
                        <Tv size={12} /> Twitch
                      </a>
                    )}
                    {streamer.youtubeUrl && (
                      <a href={streamer.youtubeUrl} target="_blank" rel="noopener noreferrer"
                        className="flex items-center gap-1.5 text-xs px-3 py-1.5 bg-red-600/20 text-red-400 border border-red-600/30 rounded-lg hover:bg-red-600/30 transition-colors">
                        <Youtube size={12} /> YouTube
                      </a>
                    )}
                    {streamer.tiktokUrl && (
                      <a href={streamer.tiktokUrl} target="_blank" rel="noopener noreferrer"
                        className="flex items-center gap-1.5 text-xs px-3 py-1.5 bg-pink-600/20 text-pink-400 border border-pink-600/30 rounded-lg hover:bg-pink-600/30 transition-colors">
                        🎵 TikTok
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
