console.log("Content script loaded");

const maxLength = 1000;

let cryptoKey = null;
let protectionEnabled = true;

async function generateCryptoKey() {
  cryptoKey = await crypto.subtle.generateKey(
    {
      name: "AES-GCM",
      length: 256,
    },
    true,
    ["encrypt", "decrypt"]
  );

  console.log("Crypto key generated");
}

const cryptoPromise = generateCryptoKey();

async function encryptData(plaintext) {
  await cryptoPromise;
  if (!cryptoKey) {
    throw new Error("Crypto key not generated");
  }

  const encoder = new TextEncoder();
  const data = encoder.encode(plaintext);

  const iv = crypto.getRandomValues(new Uint8Array(12));

  const encryptedText = await crypto.subtle.encrypt(
    {
      name: "AES-GCM",
      iv: iv,
    },
    cryptoKey,
    data
  );

  const combinedArray = new Uint8Array(
    iv.byteLength + encryptedText.byteLength
  );
  combinedArray.set(iv, 0);
  combinedArray.set(new Uint8Array(encryptedText), iv.byteLength);

  return btoa(String.fromCharCode(...combinedArray));
}

chrome.storage.onChanged.addListener((changes, area) => {
  if (area === "local" && changes.protectionEnabled) {
    protectionEnabled = changes.protectionEnabled.newValue;
  }
});

chrome.storage.local.get("protectionEnabled", (data) => {
  protectionEnabled = data.protectionEnabled !== false; // default true
});

document.addEventListener("copy", async (e) => {
  const selectedText = window.getSelection().toString();

  if (!protectionEnabled || !selectedText || !cryptoKey) {
    // Allow normal copy if protection disabled or no selection or no key
    return;
  }

  if (selectedText.length > maxLength) {
    e.preventDefault();
    e.clipboardData.setData("text/plain", "");
    console.warn("Copy blocked: selected text too large");
    return;
  }

  try {
    const encryptedText = await encryptData(selectedText);

    e.preventDefault(); // Prevent default copy behavior

    // Use Clipboard API to write encrypted text to system clipboard
    await navigator.clipboard.writeText(encryptedText);

    console.log(
      "Encrypted text set in clipboard via Clipboard API:",
      encryptedText
    );
  } catch (error) {
    console.error("Encryption or clipboard write failed:", error);
  }
});
