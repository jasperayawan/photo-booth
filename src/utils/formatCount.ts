export function formatCount(count: number | null): string {
  if (count === null) return '...';

  const format = (value: number, suffix: string) => {
    const rounded = (value * 10) % 10 === 0
      ? Math.floor(value)
      : value.toFixed(1);
    return `${rounded}${suffix}`;
  };

  if (count >= 1_000_000_000) return format(count / 1_000_000_000, 'B');
  if (count >= 1_000_000) return format(count / 1_000_000, 'M');
  if (count >= 1_000) return format(count / 1_000, 'k');

  return count.toString();
}



export const formatDate = (isoDate?: string | null): string => {
  if (!isoDate) return '';
  const date = new Date(isoDate);
  return date.toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

export const getRelativeVisitorTime = (isoDate?: string | null): string => {
  if (!isoDate) return '';

  const updated = new Date(isoDate);
  const now = new Date();
  const diffMs = now.getTime() - updated.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return 'Last visitor today';
  if (diffDays === 1) return 'Last visitor yesterday';
  if (diffDays < 7) return `Last visitor ${diffDays} days ago`;
  if (diffDays < 30) {
    const weeks = Math.floor(diffDays / 7);
    return `Last visitor ${weeks} week${weeks > 1 ? 's' : ''} ago`;
  }

  // For 30+ days, show month/year
  return `Last visitor in ${updated.toLocaleString('default', {
    month: 'long',
    year: 'numeric',
  })}`;
};
