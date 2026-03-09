"use client";

import { useState } from "react";
import { EventCard, Input } from "@/components";
import { MdLocationOn, MdPerson } from "react-icons/md";
import { BsSearch, BsCalendar3 } from "react-icons/bs";
import { RxDragHandleHorizontal } from "react-icons/rx";

import { FiChevronDown, FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { IoCodeSlash } from "react-icons/io5";
import { GiMusicalNotes } from "react-icons/gi";
import { MdOutlineDesignServices } from "react-icons/md";
import SectionTitle from "@/components/sectionTitle";

const filters = [
  "All Events",
  "Technical",
  "Cultural",
  "Workshops",
  "Pick Date",
];

const filterIcons: Record<string, React.ReactNode> = {
  "All Events": <BsSearch size={13} />,
  Technical: <IoCodeSlash size={13} />,
  Cultural: <GiMusicalNotes size={13} />,
  Workshops: <MdOutlineDesignServices size={13} />,
  "Pick Date": <BsCalendar3 size={12} />,
};

const tagColors: Record<string, string> = {
  TECHNICAL: "bg-blue-600",
  CULTURAL: "bg-orange-500",
  WORKSHOP: "bg-green-500",
};

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

// function EventCard({ event }: { event: (typeof events)[0] }) {
//   return (
//     <div className="bg-white rounded-xl border border-gray-200 overflow-hidden flex flex-col">
//       {/* Image */}
//       <div className="relative h-44">
//         <img
//           src={event.image}
//           alt={event.title}
//           className="w-full h-full object-cover"
//         />
//         {/* Date Badge */}
//         <div className="absolute top-3 left-3 min-w-10.5 rounded-lg bg-white px-2 py-1 text-center shadow-sm">
//           <p className="text-[10px] font-bold text-gray-500 uppercase leading-none">
//             {event.month}
//           </p>
//           <p className="text-lg font-extrabold text-gray-900 leading-tight">
//             {event.day}
//           </p>
//         </div>
//         {/* Tag Badge */}
//         <span
//           className={`absolute top-3 right-3 ${tagColors[event.tag]} text-white text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wide`}
//         >
//           {event.tag}
//         </span>
//       </div>

//       {/* Body */}
//       <div className="p-4 flex flex-col gap-2 flex-1">
//         <h3 className="font-bold text-gray-900 text-sm leading-snug">
//           {event.title}
//         </h3>
//         <div className="flex items-center gap-1.5 text-gray-500 text-xs">
//           <MdLocationOn size={14} />
//           <span>{event.location}</span>
//         </div>
//         <div className="flex items-center gap-1.5 text-gray-500 text-xs">
//           <MdPerson size={14} />
//           <span>{event.speaker}</span>
//         </div>
//         <button className="mt-2 w-full bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold py-2.5 rounded-lg transition-colors duration-150">
//           View Details
//         </button>
//       </div>
//     </div>
//   );
// }

export default function AllEventsPage() {
  const [activeFilter, setActiveFilter] = useState("All Events");
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const totalPages = 12;

  return (
    <div className="min-h-screen pt-8 p-6 bg-gray-100 font-sans">
      {/* Main */}
      <SectionTitle
        title="Browse Events"
        description="Discover and join upcoming campus events"
      />
      <div className="flex-1 mt-5 flex flex-col gap-5">
        {/* Search + Controls */}
        <div className="flex items-center justify-between gap-3">
          <div className="flex flex-wrap flex-col items-start gap-2">
            <span className="text-xs font-semibold uppercase tracking-widest text-gray-400">
              Filters:
            </span>
            <div className="flex gap-2">
              {filters.map((f) => (
                <button
                  key={f}
                  onClick={() => setActiveFilter(f)}
                  className={`flex cursor-pointer items-center gap-1.5 rounded-2xl border px-5 py-3.5 text-xs font-semibold transition-colors duration-150 ${
                    activeFilter === f
                      ? "border-blue-600 bg-blue-600 text-white"
                      : "border-gray-200 bg-white text-gray-600 hover:border-gray-300 hover:bg-gray-50"
                  }`}
                >
                  {filterIcons[f]}
                  {f}
                </button>
              ))}
            </div>
          </div>
          <div className="min-w-[340px]">
            <Input
              id="event-search"
              label=""
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search events, speakers, or venues"
              icon={<BsSearch size={14} className="text-gray-400" />}
            />
          </div>
        </div>

        {/* Filter Pills */}

        {/* Event Grid */}
        <div className="grid grid-cols-3 gap-4">
          {events.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-center gap-2 mt-2">
          <button
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            className="w-8 h-8 flex items-center justify-center rounded-full border border-gray-200 bg-white hover:bg-gray-50 text-gray-600"
          >
            <FiChevronLeft size={14} />
          </button>
          {[1, 2, 3].map((p) => (
            <button
              key={p}
              onClick={() => setCurrentPage(p)}
              className={`w-8 h-8 rounded-full text-sm font-semibold transition-colors ${
                currentPage === p
                  ? "bg-blue-600 text-white"
                  : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50"
              }`}
            >
              {p}
            </button>
          ))}
          <span className="text-gray-400 text-sm">...</span>
          <button
            onClick={() => setCurrentPage(totalPages)}
            className={`w-8 h-8 rounded-full text-sm font-semibold transition-colors ${
              currentPage === totalPages
                ? "bg-blue-600 text-white"
                : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50"
            }`}
          >
            {totalPages}
          </button>
          <button
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            className="w-8 h-8 flex items-center justify-center rounded-full border border-gray-200 bg-white hover:bg-gray-50 text-gray-600"
          >
            <FiChevronRight size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}
