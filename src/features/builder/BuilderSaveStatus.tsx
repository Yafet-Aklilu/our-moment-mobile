import { StyleSheet, Text, View } from 'react-native';

import type { SaveStatus } from '@/features/builder/types';
import { colors, typography } from '@/theme';

type Props = {
  status: SaveStatus;
  errorMessage?: string | null;
  readOnly?: boolean;
};

export function BuilderSaveStatus({ status, errorMessage, readOnly }: Props) {
  if (readOnly) {
    return (
      <View style={styles.wrap}>
        <Text style={styles.muted}>This Moment is sent — editing is locked.</Text>
      </View>
    );
  }

  if (status === 'idle') {
    return (
      <View style={styles.wrap}>
        <Text style={styles.muted}>Changes save when you leave a field.</Text>
      </View>
    );
  }

  if (status === 'saving') {
    return (
      <View style={styles.wrap}>
        <Text style={styles.saving}>Saving…</Text>
      </View>
    );
  }

  if (status === 'error') {
    return (
      <View style={styles.wrap}>
        <Text style={styles.error}>{errorMessage || 'Couldn’t save. Try again.'}</Text>
      </View>
    );
  }

  return (
    <View style={styles.wrap}>
      <Text style={styles.saved}>Saved</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    minHeight: 20,
    justifyContent: 'center',
  },
  muted: {
    ...typography.caption,
    color: colors.light.textMuted,
  },
  saving: {
    ...typography.caption,
    color: colors.brand.pinkDeep,
    fontFamily: 'Manrope_600SemiBold',
  },
  saved: {
    ...typography.caption,
    color: colors.light.textSecondary,
    fontFamily: 'Manrope_600SemiBold',
  },
  error: {
    ...typography.caption,
    color: colors.light.danger,
  },
});
