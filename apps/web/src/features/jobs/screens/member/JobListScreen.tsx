import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, SlidersHorizontal, Briefcase } from 'lucide-react'
import { CATEGORIES } from '@worklink/constants'
import type { CategoryId } from '@worklink/types'
import { useJobsStore } from '@worklink/state'
import { Button, Card, Input, Tabs, EmptyState, JobCard, Chips } from '../../../../app/ui'
import { BUDGET_PRESETS, LOCATION_PRESETS } from '@worklink/constants'

const categoryOptions = [{ value: 'all', label: 'All' }, ...CATEGORIES.map((c) => ({ value: c.id, label: c.label }))]

export function JobListScreen() {
  const navigate = useNavigate()
  const jobs = useJobsStore((s) => s.jobs)
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState<CategoryId | 'all'>('all')
  const [location, setLocation] = useState('')
  const [budgetMax, setBudgetMax] = useState(0)
  const [showFilters, setShowFilters] = useState(false)

  const openJobs = useMemo(() => {
    let list = jobs.filter((j) => j.status === 'open' || j.status === 'reviewing')
    if (search.trim()) {
      const q = search.toLowerCase()
      list = list.filter((j) => j.title.toLowerCase().includes(q) || j.description.toLowerCase().includes(q))
    }
    if (category !== 'all') list = list.filter((j) => j.category === category)
    if (location.trim()) list = list.filter((j) => j.location.toLowerCase().includes(location.toLowerCase()))
    if (budgetMax > 0) list = list.filter((j) => j.budget.amount <= budgetMax)
    return list.sort((a, b) => b.createdAt.localeCompare(a.createdAt))
  }, [jobs, search, category, location, budgetMax])

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-ink-strong lg:text-3xl">Find Jobs</h1>
          <p className="mt-1 text-ink-soft">{openJobs.length} job{openJobs.length !== 1 ? 's' : ''} available</p>
        </div>
        <Button variant="secondary" onClick={() => setShowFilters((v) => !v)}>
          <SlidersHorizontal className="h-4 w-4" /> Filters
        </Button>
      </div>

      <div className="mt-4">
        <Input
          placeholder="Search by title or description..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-md"
        />
      </div>

      <div className="mt-4">
        <Tabs
          options={categoryOptions}
          value={category}
          onChange={(v) => setCategory(v as CategoryId | 'all')}
        />
      </div>

      {showFilters && (
        <Card className="mt-4 p-4">
          <div className="flex flex-wrap gap-4">
            <div className="flex-1">
              <label className="mb-1 block text-xs font-medium text-ink-soft">Location</label>
              <Input
                placeholder="e.g. Maplewood"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
            </div>
            <div className="flex-1">
              <label className="mb-1 block text-xs font-medium text-ink-soft">Max budget</label>
              <select
                className="w-full rounded-xl border border-border bg-surface px-3.5 py-2.5 text-sm text-ink-strong"
                value={budgetMax}
                onChange={(e) => setBudgetMax(Number(e.target.value))}
              >
                <option value={0}>Any</option>
                {BUDGET_PRESETS.map((p) => (
                  <option key={p} value={p}>
                    ${p.toLocaleString()}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </Card>
      )}

      <div className="mt-6 space-y-3">
        {openJobs.length === 0 ? (
          <EmptyState
            icon={<Briefcase className="h-6 w-6" />}
            title="No jobs match your filters"
            message="Try adjusting the search or filter criteria to see more results."
          />
        ) : (
          openJobs.map((job) => (
            <JobCard key={job.id} job={job} onClick={() => navigate(`/app/jobs/${job.id}`)} />
          ))
        )}
      </div>
    </div>
  )
}