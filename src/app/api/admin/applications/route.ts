// src/app/api/admin/applications/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function PATCH(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session || session.user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
  }

  try {
    const { id, type, status } = await req.json()
    // type: 'streamer' | 'discord'
    // status: 'APPROVED' | 'REJECTED'

    if (type === 'streamer') {
      const app = await prisma.streamerApplication.update({
        where: { id },
        data: { status },
        include: { user: { select: { username: true } } },
      })

      // If approved, create a forum post automatically
      if (status === 'APPROVED') {
        const category = await prisma.category.findFirst({ where: { slug: 'general' } })
        if (category) {
          const slug = `streamer-${app.name.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}`
          await prisma.post.create({
            data: {
              title: `🎥 Nieuwe Streamer: ${app.name}`,
              slug,
              content: `Welkom aan onze nieuwste community streamer **${app.name}**!\n\n${app.description}\n\n**Games:** ${app.games}\n**Volgers:** ${app.followers}\n\n${app.twitchUrl ? `🟣 [Twitch](${app.twitchUrl})\n` : ''}${app.youtubeUrl ? `🔴 [YouTube](${app.youtubeUrl})\n` : ''}${app.tiktokUrl ? `🎵 [TikTok](${app.tiktokUrl})\n` : ''}\n\nGeef ze een warm welkom! 🎮`,
              authorId: app.userId,
              categoryId: category.id,
            },
          })
        }
      }

      return NextResponse.json({ ok: true })
    }

    if (type === 'discord') {
      const app = await prisma.discordApplication.update({
        where: { id },
        data: { status },
        include: { user: { select: { username: true } } },
      })

      // If approved, create a forum post automatically
      if (status === 'APPROVED') {
        const category = await prisma.category.findFirst({ where: { slug: 'general' } })
        if (category) {
          const slug = `discord-${app.serverName.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}`
          await prisma.post.create({
            data: {
              title: `💬 Discord Server: ${app.serverName}`,
              slug,
              content: `**${app.serverName}** is nu te vinden op onze Discord servers pagina!\n\n${app.description}\n\n**Focus:** ${app.focus}\n**Leden:** ${app.memberCount}\n\n[🔗 Join de server](${app.inviteUrl})`,
              authorId: app.userId,
              categoryId: category.id,
            },
          })
        }
      }

      return NextResponse.json({ ok: true })
    }

    return NextResponse.json({ error: 'Ongeldig type' }, { status: 400 })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Er ging iets mis' }, { status: 500 })
  }
}
