# Prestolet — Claude Code Guide

Property management platform for prestolet.co.uk. Node.js app deployed to Plesk via FTP/file transfer.

## What it is

Prestolet repackages Guesty (a property management SaaS) into a branded customer portal.
Customers never touch Guesty directly — they interact with Prestolet's UI, which calls the Guesty API on their behalf.

**Business phases:**
1. **Lettings** (current focus) — multi-channel property listing via Guesty + cleaner coordination
2. **Glamping / land acquisition** — future phase, fishing for unused land to develop

## Stack

- **Runtime**: Node.js
- **Framework**: Next.js (App Router) — handles frontend + API routes in one process
- **Database**: PostgreSQL (Plesk-hosted)
- **ORM**: Prisma
- **Styling**: Tailwind CSS
- **SMS**: Twilio (cleaner booking notifications)
- **Auth**: NextAuth.js (customer + cleaner + admin roles)
- **Deployment**: Plesk — build locally, transfer files, run with PM2

## Structure

```
apps/web/         — Next.js app
  src/app/        — App Router pages
    (auth)/       — Login, register
    dashboard/    — Customer portal (Guesty insights)
    onboarding/   — Property submission form
    cleaners/     — Cleaner portal (availability, calendar)
    admin/        — Internal admin
    api/          — API route handlers
  src/lib/
    guesty.ts     — Guesty API client (all Guesty calls go here)
    db.ts         — Prisma client singleton
    sms.ts        — Twilio SMS wrapper
  src/types/      — Shared TypeScript types
prisma/
  schema.prisma   — Database schema
```

## Key integrations

### Guesty API
- All calls go through `src/lib/guesty.ts` — never call Guesty directly in components
- Property onboarding pushes: photos, expected rates, property type, address → Guesty
- Customer dashboard pulls: revenue to date, occupancy %, dynamic pricing effectiveness
- Centralised calendar syncs across all booking channels Guesty manages

### Cleaner portal
- Cleaners register with a service provider account (separate role from customers)
- They set: coverage area + available dates
- Customers see cleaner availability for upcoming bookings
- On new booking: Twilio SMS fires to available cleaners → cleaner confirms/declines
- Confirmation status shown to customer in their dashboard

## Key decisions

- **Guesty is the source of truth** for property listings and calendar — never duplicate that data in our DB unnecessarily
- **Our DB stores**: users, roles, cleaner profiles, cleaner availability, SMS confirmation logs
- **Never expose Guesty credentials or API keys to the client** — all Guesty calls are server-side only
- **SMS via Twilio** — one text per booking per cleaner, with a reply webhook to capture confirmation

## Deployment (Plesk)

- Build: `npm run build`
- Transfer built files to Plesk server
- Run with PM2: `pm2 start npm --name prestolet -- start`
- Environment variables set in Plesk's Node.js app config panel

## Environment variables

```
DATABASE_URL=           # PostgreSQL connection string
NEXTAUTH_SECRET=        # Random secret for NextAuth
NEXTAUTH_URL=           # https://prestolet.co.uk
GUESTY_CLIENT_ID=       # Guesty OAuth client ID
GUESTY_CLIENT_SECRET=   # Guesty OAuth client secret
TWILIO_ACCOUNT_SID=     # Twilio account SID
TWILIO_AUTH_TOKEN=      # Twilio auth token
TWILIO_PHONE_NUMBER=    # Twilio sending number
```
