// LiGN Confidentiality and Connection Agreement — versioned source of truth.
// The UI renders AGREEMENT_TEXT; the backend snapshots it into each
// acceptance record. Never edit a published version: add a new one and bump
// AGREEMENT_VERSION instead — history must stay immutable.

export const AGREEMENT_VERSION = "1.0";

export const AGREEMENT_TITLE = "LiGN Confidentiality and Connection Agreement";

export const AGREEMENT_TEXT = `LiGN Confidentiality and Connection Agreement

By creating a LiGN account, you agree to the following terms:

1. Confidentiality and Privacy

Conversations and personal information shared through LiGN must be treated as private. You must not share, publish, distribute, reproduce, or otherwise disclose another user's conversations, messages, personal details, or other private information outside LiGN without their explicit consent.

2. Prohibition of Exploitation

You must not use another person's conversations, personal experiences, vulnerabilities, or disclosures for personal gain, financial benefit, public consumption, entertainment, content creation, or monetization without their explicit consent. This includes sharing conversations or identifiable details on social media, in public forums, or through other channels for such purposes.

3. Respectful and Voluntary Connection

LiGN is a space for genuine, platonic human connection. By participating, you acknowledge that connections are voluntary acts of sharing, unburdening, care, and being present for another person. You agree to approach conversations with empathy, respect, and consideration for the other person's dignity, boundaries, and well-being.

4. No Pressure or Exploitation

You must not pressure, manipulate, threaten, or coerce another user into disclosing personal information, sharing experiences, continuing a conversation, or providing emotional support. Every user has the right to set boundaries, decline to answer questions, end a conversation, or disconnect at any time.

5. Emotional Support and Professional Help

LiGN provides opportunities for human connection and peer support. Conversations on LiGN are not a substitute for professional medical care, mental health services, counselling, therapy, or emergency assistance. Users must not misrepresent themselves as qualified professionals or present personal opinions as professional diagnoses or treatment.

6. Reporting and Enforcement

You may report violations of this agreement through LiGN's reporting system. LiGN may review reports and take appropriate action, including removing content, restricting account access, or suspending or terminating accounts, in accordance with its applicable policies and procedures.

7. Limits of Confidentiality

Although users are expected to respect one another's privacy, LiGN cannot guarantee that every user will honour this agreement or that information shared in a conversation will never be disclosed. LiGN may access, review, or disclose information where reasonably necessary for safety investigations, enforcement of its policies, compliance with applicable law, or other purposes explained in its Privacy Policy.

Agreement Confirmation

By ticking the checkbox below, you confirm that you have read, understood, and agree to abide by this Confidentiality and Connection Agreement.`;

// Scroll detection uses the container's real geometry with a 2px tolerance
// for rounding. Clicking, waiting, or partial scrolling never satisfies it.
export function hasReachedBottom(scrollTop: number, clientHeight: number, scrollHeight: number): boolean {
  if (scrollHeight <= clientHeight) return true; // whole text visible: no scroll needed
  return scrollTop + clientHeight >= scrollHeight - 2;
}

// Backend gate: only the currently required version counts. Anything else
// (missing, outdated, unapproved) rejects account creation.
export function acceptanceValid(claimed: unknown): claimed is string {
  return claimed === AGREEMENT_VERSION;
}

// A new version requires separate acceptance; history is never overwritten.
export function needsReaccept(userVersion: string | null | undefined): boolean {
  return userVersion !== AGREEMENT_VERSION;
}

export interface AcceptanceRecordInput {
  userId: string;
  version: string;
  textSnapshot: string;
  acceptedAt: Date;
  status: "accepted";
}

// Shape check for what gets persisted (server timestamp, exact text).
export function buildAcceptanceRecord(userId: string, now: Date): AcceptanceRecordInput {
  return {
    userId,
    version: AGREEMENT_VERSION,
    textSnapshot: AGREEMENT_TEXT,
    acceptedAt: now,
    status: "accepted",
  };
}
