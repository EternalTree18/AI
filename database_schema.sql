-- Academic Scheduling System Database Schema

-- Drop existing tables if they exist
DROP TABLE IF EXISTS session_conflicts;
DROP TABLE IF EXISTS sessions;
DROP TABLE IF EXISTS rooms;
DROP TABLE IF EXISTS teachers;
DROP TABLE IF EXISTS subjects;
DROP TABLE IF EXISTS departments;

-- Create departments table
CREATE TABLE departments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    code VARCHAR(10) NOT NULL UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create rooms table
CREATE TABLE rooms (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    capacity INT NOT NULL,
    building VARCHAR(50) NOT NULL,
    room_type ENUM('Lecture Hall', 'Lab', 'Classroom', 'Seminar Room') NOT NULL,
    department_id INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (department_id) REFERENCES departments(id) ON DELETE SET NULL
);

-- Create teachers table
CREATE TABLE teachers (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    department_id INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (department_id) REFERENCES departments(id) ON DELETE SET NULL
);

-- Create subjects table
CREATE TABLE subjects (
    id INT AUTO_INCREMENT PRIMARY KEY,
    code VARCHAR(20) NOT NULL UNIQUE,
    name VARCHAR(100) NOT NULL,
    department_id INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (department_id) REFERENCES departments(id) ON DELETE SET NULL
);

-- Create sessions table
CREATE TABLE sessions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    subject_id INT NOT NULL,
    teacher_id INT NOT NULL,
    room_id INT NOT NULL,
    day_of_week ENUM('Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday') NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    section VARCHAR(10) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (subject_id) REFERENCES subjects(id) ON DELETE CASCADE,
    FOREIGN KEY (teacher_id) REFERENCES teachers(id) ON DELETE CASCADE,
    FOREIGN KEY (room_id) REFERENCES rooms(id) ON DELETE CASCADE
);

-- Create session_conflicts table to track conflicts
CREATE TABLE session_conflicts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    session_id INT NOT NULL,
    conflict_type ENUM('Room', 'Teacher', 'Section') NOT NULL,
    conflict_with INT NOT NULL,
    resolved BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (session_id) REFERENCES sessions(id) ON DELETE CASCADE,
    FOREIGN KEY (conflict_with) REFERENCES sessions(id) ON DELETE CASCADE
);

-- Insert sample data for departments
INSERT INTO departments (name, code) VALUES
('Computer Science', 'CS'),
('Mathematics', 'MATH'),
('Physics', 'PHYS'),
('Engineering', 'ENG');

-- Insert sample data for rooms
INSERT INTO rooms (name, capacity, building, room_type, department_id) VALUES
('Room 101', 30, 'Main Building', 'Classroom', 1),
('Room 102', 25, 'Main Building', 'Classroom', 2),
('Lab A', 20, 'Science Building', 'Lab', 1),
('Lecture Hall 1', 100, 'Main Building', 'Lecture Hall', NULL),
('Seminar Room 3', 15, 'Engineering Building', 'Seminar Room', 4);

-- Insert sample data for teachers
INSERT INTO teachers (name, email, department_id) VALUES
('John Smith', 'john.smith@example.com', 1),
('Jane Doe', 'jane.doe@example.com', 2),
('Robert Johnson', 'robert.johnson@example.com', 3),
('Emily Brown', 'emily.brown@example.com', 4),
('Michael Wilson', 'michael.wilson@example.com', 1);

-- Insert sample data for subjects
INSERT INTO subjects (code, name, department_id) VALUES
('CS101', 'Introduction to Programming', 1),
('MATH201', 'Calculus II', 2),
('PHYS101', 'Physics I', 3),
('ENG301', 'Engineering Design', 4),
('CS202', 'Data Structures', 1);

-- Insert sample data for sessions
INSERT INTO sessions (subject_id, teacher_id, room_id, day_of_week, start_time, end_time, section) VALUES
(1, 1, 1, 'Monday', '09:00:00', '10:30:00', 'A'),
(2, 2, 2, 'Monday', '11:00:00', '12:30:00', 'B'),
(3, 3, 4, 'Tuesday', '09:00:00', '10:30:00', 'A'),
(4, 4, 5, 'Wednesday', '13:00:00', '14:30:00', 'C'),
(5, 5, 3, 'Thursday', '15:00:00', '16:30:00', 'B');
