# Data Model Transition

## 1. Current Prototype Model (The `EventItem` Aggregate)

In the current prototype, data is persisted locally as an array of `EventItem` objects. This aggregate acts as a monolithic representation of the event and its analytics.

```typescript
// Current Prototype Shape
Event
├── id
├── title
├── organizer
├── location
├── date
├── status
├── branding
├── attendeeInputsConfig
├── prompts
├── stats
├── photographyStream
└── attendeeFeed
```

## 2. Target Production Schema

For production, where multiple attendees interact with the same event concurrently and authentication barriers exist, this monolithic aggregate must be separated into normalized entities.

### Recommended Entities:

*   **User / Organization:** Represents organizers, corporate accounts, billing, and roles.
*   **Event:** Core metadata (`id`, `slug`, `title`, `date`, `location`, `status`, `organization_id`).
*   **EventBranding:** Visual assets (`cover_image`, `logo`, `colors`).
*   **EventSettings:** Configured rules for attendees (`allowPhotos`, `allowTakeaways`, configured `prompts`).
*   **AttendeeSession:** Unique identity for attendees engaging with the portal (often anonymous but fingerprinted or session-based).
*   **Photo:** Represents an uploaded media asset (`id`, `url`, `event_id`, `attendee_id`).
*   **Generation:** A record of a single AI interaction (inputs, chosen tone, raw LLM output).
*   **Post:** The final, user-approved output ready for LinkedIn sharing.
*   **AnalyticsEvent:** A raw, append-only ledger of telemetry (e.g., `event=photo_uploaded`, `event=post_copied`).

This normalized structure will allow Chronicle to properly handle concurrent users, secure storage, and real-time analytical aggregations.
