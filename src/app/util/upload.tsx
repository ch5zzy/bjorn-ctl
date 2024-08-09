"use server";

import { Config } from "../types/Config";

export async function fetchConfig(): Promise<Config> {
    const response = await fetch(`https://jsonblob.com/api/jsonBlob/${process.env.JSONBLOB_ID}`);
    return await response.json();
}

export async function uploadConfig(stringifiedConfig: string) {
    const response = await fetch(`https://jsonblob.com/api/jsonBlob/${process.env.JSONBLOB_ID}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: stringifiedConfig
    });

    return response.ok;
}

export async function uploadImage(imgBase64: string): Promise<string> {
    const uploadData = new FormData();
    uploadData.append("key", process.env.IMGBB_API_KEY ?? "");
    uploadData.append("image", imgBase64.split(';base64,').pop() ?? "");

    const response = await (await fetch("https://api.imgbb.com/1/upload", {
        method: "POST",
        body: uploadData
    })).json();

    return response.data.url;
}