import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Bell,
  Calendar,
  Settings,
  Users,
  BookOpen,
  Home as HomeIcon,
  LogOut,
} from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import TimetableGrid from "./TimetableGrid";
import ResourceManagement from "./ResourceManagement";
import ScheduleGenerator from "./ScheduleGenerator";
import ConflictResolution from "./ConflictResolution";
import Dashboard from "./Dashboard";
import SettingsComponent from "./Settings";
import NotificationsComponent from "./Notifications";

const Home = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("timetable");
  const [showConflictModal, setShowConflictModal] = useState(false);
  const [notifications, setNotifications] = useState(3); // Example notification count
  const [showNotifications, setShowNotifications] = useState(false);

  // Mock user data
  const user = {
    name: "DREYZIE",
    email: "admin@university.edu",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=admin",
    role: "Administrator",
  };

  // Mock function to handle conflict detection
  const handleConflictDetection = () => {
    setShowConflictModal(true);
  };

  // Toggle notifications panel
  const toggleNotifications = () => {
    setShowNotifications(!showNotifications);
    if (!showNotifications) {
      setActiveTab("notifications");
    }
  };

  // Use auth context for logout functionality
  const { logout } = useAuth();

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <div className="w-64 border-r bg-card p-4 flex flex-col">
        <div className="flex items-center gap-2 mb-8">
          <Calendar className="h-6 w-6 text-primary" />
          <h1 className="text-xl font-bold">Smart Scheduling</h1>
        </div>

        <nav className="space-y-2 flex-1">
          <Button
            variant={activeTab === "timetable" ? "default" : "ghost"}
            className="w-full justify-start"
            onClick={() => setActiveTab("timetable")}
          >
            <Calendar className="mr-2 h-4 w-4" />
            Timetable Grid
          </Button>

          <Button
            variant={activeTab === "resources" ? "default" : "ghost"}
            className="w-full justify-start"
            onClick={() => setActiveTab("resources")}
          >
            <Users className="mr-2 h-4 w-4" />
            Resource Management
          </Button>

          <Button
            variant={activeTab === "generator" ? "default" : "ghost"}
            className="w-full justify-start"
            onClick={() => setActiveTab("generator")}
          >
            <BookOpen className="mr-2 h-4 w-4" />
            Schedule Assistant
          </Button>

          <Button
            variant={activeTab === "dashboard" ? "default" : "ghost"}
            className="w-full justify-start"
            onClick={() => setActiveTab("dashboard")}
          >
            <HomeIcon className="mr-2 h-4 w-4" />
            Dashboard
          </Button>

          <Button
            variant={activeTab === "settings" ? "default" : "ghost"}
            className="w-full justify-start"
            onClick={() => setActiveTab("settings")}
          >
            <Settings className="mr-2 h-4 w-4" />
            Settings
          </Button>

          <Button
            variant={activeTab === "notifications" ? "default" : "ghost"}
            className="w-full justify-start"
            onClick={() => setActiveTab("notifications")}
          >
            <Bell className="mr-2 h-4 w-4" />
            Notifications
            {notifications > 0 && (
              <span className="ml-auto bg-destructive text-destructive-foreground text-xs rounded-full h-5 w-5 flex items-center justify-center">
                {notifications}
              </span>
            )}
          </Button>
        </nav>

        <div className="mt-auto pt-4 border-t">
          <div className="flex items-center gap-3 mb-4">
            <Avatar>
              <AvatarImage src={user.avatar} alt={user.name} />
              <AvatarFallback>AU</AvatarFallback>
            </Avatar>
            <div>
              <p className="text-sm font-medium">{user.name}</p>
              <p className="text-xs text-muted-foreground">{user.role}</p>
            </div>
          </div>
          <Button
            variant="outline"
            className="w-full justify-start"
            onClick={() => {
              logout();
              navigate("/login");
            }}
          >
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="h-16 border-b bg-card flex items-center justify-between px-6">
          <h2 className="text-lg font-semibold">
            {activeTab === "timetable" && "Timetable Grid"}
            {activeTab === "resources" && "Resource Management"}
            {activeTab === "generator" && "Schedule Generator"}
            {activeTab === "dashboard" && "Dashboard"}
            {activeTab === "settings" && "Settings"}
            {activeTab === "notifications" && "Notifications"}
          </h2>

          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              size="icon"
              className="relative"
              onClick={toggleNotifications}
            >
              <Bell className="h-5 w-5" />
              {notifications > 0 && (
                <span className="absolute -top-1 -right-1 bg-destructive text-destructive-foreground text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {notifications}
                </span>
              )}
            </Button>

            <Button variant="outline" onClick={() => setActiveTab("settings")}>
              <Settings className="mr-2 h-4 w-4" />
              Settings
            </Button>
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 overflow-auto p-6 bg-background">
          {activeTab === "timetable" && (
            <TimetableGrid onConflictDetected={handleConflictDetection} />
          )}
          {activeTab === "resources" && <ResourceManagement />}
          {activeTab === "generator" && (
            <ScheduleGenerator onConflictDetected={handleConflictDetection} />
          )}
          {activeTab === "dashboard" && <Dashboard />}
          {activeTab === "settings" && <SettingsComponent />}
          {activeTab === "notifications" && <NotificationsComponent />}

          {/* Conflict Resolution Modal */}
          {showConflictModal && (
            <ConflictResolution
              isOpen={showConflictModal}
              onClose={() => setShowConflictModal(false)}
            />
          )}
        </main>
      </div>
    </div>
  );
};

export default Home;
