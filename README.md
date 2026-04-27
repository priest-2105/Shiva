## Getting Started

Run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000).

## App Authentication Setup

This project uses NextAuth, Prisma, PostgreSQL, and Google OAuth for app authentication.

1. Copy `.env.example` to `.env.local`.
2. Create a Google OAuth client in Google Cloud Console.
3. Add this authorized redirect URI:

```text
http://localhost:3000/api/auth/callback/google
```

4. Fill in your database URL, auth secret, and Google OAuth credentials:

```bash
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/shiva?schema=public"
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=replace_this_with_a_long_random_secret
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...
```

5. Generate the Prisma client:

```bash
npx prisma generate
```

6. Create and apply the initial auth migration:

```bash
npx prisma migrate dev --name init_auth
```

7. Start the app and sign in at `/login` or `/signup`.

Relevant files:

- `prisma/schema.prisma`
- `prisma.config.ts`
- `lib/auth.ts`
- `app/api/auth/[...nextauth]/route.ts`

Password reset:

- `app/api/auth/forgot-password/route.ts`
- `app/api/auth/reset-password/route.ts`
- `app/(auth)/forgot-password/page.tsx`
- `app/(auth)/reset-password/page.tsx`

In development, the forgot-password endpoint returns a `resetUrl` in the response so you can test the flow without an email provider. Do not rely on that in production.

## Figma OAuth Setup

1. Create a Figma OAuth app in `https://www.figma.com/developers/apps`.
2. Add this redirect URL in the app config:

```text
http://localhost:3000/api/figma/oauth/callback
```

3. Select the `file_content:read` scope.
4. Copy `.env.example` to `.env.local` and fill in your Figma credentials:

```bash
FIGMA_CLIENT_ID=...
FIGMA_CLIENT_SECRET=...
FIGMA_OAUTH_REDIRECT_URI=http://localhost:3000/api/figma/oauth/callback
FIGMA_OAUTH_SCOPES=file_content:read
```

5. Start the app, open `/chat/1`, and use the `Figma Selection Inspector` card.
6. Paste a selected frame URL such as:

```text
https://www.figma.com/design/FILE_KEY/File-Name?node-id=12-34
```

The inspector will exchange the OAuth code server-side, store the Figma token in an HTTP-only cookie, and call the Files API to fetch the selected node metadata.

## Notes

- Figma OAuth authorization uses `https://www.figma.com/oauth`.
- Token exchange uses `POST https://api.figma.com/v1/oauth/token`.
- Selected frame metadata is fetched through `GET /v1/files/:key/nodes`.
