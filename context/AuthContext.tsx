"use client"

import { createContext, useContext, useState, useEffect } from "react"

const AuthContext = createContext({
  user: null,
  setUser: (_: any) => {},
  loading: true,
  logout: () => {},
})

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  // Universal user fetcher (calls your backend /api/auth/me)
  useEffect(() => {
    async function fetchUser() {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/api/user/me`, {
          credentials: "include",
        })
        if (!res.ok) throw new Error()
        const data = await res.json()
        setUser(data.user)
      } catch {
        setUser(null)
      } finally {
        setLoading(false)
      }
    }
    fetchUser()
  }, [])

  // Logout function
  const logout = async () => {
    await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/api/user/logout`, {
      method: "POST",
      credentials: "include",
    })
    setUser(null)
    window.location.href = "/auth"
  }

  return (
    <AuthContext.Provider value={{ user, setUser, loading, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}