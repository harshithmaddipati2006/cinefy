import Razorpay from "razorpay";

let razorpayInstance = null;

/**
 * Returns true if real, non-placeholder Razorpay API keys are configured.
 */
export function isRazorpayConfigured() {
  const key_id = process.env.RAZORPAY_KEY_ID;
  const key_secret = process.env.RAZORPAY_KEY_SECRET;

  if (!key_id || !key_secret) return false;

  const trimmedId = key_id.trim();
  const trimmedSecret = key_secret.trim();

  // Exclude default placeholder / template values
  if (
    trimmedId === "" ||
    trimmedId === "MY_RAZORPAY_KEY_ID" ||
    trimmedId.includes("your_key_id") ||
    trimmedId.includes("your_razorpay") ||
    trimmedId.includes("placeholder") ||
    trimmedId.includes("demo") ||
    trimmedSecret === "" ||
    trimmedSecret === "MY_RAZORPAY_KEY_SECRET" ||
    trimmedSecret.includes("your_razorpay") ||
    trimmedSecret.includes("placeholder")
  ) {
    return false;
  }

  // Must match Razorpay standard key format (rzp_test_... or rzp_live_...)
  return trimmedId.startsWith("rzp_test_") || trimmedId.startsWith("rzp_live_");
}

/**
 * Returns a configured Razorpay instance.
 * Lazy-initialized to prevent server crashes if environment variables are missing.
 */
export function getRazorpayInstance() {
  const key_id = process.env.RAZORPAY_KEY_ID;
  const key_secret = process.env.RAZORPAY_KEY_SECRET;

  if (!isRazorpayConfigured()) {
    return null;
  }

  const effectiveKeyId = key_id.trim();
  const effectiveKeySecret = key_secret.trim();

  if (!razorpayInstance || razorpayInstance.key_id !== effectiveKeyId) {
    razorpayInstance = new Razorpay({
      key_id: effectiveKeyId,
      key_secret: effectiveKeySecret
    });
  }

  return razorpayInstance;
}

export function getPublicRazorpayKeyId() {
  if (isRazorpayConfigured()) {
    return process.env.RAZORPAY_KEY_ID.trim();
  }
  return "rzp_test_cinefy_demo";
}

export function getRazorpayWebhookSecret() {
  return process.env.RAZORPAY_WEBHOOK_SECRET || process.env.RAZORPAY_KEY_SECRET || "cinefy_webhook_secret_2026";
}

