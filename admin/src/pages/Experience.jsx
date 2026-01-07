import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import axios from '../lib/axios'
import { Link } from 'wouter'
import { toast } from 'sonner'

export default function Experience() {
  const queryClient = useQueryClient()
  const [showForm, setShowForm] = useState(false)
  const [editingExp, setEditingExp] = useState(null)
  const [formData, setFormData] = useState({
    role: '',
    company: '',
    period: '',
    description: '',
    skills: '',
    order: 0
  })

  const { data: experiences, isLoading } = useQuery({
    queryKey: ['experiences'],
    queryFn: () => axios.get('/experience').then(res => res.data)
  })

  const createMutation = useMutation({
    mutationFn: (data) => axios.post('/experience', data),
    onSuccess: () => {
      queryClient.invalidateQueries(['experiences'])
      toast.success('Experience added!')
      resetForm()
    }
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => axios.put(`/experience/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries(['experiences'])
      toast.success('Experience updated!')
      resetForm()
    }
  })

  const deleteMutation = useMutation({
    mutationFn: (id) => axios.delete(`/experience/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries(['experiences'])
      toast.success('Experience deleted!')
    }
  })

  const resetForm = () => {
    setFormData({
      role: '',
      company: '',
      period: '',
      description: '',
      skills: '',
      order: 0
    })
    setEditingExp(null)
    setShowForm(false)
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    const data = {
      role: formData.role,
      company: formData.company,
      period: formData.period,
      description: formData.description,
      skills: formData.skills.split(',').map(t => t.trim()).filter(Boolean),
      order: Number(formData.order) || 0
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
      role: exp.role || exp.position || exp.title || '',
      company: exp.company || '',
      period: exp.period || exp.duration || '',
      description: exp.description || '',
      skills: (exp.skills?.length ? exp.skills : exp.technologies)?.join(', ') || '',
      order: typeof exp.order === 'number' ? exp.order : 0
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
              <input type="text" required placeholder="Role" className="w-full px-3 py-2 border rounded" value={formData.role} onChange={(e) => setFormData({ ...formData, role: e.target.value })} />
              <input type="text" required placeholder="Company" className="w-full px-3 py-2 border rounded" value={formData.company} onChange={(e) => setFormData({ ...formData, company: e.target.value })} />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input type="text" required placeholder="Period (e.g. 2022 - Present)" className="w-full px-3 py-2 border rounded" value={formData.period} onChange={(e) => setFormData({ ...formData, period: e.target.value })} />
                <input type="number" placeholder="Order" className="w-full px-3 py-2 border rounded" value={formData.order} onChange={(e) => setFormData({ ...formData, order: e.target.value })} />
              </div>
              <textarea required rows={4} placeholder="Description" className="w-full px-3 py-2 border rounded" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} />
              <input type="text" placeholder="Skills (comma-separated)" className="w-full px-3 py-2 border rounded" value={formData.skills} onChange={(e) => setFormData({ ...formData, skills: e.target.value })} />
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
                    <h3 className="text-xl font-bold">{exp.role || exp.position || exp.title}</h3>
                    <p className="text-lg text-blue-600">{exp.company}</p>
                  </div>
                  <p className="text-sm text-gray-600">{exp.period || exp.duration}</p>
                </div>
                <p className="text-gray-700 mb-4">{exp.description}</p>
                {(exp.skills || exp.technologies) && (
                  <div className="flex flex-wrap gap-2 mb-4">
                    {(exp.skills?.length ? exp.skills : exp.technologies).map((skill, idx) => (
                      <span key={idx} className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">{skill}</span>
                    ))}
                  </div>
                )}
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
