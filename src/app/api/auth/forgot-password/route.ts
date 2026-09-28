import { NextRequest, NextResponse } from 'next/server'
import { randomBytes } from 'crypto'
import { db } from '@/lib/db'
import { sendPasswordResetEmail } from '@/lib/mail'

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json() as { email: string }
    if (!email) return NextResponse.json({ error: 'Email required.' }, { status: 400 })

    const user = await db.user.findUnique({ where: { email } })

    // Always return success to avoid revealing whether the email exists
    if (!user) return NextResponse.json({ ok: true })

    const token = randomBytes(32).toString('hex')
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000) // 1 hour

    await db.passwordResetToken.create({
      data: { token, userId: user.id, expiresAt },
    })

    const resetUrl = `${process.env.NEXTAUTH_URL}/auth/reset-password?token=${token}`
    await sendPasswordResetEmail(email, resetUrl)

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('Forgot password error:', err)
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 })
  }
}
