/**
 * Utilities for fetching and processing webmentions from Webmention.io
 */

export interface WebmentionAuthor {
  name: string;
  photo?: string;
  url?: string;
}

export interface WebmentionContent {
  text?: string;
  html?: string;
}

export interface Webmention {
  type: string;
  'wm-id': number;
  'wm-source': string;
  'wm-target': string;
  'wm-property': string;
  'wm-received': string;
  published?: string;
  author: WebmentionAuthor;
  content?: WebmentionContent;
  url?: string;
}

export interface WebmentionResponse {
  type: string;
  children: Webmention[];
}

/**
 * Fetches webmentions for a given URL from Webmention.io
 *
 * @param targetUrl - The URL to fetch webmentions for (must be absolute)
 * @returns Array of webmentions
 */
export async function fetchWebmentions(targetUrl: string): Promise<Webmention[]> {
  try {
    // Handle both trailing slash variants
    const urlsToCheck = [
      targetUrl,
      targetUrl.endsWith('/') ? targetUrl.slice(0, -1) : `${targetUrl}/`
    ];

    const allMentions: Webmention[] = [];

    for (const url of urlsToCheck) {
      const apiUrl = `https://webmention.io/api/mentions.jf2?target=${encodeURIComponent(url)}`;
      const response = await fetch(apiUrl);

      if (!response.ok) {
        console.warn(`Failed to fetch webmentions for ${url}: ${response.statusText}`);
        continue;
      }

      const data: WebmentionResponse = await response.json();
      allMentions.push(...(data.children || []));
    }

    // Deduplicate by wm-id
    const uniqueMentions = Array.from(
      new Map(allMentions.map(m => [m['wm-id'], m])).values()
    );

    return uniqueMentions;
  } catch (error) {
    console.error('Error fetching webmentions:', error);
    return [];
  }
}

/**
 * Groups webmentions by type for display
 */
export interface GroupedWebmentions {
  likes: Webmention[];
  reposts: Webmention[];
  replies: Webmention[];
  mentions: Webmention[];
}

export function groupWebmentions(mentions: Webmention[]): GroupedWebmentions {
  const grouped: GroupedWebmentions = {
    likes: [],
    reposts: [],
    replies: [],
    mentions: []
  };

  for (const mention of mentions) {
    const property = mention['wm-property'];

    switch (property) {
      case 'like-of':
        grouped.likes.push(mention);
        break;
      case 'repost-of':
      case 'retweet-of':
        grouped.reposts.push(mention);
        break;
      case 'in-reply-to':
        grouped.replies.push(mention);
        break;
      case 'mention-of':
      case 'bookmark-of':
        grouped.mentions.push(mention);
        break;
      default:
        grouped.mentions.push(mention);
    }
  }

  return grouped;
}

/**
 * Formats a webmention date for display
 */
export function formatWebmentionDate(dateString?: string): string {
  if (!dateString) return '';

  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
}

/**
 * Gets the platform name from a webmention source URL
 */
export function getPlatformName(url: string): string {
  try {
    const hostname = new URL(url).hostname;

    if (hostname.includes('twitter.com') || hostname.includes('t.co')) return 'Twitter';
    if (hostname.includes('mastodon')) return 'Mastodon';
    if (hostname.includes('instagram.com')) return 'Instagram';
    if (hostname.includes('github.com')) return 'GitHub';
    if (hostname.includes('brid.gy')) return 'Bridgy';

    return hostname.replace('www.', '');
  } catch {
    return 'Web';
  }
}
