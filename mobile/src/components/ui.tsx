import type { ReactNode } from 'react'
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
  type StyleProp,
  type TextInputProps,
  type ViewStyle,
} from 'react-native'
import { colors, radius, shadow } from '../theme'

export function Screen({ children, contentStyle }: { children: ReactNode; contentStyle?: StyleProp<ViewStyle> }) {
  return (
    <ScrollView style={{ flex: 1, backgroundColor: colors.white }} contentContainerStyle={[{ padding: 20, paddingBottom: 48 }, contentStyle]} keyboardShouldPersistTaps="handled">
      {children}
    </ScrollView>
  )
}

interface ButtonProps {
  label: string
  onPress(): void
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger'
  loading?: boolean
  disabled?: boolean
  icon?: ReactNode
  style?: StyleProp<ViewStyle>
}

export function Button({ label, onPress, variant = 'primary', loading, disabled, icon, style }: ButtonProps) {
  const v = buttonVariants[variant]
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled: disabled || loading, busy: loading }}
      onPress={onPress}
      disabled={disabled || loading}
      style={({ pressed }) => [styles.button, v.container, (pressed || disabled || loading) && { opacity: 0.75 }, style]}
    >
      {loading ? <ActivityIndicator color={v.text.color} /> : icon}
      <Text style={[styles.buttonText, v.text]}>{label}</Text>
    </Pressable>
  )
}

const buttonVariants = {
  primary: { container: { backgroundColor: colors.brand900 }, text: { color: colors.white } },
  secondary: { container: { backgroundColor: colors.mint100 }, text: { color: colors.brand950 } },
  ghost: { container: { backgroundColor: 'transparent', borderWidth: 1, borderColor: colors.border }, text: { color: colors.brand900 } },
  danger: { container: { backgroundColor: colors.dangerBg }, text: { color: colors.danger } },
}

export function Field({ label, error, ...props }: TextInputProps & { label: string; error?: string }) {
  return (
    <View style={{ marginBottom: 16 }}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        accessibilityLabel={label}
        placeholderTextColor={colors.muted}
        style={[styles.input, props.multiline && { minHeight: 96, textAlignVertical: 'top' }, error && { borderColor: colors.danger }]}
        {...props}
      />
      {error ? <Text style={styles.error}>{error}</Text> : null}
    </View>
  )
}

export function Chip({ label, hint, selected, onPress }: { label: string; hint?: string; selected: boolean; onPress(): void }) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ selected }}
      onPress={onPress}
      style={[styles.chip, selected && { backgroundColor: colors.brand900, borderColor: colors.brand900 }]}
    >
      <Text style={[styles.chipText, selected && { color: colors.white }]}>{label}</Text>
      {hint ? <Text style={[styles.chipHint, selected && { color: colors.mint100 }]}>{hint}</Text> : null}
    </Pressable>
  )
}

export function Card({ children, style }: { children: ReactNode; style?: StyleProp<ViewStyle> }) {
  return <View style={[styles.card, style]}>{children}</View>
}

export function Notice({ children, tone = 'info' }: { children: ReactNode; tone?: 'info' | 'error' | 'success' }) {
  const palette = {
    info: { bg: colors.amberBg, fg: colors.amberText },
    error: { bg: colors.dangerBg, fg: colors.danger },
    success: { bg: colors.mint50, fg: colors.mint700 },
  }[tone]
  return (
    <View accessibilityRole={tone === 'error' ? 'alert' : undefined} style={{ backgroundColor: palette.bg, borderRadius: radius.md, padding: 14, marginBottom: 16 }}>
      <Text style={{ color: palette.fg, fontSize: 14, lineHeight: 20 }}>{children}</Text>
    </View>
  )
}

export function SectionTitle({ eyebrow, title }: { eyebrow?: string; title: string }) {
  return (
    <View style={{ marginBottom: 14 }}>
      {eyebrow ? <Text style={styles.eyebrow}>{eyebrow}</Text> : null}
      <Text accessibilityRole="header" style={styles.sectionTitle}>{title}</Text>
    </View>
  )
}

export const styles = StyleSheet.create({
  button: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, borderRadius: radius.pill, paddingVertical: 15, paddingHorizontal: 22 },
  buttonText: { fontSize: 16, fontWeight: '700' },
  label: { fontSize: 14, fontWeight: '600', color: colors.brand950, marginBottom: 6 },
  input: { borderWidth: 1, borderColor: colors.border, borderRadius: radius.sm, paddingHorizontal: 14, paddingVertical: 13, fontSize: 16, color: colors.text, backgroundColor: colors.white },
  error: { color: colors.danger, fontSize: 13, marginTop: 6 },
  chip: { borderWidth: 1, borderColor: colors.border, borderRadius: radius.md, paddingVertical: 10, paddingHorizontal: 14, backgroundColor: colors.white },
  chipText: { fontSize: 14, fontWeight: '600', color: colors.brand950 },
  chipHint: { fontSize: 12, color: colors.muted, marginTop: 2 },
  card: { backgroundColor: colors.white, borderRadius: radius.lg, borderWidth: 1, borderColor: colors.border, padding: 18, ...shadow },
  eyebrow: { fontSize: 12, fontWeight: '700', letterSpacing: 1.2, textTransform: 'uppercase', color: colors.mint700, marginBottom: 4 },
  sectionTitle: { fontSize: 22, fontWeight: '800', color: colors.brand950, letterSpacing: -0.3 },
  body: { fontSize: 15, lineHeight: 22, color: '#334155' },
})
