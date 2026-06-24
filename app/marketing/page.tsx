"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { 
  ArrowLeft, Megaphone, TrendingUp, Users, Star,
  Globe, ThumbsUp, MessageCircle, Share2,
  Award, Target, BarChart3, Calendar, Plus, Edit2, Trash2,
  Briefcase
} from "lucide-react";

interface LinkedInPost {
  id: string;
  content: string;
  date: string;
  likes: number;
  comments: number;
  shares: number;
}

interface GoogleReview {
  id: string;
  rating: number;
  comment: string;
  date: string;
  reviewer: string;
}

export default function MarketingCenterPage() {
  const router = useRouter();
  const [posts, setPosts] = useState<LinkedInPost[]>([]);
  const [reviews, setReviews] = useState<GoogleReview[]>([]);
  const [showPostModal, setShowPostModal] = useState(false);
  const [newPost, setNewPost] = useState({ content: "", likes: 0, comments: 0, shares: 0 });
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [newReview, setNewReview] = useState({ rating: 5, comment: "", reviewer: "" });

  useEffect(() => {
    const savedPosts = localStorage.getItem("tsfs_linkedin_posts");
    if (savedPosts) {
      setPosts(JSON.parse(savedPosts));
    } else {
      const samplePosts: LinkedInPost[] = [
        {
          id: "1",
          content: "Proud to announce our new security deployment at Apollo Hospitals Vizag. 24/7 safety for patients and staff!",
          date: new Date(Date.now() - 7 * 86400000).toISOString(),
          likes: 45,
          comments: 8,
          shares: 12
        },
        {
          id: "2",
          content: "TSFS completed 5000+ incident-free hours at Vizag SEZ. Excellence in security operations.",
          date: new Date(Date.now() - 14 * 86400000).toISOString(),
          likes: 32,
          comments: 5,
          shares: 7
        }
      ];
      setPosts(samplePosts);
      localStorage.setItem("tsfs_linkedin_posts", JSON.stringify(samplePosts));
    }

    const savedReviews = localStorage.getItem("tsfs_google_reviews");
    if (savedReviews) {
      setReviews(JSON.parse(savedReviews));
    } else {
      const sampleReviews: GoogleReview[] = [
        {
          id: "1",
          rating: 5,
          comment: "Professional security team, very responsive management.",
          date: new Date(Date.now() - 30 * 86400000).toISOString(),
          reviewer: "Rajesh Kumar"
        },
        {
          id: "2",
          rating: 4,
          comment: "Good service, on-time reporting.",
          date: new Date(Date.now() - 45 * 86400000).toISOString(),
          reviewer: "Priya Sharma"
        }
      ];
      setReviews(sampleReviews);
      localStorage.setItem("tsfs_google_reviews", JSON.stringify(sampleReviews));
    }
  }, []);

  const addPost = () => {
    if (!newPost.content) return;
    const post: LinkedInPost = {
      id: Date.now().toString(),
      ...newPost,
      date: new Date().toISOString()
    };
    const updated = [post, ...posts];
    setPosts(updated);
    localStorage.setItem("tsfs_linkedin_posts", JSON.stringify(updated));
    setShowPostModal(false);
    setNewPost({ content: "", likes: 0, comments: 0, shares: 0 });
  };

  const addReview = () => {
    if (!newReview.comment || !newReview.reviewer) return;
    const review: GoogleReview = {
      id: Date.now().toString(),
      ...newReview,
      date: new Date().toISOString()
    };
    const updated = [review, ...reviews];
    setReviews(updated);
    localStorage.setItem("tsfs_google_reviews", JSON.stringify(updated));
    setShowReviewModal(false);
    setNewReview({ rating: 5, comment: "", reviewer: "" });
  };

  const deletePost = (id: string) => {
    const updated = posts.filter(p => p.id !== id);
    setPosts(updated);
    localStorage.setItem("tsfs_linkedin_posts", JSON.stringify(updated));
  };

  const deleteReview = (id: string) => {
    const updated = reviews.filter(r => r.id !== id);
    setReviews(updated);
    localStorage.setItem("tsfs_google_reviews", JSON.stringify(updated));
  };

  const totalEngagement = posts.reduce((sum, p) => sum + p.likes + p.comments + p.shares, 0);
  const avgRating = reviews.length > 0 
    ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length 
    : 0;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <button onClick={() => router.push('/dashboard')} className="text-gray-600 hover:text-gray-900">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <Megaphone className="w-7 h-7 text-orange-600" />
              Marketing Center
            </h1>
            <p className="text-sm text-gray-500">Track brand metrics and engagement</p>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-xl p-4 shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">LinkedIn Engagement</p>
                <p className="text-2xl font-bold">{totalEngagement.toLocaleString()}</p>
              </div>
              <Briefcase className="w-8 h-8 text-blue-600" />
            </div>
          </div>
          
          <div className="bg-white rounded-xl p-4 shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Google Rating</p>
                <p className="text-2xl font-bold">{avgRating.toFixed(1)} ★</p>
              </div>
              <Star className="w-8 h-8 text-yellow-500" />
            </div>
          </div>
          
          <div className="bg-white rounded-xl p-4 shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Total Reviews</p>
                <p className="text-2xl font-bold">{reviews.length}</p>
              </div>
              <MessageCircle className="w-8 h-8 text-green-600" />
            </div>
          </div>
          
          <div className="bg-white rounded-xl p-4 shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">LinkedIn Posts</p>
                <p className="text-2xl font-bold">{posts.length}</p>
              </div>
              <Share2 className="w-8 h-8 text-purple-600" />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* LinkedIn Section */}
          <div className="bg-white rounded-xl shadow-sm border">
            <div className="p-4 border-b flex justify-between items-center">
              <h2 className="font-semibold flex items-center gap-2">
                <Briefcase className="w-5 h-5 text-blue-600" />
                LinkedIn Activity
              </h2>
              <button 
                onClick={() => setShowPostModal(true)}
                className="text-sm bg-blue-600 text-white px-3 py-1 rounded-lg hover:bg-blue-700 flex items-center gap-1"
              >
                <Plus className="w-3 h-3" /> Add Post
              </button>
            </div>
            <div className="divide-y max-h-[500px] overflow-auto">
              {posts.length === 0 ? (
                <div className="p-8 text-center text-gray-500">
                  No LinkedIn posts yet. Click "Add Post" to get started.
                </div>
              ) : (
                posts.map(post => (
                  <div key={post.id} className="p-4">
                    <p className="text-sm mb-2">{post.content}</p>
                    <div className="flex justify-between items-center text-xs text-gray-500">
                      <div className="flex gap-3">
                        <span>❤️ {post.likes}</span>
                        <span>💬 {post.comments}</span>
                        <span>🔄 {post.shares}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span>{new Date(post.date).toLocaleDateString()}</span>
                        <button onClick={() => deletePost(post.id)} className="text-red-500 hover:text-red-700">
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Google Reviews Section */}
          <div className="bg-white rounded-xl shadow-sm border">
            <div className="p-4 border-b flex justify-between items-center">
              <h2 className="font-semibold flex items-center gap-2">
                <Star className="w-5 h-5 text-yellow-500" />
                Google Reviews
              </h2>
              <button 
                onClick={() => setShowReviewModal(true)}
                className="text-sm bg-green-600 text-white px-3 py-1 rounded-lg hover:bg-green-700 flex items-center gap-1"
              >
                <Plus className="w-3 h-3" /> Add Review
              </button>
            </div>
            <div className="divide-y max-h-[500px] overflow-auto">
              {reviews.length === 0 ? (
                <div className="p-8 text-center text-gray-500">
                  No Google reviews yet. Click "Add Review" to get started.
                </div>
              ) : (
                reviews.map(review => (
                  <div key={review.id} className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <p className="font-medium">{review.reviewer}</p>
                        <div className="flex text-yellow-500 text-sm">
                          {"★".repeat(review.rating)}{"☆".repeat(5 - review.rating)}
                        </div>
                      </div>
                      <button onClick={() => deleteReview(review.id)} className="text-red-500 hover:text-red-700">
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                    <p className="text-sm text-gray-600">{review.comment}</p>
                    <p className="text-xs text-gray-400 mt-2">{new Date(review.date).toLocaleDateString()}</p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Modals */}
        {showPostModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl max-w-md w-full p-6">
              <h2 className="text-xl font-bold mb-4">Add LinkedIn Post</h2>
              <textarea 
                placeholder="Post content..."
                value={newPost.content}
                onChange={(e) => setNewPost({...newPost, content: e.target.value})}
                className="w-full p-2 border rounded-lg mb-3 h-32"
              />
              <div className="grid grid-cols-3 gap-2 mb-4">
                <input type="number" placeholder="Likes" value={newPost.likes} onChange={e => setNewPost({...newPost, likes: Number(e.target.value)})} className="p-2 border rounded-lg" />
                <input type="number" placeholder="Comments" value={newPost.comments} onChange={e => setNewPost({...newPost, comments: Number(e.target.value)})} className="p-2 border rounded-lg" />
                <input type="number" placeholder="Shares" value={newPost.shares} onChange={e => setNewPost({...newPost, shares: Number(e.target.value)})} className="p-2 border rounded-lg" />
              </div>
              <div className="flex gap-3">
                <button onClick={addPost} className="flex-1 bg-blue-600 text-white py-2 rounded-lg">Add</button>
                <button onClick={() => setShowPostModal(false)} className="flex-1 border py-2 rounded-lg">Cancel</button>
              </div>
            </div>
          </div>
        )}

        {showReviewModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl max-w-md w-full p-6">
              <h2 className="text-xl font-bold mb-4">Add Google Review</h2>
              <input type="text" placeholder="Reviewer Name" value={newReview.reviewer} onChange={e => setNewReview({...newReview, reviewer: e.target.value})} className="w-full p-2 border rounded-lg mb-3" />
              <select value={newReview.rating} onChange={e => setNewReview({...newReview, rating: Number(e.target.value)})} className="w-full p-2 border rounded-lg mb-3">
                <option value={5}>★★★★★ (5)</option>
                <option value={4}>★★★★☆ (4)</option>
                <option value={3}>★★★☆☆ (3)</option>
                <option value={2}>★★☆☆☆ (2)</option>
                <option value={1}>★☆☆☆☆ (1)</option>
              </select>
              <textarea placeholder="Review comment..." value={newReview.comment} onChange={e => setNewReview({...newReview, comment: e.target.value})} className="w-full p-2 border rounded-lg mb-4 h-24" />
              <div className="flex gap-3">
                <button onClick={addReview} className="flex-1 bg-green-600 text-white py-2 rounded-lg">Add</button>
                <button onClick={() => setShowReviewModal(false)} className="flex-1 border py-2 rounded-lg">Cancel</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}