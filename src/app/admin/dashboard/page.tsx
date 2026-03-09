"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { BsCalendar3, BsPatchCheck } from "react-icons/bs";
import { FiClipboard, FiUsers } from "react-icons/fi";

import SectionTitle from "@/components/sectionTitle";
import { fetchData } from "@/utils/axios";

type DashboardSummary = {
  totalEvents: number;
  activeStudents: number;
  pendingApprovals: number;
  totalSpeakers: number;
};

type RecentEvent = {
  _id: string;
  title: string;
  date?: string;
  status?: "Pending" | "Approved" | "Needs Changes" | "Rejected";
  registrationCount?: number;
  createdBy?: {
    name?: string;
    email?: string;
    department?: string;
  };
};

const statusStyles: Record<string, string> = {
  Approved: "bg-emerald-100 text-emerald-700",
  Pending: "bg-amber-100 text-amber-700",
  "Needs Changes": "bg-blue-100 text-blue-700",
  Rejected: "bg-rose-100 text-rose-700",
};

function formatDate(date?: string) {
  if (!date) {
    return "TBD";
  }

  const parsedDate = new Date(date);
  return Number.isNaN(parsedDate.getTime())
    ? date
    : parsedDate.toLocaleDateString("en-US", {
        month: "short",
        day: "2-digit",
        year: "numeric",
      });
}

function getOrganizerLabel(event: RecentEvent) {
  return (
    event.createdBy?.department ||
    event.createdBy?.name ||
    event.createdBy?.email ||
    "Organizer unavailable"
  );
}

export default function AdminDashboardPage() {
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [recentEvents, setRecentEvents] = useState<RecentEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        setIsLoading(true);
        const response = await fetchData<{
          summary: DashboardSummary;
          recentEvents: RecentEvent[];
        }>("/events/admin/summary");
        setSummary(response.summary);
        setRecentEvents(response.recentEvents ?? []);
        setError(null);
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Failed to load admin dashboard";
        setError(message);
      } finally {
        setIsLoading(false);
      }
    };

    loadDashboard();
  }, []);

  const stats = useMemo(() => {
    return [
      {
        label: "Total Events",
        value: summary?.totalEvents ?? 0,
        note: "All events submitted in the portal",
        icon: <BsCalendar3 size={18} className="text-blue-600" />,
        iconBg: "bg-blue-50",
        noteClass: "text-blue-500",
      },
      {
        label: "Active Students",
        value: summary?.activeStudents ?? 0,
        note: "Student accounts on the platform",
        icon: <FiUsers size={18} className="text-emerald-600" />,
        iconBg: "bg-emerald-50",
        noteClass: "text-emerald-500",
      },
      {
        label: "Pending Approvals",
        value: summary?.pendingApprovals ?? 0,
        note: "Events requiring admin review",
        icon: <FiClipboard size={18} className="text-amber-600" />,
        iconBg: "bg-amber-50",
        noteClass: "text-amber-500",
      },
      {
        label: "Total Speakers",
        value: summary?.totalSpeakers ?? 0,
        note: "Profiles available across the portal",
        icon: <BsPatchCheck size={18} className="text-violet-600" />,
        iconBg: "bg-violet-50",
        noteClass: "text-violet-500",
      },
    ];
  }, [summary]);

  return (
    <div className="min-h-screen bg-slate-50 p-8 font-sans">
      <div className="space-y-8">
        <SectionTitle
          title="Dashboard"
          description="Track platform performance, event activity, approvals, and engagement across the campus portal."
        />

        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {stats.map((stat) => (
            <article
              key={stat.label}
              className="rounded-2xl border border-slate-200 bg-white px-6 py-5 shadow-sm shadow-slate-200/60"
            >
              <div
                className={`mb-5 flex h-11 w-11 items-center justify-center rounded-xl ${stat.iconBg}`}
              >
                {stat.icon}
              </div>
              <p className="text-sm font-medium text-slate-500">{stat.label}</p>
              <p className="mt-1 text-4xl font-black tracking-tight text-slate-900">
                {stat.value}
              </p>
              <p className={`mt-2 text-sm font-semibold ${stat.noteClass}`}>
                {stat.note}
              </p>
            </article>
          ))}
        </div>

        {error && (
          <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm shadow-slate-200/70">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 px-6 py-5">
            <h2 className="text-2xl font-bold tracking-tight text-slate-900">
              Last 5 Events
            </h2>
            <Link
              href="/admin/event"
              className="text-sm font-semibold text-blue-600 transition-colors hover:text-blue-700"
            >
              View All Events
            </Link>
          </div>

          {isLoading ? (
            <div className="px-6 py-16 text-center text-sm text-slate-500">
              Loading dashboard activity...
            </div>
          ) : recentEvents.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-slate-200 text-sm">
                <thead className="bg-slate-50 text-left text-xs font-bold uppercase tracking-[0.16em] text-slate-500">
                  <tr>
                    <th className="px-6 py-4">Event Name</th>
                    <th className="px-6 py-4">Date</th>
                    <th className="px-6 py-4">Organizer</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4">Participants</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 bg-white">
                  {recentEvents.map((event) => (
                    <tr key={event._id} className="hover:bg-slate-50/80">
                      <td className="px-6 py-5 font-semibold text-slate-800">
                        {event.title}
                      </td>
                      <td className="px-6 py-5 text-slate-500">
                        {formatDate(event.date)}
                      </td>
                      <td className="px-6 py-5 text-slate-600">
                        {getOrganizerLabel(event)}
                      </td>
                      <td className="px-6 py-5">
                        <span
                          className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${statusStyles[event.status ?? ""] ?? "bg-slate-100 text-slate-700"}`}
                        >
                          {event.status ?? "Unknown"}
                        </span>
                      </td>
                      <td className="px-6 py-5 font-semibold text-slate-700">
                        {event.registrationCount ?? 0}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="px-6 py-16 text-center text-sm text-slate-500">
              No event submissions are available yet.
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
