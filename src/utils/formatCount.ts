export function formatCount(count: number | null): string {
    if (count === null) return '...';

    if (count >= 1_000_000_000) return (count / 1_000_000_000).toFixed(2) + 'B';
    if (count >= 1_000_000) return (count / 1_000_000).toFixed(2) + 'M';
    if (count >= 1_000) return (count / 1_000).toFixed(2) + 'K';
    return count.toString();
}