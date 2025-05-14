import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { DataTable, type Column } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  Search,
  Plus,
  Edit,
  Trash2,
  Filter,
  Download,
  Upload,
  Check,
  X,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import * as classSectionService from "@/services/classSectionService";
import type {
  ClassSection,
  ClassSectionFilters,
} from "@/services/classSectionService";

const ClassSectionManagement: React.FC = () => {
  const { toast } = useToast();
  const [classSections, setClassSections] = useState<ClassSection[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isFilterDialogOpen, setIsFilterDialogOpen] = useState(false);
  const [selectedClassSection, setSelectedClassSection] =
    useState<ClassSection | null>(null);
  const [filters, setFilters] = useState<ClassSectionFilters>({});

  // Form state for adding/editing class sections
  const [formData, setFormData] = useState({
    name: "",
    subject: "",
    teacher: "",
    room: "",
    schedule: [
      {
        day: "Monday",
        startTime: "09:00",
        endTime: "10:30",
      },
    ],
    capacity: 0,
    enrollment: 0,
    status: "active" as "active" | "inactive",
  });

  // Filter form state
  const [filterForm, setFilterForm] = useState({
    subject: "",
    teacher: "",
    room: "",
    status: "",
  });

  // Days of the week for schedule
  const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

  // Fetch class sections on component mount
  useEffect(() => {
    fetchClassSections();
  }, []);

  // Fetch class sections based on search query and filters
  const fetchClassSections = async () => {
    setIsLoading(true);
    try {
      let fetchedClassSections;
      if (searchQuery) {
        fetchedClassSections =
          await classSectionService.searchClassSections(searchQuery);
      } else if (Object.values(filters).some((value) => value)) {
        fetchedClassSections =
          await classSectionService.filterClassSections(filters);
      } else {
        fetchedClassSections = await classSectionService.getClassSections();
      }
      setClassSections(fetchedClassSections);
    } catch (error) {
      console.error("Error fetching class sections:", error);
      toast({
        title: "Error",
        description: "Failed to fetch class sections. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  // Handle search submit
  const handleSearch = async () => {
    await fetchClassSections();
  };

  // Handle form input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]:
        id === "capacity" || id === "enrollment" ? parseInt(value) || 0 : value,
    }));
  };

  // Handle select change
  const handleSelectChange = (value: string, field: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // Handle schedule change
  const handleScheduleChange = (
    index: number,
    field: string,
    value: string,
  ) => {
    setFormData((prev) => {
      const newSchedule = [...prev.schedule];
      newSchedule[index] = { ...newSchedule[index], [field]: value };
      return { ...prev, schedule: newSchedule };
    });
  };

  // Add schedule slot
  const addScheduleSlot = () => {
    setFormData((prev) => ({
      ...prev,
      schedule: [
        ...prev.schedule,
        { day: "Monday", startTime: "09:00", endTime: "10:30" },
      ],
    }));
  };

  // Remove schedule slot
  const removeScheduleSlot = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      schedule: prev.schedule.filter((_, i) => i !== index),
    }));
  };

  // Handle filter form change
  const handleFilterChange = (value: string, field: string) => {
    setFilterForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // Apply filters
  const applyFilters = async () => {
    const newFilters: ClassSectionFilters = {};
    if (filterForm.subject) newFilters.subject = filterForm.subject;
    if (filterForm.teacher) newFilters.teacher = filterForm.teacher;
    if (filterForm.room) newFilters.room = filterForm.room;
    if (filterForm.status)
      newFilters.status = filterForm.status as "active" | "inactive";

    setFilters(newFilters);
    setIsFilterDialogOpen(false);
    await fetchClassSections();
  };

  // Reset filters
  const resetFilters = () => {
    setFilterForm({
      subject: "",
      teacher: "",
      room: "",
      status: "",
    });
    setFilters({});
    setIsFilterDialogOpen(false);
    fetchClassSections();
  };

  // Open edit dialog and populate form with selected class section data
  const openEditDialog = (classSection: ClassSection) => {
    setSelectedClassSection(classSection);
    setFormData({
      name: classSection.name,
      subject: classSection.subject,
      teacher: classSection.teacher,
      room: classSection.room,
      schedule: [...classSection.schedule],
      capacity: classSection.capacity,
      enrollment: classSection.enrollment,
      status: classSection.status,
    });
    setIsEditDialogOpen(true);
  };

  // Open delete confirmation dialog
  const openDeleteDialog = (classSection: ClassSection) => {
    setSelectedClassSection(classSection);
    setIsDeleteDialogOpen(true);
  };

  // Handle add class section
  const handleAddClassSection = async () => {
    try {
      await classSectionService.createClassSection(formData);
      setIsAddDialogOpen(false);
      resetForm();
      fetchClassSections();
      toast({
        title: "Success",
        description: "Class section added successfully.",
      });
    } catch (error) {
      console.error("Error adding class section:", error);
      toast({
        title: "Error",
        description: "Failed to add class section. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Handle edit class section
  const handleEditClassSection = async () => {
    if (!selectedClassSection) return;

    try {
      await classSectionService.updateClassSection({
        ...formData,
        id: selectedClassSection.id,
      });
      setIsEditDialogOpen(false);
      resetForm();
      fetchClassSections();
      toast({
        title: "Success",
        description: "Class section updated successfully.",
      });
    } catch (error) {
      console.error("Error updating class section:", error);
      toast({
        title: "Error",
        description: "Failed to update class section. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Handle delete class section
  const handleDeleteClassSection = async () => {
    if (!selectedClassSection) return;

    try {
      await classSectionService.deleteClassSection(selectedClassSection.id);
      setIsDeleteDialogOpen(false);
      fetchClassSections();
      toast({
        title: "Success",
        description: "Class section deleted successfully.",
      });
    } catch (error) {
      console.error("Error deleting class section:", error);
      toast({
        title: "Error",
        description: "Failed to delete class section. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Handle toggle class section status
  const handleToggleStatus = async (id: string) => {
    try {
      await classSectionService.toggleClassSectionStatus(id);
      fetchClassSections();
      toast({
        title: "Success",
        description: "Class section status updated successfully.",
      });
    } catch (error) {
      console.error("Error toggling class section status:", error);
      toast({
        title: "Error",
        description: "Failed to update class section status. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      name: "",
      subject: "",
      teacher: "",
      room: "",
      schedule: [
        {
          day: "Monday",
          startTime: "09:00",
          endTime: "10:30",
        },
      ],
      capacity: 0,
      enrollment: 0,
      status: "active",
    });
    setSelectedClassSection(null);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <div className="relative w-64">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search class sections..."
              className="pl-8"
              value={searchQuery}
              onChange={handleSearchChange}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            />
          </div>
          <Button variant="outline" size="sm" onClick={handleSearch}>
            Search
          </Button>
        </div>
        <div className="flex space-x-2">
          <Dialog
            open={isFilterDialogOpen}
            onOpenChange={setIsFilterDialogOpen}
          >
            <DialogTrigger asChild>
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-2" />
                Filter
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Filter Class Sections</DialogTitle>
                <DialogDescription>
                  Apply filters to narrow down the class section list.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="filter-subject">Subject</Label>
                  <Input
                    id="filter-subject"
                    placeholder="Enter subject name"
                    value={filterForm.subject}
                    onChange={(e) =>
                      handleFilterChange(e.target.value, "subject")
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="filter-teacher">Teacher</Label>
                  <Input
                    id="filter-teacher"
                    placeholder="Enter teacher name"
                    value={filterForm.teacher}
                    onChange={(e) =>
                      handleFilterChange(e.target.value, "teacher")
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="filter-room">Room</Label>
                  <Input
                    id="filter-room"
                    placeholder="Enter room name"
                    value={filterForm.room}
                    onChange={(e) => handleFilterChange(e.target.value, "room")}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="filter-status">Status</Label>
                  <Select
                    value={filterForm.status}
                    onValueChange={(value) =>
                      handleFilterChange(value, "status")
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">All Statuses</SelectItem>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={resetFilters}>
                  Reset
                </Button>
                <Button onClick={applyFilters}>Apply Filters</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          <Button
            variant="outline"
            size="sm"
            onClick={async () => {
              try {
                // Get all class sections or filtered ones if filters are applied
                const sectionsToExport = Object.values(filters).some(
                  (value) => value,
                )
                  ? await classSectionService.filterClassSections(filters)
                  : await classSectionService.getClassSections();

                // Generate CSV content
                const csvContent =
                  await classSectionService.exportClassSectionsToCSV(
                    sectionsToExport,
                  );

                // Download the CSV file
                classSectionService.downloadCSV(
                  csvContent,
                  `class-sections-${new Date().toISOString().split("T")[0]}.csv`,
                );

                toast({
                  title: "Success",
                  description: `${sectionsToExport.length} class sections exported successfully.`,
                });
              } catch (error) {
                console.error("Error exporting class sections:", error);
                toast({
                  title: "Error",
                  description:
                    "Failed to export class sections. Please try again.",
                  variant: "destructive",
                });
              }
            }}
          >
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm">
                <Upload className="h-4 w-4 mr-2" />
                Import
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Import Class Sections</DialogTitle>
                <DialogDescription>
                  Upload a CSV file to import class sections. The CSV file
                  should have the following columns: ID, Name, Subject, Teacher,
                  Room, Schedule, Capacity, Enrollment, Status.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="csv-file">CSV File</Label>
                  <Input
                    id="csv-file"
                    type="file"
                    accept=".csv"
                    onChange={async (e) => {
                      try {
                        const file = e.target.files?.[0];
                        if (!file) return;

                        // Read the file
                        const reader = new FileReader();
                        reader.onload = async (event) => {
                          try {
                            const csvContent = event.target?.result as string;
                            if (!csvContent) return;

                            // Parse the CSV content
                            const importedClassSections =
                              await classSectionService.importClassSectionsFromCSV(
                                csvContent,
                              );

                            // Import the class sections
                            await classSectionService.bulkImportClassSections(
                              importedClassSections,
                            );

                            // Refresh the class sections list
                            fetchClassSections();

                            // Show success message
                            toast({
                              title: "Success",
                              description: `${importedClassSections.length} class sections imported successfully.`,
                            });

                            // Close the dialog
                            const closeButton = document.querySelector(
                              '[data-state="open"] button[aria-label="Close"]',
                            );
                            if (closeButton instanceof HTMLButtonElement) {
                              closeButton.click();
                            }
                          } catch (error) {
                            console.error(
                              "Error importing class sections:",
                              error,
                            );
                            toast({
                              title: "Error",
                              description:
                                "Failed to import class sections. Please check the CSV format and try again.",
                              variant: "destructive",
                            });
                          }
                        };
                        reader.readAsText(file);
                      } catch (error) {
                        console.error("Error reading CSV file:", error);
                        toast({
                          title: "Error",
                          description:
                            "Failed to read CSV file. Please try again.",
                          variant: "destructive",
                        });
                      }
                    }}
                  />
                </div>
                <div className="space-y-2">
                  <Label>CSV Format Example</Label>
                  <pre className="bg-muted p-2 rounded-md text-xs overflow-auto">
                    {classSectionService.classSectionCsvHeader}\n
                    1,CS101-A,Introduction to Computer Science,Dr. Smith,Room
                    101,Monday 09:00-10:30; Wednesday 09:00-10:30,40,35,active
                  </pre>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" type="button">
                  Cancel
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Add Class Section
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Add New Class Section</DialogTitle>
                <DialogDescription>
                  Fill in the details to add a new class section to the system.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Section Name</Label>
                    <Input
                      id="name"
                      placeholder="e.g., CS101-A"
                      value={formData.name}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="subject">Subject</Label>
                    <Input
                      id="subject"
                      placeholder="e.g., Introduction to Computer Science"
                      value={formData.subject}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="teacher">Teacher</Label>
                    <Input
                      id="teacher"
                      placeholder="e.g., Dr. Smith"
                      value={formData.teacher}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="room">Room</Label>
                    <Input
                      id="room"
                      placeholder="e.g., Room 101"
                      value={formData.room}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="capacity">Capacity</Label>
                    <Input
                      id="capacity"
                      type="number"
                      placeholder="e.g., 30"
                      value={formData.capacity || ""}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="enrollment">Current Enrollment</Label>
                    <Input
                      id="enrollment"
                      type="number"
                      placeholder="e.g., 25"
                      value={formData.enrollment || ""}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <Label>Schedule</Label>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={addScheduleSlot}
                    >
                      <Plus className="h-4 w-4 mr-1" /> Add Time Slot
                    </Button>
                  </div>
                  {formData.schedule.map((slot, index) => (
                    <div
                      key={index}
                      className="grid grid-cols-4 gap-2 items-end mt-2"
                    >
                      <div>
                        <Label htmlFor={`day-${index}`}>Day</Label>
                        <Select
                          value={slot.day}
                          onValueChange={(value) =>
                            handleScheduleChange(index, "day", value)
                          }
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {daysOfWeek.map((day) => (
                              <SelectItem key={day} value={day}>
                                {day}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor={`start-time-${index}`}>
                          Start Time
                        </Label>
                        <Input
                          id={`start-time-${index}`}
                          type="time"
                          value={slot.startTime}
                          onChange={(e) =>
                            handleScheduleChange(
                              index,
                              "startTime",
                              e.target.value,
                            )
                          }
                        />
                      </div>
                      <div>
                        <Label htmlFor={`end-time-${index}`}>End Time</Label>
                        <Input
                          id={`end-time-${index}`}
                          type="time"
                          value={slot.endTime}
                          onChange={(e) =>
                            handleScheduleChange(
                              index,
                              "endTime",
                              e.target.value,
                            )
                          }
                        />
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => removeScheduleSlot(index)}
                        disabled={formData.schedule.length <= 1}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <Select
                    value={formData.status}
                    onValueChange={(value) =>
                      handleSelectChange(
                        value as "active" | "inactive",
                        "status",
                      )
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => {
                    setIsAddDialogOpen(false);
                    resetForm();
                  }}
                >
                  Cancel
                </Button>
                <Button onClick={handleAddClassSection}>
                  Add Class Section
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Card className="bg-background">
        <CardContent className="p-0">
          <DataTable
            data={classSections}
            isLoading={isLoading}
            loadingText="Loading class sections..."
            emptyText="No class sections found. Try adjusting your search or filters."
            columns={[
              {
                header: "Name",
                accessorKey: "name",
                cell: (classSection) => (
                  <span className="font-medium">{classSection.name}</span>
                ),
              },
              {
                header: "Subject",
                accessorKey: "subject",
              },
              {
                header: "Teacher",
                accessorKey: "teacher",
              },
              {
                header: "Room",
                accessorKey: "room",
              },
              {
                header: "Schedule",
                accessorKey: "schedule",
                cell: (classSection) => (
                  <div className="flex flex-col gap-1">
                    {classSection.schedule.map((slot, index) => (
                      <Badge
                        key={index}
                        variant="outline"
                        className="justify-start"
                      >
                        {slot.day} {slot.startTime}-{slot.endTime}
                      </Badge>
                    ))}
                  </div>
                ),
              },
              {
                header: "Capacity",
                accessorKey: "capacity",
              },
              {
                header: "Enrollment",
                accessorKey: "enrollment",
              },
              {
                header: "Status",
                accessorKey: "status",
                cell: (classSection) => (
                  <Button
                    variant={
                      classSection.status === "active" ? "default" : "secondary"
                    }
                    size="sm"
                    onClick={() => handleToggleStatus(classSection.id)}
                  >
                    {classSection.status === "active" ? (
                      <>
                        <Check className="h-4 w-4 mr-1" /> Active
                      </>
                    ) : (
                      <>
                        <X className="h-4 w-4 mr-1" /> Inactive
                      </>
                    )}
                  </Button>
                ),
              },
              {
                header: "Actions",
                accessorKey: "id",
                className: "text-right",
                cell: (classSection) => (
                  <div className="text-right">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => openEditDialog(classSection)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => openDeleteDialog(classSection)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ),
              },
            ]}
          />
        </CardContent>
      </Card>

      {/* Edit Class Section Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Class Section</DialogTitle>
            <DialogDescription>
              Update the details of the selected class section.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-name">Section Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={handleInputChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-subject">Subject</Label>
                <Input
                  id="subject"
                  value={formData.subject}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-teacher">Teacher</Label>
                <Input
                  id="teacher"
                  value={formData.teacher}
                  onChange={handleInputChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-room">Room</Label>
                <Input
                  id="room"
                  value={formData.room}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-capacity">Capacity</Label>
                <Input
                  id="capacity"
                  type="number"
                  value={formData.capacity || ""}
                  onChange={handleInputChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-enrollment">Current Enrollment</Label>
                <Input
                  id="enrollment"
                  type="number"
                  value={formData.enrollment || ""}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <Label>Schedule</Label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addScheduleSlot}
                >
                  <Plus className="h-4 w-4 mr-1" /> Add Time Slot
                </Button>
              </div>
              {formData.schedule.map((slot, index) => (
                <div
                  key={index}
                  className="grid grid-cols-4 gap-2 items-end mt-2"
                >
                  <div>
                    <Label htmlFor={`edit-day-${index}`}>Day</Label>
                    <Select
                      value={slot.day}
                      onValueChange={(value) =>
                        handleScheduleChange(index, "day", value)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {daysOfWeek.map((day) => (
                          <SelectItem key={day} value={day}>
                            {day}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor={`edit-start-time-${index}`}>
                      Start Time
                    </Label>
                    <Input
                      id={`edit-start-time-${index}`}
                      type="time"
                      value={slot.startTime}
                      onChange={(e) =>
                        handleScheduleChange(index, "startTime", e.target.value)
                      }
                    />
                  </div>
                  <div>
                    <Label htmlFor={`edit-end-time-${index}`}>End Time</Label>
                    <Input
                      id={`edit-end-time-${index}`}
                      type="time"
                      value={slot.endTime}
                      onChange={(e) =>
                        handleScheduleChange(index, "endTime", e.target.value)
                      }
                    />
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => removeScheduleSlot(index)}
                    disabled={formData.schedule.length <= 1}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-status">Status</Label>
              <Select
                value={formData.status}
                onValueChange={(value) =>
                  handleSelectChange(value as "active" | "inactive", "status")
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsEditDialogOpen(false);
                resetForm();
              }}
            >
              Cancel
            </Button>
            <Button onClick={handleEditClassSection}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete {selectedClassSection?.name}? This
              action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteClassSection}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ClassSectionManagement;
