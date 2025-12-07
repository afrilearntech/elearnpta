"use client";

import { useMemo, useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Icon } from "@iconify/react";

interface Child {
  id: string;
  name: string;
  grade: string;
  school: string;
  studentId: string;
}

interface Submission {
  id: string;
  childId: string;
  childName: string;
  assessmentTitle: string;
  subject: string;
  submittedAt: string;
  score?: number;
  maxScore: number;
  status: "graded" | "pending-review";
  fileUrl?: string;
}

const dummyChildren: Child[] = [
  {
    id: "1",
    name: "Emma Johnson",
    grade: "Grade 2",
    school: "Liberia Elementary School",
    studentId: "STU001",
  },
  {
    id: "2",
    name: "Michael Johnson",
    grade: "Grade 4",
    school: "Liberia Elementary School",
    studentId: "STU002",
  },
];

const dummySubmissions: Submission[] = [
  {
    id: "1",
    childId: "1",
    childName: "Emma Johnson",
    assessmentTitle: "Vowel Sounds Quiz",
    subject: "Literacy",
    submittedAt: "2025-12-10T14:30:00",
    score: 18,
    maxScore: 20,
    status: "graded",
  },
  {
    id: "2",
    childId: "1",
    childName: "Emma Johnson",
    assessmentTitle: "Addition and Subtraction",
    subject: "Numeracy",
    submittedAt: "2025-12-12T10:15:00",
    score: 45,
    maxScore: 50,
    status: "graded",
  },
  {
    id: "3",
    childId: "1",
    childName: "Emma Johnson",
    assessmentTitle: "Reading Comprehension",
    subject: "Literacy",
    submittedAt: "2025-12-07T16:45:00",
    score: 38,
    maxScore: 40,
    status: "graded",
  },
  {
    id: "4",
    childId: "1",
    childName: "Emma Johnson",
    assessmentTitle: "Science Experiment Report",
    subject: "Science",
    submittedAt: "2025-12-14T09:20:00",
    maxScore: 100,
    status: "pending-review",
  },
  {
    id: "5",
    childId: "2",
    childName: "Michael Johnson",
    assessmentTitle: "Multiplication Tables",
    subject: "Numeracy",
    submittedAt: "2025-12-11T11:00:00",
    score: 25,
    maxScore: 25,
    status: "graded",
  },
  {
    id: "6",
    childId: "2",
    childName: "Michael Johnson",
    assessmentTitle: "History Essay",
    subject: "Social Studies",
    submittedAt: "2025-12-13T09:45:00",
    maxScore: 50,
    status: "pending-review",
  },
];

const formatDateTime = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
};

const getStatusColor = (status: Submission["status"]) => {
  switch (status) {
    case "graded":
      return "bg-green-100 text-green-800 border-green-200";
    case "pending-review":
      return "bg-yellow-100 text-yellow-800 border-yellow-200";
    default:
      return "bg-gray-100 text-gray-800 border-gray-200";
  }
};

export default function SubmissionsPage() {
  const [search, setSearch] = useState("");
  const [selectedChild, setSelectedChild] = useState<string>("All");
  const [selectedSubject, setSelectedSubject] = useState<string>("All");
  const [selectedStatus, setSelectedStatus] = useState<string>("All");
  const [page, setPage] = useState(1);
  const pageSize = 10;

  const childrenOptions = useMemo(() => {
    return ["All", ...dummyChildren.map((c) => c.name)];
  }, []);

  const subjects = useMemo(() => {
    const uniqueSubjects = Array.from(
      new Set(dummySubmissions.map((s) => s.subject))
    ).sort();
    return ["All", ...uniqueSubjects];
  }, []);

  const statusOptions = ["All", "Graded", "Pending Review"];

  const filteredSubmissions = useMemo(() => {
    return dummySubmissions.filter((submission) => {
      const matchesSearch =
        search.trim().length === 0 ||
        submission.assessmentTitle
          .toLowerCase()
          .includes(search.toLowerCase()) ||
        submission.childName.toLowerCase().includes(search.toLowerCase()) ||
        submission.subject.toLowerCase().includes(search.toLowerCase());

      const matchesChild =
        selectedChild === "All" || submission.childName === selectedChild;

      const matchesSubject =
        selectedSubject === "All" || submission.subject === selectedSubject;

      const matchesStatus =
        selectedStatus === "All" ||
        (selectedStatus === "Graded" && submission.status === "graded") ||
        (selectedStatus === "Pending Review" &&
          submission.status === "pending-review");

      return matchesSearch && matchesChild && matchesSubject && matchesStatus;
    });
  }, [search, selectedChild, selectedSubject, selectedStatus]);

  const totalPages = Math.max(1, Math.ceil(filteredSubmissions.length / pageSize));
  const currentPage = Math.min(page, totalPages);
  const start = (currentPage - 1) * pageSize;
  const pagedSubmissions = filteredSubmissions.slice(start, start + pageSize);

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const gradedCount = filteredSubmissions.filter(
    (s) => s.status === "graded"
  ).length;
  const pendingReviewCount = filteredSubmissions.filter(
    (s) => s.status === "pending-review"
  ).length;

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between flex-col sm:flex-row gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Submissions</h1>
            <p className="text-gray-600 mt-1">
              Review your children's assessment submissions
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
                  placeholder="Search by title, child name, or subject..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-gray-900 bg-white placeholder:text-gray-400"
                />
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 sm:w-auto">
              <select
                value={selectedChild}
                onChange={(e) => {
                  setSelectedChild(e.target.value);
                  setPage(1);
                }}
                className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-gray-900 bg-white text-sm"
              >
                {childrenOptions.map((child) => (
                  <option key={child} value={child}>
                    {child}
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
                {statusOptions.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex items-center justify-between mb-4 pb-4 border-b border-gray-200">
            <div className="flex gap-6 text-sm">
              <div className="text-center">
                <p className="font-semibold text-green-600">{gradedCount}</p>
                <p className="text-gray-600">Graded</p>
              </div>
              <div className="text-center">
                <p className="font-semibold text-yellow-600">
                  {pendingReviewCount}
                </p>
                <p className="text-gray-600">Pending Review</p>
              </div>
            </div>
          </div>

          {pagedSubmissions.length > 0 ? (
            <>
              <div className="overflow-hidden rounded-lg border border-gray-200">
                <div className="hidden md:grid grid-cols-7 gap-4 bg-gray-50 px-4 py-3 text-xs font-medium text-gray-500">
                  <div>Child</div>
                  <div>Assessment</div>
                  <div>Subject</div>
                  <div>Score</div>
                  <div>Status</div>
                  <div>Submitted At</div>
                  <div className="text-right">Actions</div>
                </div>

                <div className="divide-y divide-gray-200">
                  {pagedSubmissions.map((submission) => {
                    const hasScore =
                      submission.status === "graded" &&
                      submission.score !== undefined;
                    const percentage = hasScore
                      ? Math.round(
                          (submission.score as number / submission.maxScore) * 100
                        )
                      : null;

                    return (
                      <div
                        key={submission.id}
                        className="px-4 py-3 flex flex-col gap-2 md:grid md:grid-cols-7 md:items-center md:gap-4 hover:bg-gray-50 transition-colors"
                      >
                        <div>
                          <p className="text-sm font-semibold text-gray-900">
                            {submission.childName}
                          </p>
                          <p className="text-xs text-gray-500 md:hidden">
                            {submission.subject}
                          </p>
                        </div>
                        <div className="text-sm text-gray-900 font-medium">
                          {submission.assessmentTitle}
                        </div>
                        <div className="hidden md:block text-sm text-gray-700">
                          {submission.subject}
                        </div>
                        <div>
                          {hasScore ? (
                            <div>
                              <p className="text-sm font-bold text-gray-900">
                                {submission.score}/{submission.maxScore}
                              </p>
                              <p className="text-xs text-gray-600">
                                {percentage}%{" "}
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
                        <div className="text-xs text-gray-500">
                          {formatDateTime(submission.submittedAt)}
                        </div>
                        <div className="flex md:justify-end">
                          <button
                            type="button"
                            className="inline-flex items-center gap-1 rounded-full border border-gray-300 px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50"
                          >
                            <Icon
                              icon="solar:eye-bold"
                              className="w-4 h-4 text-gray-500"
                            />
                            View
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {totalPages > 1 && (
                <div className="mt-6 flex items-center justify-between">
                  <div className="text-sm text-gray-600">
                    Showing {start + 1} to{" "}
                    {Math.min(start + pageSize, filteredSubmissions.length)} of{" "}
                    {filteredSubmissions.length} submissions
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
                No submissions found matching your filters.
              </p>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}


