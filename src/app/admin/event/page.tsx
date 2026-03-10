"use client";

import { useMemo, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components";
import SectionTitle from "@/components/sectionTitle";
import { fetchData, patchData } from "@/utils/axios";
import {
  BsCalendar3,
  BsCheckCircle,
  BsClockHistory,
  BsXCircle,
} from "react-icons/bs";
import { FiAlertCircle, FiClock, FiMapPin, FiSearch, FiUsers } from "react-icons/fi";

type ReviewStatus = "Pending" | "Approved" | "Needs Changes" | "Rejected";

type AdminEvent = {
  _id: string;
  title: string;
  category?: string;
  date?: string;
  time?: string;
  venue?: string;
  maxAttendees?: number;
  status?: ReviewStatus;
  reviewNote?: string;
  registrationCount?: number;
  createdAt?: string;
  createdBy?: {
    name?: string;
    email?: string;
    department?: string;
  };
};

const statusClasses: Record<ReviewStatus, string> = {
  Pending: "bg-amber-100 text-amber-700",
  Approved: "bg-emerald-100 text-emerald-700",
  "Needs Changes": "bg-blue-100 text-blue-700",
  Rejected: "bg-rose-100 text-rose-700",
};

const filterOptions: Array<ReviewStatus | "All"> = [
  "All",
  "Pending",
  "Needs Changes",
  "Approved",
  "Rejected",
];

function getOrganizerLabel(event: AdminEvent) {
  return (
    event.createdBy?.department ||
    event.createdBy?.name ||
    event.createdBy?.email ||
    "Organizer unavailable"
  );
}

function formatCreatedAt(date?: string) {
  if (!date) {
    return "Recently submitted";
  }

  const parsedDate = new Date(date);
  return Number.isNaN(parsedDate.getTime())
    ? date
    : parsedDate.toLocaleString("en-US", {
        month: "short",
        day: "2-digit",
        year: "numeric",
      });
}

export default function AdminEventReviewPage() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [activeFilter, setActiveFilter] = useState<ReviewStatus | "All">("All");
  const [reviews, setReviews] = useState<AdminEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [feedbackEventId, setFeedbackEventId] = useState<string | null>(null);
  const [feedbackStatus, setFeedbackStatus] = useState<"Needs Changes" | "Rejected" | null>(null);
  const [feedbackNotes, setFeedbackNotes] = useState<Record<string, string>>({});

  useEffect(() => {
    const loadEvents = async () => {
      try {
        setIsLoading(true);
        const response = await fetchData<{ events: AdminEvent[] }>("/events/admin");
        setReviews(response.events ?? []);
        setError(null);
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Failed to load event review queue";
        setError(message);
      } finally {
        setIsLoading(false);
      }
    };

    loadEvents();
  }, []);

  const filteredEvents = useMemo(() => {
    return reviews.filter((event) => {
      const matchesFilter = activeFilter === "All" || event.status === activeFilter;
      const searchValue = searchTerm.trim().toLowerCase();
      const matchesSearch =
        !searchValue ||
        event.title.toLowerCase().includes(searchValue) ||
        getOrganizerLabel(event).toLowerCase().includes(searchValue) ||
        (event.category || "").toLowerCase().includes(searchValue) ||
        (event.createdBy?.name || "").toLowerCase().includes(searchValue);

      return matchesFilter && matchesSearch;
    });
  }, [activeFilter, reviews, searchTerm]);

  const statCards = useMemo(
    () => [
      {
        label: "Review Queue",
        value: reviews.filter((event) => event.status === "Pending").length,
        note: "Events awaiting a decision",
        icon: <BsClockHistory size={18} className="text-amber-600" />,
        iconBg: "bg-amber-50",
        noteClass: "text-amber-500",
      },
      {
        label: "Approved Events",
        value: reviews.filter((event) => event.status === "Approved").length,
        note: "Ready to go live in the portal",
        icon: <BsCheckCircle size={18} className="text-emerald-600" />,
        iconBg: "bg-emerald-50",
        noteClass: "text-emerald-500",
      },
      {
        label: "Needs Changes",
        value: reviews.filter((event) => event.status === "Needs Changes").length,
        note: "Waiting for faculty updates",
        icon: <FiAlertCircle size={18} className="text-blue-600" />,
        iconBg: "bg-blue-50",
        noteClass: "text-blue-500",
      },
      {
        label: "Rejected Events",
        value: reviews.filter((event) => event.status === "Rejected").length,
        note: "Not approved after review",
        icon: <BsXCircle size={18} className="text-rose-600" />,
        iconBg: "bg-rose-50",
        noteClass: "text-rose-500",
      },
    ],
    [reviews],
  );

  const applyStatus = async (
    eventId: string,
    status: ReviewStatus,
    reviewNote?: string,
  ) => {
    try {
      const response = await patchData<{ event: AdminEvent }, { status: ReviewStatus; reviewNote?: string }>(
        `/events/admin/${eventId}/status`,
        { status, reviewNote },
      );

      setReviews((current) =>
        current.map((event) =>
          event._id === eventId ? { ...event, ...response.event } : event,
        ),
      );
      setFeedbackEventId(null);
      setFeedbackStatus(null);
      setError(null);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to update event status";
      setError(message);
    }
  };

  const submitFeedback = async (eventId: string) => {
    const note = feedbackNotes[eventId]?.trim();

    if (!feedbackStatus || !note) {
      return;
    }

    await applyStatus(eventId, feedbackStatus, note);
  };

  return (
    <div className="min-h-screen bg-slate-50 p-8 font-sans">
      <div className="space-y-8">
        <SectionTitle
          title="Events Review"
          description="Review submitted events, approve the right ones, and send back clear feedback when needed."
        />

        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {statCards.map((stat) => (
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

        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm shadow-slate-200/70">
          <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
            <div>
              <h2 className="text-2xl font-bold tracking-tight text-slate-900">
                Submitted Events
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                Click any card to open the full review page for that event.
              </p>
            </div>

            <div className="w-full xl:max-w-md">
              <Input
                id="event-review-search"
                label=""
                placeholder="Search by event, organizer, category, or faculty"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                icon={<FiSearch className="text-slate-400" />}
              />
            </div>
          </div>

          <div className="mt-5 flex flex-wrap gap-3">
            {filterOptions.map((option) => {
              const isActive = activeFilter === option;

              return (
                <button
                  key={option}
                  type="button"
                  onClick={() => setActiveFilter(option)}
                  className={`rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
                    isActive
                      ? "bg-slate-900 text-white"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  {option}
                </button>
              );
            })}
          </div>

          {error && (
            <div className="mt-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}

          {isLoading ? (
            <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 px-6 py-16 text-center text-sm text-slate-500">
              Loading submitted events...
            </div>
          ) : (
            <div className="mt-6 grid gap-5 xl:grid-cols-2">
              {filteredEvents.map((event) => {
                const isFeedbackOpen = feedbackEventId === event._id;

                return (
                  <article
                    key={event._id}
                    onClick={() => router.push(`/admin/event/${event._id}`)}
                    className="cursor-pointer rounded-2xl border border-slate-200 bg-slate-50/70 p-5 shadow-sm shadow-slate-200/40 transition-all hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-md"
                  >
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <span
                          className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${statusClasses[event.status ?? "Pending"]}`}
                        >
                          {event.status ?? "Pending"}
                        </span>
                        <h3 className="mt-3 text-xl font-bold tracking-tight text-slate-900">
                          {event.title}
                        </h3>
                        <p className="mt-1 text-sm font-medium text-slate-500">
                          {getOrganizerLabel(event)}  -  {event.category || "Uncategorized"}
                        </p>
                      </div>
                    </div>

                    <div className="mt-5 grid gap-3 text-sm text-slate-600 sm:grid-cols-2">
                      <div className="flex items-center gap-2">
                        <BsCalendar3 size={14} className="text-slate-400" />
                        <span>{event.date || "Date pending"}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <FiClock size={14} className="text-slate-400" />
                        <span>{event.time || "Time pending"}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <FiMapPin size={14} className="text-slate-400" />
                        <span>{event.venue || "Venue pending"}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <FiUsers size={14} className="text-slate-400" />
                        <span>{event.maxAttendees ?? event.registrationCount ?? 0} expected attendees</span>
                      </div>
                    </div>

                    <div className="mt-5 rounded-2xl border border-slate-200 bg-white px-4 py-3">
                      <div className="flex flex-wrap items-center justify-between gap-2 text-sm">
                        <p className="font-semibold text-slate-800">
                          Submitted by {event.createdBy?.name || "Faculty member"}
                        </p>
                        <span className="text-slate-400">{formatCreatedAt(event.createdAt)}</span>
                      </div>
                      <p className="mt-2 text-sm text-slate-500">
                        {event.reviewNote || "Waiting for admin review."}
                      </p>
                    </div>

                    <div
                      className="mt-5 flex flex-wrap items-center gap-3"
                      onClick={(e) => e.stopPropagation()}
                    >
                      {event.status !== "Approved" && (
                        <button
                          type="button"
                          onClick={() => applyStatus(event._id, "Approved")}
                          className="rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-slate-800"
                        >
                          Approve Event
                        </button>
                      )}
                      {event.status !== "Approved" && (
                        <button
                          type="button"
                          onClick={() => {
                            setFeedbackEventId(event._id);
                            setFeedbackStatus("Needs Changes");
                          }}
                          className="rounded-xl border border-blue-200 bg-blue-50 px-4 py-2.5 text-sm font-semibold text-blue-600 transition-colors hover:bg-blue-100"
                        >
                          Needs Changes
                        </button>
                      )}
                      {event.status !== "Approved" && (
                        <button
                          type="button"
                          onClick={() => {
                            setFeedbackEventId(event._id);
                            setFeedbackStatus("Rejected");
                          }}
                          className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-2.5 text-sm font-semibold text-rose-600 transition-colors hover:bg-rose-100"
                        >
                          Reject
                        </button>
                      )}
                      {event.status === "Approved" && (
                        <span className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-50 px-4 py-2.5 text-sm font-semibold text-emerald-700">
                          <BsCheckCircle size={14} />
                          Approved
                        </span>
                      )}
                    </div>

                    {isFeedbackOpen ? (
                      <div
                        className="mt-4 rounded-2xl border border-slate-200 bg-white p-4"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Input
                          id={`review-note-${event._id}`}
                          label={feedbackStatus === "Rejected" ? "Reject Reason" : "Change Request"}
                          placeholder={
                            feedbackStatus === "Rejected"
                              ? "Write why this event is being rejected"
                              : "Write the changes the faculty team should make"
                          }
                          value={feedbackNotes[event._id] ?? ""}
                          onChange={(e) =>
                            setFeedbackNotes((current) => ({
                              ...current,
                              [event._id]: e.target.value,
                            }))
                          }
                        />
                        <div className="mt-3 flex items-center gap-3">
                          <button
                            type="button"
                            onClick={() => submitFeedback(event._id)}
                            className="rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-slate-800"
                          >
                            Confirm
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setFeedbackEventId(null);
                              setFeedbackStatus(null);
                            }}
                            className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-100"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : null}
                  </article>
                );
              })}
            </div>
          )}

          {!isLoading && filteredEvents.length === 0 ? (
            <div className="mt-6 rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-6 py-10 text-center">
              <p className="text-lg font-semibold text-slate-700">
                No events match your review filters.
              </p>
              <p className="mt-2 text-sm text-slate-500">
                Try a different keyword or switch the active review status.
              </p>
            </div>
          ) : null}
        </section>
      </div>
    </div>
  );
}
