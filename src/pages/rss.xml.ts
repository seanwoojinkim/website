import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import type { APIContext } from 'astro';
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

  return rss({
    title: 'Sean Kim — Writing',
    description: 'Thoughts on design, technology, and the systems that shape human experience.',
    site: siteUrl,
    items: sortedWriting.map((post) => ({
      title: post.data.title,
      description: post.data.excerpt,
      pubDate: post.data.date,
      link: `/writing/${post.slug}/`,
      categories: post.data.tags,
      // Include full post content as HTML
      content: sanitizeHtml(parser.render(post.body), {
        allowedTags: sanitizeHtml.defaults.allowedTags.concat(['img']),
      }),
      // Add author information
      author: 'Sean Woojin Kim',
    })),
    customData: `<language>en-us</language>`,
    // Add Atom namespace for better compatibility
    xmlns: {
      atom: 'http://www.w3.org/2005/Atom',
    },
  });
}
