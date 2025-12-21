import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Plus, Edit2, Trash2, Eye, EyeOff } from "lucide-react"

interface Article {
  id: string
  title: string
  category: string
  published: boolean
  views: number
  date: string
}

const DEMO_ARTICLES: Article[] = [
  {
    id: "1",
    title: "Getting Started with MERN Stack",
    category: "Tutorial",
    published: true,
    views: 2341,
    date: "2024-12-15",
  },
  {
    id: "2",
    title: "MongoDB Best Practices",
    category: "Guide",
    published: true,
    views: 1823,
    date: "2024-12-14",
  },
  {
    id: "3",
    title: "React Performance Optimization",
    category: "Tutorial",
    published: true,
    views: 3124,
    date: "2024-12-13",
  },
  {
    id: "4",
    title: "Draft: Node.js Security",
    category: "Guide",
    published: false,
    views: 0,
    date: "2024-12-12",
  },
]

export default function CMSDemo() {
  const [articles, setArticles] = useState<Article[]>(DEMO_ARTICLES)
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({ title: "", category: "Tutorial" })

  const publishedCount = articles.filter(a => a.published).length
  const totalViews = articles.reduce((sum, a) => sum + a.views, 0)

  const handleAddArticle = () => {
    if (!formData.title.trim()) return
    const newArticle: Article = {
      id: String(Date.now()),
      title: formData.title,
      category: formData.category,
      published: false,
      views: 0,
      date: new Date().toISOString().split('T')[0],
    }
    setArticles([newArticle, ...articles])
    setFormData({ title: "", category: "Tutorial" })
    setShowForm(false)
  }

  const togglePublish = (id: string) => {
    setArticles(articles.map(a =>
      a.id === id ? { ...a, published: !a.published } : a
    ))
  }

  const deleteArticle = (id: string) => {
    setArticles(articles.filter(a => a.id !== id))
  }

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-secondary/50 p-4 rounded-lg">
          <div className="text-2xl font-bold">{articles.length}</div>
          <div className="text-xs text-muted-foreground">Total Articles</div>
        </div>
        <div className="bg-secondary/50 p-4 rounded-lg">
          <div className="text-2xl font-bold">{publishedCount}</div>
          <div className="text-xs text-muted-foreground">Published</div>
        </div>
        <div className="bg-secondary/50 p-4 rounded-lg">
          <div className="text-2xl font-bold">{totalViews.toLocaleString()}</div>
          <div className="text-xs text-muted-foreground">Total Views</div>
        </div>
      </div>

      {/* Create Article */}
      <div>
        {!showForm ? (
          <Button onClick={() => setShowForm(true)} className="gap-2" data-testid="button-create-article">
            <Plus className="w-4 h-4" /> Create Article
          </Button>
        ) : (
          <div className="bg-card border border-border rounded-lg p-6 space-y-4">
            <input
              type="text"
              placeholder="Article title..."
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-4 py-2 border border-border rounded-lg bg-secondary/50 focus:outline-none focus:border-primary"
              data-testid="input-article-title"
            />
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="w-full px-4 py-2 border border-border rounded-lg bg-secondary/50 focus:outline-none focus:border-primary"
              data-testid="select-category"
            >
              <option>Tutorial</option>
              <option>Guide</option>
              <option>News</option>
              <option>Case Study</option>
            </select>
            <div className="flex gap-2">
              <Button onClick={handleAddArticle} data-testid="button-save-article">Create</Button>
              <Button variant="outline" onClick={() => setShowForm(false)}>Cancel</Button>
            </div>
          </div>
        )}
      </div>

      {/* Articles Table */}
      <div className="border border-border rounded-lg overflow-hidden">
        <div className="bg-secondary/50 p-4 border-b border-border">
          <div className="grid grid-cols-12 gap-4 text-sm font-bold">
            <div className="col-span-5">Title</div>
            <div className="col-span-2">Category</div>
            <div className="col-span-2">Views</div>
            <div className="col-span-3">Actions</div>
          </div>
        </div>
        <div className="divide-y divide-border">
          {articles.map((article) => (
            <div
              key={article.id}
              className="p-4 hover:bg-secondary/30 transition-colors"
              data-testid={`article-${article.id}`}
            >
              <div className="grid grid-cols-12 gap-4 items-center">
                <div className="col-span-5">
                  <p className="font-medium text-sm">{article.title}</p>
                  <p className="text-xs text-muted-foreground">{article.date}</p>
                </div>
                <div className="col-span-2">
                  <span className="text-xs px-2 py-1 bg-primary/10 text-primary rounded">
                    {article.category}
                  </span>
                </div>
                <div className="col-span-2 text-sm text-muted-foreground">
                  {article.views.toLocaleString()}
                </div>
                <div className="col-span-3 flex gap-1">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => togglePublish(article.id)}
                    data-testid={`button-toggle-publish-${article.id}`}
                  >
                    {article.published ? (
                      <Eye className="w-4 h-4" />
                    ) : (
                      <EyeOff className="w-4 h-4" />
                    )}
                  </Button>
                  <Button size="sm" variant="ghost" data-testid={`button-edit-${article.id}`}>
                    <Edit2 className="w-4 h-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => deleteArticle(article.id)}
                    data-testid={`button-delete-${article.id}`}
                  >
                    <Trash2 className="w-4 h-4 text-destructive" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
