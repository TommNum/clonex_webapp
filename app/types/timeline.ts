export interface TimelinePost {
    id: string;
    text: string;
    created_at: string;
    author: {
        id: string;
        name: string;
        username: string;
        profile_image_url: string;
    };
    metrics: {
        likes: number;
        retweets: number;
        replies: number;
    };
}

export interface TimelineResponse {
    posts: TimelinePost[];
    nextToken?: string;
} 