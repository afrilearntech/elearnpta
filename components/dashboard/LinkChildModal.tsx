"use client";

import { FormEvent, useState } from "react";

interface LinkChildModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLink: (data: { name: string; grade: string; school: string; studentId: string }) => void;
}

export default function LinkChildModal({ isOpen, onClose, onLink }: LinkChildModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    grade: "",
    school: "",
    studentId: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const grades = [
    "Grade 1",
    "Grade 2",
    "Grade 3",
    "Grade 4",
    "Grade 5",
    "Grade 6",
  ];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) newErrors.name = "Child's name is required";
    if (!formData.grade) newErrors.grade = "Grade is required";
    if (!formData.school.trim()) newErrors.school = "School name is required";
    if (!formData.studentId.trim()) newErrors.studentId = "Student ID is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 500));
    onLink(formData);
    setFormData({ name: "", grade: "", school: "", studentId: "" });
    setErrors({});
    setIsSubmitting(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900" style={{ fontFamily: "Poppins, sans-serif" }}>
              Link Your Child
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2" style={{ fontFamily: "Poppins, sans-serif" }}>
              Child's Full Name
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter child's full name"
              className={`w-full h-12 px-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#059669] ${
                errors.name ? "border-red-500" : "border-gray-300"
              }`}
              style={{ fontFamily: "Poppins, sans-serif" }}
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-600" style={{ fontFamily: "Poppins, sans-serif" }}>
                {errors.name}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2" style={{ fontFamily: "Poppins, sans-serif" }}>
              Grade
            </label>
            <select
              name="grade"
              value={formData.grade}
              onChange={handleChange}
              className={`w-full h-12 px-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#059669] ${
                errors.grade ? "border-red-500" : "border-gray-300"
              }`}
              style={{ fontFamily: "Poppins, sans-serif" }}
            >
              <option value="">Select Grade</option>
              {grades.map((grade) => (
                <option key={grade} value={grade}>
                  {grade}
                </option>
              ))}
            </select>
            {errors.grade && (
              <p className="mt-1 text-sm text-red-600" style={{ fontFamily: "Poppins, sans-serif" }}>
                {errors.grade}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2" style={{ fontFamily: "Poppins, sans-serif" }}>
              School Name
            </label>
            <input
              type="text"
              name="school"
              value={formData.school}
              onChange={handleChange}
              placeholder="Enter school name"
              className={`w-full h-12 px-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#059669] ${
                errors.school ? "border-red-500" : "border-gray-300"
              }`}
              style={{ fontFamily: "Poppins, sans-serif" }}
            />
            {errors.school && (
              <p className="mt-1 text-sm text-red-600" style={{ fontFamily: "Poppins, sans-serif" }}>
                {errors.school}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2" style={{ fontFamily: "Poppins, sans-serif" }}>
              Student ID
            </label>
            <input
              type="text"
              name="studentId"
              value={formData.studentId}
              onChange={handleChange}
              placeholder="Enter student ID"
              className={`w-full h-12 px-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#059669] ${
                errors.studentId ? "border-red-500" : "border-gray-300"
              }`}
              style={{ fontFamily: "Poppins, sans-serif" }}
            />
            {errors.studentId && (
              <p className="mt-1 text-sm text-red-600" style={{ fontFamily: "Poppins, sans-serif" }}>
                {errors.studentId}
              </p>
            )}
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 h-12 px-4 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-colors"
              style={{ fontFamily: "Poppins, sans-serif" }}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 h-12 px-4 bg-gradient-to-r from-[#059669] to-[#047857] text-white font-semibold rounded-lg hover:from-[#047857] hover:to-[#065f46] transition-all disabled:opacity-70 disabled:cursor-not-allowed"
              style={{ fontFamily: "Poppins, sans-serif" }}
            >
              {isSubmitting ? "Linking..." : "Link Child"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

