# Mobile API contracts (`/api/v1`)

Derived from the live Laravel implementation in `our-moment-web/` (not invented):

- `routes/api.php`
- `app/Http/Controllers/Api/V1/*`
- `app/Http/Resources/Api/V1/*`
- `app/Support/ApiResponse.php`
- Feature tests under `tests/Feature/Api/V1/`

Envelope:

- Success: `{ "data": ... }` via `ApiResponse::data` **or** Laravel paginated resource `{ data, links, meta }` for list endpoints that return `*Resource::collection($paginator)`.
- Domain error: `{ "message", "code", "details?" }`
- Validation: Laravel 422 `{ "message", "errors": { field: string[] } }`

Auth: Sanctum Personal Access Token — `Authorization: Bearer {token}`.

---

## Auth

| Method | Path | Auth | Notes |
| --- | --- | --- | --- |
| POST | `/auth/register` | — | 201 `{ token, token_type, user }` |
| POST | `/auth/login` | — | 401 `invalid_credentials` |
| POST | `/auth/logout` | Bearer | `{ revoked: true }` |
| POST | `/auth/password/forgot` | — | 404 if `password_reset_enabled` false |
| POST | `/auth/password/reset` | — | Revokes all PATs on success |

## Me / credits

| Method | Path | Auth |
| --- | --- | --- |
| GET | `/me` | Bearer → `UserResource` |
| GET | `/credits/balance` | Bearer → `{ credits }` |

**Gap:** `DELETE /me/account` is documented in `MOBILE_API_ARCHITECTURE.md` but **not** registered in `routes/api.php`.

## Templates (Styles)

| Method | Path | Auth |
| --- | --- | --- |
| GET | `/templates` | Public · **paginated** collection |
| GET | `/templates/{id}` | Public · inactive → 422 `template_inactive` |

## Moments (creator)

| Method | Path | Notes |
| --- | --- | --- |
| POST | `/moments/start` | `{ template_id }` |
| GET | `/moments` | Paginated summaries; `?state=draft\|activated` |
| GET/DELETE | `/moments/{id}` | |
| PATCH | `.../names\|theme\|settings` | Blocked when activated (`moment_immutable`) |
| PUT | `.../steps/{stepId}` | |
| GET | `.../preview` | `{ moment_id, state, config, can_publish, missing_steps }` |
| GET | `.../activation-status` | `{ state, public_link, public_token, credits_remaining }` |
| GET | `.../reactions` | Inbox |
| POST | `.../activate` | Server decides free / credit / payment |
| POST | `.../duplicate\|revoke-link\|rotate-link` | |
| POST/PATCH/DELETE | `.../media` | Upload / reorder / update / delete |
| GET | `/media/{media}` | Owned file stream |

## Payments

| Method | Path | Auth |
| --- | --- | --- |
| POST | `/payments/initiate` | Bearer `{ moment_id }` |
| GET | `/payments/status?tx_ref=` | **No Bearer** — tx_ref possession |

## Public recipient

| Method | Path | Notes |
| --- | --- | --- |
| GET | `/public/{publicToken}` | `{ public_token, moment_id, state, is_creator, config }` |
| POST | `.../verify-interaction` | `{ kind: lock\|question, attempt }` |
| POST | `.../reactions` | 201 Reaction |
| GET | `.../media/{media}` | Stream |

Canonical web play URL remains `GET /m/{public_token}` (Inertia). Mobile player boundary may WebView that URL temporarily while consuming JSON config from `/api/v1/public/{token}`.

---

## Resource field mirrors

See TypeScript in `src/types/api.ts` (generated from Resources, not guessed).

States: `draft` | `activated` — UI labels **Still editing** / **Sent**.

## Backend gaps (do not invent workarounds)

1. **Account deletion** — architecture doc lists `DELETE /api/v1/me/account`; route/controller method missing.
2. **Password reset deep link** — mobile reset screen accepts `token`+`email`; web email still points at web reset URL unless product updates the notification.
3. **Universal Links hosting** — app config declares domains; AASA / assetlinks must be served by web ops before Flow A works on installed apps.
4. **Gift wheel / campaign** — optional in architecture; not on `/api/v1`.
5. **Credit pack purchase** — product-wide unavailable (web 410); not exposed on v1.
