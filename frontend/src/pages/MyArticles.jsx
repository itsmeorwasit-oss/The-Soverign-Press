import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { useAuthStore } from '../store/authStore'

function MyArticles() {
  const { user, token } = useAuthStore()
  const navigate = useNavigate()
  const [articles, setArticles] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (user?.id) fetchArticles()
  }, [user])

  const fetchArticles = async () => {
    try {
      setLoading(true)
      const response = await axios.get(`/api/articles/author/${user.id}`)
      setArticles(response.data)
    } catch (error) {
      console.error('Failed to fetch articles:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this article?')) return
    try {
      await axios.delete(`/api/articles/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      setArticles(articles.filter(a => a._id !== id))
    } catch (error) {
      console.error('Failed to delete article:', error)
    }
  }

  if (loading) return <div className="text-center py-12">Loading...</div>

  return (
    <div className="max-w-3xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">📚 My Articles</h1>
        <Link to="/editor" className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700">
          ✍️ Write New
        </Link>
      </div>

      {articles.length > 0 ? (
        <div className="space-y-6">
          {articles.map(article => (
            <article key={article._id} className="bg-white p-6 rounded-lg shadow">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <Link to={`/article/${article._id}`}>
                    <h2 className="text-2xl font-bold hover:text-blue-600">{article.title}</h2>
                  </Link>
                  <p className="text-gray-600 mt-2">{article.excerpt}</p>
                  <div className="flex gap-4 mt-4 text-sm text-gray-500">
                    <span>📅 {new Date(article.createdAt).toLocaleDateString()}</span>
                    <span>❤️ {article.likesCount}</span>
                    <span>💬 {article.commentsCount}</span>
                    <span>👁️ {article.views}</span>
                  </div>
                </div>
                <div className="flex gap-2 ml-4">
                  <Link
                    to={`/editor/${article._id}`}
                    className="bg-blue-100 text-blue-600 px-3 py-1 rounded hover:bg-blue-200"
                  >
                    Edit
                  </Link>
                  <button
                    onClick={() => handleDelete(article._id)}
                    className="bg-red-100 text-red-600 px-3 py-1 rounded hover:bg-red-200"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-white rounded-lg">
          <p className="text-gray-500 text-lg">You haven't written any articles yet</p>
          <Link to="/editor" className="text-blue-600 hover:underline mt-2 inline-block">
            Start writing now →
          </Link>
        </div>
      )}
    </div>
  )
}

export default MyArticles
