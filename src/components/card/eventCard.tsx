"use client";

import { useState } from "react";
import { MdLocationOn, MdPerson } from "react-icons/md";

type EventCardProps = {
  image: string;
  tag: string;
  date: string;
  title: string;
  location: string;
  day: string;
  month: string;
  speaker: string;
  onDetails?: () => void;
};

const FALLBACK_IMAGE = "https://placehold.co/600x360/e2e8f0/0f172a?text=Campus+Event";

const tagColors: Record<string, string> = {
  TECHNICAL: "text-blue-600 bg-blue-600",
  CULTURAL: "text-orange-500 bg-orange-500",
  WORKSHOP: "text-green-500 bg-green-500",
  SEMINAR: "text-amber-600 bg-amber-500",
  NETWORKING: "text-rose-600 bg-rose-500",
  EVENT: "text-slate-600 bg-slate-500",
};

export default function EventCard({ event }: { event: EventCardProps }) {
  const [imgSrc, setImgSrc] = useState(event.image || FALLBACK_IMAGE);
  const [dateTextClass, tagBgClass] = (tagColors[event.tag] || tagColors.EVENT).split(" ");

  return (
    <div className="flex w-full flex-col overflow-hidden rounded-xl border border-gray-200 bg-white">
      {/* Image */}
      <div className="relative h-44">
        <img
          src={imgSrc}
          alt={event.title}
          className="w-full h-full object-cover"
          onError={() => setImgSrc(FALLBACK_IMAGE)}
        />
        {/* Date Badge */}
        <div className="absolute top-3 left-3 bg-white rounded-lg text-center px-2 py-2 shadow-sm min-w-10.5">
          <p className={`text-[10px] font-bold uppercase leading-none ${dateTextClass}`}>
            {event.month}
          </p>
          <p className="text-lg font-extrabold text-gray-900 leading-tight">
            {event.day}
          </p>
        </div>
        {/* Tag Badge */}
        <span
          className={`absolute top-3 right-3 text-white text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wide ${tagBgClass}`}
        >
          {event.tag}
        </span>
      </div>

      {/* Body */}
      <div className="p-4 flex flex-col gap-2 flex-1">
        <h3 className="font-bold text-gray-900 text-sm leading-snug">
          {event.title}
        </h3>
        <div className="flex items-center gap-1.5 text-gray-500 text-xs">
          <MdLocationOn size={14} />
          <span>{event.location}</span>
        </div>
        <div className="flex items-center gap-1.5 text-gray-500 text-xs">
          <MdPerson size={14} />
          <span>{event.speaker}</span>
        </div>
        <button
          type="button"
          onClick={event.onDetails}
          className="mt-2 w-full bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold py-2.5 rounded-lg transition-colors duration-150 disabled:cursor-not-allowed disabled:bg-slate-300"
          disabled={!event.onDetails}
        >
          View Details
        </button>
      </div>
    </div>
  );
}
