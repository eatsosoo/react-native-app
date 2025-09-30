import Constants from 'expo-constants';

type Extra = {
  APP_ENV: 'development' | 'staging' | 'production' | string;
  API_URL: string;
  SENTRY_DSN?: string;
};

function getExtra(): Extra {
  const extra = (Constants.expoConfig?.extra ?? {}) as Partial<Extra>;
  return {
    APP_ENV: (extra.APP_ENV as Extra['APP_ENV']) ?? 'development',
    API_URL: extra.API_URL ?? 'http://localhost:3000',
    SENTRY_DSN: extra.SENTRY_DSN ?? '',
  };
}

export const Env = getExtra();


