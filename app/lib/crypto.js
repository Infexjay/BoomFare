export async function generateKey() {
  return await crypto.subtle.generateKey(
    {
      name: "AES-GCM",
      length: 256,
    },
    true,
    ["encrypt", "decrypt"]
  );
}

export async function encryptFile(file, key) {
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const fileBuffer = await file.arrayBuffer();
  const encryptedFile = await crypto.subtle.encrypt(
    {
      name: "AES-GCM",
      iv: iv,
    },
    key,
    fileBuffer
  );

  return {
    encryptedFile: new Blob([iv, new Uint8Array(encryptedFile)]),
    iv: iv,
  };
}

export async function decryptFile(encryptedFile, key, iv) {
  const decryptedFile = await crypto.subtle.decrypt(
    {
      name: "AES-GCM",
      iv: iv,
    },
    key,
    encryptedFile
  );

  return new Blob([decryptedFile]);
}
