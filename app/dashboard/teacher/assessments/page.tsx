"use client";

import { useState, useMemo } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Icon } from "@iconify/react";

interface Assessment {
  id: string;
  title: string;
  subject: string;
  type: "quiz" | "assignment" | "exam" | "project";
  dueDate: string;
  maxScore: number;
  totalSubmissions: number;
  pendingSubmissions: number;
  gradedSubmissions: number;
  createdDate: string;
}

const dummyAssessments: Assessment[] = [
  {
    id: "1",
    title: "Vowel Sounds Quiz",
    subject: "Literacy",
    type: "quiz",
    dueDate: "2025-12-15",
    maxScore: 20,
    totalSubmissions: 15,
    pendingSubmissions: 3,
    gradedSubmissions: 12,
    createdDate: "2025-12-01",
  },
  {
    id: "2",
    title: "Addition and Subtraction",
    subject: "Numeracy",
    type: "assignment",
    dueDate: "2025-12-18",
    maxScore: 50,
    totalSubmissions: 15,
    pendingSubmissions: 5,
    gradedSubmissions: 10,
    createdDate: "2025-12-02",
  },
  {
    id: "3",
    title: "Science Experiment Report",
    subject: "Science",
    type: "project",
    dueDate: "2025-12-20",
    maxScore: 100,
    totalSubmissions: 12,
    pendingSubmissions: 8,
    gradedSubmissions: 4,
    createdDate: "2025-12-03",
  },
  {
    id: "4",
    title: "Mid-Term Exam",
    subject: "All Subjects",
    type: "exam",
    dueDate: "2025-12-25",
    maxScore: 200,
    totalSubmissions: 0,
    pendingSubmissions: 0,
    gradedSubmissions: 0,
    createdDate: "2025-12-05",
  },
  {
    id: "5",
    title: "Reading Comprehension",
    subject: "Literacy",
    type: "assignment",
    dueDate: "2025-12-08",
    maxScore: 40,
    totalSubmissions: 15,
    pendingSubmissions: 0,
    gradedSubmissions: 15,
    createdDate: "2025-11-28",
  },
];

const getTypeColor = (type: Assessment["type"]) => {
  switch (type) {
    case "quiz":
      return "bg-purple-100 text-purple-800 border-purple-200";
    case "assignment":
      return "bg-blue-100 text-blue-800 border-blue-200";
    case "exam":
      return "bg-red-100 text-red-800 border-red-200";
    case "project":
      return "bg-orange-100 text-orange-800 border-orange-200";
    default:
      return "bg-gray-100 text-gray-800 border-gray-200";
  }
};

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

export default function TeacherAssessmentsPage() {
  const [search, setSearch] = useState("");
  const [selectedSubject, setSelectedSubject] = useState<string>("All");
  const [selectedType, setSelectedType] = useState<string>("All");
  const [page, setPage] = useState(1);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    subject: "",
    type: "quiz" as Assessment["type"],
    dueDate: "",
    maxScore: "",
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const pageSize = 10;

  const subjects = useMemo(() => {
    const uniqueSubjects = Array.from(
      new Set(dummyAssessments.map((a) => a.subject))
    ).sort();
    return ["All", ...uniqueSubjects];
  }, []);

  const types = useMemo(() => {
    const uniqueTypes = Array.from(
      new Set(dummyAssessments.map((a) => a.type))
    ).sort();
    return ["All", ...uniqueTypes.map((t) => t.charAt(0).toUpperCase() + t.slice(1))];
  }, []);

  const filteredAssessments = useMemo(() => {
    return dummyAssessments.filter((assessment) => {
      const matchesSearch =
        search.trim().length === 0 ||
        assessment.title.toLowerCase().includes(search.toLowerCase()) ||
        assessment.subject.toLowerCase().includes(search.toLowerCase());

      const matchesSubject =
        selectedSubject === "All" || assessment.subject === selectedSubject;

      const matchesType =
        selectedType === "All" ||
        assessment.type === selectedType.toLowerCase();

      return matchesSearch && matchesSubject && matchesType;
    });
  }, [search, selectedSubject, selectedType]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredAssessments.length / pageSize)
  );
  const currentPage = Math.min(page, totalPages);
  const start = (currentPage - 1) * pageSize;
  const pagedAssessments = filteredAssessments.slice(start, start + pageSize);

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (formErrors[name]) {
      setFormErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const errors: Record<string, string> = {};
    if (!formData.title.trim()) errors.title = "Title is required";
    if (!formData.subject.trim()) errors.subject = "Subject is required";
    if (!formData.dueDate) errors.dueDate = "Due date is required";
    if (!formData.maxScore || parseInt(formData.maxScore) <= 0) {
      errors.maxScore = "Max score must be greater than 0";
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleCreateAssessment = async () => {
    if (!validateForm()) return;

    setIsCreating(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      console.log("Creating assessment:", formData);
      setIsCreateModalOpen(false);
      setFormData({
        title: "",
        subject: "",
        type: "quiz",
        dueDate: "",
        maxScore: "",
      });
      setFormErrors({});
    } catch (error) {
      console.error("Error creating assessment:", error);
    } finally {
      setIsCreating(false);
    }
  };

  const totalPending = filteredAssessments.reduce(
    (sum, a) => sum + a.pendingSubmissions,
    0
  );
  const totalGraded = filteredAssessments.reduce(
    (sum, a) => sum + a.gradedSubmissions,
    0
  );
  const totalSubmissions = filteredAssessments.reduce(
    (sum, a) => sum + a.totalSubmissions,
    0
  );

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between flex-col sm:flex-row gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Assessments</h1>
            <p className="text-gray-600 mt-1">
              Create and manage assessments for your class
            </p>
          </div>
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-full bg-emerald-600 px-5 py-2.5 text-white shadow hover:bg-emerald-700 transition-colors"
          >
            <Icon icon="solar:add-circle-bold" className="w-5 h-5" />
            Create Assessment
          </button>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6">
          <div className="flex flex-col lg:flex-row gap-4 mb-6">
            <div className="flex-1 min-w-0">
              <div className="relative">
                <Icon
                  icon="solar:magnifer-bold"
                  className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 z-10"
                />
                <input
                  type="text"
                  placeholder="Search by title or subject..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-gray-900 bg-white placeholder:text-gray-400"
                />
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 sm:w-auto">
              <select
                value={selectedSubject}
                onChange={(e) => {
                  setSelectedSubject(e.target.value);
                  setPage(1);
                }}
                className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-gray-900 bg-white text-sm"
              >
                {subjects.map((subject) => (
                  <option key={subject} value={subject}>
                    {subject}
                  </option>
                ))}
              </select>
              <select
                value={selectedType}
                onChange={(e) => {
                  setSelectedType(e.target.value);
                  setPage(1);
                }}
                className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-gray-900 bg-white text-sm"
              >
                {types.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex items-center justify-between mb-4 pb-4 border-b border-gray-200 flex-wrap gap-4">
            <div className="flex gap-6 text-sm">
              <div className="text-center">
                <p className="font-semibold text-emerald-600 text-lg">
                  {filteredAssessments.length}
                </p>
                <p className="text-gray-600">Total Assessments</p>
              </div>
              <div className="text-center">
                <p className="font-semibold text-blue-600 text-lg">
                  {totalSubmissions}
                </p>
                <p className="text-gray-600">Total Submissions</p>
              </div>
              <div className="text-center">
                <p className="font-semibold text-amber-600 text-lg">
                  {totalPending}
                </p>
                <p className="text-gray-600">Pending Review</p>
              </div>
              <div className="text-center">
                <p className="font-semibold text-green-600 text-lg">
                  {totalGraded}
                </p>
                <p className="text-gray-600">Graded</p>
              </div>
            </div>
          </div>

          {pagedAssessments.length > 0 ? (
            <>
              <div className="overflow-hidden rounded-lg border border-gray-200">
                <div className="hidden md:grid grid-cols-8 gap-4 bg-gray-50 px-4 py-3 text-xs font-medium text-gray-500">
                  <div>Assessment</div>
                  <div>Subject</div>
                  <div>Type</div>
                  <div>Max Score</div>
                  <div>Submissions</div>
                  <div>Pending</div>
                  <div>Graded</div>
                  <div className="text-right">Due Date</div>
                </div>

                <div className="divide-y divide-gray-200">
                  {pagedAssessments.map((assessment) => (
                    <div
                      key={assessment.id}
                      className="px-4 py-3 flex flex-col gap-2 md:grid md:grid-cols-8 md:items-center md:gap-4 hover:bg-gray-50 transition-colors"
                    >
                      <div>
                        <p className="text-sm font-semibold text-gray-900">
                          {assessment.title}
                        </p>
                        <p className="text-xs text-gray-500 md:hidden">
                          {assessment.subject} • {formatDate(assessment.dueDate)}
                        </p>
                      </div>
                      <div className="text-sm text-gray-700 hidden md:block">
                        {assessment.subject}
                      </div>
                      <div className="hidden md:block">
                        <span
                          className={`px-2 py-0.5 rounded text-xs font-medium border ${getTypeColor(
                            assessment.type
                          )}`}
                        >
                          {assessment.type.charAt(0).toUpperCase() +
                            assessment.type.slice(1)}
                        </span>
                      </div>
                      <div className="text-sm font-medium text-gray-900 hidden md:block">
                        {assessment.maxScore}
                      </div>
                      <div className="hidden md:block">
                        <p className="text-sm font-semibold text-gray-900">
                          {assessment.totalSubmissions}
                        </p>
                      </div>
                      <div className="hidden md:block">
                        <p className="text-sm font-semibold text-amber-600">
                          {assessment.pendingSubmissions}
                        </p>
                      </div>
                      <div className="hidden md:block">
                        <p className="text-sm font-semibold text-green-600">
                          {assessment.gradedSubmissions}
                        </p>
                      </div>
                      <div className="text-xs text-gray-500 md:text-right">
                        {formatDate(assessment.dueDate)}
                      </div>
                      <div className="md:hidden space-y-1 mt-2">
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-gray-600">Type:</span>
                          <span
                            className={`px-2 py-0.5 rounded text-xs font-medium border ${getTypeColor(
                              assessment.type
                            )}`}
                          >
                            {assessment.type.charAt(0).toUpperCase() +
                              assessment.type.slice(1)}
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-gray-600">Max Score:</span>
                          <span className="font-medium">{assessment.maxScore}</span>
                        </div>
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-gray-600">Submissions:</span>
                          <span className="font-medium">{assessment.totalSubmissions}</span>
                        </div>
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-gray-600">Pending:</span>
                          <span className="font-medium text-amber-600">
                            {assessment.pendingSubmissions}
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-gray-600">Graded:</span>
                          <span className="font-medium text-green-600">
                            {assessment.gradedSubmissions}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {totalPages > 1 && (
                <div className="mt-6 flex items-center justify-between flex-col sm:flex-row gap-4">
                  <div className="text-sm text-gray-600">
                    Showing {start + 1} to{" "}
                    {Math.min(start + pageSize, filteredAssessments.length)} of{" "}
                    {filteredAssessments.length} assessments
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handlePageChange(page - 1)}
                      disabled={page === 1}
                      className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      Previous
                    </button>
                    <div className="flex gap-1">
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                        (pageNum) => {
                          if (
                            pageNum === 1 ||
                            pageNum === totalPages ||
                            (pageNum >= page - 1 && pageNum <= page + 1)
                          ) {
                            return (
                              <button
                                key={pageNum}
                                onClick={() => handlePageChange(pageNum)}
                                className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                                  pageNum === page
                                    ? "bg-emerald-600 text-white"
                                    : "text-gray-700 bg-white border border-gray-300 hover:bg-gray-50"
                                }`}
                              >
                                {pageNum}
                              </button>
                            );
                          } else if (
                            pageNum === page - 2 ||
                            pageNum === page + 2
                          ) {
                            return (
                              <span
                                key={pageNum}
                                className="px-2 py-2 text-gray-700"
                              >
                                ...
                              </span>
                            );
                          }
                          return null;
                        }
                      )}
                    </div>
                    <button
                      onClick={() => handlePageChange(page + 1)}
                      disabled={page === totalPages}
                      className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      Next
                    </button>
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="border border-dashed border-gray-300 rounded-lg p-8 text-center">
              <p className="text-gray-600 text-sm">
                No assessments found matching your filters.
              </p>
            </div>
          )}
        </div>
      </div>

      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-900">Create Assessment</h2>
              <p className="text-sm text-gray-600 mt-1">
                Add a new assessment for your class
              </p>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Title *
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="Enter assessment title"
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-gray-900 ${
                    formErrors.title ? "border-red-500" : "border-gray-300"
                  }`}
                />
                {formErrors.title && (
                  <p className="mt-1 text-sm text-red-600">{formErrors.title}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Subject *
                </label>
                <input
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleInputChange}
                  placeholder="Enter subject"
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-gray-900 ${
                    formErrors.subject ? "border-red-500" : "border-gray-300"
                  }`}
                />
                {formErrors.subject && (
                  <p className="mt-1 text-sm text-red-600">{formErrors.subject}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Type *
                </label>
                <select
                  name="type"
                  value={formData.type}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-gray-900"
                >
                  <option value="quiz">Quiz</option>
                  <option value="assignment">Assignment</option>
                  <option value="exam">Exam</option>
                  <option value="project">Project</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Due Date *
                </label>
                <input
                  type="date"
                  name="dueDate"
                  value={formData.dueDate}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-gray-900 ${
                    formErrors.dueDate ? "border-red-500" : "border-gray-300"
                  }`}
                />
                {formErrors.dueDate && (
                  <p className="mt-1 text-sm text-red-600">{formErrors.dueDate}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Max Score *
                </label>
                <input
                  type="number"
                  name="maxScore"
                  value={formData.maxScore}
                  onChange={handleInputChange}
                  placeholder="Enter maximum score"
                  min="1"
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-gray-900 ${
                    formErrors.maxScore ? "border-red-500" : "border-gray-300"
                  }`}
                />
                {formErrors.maxScore && (
                  <p className="mt-1 text-sm text-red-600">{formErrors.maxScore}</p>
                )}
              </div>
            </div>
            <div className="p-6 border-t border-gray-200 flex gap-3 justify-end">
              <button
                onClick={() => {
                  setIsCreateModalOpen(false);
                  setFormData({
                    title: "",
                    subject: "",
                    type: "quiz",
                    dueDate: "",
                    maxScore: "",
                  });
                  setFormErrors({});
                }}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateAssessment}
                disabled={isCreating}
                className="px-4 py-2 text-sm font-medium text-white bg-emerald-600 rounded-lg hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isCreating ? "Creating..." : "Create Assessment"}
              </button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}

