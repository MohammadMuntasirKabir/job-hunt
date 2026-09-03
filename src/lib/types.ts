export type JobStatus =
  | "applied"
  | "phone-screen"
  | "technical"
  | "offer"
  | "rejected";

export type JobPriority = "low" | "medium" | "high";

export type InterviewType = "phone" | "video" | "onsite" | "take-home";

export interface Interview {
  id: string;
  title: string;
  date: string;
  time?: string;
  location?: string;
  type: InterviewType;
  notes?: string;
  completed: boolean;
}

export interface JobApplication {
  id: string;
  company: string;
  position: string;
  location: string;
  salary?: string;
  status: JobStatus;
  appliedDate: string;
  jobUrl?: string;
  notes?: string;
  priority: JobPriority;
  resumeVersion?: string;
  interviews: Interview[];
  createdAt: string;
  updatedAt: string;
}

export interface JobStats {
  total: number;
  active: number;
  phoneScreen: number;
  technical: number;
  offers: number;
  rejections: number;
  upcomingInterviews: number;
  responseRate: number;
}

export interface StatusMeta {
  value: JobStatus;
  label: string;
  /** Tailwind classes for the pill/badge */
  badge: string;
  /** Tailwind classes for a solid dot */
  dot: string;
  /** Tailwind classes for column headers / accents */
  accent: string;
}

export const JOB_STATUSES: StatusMeta[] = [
  {
    value: "applied",
    label: "Applied",
    badge:
      "bg-sky-100 text-sky-700 ring-sky-200 dark:bg-sky-500/10 dark:text-sky-300 dark:ring-sky-500/20",
    dot: "bg-sky-500",
    accent: "bg-sky-500",
  },
  {
    value: "phone-screen",
    label: "Phone Screen",
    badge:
      "bg-amber-100 text-amber-700 ring-amber-200 dark:bg-amber-500/10 dark:text-amber-300 dark:ring-amber-500/20",
    dot: "bg-amber-500",
    accent: "bg-amber-500",
  },
  {
    value: "technical",
    label: "Technical",
    badge:
      "bg-violet-100 text-violet-700 ring-violet-200 dark:bg-violet-500/10 dark:text-violet-300 dark:ring-violet-500/20",
    dot: "bg-violet-500",
    accent: "bg-violet-500",
  },
  {
    value: "offer",
    label: "Offer",
    badge:
      "bg-emerald-100 text-emerald-700 ring-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-300 dark:ring-emerald-500/20",
    dot: "bg-emerald-500",
    accent: "bg-emerald-500",
  },
  {
    value: "rejected",
    label: "Rejected",
    badge:
      "bg-rose-100 text-rose-700 ring-rose-200 dark:bg-rose-500/10 dark:text-rose-300 dark:ring-rose-500/20",
    dot: "bg-rose-500",
    accent: "bg-rose-500",
  },
];

export const STATUS_META: Record<JobStatus, StatusMeta> = Object.fromEntries(
  JOB_STATUSES.map((s) => [s.value, s]),
) as Record<JobStatus, StatusMeta>;

export const STATUS_ORDER: JobStatus[] = JOB_STATUSES.map((s) => s.value);

export const STATUS_LABEL: Record<JobStatus, string> = Object.fromEntries(
  JOB_STATUSES.map((s) => [s.value, s.label]),
) as Record<JobStatus, string>;

export const PRIORITY_LABEL: Record<JobPriority, string> = {
  low: "Low",
  medium: "Medium",
  high: "High",
};

export const PRIORITY_META: Record<
  JobPriority,
  { label: string; badge: string; dot: string }
> = {
  low: {
    label: "Low",
    badge:
      "bg-slate-100 text-slate-600 ring-slate-200 dark:bg-slate-500/10 dark:text-slate-300 dark:ring-slate-500/20",
    dot: "bg-slate-400",
  },
  medium: {
    label: "Medium",
    badge:
      "bg-amber-100 text-amber-700 ring-amber-200 dark:bg-amber-500/10 dark:text-amber-300 dark:ring-amber-500/20",
    dot: "bg-amber-500",
  },
  high: {
    label: "High",
    badge:
      "bg-rose-100 text-rose-700 ring-rose-200 dark:bg-rose-500/10 dark:text-rose-300 dark:ring-rose-500/20",
    dot: "bg-rose-500",
  },
};

export const INTERVIEW_TYPE_LABEL: Record<InterviewType, string> = {
  phone: "Phone",
  video: "Video",
  onsite: "On-site",
  "take-home": "Take-home",
};

export const INTERVIEW_TYPES: InterviewType[] = [
  "phone",
  "video",
  "onsite",
  "take-home",
];

export const RESUME_VERSIONS = ["v1", "v2", "v3", "v4"];

export function isInterviewDateInPast(interview: Interview): boolean {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const date = new Date(`${interview.date}T00:00:00`);
  return date.getTime() < today.getTime();
}

export function countJobStats(jobs: JobApplication[]): JobStats {
  const counts = Object.fromEntries(
    STATUS_ORDER.map((s) => [s, 0]),
  ) as Record<JobStatus, number>;

  for (const job of jobs) {
    counts[job.status] += 1;
  }

  const total = jobs.length;
  const decided = counts.offer + counts.rejected;
  const responseRate = total > 0 ? Math.round((decided / total) * 100) : 0;

  const upcomingInterviews = jobs.reduce(
    (acc, job) =>
      acc +
      job.interviews.filter((interview) => !interview.completed).length,
    0,
  );

  return {
    total,
    active: counts.applied + counts["phone-screen"] + counts.technical,
    phoneScreen: counts["phone-screen"],
    technical: counts.technical,
    offers: counts.offer,
    rejections: counts.rejected,
    upcomingInterviews,
    responseRate,
  };
}
