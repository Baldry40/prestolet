import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { db } from '@/lib/db'

export async function POST(req: NextRequest) {
  try {
    const { token, password } = await req.json() as { token: string; password: string }

    if (!token || !password) return NextResponse.json({ error: 'Token and password required.' }, { status: 400 })
    if (password.length < 8) return NextResponse.json({ error: 'Password must be at least 8 characters.' }, { status: 400 })

    const record = await db.passwordResetToken.findUnique({ where: { token } })

    if (!record || record.usedAt || record.expiresAt < new Date()) {
      return NextResponse.json({ error: 'This reset link is invalid or has expired.' }, { status: 400 })
    }

    const passwordHash = await bcrypt.hash(password, 12)

    await db.$transaction([
      db.user.update({ where: { id: record.userId }, data: { passwordHash } }),
      db.passwordResetToken.update({ where: { id: record.id }, data: { usedAt: new Date() } }),
    ])

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('Reset password error:', err)
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 })
  }
}
