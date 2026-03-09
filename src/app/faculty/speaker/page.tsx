"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Input } from "@/components";
import SectionTitle from "@/components/sectionTitle";
import { BsSearch } from "react-icons/bs";
import { FiMic, FiPlus } from "react-icons/fi";

type Speaker = {
  id: number;
  name: string;
  expertise: string;
  organization: string;
  email: string;
  sessions: number;
  status: "Available" | "Busy";
};

const initialSpeakers: Speaker[] = [
  {
    id: 1,
    name: "Dr. Sarah Jenkins",
    expertise: "Artificial Intelligence",
    organization: "Tech Research Lab",
    email: "sarah.jenkins@example.com",
    sessions: 6,
    status: "Available",
  },
  {
    id: 2,
    name: "Prof. Michael Chen",
    expertise: "Robotics",
    organization: "School of Engineering",
    email: "michael.chen@example.com",
    sessions: 4,
    status: "Busy",
  },
  {
    id: 3,
    name: "Alex Rivera",
    expertise: "Product Design",
    organization: "Pixel Foundry",
    email: "alex.rivera@example.com",
    sessions: 3,
    status: "Available",
  },
  {
    id: 4,
    name: "Maria Gonzalez",
    expertise: "Digital Marketing",
    organization: "Growth House",
    email: "maria.gonzalez@example.com",
    sessions: 5,
    status: "Available",
  },
];

export default function FacultySpeakerPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [speakers] = useState<Speaker[]>(initialSpeakers);

  const filteredSpeakers = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();

    if (!query) {
      return speakers;
    }

    return speakers.filter((speaker) =>
      [speaker.name, speaker.expertise, speaker.organization, speaker.email]
        .join(" ")
        .toLowerCase()
        .includes(query),
    );
  }, [searchTerm, speakers]);

  return (
    <div className="min-h-screen bg-slate-50 p-8 font-sans">
      <div className="space-y-8">
        <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
          <SectionTitle
            title="Speaker"
            description="Manage guest speakers, review their profiles, and prepare upcoming sessions."
          />
          <div className="flex justify-end">
            <Link
              href="/faculty/speaker/create"
              className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white shadow-sm shadow-blue-200 transition-colors hover:bg-blue-700"
            >
              <FiPlus size={16} />
              Create Speaker
            </Link>
          </div>
        </div>

        <div className="space-y-6">
          <div className="w-full max-w-md">
            <Input
              id="speaker-table-search"
              label=""
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search speakers, topics, or organizations"
              icon={<BsSearch size={14} className="text-slate-400" />}
            />
          </div>

          <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm shadow-slate-200/70">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 px-6 py-5">
              <div>
                <h3 className="text-lg font-bold text-slate-900">
                  Speaker List
                </h3>
                <p className="text-sm text-slate-500">
                  {filteredSpeakers.length} speaker profiles available for event
                  scheduling.
                </p>
              </div>
              <span className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1.5 text-xs font-semibold text-blue-700">
                <FiMic size={13} />
                Faculty Directory
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-slate-200 text-sm">
                <thead className="bg-slate-50 text-left text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                  <tr>
                    <th className="px-6 py-4">Speaker</th>
                    <th className="px-6 py-4">Expertise</th>
                    <th className="px-6 py-4">Organization</th>
                    <th className="px-6 py-4">Email</th>
                    <th className="px-6 py-4">Sessions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 bg-white">
                  {filteredSpeakers.map((speaker) => (
                    <tr key={speaker.id} className="hover:bg-slate-50/80">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-sm font-bold text-slate-700">
                            {speaker.name
                              .split(" ")
                              .map((part) => part[0])
                              .slice(0, 2)
                              .join("")}
                          </div>
                          <div>
                            <p className="font-semibold text-slate-900">
                              {speaker.name}
                            </p>
                            <p className="text-xs text-slate-500">
                              Guest speaker
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-slate-600">
                        {speaker.expertise}
                      </td>
                      <td className="px-6 py-4 text-slate-600">
                        {speaker.organization}
                      </td>
                      <td className="px-6 py-4 text-slate-600">
                        {speaker.email}
                      </td>
                      <td className="px-6 py-4 font-semibold text-slate-700">
                        {speaker.sessions}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
