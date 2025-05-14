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
import * as subjectService from "@/services/subjectService";
import type { Subject, SubjectFilters } from "@/services/subjectService";

const SubjectManagement: React.FC = () => {
  const { toast } = useToast();
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isFilterDialogOpen, setIsFilterDialogOpen] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState<Subject | null>(null);
  const [filters, setFilters] = useState<SubjectFilters>({});

  // Form state for adding/editing subjects
  const [formData, setFormData] = useState({
    name: "",
    code: "",
    department: "",
    credits: 0,
    description: "",
    prerequisites: [] as string[],
    status: "active" as "active" | "inactive",
  });

  // Filter form state
  const [filterForm, setFilterForm] = useState({
    department: "",
    credits: "",
    status: "",
  });

  // Fetch subjects on component mount
  useEffect(() => {
    fetchSubjects();
  }, []);

  // Fetch subjects based on search query and filters
  const fetchSubjects = async () => {
    setIsLoading(true);
    try {
      let fetchedSubjects;
      if (searchQuery) {
        fetchedSubjects = await subjectService.searchSubjects(searchQuery);
      } else if (Object.values(filters).some((value) => value)) {
        fetchedSubjects = await subjectService.filterSubjects(filters);
      } else {
        fetchedSubjects = await subjectService.getSubjects();
      }
      setSubjects(fetchedSubjects);
    } catch (error) {
      console.error("Error fetching subjects:", error);
      toast({
        title: "Error",
        description: "Failed to fetch subjects. Please try again.",
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
    await fetchSubjects();
  };

  // Handle form input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: id === "credits" ? parseInt(value) || 0 : value,
    }));
  };

  // Handle select change
  const handleSelectChange = (value: string, field: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // Handle prerequisites change
  const handlePrerequisitesChange = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const prerequisites = e.target.value
      .split(",")
      .map((item) => item.trim())
      .filter((item) => item !== "");
    setFormData((prev) => ({
      ...prev,
      prerequisites,
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
    const newFilters: SubjectFilters = {};
    if (filterForm.department) newFilters.department = filterForm.department;
    if (filterForm.credits)
      newFilters.credits = parseInt(filterForm.credits) || 0;
    if (filterForm.status)
      newFilters.status = filterForm.status as "active" | "inactive";

    setFilters(newFilters);
    setIsFilterDialogOpen(false);
    await fetchSubjects();
  };

  // Reset filters
  const resetFilters = () => {
    setFilterForm({
      department: "",
      credits: "",
      status: "",
    });
    setFilters({});
    setIsFilterDialogOpen(false);
    fetchSubjects();
  };

  // Open edit dialog and populate form with selected subject data
  const openEditDialog = (subject: Subject) => {
    setSelectedSubject(subject);
    setFormData({
      name: subject.name,
      code: subject.code,
      department: subject.department,
      credits: subject.credits,
      description: subject.description,
      prerequisites: [...subject.prerequisites],
      status: subject.status,
    });
    setIsEditDialogOpen(true);
  };

  // Open delete confirmation dialog
  const openDeleteDialog = (subject: Subject) => {
    setSelectedSubject(subject);
    setIsDeleteDialogOpen(true);
  };

  // Handle add subject
  const handleAddSubject = async () => {
    try {
      await subjectService.createSubject(formData);
      setIsAddDialogOpen(false);
      resetForm();
      fetchSubjects();
      toast({
        title: "Success",
        description: "Subject added successfully.",
      });
    } catch (error) {
      console.error("Error adding subject:", error);
      toast({
        title: "Error",
        description: "Failed to add subject. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Handle edit subject
  const handleEditSubject = async () => {
    if (!selectedSubject) return;

    try {
      await subjectService.updateSubject({
        ...formData,
        id: selectedSubject.id,
      });
      setIsEditDialogOpen(false);
      resetForm();
      fetchSubjects();
      toast({
        title: "Success",
        description: "Subject updated successfully.",
      });
    } catch (error) {
      console.error("Error updating subject:", error);
      toast({
        title: "Error",
        description: "Failed to update subject. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Handle delete subject
  const handleDeleteSubject = async () => {
    if (!selectedSubject) return;

    try {
      await subjectService.deleteSubject(selectedSubject.id);
      setIsDeleteDialogOpen(false);
      fetchSubjects();
      toast({
        title: "Success",
        description: "Subject deleted successfully.",
      });
    } catch (error) {
      console.error("Error deleting subject:", error);
      toast({
        title: "Error",
        description: "Failed to delete subject. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Handle toggle subject status
  const handleToggleStatus = async (id: string) => {
    try {
      await subjectService.toggleSubjectStatus(id);
      fetchSubjects();
      toast({
        title: "Success",
        description: "Subject status updated successfully.",
      });
    } catch (error) {
      console.error("Error toggling subject status:", error);
      toast({
        title: "Error",
        description: "Failed to update subject status. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      name: "",
      code: "",
      department: "",
      credits: 0,
      description: "",
      prerequisites: [],
      status: "active",
    });
    setSelectedSubject(null);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <div className="relative w-64">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search subjects..."
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
                <DialogTitle>Filter Subjects</DialogTitle>
                <DialogDescription>
                  Apply filters to narrow down the subject list.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="filter-department">Department</Label>
                  <Input
                    id="filter-department"
                    placeholder="Enter department name"
                    value={filterForm.department}
                    onChange={(e) =>
                      handleFilterChange(e.target.value, "department")
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="filter-credits">Credits</Label>
                  <Input
                    id="filter-credits"
                    type="number"
                    placeholder="Enter number of credits"
                    value={filterForm.credits}
                    onChange={(e) =>
                      handleFilterChange(e.target.value, "credits")
                    }
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
                // Get all subjects or filtered ones if filters are applied
                const subjectsToExport = Object.values(filters).some(
                  (value) => value,
                )
                  ? await subjectService.filterSubjects(filters)
                  : await subjectService.getSubjects();

                // Generate CSV content
                const csvContent =
                  await subjectService.exportSubjectsToCSV(subjectsToExport);

                // Download the CSV file
                subjectService.downloadCSV(
                  csvContent,
                  `subjects-${new Date().toISOString().split("T")[0]}.csv`,
                );

                toast({
                  title: "Success",
                  description: `${subjectsToExport.length} subjects exported successfully.`,
                });
              } catch (error) {
                console.error("Error exporting subjects:", error);
                toast({
                  title: "Error",
                  description: "Failed to export subjects. Please try again.",
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
                <DialogTitle>Import Subjects</DialogTitle>
                <DialogDescription>
                  Upload a CSV file to import subjects. The CSV file should have
                  the following columns: ID, Name, Code, Department, Credits,
                  Description, Prerequisites, Status.
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
                            const importedSubjects =
                              await subjectService.importSubjectsFromCSV(
                                csvContent,
                              );

                            // Import the subjects
                            await subjectService.bulkImportSubjects(
                              importedSubjects,
                            );

                            // Refresh the subjects list
                            fetchSubjects();

                            // Show success message
                            toast({
                              title: "Success",
                              description: `${importedSubjects.length} subjects imported successfully.`,
                            });

                            // Close the dialog
                            const closeButton = document.querySelector(
                              '[data-state="open"] button[aria-label="Close"]',
                            );
                            if (closeButton instanceof HTMLButtonElement) {
                              closeButton.click();
                            }
                          } catch (error) {
                            console.error("Error importing subjects:", error);
                            toast({
                              title: "Error",
                              description:
                                "Failed to import subjects. Please check the CSV format and try again.",
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
                    {subjectService.subjectCsvHeader}\n 1,Introduction to
                    Computer Science,CS101,Computer Science,3,An introductory
                    course to computer science principles.,,active
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
                Add Subject
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Subject</DialogTitle>
                <DialogDescription>
                  Fill in the details to add a new subject to the system.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Subject Name</Label>
                    <Input
                      id="name"
                      placeholder="e.g., Introduction to Computer Science"
                      value={formData.name}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="code">Subject Code</Label>
                    <Input
                      id="code"
                      placeholder="e.g., CS101"
                      value={formData.code}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="department">Department</Label>
                    <Input
                      id="department"
                      placeholder="e.g., Computer Science"
                      value={formData.department}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="credits">Credits</Label>
                    <Input
                      id="credits"
                      type="number"
                      placeholder="e.g., 3"
                      value={formData.credits || ""}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Input
                    id="description"
                    placeholder="e.g., An introductory course to computer science principles."
                    value={formData.description}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="prerequisites">Prerequisites</Label>
                  <Input
                    id="prerequisites"
                    placeholder="e.g., MATH101, CS100 (comma separated)"
                    value={formData.prerequisites.join(", ")}
                    onChange={handlePrerequisitesChange}
                  />
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
                <Button onClick={handleAddSubject}>Add Subject</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Card className="bg-background">
        <CardContent className="p-0">
          <DataTable
            data={subjects}
            columns={[
              {
                header: "Code",
                accessorKey: "code",
                cell: (subject) => (
                  <span className="font-medium">{subject.code}</span>
                ),
              },
              {
                header: "Name",
                accessorKey: "name",
              },
              {
                header: "Department",
                accessorKey: "department",
              },
              {
                header: "Credits",
                accessorKey: "credits",
              },
              {
                header: "Prerequisites",
                accessorKey: "prerequisites",
                cell: (subject) => (
                  <div className="flex flex-wrap gap-1">
                    {subject.prerequisites.length > 0 ? (
                      subject.prerequisites.map((prereq) => (
                        <Badge key={prereq} variant="outline">
                          {prereq}
                        </Badge>
                      ))
                    ) : (
                      <span className="text-muted-foreground text-sm">
                        None
                      </span>
                    )}
                  </div>
                ),
              },
              {
                header: "Status",
                accessorKey: "status",
                cell: (subject) => (
                  <Button
                    variant={
                      subject.status === "active" ? "default" : "secondary"
                    }
                    size="sm"
                    onClick={() => handleToggleStatus(subject.id)}
                  >
                    {subject.status === "active" ? (
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
                cell: (subject) => (
                  <>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => openEditDialog(subject)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => openDeleteDialog(subject)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </>
                ),
              },
            ]}
            isLoading={isLoading}
            loadingText="Loading subjects..."
            emptyText="No subjects found. Try adjusting your search or filters."
          />
        </CardContent>
      </Card>

      {/* Edit Subject Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Subject</DialogTitle>
            <DialogDescription>
              Update the details of the selected subject.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-name">Subject Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={handleInputChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-code">Subject Code</Label>
                <Input
                  id="code"
                  value={formData.code}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-department">Department</Label>
                <Input
                  id="department"
                  value={formData.department}
                  onChange={handleInputChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-credits">Credits</Label>
                <Input
                  id="credits"
                  type="number"
                  value={formData.credits || ""}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-description">Description</Label>
              <Input
                id="description"
                value={formData.description}
                onChange={handleInputChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-prerequisites">Prerequisites</Label>
              <Input
                id="prerequisites"
                value={formData.prerequisites.join(", ")}
                onChange={handlePrerequisitesChange}
              />
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
            <Button onClick={handleEditSubject}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete {selectedSubject?.name}? This
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
            <Button variant="destructive" onClick={handleDeleteSubject}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SubjectManagement;
