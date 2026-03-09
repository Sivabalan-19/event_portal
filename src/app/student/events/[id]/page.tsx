"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { BsCalendar3, BsPeopleFill, BsPersonCircle } from "react-icons/bs";
import { FiChevronRight } from "react-icons/fi";
import { MdLocationOn } from "react-icons/md";

import { createData, fetchData } from "@/utils/axios";

type Speaker = {
  _id: string;
  name: string;
  email?: string;
  expertise?: string;
  organization?: string;
  location?: string;
};

type EventDetail = {
  _id: string;
  title: string;
  category?: string;
  date?: string;
  time?: string;
  venue?: string;
  description?: string;
  maxAttendees?: number;
  registrationCount?: number;
  speakers?: Speaker[];
  createdBy?: {
    name?: string;
    email?: string;
    department?: string;
    year?: string;
  };
};

type RegistrationRecord = {
  _id: string;
  status: "registered" | "waitlisted" | "attended" | "cancelled";
  waitlistPosition?: number;
  event: {
    _id: string;
  };
};

type RegistrationStatus = RegistrationRecord["status"] | null;

const FALLBACK_EVENT_IMAGE =
  "https://placehold.co/1200x720/e2e8f0/0f172a?text=Campus+Event";

function formatDate(date?: string) {
  if (!date) {
    return "Date to be announced";
  }

  const parsedDate = new Date(date);
  return Number.isNaN(parsedDate.getTime())
    ? date
    : parsedDate.toLocaleDateString("en-US", {
        month: "long",
        day: "2-digit",
        year: "numeric",
      });
}

function formatSpeakerNames(speakers?: Speaker[]) {
  if (!speakers?.length) {
    return "Speaker to be announced";
  }

  return speakers.map((speaker) => speaker.name).join(", ");
}

function buildTopics(event: EventDetail) {
  return [
    event.category
      ? `Category focus: ${event.category}`
      : "Category details will be announced.",
    event.speakers?.length
      ? `Featured speaker${event.speakers.length > 1 ? "s" : ""}: ${formatSpeakerNames(event.speakers)}`
      : "Speaker lineup will be published soon.",
    event.maxAttendees
      ? `Capacity planned for up to ${event.maxAttendees} attendees.`
      : "Capacity information will be shared soon.",
    event.createdBy?.department
      ? `Organized by ${event.createdBy.department}.`
      : "Organizer details will be updated soon.",
  ];
}

export default function EventDetailsReviewPage() {
  const params = useParams<{ id: string }>();
  const [event, setEvent] = useState<EventDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [registrationStatus, setRegistrationStatus] = useState<RegistrationStatus>(null);
  const [waitlistPosition, setWaitlistPosition] = useState<number | undefined>();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [registrationMessage, setRegistrationMessage] = useState<string | null>(null);
  const [registrationError, setRegistrationError] = useState<string | null>(null);

  useEffect(() => {
    const eventId = params?.id;

    if (!eventId) {
      setError("Missing event id");
      setIsLoading(false);
      return;
    }

    const loadEvent = async () => {
      try {
        setIsLoading(true);
        const [eventResult, registrationsResult] = await Promise.allSettled([
          fetchData<{ event: EventDetail }>(`/events/active/${eventId}`),
          fetchData<{ registrations: RegistrationRecord[] }>("/registrations/mine"),
        ]);

        if (eventResult.status === "rejected") {
          throw eventResult.reason;
        }

        setEvent(eventResult.value.event);
        setError(null);

        if (registrationsResult.status === "fulfilled") {
          const currentRegistration = (registrationsResult.value.registrations ?? []).find(
            (registration) => registration.event?._id === eventId,
          );

          setRegistrationStatus(currentRegistration?.status ?? null);
          setWaitlistPosition(currentRegistration?.waitlistPosition);
          setRegistrationError(null);
        } else {
          setRegistrationStatus(null);
          setWaitlistPosition(undefined);
        }
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Failed to load event details";
        setError(message);
        setEvent(null);
      } finally {
        setIsLoading(false);
      }
    };

    loadEvent();
  }, [params?.id]);

  const detailItems = useMemo(() => {
    if (!event) {
      return [];
    }

    return [
      {
        icon: <BsCalendar3 size={18} className="text-blue-500" />,
        label: "DATE & TIME",
        primary: formatDate(event.date),
        secondary: event.time || "Time to be announced",
      },
      {
        icon: <MdLocationOn size={20} className="text-blue-500" />,
        label: "VENUE",
        primary: event.venue || "Venue to be announced",
        secondary:
          event.createdBy?.department || "Location details will be updated soon",
      },
      {
        icon: <BsPeopleFill size={18} className="text-blue-500" />,
        label: "MAX CAPACITY",
        primary: `${event.maxAttendees ?? 0} Attendees`,
        secondary: `${event.registrationCount ?? 0} registrations so far`,
      },
      {
        icon: <BsPersonCircle size={18} className="text-blue-500" />,
        label: "SPEAKER",
        primary: formatSpeakerNames(event.speakers),
        secondary: event.speakers?.[0]?.expertise || "Speaker profile coming soon",
        isLink: Boolean(event.speakers?.length),
      },
    ];
  }, [event]);

  const topics = useMemo(() => (event ? buildTopics(event) : []), [event]);

  const registerButtonLabel = useMemo(() => {
    if (isSubmitting) {
      return "Registering...";
    }

    if (registrationStatus === "waitlisted") {
      return waitlistPosition
        ? `Waitlisted (#${waitlistPosition})`
        : "Waitlisted";
    }

    if (registrationStatus === "registered" || registrationStatus === "attended") {
      return "Registered";
    }

    return "Register";
  }, [isSubmitting, registrationStatus, waitlistPosition]);

  const isRegisterDisabled =
    isSubmitting ||
    registrationStatus === "registered" ||
    registrationStatus === "attended" ||
    registrationStatus === "waitlisted";

  const handleRegister = async () => {
    if (!event || isRegisterDisabled) {
      return;
    }

    try {
      setIsSubmitting(true);
      setRegistrationError(null);
      setRegistrationMessage(null);

      const response = await createData<
        {
          message: string;
          registration: {
            status: "registered" | "waitlisted" | "attended" | "cancelled";
            waitlistPosition?: number;
          };
        },
        { eventId: string }
      >("/registrations", {
        eventId: event._id,
      });

      setRegistrationStatus(response.registration.status);
      setWaitlistPosition(response.registration.waitlistPosition);
      setRegistrationMessage(response.message);
      setEvent((currentEvent) =>
        currentEvent
          ? {
              ...currentEvent,
              registrationCount: (currentEvent.registrationCount ?? 0) + 1,
            }
          : currentEvent,
      );
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to register for this event";

      if (message.toLowerCase().includes("already registered")) {
        setRegistrationStatus("registered");
        setRegistrationError(null);
        setRegistrationMessage("You are already registered for this event.");
        return;
      }

      setRegistrationError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-100 font-sans">
        <div className="mx-auto min-h-screen max-w-full bg-white shadow-sm">
          <div className="px-6 py-16 text-center text-sm text-slate-500">
            Loading event details...
          </div>
        </div>
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="min-h-screen bg-gray-100 font-sans">
        <div className="mx-auto min-h-screen max-w-full bg-white shadow-sm">
          <div className="px-6 pt-6 pb-2 flex items-center gap-1 text-sm text-gray-500">
            <Link href="/student/events" className="cursor-pointer hover:text-blue-600">
              Events
            </Link>
            <FiChevronRight size={14} />
            <span className="font-medium text-gray-700">Details</span>
          </div>
          <div className="px-6 py-16 text-center">
            <h1 className="text-2xl font-extrabold text-gray-900">Event not found</h1>
            <p className="mt-2 text-sm text-gray-500">
              {error ?? "The selected event could not be loaded."}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 font-sans">
      <div className="mx-auto min-h-screen max-w-full bg-white shadow-sm">
        <div className="flex items-center gap-1 px-6 pt-6 pb-2 text-sm text-gray-500">
          <Link href="/student/events" className="cursor-pointer hover:text-blue-600">
            Events
          </Link>
          <FiChevronRight size={14} />
          <span className="font-medium text-gray-700">Event Details</span>
        </div>

        <h1 className="px-6 pb-5 text-2xl font-extrabold text-gray-900">
          Event Details
        </h1>

        <div className="relative mx-4 h-100 overflow-hidden rounded-xl">
          <img
            src={FALLBACK_EVENT_IMAGE}
            alt={event.title}
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-black/40" />
          <span className="absolute bottom-4 left-4 rounded-md bg-blue-600 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-white">
            {event.category || "Event"}
          </span>
        </div>

        <div className="border-b border-gray-100 px-6 pt-6 pb-4">
          <h2 className="text-xl font-bold text-gray-900">{event.title}</h2>
          <p className="mt-1 text-sm text-gray-500">
            Submitted by {event.createdBy?.department || event.createdBy?.name || "Event organizer"}
          </p>
        </div>

        {(registrationMessage || registrationError || registrationStatus) && (
          <div className="px-6 pt-5">
            {registrationMessage && (
              <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
                {registrationMessage}
              </div>
            )}
            {registrationError && (
              <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {registrationError}
              </div>
            )}
            {!registrationMessage && !registrationError && registrationStatus === "registered" && (
              <div className="rounded-xl border border-blue-200 bg-blue-50 px-4 py-3 text-sm text-blue-700">
                You are already registered for this event.
              </div>
            )}
            {!registrationMessage && !registrationError && registrationStatus === "waitlisted" && (
              <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-700">
                You are currently on the waitlist{waitlistPosition ? ` at position #${waitlistPosition}` : ""}.
              </div>
            )}
          </div>
        )}

        <div className="grid grid-cols-2 gap-x-6 gap-y-6 border-b border-gray-100 px-6 py-5">
          {detailItems.map((item) => (
            <div key={item.label} className="flex items-start gap-3">
              <div className="mt-0.5 shrink-0">{item.icon}</div>
              <div>
                <p className="mb-0.5 text-[10px] font-semibold uppercase tracking-widest text-gray-400">
                  {item.label}
                </p>
                <p className="text-sm font-semibold text-gray-900">{item.primary}</p>
                {item.isLink ? (
                  <button type="button" className="mt-0.5 text-xs font-medium text-blue-600 hover:underline">
                    {item.secondary}
                  </button>
                ) : (
                  <p className="mt-0.5 text-xs text-gray-500">{item.secondary}</p>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="px-6 py-6">
          <h3 className="mb-3 text-base font-bold text-gray-900">
            Detailed Description
          </h3>

          <p className="mb-4 text-sm leading-relaxed text-gray-600">
            {event.description || "A detailed description for this event will be published soon."}
          </p>

          <p className="mb-3 text-sm leading-relaxed text-gray-600">
            Here are a few key highlights currently available for this event:
          </p>

          <ul className="space-y-2">
            {topics.map((topic) => (
              <li key={topic} className="flex items-start gap-2 text-sm text-gray-600">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-blue-500" />
                {topic}
              </li>
            ))}
          </ul>
        </div>

        <div className="flex justify-end px-6 pb-10">
          <button
            type="button"
            onClick={handleRegister}
            disabled={isRegisterDisabled}
            className="rounded-lg bg-blue-600 px-8 py-3 text-sm font-semibold text-white transition-colors duration-150 hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-slate-300"
          >
            {registerButtonLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
