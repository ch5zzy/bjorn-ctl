"use server";

import sharp, { KernelEnum } from "sharp";

export default async function minify(imgBase64: string, kernel: keyof KernelEnum, backgroundColor?: string) {
    const imgSharp = sharp(Buffer.from(imgBase64.split(';base64,').pop() ?? "", "base64"), { animated: true });
    const background = backgroundColor ? JSON.parse(backgroundColor) : { r: 0, g: 0, b: 0 };
    delete background.a;
    return "data:image/webp;base64," + (await imgSharp.flatten({ background }).resize(16, 16, { kernel }).webp({ quality: 100, lossless: true }).toBuffer()).toString("base64");
}