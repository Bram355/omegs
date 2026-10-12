import { Image } from 'expo-image'
import { router, Stack, useLocalSearchParams } from 'expo-router'
import { CheckCircle2 } from 'lucide-react-native'
import { Text, View } from 'react-native'
import { Button, Card, Screen, SectionTitle, styles } from '../../components/ui'
import { getService } from '../../data/services'
import { colors, radius } from '../../theme'

export default function ServiceDetail() {
  const { id } = useLocalSearchParams<{ id: string }>()
  const service = getService(id)
  if (!service) {
    return (
      <Screen>
        <Text style={styles.sectionTitle}>Service not found</Text>
        <Button label="Browse services" onPress={() => router.replace('/services')} style={{ marginTop: 16 }} />
      </Screen>
    )
  }
  return (
    <Screen contentStyle={{ paddingTop: 0 }}>
      <Stack.Screen options={{ title: service.name }} />
      <Image source={service.image} style={{ height: 210, borderRadius: radius.lg, marginTop: 8 }} contentFit="cover" accessibilityIgnoresInvertColors />
      <Text accessibilityRole="header" style={{ marginTop: 18, fontSize: 26, fontWeight: '800', color: colors.brand950, letterSpacing: -0.5 }}>{service.name}</Text>
      <Text style={{ marginTop: 6, fontSize: 16, color: colors.mint700, fontWeight: '600' }}>{service.tagline}</Text>
      {service.description.map((p) => (
        <Text key={p.slice(0, 24)} style={[styles.body, { marginTop: 10 }]}>{p}</Text>
      ))}

      <Card style={{ marginTop: 20, backgroundColor: colors.mint50, borderColor: colors.mint100 }}>
        <Text style={{ fontSize: 13, fontWeight: '600', color: colors.mint700 }}>Price</Text>
        <Text style={{ fontSize: 28, fontWeight: '800', color: colors.brand950 }}>{service.pricing.startingAt}</Text>
        <Text style={[styles.body, { fontSize: 13 }]}>{service.pricing.note}</Text>
        <Button label="Book this service" onPress={() => router.push({ pathname: '/book', params: { service: service.id } })} style={{ marginTop: 14 }} />
      </Card>

      <View style={{ marginTop: 26 }}>
        <SectionTitle title="What’s included" />
        {service.included.map((item) => (
          <View key={item} style={{ flexDirection: 'row', gap: 10, marginBottom: 10 }}>
            <CheckCircle2 size={18} color={colors.mint500} style={{ marginTop: 2 }} />
            <Text style={[styles.body, { flex: 1 }]}>{item}</Text>
          </View>
        ))}
      </View>

      <View style={{ marginTop: 18 }}>
        <SectionTitle title="Questions" />
        {service.faqs.map((f) => (
          <View key={f.question} style={{ marginBottom: 14 }}>
            <Text style={{ fontSize: 15, fontWeight: '700', color: colors.brand950 }}>{f.question}</Text>
            <Text style={[styles.body, { marginTop: 4 }]}>{f.answer}</Text>
          </View>
        ))}
      </View>
    </Screen>
  )
}
