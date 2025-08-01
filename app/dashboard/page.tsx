"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { getCurrentUser, type User } from "@/lib/userData"
import { DashboardLayout } from "@/components/dashboard-layout"
import { ArchitectDashboard } from "@/components/architect-dashboard"
import { ContractorDashboard } from "@/components/contractor-dashboard"
import { ClientDashboard } from "@/components/client-dashboard"
import { ProjectManagerDashboard } from "@/components/project-manager-dashboard"
import { ERPAdminDashboard } from "@/components/erp-admin-dashboard"

export default function DashboardPage() {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const currentUser = getCurrentUser()
    if (!currentUser) {
      router.push("/login")
      return
    }
    setUser(currentUser)
    setIsLoading(false)
  }, [router])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  const renderDashboard = () => {
    switch (user.role) {
      case "architect":
        return <ArchitectDashboard />
      case "contractor":
        return <ContractorDashboard />
      case "client":
        return <ClientDashboard />
      case "project-manager":
        return <ProjectManagerDashboard />
      case "erp-admin":
        return <ERPAdminDashboard />
      default:
        return <div>Unknown user role</div>
    }
  }

  return <DashboardLayout user={user}>{renderDashboard()}</DashboardLayout>
}
