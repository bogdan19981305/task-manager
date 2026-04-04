export type WelcomeEmailTemplateParams = {
  /** Display name from registration */
  name: string;
  /** Optional absolute URL to open the app (e.g. dashboard) */
  appUrl?: string;
};

const APP_NAME = 'Task Manager';

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function greetingName(name: string): string {
  const t = name.trim();
  if (!t) return 'there';
  return t.split(/\s+/)[0] ?? t;
}

/**
 * HTML welcome email — layout and colors aligned with frontend light theme
 * (neutral foreground, #171717 primary, muted grays, ~10px radius).
 */
export function buildWelcomeEmailHtml(
  params: WelcomeEmailTemplateParams,
): string {
  const first = escapeHtml(greetingName(params.name));
  const appUrl = params.appUrl?.trim();
  const safeUrl = appUrl ? escapeHtml(appUrl) : '';

  const ctaRow =
    appUrl && safeUrl
      ? `
  <tr>
    <td style="padding: 8px 40px 40px 40px;">
      <table role="presentation" cellspacing="0" cellpadding="0" border="0" align="center">
        <tr>
          <td style="border-radius: 10px; background-color: #171717;">
            <a href="${safeUrl}" target="_blank" rel="noopener noreferrer"
              style="display: inline-block; padding: 14px 28px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; font-size: 15px; font-weight: 600; color: #fafafa; text-decoration: none; border-radius: 10px;">
              Open ${escapeHtml(APP_NAME)}
            </a>
          </td>
        </tr>
      </table>
    </td>
  </tr>`
      : '';

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="x-ua-compatible" content="ie=edge">
  <title>Welcome to ${escapeHtml(APP_NAME)}</title>
  <!--[if mso]>
  <noscript>
    <xml>
      <o:OfficeDocumentSettings><o:PixelsPerInch>96</o:PixelsPerInch></o:OfficeDocumentSettings>
    </xml>
  </noscript>
  <![endif]-->
</head>
<body style="margin:0;padding:0;background-color:#f5f5f5;-webkit-text-size-adjust:100%;-ms-text-size-adjust:100%;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color:#f5f5f5;">
    <tr>
      <td align="center" style="padding: 40px 16px;">
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="max-width: 560px; margin: 0 auto;">
          <tr>
            <td style="padding: 0 0 24px 0; text-align: center;">
              <span style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; font-size: 13px; font-weight: 600; letter-spacing: 0.06em; text-transform: uppercase; color: #737373;">
                ${escapeHtml(APP_NAME)}
              </span>
            </td>
          </tr>
          <tr>
            <td style="background-color: #ffffff; border: 1px solid #e5e5e5; border-radius: 12px; overflow: hidden; box-shadow: 0 1px 3px rgba(0,0,0,0.06);">
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
                <tr>
                  <td style="height: 4px; background-color: #171717; font-size: 0; line-height: 0;">&nbsp;</td>
                </tr>
                <tr>
                  <td style="padding: 40px 40px 12px 40px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;">
                    <h1 style="margin: 0; font-size: 24px; line-height: 1.25; font-weight: 600; color: #0a0a0a;">
                      Welcome, ${first}
                    </h1>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 0 40px 24px 40px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; font-size: 16px; line-height: 1.6; color: #404040;">
                    <p style="margin: 0 0 16px 0;">
                      Thanks for joining <strong style="color: #0a0a0a;">${escapeHtml(APP_NAME)}</strong> — your space to keep tasks clear and deadlines under control.
                    </p>
                    <p style="margin: 0;">
                      You can organize work, track progress, and stay focused with less noise. We’re glad you’re here.
                    </p>
                  </td>
                </tr>
                ${ctaRow}
                <tr>
                  <td style="padding: 0 40px 40px 40px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; font-size: 14px; line-height: 1.6; color: #737373; border-top: 1px solid #f5f5f5;">
                    <p style="margin: 24px 0 0 0;">
                      If you didn’t create this account, you can ignore this message.
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td style="padding: 28px 8px 0 8px; text-align: center; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; font-size: 12px; line-height: 1.5; color: #a3a3a3;">
              © ${new Date().getFullYear()} ${escapeHtml(APP_NAME)}
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

/** Plain-text fallback for clients that don’t render HTML */
export function buildWelcomeEmailText(
  params: WelcomeEmailTemplateParams,
): string {
  const first = greetingName(params.name);
  const appUrl = params.appUrl?.trim();
  const lines = [
    `Welcome, ${first}!`,
    '',
    `Thanks for joining ${APP_NAME}.`,
    '',
    'You can organize work, track progress, and stay focused with less noise. We’re glad you’re here.',
    '',
  ];
  if (appUrl) {
    lines.push(`Open the app: ${appUrl}`, '');
  }
  lines.push(
    'If you didn’t create this account, you can ignore this message.',
    '',
    `© ${new Date().getFullYear()} ${APP_NAME}`,
  );
  return lines.join('\n');
}

export const WELCOME_EMAIL_SUBJECT = `Welcome to ${APP_NAME}`;
