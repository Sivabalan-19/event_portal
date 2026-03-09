"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { BsCalendar3, BsPeople, BsSearch } from "react-icons/bs";
import { FiArrowLeft, FiClock, FiMapPin, FiTag, FiUsers } from "react-icons/fi";

import { Input } from "@/components";
import SectionTitle from "@/components/sectionTitle";
import { fetchData, patchData } from "@/utils/axios";

type Speaker = {
  _id: string;
  name: string;
  email?: string;
  expertise?: string;
};

type EventRecord = {
  _id: string;
  title: string;
  category?: string;
  description?: string;
  date?: string;
  time?: string;
  venue?: string;
  mode?: "online" | "offline" | "hybrid";
  maxAttendees?: number;
  status?: "Pending" | "Approved" | "Needs Changes" | "Rejected";
  speakers?: Speaker[];
  createdAt?: string;
  reviewNote?: string;
};

type EventResponse = {
  event: EventRecord;
};

type Registration = {
  _id: string;
  status: "registered" | "waitlisted" | "attended" | "cancelled";
  waitlistPosition?: number;
  registeredAt: string;
  student: {
    _id: string;
    name: string;
    department?: string;
    year?: string;
    email?: string;
    rollNo?: string;
  };
};

type RegistrationResponse = {
  registrations: Registration[];
};

const statusStyles: Record<string, string> = {
  Approved: "bg-emerald-100 text-emerald-700",
  Pending: "bg-amber-100 text-amber-700",
  "Needs Changes": "bg-blue-100 text-blue-700",
  Rejected: "bg-rose-100 text-rose-700",
};

const categoryStyles: Record<string, string> = {
  Technical: "bg-sky-100 text-sky-700",
  Workshop: "bg-violet-100 text-violet-700",
  Seminar: "bg-amber-100 text-amber-700",
  Cultural: "bg-rose-100 text-rose-700",
};

function getStatusStyle(status?: string) {
  return statusStyles[status ?? ""] ?? "bg-slate-100 text-slate-700";
}

function getCategoryStyle(category?: string) {
  return categoryStyles[category ?? ""] ?? "bg-slate-100 text-slate-700";
}

function formatSpeakerNames(speakers?: Speaker[]) {
  if (!speakers?.length) {
    return "No speakers assigned";
  }

  return speakers.map((speaker) => speaker.name).join(", ");
}

function shouldShowReviewNote(status?: EventRecord["status"]) {
  return status === "Rejected" || status === "Needs Changes";
}

export default function FacultyEventDetailPage() {
  const params = useParams<{ id: string }>();
  const [event, setEvent] = useState<EventRecord | null>(null);
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [studentSearch, setStudentSearch] = useState("");
  const [updatingRegistrationId, setUpdatingRegistrationId] = useState<string | null>(null);

  useEffect(() => {
    const eventId = params?.id;

    if (!eventId) {
      setError("Missing event id");
      setIsLoading(false);
      return;
    }

    const loadEvent = async () => {
      try {
        setIsLoading(true);
        const [eventResponse, registrationResponse] = await Promise.all([
          fetchData<EventResponse>(`/events/${eventId}`),
          fetchData<RegistrationResponse>(`/registrations/event/${eventId}`),
        ]);
        setEvent(eventResponse.event);
        setRegistrations(registrationResponse.registrations ?? []);
        setError(null);
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Failed to load event details";
        setError(message);
        setEvent(null);
        setRegistrations([]);
      } finally {
        setIsLoading(false);
      }
    };

    loadEvent();
  }, [params?.id]);
  const filteredStudents = useMemo(() => {
    const query = studentSearch.trim().toLowerCase();

    if (!query) {
      return registrations;
    }

    return registrations.filter((student) =>
      [
        student.student.name,
        student.student.department,
        student.student.year,
        student.student.email,
        student.student.rollNo,
      ]
        .join(" ")
        .toLowerCase()
        .includes(query),
    );
  }, [registrations, studentSearch]);

  const speakerNames = formatSpeakerNames(event?.speakers);
  const capacity = event?.maxAttendees ?? 0;
  const confirmedRegistrations = registrations.filter(
    (registration) =>
      registration.status === "registered" || registration.status === "attended",
  ).length;
  const registeredCount = registrations.length;
  const capacityPercent =
    capacity > 0 ? Math.round((confirmedRegistrations / capacity) * 100) : 0;

  const updateAttendanceStatus = async (
    registrationId: string,
    status: "registered" | "attended",
  ) => {
    try {
      setUpdatingRegistrationId(registrationId);
      const response = await patchData<
        { message: string; registration: Registration },
        { status: "registered" | "attended" }
      >(`/registrations/${registrationId}/status`, { status });

      setRegistrations((current) =>
        current.map((registration) =>
          registration._id === registrationId
            ? { ...registration, ...response.registration }
            : registration,
        ),
      );
      setError(null);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to update attendance";
      setError(message);
    } finally {
      setUpdatingRegistrationId(null);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 p-8 font-sans">
        <div className="rounded-2xl border border-slate-200 bg-white px-6 py-16 text-center shadow-sm shadow-slate-200/40">
          <p className="text-lg font-bold text-slate-800">Loading event</p>
          <p className="mt-2 text-sm text-slate-500">
            Fetching the latest event details from the API.
          </p>
        </div>
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="min-h-screen bg-slate-50 p-8 font-sans">
        <div className="space-y-6">
          <Link
            href="/faculty/event"
            className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 transition-colors hover:text-slate-900"
          >
            <FiArrowLeft size={16} />
            Back to Events
          </Link>

          <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center shadow-sm shadow-slate-200/40">
            <p className="text-lg font-bold text-slate-800">Event not found</p>
            <p className="mt-2 text-sm text-slate-500">
              {error ?? "The selected event could not be loaded."}
            </p>
          </div>
        </div>
      </div>
    );
  }

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
          description="Review the full event plan and the latest information saved for this event."
        />

        {shouldShowReviewNote(event.status) && event.reviewNote && (
          <div className="rounded-2xl border border-rose-200 bg-rose-50 px-5 py-4 shadow-sm shadow-rose-100/60">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-rose-700">
              {event.status === "Rejected" ? "Reason For Rejection" : "Requested Changes"}
            </p>
            <p className="mt-2 text-sm leading-7 text-rose-900">{event.reviewNote}</p>
          </div>
        )}

        <div className="grid gap-4 md:grid-cols-4">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm shadow-slate-200/60">
            <p className="text-sm font-medium text-slate-500">Status</p>
            <span
              className={`mt-3 inline-flex rounded-full px-3 py-1 text-xs font-semibold ${getStatusStyle(event.status)}`}
            >
              {event.status ?? "Unknown"}
            </span>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm shadow-slate-200/60">
            <p className="text-sm font-medium text-slate-500">Category</p>
            <span
              className={`mt-3 inline-flex rounded-full px-3 py-1 text-xs font-semibold ${getCategoryStyle(event.category)}`}
            >
              {event.category ?? "Uncategorized"}
            </span>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm shadow-slate-200/60">
            <p className="text-sm font-medium text-slate-500">Registrations</p>
            <p className="mt-2 text-3xl font-black tracking-tight text-slate-900">
              {registeredCount}
            </p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm shadow-slate-200/60">
            <p className="text-sm font-medium text-slate-500">Capacity</p>
            <p className="mt-2 text-3xl font-black tracking-tight text-slate-900">
              {capacity}
            </p>
          </div>
        </div>

        <div className="grid gap-6 xl:grid-cols-[minmax(0,1.1fr)_420px]">
          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm shadow-slate-200/70">
            <div className="space-y-6">
              <div>
                <h2 className="text-lg font-bold text-slate-900">Event Overview</h2>
                <p className="mt-3 text-sm leading-7 text-slate-600">
                  {event.description || "No description has been added for this event yet."}
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
                      {event.date || "Not scheduled"}
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
                      {event.time || "To be announced"}
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
                      {event.venue || "Venue not set"}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3 rounded-2xl bg-slate-50 p-4">
                  <FiUsers size={16} className="mt-0.5 text-slate-500" />
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                      Speakers
                    </p>
                    <p className="mt-1 font-semibold text-slate-900">{speakerNames}</p>
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
                <h2 className="text-lg font-bold text-slate-900">Event Snapshot</h2>
                <p className="text-sm text-slate-500">
                  Quick summary of the current event configuration.
                </p>
              </div>
            </div>

            <div className="mt-6 space-y-4">
              <div className="rounded-2xl bg-slate-50 p-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-500">Filled Capacity</span>
                  <span className="font-semibold text-slate-900">{capacityPercent}%</span>
                </div>
                <div className="mt-3 h-3 rounded-full bg-slate-200">
                  <div
                    className="h-3 rounded-full bg-blue-600"
                    style={{ width: `${Math.min(100, capacityPercent)}%` }}
                  />
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-1">
                <div className="rounded-2xl border border-slate-200 p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                    Mode
                  </p>
                  <p className="mt-2 text-2xl font-black capitalize text-slate-900">
                    {event.mode ?? "offline"}
                  </p>
                </div>
                <div className="rounded-2xl border border-slate-200 p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                    Created
                  </p>
                  <p className="mt-2 text-2xl font-black text-slate-900">
                    {event.createdAt
                      ? new Date(event.createdAt).toLocaleDateString()
                      : "Unknown"}
                  </p>
                </div>
              </div>
            </div>
          </section>
        </div>

        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm shadow-slate-200/70">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 px-6 py-5">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Registered Students</h2>
              <p className="text-sm text-slate-500">
                Students who registered for this specific event are listed below.
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

          {filteredStudents.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-slate-200 text-sm">
                <thead className="bg-slate-50 text-left text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                  <tr>
                    <th className="px-6 py-4">Student Name</th>
                    <th className="px-6 py-4">Roll No</th>
                    <th className="px-6 py-4">Department</th>
                    <th className="px-6 py-4">Year</th>
                    <th className="px-6 py-4">Email</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4">Registered On</th>
                    <th className="px-6 py-4">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 bg-white">
                  {filteredStudents.map((registration) => (
                    <tr key={registration._id} className="hover:bg-slate-50/80">
                      <td className="px-6 py-4 font-semibold text-slate-900">
                        {registration.student.name}
                      </td>
                      <td className="px-6 py-4 text-slate-600">
                        {registration.student.rollNo || "-"}
                      </td>
                      <td className="px-6 py-4 text-slate-600">
                        {registration.student.department || "-"}
                      </td>
                      <td className="px-6 py-4 text-slate-600">
                        {registration.student.year || "-"}
                      </td>
                      <td className="px-6 py-4 text-slate-600">
                        {registration.student.email || "-"}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                            registration.status === "waitlisted"
                              ? "bg-amber-100 text-amber-700"
                              : "bg-emerald-100 text-emerald-700"
                          }`}
                        >
                          {registration.status === "waitlisted"
                            ? `Waitlisted${registration.waitlistPosition ? ` (#${registration.waitlistPosition})` : ""}`
                            : registration.status === "attended"
                              ? "Attended"
                              : "Registered"}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-slate-600">
                        {new Date(registration.registeredAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4">
                        {registration.status === "waitlisted" ? (
                          <span className="text-xs font-semibold text-slate-400">
                            Waitlisted students cannot be marked
                          </span>
                        ) : (
                          <button
                            type="button"
                            disabled={updatingRegistrationId === registration._id}
                            onClick={() =>
                              updateAttendanceStatus(
                                registration._id,
                                registration.status === "attended"
                                  ? "registered"
                                  : "attended",
                              )
                            }
                            className={`rounded-lg px-3 py-2 text-xs font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-60 ${
                              registration.status === "attended"
                                ? "border border-blue-200 bg-white text-blue-600 hover:bg-blue-50"
                                : "bg-blue-600 text-white hover:bg-blue-700"
                            }`}
                          >
                            {updatingRegistrationId === registration._id
                              ? "Saving..."
                              : registration.status === "attended"
                                ? "Mark Registered"
                                : "Mark Attended"}
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="px-6 py-10 text-center">
              <p className="text-sm font-semibold text-slate-700">No registrations found.</p>
              <p className="mt-1 text-sm text-slate-500">
                Students will appear here once they register for this event.
              </p>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
