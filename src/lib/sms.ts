import twilio from 'twilio'

const client = twilio(
  process.env.TWILIO_ACCOUNT_SID!,
  process.env.TWILIO_AUTH_TOKEN!
)

export async function sendSms(to: string, body: string) {
  return client.messages.create({
    from: process.env.TWILIO_PHONE_NUMBER!,
    to,
    body,
  })
}

export function buildCleanerNotification({
  cleanerName,
  propertyName,
  bookingDate,
  checkoutDate,
}: {
  cleanerName: string
  propertyName: string
  bookingDate: string
  checkoutDate: string
}) {
  return (
    `Hi ${cleanerName}, a cleaning job is available at ${propertyName}.\n` +
    `Guest checks out: ${checkoutDate}.\n` +
    `Reply YES to confirm or NO to decline.\n` +
    `- Prestolet`
  )
}
