import type { Meta, StoryObj } from "@storybook/react";
import {
  Home,
  Settings,
  Users,
  Briefcase,
  Building2,
  Zap,
  AlertCircle,
  CheckCircle,
  Clock,
  Trash2,
  Edit,
  Search,
  Plus,
  X,
  ChevronDown,
  ChevronUp,
  Menu,
  Filter,
  Download,
  Upload,
  Eye,
  EyeOff,
  Lock,
  Unlock,
  Bell,
  MessageSquare,
  Calendar,
  MapPin,
  Phone,
  Mail,
  Activity,
  BarChart3,
  LineChart,
  PieChart,
  TrendingUp,
  TrendingDown,
  Database,
  Server,
  Wifi,
  WifiOff,
  Navigation,
  LogOut,
} from "lucide-react";

interface IconItem {
  name: string;
  icon: React.ReactNode;
  category: string;
}

function IconGallery() {
  const icons: IconItem[] = [
    // Navigation & Common
    { name: "Home", icon: <Home className="h-6 w-6" />, category: "Navigation" },
    { name: "Menu", icon: <Menu className="h-6 w-6" />, category: "Navigation" },
    { name: "Settings", icon: <Settings className="h-6 w-6" />, category: "Navigation" },
    { name: "Search", icon: <Search className="h-6 w-6" />, category: "Navigation" },

    // Business
    { name: "Users", icon: <Users className="h-6 w-6" />, category: "Business" },
    { name: "Building", icon: <Building2 className="h-6 w-6" />, category: "Business" },
    { name: "Briefcase", icon: <Briefcase className="h-6 w-6" />, category: "Business" },
    { name: "Database", icon: <Database className="h-6 w-6" />, category: "Business" },

    // Actions
    { name: "Plus", icon: <Plus className="h-6 w-6" />, category: "Actions" },
    { name: "Edit", icon: <Edit className="h-6 w-6" />, category: "Actions" },
    { name: "Trash", icon: <Trash2 className="h-6 w-6" />, category: "Actions" },
    { name: "Download", icon: <Download className="h-6 w-6" />, category: "Actions" },
    { name: "Upload", icon: <Upload className="h-6 w-6" />, category: "Actions" },
    { name: "X (Close)", icon: <X className="h-6 w-6" />, category: "Actions" },
    { name: "Filter", icon: <Filter className="h-6 w-6" />, category: "Actions" },

    // Status & Feedback
    { name: "Check Circle", icon: <CheckCircle className="h-6 w-6" />, category: "Status" },
    { name: "Alert Circle", icon: <AlertCircle className="h-6 w-6" />, category: "Status" },
    { name: "Clock", icon: <Clock className="h-6 w-6" />, category: "Status" },
    { name: "Activity", icon: <Activity className="h-6 w-6" />, category: "Status" },

    // Indicators
    { name: "Trending Up", icon: <TrendingUp className="h-6 w-6" />, category: "Indicators" },
    { name: "Trending Down", icon: <TrendingDown className="h-6 w-6" />, category: "Indicators" },
    { name: "Chevron Down", icon: <ChevronDown className="h-6 w-6" />, category: "Indicators" },
    { name: "Chevron Up", icon: <ChevronUp className="h-6 w-6" />, category: "Indicators" },

    // Security
    { name: "Lock", icon: <Lock className="h-6 w-6" />, category: "Security" },
    { name: "Unlock", icon: <Unlock className="h-6 w-6" />, category: "Security" },
    { name: "Eye", icon: <Eye className="h-6 w-6" />, category: "Security" },
    { name: "Eye Off", icon: <EyeOff className="h-6 w-6" />, category: "Security" },

    // Communication
    { name: "Bell", icon: <Bell className="h-6 w-6" />, category: "Communication" },
    { name: "Message", icon: <MessageSquare className="h-6 w-6" />, category: "Communication" },
    { name: "Mail", icon: <Mail className="h-6 w-6" />, category: "Communication" },
    { name: "Phone", icon: <Phone className="h-6 w-6" />, category: "Communication" },

    // Data & Analytics
    { name: "Bar Chart", icon: <BarChart3 className="h-6 w-6" />, category: "Analytics" },
    { name: "Line Chart", icon: <LineChart className="h-6 w-6" />, category: "Analytics" },
    { name: "Pie Chart", icon: <PieChart className="h-6 w-6" />, category: "Analytics" },
    { name: "Zap", icon: <Zap className="h-6 w-6" />, category: "Analytics" },

    // Utilities
    { name: "Calendar", icon: <Calendar className="h-6 w-6" />, category: "Utilities" },
    { name: "Map Pin", icon: <MapPin className="h-6 w-6" />, category: "Utilities" },
    { name: "Navigation", icon: <Navigation className="h-6 w-6" />, category: "Utilities" },
    { name: "Server", icon: <Server className="h-6 w-6" />, category: "Utilities" },
    { name: "Wifi", icon: <Wifi className="h-6 w-6" />, category: "Utilities" },
    { name: "Wifi Off", icon: <WifiOff className="h-6 w-6" />, category: "Utilities" },
    { name: "Log Out", icon: <LogOut className="h-6 w-6" />, category: "Utilities" },
  ];

  const categories = Array.from(new Set(icons.map((i) => i.category)));

  return (
    <div className="space-y-12">
      <div>
        <h2 className="mb-2 text-2xl font-semibold">아이콘 갤러리</h2>
        <p className="mb-8 text-gray-600">lucide-react 아이콘 라이브러리에서 자주 사용되는 아이콘들입니다.</p>
      </div>

      {categories.map((category) => (
        <div key={category} className="space-y-4">
          <h3 className="text-lg font-semibold">{category}</h3>
          <div className="grid grid-cols-3 gap-4 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8">
            {icons
              .filter((i) => i.category === category)
              .map((item, idx) => (
                <div
                  key={idx}
                  className="flex flex-col items-center gap-2 rounded-lg border border-gray-200 p-4 hover:bg-gray-50 transition"
                  title={item.name}
                >
                  <div className="text-gray-700 dark:text-gray-300">{item.icon}</div>
                  <p className="text-xs text-center text-gray-600 font-medium">{item.name}</p>
                </div>
              ))}
          </div>
        </div>
      ))}

      <div className="border-t pt-8">
        <h3 className="mb-4 text-lg font-semibold">사용 예시</h3>
        <div className="space-y-4">
          <p className="text-sm text-gray-600">
            아이콘은 <code className="bg-gray-100 px-2 py-1 rounded text-xs">lucide-react</code> 패키지에서 import합니다.
          </p>
          <pre className="bg-gray-900 text-gray-100 p-4 rounded text-sm overflow-x-auto">
            <code>{`import { Home, Settings, Edit, Trash2 } from "lucide-react";

export function IconExample() {
  return (
    <div className="flex gap-4">
      <Home className="h-6 w-6" />
      <Settings className="h-6 w-6" />
      <Edit className="h-6 w-6" />
      <Trash2 className="h-6 w-6" />
    </div>
  );
}`}</code>
          </pre>
        </div>
      </div>
    </div>
  );
}

const meta = {
  title: "Design System/Icons",
  component: IconGallery,
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component: "Icon library using lucide-react. Organized by category with common icons for navigation, actions, status, analytics, and utilities.",
      },
    },
  },
} satisfies Meta<typeof IconGallery>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Overview: Story = {
  render: () => <IconGallery />,
};
