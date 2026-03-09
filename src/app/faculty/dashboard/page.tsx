"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { BsCalendarCheck, BsCheckCircle } from "react-icons/bs";
import { RiCalendarEventLine } from "react-icons/ri";
import EventCard from "@/components/card/eventCard";
import SectionTitle from "@/components/sectionTitle";
import { fetchData } from "@/utils/axios";

type FacultyDashboardEvent = {
  _id: string;
  title: string;
  category?: string;
  date?: string;
  venue?: string;
  coverImageName?: string;
  status?: "Pending" | "Approved" | "Needs Changes" | "Rejected";
  speakers?: Array<{ _id: string; name: string }>;
};

const FALLBACK_EVENT_IMAGE =
  "https://placehold.co/600x360/e2e8f0/0f172a?text=Campus+Event";

function getParsedDate(date?: string) {
  if (!date) {
    return null;
  }

  const parsedDate = new Date(date);

  return Number.isNaN(parsedDate.getTime()) ? null : parsedDate;
}

function formatEventDate(date?: string) {
  const parsedDate = getParsedDate(date);

  if (!parsedDate) {
    return {
      day: "--",
      month: "TBD",
    };
  }

  return {
    day: parsedDate.toLocaleDateString("en-US", { day: "2-digit" }),
    month: parsedDate
      .toLocaleDateString("en-US", { month: "short" })
      .toUpperCase(),
  };
}

export default function DashboardPage() {
  const router = useRouter();
  const [events, setEvents] = useState<FacultyDashboardEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadEvents = async () => {
      try {
        setIsLoading(true);
        const response = await fetchData<{ events: FacultyDashboardEvent[] }>(
          "/events/mine",
        );
        setEvents(response.events ?? []);
        setError(null);
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Failed to load your events";
        setError(message);
      } finally {
        setIsLoading(false);
      }
    };

    loadEvents();
  }, []);

  const stats = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const approvedEvents = events.filter(
      (event) => event.status === "Approved",
    ).length;
    const pendingEvents = events.filter(
      (event) => event.status === "Pending" || event.status === "Needs Changes",
    ).length;
    const upcomingEvents = events.filter((event) => {
      const parsedDate = getParsedDate(event.date);
      return Boolean(parsedDate && parsedDate >= today);
    }).length;

    return [
      {
        icon: <BsCalendarCheck size={22} className="text-[#1152D4]" />,
        iconBg: "bg-blue-50",
        label: "Total Events",
        value: events.length,
      },
      {
        icon: <BsCheckCircle size={22} className="text-[#059669]" />,
        iconBg: "bg-[#D1FAE5]",
        label: "Approved Events",
        value: approvedEvents,
      },
      {
        icon: <RiCalendarEventLine size={22} className="text-[#D97706]" />,
        iconBg: "bg-[#FEF3C7]",
        label: "Upcoming Events",
        value: upcomingEvents || pendingEvents,
      },
    ];
  }, [events]);

  const eventCards = useMemo(
    () =>
      events.map((event) => {
        const formattedDate = formatEventDate(event.date);

        return {
          id: event._id,
          image: FALLBACK_EVENT_IMAGE,
          month: formattedDate.month,
          day: formattedDate.day,
          tag: (event.category || "Event").toUpperCase(),
          title: event.title,
          location: event.venue || "Venue to be announced",
          speaker:
            event.speakers?.map((speaker) => speaker.name).join(", ") ||
            "Speaker to be announced",
          date: event.date || "",
          onDetails: () => router.push(`/faculty/event/${event._id}`),
        };
      }),
    [events, router],
  );

  return (
    <div className="p-8 bg-slate-50 min-h-screen font-sans">
      <SectionTitle
        title="Dashboard"
        description="Review the events you created, track approval progress, and keep an eye on what is coming up next."
      />

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

      {error && (
        <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {isLoading ? (
        <div className="rounded-2xl border border-slate-200 bg-white px-6 py-16 text-center text-sm text-slate-500 shadow-sm shadow-slate-200/40">
          Loading your events...
        </div>
      ) : eventCards.length > 0 ? (
        <div className="flex w-full gap-4 justify-start flex-wrap">
          {eventCards.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center shadow-sm shadow-slate-200/40">
          <p className="text-lg font-bold text-slate-800">No events created yet</p>
          <p className="mt-2 text-sm text-slate-500">
            Create your first event to see it appear here and in your stats.
          </p>
        </div>
      )}
    </div>
  );
}
