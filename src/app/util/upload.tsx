"use server";

export default async function uploadImage(imgBase64: string): Promise<string> {
    const uploadData = new FormData();
    uploadData.append("key", process.env.IMGBB_API_KEY ?? "");
    uploadData.append("image", imgBase64.split(';base64,').pop() ?? "");

    const response = await (await fetch("https://api.imgbb.com/1/upload", {
        method: "POST",
        body: uploadData
    })).json();

    return response.data.url;
}