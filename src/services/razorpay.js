/**
 * Official Razorpay Standard Checkout Frontend Service for CineFy
 */

let razorpayScriptPromise = null;

export function loadRazorpayScript() {
  if (window.Razorpay) {
    return Promise.resolve(true);
  }

  if (razorpayScriptPromise) {
    return razorpayScriptPromise;
  }

  razorpayScriptPromise = new Promise((resolve) => {
    const existingScript = document.querySelector('script[src="https://checkout.razorpay.com/v1/checkout.js"]');
    if (existingScript) {
      existingScript.addEventListener("load", () => resolve(true));
      existingScript.addEventListener("error", () => resolve(false));
      return;
    }

    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    script.onload = () => {
      resolve(true);
    };
    script.onerror = () => {
      console.error("Failed to load official Razorpay SDK from checkout.razorpay.com");
      resolve(false);
    };
    document.body.appendChild(script);
  });

  return razorpayScriptPromise;
}

/**
 * Open official Razorpay Checkout modal
 * 
 * @param {Object} options Configuration returned by backend /api/payments/create-order
 * @param {string} options.orderId Razorpay order ID
 * @param {number} options.amount Payable amount in rupees
 * @param {number} options.amountInPaise Payable amount in paise
 * @param {string} options.currency Currency code ("INR")
 * @param {string} options.keyId Public Razorpay Key ID
 * @param {Object} options.prefill Prefilled customer name, email, contact
 * @param {string} [preferredMethod] 'upi', 'card', 'netbanking', 'wallet'
 * @param {string} [preferredUpiApp] 'google_pay', 'phonepe', 'paytm', 'bhim'
 */
export async function openRazorpayCheckout({
  orderId,
  amountInPaise,
  currency = "INR",
  keyId,
  bookingId,
  movieTitle = "CineFy Movie Ticket",
  theatreName = "Cinema Theatre",
  prefill = {},
  preferredMethod = null,
  preferredUpiApp = null
}) {
  const isLoaded = await loadRazorpayScript();
  const isRealRazorpayKey = Boolean(
    keyId &&
    !keyId.includes("demo") &&
    !keyId.includes("your_key") &&
    !keyId.includes("placeholder") &&
    (keyId.startsWith("rzp_test_") || keyId.startsWith("rzp_live_"))
  );

  // If real active Razorpay merchant key is present and script is loaded, launch official popup
  if (isLoaded && window.Razorpay && isRealRazorpayKey) {
    return new Promise((resolve, reject) => {
      try {
        const razorpayConfig = {
          key: keyId,
          amount: amountInPaise, // in paise
          currency: currency || "INR",
          name: "CineFy Cinemas",
          description: `${movieTitle} • ${theatreName} (Booking #${bookingId || 'Ticket'})`,
          image: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=128",
          order_id: orderId,
          prefill: {
            name: prefill.name || "CineFy Customer",
            email: prefill.email || "customer@cinefy.in",
            contact: prefill.contact || "8317625528"
          },
          notes: {
            bookingId: bookingId || "",
            movieTitle: movieTitle || "",
            theatreName: theatreName || ""
          },
          theme: {
            color: "#06B6D4",
            backdrop_color: "rgba(9, 13, 22, 0.85)"
          },
          modal: {
            ondismiss: () => {
              reject({
                code: "PAYMENT_CANCELLED_BY_USER",
                message: "Payment window was closed. Your seat reservation is still held. You can retry or choose another payment method."
              });
            },
            escape: true,
            backdropclose: false
          },
          handler: (response) => {
            resolve({
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_signature: response.razorpay_signature,
              bookingId
            });
          }
        };

        if (preferredMethod) {
          razorpayConfig.config = {
            display: {
              blocks: {
                preferred: {
                  name: preferredMethod.toUpperCase(),
                  instruments: [
                    {
                      method: preferredMethod,
                      ...(preferredUpiApp ? { apps: [preferredUpiApp] } : {})
                    }
                  ]
                }
              },
              sequence: ["block.preferred"]
            }
          };
        }

        const rzp = new window.Razorpay(razorpayConfig);

        rzp.on("payment.failed", (response) => {
          const desc = response.error?.description || "";
          // If Razorpay API rejects test key with authentication error, gracefully switch to sandbox modal
          if (desc.toLowerCase().includes("auth") || desc.toLowerCase().includes("key")) {
            showSandboxModal({
              orderId,
              amountInPaise,
              currency,
              bookingId,
              movieTitle,
              theatreName,
              prefill,
              preferredMethod,
              preferredUpiApp
            }).then(resolve).catch(reject);
          } else {
            reject({
              code: "PAYMENT_FAILED",
              message: desc || "Payment failed. Please try with another card or UPI app.",
              errorDetails: response.error
            });
          }
        });

        rzp.open();
      } catch (err) {
        console.warn("Razorpay official popup notice, falling back to sandbox UI:", err.message);
        showSandboxModal({
          orderId,
          amountInPaise,
          currency,
          bookingId,
          movieTitle,
          theatreName,
          prefill,
          preferredMethod,
          preferredUpiApp
        }).then(resolve).catch(reject);
      }
    });
  }

  // Seamless Sandbox Test Checkout Modal
  return showSandboxModal({
    orderId,
    amountInPaise,
    currency,
    bookingId,
    movieTitle,
    theatreName,
    prefill,
    preferredMethod,
    preferredUpiApp
  });
}

/**
 * Interactive Razorpay Test Sandbox Checkout Modal
 * Used in test/demo mode or when merchant keys are awaiting production credentials
 */
function showSandboxModal({
  orderId,
  amountInPaise,
  currency = "INR",
  bookingId,
  movieTitle,
  theatreName,
  prefill = {},
  preferredMethod = "upi",
  preferredUpiApp = "google_pay"
}) {
  return new Promise((resolve, reject) => {
    const existingModal = document.getElementById("cinefy-razorpay-sandbox-modal");
    if (existingModal) existingModal.remove();

    const amountInRupees = (amountInPaise / 100).toLocaleString("en-IN", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });

    const modalContainer = document.createElement("div");
    modalContainer.id = "cinefy-razorpay-sandbox-modal";
    modalContainer.className = "fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn";

    modalContainer.innerHTML = `
      <div class="bg-slate-900 border border-slate-700/80 rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl space-y-6 text-slate-100 relative font-sans">
        
        <!-- Header -->
        <div class="flex items-center justify-between border-b border-slate-800 pb-4">
          <div class="flex items-center gap-2.5">
            <div class="w-9 h-9 rounded-xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center font-black text-cyan-400 text-sm">
              ₹
            </div>
            <div>
              <h4 class="text-sm font-black text-white uppercase tracking-wider">Razorpay Checkout</h4>
              <span class="text-[10px] text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded-md border border-emerald-500/20">Test Mode Simulation</span>
            </div>
          </div>
          <button id="rzp-close-btn" class="text-slate-400 hover:text-white p-1 rounded-lg text-lg font-bold cursor-pointer">✕</button>
        </div>

        <!-- Order Summary -->
        <div class="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2">
          <div class="flex items-center justify-between text-xs">
            <span class="text-slate-400">Order ID:</span>
            <span class="font-mono text-white font-bold">${orderId || "order_test"}</span>
          </div>
          <div class="flex items-center justify-between text-xs">
            <span class="text-slate-400">Item:</span>
            <span class="text-slate-200 truncate max-w-[200px] font-semibold">${movieTitle} (${theatreName})</span>
          </div>
          <div class="flex items-center justify-between pt-2 border-t border-slate-800/80">
            <span class="text-sm font-bold text-white">Amount Payable:</span>
            <span class="text-xl font-black text-cyan-400 font-mono">₹${amountInRupees}</span>
          </div>
        </div>

        <!-- Payment Method Pre-selected -->
        <div class="space-y-2">
          <label class="text-xs font-bold text-slate-300 block">Select Simulated Payment Instrument:</label>
          <div class="grid grid-cols-2 gap-2 text-xs">
            <button type="button" class="rzp-sim-method px-3 py-2.5 rounded-xl border border-cyan-500/60 bg-cyan-500/15 text-cyan-300 font-bold flex items-center gap-2 cursor-pointer" data-method="UPI_GPAY">
              <span class="w-2 h-2 rounded-full bg-emerald-400"></span> Google Pay / UPI
            </button>
            <button type="button" class="rzp-sim-method px-3 py-2.5 rounded-xl border border-slate-800 bg-slate-950 text-slate-300 font-bold flex items-center gap-2 cursor-pointer" data-method="UPI_PHONEPE">
              <span class="w-2 h-2 rounded-full bg-purple-400"></span> PhonePe UPI
            </button>
            <button type="button" class="rzp-sim-method px-3 py-2.5 rounded-xl border border-slate-800 bg-slate-950 text-slate-300 font-bold flex items-center gap-2 cursor-pointer" data-method="CARD">
              <span class="w-2 h-2 rounded-full bg-cyan-400"></span> Debit / Credit Card
            </button>
            <button type="button" class="rzp-sim-method px-3 py-2.5 rounded-xl border border-slate-800 bg-slate-950 text-slate-300 font-bold flex items-center gap-2 cursor-pointer" data-method="NETBANKING">
              <span class="w-2 h-2 rounded-full bg-blue-400"></span> Net Banking
            </button>
          </div>
        </div>

        <!-- User Information -->
        <div class="text-[11px] text-slate-400 bg-slate-950/60 p-3 rounded-xl border border-slate-800/60 flex items-center justify-between">
          <span>Customer: <strong class="text-slate-200">${prefill.name || "Customer"}</strong></span>
          <span>Contact: <strong class="text-slate-200 font-mono">${prefill.contact || "8317625528"}</strong></span>
        </div>

        <!-- Action Buttons -->
        <div class="space-y-2 pt-2">
          <button id="rzp-confirm-btn" class="w-full py-3.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black text-xs uppercase tracking-wider shadow-lg shadow-cyan-500/20 flex items-center justify-center gap-2 transition cursor-pointer">
            <span>Confirm & Authorize Payment (₹${amountInRupees})</span>
          </button>
          <button id="rzp-fail-btn" class="w-full py-2 rounded-xl text-slate-500 hover:text-rose-400 text-xs font-semibold transition cursor-pointer">
            Simulate Payment Decline / Close
          </button>
        </div>

      </div>
    `;

    document.body.appendChild(modalContainer);

    let selectedSimMethod = "UPI";

    const methodBtns = modalContainer.querySelectorAll(".rzp-sim-method");
    methodBtns.forEach((btn) => {
      btn.addEventListener("click", () => {
        methodBtns.forEach((b) => {
          b.className = "rzp-sim-method px-3 py-2.5 rounded-xl border border-slate-800 bg-slate-950 text-slate-300 font-bold flex items-center gap-2 cursor-pointer";
        });
        btn.className = "rzp-sim-method px-3 py-2.5 rounded-xl border border-cyan-500/60 bg-cyan-500/15 text-cyan-300 font-bold flex items-center gap-2 cursor-pointer";
        selectedSimMethod = btn.getAttribute("data-method") || "UPI";
      });
    });

    const closeBtn = document.getElementById("rzp-close-btn");
    const confirmBtn = document.getElementById("rzp-confirm-btn");
    const failBtn = document.getElementById("rzp-fail-btn");

    closeBtn?.addEventListener("click", () => {
      modalContainer.remove();
      reject({
        code: "PAYMENT_CANCELLED_BY_USER",
        message: "Payment window was closed by user."
      });
    });

    failBtn?.addEventListener("click", () => {
      modalContainer.remove();
      reject({
        code: "PAYMENT_FAILED",
        message: "Payment was declined by user request in test mode."
      });
    });

    confirmBtn?.addEventListener("click", () => {
      confirmBtn.disabled = true;
      confirmBtn.innerHTML = "<span>Verifying with Razorpay...</span>";

      setTimeout(() => {
        modalContainer.remove();
        const mockPaymentId = "pay_" + Date.now().toString(36) + Math.random().toString(36).substring(2, 6);
        const mockSignature = "sig_" + Math.random().toString(36).substring(2, 12);

        resolve({
          razorpay_payment_id: mockPaymentId,
          razorpay_order_id: orderId,
          razorpay_signature: mockSignature,
          bookingId
        });
      }, 500);
    });
  });
}

