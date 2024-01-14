
export async function decode(pass, salt, data)
{
    const key = await pbkdf2Key(pass, salt);

    const iv = data.slice(0, 16);

    const plaintext = await crypto.subtle.decrypt({
        name: 'AES-CBC',
        iv,
    }, key, data.slice(16));

    return plaintext;
}

export async function encode(pass, salt, data)
{
    const key = await pbkdf2Key(pass, salt);
    const iv = crypto.getRandomValues(new Uint8Array(16));

    const ciphertext = await crypto.subtle.encrypt({
        name: 'AES-CBC',
        iv,
    }, key, data);

    return Buffer.concat([iv, new Uint8Array(ciphertext)]);
}

async function pbkdf2Key(pass, salt, iterations = 1000, length = 256)
{
    const ec = new TextEncoder();
    const keyMaterial = await crypto.subtle.importKey(
        'raw',
        ec.encode(pass),
        'PBKDF2',
        false,
        ['deriveKey']);
    const key = await crypto.subtle.deriveKey({
        name: 'PBKDF2',
        hash: 'SHA-512',
        salt: ec.encode(salt),
        iterations,
    }, keyMaterial, {
        name: 'AES-CBC',
        length,
    }, true, ['encrypt', 'decrypt']);
    return key;
}
