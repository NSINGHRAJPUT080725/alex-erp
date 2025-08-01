"use client"

import type React from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Building, LogOut, Settings, User } from "lucide-react"
import { logout, type User as UserType } from "@/lib/userData"

interface DashboardLayoutProps {
  children: React.ReactNode
  user: UserType
}

export function DashboardLayout({ children, user }: DashboardLayoutProps) {
  const router = useRouter()

  const handleLogout = () => {
    logout()
    router.push("/login")
  }

  const getRoleColor = (role: string) => {
    switch (role) {
      case "architect":
        return "text-blue-600"
      case "contractor":
        return "text-green-600"
      case "client":
        return "text-purple-600"
      case "project-manager":
        return "text-orange-600"
      case "erp-admin":
        return "text-red-600"
      default:
        return "text-gray-600"
    }
  }

  const getRoleLabel = (role: string) => {
    switch (role) {
      case "architect":
        return "Architect"
      case "contractor":
        return "Contractor"
      case "client":
        return "Client"
      case "project-manager":
        return "Project Manager"
      case "erp-admin":
        return "ERP Admin"
      default:
        return role
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <Building className="h-8 w-8 text-blue-600" />
              <div>
                <h1 className="text-xl font-semibold text-gray-900">ConstructPro AI</h1>
                <p className={`text-sm ${getRoleColor(user.role)} font-medium`}>{getRoleLabel(user.role)} Portal</p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">{user.name}</p>
                <p className="text-xs text-gray-500">{user.company}</p>
              </div>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.name} />
                      <AvatarFallback className={`${getRoleColor(user.role)} bg-gray-100`}>
                        {user.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">{user.name}</p>
                      <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <User className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Settings</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="py-8">
        <div className="px-4 sm:px-6 lg:px-8">{children}</div>
      </main>
    </div>
  )
}
