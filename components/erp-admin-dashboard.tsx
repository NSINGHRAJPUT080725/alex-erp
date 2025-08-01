"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Eye, Database, DollarSign, TrendingUp, BarChart3 } from "lucide-react"
import { getProjects, type Project } from "@/lib/userData"

export function ERPAdminDashboard() {
  const [projects, setProjects] = useState<Project[]>([])

  useEffect(() => {
    loadProjects()
  }, [])

  const loadProjects = () => {
    const allProjects = getProjects()
    setProjects(allProjects)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "contractor-review":
        return "bg-yellow-100 text-yellow-800"
      case "client-review":
        return "bg-blue-100 text-blue-800"
      case "approved":
        return "bg-green-100 text-green-800"
      case "in-progress":
        return "bg-purple-100 text-purple-800"
      case "completed":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const approvedProjects = projects.filter((p) => p.status === "approved")
  const totalSales = projects.reduce((sum, p) => sum + (p.erpResponse?.totals?.grand_total || 0), 0)
  const avgOrderValue = approvedProjects.length > 0 ? totalSales / approvedProjects.length : 0

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">ERP Admin Dashboard</h1>
          <p className="text-gray-600">Monitor sales data and system integration</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Sales</CardTitle>
            <DollarSign className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">${totalSales.toLocaleString()}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Approved Orders</CardTitle>
            <BarChart3 className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{approvedProjects.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg. Order Value</CardTitle>
            <TrendingUp className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">${Math.round(avgOrderValue).toLocaleString()}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active POs</CardTitle>
            <Database className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{approvedProjects.length}</div>
          </CardContent>
        </Card>
      </div>

      {/* Sales Data Table */}
      <Card>
        <CardHeader>
          <CardTitle>Sales Data & ERP Integration</CardTitle>
          <CardDescription>Monitor approved projects and financial data</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Project Name</TableHead>
                  <TableHead>PO Number</TableHead>
                  <TableHead>Grand Total</TableHead>
                  <TableHead>Materials</TableHead>
                  <TableHead>Labor</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {projects.map((project) => (
                  <TableRow key={project.id}>
                    <TableCell className="font-medium">{project.name}</TableCell>
                    <TableCell className="font-mono">{project.erpResponse?.po_number || "-"}</TableCell>
                    <TableCell className="font-bold">
                      ${(project.erpResponse?.totals?.grand_total || 0).toLocaleString()}
                    </TableCell>
                    <TableCell>${(project.erpResponse?.totals?.materials || 0).toLocaleString()}</TableCell>
                    <TableCell>${(project.erpResponse?.totals?.labor || 0).toLocaleString()}</TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(project.status)}>{project.status.replace("-", " ")}</Badge>
                    </TableCell>
                    <TableCell>
                      <Button variant="outline" size="sm">
                        <Eye className="mr-1 h-4 w-4" />
                        View
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
