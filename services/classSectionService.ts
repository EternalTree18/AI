// Class Section service for handling CRUD operations

export interface ClassSection {
  id: string;
  name: string;
  subject: string;
  teacher: string;
  room: string;
  schedule: {
    day: string;
    startTime: string;
    endTime: string;
  }[];
  capacity: number;
  enrollment: number;
  status: "active" | "inactive";
}

// CSV header for class section export
export const classSectionCsvHeader =
  "ID,Name,Subject,Teacher,Room,Schedule,Capacity,Enrollment,Status";

// Mock data for class sections
let classSections: ClassSection[] = [
  {
    id: "1",
    name: "CS101-A",
    subject: "Introduction to Computer Science",
    teacher: "Dr. Smith",
    room: "Room 101",
    schedule: [
      {
        day: "Monday",
        startTime: "09:00",
        endTime: "10:30",
      },
      {
        day: "Wednesday",
        startTime: "09:00",
        endTime: "10:30",
      },
    ],
    capacity: 40,
    enrollment: 35,
    status: "active",
  },
  {
    id: "2",
    name: "MATH201-B",
    subject: "Calculus II",
    teacher: "Dr. Johnson",
    room: "Room 102",
    schedule: [
      {
        day: "Tuesday",
        startTime: "11:00",
        endTime: "12:30",
      },
      {
        day: "Thursday",
        startTime: "11:00",
        endTime: "12:30",
      },
    ],
    capacity: 30,
    enrollment: 28,
    status: "active",
  },
  {
    id: "3",
    name: "ENG101-C",
    subject: "English Composition",
    teacher: "Prof. Williams",
    room: "Room 201",
    schedule: [
      {
        day: "Monday",
        startTime: "13:00",
        endTime: "14:30",
      },
      {
        day: "Friday",
        startTime: "13:00",
        endTime: "14:30",
      },
    ],
    capacity: 25,
    enrollment: 20,
    status: "inactive",
  },
];

// Get all class sections
export const getClassSections = async (): Promise<ClassSection[]> => {
  return Promise.resolve([...classSections]);
};

// Get class section by id
export const getClassSectionById = async (
  id: string,
): Promise<ClassSection | undefined> => {
  const classSection = classSections.find((cs) => cs.id === id);
  return Promise.resolve(classSection ? { ...classSection } : undefined);
};

// Create a new class section
export const createClassSection = async (
  classSection: Omit<ClassSection, "id">,
): Promise<ClassSection> => {
  const newClassSection = {
    ...classSection,
    id: Math.random().toString(36).substring(2, 11),
  };
  classSections = [...classSections, newClassSection];
  return Promise.resolve({ ...newClassSection });
};

// Update an existing class section
export const updateClassSection = async (
  classSection: ClassSection,
): Promise<ClassSection> => {
  const index = classSections.findIndex((cs) => cs.id === classSection.id);
  if (index === -1) {
    throw new Error(`Class section with id ${classSection.id} not found`);
  }
  classSections[index] = { ...classSection };
  return Promise.resolve({ ...classSection });
};

// Delete a class section
export const deleteClassSection = async (id: string): Promise<void> => {
  const index = classSections.findIndex((cs) => cs.id === id);
  if (index === -1) {
    throw new Error(`Class section with id ${id} not found`);
  }
  classSections = classSections.filter((cs) => cs.id !== id);
  return Promise.resolve();
};

// Toggle class section status
export const toggleClassSectionStatus = async (
  id: string,
): Promise<ClassSection> => {
  const index = classSections.findIndex((cs) => cs.id === id);
  if (index === -1) {
    throw new Error(`Class section with id ${id} not found`);
  }
  const updatedClassSection = {
    ...classSections[index],
    status: classSections[index].status === "active" ? "inactive" : "active",
  };
  classSections[index] = updatedClassSection;
  return Promise.resolve({ ...updatedClassSection });
};

// Search class sections
export const searchClassSections = async (
  query: string,
): Promise<ClassSection[]> => {
  if (!query) return getClassSections();

  const lowerQuery = query.toLowerCase();
  const filteredClassSections = classSections.filter(
    (classSection) =>
      classSection.name.toLowerCase().includes(lowerQuery) ||
      classSection.subject.toLowerCase().includes(lowerQuery) ||
      classSection.teacher.toLowerCase().includes(lowerQuery) ||
      classSection.room.toLowerCase().includes(lowerQuery),
  );
  return Promise.resolve([...filteredClassSections]);
};

// Filter class sections
export interface ClassSectionFilters {
  subject?: string;
  teacher?: string;
  room?: string;
  status?: "active" | "inactive";
}

export const filterClassSections = async (
  filters: ClassSectionFilters,
): Promise<ClassSection[]> => {
  let filteredClassSections = [...classSections];

  if (filters.subject) {
    filteredClassSections = filteredClassSections.filter(
      (classSection) =>
        classSection.subject.toLowerCase() === filters.subject?.toLowerCase(),
    );
  }

  if (filters.teacher) {
    filteredClassSections = filteredClassSections.filter(
      (classSection) =>
        classSection.teacher.toLowerCase() === filters.teacher?.toLowerCase(),
    );
  }

  if (filters.room) {
    filteredClassSections = filteredClassSections.filter(
      (classSection) =>
        classSection.room.toLowerCase() === filters.room?.toLowerCase(),
    );
  }

  if (filters.status) {
    filteredClassSections = filteredClassSections.filter(
      (classSection) => classSection.status === filters.status,
    );
  }

  return Promise.resolve(filteredClassSections);
};

// Export class sections to CSV
export const exportClassSectionsToCSV = async (
  classSections: ClassSection[],
): Promise<string> => {
  // Start with the header
  let csvContent = classSectionCsvHeader + "\n";

  // Add each class section as a row
  classSections.forEach((classSection) => {
    // Format the schedule as a string
    const scheduleStr = classSection.schedule
      .map((slot) => `${slot.day} ${slot.startTime}-${slot.endTime}`)
      .join("; ");

    // Create the CSV row
    const row = [
      classSection.id,
      classSection.name,
      classSection.subject,
      classSection.teacher,
      classSection.room,
      scheduleStr,
      classSection.capacity,
      classSection.enrollment,
      classSection.status,
    ].join(",");

    csvContent += row + "\n";
  });

  return csvContent;
};

// Helper function to download CSV
export const downloadCSV = (csvContent: string, filename: string): void => {
  // Create a blob with the CSV content
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });

  // Create a download link
  const link = document.createElement("a");
  const url = URL.createObjectURL(blob);

  // Set link properties
  link.setAttribute("href", url);
  link.setAttribute("download", filename);
  link.style.visibility = "hidden";

  // Add to document, click to download, and remove
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

// Parse CSV content and import class sections
export const importClassSectionsFromCSV = async (
  csvContent: string,
): Promise<ClassSection[]> => {
  // Split the CSV content into lines
  const lines = csvContent.trim().split("\n");

  // Remove the header line
  const dataLines = lines.slice(1);

  // Parse each line into a class section
  const importedClassSections: ClassSection[] = [];

  for (const line of dataLines) {
    try {
      const values = line.split(",");

      if (values.length < 9) continue; // Skip invalid lines

      const [
        id,
        name,
        subject,
        teacher,
        room,
        scheduleStr,
        capacityStr,
        enrollmentStr,
        status,
      ] = values;

      // Parse schedule string (format: "Day StartTime-EndTime; Day StartTime-EndTime")
      const scheduleItems = scheduleStr.split(";").map((item) => item.trim());
      const schedule = scheduleItems.map((item) => {
        const [day, timeRange] = item.split(" ");
        const [startTime, endTime] = timeRange.split("-");
        return { day, startTime, endTime };
      });

      // Create class section object
      const classSection: ClassSection = {
        id,
        name,
        subject,
        teacher,
        room,
        schedule,
        capacity: parseInt(capacityStr) || 0,
        enrollment: parseInt(enrollmentStr) || 0,
        status: status === "active" ? "active" : "inactive",
      };

      importedClassSections.push(classSection);
    } catch (error) {
      console.error("Error parsing CSV line:", line, error);
      // Continue with the next line
    }
  }

  return importedClassSections;
};

// Import class sections from CSV and add them to the database
export const bulkImportClassSections = async (
  importedClassSections: ClassSection[],
): Promise<void> => {
  // For each imported class section
  for (const classSection of importedClassSections) {
    try {
      // Check if a class section with this ID already exists
      const existingClassSection = await getClassSectionById(classSection.id);

      if (existingClassSection) {
        // Update existing class section
        await updateClassSection(classSection);
      } else {
        // Create new class section with the provided ID
        classSections = [...classSections, classSection];
      }
    } catch (error) {
      console.error("Error importing class section:", classSection, error);
      // Continue with the next class section
    }
  }

  return Promise.resolve();
};
