"use server";

import { GiphyFetch } from "@giphy/js-fetch-api";
import GIFThumbnail from "../types/GIFThumbnail";
import TenorResult from "../types/TenorResult";

const gf = new GiphyFetch(process.env.GIPHY_API_KEY ?? "");
const TENOR_ENDPOINT = `https://tenor.googleapis.com/v2/search?key=${process.env.TENOR_API_KEY}&media_filter=tinygif&limit=50&contentfilter=low&q=`;

export async function searchGiphyGifs(term: string): Promise<GIFThumbnail[]> {
    const results = await gf.search(term, {
        sort: "relevant",
        limit: 100,
        type: "gifs",
        rating: "pg-13"
    });

    const thumbnails = results.data.map((gif) => {
        const gifImage = gif.images.downsized;
        const thumbnailImage: GIFThumbnail = {
            url: gifImage.url,
            caption: gif.title,
            width: gifImage.width,
            height: gifImage.height
        };

        return thumbnailImage;
    })

    return thumbnails;
}

export async function searchTenorGifs(term: string): Promise<GIFThumbnail[]> {
    const result: TenorResult = await (await fetch(`${TENOR_ENDPOINT}${term}`)).json();

    const thumbnails = result.results.map((gif) => {
        const gifImage = gif.media_formats.tinygif;
        const thumbnailImage: GIFThumbnail = {
            url: gifImage.url,
            caption: gif.content_description,
            width: gifImage.dims[0],
            height: gifImage.dims[1]
        };

        return thumbnailImage;
    })

    return thumbnails;
}