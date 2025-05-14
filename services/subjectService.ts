// Subject service for handling CRUD operations

export interface Subject {
  id: string;
  name: string;
  code: string;
  department: string;
  credits: number;
  description: string;
  prerequisites: string[];
  status: "active" | "inactive";
}

// CSV header for subject export
export const subjectCsvHeader =
  "ID,Name,Code,Department,Credits,Description,Prerequisites,Status";

// Mock data for subjects
let subjects: Subject[] = [
  {
    id: "1",
    name: "Introduction to Computer Science",
    code: "CS101",
    department: "Computer Science",
    credits: 3,
    description: "An introductory course to computer science principles.",
    prerequisites: [],
    status: "active",
  },
  {
    id: "2",
    name: "Calculus II",
    code: "MATH201",
    department: "Mathematics",
    credits: 4,
    description: "Advanced calculus topics including integration techniques.",
    prerequisites: ["MATH101"],
    status: "active",
  },
  {
    id: "3",
    name: "English Composition",
    code: "ENG101",
    department: "English",
    credits: 3,
    description: "Fundamentals of writing and composition.",
    prerequisites: [],
    status: "active",
  },
];

// Get all subjects
export const getSubjects = async (): Promise<Subject[]> => {
  return Promise.resolve([...subjects]);
};

// Get subject by id
export const getSubjectById = async (
  id: string,
): Promise<Subject | undefined> => {
  const subject = subjects.find((s) => s.id === id);
  return Promise.resolve(subject ? { ...subject } : undefined);
};

// Create a new subject
export const createSubject = async (
  subject: Omit<Subject, "id">,
): Promise<Subject> => {
  const newSubject = {
    ...subject,
    id: Math.random().toString(36).substring(2, 11),
  };
  subjects = [...subjects, newSubject];
  return Promise.resolve({ ...newSubject });
};

// Update an existing subject
export const updateSubject = async (subject: Subject): Promise<Subject> => {
  const index = subjects.findIndex((s) => s.id === subject.id);
  if (index === -1) {
    throw new Error(`Subject with id ${subject.id} not found`);
  }
  subjects[index] = { ...subject };
  return Promise.resolve({ ...subject });
};

// Delete a subject
export const deleteSubject = async (id: string): Promise<void> => {
  const index = subjects.findIndex((s) => s.id === id);
  if (index === -1) {
    throw new Error(`Subject with id ${id} not found`);
  }
  subjects = subjects.filter((s) => s.id !== id);
  return Promise.resolve();
};

// Toggle subject status
export const toggleSubjectStatus = async (id: string): Promise<Subject> => {
  const index = subjects.findIndex((s) => s.id === id);
  if (index === -1) {
    throw new Error(`Subject with id ${id} not found`);
  }
  const updatedSubject = {
    ...subjects[index],
    status: subjects[index].status === "active" ? "inactive" : "active",
  };
  subjects[index] = updatedSubject;
  return Promise.resolve({ ...updatedSubject });
};

// Search subjects
export const searchSubjects = async (query: string): Promise<Subject[]> => {
  if (!query) return getSubjects();

  const lowerQuery = query.toLowerCase();
  const filteredSubjects = subjects.filter(
    (subject) =>
      subject.name.toLowerCase().includes(lowerQuery) ||
      subject.code.toLowerCase().includes(lowerQuery) ||
      subject.department.toLowerCase().includes(lowerQuery),
  );
  return Promise.resolve([...filteredSubjects]);
};

// Filter subjects
export interface SubjectFilters {
  department?: string;
  credits?: number;
  status?: "active" | "inactive";
}

export const filterSubjects = async (
  filters: SubjectFilters,
): Promise<Subject[]> => {
  let filteredSubjects = [...subjects];

  if (filters.department) {
    filteredSubjects = filteredSubjects.filter(
      (subject) =>
        subject.department.toLowerCase() === filters.department?.toLowerCase(),
    );
  }

  if (filters.credits) {
    filteredSubjects = filteredSubjects.filter(
      (subject) => subject.credits === filters.credits,
    );
  }

  if (filters.status) {
    filteredSubjects = filteredSubjects.filter(
      (subject) => subject.status === filters.status,
    );
  }

  return Promise.resolve(filteredSubjects);
};

// Export subjects to CSV
export const exportSubjectsToCSV = async (
  subjects: Subject[],
): Promise<string> => {
  // Start with the header
  let csvContent = subjectCsvHeader + "\n";

  // Add each subject as a row
  subjects.forEach((subject) => {
    // Format prerequisites as a string
    const prerequisitesStr = subject.prerequisites.join("; ");

    // Create the CSV row
    const row = [
      subject.id,
      subject.name,
      subject.code,
      subject.department,
      subject.credits,
      subject.description,
      prerequisitesStr,
      subject.status,
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

// Parse CSV content and import subjects
export const importSubjectsFromCSV = async (
  csvContent: string,
): Promise<Subject[]> => {
  // Split the CSV content into lines
  const lines = csvContent.trim().split("\n");

  // Remove the header line
  const dataLines = lines.slice(1);

  // Parse each line into a subject
  const importedSubjects: Subject[] = [];

  for (const line of dataLines) {
    try {
      const values = line.split(",");

      if (values.length < 8) continue; // Skip invalid lines

      const [
        id,
        name,
        code,
        department,
        creditsStr,
        description,
        prerequisitesStr,
        status,
      ] = values;

      // Parse prerequisites string
      const prerequisites = prerequisitesStr
        ? prerequisitesStr.split(";").map((item) => item.trim())
        : [];

      // Create subject object
      const subject: Subject = {
        id,
        name,
        code,
        department,
        credits: parseInt(creditsStr) || 0,
        description,
        prerequisites,
        status: status === "active" ? "active" : "inactive",
      };

      importedSubjects.push(subject);
    } catch (error) {
      console.error("Error parsing CSV line:", line, error);
      // Continue with the next line
    }
  }

  return importedSubjects;
};

// Import subjects from CSV and add them to the database
export const bulkImportSubjects = async (
  importedSubjects: Subject[],
): Promise<void> => {
  // For each imported subject
  for (const subject of importedSubjects) {
    try {
      // Check if a subject with this ID already exists
      const existingSubject = await getSubjectById(subject.id);

      if (existingSubject) {
        // Update existing subject
        await updateSubject(subject);
      } else {
        // Create new subject with the provided ID
        subjects = [...subjects, subject];
      }
    } catch (error) {
      console.error("Error importing subject:", subject, error);
      // Continue with the next subject
    }
  }

  return Promise.resolve();
};
