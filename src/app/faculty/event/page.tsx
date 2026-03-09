"use client";

import { Input } from "@/components";
import SectionTitle from "@/components/sectionTitle";
import Link from "next/link";
import { useMemo, useState } from "react";
import { BsCalendar3, BsSearch } from "react-icons/bs";
import { FiClock, FiMapPin, FiPlus, FiUsers } from "react-icons/fi";

type FacultyEvent = {
  id: number;
  title: string;
  category: "Technical" | "Workshop" | "Seminar" | "Cultural";
  date: string;
  time: string;
  venue: string;
  speaker: string;
  attendees: number;
  status: "Published" | "Draft" | "Upcoming";
  description: string;
};

const facultyEvents: FacultyEvent[] = [
  {
    id: 1,
    title: "Annual Tech Symposium 2024",
    category: "Technical",
    date: "Oct 24, 2024",
    time: "10:00 AM",
    venue: "Main Auditorium, Engineering Block",
    speaker: "Dr. Sarah Jenkins",
    attendees: 420,
    status: "Published",
    description:
      "A flagship campus technology event featuring AI, robotics, and student innovation showcases.",
  },
  {
    id: 2,
    title: "Workshop: UI/UX Design Basics",
    category: "Workshop",
    date: "Oct 28, 2024",
    time: "02:00 PM",
    venue: "Design Lab 1, Arts Wing",
    speaker: "Alex Rivera",
    attendees: 96,
    status: "Upcoming",
    description:
      "Hands-on workshop introducing layout thinking, wireframes, accessibility, and rapid prototyping.",
  },
  {
    id: 3,
    title: "Research Talk: Future of Robotics",
    category: "Seminar",
    date: "Nov 06, 2024",
    time: "11:30 AM",
    venue: "Innovation Hall, Room 204",
    speaker: "Prof. Michael Chen",
    attendees: 180,
    status: "Draft",
    description:
      "A faculty-led seminar covering research trends, lab demonstrations, and emerging robotics systems.",
  },
  {
    id: 4,
    title: "Campus Creative Night",
    category: "Cultural",
    date: "Nov 12, 2024",
    time: "05:30 PM",
    venue: "Open Air Theatre",
    speaker: "Maria Gonzalez",
    attendees: 260,
    status: "Published",
    description:
      "An evening program for music, performance showcases, and collaborative student-faculty creativity.",
  },
];

const statusStyles: Record<FacultyEvent["status"], string> = {
  Published: "bg-emerald-100 text-emerald-700",
  Draft: "bg-amber-100 text-amber-700",
  Upcoming: "bg-blue-100 text-blue-700",
};

const categoryStyles: Record<FacultyEvent["category"], string> = {
  Technical: "bg-sky-100 text-sky-700",
  Workshop: "bg-violet-100 text-violet-700",
  Seminar: "bg-amber-100 text-amber-700",
  Cultural: "bg-rose-100 text-rose-700",
};

export default function FacultyEventPage() {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredEvents = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();

    if (!query) {
      return facultyEvents;
    }

    return facultyEvents.filter((event) =>
      [event.title, event.category, event.venue, event.speaker, event.status]
        .join(" ")
        .toLowerCase()
        .includes(query),
    );
  }, [searchTerm]);

  const publishedCount = facultyEvents.filter(
    (event) => event.status === "Published",
  ).length;
  const draftCount = facultyEvents.filter(
    (event) => event.status === "Draft",
  ).length;
  const totalAttendees = facultyEvents.reduce(
    (sum, event) => sum + event.attendees,
    0,
  );

  return (
    <div className="min-h-screen bg-slate-50 p-8 font-sans">
      <div className="space-y-8">
        <div className="flex flex-col gap-5 xl:flex-row xl:items-start xl:justify-between">
          <SectionTitle
            title="Events"
            description="Manage all faculty-led events, monitor publishing status, and review upcoming campus sessions."
          />

          <div className="flex w-full max-w-2xl flex-col gap-3 sm:flex-row">
            <div className="flex-1">
              <Input
                id="faculty-event-search"
                label=""
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search events, venues, speakers, or status"
                icon={<BsSearch size={14} className="text-slate-400" />}
              />
            </div>
            <Link
              href="/faculty/event/create"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3.5 text-sm font-semibold text-white shadow-sm shadow-blue-200 transition-colors hover:bg-blue-700"
            >
              <FiPlus size={16} />
              Create Event
            </Link>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm shadow-slate-200/60">
            <p className="text-sm font-medium text-slate-500">Total Events</p>
            <p className="mt-2 text-3xl font-black tracking-tight text-slate-900">
              {facultyEvents.length}
            </p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm shadow-slate-200/60">
            <p className="text-sm font-medium text-slate-500">Published</p>
            <p className="mt-2 text-3xl font-black tracking-tight text-slate-900">
              {publishedCount}
            </p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm shadow-slate-200/60">
            <p className="text-sm font-medium text-slate-500">
              Total Attendees
            </p>
            <p className="mt-2 text-3xl font-black tracking-tight text-slate-900">
              {totalAttendees}
            </p>
          </div>
        </div>

        <div className="grid gap-5 xl:grid-cols-2">
          {filteredEvents.map((event) => (
            <article
              key={event.id}
              className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm shadow-slate-200/70 transition-transform duration-150 hover:-translate-y-0.5"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="space-y-3">
                  <div className="flex flex-wrap items-center gap-2">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${categoryStyles[event.category]}`}
                    >
                      {event.category}
                    </span>
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold tracking-tight text-slate-900">
                      {event.title}
                    </h3>
                    <p className="mt-2 max-w-xl text-sm leading-6 text-slate-500">
                      {event.description}
                    </p>
                  </div>
                </div>

                <div className="rounded-2xl bg-slate-50 px-4 py-3 text-right">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                    Attendees
                  </p>
                  <p className="mt-1 text-2xl font-black text-slate-900">
                    {event.attendees}
                  </p>
                </div>
              </div>

              <div className="mt-5 grid gap-3 text-sm text-slate-600 sm:grid-cols-2">
                <div className="flex items-center gap-2">
                  <BsCalendar3 size={14} className="text-slate-400" />
                  <span>{event.date}</span>
                </div>
                <div className="flex items-center gap-2">
                  <FiClock size={14} className="text-slate-400" />
                  <span>{event.time}</span>
                </div>
                <div className="flex items-center gap-2">
                  <FiMapPin size={14} className="text-slate-400" />
                  <span>{event.venue}</span>
                </div>
                <div className="flex items-center gap-2">
                  <FiUsers size={14} className="text-slate-400" />
                  <span>{event.speaker}</span>
                </div>
              </div>

              <div className="mt-6 flex flex-wrap items-center gap-3">
                <Link
                  href={`/faculty/event/${event.id}`}
                  className="rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-slate-800"
                >
                  View Details
                </Link>
              </div>
            </article>
          ))}
        </div>

        {filteredEvents.length === 0 && (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center shadow-sm shadow-slate-200/40">
            <p className="text-lg font-bold text-slate-800">No events found</p>
            <p className="mt-2 text-sm text-slate-500">
              Try a different search term or create a new faculty event.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
