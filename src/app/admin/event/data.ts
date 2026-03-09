export type ReviewStatus = "Pending" | "Approved" | "Needs Changes" | "Rejected";

export type EventReview = {
	id: number;
	title: string;
	organizer: string;
	category: string;
	date: string;
	time: string;
	venue: string;
	expectedAttendees: number;
	submittedBy: string;
	submittedAt: string;
	status: ReviewStatus;
	note: string;
	description: string;
	checklist: string[];
	speaker: string;
	capacityNote: string;
	image:
		| string;
};

export const eventReviews: EventReview[] = [
	{
		id: 1,
		title: "AI Innovation Summit 2026",
		organizer: "Computer Science Department",
		category: "Technology",
		date: "Mar 18, 2026",
		time: "10:00 AM - 3:00 PM",
		venue: "Main Auditorium",
		expectedAttendees: 420,
		submittedBy: "Prof. Maria Holt",
		submittedAt: "2 hours ago",
		status: "Pending",
		note: "External keynote speakers included. Requires final admin sign-off.",
		description:
			"A full-day summit focused on practical AI research, product innovation, and academic-industry collaboration. The faculty team has requested priority review because external guests and media coverage are already confirmed.",
		checklist: [
			"Keynote speaker list uploaded",
			"Budget request approved by department",
			"Media team notified for coverage",
			"Waiting for final admin approval",
		],
		speaker: "Dr. Sarah Jenkins",
		capacityNote: "Open registration with overflow seating enabled",
		image:
			"https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=1200&q=80",
	},
	{
		id: 2,
		title: "Entrepreneurship Bootcamp",
		organizer: "Innovation Cell",
		category: "Business",
		date: "Mar 21, 2026",
		time: "9:30 AM - 1:30 PM",
		venue: "Seminar Hall B",
		expectedAttendees: 180,
		submittedBy: "Rahul Menon",
		submittedAt: "5 hours ago",
		status: "Pending",
		note: "Budget sheet uploaded. Waiting for venue allocation confirmation.",
		description:
			"This bootcamp is designed for students building early-stage startups. It includes pitch reviews, a funding panel, and mentor office hours run by local founders.",
		checklist: [
			"Mentor list uploaded",
			"Workshop flow approved by faculty",
			"Venue confirmation pending",
			"Need final admin review",
		],
		speaker: "Anika Patel",
		capacityNote: "Seating arranged classroom-style for breakout sessions",
		image:
			"https://images.unsplash.com/photo-1552664730-d307ca884978?w=1200&q=80",
	},
	{
		id: 3,
		title: "Campus Design Showcase",
		organizer: "Design Club",
		category: "Exhibition",
		date: "Mar 25, 2026",
		time: "1:00 PM - 6:00 PM",
		venue: "Creative Studio Wing",
		expectedAttendees: 240,
		submittedBy: "Aisha Khan",
		submittedAt: "Yesterday",
		status: "Needs Changes",
		note: "The floor plan and safety approval documents still need updates.",
		description:
			"A curated showcase of student design projects across product, visual communication, and experiential design. The admin team requested venue and safety revisions before approval.",
		checklist: [
			"Project list uploaded",
			"Print collateral approved",
			"Safety plan needs revision",
			"Updated floor layout required",
		],
		speaker: "Faculty Jury Panel",
		capacityNote: "Standing exhibition with timed walkthrough batches",
		image:
			"https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=1200&q=80",
	},
	{
		id: 4,
		title: "Women in Leadership Forum",
		organizer: "Management Department",
		category: "Leadership",
		date: "Mar 28, 2026",
		time: "11:00 AM - 4:00 PM",
		venue: "Conference Center",
		expectedAttendees: 300,
		submittedBy: "Dr. Nidhi Sharma",
		submittedAt: "Yesterday",
		status: "Approved",
		note: "Approved after sponsor confirmation and final agenda upload.",
		description:
			"A leadership forum spotlighting women founders, executives, and researchers. The event includes keynote sessions, student networking, and a moderated Q&A.",
		checklist: [
			"Agenda uploaded",
			"Sponsors confirmed",
			"AV setup approved",
			"Event cleared for publishing",
		],
		speaker: "Panel of 5 industry leaders",
		capacityNote: "Reserved rows for invited guests and sponsors",
		image:
			"https://images.unsplash.com/photo-1511578314322-379afb476865?w=1200&q=80",
	},
	{
		id: 5,
		title: "Night Coding Marathon",
		organizer: "Developer Community",
		category: "Hackathon",
		date: "Apr 02, 2026",
		time: "6:00 PM - 6:00 AM",
		venue: "Innovation Lab",
		expectedAttendees: 150,
		submittedBy: "Kevin George",
		submittedAt: "2 days ago",
		status: "Rejected",
		note: "Security and overnight supervision requirements were not met.",
		description:
			"An overnight coding event proposed for teams building rapid prototypes. The request was rejected because the submission did not include required supervision and security coverage details.",
		checklist: [
			"Theme and judging plan uploaded",
			"Mentor list pending",
			"Security request missing",
			"Overnight supervision not approved",
		],
		speaker: "Internal mentors",
		capacityNote: "24-hour lab access requested but not approved",
		image:
			"https://images.unsplash.com/photo-1515879218367-8466d910aaa4?w=1200&q=80",
	},
	{
		id: 6,
		title: "Green Campus Action Day",
		organizer: "Eco Society",
		category: "Community",
		date: "Apr 05, 2026",
		time: "8:00 AM - 12:00 PM",
		venue: "North Lawn",
		expectedAttendees: 260,
		submittedBy: "Sana Yusuf",
		submittedAt: "3 days ago",
		status: "Pending",
		note: "Volunteer list is ready. Awaiting final logistics review.",
		description:
			"A campus-wide volunteer event combining clean-up activities, sustainability exhibits, and community partnerships with local environmental groups.",
		checklist: [
			"Volunteer list uploaded",
			"Partner NGOs confirmed",
			"Logistics pending review",
			"Awaiting admin decision",
		],
		speaker: "Community sustainability partners",
		capacityNote: "Outdoor setup with emergency shade tents requested",
		image:
			"https://images.unsplash.com/photo-1497493292307-31c376b6e479?w=1200&q=80",
	},
];

export const statusClasses: Record<ReviewStatus, string> = {
	Pending: "bg-amber-100 text-amber-700",
	Approved: "bg-emerald-100 text-emerald-700",
	"Needs Changes": "bg-blue-100 text-blue-700",
	Rejected: "bg-rose-100 text-rose-700",
};
