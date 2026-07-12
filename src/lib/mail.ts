import nodemailer from 'nodemailer'

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
})

export async function sendNewPropertyAlert(property: {
  name: string
  address: string
  postcode: string
  type: string
  bedrooms: number
  bathrooms: number
  expectedRate: string | number
  ownerName: string
  ownerEmail: string
}) {
  if (!process.env.GMAIL_USER || !process.env.GMAIL_APP_PASSWORD) return

  await transporter.sendMail({
    from: `Prestolet <${process.env.GMAIL_USER}>`,
    to: process.env.GMAIL_USER,
    subject: `New property submission: ${property.name}`,
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #226840;">New property submitted</h2>
        <p>A new property is awaiting review in your admin panel.</p>
        <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
          <tr><td style="padding: 8px; color: #666; width: 140px;">Property name</td><td style="padding: 8px; font-weight: bold;">${property.name}</td></tr>
          <tr style="background:#f9f9f9"><td style="padding: 8px; color: #666;">Address</td><td style="padding: 8px;">${property.address}, ${property.postcode}</td></tr>
          <tr><td style="padding: 8px; color: #666;">Type</td><td style="padding: 8px;">${property.type}</td></tr>
          <tr style="background:#f9f9f9"><td style="padding: 8px; color: #666;">Bedrooms</td><td style="padding: 8px;">${property.bedrooms}</td></tr>
          <tr><td style="padding: 8px; color: #666;">Expected rate</td><td style="padding: 8px;">£${property.expectedRate}/night</td></tr>
          <tr style="background:#f9f9f9"><td style="padding: 8px; color: #666;">Owner</td><td style="padding: 8px;">${property.ownerName} (${property.ownerEmail})</td></tr>
        </table>
        <a href="${process.env.NEXTAUTH_URL}/admin" style="display: inline-block; background: #226840; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: bold;">
          Review in admin panel →
        </a>
      </div>
    `,
  })
}
