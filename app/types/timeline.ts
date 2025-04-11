export interface TimelinePost {
    id: string;
    text: string;
    created_at: string;
    author_id: string;
    username?: string;
    media?: {
        type: string;
        url: string;
        width: number;
        height: number;
    }[];
}

export interface TimelineResponse {
    data: TimelinePost[];
    meta?: {
        next_token?: string;
        result_count: number;
    };
    includes?: {
        users?: {
            id: string;
            name: string;
            username: string;
            profile_image_url?: string;
        }[];
    };
} 