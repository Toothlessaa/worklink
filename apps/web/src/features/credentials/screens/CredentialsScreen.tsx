import { useState } from 'react'
import { Award, Plus, FileText, BadgeCheck, Clock } from 'lucide-react'
import type { CredentialCategory } from '@worklink/types'
import { useCurrentUser, useCredentialsForMember, useCredentialsStore } from '@worklink/state'
import { Button, Card, SectionHeader, Badge, Field, Input, Select, Modal, CredentialCard, EmptyState } from '../../../app/ui'
import { toast } from '../../../shared/toast'

const categoryLabels: Record<CredentialCategory, string> = {
  license: 'License',
  certification: 'Certification',
  training: 'Training',
  verification: 'Verification document',
}

export function CredentialsScreen() {
  const user = useCurrentUser()
  const credentials = useCredentialsForMember(user?.id ?? '')
  const addCredential = useCredentialsStore((s) => s.addCredential)
  const [modalOpen, setModalOpen] = useState(false)
  const [form, setForm] = useState({
    title: '',
    category: 'certification' as CredentialCategory,
    issuer: '',
    number: '',
  })

  const verified = credentials.filter((c) => c.status === 'verified')
  const pending = credentials.filter((c) => c.status === 'pending')

  const handleAdd = () => {
    if (!user) return
    if (!form.title.trim() || !form.issuer.trim()) {
      toast('Please add a title and issuing organization.', 'error')
      return
    }
    addCredential({
      memberId: user.id,
      category: form.category,
      title: form.title,
      issuer: form.issuer,
      number: form.number || undefined,
      issuedAt: new Date().toISOString(),
    })
    setModalOpen(false)
    setForm({ title: '', category: 'certification', issuer: '', number: '' })
    toast('Credential added. It is now pending verification.')
  }

  return (
    <div className="mx-auto max-w-3xl">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-ink-strong lg:text-3xl">Credentials</h1>
          <p className="mt-1 text-ink-soft">
            Licenses, certifications, and training that build trust with clients.
          </p>
        </div>
        <Button onClick={() => setModalOpen(true)}>
          <Plus className="h-4 w-4" /> Add Credential
        </Button>
      </div>

      <div className="mt-6 grid grid-cols-3 gap-4">
        <Card className="p-4 text-center">
          <BadgeCheck className="mx-auto h-6 w-6 text-success" />
          <p className="mt-1 text-2xl font-bold text-ink-strong">{verified.length}</p>
          <p className="text-xs text-ink-muted">Verified</p>
        </Card>
        <Card className="p-4 text-center">
          <Clock className="mx-auto h-6 w-6 text-warning" />
          <p className="mt-1 text-2xl font-bold text-ink-strong">{pending.length}</p>
          <p className="text-xs text-ink-muted">Pending</p>
        </Card>
        <Card className="p-4 text-center">
          <FileText className="mx-auto h-6 w-6 text-ink-muted" />
          <p className="mt-1 text-2xl font-bold text-ink-strong">{credentials.length}</p>
          <p className="text-xs text-ink-muted">Total</p>
        </Card>
      </div>

      {credentials.length === 0 ? (
        <div className="mt-6">
          <EmptyState
            icon={<Award className="h-6 w-6" />}
            title="No credentials yet"
            message="Add licenses, certifications, or training to help clients trust your work."
            action={
              <Button onClick={() => setModalOpen(true)}>
                <Plus className="h-4 w-4" /> Add your first credential
              </Button>
            }
          />
        </div>
      ) : (
        <div className="mt-6 space-y-6">
          <section>
            <SectionHeader title="Verified" subtitle="Reviewed and confirmed." />
            <div className="space-y-3">
              {verified.map((c) => (
                <CredentialCard key={c.id} credential={c} />
              ))}
            </div>
          </section>
          <section>
            <SectionHeader title="Pending" subtitle="Awaiting review by WorkLink." />
            <div className="space-y-3">
              {pending.map((c) => (
                <CredentialCard key={c.id} credential={c} />
              ))}
            </div>
          </section>
        </div>
      )}

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="Add a Credential">
        <div className="space-y-4">
          <Field label="Type">
            <Select
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value as CredentialCategory })}
            >
              {(Object.keys(categoryLabels) as CredentialCategory[]).map((k) => (
                <option key={k} value={k}>
                  {categoryLabels[k]}
                </option>
              ))}
            </Select>
          </Field>
          <Field label="Title">
            <Input
              placeholder="e.g. Journeyman Plumber License"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
            />
          </Field>
          <Field label="Issuing organization">
            <Input
              placeholder="e.g. NJ Division of Consumer Affairs"
              value={form.issuer}
              onChange={(e) => setForm({ ...form, issuer: e.target.value })}
            />
          </Field>
          <Field label="Credential number (optional)">
            <Input
              placeholder="e.g. PL-104829"
              value={form.number}
              onChange={(e) => setForm({ ...form, number: e.target.value })}
            />
          </Field>
          <Field label="Document" hint="Upload a photo or scan of the credential.">
            <button
              type="button"
              className="flex w-full flex-col items-center gap-1 rounded-xl border-2 border-dashed border-border py-6 text-sm text-ink-muted transition-colors hover:border-primary/50 hover:text-primary"
            >
              <FileText className="h-5 w-5" />
              Upload document
            </button>
          </Field>
          <div className="flex justify-end gap-2">
            <Button variant="ghost" onClick={() => setModalOpen(false)}>Cancel</Button>
            <Button onClick={handleAdd}>Add credential</Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}