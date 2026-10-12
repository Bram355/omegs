import { useState } from 'react'
import { ScrollView, Text, View } from 'react-native'
import { ServiceCard } from '../../components/ServiceCard'
import { Chip, styles } from '../../components/ui'
import { categories, services } from '../../data/services'
import { colors } from '../../theme'

export default function ServicesScreen() {
  const [category, setCategory] = useState<(typeof categories)[number]['id']>('all')
  const visible = services.filter((s) => category === 'all' || s.category === category)
  return (
    <ScrollView style={{ flex: 1, backgroundColor: colors.white }} contentContainerStyle={{ padding: 20, paddingBottom: 40 }}>
      <Text style={styles.body}>Every service is a flat $200 per booking. Tap a service to see what’s included.</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8, paddingVertical: 16 }}>
        {categories.map((c) => (
          <Chip key={c.id} label={c.label} selected={category === c.id} onPress={() => setCategory(c.id)} />
        ))}
      </ScrollView>
      <View style={{ gap: 16 }}>
        {visible.map((s) => (
          <ServiceCard key={s.id} service={s} />
        ))}
      </View>
    </ScrollView>
  )
}
