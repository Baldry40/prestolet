'use client'
import { signOut } from 'next-auth/react'

export default function DashboardSignOut() {
  return (
    <button
      onClick={() => signOut({ callbackUrl: '/' })}
      className="text-sm px-3 py-1.5 border border-gray-300 text-gray-600 rounded-lg hover:bg-gray-50 transition"
    >
      Sign out
    </button>
  )
}
