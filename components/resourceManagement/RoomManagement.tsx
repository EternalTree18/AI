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
  Calendar,
  Clock,
  Book,
  PlusCircle,
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
import * as roomService from "@/services/roomService";
import * as subjectService from "@/services/subjectService";
import type {
  Room,
  RoomFilters,
  RoomScheduleItem,
} from "@/services/roomService";
import type { Subject } from "@/services/subjectService";

const RoomManagement: React.FC = () => {
  const { toast } = useToast();
  const [rooms, setRooms] = useState<Room[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isFilterDialogOpen, setIsFilterDialogOpen] = useState(false);
  const [isScheduleDialogOpen, setIsScheduleDialogOpen] = useState(false);
  const [isAddClassDialogOpen, setIsAddClassDialogOpen] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [filters, setFilters] = useState<RoomFilters>({});

  // Form state for adding/editing rooms
  const [formData, setFormData] = useState({
    name: "",
    capacity: 0,
    type: "",
    building: "",
    floor: "",
    status: "active" as "active" | "inactive",
    availability: [] as string[],
  });

  // Form state for adding classes to room schedule
  const [classFormData, setClassFormData] = useState({
    day: "",
    time: "",
    subjectId: "",
  });

  // Filter form state
  const [filterForm, setFilterForm] = useState({
    type: "",
    building: "",
    status: "",
  });

  // Days of the week for availability
  const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

  // Fetch rooms and subjects on component mount
  useEffect(() => {
    fetchRooms();
    fetchSubjects();
  }, []);

  // Fetch subjects
  const fetchSubjects = async () => {
    try {
      const fetchedSubjects = await subjectService.getSubjects();
      setSubjects(fetchedSubjects);
    } catch (error) {
      console.error("Error fetching subjects:", error);
      toast({
        title: "Error",
        description: "Failed to fetch subjects. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Fetch rooms based on search query and filters
  const fetchRooms = async () => {
    setIsLoading(true);
    try {
      let fetchedRooms;
      if (searchQuery) {
        fetchedRooms = await roomService.searchRooms(searchQuery);
      } else if (Object.values(filters).some((value) => value)) {
        fetchedRooms = await roomService.filterRooms(filters);
      } else {
        fetchedRooms = await roomService.getRooms();
      }
      setRooms(fetchedRooms);
    } catch (error) {
      console.error("Error fetching rooms:", error);
      toast({
        title: "Error",
        description: "Failed to fetch rooms. Please try again.",
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
    await fetchRooms();
  };

  // Handle form input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: id === "capacity" ? parseInt(value) || 0 : value,
    }));
  };

  // Handle select change
  const handleSelectChange = (value: string, field: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // Handle checkbox change for availability
  const handleCheckboxChange = (day: string, checked: boolean) => {
    setFormData((prev) => {
      if (checked) {
        return { ...prev, availability: [...prev.availability, day] };
      } else {
        return {
          ...prev,
          availability: prev.availability.filter((d) => d !== day),
        };
      }
    });
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
    const newFilters: RoomFilters = {};
    if (filterForm.type) newFilters.type = filterForm.type;
    if (filterForm.building) newFilters.building = filterForm.building;
    if (filterForm.status)
      newFilters.status = filterForm.status as "active" | "inactive";

    setFilters(newFilters);
    setIsFilterDialogOpen(false);
    await fetchRooms();
  };

  // Reset filters
  const resetFilters = () => {
    setFilterForm({
      type: "",
      building: "",
      status: "",
    });
    setFilters({});
    setIsFilterDialogOpen(false);
    fetchRooms();
  };

  // Open edit dialog and populate form with selected room data
  const openEditDialog = (room: Room) => {
    setSelectedRoom(room);
    setFormData({
      name: room.name,
      capacity: room.capacity,
      type: room.type,
      building: room.building,
      floor: room.floor,
      status: room.status,
      availability: [...room.availability],
    });
    setIsEditDialogOpen(true);
  };

  // Open schedule dialog to view room schedule
  const openScheduleDialog = (room: Room) => {
    setSelectedRoom(room);
    setIsScheduleDialogOpen(true);
  };

  // Open add class dialog
  const openAddClassDialog = (room: Room) => {
    setSelectedRoom(room);
    setClassFormData({
      day: "",
      time: "",
      subjectId: "",
    });
    setIsAddClassDialogOpen(true);
  };

  // Open delete confirmation dialog
  const openDeleteDialog = (room: Room) => {
    setSelectedRoom(room);
    setIsDeleteDialogOpen(true);
  };

  // Handle add room
  const handleAddRoom = async () => {
    try {
      await roomService.createRoom(formData);
      setIsAddDialogOpen(false);
      resetForm();
      fetchRooms();
      toast({
        title: "Success",
        description: "Room added successfully.",
      });
    } catch (error) {
      console.error("Error adding room:", error);
      toast({
        title: "Error",
        description: "Failed to add room. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Handle edit room
  const handleEditRoom = async () => {
    if (!selectedRoom) return;

    try {
      await roomService.updateRoom({
        ...formData,
        id: selectedRoom.id,
      });
      setIsEditDialogOpen(false);
      resetForm();
      fetchRooms();
      toast({
        title: "Success",
        description: "Room updated successfully.",
      });
    } catch (error) {
      console.error("Error updating room:", error);
      toast({
        title: "Error",
        description: "Failed to update room. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Handle delete room
  const handleDeleteRoom = async () => {
    if (!selectedRoom) return;

    try {
      await roomService.deleteRoom(selectedRoom.id);
      setIsDeleteDialogOpen(false);
      fetchRooms();
      toast({
        title: "Success",
        description: "Room deleted successfully.",
      });
    } catch (error) {
      console.error("Error deleting room:", error);
      toast({
        title: "Error",
        description: "Failed to delete room. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Handle toggle room status
  const handleToggleStatus = async (id: string) => {
    try {
      await roomService.toggleRoomStatus(id);
      fetchRooms();
      toast({
        title: "Success",
        description: "Room status updated successfully.",
      });
    } catch (error) {
      console.error("Error toggling room status:", error);
      toast({
        title: "Error",
        description: "Failed to update room status. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      name: "",
      capacity: 0,
      type: "",
      building: "",
      floor: "",
      status: "active",
      availability: [],
    });
    setSelectedRoom(null);
  };

  // Handle class form input change
  const handleClassFormChange = (value: string, field: string) => {
    setClassFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // Handle add class to room
  const handleAddClass = async () => {
    if (!selectedRoom) return;

    try {
      // Find the subject name for the selected subject ID
      const subject = subjects.find((s) => s.id === classFormData.subjectId);
      if (!subject) {
        throw new Error("Subject not found");
      }

      const scheduleItem: RoomScheduleItem = {
        day: classFormData.day,
        time: classFormData.time,
        subjectId: classFormData.subjectId,
        subjectName: subject.name,
      };

      await roomService.addClassToRoom(selectedRoom.id, scheduleItem);
      setIsAddClassDialogOpen(false);

      // Refresh the room data to show updated schedule
      const updatedRoom = await roomService.getRoomById(selectedRoom.id);
      if (updatedRoom) {
        setSelectedRoom(updatedRoom);
        // Also update the room in the rooms list
        setRooms(rooms.map((r) => (r.id === updatedRoom.id ? updatedRoom : r)));
      }

      toast({
        title: "Success",
        description: "Class added to room schedule successfully.",
      });
    } catch (error) {
      console.error("Error adding class to room:", error);
      toast({
        title: "Error",
        description:
          error instanceof Error
            ? error.message
            : "Failed to add class to room schedule.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <div className="relative w-64">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search rooms..."
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
                <DialogTitle>Filter Rooms</DialogTitle>
                <DialogDescription>
                  Apply filters to narrow down the room list.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="filter-type">Room Type</Label>
                  <Select
                    value={filterForm.type}
                    onValueChange={(value) => handleFilterChange(value, "type")}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select room type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">All Types</SelectItem>
                      <SelectItem value="classroom">Classroom</SelectItem>
                      <SelectItem value="laboratory">Laboratory</SelectItem>
                      <SelectItem value="lecture hall">Lecture Hall</SelectItem>
                      <SelectItem value="conference room">
                        Conference Room
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="filter-building">Building</Label>
                  <Select
                    value={filterForm.building}
                    onValueChange={(value) =>
                      handleFilterChange(value, "building")
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select building" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">All Buildings</SelectItem>
                      <SelectItem value="building a">Building A</SelectItem>
                      <SelectItem value="building b">Building B</SelectItem>
                      <SelectItem value="building c">Building C</SelectItem>
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
                Add Room
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Room</DialogTitle>
                <DialogDescription>
                  Fill in the details to add a new room to the system.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Room Name</Label>
                    <Input
                      id="name"
                      placeholder="e.g., Room 101"
                      value={formData.name}
                      onChange={handleInputChange}
                    />
                  </div>
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
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="building">Building</Label>
                    <Input
                      id="building"
                      placeholder="e.g., Main Building"
                      value={formData.building}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="floor">Floor</Label>
                    <Input
                      id="floor"
                      placeholder="e.g., 1st"
                      value={formData.floor}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="type">Room Type</Label>
                  <Select
                    value={formData.type}
                    onValueChange={(value) => handleSelectChange(value, "type")}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select room type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="classroom">Classroom</SelectItem>
                      <SelectItem value="laboratory">Laboratory</SelectItem>
                      <SelectItem value="lecture hall">Lecture Hall</SelectItem>
                      <SelectItem value="conference room">
                        Conference Room
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Availability</Label>
                  <div className="grid grid-cols-5 gap-2">
                    {daysOfWeek.map((day) => (
                      <div key={day} className="flex items-center space-x-2">
                        <Checkbox
                          id={`day-${day}`}
                          checked={formData.availability.includes(day)}
                          onCheckedChange={(checked) =>
                            handleCheckboxChange(day, checked === true)
                          }
                        />
                        <Label htmlFor={`day-${day}`}>{day}</Label>
                      </div>
                    ))}
                  </div>
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
                <Button onClick={handleAddRoom}>Add Room</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Card className="bg-background">
        <CardContent className="p-0">
          <DataTable
            data={rooms}
            isLoading={isLoading}
            loadingText="Loading rooms..."
            emptyText="No rooms found. Try adjusting your search or filters."
            columns={[
              {
                header: "Name",
                accessorKey: "name",
                cell: (room) => (
                  <span className="font-medium">{room.name}</span>
                ),
              },
              {
                header: "Capacity",
                accessorKey: "capacity",
              },
              {
                header: "Type",
                accessorKey: "type",
              },
              {
                header: "Building",
                accessorKey: "building",
              },
              {
                header: "Floor",
                accessorKey: "floor",
              },
              {
                header: "Availability",
                accessorKey: "availability",
                cell: (room) => (
                  <div className="flex flex-wrap gap-1">
                    {room.availability.map((day) => (
                      <Badge key={day} variant="outline">
                        {day}
                      </Badge>
                    ))}
                  </div>
                ),
              },
              {
                header: "Schedule",
                accessorKey: "schedule",
                cell: (room) => (
                  <div className="flex items-center">
                    <Badge
                      variant="outline"
                      className="cursor-pointer"
                      onClick={() => openScheduleDialog(room)}
                    >
                      {room.schedule.length} Classes
                      <Calendar className="ml-1 h-3 w-3" />
                    </Badge>
                  </div>
                ),
              },
            ]}
          />
        </CardContent>
      </Card>

      {/* Edit Room Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Room</DialogTitle>
            <DialogDescription>
              Update the details of the selected room.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-name">Room Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={handleInputChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-capacity">Capacity</Label>
                <Input
                  id="capacity"
                  type="number"
                  value={formData.capacity || ""}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-building">Building</Label>
                <Input
                  id="building"
                  value={formData.building}
                  onChange={handleInputChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-floor">Floor</Label>
                <Input
                  id="floor"
                  value={formData.floor}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-type">Room Type</Label>
              <Select
                value={formData.type}
                onValueChange={(value) => handleSelectChange(value, "type")}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="classroom">Classroom</SelectItem>
                  <SelectItem value="laboratory">Laboratory</SelectItem>
                  <SelectItem value="lecture hall">Lecture Hall</SelectItem>
                  <SelectItem value="conference room">
                    Conference Room
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Availability</Label>
              <div className="grid grid-cols-5 gap-2">
                {daysOfWeek.map((day) => (
                  <div key={day} className="flex items-center space-x-2">
                    <Checkbox
                      id={`edit-day-${day}`}
                      checked={formData.availability.includes(day)}
                      onCheckedChange={(checked) =>
                        handleCheckboxChange(day, checked === true)
                      }
                    />
                    <Label htmlFor={`edit-day-${day}`}>{day}</Label>
                  </div>
                ))}
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
            <Button onClick={handleEditRoom}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete {selectedRoom?.name}? This action
              cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteRoom}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Room Schedule Dialog */}
      <Dialog
        open={isScheduleDialogOpen}
        onOpenChange={setIsScheduleDialogOpen}
      >
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Room Schedule - {selectedRoom?.name}</DialogTitle>
            <DialogDescription>
              View the current schedule for this room.
            </DialogDescription>
          </DialogHeader>

          {selectedRoom && (
            <div className="mt-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium">Class Schedule</h3>
                <Button
                  size="sm"
                  onClick={() => openAddClassDialog(selectedRoom)}
                >
                  <PlusCircle className="h-4 w-4 mr-2" />
                  Add Class
                </Button>
              </div>

              {selectedRoom.schedule.length > 0 ? (
                <div className="space-y-4">
                  {/* Group schedule items by day */}
                  {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"].map(
                    (day) => {
                      const daySchedule = selectedRoom.schedule.filter(
                        (item) => item.day === day,
                      );
                      if (daySchedule.length === 0) return null;

                      return (
                        <div key={day} className="border rounded-md p-4">
                          <h3 className="font-medium text-lg flex items-center mb-2">
                            <Calendar className="mr-2 h-4 w-4" />
                            {day}{" "}
                            <span className="text-muted-foreground ml-2 text-sm">
                              ({daySchedule.length} classes)
                            </span>
                          </h3>
                          <div className="space-y-2">
                            {daySchedule.map((item, index) => (
                              <div
                                key={index}
                                className="flex items-center justify-between bg-muted/50 p-2 rounded-md"
                              >
                                <div className="flex items-center">
                                  <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
                                  <span className="font-medium">
                                    {item.time}
                                  </span>
                                </div>
                                <div className="flex items-center">
                                  <Book className="mr-2 h-4 w-4 text-muted-foreground" />
                                  <span>{item.subjectName}</span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      );
                    },
                  )}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  No classes scheduled for this room.
                </div>
              )}
            </div>
          )}

          <DialogFooter className="mt-4">
            <Button onClick={() => setIsScheduleDialogOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Class Dialog */}
      <Dialog
        open={isAddClassDialogOpen}
        onOpenChange={setIsAddClassDialogOpen}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Class to Room Schedule</DialogTitle>
            <DialogDescription>
              Add a new class to the schedule for {selectedRoom?.name}.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="day">Day</Label>
              <Select
                value={classFormData.day}
                onValueChange={(value) => handleClassFormChange(value, "day")}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select day" />
                </SelectTrigger>
                <SelectContent>
                  {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"].map(
                    (day) => (
                      <SelectItem key={day} value={day}>
                        {day}
                      </SelectItem>
                    ),
                  )}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="time">Time</Label>
              <Select
                value={classFormData.time}
                onValueChange={(value) => handleClassFormChange(value, "time")}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select time slot" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="08:00-09:30">08:00-09:30</SelectItem>
                  <SelectItem value="09:45-11:15">09:45-11:15</SelectItem>
                  <SelectItem value="11:30-13:00">11:30-13:00</SelectItem>
                  <SelectItem value="13:15-14:45">13:15-14:45</SelectItem>
                  <SelectItem value="15:00-16:30">15:00-16:30</SelectItem>
                  <SelectItem value="16:45-18:15">16:45-18:15</SelectItem>
                  <SelectItem value="18:30-20:00">18:30-20:00</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="subject">Subject</Label>
              <Select
                value={classFormData.subjectId}
                onValueChange={(value) =>
                  handleClassFormChange(value, "subjectId")
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select subject" />
                </SelectTrigger>
                <SelectContent>
                  {subjects.map((subject) => (
                    <SelectItem key={subject.id} value={subject.id}>
                      {subject.name} ({subject.code})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsAddClassDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button onClick={handleAddClass}>Add Class</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default RoomManagement;
