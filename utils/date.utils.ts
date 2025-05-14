export const getSyncLabel = (lastSyncedAt: number | null) => {
  if (!lastSyncedAt) return '⚠️ Not synced yet';

  const secondsAgo = Math.floor((Date.now() - lastSyncedAt) / 1000);
  if (secondsAgo < 5) return '✅ Just synced';
  if (secondsAgo < 60) return `✅ Synced ${secondsAgo} seconds ago`;
  const minutes = Math.floor(secondsAgo / 60);
  return `✅ Synced ${minutes} minute${minutes === 1 ? '' : 's'} ago`;
};
