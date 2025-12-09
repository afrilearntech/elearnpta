"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Icon } from "@iconify/react";
import { showSuccessToast } from "@/lib/toast";

type NavItem = {
  href: string;
  label: string;
  icon: string;
};

const parentNavItems: NavItem[] = [
  { href: "/dashboard", label: "Dashboard", icon: "solar:widget-5-bold" },
  { href: "/dashboard/children", label: "My Children", icon: "solar:users-group-two-rounded-bold" },
  { href: "/dashboard/grades", label: "Grades", icon: "solar:diploma-verified-bold" },
  { href: "/dashboard/assessments", label: "General Assessment", icon: "solar:document-text-bold" },
  { href: "/dashboard/submissions", label: "Submissions", icon: "solar:file-check-bold" },
  { href: "/dashboard/analytics", label: "Analytics", icon: "solar:chart-2-bold" },
];

const teacherNavItems: NavItem[] = [
  { href: "/dashboard/teacher", label: "Dashboard", icon: "solar:widget-5-bold" },
  { href: "/dashboard/teacher/class", label: "My Class", icon: "solar:users-group-two-rounded-bold" },
  { href: "/dashboard/teacher/subjects", label: "Subjects", icon: "solar:book-bold" },
  { href: "/dashboard/teacher/lessons", label: "Lessons", icon: "solar:book-bookmark-bold" },
  { href: "/dashboard/teacher/assignments", label: "Assignments", icon: "solar:document-add-bold" },
  { href: "/dashboard/teacher/quizzes", label: "Quizzes", icon: "solar:clipboard-list-bold" },
  { href: "/dashboard/teacher/assessments", label: "General Assessment", icon: "solar:document-text-bold" },
  { href: "/dashboard/teacher/grades", label: "Grades", icon: "solar:diploma-verified-bold" },
  { href: "/dashboard/teacher/submissions", label: "Submissions", icon: "solar:file-check-bold" },
];

function isActivePath(pathname: string, href: string) {
  if (href === "/dashboard") return pathname === "/dashboard" || pathname === "/";
  if (href === "/dashboard/teacher") return pathname === "/dashboard/teacher";
  return pathname.startsWith(href);
}

type SidebarProps = {
  mobileOpen?: boolean;
  onClose?: () => void;
  userName?: string;
  userRole?: string;
};

export default function Sidebar({ mobileOpen = false, onClose, userName = "Parent", userRole = "Parent" }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const isTeacher = userRole === "Teacher";
  const navItems = isTeacher ? teacherNavItems : parentNavItems;

  const handleLogout = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("auth_token");
      localStorage.removeItem("user");
      showSuccessToast("You have been logged out successfully");
      setTimeout(() => {
        router.push("/sign-in");
      }, 500);
    }
    if (onClose) {
      onClose();
    }
  };

  return (
    <>
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 shrink-0 border-r border-black/5 bg-white/95 pt-4 sm:block">
        <nav className="flex h-full flex-col">
          <ul className="px-3 py-2 mt-24 space-y-[15px]">
            {navItems.map((item) => {
              const active = isActivePath(pathname, item.href);
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={
                      "group relative flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors " +
                      (active
                        ? "bg-emerald-50 text-emerald-700"
                        : "text-gray-600 hover:bg-gray-50 hover:text-gray-900")
                    }
                  >
                    <Icon icon={item.icon} className="w-6 h-6" />
                    <span className="text-lg font-medium">{item.label}</span>
                    {active ? (
                      <span className="absolute right-0 top-0 h-full w-1.5 rounded-l bg-emerald-500" />
                    ) : null}
                  </Link>
                </li>
              );
            })}
          </ul>

          <div className="mt-auto p-3 space-y-3">
            <div className="rounded-lg bg-white border border-gray-200 shadow-sm p-4">
              <div className="font-semibold text-gray-900 text-sm mb-2">{userName}</div>
              <div className="inline-flex items-center rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-medium text-emerald-700">
                {userRole}
              </div>
            </div>
            <button 
              onClick={handleLogout}
              className="flex items-center justify-center gap-2 rounded-full bg-emerald-600 text-sm font-semibold text-white hover:bg-emerald-700 w-[220px] h-[50px] mx-auto transition-colors"
            >
              <Icon icon="solar:logout-2-bold" className="w-5 h-5" />
              Logout
            </button>
          </div>
        </nav>
      </aside>

      {mobileOpen ? (
        <div className="fixed inset-0 z-50 flex sm:hidden" role="dialog" aria-modal="true">
          <div className="absolute inset-0 bg-black/40" onClick={onClose} />
          <div className="relative h-full w-64 bg-white border-r border-black/5 pt-4 shadow-xl">
            <nav className="flex h-full flex-col">
              <ul className="px-3 py-2 mt-6 space-y-[15px]">
                {navItems.map((item) => {
                  const active = isActivePath(pathname, item.href);
                  return (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        onClick={onClose}
                        className={
                          "group relative flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors " +
                          (active
                            ? "bg-emerald-50 text-emerald-700"
                            : "text-gray-600 hover:bg-gray-50 hover:text-gray-900")
                        }
                      >
                        <Icon icon={item.icon} className="w-6 h-6" />
                        <span className="text-lg font-medium">{item.label}</span>
                        {active ? (
                          <span className="absolute right-0 top-0 h-full w-1.5 rounded-l bg-emerald-500" />
                        ) : null}
                      </Link>
                    </li>
                  );
                })}
              </ul>
              <div className="mt-auto p-3 space-y-3">
                <div className="rounded-lg bg-white border border-gray-200 shadow-sm p-4">
                  <div className="font-semibold text-gray-900 text-sm mb-2">{userName}</div>
                  <div className="inline-flex items-center rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-medium text-emerald-700">
                    {userRole}
                  </div>
                </div>
                <button 
                  onClick={handleLogout}
                  className="flex items-center justify-center gap-2 rounded-full bg-emerald-600 text-sm font-semibold text-white hover:bg-emerald-700 w-[220px] h-[50px] mx-auto transition-colors"
                >
                  <Icon icon="solar:logout-2-bold" className="w-5 h-5" />
                  Logout
                </button>
              </div>
            </nav>
          </div>
        </div>
      ) : null}
    </>
  );
}

