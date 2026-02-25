'use client'
import { useState } from 'react'
import { Tv, MessageCircle, Check, X, ChevronDown, ChevronUp } from 'lucide-react'

interface StreamerApp {
  id: string
  name: string
  description: string
  games: string
  followers: string
  twitchUrl?: string
  youtubeUrl?: string
  tiktokUrl?: string
  user: { username: string }
  createdAt: string
}

interface DiscordApp {
  id: string
  serverName: string
  description: string
  memberCount: string
  focus: string
  inviteUrl: string
  user: { username: string }
  createdAt: string
}

function ApplicationCard({ children, onApprove, onReject, loading }: {
  children: React.ReactNode
  onApprove: () => void
  onReject: () => void
  loading: boolean
}) {
  return (
    <div className="bg-bg-tertiary border border-border/50 rounded-xl p-4">
      {children}
      <div className="flex gap-2 mt-3 pt-3 border-t border-border/50">
        <button onClick={onApprove} disabled={loading}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-neon-green/20 text-neon-green border border-neon-green/30 rounded-lg text-xs font-semibold hover:bg-neon-green/30 transition-colors disabled:opacity-50">
          <Check size={12} /> Goedkeuren
        </button>
        <button onClick={onReject} disabled={loading}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-red-500/20 text-red-400 border border-red-500/30 rounded-lg text-xs font-semibold hover:bg-red-500/30 transition-colors disabled:opacity-50">
          <X size={12} /> Afwijzen
        </button>
      </div>
    </div>
  )
}

export function AdminApplications({
  pendingStreamers,
  pendingDiscord,
}: {
  pendingStreamers: StreamerApp[]
  pendingDiscord: DiscordApp[]
}) {
  const [streamers, setStreamers] = useState(pendingStreamers)
  const [discord, setDiscord] = useState(pendingDiscord)
  const [loading, setLoading] = useState<string | null>(null)
  const [expanded, setExpanded] = useState(true)

  const handle = async (id: string, type: 'streamer' | 'discord', status: 'APPROVED' | 'REJECTED') => {
    setLoading(id)
    try {
      const res = await fetch('/api/admin/applications', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, type, status }),
      })
      if (res.ok) {
        if (type === 'streamer') setStreamers(prev => prev.filter(s => s.id !== id))
        else setDiscord(prev => prev.filter(s => s.id !== id))
      }
    } catch {}
    setLoading(null)
  }

  const totalPending = streamers.length + discord.length

  return (
    <div className="bg-bg-card border border-border rounded-xl overflow-hidden">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full p-4 flex items-center justify-between hover:bg-bg-tertiary/50 transition-colors"
      >
        <div className="flex items-center gap-3">
          <h2 className="font-display font-bold text-white">Openstaande Aanvragen</h2>
          {totalPending > 0 && (
            <span className="badge bg-amber-500/20 text-amber-400 border border-amber-500/30">
              {totalPending} wachtend
            </span>
          )}
        </div>
        {expanded ? <ChevronUp size={16} className="text-text-muted" /> : <ChevronDown size={16} className="text-text-muted" />}
      </button>

      {expanded && (
        <div className="p-4 pt-0 space-y-6">
          {totalPending === 0 && (
            <p className="text-center text-text-muted text-sm py-6">✅ Geen openstaande aanvragen</p>
          )}

          {/* Streamer Applications */}
          {streamers.length > 0 && (
            <div>
              <h3 className="font-semibold text-text flex items-center gap-2 mb-3 text-sm">
                <Tv size={14} className="text-purple-400" /> Streamer aanvragen ({streamers.length})
              </h3>
              <div className="space-y-3">
                {streamers.map(app => (
                  <ApplicationCard key={app.id}
                    onApprove={() => handle(app.id, 'streamer', 'APPROVED')}
                    onReject={() => handle(app.id, 'streamer', 'REJECTED')}
                    loading={loading === app.id}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <p className="font-semibold text-text">{app.name}</p>
                        <p className="text-xs text-text-muted">door @{app.user.username}</p>
                      </div>
                      <span className="text-xs text-text-faint font-mono">{app.followers} volgers</span>
                    </div>
                    <p className="text-xs text-text-muted mb-2 line-clamp-2">{app.description}</p>
                    <div className="flex gap-2 flex-wrap">
                      <span className="text-xs text-text-faint">Games: {app.games}</span>
                    </div>
                    <div className="flex gap-2 mt-2 flex-wrap">
                      {app.twitchUrl && <a href={app.twitchUrl} target="_blank" className="text-xs text-purple-400 hover:underline">Twitch ↗</a>}
                      {app.youtubeUrl && <a href={app.youtubeUrl} target="_blank" className="text-xs text-red-400 hover:underline">YouTube ↗</a>}
                      {app.tiktokUrl && <a href={app.tiktokUrl} target="_blank" className="text-xs text-pink-400 hover:underline">TikTok ↗</a>}
                    </div>
                  </ApplicationCard>
                ))}
              </div>
            </div>
          )}

          {/* Discord Applications */}
          {discord.length > 0 && (
            <div>
              <h3 className="font-semibold text-text flex items-center gap-2 mb-3 text-sm">
                <MessageCircle size={14} className="text-indigo-400" /> Discord server aanvragen ({discord.length})
              </h3>
              <div className="space-y-3">
                {discord.map(app => (
                  <ApplicationCard key={app.id}
                    onApprove={() => handle(app.id, 'discord', 'APPROVED')}
                    onReject={() => handle(app.id, 'discord', 'REJECTED')}
                    loading={loading === app.id}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <p className="font-semibold text-text">{app.serverName}</p>
                        <p className="text-xs text-text-muted">door @{app.user.username}</p>
                      </div>
                      <span className="text-xs text-text-faint font-mono">{app.memberCount} leden</span>
                    </div>
                    <p className="text-xs text-text-muted mb-2 line-clamp-2">{app.description}</p>
                    <p className="text-xs text-text-faint">Focus: {app.focus}</p>
                    <a href={app.inviteUrl} target="_blank" className="text-xs text-indigo-400 hover:underline mt-1 block">
                      {app.inviteUrl} ↗
                    </a>
                  </ApplicationCard>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
