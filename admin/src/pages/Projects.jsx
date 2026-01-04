import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import axios from '../lib/axios'
import { Link } from 'wouter'
import { toast } from 'sonner'

export default function Projects() {
  const queryClient = useQueryClient()
  const [showForm, setShowForm] = useState(false)
  const [editingProject, setEditingProject] = useState(null)
  const [imageFile, setImageFile] = useState(null)
  const [imagePreview, setImagePreview] = useState('')
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    technologies: '',
    image: '',
    liveUrl: '',
    github: '',
    featured: false
  })

  const { data: projects, isLoading } = useQuery({
    queryKey: ['projects'],
    queryFn: () => axios.get('/projects').then(res => res.data)
  })

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setImageFile(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result)
      }
      reader.readAsDataURL(file)
    }
  }

  const createMutation = useMutation({
    mutationFn: (formData) => axios.post('/projects', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    }),
    onSuccess: () => {
      queryClient.invalidateQueries(['projects'])
      toast.success('Project created successfully!')
      resetForm()
    },
    onError: () => toast.error('Failed to create project')
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, formData }) => axios.put(`/projects/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    }),
    onSuccess: () => {
      queryClient.invalidateQueries(['projects'])
      toast.success('Project updated successfully!')
      resetForm()
    },
    onError: () => toast.error('Failed to update project')
  })

  const deleteMutation = useMutation({
    mutationFn: (id) => axios.delete(`/projects/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries(['projects'])
      toast.success('Project deleted successfully!')
    },
    onError: () => toast.error('Failed to delete project')
  })

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      technologies: '',
      image: '',
      liveUrl: '',
      github: '',
      featured: false
    })
    setImageFile(null)
    setImagePreview('')
    setEditingProject(null)
    setShowForm(false)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const submitData = new FormData()
    submitData.append('title', formData.title)
    submitData.append('description', formData.description)
    submitData.append('technologies', JSON.stringify(formData.technologies.split(',').map(t => t.trim())))
    submitData.append('liveUrl', formData.liveUrl)
    submitData.append('github', formData.github)
    submitData.append('featured', formData.featured)

    if (imageFile) {
      submitData.append('image', imageFile)
    }

    if (editingProject) {
      updateMutation.mutate({ id: editingProject._id, formData: submitData })
    } else {
      createMutation.mutate(submitData)
    }
  }

  const handleEdit = (project) => {
    setEditingProject(project)
    setFormData({
      title: project.title,
      description: project.description,
      technologies: project.technologies.join(', '),
      image: project.image || '',
      liveUrl: project.liveUrl || '',
      github: project.github || '',
      featured: project.featured || false
    })
    setImageFile(null)
    setImagePreview(project.image || '')
    setShowForm(true)
  }

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this project?')) {
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
          <h1 className="text-2xl font-bold">Manage Projects</h1>
          <button
            onClick={() => setShowForm(!showForm)}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            {showForm ? 'Cancel' : '+ Add Project'}
          </button>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4">
        {showForm && (
          <div className="bg-white rounded-lg shadow p-6 mb-8">
            <h2 className="text-xl font-bold mb-4">
              {editingProject ? 'Edit Project' : 'Add New Project'}
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
                <label className="block text-sm font-medium mb-1">Description *</label>
                <textarea
                  required
                  rows={4}
                  className="w-full px-3 py-2 border rounded-md"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Technologies (comma-separated) *</label>
                <input
                  type="text"
                  required
                  placeholder="React, Node.js, MongoDB"
                  className="w-full px-3 py-2 border rounded-md"
                  value={formData.technologies}
                  onChange={(e) => setFormData({ ...formData, technologies: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Project Image</label>
                <input
                  type="file"
                  accept="image/*"
                  className="w-full px-3 py-2 border rounded-md"
                  onChange={handleImageChange}
                />
                {imagePreview && (
                  <div className="mt-3">
                    <img src={imagePreview} alt="Preview" className="w-full h-48 object-cover rounded-md" />
                  </div>
                )}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Live URL</label>
                  <input
                    type="url"
                    className="w-full px-3 py-2 border rounded-md"
                    value={formData.liveUrl}
                    onChange={(e) => setFormData({ ...formData, liveUrl: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">GitHub URL</label>
                  <input
                    type="url"
                    className="w-full px-3 py-2 border rounded-md"
                    value={formData.github}
                    onChange={(e) => setFormData({ ...formData, github: e.target.value })}
                  />
                </div>
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="featured"
                  className="mr-2"
                  checked={formData.featured}
                  onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                />
                <label htmlFor="featured" className="text-sm font-medium">Featured Project</label>
              </div>
              <div className="flex gap-2">
                <button
                  type="submit"
                  className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  {editingProject ? 'Update' : 'Create'} Project
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
        ) : projects?.length === 0 ? (
          <p className="text-center py-8 text-gray-500">No projects yet. Add your first project!</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects?.map(project => (
              <div key={project._id} className="bg-white rounded-lg shadow overflow-hidden">
                {project.image && (
                  <img src={project.image} alt={project.title} className="w-full h-48 object-cover" />
                )}
                <div className="p-6">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="text-xl font-bold">{project.title}</h3>
                    {project.featured && (
                      <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded">Featured</span>
                    )}
                  </div>
                  <p className="text-gray-600 text-sm mb-3 line-clamp-2">{project.description}</p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {project.technologies?.slice(0, 3).map((tech, idx) => (
                      <span key={idx} className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                        {tech}
                      </span>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(project)}
                      className="flex-1 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(project._id)}
                      className="flex-1 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 text-sm"
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
