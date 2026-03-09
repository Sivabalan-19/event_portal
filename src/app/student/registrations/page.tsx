"use client";

import { useMemo, useState } from "react";
import { Input, RegistrationCard } from "@/components";
import SectionTitle from "@/components/sectionTitle";
import { BsSearch } from "react-icons/bs";
import { FiCompass, FiPlus } from "react-icons/fi";

type RegistrationTab = "upcoming" | "past" | "waitlisted";

type RegistrationItem = {
	id: number;
	image: string;
	title: string;
	reference: string;
	date: string;
	time: string;
	location: string;
	tab: RegistrationTab;
	status: "registered" | "waitlisted";
	waitlistPosition?: number;
	primaryActionLabel: string;
	secondaryActionLabel?: string;
};

const registrationTabs: Array<{ key: RegistrationTab; label: string }> = [
	{ key: "upcoming", label: "Upcoming" },
	{ key: "past", label: "Past" },
	{ key: "waitlisted", label: "Waitlisted" },
];

const registrations: RegistrationItem[] = [
	{
		id: 1,
		image:
			"https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=900&q=80",
		title: "Annual Tech Symposium 2024",
		reference: "RE-40291",
		date: "Oct 24, 2024",
		time: "10:00 AM",
		location: "Main Auditorium, Engineering Block",
		tab: "upcoming",
		status: "registered",
		primaryActionLabel: "View Ticket",
	},
	{
		id: 2,
		image:
			"https://images.unsplash.com/photo-1516321497487-e288fb19713f?w=900&q=80",
		title: "Workshop: UI/UX Design Basics",
		reference: "RE-40552",
		date: "Oct 28, 2024",
		time: "02:00 PM",
		location: "Design Lab 1, Arts Wing",
		tab: "upcoming",
		status: "registered",
		primaryActionLabel: "View Ticket",
	},
	{
		id: 3,
		image:
			"https://images.unsplash.com/photo-1543269865-cbf427effbad?w=900&q=80",
		title: "Global AI Summit: Student Edition",
		reference: "RE-41003",
		date: "Nov 05, 2024",
		time: "09:30 AM",
		location: "Virtual Session, Zoom Room A",
		tab: "waitlisted",
		status: "waitlisted",
		waitlistPosition: 4,
		primaryActionLabel: "Ticket Pending",
		secondaryActionLabel: "Cancel Request",
	},
	{
		id: 4,
		image:
			"https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=900&q=80",
		title: "Career Readiness Bootcamp",
		reference: "RE-38174",
		date: "Sep 12, 2024",
		time: "11:30 AM",
		location: "Placement Cell Auditorium",
		tab: "past",
		status: "registered",
		primaryActionLabel: "View Summary",
	},
	{
		id: 5,
		image:
			"https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=900&q=80",
		title: "Startup Mixer and Founder Talk",
		reference: "RE-37912",
		date: "Aug 29, 2024",
		time: "04:30 PM",
		location: "Innovation Hub, Block C",
		tab: "past",
		status: "registered",
		primaryActionLabel: "View Summary",
	},
	{
		id: 6,
		image:
			"https://images.unsplash.com/photo-1511578314322-379afb476865?w=900&q=80",
		title: "Product Strategy Masterclass",
		reference: "RE-41721",
		date: "Nov 19, 2024",
		time: "03:00 PM",
		location: "Management Hall, Room 4",
		tab: "upcoming",
		status: "registered",
		primaryActionLabel: "View Ticket",
	},
];

export default function StudentRegistrationsPage() {
	const [activeTab, setActiveTab] = useState<RegistrationTab>("upcoming");
	const [searchTerm, setSearchTerm] = useState("");

	const tabCounts = useMemo(() => {
		return registrationTabs.reduce(
			(acc, tab) => {
				acc[tab.key] = registrations.filter((item) => item.tab === tab.key).length;
				return acc;
			},
			{
				upcoming: 0,
				past: 0,
				waitlisted: 0,
			} as Record<RegistrationTab, number>,
		);
	}, []);

	const filteredRegistrations = useMemo(() => {
		const normalizedSearch = searchTerm.trim().toLowerCase();

		return registrations.filter((item) => {
			const matchesTab = item.tab === activeTab;
			const matchesSearch =
				normalizedSearch.length === 0 ||
				item.title.toLowerCase().includes(normalizedSearch) ||
				item.location.toLowerCase().includes(normalizedSearch) ||
				item.reference.toLowerCase().includes(normalizedSearch);

			return matchesTab && matchesSearch;
		});
	}, [activeTab, searchTerm]);

	return (
		<div className="min-h-screen bg-slate-100 px-6 py-8 font-sans">
			<div className="space-y-7">
				<div className="flex flex-col gap-5 xl:flex-row xl:items-start xl:justify-between">
					<SectionTitle
						title="My Registrations"
						description="Track your involvement in campus activities and workshops."
					/>

					<div className="flex w-full flex-col gap-3 sm:flex-row xl:w-auto">
						<div className="min-w-0 flex-1 sm:min-w-[320px] xl:w-[320px]">
							<Input
								id="registration-search"
								label=""
								value={searchTerm}
								onChange={(e) => setSearchTerm(e.target.value)}
								placeholder="Search events..."
								icon={<BsSearch size={14} className="text-slate-400" />}
							/>
						</div>
						<button
							type="button"
							className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3.5 text-sm font-semibold text-white shadow-sm shadow-blue-200 transition-colors hover:bg-blue-700"
						>
							<FiPlus size={16} />
							Find New Events
						</button>
					</div>
				</div>

				<div className="border-b border-slate-200">
					<div className="flex flex-wrap gap-7">
						{registrationTabs.map((tab) => {
							const isActive = activeTab === tab.key;

							return (
								<button
									key={tab.key}
									type="button"
									onClick={() => setActiveTab(tab.key)}
									className={`-mb-px border-b-2 px-1 pb-3 text-sm font-semibold transition-colors ${
										isActive
											? "border-blue-500 text-blue-600"
											: "border-transparent text-slate-400 hover:text-slate-600"
									}`}
								>
									{tab.label} ({tabCounts[tab.key]})
								</button>
							);
						})}
					</div>
				</div>

				<div className="grid grid-cols-1 gap-5 2xl:grid-cols-2">
					{filteredRegistrations.map((registration) => (
						<RegistrationCard key={registration.id} {...registration} />
					))}

					<div className="flex min-h-41 flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-slate-50/70 px-6 text-center">
						<div className="mb-4 flex h-11 w-11 items-center justify-center rounded-full border border-slate-300 bg-white text-slate-500">
							<FiCompass size={18} />
						</div>
						<h3 className="text-2xl font-bold tracking-tight text-slate-800">
							Discover more events
						</h3>
						<p className="mt-2 max-w-sm text-sm text-slate-500">
							More workshops and seminars are being added every day.
						</p>
					</div>
				</div>
			</div>
		</div>
	);
}
