import { GiphyFetch } from "@giphy/js-fetch-api";

const gf = new GiphyFetch(process.env.NEXT_PUBLIC_GIPHY_API_KEY ?? "");

export default function searchGifs(term: string) {
    return gf.search(term, {
        sort: "relevant",
        limit: 100,
        type: "gifs",
        rating: "pg-13"
    });
}