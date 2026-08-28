import { useState } from 'react'
import { ScrollView, View, Pressable } from 'react-native'
import { useRouter } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'
import { useTheme } from '@worklink/theme'
import type { CredentialCategory } from '@worklink/types'
import { useCurrentUser, useCredentialsForMember, useCredentialsStore } from '@worklink/state'
import { Screen, Card, Button, Field, Input, Text, Badge, CredentialCard, EmptyState, Modal, SectionHeader } from '../../../shared/ui'
import { toast } from '../../../shared/toast'

const categoryLabels: Record<CredentialCategory, string> = {
  license: 'License',
  certification: 'Certification',
  training: 'Training',
  verification: 'Verification document',
}

export function CredentialsScreen() {
  const t = useTheme()
  const user = useCurrentUser()
  const credentials = useCredentialsForMember(user?.id ?? '')
  const addCredential = useCredentialsStore((s) => s.addCredential)
  const [modalOpen, setModalOpen] = useState(false)
  const [form, setForm] = useState({ title: '', category: 'certification' as CredentialCategory, issuer: '', number: '' })

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
    <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 16, paddingBottom: 40 }}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
        <Text variant="h1">Credentials</Text>
        <Button size="sm" onPress={() => setModalOpen(true)}>
          <Ionicons name="add" size={16} color="#FFFFFF" /> Add
        </Button>
      </View>

      <View style={{ flexDirection: 'row', gap: 10, marginTop: 16 }}>
        <Card style={{ flex: 1, alignItems: 'center', paddingVertical: 12 }}>
          <Ionicons name="checkmark-circle" size={22} color={t.colors.success} />
          <Text style={{ fontSize: 18, fontFamily: 'Inter_700Bold', marginTop: 4 }}>{verified.length}</Text>
          <Text variant="caption">Verified</Text>
        </Card>
        <Card style={{ flex: 1, alignItems: 'center', paddingVertical: 12 }}>
          <Ionicons name="time" size={22} color={t.colors.warning} />
          <Text style={{ fontSize: 18, fontFamily: 'Inter_700Bold', marginTop: 4 }}>{pending.length}</Text>
          <Text variant="caption">Pending</Text>
        </Card>
        <Card style={{ flex: 1, alignItems: 'center', paddingVertical: 12 }}>
          <Ionicons name="document-text" size={22} color={t.colors.textMuted} />
          <Text style={{ fontSize: 18, fontFamily: 'Inter_700Bold', marginTop: 4 }}>{credentials.length}</Text>
          <Text variant="caption">Total</Text>
        </Card>
      </View>

      {credentials.length === 0 ? (
        <EmptyState
          icon="ribbon-outline"
          title="No credentials yet"
          message="Add licenses, certifications, or training."
          action={
            <Button size="sm" onPress={() => setModalOpen(true)}>Add your first credential</Button>
          }
        />
      ) : (
        <View style={{ gap: 20, marginTop: 20 }}>
          <View>
            <SectionHeader title="Verified" />
            <View style={{ gap: 10 }}>
              {verified.map((c) => <CredentialCard key={c.id} credential={c} />)}
              {verified.length === 0 && <Text variant="caption" style={{ color: t.colors.textMuted }}>No verified credentials yet.</Text>}
            </View>
          </View>
          <View>
            <SectionHeader title="Pending" />
            <View style={{ gap: 10 }}>
              {pending.map((c) => <CredentialCard key={c.id} credential={c} />)}
              {pending.length === 0 && <Text variant="caption" style={{ color: t.colors.textMuted }}>No pending credentials.</Text>}
            </View>
          </View>
        </View>
      )}

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="Add a Credential">
        <View style={{ gap: 14 }}>
          <Field label="Type">
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
              {(Object.keys(categoryLabels) as CredentialCategory[]).map((k) => (
                <Pressable
                  key={k}
                  onPress={() => setForm({ ...form, category: k })}
                  style={{
                    paddingHorizontal: 14,
                    paddingVertical: 6,
                    borderRadius: 999,
                    borderWidth: 1,
                    borderColor: form.category === k ? t.colors.primary : t.colors.border,
                    backgroundColor: form.category === k ? t.colors.primarySoft : t.colors.surface,
                  }}
                >
                  <Text style={{ fontSize: 13, fontFamily: 'Inter_500Medium', color: form.category === k ? t.colors.primary : t.colors.textSecondary }}>
                    {categoryLabels[k]}
                  </Text>
                </Pressable>
              ))}
            </View>
          </Field>
          <Field label="Title">
            <Input placeholder="e.g. Journeyman Plumber License" value={form.title} onChangeText={(v) => setForm({ ...form, title: v })} />
          </Field>
          <Field label="Issuing organization">
            <Input placeholder="e.g. NJ Division of Consumer Affairs" value={form.issuer} onChangeText={(v) => setForm({ ...form, issuer: v })} />
          </Field>
          <Field label="Credential number (optional)">
            <Input placeholder="e.g. PL-104829" value={form.number} onChangeText={(v) => setForm({ ...form, number: v })} />
          </Field>
          <View style={{ flexDirection: 'row', justifyContent: 'flex-end', gap: 8, marginTop: 8 }}>
            <Button variant="ghost" onPress={() => setModalOpen(false)}>Cancel</Button>
            <Button onPress={handleAdd}>Add credential</Button>
          </View>
        </View>
      </Modal>
    </ScrollView>
  )
}