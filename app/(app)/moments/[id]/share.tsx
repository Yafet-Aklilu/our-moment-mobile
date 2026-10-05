import { Ionicons } from '@expo/vector-icons';
import * as Linking from 'expo-linking';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Share, StyleSheet, Text, View } from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { LinearGradient } from 'expo-linear-gradient';

import { momentsApi } from '@/api/resources/moments';
import { Button } from '@/components/ui/Button';
import { EmptyState } from '@/components/ui/EmptyState';
import { ErrorState } from '@/components/ui/ErrorState';
import { LoadingState } from '@/components/ui/LoadingState';
import { PageIntro } from '@/components/ui/PageIntro';
import { StatusBanner } from '@/components/ui/StatusBanner';
import { Card } from '@/components/ui/Screen';
import { buildMomentWebUrl } from '@/linking/momentUrl';
import { colors, radii, spacing, typography } from '@/theme';

/**
 * Share shell — private link after activation.
 * No new share features; polish around existing activation-status + Share API.
 */
export default function MomentShareScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const momentId = Number(id);
  const router = useRouter();

  const status = useQuery({
    queryKey: ['moments', momentId, 'activation-status'],
    queryFn: () => momentsApi.activationStatus(momentId),
    enabled: Number.isFinite(momentId),
  });

  if (status.isLoading) {
    return <LoadingState label="Preparing your share link…" />;
  }

  if (status.isError) {
    return (
      <ErrorState
        title="Couldn’t load share details"
        body="Check your connection and try again."
        onAction={() => void status.refetch()}
      />
    );
  }

  const url =
    status.data?.public_link ??
    (status.data?.public_token ? buildMomentWebUrl(status.data.public_token) : null);

  const onShare = async () => {
    if (!url) return;
    await Share.share({
      message: `I made something for you on OurMoment — open it here: ${url}`,
      url,
    });
  };

  const onOpenLink = async () => {
    if (!url) return;
    await Linking.openURL(url);
  };

  return (
    <View style={styles.screen}>
      {url ? (
        <>
          <View style={styles.celebration}>
            <LinearGradient
              colors={[colors.brand.pink, colors.brand.yellow]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.celebrationMark}
            >
              <Ionicons name="heart" size={28} color="#fff" />
            </LinearGradient>
            <Text style={styles.celebrationTitle}>Ready to share</Text>
          </View>

          <StatusBanner
            tone="success"
            message="Your private link is ready. No app for them — just open when they’re ready."
          />

          <PageIntro
            body="Send it however you like — message, email, or anything that feels right."
            style={styles.intro}
          />

          <Card style={styles.linkCard}>
            <View style={styles.linkHeader}>
              <View style={styles.iconWrap}>
                <Ionicons name="link" size={18} color={colors.brand.pinkDeep} />
              </View>
              <Text style={styles.linkLabel}>Private link</Text>
            </View>
            <Text style={styles.url} selectable>
              {url}
            </Text>
          </Card>

          <View style={styles.actions}>
            <Button label="Share link" onPress={() => void onShare()} />
            <Button label="Open in browser" variant="secondary" onPress={() => void onOpenLink()} />
          </View>
        </>
      ) : (
        <>
          <PageIntro
            body="Activate this Moment first — then you’ll get a private share link to send."
            style={styles.intro}
          />
          <EmptyState
            icon="sparkles"
            title="Link not ready yet"
            body="Finish activating, then come back here for your private link."
            actionLabel="Go to Activate"
            onAction={() => router.push(`/(app)/moments/${momentId}/activate`)}
            style={styles.empty}
          />
        </>
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
  celebration: {
    alignItems: 'center',
    gap: spacing.sm,
    paddingTop: spacing.sm,
  },
  celebrationMark: {
    width: 64,
    height: 64,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  celebrationTitle: {
    ...typography.titleSmall,
    textAlign: 'center',
  },
  intro: {
    marginBottom: 0,
  },
  linkCard: {
    gap: spacing.sm,
  },
  linkHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  iconWrap: {
    width: 36,
    height: 36,
    borderRadius: radii.md,
    backgroundColor: colors.brand.pinkSoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  linkLabel: {
    ...typography.label,
  },
  url: {
    ...typography.bodyMedium,
    color: colors.brand.pinkDeep,
    lineHeight: 22,
  },
  actions: {
    gap: spacing.sm,
  },
  empty: {
    paddingVertical: spacing.xl,
  },
});
