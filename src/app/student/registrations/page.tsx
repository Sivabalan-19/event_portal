"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { BsSearch } from "react-icons/bs";
import { FiCompass } from "react-icons/fi";

import { Input, RegistrationCard } from "@/components";
import SectionTitle from "@/components/sectionTitle";
import { fetchData, patchData } from "@/utils/axios";

type RegistrationTab = "upcoming" | "past" | "waitlisted";

type Speaker = {
  _id: string;
  name: string;
};

type EventRecord = {
  _id: string;
  title: string;
  date?: string;
  time?: string;
  venue?: string;
  speakers?: Speaker[];
  coverImageUrl?: string;
};

type RegistrationFeedback = {
  rating: number;
  comment?: string;
  submittedAt?: string;
};

type RegistrationItem = {
  _id: string;
  status: "registered" | "waitlisted" | "attended" | "cancelled";
  waitlistPosition?: number;
  tab: RegistrationTab;
  createdAt: string;
  feedback?: RegistrationFeedback;
  event: EventRecord;
};

const registrationTabs: Array<{ key: RegistrationTab; label: string }> = [
  { key: "upcoming", label: "Upcoming" },
  { key: "past", label: "Past" },
  { key: "waitlisted", label: "Waitlisted" },
];

const FALLBACK_EVENT_IMAGE =
  "https://placehold.co/600x360/e2e8f0/0f172a?text=Campus+Event";

function buildReference(id: string) {
  return `RE-${id.slice(-6).toUpperCase()}`;
}

function formatRegistrationStatus(status: RegistrationItem["status"]) {
  return status === "waitlisted" ? "waitlisted" : "registered";
}

export default function StudentRegistrationsPage() {
  const [activeTab, setActiveTab] = useState<RegistrationTab>("upcoming");
  const [searchTerm, setSearchTerm] = useState("");
  const [registrations, setRegistrations] = useState<RegistrationItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [feedbackForm, setFeedbackForm] = useState<{ rating: number; comment: string }>({
    rating: 5,
    comment: "",
  });
  const [activeFeedbackRegistrationId, setActiveFeedbackRegistrationId] = useState<string | null>(null);
  const [submittingFeedbackId, setSubmittingFeedbackId] = useState<string | null>(null);

  useEffect(() => {
    const loadRegistrations = async () => {
      try {
        setIsLoading(true);
        const response = await fetchData<{ registrations: RegistrationItem[] }>(
          "/registrations/mine",
        );
        setRegistrations(response.registrations ?? []);
        setError(null);
      } catch (err) {
        const message =
          err instanceof Error
            ? err.message
            : "Failed to load your registrations";
        setError(message);
      } finally {
        setIsLoading(false);
      }
    };

    loadRegistrations();
  }, []);

  const tabCounts = useMemo(() => {
    return registrationTabs.reduce(
      (accumulator, tab) => {
        accumulator[tab.key] = registrations.filter(
          (item) => item.tab === tab.key,
        ).length;
        return accumulator;
      },
      {
        upcoming: 0,
        past: 0,
        waitlisted: 0,
      } as Record<RegistrationTab, number>,
    );
  }, [registrations]);

  const filteredRegistrations = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();

    return registrations.filter((item) => {
      const matchesTab = item.tab === activeTab;
      const matchesSearch =
        normalizedSearch.length === 0 ||
        item.event.title.toLowerCase().includes(normalizedSearch) ||
        (item.event.venue || "").toLowerCase().includes(normalizedSearch) ||
        buildReference(item._id).toLowerCase().includes(normalizedSearch);

      return matchesTab && matchesSearch;
    });
  }, [activeTab, registrations, searchTerm]);

  const openFeedbackForm = (registration: RegistrationItem) => {
    setActiveFeedbackRegistrationId(registration._id);
    setFeedbackForm({
      rating: registration.feedback?.rating ?? 5,
      comment: registration.feedback?.comment ?? "",
    });
    setError(null);
  };

  const submitFeedback = async (registrationId: string) => {
    try {
      setSubmittingFeedbackId(registrationId);
      const response = await patchData<
        { registrationId: string; feedback: RegistrationFeedback },
        { rating: number; comment: string }
      >(`/registrations/${registrationId}/feedback`, {
        rating: feedbackForm.rating,
        comment: feedbackForm.comment,
      });

      setRegistrations((current) =>
        current.map((registration) =>
          registration._id === response.registrationId
            ? { ...registration, feedback: response.feedback }
            : registration,
        ),
      );
      setActiveFeedbackRegistrationId(null);
      setError(null);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to submit feedback";
      setError(message);
    } finally {
      setSubmittingFeedbackId(null);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 px-6 py-8 font-sans">
      <div className="space-y-7">
        <div className="flex flex-col gap-5 xl:flex-row xl:items-start xl:justify-between">
          <SectionTitle
            title="My Registrations"
            description="Track the campus events you have joined or requested to join."
          />

          <div className="flex w-full flex-col gap-3 sm:flex-row xl:w-auto">
            <div className="min-w-0 flex-1 sm:min-w-[320px] xl:w-[320px]">
              <Input
                id="registration-search"
                label=""
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search events..."
                icon={<BsSearch size={14} className="text-slate-400" />}
              />
            </div>
            <Link
              href="/student/events"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3.5 text-sm font-semibold text-white shadow-sm shadow-blue-200 transition-colors hover:bg-blue-700"
            >
              Find New Events
            </Link>
          </div>
        </div>

        <div className="border-b border-slate-200">
          <div className="flex flex-wrap gap-7">
            {registrationTabs.map((tab) => {
              const isActive = activeTab === tab.key;

              return (
                <button
                  key={tab.key}
                  type="button"
                  onClick={() => setActiveTab(tab.key)}
                  className={`-mb-px border-b-2 px-1 pb-3 text-sm font-semibold transition-colors ${
                    isActive
                      ? "border-blue-500 text-blue-600"
                      : "border-transparent text-slate-400 hover:text-slate-600"
                  }`}
                >
                  {tab.label} ({tabCounts[tab.key]})
                </button>
              );
            })}
          </div>
        </div>

        {error && (
          <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {isLoading ? (
          <div className="rounded-2xl border border-slate-200 bg-white px-6 py-16 text-center text-sm text-slate-500 shadow-sm shadow-slate-200/40">
            Loading your registrations...
          </div>
        ) : filteredRegistrations.length > 0 ? (
          <div className="grid grid-cols-2 gap-5 2xl:grid-cols-2">
            {filteredRegistrations.map((registration) => (
              <div key={registration._id} className="space-y-3">
                <RegistrationCard
                  eventId={registration.event._id}
                  image={registration.event.coverImageUrl || FALLBACK_EVENT_IMAGE}
                  title={registration.event.title}
                  reference={buildReference(registration._id)}
                  date={registration.event.date || "Date to be announced"}
                  time={registration.event.time || "Time to be announced"}
                  location={registration.event.venue || "Venue to be announced"}
                  status={formatRegistrationStatus(registration.status)}
                  waitlistPosition={registration.waitlistPosition}
                  primaryActionLabel={
                    registration.tab === "past" ? "View Summary" : "View Event"
                  }
                  secondaryActionLabel={
                    registration.status === "waitlisted" ? "Cancel Request" : undefined
                  }
                />

                {registration.tab === "past" && registration.status !== "waitlisted" && (
                  <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm shadow-slate-200/40">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <p className="text-sm font-semibold text-slate-900">
                        Event Feedback
                      </p>
                      <button
                        type="button"
                        onClick={() => openFeedbackForm(registration)}
                        className="rounded-lg border border-blue-200 px-3 py-1.5 text-xs font-semibold text-blue-700 transition-colors hover:bg-blue-50"
                      >
                        {registration.feedback ? "Edit Feedback" : "Give Feedback"}
                      </button>
                    </div>

                    {registration.feedback && (
                      <p className="mt-2 text-xs text-slate-600">
                        Submitted {registration.feedback.rating}/5
                        {registration.feedback.comment
                          ? ` - ${registration.feedback.comment}`
                          : ""}
                      </p>
                    )}

                    {activeFeedbackRegistrationId === registration._id && (
                      <div className="mt-3 space-y-3">
                        <div>
                          <label className="mb-1 block text-xs font-semibold uppercase tracking-[0.15em] text-slate-500">
                            Rating
                          </label>
                          <select
                            value={feedbackForm.rating}
                            onChange={(e) =>
                              setFeedbackForm((current) => ({
                                ...current,
                                rating: Number(e.target.value),
                              }))
                            }
                            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-700 focus:border-blue-500 focus:outline-none"
                          >
                            {[5, 4, 3, 2, 1].map((rating) => (
                              <option key={rating} value={rating}>
                                {rating} / 5
                              </option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <label className="mb-1 block text-xs font-semibold uppercase tracking-[0.15em] text-slate-500">
                            Comment
                          </label>
                          <textarea
                            rows={3}
                            value={feedbackForm.comment}
                            onChange={(e) =>
                              setFeedbackForm((current) => ({
                                ...current,
                                comment: e.target.value,
                              }))
                            }
                            placeholder="Share your event experience"
                            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-700 focus:border-blue-500 focus:outline-none"
                          />
                        </div>
                        <div className="flex items-center justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => setActiveFeedbackRegistrationId(null)}
                            className="rounded-lg border border-slate-300 px-3 py-2 text-xs font-semibold text-slate-700 transition-colors hover:bg-slate-100"
                          >
                            Cancel
                          </button>
                          <button
                            type="button"
                            onClick={() => submitFeedback(registration._id)}
                            disabled={submittingFeedbackId === registration._id}
                            className="rounded-lg bg-blue-600 px-3 py-2 text-xs font-semibold text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                          >
                            {submittingFeedbackId === registration._id
                              ? "Saving..."
                              : "Submit Feedback"}
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}

            <div className="flex min-h-41 flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-slate-50/70 px-6 text-center">
              <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-full border border-slate-300 bg-white text-slate-500">
                <FiCompass size={18} />
              </div>
              <h3 className="text-2xl font-bold tracking-tight text-slate-800">
                Discover more events
              </h3>
              <p className="mt-2 max-w-sm text-sm text-slate-500">
                Browse active events and add more sessions to your calendar.
              </p>
            </div>
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center shadow-sm shadow-slate-200/40">
            <p className="text-lg font-bold text-slate-800">No registrations found</p>
            <p className="mt-2 text-sm text-slate-500">
              Register for an event to see it show up here.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
