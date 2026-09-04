let magicScriptPromise = null;

export function loadRazorpayMagicScript() {
  if (typeof window === "undefined") {
    return Promise.resolve(false);
  }

  if (magicScriptPromise) {
    return magicScriptPromise;
  }

  magicScriptPromise = new Promise((resolve) => {
    const existing = document.querySelector(
      'script[src="https://checkout.razorpay.com/v1/magic-checkout.js"]',
    );

    if (existing) {
      existing.addEventListener("load", () => resolve(true), { once: true });
      existing.addEventListener("error", () => resolve(false), { once: true });
      return;
    }

    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/magic-checkout.js";
    script.async = true;
    script.onload = () => resolve(true);
    script.onerror = () => {
      magicScriptPromise = null;
      resolve(false);
    };

    document.body.appendChild(script);
  });

  return magicScriptPromise;
}
