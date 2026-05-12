// ─── Reports Service ──────────────────────────────────────────────────────────
// TODO (backend integration): Replace all dummy-data functions below with real
// API calls using the shared axiosInstance (or a dedicated axios instance).
//
// Pattern used in other services:
//   import axiosInstance from "../utils/axiosInstance";
//   export async function getDetailedFacultyReport(params) {
//     const res = await axiosInstance.get("/Reports/DetailedFaculty", { params });
//     return res.data;
//   }
// ─────────────────────────────────────────────────────────────────────────────

// ─── Lookup: Universities / Faculties / Departments ──────────────────────────
// TODO: fetch from API  →  GET /Lookups/Universities
export async function getUniversitiesTree() {
  // Dummy data: array of universities, each with faculties, each with departments
  return [
    {
      id: 1,
      name_ar: "جامعة العاصمة",
      name_en: "Capital University",
      faculties: [
        {
          id: 11,
          name_ar: "كلية الهندسة",
          name_en: "Faculty of Engineering",
          departments: [
            {
              id: 111,
              name_ar: "هندسة الحاسبات",
              name_en: "Computer Engineering",
            },
            {
              id: 112,
              name_ar: "الهندسة الكهربائية",
              name_en: "Electrical Engineering",
            },
            {
              id: 113,
              name_ar: "الهندسة المدنية",
              name_en: "Civil Engineering",
            },
          ],
        },
        {
          id: 12,
          name_ar: "كلية العلوم",
          name_en: "Faculty of Science",
          departments: [
            { id: 121, name_ar: "الرياضيات", name_en: "Mathematics" },
            { id: 122, name_ar: "الفيزياء", name_en: "Physics" },
            { id: 123, name_ar: "الكيمياء", name_en: "Chemistry" },
          ],
        },
        {
          id: 13,
          name_ar: "كلية الطب",
          name_en: "Faculty of Medicine",
          departments: [
            { id: 131, name_ar: "الجراحة", name_en: "Surgery" },
            { id: 132, name_ar: "الباطنة", name_en: "Internal Medicine" },
          ],
        },
      ],
    },
  ];
}

// ─── Report: Detailed Faculty Members ────────────────────────────────────────
// TODO: GET /Reports/DetailedFaculty?departmentIds[]=...
export async function getDetailedFacultyReport({ departmentIds = [] }) {
  // Dummy data – replace with real API call
  const rows = [
    {
      id: 1,
      name_ar: "د. أحمد محمد علي",
      name_en: "Dr. Ahmed Mohamed Ali",
      department_ar: "هندسة الحاسبات",
      department_en: "Computer Engineering",
      email: "ahmed.ali@university.edu",
      phone: "+20 100 123 4567",
      internationalResearches: 5,
      localResearches: 8,
      patents: 2,
      awards: 3,
      researches: [
        {
          id: 1,
          title_ar: "بحث في الذكاء الاصطناعي",
          title_en: "Research in Artificial Intelligence",
          year: 2023,
        },
        {
          id: 2,
          title_ar: "تعلم الآلة في الصور الطبية",
          title_en: "Machine Learning in Medical Images",
          year: 2022,
        },
        {
          id: 3,
          title_ar: "شبكات عصبية عميقة",
          title_en: "Deep Neural Networks",
          year: 2021,
        },
        {
          id: 4,
          title_ar: "معالجة اللغة الطبيعية",
          title_en: "Natural Language Processing",
          year: 2020,
        },
        {
          id: 5,
          title_ar: "الحوسبة السحابية",
          title_en: "Cloud Computing",
          year: 2019,
        },
      ],
    },
    {
      id: 2,
      name_ar: "د. سارة إبراهيم حسن",
      name_en: "Dr. Sara Ibrahim Hassan",
      department_ar: "الهندسة الكهربائية",
      department_en: "Electrical Engineering",
      email: "sara.hassan@university.edu",
      phone: "+20 101 234 5678",
      internationalResearches: 7,
      localResearches: 4,
      patents: 1,
      awards: 2,
      researches: [
        {
          id: 6,
          title_ar: "أنظمة الطاقة المتجددة",
          title_en: "Renewable Energy Systems",
          year: 2024,
        },
        {
          id: 7,
          title_ar: "الإلكترونيات القدرة",
          title_en: "Power Electronics",
          year: 2023,
        },
        {
          id: 8,
          title_ar: "الشبكات الذكية",
          title_en: "Smart Grids",
          year: 2022,
        },
      ],
    },
    {
      id: 3,
      name_ar: "أ.د. محمود كمال فريد",
      name_en: "Prof. Mahmoud Kamal Farid",
      department_ar: "الرياضيات",
      department_en: "Mathematics",
      email: "mahmoud.farid@university.edu",
      phone: "+20 102 345 6789",
      internationalResearches: 12,
      localResearches: 6,
      patents: 0,
      awards: 5,
      researches: [
        {
          id: 9,
          title_ar: "نظرية الأعداد التطبيقية",
          title_en: "Applied Number Theory",
          year: 2024,
        },
        {
          id: 10,
          title_ar: "الجبر التجريدي",
          title_en: "Abstract Algebra",
          year: 2023,
        },
        {
          id: 11,
          title_ar: "التحليل الرياضي المتقدم",
          title_en: "Advanced Mathematical Analysis",
          year: 2022,
        },
        {
          id: 12,
          title_ar: "الطوبولوجيا التفاضلية",
          title_en: "Differential Topology",
          year: 2021,
        },
      ],
    },
    {
      id: 4,
      name_ar: "د. نور الدين عبد الله",
      name_en: "Dr. Nour El-Din Abdullah",
      department_ar: "الكيمياء",
      department_en: "Chemistry",
      email: "nourdin.abd@university.edu",
      phone: "+20 103 456 7890",
      internationalResearches: 3,
      localResearches: 9,
      patents: 4,
      awards: 1,
      researches: [
        {
          id: 13,
          title_ar: "الكيمياء الخضراء",
          title_en: "Green Chemistry",
          year: 2023,
        },
        {
          id: 14,
          title_ar: "تركيب المركبات العضوية",
          title_en: "Organic Compound Synthesis",
          year: 2022,
        },
        {
          id: 15,
          title_ar: "الكيمياء التحليلية الحديثة",
          title_en: "Modern Analytical Chemistry",
          year: 2021,
        },
      ],
    },
    {
      id: 5,
      name_ar: "أ. فاطمة يوسف خليل",
      name_en: "Prof. Fatma Yousef Khalil",
      department_ar: "الجراحة",
      department_en: "Surgery",
      email: "fatma.khalil@university.edu",
      phone: "+20 104 567 8901",
      internationalResearches: 9,
      localResearches: 5,
      patents: 0,
      awards: 4,
      researches: [
        {
          id: 16,
          title_ar: "تقنيات الجراحة بالمنظار",
          title_en: "Laparoscopic Surgery Techniques",
          year: 2024,
        },
        {
          id: 17,
          title_ar: "جراحة القلب المفتوح",
          title_en: "Open Heart Surgery",
          year: 2023,
        },
        {
          id: 18,
          title_ar: "الجراحة الروبوتية",
          title_en: "Robotic Surgery",
          year: 2022,
        },
        {
          id: 19,
          title_ar: "علاج الأورام الخبيثة جراحياً",
          title_en: "Surgical Treatment of Malignant Tumors",
          year: 2021,
        },
      ],
    },
    {
      id: 6,
      name_ar: "د. عمر فاروق الشيخ",
      name_en: "Dr. Omar Farouk El-Sheikh",
      department_ar: "الهندسة المدنية",
      department_en: "Civil Engineering",
      email: "omar.sheikh@university.edu",
      phone: "+20 105 678 9012",
      internationalResearches: 4,
      localResearches: 11,
      patents: 2,
      awards: 2,
      researches: [
        {
          id: 20,
          title_ar: "الخرسانة عالية الأداء",
          title_en: "High Performance Concrete",
          year: 2024,
        },
        {
          id: 21,
          title_ar: "الهندسة الزلزالية",
          title_en: "Earthquake Engineering",
          year: 2023,
        },
      ],
    },
  ];

  return {
    data: rows,
    totalCount: rows.length,
  };
}

// ─── Report: Biannual Research ────────────────────────────────────────────────
// TODO: GET /Reports/BiannualResearch?departmentIds[]=...
export async function getBiannualResearchReport({ departmentIds = [] }) {
  const rows = [
    {
      id: 1,
      title_ar: "تأثير الذكاء الاصطناعي على قطاع التعليم",
      title_en: "Impact of AI on Education Sector",
      publicationType_ar: "دولي",
      publicationType_en: "International",
      year: 2024,
    },
    {
      id: 2,
      title_ar: "بروتوكولات أمان الشبكات اللاسلكية",
      title_en: "Wireless Network Security Protocols",
      publicationType_ar: "دولي",
      publicationType_en: "International",
      year: 2024,
    },
    {
      id: 3,
      title_ar: "تحليل الجينوم باستخدام التعلم العميق",
      title_en: "Genome Analysis Using Deep Learning",
      publicationType_ar: "محلي",
      publicationType_en: "Local",
      year: 2024,
    },
    {
      id: 4,
      title_ar: "نمذجة المناخ وتغير درجات الحرارة",
      title_en: "Climate Modeling and Temperature Changes",
      publicationType_ar: "دولي",
      publicationType_en: "International",
      year: 2023,
    },
    {
      id: 5,
      title_ar: "تقنيات تخزين الطاقة الشمسية",
      title_en: "Solar Energy Storage Technologies",
      publicationType_ar: "محلي",
      publicationType_en: "Local",
      year: 2023,
    },
    {
      id: 6,
      title_ar: "الروبوتات الطبية في غرف العمليات",
      title_en: "Medical Robots in Operating Rooms",
      publicationType_ar: "دولي",
      publicationType_en: "International",
      year: 2023,
    },
    {
      id: 7,
      title_ar: "تأثير التلوث الهوائي على الصحة العامة",
      title_en: "Impact of Air Pollution on Public Health",
      publicationType_ar: "محلي",
      publicationType_en: "Local",
      year: 2023,
    },
    {
      id: 8,
      title_ar: "تطوير المواد النانوية للتطبيقات الطبية",
      title_en: "Developing Nanomaterials for Medical Applications",
      publicationType_ar: "دولي",
      publicationType_en: "International",
      year: 2022,
    },
    {
      id: 9,
      title_ar: "منهجية التعلم النشط في التعليم الجامعي",
      title_en: "Active Learning Methodology in Higher Education",
      publicationType_ar: "محلي",
      publicationType_en: "Local",
      year: 2022,
    },
    {
      id: 10,
      title_ar: "تحسين كفاءة محركات الرياح",
      title_en: "Improving Wind Turbine Efficiency",
      publicationType_ar: "دولي",
      publicationType_en: "International",
      year: 2022,
    },
    {
      id: 11,
      title_ar: "معالجة مياه الصرف الصحي بالطاقة الشمسية",
      title_en: "Wastewater Treatment Using Solar Energy",
      publicationType_ar: "محلي",
      publicationType_en: "Local",
      year: 2021,
    },
    {
      id: 12,
      title_ar: "التصوير بالرنين المغناطيسي بالذكاء الاصطناعي",
      title_en: "MRI Imaging with Artificial Intelligence",
      publicationType_ar: "دولي",
      publicationType_en: "International",
      year: 2021,
    },
  ];

  return {
    data: rows,
    totalCount: rows.length,
  };
}

// ─── Report: Research Statistics ─────────────────────────────────────────────
// TODO: GET /Reports/ResearchStatistics?departmentIds[]=...
export async function getResearchStatisticsReport({ departmentIds = [] }) {
  const rows = [
    {
      id: 1,
      name_ar: "د. أحمد محمد علي",
      name_en: "Dr. Ahmed Mohamed Ali",
      internationalResearches: 5,
      localResearches: 8,
      year: 2023,
    },
    {
      id: 2,
      name_ar: "د. سارة إبراهيم حسن",
      name_en: "Dr. Sara Ibrahim Hassan",
      internationalResearches: 7,
      localResearches: 4,
      year: 2024,
    },
    {
      id: 3,
      name_ar: "أ.د. محمود كمال فريد",
      name_en: "Prof. Mahmoud Kamal Farid",
      internationalResearches: 12,
      localResearches: 6,
      year: 2022,
    },
    {
      id: 4,
      name_ar: "د. نور الدين عبد الله",
      name_en: "Dr. Nour El-Din Abdullah",
      internationalResearches: 3,
      localResearches: 9,
      year: 2023,
    },
    {
      id: 5,
      name_ar: "أ. فاطمة يوسف خليل",
      name_en: "Prof. Fatma Yousef Khalil",
      internationalResearches: 9,
      localResearches: 5,
      year: 2024,
    },
    {
      id: 6,
      name_ar: "د. عمر فاروق الشيخ",
      name_en: "Dr. Omar Farouk El-Sheikh",
      internationalResearches: 4,
      localResearches: 11,
      year: 2022,
    },
    {
      id: 7,
      name_ar: "د. منى السيد رمضان",
      name_en: "Dr. Mona El-Sayed Ramadan",
      internationalResearches: 6,
      localResearches: 3,
      year: 2023,
    },
    {
      id: 8,
      name_ar: "أ.د. كريم عادل رزق",
      name_en: "Prof. Karim Adel Rizk",
      internationalResearches: 14,
      localResearches: 7,
      year: 2024,
    },
  ];

  return {
    data: rows,
    totalCount: rows.length,
  };
}

// ─── Report: Seminars & Conferences Statistics ───────────────────────────────
// TODO: GET /Reports/SeminarsStatistics?departmentIds[]=...
export async function getSeminarsStatisticsReport({ departmentIds = [] }) {
  const rows = [
    {
      id: 1,
      name_ar: "د. أحمد محمد علي",
      name_en: "Dr. Ahmed Mohamed Ali",
      seminarType_ar: "ندوة",
      seminarType_en: "Seminar",
      seminarCount: 3,
    },
    {
      id: 2,
      name_ar: "د. سارة إبراهيم حسن",
      name_en: "Dr. Sara Ibrahim Hassan",
      seminarType_ar: "مؤتمر",
      seminarType_en: "Conference",
      seminarCount: 5,
    },
    {
      id: 3,
      name_ar: "أ.د. محمود كمال فريد",
      name_en: "Prof. Mahmoud Kamal Farid",
      seminarType_ar: "ندوة",
      seminarType_en: "Seminar",
      seminarCount: 2,
    },
    {
      id: 4,
      name_ar: "د. نور الدين عبد الله",
      name_en: "Dr. Nour El-Din Abdullah",
      seminarType_ar: "مؤتمر",
      seminarType_en: "Conference",
      seminarCount: 7,
    },
    {
      id: 5,
      name_ar: "أ. فاطمة يوسف خليل",
      name_en: "Prof. Fatma Yousef Khalil",
      seminarType_ar: "ندوة",
      seminarType_en: "Seminar",
      seminarCount: 4,
    },
    {
      id: 6,
      name_ar: "د. عمر فاروق الشيخ",
      name_en: "Dr. Omar Farouk El-Sheikh",
      seminarType_ar: "مؤتمر",
      seminarType_en: "Conference",
      seminarCount: 6,
    },
    {
      id: 7,
      name_ar: "د. منى السيد رمضان",
      name_en: "Dr. Mona El-Sayed Ramadan",
      seminarType_ar: "ندوة",
      seminarType_en: "Seminar",
      seminarCount: 1,
    },
    {
      id: 8,
      name_ar: "أ.د. كريم عادل رزق",
      name_en: "Prof. Karim Adel Rizk",
      seminarType_ar: "مؤتمر",
      seminarType_en: "Conference",
      seminarCount: 9,
    },
  ];
  return { data: rows, totalCount: rows.length };
}

// ─── Report: Experiences Statistics ──────────────────────────────────────────
// TODO: GET /Reports/ExperiencesStatistics?departmentIds[]=...
export async function getExperiencesStatisticsReport({ departmentIds = [] }) {
  const rows = [
    {
      id: 1,
      name_ar: "د. أحمد محمد علي",
      name_en: "Dr. Ahmed Mohamed Ali",
      experienceType_ar: "خبرة عامة",
      experienceType_en: "General",
      experiencesCount: 4,
    },
    {
      id: 2,
      name_ar: "د. سارة إبراهيم حسن",
      name_en: "Dr. Sara Ibrahim Hassan",
      experienceType_ar: "خبرة تدريسية",
      experienceType_en: "Teaching",
      experiencesCount: 6,
    },
    {
      id: 3,
      name_ar: "أ.د. محمود كمال فريد",
      name_en: "Prof. Mahmoud Kamal Farid",
      experienceType_ar: "خبرة عامة",
      experienceType_en: "General",
      experiencesCount: 2,
    },
    {
      id: 4,
      name_ar: "د. نور الدين عبد الله",
      name_en: "Dr. Nour El-Din Abdullah",
      experienceType_ar: "خبرة تدريسية",
      experienceType_en: "Teaching",
      experiencesCount: 8,
    },
    {
      id: 5,
      name_ar: "أ. فاطمة يوسف خليل",
      name_en: "Prof. Fatma Yousef Khalil",
      experienceType_ar: "خبرة عامة",
      experienceType_en: "General",
      experiencesCount: 5,
    },
    {
      id: 6,
      name_ar: "د. عمر فاروق الشيخ",
      name_en: "Dr. Omar Farouk El-Sheikh",
      experienceType_ar: "خبرة تدريسية",
      experienceType_en: "Teaching",
      experiencesCount: 3,
    },
    {
      id: 7,
      name_ar: "د. منى السيد رمضان",
      name_en: "Dr. Mona El-Sayed Ramadan",
      experienceType_ar: "خبرة عامة",
      experienceType_en: "General",
      experiencesCount: 7,
    },
    {
      id: 8,
      name_ar: "أ.د. كريم عادل رزق",
      name_en: "Prof. Karim Adel Rizk",
      experienceType_ar: "خبرة تدريسية",
      experienceType_en: "Teaching",
      experiencesCount: 10,
    },
  ];
  return { data: rows, totalCount: rows.length };
}

// ─── Report: Publications Statistics ─────────────────────────────────────────
// TODO: GET /Reports/PublicationsStatistics?departmentIds[]=...
export async function getPublicationsStatisticsReport({ departmentIds = [] }) {
  const rows = [
    {
      id: 1,
      name_ar: "د. أحمد محمد علي",
      name_en: "Dr. Ahmed Mohamed Ali",
      publicationRole_ar: "مؤلف",
      publicationRole_en: "Author",
      publicationsCount: 4,
    },
    {
      id: 2,
      name_ar: "د. سارة إبراهيم حسن",
      name_en: "Dr. Sara Ibrahim Hassan",
      publicationRole_ar: "مؤلف مشارك",
      publicationRole_en: "Co-author",
      publicationsCount: 2,
    },
    {
      id: 3,
      name_ar: "أ.د. محمود كمال فريد",
      name_en: "Prof. Mahmoud Kamal Farid",
      publicationRole_ar: "محرر",
      publicationRole_en: "Editor",
      publicationsCount: 6,
    },
    {
      id: 4,
      name_ar: "د. نور الدين عبد الله",
      name_en: "Dr. Nour El-Din Abdullah",
      publicationRole_ar: "مترجم",
      publicationRole_en: "Translator",
      publicationsCount: 3,
    },
    {
      id: 5,
      name_ar: "أ. فاطمة يوسف خليل",
      name_en: "Prof. Fatma Yousef Khalil",
      publicationRole_ar: "مؤلف",
      publicationRole_en: "Author",
      publicationsCount: 7,
    },
    {
      id: 6,
      name_ar: "د. عمر فاروق الشيخ",
      name_en: "Dr. Omar Farouk El-Sheikh",
      publicationRole_ar: "مؤلف مشارك",
      publicationRole_en: "Co-author",
      publicationsCount: 1,
    },
    {
      id: 7,
      name_ar: "د. منى السيد رمضان",
      name_en: "Dr. Mona El-Sayed Ramadan",
      publicationRole_ar: "محرر",
      publicationRole_en: "Editor",
      publicationsCount: 5,
    },
    {
      id: 8,
      name_ar: "أ.د. كريم عادل رزق",
      name_en: "Prof. Karim Adel Rizk",
      publicationRole_ar: "مؤلف",
      publicationRole_en: "Author",
      publicationsCount: 9,
    },
  ];
  return { data: rows, totalCount: rows.length };
}

// ─── Report: CV Statistics ────────────────────────────────────────────────────
// TODO: GET /Reports/CVStatistics?departmentIds[]=...
export async function getCVStatisticsReport({ departmentIds = [] }) {
  const rows = [
    {
      id: 1,
      faculty_ar: "كلية الهندسة",
      faculty_en: "Faculty of Engineering",
      cvCount: 42,
    },
    {
      id: 2,
      faculty_ar: "كلية العلوم",
      faculty_en: "Faculty of Science",
      cvCount: 31,
    },
    {
      id: 3,
      faculty_ar: "كلية الطب",
      faculty_en: "Faculty of Medicine",
      cvCount: 27,
    },
    {
      id: 4,
      faculty_ar: "كلية الفنون الجميلة",
      faculty_en: "Faculty of Fine Arts",
      cvCount: 19,
    },
    {
      id: 5,
      faculty_ar: "كلية التربية",
      faculty_en: "Faculty of Education",
      cvCount: 35,
    },
    {
      id: 6,
      faculty_ar: "كلية الحقوق",
      faculty_en: "Faculty of Law",
      cvCount: 24,
    },
    {
      id: 7,
      faculty_ar: "كلية الاقتصاد والعلوم السياسية",
      faculty_en: "Faculty of Economics & Political Science",
      cvCount: 18,
    },
  ];
  return { data: rows, totalCount: rows.length };
}

// ─── Report: Faculty Member Count Statistics ──────────────────────────────────
// TODO: GET /Reports/FacultyCountStatistics?departmentIds[]=...
export async function getFacultyCountStatisticsReport({ departmentIds = [] }) {
  const rows = [
    {
      id: 1,
      faculty_ar: "كلية الهندسة",
      faculty_en: "Faculty of Engineering",
      memberCount: 42,
    },
    {
      id: 2,
      faculty_ar: "كلية العلوم",
      faculty_en: "Faculty of Science",
      memberCount: 31,
    },
    {
      id: 3,
      faculty_ar: "كلية الطب",
      faculty_en: "Faculty of Medicine",
      memberCount: 27,
    },
    {
      id: 4,
      faculty_ar: "كلية الفنون الجميلة",
      faculty_en: "Faculty of Fine Arts",
      memberCount: 19,
    },
    {
      id: 5,
      faculty_ar: "كلية التربية",
      faculty_en: "Faculty of Education",
      memberCount: 35,
    },
    {
      id: 6,
      faculty_ar: "كلية الحقوق",
      faculty_en: "Faculty of Law",
      memberCount: 24,
    },
    {
      id: 7,
      faculty_ar: "كلية الاقتصاد والعلوم السياسية",
      faculty_en: "Faculty of Economics & Political Science",
      memberCount: 18,
    },
  ];
  return { data: rows, totalCount: rows.length };
}

// ─── Report: Total Research Count Statistics ──────────────────────────────────
// TODO: GET /Reports/TotalResearchStatistics?departmentIds[]=...
export async function getTotalResearchCountReport({ departmentIds = [] }) {
  const rows = [
    {
      id: 1,
      faculty_ar: "كلية الهندسة",
      faculty_en: "Faculty of Engineering",
      researchCount: 78,
    },
    {
      id: 2,
      faculty_ar: "كلية العلوم",
      faculty_en: "Faculty of Science",
      researchCount: 55,
    },
    {
      id: 3,
      faculty_ar: "كلية الطب",
      faculty_en: "Faculty of Medicine",
      researchCount: 91,
    },
    {
      id: 4,
      faculty_ar: "كلية الفنون الجميلة",
      faculty_en: "Faculty of Fine Arts",
      researchCount: 23,
    },
    {
      id: 5,
      faculty_ar: "كلية التربية",
      faculty_en: "Faculty of Education",
      researchCount: 47,
    },
    {
      id: 6,
      faculty_ar: "كلية الحقوق",
      faculty_en: "Faculty of Law",
      researchCount: 34,
    },
    {
      id: 7,
      faculty_ar: "كلية الاقتصاد والعلوم السياسية",
      faculty_en: "Faculty of Economics & Political Science",
      researchCount: 41,
    },
  ];
  return { data: rows, totalCount: rows.length };
}

// ─── Report: Journal Participation Statistics ─────────────────────────────────
// TODO: GET /Reports/JournalsStatistics?departmentIds[]=...
export async function getJournalsStatisticsReport({ departmentIds = [] }) {
  const rows = [
    {
      id: 1,
      name_ar: "د. أحمد محمد علي",
      name_en: "Dr. Ahmed Mohamed Ali",
      participationType_ar: "نشر",
      participationType_en: "Publication",
      journalCount: 6,
    },
    {
      id: 2,
      name_ar: "د. سارة إبراهيم حسن",
      name_en: "Dr. Sara Ibrahim Hassan",
      participationType_ar: "تحكيم",
      participationType_en: "Review",
      journalCount: 4,
    },
    {
      id: 3,
      name_ar: "أ.د. محمود كمال فريد",
      name_en: "Prof. Mahmoud Kamal Farid",
      participationType_ar: "هيئة تحرير",
      participationType_en: "Editorial Board",
      journalCount: 2,
    },
    {
      id: 4,
      name_ar: "د. نور الدين عبد الله",
      name_en: "Dr. Nour El-Din Abdullah",
      participationType_ar: "نشر",
      participationType_en: "Publication",
      journalCount: 9,
    },
    {
      id: 5,
      name_ar: "أ. فاطمة يوسف خليل",
      name_en: "Prof. Fatma Yousef Khalil",
      participationType_ar: "تحكيم",
      participationType_en: "Review",
      journalCount: 3,
    },
    {
      id: 6,
      name_ar: "د. عمر فاروق الشيخ",
      name_en: "Dr. Omar Farouk El-Sheikh",
      participationType_ar: "هيئة تحرير",
      participationType_en: "Editorial Board",
      journalCount: 1,
    },
    {
      id: 7,
      name_ar: "د. منى السيد رمضان",
      name_en: "Dr. Mona El-Sayed Ramadan",
      participationType_ar: "نشر",
      participationType_en: "Publication",
      journalCount: 7,
    },
    {
      id: 8,
      name_ar: "أ.د. كريم عادل رزق",
      name_en: "Prof. Karim Adel Rizk",
      participationType_ar: "تحكيم",
      participationType_en: "Review",
      journalCount: 5,
    },
  ];
  return { data: rows, totalCount: rows.length };
}

// ─── Report: Article Review Statistics ───────────────────────────────────────
// TODO: GET /Reports/ArticleReviewsStatistics?departmentIds[]=...
export async function getArticleReviewsStatisticsReport({
  departmentIds = [],
}) {
  const rows = [
    {
      id: 1,
      name_ar: "د. أحمد محمد علي",
      name_en: "Dr. Ahmed Mohamed Ali",
      articleCount: 7,
      year: 2024,
    },
    {
      id: 2,
      name_ar: "د. سارة إبراهيم حسن",
      name_en: "Dr. Sara Ibrahim Hassan",
      articleCount: 4,
      year: 2023,
    },
    {
      id: 3,
      name_ar: "أ.د. محمود كمال فريد",
      name_en: "Prof. Mahmoud Kamal Farid",
      articleCount: 12,
      year: 2024,
    },
    {
      id: 4,
      name_ar: "د. نور الدين عبد الله",
      name_en: "Dr. Nour El-Din Abdullah",
      articleCount: 3,
      year: 2023,
    },
    {
      id: 5,
      name_ar: "أ. فاطمة يوسف خليل",
      name_en: "Prof. Fatma Yousef Khalil",
      articleCount: 9,
      year: 2022,
    },
    {
      id: 6,
      name_ar: "د. عمر فاروق الشيخ",
      name_en: "Dr. Omar Farouk El-Sheikh",
      articleCount: 5,
      year: 2024,
    },
    {
      id: 7,
      name_ar: "د. منى السيد رمضان",
      name_en: "Dr. Mona El-Sayed Ramadan",
      articleCount: 2,
      year: 2022,
    },
    {
      id: 8,
      name_ar: "أ.د. كريم عادل رزق",
      name_en: "Prof. Karim Adel Rizk",
      articleCount: 15,
      year: 2023,
    },
  ];
  return { data: rows, totalCount: rows.length };
}

// ─── Report: Patents Statistics ───────────────────────────────────────────────
// TODO: GET /Reports/PatentsStatistics?departmentIds[]=...
export async function getPatentsStatisticsReport({ departmentIds = [] }) {
  const rows = [
    {
      id: 1,
      name_ar: "د. أحمد محمد علي",
      name_en: "Dr. Ahmed Mohamed Ali",
      patentScope_ar: "دولي",
      patentScope_en: "International",
      patentCount: 3,
    },
    {
      id: 2,
      name_ar: "د. سارة إبراهيم حسن",
      name_en: "Dr. Sara Ibrahim Hassan",
      patentScope_ar: "محلي",
      patentScope_en: "Local",
      patentCount: 2,
    },
    {
      id: 3,
      name_ar: "أ.د. محمود كمال فريد",
      name_en: "Prof. Mahmoud Kamal Farid",
      patentScope_ar: "دولي",
      patentScope_en: "International",
      patentCount: 5,
    },
    {
      id: 4,
      name_ar: "د. نور الدين عبد الله",
      name_en: "Dr. Nour El-Din Abdullah",
      patentScope_ar: "محلي",
      patentScope_en: "Local",
      patentCount: 4,
    },
    {
      id: 5,
      name_ar: "أ. فاطمة يوسف خليل",
      name_en: "Prof. Fatma Yousef Khalil",
      patentScope_ar: "دولي",
      patentScope_en: "International",
      patentCount: 1,
    },
    {
      id: 6,
      name_ar: "د. عمر فاروق الشيخ",
      name_en: "Dr. Omar Farouk El-Sheikh",
      patentScope_ar: "محلي",
      patentScope_en: "Local",
      patentCount: 2,
    },
    {
      id: 7,
      name_ar: "د. منى السيد رمضان",
      name_en: "Dr. Mona El-Sayed Ramadan",
      patentScope_ar: "دولي",
      patentScope_en: "International",
      patentCount: 6,
    },
    {
      id: 8,
      name_ar: "أ.د. كريم عادل رزق",
      name_en: "Prof. Karim Adel Rizk",
      patentScope_ar: "محلي",
      patentScope_en: "Local",
      patentCount: 3,
    },
  ];
  return { data: rows, totalCount: rows.length };
}

// ─── Report: Projects Statistics ─────────────────────────────────────────────
// TODO: GET /Reports/ProjectsStatistics?departmentIds[]=...
export async function getProjectsStatisticsReport({ departmentIds = [] }) {
  const rows = [
    {
      id: 1,
      name_ar: "د. أحمد محمد علي",
      name_en: "Dr. Ahmed Mohamed Ali",
      projectType_ar: "بحثي",
      projectType_en: "Research",
      projectCount: 5,
    },
    {
      id: 2,
      name_ar: "د. سارة إبراهيم حسن",
      name_en: "Dr. Sara Ibrahim Hassan",
      projectType_ar: "تطويري",
      projectType_en: "Development",
      projectCount: 3,
    },
    {
      id: 3,
      name_ar: "أ.د. محمود كمال فريد",
      name_en: "Prof. Mahmoud Kamal Farid",
      projectType_ar: "بحثي",
      projectType_en: "Research",
      projectCount: 7,
    },
    {
      id: 4,
      name_ar: "د. نور الدين عبد الله",
      name_en: "Dr. Nour El-Din Abdullah",
      projectType_ar: "مجتمعي",
      projectType_en: "Community",
      projectCount: 2,
    },
    {
      id: 5,
      name_ar: "أ. فاطمة يوسف خليل",
      name_en: "Prof. Fatma Yousef Khalil",
      projectType_ar: "تقني",
      projectType_en: "Technical",
      projectCount: 4,
    },
    {
      id: 6,
      name_ar: "د. عمر فاروق الشيخ",
      name_en: "Dr. Omar Farouk El-Sheikh",
      projectType_ar: "تطويري",
      projectType_en: "Development",
      projectCount: 6,
    },
    {
      id: 7,
      name_ar: "د. منى السيد رمضان",
      name_en: "Dr. Mona El-Sayed Ramadan",
      projectType_ar: "مجتمعي",
      projectType_en: "Community",
      projectCount: 1,
    },
    {
      id: 8,
      name_ar: "أ.د. كريم عادل رزق",
      name_en: "Prof. Karim Adel Rizk",
      projectType_ar: "بحثي",
      projectType_en: "Research",
      projectCount: 8,
    },
  ];
  return { data: rows, totalCount: rows.length };
}
