import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ArrowLeft, Save } from 'lucide-react'
import { useAuthStore, useCurrentUser } from '@worklink/state'
import { Button, Card, Field, Input, Textarea, Avatar } from '../../../app/ui'
import { toast } from '../../../shared/toast'

export function EditProfileScreen() {
  const user = useCurrentUser()
  const updateProfile = useAuthStore((s) => s.updateProfile)
  const navigate = useNavigate()
  const [form, setForm] = useState({
    name: user?.name ?? '',
    profession: user?.profession ?? '',
    location: user?.location ?? '',
    rate: user?.rate ?? '',
    bio: user?.bio ?? '',
    skills: (user?.skills ?? []).join(', '),
  })

  if (!user) return null

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    updateProfile(user.id, {
      name: form.name,
      profession: form.profession,
      location: form.location,
      rate: form.rate,
      bio: form.bio,
      skills: form.skills
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean),
    })
    toast('Profile updated.')
    navigate(`/app/profile/${user.id}`)
  }

  return (
    <div className="mx-auto max-w-2xl">
      <Link
        to={`/app/profile/${user.id}`}
        className="mb-5 inline-flex items-center gap-1.5 text-sm font-medium text-ink-muted hover:text-ink-strong"
      >
        <ArrowLeft className="h-4 w-4" /> Back to profile
      </Link>
      <h1 className="text-2xl font-bold text-ink-strong lg:text-3xl">Edit Profile</h1>
      <p className="mt-1 text-ink-soft">Keep your profile up to date so people can find you.</p>

      <Card className="mt-6 p-6 lg:p-8">
        <div className="mb-6 flex items-center gap-4">
          <Avatar user={user} size="xl" />
          <div>
            <p className="font-semibold text-ink-strong">{user.name}</p>
            <p className="text-sm text-ink-muted">Profile photo</p>
          </div>
          <Button variant="secondary" size="sm" className="ml-auto">
            Change photo
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Field label="Full name">
            <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          </Field>
          {user.role === 'member' && (
            <>
              <Field label="Profession">
                <Input
                  value={form.profession}
                  onChange={(e) => setForm({ ...form, profession: e.target.value })}
                />
              </Field>
              <Field label="Rate">
                <Input
                  placeholder="e.g. $65-85 / hr"
                  value={form.rate}
                  onChange={(e) => setForm({ ...form, rate: e.target.value })}
                />
              </Field>
              <Field label="Skills" hint="Comma separated">
                <Input
                  value={form.skills}
                  onChange={(e) => setForm({ ...form, skills: e.target.value })}
                />
              </Field>
            </>
          )}
          <Field label="Location">
            <Input
              value={form.location}
              onChange={(e) => setForm({ ...form, location: e.target.value })}
            />
          </Field>
          <Field label="About">
            <Textarea
              rows={4}
              value={form.bio}
              onChange={(e) => setForm({ ...form, bio: e.target.value })}
            />
          </Field>
          <Button type="submit" size="lg" fullWidth>
            <Save className="h-4 w-4" /> Save changes
          </Button>
        </form>
      </Card>
    </div>
  )
}