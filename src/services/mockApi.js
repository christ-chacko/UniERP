// --- STUDENTS ---
const studentsDB = [
  // CSE - Semester 2
  {
    id: 101,
    name: "Alice Johnson",
    role: "student",
    course: "btech",
    branch: "cse",
    semester: 2,
    section: "A",
    percentage: "85%",
    records: [
      { date: "2025-10-01", subjectId: "CSE201", status: "Present" },
      { date: "2025-10-02", subjectId: "CSE202", status: "Absent" },
      { date: "2025-10-03", subjectId: "CSE203", status: "Present" },
    ],
  },
  {
    id: 102,
    name: "Bob Smith",
    role: "student",
    course: "btech",
    branch: "cse",
    semester: 2,
    section: "B",
    percentage: "72%",
    records: [
      { date: "2025-10-01", subjectId: "CSE201", status: "Present" },
      { date: "2025-10-02", subjectId: "CSE202", status: "Absent" },
      { date: "2025-10-03", subjectId: "CSE203", status: "Present" },
      { date: "2025-10-04", subjectId: "CSE204", status: "Present" },
    ],
  },
  {
    id: 103,
    name: "David Kumar",
    role: "student",
    course: "btech",
    branch: "cse",
    semester: 2,
    section: "A",
    percentage: "64%",
    records: [
      { date: "2025-10-01", subjectId: "CSE201", status: "Absent" },
      { date: "2025-10-02", subjectId: "CSE202", status: "Present" },
    ],
  },

  // CSE - Semester 1
  {
    id: 104,
    name: "Emma Wilson",
    role: "student",
    course: "btech",
    branch: "cse",
    semester: 1,
    section: "C",
    percentage: "90%",
    records: [
      { date: "2025-10-01", subjectId: "CSE101", status: "Present" },
      { date: "2025-10-02", subjectId: "CSE102", status: "Present" },
    ],
  },
  {
    id: 105,
    name: "Farhan Ali",
    role: "student",
    course: "btech",
    branch: "cse",
    semester: 1,
    section: "B",
    percentage: "77%",
    records: [
      { date: "2025-10-01", subjectId: "CSE101", status: "Absent" },
      { date: "2025-10-02", subjectId: "CSE102", status: "Present" },
    ],
  },

  // ECE - Semester 1
  {
    id: 106,
    name: "Catherine Lee",
    role: "student",
    course: "btech",
    branch: "ece",
    semester: 1,
    section: "A",
    percentage: "91%",
    records: [
      { date: "2025-10-01", subjectId: "ECE101", status: "Present" },
      { date: "2025-10-02", subjectId: "ECE102", status: "Present" },
    ],
  },
  {
    id: 107,
    name: "George Thomas",
    role: "student",
    course: "btech",
    branch: "ece",
    semester: 1,
    section: "B",
    percentage: "68%",
    records: [
      { date: "2025-10-01", subjectId: "ECE101", status: "Absent" },
      { date: "2025-10-02", subjectId: "ECE102", status: "Absent" },
    ],
  },

  // BBA - Semester 1
  {
    id: 108,
    name: "Hannah Patel",
    role: "student",
    course: "bba",
    branch: "management",
    semester: 1,
    section: "A",
    percentage: "88%",
    records: [
      { date: "2025-10-01", status: "Present" },
      { date: "2025-10-02", status: "Present" },
    ],
  },
  {
    id: 109,
    name: "Ishaan Verma",
    role: "student",
    course: "bba",
    branch: "management",
    semester: 1,
    section: "B",
    percentage: "74%",
    records: [
      { date: "2025-10-01", status: "Present" },
      { date: "2025-10-02", status: "Absent" },
    ],
  },
];

export async function fetchStudentsAttendance({ course, branch, semester, section }) {
  return studentsDB.filter(
    (s) =>
      (!course || s.course === course) &&
      (!branch || s.branch === branch) &&
      (!semester || s.semester === semester) &&
      (!section || s.section === section)
  );
}

// --- TEACHERS ---
const teachersDB = [
  // B.Tech - CSE
  {
    id: 201,
    name: "Prof. Sharma",
    role: "teacher",
    course: "btech",
    branch: "cse",
    records: [
      { date: "2025-10-01", status: "Present" },
      { date: "2025-10-02", status: "Absent" },
      { date: "2025-10-03", status: "Present" },
    ],
  },
  {
    id: 202,
    name: "Prof. Gupta",
    role: "teacher",
    course: "btech",
    branch: "cse",
    records: [
      { date: "2025-10-01", status: "Present" },
      { date: "2025-10-02", status: "Present" },
    ],
  },

  // B.Tech - ECE
  {
    id: 203,
    name: "Prof. Reddy",
    role: "teacher",
    course: "btech",
    branch: "ece",
    records: [
      { date: "2025-10-01", status: "Absent" },
      { date: "2025-10-02", status: "Present" },
    ],
  },
  {
    id: 204,
    name: "Prof. Das",
    role: "teacher",
    course: "btech",
    branch: "ece",
    records: [
      { date: "2025-10-01", status: "Present" },
      { date: "2025-10-02", status: "Present" },
    ],
  },

  // B.Tech - Mechanical
  {
    id: 205,
    name: "Prof. Singh",
    role: "teacher",
    course: "btech",
    branch: "mechanical",
    records: [
      { date: "2025-10-01", status: "Absent" },
      { date: "2025-10-02", status: "Absent" },
    ],
  },
  {
    id: 206,
    name: "Prof. Patel",
    role: "teacher",
    course: "btech",
    branch: "mechanical",
    records: [
      { date: "2025-10-01", status: "Present" },
      { date: "2025-10-02", status: "Present" },
    ],
  },

  // B.Tech - Civil
  {
    id: 207,
    name: "Prof. Nair",
    role: "teacher",
    course: "btech",
    branch: "civil",
    records: [
      { date: "2025-10-01", status: "Present" },
      { date: "2025-10-02", status: "Absent" },
    ],
  },
  {
    id: 208,
    name: "Prof. Iyer",
    role: "teacher",
    course: "btech",
    branch: "civil",
    records: [
      { date: "2025-10-01", status: "Present" },
      { date: "2025-10-02", status: "Present" },
    ],
  },

  // BBA - Management
  {
    id: 209,
    name: "Prof. Mehta",
    role: "teacher",
    course: "bba",
    branch: "management",
    records: [
      { date: "2025-10-01", status: "Absent" },
      { date: "2025-10-02", status: "Present" },
    ],
  },
  {
    id: 210,
    name: "Prof. Kapoor",
    role: "teacher",
    course: "bba",
    branch: "management",
    records: [
      { date: "2025-10-01", status: "Present" },
      { date: "2025-10-02", status: "Present" },
    ],
  },

  // BBA - Finance
  {
    id: 211,
    name: "Prof. Rao",
    role: "teacher",
    course: "bba",
    branch: "finance",
    records: [
      { date: "2025-10-01", status: "Absent" },
      { date: "2025-10-02", status: "Present" },
    ],
  },
  {
    id: 212,
    name: "Prof. Banerjee",
    role: "teacher",
    course: "bba",
    branch: "finance",
    records: [
      { date: "2025-10-01", status: "Present" },
      { date: "2025-10-02", status: "Absent" },
    ],
  },
];


export async function fetchTeachers(course) {
  return teachersDB.filter((t) => !course || t.course === course);
}


// --- SUBJECTS ---
const subjectsDB = [
  // B.Tech CSE Sem 1
  { id: 1, name: "Programming in C", code: "CSE101", course: "btech", branch: "cse", semester: 1 },
  { id: 2, name: "Mathematics I", code: "MTH101", course: "btech", branch: "cse", semester: 1 },
  { id: 3, name: "Physics", code: "PHY101", course: "btech", branch: "cse", semester: 1 },

  // B.Tech CSE Sem 2
  { id: 4, name: "Data Structures", code: "CSE201", course: "btech", branch: "cse", semester: 2 },
  { id: 5, name: "DBMS", code: "CSE202", course: "btech", branch: "cse", semester: 2 },
  { id: 6, name: "Operating Systems", code: "CSE203", course: "btech", branch: "cse", semester: 2 },

  // B.Tech ECE Sem 1
  { id: 7, name: "Basic Electronics", code: "ECE101", course: "btech", branch: "ece", semester: 1 },
  { id: 8, name: "Mathematics I", code: "MTH101", course: "btech", branch: "ece", semester: 1 },
  { id: 9, name: "Engineering Physics", code: "PHY102", course: "btech", branch: "ece", semester: 1 },

  // B.Tech Mechanical Sem 1
  { id: 10, name: "Engineering Mechanics", code: "ME101", course: "btech", branch: "mechanical", semester: 1 },
  { id: 11, name: "Workshop Practice", code: "ME102", course: "btech", branch: "mechanical", semester: 1 },

  // BBA Management Sem 1
  { id: 12, name: "Principles of Management", code: "BBA101", course: "bba", branch: "management", semester: 1 },
  { id: 13, name: "Financial Accounting", code: "BBA102", course: "bba", branch: "management", semester: 1 },
  { id: 14, name: "Business Communication", code: "BBA103", course: "bba", branch: "management", semester: 1 },

  // BBA Finance Sem 1
  { id: 15, name: "Financial Accounting I", code: "FIN101", course: "bba", branch: "finance", semester: 1 },
  { id: 16, name: "Micro Economics", code: "FIN102", course: "bba", branch: "finance", semester: 1 },
  { id: 17, name: "Business Mathematics", code: "FIN103", course: "bba", branch: "finance", semester: 1 },
];

export async function fetchSubjects({ course, branch, semester }) {
  return subjectsDB.filter(
    (s) =>
      (!course || s.course === course) &&
      (!branch || s.branch === branch) &&
      (!semester || s.semester === semester)
  );
}
