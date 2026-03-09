import Link from "next/link";
import SectionTitle from "@/components/sectionTitle";
import { BsCalendar3, BsCashStack, BsThreeDotsVertical } from "react-icons/bs";
import { FiClipboard, FiUsers } from "react-icons/fi";

const stats = [
  {
    label: "Total Events",
    value: "128",
    note: "+12% from last month",
    icon: <BsCalendar3 size={18} className="text-blue-600" />,
    iconBg: "bg-blue-50",
    noteClass: "text-emerald-500",
  },
  {
    label: "Active Students",
    value: "4,520",
    note: "+5% active daily",
    icon: <FiUsers size={18} className="text-emerald-600" />,
    iconBg: "bg-emerald-50",
    noteClass: "text-emerald-500",
  },
  {
    label: "Pending Approvals",
    value: "12",
    note: "Requires attention",
    icon: <FiClipboard size={18} className="text-amber-600" />,
    iconBg: "bg-amber-50",
    noteClass: "text-slate-400",
  },
  {
    label: "Total Revenue",
    value: "$12,450",
    note: "+18% growth",
    icon: <BsCashStack size={18} className="text-blue-600" />,
    iconBg: "bg-blue-50",
    noteClass: "text-emerald-500",
  },
];

const recentEvents = [
  {
    name: "Annual Tech Symposium",
    date: "Oct 24, 2023",
    organizer: "Engineering Dept",
    status: "Approved",
    participants: 450,
  },
  {
    name: "Cultural Night 2023",
    date: "Oct 28, 2023",
    organizer: "Arts Club",
    status: "Pending",
    participants: 120,
  },
  {
    name: "Inter-College Debate",
    date: "Nov 02, 2023",
    organizer: "Literary Society",
    status: "Approved",
    participants: 85,
  },
  {
    name: "Career Fair",
    date: "Nov 10, 2023",
    organizer: "Placement Cell",
    status: "Approved",
    participants: 600,
  },
  {
    name: "Startup Pitch Deck",
    date: "Nov 15, 2023",
    organizer: "E-Cell",
    status: "Pending",
    participants: 45,
  },
];

const statusStyles: Record<string, string> = {
  Approved: "bg-emerald-100 text-emerald-700",
  Pending: "bg-amber-100 text-amber-700",
};

export default function AdminDashboardPage() {
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

        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm shadow-slate-200/70">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 px-6 py-5">
            <h2 className="text-2xl font-bold tracking-tight text-slate-900">
              Last 5 Events
            </h2>
            <Link
              href="/admin"
              className="text-sm font-semibold text-blue-600 transition-colors hover:text-blue-700"
            >
              View All Events
            </Link>
          </div>

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
                  <tr key={event.name} className="hover:bg-slate-50/80">
                    <td className="px-6 py-5 font-semibold text-slate-800">
                      {event.name}
                    </td>
                    <td className="px-6 py-5 text-slate-500">{event.date}</td>
                    <td className="px-6 py-5 text-slate-600">
                      {event.organizer}
                    </td>
                    <td className="px-6 py-5">
                      <span
                        className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${statusStyles[event.status]}`}
                      >
                        {event.status}
                      </span>
                    </td>
                    <td className="px-6 py-5 font-semibold text-slate-700">
                      {event.participants}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 px-6 py-4 text-sm text-slate-400">
            <p>Showing 5 of 128 events</p>
            <div className="flex items-center gap-2">
              <button
                type="button"
                className="rounded-md border border-slate-200 px-3 py-1.5 text-slate-400 transition-colors hover:bg-slate-50"
              >
                Previous
              </button>
              <button
                type="button"
                className="rounded-md border border-slate-200 bg-white px-3 py-1.5 font-semibold text-slate-700 transition-colors hover:bg-slate-50"
              >
                Next
              </button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
