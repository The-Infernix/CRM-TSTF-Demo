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
    <div className="soc-wrap">
        {/* Header */}
        <div className="soc-page-header">
          <div className="flex items-center gap-4 min-w-0">
          <button onClick={() => router.push('/dashboard')} className="soc-btn soc-btn-ghost px-3 shrink-0">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="soc-page-title">
            <div className="soc-kicker">// MODULE — Marketing Center</div>
            <h1 className="soc-h1 flex items-center gap-2">
              <Megaphone className="w-5 h-5 text-cyan-400" />
              Marketing Center
            </h1>
            <p className="soc-sub">Track brand metrics and engagement</p>
          </div>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="soc-kpis mb-6">
          <div className="soc-kpi">
            <div className="flex justify-between items-start gap-2">
              <span className="soc-kpi-label">LinkedIn Engagement</span>
              <div className="soc-kpi-icon bg-cyan-400/15 text-cyan-400">
                <Briefcase className="w-5 h-5" />
              </div>
            </div>
            <div className="soc-kpi-value">{totalEngagement.toLocaleString()}</div>
          </div>
          
          <div className="soc-kpi">
            <div className="flex justify-between items-start gap-2">
              <span className="soc-kpi-label">Google Rating</span>
              <div className="soc-kpi-icon bg-yellow-400/15 text-yellow-400">
                <Star className="w-5 h-5" />
              </div>
            </div>
            <div className="soc-kpi-value">{avgRating.toFixed(1)} ★</div>
          </div>
          
          <div className="soc-kpi">
            <div className="flex justify-between items-start gap-2">
              <span className="soc-kpi-label">Total Reviews</span>
              <div className="soc-kpi-icon bg-lime-400/15 text-lime-400">
                <MessageCircle className="w-5 h-5" />
              </div>
            </div>
            <div className="soc-kpi-value">{reviews.length}</div>
          </div>
          
          <div className="soc-kpi">
            <div className="flex justify-between items-start gap-2">
              <span className="soc-kpi-label">LinkedIn Posts</span>
              <div className="soc-kpi-icon bg-purple-400/15 text-purple-400">
                <Share2 className="w-5 h-5" />
              </div>
            </div>
            <div className="soc-kpi-value">{posts.length}</div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {/* LinkedIn Section */}
          <div className="soc-panel p-0">
            <div className="p-4 border-b border-ink-700/60 flex flex-wrap justify-between items-center gap-2">
              <h2 className="soc-card-title flex items-center gap-2">
                <Briefcase className="w-5 h-5 text-cyan-400" />
                LinkedIn Activity
              </h2>
              <button 
                onClick={() => setShowPostModal(true)}
                className="soc-btn soc-btn-primary px-3 py-1.5 text-xs"
              >
                <Plus className="w-3 h-3" /> Add Post
              </button>
            </div>
            <div className="divide-y divide-ink-700/60 max-h-[500px] overflow-auto pr-1">
              {posts.length === 0 ? (
                <div className="soc-empty">
                  No LinkedIn posts yet. Click "Add Post" to get started.
                </div>
              ) : (
                posts.map(post => (
                  <div key={post.id} className="px-4 py-4 flex flex-col gap-2 min-w-0">
                    <p className="text-sm">{post.content}</p>
                    <div className="flex flex-wrap justify-between items-center gap-2 text-xs text-slate-500">
                      <div className="flex flex-wrap gap-3">
                        <span>❤️ {post.likes}</span>
                        <span>💬 {post.comments}</span>
                        <span>🔄 {post.shares}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span>{new Date(post.date).toLocaleDateString()}</span>
                        <button onClick={() => deletePost(post.id)} className="text-red-400 hover:text-red-300">
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
          <div className="soc-panel p-0">
            <div className="p-4 border-b border-ink-700/60 flex flex-wrap justify-between items-center gap-2">
              <h2 className="soc-card-title flex items-center gap-2">
                <Star className="w-5 h-5 text-yellow-400" />
                Google Reviews
              </h2>
              <button 
                onClick={() => setShowReviewModal(true)}
                className="soc-btn soc-btn-lime px-3 py-1.5 text-xs"
              >
                <Plus className="w-3 h-3" /> Add Review
              </button>
            </div>
            <div className="divide-y divide-ink-700/60 max-h-[500px] overflow-auto pr-1">
              {reviews.length === 0 ? (
                <div className="soc-empty">
                  No Google reviews yet. Click "Add Review" to get started.
                </div>
              ) : (
                reviews.map(review => (
                  <div key={review.id} className="px-4 py-4 min-w-0">
                    <div className="flex justify-between items-start gap-3 mb-2">
                      <div className="min-w-0">
                        <p className="font-medium">{review.reviewer}</p>
                        <div className="flex text-yellow-400 text-sm">
                          {"★".repeat(review.rating)}{"☆".repeat(5 - review.rating)}
                        </div>
                      </div>
                      <button onClick={() => deleteReview(review.id)} className="text-red-400 hover:text-red-300 shrink-0">
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                    <p className="text-sm text-slate-400">{review.comment}</p>
                    <p className="text-xs text-slate-500 mt-2">{new Date(review.date).toLocaleDateString()}</p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Modals */}
        {showPostModal && (
          <div className="soc-modal-bg">
            <div className="soc-modal max-w-2xl max-h-[92vh] overflow-auto">
              <h2 className="text-xl font-bold mb-4">Add LinkedIn Post</h2>
              <textarea 
                placeholder="Post content..."
                value={newPost.content}
                onChange={(e) => setNewPost({...newPost, content: e.target.value})}
                className="soc-input mb-3 h-32"
              />
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mb-4">
                <input type="number" placeholder="Likes" value={newPost.likes} onChange={e => setNewPost({...newPost, likes: Number(e.target.value)})} className="soc-input" />
                <input type="number" placeholder="Comments" value={newPost.comments} onChange={e => setNewPost({...newPost, comments: Number(e.target.value)})} className="soc-input" />
                <input type="number" placeholder="Shares" value={newPost.shares} onChange={e => setNewPost({...newPost, shares: Number(e.target.value)})} className="soc-input" />
              </div>
              <div className="flex gap-3">
                <button onClick={addPost} className="soc-btn soc-btn-primary flex-1">Add</button>
                <button onClick={() => setShowPostModal(false)} className="soc-btn soc-btn-ghost flex-1">Cancel</button>
              </div>
            </div>
          </div>
        )}

        {showReviewModal && (
          <div className="soc-modal-bg">
            <div className="soc-modal max-w-2xl max-h-[92vh] overflow-auto">
              <h2 className="text-xl font-bold mb-4">Add Google Review</h2>
              <input type="text" placeholder="Reviewer Name" value={newReview.reviewer} onChange={e => setNewReview({...newReview, reviewer: e.target.value})} className="soc-input mb-3" />
              <select value={newReview.rating} onChange={e => setNewReview({...newReview, rating: Number(e.target.value)})} className="soc-select mb-3">
                <option value={5}>★★★★★ (5)</option>
                <option value={4}>★★★★☆ (4)</option>
                <option value={3}>★★★☆☆ (3)</option>
                <option value={2}>★★☆☆☆ (2)</option>
                <option value={1}>★☆☆☆☆ (1)</option>
              </select>
              <textarea placeholder="Review comment..." value={newReview.comment} onChange={e => setNewReview({...newReview, comment: e.target.value})} className="soc-input mb-4 h-24" />
              <div className="flex gap-3">
                <button onClick={addReview} className="soc-btn soc-btn-lime flex-1">Add</button>
                <button onClick={() => setShowReviewModal(false)} className="soc-btn soc-btn-ghost flex-1">Cancel</button>
              </div>
            </div>
          </div>
        )}
      </div>
  );
}