# The LiGN Network
## Implementation-Ready Product Requirements Document

**Product:** The LiGN Network  
**Purpose:** Reduce loneliness by making genuine human connection easier.  
**Primary experience:** Helping people find the right human connection for what they need right now.

---

# 1. Product Definition

LiGN is a platform for genuine, primarily platonic human connection.

People can use LiGN to:
- Chat casually
- Find a pen pal
- Vent or listen
- Find someone to check in with
- Build friendship
- Have deeper conversations
- Experience quiet companionship
- Share activities
- Join small temporary conversations

LiGN is **not primarily**:
- A dating app
- A social-media feed
- A popularity platform
- A therapist
- An emergency service
- An engagement-maximization product

The central product question is:

> **What kind of connection do you need right now?**

### Core difference

LiGN starts with **the kind of human connection someone needs**, rather than popularity, appearance, status, or dating potential.

It helps people find and develop genuine connections without turning connection into competition, performance, or dating.

---

# 2. Product Principles

### Human connection over engagement
Do not optimize for screen time, message volume, streaks, followers, popularity, or artificial engagement.

### Need before appearance
The reason someone wants connection should matter more than appearance or social status.

### Connection without pressure
Users can decline, pause, leave, change boundaries, remain private, and take their time without punishment or guilt.

### Progressive trust
Users reveal more about themselves as trust develops.

### Privacy by default
Information should only be visible when necessary and appropriately authorized.

### No forced positivity
LiGN can be warm and hopeful without dismissing difficult emotions.

### Human connection remains human
LiGN must never present AI as a human, pretend a human is available when one is not, or substitute AI for human connection without making the distinction clear.

### 1-on-1 is the heart
Small groups and temporary spaces are supported, but the primary experience is person-to-person connection.

---

# 3. Canonical Product Flow

The primary LiGN journey is:

**Need → Find → Connect → Evolve**

```text
Express current need
        ↓
Discovery / Matching
        ↓
Conversation
        ↓
Mutual Connection
        ↓
Continue / Pause / Archive / End
        ↓
Optional Reconnection
```

Other experiences such as listening, temporary spaces, shared activities, and saved connections must support this core loop rather than replace it as the primary product experience.

### Canonical user journey

**1. Find**  
Say what kind of connection you need right now and discover compatible people or small groups.

**2. Connect**  
Start naturally, communicate at your preferred pace, and gradually build trust.

**3. Evolve**  
The relationship can become an ongoing conversation, friendship, pen-pal relationship, shared activity, temporary interaction, or simply a meaningful moment.

The user can always pause, leave, end, or reconnect according to the applicable rules.

---

# 4. MVP Boundary

The initial build exists to validate one core hypothesis:

> **Can LiGN help someone who wants human connection find a suitable person and form a meaningful connection?**

Only features explicitly included in the MVP section may be implemented in the initial release.

Features marked as later releases must **not** be implemented unless explicitly requested.

Every MVP feature should either:
1. Help the user find human connection;
2. Help the user form or maintain that connection; or
3. Protect the user's privacy, safety, boundaries, or agency.

---

# 5. Account Identity

Each account represents one LiGN identity.

Users cannot maintain multiple separate personas or profiles on one account.

Privacy is supported through:
- Nicknames
- Pseudonyms
- Limited profile information
- Progressive disclosure
- Optional identity verification

One account does not require public disclosure of the user's legal identity.

---

# 6. Profile

A profile may contain:
- Name/nickname
- Age range
- Country/region
- Short bio
- Interests
- Personality questions
- Current needs
- Conversation style
- Conversation depth
- Availability
- Discussion boundaries
- Romantic boundaries
- Language preferences

The profile should answer:

> **Who are you, and how can we connect?**

Profiles are not popularity pages.

---

# 7. Photos and Appearance

Photos are optional.

Users may use avatars, illustrations, pseudonyms, or real photos.

Photos are not required for ordinary participation.

LiGN must not create:
- Photo ratings
- Appearance-based likes
- Attractiveness rankings
- Popularity leaderboards
- Appearance-based matching

---

# 8. Age, Identity and Verification

LiGN should collect enough age information to enforce applicable safety rules.

Verification may include:
- Age verification where necessary
- Optional identity verification
- Additional verification where safety/risk requires it

Verification information is private.

Verification must not become a public status competition.

**Safety restrictions always override matching preferences.**

---

# 9. Location and Time Zone

Location is primarily a matching preference.

Users may choose:
- Anywhere
- My country
- Nearby

Location can support:
- Matching
- Local activities
- Local communities
- Time-zone compatibility

Exact location must not be publicly exposed by default.

Users may optionally show their local time.

Exact location is never required for ordinary connection.

---

# 10. Connection Intentions

Supported connection intentions include:
- Casual chat
- Venting
- Listening
- Deep conversation
- Check-ins
- Friendship
- Pen pal
- Quiet companionship
- Shared activity
- “I need someone”

Users can select more than one.

The current need can change at any time.

---

# 11. Connection Duration

When appropriate, users may indicate:
- Quick chat
- Conversation for today
- Ongoing chat buddy
- Long-term pen pal
- See where it goes

These are expectations, not commitments.

Users can change them later.

---

# 12. Matching

Matching is based on compatibility with the user's **current connection need**.

The intended priority is:
1. Current need
2. Safety and eligibility
3. Availability
4. Conversation depth
5. Conversation style
6. Personality compatibility
7. Shared interests
8. Relevant life experience/situation
9. Language
10. Time zone
11. Location preference

The exact algorithm may evolve.

### Matching rules
- Safety and eligibility are hard filters.
- Compatibility signals are evaluated only after eligibility checks.
- Current need is the strongest compatibility signal.
- Blocked users must never be matched.
- Users unavailable for discovery must not be suggested.
- User-defined restrictions must be respected.
- Private or sensitive internal matching signals must not be exposed as match explanations.
- Matching must not prioritize popularity, appearance, follower count, engagement, or social status.
- Previously rejected, blocked, or otherwise prohibited users must not be repeatedly surfaced.
- The system must not fabricate a human match.

### No-match behavior

If a suitable human is unavailable, LiGN must be honest.

Possible alternatives:
- Broaden matching
- Try again later
- Listener queue
- Temporary space
- Shared activity
- Meaningful prompts/reflection

AI may assist with prompts or navigation but must never be presented as the human match.

---

# 13. Matching Eligibility

A user must not be suggested when:
- Either user has blocked the other
- An age-safety restriction prevents interaction
- A safety restriction prevents interaction
- Either account is unavailable for discovery
- A relevant user-set restriction makes the interaction inappropriate

Eligibility rules always run before compatibility scoring.

---

# 14. Discovery

Discovery may include:
- Matched people
- Connection suggestions
- Temporary spaces
- Small groups
- Shared activities

Users control discovery frequency:
- Daily
- Weekly
- Paused

Pausing discovery does not affect existing connections.

Discovery should help users **find conversations, not compete for attention**.

---

# 15. Availability

Availability answers:

> **Am I currently open to this kind of connection?**

Users can indicate availability for:
- Casual chat
- Venting/listening
- Deep conversation
- Pen pal
- Check-ins
- Quiet companionship

Users can define availability windows.

Exact online status is not publicly broadcast by default.

Availability is separate from:
- Account state
- Discovery state
- Connection state

---

# 16. Temporary Availability

Users can temporarily indicate:
- Need space
- Low energy
- Just listening
- Back later

Temporary states may automatically expire.

A temporary availability state does not end existing connections.

---

# 17. Account and Discovery State

These states must remain separate.

### Account
```text
ACTIVE
PAUSED
DELETED
```

### Discovery
```text
DISCOVERABLE
NOT_DISCOVERABLE
```

Therefore:

> An ACTIVE account may be NOT_DISCOVERABLE.

Long inactivity may remove a user from discovery without deleting their account.

---

# 18. Account Pause

When an account is paused:
- It is removed from new discovery.
- New connection requests are unavailable.
- Existing connections are preserved.
- Existing data remains according to retention rules.
- The user may specify a return period.
- Automatic restoration can occur when the selected period ends.

Pausing is reversible.

---

# 19. Conversation Preferences

### Pace
- Fast
- Natural
- Slow
- Asynchronous
- Pen pal

### Depth
- Light
- Moderate
- Deep

### Style
Examples:
- Talkative
- Quiet
- Playful
- Serious
- Listener
- Storyteller

Preferences may differ between connections.

---

# 20. Reply Expectations

Users may communicate:
- No rush
- Usually same day
- I may take days
- I prefer active chats

Delayed replies must not automatically be interpreted as rejection, dislike, abandonment, or loss of interest.

LiGN must avoid guilt-based messaging.

---

# 21. Starting Conversations

Conversation assistance is optional.

Tools may include:
- Icebreakers
- Shared-interest starters
- Personalized prompts
- Suggested replies
- Fresh starters
- “I’m not sure what to say”

Users can ignore these tools.

They must not become mandatory scripts.

---

# 22. Connection Requests

A connection request may include:
- Sender profile context
- Reason for connecting
- Optional personalized note

Recipients can:
- Accept
- Decline
- Ignore

Mutual connection requires interest from both users.

Repeated unwanted requests may become a safety concern.

---

# 23. Connection Lifecycle

All ongoing relationships use:

```text
STRANGER
    ↓
CONVERSATION
    ↓
MUTUAL_CONNECTION
    ↓
ACTIVE
    ↓
PAUSED
    ↓
ARCHIVED / ENDED
```

### Stranger
No established interaction.

### Conversation
Interaction has begun but an ongoing relationship has not been mutually established.

### Mutual Connection
Both users have indicated they want to continue.

### Active
The relationship is ongoing.

### Paused
One or both users temporarily need space.

### Archived
The relationship is retained but inactive.

### Ended
The relationship has intentionally ended.

---

# 24. Connection Actions

An active connection may be:
- Continued
- Paused
- Archived
- Scheduled
- Added to a recurring routine
- Ended

Users are never required to label a relationship “friendship.”

---

# 25. Accepted Connection

When a connection becomes mutual, LiGN provides a simple confirmation.

The user may then:
- Chat now
- Send a message
- Save for later
- Schedule time

No action occurs automatically.

---

# 26. Silence and Inactivity

Silence is normal.

LiGN may provide:
- Nothing
- A gentle reconnection suggestion
- A suggested message
- Automatic pause after prolonged inactivity

A reconnect prompt should only appear after a meaningful period of inactivity and must have frequency limits.

The system must never state or imply that silence means rejection or abandonment.

---

# 27. One-Sided Conversations

If interaction becomes consistently one-sided, LiGN may offer:
- Pause
- Need space
- End connection
- Reconnect later

No blame or public status is assigned.

---

# 28. Ending a Connection

Users can end a connection without explanation.

Optional reasons:
- Need space
- Not a good fit
- Boundary issue
- Connection naturally ended

An optional closing message may be sent.

Explanation is never required.

---

# 29. Reconnection

A previous relationship does not automatically reopen.

Reconnection requires mutual interest.

If a connection was intentionally ended:
- The person who ended it controls whether reconnection can be attempted.
- No surprise message is sent.
- The other person cannot bypass a reconnection restriction.

Users may choose:
- Allow reconnection
- Temporarily prevent reconnection
- Permanently prevent reconnection

The other person is not notified when reconnection is blocked.

---

# 30. Future Reconnection

A user may privately request a reminder to reconsider reconnecting:
- Later
- This week
- On a specific date
- Custom timeframe

The other person is not automatically notified.

---

# 31. Scheduling and Recurring Conversations

Users may schedule:
- Exact date/time
- Flexible period

They can:
- Reschedule
- Cancel
- Pause
- Change recurrence
- End recurrence

Missed conversations never create penalties, attendance scores, streak loss, or guilt notifications.

---

# 32. Venting and Listening

Support-oriented conversations provide:

### Just Listen
Primarily listening.

### Advice Welcome
Advice is permitted.

### I Don't Know What I Need
No predefined expectation.

These modes may change during the conversation.

Peer support must never be presented as professional mental-health care.

---

# 33. Listener Mode

Users may voluntarily enter Listener Mode.

Listeners can receive:
- Anonymous “I need someone” requests
- Time-limited listening sessions
- Support-oriented conversations

Listeners can leave at any time.

Listeners are not responsible for another user's safety.

---

# 34. “I Need Someone Right Now”

A user can request immediate human connection.

Routing may use:
1. Available 1-on-1 match
2. Listener queue
3. Small “Need Someone” room
4. Trusted Person shortcut

If no human is available, LiGN clearly says so.

No AI may be represented as the available human.

---

# 35. Quiet Companionship

Quiet companionship allows people to spend time together without continuous conversation.

Possible formats include:
- Text presence
- Optional voice
- Studying/working together
- Eating together
- Walking together
- Drawing together
- Listening to music
- Other shared activities

Sessions may be time-limited.

Continuous conversation is never required.

---

# 36. Shared Activities

Activities may include:
- Watching something
- Simple games
- Studying
- Working
- Eating
- Walking
- Drawing
- Listening to music
- Hanging out

Two discovery paths are supported:

**Match → Activity**

or

**Activity → Match**

Activities remain secondary to human connection.

---

# 37. Temporary Spaces

Users can create small temporary spaces.

Default:
- 3–8 participants
- Defined purpose
- Defined duration

Supported duration presets:
- 15 minutes
- 30 minutes
- 1 hour
- 2 hours

Custom duration may be supported within configured limits.

A temporary space:
- Automatically closes when its duration expires
- Can be ended early by its creator
- Can be left by participants at any time
- Must not become a permanent community by default

At minimum, implementation must define behavior for:
- Participant joining
- Participant leaving
- Creator leaving
- Early closure
- Expiration
- Reporting after closure

---

# 38. Post-Space Reconnection

After a temporary space ends, participants may privately indicate:

> **I’d like to talk to this person again.**

A new private connection is created only when interest is mutual.

Unilateral interest is not disclosed.

---

# 39. Groups and Community

Groups remain small, generally **3–8 people**.

Examples:
- Late-night chat
- Small book club
- Temporary boredom room
- Study session
- Shared activity

LiGN may provide a limited connection board for:
- Small discussions
- Temporary conversations
- Small-group opportunities
- Optional personal updates

It must not become an algorithmic global social feed.

---

# 40. Community Contribution

Users are not expected to:
- Host
- Welcome newcomers
- Create prompts
- Create activities
- Post regularly

Participation is not a social obligation.

---

# 41. Privacy and Progressive Disclosure

Information is disclosed progressively:

**Nickname → Basic Profile → Familiar Connection → Trusted Friend**

Users may voluntarily share:
- Phone number
- Email
- Social accounts
- Other contact details

External contact information is never required.

LiGN may show a privacy reminder before sharing potentially sensitive contact information.

Repeated requests after refusal may be treated as a boundary issue.

---

# 42. Discussion Boundaries

Users can define:
- Comfortable topics
- Sensitive topics
- Off-limits topics

Boundaries can vary by connection and can change at any time.

Possible boundaries:
- Do not ask for my number
- No social-media requests
- No romantic/sexual conversation
- No unsolicited advice
- Short conversation only
- Respect my privacy

---

# 43. Romantic Boundaries

LiGN is platonic by default.

Users may indicate:
- Friends only
- Open to friendship becoming more
- Not interested in romance
- Not sure

There is no dedicated dating mode in the initial product.

Natural feelings are not automatically treated as misconduct.

Pressure, harassment, unwanted sexual behavior, or refusal to respect boundaries remain safety issues.

---

# 44. Trust

Trust develops through:
- Time
- Consistency
- Respect
- Boundary behavior
- Positive interaction

Optional private feedback may include:
- Respectful
- Good listener
- Friendly
- Respects boundaries
- Made me uncomfortable

This feedback must not become a public score.

There are no public trust scores, public ratings, leaderboards, popular-user rankings, or follower counts.

---

# 45. Conflict and Repair

Users can select:

> **Something feels off**

Possible actions:
- Clarify
- Set a boundary
- Pause
- Leave
- Report

LiGN may suggest repair options but never requires reconciliation.

---

# 46. Apologies and Rebuilding Trust

Users may send an apology that:
- Clearly acknowledges what happened
- Acknowledges harm
- Does not demand forgiveness

The recipient may:
- Accept
- Ignore
- Acknowledge
- Continue
- Leave

An apology does not erase a report or safety record.

After a conflict, users may continue with lower-trust boundaries, reduced disclosure, or normal interaction.

Trust is rebuilt through consistent behavior.

Either person can leave at any time.

---

# 47. Trusted Person

A user can privately label another user as:

**Trusted Person**

This label:
- Is private
- Grants no authority
- Grants no automatic account access
- Grants no automatic message access
- Does not expose private information

Any additional sharing must be explicitly controlled by the user.

A Trusted Person is a social relationship, **not an emergency contact**.

---

# 48. Emergency Support

LiGN is not emergency care.

In serious situations, LiGN can direct users toward:
- Emergency services
- Crisis resources
- Trusted real-world people
- Professional help

A visible **Get Help Now** path should be available where appropriate.

Listeners are never presented as emergency responders.

LiGN does not create internal emergency contacts.

---

# 49. Voice and Video

### Text
Always available.

### Voice messages
Optional.

### Live audio
Optional and subject to appropriate trust and safety controls.

### Video
Optional and more trust-dependent.

Requirements:
- No automatic camera activation
- Explicit microphone/camera permissions
- Immediate leave control
- Easily accessible reporting

Voice/video should not block the initial core connection experience.

---

# 50. Recording

Private voice/video conversations are not routinely recorded.

Recording requires explicit consent.

Limited information may be retained for serious safety reports where necessary.

Retention and access must be strictly limited.

---

# 51. Safety Controls

Users must be able to easily:
- Leave
- Mute
- Block
- Report

These controls should require minimal effort and remain accessible during relevant interactions.

---

# 52. Blocking

Blocking immediately prevents ordinary future interaction.

A blocked user cannot:
- Send ordinary messages
- Send normal connection requests
- Reconnect through ordinary discovery
- Circumvent the block through LiGN-supported interaction paths

Blocking should apply consistently across all ordinary discovery and interaction surfaces.

Internal safety systems may retain information necessary to prevent abuse.

The blocked user receives only the minimum information necessary.

---

# 53. Reporting and Moderation

Reports can originate from:
- Profiles
- Conversations
- Voice/video
- Temporary spaces
- Groups
- Shared content

Core flow:

**Report → Protect → Review → Action → Appeal**

Possible protective actions:
- Block
- Remove participant
- End session
- Restrict communication
- Temporary restriction
- Account suspension

A report does not automatically establish guilt.

False positives must be reviewable, and appeals must be available where applicable.

---

# 54. Moderation System

LiGN may use:
- Automated detection
- Human review
- Evidence-assisted review
- Appeals

Automated systems identify risk.

They should not automatically impose permanent severe penalties in ordinary cases without appropriate review.

Serious threats may require immediate protective intervention.

---

# 55. Safety Categories

Moderation should distinguish at minimum between:
- Ordinary incompatibility
- User discomfort
- Boundary violation
- Harassment
- Serious safety violation
- Credible threat
- Exploitation
- Other high-risk conduct

Different categories may require different intervention levels.

---

# 56. Cultural and Language Support

LiGN supports multiple languages.

Users may specify:
- Preferred language
- Language comfort
- Cultural preferences

Automatic translation may be offered.

Cultural similarity must not automatically be treated as better compatibility.

---

# 57. Notifications

Notifications should focus on meaningful activity:
- Connection requests
- Accepted connections
- Messages
- Scheduled conversations
- Important safety events

Users control:
- Notification categories
- Quiet hours
- Notification pause

Do not use:
- Streak reminders
- Guilt messages
- Manipulative urgency
- Artificial engagement prompts

---

# 58. Connection Journal

The **Connection Journal** is private.

Users can record:
- Notes
- Meaningful moments
- Things discussed
- Reminders
- Reflections

Journal entries are never automatically shared.

---

# 59. Search and Connection Memory

Users may privately search their own connection history by:
- Name/nickname
- Interests
- Topics
- Journal information

There is no public people directory.

---

# 60. Shared Memories

Users may create shared memories containing:
- Text
- Photos
- Shared activities
- Inside jokes
- Shared moments

A shared memory requires explicit participation from both people.

Either person can withdraw participation later.

If one participant withdraws:
- The memory disappears from that participant's shared-memory view.
- The other participant is notified.
- The reason is not automatically disclosed.
- The other participant may retain their own personal version.

---

# 61. Account Deletion

Deletion must clearly explain its consequences before confirmation.

Deletion should address:
- Account
- Personal information
- Connections
- Messages
- Journal
- Memories
- Uploaded media
- Verification information

A short recovery/cooling-off period may be used before irreversible deletion.

Information that must be retained for legal or safety reasons must be clearly disclosed.

Deletion must not be used to bypass active safety controls or erase information that must legitimately be retained for safety/legal purposes.

---

# 62. Core Data Entities

The implementation should support at least:

### User
Identity, profile, age/safety data, preferences, language, verification, and account state.

### Availability
Connection types, availability windows, temporary state, and discovery state.

### Connection
Two users, lifecycle state, intended duration, timestamps, pause/archive/end information.

### Connection Request
Sender, recipient, note, state, and timestamps.

### Conversation
Participants, connection reference, type, creation state, and retention state.

### Message
Conversation, sender, content, timestamp, moderation state, and deletion state.

### Temporary Space
Creator, purpose, duration, capacity, participants, and lifecycle state.

### Shared Memory
Participants, content, approvals, and participation state.

### Journal Entry
Owner, connection reference, content, and timestamp.

### Trusted Person
Owner, trusted connection, and explicit permissions.

### Schedule
Participants, time, recurrence, and state.

### Report
Reporter, target, category, evidence, review state, action, and appeal.

### Block
Blocker, blocked user, creation time, and optional expiry.

---

# 63. Canonical System States

Engineering should use centralized state definitions.

### Account
```text
ACTIVE
PAUSED
DELETED
```

### Discovery
```text
DISCOVERABLE
NOT_DISCOVERABLE
```

### Connection
```text
STRANGER
CONVERSATION
MUTUAL_CONNECTION
ACTIVE
PAUSED
ARCHIVED
ENDED
```

### Safety
```text
NORMAL
FLAGGED
RESTRICTED
SUSPENDED
REMOVED
```

These states are independent.

For example:

> `Account = ACTIVE` does not imply `Discovery = DISCOVERABLE`.

---

# 64. State Transition Rules

### Initial interaction
```text
STRANGER → CONVERSATION
```

### Mutual continuation
```text
CONVERSATION → MUTUAL_CONNECTION → ACTIVE
```

### Temporary pause
```text
ACTIVE → PAUSED → ACTIVE
```

### Inactivity
```text
ACTIVE → PAUSED → ARCHIVED
```

### Intentional ending
```text
ACTIVE → ENDED
```

### Reconnection
```text
ARCHIVED / ENDED
        ↓
new mutual interaction
        ↓
ACTIVE
```

A connection must never automatically reopen merely because one person sends a message after ending it.

---

# 65. Permission and Privacy Architecture

The system must distinguish between:
- Public profile information
- Discovery-visible information
- Connection-visible information
- Private information
- Verification information
- Journal information
- Shared-memory information
- Safety/moderation information

Information in one category must not automatically inherit permissions from another.

Examples:
- Verification ≠ public identity
- Location ≠ exact address
- Journal ≠ shared memory
- Trusted Person ≠ account authority
- Availability ≠ online status
- Safety history ≠ public profile information

### Permission precedence

When requirements conflict, apply this order:

1. **Safety**
2. **Privacy**
3. **Blocking/user boundaries**
4. **Account state**
5. **Connection state**
6. **Matching/discovery**
7. **Engagement convenience**

No lower-priority feature may override a higher-priority restriction.

---

# 66. MVP

The initial release should prove the core connection loop.

## Account
- Registration/login
- One identity
- Nickname
- Age-safety handling
- Basic verification architecture
- Pause
- Delete

## Profile
- Bio
- Interests
- Personality
- Current need
- Conversation preferences
- Boundaries

## Matching
- Current need
- Basic compatibility
- Availability
- Discovery controls
- Safety exclusions
- No-match handling

## Connections
- Requests
- Mutual acceptance
- Lifecycle
- Pause
- Archive
- End
- Reconnection controls

## Messaging
- 1-on-1 text
- Optional conversation starters
- Suggested replies

## Availability
- Availability types
- Temporary states
- Availability windows

## Listening
- Just Listen
- Advice Welcome
- I Don't Know What I Need
- Listener Mode

## Temporary Spaces
- 3–8 people
- Defined purpose
- Time limit
- Automatic closure
- Mutual reconnection

## Safety
- Leave
- Mute
- Block
- Report
- Human review workflow
- Basic moderation

## Notifications
- Core notifications
- Quiet hours
- User controls

### MVP exclusion rule

The following are **not required for the initial build** unless explicitly promoted into MVP:
- Voice messages
- Live audio
- Video
- Advanced shared activities
- Scheduling
- Recurring conversations
- Quiet companionship
- Connection Journal
- Shared memories
- Trusted Person enhancements
- Translation
- Local communities
- Advanced trust systems
- Advanced matching

---

# 67. Later Releases

## Phase 2
- Voice messages
- Live audio
- Shared activities
- Scheduling
- Recurring conversations
- Quiet companionship
- Connection Journal
- Shared memories
- Trusted Person
- Translation
- Local communities

## Phase 3
- Video
- More advanced temporary spaces
- Expanded activity integrations
- More advanced trust systems
- Expanded language support
- More sophisticated matching

This is a delivery sequence, not a change to the product vision.

---

# 68. Critical Acceptance Criteria

A feature is complete only when its intended behavior, failure behavior, privacy, safety, and state transitions work correctly.

### Matching
- Eligible users can be matched.
- Ineligible users cannot be matched.
- Blocked users never appear.
- Unavailable users do not appear as available.
- Current need influences compatibility.
- No human is fabricated when none is available.

### Connection
- Mutual interest is required for mutual connection.
- Connection states transition correctly.
- Ending a connection does not automatically reopen it.
- Reconnection follows the defined mutual-interest rules.

### Blocking
- Existing ordinary interaction is stopped.
- New requests are prevented.
- Discovery exclusion applies.
- Supported bypasses are prevented.

### Reporting
- Report can be submitted easily.
- Appropriate protective action can occur.
- Review workflow begins.
- Evidence is handled appropriately.
- False positives can be reviewed.
- Appeals work where applicable.

### Account pause
- User disappears from discovery.
- Existing connections remain.
- New matching stops.
- Restoration behaves correctly.

### Account deletion
- User receives clear consequences.
- Account reaches the correct deletion state.
- Required retention is respected.
- Other users receive only necessary information.

### Temporary spaces
- Capacity is respected.
- Expiration closes the space.
- Participants cannot continue normal participation after closure.
- Creator early termination works.
- Reconnection becomes available according to the defined rules.

### Privacy
- Private information is not exposed through discovery.
- Journal information remains private.
- Verification information remains private.
- Exact location is not exposed by default.
- Trusted Person status grants no unintended authority.

---

# 69. Required Edge Cases

QA must test at minimum:

### Account state
- User pauses while discoverable
- User pauses while in an active connection
- User deletes while in a conversation
- User returns after a pause
- User becomes inactive

### Matching
- No compatible user
- Only one compatible user
- Candidate becomes unavailable
- Candidate becomes blocked
- Candidate is already connected
- User changes their current need

### Connections
- Both users accept
- One accepts and the other declines
- Both attempt to end simultaneously
- One user pauses
- One user blocks
- One user deletes their account
- Reconnection is allowed
- Reconnection is prohibited

### Temporary spaces
- Creator leaves
- Participant leaves
- Space reaches capacity
- Space expires
- Creator ends early
- Report occurs during the space
- Report occurs after closure

### Safety
- User reports another user
- Both users report each other
- User reports after blocking
- False-positive appeal
- Repeated boundary violations
- Serious threat requiring immediate protection

### No human match
- No available human
- Listener unavailable
- Temporary space unavailable
- User receives an honest fallback

---

# 70. Success Measurement

LiGN should measure meaningful connection rather than engagement.

### Meaningful mutual connections
Users who mutually choose to continue after an actual interaction.

### Connection continuation
Connections that voluntarily continue beyond the initial interaction.

### Connection quality
Private feedback around:
- Respect
- Comfort
- Meaningfulness
- Supportiveness

### User agency
Whether users feel able to:
- Say no
- Leave
- Pause
- Set boundaries
- Control disclosure

### Safety
- Report volume relative to interactions
- Response time
- Repeat violations
- Appeal outcomes
- Protective-action effectiveness

Metrics must never incentivize users to remain in unwanted interactions.

---

# 71. North Star

## Meaningful Mutual Connections

A meaningful mutual connection requires:
1. Two users voluntarily choose to continue.
2. They have had an actual interaction.
3. The interaction has not immediately ended.
4. The connection remains voluntary.

The metric must never be increased by making it harder to leave.

---

# 72. Monetization

Core human connection remains free.

Potential revenue sources:
- Optional subscriptions
- Optional premium tools
- Carefully selected ethical partnerships

LiGN must not monetize:
- Loneliness
- Attention
- Popularity
- Basic access to human connection
- Being heard
- Emergency access

Users should not have to pay simply to find someone to talk to.

---

# 73. Product Vocabulary

Use:

**Connection** — general relationship term.

Context-specific terms may include:
- Chat buddy
- Pen pal
- Listener
- Friend
- Trusted Person

Do not force users to define a relationship prematurely.

---

# 74. AI Builder Implementation Rules

### Source of truth

This PRD defines product behavior.

If an implementation choice is not specified, the AI should choose the **simplest implementation that preserves the documented product principles**, rather than inventing a new product behavior.

### Do not invent features

Do not add:
- Social feeds
- Followers
- Likes
- Popularity scores
- Streaks
- Gamification
- Dating modes
- Public ratings
- AI human substitutes
- Large communities

unless explicitly requested.

### Do not silently change product rules

If implementation requires a decision that changes:
- User privacy
- Safety
- Matching behavior
- Connection lifecycle
- User consent
- Data retention
- Relationship visibility

the decision must be surfaced for product approval rather than silently invented.

### Prefer progressive complexity

Implement the simplest behavior that satisfies the requirement.

Do not introduce advanced infrastructure or functionality merely because it may be useful later.

### Preserve user agency

Whenever multiple valid implementations exist, prefer the one that gives users greater control over:
- Privacy
- Boundaries
- Disclosure
- Communication
- Leaving
- Pausing
- Reconnection

without creating unnecessary friction.

---

# 75. Onboarding Rule

LiGN should not require users to complete a long profile before experiencing the product.

Collect what is necessary to make the first connection useful and safe.

Additional information should be requested progressively when it improves:
- Matching
- Trust
- Safety
- Personalization

Users should reach their first meaningful connection without unnecessary setup.

---

# 76. Final Product Test

Before approving a feature, evaluate:

1. Does it make genuine human connection easier?
2. Does it support the **Need → Find → Connect → Evolve** journey?
3. Does it preserve user choice?
4. Does it preserve privacy?
5. Does it respect boundaries?
6. Does it avoid popularity and engagement mechanics?
7. Does it preserve the distinction between peer connection, professional care, and emergency support?
8. Does it introduce unnecessary complexity?
9. Can the user easily leave or decline?

If not, the feature requires explicit product review.

---

# 77. Definition of Done

The initial public version is ready when a new user can:

1. Create an account safely.
2. Create a private, non-appearance-dependent profile.
3. State what kind of connection they need.
4. Set relevant preferences and boundaries.
5. Discover an appropriate human connection.
6. Start a conversation without pressure.
7. Establish a mutual connection.
8. Continue, pause, archive, or end it.
9. Reconnect only through the defined process.
10. Block or report another user.
11. Access appropriate safety resources when necessary.
12. Pause or delete their account.
13. Understand how their information is handled.
14. Participate without competing for popularity or attention.

---

# 78. Canonical Product Loop

LiGN ultimately revolves around:

**Need → Human → Conversation → Mutual Connection → Relationship**

Everything else—matching, profiles, activities, groups, listening, scheduling, memories, trust, and safety—exists to make that loop:

**Safer. Easier. More human. More voluntary.**

That is the implementation boundary for LiGN.

---

# Appendix - Implementation Plan (plain text)

```text
# LiGN Network — Full Implementation Plan (MVP + Complete Vision)
Source: `The_LiGN_Network_Updated_Implementation_Ready_PRD.md` §§1-78 only. Appendices ignored.
Loop: Need → Human → Conversation → Mutual Connection → Relationship.
Journey: Need → Find → Connect → Evolve.
Rules: simplest compliant; no feeds/likes/followers/streaks/dating/AI-humans/large communities; Safety > Privacy > Blocking > Account > Connection > Matching > Convenience.

How to use: say `go phase N` (e.g. `go phase 3`). I will execute only that phase's Tasks, produce its Outputs, run its Tests, and stop at its Gate. I will not start the next phase or push without explicit instruction.

---

## Phase 1 — Plan lock
Objective: Freeze scope so later phases cannot diverge.
PRD: §4 MVP boundary, §66 MVP, §66 exclusions, §67 later releases, §74 builder rules, §77 DoD.
Tasks:
1. Confirm MVP = §66 only. §67 explicitly out of MVP.
2. Record states §63, transitions §64, entities §62, precedence §65, acceptance §68, edges §69, DoD §77.
3. Record open questions as assumptions (see Unresolved at end). Do not invent requirements.
Outputs: this file, `docs/scope-mvp.md`, `docs/test-strategy.md`.
Dependencies: none. Blocks all.
Tests: review-only — every §66 item mapped to Phases 2-9, every §67 item mapped to Phases 10-11.
Gate: plan accepted. No build code in this phase.

## Phase 2 — Foundation: states, schema, privacy
Objective: Lock state machines, data model, permission order.
PRD: §62 entities, §63 states, §64 transitions, §65 permissions.
Tasks:
1. Centralized enums: Account ACTIVE/PAUSED/DELETED; Discovery DISCOVERABLE/NOT_DISCOVERABLE; Connection STRANGER/CONVERSATION/MUTUAL_CONNECTION/ACTIVE/PAUSED/ARCHIVED/ENDED; Safety NORMAL/FLAGGED/RESTRICTED/SUSPENDED/REMOVED. Enforce independence.
2. Transition guards: STRANGER→CONVERSATION; CONVERSATION→MUTUAL_CONNECTION→ACTIVE; ACTIVE→PAUSED→ACTIVE; ACTIVE→PAUSED→ARCHIVED; ACTIVE→ENDED; ARCHIVED/ENDED→new mutual→ACTIVE. Never auto-reopen on single message.
3. Schema: User(identity, profile, age/safety, prefs, language, verification, account state); Availability(types, windows, temp state, discovery state); Connection(2 users, state, duration intent, timestamps, pause/archive/end info); ConnectionRequest(sender, recipient, note, state, timestamps); Conversation(participants, connection ref, type, retention); Message(conversation, sender, content, timestamp, moderation, deletion); TemporarySpace(creator, purpose, duration, capacity 3-8, participants, lifecycle); Report(reporter, target, category, evidence, review, action, appeal); Block(blocker, blocked, time, expiry). Add Schedule/JournalEntry/SharedMemory/TrustedPerson as nullable stubs only (no logic in MVP).
4. Permission layers: public / discovery-visible / connection-visible / private / verification / journal / shared-memory / safety. Enforce precedence Safety>Privacy>Blocking>Account>Connection>Matching>Convenience. No cross-layer inheritance.
5. Auth skeleton + request identity middleware + safety audit log.
Outputs: `db/migrations/0001_foundation`, state-guard module, privacy module, `docs/privacy-matrix.md`.
Dependencies: Phase 1.
Tests: illegal transition rejected; enum independence; verification/journal/safety never leak to discovery.
Gate: all guards + precedence pass. No feature code yet.

## Phase 3 — Account, profile, onboarding
Objective: Join safely with minimal setup; leave safely.
PRD: §5 identity, §6 profile, §7 photos, §8 age/verification, §9 location, §17-18 states/pause, §61 deletion, §75 onboarding.
Tasks:
1. Register/login, one identity per account, nickname/pseudonym. No multi-persona.
2. Onboarding minimal: nickname + age-safety + current need + language. Defer rest progressively.
3. Profile CRUD: bio, age range, country/region, interests, personality Qs, needs, pace/depth/style, availability summary, discussion + romantic boundaries, language. Photos optional (avatar allowed). No ratings/likes/leaderboards, no appearance matching.
4. Age-safety: minimum enforcement data stored; verification private; safety overrides matching.
5. Location: Anywhere/My country/Nearby only; never store exact; optional local-time display.
6. Pause: remove from discovery, block new requests, preserve connections/data, optional return period + auto-restore. Reversible.
7. Delete: pre-confirm consequences (account, profile, connections, messages, journal, memories, media, verification), cooling-off, disclose legal/safety retention, never bypass active safety retention.
Outputs: auth, users, onboarding, profile modules, `docs/deletion-retention.md`.
Dependencies: Phase 2.
Tests: one-identity enforced; minor safety blocks; pause removes from discovery but keeps connections; delete flow + disclosure; no appearance sorting exists.
Gate: DoD 1,2,4,12 demonstrable.

## Phase 4 — Availability, discovery, need-first matching
Objective: State a need, see eligible humans, honest no-match.
PRD: §10 intentions, §11 duration, §12 matching, §13 eligibility, §14 discovery, §15-16 availability.
Tasks:
1. Availability per type (casual, vent/listen, deep, pen pal, check-ins, quiet) + windows + temp states (need space/low energy/just listening/back later, auto-expire). Temp never ends connections. Exact online status never broadcast. Availability separate from account/discovery/connection state.
2. Discovery frequency Daily/Weekly/Paused; paused affects discovery only.
3. Eligibility hard filters before scoring: block either direction, age-safety, safety restriction, NOT_DISCOVERABLE, user restrictions.
4. Compatibility priority: need > availability > depth > style > personality > interests > life experience > language > timezone > location. Need strongest. No popularity/appearance signals. Never expose sensitive signals. Never re-surface rejected/blocked. Never fabricate match.
5. No-match screen: broaden / try later / listener queue / temp space / activity / reflection prompt. AI navigation help only, never as human.
Outputs: availability, matching, discover modules, `docs/matching-priority.md`.
Dependencies: Phase 3.
Tests: blocked/ineligible never suggested; need outranks interests; unavailable not shown available; no-match honest fallback. §69 Matching edges.
Gate: Acceptance Matching green.

## Phase 5 — 1-on-1 lifecycle + text messaging (core)
Objective: Deliver the heart: 1-on-1 platonic connection.
PRD: §19-21 prefs/starters, §22 requests, §23-25 lifecycle/accept, §26-27 silence/one-sided, §28-30 ending/reconnection.
Tasks:
1. Requests with sender context + reason + optional note; Accept/Decline/Ignore; mutual required; repeated unwanted = safety signal.
2. Lifecycle per Phase 2; actions Continue/Pause/Archive/End. No forced friendship label.
3. Accepted screen: Chat now / Send message / Save for later. Nothing automatic.
4. 1-on-1 text only. Optional starters/suggested replies/fresh starters/not-sure-what-to-say. Reply expectations (no rush/same day/may take days/active). Never imply silence=rejection; gentle prompt only after meaningful inactivity with frequency cap; auto-pause allowed.
5. One-sided: offer Pause/Need space/End/Reconnect later, no blame.
6. End without explanation; optional reason + closing message. Reconnection mutual-only; ender controls allow/temp-block/permanent-block; blocked party not notified; private future-reminder with no auto-notify.
Outputs: connections, messages, chat UI, `docs/reconnection-rules.md`.
Dependencies: Phase 4.
Tests: mutual required; ended never auto-reopens; reconnection allow/temp/permanent; simultaneous end; pause preserves history. §69 Connections edges.
Gate: Acceptance Connection + DoD 5-9.

## Phase 6 — Listening, immediate need, temp spaces (3-8 only)
Objective: Urgent/support needs + small temp groups, no communities.
PRD: §32-34 listening/need-someone, §37-38 spaces, §39-40 groups minimal, §36 activities secondary.
Tasks:
1. Vent modes: Just Listen / Advice Welcome / Don't Know; changeable mid-chat; peer ≠ professional care.
2. Listener Mode voluntary opt-in/out, anonymous need-someone requests, time-limited sessions, listener never responsible for safety.
3. I-Need-Someone routing: 1-on-1 → listener queue → small Need-Someone room → saved-connection shortcut stub (Trusted enhancements deferred). Honest empty state; never AI as human.
4. Spaces: 3-8 only, purpose + duration (15m/30m/1h/2h + custom within limits), auto-close, creator early-end, free leave, never permanent by default. Define join/leave/creator-leave/early-close/expire/report-after-closure. Cap enforced.
5. Post-space: private talk-again → new connection only on mutual; unilateral hidden.
6. Groups/board minimal: small-group opportunities list only, no algorithmic global feed, no hosting obligations.
Outputs: listeners, spaces, need-someone modules.
Dependencies: Phase 5.
Tests: capacity enforced; expiry closes; post-expiry participation blocked; creator-leave behavior; report during + after closure; no-human fallback honest. Acceptance Spaces + §69 Spaces/No-match.
Gate: listener + spaces demoable without breaking 1-on-1 core.

## Phase 7 — Boundaries, private trust, safety, moderation, emergency
Objective: Enforce agency and safety before launch.
PRD: §41-43 privacy/boundaries, §44-46 trust/conflict/apology, §47 Trusted minimal, §48 emergency, §51-55 controls/moderation, §49-50 text-only scaffolding.
Tasks:
1. Boundaries per-connection + global + presets (no number, no socials, no romantic/sexual, no unsolicited advice, short-only, respect privacy). Repeated post-refusal requests → boundary-violation signal.
2. Progressive disclosure Nickname→Basic→Familiar→Trusted; contact share voluntary + privacy reminder.
3. Trust private-only (respectful/listener/friendly/boundaries/uncomfortable); no public scores/ratings/leaderboards. Conflict Something-feels-off → Clarify/Boundary/Pause/Leave/Report; repair optional. Apology structured, no forgiveness demand, never erases safety record.
4. Trusted Person MVP: private label only, no authority/access/disclosure; not emergency contact.
5. Safety controls always reachable: Leave/Mute/Block/Report. Block: immediate stop, no messages/requests/discovery/bypass across surfaces; minimal info to blocked party.
6. Moderation Report→Protect→Review→Action→Appeal; 8 categories minimum; auto-detect flags only, no permanent severe auto-penalty in ordinary cases; immediate protection for serious threats; human review queue + evidence + appeal.
7. Emergency: visible Get Help Now → emergency/crisis/real-world/professional; listeners never responders; no internal emergency contacts.
8. Voice/video: text-only MVP; permission/consent scaffolding only; no routine recording.
Outputs: safety (blocks, reports, reviews, appeals), boundaries UI, `docs/safety-categories.md`, `docs/moderation-flow.md`.
Dependencies: Phases 5+6.
Tests: Acceptance Blocking/Reporting/Privacy; §69 Safety edges (mutual reports, post-block report, appeal, repeat violations, serious threat).
Gate: safety walkthrough passes; no bypass found.

## Phase 8 — Notifications, private search, polish
Objective: Notify without manipulation; private memory only.
PRD: §57 notifications, §59 search, §56 language stub.
Tasks:
1. Notifications for requests, accepts, messages, safety events only. Category toggles + quiet hours + global pause. Ban streak/guilt/urgency prompts.
2. Private search own history only; no public directory.
3. Language: store preference/comfort only; no translation engine in MVP.
4. Final Product Test per feature.
Outputs: notifications, settings, private search.
Dependencies: Phase 7.
Tests: quiet hours suppress; pause stops non-safety; no guilt copy.
Gate: DoD 10,11,13,14.

## Phase 9 — MVP acceptance + release readiness (no new features)
Objective: Prove 14-point DoD.
PRD: §68 acceptance, §69 edges, §77 DoD, §70-71 metrics, §76 final test.
Tasks:
1. Full matrix: matching, connection, blocking, reporting, pause, deletion, spaces, privacy.
2. §69 edge matrix (account/matching/connections/spaces/safety/no-human).
3. Instrument North Star only: meaningful mutual connections (voluntary + actual interaction + not immediately ended + still voluntary). No engagement incentives.
4. Retention docs, safety-response docs (SLAs marked assumption if absent), copy review.
Outputs: `docs/release-checklist.md`, `QA-MATRIX.md`, metrics stub, signed DoD 1-14.
Dependencies: all Phases 1-8.
Tests: full §68 + §69 pass.
Gate to MVP launch: all green. §67 explicitly out.

## Phase 10 — Complete vision A (PRD Later Phase 2)
Objective: Add deferred human-connection depth, still 1-on-1 heart + 3-8 only.
PRD: §67 Phase 2, plus full text of §31 scheduling, §35 quiet companionship, §36 activities, §47 trusted, §49 voice/audio, §56 translation, §58 journal, §60 memories, §39 communities.
Tasks:
1. Voice messages + Live audio with trust/safety gates, explicit mic permission, immediate leave, reporting. No auto-play.
2. Scheduling + recurring: exact/flexible time, reschedule/cancel/pause/change/end recurrence. No penalties/streaks/guilt. Notifications hook (extends Phase 8).
3. Quiet companionship full: text presence + optional voice, time-limited, no continuous conversation required.
4. Shared activities full: Match→Activity and Activity→Match; activities secondary to connection.
5. Journal private: notes/moments/topics/reminders/reflections; never auto-shared; powers private search.
6. Shared memories: mutual participation required; withdraw removes from withdrawer's view, notifies other without reason; other may retain personal version.
7. Trusted Person full: explicit user-controlled permissions only (still no auto access); still not emergency contact.
8. Translation: preference/comfort + auto-translation offer; cultural similarity never auto-better compatibility.
9. Local communities minimal, 3-8 only, no feed ranking.
Outputs: voice/audio, scheduling, quiet, activities, journal, memories, trusted-full, translation modules + docs updates.
Dependencies: Phase 9 (MVP stable). Needs Phase 5 lifecycle, Phase 6 spaces, Phase 7 safety, Phase 8 notifications.
Tests: per-feature acceptance + §68 regressions; scheduling no-penalty test; memory withdraw test; translation opt-in test; voice permission/leave/report test.
Gate: MVP regressions green + new features meet Final Test §76.

## Phase 11 — Complete vision B (PRD Later Phase 3)
Objective: Video + advanced depth without breaking principles.
PRD: §67 Phase 3, §49 video, §50 recording, advanced spaces/activities/trust/language/matching.
Tasks:
1. Video trust-gated, explicit camera/mic permission, no auto-activation, immediate leave, accessible reporting.
2. Recording: no routine recording; explicit consent required; limited safety-report retention, strictly limited access.
3. Advanced temp spaces + activity integrations (still 3-8, auto-close, no permanent by default).
4. Advanced trust (still private-only, no public scores/leaderboards).
5. Expanded language support + sophisticated matching (need remains strongest; no popularity/appearance signals).
Outputs: video, recording-consent, advanced spaces/activities/trust/language/matching.
Dependencies: Phase 10.
Tests: permission/consent/leave/report tests; retention/access tests; matching still need-first + no-fabrication tests.
Gate: full vision meets §68 + §76.

## Phase 12 — Full vision release readiness
Objective: Prove complete LiGN.
Tasks: full §68 + §69 + §77 on all features; North Star instrumentation; retention/SLA docs finalized; monetization guardrails check (§72 core free, never monetize loneliness/attention/popularity/access/being heard/emergency).
Outputs: full release checklist, QA matrix, metrics dashboard.
Dependencies: Phase 11.
Gate: launch complete vision.

---

## Ordered phase list
1 plan lock → 2 foundation → 3 account/profile → 4 matching → 5 1-on-1 core → 6 listening/spaces → 7 safety/moderation → 8 notifications/search → 9 MVP release → 10 vision A → 11 vision B → 12 full release.

## Outputs per phase
1 plan docs; 2 migrations + guards + privacy matrix; 3 auth/users/profile + deletion doc; 4 availability/matching/discover + priority doc; 5 connections/messages/chat + reconnection doc; 6 listeners/spaces/need-someone; 7 safety/blocks/reports/appeals/boundaries + safety docs; 8 notifications/search; 9 QA matrix + release checklist + metrics stub; 10 voice/scheduling/quiet/activities/journal/memories/trusted/translation; 11 video/recording/advanced; 12 full checklist.

## Dependency overview
1 blocks all. 2 blocks all build. 3→4→5 strictly sequential. 6 needs 5. 7 needs 5+6. 8 needs 7. 9 needs 1-8. 10 needs 9. 11 needs 10. 12 needs 11. Never parallelize safety before lifecycle stable. Never build §67 before MVP gate.

## Recommended order
Execute 1→12 in order. Say `go phase N` to execute one phase only.

## Unresolved / underspecified (do not invent)
1. Age thresholds/jurisdictions — `...:188` no numbers. Assume 18+ default, TBD.
2. Verification provider — `...:190` undefined. Assume self-attestation + stub.
3. Inactivity meaningful period + caps — `...:575` no numbers. Assume 7 days, max 1/14d.
4. Custom space max — `...:768` unspecified. Assume max 4h.
5. Creator-leaves-space — `...:776` required but unspecified. Needs decision.
6. Report-after-closure retention — unspecified. Assume 30-day hold, needs legal.
7. Cooling-off length — `...:1214` unspecified. Assume 14 days.
8. Legal/safety retention inventory — `...:1216` unspecified.
9. Life-experience signal collection — `...:265` sensitive. Assume opt-in tags only.
10. Personality algorithm — unspecified. Assume tag overlap, no opaque scoring.
11. Safety SLAs — `...:1650` no targets. Open.
12. Availability windows vs excluded scheduling — assume declarative only in MVP.
13. Trusted shortcut in need-someone routing `...:692` vs deferred enhancements — assume saved-connection stub in MVP.
14. Board scope vs no-feed — `...:809` undefined. Assume chronological small-group list, no ranking.
15. Language depth — store-only in MVP.
16. Scheduling mentions vs MVP exclusion — stubs only until Phase 10.
17. Quiet companionship full vs MVP exclusion — text-presence only until Phase 10.
18. Journal in search `...:1169` vs Journal excluded — topics-only until Phase 10.
```

---

# Appendix A - Technology Stack (plain text)

```text
# LiGN — Technology Stack
Source: PRD §§1-78 and `docs/IMPLEMENTATION_PLAN_FULL.md` Phases 1-12.

## Local Development Architecture

How the app runs locally:
Next.js 14 App Router (TypeScript) on Node.js 20 LTS. UI + REST API via Route Handlers + realtime gateway in the same process. No separate backend server, no Supabase.

How the database runs locally:
Postgres 16 in Docker. No hosted database needed.
docker compose up -d db

How the application connects to the database:
Prisma 5. DATABASE_URL="postgresql://postgres:dev@localhost:5432/lign"

Where uploaded files are stored:
Cloudflare R2 (S3-compatible) in all envs, including local dev. No local-disk branch.

How authentication works locally:
Better Auth 1.x with email + password, DB-backed sessions in Postgres. Email sending via ZeptoMail; without a key, verification links log to console in dev only.

Required environment variables (.env, never committed):
DATABASE_URL="postgresql://postgres:dev@localhost:5432/lign"
BETTER_AUTH_SECRET="dev-only-random-string"
R2_ACCOUNT_ID="" R2_ACCESS_KEY_ID="" R2_SECRET_ACCESS_KEY="" R2_BUCKET="lign-dev" R2_PUBLIC_URL=""
PAYSTACK_SECRET_KEY="" PAYSTACK_PUBLIC_KEY=""
EMAIL_FROM="" ZEPTOMAIL_TOKEN=""

Required local dependencies/services:
Node.js 20 LTS + npm, Docker (for Postgres only). No Supabase, no paid services required to start.

Commands:
npm install
docker compose up -d db
npx prisma migrate dev
npm run dev
App http://localhost:3000, API http://localhost:3000/api/*, realtime on same origin.

## Technology Stack

| Area | Technology | Purpose |
|---|---|---|
| Framework | Next.js 14 (App Router, React, TypeScript) | Web UI + API + realtime gateway in one codebase |
| Backend runtime | Node.js 20 LTS (inside Next.js) | Single runtime |
| Database | Postgres 16 (Docker locally) | All entities, concurrent chat/spaces/reports, full-text private search |
| ORM | Prisma 5 | Typed access, migrations |
| Authentication | Better Auth 1.x (email + password, DB sessions) | Registration/login, one identity, pause/delete hooks |
| File Storage | Cloudflare R2 (S3-compatible) | Avatars/illustrations, later journal/memory media |
| API layer | REST JSON via Route Handlers | Profiles, requests, messages, spaces, reports |
| Realtime | Socket.io 4 self-hosted (same Node process) | MVP 1-on-1 chat, spaces, listener queue, notifications; no Supabase |
| Email | ZeptoMail API (console fallback in dev) | Verification, safety events, notifications |
| Payments | Paystack API (Phase 10+ only) | Optional subscriptions/premium; MVP core stays free per §72 |
| Testing | Vitest + Testing Library | Unit + route + realtime tests |
| Validation | Zod | Transition guards, input shapes |

## Decisions and Assumptions

1. Postgres everywhere (dev via Docker) replaces SQLite: chosen for full-vision concurrency; one DB from MVP to vision, no migration rewrite.
2. Better Auth replaces custom bcrypt/JWT: less custom security code for the AI agent; sessions stay in Postgres.
3. R2 in all envs: no local-disk divergence; needs a Cloudflare R2 free-tier account even for dev.
4. Email confirmed as ZeptoMail.
5. Paystack gated to Phase 10+: §72 core connection stays free; no paywall on finding someone to talk to.
6. Realtime in MVP via self-hosted Socket.io: no paid vendor, no Supabase per instruction; polling kept only as fallback.
7. Hosting is local device for now: no deploy platform configured; production host undecided.
```

---

# Appendix B - Design file (plain text)

```text
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>LiGN Network — Visual Preview</title>
<style>
  :root {
    --cream: #FAF7F2;
    --sand: #EFE7DA;
    --ink: #2E2A26;
    --muted: #6F655C;
    --clay: #C96F4A;
    --clay-dark: #A95836;
    --sage: #7D8C6F;
    --line: #E2D8C9;
    --card: #FFFFFF;
  }
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body {
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
    background: var(--cream);
    color: var(--ink);
    line-height: 1.6;
    padding: 40px 24px;
  }
  .wrap { max-width: 760px; margin: 0 auto; }
  .eyebrow { font-size: 13px; letter-spacing: 2px; text-transform: uppercase; color: var(--clay); font-weight: 700; }
  .wordmark { font-family: Georgia, "Times New Roman", serif; font-size: 30px; letter-spacing: 6px;
              margin: 4px 0 2px; font-weight: 400; color: var(--clay); }
  .wordmark .lign { font-style: italic; }
  .wordmark-rule { width: 56px; height: 2px; background: var(--clay); margin: 10px 0 0; border: none; }
  h1 { font-family: Georgia, "Times New Roman", serif; font-size: 40px; line-height: 1.15; margin: 8px 0 8px; }
  .sub { color: var(--muted); font-size: 18px; margin-bottom: 32px; }
  section { background: var(--card); border: 1px solid var(--line); border-radius: 16px; padding: 28px; margin-bottom: 24px; }
  section h2 { font-size: 14px; letter-spacing: 1.5px; text-transform: uppercase; color: var(--muted); margin-bottom: 16px; }
  .swatches { display: grid; grid-template-columns: repeat(auto-fit, minmax(120px, 1fr)); gap: 12px; }
  .swatch { border-radius: 12px; overflow: hidden; border: 1px solid var(--line); }
  .swatch .c { height: 72px; }
  .swatch .n { padding: 8px 10px; font-size: 13px; }
  .swatch .n b { display: block; font-size: 13px; }
  .swatch .n span { color: var(--muted); font-size: 12px; }
  .type-h1 { font-family: Georgia, serif; font-size: 32px; }
  .type-body { font-size: 16px; margin-top: 8px; }
  .type-small { font-size: 14px; color: var(--muted); margin-top: 8px; }
  .btn { display: inline-block; border: none; cursor: pointer; font-size: 16px; font-weight: 600;
         padding: 14px 28px; border-radius: 999px; margin-right: 12px; margin-top: 4px; }
  .btn-primary { background: var(--clay); color: #fff; }
  .btn-primary:hover { background: var(--clay-dark); }
  .btn-secondary { background: transparent; color: var(--ink); border: 2px solid var(--line); }
  .btn-secondary:hover { border-color: var(--ink); }
  label { display: block; font-weight: 600; margin-bottom: 8px; }
  input[type=text] { width: 100%; padding: 14px 16px; font-size: 16px; border: 2px solid var(--line);
                     border-radius: 12px; background: var(--cream); color: var(--ink); }
  input[type=text]:focus { outline: none; border-color: var(--clay); background: #fff; }
  .hint { font-size: 13px; color: var(--muted); margin-top: 8px; }
  .chat { background: var(--sand); border-radius: 12px; padding: 16px; margin-top: 16px; }
  .bubble { background: #fff; border: 1px solid var(--line); border-radius: 4px 16px 16px 16px;
            padding: 12px 16px; max-width: 85%; font-size: 15px; }
  .tag { display: inline-block; background: var(--sage); color: #fff; font-size: 12px; font-weight: 700;
         padding: 4px 12px; border-radius: 999px; margin-bottom: 10px; letter-spacing: .5px; }
  /* Dark mode */
  [data-theme="dark"] {
    --cream: #1C1917;
    --sand: #292524;
    --ink: #F5EFE6;
    --muted: #A8A29E;
    --clay: #D98A5F;
    --clay-dark: #E59A70;
    --sage: #8FA382;
    --line: #44403C;
    --card: #292524;
  }
  [data-theme="dark"] .bubble { background: #1C1917; }
  [data-theme="dark"] input[type=text] { background: #1C1917; }
  [data-theme="dark"] input[type=text]:focus { background: #000; }
  .theme-row { display: flex; justify-content: flex-end; margin-bottom: 16px; }
  .theme-toggle { background: transparent; border: 2px solid var(--line); color: var(--ink);
                  border-radius: 999px; padding: 8px 20px; font-size: 14px; font-weight: 600; cursor: pointer; }
  .theme-toggle:hover { border-color: var(--clay); }
</style>
</head>
<body>
<div class="wrap">
  <div class="theme-row"><button class="theme-toggle" onclick="toggleTheme()">Dark mode</button></div>
  <div class="wordmark">The LiGN Network</div>
  <hr class="wordmark-rule">
  <div class="eyebrow" style="margin-top:14px">Visual style preview</div>
  <h1>What kind of connection do you need right now?</h1>
  <p class="sub">Visual style preview — warm, calm, human. No streaks, no counts, no pressure.</p>

  <section>
    <h2>Colors</h2>
    <div class="swatches">
      <div class="swatch"><div class="c" style="background:#FAF7F2"></div><div class="n"><b>Cream</b><span>#FAF7F2 · background</span></div></div>
      <div class="swatch"><div class="c" style="background:#EFE7DA"></div><div class="n"><b>Sand</b><span>#EFE7DA · surfaces</span></div></div>
      <div class="swatch"><div class="c" style="background:#2E2A26"></div><div class="n"><b>Ink</b><span>#2E2A26 · text</span></div></div>
      <div class="swatch"><div class="c" style="background:#C96F4A"></div><div class="n"><b>Clay</b><span>#C96F4A · primary action</span></div></div>
      <div class="swatch"><div class="c" style="background:#7D8C6F"></div><div class="n"><b>Sage</b><span>#7D8C6F · calm accents</span></div></div>
    </div>
  </section>

  <section>
    <h2>Typography</h2>
    <div class="type-h1">Warm serif for moments that matter</div>
    <div class="type-body">Clean sans for everything else. Body text stays at 16px, generous line height, never shouty. Silence is normal here — the interface should feel like a quiet room, not a feed.</div>
    <div class="type-small">Small / muted — used for gentle hints, never guilt ("No rush — reply whenever feels right.")</div>
  </section>

  <section>
    <h2>Buttons</h2>
    <button class="btn btn-primary">Find connection</button>
    <button class="btn btn-secondary">Pause</button>
    <p class="hint">Primary is clay, pill-shaped, single clear action. Secondary is quiet — leaving or pausing must always feel allowed.</p>
    <div class="chat">
      <span class="tag">JUST LISTENING</span>
      <div class="bubble">Hey, no rush at all. I'm here to listen whenever you're ready.</div>
    </div>
  </section>

  <section>
    <h2>Sample input</h2>
    <label for="need">What kind of connection do you need right now?</label>
    <input type="text" id="need" placeholder="e.g. Someone to vent to, no advice needed…">
    <p class="hint">Placeholder suggests an honest need. No character counters, no pressure.</p>
  </section>
</div>
<script>
  function toggleTheme() {
    var root = document.documentElement;
    var dark = root.getAttribute('data-theme') === 'dark';
    root.setAttribute('data-theme', dark ? '' : 'dark');
    document.querySelector('.theme-toggle').textContent = dark ? 'Dark mode' : 'Light mode';
  }
</script>
</body>
</html>
```

Design changes:

 1. Add a dark-mode variant  2. Write "The LiGN Network" as is - lower case letter i, and make it more elegant    Retain the previous colour of The LiGN Network, only keep the lower case letter I and the fonts.
