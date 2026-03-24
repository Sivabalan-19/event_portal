"use client";

import { useEffect, useMemo, useState } from "react";
import { BsPatchCheck, BsPeople, BsPersonExclamation } from "react-icons/bs";
import {
  FiArrowUpRight,
  FiMail,
  FiMapPin,
  FiUserCheck,
} from "react-icons/fi";

import SectionTitle from "@/components/sectionTitle";
import { fetchData, patchData } from "@/utils/axios";

type SpeakerStatus = "pending" | "accepted" | "rejected";

type Speaker = {
  _id: string;
  name: string;
  expertise?: string;
  organization?: string;
  location?: string;
  email?: string;
  status: SpeakerStatus;
};

export default function AdminSpeakerPage() {
  const [speakers, setSpeakers] = useState<Speaker[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSpeakers = async () => {
      try {
        setLoading(true);
        const response = await fetchData<{ speakers: Speaker[] }>("/speakers/admin");
        setSpeakers(response.speakers ?? []);
        setError(null);
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Failed to load speakers";
        setError(message);
      } finally {
        setLoading(false);
      }
    };

    fetchSpeakers();
  }, []);

  const handleUpdateStatus = async (id: string, status: SpeakerStatus) => {
    try {
      setUpdatingId(id);
      const response = await patchData<{ speaker: Speaker }, { status: SpeakerStatus }>(
        `/speakers/${id}/status`,
        { status },
      );
      setSpeakers((current) =>
        current.map((speaker) =>
          speaker._id === id ? { ...speaker, ...response.speaker } : speaker,
        ),
      );
      setError(null);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to update speaker status";
      setError(message);
    } finally {
      setUpdatingId(null);
    }
  };

  const stats = useMemo(() => {
    const total = speakers.length;
    const accepted = speakers.filter((speaker) => speaker.status === "accepted").length;
    const pending = speakers.filter((speaker) => speaker.status === "pending").length;
    const rejected = speakers.filter((speaker) => speaker.status === "rejected").length;

    return [
      {
        label: "Total Speakers",
        value: total,
        note: "All profiles in the portal",
        icon: <BsPeople size={18} className="text-blue-600" />,
        iconBg: "bg-blue-50",
        noteClass: "text-slate-400",
      },
      {
        label: "Approved Speakers",
        value: accepted,
        note: "Ready for event assignment",
        icon: <BsPatchCheck size={18} className="text-emerald-600" />,
        iconBg: "bg-emerald-50",
        noteClass: "text-emerald-500",
      },
      {
        label: "Speakers Waiting",
        value: pending,
        note: "Pending admin review",
        icon: <BsPersonExclamation size={18} className="text-amber-600" />,
        iconBg: "bg-amber-50",
        noteClass: "text-amber-500",
      },
      {
        label: "Rejected Speakers",
        value: rejected,
        note: "Declined by admin",
        icon: <BsPersonExclamation size={18} className="text-red-600" />,
        iconBg: "bg-red-50",
        noteClass: "text-red-500",
      },
    ];
  }, [speakers]);

  const pendingSpeakers = speakers.filter((speaker) => speaker.status === "pending");
  const rejectedSpeakers = speakers.filter((speaker) => speaker.status === "rejected");

  return (
    <div className="min-h-screen w-full bg-slate-50 p-8 font-sans">
      <div className="w-full space-y-8">
        <SectionTitle
          title="Speakers"
          description="Review speaker profiles, monitor verification progress, and approve experts before they appear across the event portal."
        />

        <div className="flex w-full flex-row gap-5">
          {stats.map((stat) => (
            <article
              key={stat.label}
              className="w-full rounded-2xl border border-slate-200 bg-white px-6 py-5 shadow-sm shadow-slate-200/60"
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

        {error && (
          <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        <section className="rounded-2xl border border-slate-200 bg-white shadow-sm shadow-slate-200/70">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 px-6 py-5">
            <div>
              <h2 className="text-2xl font-bold tracking-tight text-slate-900">
                Pending Speakers
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                Profiles waiting for admin approval before they can be attached to events.
              </p>
            </div>
            <span className="inline-flex rounded-full bg-amber-50 px-3 py-1.5 text-xs font-semibold text-amber-700">
              {pendingSpeakers.length} Pending Reviews
            </span>
          </div>

          <div className="grid gap-5 p-6 md:grid-cols-2 xl:grid-cols-3">
            {pendingSpeakers.map((speaker) => (
              <article
                key={speaker._id}
                className="rounded-2xl border border-slate-200 bg-slate-50/60 p-5 shadow-sm shadow-slate-200/40"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white text-sm font-black text-slate-700 shadow-sm shadow-slate-200/60">
                      {speaker.name
                        .split(" ")
                        .map((part) => part[0])
                        .slice(0, 2)
                        .join("")}
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-slate-900">
                        {speaker.name}
                      </h3>
                      <p className="text-sm font-medium text-slate-500">
                        {speaker.expertise || "Expertise pending"}
                      </p>
                    </div>
                  </div>
                  <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-700">
                    Waiting
                  </span>
                </div>

                <div className="mt-5 space-y-3 text-sm text-slate-600">
                  <div className="flex items-center gap-2">
                    <FiUserCheck size={14} className="text-slate-400" />
                    <span>{speaker.organization || "Organization not provided"}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FiMapPin size={14} className="text-slate-400" />
                    <span>{speaker.location || "Location not provided"}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FiMail size={14} className="text-slate-400" />
                    <span>{speaker.email || "Email not provided"}</span>
                  </div>
                </div>

                <div className="mt-6 flex items-center justify-between gap-3">
                  
                  <div className="flex gap-2">
                    <button
                      type="button"
                      disabled={updatingId === speaker._id}
                      onClick={() => handleUpdateStatus(speaker._id, "rejected")}
                      className="inline-flex items-center gap-1 rounded-xl bg-slate-100 px-3 py-2 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-200 disabled:opacity-60"
                    >
                      Reject
                    </button>
                    <button
                      type="button"
                      disabled={updatingId === speaker._id}
                      onClick={() => handleUpdateStatus(speaker._id, "accepted")}
                      className="inline-flex items-center gap-1 rounded-xl bg-blue-600 px-3 py-2 text-sm font-semibold text-white transition-colors hover:bg-blue-700 disabled:opacity-60"
                    >
                      Approve
                      <FiArrowUpRight size={14} />
                    </button>
                  </div>
                </div>
              </article>
            ))}
            {!loading && pendingSpeakers.length === 0 && (
              <div className="col-span-full rounded-xl border border-dashed border-slate-200 bg-slate-50 px-6 py-10 text-center text-sm text-slate-500">
                No pending speaker profiles. Newly created speakers will appear here for approval.
              </div>
            )}
            {loading && (
              <div className="col-span-full text-center text-sm text-slate-500">
                Loading speakers...
              </div>
            )}
          </div>
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white shadow-sm shadow-slate-200/70">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 px-6 py-5">
            <div>
              <h2 className="text-2xl font-bold tracking-tight text-slate-900">
                Rejected Speakers
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                Speakers previously rejected by admins. You can approve them again.
              </p>
            </div>
            <span className="inline-flex rounded-full bg-red-50 px-3 py-1.5 text-xs font-semibold text-red-700">
              {rejectedSpeakers.length} Rejected
            </span>
          </div>

          <div className="grid gap-5 p-6 md:grid-cols-2 xl:grid-cols-3">
            {rejectedSpeakers.map((speaker) => (
              <article
                key={speaker._id}
                className="rounded-2xl border border-slate-200 bg-slate-50/60 p-5 shadow-sm shadow-slate-200/40"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white text-sm font-black text-slate-700 shadow-sm shadow-slate-200/60">
                      {speaker.name
                        .split(" ")
                        .map((part) => part[0])
                        .slice(0, 2)
                        .join("")}
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-slate-900">
                        {speaker.name}
                      </h3>
                      <p className="text-sm font-medium text-slate-500">
                        {speaker.expertise || "Expertise pending"}
                      </p>
                    </div>
                  </div>
                  <span className="rounded-full bg-red-100 px-3 py-1 text-xs font-semibold text-red-700">
                    Rejected
                  </span>
                </div>

                <div className="mt-5 space-y-3 text-sm text-slate-600">
                  <div className="flex items-center gap-2">
                    <FiUserCheck size={14} className="text-slate-400" />
                    <span>{speaker.organization || "Organization not provided"}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FiMapPin size={14} className="text-slate-400" />
                    <span>{speaker.location || "Location not provided"}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FiMail size={14} className="text-slate-400" />
                    <span>{speaker.email || "Email not provided"}</span>
                  </div>
                </div>

                <div className="mt-6 flex items-center justify-between gap-3">
                  <div className="flex gap-2">
                    <button
                      type="button"
                      disabled={updatingId === speaker._id}
                      onClick={() => handleUpdateStatus(speaker._id, "accepted")}
                      className="inline-flex items-center gap-1 rounded-xl bg-blue-600 px-3 py-2 text-sm font-semibold text-white transition-colors hover:bg-blue-700 disabled:opacity-60"
                    >
                      Approve
                      <FiArrowUpRight size={14} />
                    </button>
                  </div>
                </div>
              </article>
            ))}
            {!loading && rejectedSpeakers.length === 0 && (
              <div className="col-span-full rounded-xl border border-dashed border-slate-200 bg-slate-50 px-6 py-10 text-center text-sm text-slate-500">
                No rejected speakers. Rejected speaker profiles will appear here.
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
