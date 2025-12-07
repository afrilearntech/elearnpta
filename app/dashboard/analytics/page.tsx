"use client";

import { useMemo, useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import TimeSpentAnalytics from "@/components/dashboard/TimeSpentAnalytics";

interface Child {
  id: string;
  name: string;
  grade: string;
  school: string;
}

interface AnalyticsSummary {
  childId: string;
  totalAssessments: number;
  completedAssessments: number;
  averageScore: number;
  period: string;
  changeFromPrevious: number;
}

const dummyChildren: Child[] = [
  {
    id: "1",
    name: "Emma Johnson",
    grade: "Grade 2",
    school: "Liberia Elementary School",
  },
  {
    id: "2",
    name: "Michael Johnson",
    grade: "Grade 4",
    school: "Liberia Elementary School",
  },
];

const dummySummaries: AnalyticsSummary[] = [
  {
    childId: "1",
    totalAssessments: 8,
    completedAssessments: 6,
    averageScore: 89,
    period: "This Term",
    changeFromPrevious: 5,
  },
  {
    childId: "2",
    totalAssessments: 6,
    completedAssessments: 4,
    averageScore: 92,
    period: "This Term",
    changeFromPrevious: 3,
  },
];

export default function AnalyticsPage() {
  const [selectedChildId, setSelectedChildId] = useState<string>("All");
  const [selectedPeriod, setSelectedPeriod] = useState<string>("This Term");

  const childOptions = useMemo(
    () => ["All", ...dummyChildren.map((child) => child.id)],
    []
  );

  const selectedChild =
    selectedChildId === "All"
      ? null
      : dummyChildren.find((child) => child.id === selectedChildId) || null;

  const overallSummary = useMemo(() => {
    if (selectedChild) {
      return (
        dummySummaries.find(
          (summary) =>
            summary.childId === selectedChild.id &&
            summary.period === selectedPeriod
        ) || null
      );
    }

    const periodSummaries = dummySummaries.filter(
      (s) => s.period === selectedPeriod
    );

    if (periodSummaries.length === 0) {
      return null;
    }

    const totalAssessments = periodSummaries.reduce(
      (sum, s) => sum + s.totalAssessments,
      0
    );
    const completedAssessments = periodSummaries.reduce(
      (sum, s) => sum + s.completedAssessments,
      0
    );
    const averageScore =
      periodSummaries.reduce((sum, s) => sum + s.averageScore, 0) /
      periodSummaries.length;
    const changeFromPrevious =
      periodSummaries.reduce((sum, s) => sum + s.changeFromPrevious, 0) /
      periodSummaries.length;

    return {
      childId: "all",
      totalAssessments,
      completedAssessments,
      averageScore: Math.round(averageScore),
      period: selectedPeriod,
      changeFromPrevious: Math.round(changeFromPrevious),
    } as AnalyticsSummary;
  }, [selectedChild, selectedPeriod]);

  const handleExportReport = () => {
    const headers = [
      "Child Name",
      "Grade Level",
      "School",
      "Period",
      "Total Assessments",
      "Completed Assessments",
      "Average Score (%)",
      "Change From Previous Period (%)",
    ];

    const rows = dummyChildren.map((child) => {
      const summary =
        dummySummaries.find(
          (s) => s.childId === child.id && s.period === selectedPeriod
        ) || null;

      return [
        child.name,
        child.grade,
        child.school,
        selectedPeriod,
        summary ? summary.totalAssessments.toString() : "0",
        summary ? summary.completedAssessments.toString() : "0",
        summary ? summary.averageScore.toString() : "0",
        summary ? summary.changeFromPrevious.toString() : "0",
      ];
    });

    const csvContent =
      [headers, ...rows]
        .map((row) =>
          row
            .map((value) => `"${String(value).replace(/"/g, '""')}"`)
            .join(",")
        )
        .join("\n") + "\n";

    const blob = new Blob([csvContent], {
      type: "text/csv;charset=utf-8;",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute(
      "download",
      `child-performance-report-${selectedPeriod.replace(/\s+/g, "-").toLowerCase()}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between flex-col sm:flex-row gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Analytics</h1>
            <p className="text-gray-600 mt-1">
              Get insights into your children&apos;s learning engagement
            </p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6">
          <div className="flex flex-col gap-4 mb-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">
                  Period Summary
                </h2>
                <p className="text-sm text-gray-600">
                  Select a child and period to review their overall performance.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-3 sm:items-center">
                <select
                  value={selectedPeriod}
                  onChange={(e) => setSelectedPeriod(e.target.value)}
                  className="w-full sm:w-auto px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-gray-900 bg-white text-sm"
                >
                  <option value="This Term">This Term</option>
                  <option value="Last Term">Last Term</option>
                  <option value="This Year">This Year</option>
                </select>
                <select
                  value={selectedChildId}
                  onChange={(e) => setSelectedChildId(e.target.value)}
                  className="w-full sm:w-auto px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-gray-900 bg-white text-sm"
                >
                  <option value="All">All Children</option>
                  {dummyChildren.map((child) => (
                    <option key={child.id} value={child.id}>
                      {child.name} ({child.grade})
                    </option>
                  ))}
                </select>
                <button
                  type="button"
                  onClick={handleExportReport}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-full bg-emerald-600 px-5 py-2.5 text-xs sm:text-sm font-semibold text-white shadow hover:bg-emerald-700 transition-colors"
                >
                  Export Report (CSV)
                </button>
              </div>
            </div>
          </div>

          {overallSummary && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
              <div className="bg-emerald-50 border border-emerald-100 rounded-lg p-4">
                <p className="text-xs font-medium text-emerald-700 uppercase tracking-wide">
                  Total Assessments
                </p>
                <p className="mt-2 text-2xl font-bold text-emerald-900">
                  {overallSummary.totalAssessments}
                </p>
                <p className="mt-1 text-xs text-emerald-800">
                  Across all tracked subjects
                </p>
              </div>
              <div className="bg-blue-50 border border-blue-100 rounded-lg p-4">
                <p className="text-xs font-medium text-blue-700 uppercase tracking-wide">
                  Completed
                </p>
                <p className="mt-2 text-2xl font-bold text-blue-900">
                  {overallSummary.completedAssessments}
                </p>
                <p className="mt-1 text-xs text-blue-800">
                  Successfully submitted assessments
                </p>
              </div>
              <div className="bg-amber-50 border border-amber-100 rounded-lg p-4">
                <p className="text-xs font-medium text-amber-700 uppercase tracking-wide">
                  Average Score
                </p>
                <p className="mt-2 text-2xl font-bold text-amber-900">
                  {overallSummary.averageScore}%
                </p>
                <p className="mt-1 text-xs text-amber-800">
                  {overallSummary.changeFromPrevious >= 0 ? "+" : ""}
                  {overallSummary.changeFromPrevious}% vs previous period
                </p>
              </div>
            </div>
          )}

          {selectedChild && (
            <div className="mb-6">
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <p className="text-sm font-semibold text-gray-900">
                  {selectedChild.name}
                </p>
                <p className="text-xs text-gray-600 mt-1">
                  {selectedChild.grade} • {selectedChild.school}
                </p>
              </div>
            </div>
          )}

          <TimeSpentAnalytics childId={selectedChild?.id ?? "all"} />
        </div>
      </div>
    </DashboardLayout>
  );
}


