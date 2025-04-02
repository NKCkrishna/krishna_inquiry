import { createContext, useContext, useState, useEffect } from "react"


const AuthContext = createContext()


export function useAuth() {
  return useContext(AuthContext)
}


export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null)
  const [loading, setLoading] = useState(true)


  useEffect(() => {
    const storedUser = localStorage.getItem("user")
    if (storedUser) {
      setCurrentUser(JSON.parse(storedUser))
    }
    setLoading(false)
  }, [])

  async function login(email, password) {
    const DUMMY_EMAIL = "test@example.com"
    const DUMMY_PASSWORD = "Test123!"
    
    if (email === DUMMY_EMAIL && password === DUMMY_PASSWORD) {
      const dummyUser = { 
        email, 
        name: "Test User", 
        role: "user" 
      }
      
      localStorage.setItem("user", JSON.stringify(dummyUser))
      setCurrentUser(dummyUser)
      return dummyUser
    }
    
    if (email === "admin@example.com" && password === "Admin123!") {
      const adminUser = { 
        email, 
        name: "Admin User", 
        role: "admin" 
      }
      
      localStorage.setItem("user", JSON.stringify(adminUser))
      setCurrentUser(adminUser)
      return adminUser
    }
    
    throw new Error("Invalid email or password")
  }

  function logout() {
    localStorage.removeItem("user")
    setCurrentUser(null)
  }

  async function register(email, password, name) {
    const newUser = {
      email,
      name,
      role: "user"
    }
    
    localStorage.setItem("user", JSON.stringify(newUser))
    setCurrentUser(newUser)
    return newUser
  }

  const value = {
    currentUser,
    login,
    logout,
    register,
    loading
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}