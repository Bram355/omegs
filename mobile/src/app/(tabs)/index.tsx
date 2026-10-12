import { Image } from 'expo-image'
import { router } from 'expo-router'
import { CalendarCheck, CalendarPlus, ClipboardList, MessageCircle, Phone, ShieldCheck, Sparkles } from 'lucide-react-native'
import { Linking, ScrollView, Text, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { Logo } from '../../components/Logo'
import { ServiceCard } from '../../components/ServiceCard'
import { Button, Card, SectionTitle, styles } from '../../components/ui'
import { config } from '../../config'
import { heroImage, services } from '../../data/services'
import { colors, radius } from '../../theme'

const steps = [
  { icon: Sparkles, title: 'Choose your service', text: 'Pick from home, deep, office, move, sofa, or post-construction cleaning.' },
  { icon: CalendarPlus, title: 'Select date & details', text: 'Choose a day and time window that suits you and tell us about your space.' },
  { icon: CalendarCheck, title: 'Confirm & manage', text: 'Pay securely by card and track your booking right here in the app.' },
]

export default function HomeScreen() {
  const insets = useSafeAreaInsets()
  return (
    <ScrollView style={{ flex: 1, backgroundColor: colors.white }} contentContainerStyle={{ paddingBottom: 40 }}>
      <View style={{ paddingTop: insets.top + 12, paddingHorizontal: 20, paddingBottom: 12 }}>
        <Logo />
      </View>

      <View style={{ marginHorizontal: 20, borderRadius: radius.lg, overflow: 'hidden', backgroundColor: colors.brand950 }}>
        <Image source={heroImage} style={{ position: 'absolute', inset: 0, opacity: 0.45 }} contentFit="cover" accessibilityIgnoresInvertColors />
        <View style={{ padding: 22, paddingTop: 72 }}>
          <Text accessibilityRole="header" style={{ fontSize: 32, lineHeight: 36, fontWeight: '800', color: colors.white, letterSpacing: -0.8 }}>
            A Cleaner Space.{'\n'}A Better Day.
          </Text>
          <Text style={{ marginTop: 10, fontSize: 15, lineHeight: 22, color: '#E2F3F0' }}>
            Professional cleaning made simple. Book trusted cleaners and manage everything from your phone.
          </Text>
          <Button label="Book a cleaning" variant="secondary" onPress={() => router.push('/book')} style={{ marginTop: 18 }} />
        </View>
      </View>

      <View style={{ flexDirection: 'row', gap: 10, paddingHorizontal: 20, marginTop: 14 }}>
        {[
          { icon: ShieldCheck, text: 'Professional teams' },
          { icon: CalendarCheck, text: 'Open 24/7' },
          { icon: ClipboardList, text: '$200 flat rate' },
        ].map(({ icon: Icon, text }) => (
          <View key={text} style={{ flex: 1, alignItems: 'center', gap: 6, backgroundColor: colors.surface, borderRadius: radius.md, paddingVertical: 12 }}>
            <Icon size={18} color={colors.mint700} />
            <Text style={{ fontSize: 12, fontWeight: '600', color: colors.brand950, textAlign: 'center' }}>{text}</Text>
          </View>
        ))}
      </View>

      <View style={{ marginTop: 28, paddingHorizontal: 20 }}>
        <SectionTitle eyebrow="Our services" title="What can we clean for you?" />
      </View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 14, paddingHorizontal: 20, paddingBottom: 8 }}>
        {services.map((s) => (
          <ServiceCard key={s.id} service={s} width={260} />
        ))}
      </ScrollView>

      <View style={{ marginTop: 28, paddingHorizontal: 20 }}>
        <SectionTitle eyebrow="How it works" title="Three simple steps" />
        {steps.map(({ icon: Icon, title, text }, i) => (
          <View key={title} style={{ flexDirection: 'row', gap: 14, marginBottom: 16 }}>
            <View style={{ width: 44, height: 44, borderRadius: 14, backgroundColor: colors.mint100, alignItems: 'center', justifyContent: 'center' }}>
              <Icon size={20} color={colors.brand900} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: 16, fontWeight: '700', color: colors.brand950 }}>{i + 1}. {title}</Text>
              <Text style={[styles.body, { marginTop: 2 }]}>{text}</Text>
            </View>
          </View>
        ))}
      </View>

      <View style={{ paddingHorizontal: 20, marginTop: 8 }}>
        <Card style={{ backgroundColor: colors.brand900, borderColor: colors.brand900 }}>
          <Text style={{ fontSize: 18, fontWeight: '800', color: colors.white }}>Need help? We’re here 24/7.</Text>
          <Text style={{ marginTop: 6, fontSize: 14, color: '#CDE7E3' }}>Call or WhatsApp us any time at {config.phone}.</Text>
          <View style={{ flexDirection: 'row', gap: 10, marginTop: 14 }}>
            <Button label="Call" variant="secondary" icon={<Phone size={16} color={colors.brand950} />} onPress={() => Linking.openURL(`tel:${config.phoneE164}`)} style={{ flex: 1 }} />
            <Button label="WhatsApp" variant="secondary" icon={<MessageCircle size={16} color={colors.brand950} />} onPress={() => Linking.openURL(config.whatsapp)} style={{ flex: 1 }} />
          </View>
        </Card>
      </View>
    </ScrollView>
  )
}
