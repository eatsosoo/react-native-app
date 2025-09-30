import 'dotenv/config';
import { ExpoConfig } from 'expo/config';

const APP_ENV = process.env.APP_ENV ?? 'development';

const config: ExpoConfig = {
  name: 'first_app',
  slug: 'first_app',
  version: '1.0.0',
  scheme: 'firstapp',
  extra: {
    APP_ENV,
    API_URL: process.env.API_URL ?? 'http://localhost:3000',
    SENTRY_DSN: process.env.SENTRY_DSN ?? '',
  },
};

export default config;


