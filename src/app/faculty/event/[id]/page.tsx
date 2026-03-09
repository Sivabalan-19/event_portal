"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Input } from "@/components";
import SectionTitle from "@/components/sectionTitle";
import { BsCalendar3, BsPeople, BsPersonBadge, BsSearch } from "react-icons/bs";
import {
  FiArrowLeft,
  FiClock,
  FiMail,
  FiMapPin,
  FiTag,
  FiUser,
} from "react-icons/fi";

type EventStatus = "Published" | "Draft" | "Upcoming";
type EventCategory = "Technical" | "Workshop" | "Seminar" | "Cultural";

type RegisteredStudent = {
  id: number;
  name: string;
  department: string;
  year: string;
  email: string;
  registeredAt: string;
  status: "Confirmed" | "Waitlisted";
  attendance: "Present" | "Absent" | "Pending";
};

type EventDetail = {
  id: number;
  title: string;
  category: EventCategory;
  status: EventStatus;
  date: string;
  time: string;
  venue: string;
  speaker: string;
  attendees: number;
  maxAttendees: number;
  description: string;
  agenda: string[];
  students: RegisteredStudent[];
};

const eventDetails: EventDetail[] = [
  {
    id: 1,
    title: "Annual Tech Symposium 2024",
    category: "Technical",
    status: "Published",
    date: "Oct 24, 2024",
    time: "10:00 AM",
    venue: "Main Auditorium, Engineering Block",
    speaker: "Dr. Sarah Jenkins",
    attendees: 420,
    maxAttendees: 500,
    description:
      "A flagship campus technology event featuring keynote talks, faculty research showcases, startup demos, and interdisciplinary student innovation sessions. The program is designed to connect research, industry thinking, and hands-on campus work in one day.",
    agenda: [
      "Opening keynote on applied AI in higher education",
      "Faculty research spotlight and innovation showcase",
      "Student product demos and robotics walkthroughs",
      "Networking session with invited guest speakers",
    ],
    students: [
      {
        id: 1,
        name: "Aarav Mehta",
        department: "Computer Science",
        year: "3rd Year",
        email: "aarav.mehta@example.com",
        registeredAt: "Oct 10, 2024",
        status: "Confirmed",
        attendance: "Present",
      },
      {
        id: 2,
        name: "Priya Nair",
        department: "Information Technology",
        year: "2nd Year",
        email: "priya.nair@example.com",
        registeredAt: "Oct 12, 2024",
        status: "Confirmed",
        attendance: "Present",
      },
      {
        id: 3,
        name: "Rahul Verma",
        department: "Electronics",
        year: "4th Year",
        email: "rahul.verma@example.com",
        registeredAt: "Oct 13, 2024",
        status: "Waitlisted",
        attendance: "Pending",
      },
      {
        id: 4,
        name: "Sneha Kapoor",
        department: "Artificial Intelligence",
        year: "1st Year",
        email: "sneha.kapoor@example.com",
        registeredAt: "Oct 14, 2024",
        status: "Confirmed",
        attendance: "Absent",
      },
    ],
  },
  {
    id: 2,
    title: "Workshop: UI/UX Design Basics",
    category: "Workshop",
    status: "Upcoming",
    date: "Oct 28, 2024",
    time: "02:00 PM",
    venue: "Design Lab 1, Arts Wing",
    speaker: "Alex Rivera",
    attendees: 96,
    maxAttendees: 120,
    description:
      "A hands-on design workshop focused on user flows, wireframes, layout systems, accessibility decisions, and prototype communication for campus product teams.",
    agenda: [
      "Design fundamentals and visual hierarchy",
      "Wireframing exercise with team critique",
      "Accessibility review and interface iteration",
      "Prototype presentation and discussion",
    ],
    students: [
      {
        id: 1,
        name: "Nikita Sharma",
        department: "Design",
        year: "3rd Year",
        email: "nikita.sharma@example.com",
        registeredAt: "Oct 15, 2024",
        status: "Confirmed",
        attendance: "Present",
      },
      {
        id: 2,
        name: "Karan Malhotra",
        department: "Computer Science",
        year: "2nd Year",
        email: "karan.malhotra@example.com",
        registeredAt: "Oct 16, 2024",
        status: "Confirmed",
        attendance: "Pending",
      },
      {
        id: 3,
        name: "Ishita Roy",
        department: "Media Studies",
        year: "4th Year",
        email: "ishita.roy@example.com",
        registeredAt: "Oct 18, 2024",
        status: "Confirmed",
        attendance: "Pending",
      },
    ],
  },
  {
    id: 3,
    title: "Research Talk: Future of Robotics",
    category: "Seminar",
    status: "Draft",
    date: "Nov 06, 2024",
    time: "11:30 AM",
    venue: "Innovation Hall, Room 204",
    speaker: "Prof. Michael Chen",
    attendees: 180,
    maxAttendees: 220,
    description:
      "A faculty-led seminar exploring research trends, human-robot collaboration, automation ethics, and emerging robotics systems shaping the next decade.",
    agenda: [
      "Robotics research landscape overview",
      "Human-robot collaboration case studies",
      "Lab demonstrations and Q&A session",
    ],
    students: [
      {
        id: 1,
        name: "Yash Patel",
        department: "Mechanical Engineering",
        year: "3rd Year",
        email: "yash.patel@example.com",
        registeredAt: "Oct 20, 2024",
        status: "Confirmed",
        attendance: "Pending",
      },
      {
        id: 2,
        name: "Tanvi Desai",
        department: "Electronics",
        year: "2nd Year",
        email: "tanvi.desai@example.com",
        registeredAt: "Oct 21, 2024",
        status: "Confirmed",
        attendance: "Pending",
      },
    ],
  },
  {
    id: 4,
    title: "Campus Creative Night",
    category: "Cultural",
    status: "Published",
    date: "Nov 12, 2024",
    time: "05:30 PM",
    venue: "Open Air Theatre",
    speaker: "Maria Gonzalez",
    attendees: 260,
    maxAttendees: 350,
    description:
      "An evening cultural program bringing together performance, live creative showcases, and collaborative student-faculty experiences in a celebratory campus setting.",
    agenda: [
      "Opening performance and faculty welcome",
      "Music and spoken-word showcase",
      "Creative collaboration segment",
      "Closing community spotlight",
    ],
    students: [
      {
        id: 1,
        name: "Meera Joshi",
        department: "English",
        year: "1st Year",
        email: "meera.joshi@example.com",
        registeredAt: "Oct 22, 2024",
        status: "Confirmed",
        attendance: "Pending",
      },
      {
        id: 2,
        name: "Arjun Singh",
        department: "Performing Arts",
        year: "4th Year",
        email: "arjun.singh@example.com",
        registeredAt: "Oct 22, 2024",
        status: "Confirmed",
        attendance: "Pending",
      },
      {
        id: 3,
        name: "Diya Thomas",
        department: "Mass Communication",
        year: "2nd Year",
        email: "diya.thomas@example.com",
        registeredAt: "Oct 23, 2024",
        status: "Confirmed",
        attendance: "Pending",
      },
    ],
  },
];

const statusStyles: Record<EventStatus, string> = {
  Published: "bg-emerald-100 text-emerald-700",
  Draft: "bg-amber-100 text-amber-700",
  Upcoming: "bg-blue-100 text-blue-700",
};

const categoryStyles: Record<EventCategory, string> = {
  Technical: "bg-sky-100 text-sky-700",
  Workshop: "bg-violet-100 text-violet-700",
  Seminar: "bg-amber-100 text-amber-700",
  Cultural: "bg-rose-100 text-rose-700",
};

type EventDetailPageProps = {
  params?: Promise<{
    id: string;
  }>;
};

export default function FacultyEventDetailPage(_: EventDetailPageProps) {
  const params = useParams<{ id: string }>();
  const event = useMemo(
    () => eventDetails.find((item) => item.id === Number(params.id)),
    [params.id],
  );

  const [students, setStudents] = useState<RegisteredStudent[]>([]);
  const [studentSearch, setStudentSearch] = useState("");

  useEffect(() => {
    if (!event) {
      return;
    }

    setStudents(
      event.students.map((student) => ({
        ...student,
        attendance: "Absent",
      })),
    );
  }, [event]);

  if (!event) {
    return (
      <div className="min-h-screen bg-slate-50 p-8 font-sans">
        <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center shadow-sm shadow-slate-200/40">
          <p className="text-lg font-bold text-slate-800">Event not found</p>
          <p className="mt-2 text-sm text-slate-500">
            The selected event could not be loaded.
          </p>
        </div>
      </div>
    );
  }

  const toggleAttendance = (studentId: number) => {
    setStudents((current) =>
      current.map((student) => {
        if (student.id !== studentId || student.status !== "Confirmed") {
          return student;
        }

        return {
          ...student,
          attendance:
            student.attendance === "Present" ? "Absent" : "Present",
        };
      }),
    );
  };

  const presentStudents = students.filter(
    (student) => student.attendance === "Present",
  ).length;
  const absentStudents = students.filter(
    (student) => student.attendance === "Absent",
  ).length;
  const filteredStudents = students.filter((student) =>
    [student.name, student.department, student.year, student.email]
      .join(" ")
      .toLowerCase()
      .includes(studentSearch.trim().toLowerCase()),
  );

  return (
    <div className="min-h-screen bg-slate-50 p-8 font-sans">
      <div className="space-y-8">
        <div className="flex items-center justify-between gap-4">
          <Link
            href="/faculty/event"
            className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 transition-colors hover:text-slate-900"
          >
            <FiArrowLeft size={16} />
            Back to Events
          </Link>
          <Link
            href="/faculty/event/create"
            className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50"
          >
            Edit Event
          </Link>
        </div>

        <SectionTitle
          title={event.title}
          description="Review the full event plan, attendance overview, and student registrations in one place."
        />

        <div className="grid gap-4 md:grid-cols-4">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm shadow-slate-200/60">
            <p className="text-sm font-medium text-slate-500">Status</p>
            <span
              className={`mt-3 inline-flex rounded-full px-3 py-1 text-xs font-semibold ${statusStyles[event.status]}`}
            >
              {event.status}
            </span>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm shadow-slate-200/60">
            <p className="text-sm font-medium text-slate-500">Category</p>
            <span
              className={`mt-3 inline-flex rounded-full px-3 py-1 text-xs font-semibold ${categoryStyles[event.category]}`}
            >
              {event.category}
            </span>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm shadow-slate-200/60">
            <p className="text-sm font-medium text-slate-500">
              Registered Students
            </p>
            <p className="mt-2 text-3xl font-black tracking-tight text-slate-900">
              {students.length}
            </p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm shadow-slate-200/60">
            <p className="text-sm font-medium text-slate-500">Capacity</p>
            <p className="mt-2 text-3xl font-black tracking-tight text-slate-900">
              {event.attendees}/{event.maxAttendees}
            </p>
          </div>
        </div>

        <div className="grid gap-6 xl:grid-cols-[minmax(0,1.1fr)_420px]">
          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm shadow-slate-200/70">
            <div className="space-y-6">
              <div>
                <h2 className="text-lg font-bold text-slate-900">
                  Event Overview
                </h2>
                <p className="mt-3 text-sm leading-7 text-slate-600">
                  {event.description}
                </p>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="flex items-start gap-3 rounded-2xl bg-slate-50 p-4">
                  <BsCalendar3 size={16} className="mt-0.5 text-slate-500" />
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                      Date
                    </p>
                    <p className="mt-1 font-semibold text-slate-900">
                      {event.date}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3 rounded-2xl bg-slate-50 p-4">
                  <FiClock size={16} className="mt-0.5 text-slate-500" />
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                      Time
                    </p>
                    <p className="mt-1 font-semibold text-slate-900">
                      {event.time}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3 rounded-2xl bg-slate-50 p-4">
                  <FiMapPin size={16} className="mt-0.5 text-slate-500" />
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                      Venue
                    </p>
                    <p className="mt-1 font-semibold text-slate-900">
                      {event.venue}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3 rounded-2xl bg-slate-50 p-4">
                  <BsPersonBadge size={16} className="mt-0.5 text-slate-500" />
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                      Speaker
                    </p>
                    <p className="mt-1 font-semibold text-slate-900">
                      {event.speaker}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm shadow-slate-200/70">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
                <FiTag size={18} />
              </div>
              <div>
                <h2 className="text-lg font-bold text-slate-900">
                  Registration Snapshot
                </h2>
                <p className="text-sm text-slate-500">
                  Monitor registrations and attendance for this event.
                </p>
              </div>
            </div>

            <div className="mt-6 space-y-4">
              <div className="rounded-2xl bg-slate-50 p-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-500">Filled Capacity</span>
                  <span className="font-semibold text-slate-900">
                    {Math.round((event.attendees / event.maxAttendees) * 100)}%
                  </span>
                </div>
                <div className="mt-3 h-3 rounded-full bg-slate-200">
                  <div
                    className="h-3 rounded-full bg-blue-600"
                    style={{
                      width: `${Math.min(100, (event.attendees / event.maxAttendees) * 100)}%`,
                    }}
                  />
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-1">
                <div className="rounded-2xl border border-slate-200 p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                    Present
                  </p>
                  <p className="mt-2 text-2xl font-black text-slate-900">
                    {presentStudents}
                  </p>
                </div>
                <div className="rounded-2xl border border-slate-200 p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                    Absent
                  </p>
                  <p className="mt-2 text-2xl font-black text-slate-900">
                    {absentStudents}
                  </p>
                </div>
              </div>
            </div>
          </section>
        </div>

        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm shadow-slate-200/70">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 px-6 py-5">
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                Registered Students
              </h2>
              <p className="text-sm text-slate-500">
                Students currently linked to this event registration list.
              </p>
            </div>
            <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:items-center">
              <div className="w-full sm:w-80">
                <Input
                  id="student-search"
                  label=""
                  value={studentSearch}
                  onChange={(e) => setStudentSearch(e.target.value)}
                  placeholder="Search students"
                  icon={<BsSearch size={14} className="text-slate-400" />}
                />
              </div>
              <span className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1.5 text-xs font-semibold text-blue-700">
                <BsPeople size={13} />
                {filteredStudents.length} Students
              </span>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200 text-sm">
              <thead className="bg-slate-50 text-left text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                <tr>
                  <th className="px-6 py-4">Student</th>
                  <th className="px-6 py-4">Department</th>
                  <th className="px-6 py-4">Year</th>
                  <th className="px-6 py-4">Email</th>
                  <th className="px-6 py-4">Registered On</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Attendance</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white">
                {filteredStudents.map((student) => (
                  <tr key={student.id} className="hover:bg-slate-50/80">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-sm font-bold text-slate-700">
                          {student.name
                            .split(" ")
                            .map((part) => part[0])
                            .slice(0, 2)
                            .join("")}
                        </div>
                        <div>
                          <p className="font-semibold text-slate-900">
                            {student.name}
                          </p>
                          <div className="mt-1 flex items-center gap-1 text-xs text-slate-500">
                            <FiUser size={12} />
                            Student registration
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-slate-600">
                      {student.department}
                    </td>
                    <td className="px-6 py-4 text-slate-600">{student.year}</td>
                    <td className="px-6 py-4 text-slate-600">
                      <div className="flex items-center gap-2">
                        <FiMail size={13} className="text-slate-400" />
                        {student.email}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-slate-600">
                      {student.registeredAt}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${student.status === "Confirmed" ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"}`}
                      >
                        {student.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col items-start gap-2">
                       
                        {student.status === "Confirmed" ? (
                          <button
                            type="button"
                            onClick={() => toggleAttendance(student.id)}
                            className={`rounded-lg px-3 py-1.5 text-[11px] font-semibold transition-colors ${
                              student.attendance === "Present"
                                ? "bg-blue-600 text-white hover:bg-blue-700"
                                : "border border-blue-200 bg-white text-blue-600 hover:bg-blue-50"
                            }`}
                          >
                            {student.attendance === "Present"
                              ? "Mark Absent"
                              : "Mark Present"}
                          </button>
                        ) : (
                          <span className="text-[11px] font-semibold text-slate-400">
                            Waitlisted students cannot be marked
                          </span>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredStudents.length === 0 && (
            <div className="border-t border-slate-100 px-6 py-10 text-center">
              <p className="text-sm font-semibold text-slate-700">
                No students match your search.
              </p>
              <p className="mt-1 text-sm text-slate-500">
                Try searching by name, department, year, or email.
              </p>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
