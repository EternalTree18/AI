import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Calendar,
  Clock,
  Filter,
  ZoomIn,
  ZoomOut,
  AlertTriangle,
} from "lucide-react";

interface ClassSession {
  id: string;
  subject: string;
  teacher: string;
  room: string;
  section: string;
  day: string;
  startTime: string;
  endTime: string;
  hasConflict?: boolean;
  conflictType?: "room" | "teacher" | "section";
}

const TimetableGrid = () => {
  // Default state values
  const [filter, setFilter] = useState<string>("all");
  const [department, setDepartment] = useState<string>("all");
  const [zoomLevel, setZoomLevel] = useState<number>(50);
  const [view, setView] = useState<string>("week");

  // Mock data for the timetable
  const days = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  const timeSlots = [
    "7:00 AM",
    "8:00 AM",
    "9:00 AM",
    "10:00 AM",
    "11:00 AM",
    "12:00 PM",
    "1:00 PM",
    "2:00 PM",
    "3:00 PM",
    "4:00 PM",
    "5:00 PM",
    "6:00 PM",
    "7:00 PM",
  ];

  // Sample class sessions with some conflicts
  const classSessions: ClassSession[] = [
    {
      id: "1",
      subject: "CS207",
      teacher: "Sir. Jan Bermejo",
      room: "Online",
      section: "CS3A",
      day: "Monday",
      startTime: "4:00 PM",
      endTime: "7:00 PM",
    },
    {
      id: "2",
      subject: "CS207",
      teacher: "Prof. Jan Bermejo",
      room: "Online",
      section: "CS3A",
      day: "Monday",
      startTime: "4:00 PM",
      endTime: "7:00 PM",
    },
    {
      id: "3",
      subject: "CS203",
      teacher: "Ma'am. YamYam",
      room: "Comlab",
      section: "CS3A",
      day: "Tuesday",
      startTime: "1:00 PM",
      endTime: "3:00 PM",
    },
    {
      id: "4",
      subject: "SOCPRO",
      teacher: "Sir. Jam",
      room: "Comlab",
      section: "CS3A",
      day: "Tuesday",
      startTime: "3:30 PM",
      endTime: "5:00 PM",
    },
    {
      id: "5",
      subject: "SE-1",
      teacher: "Dr. FERNANDEZ",
      room: "Lab 202",
      section: "CS3A",
      day: "Wednesday",
      startTime: "9:00 AM",
      endTime: "11:00 AM",
      hasConflict: true,
      conflictType: "teacher",
    },
    {
      id: "6",
      subject: "ELECTIVE 3",
      teacher: "Prof. ALBAY",
      room: "Lab 202",
      section: "CS3A",
      day: "Wednesday",
      startTime: "10:00 AM",
      endTime: "12:00 PM",
      hasConflict: true,
      conflictType: "room",
    },
    {
      id: "7",
      subject: "ELECTIVE 3",
      teacher: "Dr. ALBAY",
      room: "Room 401",
      section: "CS3A",
      day: "Thursday",
      startTime: "2:00 PM",
      endTime: "4:00 PM",
    },
    {
      id: "8",
      subject: "ELECTIVE 2",
      teacher: "Prof. NIKKA",
      room: "Studio 101",
      section: "CS3A",
      day: "Friday",
      startTime: "10:00 AM",
      endTime: "12:00 PM",
    },
  ];

  // Function to handle drag start
  const handleDragStart = (e: React.DragEvent, session: ClassSession) => {
    e.dataTransfer.setData("sessionId", session.id);
  };

  // Function to handle drag over
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  // Function to handle drop
  const handleDrop = (e: React.DragEvent, day: string, timeSlot: string) => {
    e.preventDefault();
    const sessionId = e.dataTransfer.getData("sessionId");
    // In a real application, you would update the session's day and time here
    console.log(`Moved session ${sessionId} to ${day} at ${timeSlot}`);
  };

  // Function to get class sessions for a specific day and time slot
  const getSessionsForTimeSlot = (day: string, timeSlot: string) => {
    return classSessions.filter(
      (session) =>
        session.day === day &&
        session.startTime <= timeSlot &&
        session.endTime > timeSlot,
    );
  };

  // Function to render a class session card
  const renderSessionCard = (session: ClassSession) => {
    return (
      <Card
        key={session.id}
        className={`mb-1 cursor-grab ${session.hasConflict ? "border-red-500 border-2" : ""}`}
        draggable
        onDragStart={(e) => handleDragStart(e, session)}
      >
        <CardContent className="p-2">
          <div className="text-xs font-bold">{session.subject}</div>
          <div className="text-xs">{session.teacher}</div>
          <div className="text-xs">{session.room}</div>
          <div className="text-xs">{session.section}</div>
          {session.hasConflict && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="mt-1">
                    <Badge
                      variant="destructive"
                      className="flex items-center gap-1"
                    >
                      <AlertTriangle className="h-3 w-3" />
                      {session.conflictType === "room"
                        ? "Room Conflict"
                        : session.conflictType === "teacher"
                          ? "Teacher Conflict"
                          : "Section Conflict"}
                    </Badge>
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p>
                    {session.conflictType === "room"
                      ? "This room is double-booked during this time slot."
                      : session.conflictType === "teacher"
                        ? "This teacher is scheduled for multiple classes at the same time."
                        : "This section has multiple classes scheduled at the same time."}
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </CardContent>
      </Card>
    );
  };

  // Calculate cell height based on zoom level
  const cellHeight = 60 + zoomLevel * 0.6; // 60px at minimum, scales up with zoom

  return (
    <div className="bg-background p-4 rounded-lg border w-full h-full overflow-auto">
      {/* Controls Header */}
      <div className="flex flex-wrap justify-between items-center mb-4 gap-2">
        <div className="flex items-center gap-2">
          <Tabs defaultValue="week" onValueChange={setView}>
            <TabsList>
              <TabsTrigger value="week" className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                Week
              </TabsTrigger>
              <TabsTrigger value="day" className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                Day
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4" />
            <Select value={filter} onValueChange={setFilter}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Filter by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="room">Room</SelectItem>
                <SelectItem value="teacher">Teacher</SelectItem>
                <SelectItem value="section">Section</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center gap-2">
            <Select value={department} onValueChange={setDepartment}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Department" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Departments</SelectItem>
                <SelectItem value="cs">Computer Science</SelectItem>
                <SelectItem value="math">Mathematics</SelectItem>
                <SelectItem value="eng">Engineering</SelectItem>
                <SelectItem value="arts">Arts & Humanities</SelectItem>
                <SelectItem value="sci">Natural Sciences</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center gap-2 min-w-[200px]">
            <ZoomOut className="h-4 w-4" />
            <Slider
              value={[zoomLevel]}
              min={0}
              max={100}
              step={10}
              onValueChange={(value) => setZoomLevel(value[0])}
              className="w-24"
            />
            <ZoomIn className="h-4 w-4" />
          </div>
        </div>
      </div>

      {/* Timetable Grid */}
      <div className="overflow-auto border rounded-lg">
        <div className="grid grid-cols-[100px_repeat(6,1fr)] min-w-[900px]">
          {/* Header row with days */}
          <div className="bg-muted p-2 font-medium text-center border-b border-r">
            Time / Day
          </div>
          {days.map((day) => (
            <div
              key={day}
              className="bg-muted p-2 font-medium text-center border-b border-r"
            >
              {day}
            </div>
          ))}

          {/* Time slots rows */}
          {timeSlots.map((timeSlot) => (
            <React.Fragment key={timeSlot}>
              {/* Time slot label */}
              <div
                className="p-2 font-medium text-center border-b border-r flex items-center justify-center"
                style={{ height: `${cellHeight}px` }}
              >
                {timeSlot}
              </div>

              {/* Day cells for this time slot */}
              {days.map((day) => {
                const sessions = getSessionsForTimeSlot(day, timeSlot);
                return (
                  <div
                    key={`${day}-${timeSlot}`}
                    className="p-1 border-b border-r relative"
                    style={{ height: `${cellHeight}px` }}
                    onDragOver={handleDragOver}
                    onDrop={(e) => handleDrop(e, day, timeSlot)}
                  >
                    {sessions.map((session) => renderSessionCard(session))}
                  </div>
                );
              })}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Legend */}
      <div className="mt-4 flex items-center gap-4">
        <div className="flex items-center gap-1">
          <div className="w-4 h-4 border-red-500 border-2 rounded"></div>
          <span className="text-sm">Conflict</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-4 h-4 border rounded bg-card"></div>
          <span className="text-sm">Scheduled Class</span>
        </div>
      </div>

      {/* Action buttons */}
      <div className="mt-4 flex justify-end gap-2">
        <Button variant="outline">Reset View</Button>
        <Button variant="outline">Print Schedule</Button>
        <Button>Save Changes</Button>
      </div>
    </div>
  );
};

export default TimetableGrid;
