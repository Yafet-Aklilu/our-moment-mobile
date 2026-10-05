import { useRouter } from 'expo-router';
import { useEffect } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useMeQuery } from '@/api/hooks/useAuth';
import { useMomentsQuery } from '@/api/hooks/useMoments';
import { LoadingState } from '@/components/ui/LoadingState';
import { SectionLabel } from '@/components/ui/SectionLabel';
import { ActiveMomentCard } from '@/features/home/ActiveMomentCard';
import { HomeEmptyState } from '@/features/home/HomeEmptyState';
import { HomeHeader } from '@/features/home/HomeHeader';
import { HomeHeroCard } from '@/features/home/HomeHeroCard';
import { HomeScanFab } from '@/features/home/HomeScanFab';
import { RecentMomentCard } from '@/features/home/RecentMomentCard';
import { useProfileStore } from '@/state/profileStore';
import { colors, motion, spacing } from '@/theme';
import type { MomentSummary } from '@/types/api';

function pickFeatured(moments: MomentSummary[]): MomentSummary | null {
  const drafts = moments.filter((m) => m.state === 'draft');
  if (drafts[0]) return drafts[0];
  const withReactions = moments.find((m) => m.reactions_count > 0);
  return withReactions ?? moments[0] ?? null;
}

/**
 * Home — personal OurMoment space (not a dashboard).
 * Runtime: this screen + HomeHeader / HomeHeroCard / ActiveMomentCard /
 * RecentMomentCard / HomeEmptyState / HomeScanFab.
 */
export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const me = useMeQuery();
  const momentsQuery = useMomentsQuery();
  const avatar = useProfileStore((s) => s.avatar);
  const hydrate = useProfileStore((s) => s.hydrate);

  const userId = me.data?.id;
  useEffect(() => {
    if (userId) {
      void hydrate(userId);
    }
  }, [userId, hydrate]);

  const moments = momentsQuery.data?.data ?? [];
  const fullName = me.data?.name ?? null;
  const firstName = fullName?.split(' ')[0] ?? 'there';
  const credits = me.data?.credits ?? null;
  const drafts = moments.filter((m) => m.state === 'draft');
  const featured = pickFeatured(moments);
  const recent = moments.filter((m) => m.id !== featured?.id).slice(0, 4);
  const reactionTotal = moments.reduce((sum, m) => sum + (m.reactions_count || 0), 0);
  const isEmpty = !momentsQuery.isLoading && moments.length === 0;

  return (
    <View style={styles.root}>
      <LinearGradient
        colors={[colors.brand.soft, colors.light.background]}
        locations={[0, 0.35]}
        style={styles.ambient}
        pointerEvents="none"
      />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[
          styles.content,
          {
            paddingTop: insets.top + spacing.md,
            paddingBottom: insets.bottom + 110,
          },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <Animated.View entering={FadeInDown.duration(motion.duration.normal).springify()}>
          <HomeHeader
            firstName={firstName}
            name={fullName}
            avatar={avatar}
            reactionCount={reactionTotal}
          />
        </Animated.View>

        <Animated.View
          entering={FadeInDown.delay(60).duration(motion.duration.normal).springify()}
        >
          <HomeHeroCard credits={credits} hasDraft={drafts.length > 0} />
        </Animated.View>

        {momentsQuery.isLoading ? (
          <View style={styles.loading}>
            <LoadingState label="Gathering your Moments…" style={styles.loadingInner} />
          </View>
        ) : null}

        {isEmpty ? (
          <Animated.View
            entering={FadeInDown.delay(120).duration(motion.duration.normal).springify()}
          >
            <HomeEmptyState />
          </Animated.View>
        ) : null}

        {featured ? (
          <Animated.View
            entering={FadeInDown.delay(120).duration(motion.duration.normal).springify()}
            style={styles.section}
          >
            <SectionLabel
              title={featured.state === 'draft' ? 'Continue a Moment' : 'A Moment to revisit'}
              subtitle={
                featured.state === 'draft'
                  ? 'Pick up where the feeling left off'
                  : 'Already sent — open it again anytime'
              }
            />
            <ActiveMomentCard moment={featured} />
          </Animated.View>
        ) : null}

        {recent.length > 0 ? (
          <Animated.View
            entering={FadeInDown.delay(180).duration(motion.duration.normal).springify()}
            style={styles.section}
          >
            <SectionLabel
              title="Recent Moments"
              subtitle="Drafts and sends, softly gathered"
              actionLabel="See all"
              onAction={() => router.push('/(app)/(tabs)/moments')}
            />
            <View style={styles.list}>
              {recent.map((moment) => (
                <RecentMomentCard key={moment.id} moment={moment} />
              ))}
            </View>
          </Animated.View>
        ) : null}
      </ScrollView>

      <HomeScanFab />
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.light.background,
  },
  ambient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 280,
  },
  scroll: {
    flex: 1,
  },
  content: {
    paddingHorizontal: spacing.lg,
    gap: spacing.xl,
  },
  loading: {
    minHeight: 96,
  },
  loadingInner: {
    flex: 0,
    minHeight: 96,
    backgroundColor: 'transparent',
  },
  section: {
    gap: spacing.md,
  },
  list: {
    gap: spacing.sm,
  },
});
