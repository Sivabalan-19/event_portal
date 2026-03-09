import { BsCalendar3, BsThreeDotsVertical } from "react-icons/bs";
import { FiArrowUpRight } from "react-icons/fi";
import { MdLocationOn } from "react-icons/md";

type RegistrationStatus = "registered" | "waitlisted";

type RegistrationCardProps = {
  image: string;
  title: string;
  reference: string;
  date: string;
  time: string;
  location: string;
  status: RegistrationStatus;
  waitlistPosition?: number;
  primaryActionLabel: string;
  secondaryActionLabel?: string;
};

const statusStyles: Record<
  RegistrationStatus,
  { badgeClass: string; primaryActionClass: string }
> = {
  registered: {
    badgeClass: "bg-emerald-100 text-emerald-700",
    primaryActionClass: "text-blue-600 hover:text-blue-700",
  },
  waitlisted: {
    badgeClass: "bg-amber-100 text-amber-700",
    primaryActionClass: "text-slate-400 hover:text-slate-500",
  },
};

export type { RegistrationCardProps, RegistrationStatus };

export default function RegistrationCard({
  image,
  title,
  reference,
  date,
  time,
  location,
  status,
  waitlistPosition,
  primaryActionLabel,
  secondaryActionLabel,
}: RegistrationCardProps) {
  const statusLabel =
    status === "waitlisted" && waitlistPosition
      ? `WAITLISTED (POS. ${waitlistPosition})`
      : "REGISTERED";

  return (
    <article className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm shadow-slate-200/70 transition-transform duration-200 hover:-translate-y-0.5">
      <div className="grid min-h-41 grid-cols-1 sm:grid-cols-[145px_1fr]">
        <div className="relative min-h-37 bg-slate-200 sm:min-h-full">
          <img src={image} alt={title} className="h-full w-full object-cover" />
        </div>

        <div className="flex flex-col justify-between p-5">
          <div className="space-y-3">
            <div className="flex items-start justify-between gap-3">
              <div className="flex flex-wrap items-center gap-2">
                <span
                  className={`rounded-md px-2 py-1 text-[10px] font-bold tracking-wide ${statusStyles[status].badgeClass}`}
                >
                  {statusLabel}
                </span>
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="max-w-[18ch] text-xl font-bold leading-[1.05] tracking-tight text-slate-900 ">
                {title}
              </h3>
              <div className="space-y-1.5 text-sm text-slate-500">
                <div className="flex items-center gap-2">
                  <BsCalendar3 size={13} className="text-slate-400" />
                  <span>
                    {date} • {time}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <MdLocationOn size={15} className="text-slate-400" />
                  <span>{location}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
            <button
              type="button"
              className={`inline-flex items-center gap-1 text-sm font-semibold transition-colors ${statusStyles[status].primaryActionClass}`}
            >
              {primaryActionLabel}
              {status === "registered" && <FiArrowUpRight size={14} />}
            </button>
            {secondaryActionLabel && (
              <button
                type="button"
                className="text-sm font-semibold text-rose-500 transition-colors hover:text-rose-600"
              >
                {secondaryActionLabel}
              </button>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}
