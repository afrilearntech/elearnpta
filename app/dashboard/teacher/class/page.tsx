"use client";

import { useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Icon } from "@iconify/react";

interface Student {
  id: string;
  name: string;
  grade: string;
  studentId: string;
  email?: string;
  parentName?: string;
  joinedDate: string;
}

const dummyStudents: Student[] = [
  {
    id: "1",
    name: "Emma Johnson",
    grade: "Grade 2",
    studentId: "STU001",
    email: "emma.johnson@example.com",
    parentName: "John Johnson",
    joinedDate: "2025-09-01",
  },
  {
    id: "2",
    name: "Michael Johnson",
    grade: "Grade 2",
    studentId: "STU002",
    email: "michael.johnson@example.com",
    parentName: "John Johnson",
    joinedDate: "2025-09-01",
  },
  {
    id: "3",
    name: "Sarah Williams",
    grade: "Grade 2",
    studentId: "STU003",
    email: "sarah.williams@example.com",
    parentName: "Mary Williams",
    joinedDate: "2025-09-05",
  },
  {
    id: "4",
    name: "David Brown",
    grade: "Grade 2",
    studentId: "STU004",
    email: "david.brown@example.com",
    parentName: "Robert Brown",
    joinedDate: "2025-09-08",
  },
  {
    id: "5",
    name: "Lisa Anderson",
    grade: "Grade 2",
    studentId: "STU005",
    email: "lisa.anderson@example.com",
    parentName: "Jennifer Anderson",
    joinedDate: "2025-09-10",
  },
];

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

export default function MyClassPage() {
  const [search, setSearch] = useState("");
  const [selectedGrade, setSelectedGrade] = useState<string>("All");
  const [page, setPage] = useState(1);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    grade: "",
    studentId: "",
    email: "",
    parentName: "",
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [students, setStudents] = useState<Student[]>(dummyStudents);
  const pageSize = 9;

  const grades = ["All", ...Array.from(new Set(students.map((s) => s.grade)))];

  const filteredStudents = students.filter((student) => {
    const matchesSearch =
      search.trim().length === 0 ||
      student.name.toLowerCase().includes(search.toLowerCase()) ||
      student.studentId.toLowerCase().includes(search.toLowerCase()) ||
      student.email?.toLowerCase().includes(search.toLowerCase());

    const matchesGrade = selectedGrade === "All" || student.grade === selectedGrade;

    return matchesSearch && matchesGrade;
  });

  const totalPages = Math.max(1, Math.ceil(filteredStudents.length / pageSize));
  const currentPage = Math.min(page, totalPages);
  const start = (currentPage - 1) * pageSize;
  const pagedStudents = filteredStudents.slice(start, start + pageSize);

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between flex-col sm:flex-row gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">My Class</h1>
            <p className="text-gray-600 mt-1">
              Manage and view all your students
            </p>
          </div>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-full bg-emerald-600 px-5 py-2.5 text-white shadow hover:bg-emerald-700 transition-colors"
          >
            <Icon icon="solar:add-circle-bold" className="w-5 h-5" />
            Add Student
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
                  placeholder="Search by name, student ID, or email..."
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value);
                    setPage(1);
                  }}
                  className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-gray-900 bg-white placeholder:text-gray-400"
                />
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 sm:w-auto">
              <select
                value={selectedGrade}
                onChange={(e) => {
                  setSelectedGrade(e.target.value);
                  setPage(1);
                }}
                className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-gray-900 bg-white text-sm"
              >
                {grades.map((grade) => (
                  <option key={grade} value={grade}>
                    {grade}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="mb-4 pb-4 border-b border-gray-200">
            <div className="flex items-center gap-4 text-sm">
              <div className="text-center">
                <p className="font-semibold text-emerald-600 text-lg">
                  {filteredStudents.length}
                </p>
                <p className="text-gray-600">Total Students</p>
              </div>
            </div>
          </div>

          <div className="mb-4 sm:hidden">
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="w-full inline-flex items-center justify-center gap-2 rounded-full bg-emerald-600 px-5 py-2.5 text-white shadow hover:bg-emerald-700 transition-colors"
            >
              <Icon icon="solar:add-circle-bold" className="w-5 h-5" />
              Add Student
            </button>
          </div>

          {pagedStudents.length > 0 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {pagedStudents.map((student) => (
                <div
                  key={student.id}
                  className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h3 className="text-base font-semibold text-gray-900 mb-1">
                        {student.name}
                      </h3>
                      <p className="text-sm text-gray-600">{student.grade}</p>
                    </div>
                    <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center">
                      <Icon icon="solar:user-bold" className="w-5 h-5 text-emerald-600" />
                    </div>
                  </div>
                  <div className="space-y-2 text-xs text-gray-600">
                    <div className="flex items-center gap-2">
                      <Icon icon="solar:id-card-bold" className="w-4 h-4" />
                      <span>ID: {student.studentId}</span>
                    </div>
                    {student.email && (
                      <div className="flex items-center gap-2">
                        <Icon icon="solar:letter-bold" className="w-4 h-4" />
                        <span className="truncate">{student.email}</span>
                      </div>
                    )}
                    {student.parentName && (
                      <div className="flex items-center gap-2">
                        <Icon icon="solar:users-group-two-rounded-bold" className="w-4 h-4" />
                        <span>Parent: {student.parentName}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-2">
                      <Icon icon="solar:calendar-bold" className="w-4 h-4" />
                      <span>Joined: {formatDate(student.joinedDate)}</span>
                    </div>
                  </div>
                </div>
                ))}
              </div>

              {totalPages > 1 && (
                <div className="mt-6 flex items-center justify-between flex-col sm:flex-row gap-4">
                  <div className="text-sm text-gray-600">
                    Showing {start + 1} to{" "}
                    {Math.min(start + pageSize, filteredStudents.length)} of{" "}
                    {filteredStudents.length} students
                  </div>
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
                </div>
              )}
            </>
          ) : (
            <div className="border border-dashed border-gray-300 rounded-lg p-8 text-center">
              <p className="text-gray-600 text-sm">
                No students found matching your filters.
              </p>
            </div>
          )}
        </div>
      </div>

      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-900">Add Student</h2>
              <p className="text-sm text-gray-600 mt-1">
                Add a new student to your class
              </p>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={(e) => {
                    setFormData((prev) => ({ ...prev, name: e.target.value }));
                    if (formErrors.name) {
                      setFormErrors((prev) => ({ ...prev, name: "" }));
                    }
                  }}
                  placeholder="Enter student's full name"
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-gray-900 ${
                    formErrors.name ? "border-red-500" : "border-gray-300"
                  }`}
                />
                {formErrors.name && (
                  <p className="mt-1 text-sm text-red-600">{formErrors.name}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Grade Level *
                </label>
                <input
                  type="text"
                  name="grade"
                  value={formData.grade}
                  onChange={(e) => {
                    setFormData((prev) => ({ ...prev, grade: e.target.value }));
                    if (formErrors.grade) {
                      setFormErrors((prev) => ({ ...prev, grade: "" }));
                    }
                  }}
                  placeholder="e.g., Grade 2"
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-gray-900 ${
                    formErrors.grade ? "border-red-500" : "border-gray-300"
                  }`}
                />
                {formErrors.grade && (
                  <p className="mt-1 text-sm text-red-600">{formErrors.grade}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Student ID *
                </label>
                <input
                  type="text"
                  name="studentId"
                  value={formData.studentId}
                  onChange={(e) => {
                    setFormData((prev) => ({ ...prev, studentId: e.target.value }));
                    if (formErrors.studentId) {
                      setFormErrors((prev) => ({ ...prev, studentId: "" }));
                    }
                  }}
                  placeholder="Enter student ID"
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-gray-900 ${
                    formErrors.studentId ? "border-red-500" : "border-gray-300"
                  }`}
                />
                {formErrors.studentId && (
                  <p className="mt-1 text-sm text-red-600">{formErrors.studentId}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={(e) => {
                    setFormData((prev) => ({ ...prev, email: e.target.value }));
                    if (formErrors.email) {
                      setFormErrors((prev) => ({ ...prev, email: "" }));
                    }
                  }}
                  placeholder="Enter email address (optional)"
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-gray-900 ${
                    formErrors.email ? "border-red-500" : "border-gray-300"
                  }`}
                />
                {formErrors.email && (
                  <p className="mt-1 text-sm text-red-600">{formErrors.email}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Parent Name
                </label>
                <input
                  type="text"
                  name="parentName"
                  value={formData.parentName}
                  onChange={(e) => {
                    setFormData((prev) => ({ ...prev, parentName: e.target.value }));
                  }}
                  placeholder="Enter parent's name (optional)"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-gray-900"
                />
              </div>
            </div>
            <div className="p-6 border-t border-gray-200 flex gap-3 justify-end">
              <button
                onClick={() => {
                  setIsAddModalOpen(false);
                  setFormData({
                    name: "",
                    grade: "",
                    studentId: "",
                    email: "",
                    parentName: "",
                  });
                  setFormErrors({});
                }}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={async () => {
                  const errors: Record<string, string> = {};
                  if (!formData.name.trim()) errors.name = "Name is required";
                  if (!formData.grade.trim()) errors.grade = "Grade is required";
                  if (!formData.studentId.trim()) errors.studentId = "Student ID is required";
                  if (formData.email && !formData.email.includes("@")) {
                    errors.email = "Invalid email address";
                  }
                  setFormErrors(errors);
                  if (Object.keys(errors).length > 0) return;

                  setIsAdding(true);
                  try {
                    await new Promise((resolve) => setTimeout(resolve, 1000));
                    const newStudent: Student = {
                      id: Date.now().toString(),
                      name: formData.name,
                      grade: formData.grade,
                      studentId: formData.studentId,
                      email: formData.email || undefined,
                      parentName: formData.parentName || undefined,
                      joinedDate: new Date().toISOString().split("T")[0],
                    };
                    setStudents((prev) => [...prev, newStudent]);
                    setIsAddModalOpen(false);
                    setFormData({
                      name: "",
                      grade: "",
                      studentId: "",
                      email: "",
                      parentName: "",
                    });
                    setFormErrors({});
                  } catch (error) {
                    console.error("Error adding student:", error);
                  } finally {
                    setIsAdding(false);
                  }
                }}
                disabled={isAdding}
                className="px-4 py-2 text-sm font-medium text-white bg-emerald-600 rounded-lg hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isAdding ? "Adding..." : "Add Student"}
              </button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}

