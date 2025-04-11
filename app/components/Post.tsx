import { TimelinePost } from '../types/timeline';
import { formatDistanceToNow } from 'date-fns';

interface PostProps {
    post: TimelinePost;
}

export function Post({ post }: PostProps) {
    return (
        <div className="bg-white rounded-lg shadow p-4">
            <div className="flex items-start space-x-3">
                <img
                    src={post.author.profile_image_url}
                    alt={post.author.name}
                    className="w-10 h-10 rounded-full"
                />
                <div className="flex-1">
                    <div className="flex items-center space-x-2">
                        <span className="font-semibold">{post.author.name}</span>
                        <span className="text-gray-500">@{post.author.username}</span>
                        <span className="text-gray-500">·</span>
                        <span className="text-gray-500">
                            {formatDistanceToNow(new Date(post.created_at), { addSuffix: true })}
                        </span>
                    </div>
                    <p className="mt-2 text-gray-800">{post.text}</p>
                    <div className="mt-3 flex items-center space-x-4 text-gray-500">
                        <div className="flex items-center space-x-1">
                            <span>{post.metrics.likes}</span>
                            <span>Likes</span>
                        </div>
                        <div className="flex items-center space-x-1">
                            <span>{post.metrics.retweets}</span>
                            <span>Retweets</span>
                        </div>
                        <div className="flex items-center space-x-1">
                            <span>{post.metrics.replies}</span>
                            <span>Replies</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
} 