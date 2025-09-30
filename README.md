# first_app – React Native (Expo Router) Base

A sensible base for React Native apps using Expo Router, theming, i18n, typed env, and an API client.

## Getting started

1. Install dependencies
```bash
npm install
```
2. Create an `.env` file in the project root:
```bash
APP_ENV=development
API_URL=http://10.0.2.2:3000
SENTRY_DSN=
```
3. Run
```bash
npm run start
```

## Structure
```
app/                # Expo Router screens
components/         # Reusable components
  ui/               # Base UI primitives (Button, Input, Screen, Spacer, Icon)
constants/          # Theme tokens
i18n/               # i18next setup
locales/            # Translation JSON files
lib/
  api/              # API client
  env.ts            # Typed env accessor via expo-constants
theme/              # Theme provider and hook
```

## Theming
- Edit `constants/Colors.ts` to change primary/secondary etc.
- Use `useAppTheme()` from `theme/` for colors.

## i18n
- Resources: `locales/en.json`, `locales/vi.json`.
- Initialized in `app/_layout.tsx`; splash waits for i18n + fonts.
- Use hook:
```ts
import { useTranslation } from 'react-i18next';
const { t } = useTranslation();
```
- Change language:
```ts
import { changeLanguage } from '@/i18n';
await changeLanguage('vi');
```

## Environment variables
- Defined via `.env` and read in `app.config.ts` using `dotenv` at build-time.
- Access at runtime via `Env` helper:
```ts
import { Env } from '@/lib/env';
console.log(Env.API_URL);
```

## API client
- Located at `lib/api/client.ts`.
- Usage:
```ts
import { Api } from '@/lib/api/client';
const users = await Api.get<{ id: string }[]>('users');
```
- With body:
```ts
await Api.post('auth/login', { email, password });
```
- Token management:
```ts
import { setAuthToken } from '@/lib/api/client';
await setAuthToken('jwt-token');
```

## Linting & formatting
```bash
npm run lint
npm run format
```

## Notes
- If you change `.env`, restart the dev server to pick up new values.
- For Android emulator, `http://10.0.2.2` points to host machine.
