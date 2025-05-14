// Room service for handling CRUD operations

export interface RoomScheduleItem {
  day: string;
  time: string;
  subjectId: string;
  subjectName: string;
}

export interface Room {
  id: string;
  name: string;
  capacity: number;
  type: string;
  building: string;
  floor: string;
  status: "active" | "inactive";
  availability: string[];
  schedule: RoomScheduleItem[];
}

// Mock data for rooms
let rooms: Room[] = [
  {
    id: "1",
    name: "Room 101",
    capacity: 40,
    type: "Classroom",
    building: "Building A",
    floor: "1st",
    status: "active",
    availability: ["Monday", "Wednesday", "Friday"],
    schedule: [
      {
        day: "Monday",
        time: "08:00-09:30",
        subjectId: "1",
        subjectName: "Introduction to Computer Science",
      },
      {
        day: "Monday",
        time: "10:00-11:30",
        subjectId: "2",
        subjectName: "Calculus II",
      },
      {
        day: "Wednesday",
        time: "08:00-09:30",
        subjectId: "1",
        subjectName: "Introduction to Computer Science",
      },
      {
        day: "Friday",
        time: "13:00-14:30",
        subjectId: "3",
        subjectName: "English Composition",
      },
    ],
  },
  {
    id: "2",
    name: "Room 102",
    capacity: 25,
    type: "Classroom",
    building: "Building A",
    floor: "1st",
    status: "active",
    availability: ["Tuesday", "Thursday"],
    schedule: [
      {
        day: "Tuesday",
        time: "08:00-09:30",
        subjectId: "3",
        subjectName: "English Composition",
      },
      {
        day: "Thursday",
        time: "10:00-11:30",
        subjectId: "2",
        subjectName: "Calculus II",
      },
    ],
  },
  {
    id: "3",
    name: "Room 201",
    capacity: 40,
    type: "Classroom",
    building: "Building A",
    floor: "2nd",
    status: "inactive",
    availability: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
    schedule: [],
  },
];

// Get all rooms
export const getRooms = async (): Promise<Room[]> => {
  return Promise.resolve([...rooms]);
};

// Get room by id
export const getRoomById = async (id: string): Promise<Room | undefined> => {
  const room = rooms.find((r) => r.id === id);
  return Promise.resolve(room ? { ...room } : undefined);
};

// Create a new room
export const createRoom = async (room: Omit<Room, "id">): Promise<Room> => {
  const newRoom = {
    ...room,
    id: Math.random().toString(36).substring(2, 11),
    schedule: room.schedule || [],
  };
  rooms = [...rooms, newRoom];
  return Promise.resolve({ ...newRoom });
};

// Update an existing room
export const updateRoom = async (room: Room): Promise<Room> => {
  const index = rooms.findIndex((r) => r.id === room.id);
  if (index === -1) {
    throw new Error(`Room with id ${room.id} not found`);
  }
  rooms[index] = { ...room };
  return Promise.resolve({ ...room });
};

// Delete a room
export const deleteRoom = async (id: string): Promise<void> => {
  const index = rooms.findIndex((r) => r.id === id);
  if (index === -1) {
    throw new Error(`Room with id ${id} not found`);
  }
  rooms = rooms.filter((r) => r.id !== id);
  return Promise.resolve();
};

// Toggle room status
export const toggleRoomStatus = async (id: string): Promise<Room> => {
  const index = rooms.findIndex((r) => r.id === id);
  if (index === -1) {
    throw new Error(`Room with id ${id} not found`);
  }
  const updatedRoom = {
    ...rooms[index],
    status: rooms[index].status === "active" ? "inactive" : "active",
  };
  rooms[index] = updatedRoom;
  return Promise.resolve({ ...updatedRoom });
};

// Search rooms
export const searchRooms = async (query: string): Promise<Room[]> => {
  if (!query) return getRooms();

  const lowerQuery = query.toLowerCase();
  const filteredRooms = rooms.filter(
    (room) =>
      room.name.toLowerCase().includes(lowerQuery) ||
      room.type.toLowerCase().includes(lowerQuery) ||
      room.building.toLowerCase().includes(lowerQuery),
  );
  return Promise.resolve([...filteredRooms]);
};

// Filter rooms
export interface RoomFilters {
  type?: string;
  building?: string;
  status?: "active" | "inactive";
}

export const filterRooms = async (filters: RoomFilters): Promise<Room[]> => {
  let filteredRooms = [...rooms];

  if (filters.type) {
    filteredRooms = filteredRooms.filter(
      (room) => room.type.toLowerCase() === filters.type?.toLowerCase(),
    );
  }

  if (filters.building) {
    filteredRooms = filteredRooms.filter(
      (room) => room.building.toLowerCase() === filters.building?.toLowerCase(),
    );
  }

  if (filters.status) {
    filteredRooms = filteredRooms.filter(
      (room) => room.status === filters.status,
    );
  }

  return Promise.resolve(filteredRooms);
};

// Check if adding a class would exceed the maximum classes per day (7)
export const checkMaxClassesPerDay = async (
  roomId: string,
  day: string,
  newClass: boolean = true,
): Promise<boolean> => {
  const room = await getRoomById(roomId);
  if (!room) {
    throw new Error(`Room with id ${roomId} not found`);
  }

  // Count classes for the specified day
  const classesForDay = room.schedule.filter((item) => item.day === day).length;

  // If we're adding a new class, check if it would exceed the limit
  if (newClass && classesForDay >= 7) {
    return false; // Would exceed the limit
  }

  return true; // Within the limit
};

// Add a class to a room's schedule
export const addClassToRoom = async (
  roomId: string,
  scheduleItem: RoomScheduleItem,
): Promise<Room> => {
  // Check if adding this class would exceed the limit
  const withinLimit = await checkMaxClassesPerDay(roomId, scheduleItem.day);
  if (!withinLimit) {
    throw new Error(
      `Cannot add more classes to room ${roomId} on ${scheduleItem.day}. Maximum of 7 classes per day reached.`,
    );
  }

  const room = await getRoomById(roomId);
  if (!room) {
    throw new Error(`Room with id ${roomId} not found`);
  }

  const updatedRoom = {
    ...room,
    schedule: [...room.schedule, scheduleItem],
  };

  return updateRoom(updatedRoom);
};

// Remove a class from a room's schedule
export const removeClassFromRoom = async (
  roomId: string,
  day: string,
  time: string,
): Promise<Room> => {
  const room = await getRoomById(roomId);
  if (!room) {
    throw new Error(`Room with id ${roomId} not found`);
  }

  const updatedRoom = {
    ...room,
    schedule: room.schedule.filter(
      (item) => !(item.day === day && item.time === time),
    ),
  };

  return updateRoom(updatedRoom);
};

// Get room schedule for a specific day
export const getRoomScheduleByDay = async (
  roomId: string,
  day: string,
): Promise<RoomScheduleItem[]> => {
  const room = await getRoomById(roomId);
  if (!room) {
    throw new Error(`Room with id ${roomId} not found`);
  }

  return room.schedule.filter((item) => item.day === day);
};
