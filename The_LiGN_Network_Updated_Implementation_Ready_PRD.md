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
