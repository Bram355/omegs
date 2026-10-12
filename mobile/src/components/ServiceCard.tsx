import { Image } from 'expo-image'
import { router } from 'expo-router'
import { ArrowRight } from 'lucide-react-native'
import { Pressable, Text, View } from 'react-native'
import type { Service } from '../data/services'
import { colors, radius, shadow } from '../theme'

export function ServiceCard({ service, width }: { service: Service; width?: number }) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`${service.name}. ${service.shortDescription}`}
      onPress={() => router.push({ pathname: '/service/[id]', params: { id: service.id } })}
      style={({ pressed }) => [{ width, backgroundColor: colors.white, borderRadius: radius.lg, overflow: 'hidden', borderWidth: 1, borderColor: colors.border, ...shadow }, pressed && { opacity: 0.9 }]}
    >
      <Image source={service.image} style={{ width: '100%', height: 150 }} contentFit="cover" transition={150} accessibilityIgnoresInvertColors />
      <View style={{ padding: 16 }}>
        <Text style={{ fontSize: 17, fontWeight: '700', color: colors.brand950 }}>{service.name}</Text>
        <Text numberOfLines={2} style={{ marginTop: 6, fontSize: 14, lineHeight: 20, color: colors.muted }}>{service.shortDescription}</Text>
        <View style={{ marginTop: 12, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
          <Text style={{ fontSize: 15, fontWeight: '700', color: colors.brand900 }}>{service.pricing.startingAt}</Text>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
            <Text style={{ fontSize: 14, fontWeight: '600', color: colors.mint700 }}>Details</Text>
            <ArrowRight size={16} color={colors.mint700} />
          </View>
        </View>
      </View>
    </Pressable>
  )
}
