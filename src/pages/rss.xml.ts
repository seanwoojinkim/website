import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import type { APIContext } from 'astro';

export async function GET(context: APIContext) {
  const writing = await getCollection('writing', ({ data }) => {
    return data.status === 'published';
  });

  const sortedWriting = writing.sort((a, b) =>
    b.data.date.getTime() - a.data.date.getTime()
  );

  return rss({
    title: 'Sean Kim — Writing',
    description: 'Thoughts on design, technology, and the systems that shape human experience.',
    site: context.site || 'https://your-site.vercel.app',
    items: sortedWriting.map((post) => ({
      title: post.data.title,
      description: post.data.excerpt,
      pubDate: post.data.date,
      link: `/writing/${post.slug}/`,
      categories: post.data.tags,
    })),
    customData: `<language>en-us</language>`,
  });
}
