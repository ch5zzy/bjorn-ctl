export default interface TenorResult {
    results: {
        id: string,
        content_description: string,
        media_formats: {
            tinygif: {
                url: string,
                dims: number[]
            }
        }
    }[]
};