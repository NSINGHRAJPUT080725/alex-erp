export interface User {
  id: string;
  email: string;
  password: string;
  name: string;
  role: "architect" | "contractor" | "erp-admin" | "project-manager" | "client";
  company?: string;
  phone?: string;
  avatar?: string;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  location: string;
  budget?: number;
  status:
    | "draft"
    | "contractor-review"
    | "client-review"
    | "approved"
    | "in-progress"
    | "completed";
  clientId: string;
  architectId: string;
  contractorId?: string;
  projectManagerId?: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  progress?: number;
  spent?: number;
  files?: Array<{
    name: string;
    size: number;
    type: string;
  }>;
  aiAnalysis?: {
    phase: string;
    summary: string;
    overall_confidence: number;
    project: string;
    rooms: Array<{
      area: string;
      items: Array<{
        sku: string;
        desc: string;
        qty: number;
        uom: string;
        location: string;
        notes?: string;
      }>;
    }>;
    total_items: number;
    message: string;
  };
  contractorResponse?: {
    phase: string;
    summary: string;
    vendor_notes: string;
    rooms: Array<{
      area: string;
      items: Array<{
        sku: string;
        desc: string;
        qty: number;
        uom: string;
        location?: string;
        notes?: string;
      }>;
      install_estimate: number;
      material_estimate: number;
      currency: string;
    }>;
    project_total_estimated: number;
    site_logistics: string[];
    attachments: Array<{
      type: string;
      label: string;
      url: string;
    }>;
    message: string;
  };
  erpResponse?: {
    phase: string;
    summary: string;
    project: string;
    approved_items: Array<{
      sku: string;
      desc: string;
      qty: number;
      uom: string;
      area: string;
      unit_price: number;
      amount: number;
    }>;
    totals: {
      materials: number;
      labor: number;
      install: number;
      shipping: number;
      tax: number;
      discounts: number;
      grand_total: number;
    };
    po_number: string;
    invoices: Array<{
      invoice_id: string;
      stage: string;
      amount: number;
      due: string;
    }>;
    project_timeline: Array<{
      milestone: string;
      date: string;
    }>;
    shipment_tracking: Array<{
      item: string;
      carrier: string;
      status: string;
      est_delivery: string;
    }>;
    client_actions: string[];
    message: string;
  };
  documents: Document[];
  materials: Material[];
  timeline: TimelineEvent[];
  approvals: Approval[];
}

export interface Document {
  id: string;
  name: string;
  type: string;
  size: number;
  uploadedAt: string;
  url: string;
}

export interface Material {
  id: string;
  category: string;
  item: string;
  aiQuantity: number;
  adjustedQuantity?: number;
  unit: string;
  unitPrice: number;
  totalPrice: number;
  notes?: string;
  verified: boolean;
}

export interface TimelineEvent {
  id: string;
  projectId: string;
  title: string;
  description: string;
  date: string;
  type: "milestone" | "update" | "approval" | "issue";
  status: "completed" | "in-progress" | "pending";
}

export interface Approval {
  id: string;
  projectId: string;
  type: "quote" | "material-selection" | "change-order";
  title: string;
  description: string;
  amount: number;
  status: "pending" | "approved" | "rejected";
  requestedBy: string;
  requestedAt: string;
  respondedAt?: string;
}

// Dummy Users Data
export const dummyUsers: User[] = [
  // Architects
  {
    id: "arch-1",
    email: "sarah.architect@designstudio.com",
    password: "architect123",
    name: "Sarah Chen",
    role: "architect",
    company: "Design Studio Pro",
    phone: "+1 (555) 123-4567",
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    id: "arch-2",
    email: "mike.urban@urbanarch.com",
    password: "architect123",
    name: "Mike Rodriguez",
    role: "architect",
    company: "Urban Architects",
    phone: "+1 (555) 234-5678",
    avatar: "/placeholder.svg?height=40&width=40",
  },

  // Contractors
  {
    id: "cont-1",
    email: "john.builder@buildright.com",
    password: "contractor123",
    name: "John Builder",
    role: "contractor",
    company: "BuildRight Construction",
    phone: "+1 (555) 345-6789",
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    id: "cont-2",
    email: "lisa.construction@skyhigh.com",
    password: "contractor123",
    name: "Lisa Park",
    role: "contractor",
    company: "SkyHigh Builders",
    phone: "+1 (555) 456-7890",
    avatar: "/placeholder.svg?height=40&width=40",
  },

  // Clients
  {
    id: "client-1",
    email: "david.developer@greenfield.com",
    password: "client123",
    name: "David Kim",
    role: "client",
    company: "Greenfield Developers",
    phone: "+1 (555) 567-8901",
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    id: "client-2",
    email: "maria.properties@metro.com",
    password: "client123",
    name: "Maria Garcia",
    role: "client",
    company: "Metro Properties",
    phone: "+1 (555) 678-9012",
    avatar: "/placeholder.svg?height=40&width=40",
  },

  // ERP Admin
  {
    id: "erp-1",
    email: "admin@constructpro.com",
    password: "admin123",
    name: "Robert Johnson",
    role: "erp-admin",
    company: "ConstructPro Systems",
    phone: "+1 (555) 789-0123",
    avatar: "/placeholder.svg?height=40&width=40",
  },

  // Project Manager
  {
    id: "pm-1",
    email: "jennifer.pm@constructpro.com",
    password: "manager123",
    name: "Jennifer Wilson",
    role: "project-manager",
    company: "ConstructPro Systems",
    phone: "+1 (555) 890-1234",
    avatar: "/placeholder.svg?height=40&width=40",
  },
];

// Dummy Projects Data
export const dummyProjects: Project[] = [];

// Local Storage Functions
export const saveToLocalStorage = (key: string, data: any) => {
  if (typeof window !== "undefined") {
    localStorage.setItem(key, JSON.stringify(data));
  }
};

export const getFromLocalStorage = (key: string) => {
  if (typeof window !== "undefined") {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : null;
  }
  return null;
};

export const initializeLocalStorage = () => {
  if (typeof window !== "undefined") {
    // Initialize users if not exists
    if (!localStorage.getItem("constructpro_users")) {
      saveToLocalStorage("constructpro_users", dummyUsers);
    }

    // Initialize projects if not exists
    if (!localStorage.getItem("constructpro_projects")) {
      saveToLocalStorage("constructpro_projects", dummyProjects);
    }
  }
};

export const getCurrentUser = (): User | null => {
  return getFromLocalStorage("constructpro_current_user");
};

export const setCurrentUser = (user: User) => {
  saveToLocalStorage("constructpro_current_user", user);
};

export const logout = () => {
  if (typeof window !== "undefined") {
    localStorage.removeItem("constructpro_current_user");
  }
};

export const getUsers = (): User[] => {
  return getFromLocalStorage("constructpro_users") || dummyUsers;
};

export const getProjects = (): Project[] => {
  if (typeof window === "undefined") return [];
  const projects = localStorage.getItem("constructpro_projects");
  return projects ? JSON.parse(projects) : dummyProjects;
};

export const saveProject = (project: Project): void => {
  if (typeof window === "undefined") return;
  const projects = getProjects();
  const existingIndex = projects.findIndex((p) => p.id === project.id);

  if (existingIndex >= 0) {
    projects[existingIndex] = project;
  } else {
    projects.push(project);
  }

  localStorage.setItem("constructpro_projects", JSON.stringify(projects));
};

export const getUsersByRole = (role: string): User[] => {
  return getUsers().filter((user) => user.role === role);
};

export const getProjectsByUser = (userId: string, role: string): Project[] => {
  const projects = getProjects();
  switch (role) {
    case "architect":
      return projects.filter((p) => p.architectId === userId);
    case "contractor":
      return projects.filter((p) => p.contractorId === userId);
    case "client":
      return projects.filter((p) => p.clientId === userId);
    case "project-manager":
      return projects.filter((p) => p.projectManagerId === userId);
    default:
      return projects;
  }
};
