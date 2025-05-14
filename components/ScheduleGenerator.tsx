import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  AlertCircle,
  CheckCircle,
  Play,
  Save,
  Settings,
  X,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";

interface ScheduleGeneratorProps {
  onScheduleGenerated?: (schedule: any) => void;
  onConflictsDetected?: (conflicts: any[]) => void;
}

const ScheduleGenerator = ({
  onScheduleGenerated = () => {},
  onConflictsDetected = () => {},
}: ScheduleGeneratorProps) => {
  const [activeTab, setActiveTab] = useState("parameters");
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [generationResult, setGenerationResult] = useState<
    "success" | "conflicts" | null
  >(null);
  const [conflicts, setConflicts] = useState<any[]>([]);

  // Mock parameters for the UI
  const [parameters, setParameters] = useState({
    prioritizeTeacherPreferences: true,
    allowLunchBreaks: true,
    maximumDailyHours: 8,
    minimizeRoomChanges: true,
    balanceWeeklyLoad: true,
    avoidBackToBack: false,
    timeBlockDuration: 60, // minutes
    startTime: "08:00",
    endTime: "17:00",
    daysOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
    department: "all",
  });

  const handleParameterChange = (key: string, value: any) => {
    setParameters((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleRunScheduler = () => {
    setIsGenerating(true);
    setProgress(0);

    // Simulate the scheduling process
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsGenerating(false);

          // Simulate either success or conflicts
          const hasConflicts = Math.random() > 0.5;
          if (hasConflicts) {
            const mockConflicts = [
              {
                type: "room",
                description: "Room 101 double-booked on Monday at 10:00",
                severity: "high",
              },
              {
                type: "teacher",
                description:
                  "Prof. Smith scheduled for two classes simultaneously",
                severity: "high",
              },
              {
                type: "section",
                description: "CS101 Section A has overlapping classes",
                severity: "medium",
              },
              {
                type: "student",
                description:
                  "Irregular student John Doe has conflicting schedule",
                severity: "low",
              },
            ];
            setConflicts(mockConflicts);
            setGenerationResult("conflicts");
            onConflictsDetected(mockConflicts);
          } else {
            setGenerationResult("success");
            onScheduleGenerated({
              /* mock schedule data */
            });
          }

          return 100;
        }
        return prev + 5;
      });
    }, 200);

    return () => clearInterval(interval);
  };

  const handleResetResults = () => {
    setGenerationResult(null);
    setConflicts([]);
  };

  const handlePublishSchedule = () => {
    // Logic to publish the schedule would go here
    alert("Schedule published successfully!");
  };

  return (
    <div className="w-full h-full bg-background p-6">
      <Card className="w-full h-full">
        <CardHeader>
          <CardTitle className="text-2xl flex items-center gap-2">
            <Settings className="h-6 w-6" />
            Schedule Assistant
          </CardTitle>
          <CardDescription></CardDescription>
        </CardHeader>
        <CardContent className="h-[calc(100%-180px)]">
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full h-full"
          >
            <TabsList className="grid grid-cols-3 w-full max-w-md mb-6">
              <TabsTrigger value="parameters">Parameters</TabsTrigger>
              <TabsTrigger value="constraints">Constraints</TabsTrigger>
              <TabsTrigger value="results" disabled={generationResult === null}>
                Results
                {generationResult === "conflicts" && (
                  <Badge variant="destructive" className="ml-2">
                    {conflicts.length}
                  </Badge>
                )}
              </TabsTrigger>
            </TabsList>

            <TabsContent
              value="parameters"
              className="h-[calc(100%-48px)] overflow-auto"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Time Settings</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="timeBlockDuration">
                        Time Block Duration (minutes)
                      </Label>
                      <div className="flex items-center gap-4">
                        <Slider
                          id="timeBlockDuration"
                          value={[parameters.timeBlockDuration]}
                          min={30}
                          max={120}
                          step={15}
                          onValueChange={(value) =>
                            handleParameterChange("timeBlockDuration", value[0])
                          }
                          className="flex-1"
                        />
                        <span className="w-12 text-right">
                          {parameters.timeBlockDuration}
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="startTime">Start Time</Label>
                        <Input
                          id="startTime"
                          type="time"
                          value={parameters.startTime}
                          onChange={(e) =>
                            handleParameterChange("startTime", e.target.value)
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="endTime">End Time</Label>
                        <Input
                          id="endTime"
                          type="time"
                          value={parameters.endTime}
                          onChange={(e) =>
                            handleParameterChange("endTime", e.target.value)
                          }
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>Days of Week</Label>
                      <div className="flex flex-wrap gap-2">
                        {[
                          "Monday",
                          "Tuesday",
                          "Wednesday",
                          "Thursday",
                          "Friday",
                          "Saturday",
                        ].map((day) => (
                          <Badge
                            key={day}
                            variant={
                              parameters.daysOfWeek.includes(day)
                                ? "default"
                                : "outline"
                            }
                            className="cursor-pointer"
                            onClick={() => {
                              if (parameters.daysOfWeek.includes(day)) {
                                handleParameterChange(
                                  "daysOfWeek",
                                  parameters.daysOfWeek.filter(
                                    (d) => d !== day,
                                  ),
                                );
                              } else {
                                handleParameterChange("daysOfWeek", [
                                  ...parameters.daysOfWeek,
                                  day,
                                ]);
                              }
                            }}
                          >
                            {day}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Department & Scope</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="department">Department</Label>
                      <Select
                        value={parameters.department}
                        onValueChange={(value) =>
                          handleParameterChange("department", value)
                        }
                      >
                        <SelectTrigger id="department">
                          <SelectValue placeholder="Select department" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Departments</SelectItem>
                          <SelectItem value="cs">Computer Science</SelectItem>
                          <SelectItem value="math">Mathematics</SelectItem>
                          <SelectItem value="eng">Engineering</SelectItem>
                          <SelectItem value="arts">
                            Arts & Humanities
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="maximumDailyHours">
                        Maximum Daily Hours
                      </Label>
                      <div className="flex items-center gap-4">
                        <Slider
                          id="maximumDailyHours"
                          value={[parameters.maximumDailyHours]}
                          min={4}
                          max={12}
                          step={1}
                          onValueChange={(value) =>
                            handleParameterChange("maximumDailyHours", value[0])
                          }
                          className="flex-1"
                        />
                        <span className="w-8 text-right">
                          {parameters.maximumDailyHours}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent
              value="constraints"
              className="h-[calc(100%-48px)] overflow-auto"
            >
              <Card>
                <CardHeader>
                  <CardTitle>Scheduling Preferences</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="prioritizeTeacherPreferences">
                          Prioritize Teacher Preferences
                        </Label>
                        <p className="text-sm text-muted-foreground">
                          Schedule classes according to teacher availability
                          preferences
                        </p>
                      </div>
                      <Switch
                        id="prioritizeTeacherPreferences"
                        checked={parameters.prioritizeTeacherPreferences}
                        onCheckedChange={(checked) =>
                          handleParameterChange(
                            "prioritizeTeacherPreferences",
                            checked,
                          )
                        }
                      />
                    </div>
                    <Separator />

                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="allowLunchBreaks">
                          Allow Lunch Breaks
                        </Label>
                        <p className="text-sm text-muted-foreground">
                          Reserve 12:00-13:00 for lunch breaks when possible
                        </p>
                      </div>
                      <Switch
                        id="allowLunchBreaks"
                        checked={parameters.allowLunchBreaks}
                        onCheckedChange={(checked) =>
                          handleParameterChange("allowLunchBreaks", checked)
                        }
                      />
                    </div>
                    <Separator />

                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="minimizeRoomChanges">
                          Minimize Room Changes
                        </Label>
                        <p className="text-sm text-muted-foreground">
                          Try to keep classes for the same section in the same
                          room
                        </p>
                      </div>
                      <Switch
                        id="minimizeRoomChanges"
                        checked={parameters.minimizeRoomChanges}
                        onCheckedChange={(checked) =>
                          handleParameterChange("minimizeRoomChanges", checked)
                        }
                      />
                    </div>
                    <Separator />

                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="balanceWeeklyLoad">
                          Balance Weekly Load
                        </Label>
                        <p className="text-sm text-muted-foreground">
                          Distribute classes evenly throughout the week
                        </p>
                      </div>
                      <Switch
                        id="balanceWeeklyLoad"
                        checked={parameters.balanceWeeklyLoad}
                        onCheckedChange={(checked) =>
                          handleParameterChange("balanceWeeklyLoad", checked)
                        }
                      />
                    </div>
                    <Separator />

                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="avoidBackToBack">
                          Avoid Back-to-Back Classes
                        </Label>
                        <p className="text-sm text-muted-foreground">
                          Add buffer time between classes when possible
                        </p>
                      </div>
                      <Switch
                        id="avoidBackToBack"
                        checked={parameters.avoidBackToBack}
                        onCheckedChange={(checked) =>
                          handleParameterChange("avoidBackToBack", checked)
                        }
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent
              value="results"
              className="h-[calc(100%-48px)] overflow-hidden"
            >
              {generationResult === "success" ? (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="h-full flex flex-col items-center justify-center"
                >
                  <div className="text-center space-y-4 max-w-md">
                    <div className="mx-auto bg-green-100 text-green-800 rounded-full p-3 w-16 h-16 flex items-center justify-center">
                      <CheckCircle className="h-10 w-10" />
                    </div>
                    <h3 className="text-2xl font-semibold">
                      Schedule Generated Successfully!
                    </h3>
                    <p className="text-muted-foreground">
                      The scheduling algorithm has created a conflict-free
                      timetable. You can now review and publish it.
                    </p>
                    <div className="pt-4 flex gap-4 justify-center">
                      <Button onClick={handleResetResults} variant="outline">
                        Generate New Schedule
                      </Button>
                      <Button onClick={handlePublishSchedule}>
                        Publish Schedule
                      </Button>
                    </div>
                  </div>
                </motion.div>
              ) : generationResult === "conflicts" ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="h-full flex flex-col"
                >
                  <Alert variant="destructive" className="mb-4">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Conflicts Detected</AlertTitle>
                    <AlertDescription>
                      The scheduling algorithm found {conflicts.length}{" "}
                      conflicts that need to be resolved.
                    </AlertDescription>
                  </Alert>

                  <ScrollArea className="flex-1 border rounded-md">
                    <div className="p-4 space-y-3">
                      {conflicts.map((conflict, index) => (
                        <Card
                          key={index}
                          className="border-l-4"
                          style={{
                            borderLeftColor:
                              conflict.severity === "high"
                                ? "rgb(239, 68, 68)"
                                : conflict.severity === "medium"
                                  ? "rgb(234, 179, 8)"
                                  : "rgb(59, 130, 246)",
                          }}
                        >
                          <CardContent className="p-4 flex justify-between items-center">
                            <div>
                              <Badge
                                variant={
                                  {
                                    high: "destructive",
                                    medium: "default",
                                    low: "secondary",
                                  }[conflict.severity] as any
                                }
                              >
                                {conflict.type.toUpperCase()}
                              </Badge>
                              <p className="mt-2">{conflict.description}</p>
                            </div>
                            <Button size="sm" variant="ghost">
                              <X className="h-4 w-4 mr-2" />
                              Resolve
                            </Button>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </ScrollArea>

                  <div className="mt-4 flex justify-between">
                    <Button onClick={handleResetResults} variant="outline">
                      Reset
                    </Button>
                    <Button onClick={() => setActiveTab("parameters")}>
                      Adjust Parameters
                    </Button>
                  </div>
                </motion.div>
              ) : null}
            </TabsContent>
          </Tabs>
        </CardContent>

        <CardFooter className="border-t p-4 bg-muted/20">
          {isGenerating ? (
            <div className="w-full space-y-2">
              <div className="flex justify-between text-sm">
                <span>Generating schedule...</span>
                <span>{progress}%</span>
              </div>
              <Progress value={progress} className="w-full" />
            </div>
          ) : generationResult ? (
            <div className="w-full flex justify-between">
              <Button variant="outline" onClick={handleResetResults}>
                <X className="h-4 w-4 mr-2" />
                Reset
              </Button>
              {generationResult === "success" && (
                <Button onClick={handlePublishSchedule}>
                  <Save className="h-4 w-4 mr-2" />
                  Publish Schedule
                </Button>
              )}
            </div>
          ) : (
            <Button className="ml-auto" size="lg" onClick={handleRunScheduler}>
              <Play className="h-4 w-4 mr-2" />
              Run Scheduling Algorithm
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  );
};

export default ScheduleGenerator;
