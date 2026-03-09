"use client";

import type React from "react";
import { useEffect, useRef, useState } from "react";
import { Input } from "@/components";
import {
  FiArrowLeft,
  FiBell,
  FiCalendar,
  FiImage,
  FiInfo,
  FiMapPin,
  FiMic,
  FiUploadCloud,
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
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [speakerOptions, setSpeakerOptions] = useState<SpeakerOption[]>([]);
  const [form, setForm] = useState({
    eventName: "",
    category: "",
    maxAttendees: "500",
    description: "",
    date: "",
    time: "",
    venue: "",
    mode: "offline" as "online" | "offline" | "hybrid",
  });
  const [selectedSpeakers, setSelectedSpeakers] = useState<string[]>([]);
  const [speakerSearch, setSpeakerSearch] = useState("");
  const [coverImageName, setCoverImageName] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const availableSpeakers = speakerOptions.filter(
    (speaker) => !selectedSpeakers.includes(speaker._id),
  );
  const filteredSpeakerOptions = availableSpeakers.filter((speaker) =>
    speaker.name.toLowerCase().includes(speakerSearch.trim().toLowerCase()),
  );

  const updateForm = (field: keyof typeof form, value: string) => {
    setForm((current) => ({ ...current, [field]: value }));
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

  useEffect(() => {
    const fetchSpeakers = async () => {
      try {
        const data = await fetchData<{ speakers: SpeakerOption[] }>("/speakers");
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
          mode: "online" | "offline" | "hybrid";
          speakers: string[];
          coverImageName: string;
        }
      >("/events/create", {
        title: form.eventName,
        category: form.category,
        maxAttendees: form.maxAttendees,
        description: form.description,
        date: form.date,
        time: form.time,
        venue: form.venue,
        mode: form.mode,
        speakers: selectedSpeakers,
        coverImageName,
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
        mode: "offline",
      });
      setSelectedSpeakers([]);
      setSpeakerSearch("");
      setCoverImageName("");
    } catch (err: any) {
      const message =
        err?.response?.data?.error ||
        err?.message ||
        "Failed to create event";
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

          <FormSection icon={<FiMic size={14} />} title="Speakers & Media">
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-slate-700">
                Select Guest Speaker(s)
              </label>
              <div className="flex flex-wrap gap-2">
                {selectedSpeakers.map((speakerId) => {
                  const speaker = speakerOptions.find((s) => s._id === speakerId);
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
                  Available Speakers
                </label>
                <div className="max-h-40 space-y-1 overflow-y-auto rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs">
                  {filteredSpeakerOptions.length === 0 && (
                    <div className="py-1 text-slate-400">
                      {speakerSearch ? "No speakers match your search." : "No speakers available."}
                    </div>
                  )}
                  {filteredSpeakerOptions.map((speaker) => (
                    <button
                      key={speaker._id}
                      type="button"
                      onClick={() => addSpeaker(speaker._id)}
                      className="flex w-full items-center justify-between rounded-md px-2 py-1 text-left text-slate-700 hover:bg-blue-50"
                    >
                      <span className="truncate">{speaker.name}</span>
                      <span className="text-[10px] font-semibold uppercase text-blue-500">
                        Add
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-semibold text-slate-700">
                Cover Image
              </label>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const selectedFile = e.target.files?.[0];
                  setCoverImageName(selectedFile?.name ?? "");
                }}
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="flex min-h-52 w-full flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-6 py-8 text-center transition-colors hover:border-blue-300 hover:bg-blue-50/40"
              >
                <span className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-blue-100 text-blue-600">
                  {coverImageName ? (
                    <FiImage size={22} />
                  ) : (
                    <FiUploadCloud size={22} />
                  )}
                </span>
                <span className="text-sm font-semibold text-slate-700">
                  {coverImageName || "Click to upload or drag and drop"}
                </span>
                <span className="mt-1 text-xs text-slate-400">
                  Recommended size: 1200 x 630 PNG, JPG, Max 5MB
                </span>
              </button>
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
