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
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  CheckCircle,
  Clock,
  AlertCircle,
  Eye,
  DollarSign,
  Hammer,
  TrendingUp,
  Edit2,
  Save,
} from "lucide-react";
import { getProjects, saveProject, type Project } from "@/lib/userData";
import { useToast } from "@/hooks/use-toast";

export function ContractorDashboard() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false);
  const [isApprovalDialogOpen, setIsApprovalDialogOpen] = useState(false);
  const [approvalNotes, setApprovalNotes] = useState("");
  const [editingRoom, setEditingRoom] = useState<string | null>(null);
  // For two-step approval dialog
  const [contractorEditStep, setContractorEditStep] = useState<
    "edit" | "review"
  >("edit");
  const [localContractorResponse, setLocalContractorResponse] =
    useState<any>(null);

  // For approval dialog (pre-quote, local editing)
  const handleEditItemLocal = (
    roomIndex: number,
    itemIndex: number,
    field: string,
    value: any
  ) => {
    setLocalContractorResponse((prev: any) => {
      const rooms = [...prev.rooms];
      if (field === "material_estimate" || field === "install_estimate") {
        // These are on the room, not item
        rooms[roomIndex] = { ...rooms[roomIndex], [field]: value };
      } else {
        const room = { ...rooms[roomIndex] };
        const items = [...room.items];
        items[itemIndex] = { ...items[itemIndex], [field]: value };
        room.items = items;
        rooms[roomIndex] = room;
      }
      return { ...prev, rooms };
    });
  };

  // Save local edits and go to review step
  const handleNextToReview = () => {
    setContractorEditStep("review");
  };

  // Confirm and send quote
  const handleConfirmQuote = () => {
    if (!selectedProject || !localContractorResponse) return;
    const updatedProject = {
      ...selectedProject,
      status: "client-review" as const,
      contractorResponse: localContractorResponse,
      updatedAt: new Date().toISOString(),
    };
    saveProject(updatedProject);
    loadProjects();
    setIsApprovalDialogOpen(false);
    setApprovalNotes("");
    setContractorEditStep("edit");
    setLocalContractorResponse(null);
    toast({
      title: "Project Approved",
      description: "Project has been reviewed and sent to client for approval",
    });
  };
  const { toast } = useToast();

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = () => {
    const allProjects = getProjects();
    // Contractors can see projects in contractor-review status and projects they've worked on
    const contractorProjects = allProjects.filter(
      (p) => p.status === "contractor-review" || p.contractorResponse
    );
    setProjects(contractorProjects);
  };

  const handleApproveProject = () => {
    if (!selectedProject) return;

    // Generate the exact contractor response format requested
    const contractorResponse = {
      phase: "Contractor Review and Edit",
      summary:
        "Contractor reviewed AI materials, adjusted quantities for waste, added alternate products and detailed specifications. Labor, install, and logistics costs attached.",
      vendor_notes:
        "Stone slabs rounded up for possible breakage; switched faucets to local spec.",
      rooms: [
        {
          area: "Master Suite",
          items: [
            {
              sku: "STONE_TRAV_2CM",
              desc: "White Wood Travertine 2cm slab",
              qty: 1.5,
              uom: "slab",
              location: "Countertops",
              notes: "Includes 20% waste, confirm batch color",
            },
            {
              sku: "CABINET_BOX_42",
              desc: "Rehau Windswept Pine Cabinet Box 42in",
              qty: 2,
              uom: "unit",
            },
            {
              sku: "SINK_INTEGRAL_20x14",
              desc: "Integral stone sink",
              qty: 2,
              uom: "each",
            },
            {
              sku: "BATH_LIGHT_2X",
              desc: "Wall Sconce, Brushed Brass",
              qty: 2,
              uom: "each",
              notes: "Match powder room style",
            },
          ],
          install_estimate: 8400,
          material_estimate: 24250,
          currency: "USD",
        },
        {
          area: "Kitchen",
          items: [
            {
              sku: "QZ_EMERALD_3CM",
              desc: "Emerald Green Quartzite 3cm slab",
              qty: 2.25,
              uom: "slab",
              notes: "One extra for island overhang",
            },
            {
              sku: "CAB_CLAD_QZ",
              desc: "Stone clad cabinet doors/panels",
              qty: 10,
              uom: "unit",
            },
            {
              sku: "INTEGRAL_QZ_SINK",
              desc: "Integral Stone Sink, Custom",
              qty: 1,
              uom: "each",
            },
            {
              sku: "FAUCET_LOCAL_SUS",
              desc: "Locally Sourced Pull-down Faucet, Stainless",
              qty: 1,
              uom: "each",
              notes: "Alternate to Grohe",
            },
          ],
          install_estimate: 21000,
          material_estimate: 52000,
          currency: "USD",
        },
        {
          area: "Guest Bath",
          items: [
            {
              sku: "QUARTZ_WHITE_2CM",
              desc: "Caesarstone White Quartz 2cm slab",
              qty: 1.0,
              uom: "slab",
              notes: "Rounded up from 0.9",
            },
            {
              sku: "CABINET_SUNLIT_36",
              desc: "Rehau Sunlit Pine Cabinet Box 36in",
              qty: 1,
              uom: "unit",
            },
            {
              sku: "SINK_UNDERMOUNT_18x14",
              desc: "Undermount Ceramic Sink 18x14in",
              qty: 1,
              uom: "each",
            },
          ],
          install_estimate: 4200,
          material_estimate: 8500,
          currency: "USD",
        },
      ],
      project_total_estimated: 346500,
      site_logistics: [
        "Night delivery required for city restrictions",
        "Rigging and elevator access to be coordinated",
      ],
      attachments: [
        {
          type: "PDF",
          label: "Installation Scope",
          url: "dummy-link.com/pdf1",
        },
        { type: "PNG", label: "Annotated Plan", url: "dummy-link.com/img1" },
      ],
      message:
        "This is a detailed dummy contractor review with accurate schedule of materials and full labor/cost breakdowns for a large project stage. For demo only.",
    };

    const updatedProject = {
      ...selectedProject,
      status: "client-review" as const,
      contractorResponse,
      updatedAt: new Date().toISOString(),
    };

    saveProject(updatedProject);
    loadProjects();
    setIsApprovalDialogOpen(false);
    setApprovalNotes("");

    toast({
      title: "Project Approved",
      description: "Project has been reviewed and sent to client for approval",
    });
  };

  const handleEditItem = (
    roomIndex: number,
    itemIndex: number,
    field: string,
    value: any
  ) => {
    if (!selectedProject?.contractorResponse) return;

    const updatedProject = { ...selectedProject };
    updatedProject.contractorResponse.rooms[roomIndex].items[itemIndex][field] =
      value;

    setSelectedProject(updatedProject);
  };

  const handleSaveEdits = () => {
    if (!selectedProject) return;

    saveProject(selectedProject);
    loadProjects();
    setEditingRoom(null);

    toast({
      title: "Changes Saved",
      description: "Material specifications have been updated",
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

  const openApprovalDialog = (project: Project) => {
    setSelectedProject(project);
    // Deep copy contractorResponse if it exists, else use a default structure
    if (project.contractorResponse) {
      setLocalContractorResponse(
        JSON.parse(JSON.stringify(project.contractorResponse))
      );
    } else {
      // Use the same structure as in handleApproveProject
      setLocalContractorResponse({
        phase: "Contractor Review and Edit",
        summary:
          "Contractor reviewed AI materials, adjusted quantities for waste, added alternate products and detailed specifications. Labor, install, and logistics costs attached.",
        vendor_notes:
          "Stone slabs rounded up for possible breakage; switched faucets to local spec.",
        rooms: [
          {
            area: "Master Suite",
            items: [
              {
                sku: "STONE_TRAV_2CM",
                desc: "White Wood Travertine 2cm slab",
                qty: 1.5,
                uom: "slab",
                location: "Countertops",
                notes: "Includes 20% waste, confirm batch color",
              },
              {
                sku: "CABINET_BOX_42",
                desc: "Rehau Windswept Pine Cabinet Box 42in",
                qty: 2,
                uom: "unit",
              },
              {
                sku: "SINK_INTEGRAL_20x14",
                desc: "Integral stone sink",
                qty: 2,
                uom: "each",
              },
              {
                sku: "BATH_LIGHT_2X",
                desc: "Wall Sconce, Brushed Brass",
                qty: 2,
                uom: "each",
                notes: "Match powder room style",
              },
            ],
            install_estimate: 8400,
            material_estimate: 24250,
            currency: "USD",
          },
          {
            area: "Kitchen",
            items: [
              {
                sku: "QZ_EMERALD_3CM",
                desc: "Emerald Green Quartzite 3cm slab",
                qty: 2.25,
                uom: "slab",
                notes: "One extra for island overhang",
              },
              {
                sku: "CAB_CLAD_QZ",
                desc: "Stone clad cabinet doors/panels",
                qty: 10,
                uom: "unit",
              },
              {
                sku: "INTEGRAL_QZ_SINK",
                desc: "Integral Stone Sink, Custom",
                qty: 1,
                uom: "each",
              },
              {
                sku: "FAUCET_LOCAL_SUS",
                desc: "Locally Sourced Pull-down Faucet, Stainless",
                qty: 1,
                uom: "each",
                notes: "Alternate to Grohe",
              },
            ],
            install_estimate: 21000,
            material_estimate: 52000,
            currency: "USD",
          },
          {
            area: "Guest Bath",
            items: [
              {
                sku: "QUARTZ_WHITE_2CM",
                desc: "Caesarstone White Quartz 2cm slab",
                qty: 1.0,
                uom: "slab",
                notes: "Rounded up from 0.9",
              },
              {
                sku: "CABINET_SUNLIT_36",
                desc: "Rehau Sunlit Pine Cabinet Box 36in",
                qty: 1,
                uom: "unit",
              },
              {
                sku: "SINK_UNDERMOUNT_18x14",
                desc: "Undermount Ceramic Sink 18x14in",
                qty: 1,
                uom: "each",
              },
            ],
            install_estimate: 4200,
            material_estimate: 8500,
            currency: "USD",
          },
        ],
        project_total_estimated: 346500,
        site_logistics: [
          "Night delivery required for city restrictions",
          "Rigging and elevator access to be coordinated",
        ],
        attachments: [
          {
            type: "PDF",
            label: "Installation Scope",
            url: "dummy-link.com/pdf1",
          },
          { type: "PNG", label: "Annotated Plan", url: "dummy-link.com/img1" },
        ],
        message:
          "This is a detailed dummy contractor review with accurate schedule of materials and full labor/cost breakdowns for a large project stage. For demo only.",
      });
    }
    setContractorEditStep("edit");
    setIsApprovalDialogOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Contractor Dashboard
          </h1>
          <p className="text-gray-600">Review projects and generate quotes</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Pending Reviews
            </CardTitle>
            <Clock className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">
              {projects.filter((p) => p.status === "contractor-review").length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Active Projects
            </CardTitle>
            <Hammer className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {projects.filter((p) => p.contractorResponse).length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Value</CardTitle>
            <DollarSign className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">
              $
              {projects
                .reduce(
                  (sum, p) =>
                    sum +
                    (p.contractorResponse?.project_total_estimated ||
                      p.budget ||
                      0),
                  0
                )
                .toLocaleString()}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg. Margin</CardTitle>
            <TrendingUp className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">12.5%</div>
          </CardContent>
        </Card>
      </div>

      {/* Projects Table */}
      <Card>
        <CardHeader>
          <CardTitle>Project Reviews</CardTitle>
          <CardDescription>
            Review and approve construction projects
          </CardDescription>
        </CardHeader>
        <CardContent>
          {projects.length === 0 ? (
            <div className="text-center py-8">
              <Hammer className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No projects to review
              </h3>
              <p className="text-gray-600">
                Projects will appear here when architects submit them for review
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Project Name</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Original Budget</TableHead>
                    <TableHead>Estimated Cost</TableHead>
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
                      <TableCell>${project.budget?.toLocaleString()}</TableCell>
                      <TableCell>
                        {project.contractorResponse?.project_total_estimated
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
                          {project.status === "contractor-review" && (
                            <Button
                              size="sm"
                              onClick={() => openApprovalDialog(project)}
                              className="bg-green-600 hover:bg-green-700"
                            >
                              <CheckCircle className="mr-1 h-4 w-4" />
                              Review & Quote
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
              <Hammer className="h-5 w-5 text-green-600" />
              <span>{selectedProject?.name}</span>
            </DialogTitle>
            <DialogDescription>
              Project Details and Contractor Response
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
                  <p className="text-sm">
                    ${selectedProject.budget?.toLocaleString()}
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

              {/* AI Analysis Summary */}
              {selectedProject.aiAnalysis && (
                <Card className="bg-blue-50 border-blue-200">
                  <CardHeader>
                    <CardTitle className="text-base">
                      Original AI Analysis
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-4 mb-3">
                      <div>
                        <Label className="text-sm font-medium text-blue-700">
                          Confidence
                        </Label>
                        <p className="text-lg font-bold text-blue-900">
                          {(
                            selectedProject.aiAnalysis.overall_confidence * 100
                          ).toFixed(0)}
                          %
                        </p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-blue-700">
                          Total Items
                        </Label>
                        <p className="text-lg font-bold text-blue-900">
                          {selectedProject.aiAnalysis.total_items}
                        </p>
                      </div>
                    </div>
                    <p className="text-blue-800 text-sm">
                      {selectedProject.aiAnalysis.summary}
                    </p>
                  </CardContent>
                </Card>
              )}

              {/* Contractor Response */}
              {selectedProject.contractorResponse && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="h-5 w-5 text-green-600" />
                      <h3 className="text-lg font-semibold">
                        {selectedProject.contractorResponse.phase}
                      </h3>
                    </div>
                    {editingRoom && (
                      <Button
                        onClick={handleSaveEdits}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        <Save className="mr-2 h-4 w-4" />
                        Save Changes
                      </Button>
                    )}
                  </div>

                  {/* Summary */}
                  <Card className="bg-green-50 border-green-200">
                    <CardContent className="pt-4">
                      <p className="text-green-800 mb-3">
                        {selectedProject.contractorResponse.summary}
                      </p>
                      <div className="bg-white p-3 rounded border">
                        <Label className="text-sm font-medium text-green-700">
                          Vendor Notes
                        </Label>
                        <p className="text-sm text-green-800 mt-1">
                          {selectedProject.contractorResponse.vendor_notes}
                        </p>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Materials by Room */}
                  <div className="space-y-4">
                    <h4 className="font-semibold">Contractor Review by Room</h4>
                    {selectedProject.contractorResponse.rooms.map(
                      (room: any, roomIndex: number) => (
                        <Card key={roomIndex}>
                          <CardHeader className="pb-3">
                            <div className="flex justify-between items-center">
                              <div>
                                <CardTitle className="text-base">
                                  {room.area}
                                </CardTitle>
                                <div className="text-sm text-gray-600 mt-1">
                                  Materials: $
                                  {room.material_estimate?.toLocaleString()} |
                                  Install: $
                                  {room.install_estimate?.toLocaleString()}
                                </div>
                              </div>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() =>
                                  setEditingRoom(
                                    editingRoom === room.area ? null : room.area
                                  )
                                }
                              >
                                <Edit2 className="mr-1 h-4 w-4" />
                                {editingRoom === room.area ? "Cancel" : "Edit"}
                              </Button>
                            </div>
                            {editingRoom === room.area && (
                              <div className="flex justify-end mt-2">
                                <Button
                                  onClick={handleSaveEdits}
                                  className="bg-green-600 hover:bg-green-700"
                                  size="sm"
                                >
                                  <Save className="mr-2 h-4 w-4" />
                                  Save Changes
                                </Button>
                              </div>
                            )}
                          </CardHeader>
                          <CardContent>
                            <div className="overflow-x-auto">
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
                                    (item: any, itemIndex: number) => (
                                      <TableRow key={itemIndex}>
                                        <TableCell className="font-mono text-green-600">
                                          {item.sku}
                                        </TableCell>
                                        <TableCell>
                                          {editingRoom === room.area ? (
                                            <Input
                                              value={item.desc}
                                              onChange={(e) =>
                                                handleEditItem(
                                                  roomIndex,
                                                  itemIndex,
                                                  "desc",
                                                  e.target.value
                                                )
                                              }
                                              className="min-w-[200px]"
                                            />
                                          ) : (
                                            item.desc
                                          )}
                                        </TableCell>
                                        <TableCell>
                                          {editingRoom === room.area ? (
                                            <Input
                                              type="number"
                                              step="0.01"
                                              value={item.qty}
                                              onChange={(e) =>
                                                handleEditItem(
                                                  roomIndex,
                                                  itemIndex,
                                                  "qty",
                                                  Number.parseFloat(
                                                    e.target.value
                                                  )
                                                )
                                              }
                                              className="w-20"
                                            />
                                          ) : (
                                            item.qty
                                          )}
                                        </TableCell>
                                        <TableCell>{item.uom}</TableCell>
                                        <TableCell>
                                          {editingRoom === room.area ? (
                                            <Input
                                              value={item.notes || ""}
                                              onChange={(e) =>
                                                handleEditItem(
                                                  roomIndex,
                                                  itemIndex,
                                                  "notes",
                                                  e.target.value
                                                )
                                              }
                                              className="min-w-[150px]"
                                              placeholder="Add notes..."
                                            />
                                          ) : (
                                            item.notes || "—"
                                          )}
                                        </TableCell>
                                      </TableRow>
                                    )
                                  )}
                                </TableBody>
                              </Table>
                            </div>
                          </CardContent>
                        </Card>
                      )
                    )}
                  </div>

                  {/* Project Total */}
                  <Card className="bg-green-50 border-green-200">
                    <CardContent className="pt-4">
                      <div className="flex justify-between items-center mb-3">
                        <h4 className="font-semibold text-green-800">
                          Project Total Estimated
                        </h4>
                        <span className="text-2xl font-bold text-green-800">
                          $
                          {selectedProject.contractorResponse.project_total_estimated.toLocaleString()}
                        </span>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Site Logistics */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">
                        Site Logistics
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        {selectedProject.contractorResponse.site_logistics.map(
                          (item: string, index: number) => (
                            <li key={index} className="flex items-start">
                              <span className="text-green-500 mr-2">•</span>
                              <span className="text-gray-700">{item}</span>
                            </li>
                          )
                        )}
                      </ul>
                    </CardContent>
                  </Card>

                  {/* Attachments */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">Attachments</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        {selectedProject.contractorResponse.attachments.map(
                          (attachment: any, index: number) => (
                            <div
                              key={index}
                              className="flex items-center justify-between p-2 bg-gray-50 rounded"
                            >
                              <span className="text-sm text-gray-700">
                                {attachment.label}
                              </span>
                              <Badge variant="outline">{attachment.type}</Badge>
                            </div>
                          )
                        )}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Message */}
                  <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                    <p className="text-yellow-800 font-medium">
                      {selectedProject.contractorResponse.message}
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Approval Dialog - Two Step: Edit then Review */}
      <Dialog
        open={isApprovalDialogOpen}
        onOpenChange={setIsApprovalDialogOpen}
      >
        <DialogContent className="max-w-7xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Contractor Review & Quote</DialogTitle>
            <DialogDescription>
              {contractorEditStep === "edit"
                ? "Edit your material schedule, notes, and costs before generating a quote."
                : "Review your quote and confirm to send to client."}
            </DialogDescription>
          </DialogHeader>
          {selectedProject && localContractorResponse && (
            <div className="space-y-6">
              {/* Step 1: Edit contractor response */}
              {contractorEditStep === "edit" && (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm font-medium text-gray-500">
                        Project
                      </Label>
                      <p className="font-medium">{selectedProject.name}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-500">
                        Original Budget
                      </Label>
                      <p className="font-medium">
                        ${selectedProject.budget?.toLocaleString()}
                      </p>
                    </div>
                  </div>
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-blue-900 mb-2">
                      AI Analysis Summary
                    </h4>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-blue-700">Confidence:</span>
                        <span className="ml-2 font-medium">
                          {(
                            selectedProject?.aiAnalysis?.overall_confidence *
                            100
                          )?.toFixed(0)}
                          %
                        </span>
                      </div>
                      <div>
                        <span className="text-blue-700">Total Items:</span>
                        <span className="ml-2 font-medium">
                          {selectedProject.aiAnalysis?.total_items}
                        </span>
                      </div>
                    </div>
                    <p className="text-blue-800 text-sm mt-2">
                      {selectedProject.aiAnalysis?.summary}
                    </p>
                  </div>
                  <div className="space-y-2">
                    <Label>Contractor Summary</Label>
                    <Textarea
                      value={localContractorResponse.summary}
                      onChange={(e) =>
                        setLocalContractorResponse((prev: any) => ({
                          ...prev,
                          summary: e.target.value,
                        }))
                      }
                      placeholder="Describe your review, adjustments, and approach..."
                      rows={2}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Vendor Notes</Label>
                    <Textarea
                      value={localContractorResponse.vendor_notes}
                      onChange={(e) =>
                        setLocalContractorResponse((prev: any) => ({
                          ...prev,
                          vendor_notes: e.target.value,
                        }))
                      }
                      placeholder="Add vendor notes, clarifications, or warnings..."
                      rows={2}
                    />
                  </div>
                  <div className="space-y-4">
                    <h4 className="font-semibold">Materials by Room</h4>
                    {localContractorResponse.rooms.map(
                      (room: any, roomIndex: number) => (
                        <Card key={roomIndex}>
                          <CardHeader className="pb-3">
                            <div className="flex justify-between items-center">
                              <div>
                                <CardTitle className="text-base">
                                  {room.area}
                                </CardTitle>
                                <div className="text-sm text-gray-600 mt-1">
                                  <span>Materials: $</span>
                                  <Input
                                    type="number"
                                    value={room.material_estimate}
                                    onChange={(e) =>
                                      handleEditItemLocal(
                                        roomIndex,
                                        0,
                                        "material_estimate",
                                        Number(e.target.value)
                                      )
                                    }
                                    className="w-24 inline-block mx-1"
                                  />
                                  <span>| Install: $</span>
                                  <Input
                                    type="number"
                                    value={room.install_estimate}
                                    onChange={(e) =>
                                      handleEditItemLocal(
                                        roomIndex,
                                        0,
                                        "install_estimate",
                                        Number(e.target.value)
                                      )
                                    }
                                    className="w-24 inline-block mx-1"
                                  />
                                </div>
                              </div>
                            </div>
                          </CardHeader>
                          <CardContent>
                            <div className="overflow-x-auto">
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
                                    (item: any, itemIndex: number) => (
                                      <TableRow key={itemIndex}>
                                        <TableCell className="font-mono text-green-600">
                                          {item.sku}
                                        </TableCell>
                                        <TableCell>
                                          <Input
                                            value={item.desc}
                                            onChange={(e) =>
                                              handleEditItemLocal(
                                                roomIndex,
                                                itemIndex,
                                                "desc",
                                                e.target.value
                                              )
                                            }
                                            className="min-w-[200px]"
                                          />
                                        </TableCell>
                                        <TableCell>
                                          <Input
                                            type="number"
                                            step="0.01"
                                            value={item.qty}
                                            onChange={(e) =>
                                              handleEditItemLocal(
                                                roomIndex,
                                                itemIndex,
                                                "qty",
                                                Number.parseFloat(
                                                  e.target.value
                                                )
                                              )
                                            }
                                            className="w-20"
                                          />
                                        </TableCell>
                                        <TableCell>{item.uom}</TableCell>
                                        <TableCell>
                                          <Input
                                            value={item.notes || ""}
                                            onChange={(e) =>
                                              handleEditItemLocal(
                                                roomIndex,
                                                itemIndex,
                                                "notes",
                                                e.target.value
                                              )
                                            }
                                            className="min-w-[150px]"
                                            placeholder="Add notes..."
                                          />
                                        </TableCell>
                                      </TableRow>
                                    )
                                  )}
                                </TableBody>
                              </Table>
                            </div>
                          </CardContent>
                        </Card>
                      )
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label>Site Logistics</Label>
                    <Textarea
                      value={localContractorResponse.site_logistics?.join("\n")}
                      onChange={(e) =>
                        setLocalContractorResponse((prev: any) => ({
                          ...prev,
                          site_logistics: e.target.value.split("\n"),
                        }))
                      }
                      placeholder="Add site logistics, one per line..."
                      rows={2}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Message to Client</Label>
                    <Textarea
                      value={localContractorResponse.message}
                      onChange={(e) =>
                        setLocalContractorResponse((prev: any) => ({
                          ...prev,
                          message: e.target.value,
                        }))
                      }
                      placeholder="Add a message for the client..."
                      rows={2}
                    />
                  </div>
                  <div className="flex justify-end space-x-2 pt-4">
                    <Button
                      variant="outline"
                      onClick={() => setIsApprovalDialogOpen(false)}
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={handleNextToReview}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      Next: Review & Send Quote
                    </Button>
                  </div>
                </>
              )}
              {/* Step 2: Review and confirm */}
              {contractorEditStep === "review" && (
                <>
                  <Card className="bg-green-50 border-green-200">
                    <CardHeader>
                      <CardTitle className="text-base">
                        Review Your Quote
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="mb-2">
                        <Label className="text-sm font-medium text-green-700">
                          Summary
                        </Label>
                        <p className="text-green-800 mt-1">
                          {localContractorResponse.summary}
                        </p>
                      </div>
                      <div className="mb-2">
                        <Label className="text-sm font-medium text-green-700">
                          Vendor Notes
                        </Label>
                        <p className="text-green-800 mt-1">
                          {localContractorResponse.vendor_notes}
                        </p>
                      </div>
                      <div className="mb-2">
                        <Label className="text-sm font-medium text-green-700">
                          Site Logistics
                        </Label>
                        <ul className="text-green-800 mt-1 list-disc ml-5">
                          {localContractorResponse.site_logistics?.map(
                            (item: string, idx: number) => (
                              <li key={idx}>{item}</li>
                            )
                          )}
                        </ul>
                      </div>
                      <div className="mb-2">
                        <Label className="text-sm font-medium text-green-700">
                          Message to Client
                        </Label>
                        <p className="text-green-800 mt-1">
                          {localContractorResponse.message}
                        </p>
                      </div>
                      <div className="mb-2">
                        <Label className="text-sm font-medium text-green-700">
                          Materials by Room
                        </Label>
                        <ul className="text-green-800 mt-1 list-disc ml-5">
                          {localContractorResponse.rooms.map(
                            (room: any, idx: number) => (
                              <li key={idx}>
                                <span className="font-semibold">
                                  {room.area}:
                                </span>{" "}
                                {room.items.length} items, Materials: $
                                {room.material_estimate}, Install: $
                                {room.install_estimate}
                              </li>
                            )
                          )}
                        </ul>
                      </div>
                    </CardContent>
                  </Card>
                  <div className="flex justify-end space-x-2 pt-4">
                    <Button
                      variant="outline"
                      onClick={() => setContractorEditStep("edit")}
                    >
                      Back
                    </Button>
                    <Button
                      onClick={handleConfirmQuote}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      <CheckCircle className="mr-2 h-4 w-4" />
                      Confirm & Send Quote
                    </Button>
                  </div>
                </>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
