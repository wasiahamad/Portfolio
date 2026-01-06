import { useState, useEffect } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import axios from '../lib/axios'
import { toast } from 'sonner'

export default function Profile() {
  const queryClient = useQueryClient()
  const [formData, setFormData] = useState({
    name: '',
    title: '',
    bio: '',
    bio2: '',
    email: '',
    location: '',
    skills: {
      frontend: '',
      design: '',
      backend: '',
      optimization: ''
    },
    github: '',
    linkedin: '',
    twitter: '',
    website: '',
    image: ''
  })
  const [uploading, setUploading] = useState(false)
  const [cvUploading, setCvUploading] = useState(false)
  const [imagePreview, setImagePreview] = useState('')

  const { data: profile, isLoading } = useQuery({
    queryKey: ['profile'],
    queryFn: async () => {
      const res = await axios.get('/profile')
      return res.data
    },
  })

  useEffect(() => {
    if (profile) {
      setFormData({
        name: profile.name || '',
        title: profile.title || '',
        bio: profile.bio || '',
        bio2: profile.bio2 || '',
        email: profile.email || '',
        location: profile.location || '',
        skills: {
          frontend: profile.skills?.frontend || '',
          design: profile.skills?.design || '',
          backend: profile.skills?.backend || '',
          optimization: profile.skills?.optimization || ''
        },
        github: profile.github || '',
        linkedin: profile.linkedin || '',
        twitter: profile.twitter || '',
        website: profile.website || '',
        image: profile.image || '',
        cvUrl: profile.cvUrl || ''
      })
    }
  }, [profile])

  const mutation = useMutation({
    mutationFn: async (data) => {
      const res = await axios.post('/profile', data)
      return res.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['profile'])
      toast.success('Profile updated successfully!')
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to update profile')
    },
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    mutation.mutate(formData)
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    if (name.startsWith('skills.')) {
      const skillKey = name.split('.')[1]
      setFormData(prev => ({
        ...prev,
        skills: { ...prev.skills, [skillKey]: value }
      }))
    } else {
      setFormData(prev => ({ ...prev, [name]: value }))
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
      setImagePreview(response.data.url)
      toast.success('Image uploaded successfully!')
    } catch (error) {
      console.error('Upload error:', error)
      toast.error(error.response?.data?.message || 'Failed to upload image')
    } finally {
      setUploading(false)
    }
  }

  // CV upload handler can be added 
  const handleCVUpload = async (e) => {
    // Similar to handleImageUpload but for CV files
    const file = e.target.files?.[0]
    if (!file) return

    if (file.type !== 'application/pdf') {
      toast.error('Please select a PDF file')
      return
    }

    try {
      setCvUploading(true)
      const uploadFormData = new FormData()
      uploadFormData.append('cv', file)

      const response = await axios.post('/upload/cv', uploadFormData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })

      const cvUrl = response.data.cvUrl || response.data.url
      setFormData(prev => ({ ...prev, cvUrl }))
      toast.success('CV uploaded successfully!')
    } catch (error) {
      console.error('Upload error:', error)
      toast.error(error.response?.data?.message || 'Failed to upload CV')
    } finally {
      setCvUploading(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-lg">Loading...</div>
      </div>
    )
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Profile Settings</h1>

      <form onSubmit={handleSubmit} className="space-y-6 max-w-3xl">
        {/* Basic Info */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Basic Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full p-2 border rounded"
                placeholder="Your Name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Title</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className="w-full p-2 border rounded"
                placeholder="Full Stack Developer"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full p-2 border rounded"
                placeholder="hello@portfolio.com"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Location</label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                className="w-full p-2 border rounded"
                placeholder="San Francisco, CA"
              />
            </div>
          </div>
        </div>

        {/* Bio */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">About Me</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Bio Paragraph 1</label>
              <textarea
                name="bio"
                value={formData.bio}
                onChange={handleChange}
                rows="3"
                className="w-full p-2 border rounded"
                placeholder="I'm a passionate developer..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Bio Paragraph 2</label>
              <textarea
                name="bio2"
                value={formData.bio2}
                onChange={handleChange}
                rows="3"
                className="w-full p-2 border rounded"
                placeholder="My journey began..."
              />
            </div>
          </div>
        </div>

        {/* Skills */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Skills</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Frontend</label>
              <input
                type="text"
                name="skills.frontend"
                value={formData.skills.frontend}
                onChange={handleChange}
                className="w-full p-2 border rounded"
                placeholder="React, TS, Tailwind"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Design</label>
              <input
                type="text"
                name="skills.design"
                value={formData.skills.design}
                onChange={handleChange}
                className="w-full p-2 border rounded"
                placeholder="Figma, Motion, UI/UX"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Backend</label>
              <input
                type="text"
                name="skills.backend"
                value={formData.skills.backend}
                onChange={handleChange}
                className="w-full p-2 border rounded"
                placeholder="Node, DBs, API"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Optimization</label>
              <input
                type="text"
                name="skills.optimization"
                value={formData.skills.optimization}
                onChange={handleChange}
                className="w-full p-2 border rounded"
                placeholder="SEO, Performance"
              />
            </div>
          </div>
        </div>

        {/* Social Links */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Social Links</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">GitHub</label>
              <input
                type="url"
                name="github"
                value={formData.github}
                onChange={handleChange}
                className="w-full p-2 border rounded"
                placeholder="https://github.com/username"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">LinkedIn</label>
              <input
                type="url"
                name="linkedin"
                value={formData.linkedin}
                onChange={handleChange}
                className="w-full p-2 border rounded"
                placeholder="https://linkedin.com/in/username"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Twitter</label>
              <input
                type="url"
                name="twitter"
                value={formData.twitter}
                onChange={handleChange}
                className="w-full p-2 border rounded"
                placeholder="https://twitter.com/username"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Website</label>
              <input
                type="url"
                name="website"
                value={formData.website}
                onChange={handleChange}
                className="w-full p-2 border rounded"
                placeholder="https://yourwebsite.com"
              />
            </div>
          </div>
        </div>

        {/* Image */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Profile Image</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Upload Image</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                disabled={uploading}
                className="w-full p-2 border rounded file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              />
              {uploading && (
                <p className="text-sm text-blue-600 mt-2">Uploading image...</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Or paste Image URL</label>
              <input
                type="url"
                name="image"
                value={formData.image}
                onChange={handleChange}
                className="w-full p-2 border rounded"
                placeholder="https://example.com/image.jpg"
              />
            </div>
            {formData.image && (
              <div>
                <p className="text-sm font-medium mb-2">Preview:</p>
                <img src={formData.image} alt="Preview" className="w-32 h-32 object-cover rounded-lg shadow" />
              </div>
            )}
          </div>
        </div>

        {/* CV Upload */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Upload CV</h2>
          <div>
            <label className="block text-sm font-medium mb-2">Upload CV</label>
            <input
              type="file"
              accept=".pdf"
              onChange={handleCVUpload}
              disabled={cvUploading}
              className="w-full p-2 border rounded file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />
            {cvUploading && (
              <p className="text-sm text-blue-600 mt-2">Uploading CV...</p>
            )}
            {formData.cvUrl && (
              <div className="mt-3">
                <p className="text-sm font-medium mb-2">Current CV:</p>
                <a 
                  href={formData.cvUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-medium text-gray-700 transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                  View CV (PDF)
                </a>
              </div>
            )}
          </div>
        </div>

        <button
          type="submit"
          disabled={mutation.isPending}  
          className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50 font-medium"
        >
          {mutation.isPending ? 'Saving...' : 'Save Profile'}
        </button>
      </form>
    </div>
  )
}
