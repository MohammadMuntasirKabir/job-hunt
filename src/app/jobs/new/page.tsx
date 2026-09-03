"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { addJob } from "@/lib/storage";
import { JobStatus, JobPriority, STATUS_LABEL, STATUS_ORDER, PRIORITY_LABEL, RESUME_VERSIONS } from "@/lib/types";

export default function NewJobPage() {
  const router = useRouter();
  const [company, setCompany] = useState('');
  const [position, setPosition] = useState('');
  const [location, setLocation] = useState('');
  const [salary, setSalary] = useState('');
  const [jobUrl, setJobUrl] = useState('');
  const [notes, setNotes] = useState('');
  const [status, setStatus] = useState<JobStatus>('applied');
  const [priority, setPriority] = useState<JobPriority>('medium');
  const [resumeVersion, setResumeVersion] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!company.trim() || !position.trim()) return;

    const now = new Date().toISOString();
    addJob({
      id: `job-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      company: company.trim(),
      position: position.trim(),
      location: location.trim(),
      salary: salary.trim() || undefined,
      status,
      appliedDate: now.slice(0, 10),
      jobUrl: jobUrl.trim() || undefined,
      notes: notes.trim() || undefined,
      priority,
      resumeVersion: resumeVersion || undefined,
      interviews: [],
      createdAt: now,
      updatedAt: now,
    });

    router.push('/jobs');
  };

  return (
    <div className="min-h-screen pb-20">
      <div className="mx-auto max-w-2xl px-4 py-12">
        <h1 className="text-2xl font-bold">Add Application</h1>
        <p className="mt-1 text-sm text-muted-foreground">Track a new job application</p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-sm font-medium">Company *</label>
              <input
                type="text"
                value={company}
                onChange={e => setCompany(e.target.value)}
                placeholder="e.g. Vercel"
                required
                className="w-full rounded-lg border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium">Position *</label>
              <input
                type="text"
                value={position}
                onChange={e => setPosition(e.target.value)}
                placeholder="e.g. Frontend Engineer"
                required
                className="w-full rounded-lg border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-sm font-medium">Location</label>
              <input
                type="text"
                value={location}
                onChange={e => setLocation(e.target.value)}
                placeholder="e.g. Remote"
                className="w-full rounded-lg border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium">Salary Range</label>
              <input
                type="text"
                value={salary}
                onChange={e => setSalary(e.target.value)}
                placeholder="e.g. $150k – $180k"
                className="w-full rounded-lg border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium">Job URL</label>
            <input
              type="url"
              value={jobUrl}
              onChange={e => setJobUrl(e.target.value)}
              placeholder="https://..."
              className="w-full rounded-lg border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <div>
              <label className="mb-1.5 block text-sm font-medium">Status</label>
              <select
                value={status}
                onChange={e => setStatus(e.target.value as JobStatus)}
                className="w-full rounded-lg border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/20"
              >
                {STATUS_ORDER.map(s => (
                  <option key={s} value={s}>{STATUS_LABEL[s]}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium">Priority</label>
              <select
                value={priority}
                onChange={e => setPriority(e.target.value as JobPriority)}
                className="w-full rounded-lg border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/20"
              >
                {(['low', 'medium', 'high'] as JobPriority[]).map(p => (
                  <option key={p} value={p}>{PRIORITY_LABEL[p]}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium">Resume Version</label>
              <select
                value={resumeVersion}
                onChange={e => setResumeVersion(e.target.value)}
                className="w-full rounded-lg border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/20"
              >
                <option value="">Select...</option>
                {RESUME_VERSIONS.map(v => (
                  <option key={v} value={v}>{v}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium">Notes</label>
            <textarea
              value={notes}
              onChange={e => setNotes(e.target.value)}
              placeholder="Add any notes about this application..."
              rows={4}
              className="w-full resize-y rounded-lg border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>

          <div className="flex justify-end gap-3">
            <button type="button" onClick={() => router.back()} className="inline-flex h-9 items-center rounded-lg border border-border bg-background px-4 text-sm font-medium hover:bg-muted">
              Cancel
            </button>
            <button type="submit" className="inline-flex h-9 items-center rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground hover:bg-primary/80">
              Add Application
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
