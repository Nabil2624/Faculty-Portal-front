import { useState, useEffect, useRef, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import axios from "axios";

// Components
import ResponsiveLayoutProvider from "../components/ResponsiveLayoutProvider";
import LoadingSpinner from "../components/LoadingSpinner";
import CitationsWidgetMini from "../components/widgets/Researches/CitationsWidgetMini";
import DeleteResearchModal from "../components/widgets/ScientificResearches/DeleteResearchModal";
import ModalWrapper from "../components/ui/ModalWrapper";
import CustomizeResultsModal from "../components/ui/CustomizeResultsPopup";
import MissingScholarCard from "../components/widgets/ResearcherProfile/MissingScholarCard";

// المكونات المنفصلة
import ResearcherHero from "../components/widgets/Researches/ResearcherHero";
import ResearchesTable from "../components/widgets/Researches/ResearchesTable";

// Hooks & Services
import useResearcherProfile from "../hooks/useResearcherProfile";
import useScientificResearches from "../hooks/useScientificResearches";
import { deleteScientificResearch } from "../services/scientificResearchService";

export default function ResearchesPage() {
  const { t, i18n } = useTranslation([
    "ResearcherProfile",
    "ScientificResearches",
    "filter-sort",
  ]);
  const isArabic = i18n.language === "ar";
  const navigate = useNavigate();

  // --- States الفلترة والترتيب والبحث ---
  const [searchTerm, setSearchTerm] = useState("");
  const [sortValue, setSortValue] = useState(null);
  const [filtersState, setFiltersState] = useState({});
  const [source, setSource] = useState([]);
  const [derivedFrom, setDerivedFrom] = useState([]);
  const [publisherType, setPublisherType] = useState([]);
  const [publicationType, setPublicationType] = useState([]);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // --- States التحكم في القائمة والاختيار ---
  const [allResearches, setAllResearches] = useState([]);
  const [page, setPage] = useState(1);
  const [isSelectionMode, setIsSelectionMode] = useState(false);

  // التعديل: تحويل المعرف الواحد إلى مصفوفة
  const [selectedIds, setSelectedIds] = useState([]);

  const {
    researcher,
    loading: profileLoading,
    error,
    waiting,
    missingScholar,
    nationalNumber,
  } = useResearcherProfile();

  const lastProcessedDataRef = useRef(null);

  const {
    researches,
    loading: researchesLoading,
    totalPages,
    fetchResearches,
  } = useScientificResearches(
    10,
    searchTerm,
    sortValue,
    publisherType,
    publicationType,
    source,
    derivedFrom,
    page,
  );

  // دمج البيانات الجديدة مع القديمة عند عمل Pagination
  useEffect(() => {
    if (researches) {
      if (page === 1) {
        setAllResearches(researches);
      } else if (researches !== lastProcessedDataRef.current) {
        setAllResearches((prev) => {
          const existingIds = new Set(prev.map((item) => item.id));
          const newUniqueItems = researches.filter(
            (r) => !existingIds.has(r.id),
          );
          return [...prev, ...newUniqueItems];
        });
      }
      lastProcessedDataRef.current = researches;
    }
  }, [researches, page]);

  // إعادة ضبط الحالة عند تغيير الفلاتر أو البحث أو اللغة
  useEffect(() => {
    setAllResearches([]);
    setPage(1);
    lastProcessedDataRef.current = null;
    setSelectedIds([]); // تعديل هنا
    setIsSelectionMode(false);
  }, [
    i18n.language,
    searchTerm,
    sortValue,
    source,
    derivedFrom,
    publisherType,
    publicationType,
  ]);

  // البحث المختار (يستخدم غالباً في التعديل - نأخذ أول عنصر مختار)
  const selectedResearch = useMemo(
    () => allResearches.find((r) => r.id === selectedIds[0]),
    [selectedIds, allResearches],
  );

  // --- Handlers ---
  const toggleSelectionMode = () => {
    if (isSelectionMode) {
      setSelectedIds([]); // تفريغ عند الإغلاق
    }
    setIsSelectionMode((prev) => !prev);
  };

  const handleApplyFilters = ({ sortValue, filters }) => {
    setSortValue(sortValue);
    setFiltersState(filters);
    setSource(filters?.Source || []);
    setDerivedFrom(filters?.DerivedFrom || []);
    setPublisherType(filters?.PublisherType || []);
    setPublicationType(filters?.PublicationType || []);
    setShowFilterModal(false);
  };

  const handleResetFilters = () => {
    setSortValue(null);
    setSource([]);
    setDerivedFrom([]);
    setPublisherType([]);
    setPublicationType([]);
    setFiltersState({});
    setShowFilterModal(false);
  };

  const handleDeleteAction = async () => {
    if (selectedIds.length === 0) return;
    try {
      // ملاحظة: إذا كان الـ API يدعم حذف واحد فقط، نكرر الطلب أو نعدل الـ API
      // حالياً سنقوم بحذف العناصر المختارة واحداً تلو الآخر (أو العنصر الأول فقط حسب إعدادات السيرفر لديك)
      for (const id of selectedIds) {
        await deleteScientificResearch(id);
      }

      setShowDeleteModal(false);
      setSelectedIds([]);
      setPage(1);
      await fetchResearches(1);
    } catch (err) {
      alert(t("ScientificResearches:deleteError"));
    }
  };

  const handleEditAction = () => {
    // التعديل مسموح فقط لبحث واحد ومن مصدر داخلي
    if (
      selectedIds.length === 1 &&
      selectedResearch &&
      selectedResearch.source === "Internal"
    ) {
      navigate("/edit-scientific-research", {
        state: { research: selectedResearch },
      });
    }
  };

  const handleAddAction = () => {
    navigate("/add-scientific-research");
  };

  const sortOptions = [
    { value: 1, label: "titleAsc" },
    { value: 2, label: "titleDesc" },
    { value: 3, label: "journalAsc" },
    { value: 4, label: "journalDesc" },
    { value: 5, label: "pubYearAsc" },
    { value: 6, label: "pubYearDesc" },
    { value: 7, label: "CitesAsc" },
    { value: 8, label: "CitesDesc" },
  ];

  const filtersConfig = [
    {
      key: "Source",
      title: "dependOnSource",
      options: [
        { value: 1, label: "Master" },
        { value: 2, label: "PhD" },
        { value: 3, label: "Other" },
      ],
    },
    {
      key: "DerivedFrom",
      title: "dependOnDerivedFrom",
      options: [
        { value: 1, label: "Internal" },
        { value: 2, label: "External" },
      ],
    },
    {
      key: "PublisherType",
      title: "dependOnPublisherType",
      options: [
        { value: 1, label: "Journal" },
        { value: 2, label: "Conference" },
        { value: 3, label: "Unspecified" },
      ],
    },
    {
      key: "PublicationType",
      title: "dependLocalOrInternational",
      options: [
        { value: 1, label: "local" },
        { value: 2, label: "international" },
      ],
    },
  ];


  if (profileLoading && page === 1) return <LoadingSpinner />;

  if (waiting) {
    return (
      <ResponsiveLayoutProvider>
        <div className="text-center mt-20 text-xl font-semibold">
          {isArabic
            ? "برجاء الانتظار يتم جلب الابحاث"
            : "Please wait, fetching researches..."}
        </div>
      </ResponsiveLayoutProvider>
    );
  }

  if (missingScholar) {
    return (
      <ResponsiveLayoutProvider>
        <div className="p-6">
          <MissingScholarCard
            onSave={async (data) => {
              await axios.post(
                "http://localhost/Researches/api/fetch-research-using-scholar-profile-link/",
                {
                  researcherNationalNumber: nationalNumber,
                  ORCID: data.orcid,
                  scholarProfileLink: data.scholarLink,
                },
              );
              window.location.reload();
            }}
          />
        </div>
      </ResponsiveLayoutProvider>
    );
  }

  if (error)
    return <div className="text-red-500 text-center mt-6">{error}</div>;

  if (!researcher && !waiting)
    return (
      <ResponsiveLayoutProvider>
        <div className="text-center mt-20 text-xl font-semibold">
          {isArabic
            ? "لم يتم العثور على ملف للباحث"
            : "No Researcher Profile Was Found"}
        </div>
      </ResponsiveLayoutProvider>
    );
const cleanLink = (url) => {
  if (!url) return "#";

  const match = url.match(/user=([a-zA-Z0-9_-]+)/);

  return match
    ? `https://scholar.google.com/citations?user=${match[1]}`
    : url;
};
  return (
    <ResponsiveLayoutProvider>
      <div
        className={`mx-auto ${isArabic ? "rtl" : "ltr"}`}
        style={{ padding: "clamp(0.5rem, 1vw, 1.2rem)", minHeight: "100vh" }}
      >
        <div className="flex flex-col lg:flex-row w-full gap-8">
          <div className="flex flex-col flex-1 w-full">
            <ResearcherHero researcher={researcher} />

            <div
              className="w-full flex flex-wrap items-center border-y border-gray-100 py-6 mt-8"
              style={{ gap: "clamp(1rem, 5vw, 4rem)" }}
            >
              {[
                {
                  label: t("orcidId"),
                  value: researcher.orcid,
                  isLink: true,
                  url: `https://orcid.org/${researcher.orcid}`,
                },
                {
                  label: t("googleScholar"),
                  value: "scholar.google.com",
                  isLink: true,
                  url: researcher.scholarProfileLink,
                },
                {
                  label: t("orgDomain"),
                  value: researcher.organisationalDomain,
                  isLink: false,
                },
                {
                  label: t("orgId"),
                  value: researcher.organisationId,
                  isLink: false,
                },
              ].map(
                (item, i) =>
                  item.value && (
                    <div key={i} className="flex flex-col items-start gap-1">
                      <span
                        className="uppercase tracking-wider text-gray-400 font-bold text-[10px]"
                        style={{ fontSize: "clamp(0.8rem, 0.9vw, 1.6rem)" }}
                      >
                        {item.label}
                      </span>
                      {item.isLink ? (
                        <a
                          href={item.url}
                          target="_blank"
                          rel="noreferrer"
                          className="text-[#19355A] hover:text-[#B38E19] font-medium transition-colors underline decoration-gray-200 underline-offset-4"
                          style={{ fontSize: "clamp(0.8rem, 0.7vw, 1.4rem)" }}
                        >
                          {item.value}
                        </a>
                      ) : (
                        <span
                          className="text-[#19355A] font-medium"
                          style={{ fontSize: "clamp(0.8rem, 0.7vw, 1.4rem)" }}
                        >
                          {item.value}
                        </span>
                      )}
                    </div>
                  ),
              )}
            </div>

            <ResearchesTable
              researches={allResearches}
              loading={researchesLoading}
              isArabic={isArabic}
              t={t}
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              isSelectionMode={isSelectionMode}
              toggleSelectionMode={toggleSelectionMode}
              // تمرير الحالة والمجموعة الجديدة
              selectedIds={selectedIds}
              setSelectedIds={setSelectedIds}
              selectedResearch={selectedResearch}
              handleEditAction={handleEditAction}
              setShowDeleteModal={setShowDeleteModal}
              setShowFilterModal={setShowFilterModal}
              handleResetFilters={handleResetFilters}
              sortValue={sortValue}
              filtersState={filtersState}
              page={page}
              totalPages={totalPages}
              setPage={setPage}
              handleAddAction={handleAddAction}
            />
          </div>

          <div className="hidden lg:block w-[1px] bg-gray-100 self-stretch my-4"></div>

          <div className="w-full lg:w-[350px] flex flex-col">
            <CitationsWidgetMini
              data={researcher.researcherCites}
              stats={{
                totalCitations: researcher.totalNumberOfCitiations,
                citations5y: researcher.numberOfCitiationsInLastFiveYears,
                hIndex: researcher.hindex,
                hIndex5y: researcher.hindexInLastFiveYears,
                i10Index: researcher.i10index,
                i10Index5y: researcher.i10index5y,
              }}
            />

            <div className="w-full mt-10 pt-6 border-t border-gray-100">
              <h3
                className="text-[#19355A] font-bold uppercase tracking-widest mb-4"
                style={{ fontSize: "clamp(0.4rem, 0.9vw, 1.4rem)" }}
              >
                {t("ScientificResearches:coAuthors") ||
                  (isArabic ? "المؤلفون المشاركون" : "Co-authors")}
              </h3>
              <div className="flex flex-col gap-4 w-full">
                {researcher?.coAuthors?.map((author, index) => (
                  <a
                    key={index}
                    href={cleanLink(author.scholarProfileLink)}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-3 group"
                  >
                    {/* الصورة */}
                    <img
                      src={author.scholarProfileImageURL}
                      alt={author.academicName}
                      className="w-10 h-10 rounded-full object-cover"
                      onError={(e) =>
                        (e.target.src = "https://via.placeholder.com/150")
                      }
                    />

                    {/* 👇 الاسم + التايتل تحت بعض */}
                    <div className="flex flex-col leading-tight">
                      <span className="font-medium text-gray-700 group-hover:text-blue-600">
                        {author.academicName}
                      </span>

                      <span className="text-xs text-gray-500">
                        {author.jobTitle || "No title"}
                      </span>
                    </div>
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>

        {showDeleteModal && (
          <DeleteResearchModal
            // نمرر أول عنصر مختار للعرض في الرسالة التأكيدية، أو نعدل المودال ليظهر عدد العناصر
            item={selectedResearch}
            t={t}
            onConfirm={handleDeleteAction}
            onCancel={() => setShowDeleteModal(false)}
          />
        )}

        {showFilterModal && (
          <ModalWrapper onClose={() => setShowFilterModal(false)}>
            <CustomizeResultsModal
              onClose={() => setShowFilterModal(false)}
              onApply={handleApplyFilters}
              onReset={handleResetFilters}
              currentSort={sortValue}
              currentFilters={filtersState}
              filtersConfig={filtersConfig}
              translationNamespace="filter-sort"
              sortOptions={sortOptions}
            />
          </ModalWrapper>
        )}
      </div>
    </ResponsiveLayoutProvider>
  );
}
