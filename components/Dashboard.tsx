import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Button } from "./ui/button";
import {
  BarChart,
  Calendar,
  Clock,
  Users,
  BookOpen,
  Home,
  School,
} from "lucide-react";
import { Link } from "react-router-dom";

export default function Dashboard() {
  // Mock data for dashboard stats
  const stats = [
    {
      title: "Total Classes",
      value: "124",
      icon: <BookOpen className="h-4 w-4 text-muted-foreground" />,
    },
    {
      title: "Total Teachers",
      value: "48",
      icon: <Users className="h-4 w-4 text-muted-foreground" />,
    },
    {
      title: "Total Rooms",
      value: "50",
      icon: <Home className="h-4 w-4 text-muted-foreground" />,
    },
    {
      title: "Departments",
      value: "1",
      icon: <School className="h-4 w-4 text-muted-foreground" />,
    },
  ];

  // Mock data for recent activities
  const recentActivities = [
    { action: "Schedule updated", user: "Admin", time: "10 minutes ago" },
    {
      action: "New teacher added",
      user: "Roberto Santillan",
      time: "1 hour ago",
    },
    { action: "Room conflict resolved", user: "Admin", time: "2 hours ago" },
    { action: "Schedule exported", user: "Micah Molinar", time: "Yesterday" },
  ];

  // Mock data for upcoming sessions
  const upcomingSessions = [
    {
      subject: "CS207",
      teacher: "Sir. Jan Bermejo",
      room: "Online",
      time: "4:00 PM - 7:00 PM",
      day: "Monday",
    },
    {
      subject: "CS203",
      teacher: "Ma'am. YamYam",
      room: "COMLAB",
      time: "1:30 AM - 4:00 PM",
      day: "Tuesday",
    },
    {
      subject: "SOCPRO",
      teacher: "Sir. Jam",
      room: "COMLAB",
      time: "1:00 PM - 4:30 PM",
      day: "Wednesday",
    },
    {
      subject: "CSELEC-3",
      teacher: "Ma'am. Nikka",
      room: "Online",
      time: "7:00 AM - 12:30 AM",
      day: "Friday",
    },
  ];

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
        <div className="flex items-center space-x-2">
          <Button>
            <Calendar className="mr-2 h-4 w-4" />
            Today
          </Button>
        </div>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {stats.map((stat, index) => (
              <Card key={index}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    {stat.title}
                  </CardTitle>
                  {stat.icon}
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stat.value}</div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="col-span-4">
              <CardHeader>
                <CardTitle>Upcoming Sessions</CardTitle>
                <CardDescription>
                  Sessions scheduled for this week
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {upcomingSessions.map((session, index) => (
                    <div
                      key={index}
                      className="flex items-center border-b pb-2"
                    >
                      <div className="mr-4 rounded-full bg-primary/10 p-2">
                        <Clock className="h-4 w-4 text-primary" />
                      </div>
                      <div className="flex-1 space-y-1">
                        <p className="text-sm font-medium leading-none">
                          {session.subject}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {session.teacher} • {session.room} • {session.day}{" "}
                          {session.time}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-4 flex justify-end">
                  <Link to="/timetable">
                    <Button variant="outline" size="sm">
                      View Full Schedule
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>

            <Card className="col-span-3">
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>Latest actions in the system</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentActivities.map((activity, index) => (
                    <div key={index} className="flex items-center">
                      <div className="mr-4 rounded-full bg-primary/10 p-1">
                        <div className="h-2 w-2 rounded-full bg-primary" />
                      </div>
                      <div className="flex-1 space-y-1">
                        <p className="text-sm font-medium leading-none">
                          {activity.action}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {activity.user} • {activity.time}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Analytics</CardTitle>
              <CardDescription>
                View detailed analytics of your scheduling system
              </CardDescription>
            </CardHeader>
            <CardContent className="h-[300px] flex items-center justify-center">
              <div className="flex flex-col items-center text-center">
                <BarChart className="h-16 w-16 text-muted-foreground mb-4" />
                <p className="text-sm text-muted-foreground">
                  Analytics data will be displayed here
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reports" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Reports</CardTitle>
              <CardDescription>Generate and view reports</CardDescription>
            </CardHeader>
            <CardContent className="h-[300px] flex items-center justify-center">
              <div className="flex flex-col items-center text-center">
                <div className="flex gap-2 mb-4">
                  <Button variant="outline">Weekly Report</Button>
                  <Button variant="outline">Monthly Report</Button>
                  <Button variant="outline">Custom Report</Button>
                </div>
                <p className="text-sm text-muted-foreground">
                  Select a report type to generate
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
