'use server'

import { Resend } from 'resend'

// ─── Resend client (lazy init, graceful degradation) ─────────
let _resend: Resend | null = null

function getResend(): Resend | null {
  if (!process.env.RESEND_API_KEY) return null
  if (!_resend) _resend = new Resend(process.env.RESEND_API_KEY)
  return _resend
}

const FROM = process.env.RESEND_FROM_EMAIL || 'CINEGENY <noreply@cinegeny.studio>'

// ─── Generic send (logs in dev, sends in prod) ──────────────
async function send(to: string, subject: string, html: string): Promise<boolean> {
  const resend = getResend()
  if (!resend) {
    console.log(`[EMAIL][DEV] To: ${to} | Subject: ${subject}`)
    return true
  }
  try {
    await resend.emails.send({ from: FROM, to, subject, html })
    return true
  } catch (err) {
    console.error('[EMAIL] Send failed:', err)
    return false
  }
}

// ─── Shared layout wrapper ──────────────────────────────────
function layout(title: string, body: string): string {
  return `<!DOCTYPE html>
<html lang="fr">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width"><title>${title}</title></head>
<body style="margin:0;padding:0;background:#0A0A0A;font-family:'Helvetica Neue',Arial,sans-serif;color:#ffffff;">
  <div style="max-width:600px;margin:0 auto;padding:40px 20px;">
    <!-- Logo -->
    <div style="text-align:center;margin-bottom:32px;">
      <span style="font-size:28px;font-weight:700;color:#E50914;letter-spacing:1px;">CINEGENY</span>
      <span style="font-size:12px;display:block;color:#ffffff60;margin-top:2px;">STUDIO</span>
    </div>
    <!-- Content -->
    <div style="background:#111111;border:1px solid #ffffff10;border-radius:16px;padding:32px;margin-bottom:24px;">
      ${body}
    </div>
    <!-- Footer -->
    <div style="text-align:center;color:#ffffff30;font-size:12px;line-height:1.5;">
      <p>CINEGENY Studio SAS — Paris, France</p>
      <p><a href="https://cinegeny.studio" style="color:#E50914;text-decoration:none;">cinegeny.studio</a></p>
    </div>
  </div>
</body>
</html>`
}

function goldButton(text: string, href: string): string {
  return `<a href="${href}" style="display:inline-block;padding:14px 32px;background:#E50914;color:#000000;font-weight:700;font-size:14px;text-decoration:none;border-radius:12px;margin:16px 0;">${text}</a>`
}

// ─── Email Templates ─────────────────────────────────────────

/** Welcome email sent after registration (with optional verification link) */
export async function sendWelcomeEmail(to: string, displayName: string, verificationToken?: string): Promise<boolean> {
  const baseUrl = process.env.NEXTAUTH_URL || 'https://cinegeny.studio'
  const verifySection = verificationToken
    ? `
    <div style="text-align:center;margin-bottom:24px;">
      ${goldButton('Verify my email', `${baseUrl}/verify-email?token=${verificationToken}`)}
    </div>
    <p style="color:#ffffff60;font-size:13px;margin:0 0 24px;text-align:center;">
      This link expires in <strong>24 hours</strong>.
    </p>`
    : ''

  const html = layout('Welcome to CINEGENY', `
    <h1 style="font-size:24px;margin:0 0 16px;color:#E50914;">Welcome, ${displayName}!</h1>
    <p style="color:#ffffffcc;line-height:1.6;margin:0 0 16px;">
      You are now part of the CINEGENY community — the first AI-powered collaborative film studio.
    </p>
    ${verifySection}
    <p style="color:#ffffffcc;line-height:1.6;margin:0 0 24px;">
      Explore films in production, contribute your talents, and earn rewards for every validated task.
    </p>
    <div style="text-align:center;">
      ${goldButton('Discover films', `${baseUrl}/films`)}
    </div>
    <div style="margin-top:24px;padding-top:20px;border-top:1px solid #ffffff10;">
      <p style="color:#ffffff60;font-size:13px;margin:0;">
        Complete your profile and skills to get personalized task recommendations.
      </p>
    </div>
  `)
  return send(to, 'Welcome to CINEGENY', html)
}

/** Password reset email */
export async function sendPasswordResetEmail(to: string, token: string): Promise<boolean> {
  const baseUrl = process.env.NEXTAUTH_URL || 'https://cinegeny.studio'
  const resetUrl = `${baseUrl}/reset-password?token=${token}`
  const html = layout('Password reset', `
    <h1 style="font-size:24px;margin:0 0 16px;color:#E50914;">Forgot your password?</h1>
    <p style="color:#ffffffcc;line-height:1.6;margin:0 0 16px;">
      You requested a password reset. Click the button below to choose a new one.
    </p>
    <div style="text-align:center;">
      ${goldButton('Reset my password', resetUrl)}
    </div>
    <p style="color:#ffffff60;font-size:13px;margin:24px 0 0;line-height:1.5;">
      This link expires in <strong>1 hour</strong>. If you did not request this, please ignore this email.
    </p>
  `)
  return send(to, 'Reset your password — CINEGENY', html)
}

/** Task validated — payment coming */
export async function sendTaskValidatedEmail(
  to: string,
  displayName: string,
  taskTitle: string,
  filmTitle: string,
  amountEur: number
): Promise<boolean> {
  const html = layout('Task validated', `
    <h1 style="font-size:24px;margin:0 0 16px;color:#E50914;">Well done, ${displayName}! 🎬</h1>
    <p style="color:#ffffffcc;line-height:1.6;margin:0 0 16px;">
      Your contribution has been successfully validated.
    </p>
    <div style="background:#0A0A0A;border:1px solid #E50914/20;border-radius:12px;padding:20px;margin:16px 0;">
      <p style="margin:0 0 8px;color:#ffffff80;font-size:13px;">Task</p>
      <p style="margin:0 0 12px;color:#fff;font-weight:600;">${taskTitle}</p>
      <p style="margin:0 0 8px;color:#ffffff80;font-size:13px;">Film</p>
      <p style="margin:0 0 12px;color:#fff;font-weight:600;">${filmTitle}</p>
      <p style="margin:0 0 8px;color:#ffffff80;font-size:13px;">Compensation</p>
      <p style="margin:0;color:#E50914;font-weight:700;font-size:20px;">$${amountEur.toFixed(2)}</p>
    </div>
    <div style="text-align:center;">
      ${goldButton('View my earnings', 'https://cinegeny.studio/dashboard/earnings')}
    </div>
  `)
  return send(to, `Task validated — $${amountEur.toFixed(2)} credited`, html)
}

/** Payment processed */
export async function sendPaymentEmail(
  to: string,
  displayName: string,
  amountEur: number,
  method: string
): Promise<boolean> {
  const html = layout('Payment completed', `
    <h1 style="font-size:24px;margin:0 0 16px;color:#E50914;">Payment sent 💰</h1>
    <p style="color:#ffffffcc;line-height:1.6;margin:0 0 16px;">
      ${displayName}, your payment has been processed successfully.
    </p>
    <div style="background:#0A0A0A;border-radius:12px;padding:20px;margin:16px 0;text-align:center;">
      <p style="margin:0 0 4px;color:#ffffff80;font-size:13px;">Montant</p>
      <p style="margin:0 0 12px;color:#E50914;font-weight:700;font-size:28px;">$${amountEur.toFixed(2)}</p>
      <p style="margin:0;color:#ffffff60;font-size:13px;">via ${method}</p>
    </div>
    <div style="text-align:center;">
      ${goldButton('View history', 'https://cinegeny.studio/dashboard/earnings')}
    </div>
  `)
  return send(to, `Payment of $${amountEur.toFixed(2)} sent`, html)
}

/** Screenplay accepted — deal proposed */
export async function sendScreenplayAcceptedEmail(
  to: string,
  displayName: string,
  screenplayTitle: string,
  revenueSharePct: number
): Promise<boolean> {
  const html = layout('Screenplay accepted', `
    <h1 style="font-size:24px;margin:0 0 16px;color:#E50914;">Congratulations, ${displayName}! 📝</h1>
    <p style="color:#ffffffcc;line-height:1.6;margin:0 0 16px;">
      Your screenplay <strong>"${screenplayTitle}"</strong> has been selected for production.
    </p>
    <div style="background:#0A0A0A;border-radius:12px;padding:20px;margin:16px 0;">
      <p style="margin:0 0 8px;color:#ffffff80;font-size:13px;">Your revenue share</p>
      <p style="margin:0 0 12px;color:#E50914;font-weight:700;font-size:24px;">${revenueSharePct}%</p>
      <p style="color:#ffffff60;font-size:13px;margin:0;">
        You will receive ${revenueSharePct}% of all revenue generated by the film (streaming, VOD, licensing).
        A detailed contract will be offered to you.
      </p>
    </div>
    <div style="text-align:center;">
      ${goldButton('View my screenplay', 'https://cinegeny.studio/screenplays')}
    </div>
  `)
  return send(to, `Screenplay "${screenplayTitle}" accepted — Deal offered`, html)
}

/** Weekly digest (summary of activity) */
export async function sendWeeklyDigest(
  to: string,
  displayName: string,
  stats: { tasksCompleted: number; lumensEarned: number; newFilms: number }
): Promise<boolean> {
  const html = layout('Weekly summary', `
    <h1 style="font-size:24px;margin:0 0 16px;color:#E50914;">This week on CINEGENY</h1>
    <p style="color:#ffffffcc;line-height:1.6;margin:0 0 24px;">
      Hi ${displayName}, here is your activity summary.
    </p>
    <div style="display:flex;gap:12px;margin:16px 0;">
      <div style="flex:1;background:#0A0A0A;border-radius:12px;padding:16px;text-align:center;">
        <p style="margin:0;color:#E50914;font-weight:700;font-size:24px;">${stats.tasksCompleted}</p>
        <p style="margin:4px 0 0;color:#ffffff60;font-size:12px;">Tasks</p>
      </div>
      <div style="flex:1;background:#0A0A0A;border-radius:12px;padding:16px;text-align:center;">
        <p style="margin:0;color:#E50914;font-weight:700;font-size:24px;">${stats.lumensEarned}</p>
        <p style="margin:4px 0 0;color:#ffffff60;font-size:12px;">Lumens</p>
      </div>
      <div style="flex:1;background:#0A0A0A;border-radius:12px;padding:16px;text-align:center;">
        <p style="margin:0;color:#E50914;font-weight:700;font-size:24px;">${stats.newFilms}</p>
        <p style="margin:4px 0 0;color:#ffffff60;font-size:12px;">New films</p>
      </div>
    </div>
    <div style="text-align:center;margin-top:24px;">
      ${goldButton('Open the Dashboard', 'https://cinegeny.studio/dashboard')}
    </div>
  `)
  return send(to, `Your CINEGENY week — ${stats.tasksCompleted} tasks, ${stats.lumensEarned} Lumens`, html)
}
