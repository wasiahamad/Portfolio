import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import axios from '../lib/axios'
import { Link } from 'wouter'
import { toast } from 'sonner'

export default function Blogs() {
  const queryClient = useQueryClient()
  const [showForm, setShowForm] = useState(false)
  const [editingBlog, setEditingBlog] = useState(null)
  const [uploading, setUploading] = useState(false)
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
    queryFn: () => axios.get('/blogs').then(res => res.data)
  })

  const createMutation = useMutation({
    mutationFn: (data) => axios.post('/blogs', data),
    onSuccess: () => {
      queryClient.invalidateQueries(['blogs'])
      toast.success('Blog created successfully!')
      resetForm()
    },
    onError: () => toast.error('Failed to create blog')
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => axios.put(`/blogs/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries(['blogs'])
      toast.success('Blog updated successfully!')
      resetForm()
    },
    onError: () => toast.error('Failed to update blog')
  })

  const deleteMutation = useMutation({
    mutationFn: (id) => axios.delete(`/blogs/${id}`),
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

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file')
      return
    }

    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image size should be less than 5MB')
      return
    }

    try {
      setUploading(true)
      const uploadFormData = new FormData()
      uploadFormData.append('image', file)

      const response = await axios.post('/upload/image', uploadFormData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })

      setFormData(prev => ({ ...prev, image: response.data.url }))
      toast.success('Image uploaded successfully!')
    } catch (error) {
      console.error('Upload error:', error)
      toast.error(error.response?.data?.message || 'Failed to upload image')
    } finally {
      setUploading(false)
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
              <div className="space-y-2">
                <label className="block text-sm font-medium mb-1">Blog Image</label>
                <div>
                  <label className="block text-xs text-gray-600 mb-1">Upload Image</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    disabled={uploading}
                    className="w-full px-3 py-2 border rounded-md file:mr-4 file:py-1.5 file:px-3 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                  />
                  {uploading && (
                    <p className="text-sm text-blue-600 mt-1">Uploading image...</p>
                  )}
                </div>
                <div>
                  <label className="block text-xs text-gray-600 mb-1">Or paste Image URL</label>
                  <input
                    type="url"
                    className="w-full px-3 py-2 border rounded-md"
                    placeholder="https://example.com/image.jpg"
                    value={formData.image}
                    onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  />
                </div>
                {formData.image && (
                  <div className="mt-2">
                    <p className="text-xs text-gray-600 mb-1">Preview:</p>
                    <img src={formData.image} alt="Preview" className="w-32 h-32 object-cover rounded-lg shadow" />
                  </div>
                )}
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
