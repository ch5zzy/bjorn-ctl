"use server";

import { Config } from "../types/Config";

export async function fetchConfig(): Promise<Config> {
    const response = await fetch(`https://jsonblob.com/api/jsonBlob/${process.env.JSONBLOB_ID}`);
    return response.json();
}

export async function uploadConfig(stringifiedConfig: string) {
    const response = await fetch(`https://jsonblob.com/api/jsonBlob/${process.env.JSONBLOB_ID}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: stringifiedConfig
    });

    return response.ok;
}

export async function uploadImage(imgBase64: string): Promise<string | null> {
    const uploadData = new FormData();
    uploadData.append("image", imgBase64.split(';base64,').pop() ?? "");

    const response = await fetch(`https://api.imgbb.com/1/upload?key=${process.env.IMGBB_API_KEY ?? ""}`, {
        method: "POST",
        body: uploadData
    });

    if (!response.ok) {
        console.log(`Malformed response when uploading image:\nStatus: ${response.status}\nText: ${response.statusText}`);
        return null;
    }

    return (await response.json()).data.url;
}