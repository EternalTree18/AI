import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  Bell,
  Calendar,
  Users,
  BookOpen,
  AlertTriangle,
  Check,
  X,
  Clock,
} from "lucide-react";

interface Notification {
  id: number;
  title: string;
  description: string;
  time: string;
  type: "conflict" | "resource" | "system" | "schedule";
  read: boolean;
}

const Notifications = () => {
  // Mock notifications data
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: 1,
      title: "Scheduling Conflict Detected",
      description:
        "Room 101 has been double-booked for CS101 and MATH201 on Monday at 10:00 AM.",
      time: "10 minutes ago",
      type: "conflict",
      read: false,
    },
    {
      id: 2,
      title: "New Resource Added",
      description: "Lecture Hall B has been added to available rooms.",
      time: "1 hour ago",
      type: "resource",
      read: false,
    },
    {
      id: 3,
      title: "System Maintenance",
      description:
        "The system will be down for maintenance on Sunday from 2:00 AM to 4:00 AM.",
      time: "3 hours ago",
      type: "system",
      read: true,
    },
    {
      id: 4,
      title: "Schedule Published",
      description:
        "The Fall 2023 schedule has been published and is now available for viewing.",
      time: "1 day ago",
      type: "schedule",
      read: true,
    },
    {
      id: 5,
      title: "Teacher Availability Updated",
      description:
        "Prof. Johnson has updated their availability for the next semester.",
      time: "2 days ago",
      type: "resource",
      read: true,
    },
  ]);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAsRead = (id: number) => {
    setNotifications(
      notifications.map((notification) =>
        notification.id === id ? { ...notification, read: true } : notification,
      ),
    );
  };

  const markAllAsRead = () => {
    setNotifications(
      notifications.map((notification) => ({ ...notification, read: true })),
    );
  };

  const deleteNotification = (id: number) => {
    setNotifications(
      notifications.filter((notification) => notification.id !== id),
    );
  };

  const getIconForType = (type: string) => {
    switch (type) {
      case "conflict":
        return <AlertTriangle className="h-5 w-5 text-destructive" />;
      case "resource":
        return <Users className="h-5 w-5 text-blue-500" />;
      case "system":
        return <Bell className="h-5 w-5 text-purple-500" />;
      case "schedule":
        return <Calendar className="h-5 w-5 text-green-500" />;
      default:
        return <Bell className="h-5 w-5" />;
    }
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <h1 className="text-3xl font-bold">Notifications</h1>
          {unreadCount > 0 && (
            <Badge variant="destructive" className="ml-2">
              {unreadCount} new
            </Badge>
          )}
        </div>
        {unreadCount > 0 && (
          <Button variant="outline" onClick={markAllAsRead}>
            Mark all as read
          </Button>
        )}
      </div>

      <Tabs defaultValue="all" className="w-full">
        <TabsList className="grid w-full grid-cols-5 lg:w-[600px]">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="conflicts">Conflicts</TabsTrigger>
          <TabsTrigger value="resources">Resources</TabsTrigger>
          <TabsTrigger value="schedules">Schedules</TabsTrigger>
          <TabsTrigger value="system">System</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="mt-4 space-y-4">
          {notifications.length > 0 ? (
            notifications.map((notification) => (
              <NotificationCard
                key={notification.id}
                notification={notification}
                onMarkAsRead={markAsRead}
                onDelete={deleteNotification}
              />
            ))
          ) : (
            <EmptyState message="No notifications to display" />
          )}
        </TabsContent>

        <TabsContent value="conflicts" className="mt-4 space-y-4">
          {notifications.filter((n) => n.type === "conflict").length > 0 ? (
            notifications
              .filter((n) => n.type === "conflict")
              .map((notification) => (
                <NotificationCard
                  key={notification.id}
                  notification={notification}
                  onMarkAsRead={markAsRead}
                  onDelete={deleteNotification}
                />
              ))
          ) : (
            <EmptyState message="No conflict notifications" />
          )}
        </TabsContent>

        <TabsContent value="resources" className="mt-4 space-y-4">
          {notifications.filter((n) => n.type === "resource").length > 0 ? (
            notifications
              .filter((n) => n.type === "resource")
              .map((notification) => (
                <NotificationCard
                  key={notification.id}
                  notification={notification}
                  onMarkAsRead={markAsRead}
                  onDelete={deleteNotification}
                />
              ))
          ) : (
            <EmptyState message="No resource notifications" />
          )}
        </TabsContent>

        <TabsContent value="schedules" className="mt-4 space-y-4">
          {notifications.filter((n) => n.type === "schedule").length > 0 ? (
            notifications
              .filter((n) => n.type === "schedule")
              .map((notification) => (
                <NotificationCard
                  key={notification.id}
                  notification={notification}
                  onMarkAsRead={markAsRead}
                  onDelete={deleteNotification}
                />
              ))
          ) : (
            <EmptyState message="No schedule notifications" />
          )}
        </TabsContent>

        <TabsContent value="system" className="mt-4 space-y-4">
          {notifications.filter((n) => n.type === "system").length > 0 ? (
            notifications
              .filter((n) => n.type === "system")
              .map((notification) => (
                <NotificationCard
                  key={notification.id}
                  notification={notification}
                  onMarkAsRead={markAsRead}
                  onDelete={deleteNotification}
                />
              ))
          ) : (
            <EmptyState message="No system notifications" />
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

interface NotificationCardProps {
  notification: Notification;
  onMarkAsRead: (id: number) => void;
  onDelete: (id: number) => void;
}

const NotificationCard = ({
  notification,
  onMarkAsRead,
  onDelete,
}: NotificationCardProps) => {
  return (
    <Card
      className={
        notification.read ? "bg-card" : "bg-card border-l-4 border-l-primary"
      }
    >
      <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
        <div className="flex items-center">
          <div className="mr-2">{getIconForType(notification.type)}</div>
          <CardTitle className="text-base font-semibold">
            {notification.title}
          </CardTitle>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={() => onDelete(notification.id)}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm">{notification.description}</p>
      </CardContent>
      <CardFooter className="flex justify-between pt-0">
        <div className="flex items-center text-xs text-muted-foreground">
          <Clock className="mr-1 h-3 w-3" />
          {notification.time}
        </div>
        {!notification.read && (
          <Button
            variant="outline"
            size="sm"
            className="h-8"
            onClick={() => onMarkAsRead(notification.id)}
          >
            <Check className="mr-1 h-4 w-4" />
            Mark as read
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

interface EmptyStateProps {
  message: string;
}

const EmptyState = ({ message }: EmptyStateProps) => {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <Bell className="h-12 w-12 text-muted-foreground mb-4" />
      <h3 className="text-lg font-medium">{message}</h3>
      <p className="text-sm text-muted-foreground mt-1">
        You're all caught up!
      </p>
    </div>
  );
};

// Helper function to get icon for notification type
const getIconForType = (type: string) => {
  switch (type) {
    case "conflict":
      return <AlertTriangle className="h-5 w-5 text-destructive" />;
    case "resource":
      return <Users className="h-5 w-5 text-blue-500" />;
    case "system":
      return <Bell className="h-5 w-5 text-purple-500" />;
    case "schedule":
      return <Calendar className="h-5 w-5 text-green-500" />;
    default:
      return <Bell className="h-5 w-5" />;
  }
};

export default Notifications;
