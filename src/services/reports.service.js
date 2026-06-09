// ─── Reports Service ─────────────────────────────────────────────────────────
import axiosInstance from "../utils/axiosInstance";

// ─── Lookup: Author Roles ────────────────────────────────────────────────────
// GET /LookUpItems/AuthorRoles
export async function getAuthorRoles() {
  const res = await axiosInstance.get("/LookUpItems/AuthorRoles", {
    skipGlobalErrorHandler: true,
  });
  return res.data; // [{ id, valueAr, valueEn }]
}

// GET /LookUpItems/ProjectTypes
export async function getProjectTypes() {
  const res = await axiosInstance.get("/LookUpItems/ProjectTypes", {
    skipGlobalErrorHandler: true,
  });
  return Array.isArray(res.data) ? res.data.filter(Boolean) : [];
}

// GET /LookUpItems/MagazineParticipationRoles
export async function getMagazineParticipationRoles() {
  const res = await axiosInstance.get(
    "/LookUpItems/MagazineParticipationRoles",
    {
      skipGlobalErrorHandler: true,
    },
  );
  return Array.isArray(res.data) ? res.data.filter(Boolean) : [];
}

// ─── Lookup: Faculties with their departments ─────────────────────────────────
// GET /LookUpItems/UniversityFacultiesWithDepartments
export async function getUniversityFacultiesWithDepartments() {
  const res = await axiosInstance.get(
    "/LookUpItems/UniversityFacultiesWithDepartments",
    { skipGlobalErrorHandler: true },
  );
  return res.data;
}

// kept for compatibility with other report types that still use dummy data
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
// GET /DashboardAndReports/FacultyMembersDataReportTable
export async function getDetailedFacultyReport({
  facultyIds = [],
  departmentIds = [],
  search = "",
  sorting = "",
  pageIndex = 1,
  pageSize = 20,
}) {
  const params = new URLSearchParams();
  if (sorting) params.append("Sorting", sorting);
  facultyIds.forEach((id) => params.append("FacultyIds", id));
  departmentIds.forEach((id) => params.append("DepartmentIds", id));
  if (search) params.append("Search", search);
  params.append("PageIndex", String(pageIndex));
  params.append("PageSize", String(pageSize));

  const res = await axiosInstance.get(
    `/DashboardAndReports/FacultyMembersDataReportTable?${params.toString()}`,
    { skipGlobalErrorHandler: true },
  );
  return res.data; // { pageIndex, pageSize, totalCount, data: [...] }
}

// ─── DUMMY PLACEHOLDER – kept only until remaining reports are integrated ─────
async function _dummyDetailedFacultyRows() {
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

  return { data: rows, totalCount: rows.length };
}

// ─── PDF Download: Detailed Faculty Members ──────────────────────────────────
// GET /DashboardAndReports/FacultyMembersDataReportPDF
export async function downloadDetailedFacultyReportPdf({
  facultyIds = [],
  departmentIds = [],
  sorting = "",
  notes = "",
} = {}) {
  const params = new URLSearchParams();
  facultyIds.forEach((id) => params.append("FacultyIds", id));
  departmentIds.forEach((id) => params.append("DepartmentIds", id));
  if (sorting) params.append("Sorting", sorting);
  if (notes) params.append("notes", notes);

  return axiosInstance.get(
    `/DashboardAndReports/FacultyMembersDataReportPDF?${params.toString()}`,
    { responseType: "blob", skipGlobalErrorHandler: true },
  );
}

// ─── Report: Biannual Research per Year ───────────────────────────────────────
// GET /DashboardAndReports/ResearchesPerYearReportTable
export async function getBiannualResearchReport({
  facultyIds = [],
  departmentIds = [],
  search = "",
  sorting = "",
  pageIndex = 1,
  pageSize = 20,
  publicationType = "",
  pubYears = [],
}) {
  const params = new URLSearchParams();
  if (sorting) params.append("Sort", sorting);
  // "Unspecified" means "show all" — same as not filtering at all
  if (publicationType && publicationType !== "Unspecified")
    params.append("PublicationType", publicationType);
  pubYears.forEach((y) => params.append("PubYears", y));
  facultyIds.forEach((id) => params.append("FacultyIds", id));
  departmentIds.forEach((id) => params.append("DepartmentIds", id));
  if (search) params.append("Search", search);
  params.append("PageIndex", String(pageIndex));
  params.append("PageSize", String(pageSize));

  const res = await axiosInstance.get(
    `/DashboardAndReports/ResearchesPerYearReportTable?${params.toString()}`,
    { skipGlobalErrorHandler: true },
  );
  return res.data; // { pageIndex, pageSize, totalCount, data: [{ researchTitle, publicationType, pubYear }] }
}

// ─── PDF Download: Biannual Research per Year ────────────────────────────────
// GET /DashboardAndReports/ResearchesPerYearReportPDF
export async function downloadBiannualResearchReportPdf({
  facultyIds = [],
  departmentIds = [],
  publicationType = "",
  pubYears = [],
  sorting = "",
  notes = "",
} = {}) {
  const params = new URLSearchParams();
  facultyIds.forEach((id) => params.append("FacultyIds", id));
  departmentIds.forEach((id) => params.append("DepartmentIds", id));
  if (publicationType) params.append("PublicationType", publicationType);
  pubYears.forEach((y) => params.append("PubYears", y));
  if (sorting) params.append("Sort", sorting);
  if (notes) params.append("notes", notes);

  return axiosInstance.get(
    `/DashboardAndReports/ResearchesPerYearReportPDF?${params.toString()}`,
    { responseType: "blob", skipGlobalErrorHandler: true },
  );
}

// ─── PDF Download: Conferences & Seminars ────────────────────────────────────
// GET /DashboardAndReports/ConferencesAndSeminarsReportPDF
export async function downloadSeminarsReportPdf({
  facultyIds = [],
  departmentIds = [],
  type = "",
  sorting = "",
  notes = "",
} = {}) {
  const params = new URLSearchParams();
  facultyIds.forEach((id) => params.append("FacultyIds", id));
  departmentIds.forEach((id) => params.append("DepartmentIds", id));
  if (type) params.append("Type", type);
  if (sorting) params.append("Sort", sorting);
  if (notes) params.append("notes", notes);

  return axiosInstance.get(
    `/DashboardAndReports/ConferencesAndSeminarsReportPDF?${params.toString()}`,
    { responseType: "blob", skipGlobalErrorHandler: true },
  );
}

// ─── Report: Research Statistics ─────────────────────────────────────────────
// GET /DashboardAndReports/FacultyMembersResearchesReportTable
export async function getResearchStatisticsReport({
  facultyIds = [],
  departmentIds = [],
  search = "",
  sorting = "",
  pageIndex = 1,
  pageSize = 20,
}) {
  const params = new URLSearchParams();
  if (search) params.append("Search", search);
  params.append("PageIndex", String(pageIndex));
  params.append("PageSize", String(pageSize));
  facultyIds.forEach((id) => params.append("FacultyIds", id));
  departmentIds.forEach((id) => params.append("DepartmentIds", id));
  if (sorting) params.append("Sort", sorting);

  const res = await axiosInstance.get(
    `/DashboardAndReports/FacultyMembersResearchesReportTable?${params.toString()}`,
    { skipGlobalErrorHandler: true },
  );
  return res.data; // { pageIndex, pageSize, totalCount, data: [...] }
}

// ─── PDF Download: Research Statistics ───────────────────────────────────────
// GET /DashboardAndReports/FacultyMembersResearchesReportPDF
export async function downloadResearchStatisticsReportPdf({
  facultyIds = [],
  departmentIds = [],
  sorting = "",
  notes = "",
} = {}) {
  const params = new URLSearchParams();
  facultyIds.forEach((id) => params.append("FacultyIds", id));
  departmentIds.forEach((id) => params.append("DepartmentIds", id));
  if (sorting) params.append("Sort", sorting);
  if (notes) params.append("notes", notes);

  return axiosInstance.get(
    `/DashboardAndReports/FacultyMembersResearchesReportPDF?${params.toString()}`,
    { responseType: "blob", skipGlobalErrorHandler: true },
  );
}

// ─── Report: Conferences & Seminars ──────────────────────────────────────────
// GET /DashboardAndReports/ConferencesAndSeminarsReportTable
export async function getSeminarsStatisticsReport({
  facultyIds = [],
  departmentIds = [],
  search = "",
  sorting = "",
  pageIndex = 1,
  pageSize = 20,
  type = "",
}) {
  const params = new URLSearchParams();
  if (type) params.append("Type", type);
  if (sorting) params.append("Sort", sorting);
  facultyIds.forEach((id) => params.append("FacultyIds", id));
  departmentIds.forEach((id) => params.append("DepartmentIds", id));
  if (search) params.append("Search", search);
  params.append("PageIndex", String(pageIndex));
  params.append("PageSize", String(pageSize));

  const res = await axiosInstance.get(
    `/DashboardAndReports/ConferencesAndSeminarsReportTable?${params.toString()}`,
    { skipGlobalErrorHandler: true },
  );

  // Flatten nested conferencesAndSeminars into one row per entry
  const raw = res.data;
  const flatData = (raw?.data ?? []).flatMap((member) =>
    (member.conferencesAndSeminars ?? []).map((entry) => ({
      facultyMemberName: member.facultyMemberName,
      type: entry.type,
      noOfConferencesOrSeminars: entry.noOfConferencesOrSeminars,
    })),
  );
  return { ...raw, data: flatData };
}

// ─── Report: Experiences Statistics ──────────────────────────────────────────
// GET /DashboardAndReports/ExperinceReportTable
export async function getExperiencesStatisticsReport({
  facultyIds = [],
  departmentIds = [],
  search = "",
  sorting = "",
  pageIndex = 1,
  pageSize = 20,
}) {
  const params = new URLSearchParams();
  if (search) params.append("Search", search);
  params.append("PageIndex", String(pageIndex));
  params.append("PageSize", String(pageSize));
  facultyIds.forEach((id) => params.append("FacultyIds", id));
  departmentIds.forEach((id) => params.append("DepartmentIds", id));
  if (sorting) params.append("Sorting", sorting);

  const res = await axiosInstance.get(
    `/DashboardAndReports/ExperinceReportTable?${params.toString()}`,
    { skipGlobalErrorHandler: true },
  );

  const raw = res.data;
  const flatData = (raw?.data ?? []).flatMap((member) =>
    (member.experiences ?? []).map((entry, index) => ({
      id: `${member.facultyMemberName}-${entry.experienceType}-${index}`,
      facultyMemberName: member.facultyMemberName,
      experienceType: entry.experienceType,
      experienceCount: entry.experienceCount,
    })),
  );

  return { ...raw, data: flatData };
}

// ─── PDF Download: Experiences Statistics ───────────────────────────────────
// GET /DashboardAndReports/ExperinceReportPDF
export async function downloadExperiencesStatisticsReportPdf({
  facultyIds = [],
  departmentIds = [],
  sorting = "",
  notes = "",
} = {}) {
  const params = new URLSearchParams();
  facultyIds.forEach((id) => params.append("FacultyIds", id));
  departmentIds.forEach((id) => params.append("DepartmentIds", id));
  if (sorting) params.append("Sorting", sorting);
  if (notes) params.append("notes", notes);

  return axiosInstance.get(
    `/DashboardAndReports/ExperinceReportPDF?${params.toString()}`,
    { responseType: "blob", skipGlobalErrorHandler: true },
  );
}

// ─── Report: Publications (Writings) Statistics ───────────────────────────────
// GET /DashboardAndReports/WritingsReportTable
export async function getPublicationsStatisticsReport({
  facultyIds = [],
  departmentIds = [],
  search = "",
  sorting = "",
  pageIndex = 1,
  pageSize = 20,
  roles = [],
}) {
  const params = new URLSearchParams();
  if (search) params.append("Search", search);
  if (sorting) params.append("Sort", sorting);
  params.append("PageIndex", String(pageIndex));
  params.append("PageSize", String(pageSize));
  facultyIds.forEach((id) => params.append("FacultyIds", id));
  departmentIds.forEach((id) => params.append("DepartmentIds", id));
  roles
    .map((r) => String(r ?? "").trim())
    .filter(Boolean)
    .forEach((r) => params.append("Roles", r));

  const res = await axiosInstance.get(
    `/DashboardAndReports/WritingsReportTable?${params.toString()}`,
    { skipGlobalErrorHandler: true },
  );

  // Flatten nested writings into one row per entry
  const raw = res.data;
  const flatData = (raw?.data ?? []).flatMap((member) =>
    (member.writings ?? []).map((entry) => ({
      facultyMemberName: member.facultyMemberName,
      authorRole: entry.authorRole,
      noOfWritings: entry.noOfWritings,
    })),
  );
  return { ...raw, data: flatData };
}

// ─── PDF Download: Publications (Writings) Statistics ────────────────────────
// GET /DashboardAndReports/WritingsReportPDF
export async function downloadWritingsReportPdf({
  facultyIds = [],
  departmentIds = [],
  roles = [],
  notes = "",
} = {}) {
  const params = new URLSearchParams();
  facultyIds.forEach((id) => params.append("FacultyIds", id));
  departmentIds.forEach((id) => params.append("DepartmentIds", id));
  roles
    .map((r) => String(r ?? "").trim())
    .filter(Boolean)
    .forEach((r) => params.append("Roles", r));
  if (notes) params.append("notes", notes);

  return axiosInstance.get(
    `/DashboardAndReports/WritingsReportPDF?${params.toString()}`,
    { responseType: "blob", skipGlobalErrorHandler: true },
  );
}

// ─── Report: CV Statistics ────────────────────────────────────────────────────
// GET /DashboardAndReports/CVsReportTable
export async function getCVStatisticsReport({
  facultyIds = [],
  search = "",
  sorting = "",
  pageIndex = 1,
  pageSize = 20,
}) {
  const params = new URLSearchParams();
  if (search) params.append("Search", search);
  params.append("PageIndex", String(pageIndex));
  params.append("PageSize", String(pageSize));
  facultyIds.forEach((id) => params.append("FacultyIds", id));
  if (sorting) params.append("Sort", sorting);

  const res = await axiosInstance.get(
    `/DashboardAndReports/CVsReportTable?${params.toString()}`,
    { skipGlobalErrorHandler: true },
  );

  const raw = res.data;
  const data = (raw?.data ?? []).map((row, index) => ({
    id: row.facultyName ?? index,
    facultyName: row.facultyName,
    noOfCVs: row.noOfCVs,
    departmentCVs: row.departmentCVs ?? [],
  }));

  return { ...raw, data };
}

// ─── PDF Download: CV Statistics ────────────────────────────────────────────
// GET /DashboardAndReports/CVsReportPDF
export async function downloadCVStatisticsReportPdf({
  facultyIds = [],
  sorting = "",
  notes = "",
} = {}) {
  const params = new URLSearchParams();
  facultyIds.forEach((id) => params.append("FacultyIds", id));
  if (sorting) params.append("Sort", sorting);
  if (notes) params.append("notes", notes);

  return axiosInstance.get(
    `/DashboardAndReports/CVsReportPDF?${params.toString()}`,
    { responseType: "blob", skipGlobalErrorHandler: true },
  );
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

// ─── Report: Participation in Magazines Statistics ──────────────────────────
// GET /DashboardAndReports/ParticipationInMagazinesReportTable
export async function getJournalsStatisticsReport({
  facultyIds = [],
  departmentIds = [],
  search = "",
  sorting = "",
  pageIndex = 1,
  pageSize = 20,
  typesOfParticipation = [],
}) {
  const params = new URLSearchParams();
  if (search) params.append("Search", search);
  params.append("PageIndex", String(pageIndex));
  params.append("PageSize", String(pageSize));
  if (sorting) params.append("Sort", sorting);
  facultyIds.forEach((id) => params.append("FacultyIds", id));
  departmentIds.forEach((id) => params.append("DepartmentIds", id));
  typesOfParticipation.forEach((role) =>
    params.append("TypesOfParticipation", role),
  );

  const res = await axiosInstance.get(
    `/DashboardAndReports/ParticipationInMagazinesReportTable?${params.toString()}`,
    { skipGlobalErrorHandler: true },
  );

  const raw = res.data;
  const flatData = (raw?.data ?? []).flatMap((member, memberIndex) =>
    (member.participations ?? []).map((entry, entryIndex) => ({
      id: `${member.facultyMemberName ?? memberIndex}-${entry.participationType ?? entryIndex}`,
      facultyMemberName: member.facultyMemberName,
      participationType: entry.participationType,
      journalCount: entry.noOfParticipations,
      noOfParticipations: entry.noOfParticipations,
    })),
  );

  return { ...raw, data: flatData };
}

// GET /DashboardAndReports/ParticipationInMagazinesReportPDF
export async function downloadJournalsStatisticsReportPdf({
  facultyIds = [],
  departmentIds = [],
  typesOfParticipation = [],
  sorting = "",
  notes = "",
} = {}) {
  const params = new URLSearchParams();
  facultyIds.forEach((id) => params.append("FacultyIds", id));
  departmentIds.forEach((id) => params.append("DepartmentIds", id));
  typesOfParticipation.forEach((role) =>
    params.append("TypesOfParticipation", role),
  );
  if (sorting) params.append("Sort", sorting);
  if (notes) params.append("notes", notes);

  return axiosInstance.get(
    `/DashboardAndReports/ParticipationInMagazinesReportPDF?${params.toString()}`,
    { responseType: "blob", skipGlobalErrorHandler: true },
  );
}

// ─── Report: Article Review Statistics ───────────────────────────────────────
// GET /DashboardAndReports/ReviewingArticlesReportTable
export async function getArticleReviewsStatisticsReport({
  facultyIds = [],
  departmentIds = [],
  search = "",
  sorting = "",
  pageIndex = 1,
  pageSize = 20,
}) {
  const params = new URLSearchParams();
  if (search) params.append("Search", search);
  params.append("PageIndex", String(pageIndex));
  params.append("PageSize", String(pageSize));
  if (sorting) params.append("Sort", sorting);
  facultyIds.forEach((id) => params.append("FacultyIds", id));
  departmentIds.forEach((id) => params.append("DepartmentIds", id));

  const res = await axiosInstance.get(
    `/DashboardAndReports/ReviewingArticlesReportTable?${params.toString()}`,
    { skipGlobalErrorHandler: true },
  );

  return res.data;
}

// ─── PDF Download: Reviewing Articles Statistics ────────────────────────────
// GET /DashboardAndReports/ReviewingArticlesReportPDF
export async function downloadArticleReviewsStatisticsReportPdf({
  facultyIds = [],
  departmentIds = [],
  sorting = "",
  notes = "",
} = {}) {
  const params = new URLSearchParams();
  if (sorting) params.append("Sort", sorting);
  facultyIds.forEach((id) => params.append("FacultyIds", id));
  departmentIds.forEach((id) => params.append("DepartmentIds", id));
  if (notes) params.append("notes", notes);

  return axiosInstance.get(
    `/DashboardAndReports/ReviewingArticlesReportPDF?${params.toString()}`,
    { responseType: "blob", skipGlobalErrorHandler: true },
  );
}

// ─── Report: Patents Statistics ─────────────────────────────────────────────
// GET /DashboardAndReports/PatentsReportTable
export async function getPatentsStatisticsReport({
  facultyIds = [],
  departmentIds = [],
  search = "",
  sorting = "",
  pageIndex = 1,
  pageSize = 20,
  localOrInternational = "",
}) {
  const params = new URLSearchParams();
  if (search) params.append("Search", search);
  params.append("PageIndex", String(pageIndex));
  params.append("PageSize", String(pageSize));
  if (sorting) params.append("Sort", sorting);
  facultyIds.forEach((id) => params.append("FacultyIds", id));
  departmentIds.forEach((id) => params.append("DepartmentIds", id));
  if (localOrInternational)
    params.append("LocalOrInternational", localOrInternational);

  const res = await axiosInstance.get(
    `/DashboardAndReports/PatentsReportTable?${params.toString()}`,
    { skipGlobalErrorHandler: true },
  );

  const raw = res.data;
  const flatData = (raw?.data ?? []).flatMap((member, memberIndex) => {
    if (Array.isArray(member.patents)) {
      return member.patents.map((entry, entryIndex) => ({
        id: `${member.facultyMemberName ?? memberIndex}-${entry.type ?? entryIndex}`,
        facultyMemberName: member.facultyMemberName,
        localOrInternational: entry.type,
        patentCount: entry.noOfPatents,
        noOfPatents: entry.noOfPatents,
      }));
    }

    return [
      {
        id: member.facultyMemberName ?? memberIndex,
        facultyMemberName: member.facultyMemberName,
        localOrInternational: member.localOrInternational,
        patentCount: member.noOfPatents,
        noOfPatents: member.noOfPatents,
      },
    ];
  });

  return { ...raw, data: flatData };
}

// GET /DashboardAndReports/PatentsReportPDF
export async function downloadPatentsStatisticsReportPdf({
  facultyIds = [],
  departmentIds = [],
  localOrInternational = "",
  sorting = "",
  notes = "",
} = {}) {
  const params = new URLSearchParams();
  facultyIds.forEach((id) => params.append("FacultyIds", id));
  departmentIds.forEach((id) => params.append("DepartmentIds", id));
  if (localOrInternational)
    params.append("LocalOrInternational", localOrInternational);
  if (sorting) params.append("Sort", sorting);
  if (notes) params.append("notes", notes);

  return axiosInstance.get(
    `/DashboardAndReports/PatentsReportPDF?${params.toString()}`,
    { responseType: "blob", skipGlobalErrorHandler: true },
  );
}

// ─── Report: Projects Statistics ────────────────────────────────────────────
// GET /DashboardAndReports/ProjectsReportTable
export async function getProjectsStatisticsReport({
  facultyIds = [],
  departmentIds = [],
  search = "",
  sorting = "",
  pageIndex = 1,
  pageSize = 20,
  typesOfProject = [],
}) {
  const params = new URLSearchParams();
  if (search) params.append("Search", search);
  params.append("PageIndex", String(pageIndex));
  params.append("PageSize", String(pageSize));
  if (sorting) params.append("Sort", sorting);
  facultyIds.forEach((id) => params.append("FacultyIds", id));
  departmentIds.forEach((id) => params.append("DepartmentIds", id));
  typesOfProject.forEach((type) => params.append("TypesOfProject", type));

  const res = await axiosInstance.get(
    `/DashboardAndReports/ProjectsReportTable?${params.toString()}`,
    { skipGlobalErrorHandler: true },
  );

  const raw = res.data;
  const flatData = (raw?.data ?? []).flatMap((member, memberIndex) =>
    (member.projects ?? []).map((entry, entryIndex) => ({
      id: `${member.facultyMemberName ?? memberIndex}-${entry.projectType ?? entryIndex}`,
      facultyMemberName: member.facultyMemberName,
      projectType: entry.projectType,
      projectCount: entry.noOfProjects,
      noOfProjects: entry.noOfProjects,
    })),
  );

  return { ...raw, data: flatData };
}

// GET /DashboardAndReports/ProjectsReportPDF
export async function downloadProjectsStatisticsReportPdf({
  facultyIds = [],
  departmentIds = [],
  typesOfProject = [],
  sorting = "",
  notes = "",
} = {}) {
  const params = new URLSearchParams();
  facultyIds.forEach((id) => params.append("FacultyIds", id));
  departmentIds.forEach((id) => params.append("DepartmentIds", id));
  typesOfProject.forEach((type) => params.append("TypesOfProject", type));
  if (sorting) params.append("Sort", sorting);
  if (notes) params.append("notes", notes);

  return axiosInstance.get(
    `/DashboardAndReports/ProjectsReportPDF?${params.toString()}`,
    { responseType: "blob", skipGlobalErrorHandler: true },
  );
}
