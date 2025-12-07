const REQUIRED_ENV_VARS = ["NEXT_PUBLIC_API_BASE_URL"] as const;

type RequiredEnvVar = (typeof REQUIRED_ENV_VARS)[number];

const cache = new Map<string, string>();

function readEnv(key: RequiredEnvVar): string {
  if (cache.has(key)) {
    return cache.get(key)!;
  }

  const value = process.env[key];

  if (!value) {
    throw new Error(
      `Missing required environment variable: ${key}. ` +
        "Add it to your .env.local file before running the frontend."
    );
  }

  cache.set(key, value);
  return value;
}

export const env = {
  apiBaseUrl: () => readEnv("NEXT_PUBLIC_API_BASE_URL"),
};
