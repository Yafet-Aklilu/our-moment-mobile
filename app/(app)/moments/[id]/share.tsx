import { useLocalSearchParams } from 'expo-router';
import { Share, StyleSheet, Text, View } from 'react-native';
import { useQuery } from '@tanstack/react-query';

import { momentsApi } from '@/api/resources/moments';
import { Button } from '@/components/ui/Button';
import { buildMomentWebUrl } from '@/linking/momentUrl';
import { colors, spacing, typography } from '@/theme';

export default function MomentShareScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const momentId = Number(id);

  const status = useQuery({
    queryKey: ['moments', momentId, 'activation-status'],
    queryFn: () => momentsApi.activationStatus(momentId),
    enabled: Number.isFinite(momentId),
  });

  const url =
    status.data?.public_link ??
    (status.data?.public_token
      ? buildMomentWebUrl(status.data.public_token)
      : null);

  const onShare = async () => {
    if (!url) return;
    await Share.share({
      message: `I made something for you on OurMoment — open it here: ${url}`,
      url,
    });
  };

  return (
    <View style={styles.screen}>
      <Text style={styles.title}>Share</Text>
      <Text style={styles.body}>
        No app for them to install. Just a link they open.
      </Text>
      {url ? (
        <>
          <Text style={styles.url} selectable>
            {url}
          </Text>
          <Button label="Share link" onPress={onShare} />
        </>
      ) : (
        <Text style={styles.meta}>
          Activate this moment to generate a private share link.
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    padding: spacing.lg,
    gap: spacing.md,
    backgroundColor: colors.light.background,
  },
  title: { ...typography.title },
  body: { ...typography.body, color: colors.light.textSecondary },
  url: { ...typography.label, color: colors.brand.pinkDeep },
  meta: { ...typography.caption },
});
