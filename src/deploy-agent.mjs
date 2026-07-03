/**
 * Minimal DireWolfVPS agent deployment demo.
 *
 * This script intentionally avoids bundling wallet code so it can be read safely.
 * In production, wrap `fetch` with an x402-capable client such as x402-fetch,
 * sign the HTTP 402 payment challenge, then retry the top-up request with X-PAYMENT.
 */
const API = process.env.DIREWOLFVPS_API_BASE || "https://direwolfvps.com/api/v1";

/**
 * Sends a JSON request to the DireWolfVPS API.
 *
 * @param {string} path API path beginning with `/`.
 * @param {RequestInit & {json?: unknown}} options Fetch options plus optional JSON body.
 * @returns {Promise<{status: number, body: unknown}>} Parsed API response.
 */
async function api(path, options = {}) {
  const headers = new Headers(options.headers || {});
  headers.set("Accept", "application/json");
  if (options.json !== undefined) headers.set("Content-Type", "application/json");

  const response = await fetch(`${API}${path}`, {
    ...options,
    headers,
    body: options.json === undefined ? options.body : JSON.stringify(options.json),
  });

  const text = await response.text();
  const body = text ? JSON.parse(text) : null;
  return { status: response.status, body };
}

/**
 * Demonstrates the account, x402 top-up and deploy flow.
 *
 * @returns {Promise<void>} Resolves when the demo prints the next required action.
 */
async function main() {
  console.log("Discover:", "https://direwolfvps.com/.well-known/agents.json");

  const account = await api("/account", { method: "POST" });
  if (account.status >= 400) throw new Error(`Account creation failed: ${account.status}`);

  const apiKey = account.body.api_key;
  const auth = { Authorization: `Bearer ${apiKey}` };

  const topup = await api("/topups", {
    method: "POST",
    headers: { ...auth, "X-Payment-Mode": "x402" },
    json: { amount: Number(process.env.DIREWOLFVPS_TOPUP_AMOUNT || 25) },
  });

  if (topup.status === 402) {
    console.log("Received x402 payment challenge:");
    console.log(JSON.stringify(topup.body, null, 2));
    console.log("Next: sign the challenge with an x402 client and retry with X-PAYMENT.");
    return;
  }

  console.log("Top-up response:", JSON.stringify(topup.body, null, 2));
  console.log("After balance is credited, deploy with POST /servers:");
  console.log(JSON.stringify({
    plan: process.env.DIREWOLFVPS_PLAN || "hunter",
    location: process.env.DIREWOLFVPS_LOCATION || "nl",
    os: process.env.DIREWOLFVPS_OS || "debian-13",
  }, null, 2));
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
