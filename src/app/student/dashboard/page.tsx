"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { BsCalendarCheck, BsCheckCircle } from "react-icons/bs";
import { RiCalendarEventLine } from "react-icons/ri";

import EventCard from "@/components/card/eventCard";
import SectionTitle from "@/components/sectionTitle";
import { fetchData } from "@/utils/axios";

type Speaker = {
  _id: string;
  name: string;
};

type EventRecord = {
  _id: string;
  title: string;
  category?: string;
  date?: string;
  venue?: string;
  speakers?: Speaker[];
  coverImageUrl?: string;
};

type RegistrationRecord = {
  _id: string;
  status: "registered" | "waitlisted" | "attended" | "cancelled";
  tab: "upcoming" | "past" | "waitlisted";
  event: EventRecord;
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
    return { day: "--", month: "TBD" };
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
  const [registrations, setRegistrations] = useState<RegistrationRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadRegistrations = async () => {
      try {
        setIsLoading(true);
        const response = await fetchData<{ registrations: RegistrationRecord[] }>(
          "/registrations/mine",
        );
        setRegistrations(response.registrations ?? []);
        setError(null);
      } catch (err) {
        const message =
          err instanceof Error
            ? err.message
            : "Failed to load your registrations";
        setError(message);
      } finally {
        setIsLoading(false);
      }
    };

    loadRegistrations();
  }, []);

  const upcomingRegistrations = useMemo(() => {
    return registrations
      .filter((registration) => registration.tab === "upcoming")
      .sort((left, right) => {
        const leftDate = getParsedDate(left.event.date)?.getTime() ?? Number.MAX_SAFE_INTEGER;
        const rightDate = getParsedDate(right.event.date)?.getTime() ?? Number.MAX_SAFE_INTEGER;
        return leftDate - rightDate;
      });
  }, [registrations]);

  const stats = useMemo(() => {
    const registeredCount = registrations.filter(
      (registration) =>
        registration.status === "registered" || registration.status === "attended",
    ).length;
    const attendedCount = registrations.filter(
      (registration) => registration.status === "attended",
    ).length;

    return [
      {
        icon: <BsCalendarCheck size={22} className="text-[#1152D4]" />,
        iconBg: "bg-blue-50",
        label: "Events Registered",
        value: registeredCount,
      },
      {
        icon: <BsCheckCircle size={22} className="text-[#059669]" />,
        iconBg: "bg-[#D1FAE5]",
        label: "Events Attended",
        value: attendedCount,
      },
      {
        icon: <RiCalendarEventLine size={22} className="text-[#D97706]" />,
        iconBg: "bg-[#FEF3C7]",
        label: "Upcoming Events",
        value: upcomingRegistrations.length,
      },
    ];
  }, [registrations, upcomingRegistrations.length]);



  const eventCards = useMemo(
    () =>
      upcomingRegistrations.map((registration) => {
        const formattedDate = formatEventDate(registration.event.date);

        return {
          image: registration.event.coverImageUrl || FALLBACK_EVENT_IMAGE,
          month: formattedDate.month,
          day: formattedDate.day,
          tag: (registration.event.category || "Event").toUpperCase(),
          title: registration.event.title,
          location: registration.event.venue || "Venue to be announced",
          speaker:
            registration.event.speakers?.map((speaker) => speaker.name).join(", ") ||
            "Speaker to be announced",
          date: registration.event.date || "",
          onDetails: () => router.push(`/student/events/${registration.event._id}`),
        };
      }),
    [router, upcomingRegistrations],
  );

  return (
    <div className="min-h-screen bg-slate-50 p-8 font-sans">
      <SectionTitle
        title="Dashboard"
        description="Track the events you joined, keep an eye on upcoming sessions, and revisit your student activity in one place."
      />

      <div className="mt-7 mb-9 flex flex-wrap gap-4">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="flex min-w-40 flex-1 items-center gap-3.5 rounded-xl border border-gray-200 bg-white px-6 py-6.5"
          >
            <div
              className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${stat.iconBg}`}
            >
              {stat.icon}
            </div>
            <div>
              <p className="mb-0.5 text-xs text-gray-500">{stat.label}</p>
              <p className="text-2xl leading-none font-extrabold text-gray-900">
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
          Loading your upcoming events...
        </div>
      ) : eventCards.length > 0 ? (
        <div className="flex w-full flex-wrap justify-start gap-4">
          {eventCards.map((event) => (
            <EventCard key={`${event.title}-${event.date}`} event={event} />
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center shadow-sm shadow-slate-200/40">
          <p className="text-lg font-bold text-slate-800">No upcoming events yet</p>
          <p className="mt-2 text-sm text-slate-500">
            Register for an active event to see it appear on your dashboard.
          </p>
        </div>
      )}
    </div>
  );
}
