const { execSync } = require('child_process')
const { createServer } = require('http')
const { parse } = require('url')
const next = require('next')
const fs = require('fs')
const path = require('path')

// Kill any lingering next dev server before starting production
try { execSync('pkill -f "next dev"', { stdio: 'ignore' }) } catch {}

// Remove the dev lock file Next.js uses to detect running dev servers
const devDir = path.join(__dirname, '.next', 'dev')
if (fs.existsSync(devDir)) {
  fs.rmSync(devDir, { recursive: true, force: true })
}

const port = parseInt(process.env.PORT, 10) || 3000
const dev = process.env.NODE_ENV !== 'production'

const app = next({ dev })
const handle = app.getRequestHandler()

app.prepare().then(() => {
  createServer((req, res) => {
    const parsedUrl = parse(req.url, true)
    handle(req, res, parsedUrl)
  }).listen(port, () => {
    console.log(`> Prestolet ready on port ${port}`)
  })
})
