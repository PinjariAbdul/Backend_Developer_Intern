import { useState, useEffect, useRef } from 'react'
import axios from 'axios'
import { fadeIn, slideInFromBottom, slideInFromLeft } from './animations'
import './App.css'

// Set base URL for axios
axios.defaults.baseURL = 'http://localhost:8000/api/v1'
axios.defaults.withCredentials = true

function App() {
  const [currentPage, setCurrentPage] = useState('home')
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(false)
  const pageRef = useRef(null)

  // Check for existing user session on app load
  useEffect(() => {
    const storedUser = localStorage.getItem('user')
    const storedToken = localStorage.getItem('authToken')
    
    if (storedUser && storedToken) {
      try {
        const userData = JSON.parse(storedUser)
        setUser(userData)
      } catch (e) {
        console.error('Error parsing stored user data:', e)
        localStorage.removeItem('user')
        localStorage.removeItem('authToken')
      }
    }
  }, [])

  useEffect(() => {
    if (pageRef.current) {
      fadeIn(pageRef.current, 400)
    }
  }, [currentPage])

  // Create shape elements for background animation
  const shapes = Array.from({ length: 4 }, (_, i) => (
    <div key={i} className="shape"></div>
  ))

  return (
    <div className="App">
      <div className="shapes">
        {shapes}
      </div>
      
      <header>
        <h1>TaskFlow Pro</h1>
        <nav>
          <button onClick={() => setCurrentPage('home')}>Home</button>
          {!user ? (
            <>
              <button onClick={() => setCurrentPage('register')}>Register</button>
              <button onClick={() => setCurrentPage('login')}>Login</button>
            </>
          ) : (
            <>
              <button onClick={() => setCurrentPage('dashboard')}>Dashboard</button>
              <button onClick={() => { 
                localStorage.removeItem('user')
                localStorage.removeItem('authToken')
                setUser(null)
                setCurrentPage('home')
              }}>
                Logout
              </button>
            </>
          )}
        </nav>
      </header>
      
      <main ref={pageRef}>
        <div className="content-wrapper">
          {currentPage === 'home' && <Home setCurrentPage={setCurrentPage} />}
          {currentPage === 'register' && <Register setUser={setUser} setCurrentPage={setCurrentPage} loading={loading} setLoading={setLoading} />}
          {currentPage === 'login' && <Login setUser={setUser} setCurrentPage={setCurrentPage} loading={loading} setLoading={setLoading} />}
          {currentPage === 'dashboard' && user && <Dashboard user={user} setUser={setUser} setCurrentPage={setCurrentPage} loading={loading} setLoading={setLoading} />}
        </div>
      </main>
    </div>
  )
}

function Home({ setCurrentPage }) {
  const featureRef = useRef(null)

  useEffect(() => {
    if (featureRef.current) {
      slideInFromBottom(featureRef.current, 600)
    }
  }, [])

  return (
    <div className="card">
      <h2>Welcome to TaskFlow Pro</h2>
      <p>Experience the next generation of task management with our sleek dark theme interface and powerful features.</p>
      
      <div className="features" ref={featureRef}>
        <div className="feature">
          <h3>🔒 Secure Authentication</h3>
          <p>Enterprise-grade security with JWT token authentication</p>
        </div>
        <div className="feature">
          <h3>👥 Role-Based Access</h3>
          <p>Distinct permissions for users and administrators</p>
        </div>
        <div className="feature">
          <h3>⚡ Real-time Updates</h3>
          <p>Instant synchronization across all your devices</p>
        </div>
      </div>
      
      <div className="flex-center">
        <button onClick={() => setCurrentPage('register')}>
          Get Started
        </button>
        <button className="secondary" onClick={() => setCurrentPage('login')}>
          Sign In
        </button>
      </div>
    </div>
  )
}

function Register({ setUser, setCurrentPage, loading, setLoading }) {
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState('')
  const [isSuccess, setIsSuccess] = useState(false)
  const formRef = useRef(null)

  useEffect(() => {
    if (formRef.current) {
      slideInFromLeft(formRef.current, 500)
    }
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setMessage('')
    
    try {
      const response = await axios.post('/users/register/', { username, email, password })
      console.log('Register response:', response.data)
      
      // Store user data and token
      localStorage.setItem('user', JSON.stringify(response.data.user))
      localStorage.setItem('authToken', response.data.token)
      
      setUser(response.data.user)
      setIsSuccess(true)
      setMessage('Registration successful! Redirecting to dashboard...')
      setTimeout(() => setCurrentPage('dashboard'), 1500)
    } catch (err) {
      setIsSuccess(false)
      console.error('Register error:', err)
      if (err.response) {
        // Server responded with error status
        if (err.response.data) {
          setMessage(Object.values(err.response.data).join(', ') || 'Registration failed. Please check your inputs.')
        } else {
          setMessage('Server error. Please try again later.')
        }
      } else if (err.request) {
        // Request was made but no response received
        setMessage('Network error. Please check your connection.')
      } else {
        // Something else happened
        setMessage('An unexpected error occurred. Please try again.')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="card">
      <h2>Create Account</h2>
      {message && (
        <div className={isSuccess ? 'success-message' : 'error-message'}>
          {message}
        </div>
      )}
      <form onSubmit={handleSubmit} ref={formRef}>
        <div>
          <label>Username</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            placeholder="Enter your username"
          />
        </div>
        <div>
          <label>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="Enter your email"
          />
        </div>
        <div>
          <label>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            placeholder="Enter your password"
            minLength="6"
          />
        </div>
        <button type="submit" disabled={loading}>
          {loading ? <span className="loading"></span> : 'Create Account'}
        </button>
      </form>
      <div className="flex-center">
        <button className="secondary" onClick={() => setCurrentPage('login')}>
          Already have an account? Sign In
        </button>
      </div>
    </div>
  )
}

function Login({ setUser, setCurrentPage, loading, setLoading }) {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState('')
  const [isSuccess, setIsSuccess] = useState(false)
  const formRef = useRef(null)

  useEffect(() => {
    if (formRef.current) {
      slideInFromLeft(formRef.current, 500)
    }
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setMessage('')
    
    try {
      const response = await axios.post('/users/login/', { username, password })
      console.log('Login response:', response.data)
      
      // Store user data and token
      localStorage.setItem('user', JSON.stringify(response.data.user))
      localStorage.setItem('authToken', response.data.token)
      
      setUser(response.data.user)
      setIsSuccess(true)
      setMessage('Login successful! Redirecting to dashboard...')
      setTimeout(() => setCurrentPage('dashboard'), 1500)
    } catch (err) {
      setIsSuccess(false)
      console.error('Login error:', err)
      if (err.response) {
        // Server responded with error status
        if (err.response.data && err.response.data.error) {
          setMessage(err.response.data.error)
        } else if (err.response.data) {
          setMessage(Object.values(err.response.data).join(', ') || 'Login failed. Please check your credentials.')
        } else {
          setMessage('Server error. Please try again later.')
        }
      } else if (err.request) {
        // Request was made but no response received
        setMessage('Network error. Please check your connection.')
      } else {
        // Something else happened
        setMessage('An unexpected error occurred. Please try again.')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="card">
      <h2>Sign In</h2>
      {message && (
        <div className={isSuccess ? 'success-message' : 'error-message'}>
          {message}
        </div>
      )}
      <form onSubmit={handleSubmit} ref={formRef}>
        <div>
          <label>Username</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            placeholder="Enter your username"
          />
        </div>
        <div>
          <label>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            placeholder="Enter your password"
          />
        </div>
        <button type="submit" disabled={loading}>
          {loading ? <span className="loading"></span> : 'Sign In'}
        </button>
      </form>
      <div className="flex-center">
        <button className="secondary" onClick={() => setCurrentPage('register')}>
          Don't have an account? Sign Up
        </button>
      </div>
    </div>
  )
}

function Dashboard({ user, setUser, setCurrentPage, loading, setLoading }) {
  const [tasks, setTasks] = useState([])
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [message, setMessage] = useState('')
  const [isSuccess, setIsSuccess] = useState(false)
  const [editingTask, setEditingTask] = useState(null)
  const [editTitle, setEditTitle] = useState('')
  const [editDescription, setEditDescription] = useState('')
  const taskListRef = useRef(null)
  const messageTimeoutRef = useRef(null) // For clearing message timeout

  useEffect(() => {
    fetchTasks()
  }, [])

  useEffect(() => {
    if (taskListRef.current) {
      fadeIn(taskListRef.current, 400)
    }
  }, [tasks])

  // Clear message after 3 seconds
  useEffect(() => {
    if (message) {
      if (messageTimeoutRef.current) {
        clearTimeout(messageTimeoutRef.current)
      }
      messageTimeoutRef.current = setTimeout(() => {
        setMessage('')
        messageTimeoutRef.current = null
      }, 3000)
    }
    
    // Cleanup timeout on unmount
    return () => {
      if (messageTimeoutRef.current) {
        clearTimeout(messageTimeoutRef.current)
      }
    }
  }, [message])

  const fetchTasks = async () => {
    setLoading(true)
    try {
      // Get token from localStorage
      const token = localStorage.getItem('authToken')
      const response = await axios.get('/tasks/', {
        headers: {
          'Authorization': `Token ${token}`
        }
      })
      console.log('Tasks response:', response.data)
      setTasks(response.data)
    } catch (err) {
      console.error('Fetch tasks error:', err)
      if (err.response && err.response.status === 401) {
        setMessage('Session expired. Please log in again.')
        setIsSuccess(false)
        // Clear stored user data
        localStorage.removeItem('user')
        localStorage.removeItem('authToken')
        setUser(null)
        setCurrentPage('login')
      } else {
        setMessage('Failed to fetch tasks. Please try again.')
        setIsSuccess(false)
      }
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setMessage('')
    
    try {
      // Get token from localStorage
      const token = localStorage.getItem('authToken')
      const response = await axios.post('/tasks/', { title, description }, {
        headers: {
          'Authorization': `Token ${token}`
        }
      })
      console.log('Create task response:', response.data)
      setTasks([...tasks, response.data])
      setTitle('')
      setDescription('')
      setIsSuccess(true)
      setMessage('Task created successfully!')
    } catch (err) {
      console.error('Create task error:', err)
      setIsSuccess(false)
      if (err.response) {
        if (err.response.status === 401) {
          setMessage('Session expired. Please log in again.')
          // Clear stored user data
          localStorage.removeItem('user')
          localStorage.removeItem('authToken')
          setUser(null)
          setCurrentPage('login')
        } else if (err.response.data) {
          setMessage(Object.values(err.response.data).join(', ') || 'Failed to create task.')
        } else {
          setMessage('Server error. Please try again later.')
        }
      } else if (err.request) {
        setMessage('Network error. Please check your connection.')
      } else {
        setMessage('An unexpected error occurred. Please try again.')
      }
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (taskId) => {
    setLoading(true)
    try {
      // Get token from localStorage
      const token = localStorage.getItem('authToken')
      await axios.delete(`/tasks/${taskId}/`, {
        headers: {
          'Authorization': `Token ${token}`
        }
      })
      setTasks(tasks.filter(task => task.id !== taskId))
      setIsSuccess(true)
      setMessage('Task deleted successfully!')
    } catch (err) {
      console.error('Delete task error:', err)
      setIsSuccess(false)
      if (err.response && err.response.status === 401) {
        setMessage('Session expired. Please log in again.')
        // Clear stored user data
        localStorage.removeItem('user')
        localStorage.removeItem('authToken')
        setUser(null)
        setCurrentPage('login')
      } else {
        setMessage('Failed to delete task. Please try again.')
      }
    } finally {
      setLoading(false)
    }
  }

  const handleToggleComplete = async (taskId, currentStatus) => {
    // Immediately update UI for better user experience
    const newStatus = !currentStatus;
    setTasks(prevTasks => 
      prevTasks.map(task => 
        task.id === taskId ? { ...task, is_completed: newStatus } : task
      )
    );
    
    setLoading(true);
    try {
      // Get token from localStorage
      const token = localStorage.getItem('authToken');
      
      // Use PATCH with proper data structure
      const response = await axios.patch(`/tasks/${taskId}/`, 
        { is_completed: newStatus },
        {
          headers: {
            'Authorization': `Token ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      console.log('Update task response:', response.data);
      
      // Update the task in the state with server response (in case it differs)
      setTasks(prevTasks => 
        prevTasks.map(task => 
          task.id === taskId ? { ...task, is_completed: response.data.is_completed } : task
        )
      );
      
      setIsSuccess(true);
      setMessage(`Task marked as ${response.data.is_completed ? 'completed' : 'incomplete'}!`);
    } catch (err) {
      // Revert UI change if API call fails
      setTasks(prevTasks => 
        prevTasks.map(task => 
          task.id === taskId ? { ...task, is_completed: currentStatus } : task
        )
      );
      
      console.error('Update task error:', err);
      setIsSuccess(false);
      
      // More detailed error handling
      let errorMessage = 'Failed to update task. Please try again.';
      if (err.response) {
        if (err.response.status === 401) {
          errorMessage = 'Session expired. Please log in again.';
          // Clear stored user data
          localStorage.removeItem('user');
          localStorage.removeItem('authToken');
          setUser(null);
          setCurrentPage('login');
        } else if (err.response.status === 403) {
          errorMessage = 'Permission denied. You cannot update this task.';
        } else if (err.response.status === 404) {
          errorMessage = 'Task not found.';
        } else if (err.response.data) {
          errorMessage = Object.values(err.response.data).join(', ') || 'Failed to update task.';
        }
      } else if (err.request) {
        errorMessage = 'Network error. Please check your connection.';
      }
      
      setMessage(errorMessage);
    } finally {
      setLoading(false);
    }
  }

  // Function to start editing a task
  const startEditing = (task) => {
    setEditingTask(task.id)
    setEditTitle(task.title)
    setEditDescription(task.description)
  }

  // Function to cancel editing
  const cancelEditing = () => {
    setEditingTask(null)
    setEditTitle('')
    setEditDescription('')
  }

  // Function to save edited task
  const saveEdit = async (taskId) => {
    setLoading(true)
    try {
      // Get token from localStorage
      const token = localStorage.getItem('authToken')
      const response = await axios.put(`/tasks/${taskId}/`, 
        { title: editTitle, description: editDescription },
        {
          headers: {
            'Authorization': `Token ${token}`
          }
        }
      )
      
      // Update the task in the state
      setTasks(tasks.map(task => 
        task.id === taskId ? { ...task, title: response.data.title, description: response.data.description } : task
      ))
      
      setIsSuccess(true)
      setMessage('Task updated successfully!')
      setEditingTask(null)
      setEditTitle('')
      setEditDescription('')
    } catch (err) {
      console.error('Update task error:', err)
      setIsSuccess(false)
      if (err.response && err.response.status === 401) {
        setMessage('Session expired. Please log in again.')
        // Clear stored user data
        localStorage.removeItem('user')
        localStorage.removeItem('authToken')
        setUser(null)
        setCurrentPage('login')
      } else {
        setMessage('Failed to update task. Please try again.')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="card">
      <div className="flex-space">
        <h2>Dashboard</h2>
        <button className="secondary" onClick={() => { 
          localStorage.removeItem('user')
          localStorage.removeItem('authToken')
          setUser(null)
          setCurrentPage('home')
        }}>
          Logout
        </button>
      </div>
      
      <div style={{ marginBottom: '1.5rem' }}>
        <p>Welcome back, <strong>{user.username}</strong>!</p>
        <p>Role: <strong>{user.role}</strong></p>
      </div>
      
      {message && (
        <div className={isSuccess ? 'success-message' : 'error-message'}>
          {message}
        </div>
      )}
      
      <h3>Create New Task</h3>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Task Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            placeholder="Enter task title"
          />
        </div>
        <div>
          <label>Task Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            rows="4"
            placeholder="Enter task description"
          />
        </div>
        <button type="submit" disabled={loading}>
          {loading ? <span className="loading"></span> : 'Create Task'}
        </button>
      </form>
      
      <h3 style={{ marginTop: '2rem' }}>Your Tasks {loading && <span className="loading"></span>}</h3>
      <div ref={taskListRef}>
        {tasks.length === 0 ? (
          <p style={{textAlign: 'center', color: 'var(--text-secondary)', fontSize: '1.1rem'}}>No tasks found. Create your first task above!</p>
        ) : (
          tasks.map((task) => (
            <div key={task.id} className={`task ${task.is_completed ? 'completed' : ''}`}>
              {editingTask === task.id ? (
                // Edit form
                <div>
                  <div>
                    <input
                      type="text"
                      value={editTitle}
                      onChange={(e) => setEditTitle(e.target.value)}
                      required
                      placeholder="Task title"
                      style={{ marginBottom: '1rem', width: '100%' }}
                    />
                  </div>
                  <div>
                    <textarea
                      value={editDescription}
                      onChange={(e) => setEditDescription(e.target.value)}
                      required
                      rows="3"
                      placeholder="Task description"
                      style={{ marginBottom: '1rem', width: '100%' }}
                    />
                  </div>
                  <div className="task-actions">
                    <button 
                      className="complete-btn"
                      onClick={() => saveEdit(task.id)}
                      disabled={loading}
                    >
                      {loading ? <span className="loading"></span> : 'Save'}
                    </button>
                    <button 
                      className="secondary"
                      onClick={cancelEditing}
                      disabled={loading}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                // View mode
                <div>
                  <h4>{task.title}</h4>
                  <p>{task.description}</p>
                  <div className="date">
                    Created: {new Date(task.created_at).toLocaleString()}
                    {task.is_completed && <span style={{marginLeft: '10px', color: 'var(--success)'}}>✓ Completed</span>}
                  </div>
                  <div className="task-actions">
                    <button 
                      className="complete-btn"
                      onClick={() => handleToggleComplete(task.id, task.is_completed)}
                    >
                      {task.is_completed ? 'Mark Incomplete' : 'Mark Complete'}
                    </button>
                    <button 
                      className="secondary"
                      onClick={() => startEditing(task)}
                    >
                      Edit
                    </button>
                    <button 
                      className="delete-btn"
                      onClick={() => handleDelete(task.id)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  )
}

export default App