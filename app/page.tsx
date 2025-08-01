"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Building, Users, Zap, TrendingUp } from "lucide-react"
import Link from "next/link"

export default function LandingPage() {
  const [stats, setStats] = useState({
    projects: 0,
    users: 0,
    aiAnalyses: 0,
    savings: 0,
  })

  useEffect(() => {
    // Animate stats on load
    const timer = setTimeout(() => {
      setStats({
        projects: 150,
        users: 45,
        aiAnalyses: 230,
        savings: 2.4,
      })
    }, 500)

    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <Building className="h-8 w-8 text-blue-600" />
              <h1 className="text-2xl font-bold text-gray-900">ConstructPro AI</h1>
            </div>
            <Link href="/login">
              <Button className="bg-blue-600 hover:bg-blue-700">Get Started</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-4xl mx-auto">
            <Badge className="mb-4 bg-blue-100 text-blue-800 hover:bg-blue-100">
              AI-Powered Construction Management
            </Badge>
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
              Transform Construction
              <span className="text-blue-600"> with AI</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              Streamline your construction workflow from design to completion with AI-powered material analysis,
              automated quotes, and integrated ERP systems.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/login">
                <Button size="lg" className="bg-blue-600 hover:bg-blue-700 px-8">
                  Start Free Trial
                </Button>
              </Link>
              <Button size="lg" variant="outline" className="px-8 bg-transparent">
                Watch Demo
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-blue-600 mb-2">{stats.projects}+</div>
              <div className="text-gray-600">Projects Completed</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-green-600 mb-2">{stats.users}+</div>
              <div className="text-gray-600">Active Users</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-purple-600 mb-2">{stats.aiAnalyses}+</div>
              <div className="text-gray-600">AI Analyses</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-orange-600 mb-2">${stats.savings}M+</div>
              <div className="text-gray-600">Cost Savings</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Complete Construction Workflow</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              From initial design to final delivery, our platform handles every step of your construction project.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="border-2 hover:border-blue-200 transition-colors">
              <CardHeader>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                  <Zap className="h-6 w-6 text-blue-600" />
                </div>
                <CardTitle>AI Material Analysis</CardTitle>
                <CardDescription>
                  Upload construction drawings and get instant AI-powered material extraction and cost estimation.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>• Automatic material identification</li>
                  <li>• Quantity calculations</li>
                  <li>• Cost estimation</li>
                  <li>• 90%+ accuracy rate</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-2 hover:border-green-200 transition-colors">
              <CardHeader>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                  <Users className="h-6 w-6 text-green-600" />
                </div>
                <CardTitle>Collaborative Workflow</CardTitle>
                <CardDescription>
                  Seamless collaboration between architects, contractors, and clients with role-based access.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>• Real-time collaboration</li>
                  <li>• Role-based permissions</li>
                  <li>• Approval workflows</li>
                  <li>• Progress tracking</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-2 hover:border-purple-200 transition-colors">
              <CardHeader>
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                  <TrendingUp className="h-6 w-6 text-purple-600" />
                </div>
                <CardTitle>ERP Integration</CardTitle>
                <CardDescription>
                  Complete project lifecycle management with integrated sales, invoicing, and tracking systems.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>• Automated invoicing</li>
                  <li>• Payment tracking</li>
                  <li>• Shipment monitoring</li>
                  <li>• Financial reporting</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-blue-600">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Ready to Transform Your Construction Process?
            </h2>
            <p className="text-xl text-blue-100 mb-8">
              Join hundreds of construction professionals who are already saving time and money with ConstructPro AI.
            </p>
            <Link href="/login">
              <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100 px-8">
                Get Started Today
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <Building className="h-6 w-6 text-blue-400" />
              <span className="text-xl font-bold text-white">ConstructPro AI</span>
            </div>
            <div className="text-gray-400 text-sm">© 2024 ConstructPro AI. All rights reserved.</div>
          </div>
        </div>
      </footer>
    </div>
  )
}
