# POSSE Workflow

POSSE = **P**ublish (on your) **O**wn **S**ite, **S**yndicate **E**lsewhere

This document describes the complete workflow for publishing content on your own site first, then syndicating to social media platforms while maintaining your site as the canonical source.

## Philosophy

- **Own your content** - Your website is the canonical, permanent home
- **Reach your audience** - Syndicate to where people are
- **Preserve engagement** - Use backfeed to collect responses back to your site
- **Stay in control** - No platform owns your content or your audience

## Quick Reference

1. Write post → 2. Publish on site → 3. Syndicate to social → 4. Add syndication links → 5. Backfeed happens automatically

## Full Publishing Workflow

### Step 1: Write and Publish on Your Site

Create a new markdown file in `src/content/writing/`:

```markdown
---
title: "Your Post Title"
excerpt: "A brief summary of your post that works well on social media"
date: 2024-01-15
tags: ["Design", "Technology"]
status: "published"
syndication: []  # Empty for now, will add after POSSE
---

Your content here...

Write your full post with all the details, formatting, and media you want.
This is the canonical version that will live permanently on your site.
```

**Important frontmatter fields:**

- `title` - Main title of your post
- `excerpt` - Used in RSS feed and can be used when syndicating
- `date` - Publication date
- `tags` - Categories for organization
- `status` - Must be "published" to appear on site
- `syndication` - Leave empty array initially, update after syndicating

**Build and deploy:**

```bash
# Test locally first
npm run dev

# Build for production
npm run build

# Commit and push
git add .
git commit -m "New post: Your Post Title"
git push
```

**Wait for deployment:**
- Vercel will automatically deploy
- Usually takes 1-2 minutes
- Verify post appears on seanwooj.in/writing

### Step 2: Syndicate to Social Platforms

Now that your canonical post is live, share it on social media.

#### Mastodon

1. **Compose your post** on Mastodon
   - Write an engaging hook or excerpt
   - Keep it conversational and platform-appropriate
   - Can be shorter or different from your post excerpt

2. **Add the canonical link**
   - Include full URL: `https://seanwooj.in/writing/your-post-slug/`
   - Make sure it's the exact URL (Bridgy needs this)

3. **Set visibility to Public**
   - Bridgy can only see public posts
   - Unlisted/followers-only won't work for backfeed

4. **Post it**

5. **Copy the Mastodon post URL**
   - Click on the timestamp
   - Copy full URL (e.g., `https://mastodon.social/@yourname/123456`)
   - Save this for Step 3

**Example Mastodon post:**

```
Just published: Why Design Systems Need to Think in Systems 🎨

I explore how we can move beyond component libraries to truly systematic thinking about design.

Read more: https://seanwooj.in/writing/design-systems-thinking/

#Design #DesignSystems #UX
```

#### Twitter/X (if available)

1. **Compose tweet**
   - Must fit in character limit
   - Use thread if needed

2. **Include link to canonical post**
   - Use full URL
   - Consider using a thread to elaborate

3. **Post publicly**

4. **Copy tweet URL**
   - Click on tweet timestamp
   - Copy full URL

**Example tweet:**

```
New post: Why Design Systems Need to Think in Systems

Beyond component libraries → systematic thinking about design

Read: https://seanwooj.in/writing/design-systems-thinking/
```

#### Bluesky

Similar to Mastodon:
1. Compose post with excerpt/hook
2. Include full canonical URL
3. Post publicly
4. Copy post URL

#### LinkedIn (manual POSSE)

1. Share the link
2. Write a professional summary
3. LinkedIn doesn't support Bridgy backfeed
4. Can still add as syndication link

#### Instagram (very limited)

- Instagram doesn't allow clickable links in posts
- Only option: link in bio or stories
- No Bridgy backfeed support
- Consider skipping or using for visual content only

### Step 3: Add Syndication Links to Your Post

Update your post's frontmatter with the syndication URLs:

```markdown
---
title: "Your Post Title"
excerpt: "Brief summary"
date: 2024-01-15
tags: ["Design", "Technology"]
status: "published"
syndication:
  - platform: "Mastodon"
    url: "https://mastodon.social/@yourname/123456789"
  - platform: "Twitter"
    url: "https://twitter.com/yourname/status/123456789"
  - platform: "Bluesky"
    url: "https://bsky.app/profile/yourname/post/123456"
---
```

**Rebuild and deploy:**

```bash
npm run build
git commit -am "Add syndication links for post title"
git push
```

**Why add syndication links?**

- Displays "Also posted on" section on your post
- Uses `u-syndication` microformat for IndieWeb compatibility
- Helps Bridgy find and track your syndicated posts
- Creates bidirectional linking (your site ↔ social posts)

### Step 4: Wait for Backfeed

Now the automated backfeed process begins:

**How it works:**

1. **Bridgy polls** your connected social accounts (every 30 minutes)
2. **Bridgy finds** posts that link to your domain
3. **Bridgy discovers** responses (likes, replies, reposts) to those posts
4. **Bridgy sends** webmentions to your site for each response
5. **Webmention.io** receives and stores the webmentions
6. **Next site build** fetches webmentions and displays them

**To speed up the process:**

1. Go to [brid.gy](https://brid.gy/)
2. Login to your connected account
3. Click "Poll now" to trigger an immediate poll
4. Wait a few seconds for Bridgy to process
5. Rebuild your site to fetch new webmentions:
   ```bash
   npm run build
   git commit -am "Rebuild to fetch webmentions"
   git push
   ```

**What gets backfed:**

- ❤️ **Likes/Favorites** - Displayed as avatars
- 🔁 **Reposts/Boosts** - Displayed as avatars
- 💬 **Replies** - Displayed with full content
- 🔗 **Mentions** - Other posts linking to yours

### Step 5: Verify and Monitor

**Check that everything worked:**

1. **Visit your post** on seanwooj.in
   - Syndication links should appear under "Also posted on"
   - Links should go to your social posts

2. **Check Webmention.io dashboard**
   - Login at https://webmention.io/seanwooj.in
   - Look for webmentions from Bridgy
   - Verify they're associated with correct post

3. **Check Bridgy dashboard**
   - Visit brid.gy and view your account
   - Verify your post was discovered
   - Check for any errors or warnings

4. **Check your post page**
   - Webmentions should appear at bottom
   - Likes should show avatars
   - Replies should show content

## Tips and Best Practices

### Publishing Tips

- **Write on your site first** - Always establish the canonical version
- **Use descriptive URLs** - Slug should indicate post topic
- **Write good excerpts** - They're perfect for social sharing
- **Test locally** - Preview before deploying

### Syndication Tips

- **Syndicate quickly** - Within a few hours for best discoverability
- **Customize for platform** - Each platform has different culture
- **Use hashtags wisely** - Research relevant tags per platform
- **Include visuals** - Images increase engagement
- **Tag people** - Mention people you reference (ask permission first)

### Backfeed Tips

- **Add syndication links promptly** - Helps Bridgy find responses
- **Rebuild periodically** - Fetch new webmentions regularly
- **Monitor Bridgy** - Check for errors weekly
- **Be patient** - Backfeed can take 30-60 minutes
- **Test the flow** - Send yourself a test mention occasionally

### Content Strategy

- **Not everything needs POSSE** - Some posts can stay on your site
- **Different content, different platforms** - Choose platforms that fit
- **Link back to archives** - Reference previous posts
- **Build in public** - Share your process and learnings

## Advanced: Selective POSSE

You don't have to syndicate everything:

```markdown
---
title: "Personal Reflection"
status: "published"
syndication: []  # Intentionally empty - keeping this on my site only
---
```

vs.

```markdown
---
title: "Big Announcement"
status: "published"
syndication:  # Will add after syndicating to all platforms
  - platform: "Mastodon"
    url: "..."
  - platform: "Twitter"
    url: "..."
  - platform: "Bluesky"
    url: "..."
---
```

## Automation Possibilities

Currently this workflow is manual. You can automate with:

### Option 1: Bridgy Publish

- Trigger syndication via webmention
- Send webmention to Bridgy with syndication target
- Bridgy posts to social on your behalf
- More complex setup, docs at https://brid.gy/about#publish

### Option 2: IFTTT

- Use RSS feed as trigger
- Automatically post new items to social
- Less control over formatting
- Can't customize per post

### Option 3: Custom Scripts

- Use social platform APIs
- Full control over syndication
- Requires development time
- Need to handle auth and rate limits

**Recommendation:** Start with manual POSSE. Only automate if you're posting frequently (multiple times per week) and the manual workflow becomes burdensome.

## Troubleshooting

### Syndication Links Not Showing

- Check post frontmatter syntax
- Verify syndication array is not empty
- Rebuild site after adding links
- Check browser console for errors

### Bridgy Not Finding Posts

- Ensure social post includes full canonical URL
- Make social post public
- Verify URL exactly matches (including trailing slash)
- Check Bridgy dashboard for errors

### Webmentions Not Appearing

- Wait for Bridgy poll (or trigger manually)
- Rebuild site to fetch new webmentions
- Check Webmention.io dashboard
- Verify webmention endpoint is configured

### Build Failures After Adding Syndication

- Check YAML syntax in frontmatter
- Ensure URLs are properly quoted if they contain special chars
- Verify schema matches (platform: string, url: string)
- Check terminal for error messages

## Example: Complete Flow

**Monday 10:00 AM** - Write post

```markdown
---
title: "Lessons from Building My First Design System"
excerpt: "5 key lessons I learned building a design system from scratch"
date: 2024-01-15
tags: ["Design Systems", "UX"]
status: "published"
syndication: []
---

Content here...
```

**Monday 10:30 AM** - Deploy to site

```bash
npm run build
git add .
git commit -m "New post: Design system lessons"
git push
# Vercel deploys automatically
```

**Monday 10:35 AM** - Syndicate to Mastodon

Post: "New post! 5 lessons from building my first design system 🎨

Read: https://seanwooj.in/writing/design-system-lessons/

#DesignSystems #UX"

Copy URL: `https://mastodon.social/@seankim/123456`

**Monday 10:40 AM** - Update post with syndication link

```markdown
syndication:
  - platform: "Mastodon"
    url: "https://mastodon.social/@seankim/123456"
```

```bash
npm run build
git commit -am "Add Mastodon syndication link"
git push
```

**Monday 11:00 AM** - People interact on Mastodon
- 5 likes, 2 boosts, 1 reply

**Monday 11:30 AM** - Bridgy polls
- Finds your Mastodon post
- Discovers 5 likes, 2 boosts, 1 reply
- Sends 8 webmentions to Webmention.io

**Monday 12:00 PM** - Rebuild site

```bash
# Trigger rebuild to fetch webmentions
git commit --allow-empty -m "Rebuild for webmentions"
git push
```

**Monday 12:05 PM** - Check your post
- Syndication link appears ✓
- 5 like avatars appear ✓
- 2 repost avatars appear ✓
- 1 reply with content appears ✓

Success! Your content is on your site, reached your audience, and engagement is collected back.

## Related Documentation

- [Bridgy Setup Guide](./BRIDGY_SETUP.md) - How to configure Bridgy
- [Webmentions Documentation](./WEBMENTIONS.md) - How webmentions work
- [IndieWeb Principles](https://indieweb.org/principles) - Philosophy behind POSSE

## Resources

- [IndieWeb POSSE](https://indieweb.org/POSSE)
- [Bridgy](https://brid.gy/)
- [Webmention.io](https://webmention.io/)
- [Microformats2](https://microformats.org/wiki/microformats2)

---

**Remember:** The goal is to own your content while staying connected to your community. Start simple, iterate, and build a workflow that works for you.
