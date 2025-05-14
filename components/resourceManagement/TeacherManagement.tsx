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
  DialogClose,
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
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import * as teacherService from "@/services/teacherService";
import type { Teacher, TeacherFilters } from "@/services/teacherService";
import * as teacherSubjectService from "@/services/teacherSubjectService";
import * as subjectService from "@/services/subjectService";
import type { Subject } from "@/services/subjectService";

const TeacherManagement: React.FC = () => {
  const { toast } = useToast();
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isFilterDialogOpen, setIsFilterDialogOpen] = useState(false);
  const [selectedTeacher, setSelectedTeacher] = useState<Teacher | null>(null);
  const [filters, setFilters] = useState<TeacherFilters>({});
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [teacherSubjects, setTeacherSubjects] = useState<Subject[]>([]);
  const [totalUnits, setTotalUnits] = useState(0);
  const [isSubjectDialogOpen, setIsSubjectDialogOpen] = useState(false);

  // Form state for adding/editing teachers
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    department: "",
    specialization: "",
    status: "active" as "active" | "inactive",
    subjectIds: [] as string[],
  });

  // Filter form state
  const [filterForm, setFilterForm] = useState({
    department: "",
    specialization: "",
    status: "",
  });

  // Initialize teacherSubjectService with teachers reference
  useEffect(() => {
    const initializeTeacherSubjects = async () => {
      const allTeachers = await teacherService.getTeachers();
      teacherSubjectService.initTeachersReference(allTeachers);
    };
    initializeTeacherSubjects();
  }, []);

  // Fetch all subjects on component mount
  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        const allSubjects = await subjectService.getSubjects();
        setSubjects(allSubjects);
      } catch (error) {
        console.error("Error fetching subjects:", error);
        toast({
          title: "Error",
          description: "Failed to fetch subjects. Please try again.",
          variant: "destructive",
        });
      }
    };
    fetchSubjects();
  }, []);

  // Fetch teachers on component mount
  useEffect(() => {
    fetchTeachers();
  }, []);

  // Fetch teachers based on search query and filters
  const fetchTeachers = async () => {
    setIsLoading(true);
    try {
      let fetchedTeachers;
      if (searchQuery) {
        fetchedTeachers = await teacherService.searchTeachers(searchQuery);
      } else if (Object.values(filters).some((value) => value)) {
        fetchedTeachers = await teacherService.filterTeachers(filters);
      } else {
        fetchedTeachers = await teacherService.getTeachers();
      }
      setTeachers(fetchedTeachers);
    } catch (error) {
      console.error("Error fetching teachers:", error);
      toast({
        title: "Error",
        description: "Failed to fetch teachers. Please try again.",
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
    await fetchTeachers();
  };

  // Handle form input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  // Handle select change
  const handleSelectChange = (value: string, field: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // Load teacher's subjects and calculate total units
  const loadTeacherSubjects = async (teacherId: string) => {
    try {
      const subjects =
        await teacherSubjectService.getSubjectsForTeacher(teacherId);
      const units = await teacherSubjectService.calculateTotalUnits(teacherId);
      setTeacherSubjects(subjects);
      setTotalUnits(units);
    } catch (error) {
      console.error("Error loading teacher subjects:", error);
      toast({
        title: "Error",
        description: "Failed to load teacher's subjects. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Handle subject assignment
  const handleAssignSubject = async (subjectId: string) => {
    if (!selectedTeacher) return;

    try {
      const result = await teacherSubjectService.assignSubjectToTeacher(
        selectedTeacher.id,
        subjectId,
      );

      if (result.success) {
        await loadTeacherSubjects(selectedTeacher.id);
        toast({
          title: "Success",
          description: result.message,
        });
      } else {
        toast({
          title: "Warning",
          description: result.message,
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error assigning subject:", error);
      toast({
        title: "Error",
        description: "Failed to assign subject. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Handle subject removal
  const handleRemoveSubject = async (subjectId: string) => {
    if (!selectedTeacher) return;

    try {
      const result = await teacherSubjectService.removeSubjectFromTeacher(
        selectedTeacher.id,
        subjectId,
      );

      if (result.success) {
        await loadTeacherSubjects(selectedTeacher.id);
        toast({
          title: "Success",
          description: result.message,
        });
      } else {
        toast({
          title: "Warning",
          description: result.message,
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error removing subject:", error);
      toast({
        title: "Error",
        description: "Failed to remove subject. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Open subject management dialog
  const openSubjectDialog = (teacher: Teacher) => {
    setSelectedTeacher(teacher);
    loadTeacherSubjects(teacher.id);
    setIsSubjectDialogOpen(true);
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
    const newFilters: TeacherFilters = {};
    if (filterForm.department) newFilters.department = filterForm.department;
    if (filterForm.specialization)
      newFilters.specialization = filterForm.specialization;
    if (filterForm.status)
      newFilters.status = filterForm.status as "active" | "inactive";

    setFilters(newFilters);
    setIsFilterDialogOpen(false);
    await fetchTeachers();
  };

  // Reset filters
  const resetFilters = () => {
    setFilterForm({
      department: "",
      specialization: "",
      status: "",
    });
    setFilters({});
    setIsFilterDialogOpen(false);
    fetchTeachers();
  };

  // Open edit dialog and populate form with selected teacher data
  const openEditDialog = (teacher: Teacher) => {
    setSelectedTeacher(teacher);
    setFormData({
      name: teacher.name,
      email: teacher.email,
      department: teacher.department,
      specialization: teacher.specialization,
      status: teacher.status,
      subjectIds: [...teacher.subjectIds],
    });
    setIsEditDialogOpen(true);
  };

  // Open delete confirmation dialog
  const openDeleteDialog = (teacher: Teacher) => {
    setSelectedTeacher(teacher);
    setIsDeleteDialogOpen(true);
  };

  // Handle add teacher
  const handleAddTeacher = async () => {
    try {
      await teacherService.createTeacher(formData);
      setIsAddDialogOpen(false);
      resetForm();
      fetchTeachers();
      toast({
        title: "Success",
        description: "Teacher added successfully.",
      });
    } catch (error) {
      console.error("Error adding teacher:", error);
      toast({
        title: "Error",
        description: "Failed to add teacher. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Handle edit teacher
  const handleEditTeacher = async () => {
    if (!selectedTeacher) return;

    try {
      await teacherService.updateTeacher({
        ...formData,
        id: selectedTeacher.id,
      });
      setIsEditDialogOpen(false);
      resetForm();
      fetchTeachers();
      toast({
        title: "Success",
        description: "Teacher updated successfully.",
      });
    } catch (error) {
      console.error("Error updating teacher:", error);
      toast({
        title: "Error",
        description: "Failed to update teacher. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Handle delete teacher
  const handleDeleteTeacher = async () => {
    if (!selectedTeacher) return;

    try {
      await teacherService.deleteTeacher(selectedTeacher.id);
      setIsDeleteDialogOpen(false);
      fetchTeachers();
      toast({
        title: "Success",
        description: "Teacher deleted successfully.",
      });
    } catch (error) {
      console.error("Error deleting teacher:", error);
      toast({
        title: "Error",
        description: "Failed to delete teacher. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Handle toggle teacher status
  const handleToggleStatus = async (id: string) => {
    try {
      await teacherService.toggleTeacherStatus(id);
      fetchTeachers();
      toast({
        title: "Success",
        description: "Teacher status updated successfully.",
      });
    } catch (error) {
      console.error("Error toggling teacher status:", error);
      toast({
        title: "Error",
        description: "Failed to update teacher status. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      name: "",
      email: "",
      department: "",
      specialization: "",
      status: "active",
      subjectIds: [],
    });
    setSelectedTeacher(null);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <div className="relative w-64">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search teachers..."
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
                <DialogTitle>Filter Teachers</DialogTitle>
                <DialogDescription>
                  Apply filters to narrow down the teacher list.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="filter-department">Department</Label>
                  <Select
                    value={filterForm.department}
                    onValueChange={(value) =>
                      handleFilterChange(value, "department")
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select department" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">All Departments</SelectItem>
                      <SelectItem value="mathematics">Mathematics</SelectItem>
                      <SelectItem value="science">Science</SelectItem>
                      <SelectItem value="english">English</SelectItem>
                      <SelectItem value="history">History</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="filter-specialization">Specialization</Label>
                  <Select
                    value={filterForm.specialization}
                    onValueChange={(value) =>
                      handleFilterChange(value, "specialization")
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select specialization" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">All Specializations</SelectItem>
                      <SelectItem value="calculus">Calculus</SelectItem>
                      <SelectItem value="physics">Physics</SelectItem>
                      <SelectItem value="literature">Literature</SelectItem>
                      <SelectItem value="world history">
                        World History
                      </SelectItem>
                    </SelectContent>
                  </Select>
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
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button variant="outline" size="sm">
            <Upload className="h-4 w-4 mr-2" />
            Import
          </Button>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Add Teacher
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Teacher</DialogTitle>
                <DialogDescription>
                  Fill in the details to add a new teacher to the system.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      placeholder="e.g., John Smith"
                      value={formData.name}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="e.g., john.smith@example.com"
                      value={formData.email}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="department">Department</Label>
                    <Input
                      id="department"
                      placeholder="e.g., Mathematics"
                      value={formData.department}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="specialization">Specialization</Label>
                    <Input
                      id="specialization"
                      placeholder="e.g., Calculus"
                      value={formData.specialization}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Subjects</Label>
                  <p className="text-sm text-muted-foreground">
                    You can assign subjects after creating the teacher.
                  </p>
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
                <Button onClick={handleAddTeacher}>Add Teacher</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Card className="bg-background">
        <CardContent className="p-0">
          <DataTable
            data={teachers}
            columns={[
              {
                header: "Name",
                accessorKey: "name",
                cell: (teacher) => (
                  <Button
                    variant="link"
                    className="p-0 h-auto font-medium text-left justify-start"
                    onClick={() => openSubjectDialog(teacher)}
                  >
                    {teacher.name}
                  </Button>
                ),
              },
              {
                header: "Email",
                accessorKey: "email",
              },
              {
                header: "Department",
                accessorKey: "department",
              },
              {
                header: "Specialization",
                accessorKey: "specialization",
              },
              {
                header: "Subjects",
                accessorKey: "subjectIds",
                cell: (teacher) => (
                  <div className="flex items-center">
                    <Badge variant="outline">
                      {teacher.subjectIds.length} subjects
                    </Badge>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="ml-2"
                      onClick={() => openSubjectDialog(teacher)}
                    >
                      Manage
                    </Button>
                  </div>
                ),
              },
              {
                header: "Status",
                accessorKey: "status",
                cell: (teacher) => (
                  <Button
                    variant={
                      teacher.status === "active" ? "default" : "secondary"
                    }
                    size="sm"
                    onClick={() => handleToggleStatus(teacher.id)}
                  >
                    {teacher.status === "active" ? (
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
                cell: (teacher) => (
                  <>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => openEditDialog(teacher)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => openDeleteDialog(teacher)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </>
                ),
              },
            ]}
            isLoading={isLoading}
            loadingText="Loading teachers..."
            emptyText="No teachers found. Try adjusting your search or filters."
          />
        </CardContent>
      </Card>

      {/* Edit Teacher Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Teacher</DialogTitle>
            <DialogDescription>
              Update the details of the selected teacher.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-name">Full Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={handleInputChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
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
                <Label htmlFor="edit-specialization">Specialization</Label>
                <Input
                  id="specialization"
                  value={formData.specialization}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Subjects</Label>
              <div className="flex justify-between items-center">
                <p className="text-sm text-muted-foreground">
                  {formData.subjectIds.length} subjects assigned
                </p>
                {selectedTeacher && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setIsEditDialogOpen(false);
                      openSubjectDialog(selectedTeacher);
                    }}
                  >
                    Manage Subjects
                  </Button>
                )}
              </div>
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
            <Button onClick={handleEditTeacher}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete {selectedTeacher?.name}? This
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
            <Button variant="destructive" onClick={handleDeleteTeacher}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Subject Management Dialog */}
      <Dialog open={isSubjectDialogOpen} onOpenChange={setIsSubjectDialogOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>
              Manage Subjects for {selectedTeacher?.name}
            </DialogTitle>
            <DialogDescription>
              Assign or remove subjects for this teacher. Total units:{" "}
              {totalUnits}/18
            </DialogDescription>
          </DialogHeader>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
            <div>
              <h3 className="text-sm font-medium mb-2">Available Subjects</h3>
              <div className="border rounded-md p-2 h-[300px] overflow-y-auto">
                {subjects
                  .filter(
                    (subject) =>
                      !teacherSubjects.some((ts) => ts.id === subject.id),
                  )
                  .map((subject) => (
                    <div
                      key={subject.id}
                      className="flex justify-between items-center p-2 hover:bg-muted/50 rounded-md"
                    >
                      <div>
                        <p className="font-medium">{subject.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {subject.code} • {subject.credits} units
                        </p>
                      </div>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleAssignSubject(subject.id)}
                      >
                        Assign
                      </Button>
                    </div>
                  ))}
                {subjects.filter(
                  (subject) =>
                    !teacherSubjects.some((ts) => ts.id === subject.id),
                ).length === 0 && (
                  <p className="text-sm text-muted-foreground p-2">
                    No more subjects available
                  </p>
                )}
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-sm font-medium">Assigned Subjects</h3>
                <div className="flex items-center">
                  <span className="text-xs mr-2">Total Units:</span>
                  <Badge variant={totalUnits > 18 ? "destructive" : "outline"}>
                    {totalUnits}/18
                  </Badge>
                </div>
              </div>
              <div className="border rounded-md p-2 h-[300px] overflow-y-auto">
                {teacherSubjects.map((subject) => (
                  <div
                    key={subject.id}
                    className="flex justify-between items-center p-2 hover:bg-muted/50 rounded-md"
                  >
                    <div>
                      <p className="font-medium">{subject.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {subject.code} • {subject.credits} units
                      </p>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleRemoveSubject(subject.id)}
                    >
                      Remove
                    </Button>
                  </div>
                ))}
                {teacherSubjects.length === 0 && (
                  <p className="text-sm text-muted-foreground p-2">
                    No subjects assigned
                  </p>
                )}
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button onClick={() => setIsSubjectDialogOpen(false)}>Done</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TeacherManagement;
