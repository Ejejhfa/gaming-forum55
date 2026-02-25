export const dynamic = 'force-dynamic'
// src/app/api/auth/register/route.ts
import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { prisma } from '@/lib/prisma'

export async function POST(req: NextRequest) {
  try {
    const { name, username, email, password, gamertag } = await req.json()

    if (!name || !username || !email || !password) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }
    if (password.length < 6) {
      return NextResponse.json({ error: 'Password must be at least 6 characters' }, { status: 400 })
    }
    if (username.length < 3 || !/^[a-zA-Z0-9_]+$/.test(username)) {
      return NextResponse.json({ error: 'Username must be 3+ characters (letters, numbers, underscore)' }, { status: 400 })
    }

    const exists = await prisma.user.findFirst({
      where: { OR: [{ email }, { username }] },
    })
    if (exists) {
      return NextResponse.json({ error: 'Email or username already taken' }, { status: 409 })
    }

    const hashedPassword = await bcrypt.hash(password, 12)
    const user = await prisma.user.create({
      data: { name, username, email, password: hashedPassword, gamertag: gamertag || null },
    })

    return NextResponse.json({ id: user.id, username: user.username }, { status: 201 })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
