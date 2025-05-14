import React, { useState } from "react";
import { X, AlertTriangle, Check, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "./ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Badge } from "./ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { Label } from "./ui/label";

interface ConflictItem {
  id: string;
  type: "room" | "teacher" | "section" | "student";
  severity: "high" | "medium" | "low";
  description: string;
  details: {
    conflictingItems: Array<{
      id: string;
      name: string;
      time: string;
      day: string;
      location?: string;
      teacher?: string;
      section?: string;
    }>;
  };
  suggestions: Array<{
    id: string;
    description: string;
    impact: string;
  }>;
}

interface ConflictResolutionProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  conflicts?: ConflictItem[];
  onResolve?: (conflictId: string, resolutionId: string) => void;
  onOverride?: (conflictId: string) => void;
  onManualReassign?: (conflictId: string, newAssignment: any) => void;
}

const ConflictResolution: React.FC<ConflictResolutionProps> = ({
  open = true,
  onOpenChange = () => {},
  conflicts = [
    {
      id: "conflict-1",
      type: "room",
      severity: "high",
      description: "Room 101 is double-booked on Monday at 10:00 AM",
      details: {
        conflictingItems: [
          {
            id: "class-1",
            name: "ELECTIVES",
            time: "10:00 AM - 11:30 AM",
            day: "Monday",
            location: "Room 101",
            teacher: "Dr.Drey",
            section: "CS-1A",
          },
          {
            id: "class-2",
            name: "ELECTIVES",
            time: "10:00 AM - 11:30 AM",
            day: "Monday",
            location: "Room 101",
            teacher: "Dr.Santi",
            section: "CS-1A",
          },
        ],
      },
      suggestions: [
        {
          id: "suggestion-1",
          description: "Move Electives to Room 102",
          impact: "No other conflicts created",
        },
        {
          id: "suggestion-2",
          description: "Reschedule ELECTIVES to Monday at 1:00 PM",
          impact: "Teacher has another class at 3:00 PM",
        },
      ],
    },
    {
      id: "conflict-2",
      type: "teacher",
      severity: "medium",
      description:
        "Dr.Santillan is assigned to teach two classes simultaneously",
      details: {
        conflictingItems: [
          {
            id: "class-2",
            name: "ELECTIVES",
            time: "10:00 AM - 11:30 AM",
            day: "Monday",
            location: "Room 101",
            teacher: "Dr. Caabay",
            section: "CS-2A",
          },
          {
            id: "class-3",
            name: "ELECTIVES2",
            time: "10:00 AM - 11:30 AM",
            day: "Monday",
            location: "Room 203",
            teacher: "Dr. Caabay",
            section: "CS-2A",
          },
        ],
      },
      suggestions: [
        {
          id: "suggestion-3",
          description: "Reassign Calculus II to Dr. Santillan",
          impact: "Dr. Caabay will have 3 classes on Monday",
        },
        {
          id: "suggestion-4",
          description: "Reschedule ELECTIVES2 to Wednesday at 10:00 AM",
          impact: "No other conflicts created",
        },
      ],
    },
    {
      id: "conflict-3",
      type: "section",
      severity: "low",
      description: "Section CS-1A has two classes scheduled at the same time",
      details: {
        conflictingItems: [
          {
            id: "class-1",
            name: "ELECTIVES",
            time: "10:00 AM - 11:30 AM",
            day: "Monday",
            location: "Room 101",
            teacher: "Dr.Drey",
            section: "CS-1A",
          },
          {
            id: "class-4",
            name: "CS203",
            time: "10:00 AM - 11:30 AM",
            day: "Monday",
            location: "Lab 3",
            teacher: "Prof. Molinar",
            section: "CS-1A",
          },
        ],
      },
      suggestions: [
        {
          id: "suggestion-5",
          description: "Reschedule CS203 to Monday at 1:00 PM",
          impact: "No other conflicts created",
        },
        {
          id: "suggestion-6",
          description: "Merge CS203 with ELECTIVES2",
          impact: "Session will be 3 hours long",
        },
      ],
    },
  ],
  onResolve = () => {},
  onOverride = () => {},
  onManualReassign = () => {},
}) => {
  const [activeConflict, setActiveConflict] = useState<string>(
    conflicts[0]?.id || "",
  );
  const [selectedResolution, setSelectedResolution] = useState<string>("");
  const [activeTab, setActiveTab] = useState<string>("auto");

  const currentConflict = conflicts.find(
    (conflict) => conflict.id === activeConflict,
  );

  const handleResolve = () => {
    if (activeTab === "auto" && selectedResolution) {
      onResolve(activeConflict, selectedResolution);
    } else if (activeTab === "manual") {
      // In a real implementation, you would collect the manual reassignment data
      onManualReassign(activeConflict, {
        /* manual reassignment data */
      });
    } else if (activeTab === "override") {
      onOverride(activeConflict);
    }

    // Move to next conflict or close if this was the last one
    const currentIndex = conflicts.findIndex((c) => c.id === activeConflict);
    if (currentIndex < conflicts.length - 1) {
      setActiveConflict(conflicts[currentIndex + 1].id);
      setSelectedResolution("");
      setActiveTab("auto");
    } else {
      onOpenChange(false);
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "high":
        return "bg-destructive text-destructive-foreground";
      case "medium":
        return "bg-amber-500 text-white";
      case "low":
        return "bg-blue-500 text-white";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  const getConflictTypeIcon = (type: string) => {
    switch (type) {
      case "room":
        return "🏢";
      case "teacher":
        return "👨‍🏫";
      case "section":
        return "👥";
      case "student":
        return "🧑‍🎓";
      default:
        return "⚠️";
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto bg-background">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <AlertTriangle className="h-5 w-5 text-destructive" />
            Scheduling Conflicts Detected
          </DialogTitle>
          <DialogDescription>
            {conflicts.length} conflicts need to be resolved before finalizing
            the schedule.
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 gap-4">
          {/* Conflict Navigation */}
          <div className="flex flex-wrap gap-2">
            {conflicts.map((conflict, index) => (
              <Badge
                key={conflict.id}
                variant={conflict.id === activeConflict ? "default" : "outline"}
                className="cursor-pointer"
                onClick={() => {
                  setActiveConflict(conflict.id);
                  setSelectedResolution("");
                  setActiveTab("auto");
                }}
              >
                {index + 1}: {getConflictTypeIcon(conflict.type)}{" "}
                {conflict.type.charAt(0).toUpperCase() + conflict.type.slice(1)}
              </Badge>
            ))}
          </div>

          {/* Current Conflict Details */}
          {currentConflict && (
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">
                    {currentConflict.description}
                  </CardTitle>
                  <Badge className={getSeverityColor(currentConflict.severity)}>
                    {currentConflict.severity.toUpperCase()} SEVERITY
                  </Badge>
                </div>
                <CardDescription>
                  The following items are in conflict:
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {currentConflict.details.conflictingItems.map(
                    (item, index) => (
                      <motion.div
                        key={item.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="p-3 border rounded-md bg-muted/30"
                      >
                        <div className="font-medium">{item.name}</div>
                        <div className="text-sm text-muted-foreground">
                          {item.day}, {item.time} • {item.location} •{" "}
                          {item.teacher} • Section: {item.section}
                        </div>
                      </motion.div>
                    ),
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Resolution Options */}
          {currentConflict && (
            <Tabs
              value={activeTab}
              onValueChange={setActiveTab}
              className="w-full"
            >
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="auto">Auto-suggest</TabsTrigger>
                <TabsTrigger value="manual">Manual Reassign</TabsTrigger>
                <TabsTrigger value="override">Override Warning</TabsTrigger>
              </TabsList>

              <TabsContent value="auto" className="space-y-4 mt-4">
                <RadioGroup
                  value={selectedResolution}
                  onValueChange={setSelectedResolution}
                  className="space-y-3"
                >
                  {currentConflict.suggestions.map((suggestion) => (
                    <div
                      key={suggestion.id}
                      className="flex items-start space-x-2 border rounded-md p-3 hover:bg-accent/50 transition-colors"
                    >
                      <RadioGroupItem
                        value={suggestion.id}
                        id={suggestion.id}
                        className="mt-1"
                      />
                      <div className="grid gap-1.5">
                        <Label htmlFor={suggestion.id} className="font-medium">
                          {suggestion.description}
                        </Label>
                        <p className="text-sm text-muted-foreground">
                          Impact: {suggestion.impact}
                        </p>
                      </div>
                    </div>
                  ))}
                </RadioGroup>
              </TabsContent>

              <TabsContent value="manual" className="space-y-4 mt-4">
                <div className="border rounded-md p-4 bg-muted/30">
                  <h3 className="font-medium mb-2">Manual Reassignment</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Use this option to manually reassign the conflicting items
                    to different times, rooms, or teachers.
                  </p>
                  <div className="text-center text-muted-foreground py-8">
                    Manual reassignment controls would be implemented here based
                    on the specific conflict type.
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="override" className="space-y-4 mt-4">
                <div className="border rounded-md p-4 bg-destructive/10">
                  <h3 className="font-medium mb-2 flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4 text-destructive" />
                    Override Warning
                  </h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    This will ignore the conflict and keep the current schedule
                    as is. This is not recommended and may cause issues.
                  </p>
                  <div className="bg-destructive/5 p-3 rounded-md text-sm">
                    I understand that overriding this warning may result in
                    scheduling problems including double-booked rooms, teacher
                    conflicts, or student section overlaps.
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          )}
        </div>

        <DialogFooter className="flex justify-between items-center mt-4">
          <div className="text-sm text-muted-foreground">
            Conflict {conflicts.findIndex((c) => c.id === activeConflict) + 1}{" "}
            of {conflicts.length}
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleResolve}
              disabled={activeTab === "auto" && !selectedResolution}
              className="gap-1"
            >
              {activeTab === "override" ? "Override" : "Apply Resolution"}
              {activeTab !== "override" ? (
                <Check className="h-4 w-4" />
              ) : (
                <ArrowRight className="h-4 w-4" />
              )}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ConflictResolution;
