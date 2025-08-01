"use client";

import type React from "react";

import { useState, useEffect } from "react";
// Subcomponent for AI Analysis Review Dialog
// ...existing code...

function AIAnalysisReviewDialog({
  open,
  onConfirm,
  onCancel,
  aiResponse,
  formData,
  isProcessing,
}: {
  open: boolean;
  onConfirm: (editedAI?: any) => void;
  onCancel: () => void;
  aiResponse: any;
  formData: {
    projectName: string;
    description: string;
    location: string;
    budget: string;
    selectedFiles: FileList | null;
  };
  isProcessing: boolean;
}) {
  // Local state for editing AI response
  const [localAI, setLocalAI] = useState<any>(aiResponse);
  // Sync localAI with aiResponse when dialog opens or aiResponse changes
  useEffect(() => {
    setLocalAI(aiResponse);
  }, [aiResponse, open]);

  const handleEdit = (
    roomIdx: number,
    itemIdx: number,
    field: string,
    value: any
  ) => {
    setLocalAI((prev: any) => {
      if (!prev) return prev;
      const rooms = prev.rooms ? [...prev.rooms] : [];
      const room = { ...rooms[roomIdx] };
      const items = room.items ? [...room.items] : [];
      items[itemIdx] = { ...items[itemIdx], [field]: value };
      room.items = items;
      rooms[roomIdx] = room;
      return { ...prev, rooms };
    });
  };

  return (
    <Dialog open={open} onOpenChange={onCancel}>
      <DialogContent className="max-w-7xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Review AI Analysis</DialogTitle>
          <DialogDescription>
            Please review and edit the AI-generated material schedule before
            creating your project.
          </DialogDescription>
        </DialogHeader>
        {isProcessing ? (
          <div className="space-y-3 p-4 bg-blue-50 rounded-lg">
            <div className="flex items-center space-x-2">
              <Zap className="h-5 w-5 text-blue-600 animate-pulse" />
              <span className="font-medium text-blue-900">
                AI Processing in Progress
              </span>
            </div>
            <Progress value={0} className="w-full" />
            <p className="text-sm text-blue-700">
              Analyzing your project files...
            </p>
          </div>
        ) : (
          <>
            <div className="space-y-3 p-4 bg-green-50 rounded-lg">
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <span className="font-medium text-green-900">
                  AI Analysis Complete
                </span>
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium">Confidence Score:</span>
                  <span className="ml-2 text-green-700">
                    {(localAI?.overall_confidence * 100).toFixed(0)}%
                  </span>
                </div>
                <div>
                  <span className="font-medium">Total Items:</span>
                  <span className="ml-2 text-green-700">
                    {localAI?.total_items}
                  </span>
                </div>
              </div>
              <p className="text-sm text-green-700">{localAI?.summary}</p>
            </div>
            <div className="bg-white p-3 rounded border mt-4">
              <Label className="text-sm font-medium text-blue-700">
                Project
              </Label>
              <p className="text-blue-800 font-medium">{localAI?.project}</p>
            </div>
            <div className="mt-6">
              <h4 className="font-semibold mb-2 text-lg">Materials by Room</h4>
              {localAI?.rooms?.map((room: any, roomIdx: number) => (
                <div key={roomIdx} className="mb-6">
                  <div className="font-semibold text-blue-800 mb-2 text-base">
                    {room.area}
                  </div>
                  <div className="overflow-x-auto rounded-lg border border-blue-100 bg-blue-50">
                    <Table>
                      <TableHeader>
                        <TableRow className="bg-blue-100">
                          <TableHead className="text-xs text-blue-900">
                            SKU
                          </TableHead>
                          <TableHead className="text-xs text-blue-900">
                            Description
                          </TableHead>
                          <TableHead className="text-xs text-blue-900">
                            Qty
                          </TableHead>
                          <TableHead className="text-xs text-blue-900">
                            Unit
                          </TableHead>
                          <TableHead className="text-xs text-blue-900">
                            Location
                          </TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {room.items.map((item: any, itemIdx: number) => (
                          <TableRow
                            key={itemIdx}
                            className="hover:bg-blue-200/30"
                          >
                            <TableCell className="font-mono text-blue-600 font-medium">
                              {item.sku}
                            </TableCell>
                            <TableCell>
                              <Input
                                value={item.desc}
                                onChange={(e) =>
                                  handleEdit(
                                    roomIdx,
                                    itemIdx,
                                    "desc",
                                    e.target.value
                                  )
                                }
                                className="min-w-[180px] bg-white"
                              />
                            </TableCell>
                            <TableCell>
                              <Input
                                type="number"
                                step="0.01"
                                value={item.qty}
                                onChange={(e) =>
                                  handleEdit(
                                    roomIdx,
                                    itemIdx,
                                    "qty",
                                    Number.parseFloat(e.target.value)
                                  )
                                }
                                className="w-20 bg-white"
                              />
                            </TableCell>
                            <TableCell>
                              <span className="text-gray-700">{item.uom}</span>
                            </TableCell>
                            <TableCell>
                              <Input
                                value={item.location}
                                onChange={(e) =>
                                  handleEdit(
                                    roomIdx,
                                    itemIdx,
                                    "location",
                                    e.target.value
                                  )
                                }
                                className="min-w-[120px] bg-white"
                              />
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </div>
              ))}
            </div>
            <div className="bg-yellow-50 p-2 rounded border border-yellow-200 mt-4">
              <p className="text-yellow-800 font-medium">{localAI?.message}</p>
            </div>
            <div className="flex justify-end space-x-2 pt-4">
              <Button type="button" variant="outline" onClick={onCancel}>
                Cancel
              </Button>
              <Button
                type="button"
                className="bg-blue-600 hover:bg-blue-700"
                onClick={() => onConfirm(localAI)}
              >
                Confirm & Create Project
              </Button>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";
import {
  Plus,
  FileText,
  Eye,
  CheckCircle,
  Clock,
  AlertCircle,
  Building,
  Zap,
  Edit2,
  Save,
} from "lucide-react";
import {
  getProjects,
  saveProject,
  getCurrentUser,
  type Project,
} from "@/lib/userData";
import { useToast } from "@/hooks/use-toast";

export function ArchitectDashboard() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingProgress, setProcessingProgress] = useState(0);
  const [aiResponse, setAiResponse] = useState<any>(null);
  const [showAIReview, setShowAIReview] = useState(false);
  const [pendingFormData, setPendingFormData] = useState<any>(null);
  const [editingRoom, setEditingRoom] = useState<string | null>(null);
  const { toast } = useToast();

  // Form state
  const [projectName, setProjectName] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [budget, setBudget] = useState("");
  const [selectedFiles, setSelectedFiles] = useState<FileList | null>(null);

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = () => {
    const allProjects = getProjects();
    const currentUser = getCurrentUser();
    if (currentUser) {
      const userProjects = allProjects.filter(
        (p) => p.createdBy === currentUser.id
      );
      setProjects(userProjects);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedFiles(e.target.files);
  };

  const simulateAIProcessing = async (formData: any) => {
    setIsProcessing(true);
    setProcessingProgress(0);

    const steps = [20, 40, 60, 80, 100];
    for (const progress of steps) {
      await new Promise((resolve) => setTimeout(resolve, 500));
      setProcessingProgress(progress);
    }

    // Generate dummy AI response
    const response = {
      phase: "AI Processing Complete",
      summary:
        "AI has analyzed all project documents, floorplans, sections, and elevations, extracting a comprehensive, multi-room Bill of Materials.",
      overall_confidence: 0.88,
      project: `${formData.projectName} - Main Renovation`,
      rooms: [
        // ...same as before...
        {
          area: "Master Suite",
          items: [
            {
              sku: "STONE_TRAV_2CM",
              desc: "White Wood Travertine 2cm slab",
              qty: 1.25,
              uom: "slab",
              location: "Countertops",
            },
            {
              sku: "SINK_INTEGRAL_20x14",
              desc: "Integral stone sink 20x14in",
              qty: 2,
              uom: "each",
              location: "Vanity",
            },
            {
              sku: "CABINET_BOX_42",
              desc: "Rehau Windswept Pine Cabinet Box 42x21x34in",
              qty: 2,
              uom: "unit",
              location: "Vanity Base",
            },
            {
              sku: "MIRROR_LED_48",
              desc: "LED Mirror w/demister 48in",
              qty: 2,
              uom: "each",
              location: "Above Vanity",
            },
            {
              sku: "FILLER_STRIP_3X36",
              desc: "Rehau filler strip, horizontal",
              qty: 4,
              uom: "unit",
              location: "Cabinetry",
            },
          ],
        },
        {
          area: "Guest Bath",
          items: [
            {
              sku: "QUARTZ_WHITE_2CM",
              desc: "Caesarstone White Quartz 2cm slab",
              qty: 0.9,
              uom: "slab",
              location: "Countertops",
            },
            {
              sku: "CABINET_SUNLIT_36",
              desc: "Rehau Sunlit Pine Cabinet Box 36in",
              qty: 1,
              uom: "unit",
              location: "Vanity Base",
            },
            {
              sku: "SINK_UNDERMOUNT_18x14",
              desc: "Undermount Ceramic Sink 18x14in",
              qty: 1,
              uom: "each",
              location: "Vanity",
            },
            {
              sku: "FAUCET_MATTE_1GRIP",
              desc: "Grohe Matte Black Faucet Single Handle",
              qty: 1,
              uom: "each",
              location: "Vanity",
            },
            {
              sku: "9IN_STONE_BSPLASH",
              desc: "Stone Backsplash 9in Tall",
              qty: 3.5,
              uom: "lf",
              location: "Vanity Wall",
            },
            {
              sku: "LED_TOE_KICK_36",
              desc: "LED Toekick Light, 36in",
              qty: 1,
              uom: "strip",
              location: "Vanity",
            },
          ],
        },
        {
          area: "Kitchen",
          items: [
            {
              sku: "QZ_EMERALD_3CM",
              desc: "Emerald Green Quartzite 3cm slab",
              qty: 2.15,
              uom: "slab",
              location: "Island",
            },
            {
              sku: "QZ_WATERFALL_PANEL",
              desc: "Quartzite Waterfall Panel",
              qty: 2,
              uom: "panel",
              location: "Island Ends",
            },
            {
              sku: "INTEGRAL_QZ_SINK",
              desc: "Integral Stone Sink, Custom",
              qty: 1,
              uom: "each",
              location: "Island",
            },
            {
              sku: "CAB_CLAD_QZ",
              desc: "Stone clad cabinet doors/panels",
              qty: 8,
              uom: "unit",
              location: "Kitchen Island",
            },
            {
              sku: "DRAWER_PULLOUT_24",
              desc: "Pullout Drawer, soft-close, 24in",
              qty: 4,
              uom: "each",
              location: "Island Storage",
            },
            {
              sku: "LED_STRIP_FULL",
              desc: "Continuous Under-cabinet LED strip",
              qty: 18,
              uom: "ft",
              location: "Cabinet Underside",
            },
          ],
        },
        {
          area: "Living Room",
          items: [
            {
              sku: "LIMESTONE_TILE_24X24",
              desc: "Reclaimed Limestone Tile 24x24in",
              qty: 850,
              uom: "sqft",
              location: "Floor",
            },
            {
              sku: "BRASS_STAIR_RAIL",
              desc: "Custom Brass Stair Railing",
              qty: 64,
              uom: "lf",
              location: "Stair",
            },
            {
              sku: "GALLERY_LIGHT_4FT",
              desc: "Linear Gallery Light 4ft",
              qty: 7,
              uom: "each",
              location: "Ceiling",
            },
          ],
        },
        {
          area: "Powder Room",
          items: [
            {
              sku: "STONE_SNK_BLOCK",
              desc: "Amazonite Stone Sink Block",
              qty: 1,
              uom: "each",
              location: "Powder Basin",
            },
            {
              sku: "MIRROR_ANTIQUED_36",
              desc: "Antiqued Wall Mirror, 36in",
              qty: 1,
              uom: "each",
              location: "Above Sink",
            },
            {
              sku: "BRASS_FAUCET_WALL",
              desc: "Wall-mount Faucet, Brass",
              qty: 1,
              uom: "each",
              location: "Sink Wall",
            },
          ],
        },
      ],
      total_items: 84,
      message:
        "Demo only: AI extracted full-scale multi-room material schedule, including project-wide and area-specific requirements. Please validate for completeness.",
    };
    setAiResponse(response);
    setIsProcessing(false);
    setShowAIReview(true);
  };

  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFiles || selectedFiles.length === 0) {
      toast({
        title: "Error",
        description: "Please select at least one file to upload",
        variant: "destructive",
      });
      return;
    }
    // Save form data for review
    const formData = {
      projectName,
      description,
      location,
      budget,
      selectedFiles,
    };
    setPendingFormData(formData);
    await simulateAIProcessing(formData);
  };

  // Called when user confirms in AI review dialog
  const handleConfirmAIReview = (editedAI?: any) => {
    if (!pendingFormData || !(editedAI || aiResponse)) return;
    const currentUser = getCurrentUser();
    if (!currentUser) return;
    const newProject: Project = {
      id: `proj_${Date.now()}`,
      name: pendingFormData.projectName,
      description: pendingFormData.description,
      location: pendingFormData.location,
      budget: Number.parseFloat(pendingFormData.budget),
      status: "contractor-review",
      clientId: "client-1",
      architectId: currentUser.id,
      createdBy: currentUser.id,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      files: Array.from(pendingFormData.selectedFiles as File[]).map(
        (file) => ({
          name: file.name,
          size: file.size,
          type: file.type,
        })
      ),
      aiAnalysis: editedAI || aiResponse,
      documents: [],
      materials: [],
      timeline: [],
      approvals: [],
    };
    saveProject(newProject);
    loadProjects();
    // Reset form
    setProjectName("");
    setDescription("");
    setLocation("");
    setBudget("");
    setSelectedFiles(null);
    setAiResponse(null);
    setShowAIReview(false);
    setPendingFormData(null);
    setIsCreateDialogOpen(false);
    toast({
      title: "Project Created",
      description: "Project created successfully with AI analysis",
    });
  };

  // Called when user cancels in AI review dialog
  const handleCancelAIReview = () => {
    setShowAIReview(false);
    setAiResponse(null);
    setPendingFormData(null);
  };

  const handleEditItem = (
    roomIndex: number,
    itemIndex: number,
    field: string,
    value: any
  ) => {
    if (!selectedProject?.aiAnalysis) return;

    const updatedProject = { ...selectedProject };
    const updatedAnalysis = { ...updatedProject.aiAnalysis };
    const updatedRooms = [...(updatedAnalysis.rooms ?? [])];
    const updatedRoom = { ...updatedRooms[roomIndex] };
    const updatedItems = [...updatedRoom.items];

    updatedItems[itemIndex] = { ...updatedItems[itemIndex], [field]: value };
    updatedRoom.items = updatedItems;
    updatedRooms[roomIndex] = updatedRoom;
    updatedAnalysis.rooms = updatedRooms;
    // Ensure all required fields are present and not undefined
    updatedProject.aiAnalysis = {
      phase: updatedAnalysis.phase ?? "AI Processing Complete",
      summary: updatedAnalysis.summary ?? "",
      overall_confidence: updatedAnalysis.overall_confidence ?? 0.88,
      project: updatedAnalysis.project ?? "",
      rooms: updatedAnalysis.rooms ?? [],
      total_items: updatedAnalysis.total_items ?? 0,
      message: updatedAnalysis.message ?? "",
    };

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

  const handleSendToContractor = () => {
    if (!selectedProject) return;

    const updatedProject = {
      ...selectedProject,
      status: "contractor-review" as const,
      updatedAt: new Date().toISOString(),
    };

    saveProject(updatedProject);
    loadProjects();
    setIsDetailsDialogOpen(false);

    toast({
      title: "Sent to Contractor",
      description: "Project has been sent to contractor for review",
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "draft":
        return "bg-gray-100 text-gray-800";
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Architect Dashboard
          </h1>
          <p className="text-gray-600">
            Create and manage your construction projects
          </p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Plus className="mr-2 h-4 w-4" />
              Create Project
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Create New Project</DialogTitle>
              <DialogDescription>
                Upload project files and get AI-powered analysis
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleCreateProject} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="projectName">Project Name</Label>
                  <Input
                    id="projectName"
                    value={projectName}
                    onChange={(e) => setProjectName(e.target.value)}
                    placeholder="Enter project name"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="Project location"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Project description"
                  rows={3}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="budget">Budget ($)</Label>
                <Input
                  id="budget"
                  type="number"
                  value={budget}
                  onChange={(e) => setBudget(e.target.value)}
                  placeholder="Estimated budget"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="files">Project Files</Label>
                <Input
                  id="files"
                  type="file"
                  multiple
                  accept=".pdf,.dwg,.jpg,.jpeg,.png,.doc,.docx"
                  onChange={handleFileChange}
                  required
                />
                <p className="text-sm text-gray-500">
                  Supported formats: PDF, DWG, JPG, PNG, DOC, DOCX
                </p>
              </div>

              {selectedFiles && selectedFiles.length > 0 && (
                <div className="space-y-2">
                  <Label>Selected Files:</Label>
                  <div className="space-y-1">
                    {Array.from(selectedFiles).map((file, index) => (
                      <div
                        key={index}
                        className="flex items-center space-x-2 text-sm"
                      >
                        <FileText className="h-4 w-4 text-blue-600" />
                        <span>{file.name}</span>
                        <span className="text-gray-500">
                          ({(file.size / 1024 / 1024).toFixed(2)} MB)
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* AI processing and result are now handled in the review dialog */}
              {/* AI Analysis Review Dialog */}
              <AIAnalysisReviewDialog
                open={showAIReview}
                onConfirm={handleConfirmAIReview}
                onCancel={handleCancelAIReview}
                aiResponse={aiResponse}
                formData={pendingFormData}
                isProcessing={isProcessing}
              />

              <div className="flex justify-end space-x-2 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsCreateDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isProcessing}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  {isProcessing ? "Processing..." : "Create Project"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Projects
            </CardTitle>
            <Building className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {projects.length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">In Review</CardTitle>
            <Clock className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">
              {
                projects.filter(
                  (p) =>
                    p.status === "contractor-review" ||
                    p.status === "client-review"
                ).length
              }
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Approved</CardTitle>
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
            <CardTitle className="text-sm font-medium">Total Budget</CardTitle>
            <FileText className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">
              $
              {projects
                .reduce((sum, p) => sum + (p.budget || 0), 0)
                .toLocaleString()}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Projects Table */}
      <Card>
        <CardHeader>
          <CardTitle>My Projects</CardTitle>
          <CardDescription>
            Manage your construction projects and track their progress
          </CardDescription>
        </CardHeader>
        <CardContent>
          {projects.length === 0 ? (
            <div className="text-center py-8">
              <Building className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No projects yet
              </h3>
              <p className="text-gray-600 mb-4">
                Create your first project to get started
              </p>
              <Button
                onClick={() => setIsCreateDialogOpen(true)}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <Plus className="mr-2 h-4 w-4" />
                Create Project
              </Button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Project Name</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Budget</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Created</TableHead>
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
                        <Badge className={getStatusColor(project.status)}>
                          <div className="flex items-center space-x-1">
                            {getStatusIcon(project.status)}
                            <span>{project.status.replace("-", " ")}</span>
                          </div>
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {new Date(project.createdAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => viewProjectDetails(project)}
                        >
                          <Eye className="mr-1 h-4 w-4" />
                          View
                        </Button>
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
              <Building className="h-5 w-5 text-blue-600" />
              <span>{selectedProject?.name}</span>
            </DialogTitle>
            <DialogDescription>
              AI Analysis Results and Material Specifications
            </DialogDescription>
          </DialogHeader>

          {selectedProject && selectedProject.aiAnalysis && (
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
                    Budget
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

              {/* AI Analysis Results */}
              {selectedProject.aiAnalysis && (
                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Zap className="h-5 w-5 text-blue-600" />
                    <h3 className="text-lg font-semibold">
                      {selectedProject.aiAnalysis.phase}
                    </h3>
                  </div>

                  {/* Summary Card */}
                  <Card className="bg-blue-50 border-blue-200">
                    <CardHeader>
                      <CardTitle className="text-lg text-blue-800 flex items-center space-x-2">
                        <span>{selectedProject.aiAnalysis.phase}</span>
                      </CardTitle>
                      <CardDescription className="text-blue-700">
                        {selectedProject.aiAnalysis.summary}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-3 gap-4 mb-4">
                        <div>
                          <Label className="text-sm font-medium text-blue-700">
                            Confidence Score
                          </Label>
                          <p className="text-2xl font-bold text-blue-900">
                            {(
                              selectedProject.aiAnalysis.overall_confidence *
                              100
                            ).toFixed(0)}
                            %
                          </p>
                        </div>
                        <div>
                          <Label className="text-sm font-medium text-blue-700">
                            Total Items
                          </Label>
                          <p className="text-2xl font-bold text-blue-900">
                            {selectedProject.aiAnalysis.total_items}
                          </p>
                        </div>
                        <div>
                          <Label className="text-sm font-medium text-blue-700">
                            Rooms Analyzed
                          </Label>
                          <p className="text-2xl font-bold text-blue-900">
                            {selectedProject.aiAnalysis.rooms.length}
                          </p>
                        </div>
                      </div>
                      <div className="bg-white p-3 rounded border">
                        <Label className="text-sm font-medium text-blue-700">
                          Project
                        </Label>
                        <p className="text-blue-800 font-medium">
                          {selectedProject.aiAnalysis.project}
                        </p>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Materials by Room */}
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <h4 className="font-semibold">Materials by Room</h4>
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

                    {selectedProject.aiAnalysis.rooms.map(
                      (room: any, roomIndex: number) => (
                        <Card key={roomIndex}>
                          <CardHeader className="pb-3">
                            <div className="flex justify-between items-center">
                              <CardTitle className="text-base text-blue-800">
                                {room.area}
                              </CardTitle>
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
                                    <TableHead>Location</TableHead>
                                  </TableRow>
                                </TableHeader>
                                <TableBody>
                                  {room.items.map(
                                    (item: any, itemIndex: number) => (
                                      <TableRow key={itemIndex}>
                                        <TableCell className="font-mono text-blue-600 font-medium">
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
                                            <span className="text-gray-900">
                                              {item.desc}
                                            </span>
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
                                            <span className="font-medium text-gray-900">
                                              {item.qty}
                                            </span>
                                          )}
                                        </TableCell>
                                        <TableCell>
                                          <span className="text-gray-700">
                                            {item.uom}
                                          </span>
                                        </TableCell>
                                        <TableCell>
                                          {editingRoom === room.area ? (
                                            <Input
                                              value={item.location}
                                              onChange={(e) =>
                                                handleEditItem(
                                                  roomIndex,
                                                  itemIndex,
                                                  "location",
                                                  e.target.value
                                                )
                                              }
                                              className="min-w-[120px]"
                                            />
                                          ) : (
                                            <span className="text-gray-700">
                                              {item.location}
                                            </span>
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

                  {/* Message */}
                  <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                    <p className="text-yellow-800 font-medium">
                      {selectedProject.aiAnalysis.message}
                    </p>
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="flex justify-end space-x-2">
                <Button
                  variant="outline"
                  onClick={() => setIsDetailsDialogOpen(false)}
                >
                  Close
                </Button>
                {selectedProject.status === "contractor-review" && (
                  <Button
                    onClick={handleSendToContractor}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    Send to Contractor
                  </Button>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
