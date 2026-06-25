import { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { useAuthStore } from '../store/authStore'

function Profile() {
  const { id } = useParams()
  const { user: currentUser, token } = useAuthStore()
  const navigate = useNavigate()
  const [profile, setProfile] = useState(null)
  const [articles, setArticles] = useState([])
  const [following, setFollowing] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchProfile()
    fetchArticles()
  }, [id])

  const fetchProfile = async () => {
    try {
      const response = await axios.get(`/api/users/${id}`)
      setProfile(response.data)
      setFollowing(response.data.followers.some(f => f._id === currentUser?.id))
    } catch (error) {
      console.error('Failed to fetch profile:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchArticles = async () => {
    try {
      const response = await axios.get(`/api/articles/author/${id}`)
      setArticles(response.data)
    } catch (error) {
      console.error('Failed to fetch articles:', error)
    }
  }

  const handleFollow = async () => {
    if (!token) {
      navigate('/login')
      return
    }
    try {
      const response = await axios.post(
        `/api/follows/${id}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      )
      setFollowing(response.data.following)
      setProfile(prev => ({
        ...prev,
        followers: response.data.following
          ? [...prev.followers, { _id: currentUser.id }]
          : prev.followers.filter(f => f._id !== currentUser.id)
      }))
    } catch (error) {
      console.error('Failed to follow/unfollow:', error)
    }
  }

  if (loading) return <div className="text-center py-12">Loading...</div>
  if (!profile) return <div className="text-center py-12">Profile not found</div>

  return (
    <div className="max-w-3xl mx-auto">
      <div className="bg-white p-8 rounded-lg shadow mb-8">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-4xl font-bold">{profile.firstName} {profile.lastName}</h1>
            <p className="text-xl text-gray-600">@{profile.username}</p>
            {profile.bio && <p className="text-gray-600 mt-2">{profile.bio}</p>}
          </div>
          {currentUser?.id !== id && (
            <button
              onClick={handleFollow}
              className={`px-6 py-2 rounded font-semibold ${
                following
                  ? 'bg-gray-200 text-gray-900 hover:bg-gray-300'
                  : 'bg-blue-600 text-white hover:bg-blue-700'
              }`}
            >
              {following ? '✓ Following' : 'Follow'}
            </button>
          )}
        </div>
        <div className="flex gap-8 mt-6 pt-6 border-t">
          <div className="text-center">
            <p className="text-2xl font-bold">{profile.articlesCount}</p>
            <p className="text-gray-600">Articles</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold">{profile.followers.length}</p>
            <p className="text-gray-600">Followers</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold">{profile.following.length}</p>
            <p className="text-gray-600">Following</p>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <h2 className="text-2xl font-bold">Articles</h2>
        {articles.length > 0 ? (
          articles.map(article => (
            <article key={article._id} className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition">
              <Link to={`/article/${article._id}`}>
                <h3 className="text-xl font-bold hover:text-blue-600">{article.title}</h3>
              </Link>
              <p className="text-gray-600 mt-2">{article.excerpt}</p>
              <div className="flex justify-between items-center mt-4 text-sm text-gray-500">
                <span>{new Date(article.createdAt).toLocaleDateString()}</span>
                <span>❤️ {article.likesCount} · 💬 {article.commentsCount}</span>
              </div>
            </article>
          ))
        ) : (
          <p className="text-gray-500 text-center py-8">No articles yet</p>
        )}
      </div>
    </div>
  )
}

export default Profile
