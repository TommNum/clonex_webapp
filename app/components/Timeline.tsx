import { useTimeline } from '../hooks/useTimeline';
import { TimelinePost } from '../types/timeline';
import { format } from 'date-fns';

function TimelinePostCard({ post }: { post: TimelinePost }) {
    return (
        <div className="bg-white/10 p-6 rounded-lg backdrop-blur-sm mb-4">
            <div className="flex items-center justify-between mb-4">
                <span className="font-medium text-white font-cormorant">@{post.username}</span>
                <span className="text-sm text-white/70 font-cormorant">
                    {format(new Date(post.created_at), 'MMM d, yyyy')}
                </span>
            </div>
            <p className="text-white mb-4 font-cormorant">{post.text}</p>
            {post.media && post.media.length > 0 && (
                <div className="grid gap-4 grid-cols-1">
                    {post.media.map((m, i) => (
                        <img
                            key={i}
                            src={m.url}
                            alt="Tweet media"
                            className="rounded-lg w-full"
                            style={{
                                aspectRatio: `${m.width}/${m.height}`,
                                objectFit: 'cover'
                            }}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}

export function Timeline() {
    const { posts, loading, error, hasMore, refresh, loadMore } = useTimeline();

    if (error) {
        return (
            <div className="text-red-500 text-center p-4 font-cormorant">
                Error loading timeline. Please try again.
            </div>
        );
    }

    return (
        <div className="w-full">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-semibold font-cormorant text-white">Your Timeline</h2>
                <button
                    onClick={refresh}
                    className="bg-white/10 text-white px-4 py-2 rounded-lg hover:bg-white/20 backdrop-blur-sm font-cormorant"
                    disabled={loading}
                >
                    {loading ? 'Refreshing...' : 'Refresh'}
                </button>
            </div>

            <div className="space-y-4">
                {posts.map(post => (
                    <TimelinePostCard key={post.id} post={post} />
                ))}
            </div>

            {loading && (
                <div className="flex justify-center p-4">
                    <div className="animate-spin h-8 w-8 border-4 border-white/30 rounded-full border-t-white"></div>
                </div>
            )}

            {hasMore && !loading && (
                <button
                    onClick={loadMore}
                    className="w-full mt-4 p-2 text-white hover:bg-white/10 rounded-lg backdrop-blur-sm font-cormorant"
                >
                    Load More
                </button>
            )}
        </div>
    );
} 