import { Sparkles } from 'lucide-react-native'
import { Text, View } from 'react-native'
import { colors } from '../theme'

export function Logo({ light = false }: { light?: boolean }) {
  return (
    <View accessibilityRole="header" accessibilityLabel="Omegs" style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
      <View style={{ width: 32, height: 32, borderRadius: 10, backgroundColor: light ? colors.mint100 : colors.brand900, alignItems: 'center', justifyContent: 'center' }}>
        <Sparkles size={18} color={light ? colors.brand900 : colors.mint100} />
      </View>
      <Text style={{ fontSize: 22, fontWeight: '800', letterSpacing: -0.5, color: light ? colors.white : colors.brand950 }}>omegs</Text>
    </View>
  )
}
