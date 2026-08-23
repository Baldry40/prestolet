import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { db } from '@/lib/db'

export async function POST(req: NextRequest) {
  try {
    const { name, email, password, role } = await req.json() as {
      name: string
      email: string
      password: string
      role: string
    }

    if (!name || !email || !password) {
      return NextResponse.json({ error: 'Name, email, and password are required.' }, { status: 400 })
    }

    if (password.length < 8) {
      return NextResponse.json({ error: 'Password must be at least 8 characters.' }, { status: 400 })
    }

    const exists = await db.user.findUnique({ where: { email } })
    if (exists) {
      return NextResponse.json({ error: 'Email already registered.' }, { status: 409 })
    }

    const passwordHash = await bcrypt.hash(password, 12)
    const user = await db.user.create({
      data: {
        name,
        email,
        passwordHash,
        role: role === 'CLEANER' ? 'CLEANER' : 'CUSTOMER',
      },
    })

    // If cleaner, create an empty profile so the cleaner portal works
    if (role === 'CLEANER') {
      await db.cleanerProfile.create({
        data: {
          userId: user.id,
          phone: '',
          coverageAreas: [],
        },
      })
    }

    return NextResponse.json({ id: user.id }, { status: 201 })
  } catch (err) {
    console.error('Register error:', err)
    return NextResponse.json({ error: 'Internal server error.', detail: String(err) }, { status: 500 })
  }
}
