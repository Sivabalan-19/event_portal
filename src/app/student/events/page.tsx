"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { BsCalendar3, BsSearch } from "react-icons/bs";
import { IoCodeSlash } from "react-icons/io5";
import { GiMusicalNotes } from "react-icons/gi";
import { MdOutlineDesignServices } from "react-icons/md";

import { EventCard, Input } from "@/components";
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
  coverImageName?: string;
};

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

export default function AllEventsPage() {
  const router = useRouter();
  const [activeFilter, setActiveFilter] = useState("All Events");
  const [searchTerm, setSearchTerm] = useState("");
  const [events, setEvents] = useState<EventRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadEvents = async () => {
      try {
        setIsLoading(true);
        const response = await fetchData<{ events: EventRecord[] }>("/events/active");
        setEvents(response.events ?? []);
        setError(null);
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Failed to load active events";
        setError(message);
      } finally {
        setIsLoading(false);
      }
    };

    loadEvents();
  }, []);

  const filteredEvents = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();

    return events
      .filter((event) => {
        const category = event.category || "";
        const matchesFilter =
          activeFilter === "All Events" ||
          (activeFilter === "Technical" && category === "Technical") ||
          (activeFilter === "Cultural" && category === "Cultural") ||
          (activeFilter === "Workshops" && category === "Workshop") ||
          (activeFilter === "Pick Date" && Boolean(getParsedDate(event.date)));

        const speakerNames =
          event.speakers?.map((speaker) => speaker.name).join(" ") || "";
        const matchesSearch =
          normalizedSearch.length === 0 ||
          [event.title, event.venue, category, speakerNames]
            .join(" ")
            .toLowerCase()
            .includes(normalizedSearch);

        return matchesFilter && matchesSearch;
      })
      .sort((left, right) => {
        const leftDate = getParsedDate(left.date)?.getTime() ?? Number.MAX_SAFE_INTEGER;
        const rightDate = getParsedDate(right.date)?.getTime() ?? Number.MAX_SAFE_INTEGER;
        return leftDate - rightDate;
      });
  }, [activeFilter, events, searchTerm]);

  const eventCards = useMemo(
    () =>
      filteredEvents.map((event) => {
        const formattedDate = formatEventDate(event.date);

        return {
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
          onDetails: () => router.push(`/student/events/${event._id}`),
        };
      }),
    [filteredEvents, router],
  );

  return (
    <div className="min-h-screen bg-gray-100 p-6 pt-8 font-sans">
      <SectionTitle
        title="Browse Events"
        description="Discover active campus events that are open right now."
      />

      <div className="mt-5 flex flex-col gap-5">
        <div className="flex items-start justify-between gap-3">
          <div className="flex flex-col items-start gap-2">
            <span className="text-xs font-semibold uppercase tracking-widest text-gray-400">
              Filters:
            </span>
            <div className="flex flex-wrap gap-2">
              {filters.map((filter) => (
                <button
                  key={filter}
                  type="button"
                  onClick={() => setActiveFilter(filter)}
                  className={`flex cursor-pointer items-center gap-1.5 rounded-2xl border px-5 py-3.5 text-xs font-semibold transition-colors duration-150 ${
                    activeFilter === filter
                      ? "border-blue-600 bg-blue-600 text-white"
                      : "border-gray-200 bg-white text-gray-600 hover:border-gray-300 hover:bg-gray-50"
                  }`}
                >
                  {filterIcons[filter]}
                  {filter}
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

        {error && (
          <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {isLoading ? (
          <div className="rounded-2xl border border-slate-200 bg-white px-6 py-16 text-center text-sm text-slate-500 shadow-sm shadow-slate-200/40">
            Loading active events...
          </div>
        ) : eventCards.length > 0 ? (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
            {eventCards.map((event) => (
              <EventCard key={`${event.title}-${event.date}`} event={event} />
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center shadow-sm shadow-slate-200/40">
            <p className="text-lg font-bold text-slate-800">No active events found</p>
            <p className="mt-2 text-sm text-slate-500">
              Try a different filter or search term.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
