# The LiGN Network
## Consolidated Implementation-Ready Product Requirements Document

**Product:** The LiGN Network  
**Purpose:** Reduce loneliness by making genuine human connection easier.  
**Primary experience:** Finding the right human connection for what someone needs right now.

---

# 1. Product Definition

LiGN is a platform for genuine, primarily platonic human connection.

Users can come to LiGN to:

- Chat casually
- Find a pen pal
- Vent
- Listen
- Find someone to check in with
- Build friendship
- Have deep conversations
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

---

# 2. Product Principles

These principles govern product and engineering decisions.

### Human connection over engagement

Do not optimize for attention, screen time, streaks, followers, popularity, or message volume.

### Need before appearance

The reason someone wants connection should matter more than appearance or social status.

### Connection without pressure

Users can decline, pause, leave, change boundaries, or remain private without punishment.

### Progressive trust

Users reveal more about themselves as trust develops.

### Privacy by default

Information should only become visible when necessary and appropriately authorized.

### No forced positivity

LiGN can be warm and hopeful without dismissing difficult emotions.

### Human connection remains human

LiGN must never represent an AI as a human connection or pretend a human is available when one is not.

---

# 3. Core User Flow

The primary loop is:

**Need → Discovery/Match → Conversation → Mutual Connection → Continue / Pause / Archive / End → Optional Reconnection**

Users can also enter through:

- Temporary spaces
- Shared activities
- Listener mode
- Saved connections
- Reconnection

---

# 4. Account Identity

Each account represents one LiGN identity.

Users cannot maintain multiple separate personas or profiles on one account.

Privacy is still supported through:

- Nicknames
- Pseudonyms
- Limited profile information
- Progressive disclosure
- Optional identity verification

---

# 5. Profile

A profile can contain:

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

Profiles are not designed as popularity pages.

---

# 6. Photos and Appearance

Photos are optional.

Users may use:

- Avatars
- Illustrations
- Pseudonyms
- Real photos

Appearance must not be required for ordinary participation or used as a popularity mechanism.

There are no:

- Photo ratings
- Likes based on appearance
- Appearance leaderboards
- Public attractiveness systems

---

# 7. Age, Identity and Verification

LiGN should collect enough age information to enforce applicable safety rules.

Verification is progressive:

- Age verification where necessary
- Optional identity verification
- Additional verification where safety/risk requires it

Verification information remains private.

Verification must not become a public status competition.

**Implementation rule:** Safety restrictions always override matching preferences.

---

# 8. Location

Location is primarily a matching preference.

Users can choose:

- Anywhere
- My country
- Nearby

Location can support:

- Local communities
- Shared activities
- Time-zone compatibility
- Matching

Exact location must not be publicly exposed by default.

---

# 9. Connection Types

Supported connection intentions include:

- Casual chat
- Vent
- Listening
- Deep conversation
- Check-in
- Friendship
- Pen pal
- Quiet companionship
- Shared activity
- “I need someone”

Users can select more than one.

The current need can change at any time.

---

# 10. Connection Duration

When appropriate, users can indicate:

- Quick chat
- Conversation for today
- Ongoing chat buddy
- Long-term pen pal
- See where it goes

These are expectations, not commitments.

A user can change the intended duration later.

---

# 11. Matching

Matching uses relevant compatibility signals in this priority order:

1. Current need
2. Safety/eligibility
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

The system must never expose sensitive internal matching signals as an explanation to users.

---

# 12. Matching Eligibility

A person must not be suggested when:

- Either user has blocked the other
- An age-safety restriction prevents the interaction
- A safety restriction prevents it
- Either account is unavailable for discovery
- A relevant user-set restriction makes the match inappropriate

Eligibility rules run before compatibility scoring.

---

# 13. Discovery

Discovery may include:

- Matched people
- Connection suggestions
- Temporary spaces
- Small groups
- Shared activities

Users control how often they receive new suggestions:

- Daily
- Weekly
- Paused

Existing connections are unaffected when discovery is paused.

---

# 14. No-Match Experience

If a suitable human is unavailable, LiGN must be honest.

Available alternatives may include:

- Broaden matching
- Try again later
- Listener queue
- Temporary space
- Shared activity
- Meaningful prompts/reflection

LiGN must never present an AI as though it were a human match.

---

# 15. Availability

Availability answers:

> **“Am I currently open to this kind of connection?”**

Users can indicate availability for:

- Casual chat
- Venting/listening
- Deep conversation
- Pen pal
- Check-ins
- Quiet companionship

Users can define availability windows.

Exact online status is not publicly broadcast by default.

---

# 16. Temporary Availability States

Users can temporarily indicate:

- Need space
- Low energy
- Just listening
- Back later

These states can automatically expire.

A temporary availability state does not end existing connections.

---

# 17. Account Activity and Account State

These are separate from availability.

### Account state

```text
ACTIVE
PAUSED
DELETED
```

### Discovery state

```text
DISCOVERABLE
NOT_DISCOVERABLE
```

Therefore:

> A user can have an ACTIVE account while being NOT_DISCOVERABLE.

Long inactivity may remove someone from discovery without deleting their account.

---

# 18. Account Pause

When an account is paused:

- It is removed from new discovery.
- Existing connections remain.
- Existing data remains according to retention rules.
- New connection requests are unavailable.
- The user may specify a return period.
- Automatic restoration occurs when the selected pause period ends.

Pausing is reversible.

---

# 19. Conversation Preferences

Users can indicate:

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

These preferences may differ between connections.

---

# 20. Reply Expectations

Users can optionally communicate:

- No rush
- Usually same day
- I may take days
- I prefer active chats

Delayed replies must not automatically be interpreted as rejection.

LiGN should avoid guilt-based language such as implying someone is “waiting” for a response.

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

Users can always ignore these tools.

---

# 22. Connection Requests

A connection request can contain:

- Sender profile context
- Reason for connecting
- Optional personalized note

A mutual connection requires interest from both users.

Recipients can:

- Accept
- Decline
- Ignore

Repeated unwanted requests can become a safety concern.

---

# 23. Connection Lifecycle

All ongoing relationships use one lifecycle:

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

An active connection can be:

- Continued
- Paused
- Archived
- Scheduled
- Added to recurring routines
- Ended

Users are never required to label a relationship “friendship.”

---

# 25. Accepted Connection

When a connection becomes mutual, LiGN provides a simple confirmation and offers:

- Chat now
- Send message
- Save for later
- Schedule time

No action happens automatically.

---

# 26. Silence and Inactivity

Silence is normal.

The system may provide:

- Nothing
- Gentle reconnection suggestion
- Suggested message
- Automatic pause after prolonged inactivity

The system must not tell a user that silence means:

- Rejection
- Dislike
- Abandonment
- Loss of interest

### Default implementation rule

For an inactive connection, LiGN should not automatically send a reconnect prompt immediately. A gentle prompt may appear only after a meaningful period of inactivity, with frequency limits.

---

# 27. One-Sided Conversations

If a conversation becomes consistently one-sided, LiGN may offer:

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

An optional closing message can be sent.

Explanation is never required.

---

# 29. Reconnection

A previous relationship does not automatically reopen.

Reconnection requires mutual interest.

If a connection was intentionally ended:

- The person who ended it controls whether reconnection can be attempted.
- No surprise message is sent.
- The other person cannot bypass a reconnection restriction.

Users can choose:

- Allow reconnection
- Temporarily prevent reconnection
- Permanently prevent reconnection

The other person is not notified when reconnection is blocked.

---

# 30. Future Reconnection

A user can privately request a reminder to reconsider reconnecting:

- Later
- This week
- On a specific date
- Custom timeframe

The other person is not automatically notified.

---

# 31. Scheduling and Recurring Conversations

Users can schedule:

- Exact date/time
- Flexible period

They can:

- Reschedule
- Cancel
- Pause
- Change recurrence
- End recurrence

Missed conversations never create:

- Penalties
- Attendance scores
- Streak loss
- Guilt notifications

---

# 32. Venting and Listening

Support-oriented conversations offer:

### Just Listen

Primarily listening.

### Advice Welcome

Advice is permitted.

### I Don't Know What I Need

No predefined expectation.

These modes can change during the conversation.

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

Routing can use:

1. Available 1-on-1 match
2. Listener queue
3. Small “Need Someone” room
4. Trusted Person shortcut

If no human is available, LiGN clearly says so.

---

# 35. Quiet Companionship

Quiet companionship allows people to be together without continuous conversation.

Possible formats:

- Text presence
- Optional voice
- Study/work together
- Eat together
- Walk together
- Draw together
- Listen to music
- Shared activity

Sessions may be time-limited.

Continuous conversation is never required.

---

# 36. Shared Activities

Supported activities may include:

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

A custom duration may be allowed within configured platform limits.

A space:

- Automatically closes when its duration expires
- Can be ended early by its creator
- Can be left by participants at any time

Temporary spaces are not permanent communities.

---

# 38. Post-Space Reconnection

When a temporary space ends, participants may privately indicate:

> **I’d like to talk to this person again.**

A new private connection is created only when interest is mutual.

No participant is automatically notified of unilateral interest.

---

# 39. Groups and Community

Groups remain small, generally **3–8 people**.

Examples:

- Late-night chat
- Small book club
- Temporary boredom room
- Study session
- Shared activity

LiGN may have a limited connection board for:

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

Information should be disclosed progressively:

**Nickname → Basic profile → Familiar connection → Trusted friend**

Users may voluntarily share:

- Phone number
- Email
- Social accounts
- Other contact details

LiGN does not require external contact information.

Before sharing potentially sensitive contact information, LiGN may provide a short privacy reminder.

Repeated requests after refusal are treated as a possible boundary issue.

---

# 42. Discussion Boundaries

Users can define:

- Comfortable topics
- Sensitive topics
- Off-limits topics

Boundaries can vary by connection.

They can be changed at any time.

Possible explicit boundaries include:

- Do not ask for my number
- No social-media requests
- No romantic/sexual conversation
- No unsolicited advice
- Short conversation only
- Respect my privacy

---

# 43. Romantic Boundaries

LiGN is platonic by default.

Users can indicate:

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

Optional private feedback can include:

- Respectful
- Good listener
- Friendly
- Respects boundaries
- Made me uncomfortable

This feedback must not become a public score.

There are no:

- Public trust scores
- Public ratings
- Leaderboards
- Popular-user rankings
- Follower counts

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

# 46. Apologies

Users may send an apology that:

- Clearly acknowledges what happened
- Acknowledges harm
- Does not demand forgiveness

The recipient can:

- Accept
- Ignore
- Acknowledge
- Continue
- Leave

An apology does not erase a report or safety record.

---

# 47. Rebuilding Trust

After a conflict, users may continue with:

- Lower-trust boundaries
- Reduced disclosure
- Normal interaction

Trust can be rebuilt through consistent behavior.

Either person can still leave.

---

# 48. Trusted Person

A user can privately label another user:

**Trusted Person**

This label:

- Is private
- Grants no authority
- Grants no automatic account access
- Grants no automatic message access
- Does not expose private information

Any additional sharing must be explicitly controlled by the user.

---

# 49. Emergency Support

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

# 50. Voice and Video

### Text

Always available.

### Voice messages

Optional.

### Live audio

Optional and subject to appropriate trust/safety controls.

### Video

Optional and more trust-dependent.

Requirements:

- No automatic camera activation
- Explicit microphone/camera permissions
- Immediate leave control
- Easily accessible reporting

---

# 51. Recording

Private voice/video conversations are not routinely recorded.

Recording requires explicit consent.

Limited information may be retained for serious safety reports where necessary.

Retention and access must be strictly limited.

---

# 52. Safety Controls

Users can always access:

- Leave
- Mute
- Block
- Report

These controls should require minimal effort.

---

# 53. Blocking

Blocking immediately prevents ordinary future interaction.

A blocked user cannot:

- Send ordinary messages
- Send normal connection requests
- Reconnect through ordinary discovery
- Circumvent the block through LiGN-supported interaction paths

Internal safety systems may retain information necessary to prevent abuse.

The blocked user receives only the minimum information necessary.

---

# 54. Reporting and Moderation

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

---

# 55. Moderation System

LiGN may use:

- Automated detection
- Human review
- Evidence-assisted review
- Appeals

Automated systems identify risk; they should not automatically impose permanent severe penalties in ordinary cases without appropriate review.

Serious threats may require immediate intervention.

---

# 56. Safety Categories

The moderation system should distinguish at minimum between:

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

# 57. Cultural and Language Support

LiGN supports multiple languages.

Users may specify:

- Preferred language
- Language comfort
- Cultural preferences

Automatic translation may be offered.

Cultural similarity must not be treated as inherently better compatibility.

---

# 58. Time Zones

Time zones can support:

- Matching
- Availability
- Scheduling
- Pen-pal compatibility

Users may optionally show local time.

Exact location is not required.

---

# 59. Notifications

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

# 60. Connection Journal

The **Connection Journal** is private.

Users can record:

- Notes
- Meaningful moments
- Things discussed
- Reminders
- Reflections

Journal entries are never automatically shared.

---

# 61. Search and Connection Memory

Users can privately search their own connection history by:

- Name/nickname
- Interests
- Topics
- Journal information

There is no public people directory.

---

# 62. Shared Memories

Users may create shared memories containing:

- Text
- Photos
- Shared activities
- Inside jokes
- Shared moments

A shared memory requires explicit participation from both people.

Either person can withdraw their participation later.

If one participant withdraws:

- The memory disappears from that participant's shared-memory view.
- The other participant is notified.
- The reason is not disclosed automatically.
- The other participant may retain their own personal version.

---

# 63. Account Deletion

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

### Default implementation rule

Use a short recovery/cooling-off period before irreversible deletion, unless the user explicitly requires immediate deletion where technically/legal constraints permit.

Information that must be retained for legal or safety reasons must be disclosed.

---

# 64. Data and Core Entities

The implementation should support these core entities:

### User

Identity, profile, age/safety data, preferences, language, verification and account state.

### Availability

Connection types, windows, temporary state and discovery state.

### Connection

Two users, lifecycle state, intended duration, timestamps, pause/archive/end information.

### Connection Request

Sender, recipient, note, state and timestamps.

### Conversation

Participants, connection reference, type, creation and retention state.

### Message

Conversation, sender, content, timestamp, moderation/deletion state.

### Temporary Space

Creator, purpose, duration, capacity, participants and lifecycle state.

### Shared Memory

Participants, content, approvals and participation state.

### Journal Entry

Owner, connection reference, content and timestamp.

### Trusted Person

Owner, trusted connection and explicit permissions.

### Schedule

Participants, time, recurrence and state.

### Report

Reporter, target, category, evidence, review state, action and appeal.

### Block

Blocker, blocked user, creation time and optional expiry.

---

# 65. Canonical System States

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

These states must remain independent.

For example:

> `Account = ACTIVE` does not imply `Discovery = DISCOVERABLE`.

---

# 66. State Transition Rules

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
ARCHIVED/ENDED
→ new mutual interaction
→ ACTIVE
```

A connection must never automatically reopen merely because one person sends a message after ending it.

---

# 67. Privacy Architecture

The system must distinguish between:

- Public profile information
- Connection-visible information
- Private information
- Verification information
- Journal information
- Shared-memory information
- Safety/moderation information

Information belonging to one category must not automatically inherit the permissions of another.

Examples:

- Verification ≠ public identity
- Location ≠ exact address
- Journal ≠ shared memory
- Trusted Person ≠ account authority
- Availability ≠ online status

---

# 68. MVP

The initial release should prioritize the core connection loop.

## Required MVP

### Account

- Registration/login
- One identity
- Nickname
- Age safety
- Basic verification architecture
- Pause/delete

### Profile

- Bio
- Interests
- Personality
- Current need
- Conversation preferences
- Boundaries

### Matching

- Current need
- Basic compatibility
- Availability
- Discovery controls
- Safety exclusions

### Connections

- Requests
- Mutual acceptance
- Lifecycle
- Pause
- Archive
- End
- Reconnection controls

### Messaging

- 1-on-1 text
- Optional conversation starters
- Suggested replies

### Availability

- Availability types
- Temporary status
- Availability windows

### Listening

- Just Listen
- Advice Welcome
- I Don't Know What I Need
- Listener Mode

### Temporary spaces

- 3–8 people
- Time limit
- Automatic closure
- Mutual reconnection

### Safety

- Leave
- Mute
- Block
- Report
- Human review workflow
- Basic moderation

### Notifications

- Core notifications
- Quiet hours
- User controls

---

# 69. Later Releases

The following should not block the core connection MVP:

### Phase 2

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

### Phase 3

- Video
- More advanced temporary spaces
- Expanded activity integrations
- More advanced trust systems
- Expanded language support
- More sophisticated matching

This ordering is a delivery plan, not a change to the product vision.

---

# 70. Acceptance Criteria

A feature is complete only when:

1. Its primary user flow works.
2. Its failure states work.
3. Its privacy permissions work.
4. Its safety controls work.
5. Blocking is respected.
6. Account pause/deletion behavior is respected.
7. Notifications behave correctly.
8. Data retention is defined.
9. Relevant edge cases are tested.
10. The feature does not introduce unnecessary engagement pressure.

---

# 71. Required Edge-Case Tests

Engineering/QA must test at minimum:

### Paused account

- Removed from discovery
- Existing connections preserved
- No new matching
- Correct restoration behavior

### Block

- Existing interaction stops
- New requests fail
- Discovery exclusion applies
- No supported bypass

### Ended connection

- Does not automatically reopen
- Reconnection follows mutual-interest rules

### Inactive user

- Not interpreted as rejection
- Correct discovery state
- Existing relationship preserved

### Expired temporary space

- Space closes
- New participation stops
- Reconnection flow becomes available

### Report

- Protective action works
- Review workflow starts
- Evidence handling works
- Appeal is available where applicable

### Account deletion

- Correct deletion state
- User receives clear consequences
- Required retention is handled
- Other users receive minimal necessary information

### No human match

- No fabricated human
- Honest alternative paths appear

---

# 72. Success Measurement

LiGN should measure meaningful connection rather than engagement.

Useful measurements:

### Meaningful mutual connections

Users who mutually choose to continue after an actual interaction.

### Connection continuation

Connections that voluntarily continue beyond the initial interaction.

### Connection quality

Private user feedback around:

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

Metrics must not incentivize users to remain in unwanted interactions.

---

# 73. North Star

## Meaningful Mutual Connections

A meaningful mutual connection requires:

1. Two users voluntarily choose to continue.
2. They have had an actual interaction.
3. The interaction has not immediately ended.
4. The connection remains voluntary.

The metric must never be increased by making it harder to leave.

---

# 74. Monetization

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

# 75. Product Vocabulary

Use:

**Connection** — general relationship term

Context-specific:

- Chat buddy
- Pen pal
- Listener
- Friend
- Trusted Person

Do not force users to define a relationship prematurely.

---

# 76. Final Product Test

Before approving a new feature, evaluate it against:

1. Does it make genuine human connection easier?
2. Does it preserve user choice?
3. Does it preserve privacy?
4. Does it respect boundaries?
5. Does it avoid popularity/engagement mechanics?
6. Does it preserve the distinction between peer connection, professional care and emergency support?

If not, the feature requires explicit product review before implementation.

---

# 77. Definition of Done

The first public version is ready when a new user can:

1. Create an account safely.
2. Create a private, non-appearance-dependent profile.
3. State what kind of connection they need.
4. Set relevant preferences and boundaries.
5. Find an appropriate human connection.
6. Start a conversation without pressure.
7. Establish a mutual connection.
8. Continue, pause, archive or end it.
9. Reconnect only through the defined mutual process.
10. Block or report another user at any point.
11. Access appropriate safety resources when necessary.
12. Pause or delete their account.
13. Understand how their information is handled.
14. Participate without competing for popularity or attention.

---

# 78. Canonical Product Loop

The product should ultimately revolve around one simple system:

**Need → Human → Conversation → Mutual Connection → Relationship**

Everything else—matching, profiles, activities, groups, listening, scheduling, memories, trust and safety—exists to make that loop **safer, easier, more human and more voluntary**.

That is the implementation boundary for LiGN.
