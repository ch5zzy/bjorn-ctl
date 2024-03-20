"use server";

import sharp, { KernelEnum } from "sharp";

export default async function minify(imgBase64: string, kernel: keyof KernelEnum) {
    const imgSharp = sharp(Buffer.from(imgBase64.split(';base64,').pop() ?? "", "base64"), { animated: true });
    return "data:image/webp;base64," + (await imgSharp.resize(16, 16, { kernel }).webp({ quality: 100, lossless: true }).toBuffer()).toString("base64");
}