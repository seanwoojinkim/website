import type { APIContext } from 'astro';
import { getCollection } from 'astro:content';
import sanitizeHtml from 'sanitize-html';
import MarkdownIt from 'markdown-it';

const parser = new MarkdownIt();

export async function GET(context: APIContext) {
  const writing = await getCollection('writing', ({ data }) => {
    return data.status === 'published';
  });

  const sortedWriting = writing.sort((a, b) =>
    b.data.date.getTime() - a.data.date.getTime()
  );

  // Ensure we have the site URL for absolute links
  const siteUrl = context.site?.toString() || 'https://seanwooj.in';

  const feed = {
    version: 'https://jsonfeed.org/version/1.1',
    title: 'Sean Kim — Writing',
    home_page_url: siteUrl,
    feed_url: `${siteUrl}feed.json`,
    description: 'Thoughts on design, technology, and the systems that shape human experience.',
    icon: `${siteUrl}favicon.svg`,
    favicon: `${siteUrl}favicon.svg`,
    authors: [
      {
        name: 'Sean Woojin Kim',
        url: siteUrl,
      },
    ],
    language: 'en',
    items: sortedWriting.map((post) => {
      // Convert markdown to HTML and sanitize
      const htmlContent = sanitizeHtml(parser.render(post.body), {
        allowedTags: sanitizeHtml.defaults.allowedTags.concat(['img']),
      });

      return {
        id: `${siteUrl}writing/${post.slug}/`,
        url: `${siteUrl}writing/${post.slug}/`,
        title: post.data.title,
        content_html: htmlContent,
        summary: post.data.excerpt,
        date_published: post.data.date.toISOString(),
        tags: post.data.tags,
      };
    }),
  };

  return new Response(JSON.stringify(feed, null, 2), {
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
    },
  });
}
