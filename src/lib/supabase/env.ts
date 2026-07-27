import "server-only";

function required(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

export const supabaseEnv = {
  url: required("SUPABASE_URL"),
  publishableKey: required("SUPABASE_PUBLISHABLE_KEY"),
  secretKey: required("SUPABASE_SECRET_KEY"),
};
