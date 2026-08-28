import { useState } from 'react'
import { Camera, Plus, X } from 'lucide-react'
import { CATEGORIES } from '@worklink/constants'
import type { CreateJobInput, Job } from '@worklink/types'
import { Button, Field, Input, Textarea, Chips, Tabs, cn } from '../../../app/ui'

export function JobForm({
  initial,
  submitLabel,
  onSubmit,
}: {
  initial?: Job
  submitLabel: string
  onSubmit: (input: CreateJobInput) => void
}) {
  const [title, setTitle] = useState(initial?.title ?? '')
  const [category, setCategory] = useState<CreateJobInput['category']>(initial?.category ?? 'plumbing')
  const [description, setDescription] = useState(initial?.description ?? '')
  const [location, setLocation] = useState(initial?.location ?? 'Maplewood, NJ')
  const [preferredDate, setPreferredDate] = useState(
    initial?.preferredDate ? new Date(initial.preferredDate).toISOString().slice(0, 10) : '',
  )
  const [budgetType, setBudgetType] = useState<'fixed' | 'hourly'>(initial?.budget.type ?? 'fixed')
  const [budgetAmount, setBudgetAmount] = useState(initial?.budget.amount?.toString() ?? '')
  const [photoCount, setPhotoCount] = useState(initial?.photoCount ?? 0)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const errs: Record<string, string> = {}
    if (!title.trim()) errs.title = 'Give your job a title.'
    if (!description.trim()) errs.description = 'Describe the work you need done.'
    if (!location.trim()) errs.location = 'Add a location.'
    if (!preferredDate) errs.preferredDate = 'Pick a preferred date.'
    const amount = Number(budgetAmount)
    if (!amount || amount <= 0) errs.budget = 'Enter a budget amount.'
    setErrors(errs)
    if (Object.keys(errs).length > 0) return
    onSubmit({
      title,
      category,
      description,
      location,
      preferredDate: new Date(preferredDate).toISOString(),
      budget: { type: budgetType, amount },
      photoCount,
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <Field label="Job title" error={errors.title}>
        <Input
          placeholder="e.g. Fix Kitchen Sink Leak"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </Field>

      <Field label="Service category">
        <Chips
          options={CATEGORIES.map((c) => ({ value: c.id, label: c.label }))}
          value={category}
          onChange={setCategory}
        />
      </Field>

      <Field label="Job description" error={errors.description}>
        <Textarea
          rows={5}
          placeholder="Describe the job, what needs to be done, and any important details for the professional."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </Field>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Location" error={errors.location}>
          <Input
            placeholder="e.g. Maplewood, NJ"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />
        </Field>
        <Field label="Preferred date" error={errors.preferredDate}>
          <Input
            type="date"
            value={preferredDate}
            min={new Date().toISOString().slice(0, 10)}
            onChange={(e) => setPreferredDate(e.target.value)}
          />
        </Field>
      </div>

      <Field label="Budget" error={errors.budget}>
        <div className="flex items-stretch gap-3">
          <Tabs
            options={[
              { value: 'fixed', label: 'Fixed price' },
              { value: 'hourly', label: 'Hourly' },
            ]}
            value={budgetType}
            onChange={setBudgetType}
          />
          <div className="relative flex-1">
            <span className="absolute top-1/2 left-3.5 -translate-y-1/2 text-sm text-ink-muted">$</span>
            <Input
              type="number"
              min={0}
              placeholder={budgetType === 'fixed' ? '150' : '65'}
              value={budgetAmount}
              onChange={(e) => setBudgetAmount(e.target.value)}
              className="pl-8"
            />
          </div>
        </div>
      </Field>

      <Field label="Photos" hint="Attach photos to help professionals understand the job.">
        <div className="flex flex-wrap gap-3">
          {Array.from({ length: photoCount }).map((_, i) => (
            <div
              key={i}
              className="flex h-24 w-24 items-center justify-center rounded-xl border border-border bg-surface-muted text-xs text-ink-muted"
            >
              Photo {i + 1}
            </div>
          ))}
          {photoCount < 3 && (
            <button
              type="button"
              onClick={() => setPhotoCount((c) => c + 1)}
              className={cn(
                'flex h-24 w-24 flex-col items-center justify-center gap-1 rounded-xl border-2 border-dashed text-xs font-medium transition-colors',
                'border-border text-ink-muted hover:border-primary/50 hover:text-primary',
              )}
            >
              <Camera className="h-5 w-5" />
              Add photo
            </button>
          )}
          {photoCount > 0 && (
            <button
              type="button"
              onClick={() => setPhotoCount(0)}
              className="flex h-24 w-24 flex-col items-center justify-center gap-1 rounded-xl border-2 border-dashed border-border text-xs font-medium text-ink-muted transition-colors hover:border-error/50 hover:text-error"
            >
              <X className="h-5 w-5" />
              Clear
            </button>
          )}
        </div>
      </Field>

      <Button type="submit" size="lg" fullWidth>
        {submitLabel}
      </Button>
    </form>
  )
}