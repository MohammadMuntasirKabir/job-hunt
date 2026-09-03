"use client";

import { useState } from "react";
import { Plus, Search, Download, Filter } from "lucide-react";
import Link from "next/link";
import { useJobs } from "@/lib/storage";
import { JobStatus, STATUS_LABEL, STATUS_ORDER } from "@/lib/types";
import JobCard from "@/components/JobCard";
import { exportToCSV } from "@/lib/export";

export default function JobsPage() {
  const jobs = useJobs();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<JobStatus | 'all'>('all');

  const filtered = jobs
    .filter(j => statusFilter === 'all' || j.status === statusFilter)
    .filter(j =>
      search === '' ||
      j.company.toLowerCase().includes(search.toLowerCase()) ||
      j.position.toLowerCase().includes(search.toLowerCase())
    );

  return (
    <div className="min-h-screen pb-20">
      <div className="border-b">
        <div className="mx-auto max-w-6xl px-4 py-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-2xl font-bold">Applications</h1>
              <p className="mt-1 text-sm text-muted-foreground">{jobs.length} total applications</p>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={() => exportToCSV(jobs)} className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-border bg-background px-3 text-sm font-medium transition-all hover:bg-muted">
                <Download className="size-4" />
                <span className="hidden sm:inline">Export CSV</span>
              </button>
              <Link href="/jobs/new" className="inline-flex h-9 items-center gap-1.5 rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground hover:bg-primary/80">
                <Plus className="size-4" />
                <span>Add</span>
              </Link>
            </div>
          </div>

          {/* Search & Filter */}
          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search by company or position..."
                className="w-full rounded-lg border bg-background py-2 pl-10 pr-4 text-sm outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>
            <div className="flex gap-1 overflow-x-auto">
              <button
                onClick={() => setStatusFilter('all')}
                className={`inline-flex h-8 items-center rounded-lg px-3 text-sm font-medium whitespace-nowrap transition-all ${statusFilter === 'all' ? 'bg-primary text-primary-foreground' : 'border border-border bg-background hover:bg-muted'}`}
              >
                All
              </button>
              {STATUS_ORDER.map(status => (
                <button
                  key={status}
                  onClick={() => setStatusFilter(status)}
                  className={`inline-flex h-8 items-center rounded-lg px-3 text-sm font-medium whitespace-nowrap transition-all ${statusFilter === status ? 'bg-primary text-primary-foreground' : 'border border-border bg-background hover:bg-muted'}`}
                >
                  {STATUS_LABEL[status]}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-4 py-8">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <Filter className="size-10 text-muted-foreground" />
            <p className="mt-3 font-medium">No applications found</p>
            <p className="text-sm text-muted-foreground">Try adjusting your search or filter</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map(job => (
              <JobCard key={job.id} job={job} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
