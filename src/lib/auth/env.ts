import "server-only";

function required(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

// Server-side secret mixed into every OTP hash so a leaked
// admin_otp_codes.code_hash value can't be brute-forced offline into a
// usable code. Never sent to the client, never derived from anything else.
export const authEnv = {
  otpPepper: required("ADMIN_OTP_PEPPER"),
};
