// src/app/discord-servers/page.tsx
import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import { MessageCircle, Users } from 'lucide-react'
export const dynamic = 'force-dynamic'

export default async function DiscordServersPage() {
  const servers = await prisma.discordApplication.findMany({
    where: { status: 'APPROVED' },
    include: { user: { select: { username: true } } },
    orderBy: { createdAt: 'desc' },
  })

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="relative overflow-hidden rounded-2xl border border-border bg-bg-card p-8">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/10 via-transparent to-transparent" />
        <div className="absolute -top-10 -right-10 w-48 h-48 bg-indigo-600/5 rounded-full blur-3xl" />
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-3">
            <span className="badge bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">💬 Discord Servers</span>
          </div>
          <h1 className="font-display text-4xl font-bold text-white mb-2">Gaming Discord Servers</h1>
          <p className="text-text-muted max-w-lg mb-6">
            Ontdek gaming Discord servers van onze community. Heb jij ook een server en wil je die hier zien?
          </p>
          <Link href="/discord-servers/apply" className="btn-primary">
            💬 Server Aanmelden
          </Link>
        </div>
      </div>

      {/* Servers grid */}
      {servers.length === 0 ? (
        <div className="text-center py-16 bg-bg-card border border-border rounded-xl text-text-muted">
          <p className="text-4xl mb-3">💬</p>
          <p className="font-display text-lg text-text">Nog geen servers</p>
          <p className="text-sm mt-1">Wees de eerste en meld je server aan!</p>
          <Link href="/discord-servers/apply" className="btn-primary mt-4 inline-flex">Aanmelden</Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {servers.map(server => (
            <div key={server.id} className="bg-bg-card border border-border rounded-xl p-5 card-hover">
              <div className="flex items-start gap-4">
                {/* Discord icon */}
                <div className="w-14 h-14 rounded-xl bg-indigo-600/20 border border-indigo-600/30 flex items-center justify-center text-2xl shrink-0">
                  💬
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="font-display font-bold text-white text-lg">{server.serverName}</h3>
                    <span className="flex items-center gap-1 text-xs text-text-muted font-mono">
                      <Users size={11} /> {server.memberCount}
                    </span>
                  </div>
                  <p className="text-xs text-indigo-400 mb-2">aangemeld door @{server.user.username}</p>
                  <p className="text-xs text-text-muted mb-2">
                    <span className="text-text-faint">Focus:</span> {server.focus}
                  </p>
                  <p className="text-sm text-text-muted line-clamp-2 mb-4">{server.description}</p>
                  <a href={server.inviteUrl} target="_blank" rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-sm px-4 py-2 bg-indigo-600/20 text-indigo-400 border border-indigo-600/30 rounded-lg hover:bg-indigo-600/30 transition-colors font-medium">
                    <MessageCircle size={14} /> Join Server
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
