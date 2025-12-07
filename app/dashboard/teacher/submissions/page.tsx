"use client";

import { useState, useMemo } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Icon } from "@iconify/react";

interface Submission {
  id: string;
  studentId: string;
  studentName: string;
  assessmentTitle: string;
  subject: string;
  submittedAt: string;
  score?: number;
  maxScore: number;
  status: "graded" | "pending-review";
  fileUrl?: string;
}

const dummySubmissions: Submission[] = [
  {
    id: "1",
    studentId: "1",
    studentName: "Emma Johnson",
    assessmentTitle: "Vowel Sounds Quiz",
    subject: "Literacy",
    submittedAt: "2025-12-10T14:30:00",
    score: 18,
    maxScore: 20,
    status: "graded",
  },
  {
    id: "2",
    studentId: "1",
    studentName: "Emma Johnson",
    assessmentTitle: "Addition and Subtraction",
    subject: "Numeracy",
    submittedAt: "2025-12-12T10:15:00",
    score: 45,
    maxScore: 50,
    status: "graded",
  },
  {
    id: "3",
    studentId: "2",
    studentName: "Michael Johnson",
    assessmentTitle: "Vowel Sounds Quiz",
    subject: "Literacy",
    submittedAt: "2025-12-11T09:20:00",
    score: 19,
    maxScore: 20,
    status: "graded",
  },
  {
    id: "4",
    studentId: "1",
    studentName: "Emma Johnson",
    assessmentTitle: "Science Experiment Report",
    subject: "Science",
    submittedAt: "2025-12-14T09:20:00",
    maxScore: 100,
    status: "pending-review",
  },
  {
    id: "5",
    studentId: "2",
    studentName: "Michael Johnson",
    assessmentTitle: "Science Experiment Report",
    subject: "Science",
    submittedAt: "2025-12-14T11:30:00",
    maxScore: 100,
    status: "pending-review",
  },
  {
    id: "6",
    studentId: "3",
    studentName: "Sarah Williams",
    assessmentTitle: "Vowel Sounds Quiz",
    subject: "Literacy",
    submittedAt: "2025-12-10T16:45:00",
    score: 17,
    maxScore: 20,
    status: "graded",
  },
  {
    id: "7",
    studentId: "3",
    studentName: "Sarah Williams",
    assessmentTitle: "Addition and Subtraction",
    subject: "Numeracy",
    submittedAt: "2025-12-13T14:00:00",
    maxScore: 50,
    status: "pending-review",
  },
];

const getStatusColor = (status: Submission["status"]) => {
  switch (status) {
    case "graded":
      return "bg-green-100 text-green-800 border-green-200";
    case "pending-review":
      return "bg-amber-100 text-amber-800 border-amber-200";
    default:
      return "bg-gray-100 text-gray-800 border-gray-200";
  }
};

const formatDateTime = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

export default function TeacherSubmissionsPage() {
  const [search, setSearch] = useState("");
  const [selectedStudent, setSelectedStudent] = useState<string>("All");
  const [selectedSubject, setSelectedSubject] = useState<string>("All");
  const [selectedStatus, setSelectedStatus] = useState<string>("All");
  const [page, setPage] = useState(1);
  const [gradingModal, setGradingModal] = useState<{
    isOpen: boolean;
    submission: Submission | null;
  }>({ isOpen: false, submission: null });
  const [gradeScore, setGradeScore] = useState("");
  const [isGrading, setIsGrading] = useState(false);
  const pageSize = 10;

  const studentOptions = useMemo(() => {
    const uniqueStudents = Array.from(
      new Set(dummySubmissions.map((s) => s.studentName))
    ).sort();
    return ["All", ...uniqueStudents];
  }, []);

  const subjects = useMemo(() => {
    const uniqueSubjects = Array.from(
      new Set(dummySubmissions.map((s) => s.subject))
    ).sort();
    return ["All", ...uniqueSubjects];
  }, []);

  const filteredSubmissions = useMemo(() => {
    return dummySubmissions.filter((submission) => {
      const matchesSearch =
        search.trim().length === 0 ||
        submission.assessmentTitle.toLowerCase().includes(search.toLowerCase()) ||
        submission.studentName.toLowerCase().includes(search.toLowerCase()) ||
        submission.subject.toLowerCase().includes(search.toLowerCase());

      const matchesStudent =
        selectedStudent === "All" || submission.studentName === selectedStudent;

      const matchesSubject =
        selectedSubject === "All" || submission.subject === selectedSubject;

      const matchesStatus =
        selectedStatus === "All" ||
        (selectedStatus === "Graded" && submission.status === "graded") ||
        (selectedStatus === "Pending Review" &&
          submission.status === "pending-review");

      return (
        matchesSearch && matchesStudent && matchesSubject && matchesStatus
      );
    });
  }, [search, selectedStudent, selectedSubject, selectedStatus]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredSubmissions.length / pageSize)
  );
  const currentPage = Math.min(page, totalPages);
  const start = (currentPage - 1) * pageSize;
  const pagedSubmissions = filteredSubmissions.slice(start, start + pageSize);

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleOpenGrading = (submission: Submission) => {
    setGradingModal({ isOpen: true, submission });
    setGradeScore(submission.score?.toString() || "");
  };

  const handleGradeSubmission = async () => {
    if (!gradingModal.submission) return;

    const score = parseFloat(gradeScore);
    if (isNaN(score) || score < 0 || score > gradingModal.submission.maxScore) {
      return;
    }

    setIsGrading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      console.log("Grading submission:", {
        submissionId: gradingModal.submission.id,
        score,
      });
      setGradingModal({ isOpen: false, submission: null });
      setGradeScore("");
    } catch (error) {
      console.error("Error grading submission:", error);
    } finally {
      setIsGrading(false);
    }
  };

  const pendingCount = filteredSubmissions.filter(
    (s) => s.status === "pending-review"
  ).length;
  const gradedCount = filteredSubmissions.filter(
    (s) => s.status === "graded"
  ).length;

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between flex-col sm:flex-row gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Submissions</h1>
            <p className="text-gray-600 mt-1">
              Review and grade student submissions
            </p>
          </div>
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
                  placeholder="Search by assessment, student name, or subject..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-gray-900 bg-white placeholder:text-gray-400"
                />
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 sm:w-auto">
              <select
                value={selectedStudent}
                onChange={(e) => {
                  setSelectedStudent(e.target.value);
                  setPage(1);
                }}
                className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-gray-900 bg-white text-sm"
              >
                {studentOptions.map((student) => (
                  <option key={student} value={student}>
                    {student}
                  </option>
                ))}
              </select>
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
                value={selectedStatus}
                onChange={(e) => {
                  setSelectedStatus(e.target.value);
                  setPage(1);
                }}
                className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-gray-900 bg-white text-sm"
              >
                <option value="All">All Status</option>
                <option value="Pending Review">Pending Review</option>
                <option value="Graded">Graded</option>
              </select>
            </div>
          </div>

          <div className="flex items-center justify-between mb-4 pb-4 border-b border-gray-200 flex-wrap gap-4">
            <div className="flex gap-6 text-sm">
              <div className="text-center">
                <p className="font-semibold text-emerald-600 text-lg">
                  {filteredSubmissions.length}
                </p>
                <p className="text-gray-600">Total Submissions</p>
              </div>
              <div className="text-center">
                <p className="font-semibold text-amber-600 text-lg">
                  {pendingCount}
                </p>
                <p className="text-gray-600">Pending Review</p>
              </div>
              <div className="text-center">
                <p className="font-semibold text-green-600 text-lg">
                  {gradedCount}
                </p>
                <p className="text-gray-600">Graded</p>
              </div>
            </div>
          </div>

          {pagedSubmissions.length > 0 ? (
            <>
              <div className="overflow-hidden rounded-lg border border-gray-200">
                <div className="hidden md:grid grid-cols-7 gap-4 bg-gray-50 px-4 py-3 text-xs font-medium text-gray-500">
                  <div>Student</div>
                  <div>Assessment</div>
                  <div>Subject</div>
                  <div>Score</div>
                  <div>Status</div>
                  <div>Submitted</div>
                  <div className="text-right">Action</div>
                </div>

                <div className="divide-y divide-gray-200">
                  {pagedSubmissions.map((submission) => (
                    <div
                      key={submission.id}
                      className="px-4 py-3 flex flex-col gap-2 md:grid md:grid-cols-7 md:items-center md:gap-4 hover:bg-gray-50 transition-colors"
                    >
                      <div>
                        <p className="text-sm font-semibold text-gray-900">
                          {submission.studentName}
                        </p>
                        <p className="text-xs text-gray-500 md:hidden">
                          {submission.subject} • {formatDateTime(submission.submittedAt)}
                        </p>
                      </div>
                      <div className="text-sm text-gray-900 font-medium">
                        {submission.assessmentTitle}
                      </div>
                      <div className="text-sm text-gray-700 hidden md:block">
                        {submission.subject}
                      </div>
                      <div>
                        {submission.score !== undefined ? (
                          <div>
                            <p className="text-sm font-bold text-gray-900">
                              {submission.score}/{submission.maxScore}
                            </p>
                            <p className="text-xs text-gray-600">
                              {Math.round(
                                (submission.score / submission.maxScore) * 100
                              )}
                              %
                            </p>
                          </div>
                        ) : (
                          <span className="text-xs text-gray-400">—</span>
                        )}
                      </div>
                      <div>
                        <span
                          className={`px-2 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(
                            submission.status
                          )}`}
                        >
                          {submission.status === "graded"
                            ? "Graded"
                            : "Pending Review"}
                        </span>
                      </div>
                      <div className="text-xs text-gray-500 hidden md:block">
                        {formatDateTime(submission.submittedAt)}
                      </div>
                      <div className="md:text-right">
                        {submission.status === "pending-review" ? (
                          <button
                            onClick={() => handleOpenGrading(submission)}
                            className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-white bg-emerald-600 rounded-lg hover:bg-emerald-700 transition-colors"
                          >
                            <Icon icon="solar:pen-bold" className="w-4 h-4" />
                            Grade
                          </button>
                        ) : (
                          <button
                            onClick={() => handleOpenGrading(submission)}
                            className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                          >
                            <Icon icon="solar:eye-bold" className="w-4 h-4" />
                            View
                          </button>
                        )}
                      </div>
                      <div className="md:hidden mt-2 space-y-1">
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-gray-600">Status:</span>
                          <span
                            className={`px-2 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(
                              submission.status
                            )}`}
                          >
                            {submission.status === "graded"
                              ? "Graded"
                              : "Pending Review"}
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-gray-600">Submitted:</span>
                          <span>{formatDateTime(submission.submittedAt)}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-6 flex items-center justify-between flex-col sm:flex-row gap-4">
                <div className="text-sm text-gray-600">
                  Showing {start + 1} to{" "}
                  {Math.min(start + pageSize, filteredSubmissions.length)} of{" "}
                  {filteredSubmissions.length} submissions
                </div>
                {totalPages > 1 && (
                  <div className="flex gap-2 flex-wrap justify-center">
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
                )}
              </div>
            </>
          ) : (
            <div className="border border-dashed border-gray-300 rounded-lg p-8 text-center">
              <p className="text-gray-600 text-sm">
                No submissions found matching your filters.
              </p>
            </div>
          )}
        </div>
      </div>

      {gradingModal.isOpen && gradingModal.submission && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-900">Grade Submission</h2>
              <p className="text-sm text-gray-600 mt-1">
                {gradingModal.submission.studentName} - {gradingModal.submission.assessmentTitle}
              </p>
            </div>
            <div className="p-6 space-y-4">
              <div className="bg-gray-50 rounded-lg p-4 space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subject:</span>
                  <span className="font-medium text-gray-900">
                    {gradingModal.submission.subject}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Max Score:</span>
                  <span className="font-medium text-gray-900">
                    {gradingModal.submission.maxScore}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Submitted:</span>
                  <span className="font-medium text-gray-900">
                    {formatDateTime(gradingModal.submission.submittedAt)}
                  </span>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Score *
                </label>
                <input
                  type="number"
                  value={gradeScore}
                  onChange={(e) => setGradeScore(e.target.value)}
                  placeholder="Enter score"
                  min="0"
                  max={gradingModal.submission.maxScore}
                  step="0.5"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-gray-900"
                />
                <p className="mt-1 text-xs text-gray-500">
                  Maximum score: {gradingModal.submission.maxScore}
                </p>
              </div>
            </div>
            <div className="p-6 border-t border-gray-200 flex gap-3 justify-end">
              <button
                onClick={() => {
                  setGradingModal({ isOpen: false, submission: null });
                  setGradeScore("");
                }}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleGradeSubmission}
                disabled={
                  isGrading ||
                  !gradeScore ||
                  parseFloat(gradeScore) < 0 ||
                  parseFloat(gradeScore) > gradingModal.submission.maxScore
                }
                className="px-4 py-2 text-sm font-medium text-white bg-emerald-600 rounded-lg hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isGrading ? "Grading..." : "Submit Grade"}
              </button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}

