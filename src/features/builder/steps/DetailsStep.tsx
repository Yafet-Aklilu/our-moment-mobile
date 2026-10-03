import { useRef, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { ApiClientError } from '@/api/client';
import { useUpdateMomentNamesMutation } from '@/api/hooks/useMoments';
import { TextField } from '@/components/ui/TextField';
import { BuilderSaveStatus } from '@/features/builder/BuilderSaveStatus';
import type { SaveStatus } from '@/features/builder/types';
import { colors, spacing, typography } from '@/theme';
import type { Moment } from '@/types/api';

type Props = {
  moment: Moment;
};

/**
 * First native builder step — recipient + sender names.
 * Blur-save matches web Edit.vue header behavior via PATCH /moments/{id}/names.
 * Remount with key={moment.id} when switching moments.
 */
export function DetailsStep({ moment }: Props) {
  const readOnly = moment.state === 'activated';
  const mutation = useUpdateMomentNamesMutation(moment.id);

  const [receiverName, setReceiverName] = useState(moment.receiver_name ?? '');
  const [senderName, setSenderName] = useState(moment.sender_name ?? '');
  const [status, setStatus] = useState<SaveStatus>('idle');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const savedRef = useRef({
    receiver_name: moment.receiver_name ?? '',
    sender_name: moment.sender_name ?? '',
  });
  const saveGeneration = useRef(0);

  const persist = async (next: { receiver_name: string; sender_name: string }) => {
    if (readOnly) return;
    if (
      next.receiver_name === savedRef.current.receiver_name &&
      next.sender_name === savedRef.current.sender_name
    ) {
      return;
    }

    const gen = ++saveGeneration.current;
    setStatus('saving');
    setErrorMessage(null);

    try {
      const result = await mutation.mutateAsync({
        receiver_name: next.receiver_name.trim() || null,
        sender_name: next.sender_name.trim() || null,
      });
      if (gen !== saveGeneration.current) return;
      savedRef.current = {
        receiver_name: result.receiver_name ?? '',
        sender_name: result.sender_name ?? '',
      };
      setReceiverName(result.receiver_name ?? '');
      setSenderName(result.sender_name ?? '');
      setStatus('saved');
    } catch (err) {
      if (gen !== saveGeneration.current) return;
      const message =
        err instanceof ApiClientError
          ? err.code === 'moment_immutable'
            ? 'This Moment can’t be edited after it’s sent.'
            : err.message
          : 'Couldn’t save names.';
      setErrorMessage(message);
      setStatus('error');
    }
  };

  return (
    <View style={styles.root}>
      <Text style={styles.title}>Details</Text>
      <Text style={styles.sub}>Who this Moment is for — and who it’s from.</Text>

      <View style={styles.fields}>
        <TextField
          label="For"
          value={receiverName}
          onChangeText={setReceiverName}
          placeholder="Their name"
          autoCapitalize="words"
          autoCorrect={false}
          editable={!readOnly}
          maxLength={255}
          returnKeyType="next"
          onBlur={() => {
            void persist({ receiver_name: receiverName, sender_name: senderName });
          }}
        />
        <TextField
          label="From"
          value={senderName}
          onChangeText={setSenderName}
          placeholder="Your name"
          autoCapitalize="words"
          autoCorrect={false}
          editable={!readOnly}
          maxLength={255}
          returnKeyType="done"
          onBlur={() => {
            void persist({ receiver_name: receiverName, sender_name: senderName });
          }}
        />
      </View>

      <BuilderSaveStatus
        status={status}
        errorMessage={errorMessage}
        readOnly={readOnly}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    gap: spacing.md,
  },
  title: {
    ...typography.titleSmall,
  },
  sub: {
    ...typography.body,
    color: colors.light.textSecondary,
    marginTop: -spacing.sm,
  },
  fields: {
    gap: spacing.md,
  },
});
