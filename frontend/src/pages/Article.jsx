import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import axios from 'axios'
import { useAuthStore } from '../store/authStore'

function Article() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user, token } = useAuthStore()
  const [article, setArticle] = useState(null)
  const [comments, setComments] = useState([])
  const [newComment, setNewComment] = useState('')
  const [loading, setLoading] = useState(true)
  const [liked, setLiked] = useState(false)

  useEffect(() => {
    fetchArticle()
    fetchComments()
  }, [id])

  const fetchArticle = async () => {
    try {
      const response = await axios.get(`/api/articles/${id}`)
      setArticle(response.data)
      setLiked(response.data.likes.includes(user?.id))
    } catch (error) {
      console.error('Failed to fetch article:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchComments = async () => {
    try {
      const response = await axios.get(`/api/comments/article/${id}`)
      setComments(response.data.comments)
    } catch (error) {
      console.error('Failed to fetch comments:', error)
    }
  }

  const handleLike = async () => {
    if (!token) {
      navigate('/login')
      return
    }
    try {
      const response = await axios.post(
        `/api/likes/article/${id}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      )
      setLiked(response.data.liked)
      setArticle(prev => ({ ...prev, likesCount: response.data.likesCount }))
    } catch (error) {
      console.error('Failed to like article:', error)
    }
  }

  const handleAddComment = async (e) => {
    e.preventDefault()
    if (!token) {
      navigate('/login')
      return
    }
    try {
      const response = await axios.post(
        '/api/comments',
        { content: newComment, articleId: id },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      setComments(prev => [response.data, ...prev])
      setNewComment('')
      setArticle(prev => ({ ...prev, commentsCount: prev.commentsCount + 1 }))
    } catch (error) {
      console.error('Failed to add comment:', error)
    }
  }

  if (loading) return <div className="text-center py-12">Loading...</div>
  if (!article) return <div className="text-center py-12">Article not found</div>

  return (
    <div className="max-w-3xl mx-auto">
      <button onClick={() => navigate('/')} className="text-blue-600 hover:underline mb-4">← Back to Home</button>
      <article className="bg-white p-8 rounded-lg shadow">
        <h1 className="text-4xl font-bold mb-4">{article.title}</h1>
        <div className="flex justify-between items-center mb-6 border-b pb-4">
          <Link to={`/profile/${article.author._id}`} className="hover:text-blue-600">
            <p className="font-semibold">By {article.author.username}</p>
          </Link>
          <span className="text-gray-500">{new Date(article.createdAt).toLocaleDateString()}</span>
        </div>
        <div className="prose max-w-none mb-6 text-lg">
          {article.content}
        </div>
        <div className="flex gap-4 items-center mb-8">
          <button
            onClick={handleLike}
            className={`px-4 py-2 rounded ${
              liked
                ? 'bg-red-100 text-red-600'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {liked ? '❤️' : '🤍'} {article.likesCount}
          </button>
          <span className="text-gray-500">💬 {article.commentsCount}</span>
          <span className="text-gray-500">👁️ {article.views}</span>
        </div>
      </article>

      <div className="mt-8 bg-white p-8 rounded-lg shadow">
        <h2 className="text-2xl font-bold mb-6">Comments</h2>
        {token ? (
          <form onSubmit={handleAddComment} className="mb-8">
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Share your thoughts..."
              className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-600"
              rows="3"
              required
            />
            <button
              type="submit"
              className="mt-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Post Comment
            </button>
          </form>
        ) : (
          <p className="mb-8 text-gray-600">
            <Link to="/login" className="text-blue-600 hover:underline">Login</Link> to comment
          </p>
        )}
        <div className="space-y-4">
          {comments.length > 0 ? (
            comments.map(comment => (
              <div key={comment._id} className="border-l-4 border-blue-600 pl-4 py-2">
                <p className="font-semibold text-sm">
                  <Link to={`/profile/${comment.author._id}`} className="hover:text-blue-600">
                    {comment.author.username}
                  </Link>
                </p>
                <p className="text-gray-700 mt-1">{comment.content}</p>
              </div>
            ))
          ) : (
            <p className="text-gray-500">No comments yet. Be the first!</p>
          )}
        </div>
      </div>
    </div>
  )
}

export default Article
