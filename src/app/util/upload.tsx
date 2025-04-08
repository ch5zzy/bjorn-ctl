"use server";

import { Config } from "../types/Config";

enum ImageHost {
    IMGBB = 'imgbb',
    FREEIMAGE = 'freeimage',
}

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
    const host = process.env.IMAGE_HOST as ImageHost;

    const uploadData = new FormData();
    const image = imgBase64.split(';base64,').pop() ?? "";

    let response;
    switch (host) {
        case ImageHost.IMGBB:
            uploadData.append("image", image);
            response = await fetch(`https://api.imgbb.com/1/upload?key=${process.env.IMGBB_API_KEY ?? ""}`, {
                method: "POST",
                body: uploadData
            });
            break;
        case ImageHost.FREEIMAGE:
            uploadData.append("source", image);
            response = await fetch(`https://freeimage.host/api/1/upload?key=${process.env.FREEIMAGE_API_KEY ?? ""}`, {
                method: "POST",
                body: uploadData
            });
            break;
    }


    if (!response.ok) {
        console.log(`Malformed response when uploading image:\nResponse: ${JSON.stringify(await response.json())}`);
        return null;
    }

    response = await response.json();
    switch (host) {
        case ImageHost.IMGBB:
            return response.data.url;
        case ImageHost.FREEIMAGE:
            return response.image.url;

    }
}