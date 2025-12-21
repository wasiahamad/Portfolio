import { Switch, Route, Redirect } from 'wouter'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Toaster } from 'sonner'
import AdminLogin from './pages/AdminLogin'
import AdminDashboard from './pages/AdminDashboard'
import ProjectsPage from './pages/ProjectsPage'
import BlogsPage from './pages/BlogsPage'
import ExperiencePage from './pages/ExperiencePage'
import ContactsPage from './pages/ContactsPage'
import ProfilePage from './pages/ProfilePage'
import { useState, useEffect } from 'react'
import axios from 'axios'

// Setup axios interceptor to include token in all requests
axios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

const queryClient = new QueryClient()

function ProtectedRoute({ component: Component, ...rest }) {
  const [isAuth, setIsAuth] = useState(null)

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (token) {
      setIsAuth(true)
    } else {
      setIsAuth(false)
    }
  }, [])

  if (isAuth === null) return <div className="min-h-screen flex items-center justify-center">Loading...</div>
  if (!isAuth) return <Redirect to="/login" />
  return <Component {...rest} />
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Switch>
        <Route path="/login" component={AdminLogin} />
        <Route path="/dashboard">
          {() => <ProtectedRoute component={AdminDashboard} />}
        </Route>
        <Route path="/projects">
          {() => <ProtectedRoute component={ProjectsPage} />}
        </Route>
        <Route path="/blogs">
          {() => <ProtectedRoute component={BlogsPage} />}
        </Route>
        <Route path="/experience">
          {() => <ProtectedRoute component={ExperiencePage} />}
        </Route>
        <Route path="/contacts">
          {() => <ProtectedRoute component={ContactsPage} />}
        </Route>
        <Route path="/profile">
          {() => <ProtectedRoute component={ProfilePage} />}
        </Route>
        <Route path="/">
          <Redirect to="/dashboard" />
        </Route>
      </Switch>
      <Toaster />
    </QueryClientProvider>
  )
}

export default App
