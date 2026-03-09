"use client";

import { BsCalendarCheck, BsCheckCircle } from "react-icons/bs";
import { RiCalendarEventLine } from "react-icons/ri";
import EventCard from "@/components/card/eventCard";
import SectionTitle from "@/components/sectionTitle";

const stats = [
  {
    icon: <BsCalendarCheck size={22} className="text-[#1152D4]" />,
    iconBg: "bg-blue-50",
    label: "Events Registered",
    value: 12,
  },
  {
    icon: <BsCheckCircle size={22} className="text-[#059669]" />,
    iconBg: "bg-[#D1FAE5]",
    label: "Events Attended",
    value: 8,
  },
  {
    icon: <RiCalendarEventLine size={22} className="text-[#D97706]" />,
    iconBg: "bg-[#FEF3C7]",
    label: "Upcoming Events",
    value: 4,
  },
];

const events = [
  {
    id: 1,
    image:
      "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=600&q=80",
    month: "OCT",
    day: "24",
    tag: "TECHNICAL",
    title: "Annual AI Hackathon 2024",
    location: "Main Tech Auditorium",
    speaker: "Dr. Sarah Jenkins",
  },
  {
    id: 2,
    image:
      "https://images.unsplash.com/photo-1504609813442-a8924e83f76e?w=600&q=80",
    month: "NOV",
    day: "02",
    tag: "CULTURAL",
    title: "Campus Rhythm: Dance...",
    location: "Open Air Theatre",
    speaker: "Cultural Committee",
  },
  {
    id: 3,
    image:
      "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=600&q=80",
    month: "NOV",
    day: "05",
    tag: "WORKSHOP",
    title: "UI/UX Design Essentials",
    location: "Seminar Hall B",
    speaker: "Alex Rivera",
  },
  {
    id: 4,
    image:
      "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=600&q=80",
    month: "NOV",
    day: "08",
    tag: "CULTURAL",
    title: "Acoustic Night - Coffee &...",
    location: "Student Lounge",
    speaker: "Campus Band",
  },
  {
    id: 5,
    image:
      "https://images.unsplash.com/photo-1560439513-74b037a25d84?w=600&q=80",
    month: "NOV",
    day: "12",
    tag: "WORKSHOP",
    title: "Digital Marketing...",
    location: "Business School Annex",
    speaker: "Maria Gonzalez",
  },
  {
    id: 6,
    image:
      "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=600&q=80",
    month: "NOV",
    day: "15",
    tag: "TECHNICAL",
    title: "RoboWars: Campus Finals",
    location: "Engineering Quad",
    speaker: "Engineering Club",
  },
];
export default function DashboardPage() {
  return (
    <div className="p-8 bg-slate-50 min-h-screen font-sans">
      {/* Header */}
      <SectionTitle
        title="Dashboard"
        description="Your personalized event hub - track registrations, discover new events, and manage your campus activities all in one place."
      />

      {/* Stat Cards */}
      <div className="flex gap-4 mt-7 mb-9 flex-wrap">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="flex flex-1 min-w-[160px] items-center gap-3.5 bg-white border border-gray-200 rounded-xl px-6 py-6.5"
          >
            <div
              className={`w-11 h-11 rounded-xl ${stat.iconBg} flex items-center justify-center shrink-0`}
            >
              {stat.icon}
            </div>
            <div>
              <p className="text-xs text-gray-500 mb-0.5">{stat.label}</p>
              <p className="text-2xl font-extrabold text-gray-900 leading-none">
                {stat.value}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Event Cards Grid */}
      <div className="flex w-full gap-4 justify-start flex-wrap">
        {events.map((event, i) => (
          <EventCard event={event} />
        ))}
      </div>
    </div>
  );
}
