// Single source of truth for the password rule. MUST match the Clerk
// dashboard password settings (Configure → password policy): Clerk enforces
// its own minimum server-side, so if these two disagree users see a lie on
// the form and a rejection from Clerk. Lower the dashboard number and this
// constant together.
export const MIN_PASSWORD_LENGTH = 15;
