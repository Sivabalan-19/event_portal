"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Input } from "@/components";
import SectionTitle from "@/components/sectionTitle";
import { fetchData, patchData } from "@/utils/axios";
import { BsCalendar3, BsPeopleFill, BsPersonCircle } from "react-icons/bs";
import { FiChevronLeft, FiClock, FiMapPin } from "react-icons/fi";

type ReviewStatus = "Pending" | "Approved" | "Needs Changes" | "Rejected";

type Speaker = {
  _id: string;
  name: string;
  email?: string;
  expertise?: string;
  organization?: string;
  location?: string;
};

type AdminEventDetail = {
  _id: string;
  title: string;
  category?: string;
  date?: string;
  time?: string;
  venue?: string;
  maxAttendees?: number;
  status?: ReviewStatus;
  description?: string;
  reviewNote?: string;
  coverImageUrl?: string;
  registrationCount?: number;
  createdAt?: string;
  createdBy?: {
    name?: string;
    email?: string;
    department?: string;
    year?: string;
  };
  speakers?: Speaker[];
};

const statusClasses: Record<ReviewStatus, string> = {
  Pending: "bg-amber-100 text-amber-700",
  Approved: "bg-emerald-100 text-emerald-700",
  "Needs Changes": "bg-blue-100 text-blue-700",
  Rejected: "bg-rose-100 text-rose-700",
};

const FALLBACK_EVENT_IMAGE =
  "https://placehold.co/1200x720/e2e8f0/0f172a?text=Campus+Event";

function formatDate(date?: string) {
  if (!date) {
    return "Date pending";
  }

  const parsedDate = new Date(date);
  return Number.isNaN(parsedDate.getTime())
    ? date
    : parsedDate.toLocaleDateString("en-US", {
        month: "long",
        day: "2-digit",
        year: "numeric",
      });
}

function formatSubmittedAt(date?: string) {
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

function getChecklistItems(event: AdminEventDetail) {
  return [
    event.description
      ? "Submission includes an event description."
      : "Event description is still missing.",
    event.speakers?.length
      ? "At least one speaker has been assigned."
      : "No speakers are attached to this submission yet.",
    event.date && event.time
      ? "Schedule information is complete."
      : "Date or time information still needs attention.",
    event.venue
      ? "Venue information has been provided."
      : "Venue details are still pending.",
    event.reviewNote
      ? "An admin review note is attached to this submission."
      : "No admin review note has been added yet.",
  ];
}

export default function AdminEventDetailsPage() {
  const params = useParams<{ id: string }>();
  const [event, setEvent] = useState<AdminEventDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [feedbackStatus, setFeedbackStatus] = useState<"Needs Changes" | "Rejected" | null>(null);
  const [feedbackNote, setFeedbackNote] = useState("");

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
        const response = await fetchData<{ event: AdminEventDetail }>(
          `/events/admin/${eventId}`,
        );
        setEvent(response.event);
        setFeedbackNote(response.event.reviewNote || "");
        setError(null);
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Failed to load event details";
        setError(message);
      } finally {
        setIsLoading(false);
      }
    };

    loadEvent();
  }, [params?.id]);

  const detailItems = useMemo(() => {
    if (!event) {
      return [];
    }

    return [
      {
        icon: <BsCalendar3 size={18} className="text-blue-500" />,
        label: "DATE",
        primary: formatDate(event.date),
        secondary: event.time || "Time pending",
      },
      {
        icon: <FiMapPin size={18} className="text-blue-500" />,
        label: "VENUE",
        primary: event.venue || "Venue pending",
        secondary: `${event.registrationCount ?? 0} registrations so far`,
      },
      {
        icon: <BsPeopleFill size={18} className="text-blue-500" />,
        label: "CAPACITY",
        primary: `${event.maxAttendees ?? 0} Attendees`,
        secondary: "Managed through the admin review workflow",
      },
      {
        icon: <BsPersonCircle size={18} className="text-blue-500" />,
        label: "SUBMITTED BY",
        primary: event.createdBy?.name || "Faculty member",
        secondary:
          event.createdBy?.department || event.createdBy?.email || "Department unavailable",
      },
    ];
  }, [event]);

  const updateStatus = async (status: ReviewStatus, reviewNote?: string) => {
    if (!event) {
      return;
    }

    try {
      const response = await patchData<
        { event: AdminEventDetail },
        { status: ReviewStatus; reviewNote?: string }
      >(`/events/admin/${event._id}/status`, {
        status,
        reviewNote,
      });
      setEvent(response.event);
      setFeedbackStatus(null);
      setFeedbackNote(response.event.reviewNote || "");
      setError(null);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to update event status";
      setError(message);
    }
  };

  const confirmFeedback = async () => {
    const trimmedNote = feedbackNote.trim();

    if (!feedbackStatus || !trimmedNote) {
      return;
    }

    await updateStatus(feedbackStatus, trimmedNote);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 p-8 font-sans">
        <div className="rounded-2xl border border-slate-200 bg-white px-6 py-16 text-center shadow-sm shadow-slate-200/40">
          <p className="text-lg font-bold text-slate-800">Loading event</p>
          <p className="mt-2 text-sm text-slate-500">
            Fetching the event submission from the admin API.
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
            href="/admin/event"
            className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 transition-colors hover:text-slate-900"
          >
            <FiChevronLeft size={16} />
            Back to Events Review
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
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="space-y-4">
            <Link
              href="/admin/event"
              className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 transition-colors hover:text-slate-900"
            >
              <FiChevronLeft size={16} />
              Back to Events Review
            </Link>
            <SectionTitle
              title="Event Details Review"
              description="Inspect the full submission before approving or returning the request in the admin review queue."
            />
          </div>

          <span
            className={`inline-flex rounded-full px-4 py-2 text-sm font-semibold ${statusClasses[event.status ?? "Pending"]}`}
          >
            {event.status ?? "Pending"}
          </span>
        </div>

        {error && (
          <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm shadow-slate-200/70">
          <div className="relative h-72 w-full overflow-hidden bg-slate-200">
            <img
              src={event?.coverImageUrl || FALLBACK_EVENT_IMAGE}
              alt={event.title}
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-linear-to-t from-slate-950/70 via-slate-900/10 to-transparent" />
            <div className="absolute bottom-6 left-6 right-6 flex flex-wrap items-end justify-between gap-4">
              <div>
                <span className="inline-flex rounded-full bg-white/15 px-3 py-1 text-xs font-bold uppercase tracking-[0.2em] text-white backdrop-blur-sm">
                  {event.category || "Event"}
                </span>
                <h1 className="mt-3 text-3xl font-black tracking-tight text-white sm:text-4xl">
                  {event.title}
                </h1>
                <p className="mt-2 text-sm text-slate-200">
                  Submitted {formatSubmittedAt(event.createdAt)} by {event.createdBy?.department || event.createdBy?.name || "Faculty member"}
                </p>
              </div>
              <div className="rounded-2xl bg-white/10 px-4 py-3 text-sm text-white backdrop-blur-sm">
                <div className="flex items-center gap-2">
                  <FiClock size={14} />
                  <span>{event.time || "Time pending"}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="grid gap-8 px-6 py-6 xl:grid-cols-[1.5fr_0.9fr]">
            <div className="space-y-8">
              <section className="rounded-2xl border border-slate-200 bg-slate-50/70 p-5">
                <h2 className="text-xl font-bold tracking-tight text-slate-900">
                  Submission Overview
                </h2>
                <p className="mt-3 text-sm leading-7 text-slate-600">
                  {event.description || "No description has been provided for this event yet."}
                </p>
              </section>

              <section className="rounded-2xl border border-slate-200 bg-white p-5">
                <h2 className="text-xl font-bold tracking-tight text-slate-900">
                  Review Checklist
                </h2>
                <div className="mt-4 space-y-3">
                  {getChecklistItems(event).map((item) => (
                    <div
                      key={item}
                      className="flex items-start gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3"
                    >
                      <span className="mt-1 h-2.5 w-2.5 rounded-full bg-blue-500" />
                      <p className="text-sm text-slate-600">{item}</p>
                    </div>
                  ))}
                </div>
              </section>
            </div>

            <div className="space-y-6">
              <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm shadow-slate-200/60">
                <h2 className="text-xl font-bold tracking-tight text-slate-900">
                  Event Snapshot
                </h2>
                <div className="mt-5 grid gap-5 sm:grid-cols-2 xl:grid-cols-1">
                  {detailItems.map((item) => (
                    <div key={item.label} className="flex items-start gap-3">
                      <div className="mt-0.5 flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50">
                        {item.icon}
                      </div>
                      <div>
                        <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-slate-400">
                          {item.label}
                        </p>
                        <p className="mt-1 text-sm font-semibold text-slate-900">
                          {item.primary}
                        </p>
                        <p className="mt-1 text-xs text-slate-500">{item.secondary}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm shadow-slate-200/60">
                <h2 className="text-xl font-bold tracking-tight text-slate-900">
                  Admin Note
                </h2>
                <p className="mt-3 text-sm leading-7 text-slate-600">
                  {event.reviewNote || "No admin note has been added yet."}
                </p>
              </section>

              <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm shadow-slate-200/60">
                <h2 className="text-xl font-bold tracking-tight text-slate-900">
                  Review Actions
                </h2>
                <p className="mt-2 text-sm text-slate-500">
                  Approve the event directly or send back clear review guidance for the faculty team.
                </p>

                <div className="mt-5 flex flex-wrap items-center gap-3">
                  <button
                    type="button"
                    onClick={() => updateStatus("Approved")}
                    className="rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-slate-800"
                  >
                    Approve Event
                  </button>
                  <button
                    type="button"
                    onClick={() => setFeedbackStatus("Needs Changes")}
                    className="rounded-xl border border-blue-200 bg-blue-50 px-4 py-2.5 text-sm font-semibold text-blue-600 transition-colors hover:bg-blue-100"
                  >
                    Needs Changes
                  </button>
                  <button
                    type="button"
                    onClick={() => setFeedbackStatus("Rejected")}
                    className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-2.5 text-sm font-semibold text-rose-600 transition-colors hover:bg-rose-100"
                  >
                    Reject
                  </button>
                </div>

                {feedbackStatus ? (
                  <div className="mt-4 rounded-2xl border border-slate-200 bg-slate-50/40 p-4">
                    <Input
                      id="admin-event-feedback"
                      label={feedbackStatus === "Rejected" ? "Reject Reason" : "Change Request"}
                      placeholder={
                        feedbackStatus === "Rejected"
                          ? "Write the reason for rejection"
                          : "Describe the changes the faculty team needs to make"
                      }
                      value={feedbackNote}
                      onChange={(e) => setFeedbackNote(e.target.value)}
                    />

                    <div className="mt-3 flex flex-wrap items-center gap-3">
                      <button
                        type="button"
                        onClick={confirmFeedback}
                        className="rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-slate-800"
                      >
                        Confirm
                      </button>
                      <button
                        type="button"
                        onClick={() => setFeedbackStatus(null)}
                        className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-100"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : null}
              </section>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
