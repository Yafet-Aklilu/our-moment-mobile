import { StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { colors, spacing, typography } from '@/theme';
import type { MomentSummary } from '@/types/api';

const STEPS = ['Choose', 'Create', 'Activate', 'Share'] as const;

/**
 * Product journey progress — mirrors web "Choose. Create. Activate. Share."
 * Derived from Moment state, not invented statuses.
 */
export function JourneyStepper({ moment }: { moment: MomentSummary }) {
  const activeIndex =
    moment.state === 'activated'
      ? moment.public_share_url
        ? 3
        : 2
      : 1;

  return (
    <View style={styles.row}>
      {STEPS.map((label, i) => {
        const done = i < activeIndex || (moment.state === 'activated' && i <= 3);
        const current = i === activeIndex && moment.state === 'draft';
        const filled = done || current || (moment.state === 'activated' && i <= activeIndex);

        return (
          <View key={label} style={styles.stepWrap}>
            <View style={styles.stepLineRow}>
              {i > 0 ? (
                <View style={[styles.line, filled || i <= activeIndex ? styles.lineOn : null]} />
              ) : (
                <View style={styles.lineSpacer} />
              )}
              <View
                style={[
                  styles.node,
                  filled ? styles.nodeOn : styles.nodeOff,
                  current ? styles.nodeCurrent : null,
                ]}
              >
                {done || moment.state === 'activated' ? (
                  <Ionicons name="checkmark" size={12} color="#fff" />
                ) : (
                  <Text style={styles.nodeIndex}>{i + 1}</Text>
                )}
              </View>
              {i < STEPS.length - 1 ? (
                <View
                  style={[
                    styles.line,
                    i < activeIndex || moment.state === 'activated' ? styles.lineOn : null,
                  ]}
                />
              ) : (
                <View style={styles.lineSpacer} />
              )}
            </View>
            <Text style={[styles.label, filled ? styles.labelOn : null]}>{label}</Text>
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    marginTop: spacing.sm,
  },
  stepWrap: {
    flex: 1,
    alignItems: 'center',
    gap: 6,
  },
  stepLineRow: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
  },
  line: {
    flex: 1,
    height: 2,
    backgroundColor: colors.light.borderStrong,
  },
  lineOn: {
    backgroundColor: colors.brand.pink,
  },
  lineSpacer: {
    flex: 1,
  },
  node: {
    width: 22,
    height: 22,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
  },
  nodeOn: {
    backgroundColor: colors.brand.charcoal,
  },
  nodeOff: {
    backgroundColor: colors.light.surfaceMuted,
    borderWidth: 1,
    borderColor: colors.light.borderStrong,
  },
  nodeCurrent: {
    backgroundColor: colors.brand.pink,
  },
  nodeIndex: {
    ...typography.caption,
    fontSize: 10,
    fontFamily: 'Manrope_700Bold',
    color: colors.light.textMuted,
  },
  label: {
    ...typography.caption,
    fontSize: 11,
    color: colors.light.textMuted,
  },
  labelOn: {
    color: colors.light.text,
    fontFamily: 'Manrope_600SemiBold',
  },
});
