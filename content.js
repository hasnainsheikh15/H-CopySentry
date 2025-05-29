const maxLength = 10000;

let cryptoKey = null;

async function generateCryptoKey() {
  cryptoKey = await crypto.subtle.generateKey(
    {
      name: "AES-GCM", // name of the algorithm
      length: 256, // length of the key in the bits
    },
    true, // can this key be extracted from the CryptoKey object or not
    ["encrypt", "decrypt"] // for what this key can be used for
  );

  console.log("Crypto key generated");
}

async function encryptData(plaintext) {
  if (!cryptoKey) {
    throw new Error("Crypto key not generated");
  }

  const encoder = new TextEncoder(); // built in browser API to convert strings to Uint8Array which is array of bytes
  const data = encoder.encode(plaintext);

  const iv = crypto.getRandomValues(new Uint8Array(12));

  const encryptedText = await crypto.subtle.encrypt(
    {
      name: "AES-GCM",
      iv: iv, // initialization vector, should be random and unique for each encryption
    },
    cryptoKey, // the key to use for encryption
    data // the data to encrypt
  );

  const combinedArray = new Uint8Array(
    iv.byteLength + encryptedText.byteLength
  );
  combinedArray.set(iv, 0); // set the IV at the start of the array
  combinedArray.set(new Uint8Array(encryptedText), iv.byteLength); // set the encrypted data after the IV

  return btoa(String.fromCharCode(...combinedArray)); // expands the combined array into flat form like [1 2 3 ] to 1 2 3 // convert to base64 string for storage readable text
}

generateCryptoKey();

document.addEventListener("copy", async (e) => {
  const selectedText = window.getSelection().toString();

  if (!selectedText) return;

  if (!cryptoKey) return;

  if (selectedText.length > maxLength) {
    e.preventDefault();
    e.clipboardData.setData("text", "");
    console.warn("Copy blocked: selected text too large");
    return;
  }

  try {
    
    const encryptedText = await encryptData(selectedText);
    e.preventDefault();
    e.clipboardData.setData("text",encryptedText);
    console.log("Text copied to clipboard:", encryptedText);
  } catch (error) {
    console.error("Encryption failed :",error);
    
  }
});
