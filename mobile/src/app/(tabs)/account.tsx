import { router } from 'expo-router'
import * as WebBrowser from 'expo-web-browser'
import { ChevronRight, FileText, LogOut, Mail, MessageCircle, Phone, Shield } from 'lucide-react-native'
import type { ReactNode } from 'react'
import { Linking, Pressable, ScrollView, Text, View } from 'react-native'
import { Button, Card, styles } from '../../components/ui'
import { config } from '../../config'
import { useAuth } from '../../context/auth'
import { colors } from '../../theme'

function Row({ icon, label, onPress }: { icon: ReactNode; label: string; onPress(): void }) {
  return (
    <Pressable accessibilityRole="button" onPress={onPress} style={({ pressed }) => [{ flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 14 }, pressed && { opacity: 0.6 }]}>
      {icon}
      <Text style={{ flex: 1, fontSize: 15, color: colors.brand950 }}>{label}</Text>
      <ChevronRight size={18} color={colors.muted} />
    </Pressable>
  )
}

export default function AccountScreen() {
  const { user, signOut } = useAuth()
  const iconColor = colors.brand800
  return (
    <ScrollView style={{ flex: 1, backgroundColor: colors.white }} contentContainerStyle={{ padding: 20, gap: 16 }}>
      {user ? (
        <Card>
          <Text style={{ fontSize: 20, fontWeight: '800', color: colors.brand950 }}>{user.fullName || 'Your account'}</Text>
          <Text style={[styles.body, { marginTop: 4 }]}>{user.email}</Text>
          {user.phone ? <Text style={styles.body}>{user.phone}</Text> : null}
        </Card>
      ) : (
        <Card>
          <Text style={{ fontSize: 18, fontWeight: '800', color: colors.brand950 }}>Welcome to Omegs</Text>
          <Text style={[styles.body, { marginTop: 4 }]}>Log in to book and manage your cleanings.</Text>
          <View style={{ flexDirection: 'row', gap: 10, marginTop: 14 }}>
            <Button label="Log in" onPress={() => router.push('/login')} style={{ flex: 1 }} />
            <Button label="Sign up" variant="ghost" onPress={() => router.push('/signup')} style={{ flex: 1 }} />
          </View>
        </Card>
      )}

      <Card style={{ paddingVertical: 4 }}>
        <Text style={[styles.eyebrow, { marginTop: 12 }]}>Support · {config.hours}</Text>
        <Row icon={<Phone size={20} color={iconColor} />} label={`Call ${config.phone}`} onPress={() => Linking.openURL(`tel:${config.phoneE164}`)} />
        <Row icon={<MessageCircle size={20} color={iconColor} />} label="Chat on WhatsApp" onPress={() => Linking.openURL(config.whatsapp)} />
        <Row icon={<Mail size={20} color={iconColor} />} label={config.email} onPress={() => Linking.openURL(`mailto:${config.email}`)} />
      </Card>

      <Card style={{ paddingVertical: 4 }}>
        <Row icon={<Shield size={20} color={iconColor} />} label="Privacy policy" onPress={() => WebBrowser.openBrowserAsync(`${config.webUrl}/privacy`)} />
        <Row icon={<FileText size={20} color={iconColor} />} label="Terms & conditions" onPress={() => WebBrowser.openBrowserAsync(`${config.webUrl}/terms`)} />
      </Card>

      {user && <Button label="Log out" variant="danger" icon={<LogOut size={18} color={colors.danger} />} onPress={signOut} />}
    </ScrollView>
  )
}
