"use client";

import type React from "react";
import { useRef, useState } from "react";
import axios from "axios";
import { Input } from "@/components";
import SectionTitle from "@/components/sectionTitle";
import {
  FiArrowLeft,
  FiBriefcase,
  FiGlobe,
  FiImage,
  FiInfo,
  FiMail,
  FiMapPin,
  FiMic,
  FiPhone,
  FiUploadCloud,
  FiUser,
} from "react-icons/fi";

type FormSectionProps = {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
};

function FormSection({ title, icon, children }: FormSectionProps) {
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

export default function CreateSpeakerPage() {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [form, setForm] = useState({
    name: "",
    title: "",
    expertise: "",
    organization: "",
    email: "",
    phone: "",
    location: "",
    website: "",
    bio: "",
  });
  const [profileImageName, setProfileImageName] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const updateForm = (field: keyof typeof form, value: string) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!form.name.trim()) {
      setError("Name is required");
      return;
    }

    try {
      setSubmitting(true);

      await axios.post(`http://localhost:3004/api/speakers/create`, {
        ...form,
        profileImageName,
      });

      setSuccess("Speaker created successfully");
      setForm({
        name: "",
        title: "",
        expertise: "",
        organization: "",
        email: "",
        phone: "",
        location: "",
        website: "",
        bio: "",
      });
      setProfileImageName("");
    } catch (err: any) {
      const message =
        err?.response?.data?.error ||
        err?.message ||
        "Failed to create speaker";
      setError(message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 px-6 py-6 font-sans text-slate-900">
      <div className="mx-auto max-w-5xl space-y-6">
        <div className="flex items-center gap-2 text-sm font-semibold text-slate-700">
          <FiArrowLeft size={16} />
          Create Speaker Profile
        </div>

        <SectionTitle
          title="Speaker Creation"
          description="Add a new guest speaker profile with professional details, contact information, and presentation background."
        />

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
          <FormSection title="Basic Information" icon={<FiUser size={14} />}>
            <div className="grid gap-4 md:grid-cols-2">
              <Input
                id="speaker-name"
                label="Full Name"
                value={form.name}
                onChange={(e) => updateForm("name", e.target.value)}
                placeholder="e.g. Dr. Anita Rao"
              />
              <Input
                id="speaker-title"
                label="Professional Title"
                value={form.title}
                onChange={(e) => updateForm("title", e.target.value)}
                placeholder="e.g. Senior AI Researcher"
              />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <Input
                id="speaker-expertise"
                label="Area of Expertise"
                value={form.expertise}
                onChange={(e) => updateForm("expertise", e.target.value)}
                placeholder="e.g. Machine Learning, Robotics"
                icon={<FiMic size={18} className="text-slate-400" />}
              />
              <Input
                id="speaker-organization"
                label="Organization"
                value={form.organization}
                onChange={(e) => updateForm("organization", e.target.value)}
                placeholder="e.g. Innovation Labs"
                icon={<FiBriefcase size={18} className="text-slate-400" />}
              />
            </div>
          </FormSection>

          <FormSection title="Contact Details" icon={<FiMail size={14} />}>
            <div className="grid gap-4 md:grid-cols-2">
              <Input
                id="speaker-email"
                label="Email Address"
                type="email"
                value={form.email}
                onChange={(e) => updateForm("email", e.target.value)}
                placeholder="speaker@example.com"
                icon={<FiMail size={18} className="text-slate-400" />}
              />
              <Input
                id="speaker-phone"
                label="Phone Number"
                value={form.phone}
                onChange={(e) => updateForm("phone", e.target.value)}
                placeholder="+91 98765 43210"
                icon={<FiPhone size={18} className="text-slate-400" />}
              />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <Input
                id="speaker-location"
                label="Location"
                value={form.location}
                onChange={(e) => updateForm("location", e.target.value)}
                placeholder="e.g. Bangalore, India"
                icon={<FiMapPin size={18} className="text-slate-400" />}
              />
              <Input
                id="speaker-website"
                label="Website / LinkedIn"
                value={form.website}
                onChange={(e) => updateForm("website", e.target.value)}
                placeholder="https://linkedin.com/in/speaker"
                icon={<FiGlobe size={18} className="text-slate-400" />}
              />
            </div>
          </FormSection>

          <FormSection title="Profile Details" icon={<FiInfo size={14} />}>
            <div className="space-y-2">
              <label
                htmlFor="speaker-bio"
                className="block text-sm font-semibold text-slate-700"
              >
                Short Bio
              </label>
              <textarea
                id="speaker-bio"
                value={form.bio}
                onChange={(e) => updateForm("bio", e.target.value)}
                placeholder="Write a short introduction covering achievements, speaking themes, and experience..."
                className="min-h-32 w-full resize-none rounded-lg border border-slate-200 bg-white px-4 py-3.5 text-sm text-slate-900 outline-none transition-all placeholder:text-slate-400"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-semibold text-slate-700">
                Profile Image
              </label>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const selectedFile = e.target.files?.[0];
                  setProfileImageName(selectedFile?.name ?? "");
                }}
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="flex min-h-48 w-full flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-6 py-8 text-center transition-colors hover:border-blue-300 hover:bg-blue-50/40"
              >
                <span className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-blue-100 text-blue-600">
                  {profileImageName ? (
                    <FiImage size={22} />
                  ) : (
                    <FiUploadCloud size={22} />
                  )}
                </span>
                <span className="text-sm font-semibold text-slate-700">
                  {profileImageName || "Upload speaker photo"}
                </span>
                <span className="mt-1 text-xs text-slate-400">
                  PNG or JPG, recommended square image, max 5MB
                </span>
              </button>
            </div>
          </FormSection>

          <div className="flex flex-wrap items-center justify-end gap-3 pt-2">
            <button
              type="button"
              className="rounded-xl px-5 py-3 text-sm font-semibold text-slate-500 transition-colors hover:text-slate-700"
            >
              Save Draft
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-sm shadow-blue-200 transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {submitting ? "Creating..." : "Create Speaker"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
