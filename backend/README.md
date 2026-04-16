# London Estate Agency – Backend API

Node.js (Express) + TypeScript + Prisma. Database: **PostgreSQL on Aiven**.

## Setup

```bash
npm install
cp .env.example .env   # then set DATABASE_URL to your Aiven connection string
npx prisma generate
```

## Database on Aiven

Tables are created on your **Aiven PostgreSQL** instance.

- **First-time setup:**  
  `NODE_TLS_REJECT_UNAUTHORIZED=0 npx prisma db push`  
  (Then run seed once.)

- **Seed (3 London properties):**  
  `NODE_TLS_REJECT_UNAUTHORIZED=0 npx prisma db seed`

If you see a TLS "bad certificate format" error, either:

- Run commands with `NODE_TLS_REJECT_UNAUTHORIZED=0` (dev only), or  
- Download the CA certificate from your Aiven project and configure your environment to use it.

**Deployment (Render, etc.):** Add `&connection_limit=5` to your `DATABASE_URL` to avoid "too many clients" errors. Aiven free tier has ~20 connections; limiting Prisma prevents exhausting the pool.

## Run

```bash
# Development (with Aiven TLS workaround if needed)
NODE_TLS_REJECT_UNAUTHORIZED=0 npm run dev
```

Server: **http://localhost:4000**

## API

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/health` | Health check |
| GET | `/api/properties` | List properties (query: `type`, `minPrice`, `maxPrice`) |
| GET | `/api/properties/:id` | Single property by id |
| POST | `/api/auth/login` | Login (body: `email`, `password`) |
| POST | `/api/auth/register` | Register (body: `email`, `password`, `name?`, `role?`) |
| GET | `/api/auth/me` | Current user (Authorization: Bearer token) |
| POST | `/api/enquiries` | Submit enquiry (body: `name`, `email`, `phone?`, `subject?`, `message`, `consent`) |
| POST | `/api/maintenance-requests` | Submit maintenance request (body: `tenantName`, `tenantEmail`, `propertyAddressOrRef`, `issueCategory`, `description`, `urgency?`) |
| GET | `/api/users/me/favorites` | List favorites (auth) |
| POST | `/api/users/me/favorites/:propertyId` | Add favorite (auth) |
| DELETE | `/api/users/me/favorites/:propertyId` | Remove favorite (auth) |

## Schema (Prisma)

- **User** – email, hashedPassword, name, role (TENANT | LANDLORD | ADMIN).
- **Property** – title, slug, description, address, city, postCode, listingType (RENTAL | HOLIDAY_LET), beds, baths, areaSqFt, pricePerMonth, isFeatured, images, area.
- **Enquiry** – name, email, phone?, subject?, message, consent, source, propertyId?.
- **Favorite** – userId, propertyId (unique per user+property).
- **MaintenanceRequest** – tenantName, tenantEmail, propertyAddressOrRef, issueCategory, description, urgency, status.
