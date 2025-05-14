// Teacher service for handling CRUD operations

export interface Teacher {
  id: string;
  name: string;
  email: string;
  department: string;
  specialization: string;
  status: "active" | "inactive";
  subjectIds: string[];
}

// Mock data for teachers
let teachers: Teacher[] = [
  {
    id: "1",
    name: "John Smith",
    email: "john.smith@example.com",
    department: "Mathematics",
    specialization: "Calculus",
    status: "active",
    subjectIds: ["1", "2"],
  },
  {
    id: "2",
    name: "Sarah Johnson",
    email: "sarah.johnson@example.com",
    department: "Science",
    specialization: "Physics",
    status: "active",
    subjectIds: ["3"],
  },
  {
    id: "3",
    name: "Michael Brown",
    email: "michael.brown@example.com",
    department: "English",
    specialization: "Literature",
    status: "inactive",
    subjectIds: [],
  },
];

// Get all teachers
export const getTeachers = async (): Promise<Teacher[]> => {
  return Promise.resolve([...teachers]);
};

// Get teacher by id
export const getTeacherById = async (
  id: string,
): Promise<Teacher | undefined> => {
  const teacher = teachers.find((t) => t.id === id);
  return Promise.resolve(teacher ? { ...teacher } : undefined);
};

// Create a new teacher
export const createTeacher = async (
  teacher: Omit<Teacher, "id">,
): Promise<Teacher> => {
  const newTeacher = {
    ...teacher,
    id: Math.random().toString(36).substring(2, 11),
  };
  teachers = [...teachers, newTeacher];
  return Promise.resolve({ ...newTeacher });
};

// Update an existing teacher
export const updateTeacher = async (teacher: Teacher): Promise<Teacher> => {
  const index = teachers.findIndex((t) => t.id === teacher.id);
  if (index === -1) {
    throw new Error(`Teacher with id ${teacher.id} not found`);
  }
  teachers[index] = { ...teacher };
  return Promise.resolve({ ...teacher });
};

// Delete a teacher
export const deleteTeacher = async (id: string): Promise<void> => {
  const index = teachers.findIndex((t) => t.id === id);
  if (index === -1) {
    throw new Error(`Teacher with id ${id} not found`);
  }
  teachers = teachers.filter((t) => t.id !== id);
  return Promise.resolve();
};

// Toggle teacher status
export const toggleTeacherStatus = async (id: string): Promise<Teacher> => {
  const index = teachers.findIndex((t) => t.id === id);
  if (index === -1) {
    throw new Error(`Teacher with id ${id} not found`);
  }
  const updatedTeacher = {
    ...teachers[index],
    status: teachers[index].status === "active" ? "inactive" : "active",
  };
  teachers[index] = updatedTeacher;
  return Promise.resolve({ ...updatedTeacher });
};

// Search teachers
export const searchTeachers = async (query: string): Promise<Teacher[]> => {
  if (!query) return getTeachers();

  const lowerQuery = query.toLowerCase();
  const filteredTeachers = teachers.filter(
    (teacher) =>
      teacher.name.toLowerCase().includes(lowerQuery) ||
      teacher.email.toLowerCase().includes(lowerQuery) ||
      teacher.department.toLowerCase().includes(lowerQuery) ||
      teacher.specialization.toLowerCase().includes(lowerQuery),
  );
  return Promise.resolve([...filteredTeachers]);
};

// Filter teachers
export interface TeacherFilters {
  department?: string;
  specialization?: string;
  status?: "active" | "inactive";
}

export const filterTeachers = async (
  filters: TeacherFilters,
): Promise<Teacher[]> => {
  let filteredTeachers = [...teachers];

  if (filters.department) {
    filteredTeachers = filteredTeachers.filter(
      (teacher) =>
        teacher.department.toLowerCase() === filters.department?.toLowerCase(),
    );
  }

  if (filters.specialization) {
    filteredTeachers = filteredTeachers.filter(
      (teacher) =>
        teacher.specialization.toLowerCase() ===
        filters.specialization?.toLowerCase(),
    );
  }

  if (filters.status) {
    filteredTeachers = filteredTeachers.filter(
      (teacher) => teacher.status === filters.status,
    );
  }

  return Promise.resolve(filteredTeachers);
};
