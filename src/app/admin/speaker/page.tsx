import SectionTitle from "@/components/sectionTitle";
import { BsPatchCheck, BsPeople, BsPersonExclamation } from "react-icons/bs";
import { FiArrowUpRight, FiClock, FiMail, FiMapPin, FiUserCheck } from "react-icons/fi";

const speakers = [
  {
    id: 1,
    name: "Dr. Sarah Jenkins",
    expertise: "Artificial Intelligence",
    organization: "Tech Research Lab",
    location: "Boston, USA",
    email: "sarah.jenkins@example.com",
    status: "Verified",
  },
  {
    id: 2,
    name: "Prof. Michael Chen",
    expertise: "Robotics",
    organization: "School of Engineering",
    location: "Singapore",
    email: "michael.chen@example.com",
    status: "Verified",
  },
  {
    id: 3,
    name: "Anita Rao",
    expertise: "Data Science",
    organization: "Insight Labs",
    location: "Bangalore, India",
    email: "anita.rao@example.com",
    status: "Waiting",
  },
  {
    id: 4,
    name: "David Kim",
    expertise: "Cloud Architecture",
    organization: "Nimbus Systems",
    location: "Seoul, South Korea",
    email: "david.kim@example.com",
    status: "Waiting",
  },
  {
    id: 5,
    name: "Lina Martins",
    expertise: "Digital Product Strategy",
    organization: "North Axis Studio",
    location: "Lisbon, Portugal",
    email: "lina.martins@example.com",
    status: "Waiting",
  },
  {
    id: 6,
    name: "Omar Farooq",
    expertise: "Cybersecurity",
    organization: "Secure Layer",
    location: "Dubai, UAE",
    email: "omar.farooq@example.com",
    status: "Verified",
  },
];

const unverifiedSpeakers = speakers.filter(
  (speaker) => speaker.status === "Waiting",
);

const statCards = [
  {
    label: "Total Speakers",
    value: speakers.length,
    note: "All profiles in the portal",
    icon: <BsPeople size={18} className="text-blue-600" />,
    iconBg: "bg-blue-50",
    noteClass: "text-slate-400",
  },
  {
    label: "Verified Speakers",
    value: speakers.filter((speaker) => speaker.status === "Verified").length,
    note: "Ready for event assignment",
    icon: <BsPatchCheck size={18} className="text-emerald-600" />,
    iconBg: "bg-emerald-50",
    noteClass: "text-emerald-500",
  },
  {
    label: "Speakers Waiting",
    value: unverifiedSpeakers.length,
    note: "Pending admin review",
    icon: <BsPersonExclamation size={18} className="text-amber-600" />,
    iconBg: "bg-amber-50",
    noteClass: "text-amber-500",
  },
 
];

export default function AdminSpeakerPage() {
  return (
    <div className="min-h-screen w-full bg-slate-50 p-8 font-sans">
      <div className="space-y-8 w-full">
        <SectionTitle
          title="Speakers"
          description="Review speaker profiles, monitor verification progress, and approve experts before they appear across the event portal."
        />

        <div className="flex flex-row w-full gap-5">
          {statCards.map((stat) => (
            <article
              key={stat.label}
              className="rounded-2xl w-full border border-slate-200 bg-white px-6 py-5 shadow-sm shadow-slate-200/60"
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

        <section className="rounded-2xl border border-slate-200 bg-white shadow-sm shadow-slate-200/70">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 px-6 py-5">
            <div>
              <h2 className="text-2xl font-bold tracking-tight text-slate-900">
                Unverified Speakers
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                Profiles waiting for admin approval before they can be attached to events.
              </p>
            </div>
            <span className="inline-flex rounded-full bg-amber-50 px-3 py-1.5 text-xs font-semibold text-amber-700">
              {unverifiedSpeakers.length} Pending Reviews
            </span>
          </div>

          <div className="grid gap-5 p-6 md:grid-cols-2 xl:grid-cols-3">
            {unverifiedSpeakers.map((speaker) => (
              <article
                key={speaker.id}
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
                        {speaker.expertise}
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
                    <span>{speaker.organization}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FiMapPin size={14} className="text-slate-400" />
                    <span>{speaker.location}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FiMail size={14} className="text-slate-400" />
                    <span>{speaker.email}</span>
                  </div>
                </div>

                <div className="mt-6 flex items-center justify-between gap-3">
                  <button
                    type="button"
                    className="rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-slate-800"
                  >
                    Review Profile
                  </button>
                  <button
                    type="button"
                    className="inline-flex items-center gap-1 text-sm font-semibold text-blue-600 transition-colors hover:text-blue-700"
                  >
                    Approve
                    <FiArrowUpRight size={14} />
                  </button>
                </div>
              </article>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}