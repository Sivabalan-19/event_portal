"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { BsSearch } from "react-icons/bs";
import { FiClock, FiMapPin, FiPlus, FiUsers } from "react-icons/fi";

import { Input } from "@/components";
import SectionTitle from "@/components/sectionTitle";
import { fetchData } from "@/utils/axios";

type Speaker = {
  _id: string;
  name: string;
};

type FacultyEvent = {
  _id: string;
  title: string;
  category?: string;
  date?: string;
  time?: string;
  venue?: string;
  speakers?: Speaker[];
  maxAttendees?: number;
  status?: "Pending" | "Approved" | "Needs Changes" | "Rejected";
  description?: string;
  mode?: "online" | "offline" | "hybrid";
  reviewNote?: string;
};

function shouldShowReviewNote(status?: FacultyEvent["status"]) {
  return status === "Rejected" || status === "Needs Changes";
}

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

export default function FacultyEventPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [events, setEvents] = useState<FacultyEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadEvents = async () => {
      try {
        setIsLoading(true);
        const response = await fetchData<{ events: FacultyEvent[] }>("/events/mine");
        setEvents(response.events ?? []);
        setError(null);
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Failed to load your events";
        setError(message);
      } finally {
        setIsLoading(false);
      }
    };

    loadEvents();
  }, []);

  const filteredEvents = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();

    if (!query) {
      return events;
    }

    return events.filter((event) => {
      const speakerNames =
        event.speakers?.map((speaker) => speaker.name).join(" ") || "";

      return [
        event.title,
        event.category,
        event.venue,
        speakerNames,
        event.status,
        event.mode,
      ]
        .join(" ")
        .toLowerCase()
        .includes(query);
    });
  }, [events, searchTerm]);

  const approvedCount = events.filter((event) => event.status === "Approved").length;
  const pendingCount = events.filter(
    (event) => event.status === "Pending" || event.status === "Needs Changes",
  ).length;
  const totalCapacity = events.reduce(
    (sum, event) => sum + (event.maxAttendees ?? 0),
    0,
  );

  return (
    <div className="min-h-screen bg-slate-50 p-8 font-sans">
      <div className="space-y-8">
        <div className="flex flex-col gap-5 xl:flex-row xl:items-start xl:justify-between">
          <SectionTitle
            title="Events"
            description="Manage all faculty-led events, monitor approval status, and review upcoming campus sessions."
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
              {events.length}
            </p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm shadow-slate-200/60">
            <p className="text-sm font-medium text-slate-500">Approved</p>
            <p className="mt-2 text-3xl font-black tracking-tight text-slate-900">
              {approvedCount}
            </p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm shadow-slate-200/60">
            <p className="text-sm font-medium text-slate-500">Total Capacity</p>
            <p className="mt-2 text-3xl font-black tracking-tight text-slate-900">
              {totalCapacity}
            </p>
          </div>
        </div>

        {error && (
          <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {isLoading ? (
          <div className="rounded-2xl border border-slate-200 bg-white px-6 py-16 text-center text-sm text-slate-500 shadow-sm shadow-slate-200/40">
            Loading your events...
          </div>
        ) : filteredEvents.length > 0 ? (
          <div className="grid gap-5 xl:grid-cols-2">
            {filteredEvents.map((event) => (
              <article
                key={event._id}
                className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm shadow-slate-200/70 transition-transform duration-150 hover:-translate-y-0.5"
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="space-y-3">
                    <div className="flex flex-wrap items-center gap-2">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold ${getCategoryStyle(event.category)}`}
                      >
                        {event.category ?? "Uncategorized"}
                      </span>
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold ${getStatusStyle(event.status)}`}
                      >
                        {event.status ?? "Unknown"}
                      </span>
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold tracking-tight text-slate-900">
                        {event.title}
                      </h3>
                      <p className="mt-2 max-w-xl text-sm leading-6 text-slate-500">
                        {event.description || "No description has been added for this event yet."}
                      </p>
                    </div>
                  </div>

                  <div className="rounded-2xl bg-slate-50 px-4 py-3 text-right text-sm font-semibold text-slate-700">
                    <span>{event.date || "TBD"}</span>
                  </div>
                </div>

                <div className="mt-5 grid gap-3 text-sm text-slate-600 sm:grid-cols-2">
                  <div className="flex items-center gap-2">
                    <FiClock size={14} className="text-slate-400" />
                    <span>{event.time || "Time to be announced"}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FiMapPin size={14} className="text-slate-400" />
                    <span>{event.venue || "Venue to be announced"}</span>
                  </div>
                  <div className="flex items-center gap-2 sm:col-span-2">
                    <FiUsers size={14} className="text-slate-400" />
                    <span>
                      {event.speakers?.map((speaker) => speaker.name).join(", ") ||
                        "Speaker to be announced"}
                    </span>
                  </div>
                </div>

                {shouldShowReviewNote(event.status) && event.reviewNote && (
                  <div className="mt-5 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3">
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-rose-700">
                      {event.status === "Rejected" ? "Reason For Rejection" : "Requested Changes"}
                    </p>
                    <p className="mt-2 text-sm leading-6 text-rose-800">{event.reviewNote}</p>
                  </div>
                )}

                <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
                  <p className="text-sm font-medium text-slate-500">
                    Pending review: {pendingCount}
                  </p>
                  <Link
                    href={`/faculty/event/${event._id}`}
                    className="rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-slate-800"
                  >
                    View Details
                  </Link>
                </div>
              </article>
            ))}
          </div>
        ) : (
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
