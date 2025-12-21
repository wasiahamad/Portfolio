import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Heart, MessageCircle, Share2 } from "lucide-react"

interface Post {
  id: string
  author: string
  avatar: string
  content: string
  timestamp: string
  likes: number
  liked: boolean
  comments: number
}

const DEMO_POSTS: Post[] = [
  {
    id: "1",
    author: "Sarah Chen",
    avatar: "👩",
    content: "Just launched my new MERN stack project! Feeling excited about building modern web apps.",
    timestamp: "2 hours ago",
    likes: 234,
    liked: false,
    comments: 12,
  },
  {
    id: "2",
    author: "Alex Developer",
    avatar: "👨",
    content: "Mastered React Hooks today! #ReactJS #WebDevelopment 🚀",
    timestamp: "5 hours ago",
    likes: 156,
    liked: false,
    comments: 8,
  },
  {
    id: "3",
    author: "Emma Design",
    avatar: "👱",
    content: "New portfolio website is live! Check out the interactive demos and case studies.",
    timestamp: "1 day ago",
    likes: 342,
    liked: true,
    comments: 24,
  },
  {
    id: "4",
    author: "Mike Tech",
    avatar: "👨",
    content: "MongoDB best practices: Always index your queries for optimal performance!",
    timestamp: "2 days ago",
    likes: 421,
    liked: false,
    comments: 31,
  },
]

export default function SocialMediaDemo() {
  const [posts, setPosts] = useState<Post[]>(DEMO_POSTS)
  const [newPost, setNewPost] = useState("")

  const handleLike = (id: string) => {
    setPosts(posts.map(p =>
      p.id === id
        ? { ...p, liked: !p.liked, likes: p.liked ? p.likes - 1 : p.likes + 1 }
        : p
    ))
  }

  const handlePost = () => {
    if (!newPost.trim()) return
    const post: Post = {
      id: String(Date.now()),
      author: "You",
      avatar: "🧑",
      content: newPost,
      timestamp: "now",
      likes: 0,
      liked: false,
      comments: 0,
    }
    setPosts([post, ...posts])
    setNewPost("")
  }

  return (
    <div className="space-y-6 max-w-2xl">
      {/* Post Composer */}
      <div className="bg-card border border-border rounded-lg p-6">
        <div className="flex gap-4">
          <div className="text-4xl">🧑</div>
          <div className="flex-1">
            <textarea
              placeholder="What's on your mind?"
              value={newPost}
              onChange={(e) => setNewPost(e.target.value)}
              className="w-full bg-secondary/50 border border-border rounded-lg p-3 text-sm resize-none focus:outline-none focus:border-primary"
              rows={3}
              data-testid="textarea-new-post"
            />
            <div className="flex justify-end mt-3">
              <Button
                onClick={handlePost}
                disabled={!newPost.trim()}
                data-testid="button-post"
              >
                Post
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Feed */}
      <div className="space-y-4">
        {posts.map((post) => (
          <div
            key={post.id}
            className="bg-card border border-border rounded-lg p-6"
            data-testid={`post-${post.id}`}
          >
            {/* Header */}
            <div className="flex items-center gap-3 mb-4">
              <div className="text-3xl">{post.avatar}</div>
              <div className="flex-1">
                <h4 className="font-bold">{post.author}</h4>
                <p className="text-xs text-muted-foreground">{post.timestamp}</p>
              </div>
            </div>

            {/* Content */}
            <p className="text-foreground mb-4">{post.content}</p>

            {/* Stats */}
            <div className="flex gap-4 text-xs text-muted-foreground border-t border-border pt-4 mb-4">
              <span data-testid={`likes-${post.id}`}>{post.likes} Likes</span>
              <span>{post.comments} Comments</span>
            </div>

            {/* Actions */}
            <div className="flex gap-2">
              <Button
                variant="ghost"
                size="sm"
                className="flex-1 gap-2"
                onClick={() => handleLike(post.id)}
                data-testid={`button-like-${post.id}`}
              >
                <Heart
                  className={`w-4 h-4 ${
                    post.liked ? "fill-red-500 text-red-500" : ""
                  }`}
                />
                Like
              </Button>
              <Button variant="ghost" size="sm" className="flex-1 gap-2" data-testid={`button-comment-${post.id}`}>
                <MessageCircle className="w-4 h-4" /> Comment
              </Button>
              <Button variant="ghost" size="sm" className="flex-1 gap-2" data-testid={`button-share-${post.id}`}>
                <Share2 className="w-4 h-4" /> Share
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
