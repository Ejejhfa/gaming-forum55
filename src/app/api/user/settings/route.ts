export const dynamic = 'force-dynamic'
// src/app/api/user/settings/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function PATCH(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { name, bio, gamertag } = await req.json()
  const user = await prisma.user.update({
    where: { id: session.user.id },
    data: {
      ...(name && { name: name.trim() }),
      ...(bio !== undefined && { bio: bio.trim() }),
      ...(gamertag !== undefined && { gamertag: gamertag.trim() || null }),
    },
  })

  return NextResponse.json({ id: user.id })
}
