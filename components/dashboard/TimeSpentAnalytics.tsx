"use client";

interface TimeSpentAnalyticsProps {
  childId: string;
}

interface TimeSpent {
  subject: string;
  hours: number;
  minutes: number;
  percentage: number;
}

const dummyTimeSpent: TimeSpent[] = [
  { subject: "Literacy", hours: 12, minutes: 30, percentage: 35 },
  { subject: "Numeracy", hours: 10, minutes: 15, percentage: 28 },
  { subject: "Science", hours: 8, minutes: 45, percentage: 22 },
  { subject: "Social Studies", hours: 4, minutes: 20, percentage: 15 },
];

const colors = ["#059669", "#3B82F6", "#8B5CF6", "#F59E0B"];

const formatTime = (hours: number, minutes: number) => {
  if (hours === 0) return `${minutes}m`;
  if (minutes === 0) return `${hours}h`;
  return `${hours}h ${minutes}m`;
};

export default function TimeSpentAnalytics({ childId }: TimeSpentAnalyticsProps) {
  const totalHours = dummyTimeSpent.reduce((sum, item) => sum + item.hours, 0);
  const totalMinutes = dummyTimeSpent.reduce((sum, item) => sum + item.minutes, 0);
  const totalTimeInMinutes = totalHours * 60 + totalMinutes;
  const totalTimeFormatted = formatTime(totalHours, totalMinutes);

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6">
      <div className="mb-4">
        <h3 className="text-lg font-bold text-gray-900 mb-2">
          Time Spent on Assessments
        </h3>
        <div className="bg-gradient-to-r from-emerald-600 to-emerald-700 rounded-lg p-3 text-white">
          <p className="text-xs opacity-90 mb-1">
            Total Time
          </p>
          <p className="text-2xl font-bold">
            {totalTimeFormatted}
          </p>
        </div>
      </div>

      <div className="space-y-3">
        {dummyTimeSpent.map((item, index) => {
          const timeInMinutes = item.hours * 60 + item.minutes;
          const percentageOfTotal = (timeInMinutes / totalTimeInMinutes) * 100;

          return (
            <div key={index}>
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-2">
                  <div
                    className="w-2.5 h-2.5 rounded-full"
                    style={{ backgroundColor: colors[index % colors.length] }}
                  ></div>
                  <span className="font-medium text-gray-900 text-sm">
                    {item.subject}
                  </span>
                </div>
                <span className="text-xs font-semibold text-gray-700">
                  {formatTime(item.hours, item.minutes)}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-1.5">
                <div
                  className="h-1.5 rounded-full transition-all"
                  style={{
                    width: `${percentageOfTotal}%`,
                    backgroundColor: colors[index % colors.length],
                  }}
                ></div>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                {percentageOfTotal.toFixed(1)}% of total time
              </p>
            </div>
          );
        })}
      </div>

      <div className="mt-4 pt-4 border-t border-gray-200">
        <div className="grid grid-cols-2 gap-3">
          <div className="text-center">
            <p className="text-xl font-bold text-gray-900">
              {dummyTimeSpent.length}
            </p>
            <p className="text-xs text-gray-600">
              Subjects
            </p>
          </div>
          <div className="text-center">
            <p className="text-xl font-bold text-gray-900">
              {Math.round(totalTimeInMinutes / 60)}
            </p>
            <p className="text-xs text-gray-600">
              Total Hours
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

