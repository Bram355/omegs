import { CalendarCheck } from 'lucide-react'
import { useCallback, useMemo, useState } from 'react'
import { SelectField } from '../forms/SelectField'
import { TextAreaField } from '../forms/TextAreaField'
import { TextField } from '../forms/TextField'
import { Alert } from '../ui/Alert'
import { Button } from '../ui/Button'
import { services } from '../../data/services'
import { useAuth } from '../../hooks/useAuth'
import { useForm, type FormErrors } from '../../hooks/useForm'
import { todayISO } from '../../lib/date'
import { validators } from '../../lib/validation'
import { bookingService, propertyTypes, timeSlots } from '../../services/booking'
import type { Booking, PropertyType } from '../../types'

interface BookingFormProps {
  initialServiceId?: string
  onBooked(booking: Booking): void
  onServiceChange?(serviceId: string): void
}

export function BookingForm({ initialServiceId, onBooked, onServiceChange }: BookingFormProps) {
  const { user } = useAuth()
  const [error, setError] = useState<string | null>(null)
  const minDate = useMemo(() => todayISO(), [])

  const initial = useMemo(
    () => ({
      serviceId: services.some((s) => s.id === initialServiceId) ? initialServiceId! : '',
      date: '',
      timeSlot: '',
      propertyType: '',
      address: '',
      phone: user?.phone ?? '',
      notes: '',
    }),
    [initialServiceId, user?.phone],
  )
  type Values = typeof initial

  const validate = useCallback(
    (v: Values): FormErrors<Values> => ({
      serviceId: v.serviceId ? undefined : 'Please choose a service.',
      date: !v.date ? 'Please choose a preferred date.' : v.date < minDate ? 'Please choose today or a future date.' : undefined,
      timeSlot: v.timeSlot ? undefined : 'Please choose a preferred time window.',
      propertyType: v.propertyType ? undefined : 'Please select a property type.',
      address: validators.required(v.address, 'Address') ?? validators.minLength(v.address, 5, 'Address'),
      phone: validators.phone(v.phone),
      notes: v.notes.length > 500 ? 'Notes must be 500 characters or fewer.' : undefined,
    }),
    [minDate],
  )
  const form = useForm(initial, validate)
  const field = { onChange: form.handleChange, onBlur: form.handleBlur }

  const onSubmit = form.handleSubmit(async (values) => {
    if (!user) return
    setError(null)
    try {
      const booking = await bookingService.createBooking(user.id, { ...values, propertyType: values.propertyType as PropertyType })
      onBooked(booking)
    } catch {
      setError('We couldn’t save your booking request. Please try again.')
    }
  })

  return (
    <form noValidate onSubmit={onSubmit} className="space-y-6" aria-labelledby="booking-form-title">
      {error && <Alert tone="error" live>{error}</Alert>}
      <SelectField
        name="serviceId"
        label="Service"
        required
        placeholder="Choose a service"
        options={services.map((s) => ({ value: s.id, label: s.name }))}
        value={form.values.serviceId}
        error={form.errors.serviceId}
        onBlur={form.handleBlur}
        onChange={(e) => {
          form.handleChange(e)
          onServiceChange?.(e.target.value)
        }}
      />
      <div className="grid gap-6 sm:grid-cols-2">
        <TextField name="date" type="date" label="Preferred date" required min={minDate} value={form.values.date} error={form.errors.date} {...field} />
        <SelectField name="timeSlot" label="Preferred time" required placeholder="Choose a time window" options={timeSlots} value={form.values.timeSlot} error={form.errors.timeSlot} {...field} />
      </div>
      <div className="grid gap-6 sm:grid-cols-2">
        <SelectField name="propertyType" label="Property type" required placeholder="Select property type" options={propertyTypes} value={form.values.propertyType} error={form.errors.propertyType} {...field} />
        <TextField name="phone" type="tel" label="Contact phone" autoComplete="tel" inputMode="tel" required value={form.values.phone} error={form.errors.phone} {...field} />
      </div>
      <TextField name="address" label="Service address" autoComplete="street-address" placeholder="Street, building, unit, city" required value={form.values.address} error={form.errors.address} {...field} />
      <TextAreaField
        name="notes"
        label="Additional details"
        rows={4}
        placeholder="Number of rooms, priority areas, access instructions, pets…"
        hint={`${form.values.notes.length}/500 characters · Optional`}
        value={form.values.notes}
        error={form.errors.notes}
        {...field}
      />
      <Button type="submit" size="lg" className="w-full sm:w-auto" loading={form.isSubmitting} loadingText="Submitting request…">
        <CalendarCheck className="size-5" aria-hidden="true" /> Confirm booking request
      </Button>
    </form>
  )
}
