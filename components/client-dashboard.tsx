"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Label } from "@/components/ui/label";
import {
  CheckCircle,
  Clock,
  AlertCircle,
  Eye,
  DollarSign,
  TrendingUp,
  CreditCard,
  BarChart3,
  Download,
} from "lucide-react";
import { getProjects, saveProject, type Project } from "@/lib/userData";
import { useToast } from "@/hooks/use-toast";

export function ClientDashboard() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = () => {
    const allProjects = getProjects();
    // Clients can see all projects (they are the ultimate stakeholders)
    setProjects(allProjects);
  };

  const handleApproveProject = (project: Project) => {
    // Generate the exact ERP response format requested
    const erpResponse = {
      phase: "ERP Processing & Final Sale Listing",
      summary:
        "Client-approved materials list and quote auto-imported into ERP. PO and project schedule generated; invoices and shipment tracking included.",
      project: `${project.name} - Complete Reno`,
      approved_items: [
        {
          sku: "STONE_TRAV_2CM",
          desc: "White Wood Travertine 2cm slab",
          qty: 1.5,
          uom: "slab",
          area: "Master Suite",
          unit_price: 3600,
          amount: 5400,
        },
        {
          sku: "QZ_EMERALD_3CM",
          desc: "Emerald Green Quartzite 3cm slab",
          qty: 2.25,
          uom: "slab",
          area: "Kitchen",
          unit_price: 4800,
          amount: 10800,
        },
        {
          sku: "CABINET_BOX_42",
          desc: "Rehau Windswept Pine Cabinet Box",
          qty: 2,
          uom: "unit",
          area: "Master Suite",
          unit_price: 2200,
          amount: 4400,
        },
        {
          sku: "STONE_SINK_CUSTOM",
          desc: "Integral Stone Sink, Custom",
          qty: 3,
          uom: "each",
          area: "Multiple",
          unit_price: 1800,
          amount: 5400,
        },
        {
          sku: "QUARTZ_WHITE_2CM",
          desc: "Caesarstone White Quartz 2cm slab",
          qty: 1.0,
          uom: "slab",
          area: "Guest Bath",
          unit_price: 2800,
          amount: 2800,
        },
        {
          sku: "CABINET_SUNLIT_36",
          desc: "Rehau Sunlit Pine Cabinet Box 36in",
          qty: 1,
          uom: "unit",
          area: "Guest Bath",
          unit_price: 1900,
          amount: 1900,
        },
        {
          sku: "LIMESTONE_TILE_24X24",
          desc: "Reclaimed Limestone Tile 24x24in",
          qty: 850,
          uom: "sqft",
          area: "Living Room",
          unit_price: 12,
          amount: 10200,
        },
        {
          sku: "BRASS_STAIR_RAIL",
          desc: "Custom Brass Stair Railing",
          qty: 64,
          uom: "lf",
          area: "Living Room",
          unit_price: 85,
          amount: 5440,
        },
      ],
      totals: {
        materials: 164000,
        labor: 66500,
        install: 40500,
        shipping: 8500,
        tax: 18500,
        discounts: -10500,
        grand_total: 284000,
      },
      po_number: "WSR-2025-PO-3371",
      invoices: [
        {
          invoice_id: "INV-1001",
          stage: "Deposit",
          amount: 71000,
          due: "2025-08-20",
        },
        {
          invoice_id: "INV-1002",
          stage: "Fabrication",
          amount: 85200,
          due: "2025-09-20",
        },
        {
          invoice_id: "INV-1003",
          stage: "Delivery & Install",
          amount: 127800,
          due: "2025-10-05",
        },
      ],
      project_timeline: [
        { milestone: "PO Approval", date: "2025-08-01" },
        { milestone: "Shop Drawings Approved", date: "2025-08-15" },
        { milestone: "Fabrication Start", date: "2025-08-28" },
        { milestone: "Delivery and Install", date: "2025-10-15" },
        { milestone: "Project Walkthrough", date: "2025-11-15" },
      ],
      shipment_tracking: [
        {
          item: "Travertine Slab",
          carrier: "XYZ Trucking",
          status: "Scheduled",
          est_delivery: "2025-10-13",
        },
        {
          item: "Quartzite Slab",
          carrier: "ABC Freight",
          status: "In Transit",
          est_delivery: "2025-10-14",
        },
        {
          item: "Cabinet Hardware",
          carrier: "Local Delivery",
          status: "Pending",
          est_delivery: "2025-10-16",
        },
      ],
      client_actions: [
        "Download Final Quote (PDF)",
        "E-sign Contract",
        "Access Payment Portal",
        "Track Shipments",
        "View Project Schedule",
      ],
      message:
        "For demonstration: This is a massive client-ready ERP export for a full residential project, including everything required for purchase, workflow and ongoing tracking.",
    };

    const updatedProject = {
      ...project,
      status: "approved" as const,
      erpResponse,
      updatedAt: new Date().toISOString(),
    };

    saveProject(updatedProject);
    loadProjects();

    toast({
      title: "Project Approved",
      description: "Project has been approved and ERP processing initiated",
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "contractor-review":
        return "bg-yellow-100 text-yellow-800";
      case "client-review":
        return "bg-blue-100 text-blue-800";
      case "approved":
        return "bg-green-100 text-green-800";
      case "in-progress":
        return "bg-purple-100 text-purple-800";
      case "completed":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "approved":
        return <CheckCircle className="h-4 w-4" />;
      case "contractor-review":
      case "client-review":
        return <Clock className="h-4 w-4" />;
      default:
        return <AlertCircle className="h-4 w-4" />;
    }
  };

  const viewProjectDetails = (project: Project) => {
    setSelectedProject(project);
    setIsDetailsDialogOpen(true);
  };

  const openSaleListingInNewTab = (project: Project) => {
    if (!project.erpResponse) return;
    
    const salesOrderHtml = `
<!DOCTYPE html>
<html>
<head>
  <title>Sales Order - ${project.name}</title>
  <style>
    body { font-family: Arial, sans-serif; margin: 0; padding: 20px; font-size: 12px; }
    .header-section { display: flex; justify-content: space-between; margin-bottom: 20px; }
    .bill-to, .install-at { width: 48%; }
    .job-info { margin: 20px 0; padding: 10px; background: #f9f9f9; }
    .sales-info { display: flex; justify-content: space-between; margin: 20px 0; }
    .items-section { margin: 20px 0; }
    .item-group { margin: 15px 0; border: 1px solid #ddd; padding: 10px; }
    .item-header { font-weight: bold; background: #f5f5f5; padding: 5px; margin: -10px -10px 10px -10px; }
    .item-details { margin: 5px 0; }
    .item-line { display: flex; justify-content: space-between; margin: 2px 0; }
    .subtotal { text-align: right; font-weight: bold; margin: 10px 0; }
    .totals-section { margin: 30px 0; border-top: 2px solid #000; padding-top: 10px; }
    .total-line { display: flex; justify-content: space-between; margin: 3px 0; }
    .grand-total { font-weight: bold; font-size: 14px; border-top: 1px solid #000; padding-top: 5px; }
    .signature-section { margin-top: 40px; }
    .signature-line { border-bottom: 1px solid #000; width: 300px; margin: 20px 0 5px 0; }
    .terms { margin: 20px 0; font-size: 10px; }
    @media print { body { margin: 0; } }
  </style>
</head>
<body>
  <div class="header-section">
    <div class="bill-to">
      <strong>Bill To:</strong><br>
      Construction Portal Client<br>
      ${project.location}<br>
      E: client@constructionportal.com
    </div>
    <div class="install-at">
      <strong>Install At:</strong><br>
      ${project.name}<br>
      ${project.location}<br>
      P: (555) 123-4567<br>
      E: client@constructionportal.com
    </div>
  </div>
  
  <div class="job-info">
    <strong>Job Name:</strong> ${project.erpResponse.project}<br>
    <strong>PO Number:</strong> ${project.erpResponse.po_number}
  </div>
  
  <div class="sales-info">
    <div><strong>Sales Rep:</strong> Construction Portal</div>
    <div><strong>Terms:</strong> Standard Payment Terms</div>
    <div><strong>Prepared By:</strong> System</div>
  </div>
  
  <div class="items-section">
    ${project.erpResponse.approved_items.map((item, index) => `
      <div class="item-group">
        <div class="item-header">${item.area} - ${item.desc}</div>
        <div class="item-details">
          <div class="item-line">
            <span>SKU: ${item.sku}</span>
            <span>Quantity: ${item.qty} ${item.uom}</span>
          </div>
          <div class="item-line">
            <span>Unit Price: $${item.unit_price.toLocaleString()}</span>
            <span><strong>Extended: $${item.amount.toLocaleString()}</strong></span>
          </div>
        </div>
        <div class="subtotal">Subtotal: $${item.amount.toLocaleString()}</div>
      </div>
    `).join('')}
  </div>
  
  <div class="totals-section">
    <div class="total-line">Subtotal: <span>$${(project.erpResponse.totals.materials + project.erpResponse.totals.labor + project.erpResponse.totals.install).toLocaleString()}</span></div>
    <div class="total-line">Discount: <span>$${project.erpResponse.totals.discounts.toLocaleString()}</span></div>
    <div class="total-line">Tax: <span>$${project.erpResponse.totals.tax.toLocaleString()}</span></div>
    <div class="total-line grand-total">Total: <span>$${project.erpResponse.totals.grand_total.toLocaleString()}</span></div>
    <div class="total-line grand-total">Balance Due: <span>$${project.erpResponse.totals.grand_total.toLocaleString()}</span></div>
  </div>
  
  <div class="terms">
    <strong>Terms and Conditions:</strong><br>
    By signing this agreement you are agreeing to Construction Portal's terms of sale. All sales are final.
    Payment terms as specified in payment schedule. Materials and installation as described above.
  </div>
  
  <div class="signature-section">
    <div>Name: <div class="signature-line"></div></div>
    <div>Signature: <div class="signature-line"></div></div>
    <div>Date: <div class="signature-line"></div></div>
  </div>
</body>
</html>
    `;
    
    const newWindow = window.open('', '_blank');
    if (newWindow) {
      newWindow.document.write(salesOrderHtml);
      newWindow.document.close();
    }
  };

  const downloadSalesOrder = (project: Project) => {
    if (!project.erpResponse) return;
    
    const salesOrderHtml = `
<!DOCTYPE html>
<html>
<head>
  <title>Sales Order - ${project.name}</title>
  <style>
    body { font-family: Arial, sans-serif; margin: 0; padding: 20px; font-size: 12px; }
    .header-section { display: flex; justify-content: space-between; margin-bottom: 20px; }
    .bill-to, .install-at { width: 48%; }
    .job-info { margin: 20px 0; padding: 10px; background: #f9f9f9; }
    .sales-info { display: flex; justify-content: space-between; margin: 20px 0; }
    .items-section { margin: 20px 0; }
    .item-group { margin: 15px 0; border: 1px solid #ddd; padding: 10px; }
    .item-header { font-weight: bold; background: #f5f5f5; padding: 5px; margin: -10px -10px 10px -10px; }
    .item-details { margin: 5px 0; }
    .item-line { display: flex; justify-content: space-between; margin: 2px 0; }
    .subtotal { text-align: right; font-weight: bold; margin: 10px 0; }
    .totals-section { margin: 30px 0; border-top: 2px solid #000; padding-top: 10px; }
    .total-line { display: flex; justify-content: space-between; margin: 3px 0; }
    .grand-total { font-weight: bold; font-size: 14px; border-top: 1px solid #000; padding-top: 5px; }
    .signature-section { margin-top: 40px; }
    .signature-line { border-bottom: 1px solid #000; width: 300px; margin: 20px 0 5px 0; }
    .terms { margin: 20px 0; font-size: 10px; }
    @media print { body { margin: 0; } }
  </style>
</head>
<body>
  <div class="header-section">
    <div class="bill-to">
      <strong>Bill To:</strong><br>
      Construction Portal Client<br>
      ${project.location}<br>
      E: client@constructionportal.com
    </div>
    <div class="install-at">
      <strong>Install At:</strong><br>
      ${project.name}<br>
      ${project.location}<br>
      P: (555) 123-4567<br>
      E: client@constructionportal.com
    </div>
  </div>
  
  <div class="job-info">
    <strong>Job Name:</strong> ${project.erpResponse.project}<br>
    <strong>PO Number:</strong> ${project.erpResponse.po_number}
  </div>
  
  <div class="sales-info">
    <div><strong>Sales Rep:</strong> Construction Portal</div>
    <div><strong>Terms:</strong> Standard Payment Terms</div>
    <div><strong>Prepared By:</strong> System</div>
  </div>
  
  <div class="items-section">
    ${project.erpResponse.approved_items.map((item, index) => `
      <div class="item-group">
        <div class="item-header">${item.area} - ${item.desc}</div>
        <div class="item-details">
          <div class="item-line">
            <span>SKU: ${item.sku}</span>
            <span>Quantity: ${item.qty} ${item.uom}</span>
          </div>
          <div class="item-line">
            <span>Unit Price: $${item.unit_price.toLocaleString()}</span>
            <span><strong>Extended: $${item.amount.toLocaleString()}</strong></span>
          </div>
        </div>
        <div class="subtotal">Subtotal: $${item.amount.toLocaleString()}</div>
      </div>
    `).join('')}
  </div>
  
  <div class="totals-section">
    <div class="total-line">Subtotal: <span>$${(project.erpResponse.totals.materials + project.erpResponse.totals.labor + project.erpResponse.totals.install).toLocaleString()}</span></div>
    <div class="total-line">Discount: <span>$${project.erpResponse.totals.discounts.toLocaleString()}</span></div>
    <div class="total-line">Tax: <span>$${project.erpResponse.totals.tax.toLocaleString()}</span></div>
    <div class="total-line grand-total">Total: <span>$${project.erpResponse.totals.grand_total.toLocaleString()}</span></div>
    <div class="total-line grand-total">Balance Due: <span>$${project.erpResponse.totals.grand_total.toLocaleString()}</span></div>
  </div>
  
  <div class="terms">
    <strong>Terms and Conditions:</strong><br>
    By signing this agreement you are agreeing to Construction Portal's terms of sale. All sales are final.
    Payment terms as specified in payment schedule. Materials and installation as described above.
  </div>
  
  <div class="signature-section">
    <div>Name: <div class="signature-line"></div></div>
    <div>Signature: <div class="signature-line"></div></div>
    <div>Date: <div class="signature-line"></div></div>
  </div>
</body>
</html>
    `;
    
    const blob = new Blob([salesOrderHtml], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Sales-Order-${project.name.replace(/\s+/g, '-')}-${project.erpResponse.po_number}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const totalProjectValue = projects.reduce(
    (sum, p) =>
      sum +
      (p.erpResponse?.totals?.grand_total ||
        p.contractorResponse?.project_total_estimated ||
        p.budget ||
        0),
    0
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Client Dashboard</h1>
          <p className="text-gray-600">
            Review and approve construction projects
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Pending Approval
            </CardTitle>
            <Clock className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {projects.filter((p) => p.status === "client-review").length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Approved Projects
            </CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {projects.filter((p) => p.status === "approved").length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Investment
            </CardTitle>
            <DollarSign className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">
              ${totalProjectValue.toLocaleString()}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg. ROI</CardTitle>
            <TrendingUp className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">18.2%</div>
          </CardContent>
        </Card>
      </div>

      {/* Projects Table */}
      <Card>
        <CardHeader>
          <CardTitle>Project Portfolio</CardTitle>
          <CardDescription>
            Review and manage your construction investments
          </CardDescription>
        </CardHeader>
        <CardContent>
          {projects.length === 0 ? (
            <div className="text-center py-8">
              <BarChart3 className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No projects available
              </h3>
              <p className="text-gray-600">
                Projects will appear here when submitted for your review
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Project Name</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Investment</TableHead>
                    <TableHead>Final Cost</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {projects.map((project) => (
                    <TableRow key={project.id}>
                      <TableCell className="font-medium">
                        {project.name}
                      </TableCell>
                      <TableCell>{project.location}</TableCell>
                      <TableCell>
                        ${(project.budget || 0).toLocaleString()}
                      </TableCell>
                      <TableCell>
                        {project.erpResponse?.totals?.grand_total
                          ? `$${project.erpResponse.totals.grand_total.toLocaleString()}`
                          : project.contractorResponse?.project_total_estimated
                          ? `$${project.contractorResponse.project_total_estimated.toLocaleString()}`
                          : "-"}
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(project.status)}>
                          <div className="flex items-center space-x-1">
                            {getStatusIcon(project.status)}
                            <span>{project.status.replace("-", " ")}</span>
                          </div>
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => viewProjectDetails(project)}
                          >
                            <Eye className="mr-1 h-4 w-4" />
                            View
                          </Button>
                          {project.erpResponse && (
                            <>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => openSaleListingInNewTab(project)}
                              >
                                <DollarSign className="mr-1 h-4 w-4" />
                                Sale
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => downloadSalesOrder(project)}
                              >
                                <Download className="mr-1 h-4 w-4" />
                                Order
                              </Button>
                            </>
                          )}
                          {project.status === "client-review" && (
                            <Button
                              size="sm"
                              onClick={() => handleApproveProject(project)}
                              className="bg-green-600 hover:bg-green-700"
                            >
                              <CheckCircle className="mr-1 h-4 w-4" />
                              Approve
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Project Details Dialog */}
      <Dialog open={isDetailsDialogOpen} onOpenChange={setIsDetailsDialogOpen}>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2">
              <BarChart3 className="h-5 w-5 text-purple-600" />
              <span>{selectedProject?.name}</span>
            </DialogTitle>
            <DialogDescription>
              Project Analysis and Investment Overview
            </DialogDescription>
          </DialogHeader>

          {selectedProject && (
            <div className="space-y-6">
              {/* Project Info */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium text-gray-500">
                    Location
                  </Label>
                  <p className="text-sm">{selectedProject.location}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-500">
                    Original Budget
                  </Label>
                  <p className="text-sm font-bold">
                    ${(selectedProject.budget || 0).toLocaleString()}
                  </p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-500">
                    Status
                  </Label>
                  <Badge className={getStatusColor(selectedProject.status)}>
                    {selectedProject.status.replace("-", " ")}
                  </Badge>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-500">
                    Created
                  </Label>
                  <p className="text-sm">
                    {new Date(selectedProject.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>

              {/* Contractor Response (always visible if present) */}
              {selectedProject.contractorResponse && (
                <div className="space-y-2">
                  <h3 className="text-lg font-semibold flex items-center space-x-2">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <span>Contractor Response</span>
                  </h3>
                  <Card className="bg-green-50 border-green-200">
                    <CardHeader>
                      <CardTitle className="text-base text-green-800">
                        {selectedProject.contractorResponse.phase}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-green-800 mb-3">
                        {selectedProject.contractorResponse.summary}
                      </p>
                      <div className="bg-white p-3 rounded border mb-3">
                        <div className="flex justify-between items-center">
                          <div>
                            <Label className="text-sm font-medium text-green-700">
                              Project Total Estimated
                            </Label>
                            <p className="text-xl font-bold text-green-900">
                              $
                              {selectedProject.contractorResponse.project_total_estimated.toLocaleString()}
                            </p>
                          </div>
                          <div className="text-right">
                            <Label className="text-sm font-medium text-green-700">
                              Vendor Notes
                            </Label>
                            <p className="text-sm text-green-800">
                              {selectedProject.contractorResponse.vendor_notes}
                            </p>
                          </div>
                        </div>
                      </div>
                      {/* Materials by Room */}
                      <div className="mb-3">
                        <Label className="text-sm font-medium text-green-700">
                          Materials by Room
                        </Label>
                        <div className="space-y-2 mt-1">
                          {selectedProject.contractorResponse.rooms?.map(
                            (room: any, idx: number) => (
                              <Card key={idx} className="bg-white border">
                                <CardHeader>
                                  <CardTitle className="text-base">
                                    {room.area}
                                  </CardTitle>
                                </CardHeader>
                                <CardContent>
                                  <Table>
                                    <TableHeader>
                                      <TableRow>
                                        <TableHead>SKU</TableHead>
                                        <TableHead>Description</TableHead>
                                        <TableHead>Qty</TableHead>
                                        <TableHead>Unit</TableHead>
                                        <TableHead>Notes</TableHead>
                                      </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                      {room.items.map(
                                        (item: any, itemIdx: number) => (
                                          <TableRow key={itemIdx}>
                                            <TableCell className="font-mono text-green-600">
                                              {item.sku}
                                            </TableCell>
                                            <TableCell>{item.desc}</TableCell>
                                            <TableCell>{item.qty}</TableCell>
                                            <TableCell>{item.uom}</TableCell>
                                            <TableCell>
                                              {item.notes || "—"}
                                            </TableCell>
                                          </TableRow>
                                        )
                                      )}
                                    </TableBody>
                                  </Table>
                                  <div className="text-xs text-gray-500 mt-2">
                                    Materials: $
                                    {room.material_estimate?.toLocaleString()} |
                                    Install: $
                                    {room.install_estimate?.toLocaleString()}
                                  </div>
                                </CardContent>
                              </Card>
                            )
                          )}
                        </div>
                      </div>
                      {/* Site Logistics */}
                      {selectedProject.contractorResponse.site_logistics && (
                        <div className="mb-2">
                          <Label className="text-sm font-medium text-green-700">
                            Site Logistics
                          </Label>
                          <ul className="list-disc ml-5 text-green-800 mt-1">
                            {selectedProject.contractorResponse.site_logistics.map(
                              (item: string, idx: number) => (
                                <li key={idx}>{item}</li>
                              )
                            )}
                          </ul>
                        </div>
                      )}
                      {/* Attachments */}
                      {selectedProject.contractorResponse.attachments && (
                        <div className="mb-2">
                          <Label className="text-sm font-medium text-green-700">
                            Attachments
                          </Label>
                          <div className="space-y-1 mt-1">
                            {selectedProject.contractorResponse.attachments.map(
                              (att: any, idx: number) => (
                                <div
                                  key={idx}
                                  className="flex items-center space-x-2"
                                >
                                  <Badge variant="outline">{att.type}</Badge>
                                  <span className="text-sm text-gray-700">
                                    {att.label}
                                  </span>
                                </div>
                              )
                            )}
                          </div>
                        </div>
                      )}
                      {/* Message */}
                      {selectedProject.contractorResponse.message && (
                        <div className="bg-yellow-50 p-3 rounded border border-yellow-200 mt-2">
                          <p className="text-yellow-800 font-medium">
                            {selectedProject.contractorResponse.message}
                          </p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>
              )}

              {/* ERP Response */}
              {selectedProject.erpResponse && (
                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <DollarSign className="h-5 w-5 text-purple-600" />
                    <h3 className="text-lg font-semibold">
                      {selectedProject.erpResponse.phase}
                    </h3>
                  </div>

                  {/* Summary */}
                  <Card className="bg-purple-50 border-purple-200">
                    <CardContent className="pt-4">
                      <p className="text-purple-800 mb-3">
                        {selectedProject.erpResponse.summary}
                      </p>
                      <div className="bg-white p-3 rounded border">
                        <div className="flex justify-between items-center">
                          <div>
                            <Label className="text-sm font-medium text-purple-700">
                              Purchase Order
                            </Label>
                            <p className="text-lg font-bold text-purple-900 font-mono">
                              {selectedProject.erpResponse.po_number}
                            </p>
                          </div>
                          <div className="text-right">
                            <Label className="text-sm font-medium text-purple-700">
                              Project
                            </Label>
                            <p className="text-sm text-purple-800">
                              {selectedProject.erpResponse.project}
                            </p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Approved Items */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">
                        Approved Items
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="overflow-x-auto">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>SKU</TableHead>
                              <TableHead>Description</TableHead>
                              <TableHead>Qty</TableHead>
                              <TableHead>Area</TableHead>
                              <TableHead>Unit Price</TableHead>
                              <TableHead>Amount</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {selectedProject.erpResponse.approved_items.map(
                              (item: any, index: number) => (
                                <TableRow key={index}>
                                  <TableCell className="font-mono text-purple-600">
                                    {item.sku}
                                  </TableCell>
                                  <TableCell>{item.desc}</TableCell>
                                  <TableCell>
                                    {item.qty} {item.uom}
                                  </TableCell>
                                  <TableCell>{item.area}</TableCell>
                                  <TableCell>
                                    ${item.unit_price.toLocaleString()}
                                  </TableCell>
                                  <TableCell className="font-semibold">
                                    ${item.amount.toLocaleString()}
                                  </TableCell>
                                </TableRow>
                              )
                            )}
                          </TableBody>
                        </Table>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Financial Summary */}
                  <Card className="bg-green-50 border-green-200">
                    <CardHeader>
                      <CardTitle className="text-base">
                        Financial Summary
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span>Materials:</span>
                            <span className="font-medium">
                              $
                              {selectedProject.erpResponse.totals.materials.toLocaleString()}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span>Labor:</span>
                            <span className="font-medium">
                              $
                              {selectedProject.erpResponse.totals.labor.toLocaleString()}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span>Installation:</span>
                            <span className="font-medium">
                              $
                              {selectedProject.erpResponse.totals.install.toLocaleString()}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span>Shipping:</span>
                            <span className="font-medium">
                              $
                              {selectedProject.erpResponse.totals.shipping.toLocaleString()}
                            </span>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span>Tax:</span>
                            <span className="font-medium">
                              $
                              {selectedProject.erpResponse.totals.tax.toLocaleString()}
                            </span>
                          </div>
                          <div className="flex justify-between text-green-600">
                            <span>Discounts:</span>
                            <span className="font-medium">
                              $
                              {selectedProject.erpResponse.totals.discounts.toLocaleString()}
                            </span>
                          </div>
                          <hr className="my-2" />
                          <div className="flex justify-between text-lg font-bold">
                            <span>Grand Total:</span>
                            <span className="text-purple-600">
                              $
                              {selectedProject.erpResponse.totals.grand_total.toLocaleString()}
                            </span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Payment Schedule */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base flex items-center space-x-2">
                        <CreditCard className="h-4 w-4" />
                        <span>Payment Schedule</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Invoice ID</TableHead>
                            <TableHead>Stage</TableHead>
                            <TableHead>Amount</TableHead>
                            <TableHead>Due Date</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {selectedProject.erpResponse.invoices.map(
                            (invoice: any, index: number) => (
                              <TableRow key={index}>
                                <TableCell className="font-mono">
                                  {invoice.invoice_id}
                                </TableCell>
                                <TableCell className="font-medium">
                                  {invoice.stage}
                                </TableCell>
                                <TableCell className="font-bold">
                                  ${invoice.amount.toLocaleString()}
                                </TableCell>
                                <TableCell>{invoice.due}</TableCell>
                              </TableRow>
                            )
                          )}
                        </TableBody>
                      </Table>
                    </CardContent>
                  </Card>

                  {/* Project Timeline */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">
                        Project Timeline
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {selectedProject.erpResponse.project_timeline.map(
                          (milestone: any, index: number) => (
                            <div
                              key={index}
                              className="flex items-center space-x-3"
                            >
                              <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                              <div className="flex-1">
                                <p className="font-medium text-gray-900">
                                  {milestone.milestone}
                                </p>
                                <p className="text-sm text-gray-600">
                                  {milestone.date}
                                </p>
                              </div>
                            </div>
                          )
                        )}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Shipment Tracking */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">
                        Shipment Tracking
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {selectedProject.erpResponse.shipment_tracking.map(
                          (shipment: any, index: number) => (
                            <div key={index} className="p-3 bg-gray-50 rounded">
                              <div className="flex justify-between items-start">
                                <div>
                                  <p className="font-medium text-gray-900">
                                    {shipment.item}
                                  </p>
                                  <p className="text-sm text-gray-600">
                                    {shipment.carrier}
                                  </p>
                                </div>
                                <div className="text-right">
                                  <Badge
                                    variant={
                                      shipment.status === "In Transit"
                                        ? "default"
                                        : "secondary"
                                    }
                                  >
                                    {shipment.status}
                                  </Badge>
                                  <p className="text-sm text-gray-600 mt-1">
                                    {shipment.est_delivery}
                                  </p>
                                </div>
                              </div>
                            </div>
                          )
                        )}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Client Actions */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">
                        Available Actions
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                        {selectedProject.erpResponse.client_actions.map(
                          (action: string, index: number) => (
                            <Button
                              key={index}
                              variant="outline"
                              size="sm"
                              className="justify-start bg-transparent"
                            >
                              {action}
                            </Button>
                          )
                        )}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Message */}
                  <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                    <p className="text-green-800 font-medium">
                      {selectedProject.erpResponse.message}
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
