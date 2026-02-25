export const dynamic = 'force-dynamic'
// src/app/api/streamers/apply/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const { name, twitchUrl, youtubeUrl, tiktokUrl, description, games, followers } = await req.json()

    if (!name || !description || !games || !followers) {
      return NextResponse.json({ error: 'Vul alle verplichte velden in' }, { status: 400 })
    }
    if (!twitchUrl && !youtubeUrl && !tiktokUrl) {
      return NextResponse.json({ error: 'Voeg minimaal één streamlink toe' }, { status: 400 })
    }

    // Check for existing pending application
    const existing = await prisma.streamerApplication.findFirst({
      where: { userId: session.user.id, status: 'PENDING' },
    })
    if (existing) {
      return NextResponse.json({ error: 'Je hebt al een openstaande aanvraag' }, { status: 409 })
    }

    const application = await prisma.streamerApplication.create({
      data: {
        name,
        twitchUrl: twitchUrl || null,
        youtubeUrl: youtubeUrl || null,
        tiktokUrl: tiktokUrl || null,
        description,
        games,
        followers,
        userId: session.user.id,
      },
    })

    return NextResponse.json({ id: application.id }, { status: 201 })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Er ging iets mis' }, { status: 500 })
  }
}
