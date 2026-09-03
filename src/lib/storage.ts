import { useSyncExternalStore } from "react";
import type { JobApplication, JobStatus } from "./types";
import { STATUS_ORDER } from "./types";

export const STORAGE_KEY = "job-hunt:jobs";
export const EVENT_NAME = "job-hunt:storage";

let jobsCache: JobApplication[] | null = null;
let lastRaw: string | null = null;

function readJobs(): JobApplication[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (raw === lastRaw && jobsCache !== null) return jobsCache;
    lastRaw = raw;
    jobsCache = raw ? (JSON.parse(raw) as JobApplication[]) : [];
    return jobsCache;
  } catch {
    return [];
  }
}

function persistJobs(jobs: JobApplication[]): void {
  jobsCache = jobs;
  lastRaw = JSON.stringify(jobs);
  try {
    window.localStorage.setItem(STORAGE_KEY, lastRaw);
  } catch {
    // localStorage unavailable (private mode / quota) – stay in-memory
  }
  window.dispatchEvent(new Event(EVENT_NAME));
}

function subscribe(callback: () => void): () => void {
  if (typeof window === "undefined") return () => {};
  window.addEventListener(EVENT_NAME, callback);
  window.addEventListener("storage", callback);
  return () => {
    window.removeEventListener(EVENT_NAME, callback);
    window.removeEventListener("storage", callback);
  };
}

function getSnapshot(): JobApplication[] {
  return readJobs();
}

function getServerSnapshot(): JobApplication[] {
  return [];
}

export function getJobs(): JobApplication[] {
  return readJobs();
}

export function getJobById(id: string): JobApplication | undefined {
  return readJobs().find((job) => job.id === id);
}

export function addJob(job: JobApplication): void {
  persistJobs([job, ...readJobs()]);
}

export function updateJob(id: string, patch: Partial<JobApplication>): void {
  persistJobs(
    readJobs().map((job) =>
      job.id === id
        ? { ...job, ...patch, updatedAt: new Date().toISOString() }
        : job,
    ),
  );
}

export function deleteJob(id: string): void {
  persistJobs(readJobs().filter((job) => job.id !== id));
}

export function setJobStatus(id: string, status: JobStatus): void {
  updateJob(id, { status });
}

export function advanceJobStatus(id: string): void {
  const job = getJobById(id);
  if (!job) return;
  const index = STATUS_ORDER.indexOf(job.status);
  const next = STATUS_ORDER[index + 1];
  if (next) updateJob(id, { status: next });
}

export function recedeJobStatus(id: string): void {
  const job = getJobById(id);
  if (!job) return;
  const index = STATUS_ORDER.indexOf(job.status);
  const prev = STATUS_ORDER[index - 1];
  if (prev) updateJob(id, { status: prev });
}

export function clearJobs(): void {
  persistJobs([]);
}

export function seedDemoJobs(): void {
  if (getJobs().length > 0) return;
  const now = new Date();
  const iso = now.toISOString();
  const daysAgo = (n: number) => {
    const d = new Date(now);
    d.setDate(d.getDate() - n);
    return d.toISOString().slice(0, 10);
  };
  const daysFromNow = (n: number) => {
    const d = new Date(now);
    d.setDate(d.getDate() + n);
    return d.toISOString().slice(0, 10);
  };

  const demo: JobApplication[] = [
    {
      id: "demo-1",
      company: "Vercel",
      position: "Frontend Engineer",
      location: "Remote (US)",
      salary: "$160k – $190k",
      status: "technical",
      appliedDate: daysAgo(12),
      jobUrl: "https://vercel.com/careers",
      notes:
        "Referred by Alex. Tech round scheduled after a great phone screen. Need to brush up on caching strategies.",
      priority: "high",
      resumeVersion: "v3",
      interviews: [
        {
          id: "i-1",
          title: "Phone screen",
          date: daysAgo(8),
          time: "10:00",
          location: "Zoom",
          type: "video",
          notes: "Talked through past projects, went well.",
          completed: true,
        },
        {
          id: "i-2",
          title: "Technical interview",
          date: daysFromNow(2),
          time: "13:00",
          location: "Zoom",
          type: "video",
          notes: "System design + coding.",
          completed: false,
        },
      ],
      createdAt: iso,
      updatedAt: iso,
    },
    {
      id: "demo-2",
      company: "Stripe",
      position: "Product Engineer",
      location: "San Francisco, CA",
      salary: "$175k – $210k",
      status: "phone-screen",
      appliedDate: daysAgo(6),
      jobUrl: "https://stripe.com/jobs",
      notes: "Follow up if no response by next week.",
      priority: "medium",
      resumeVersion: "v3",
      interviews: [
        {
          id: "i-3",
          title: "Recruiter call",
          date: daysFromNow(4),
          time: "09:30",
          location: "Phone",
          type: "phone",
          completed: false,
        },
      ],
      createdAt: iso,
      updatedAt: iso,
    },
    {
      id: "demo-3",
      company: "Linear",
      position: "Design Engineer",
      location: "Remote (Europe)",
      salary: "€95k – €120k",
      status: "offer",
      appliedDate: daysAgo(25),
      jobUrl: "https://linear.app/careers",
      notes: "Offer received! Negotiating on start date.",
      priority: "high",
      resumeVersion: "v2",
      interviews: [
        {
          id: "i-4",
          title: "Final round",
          date: daysAgo(6),
          time: "14:00",
          location: "Zoom",
          type: "video",
          completed: true,
        },
      ],
      createdAt: iso,
      updatedAt: iso,
    },
    {
      id: "demo-4",
      company: "Notion",
      position: "Senior Frontend Engineer",
      location: "New York, NY",
      salary: "$180k – $220k",
      status: "rejected",
      appliedDate: daysAgo(18),
      jobUrl: "https://notion.so/careers",
      notes: "Rejected after final round. Great experience, keep in touch with recruiter.",
      priority: "low",
      resumeVersion: "v2",
      interviews: [
        {
          id: "i-5",
          title: "Take-home assignment",
          date: daysAgo(10),
          location: "Async",
          type: "take-home",
          completed: true,
        },
      ],
      createdAt: iso,
      updatedAt: iso,
    },
    {
      id: "demo-5",
      company: "Figma",
      position: "UI Engineer",
      location: "Remote",
      salary: "$170k – $195k",
      status: "applied",
      appliedDate: daysAgo(3),
      jobUrl: "https://figma.com/careers",
      notes: "Applied via referral from Maya.",
      priority: "medium",
      resumeVersion: "v3",
      interviews: [],
      createdAt: iso,
      updatedAt: iso,
    },
  ];

  persistJobs(demo);
}

export function useJobs(): JobApplication[] {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
