import { StyleSheet, Text, View } from 'react-native';

import { colors, typography } from '@/theme';
import type { MomentState } from '@/types/api';

type Props = {
  state: MomentState;
  compact?: boolean;
};

export function MomentStatusPill({ state, compact }: Props) {
  const isSent = state === 'activated';
  return (
    <View
      style={[
        styles.pill,
        compact && styles.pillCompact,
        isSent ? styles.sent : styles.draft,
      ]}
    >
      <Text style={[styles.text, isSent ? styles.sentText : styles.draftText]}>
        {isSent ? 'Sent' : 'Still editing'}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  pill: {
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  pillCompact: {
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  draft: { backgroundColor: colors.status.draftBg },
  sent: { backgroundColor: colors.status.sentBg },
  text: {
    ...typography.caption,
    fontFamily: 'Manrope_600SemiBold',
    fontSize: 12,
  },
  draftText: { color: colors.status.draftText },
  sentText: { color: colors.status.sentText },
});
