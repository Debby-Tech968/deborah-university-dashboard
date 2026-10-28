export const UNIVERSITY = {
  name: "Deborah University",
  short: "Deborah",
  college: "College of Computing & Digital Technology",
  session: "2026/2027",
  term: "Fall 2026",
  week: 9,
  totalWeeks: 15,
  supportEmail: "support@deborah.edu",
  bursaryEmail: "bursary@deborah.edu",
  phone: "+234 812 555 0142",
  address: "12 Innovation Way, Yaba, Lagos"
};

export const STUDENT_PASSWORD = "student123";

export const FEATURED_STUDENT_EMAILS = [
  "amara.okafor@deborah.edu",
  "daniel.reyes@deborah.edu",
  "grace.mwangi@deborah.edu",
  "ethan.clarke@deborah.edu"
];

export const ADMIN_PASSWORD = "admin123";

export const ADMIN_ACCOUNTS = [
  {
    role: "admin",
    name: "Dr. Maya Ellis",
    firstName: "Maya",
    email: "m.ellis@deborah.edu",
    password: ADMIN_PASSWORD,
    title: "University Registrar",
    id: "STAFF-0041"
  },
  {
    role: "admin",
    name: "Daniel Okoro",
    firstName: "Daniel",
    email: "d.okoro@deborah.edu",
    password: ADMIN_PASSWORD,
    title: "University Bursar",
    id: "STAFF-0088"
  },
  {
    role: "admin",
    name: "Dr. Sarah Whitfield",
    firstName: "Sarah",
    email: "s.whitfield@deborah.edu",
    password: ADMIN_PASSWORD,
    title: "Dean, College of Computing",
    id: "STAFF-0017"
  }
];

export const NAV = {
  admin: [
    { label: "Overview", path: "/admin", icon: "grid" },
    { label: "Students", path: "/admin/students", icon: "users" },
    { label: "Courses", path: "/admin/courses", icon: "book" },
    { label: "Finance", path: "/admin/finance", icon: "wallet" }
  ],
  student: [
    { label: "Overview", path: "/student", icon: "grid" },
    { label: "My courses", path: "/student/courses", icon: "book" },
    { label: "Fees & payments", path: "/student/finance", icon: "wallet" }
  ]
};

export const PROGRAMS = [
  "Computer Science",
  "Software Engineering",
  "Cyber Security",
  "Data Science",
  "Artificial Intelligence",
  "Information Technology"
];

export const DEPARTMENTS = [
  "Computing",
  "Software Engineering",
  "Cyber Security",
  "Data Science",
  "AI & Robotics",
  "Information Systems"
];

export const DEPARTMENT_TONES = {
  Computing: "#2f55d4",
  "Software Engineering": "#7c5cf0",
  "Cyber Security": "#d0534e",
  "Data Science": "#1f9d79",
  "AI & Robotics": "#c88a1c",
  "Information Systems": "#3d7fa6"
};

export const STUDENTS = [
  {
    id: "DU-2023-0142",
    first: "Amara",
    last: "Okafor",
    email: "amara.okafor@deborah.edu",
    program: "Computer Science",
    department: "Computing",
    year: 3,
    gpa: 3.72,
    status: "Active",
    phone: "+234 812 555 0142",
    advisor: "Dr. Lena Fischer",
    feeBalance: 245000
  },
  {
    id: "DU-2024-0318",
    first: "Daniel",
    last: "Reyes",
    email: "daniel.reyes@deborah.edu",
    program: "Software Engineering",
    department: "Software Engineering",
    year: 2,
    gpa: 3.41,
    status: "Active",
    phone: "+234 803 555 0188",
    advisor: "Prof. Ade Balogun",
    feeBalance: 0
  },
  {
    id: "DU-2024-0402",
    first: "Ethan",
    last: "Clarke",
    email: "ethan.clarke@deborah.edu",
    program: "Cyber Security",
    department: "Cyber Security",
    year: 2,
    gpa: 2.84,
    status: "Probation",
    phone: "+234 805 555 0124",
    advisor: "Dr. Sarah Whitfield",
    feeBalance: 245000
  },
  {
    id: "DU-2022-0064",
    first: "Grace",
    last: "Mwangi",
    email: "grace.mwangi@deborah.edu",
    program: "Data Science",
    department: "Data Science",
    year: 4,
    gpa: 3.92,
    status: "Active",
    phone: "+234 807 555 0161",
    advisor: "Dr. Ifeoma Eze",
    feeBalance: 0
  },
  {
    id: "DU-2025-0509",
    first: "Hana",
    last: "Sato",
    email: "hana.sato@deborah.edu",
    program: "Artificial Intelligence",
    department: "AI & Robotics",
    year: 1,
    gpa: 3.61,
    status: "Active",
    phone: "+234 809 555 0119",
    advisor: "Dr. Marco Bianchi",
    feeBalance: 245000
  },
  {
    id: "DU-2025-0477",
    first: "Isabella",
    last: "Rossi",
    email: "isabella.rossi@deborah.edu",
    program: "Information Technology",
    department: "Information Systems",
    year: 1,
    gpa: 3.28,
    status: "Active",
    phone: "+234 810 555 0155",
    advisor: "Prof. Henry Cole",
    feeBalance: 0
  },
  {
    id: "DU-2025-0451",
    first: "Liam",
    last: "Bennett",
    email: "liam.bennett@deborah.edu",
    program: "Computer Science",
    department: "Computing",
    year: 1,
    gpa: 3.12,
    status: "Active",
    phone: "+234 811 555 0137",
    advisor: "Dr. Alice Morgan",
    feeBalance: 120000
  },
  {
    id: "DU-2023-0215",
    first: "Mateo",
    last: "Silva",
    email: "mateo.silva@deborah.edu",
    program: "Software Engineering",
    department: "Software Engineering",
    year: 3,
    gpa: 3.58,
    status: "Active",
    phone: "+234 813 555 0173",
    advisor: "Prof. Nadia Rahman",
    feeBalance: 0
  },
  {
    id: "DU-2024-0366",
    first: "Priya",
    last: "Nair",
    email: "priya.nair@deborah.edu",
    program: "Cyber Security",
    department: "Cyber Security",
    year: 2,
    gpa: 3.77,
    status: "Active",
    phone: "+234 814 555 0102",
    advisor: "Dr. Sarah Whitfield",
    feeBalance: 245000
  },
  {
    id: "DU-2022-0091",
    first: "Noah",
    last: "Kim",
    email: "noah.kim@deborah.edu",
    program: "Artificial Intelligence",
    department: "AI & Robotics",
    year: 4,
    gpa: 3.65,
    status: "Active",
    phone: "+234 815 555 0184",
    advisor: "Dr. Marco Bianchi",
    feeBalance: 0
  },
  {
    id: "DU-2023-0288",
    first: "Zara",
    last: "Haddad",
    email: "zara.haddad@deborah.edu",
    program: "Data Science",
    department: "Data Science",
    year: 3,
    gpa: 3.44,
    status: "On hold",
    phone: "+234 816 555 0129",
    advisor: "Dr. Ifeoma Eze",
    feeBalance: 490000
  },
  {
    id: "DU-2024-0399",
    first: "Sofia",
    last: "Almeida",
    email: "sofia.almeida@deborah.edu",
    program: "Information Technology",
    department: "Information Systems",
    year: 2,
    gpa: 3.19,
    status: "Active",
    phone: "+234 817 555 0148",
    advisor: "Prof. Henry Cole",
    feeBalance: 120000
  },
  {
    id: "DU-2025-0522",
    first: "Lucas",
    last: "Ferreira",
    email: "lucas.ferreira@deborah.edu",
    program: "Software Engineering",
    department: "Software Engineering",
    year: 1,
    gpa: 3.55,
    status: "Active",
    phone: "+234 818 555 0191",
    advisor: "Prof. Ade Balogun",
    feeBalance: 0
  },
  {
    id: "DU-2022-0107",
    first: "Ada",
    last: "Nwosu",
    email: "ada.nwosu@deborah.edu",
    program: "Computer Science",
    department: "Computing",
    year: 4,
    gpa: 3.88,
    status: "Active",
    phone: "+234 819 555 0166",
    advisor: "Dr. Lena Fischer",
    feeBalance: 0
  },
  {
    id: "DU-2023-0244",
    first: "Omar",
    last: "Farouk",
    email: "omar.farouk@deborah.edu",
    program: "Cyber Security",
    department: "Cyber Security",
    year: 3,
    gpa: 2.95,
    status: "Probation",
    phone: "+234 820 555 0113",
    advisor: "Dr. Sarah Whitfield",
    feeBalance: 245000
  },
  {
    id: "DU-2024-0341",
    first: "Mei",
    last: "Chen",
    email: "mei.chen@deborah.edu",
    program: "Artificial Intelligence",
    department: "AI & Robotics",
    year: 2,
    gpa: 3.83,
    status: "Active",
    phone: "+234 821 555 0175",
    advisor: "Dr. Marco Bianchi",
    feeBalance: 0
  },
  {
    id: "DU-2025-0577",
    first: "Tunde",
    last: "Adebayo",
    email: "tunde.adebayo@deborah.edu",
    program: "Data Science",
    department: "Data Science",
    year: 1,
    gpa: 3.33,
    status: "Active",
    phone: "+234 822 555 0138",
    advisor: "Dr. Ifeoma Eze",
    feeBalance: 120000
  },
  {
    id: "DU-2023-0198",
    first: "Elena",
    last: "Petrova",
    email: "elena.petrova@deborah.edu",
    program: "Information Technology",
    department: "Information Systems",
    year: 3,
    gpa: 3.48,
    status: "Active",
    phone: "+234 823 555 0150",
    advisor: "Prof. Henry Cole",
    feeBalance: 0
  }
];

export function studentAccount(student) {
  return {
    role: "student",
    name: `${student.first} ${student.last}`,
    firstName: student.first,
    email: student.email,
    password: STUDENT_PASSWORD,
    title: `BSc ${student.program} · Year ${student.year}`,
    id: student.id,
    program: student.program,
    department: student.department,
    year: student.year,
    gpa: student.gpa,
    status: student.status,
    phone: student.phone,
    advisor: student.advisor,
    feeBalance: student.feeBalance
  };
}

export const STUDENT_ACCOUNTS = STUDENTS.map(studentAccount);

export const FEATURED_STUDENT_ACCOUNTS = FEATURED_STUDENT_EMAILS.map((email) =>
  STUDENT_ACCOUNTS.find((account) => account.email === email)
).filter(Boolean);

export const APPLICATIONS = [
  {
    id: "APP-8841",
    name: "Chloe Dubois",
    email: "chloe.dubois@gmail.com",
    program: "Artificial Intelligence",
    department: "AI & Robotics",
    submitted: "2h ago",
    status: "Under review"
  },
  {
    id: "APP-8837",
    name: "Marcus Lee",
    email: "marcus.lee@gmail.com",
    program: "Computer Science",
    department: "Computing",
    submitted: "5h ago",
    status: "Approved"
  },
  {
    id: "APP-8829",
    name: "Fatima Zahra",
    email: "fatima.zahra@gmail.com",
    program: "Cyber Security",
    department: "Cyber Security",
    submitted: "Yesterday",
    status: "Under review"
  },
  {
    id: "APP-8822",
    name: "Tomás Rivera",
    email: "tomas.rivera@gmail.com",
    program: "Software Engineering",
    department: "Software Engineering",
    submitted: "Yesterday",
    status: "Waitlisted"
  },
  {
    id: "APP-8814",
    name: "Anya Petrova",
    email: "anya.petrova@gmail.com",
    program: "Data Science",
    department: "Data Science",
    submitted: "2 days ago",
    status: "Approved"
  },
  {
    id: "APP-8809",
    name: "Kwame Mensah",
    email: "kwame.mensah@gmail.com",
    program: "Cyber Security",
    department: "Cyber Security",
    submitted: "2 days ago",
    status: "Approved"
  }
];

export const APPROVALS = [
  {
    id: "APR-201",
    title: "CSC 412 lab capacity increase",
    type: "Academic request",
    due: "Due today",
    meta: "From 40 to 60 seats"
  },
  {
    id: "APR-202",
    title: "AIM 401 robotics equipment",
    type: "Budget approval · ₦2,400,000",
    due: "Due tomorrow",
    meta: "Robotics & embedded systems lab"
  },
  {
    id: "APR-203",
    title: "New Data Science elective",
    type: "Curriculum change",
    due: "Due Friday",
    meta: "DTS 425 · Applied Generative AI"
  }
];

export const ACTIVITIES = [
  { id: 1, text: "New application received from Chloe Dubois", time: "2 hours ago", tone: "blue" },
  { id: 2, text: "Tuition payment confirmed · Amara Okafor", time: "4 hours ago", tone: "green" },
  { id: 3, text: "CSC 314 moved to Lab 4.12", time: "6 hours ago", tone: "gold" },
  { id: 4, text: "42 new students enrolled in Computing", time: "Yesterday", tone: "violet" }
];

export const NOTIFICATIONS = [
  {
    id: 1,
    title: "CSC 412 lab moved to Lab 5.02",
    detail: "Your Machine Learning lab starts there tomorrow at 11:00.",
    time: "10 min ago",
    unread: true,
    icon: "cpu"
  },
  {
    id: 2,
    title: "Tuition payment received",
    detail: "We have confirmed your ₦255,000 payment. A receipt is ready.",
    time: "2 hours ago",
    unread: true,
    icon: "wallet"
  },
  {
    id: 3,
    title: "Spring 2027 registration opens Monday",
    detail: "Your window starts 3 November at 09:00. Plan up to 18 credits.",
    time: "Yesterday",
    unread: false,
    icon: "calendar"
  },
  {
    id: 4,
    title: "Deborah Hackathon registration closes Friday",
    detail: "40+ teams have registered. Build something ambitious.",
    time: "2 days ago",
    unread: false,
    icon: "terminal"
  }
];

export const ENROLMENT = [
  { label: "Fall 24", value: 10420 },
  { label: "Spring 25", value: 10880 },
  { label: "Fall 25", value: 11240 },
  { label: "Spring 26", value: 11890 },
  { label: "Fall 26", value: 12480 }
];

export const DEPARTMENT_MIX = [
  { label: "Computing", value: 32, color: "#2f55d4" },
  { label: "Software Eng.", value: 24, color: "#7c5cf0" },
  { label: "Cyber Security", value: 16, color: "#d0534e" },
  { label: "Data Science", value: 12, color: "#1f9d79" },
  { label: "AI & Robotics", value: 10, color: "#f2b544" },
  { label: "Info. Systems", value: 6, color: "#3d7fa6" }
];

export const COURSES = [
  {
    code: "CSC 314",
    title: "Human–Computer Interaction",
    department: "Computing",
    instructor: "Dr. Lena Fischer",
    capacity: 120,
    enrolled: 84,
    schedule: "Mon & Wed · 10:00",
    room: "Lab 4.12",
    status: "Active",
    credits: 3
  },
  {
    code: "CSC 412",
    title: "Machine Learning",
    department: "AI & Robotics",
    instructor: "Dr. Lena Fischer",
    capacity: 60,
    enrolled: 48,
    schedule: "Tue & Thu · 11:00",
    room: "Lab 5.02",
    status: "Active",
    credits: 3
  },
  {
    code: "CYB 305",
    title: "Applied Cryptography",
    department: "Cyber Security",
    instructor: "Dr. Sarah Whitfield",
    capacity: 80,
    enrolled: 58,
    schedule: "Mon & Thu · 14:00",
    room: "Security Lab",
    status: "Active",
    credits: 3
  },
  {
    code: "SWE 322",
    title: "Scalable Web Systems",
    department: "Software Engineering",
    instructor: "Prof. Ade Balogun",
    capacity: 100,
    enrolled: 96,
    schedule: "Tue & Thu · 09:00",
    room: "Room B2.04",
    status: "Active",
    credits: 3
  },
  {
    code: "DTS 310",
    title: "Data Engineering",
    department: "Data Science",
    instructor: "Dr. Ifeoma Eze",
    capacity: 48,
    enrolled: 40,
    schedule: "Wed & Fri · 08:00",
    room: "Data Lab 2",
    status: "Active",
    credits: 3
  },
  {
    code: "AIM 401",
    title: "Autonomous Systems",
    department: "AI & Robotics",
    instructor: "Dr. Marco Bianchi",
    capacity: 90,
    enrolled: 72,
    schedule: "Fri · 11:00",
    room: "Robotics Studio",
    status: "Active",
    credits: 3
  },
  {
    code: "CSC 350",
    title: "Cloud & DevOps",
    department: "Computing",
    instructor: "Dr. Peter Novak",
    capacity: 110,
    enrolled: 88,
    schedule: "Wed · 15:00",
    room: "Lab 3.10",
    status: "Active",
    credits: 3
  },
  {
    code: "CYB 410",
    title: "Ethical Hacking",
    department: "Cyber Security",
    instructor: "Dr. Sarah Whitfield",
    capacity: 40,
    enrolled: 35,
    schedule: "Tue · 13:00",
    room: "Security Lab",
    status: "Active",
    credits: 3
  },
  {
    code: "SWE 415",
    title: "Mobile App Development",
    department: "Software Engineering",
    instructor: "Prof. Nadia Rahman",
    capacity: 50,
    enrolled: 35,
    schedule: "Mon · 09:00",
    room: "Studio 2.03",
    status: "Draft",
    credits: 3
  },
  {
    code: "DTS 420",
    title: "Big Data Analytics",
    department: "Data Science",
    instructor: "Dr. Ifeoma Eze",
    capacity: 70,
    enrolled: 52,
    schedule: "Thu · 10:00",
    room: "Data Lab 1",
    status: "Active",
    credits: 3
  },
  {
    code: "AIM 320",
    title: "Computer Vision",
    department: "AI & Robotics",
    instructor: "Dr. Marco Bianchi",
    capacity: 75,
    enrolled: 60,
    schedule: "Fri · 14:00",
    room: "Robotics Studio",
    status: "Active",
    credits: 3
  },
  {
    code: "CSC 480",
    title: "Blockchain Engineering",
    department: "Computing",
    instructor: "Dr. Peter Novak",
    capacity: 45,
    enrolled: 30,
    schedule: "Wed · 11:00",
    room: "Lab 3.08",
    status: "Draft",
    credits: 3
  },
  {
    code: "INF 220",
    title: "Database Systems",
    department: "Information Systems",
    instructor: "Prof. Henry Cole",
    capacity: 100,
    enrolled: 88,
    schedule: "Mon · 12:00",
    room: "Lab 2.06",
    status: "Active",
    credits: 3
  },
  {
    code: "INF 330",
    title: "IT Project Management",
    department: "Information Systems",
    instructor: "Prof. Henry Cole",
    capacity: 60,
    enrolled: 42,
    schedule: "Thu · 15:00",
    room: "Room A1.12",
    status: "Draft",
    credits: 3
  },
  {
    code: "GIT 101",
    title: "Programming Fundamentals",
    department: "Computing",
    instructor: "Dr. Alice Morgan",
    capacity: 150,
    enrolled: 118,
    schedule: "Mon & Wed · 08:00",
    room: "Hall C",
    status: "Active",
    credits: 3
  },
  {
    code: "MTH 210",
    title: "Discrete Mathematics for Computing",
    department: "Computing",
    instructor: "Dr. Alice Morgan",
    capacity: 80,
    enrolled: 65,
    schedule: "Tue & Thu · 08:00",
    room: "Hall C",
    status: "Active",
    credits: 3
  }
];

export const MY_COURSES = [
  {
    code: "CSC 314",
    title: "Human–Computer Interaction",
    instructor: "Dr. Lena Fischer",
    schedule: "Mon & Wed · 10:00",
    room: "Lab 4.12",
    progress: 64,
    grade: "A",
    credits: 3,
    department: "Computing"
  },
  {
    code: "CSC 412",
    title: "Machine Learning",
    instructor: "Dr. Lena Fischer",
    schedule: "Tue & Thu · 11:00",
    room: "Lab 5.02",
    progress: 58,
    grade: "A–",
    credits: 3,
    department: "AI & Robotics"
  },
  {
    code: "SWE 322",
    title: "Scalable Web Systems",
    instructor: "Prof. Ade Balogun",
    schedule: "Tue & Thu · 09:00",
    room: "Room B2.04",
    progress: 71,
    grade: "A",
    credits: 3,
    department: "Software Engineering"
  },
  {
    code: "MTH 210",
    title: "Discrete Mathematics for Computing",
    instructor: "Dr. Alice Morgan",
    schedule: "Mon & Thu · 08:00",
    room: "Hall C",
    progress: 68,
    grade: "B+",
    credits: 3,
    department: "Computing"
  },
  {
    code: "DTS 310",
    title: "Data Engineering",
    instructor: "Dr. Ifeoma Eze",
    schedule: "Wed & Fri · 08:00",
    room: "Data Lab 2",
    progress: 62,
    grade: "A–",
    credits: 3,
    department: "Data Science"
  },
  {
    code: "CYB 305",
    title: "Applied Cryptography",
    instructor: "Dr. Sarah Whitfield",
    schedule: "Mon & Thu · 14:00",
    room: "Security Lab",
    progress: 55,
    grade: "IP",
    credits: 3,
    department: "Cyber Security"
  }
];

export const REGISTRATION_COURSES = [
  {
    code: "AIM 320",
    title: "Computer Vision",
    instructor: "Dr. Marco Bianchi",
    schedule: "Fri · 14:00",
    credits: 3,
    capacity: 75,
    enrolled: 60,
    selected: true
  },
  {
    code: "INF 330",
    title: "IT Project Management",
    instructor: "Prof. Henry Cole",
    schedule: "Thu · 15:00",
    credits: 3,
    capacity: 60,
    enrolled: 42,
    selected: true
  },
  {
    code: "SWE 415",
    title: "Mobile App Development",
    instructor: "Prof. Nadia Rahman",
    schedule: "Mon · 09:00",
    credits: 3,
    capacity: 50,
    enrolled: 35,
    selected: false
  },
  {
    code: "DTS 420",
    title: "Big Data Analytics",
    instructor: "Dr. Ifeoma Eze",
    schedule: "Thu · 10:00",
    credits: 3,
    capacity: 70,
    enrolled: 52,
    selected: false
  },
  {
    code: "CSC 480",
    title: "Blockchain Engineering",
    instructor: "Dr. Peter Novak",
    schedule: "Wed · 11:00",
    credits: 3,
    capacity: 45,
    enrolled: 30,
    selected: false
  },
  {
    code: "AIM 401",
    title: "Autonomous Systems",
    instructor: "Dr. Marco Bianchi",
    schedule: "Fri · 11:00",
    credits: 3,
    capacity: 90,
    enrolled: 72,
    selected: false
  }
];

export const GRADES = [
  {
    code: "CSC 314",
    title: "Human–Computer Interaction",
    term: "Spring 2026",
    credits: 3,
    grade: "A",
    points: 4.0
  },
  {
    code: "CSC 412",
    title: "Machine Learning",
    term: "Spring 2026",
    credits: 3,
    grade: "A–",
    points: 3.7
  },
  {
    code: "SWE 322",
    title: "Scalable Web Systems",
    term: "Spring 2026",
    credits: 3,
    grade: "A",
    points: 4.0
  },
  {
    code: "MTH 210",
    title: "Discrete Mathematics for Computing",
    term: "Fall 2025",
    credits: 3,
    grade: "B+",
    points: 3.3
  },
  {
    code: "DTS 310",
    title: "Data Engineering",
    term: "Fall 2025",
    credits: 3,
    grade: "A–",
    points: 3.7
  }
];

export const SCHEDULE = [
  {
    time: "09:00 – 10:30",
    title: "Human–Computer Interaction",
    code: "CSC 314",
    meta: "Dr. Lena Fischer",
    room: "Lab 4.12",
    state: "now"
  },
  {
    time: "11:00 – 12:30",
    title: "Machine Learning",
    code: "CSC 412",
    meta: "Dr. Lena Fischer",
    room: "Lab 5.02",
    state: "next"
  },
  {
    time: "14:00 – 15:30",
    title: "Data Engineering",
    code: "DTS 310",
    meta: "Dr. Ifeoma Eze",
    room: "Data Lab 2",
    state: ""
  },
  {
    time: "16:00 – 17:00",
    title: "Algorithms study group",
    code: "GROUP",
    meta: "Peer-led session",
    room: "Library Pod 3",
    state: ""
  }
];

export const DEADLINES = [
  {
    id: 1,
    day: "29",
    month: "Oct",
    title: "Problem Set 4",
    code: "CSC 412",
    priority: "High",
    done: false
  },
  {
    id: 2,
    day: "30",
    month: "Oct",
    title: "HCI prototype review",
    code: "CSC 314",
    priority: "Medium",
    done: false
  },
  {
    id: 3,
    day: "02",
    month: "Nov",
    title: "Data pipeline assignment",
    code: "DTS 310",
    priority: "Low",
    done: false
  }
];

export const ANNOUNCEMENTS = [
  {
    id: 1,
    title: "Spring 2027 registration opens 3 Nov",
    meta: "Registrar's Office · 1 day ago",
    icon: "calendar"
  },
  {
    id: 2,
    title: "Cloud lab extended hours during midterms",
    meta: "Computing Labs · 2 days ago",
    icon: "cloud"
  },
  {
    id: 3,
    title: "Deborah Hackathon: 40+ teams registered",
    meta: "Careers & Innovation Hub · 4 days ago",
    icon: "terminal"
  }
];

export const GPA_TERMS = [
  { label: "Fall 24", value: 3.28 },
  { label: "Spring 25", value: 3.45 },
  { label: "Fall 25", value: 3.58 },
  { label: "Spring 26", value: 3.66 },
  { label: "Fall 26", value: 3.72 }
];

export const STUDENT_FINANCE = {
  totalTuition: 1250000,
  scholarship: 250000,
  paid: 755000,
  nextDue: "15 November 2026",
  plan: [
    { label: "Instalment 1", amount: 500000, due: "12 September 2026", status: "Paid" },
    { label: "Instalment 2", amount: 255000, due: "18 October 2026", status: "Paid" },
    { label: "Instalment 3", amount: 245000, due: "15 November 2026", status: "Due" }
  ],
  payments: [
    {
      ref: "PAY-2026-0912",
      date: "12 Sep 2026",
      amount: 500000,
      method: "Bank transfer",
      status: "Completed"
    },
    {
      ref: "PAY-2026-1018",
      date: "18 Oct 2026",
      amount: 255000,
      method: "Card",
      status: "Completed"
    }
  ]
};

export const ADMIN_FINANCE = {
  collected: 184600000,
  outstanding: 23400000,
  scholarships: 8200000,
  collectionRate: 88.8,
  monthly: [
    { label: "May", value: 24.2 },
    { label: "Jun", value: 28.6 },
    { label: "Jul", value: 19.4 },
    { label: "Aug", value: 31.2 },
    { label: "Sep", value: 38.5 },
    { label: "Oct", value: 42.7 }
  ],
  channels: [
    { label: "Bank transfer", value: 52, color: "#2f55d4" },
    { label: "Card", value: 33, color: "#f2b544" },
    { label: "USSD", value: 10, color: "#7c5cf0" },
    { label: "Cash", value: 5, color: "#1f9d79" }
  ],
  payments: [
    {
      ref: "PAY-2026-1042",
      student: "Amara Okafor",
      program: "Computer Science",
      amount: 255000,
      method: "Card",
      date: "28 Oct 2026",
      status: "Completed"
    },
    {
      ref: "PAY-2026-1039",
      student: "Daniel Reyes",
      program: "Software Engineering",
      amount: 500000,
      method: "Bank transfer",
      date: "27 Oct 2026",
      status: "Completed"
    },
    {
      ref: "PAY-2026-1035",
      student: "Priya Nair",
      program: "Cyber Security",
      amount: 245000,
      method: "USSD",
      date: "27 Oct 2026",
      status: "Pending"
    },
    {
      ref: "PAY-2026-1028",
      student: "Liam Bennett",
      program: "Computer Science",
      amount: 1000000,
      method: "Bank transfer",
      date: "26 Oct 2026",
      status: "Completed"
    },
    {
      ref: "PAY-2026-1022",
      student: "Sofia Almeida",
      program: "Information Technology",
      amount: 125000,
      method: "Card",
      date: "25 Oct 2026",
      status: "Processing"
    },
    {
      ref: "PAY-2026-1018",
      student: "Noah Kim",
      program: "Artificial Intelligence",
      amount: 245000,
      method: "Bank transfer",
      date: "24 Oct 2026",
      status: "Completed"
    },
    {
      ref: "PAY-2026-1011",
      student: "Zara Haddad",
      program: "Data Science",
      amount: 750000,
      method: "Card",
      date: "23 Oct 2026",
      status: "Completed"
    },
    {
      ref: "PAY-2026-1004",
      student: "Ethan Clarke",
      program: "Cyber Security",
      amount: 245000,
      method: "Bank transfer",
      date: "22 Oct 2026",
      status: "Pending"
    }
  ],
  feeSchedule: [
    { program: "Computer Science", tuition: 1250000 },
    { program: "Software Engineering", tuition: 1300000 },
    { program: "Cyber Security", tuition: 1320000 },
    { program: "Data Science", tuition: 1280000 },
    { program: "Artificial Intelligence", tuition: 1350000 },
    { program: "Information Technology", tuition: 1180000 }
  ]
};

function roundToThousand(value) {
  return Math.round(value / 1000) * 1000;
}

export function buildStudentFinance(student) {
  if (!student) return structuredClone(STUDENT_FINANCE);
  if (student.id === "DU-2023-0142") return structuredClone(STUDENT_FINANCE);

  const tuition =
    ADMIN_FINANCE.feeSchedule.find((item) => item.program === student.program)?.tuition ??
    1250000;
  const scholarship = (student.gpa ?? 0) >= 3.8 ? 250000 : 0;
  const netPayable = Math.max(0, tuition - scholarship);
  const balance = Math.min(
    netPayable,
    Math.max(0, Math.round(Number(student.feeBalance) || 0))
  );
  const paid = Math.max(0, netPayable - balance);

  const first = roundToThousand(netPayable * 0.5);
  const second = roundToThousand(netPayable * 0.25);
  const third = Math.max(0, netPayable - first - second);
  const plan = [
    { label: "Instalment 1", amount: first, due: "12 September 2026" },
    { label: "Instalment 2", amount: second, due: "18 October 2026" },
    { label: "Instalment 3", amount: third, due: "15 November 2026" }
  ];

  const paymentMeta = [
    { date: "12 Sep 2026", method: "Bank transfer" },
    { date: "18 Oct 2026", method: "Card" },
    { date: "15 Nov 2026", method: "USSD" }
  ];
  const payments = [];
  let remaining = paid;

  plan.forEach((item, index) => {
    if (remaining <= 0) return;
    const amount = Math.min(remaining, item.amount);
    if (amount <= 0) return;
    const meta = paymentMeta[index];
    payments.unshift({
      ref: `PAY-2026-${student.id.slice(-4)}-${index + 1}`,
      date: meta.date,
      amount,
      method: meta.method,
      status: "Completed"
    });
    remaining -= amount;
  });

  return {
    totalTuition: tuition,
    scholarship,
    paid,
    nextDue: "15 November 2026",
    plan,
    payments
  };
}
