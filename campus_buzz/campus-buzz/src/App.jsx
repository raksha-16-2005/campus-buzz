import { useState, useEffect } from 'react'
import './App.css'

function App() {
  const [posts, setPosts] = useState([])
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [category, setCategory] = useState('General')
  const [loading, setLoading] = useState(false)

  const API_URL = 'http://localhost:3000/api/posts'

  useEffect(() => {
    fetchPosts()
  }, [])

  const fetchPosts = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/posts')
      if (response.ok) {
        const data = await response.json()
        setPosts(data.posts)
      }
    } catch (error) {
      console.log('API not available (running locally only)')
      setExamplePosts()
    }
  }

  const setExamplePosts = () => {
    setPosts([
      {
        id: 1,
        title: 'Welcome to Campus Buzz!',
        content: 'This is the student bulletin board for RVITM. Share announcements, events, and updates!',
        category: 'General',
        createdAt: new Date().toISOString()
      },
      {
        id: 2,
        title: 'Placement Season is Coming',
        content: 'Start preparing your DSA. Minimum 2 problems a day on LeetCode. Companies visit from August.',
        category: 'Placement',
        createdAt: new Date().toISOString()
      }
    ])
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!title.trim() || !content.trim()) {
      alert('Please fill in all fields')
      return
    }

    setLoading(true)

    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, content, category })
      })

      if (response.ok) {
        const newPost = await response.json()
        setPosts([newPost, ...posts])
        setTitle('')
        setContent('')
        setCategory('General')
        alert('Post created successfully!')
      }
    } catch (error) {
      alert('Error creating post. Make sure the API is running on http://localhost:3000')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`http://localhost:3000/api/posts/${id}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        setPosts(posts.filter(post => post.id !== id))
        alert('Post deleted successfully!')
      }
    } catch (error) {
      alert('Error deleting post')
    }
  }

  return (
    <div className="app">
      <header className="header">
        <h1>🎓 Campus Buzz</h1>
        <p>Your Campus Bulletin Board</p>
      </header>

      <main className="main-container">
        <section className="form-section">
          <h2>Create a New Post</h2>
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="Post Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              maxLength="100"
            />
            <textarea
              placeholder="Post Content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              maxLength="500"
              rows="4"
            />
            <select value={category} onChange={(e) => setCategory(e.target.value)}>
              <option>General</option>
              <option>Events</option>
              <option>Academic</option>
              <option>Placement</option>
              <option>Sports</option>
              <option>Tech</option>
              <option>Lost & Found</option>
            </select>
            <button type="submit" disabled={loading}>
              {loading ? 'Posting...' : 'Post'}
            </button>
          </form>
        </section>

        <section className="posts-section">
          <h2>Posts ({posts.length})</h2>
          <div className="posts-list">
            {posts.length === 0 ? (
              <p className="no-posts">No posts yet. Be the first to post!</p>
            ) : (
              posts.map(post => (
                <div key={post.id} className="post-card">
                  <div className="post-header">
                    <h3>{post.title}</h3>
                    <span className="category">{post.category}</span>
                  </div>
                  <p className="post-content">{post.content}</p>
                  <div className="post-footer">
                    <small>
                      {new Date(post.createdAt).toLocaleDateString()}
                    </small>
                    <button 
                      className="delete-btn"
                      onClick={() => handleDelete(post.id)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>
      </main>
    </div>
  )
}

export default App
