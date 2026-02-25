export const dynamic = 'force-dynamic'
// src/app/api/discord/apply/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const { serverName, inviteUrl, description, memberCount, focus } = await req.json()

    if (!serverName || !inviteUrl || !description || !memberCount || !focus) {
      return NextResponse.json({ error: 'Vul alle velden in' }, { status: 400 })
    }
    if (!inviteUrl.startsWith('https://discord.gg/') && !inviteUrl.startsWith('https://discord.com/invite/')) {
      return NextResponse.json({ error: 'Voer een geldige Discord invite link in' }, { status: 400 })
    }

    // Check for existing pending application
    const existing = await prisma.discordApplication.findFirst({
      where: { userId: session.user.id, status: 'PENDING' },
    })
    if (existing) {
      return NextResponse.json({ error: 'Je hebt al een openstaande aanvraag' }, { status: 409 })
    }

    const application = await prisma.discordApplication.create({
      data: {
        serverName,
        inviteUrl,
        description,
        memberCount,
        focus,
        userId: session.user.id,
      },
    })

    return NextResponse.json({ id: application.id }, { status: 201 })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Er ging iets mis' }, { status: 500 })
  }
}
