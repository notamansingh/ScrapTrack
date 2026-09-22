# ScrapTrack

ScrapTrack helps tradie businesses monitor scrap from the jobsite to the warehouse, tracking real-time weight, estimated payout (AUD), and CO2 mitigation, with photo/receipt proof of disposal stored in Cloudflare R2.

## Stack

- **Backend:** FastAPI, SQLModel (async, Postgres via `asyncpg`), Cloudflare R2 (`aioboto3`)
- **Frontend:** Next.js (pages router), React, Tailwind CSS

## Setup

### Backend

```bash
python -m venv .venv
.venv/Scripts/activate        # or `source .venv/bin/activate` on macOS/Linux
pip install -r requirements.txt
```

Create `app/.env`:

```
DATABASE_URL=postgresql+asyncpg://user:pass@host:5432/scraptrack
R2_ACCOUNT_ID=...
R2_ACCESS_KEY_ID=...
R2_SECRET_ACCESS_KEY=...
R2_BUCKET_NAME=scraptrack-uploads
```

Build tables and seed the environmental impact reference data:

```bash
PYTHONPATH=. python scripts/seed.py
```

Run the API:

```bash
PYTHONPATH=. uvicorn app.main:app --port 8123
```

### Frontend

```bash
npm install
```

Create `.env.local` in the repo root:

```
NEXT_PUBLIC_API_URL=http://127.0.0.1:8123
```

Run the dashboard:

```bash
npm run dev
```

Visit `http://localhost:3000`.

## API

| Endpoint | Method | Description |
|---|---|---|
| `/disposals/create_disposal` | POST | Create a disposal record (multipart: `file` + `metadata` JSON) and upload the receipt photo to R2 |
| `/disposals/` | GET | List all disposals, newest first, with a presigned receipt URL |
| `/disposals/summary` | GET | Aggregate totals: weight, valuation, CO2 mitigation |
| `/materials/metrics` | GET | Environmental impact reference data per metal grade |

## Tests

Non-DB logic (the analytics aggregation) has a runnable self-check:

```bash
PYTHONPATH=. python scripts/test_summary.py
```

## Known gaps

- No auth — the API trusts every caller.
- `estimated_payout_aud` is client-supplied; there's no server-side pricing table yet.
- No pagination on `/disposals/`.
