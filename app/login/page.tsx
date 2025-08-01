"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Building, LogIn } from "lucide-react"
import { getUsers, setCurrentUser, initializeLocalStorage } from "@/lib/userData"
import Link from "next/link"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  // Initialize localStorage on component mount
  useState(() => {
    initializeLocalStorage()
  })

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      const users = getUsers()
      const user = users.find((u) => u.email === email && u.password === password)

      if (user) {
        setCurrentUser(user)
        router.push("/dashboard")
      } else {
        setError("Invalid email or password")
      }
    } catch (err) {
      setError("An error occurred during login")
    } finally {
      setIsLoading(false)
    }
  }

  const demoUsers = [
    { role: "Architect", email: "sarah.architect@designstudio.com", password: "architect123" },
    { role: "Contractor", email: "john.builder@buildright.com", password: "contractor123" },
    { role: "Client", email: "david.developer@greenfield.com", password: "client123" },
    { role: "ERP Admin", email: "admin@constructpro.com", password: "admin123" },
    { role: "Project Manager", email: "jennifer.pm@constructpro.com", password: "manager123" },
  ]

  const quickLogin = (email: string, password: string) => {
    setEmail(email)
    setPassword(password)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center space-x-2 text-2xl font-bold text-gray-900 mb-4">
            <Building className="h-8 w-8 text-blue-600" />
            <span>ConstructPro AI</span>
          </Link>
          <p className="text-gray-600">Sign in to your construction management dashboard</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Login Form */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <LogIn className="h-5 w-5" />
                <span>Sign In</span>
              </CardTitle>
              <CardDescription>Enter your credentials to access your dashboard</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    required
                  />
                </div>
                {error && (
                  <Alert variant="destructive">
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}
                <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700" disabled={isLoading}>
                  {isLoading ? "Signing in..." : "Sign In"}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Demo Users */}
          <Card>
            <CardHeader>
              <CardTitle>Demo Users</CardTitle>
              <CardDescription>Click any user below to quickly sign in and explore their dashboard</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {demoUsers.map((user, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                    onClick={() => quickLogin(user.email, user.password)}
                  >
                    <div>
                      <div className="font-medium text-gray-900">{user.role}</div>
                      <div className="text-sm text-gray-500">{user.email}</div>
                    </div>
                    <Button variant="outline" size="sm">
                      Quick Login
                    </Button>
                  </div>
                ))}
              </div>
              <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                <p className="text-sm text-blue-800">
                  <strong>Demo Mode:</strong> All data is simulated for demonstration purposes. Each role provides a
                  different view of the construction management workflow.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
