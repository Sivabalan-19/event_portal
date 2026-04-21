"use client";

import type React from "react";
import { useEffect, useState } from "react";
import { Input } from "@/components";
import {
  FiArrowLeft,
  FiBell,
  FiCalendar,
  FiImage,
  FiInfo,
  FiLink,
  FiMapPin,
  FiMic,
  FiUsers,
  FiX,
} from "react-icons/fi";
import SectionTitle from "@/components/sectionTitle";
import { fetchData, createData } from "@/utils/axios";

type FormSectionProps = {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
};

const categories = [
  "Technical",
  "Workshop",
  "Cultural",
  "Seminar",
  "Networking",
];

type SpeakerOption = {
  _id: string;
  name: string;
};

function FormSection({ icon, title, children }: FormSectionProps) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white shadow-sm shadow-slate-200/60">
      <div className="flex items-center gap-2 border-b border-slate-100 px-5 py-4 text-sm font-semibold text-blue-600">
        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-blue-50 text-blue-600">
          {icon}
        </span>
        {title}
      </div>
      <div className="space-y-5 px-5 py-5">{children}</div>
    </section>
  );
}

export default function CreateEventPage() {
  const [speakerOptions, setSpeakerOptions] = useState<SpeakerOption[]>([]);
  const [form, setForm] = useState({
    eventName: "",
    category: "",
    maxAttendees: "500",
    description: "",
    date: "",
    time: "",
    venue: "",
    registrationOpenDate: "",
    registrationOpenTime: "",
    registrationCloseDate: "",
    registrationCloseTime: "",
    mode: "offline" as "online" | "offline" | "hybrid",
  });
  const [selectedSpeakers, setSelectedSpeakers] = useState<string[]>([]);
  const [speakerSearch, setSpeakerSearch] = useState("");
  const [coverImageUrl, setCoverImageUrl] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const filteredSpeakerOptions = speakerOptions.filter((speaker) =>
    speaker.name.toLowerCase().includes(speakerSearch.trim().toLowerCase()),
  );

  const updateForm = (field: keyof typeof form, value: string) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const buildDateTime = (date: string, time: string) => {
    if (!date || !time) {
      return "";
    }

    const combined = new Date(`${date}T${time}`);
    return Number.isNaN(combined.getTime()) ? "" : combined.toISOString();
  };

  const addSpeaker = (speakerId: string) => {
    if (!speakerId || selectedSpeakers.includes(speakerId)) {
      return;
    }

    setSelectedSpeakers((current) => [...current, speakerId]);
    setSpeakerSearch("");
  };

  const removeSpeaker = (speakerId: string) => {
    setSelectedSpeakers((current) =>
      current.filter((currentSpeaker) => currentSpeaker !== speakerId),
    );
  };

  const toggleSpeaker = (speakerId: string) => {
    if (selectedSpeakers.includes(speakerId)) {
      removeSpeaker(speakerId);
      return;
    }

    addSpeaker(speakerId);
  };

  useEffect(() => {
    const fetchSpeakers = async () => {
      try {
        const data = await fetchData<{ speakers: SpeakerOption[] }>(
          "/speakers",
        );
        setSpeakerOptions(data.speakers ?? []);
      } catch (error) {
        console.error("Failed to load speakers", error);
      }
    };

    fetchSpeakers();
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!form.eventName.trim()) {
      setError("Event name is required");
      return;
    }

    try {
      setSubmitting(true);

      await createData<
        { message: string },
        {
          title: string;
          category: string;
          maxAttendees: string;
          description: string;
          date: string;
          time: string;
          venue: string;
          registrationOpenAt?: string;
          registrationCloseAt?: string;
          mode: "online" | "offline" | "hybrid";
          speakers: string[];
          coverImageUrl: string;
        }
      >("/events/create", {
        title: form.eventName,
        category: form.category,
        maxAttendees: form.maxAttendees,
        description: form.description,
        date: form.date,
        time: form.time,
        venue: form.venue,
        registrationOpenAt:
          buildDateTime(form.registrationOpenDate, form.registrationOpenTime) ||
          undefined,
        registrationCloseAt:
          buildDateTime(
            form.registrationCloseDate,
            form.registrationCloseTime,
          ) || undefined,
        mode: form.mode,
        speakers: selectedSpeakers,
        coverImageUrl,
      });

      setSuccess("Event created successfully and sent for review");
      setForm({
        eventName: "",
        category: "",
        maxAttendees: "500",
        description: "",
        date: "",
        time: "",
        venue: "",
        registrationOpenDate: "",
        registrationOpenTime: "",
        registrationCloseDate: "",
        registrationCloseTime: "",
        mode: "offline",
      });
      setSelectedSpeakers([]);
      setSpeakerSearch("");
      setCoverImageUrl("");
    } catch (err: any) {
      const message =
        err?.response?.data?.error || err?.message || "Failed to create event";
      setError(message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 px-6 py-5 font-sans text-slate-900">
      <div className="mx-auto max-w-5xl mt-6 space-y-6">
        <div>
          <SectionTitle
            title="Event Creation"
            description="Fill in the information below to showcase your event to the campus community."
          />
        </div>

        {error && (
          <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {success && (
          <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
            {success}
          </div>
        )}

        <form className="space-y-5" onSubmit={handleSubmit}>
          <FormSection icon={<FiInfo size={14} />} title="General Information">
            <Input
              id="event-name"
              label="Event Name"
              value={form.eventName}
              onChange={(e) => updateForm("eventName", e.target.value)}
              placeholder="e.g. Annual Tech Symposium 2024"
            />

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <label
                  htmlFor="event-category"
                  className="block text-sm font-semibold text-slate-700"
                >
                  Category
                </label>
                <div className="relative">
                  <select
                    id="event-category"
                    value={form.category}
                    onChange={(e) => updateForm("category", e.target.value)}
                    className="w-full appearance-none rounded-lg border border-slate-200 bg-white px-4 py-3.5 text-sm text-slate-900 outline-none transition-all"
                  >
                    <option value="">Select Category</option>
                    {categories.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                  <span className="pointer-events-none absolute inset-y-0 right-4 flex items-center text-slate-400">
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 20 20"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M5 7.5L10 12.5L15 7.5"
                        stroke="currentColor"
                        strokeWidth="1.8"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </span>
                </div>
              </div>

              <Input
                id="max-attendees"
                label="Maximum Attendees"
                type="number"
                value={form.maxAttendees}
                onChange={(e) => updateForm("maxAttendees", e.target.value)}
                placeholder="500"
              />
            </div>

            <div className="space-y-2">
              <label
                htmlFor="event-mode"
                className="block text-sm font-semibold text-slate-700"
              >
                Event Mode
              </label>
              <div className="relative">
                <select
                  id="event-mode"
                  value={form.mode}
                  onChange={(e) =>
                    updateForm(
                      "mode",
                      e.target.value as "online" | "offline" | "hybrid",
                    )
                  }
                  className="w-full appearance-none rounded-lg border border-slate-200 bg-white px-4 py-3.5 text-sm text-slate-900 outline-none transition-all"
                >
                  <option value="offline">Offline (On-campus)</option>
                  <option value="online">Online</option>
                  <option value="hybrid">Hybrid</option>
                </select>
                <span className="pointer-events-none absolute inset-y-0 right-4 flex items-center text-slate-400">
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 20 20"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M5 7.5L10 12.5L15 7.5"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>
              </div>
            </div>

            <div className="space-y-2">
              <label
                htmlFor="event-description"
                className="block text-sm font-semibold text-slate-700"
              >
                Description
              </label>
              <textarea
                id="event-description"
                value={form.description}
                onChange={(e) => updateForm("description", e.target.value)}
                placeholder="Describe the event agenda, highlights, and what students should expect..."
                className="min-h-32 w-full resize-none rounded-lg border border-slate-200 bg-white px-4 py-3.5 text-sm text-slate-900 outline-none transition-all placeholder:text-slate-400"
              />
            </div>
          </FormSection>

          <FormSection
            icon={<FiCalendar size={14} />}
            title="Date, Time & Venue"
          >
            <div className="grid gap-4 md:grid-cols-2">
              <Input
                id="event-date"
                label="Date"
                type="date"
                value={form.date}
                onChange={(e) => updateForm("date", e.target.value)}
                placeholder="mm/dd/yyyy"
              />

              <Input
                id="event-time"
                label="Time"
                type="time"
                value={form.time}
                onChange={(e) => updateForm("time", e.target.value)}
                placeholder="--:-- --"
              />
            </div>

            <Input
              id="event-venue"
              label="Venue / Room Number"
              value={form.venue}
              onChange={(e) => updateForm("venue", e.target.value)}
              placeholder="Main Auditorium, Building A"
              icon={<FiMapPin size={18} className="text-slate-400" />}
            />
          </FormSection>

          <FormSection icon={<FiBell size={14} />} title="Registration Window">
            <div className="grid gap-4 md:grid-cols-2">
              <Input
                id="registration-open-date"
                label="Registration Opens (Date)"
                type="date"
                value={form.registrationOpenDate}
                placeholder="mm/dd/yyyy"
                onChange={(e) =>
                  updateForm("registrationOpenDate", e.target.value)
                }
              />
              <Input
                id="registration-open-time"
                placeholder="09:00 PM"
                label="Registration Opens (Time)"
                type="time"
                value={form.registrationOpenTime}
                onChange={(e) =>
                  updateForm("registrationOpenTime", e.target.value)
                }
              />
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <Input
                placeholder="mm/dd/yyyy"
                id="registration-close-date"
                label="Registration Closes (Date)"
                type="date"
                value={form.registrationCloseDate}
                onChange={(e) =>
                  updateForm("registrationCloseDate", e.target.value)
                }
              />
              <Input
                id="registration-close-time"
                label="Registration Closes (Time)"
                placeholder="09:00 PM"
                type="time"
                value={form.registrationCloseTime}
                onChange={(e) =>
                  updateForm("registrationCloseTime", e.target.value)
                }
              />
            </div>
            <p className="text-xs text-slate-500">
              Students can register only during this window. Leave all fields
              empty to keep registration always open.
            </p>
          </FormSection>

          <FormSection icon={<FiMic size={14} />} title="Speakers & Media">
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-slate-700">
                Select Guest Speaker(s)
              </label>
              <div className="flex flex-wrap gap-2">
                {selectedSpeakers.map((speakerId) => {
                  const speaker = speakerOptions.find(
                    (s) => s._id === speakerId,
                  );
                  if (!speaker) return null;

                  return (
                    <span
                      key={speaker._id}
                      className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-3 py-1.5 text-xs font-semibold text-blue-700"
                    >
                      {speaker.name}
                      <button
                        type="button"
                        onClick={() => removeSpeaker(speaker._id)}
                        className="text-blue-500 transition-colors hover:text-blue-700"
                        aria-label={`Remove ${speaker.name}`}
                      >
                        <FiX size={12} />
                      </button>
                    </span>
                  );
                })}
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-[1fr_200px]">
              <Input
                id="speaker-search"
                label=""
                value={speakerSearch}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setSpeakerSearch(e.target.value)
                }
                placeholder="Search speakers from database..."
                icon={<FiUsers size={18} className="text-slate-400" />}
              />

              <div className="space-y-1">
                <label className="block text-xs font-medium text-slate-500">
                  Select Speakers
                </label>
                <div className="max-h-40 space-y-1 overflow-y-auto rounded-lg border border-slate-200 bg-white px-2 py-2 text-xs">
                  {filteredSpeakerOptions.length === 0 && (
                    <div className="py-1 text-slate-400">
                      {speakerSearch
                        ? "No speakers match your search."
                        : "No speakers available."}
                    </div>
                  )}
                  {filteredSpeakerOptions.map((speaker) => (
                    <button
                      key={speaker._id}
                      type="button"
                      onClick={() => toggleSpeaker(speaker._id)}
                      className="flex w-full items-center gap-2 rounded-md px-2 py-1 text-left text-slate-700 hover:bg-blue-50"
                      aria-pressed={selectedSpeakers.includes(speaker._id)}
                    >
                      <input
                        type="checkbox"
                        checked={selectedSpeakers.includes(speaker._id)}
                        onChange={() => toggleSpeaker(speaker._id)}
                        className="h-3.5 w-3.5 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                        aria-label={`Select ${speaker.name}`}
                      />
                      <span className="flex-1 truncate">{speaker.name}</span>
                      {selectedSpeakers.includes(speaker._id) && (
                        <span className="text-[10px] font-semibold uppercase text-blue-500">
                          Selected
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-semibold text-slate-700">
                Cover Image URL
              </label>
              <div className="space-y-3">
                <Input
                  id="cover-image-url"
                  label=""
                  type="url"
                  value={coverImageUrl}
                  onChange={(e) => setCoverImageUrl(e.target.value)}
                  placeholder="https://example.com/event-banner.jpg"
                  icon={<FiLink size={18} className="text-slate-400" />}
                />
                {coverImageUrl && (
                  <div className="overflow-hidden rounded-xl border border-slate-200">
                    <img
                      src={coverImageUrl}
                      alt="Cover preview"
                      className="h-48 w-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = "none";
                      }}
                    />
                  </div>
                )}
                {!coverImageUrl && (
                  <div className="flex min-h-28 w-full flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-slate-50 text-center">
                    <FiImage size={22} className="mb-2 text-slate-300" />
                    <span className="text-xs text-slate-400">
                      Image preview will appear here
                    </span>
                  </div>
                )}
              </div>
            </div>
          </FormSection>

          <div className="flex flex-wrap items-center justify-end gap-3 pt-2">
            <button
              type="submit"
              disabled={submitting}
              className="rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-sm shadow-blue-200 transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {submitting ? "Launching..." : "Launch Event"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
