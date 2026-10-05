import { useLocalSearchParams } from 'expo-router';

import { useMomentQuery } from '@/api/hooks/useMoments';
import { ErrorState } from '@/components/ui/ErrorState';
import { LoadingState } from '@/components/ui/LoadingState';
import { BuilderShell } from '@/features/builder/BuilderShell';

/**
 * Native Moment Builder entry — replaces the editor foundation placeholder.
 * Shell + Details (names) are live; remaining steps land in follow-up passes.
 */
export default function MomentEditScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const momentId = Number(id);
  const query = useMomentQuery(momentId);

  if (!Number.isFinite(momentId) || momentId <= 0) {
    return <ErrorState title="Invalid Moment" body="This link doesn’t point to a valid Moment." />;
  }

  if (query.isLoading && !query.data) {
    return <LoadingState label="Opening your Moment…" />;
  }

  if (query.isError && !query.data) {
    return (
      <ErrorState
        title="Couldn’t load this Moment"
        body="Check your connection and try again."
        onAction={() => void query.refetch()}
      />
    );
  }

  if (!query.data) {
    return <ErrorState title="Moment not found" body="It may have been removed or the link is outdated." />;
  }

  return <BuilderShell moment={query.data} />;
}
