"use client";

import { useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Icon } from "@iconify/react";
import Link from "next/link";

interface PendingSubmission {
  id: string;
  studentName: string;
  assessmentTitle: string;
  subject: string;
  submittedAt: string;
}

interface UpcomingAssessment {
  id: string;
  title: string;
  subject: string;
  dueDate: string;
  submissionsCount: number;
  totalStudents: number;
}

interface TopStudent {
  id: string;
  name: string;
  averageScore: number;
  improvement: number;
}

const dummyPendingSubmissions: PendingSubmission[] = [
  {
    id: "1",
    studentName: "Emma Johnson",
    assessmentTitle: "Science Experiment Report",
    subject: "Science",
    submittedAt: "2025-12-14T09:20:00",
  },
  {
    id: "2",
    studentName: "Michael Johnson",
    assessmentTitle: "Science Experiment Report",
    subject: "Science",
    submittedAt: "2025-12-14T11:30:00",
  },
  {
    id: "3",
    studentName: "Sarah Williams",
    assessmentTitle: "Addition and Subtraction",
    subject: "Numeracy",
    submittedAt: "2025-12-13T14:00:00",
  },
];

const dummyUpcomingAssessments: UpcomingAssessment[] = [
  {
    id: "1",
    title: "Vowel Sounds Quiz",
    subject: "Literacy",
    dueDate: "2025-12-15",
    submissionsCount: 12,
    totalStudents: 15,
  },
  {
    id: "2",
    title: "Addition and Subtraction",
    subject: "Numeracy",
    dueDate: "2025-12-18",
    submissionsCount: 10,
    totalStudents: 15,
  },
  {
    id: "3",
    title: "Science Experiment Report",
    subject: "Science",
    dueDate: "2025-12-20",
    submissionsCount: 8,
    totalStudents: 15,
  },
];

const dummyTopStudents: TopStudent[] = [
  { id: "1", name: "Emma Johnson", averageScore: 94.5, improvement: 5.2 },
  { id: "2", name: "Michael Johnson", averageScore: 92.3, improvement: 3.8 },
  { id: "3", name: "Sarah Williams", averageScore: 89.1, improvement: 2.5 },
];

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

const formatDateTime = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const getDaysUntilDue = (dueDate: string) => {
  const today = new Date();
  const due = new Date(dueDate);
  const diffTime = due.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
};

export default function TeacherDashboardPage() {
  const totalStudents = 15;
  const totalAssessments = 5;
  const pendingSubmissions = 11;
  const gradedSubmissions = 46;
  const classAverage = 87.3;
  const completionRate = Math.round((gradedSubmissions / (gradedSubmissions + pendingSubmissions)) * 100);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between flex-col sm:flex-row gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Teacher Dashboard</h1>
            <p className="text-gray-600 mt-1">
              Manage your classes, students, and assignments
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-gray-600 uppercase tracking-wide">
                  Total Students
                </p>
                <p className="text-2xl font-bold text-gray-900 mt-2">
                  {totalStudents}
                </p>
                <p className="text-xs text-gray-500 mt-1">In your class</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Icon icon="solar:users-group-two-rounded-bold" className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-gray-600 uppercase tracking-wide">
                  Class Average
                </p>
                <p className="text-2xl font-bold text-emerald-600 mt-2">
                  {classAverage}%
                </p>
                <p className="text-xs text-gray-500 mt-1">Overall performance</p>
              </div>
              <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center">
                <Icon icon="solar:chart-bold" className="w-6 h-6 text-emerald-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-gray-600 uppercase tracking-wide">
                  Pending Review
                </p>
                <p className="text-2xl font-bold text-amber-600 mt-2">
                  {pendingSubmissions}
                </p>
                <p className="text-xs text-gray-500 mt-1">Submissions to grade</p>
              </div>
              <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center">
                <Icon icon="solar:file-check-bold" className="w-6 h-6 text-amber-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-gray-600 uppercase tracking-wide">
                  Completion Rate
                </p>
                <p className="text-2xl font-bold text-green-600 mt-2">
                  {completionRate}%
                </p>
                <p className="text-xs text-gray-500 mt-1">Grading progress</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <Icon icon="solar:check-circle-bold" className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Quick Actions</h2>
            </div>
            <div className="space-y-3">
              <Link
                href="/dashboard/teacher/assessments"
                className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <Icon icon="solar:add-circle-bold" className="w-5 h-5 text-emerald-600" />
                  <span className="text-sm font-medium text-gray-900">Create Assessment</span>
                </div>
                <Icon icon="solar:arrow-right-bold" className="w-5 h-5 text-gray-400" />
              </Link>
              <Link
                href="/dashboard/teacher/submissions"
                className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <Icon icon="solar:file-check-bold" className="w-5 h-5 text-amber-600" />
                  <span className="text-sm font-medium text-gray-900">Review Submissions</span>
                </div>
                <Icon icon="solar:arrow-right-bold" className="w-5 h-5 text-gray-400" />
              </Link>
              <Link
                href="/dashboard/teacher/grades"
                className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <Icon icon="solar:diploma-verified-bold" className="w-5 h-5 text-blue-600" />
                  <span className="text-sm font-medium text-gray-900">View Student Grades</span>
                </div>
                <Icon icon="solar:arrow-right-bold" className="w-5 h-5 text-gray-400" />
              </Link>
              <Link
                href="/dashboard/teacher/class"
                className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <Icon icon="solar:users-group-two-rounded-bold" className="w-5 h-5 text-purple-600" />
                  <span className="text-sm font-medium text-gray-900">Manage Class</span>
                </div>
                <Icon icon="solar:arrow-right-bold" className="w-5 h-5 text-gray-400" />
              </Link>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Top Performers</h2>
              <Link
                href="/dashboard/teacher/analytics"
                className="text-sm text-emerald-600 hover:text-emerald-700 font-medium"
              >
                View All
              </Link>
            </div>
            <div className="space-y-3">
              {dummyTopStudents.map((student, index) => (
                <div
                  key={student.id}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                        index === 0
                          ? "bg-yellow-100 text-yellow-800"
                          : index === 1
                          ? "bg-gray-100 text-gray-800"
                          : "bg-orange-100 text-orange-800"
                      }`}
                    >
                      {index + 1}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-900">{student.name}</p>
                      <p className="text-xs text-gray-500">
                        {student.improvement > 0 ? "+" : ""}
                        {student.improvement.toFixed(1)}% improvement
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-emerald-600">
                      {student.averageScore.toFixed(1)}%
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Pending Submissions</h2>
              <Link
                href="/dashboard/teacher/submissions?status=Pending Review"
                className="text-sm text-emerald-600 hover:text-emerald-700 font-medium"
              >
                View All
              </Link>
            </div>
            <div className="space-y-3">
              {dummyPendingSubmissions.length > 0 ? (
                dummyPendingSubmissions.map((submission) => (
                  <div
                    key={submission.id}
                    className="flex items-start justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-gray-900">
                        {submission.studentName}
                      </p>
                      <p className="text-xs text-gray-600 mt-1">
                        {submission.assessmentTitle}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        {submission.subject} • {formatDateTime(submission.submittedAt)}
                      </p>
                    </div>
                    <Link
                      href="/dashboard/teacher/submissions"
                      className="ml-3 px-3 py-1.5 text-xs font-medium text-white bg-emerald-600 rounded-lg hover:bg-emerald-700 transition-colors"
                    >
                      Grade
                    </Link>
                  </div>
                ))
              ) : (
                <p className="text-sm text-gray-500 text-center py-4">
                  No pending submissions
                </p>
              )}
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Upcoming Deadlines</h2>
              <Link
                href="/dashboard/teacher/assessments"
                className="text-sm text-emerald-600 hover:text-emerald-700 font-medium"
              >
                View All
              </Link>
            </div>
            <div className="space-y-3">
              {dummyUpcomingAssessments.map((assessment) => {
                const daysUntil = getDaysUntilDue(assessment.dueDate);
                const submissionRate = Math.round(
                  (assessment.submissionsCount / assessment.totalStudents) * 100
                );
                return (
                  <div
                    key={assessment.id}
                    className="p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <p className="text-sm font-semibold text-gray-900">
                          {assessment.title}
                        </p>
                        <p className="text-xs text-gray-600 mt-1">{assessment.subject}</p>
                      </div>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          daysUntil <= 1
                            ? "bg-red-100 text-red-800"
                            : daysUntil <= 3
                            ? "bg-amber-100 text-amber-800"
                            : "bg-blue-100 text-blue-800"
                        }`}
                      >
                        {daysUntil === 0
                          ? "Due Today"
                          : daysUntil === 1
                          ? "Due Tomorrow"
                          : `${daysUntil} days left`}
                      </span>
                    </div>
                    <div className="mt-2">
                      <div className="flex items-center justify-between text-xs text-gray-600 mb-1">
                        <span>Submissions: {assessment.submissionsCount}/{assessment.totalStudents}</span>
                        <span>{submissionRate}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-1.5">
                        <div
                          className="bg-emerald-500 h-1.5 rounded-full transition-all"
                          style={{ width: `${submissionRate}%` }}
                        ></div>
                      </div>
                    </div>
                    <p className="text-xs text-gray-500 mt-2">
                      Due: {formatDate(assessment.dueDate)}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

