import { Redirect, useLocalSearchParams } from 'expo-router';

/**
 * Path alias matching the web canonical URL shape `/m/{public_token}`
 * for Expo Linking / Universal Links association.
 */
export default function MomentPathAlias() {
  const { publicToken } = useLocalSearchParams<{ publicToken: string }>();
  return <Redirect href={`/player/${publicToken}`} />;
}
