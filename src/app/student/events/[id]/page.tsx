"use client";

import { BsCalendar3, BsPeopleFill, BsPersonCircle } from "react-icons/bs";
import { MdLocationOn } from "react-icons/md";
import { FiChevronRight } from "react-icons/fi";

const topics = [
  "Introduction to Quantum Superposition",
  "Hardware Implementations of Qubits",
  "Quantum Error Correction Techniques",
  "Future Prospects of Cryptography in the Quantum Era",
];

const eventDetails = [
  {
    icon: <BsCalendar3 size={18} className="text-blue-500" />,
    label: "DATE & TIME",
    primary: "October 25, 2023",
    secondary: "10:00 AM — 02:00 PM",
  },
  {
    icon: <MdLocationOn size={20} className="text-blue-500" />,
    label: "VENUE",
    primary: "Auditorium Hall A",
    secondary: "Science Building, 3rd Floor",
  },
  {
    icon: <BsPeopleFill size={18} className="text-blue-500" />,
    label: "MAX CAPACITY",
    primary: "200 Attendees",
    secondary: "Waitlist enabled",
  },
  {
    icon: <BsPersonCircle size={18} className="text-blue-500" />,
    label: "SPEAKER",
    primary: "Dr. Sarah Jenkins",
    secondary: "View Speaker Profile",
    isLink: true,
  },
];

export default function EventDetailsReviewPage() {
  return (
    <div className="min-h-screen bg-gray-100 font-sans">
      <div className="max-full mx-auto bg-white min-h-screen shadow-sm">
        {/* Breadcrumb */}
        <div className="px-6 pt-6 pb-2 flex items-center gap-1 text-sm text-gray-500">
          <span className="hover:text-blue-600 cursor-pointer">Events</span>
          <FiChevronRight size={14} />
          <span className="text-gray-700 font-medium">Review Request</span>
        </div>

        {/* Page Title */}
        <h1 className="px-6 pb-5 text-2xl font-extrabold text-gray-900">
          Event Details Review
        </h1>

        {/* Hero Image */}
        <div className="relative mx-4 rounded-xl overflow-hidden h-100">
          <img
            src="https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&q=80"
            alt="Quantum Computing"
            className="w-full h-full  object-cover"
          />
          {/* Dark overlay */}
          <div className="absolute inset-0 bg-black/40" />
          {/* Badge */}
          <span className="absolute bottom-4 left-4 bg-blue-600 text-white text-[11px] font-bold px-3 py-1 rounded-md uppercase tracking-wider">
            Seminar
          </span>
        </div>

        {/* Event Title */}
        <div className="px-6 pt-6 pb-4 border-b border-gray-100">
          <h2 className="text-xl font-bold text-gray-900">
            Quantum Computing Seminar
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Submitted by Department of Physics
          </p>
        </div>

        {/* Event Info Grid */}
        <div className="px-6 py-5 grid grid-cols-2 gap-x-6 gap-y-6 border-b border-gray-100">
          {eventDetails.map((item) => (
            <div key={item.label} className="flex items-start gap-3">
              <div className="mt-0.5 shrink-0">{item.icon}</div>
              <div>
                <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest mb-0.5">
                  {item.label}
                </p>
                <p className="text-sm font-semibold text-gray-900">
                  {item.primary}
                </p>
                {item.isLink ? (
                  <button className="text-xs text-blue-600 font-medium hover:underline mt-0.5">
                    {item.secondary}
                  </button>
                ) : (
                  <p className="text-xs text-gray-500 mt-0.5">
                    {item.secondary}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Detailed Description */}
        <div className="px-6 py-6">
          <h3 className="text-base font-bold text-gray-900 mb-3">
            Detailed Description
          </h3>

          <p className="text-sm text-gray-600 leading-relaxed mb-4">
            This advanced seminar covers the fundamental principles of quantum
            computing, with a specific focus on quantum entanglement and qubits.
            Dr. Sarah Jenkins will explore how these concepts are
            revolutionizing the landscape of modern computational theory and
            practical applications.
          </p>

          <p className="text-sm text-gray-600 leading-relaxed mb-3">
            The session will include a live demonstration of quantum algorithms
            and a Q&A segment for graduate researchers. Topics will include:
          </p>

          <ul className="space-y-2">
            {topics.map((topic) => (
              <li
                key={topic}
                className="flex items-start gap-2 text-sm text-gray-600"
              >
                <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0" />
                {topic}
              </li>
            ))}
          </ul>
        </div>

        {/* Register Button */}
        <div className="px-6 pb-10 flex justify-end">
          <button className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-8 py-3 rounded-lg transition-colors duration-150">
            Register
          </button>
        </div>
      </div>
    </div>
  );
}
