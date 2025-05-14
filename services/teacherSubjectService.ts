// Teacher-Subject service for handling teacher subject assignments

import { getSubjectById, Subject } from "./subjectService";
import { getTeacherById, Teacher } from "./teacherService";

// Get subjects for a teacher
export const getSubjectsForTeacher = async (
  teacherId: string,
): Promise<Subject[]> => {
  const teacher = await getTeacherById(teacherId);
  if (!teacher) {
    return [];
  }

  const subjects: Subject[] = [];
  for (const subjectId of teacher.subjectIds) {
    const subject = await getSubjectById(subjectId);
    if (subject) {
      subjects.push(subject);
    }
  }

  return subjects;
};

// Calculate total units for a teacher
export const calculateTotalUnits = async (
  teacherId: string,
): Promise<number> => {
  const subjects = await getSubjectsForTeacher(teacherId);
  return subjects.reduce((total, subject) => total + subject.credits, 0);
};

// Check if adding a subject would exceed the unit cap
export const wouldExceedUnitCap = async (
  teacherId: string,
  subjectId: string,
  unitCap: number = 18,
): Promise<boolean> => {
  const currentUnits = await calculateTotalUnits(teacherId);
  const subject = await getSubjectById(subjectId);

  if (!subject) {
    return false;
  }

  return currentUnits + subject.credits > unitCap;
};

// Assign subject to teacher
export const assignSubjectToTeacher = async (
  teacherId: string,
  subjectId: string,
  unitCap: number = 18,
): Promise<{ success: boolean; message: string }> => {
  // Check if adding this subject would exceed the unit cap
  const wouldExceed = await wouldExceedUnitCap(teacherId, subjectId, unitCap);
  if (wouldExceed) {
    return {
      success: false,
      message: "Cannot assign subject. Would exceed the 18-unit cap.",
    };
  }

  // Get the teacher
  const teacher = await getTeacherById(teacherId);
  if (!teacher) {
    return {
      success: false,
      message: "Teacher not found.",
    };
  }

  // Check if subject already assigned
  if (teacher.subjectIds.includes(subjectId)) {
    return {
      success: false,
      message: "Subject already assigned to this teacher.",
    };
  }

  // Assign the subject
  teacher.subjectIds.push(subjectId);
  await updateTeacherSubjects(teacherId, teacher.subjectIds);

  return {
    success: true,
    message: "Subject assigned successfully.",
  };
};

// Remove subject from teacher
export const removeSubjectFromTeacher = async (
  teacherId: string,
  subjectId: string,
): Promise<{ success: boolean; message: string }> => {
  // Get the teacher
  const teacher = await getTeacherById(teacherId);
  if (!teacher) {
    return {
      success: false,
      message: "Teacher not found.",
    };
  }

  // Check if subject is assigned
  if (!teacher.subjectIds.includes(subjectId)) {
    return {
      success: false,
      message: "Subject not assigned to this teacher.",
    };
  }

  // Remove the subject
  const updatedSubjectIds = teacher.subjectIds.filter((id) => id !== subjectId);
  await updateTeacherSubjects(teacherId, updatedSubjectIds);

  return {
    success: true,
    message: "Subject removed successfully.",
  };
};

// Update teacher subjects
export const updateTeacherSubjects = async (
  teacherId: string,
  subjectIds: string[],
): Promise<{ success: boolean; message: string }> => {
  // Get the teacher
  const teacher = await getTeacherById(teacherId);
  if (!teacher) {
    return {
      success: false,
      message: "Teacher not found.",
    };
  }

  // Update the teacher's subjects
  teacher.subjectIds = [...subjectIds];

  // Update the teacher
  try {
    await updateTeacher(teacher);
    return {
      success: true,
      message: "Teacher subjects updated successfully.",
    };
  } catch (error) {
    return {
      success: false,
      message: `Failed to update teacher subjects: ${error}`,
    };
  }
};

// Helper function to update teacher
const updateTeacher = async (teacher: Teacher): Promise<Teacher> => {
  const index = teachers.findIndex((t) => t.id === teacher.id);
  if (index === -1) {
    throw new Error(`Teacher with id ${teacher.id} not found`);
  }
  teachers[index] = { ...teacher };
  return Promise.resolve({ ...teacher });
};

// Reference to teachers array from teacherService
let teachers: Teacher[] = [];

// Initialize the teachers reference
export const initTeachersReference = (teachersArray: Teacher[]) => {
  teachers = teachersArray;
};
