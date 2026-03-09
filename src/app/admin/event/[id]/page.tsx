"use client";

import { useState } from "react";
import Link from "next/link";
import { notFound, useParams } from "next/navigation";
import { Input } from "@/components";
import SectionTitle from "@/components/sectionTitle";
import { eventReviews, statusClasses } from "../data";
import { BsCalendar3, BsPeopleFill, BsPersonCircle } from "react-icons/bs";
import { FiChevronLeft, FiClock, FiMapPin } from "react-icons/fi";

export default function AdminEventDetailsPage() {
  const params = useParams<{ id: string }>();
  const initialEvent = eventReviews.find((item) => item.id === Number(params.id));

  if (!initialEvent) {
    notFound();
  }

  const [event, setEvent] = useState(initialEvent);
  const [isRejecting, setIsRejecting] = useState(false);
  const [rejectReason, setRejectReason] = useState("");

  const approveEvent = () => {
    setEvent((current) => ({
      ...current,
      status: "Approved",
      note: "Approved by admin review team.",
    }));
    setIsRejecting(false);
  };

  const rejectEvent = () => {
    const trimmedReason = rejectReason.trim();
    if (!trimmedReason) {
      return;
    }

    setEvent((current) => ({
      ...current,
      status: "Rejected",
      note: trimmedReason,
    }));
    setIsRejecting(false);
  };

  const detailItems = [
    {
      icon: <BsCalendar3 size={18} className="text-blue-500" />,
      label: "DATE",
      primary: event.date,
      secondary: event.time,
    },
    {
      icon: <FiMapPin size={18} className="text-blue-500" />,
      label: "VENUE",
      primary: event.venue,
      secondary: event.capacityNote,
    },
    {
      icon: <BsPeopleFill size={18} className="text-blue-500" />,
      label: "CAPACITY",
      primary: `${event.expectedAttendees} Attendees`,
      secondary: "Managed through the admin review workflow",
    },
    {
      icon: <BsPersonCircle size={18} className="text-blue-500" />,
      label: "SUBMITTED BY",
      primary: event.submittedBy,
      secondary: event.organizer,
    },
  ];

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
              description="Inspect the full submission before approving or rejecting the request in the admin review queue."
            />
          </div>

          <span
            className={`inline-flex rounded-full px-4 py-2 text-sm font-semibold ${statusClasses[event.status]}`}
          >
            {event.status}
          </span>
        </div>

        <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm shadow-slate-200/70">
          <div className="relative h-72 w-full overflow-hidden bg-slate-200">
            <img
              src={event.image}
              alt={event.title}
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-linear-to-t from-slate-950/70 via-slate-900/10 to-transparent" />
            <div className="absolute bottom-6 left-6 right-6 flex flex-wrap items-end justify-between gap-4">
              <div>
                <span className="inline-flex rounded-full bg-white/15 px-3 py-1 text-xs font-bold uppercase tracking-[0.2em] text-white backdrop-blur-sm">
                  {event.category}
                </span>
                <h1 className="mt-3 text-3xl font-black tracking-tight text-white sm:text-4xl">
                  {event.title}
                </h1>
                <p className="mt-2 text-sm text-slate-200">
                  Submitted {event.submittedAt} by {event.organizer}
                </p>
              </div>
              <div className="rounded-2xl bg-white/10 px-4 py-3 text-sm text-white backdrop-blur-sm">
                <div className="flex items-center gap-2">
                  <FiClock size={14} />
                  <span>{event.time}</span>
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
                  {event.description}
                </p>
              </section>

              <section className="rounded-2xl border border-slate-200 bg-white p-5">
                <h2 className="text-xl font-bold tracking-tight text-slate-900">
                  Review Checklist
                </h2>
                <div className="mt-4 space-y-3">
                  {event.checklist.map((item) => (
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
                <p className="mt-3 text-sm leading-7 text-slate-600">{event.note}</p>
              </section>

              <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm shadow-slate-200/60">
                <h2 className="text-xl font-bold tracking-tight text-slate-900">
                  Review Actions
                </h2>
                <p className="mt-2 text-sm text-slate-500">
                  Approve the event directly or reject it with a clear reason for the faculty team.
                </p>

                <div className="mt-5 flex flex-wrap items-center gap-3">
                  <button
                    type="button"
                    onClick={approveEvent}
                    className="rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-slate-800"
                  >
                    Approve Event
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsRejecting(true)}
                    className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-2.5 text-sm font-semibold text-rose-600 transition-colors hover:bg-rose-100"
                  >
                    Reject
                  </button>
                </div>

                {isRejecting ? (
                  <div className="mt-4 rounded-2xl border border-rose-200 bg-rose-50/40 p-4">
                    <Input
                      id="admin-event-reject-reason"
                      label="Reject Reason"
                      placeholder="Write the reason for rejection"
                      value={rejectReason}
                      onChange={(e) => setRejectReason(e.target.value)}
                    />

                    <div className="mt-3 flex flex-wrap items-center gap-3">
                      <button
                        type="button"
                        onClick={rejectEvent}
                        className="rounded-xl bg-rose-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-rose-700"
                      >
                        Confirm Reject
                      </button>
                      <button
                        type="button"
                        onClick={() => setIsRejecting(false)}
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
