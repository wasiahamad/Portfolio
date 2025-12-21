import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import axios from 'axios'
import { Link } from 'wouter'
import { toast } from 'sonner'

export default function Experience() {
  const queryClient = useQueryClient()
  const [showForm, setShowForm] = useState(false)
  const [editingExp, setEditingExp] = useState(null)
  const [formData, setFormData] = useState({
    title: '',
    company: '',
    location: '',
    startDate: '',
    endDate: '',
    current: false,
    description: '',
    technologies: ''
  })

  const { data: experiences, isLoading } = useQuery({
    queryKey: ['experiences'],
    queryFn: () => axios.get('/api/experience').then(res => res.data)
  })

  const createMutation = useMutation({
    mutationFn: (data) => axios.post('/api/experience', data),
    onSuccess: () => {
      queryClient.invalidateQueries(['experiences'])
      toast.success('Experience added!')
      resetForm()
    }
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => axios.put(`/api/experience/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries(['experiences'])
      toast.success('Experience updated!')
      resetForm()
    }
  })

  const deleteMutation = useMutation({
    mutationFn: (id) => axios.delete(`/api/experience/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries(['experiences'])
      toast.success('Experience deleted!')
    }
  })

  const resetForm = () => {
    setFormData({
      title: '',
      company: '',
      location: '',
      startDate: '',
      endDate: '',
      current: false,
      description: '',
      technologies: ''
    })
    setEditingExp(null)
    setShowForm(false)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const data = {
      ...formData,
      technologies: formData.technologies.split(',').map(t => t.trim()),
      endDate: formData.current ? null : formData.endDate
    }
    
    if (editingExp) {
      updateMutation.mutate({ id: editingExp._id, data })
    } else {
      createMutation.mutate(data)
    }
  }

  const handleEdit = (exp) => {
    setEditingExp(exp)
    setFormData({
      title: exp.title,
      company: exp.company,
      location: exp.location || '',
      startDate: exp.startDate?.split('T')[0] || '',
      endDate: exp.endDate?.split('T')[0] || '',
      current: exp.current || false,
      description: exp.description || '',
      technologies: exp.technologies?.join(', ') || ''
    })
    setShowForm(true)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow mb-8">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/dashboard">
            <a className="text-blue-600 hover:text-blue-800">← Back</a>
          </Link>
          <h1 className="text-2xl font-bold">Manage Experience</h1>
          <button
            onClick={() => setShowForm(!showForm)}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            {showForm ? 'Cancel' : '+ Add'}
          </button>
        </div>
      </nav>

      <div className="max-w-5xl mx-auto px-4">
        {showForm && (
          <div className="bg-white rounded-lg shadow p-6 mb-8">
            <form onSubmit={handleSubmit} className="space-y-4">
              <input type="text" required placeholder="Job Title" className="w-full px-3 py-2 border rounded" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} />
              <input type="text" required placeholder="Company" className="w-full px-3 py-2 border rounded" value={formData.company} onChange={(e) => setFormData({ ...formData, company: e.target.value })} />
              <input type="text" placeholder="Location" className="w-full px-3 py-2 border rounded" value={formData.location} onChange={(e) => setFormData({ ...formData, location: e.target.value })} />
              <div className="grid grid-cols-2 gap-4">
                <input type="date" required className="px-3 py-2 border rounded" value={formData.startDate} onChange={(e) => setFormData({ ...formData, startDate: e.target.value })} />
                <input type="date" disabled={formData.current} className="px-3 py-2 border rounded disabled:bg-gray-100" value={formData.endDate} onChange={(e) => setFormData({ ...formData, endDate: e.target.value })} />
              </div>
              <label className="flex items-center"><input type="checkbox" className="mr-2" checked={formData.current} onChange={(e) => setFormData({ ...formData, current: e.target.checked })} />Currently working</label>
              <textarea required rows={4} placeholder="Description" className="w-full px-3 py-2 border rounded" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} />
              <input type="text" placeholder="Technologies (comma-separated)" className="w-full px-3 py-2 border rounded" value={formData.technologies} onChange={(e) => setFormData({ ...formData, technologies: e.target.value })} />
              <div className="flex gap-2">
                <button type="submit" className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">{editingExp ? 'Update' : 'Add'}</button>
                <button type="button" onClick={resetForm} className="px-6 py-2 bg-gray-300 rounded hover:bg-gray-400">Cancel</button>
              </div>
            </form>
          </div>
        )}

        {isLoading ? <p className="text-center py-8">Loading...</p> : experiences?.length === 0 ? <p className="text-center py-8 text-gray-500">No experience added yet!</p> : (
          <div className="space-y-6">
            {experiences?.map(exp => (
              <div key={exp._id} className="bg-white rounded-lg shadow p-6">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="text-xl font-bold">{exp.title}</h3>
                    <p className="text-lg text-blue-600">{exp.company}</p>
                    {exp.location && <p className="text-sm text-gray-500">{exp.location}</p>}
                  </div>
                  <p className="text-sm text-gray-600">{new Date(exp.startDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })} - {exp.current ? 'Present' : new Date(exp.endDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}</p>
                </div>
                <p className="text-gray-700 mb-4">{exp.description}</p>
                {exp.technologies && <div className="flex flex-wrap gap-2 mb-4">{exp.technologies.map((tech, idx) => <span key={idx} className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">{tech}</span>)}</div>}
                <div className="flex gap-2">
                  <button onClick={() => handleEdit(exp)} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm">Edit</button>
                  <button onClick={() => { if(window.confirm('Delete?')) deleteMutation.mutate(exp._id) }} className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 text-sm">Delete</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
