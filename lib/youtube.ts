import { describe } from "node:test";

export type YouTubeVideo = {
    videoId: string;
    title: string;
    description: string;
    publishedAt: string;
    thumbnailUrl: string;
};

export async function getRecentVideosForChannel (
    channelId: string,
    maxResults: number = 6
): Promise<YouTubeVideo[]> {
    const apiKey = process.env.YOUTUBE_API_KEY;
    if(!apiKey){
        throw new Error("YOUTUBE_API_KEY is not set in enviroment");
    }

    const url = new URL("https://www.googleapis.com/youtube/v3/search");
    url.searchParams.set("key", apiKey);
    url.searchParams.set("channelId", channelId);
    url.searchParams.set("part", "snippet");
    url.searchParams.set("order", "date");
    url.searchParams.set("type", "video");
    url.searchParams.set("maxResults", String(maxResults));

    const response = await fetch(url.toString(), {
        next : { revalidate: 600 },
    });

    if(!response.ok){
        throw new Error (
            'YouTube API error: ${response.status} ${response.statusText}'
        );
    }

    const data = await response.json();

    return (data.items ?? []).map((item: any) => ({
        videoId: item.id.videoId,
        title: item.snippet.title,
        description: item.snippet.description,
        publishedAt: item.snippet.publishedAt,
        thumbnailUrl: item.snippet.thumbnails.medium.url,
    }));

}