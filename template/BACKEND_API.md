# Backend API Specification — Poster Template Platform

> **Scope:** All APIs required to back the Next.js template app.  
> **Excluded:** User authentication (already implemented separately).  
> **Base URL:** `/api/v1`  
> **Format:** JSON request/response bodies unless stated otherwise.  
> **Auth:** Every request requires a valid JWT bearer token (`Authorization: Bearer <token>`). The token identifies the adviser (user). Compliance officers receive an additional `role: compliance` claim.

---

## 1. Data Models

### Poster
```jsonc
{
  "id": "string",              // UUID
  "adviserId": "string",       // owner — from JWT
  "name": "string",
  "status": "draft | review | approved | rejected | shared",
  "cat": "life | ci | ret | sav | event | greet",
  "size": "1080x1350 | 1080x1080 | 1200x628 | 1080x1920",
  "templateId": "string",
  "heroImage": "string",       // photo key: couple | toast | dinner | headshot | asset://<id>
  "eyebrow": "string",
  "headline": "string",
  "body": "string | null",
  "cta": "string | null",
  "eventDate": "string | null", // ISO date YYYY-MM-DD
  "campaign": "string | null",  // campaign id
  "extras": [],                 // see ExtraElement below
  "slotStyles": {},             // map of slot name → SlotStyle
  "shares": 0,
  "created": 1234567890,        // unix ms
  "updated": 1234567890,
  "versions": []                // see PosterVersion below
}
```

### PosterVersion
```jsonc
{
  "seq": 1,
  "label": "string",             // e.g. "Submitted for review"
  "source": "adviser | system | compliance",
  "at": 1234567890,              // unix ms
  "snapshot": { /* full poster fields at this point */ },
  "approved": false,
  "rejectionNote": "string | null"
}
```

### ExtraElement
```jsonc
{
  "id": "string",
  "kind": "heading | text | checklist | callout | stat | …",
  "x": 120,
  "y": 340,
  "scale": 1.0,
  "rot": 0,
  "color": "#D31145",
  "text": "string | null"
}
```

### Template (read-only, seeded by platform)
```jsonc
{
  "id": "string",
  "cat": "string",
  "name": "string",
  "layout": "hero | bleed | split",
  "bg": "#fff",
  "panel": "#fff",
  "accentColor": "#D31145",
  "heroImage": "couple",
  "defaults": { "eyebrow": "", "headline": "", "body": "", "cta": "" },
  "isActive": true
}
```

---

## 2. Poster APIs

### 2.1 List posters
```
GET /posters
```
**Query params**

| Param | Type | Description |
|-------|------|-------------|
| `status` | string | Filter by status (comma-separated) |
| `cat` | string | Filter by category |
| `campaign` | string | Filter by campaign id |
| `page` | int | Page number (default 1) |
| `limit` | int | Items per page (default 20, max 100) |
| `sort` | string | `updated` (default) or `created` |

**Response 200**
```jsonc
{
  "data": [ /* Poster[] without versions */ ],
  "total": 42,
  "page": 1,
  "pages": 3
}
```

---

### 2.2 Get poster
```
GET /posters/:id
```
Returns full `Poster` including `versions[]`.

**Response 200** — full Poster object  
**Response 403** — poster belongs to a different adviser  
**Response 404** — not found

---

### 2.3 Create poster
```
POST /posters
```
**Body**
```jsonc
{
  "templateId": "life-focus-01",
  "size": "1080x1350",
  "cat": "life",
  "name": "My new poster",
  "campaign": null,              // optional
  "eyebrow": "Life Protection",
  "headline": "Your Future in Focus",
  "body": null,
  "cta": "Talk to me",
  "eventDate": null
}
```
Server sets `status: "draft"`, creates first version `{ seq:1, label:"Created", source:"system" }`, stamps `created`/`updated`.

**Response 201** — full Poster

---

### 2.4 Update poster (auto-save)
```
PATCH /posters/:id
```
Accepts any subset of editable fields:
```jsonc
{
  "name": "string",
  "eyebrow": "string",
  "headline": "string",
  "body": "string | null",
  "cta": "string | null",
  "heroImage": "string",
  "extras": [],
  "slotStyles": {},
  "eventDate": "string | null"
}
```
- Only allowed when `status` is `draft` or `rejected`.
- Bumps `updated`. Does **not** create a new version (versions are milestone-only).

**Response 200** — updated Poster  
**Response 409** — cannot edit a poster in `review` or `approved` state

---

### 2.5 Delete poster
```
DELETE /posters/:id
```
Soft-delete (sets `deletedAt`). Cannot delete a poster in `review`.

**Response 204**  
**Response 409** — poster is under review

---

### 2.6 Duplicate poster
```
POST /posters/:id/duplicate
```
Creates a new `draft` poster copying all fields except `status`, `versions`, `shares`, `campaign`. New name prefixed with `"Copy of "`.

**Response 201** — new Poster

---

## 3. Compliance Workflow

### 3.1 Submit for review
```
POST /posters/:id/submit
```
- Allowed only from `draft` or `rejected` status.
- Changes `status → review`.
- Appends version: `{ label:"Submitted for review", source:"adviser" }`.
- Triggers notification to compliance team (email / in-app).

**Body** — empty  
**Response 200** — updated Poster

---

### 3.2 Approve poster *(compliance officer only)*
```
POST /posters/:id/approve
```
- Requires `role: compliance` in JWT.
- Changes `status → approved`.
- Appends version: `{ label:"Approved by Compliance", source:"compliance", approved:true }`.
- Triggers notification to adviser.

**Body**
```jsonc
{ "note": "Looks good." }   // optional
```
**Response 200** — updated Poster  
**Response 403** — caller is not compliance

---

### 3.3 Reject poster *(compliance officer only)*
```
POST /posters/:id/reject
```
- Requires `role: compliance` in JWT.
- Changes `status → rejected`.
- Appends version: `{ label:"Returned by Compliance", source:"compliance", rejectionNote:"..." }`.
- Triggers notification to adviser with rejection note.

**Body**
```jsonc
{ "note": "Please remove the performance figures on line 2." }
```
**Response 200** — updated Poster  
**Response 403** — caller is not compliance

---

### 3.4 List posters pending review *(compliance only)*
```
GET /compliance/queue
```
Returns posters with `status: "review"` across all advisers.

**Query params** — same pagination as `/posters`

**Response 200**
```jsonc
{
  "data": [ /* Poster[] with adviser name */ ],
  "total": 7
}
```

---

## 4. Download / Export

### 4.1 Download poster as PNG
```
GET /posters/:id/export/png
```
**Query params**

| Param | Default | Description |
|-------|---------|-------------|
| `scale` | `1` | Pixel ratio (1 = native px, 2 = @2x) |
| `version` | latest | Specific version `seq` to export |

Server renders the poster server-side (Puppeteer / headless Chrome or canvas-based renderer) at the poster's native size (`size` field) and streams back a PNG.

**Response 200** — `Content-Type: image/png`, `Content-Disposition: attachment; filename="<poster-name>.png"`  
**Response 403** — poster not approved (only approved posters can be downloaded by non-owners; owner can download any)

---

### 4.2 Download poster as PDF
```
GET /posters/:id/export/pdf
```
Same as PNG but outputs a single-page PDF at print resolution (300 dpi).

**Response 200** — `Content-Type: application/pdf`

---

### 4.3 Get shareable preview URL
```
POST /posters/:id/preview-link
```
Generates a short-lived signed URL (valid 24 h) that renders the poster in a read-only viewer — for sending to a client via WhatsApp or email without needing to export first.

**Response 200**
```jsonc
{ "url": "https://app.example.com/p/abc123?sig=...", "expiresAt": 1234567890 }
```

---

## 5. Share Tracking

### 5.1 Record a share
```
POST /posters/:id/share
```
Called by the front-end when the adviser actually sends the poster (copies WhatsApp link, saves image, etc.).

**Body**
```jsonc
{ "channel": "whatsapp | instagram | facebook | email | download" }
```
Increments `poster.shares`. Appends a lightweight share event (for analytics).

**Response 200**
```jsonc
{ "shares": 5 }
```

---

## 6. Templates

### 6.1 List templates
```
GET /templates
```
**Query params** — `cat` to filter by category.

**Response 200**
```jsonc
{ "data": [ /* Template[] */ ] }
```

### 6.2 Get template
```
GET /templates/:id
```
**Response 200** — single Template

---

## 7. Campaigns

### 7.1 List campaigns
```
GET /campaigns
```
Returns campaigns that are currently active (i.e., `until` date ≥ today).

**Query params** — `all=true` to include expired campaigns.

**Response 200**
```jsonc
{ "data": [ /* Campaign[] */ ] }
```

### 7.2 Get campaign
```
GET /campaigns/:id
```

### 7.3 Create campaign posters from campaign
```
POST /campaigns/:id/adopt
```
Generates a set of draft posters for the adviser pre-populated with the campaign's poster specs (template, size, eyebrow, etc.) and the adviser's own details.

**Response 201**
```jsonc
{ "posterIds": ["abc", "def", "ghi"] }
```

---

## 8. Occasions

### 8.1 List upcoming occasions
```
GET /occasions
```
**Query params**

| Param | Default | Description |
|-------|---------|-------------|
| `upcoming` | `true` | Only return occasions with date ≥ today |
| `days` | `90` | Look-ahead window in days |

**Response 200**
```jsonc
{ "data": [ /* Occasion[] with computed `days` field */ ] }
```

### 8.2 Create occasion poster
```
POST /occasions/:id/create-poster
```
Creates a draft poster using the occasion's template and pre-filled content.

**Response 201** — new Poster

---

## 9. AI Content Generation

### 9.1 Rewrite text
```
POST /ai/rewrite
```
Rewrites a single text field using the adviser's tone and compliance-safe language.

**Body**
```jsonc
{
  "field": "headline | eyebrow | body | cta",
  "current": "Your money matters",
  "cat": "sav",
  "style": "shorter | punchier | friendlier | formal"
}
```
**Response 200**
```jsonc
{ "result": "Goals Within Reach — Let's Plan Yours" }
```

### 9.2 Generate full poster copy
```
POST /ai/generate
```
Generates all text fields for a new poster given category, purpose, and audience hint.

**Body**
```jsonc
{
  "cat": "life",
  "templateId": "life-focus-01",
  "audienceHint": "young families",
  "eventDate": null
}
```
**Response 200**
```jsonc
{
  "eyebrow": "Life Protection",
  "headline": "Cover the People Who Matter Most",
  "body": "Affordable life cover that keeps your family's plans on track, whatever tomorrow holds.",
  "cta": "Book a chat"
}
```

---

## 10. Photo / Asset Management

### 10.1 List available photos
```
GET /assets/photos
```
Returns the stock photo library (couple, toast, dinner, headshot) plus any custom photos the adviser has uploaded.

**Response 200**
```jsonc
{
  "data": [
    { "id": "couple",   "label": "Couple",   "src": "https://cdn.example.com/photos/couple.jpg",   "origin": "stock" },
    { "id": "toast",    "label": "Cheers",   "src": "https://cdn.example.com/photos/toast.jpg",    "origin": "stock" },
    { "id": "dinner",   "label": "Dinner",   "src": "https://cdn.example.com/photos/dinner.jpg",   "origin": "stock" },
    { "id": "headshot", "label": "Portrait", "src": "https://cdn.example.com/photos/headshot.jpg", "origin": "stock" },
    { "id": "custom-abc123", "label": "My photo", "src": "...", "origin": "upload" }
  ]
}
```

### 10.2 Upload custom photo
```
POST /assets/photos
Content-Type: multipart/form-data
```
**Form fields**

| Field | Type | Description |
|-------|------|-------------|
| `file` | File | JPEG or PNG, max 10 MB |
| `label` | string | Optional display name |

Server validates file type, resizes to max 2000 px on the long edge, stores to object storage, returns asset record.

**Response 201**
```jsonc
{ "id": "asset://custom-abc123", "label": "My photo", "src": "https://cdn.example.com/..." }
```

### 10.3 Delete custom photo
```
DELETE /assets/photos/:id
```
Cannot delete a photo that is currently used by any poster in `approved` status.

**Response 204**

---

## 11. Adviser Profile

### 11.1 Get profile
```
GET /adviser/me
```
**Response 200**
```jsonc
{
  "id": "string",
  "name": "Jane Tan",
  "firstName": "Jane",
  "title": "Financial Services Consultant",
  "phone": "+65 9123 4567",
  "email": "jane.tan@example.com",
  "repNo": "Rep. No. JT0012345",
  "avatarUrl": "https://cdn.example.com/avatars/..."
}
```

### 11.2 Update profile
```
PATCH /adviser/me
```
Accepts any subset of editable fields (`name`, `firstName`, `title`, `phone`).  
Changes propagate to posters at render time — not stored in poster snapshots, so old versions still re-render with the original details.

**Response 200** — updated profile

### 11.3 Upload avatar
```
POST /adviser/me/avatar
Content-Type: multipart/form-data
```
**Response 200**
```jsonc
{ "avatarUrl": "https://cdn.example.com/avatars/..." }
```

---

## 12. Notifications

### 12.1 Get notifications
```
GET /notifications
```
**Query params** — `unread=true` to filter to unseen only.

**Response 200**
```jsonc
{
  "data": [
    { "id": "n1", "type": "approved | rejected | review_received", "posterId": "abc", "posterName": "Deepavali greeting", "message": "Approved by Compliance", "at": 1234567890, "read": false }
  ],
  "unreadCount": 3
}
```

### 12.2 Mark notifications read
```
POST /notifications/read
```
**Body**
```jsonc
{ "ids": ["n1", "n2"] }   // or omit to mark all read
```
**Response 200** — `{ "unreadCount": 0 }`

---

## 13. Analytics (read-only)

### 13.1 Summary stats
```
GET /analytics/summary
```
**Response 200**
```jsonc
{
  "totalPosters": 24,
  "drafts": 8,
  "awaitingReview": 3,
  "approved": 11,
  "totalShares": 47,
  "sharesByChannel": { "whatsapp": 30, "instagram": 10, "download": 7 }
}
```

---

## 14. Error Responses

All errors follow a consistent envelope:

```jsonc
{
  "error": {
    "code": "POSTER_NOT_FOUND",
    "message": "No poster with id abc123 exists.",
    "field": null        // set for validation errors
  }
}
```

| HTTP | Code | Meaning |
|------|------|---------|
| 400 | `VALIDATION_ERROR` | Invalid request body / params |
| 403 | `FORBIDDEN` | Caller does not own this resource or lacks the required role |
| 404 | `NOT_FOUND` | Resource does not exist |
| 409 | `CONFLICT` | State machine violation (e.g. editing an approved poster) |
| 429 | `RATE_LIMITED` | Too many requests (AI endpoints: 20 req/min) |
| 500 | `INTERNAL_ERROR` | Unexpected server error |

---

## 15. Poster Status State Machine

```
           ┌──────────────────────────────────────┐
           │                                      │
  [create] ▼    [submit]       [approve]          │
  ─────▶ draft ──────────▶ review ──────────▶ approved
           ▲                   │                  │
           │                   │ [reject]         │ [share]
           │                   ▼                  ▼
           └──────────── rejected            shared (counter only,
                                              status stays approved)
```

Allowed transitions:

| From | Action | To | Who |
|------|--------|----|----|
| `draft` | submit | `review` | adviser |
| `review` | approve | `approved` | compliance |
| `review` | reject | `rejected` | compliance |
| `rejected` | submit | `review` | adviser |
| `approved` | — | — | (immutable; duplicate to make changes) |

---

## 16. Recommended Tech Stack

| Concern | Suggestion |
|---------|-----------|
| Runtime | Node.js 20 + TypeScript |
| Framework | Express 5 or Fastify 4 |
| ORM | Prisma (PostgreSQL) |
| Object storage | AWS S3 / Cloudflare R2 |
| Poster rendering | Puppeteer (headless Chrome) or `@napi-rs/canvas` |
| AI integration | Anthropic Messages API (`claude-haiku-4-5`) |
| Job queue | BullMQ (Redis) — for export and notification jobs |
| Real-time notifications | Server-Sent Events or Pusher |
| Email | Resend or SendGrid |
