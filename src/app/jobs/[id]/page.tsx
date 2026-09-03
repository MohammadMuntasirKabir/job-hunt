"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Trash2, Plus, ExternalLink, ChevronRight, ChevronLeft } from "lucide-react";
import Link from "next/link";
import { getJobById, updateJob, deleteJob, advanceJobStatus, recedeJobStatus } from "@/lib/storage";
import { JobApplication, JobStatus, STATUS_LABEL, STATUS_ORDER, PRIORITY_LABEL, Interview } from "@/lib/types";
import { StatusBadge, PriorityBadge } from "@/components/StatusBadge";

export default function JobDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const [job, setJob] = useState<JobApplication | null>(null);
  const [showAddInterview, setShowAddInterview] = useState(false);
  const [interviewTitle, setInterviewTitle] = useState('');
  const [interviewDate, setInterviewDate] = useState('');
  const [interviewType, setInterviewType] = useState<Interview['type']>('video');

  useEffect(() => {
    const j = getJobById(id);
    setJob(j || null);
  }, [id]);

  if (!job) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground">Job not found</p>
          <Link href="/jobs" className="mt-2 text-sm text-primary hover:underline">Back to list</Link>
        </div>
      </div>
    );
  }

  const handleDelete = () => {
    if (confirm('Delete this application?')) {
      deleteJob(id);
      router.push('/jobs');
    }
  };

  const handleAdvance = () => {
    advanceJobStatus(id);
    setJob(getJobById(id) ?? null);
  };

  const handleRecede = () => {
    recedeJobStatus(id);
    setJob(getJobById(id) ?? null);
  };

  const handleAddInterview = () => {
    if (!interviewTitle.trim() || !interviewDate) return;
    const newInterview: Interview = {
      id: `int-${Date.now()}`,
      title: interviewTitle.trim(),
      date: interviewDate,
      type: interviewType,
      completed: false,
    };
    updateJob(id, { interviews: [...job.interviews, newInterview] });
    setJob(getJobById(id) ?? null);
    setShowAddInterview(false);
    setInterviewTitle('');
    setInterviewDate('');
  };

  const toggleInterviewComplete = (interviewId: string) => {
    const updated = job.interviews.map(i =>
      i.id === interviewId ? { ...i, completed: !i.completed } : i
    );
    updateJob(id, { interviews: updated });
    setJob(getJobById(id) ?? null);
  };

  return (
    <div className="min-h-screen pb-20">
      <div className="mx-auto max-w-3xl px-4 py-8">
        {/* Header */}
        <div className="flex items-center gap-3">
          <Link href="/jobs" className="text-muted-foreground hover:text-foreground">
            <ArrowLeft className="size-5" />
          </Link>
          <div className="flex-1">
            <h1 className="text-xl font-bold">{job.position}</h1>
            <p className="text-muted-foreground">{job.company} &middot; {job.location}</p>
          </div>
          <StatusBadge status={job.status} />
        </div>

        {/* Actions */}
        <div className="mt-6 flex flex-wrap items-center gap-2">
          <button onClick={handleRecede} className="inline-flex h-8 items-center gap-1 rounded-lg border border-border bg-background px-3 text-sm font-medium hover:bg-muted">
            <ChevronLeft className="size-4" /> Move Back
          </button>
          <button onClick={handleAdvance} className="inline-flex h-8 items-center gap-1 rounded-lg border border-border bg-background px-3 text-sm font-medium hover:bg-muted">
            Move Forward <ChevronRight className="size-4" />
          </button>
          <div className="flex-1" />
          <button onClick={handleDelete} className="inline-flex h-8 items-center gap-1 rounded-lg bg-destructive/10 px-3 text-sm font-medium text-destructive hover:bg-destructive/20">
            <Trash2 className="size-4" /> Delete
          </button>
        </div>

        {/* Details */}
        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          <div className="rounded-xl border bg-card p-4">
            <h3 className="text-sm font-medium text-muted-foreground">Details</h3>
            <dl className="mt-3 space-y-2 text-sm">
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Status</dt>
                <dd><StatusBadge status={job.status} /></dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Priority</dt>
                <dd><PriorityBadge priority={job.priority} /></dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Applied</dt>
                <dd>{job.appliedDate}</dd>
              </div>
              {job.salary && (
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">Salary</dt>
                  <dd>{job.salary}</dd>
                </div>
              )}
              {job.resumeVersion && (
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">Resume</dt>
                  <dd>{job.resumeVersion}</dd>
                </div>
              )}
            </dl>
          </div>

          <div className="rounded-xl border bg-card p-4">
            <h3 className="text-sm font-medium text-muted-foreground">Links & Notes</h3>
            <div className="mt-3 space-y-2 text-sm">
              {job.jobUrl && (
                <a href={job.jobUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-primary hover:underline">
                  <ExternalLink className="size-3.5" /> Job Posting
                </a>
              )}
              {job.notes && <p className="text-muted-foreground">{job.notes}</p>}
            </div>
          </div>
        </div>

        {/* Interviews */}
        <div className="mt-8">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Interviews</h2>
            <button onClick={() => setShowAddInterview(!showAddInterview)} className="inline-flex h-8 items-center gap-1 rounded-lg bg-primary px-3 text-sm font-medium text-primary-foreground hover:bg-primary/80">
              <Plus className="size-4" /> Add
            </button>
          </div>

          {showAddInterview && (
            <div className="mt-4 rounded-xl border bg-card p-4">
              <div className="grid gap-3 sm:grid-cols-3">
                <input
                  type="text"
                  value={interviewTitle}
                  onChange={e => setInterviewTitle(e.target.value)}
                  placeholder="Interview title"
                  className="rounded-lg border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/20"
                />
                <input
                  type="date"
                  value={interviewDate}
                  onChange={e => setInterviewDate(e.target.value)}
                  className="rounded-lg border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/20"
                />
                <select
                  value={interviewType}
                  onChange={e => setInterviewType(e.target.value as Interview['type'])}
                  className="rounded-lg border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/20"
                >
                  <option value="phone">Phone</option>
                  <option value="video">Video</option>
                  <option value="onsite">On-site</option>
                  <option value="take-home">Take-home</option>
                </select>
              </div>
              <div className="mt-3 flex justify-end">
                <button onClick={handleAddInterview} className="inline-flex h-8 items-center rounded-lg bg-primary px-3 text-sm font-medium text-primary-foreground hover:bg-primary/80">
                  Add Interview
                </button>
              </div>
            </div>
          )}

          {job.interviews.length === 0 ? (
            <p className="mt-4 text-sm text-muted-foreground">No interviews scheduled</p>
          ) : (
            <div className="mt-4 space-y-2">
              {job.interviews.map(interview => (
                <div key={interview.id} className="flex items-center gap-3 rounded-lg border bg-card p-3">
                  <input
                    type="checkbox"
                    checked={interview.completed}
                    onChange={() => toggleInterviewComplete(interview.id)}
                    className="size-4 rounded border-gray-300"
                  />
                  <div className="flex-1">
                    <p className={`text-sm font-medium ${interview.completed ? 'line-through text-muted-foreground' : ''}`}>
                      {interview.title}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {interview.date} &middot; {interview.type}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
