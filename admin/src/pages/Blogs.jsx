import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import axios from 'axios'
import { Link } from 'wouter'
import { toast } from 'sonner'

export default function Blogs() {
  const queryClient = useQueryClient()
  const [showForm, setShowForm] = useState(false)
  const [editingBlog, setEditingBlog] = useState(null)
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    excerpt: '',
    image: '',
    tags: '',
    published: true
  })

  const { data: blogs, isLoading } = useQuery({
    queryKey: ['blogs'],
    queryFn: () => axios.get('/api/blogs').then(res => res.data)
  })

  const createMutation = useMutation({
    mutationFn: (data) => axios.post('/api/blogs', data),
    onSuccess: () => {
      queryClient.invalidateQueries(['blogs'])
      toast.success('Blog created successfully!')
      resetForm()
    },
    onError: () => toast.error('Failed to create blog')
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => axios.put(`/api/blogs/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries(['blogs'])
      toast.success('Blog updated successfully!')
      resetForm()
    },
    onError: () => toast.error('Failed to update blog')
  })

  const deleteMutation = useMutation({
    mutationFn: (id) => axios.delete(`/api/blogs/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries(['blogs'])
      toast.success('Blog deleted successfully!')
    },
    onError: () => toast.error('Failed to delete blog')
  })

  const resetForm = () => {
    setFormData({
      title: '',
      content: '',
      excerpt: '',
      image: '',
      tags: '',
      published: true
    })
    setEditingBlog(null)
    setShowForm(false)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const data = {
      ...formData,
      tags: formData.tags.split(',').map(t => t.trim())
    }
    
    if (editingBlog) {
      updateMutation.mutate({ id: editingBlog._id, data })
    } else {
      createMutation.mutate(data)
    }
  }

  const handleEdit = (blog) => {
    setEditingBlog(blog)
    setFormData({
      title: blog.title,
      content: blog.content,
      excerpt: blog.excerpt || '',
      image: blog.image || '',
      tags: blog.tags?.join(', ') || '',
      published: blog.published !== false
    })
    setShowForm(true)
  }

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this blog?')) {
      deleteMutation.mutate(id)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow mb-8">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/dashboard">
            <a className="text-blue-600 hover:text-blue-800">← Back to Dashboard</a>
          </Link>
          <h1 className="text-2xl font-bold">Manage Blogs</h1>
          <button
            onClick={() => setShowForm(!showForm)}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            {showForm ? 'Cancel' : '+ Add Blog'}
          </button>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4">
        {showForm && (
          <div className="bg-white rounded-lg shadow p-6 mb-8">
            <h2 className="text-xl font-bold mb-4">
              {editingBlog ? 'Edit Blog' : 'Add New Blog'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Title *</label>
                <input
                  type="text"
                  required
                  className="w-full px-3 py-2 border rounded-md"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Excerpt *</label>
                <textarea
                  required
                  rows={2}
                  placeholder="Short description..."
                  className="w-full px-3 py-2 border rounded-md"
                  value={formData.excerpt}
                  onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Content *</label>
                <textarea
                  required
                  rows={8}
                  className="w-full px-3 py-2 border rounded-md"
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Image URL</label>
                <input
                  type="url"
                  className="w-full px-3 py-2 border rounded-md"
                  value={formData.image}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Tags (comma-separated)</label>
                <input
                  type="text"
                  placeholder="React, JavaScript, Web Development"
                  className="w-full px-3 py-2 border rounded-md"
                  value={formData.tags}
                  onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                />
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="published"
                  className="mr-2"
                  checked={formData.published}
                  onChange={(e) => setFormData({ ...formData, published: e.target.checked })}
                />
                <label htmlFor="published" className="text-sm font-medium">Published</label>
              </div>
              <div className="flex gap-2">
                <button
                  type="submit"
                  className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  {editingBlog ? 'Update' : 'Create'} Blog
                </button>
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-6 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {isLoading ? (
          <p className="text-center py-8">Loading...</p>
        ) : blogs?.length === 0 ? (
          <p className="text-center py-8 text-gray-500">No blogs yet. Add your first blog!</p>
        ) : (
          <div className="space-y-4">
            {blogs?.map(blog => (
              <div key={blog._id} className="bg-white rounded-lg shadow p-6 flex gap-6">
                {blog.image && (
                  <img src={blog.image} alt={blog.title} className="w-32 h-32 object-cover rounded" />
                )}
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="text-xl font-bold">{blog.title}</h3>
                    {!blog.published && (
                      <span className="text-xs bg-gray-100 text-gray-800 px-2 py-1 rounded">Draft</span>
                    )}
                  </div>
                  <p className="text-gray-600 text-sm mb-3 line-clamp-2">{blog.excerpt || blog.content}</p>
                  {blog.tags && (
                    <div className="flex flex-wrap gap-2 mb-4">
                      {blog.tags.slice(0, 3).map((tag, idx) => (
                        <span key={idx} className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(blog)}
                      className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(blog._id)}
                      className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 text-sm"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
