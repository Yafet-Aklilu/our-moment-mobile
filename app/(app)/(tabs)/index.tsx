import { Link } from 'expo-router';
import { useEffect } from 'react';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useMeQuery } from '@/api/hooks/useAuth';
import { useMomentsQuery } from '@/api/hooks/useMoments';
import { ActiveMomentCard } from '@/features/home/ActiveMomentCard';
import { HomeEmptyState } from '@/features/home/HomeEmptyState';
import { HomeHeader } from '@/features/home/HomeHeader';
import { HomeHeroCard } from '@/features/home/HomeHeroCard';
import { HomeScanFab } from '@/features/home/HomeScanFab';
import { RecentMomentCard } from '@/features/home/RecentMomentCard';
import { useProfileStore } from '@/state/profileStore';
import { colors, motion, spacing, typography } from '@/theme';
import type { MomentSummary } from '@/types/api';

function pickFeatured(moments: MomentSummary[]): MomentSummary | null {
  const drafts = moments.filter((m) => m.state === 'draft');
  if (drafts[0]) return drafts[0];
  const withReactions = moments.find((m) => m.reactions_count > 0);
  return withReactions ?? moments[0] ?? null;
}

/**
 * Home — creator landing.
 * Layout structure inspired by the reference (header → action hero → featured → recent),
 * expressed with OurMoment product language and tokens.
 */
export default function HomeScreen() {
  const insets = useSafeAreaInsets();
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
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[
          styles.content,
          {
            paddingTop: insets.top + spacing.sm,
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
            <ActivityIndicator color={colors.brand.pink} />
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
            <Text style={styles.sectionTitle}>
              {featured.state === 'draft' ? 'Continue a Moment' : 'Spotlight'}
            </Text>
            <ActiveMomentCard moment={featured} />
          </Animated.View>
        ) : null}

        {recent.length > 0 ? (
          <Animated.View
            entering={FadeInDown.delay(180).duration(motion.duration.normal).springify()}
            style={styles.section}
          >
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Recent moments</Text>
              <Link href="/(app)/(tabs)/moments" asChild>
                <Pressable hitSlop={8}>
                  <Text style={styles.seeAll}>See all</Text>
                </Pressable>
              </Link>
            </View>
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
  scroll: {
    flex: 1,
  },
  content: {
    paddingHorizontal: spacing.lg,
    gap: spacing.lg,
  },
  loading: {
    paddingVertical: spacing.xl,
    alignItems: 'center',
  },
  section: {
    gap: spacing.sm,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  sectionTitle: {
    ...typography.subtitle,
  },
  seeAll: {
    ...typography.label,
    color: colors.brand.pinkDeep,
  },
  list: {
    gap: spacing.sm,
  },
});
