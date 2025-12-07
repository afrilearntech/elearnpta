"use client";

interface GradesOverviewProps {
  childId: string;
}

interface Grade {
  subject: string;
  grade: string;
  percentage: number;
  status: "excellent" | "good" | "needs-improvement";
}

const dummyGrades: Grade[] = [
  { subject: "Literacy", grade: "A", percentage: 92, status: "excellent" },
  { subject: "Numeracy", grade: "B+", percentage: 87, status: "good" },
  { subject: "Science", grade: "A-", percentage: 90, status: "excellent" },
  { subject: "Social Studies", grade: "B", percentage: 82, status: "good" },
  { subject: "Arts", grade: "A", percentage: 95, status: "excellent" },
  { subject: "Physical Education", grade: "B+", percentage: 85, status: "good" },
];

const getStatusColor = (status: Grade["status"]) => {
  switch (status) {
    case "excellent":
      return "bg-green-100 text-green-800 border-green-200";
    case "good":
      return "bg-blue-100 text-blue-800 border-blue-200";
    case "needs-improvement":
      return "bg-yellow-100 text-yellow-800 border-yellow-200";
    default:
      return "bg-gray-100 text-gray-800 border-gray-200";
  }
};

const getGradeColor = (grade: string) => {
  if (grade.startsWith("A")) return "text-green-600";
  if (grade.startsWith("B")) return "text-blue-600";
  if (grade.startsWith("C")) return "text-yellow-600";
  return "text-gray-600";
};

export default function GradesOverview({ childId }: GradesOverviewProps) {
  const averagePercentage = Math.round(
    dummyGrades.reduce((sum, g) => sum + g.percentage, 0) / dummyGrades.length
  );
  const averageGrade = averagePercentage >= 90 ? "A" : averagePercentage >= 80 ? "B" : "C";

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-gray-900">
          Grades Overview
        </h3>
        <div className="text-right">
          <p className="text-xs text-gray-600">
            Overall Average
          </p>
          <p className={`text-xl font-bold ${getGradeColor(averageGrade)}`}>
            {averageGrade} ({averagePercentage}%)
          </p>
        </div>
      </div>

      <div className="space-y-3">
        {dummyGrades.map((grade, index) => (
          <div key={index} className="border border-gray-200 rounded-lg p-3 hover:shadow-sm transition-shadow">
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-semibold text-gray-900 text-sm">
                {grade.subject}
              </h4>
              <div className="flex items-center gap-2">
                <span className={`text-lg font-bold ${getGradeColor(grade.grade)}`}>
                  {grade.grade}
                </span>
                <span
                  className={`px-2 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(grade.status)}`}
                >
                  {grade.status === "excellent"
                    ? "Excellent"
                    : grade.status === "good"
                    ? "Good"
                    : "Needs Improvement"}
                </span>
              </div>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-1.5 mb-1">
              <div
                className={`h-1.5 rounded-full transition-all ${
                  grade.percentage >= 90
                    ? "bg-green-500"
                    : grade.percentage >= 80
                    ? "bg-blue-500"
                    : "bg-yellow-500"
                }`}
                style={{ width: `${grade.percentage}%` }}
              ></div>
            </div>
            <p className="text-xs text-gray-600">
              {grade.percentage}% overall
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

