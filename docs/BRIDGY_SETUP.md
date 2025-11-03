# Bridgy Setup Guide

This guide explains how to set up [Bridgy](https://brid.gy/) to enable backfeed of responses from social media platforms to your website via webmentions.

## What is Bridgy?

Bridgy is a service that:
- Polls your social media accounts for posts linking to your website
- Finds responses (likes, replies, reposts) to those posts
- Sends them as webmentions back to your site
- Works with Mastodon, Twitter/X, Bluesky, Flickr, and more

## Prerequisites

- Your website must have a webmention endpoint configured (we use Webmention.io)
- Your website must have microformats2 markup (h-entry) on post pages
- You need at least one social media account to connect

## Setup Instructions

### Step 1: Sign Up for Bridgy

1. Visit [https://brid.gy/](https://brid.gy/)
2. Choose the social platform you want to connect (Mastodon recommended)
3. No account creation needed - Bridgy uses OAuth

### Step 2: Connect Mastodon Account

If using Mastodon:

1. Click the "Mastodon" button on Bridgy homepage
2. Enter your Mastodon instance URL (e.g., `mastodon.social`, `fosstodon.org`)
3. Click "Authorize"
4. You'll be redirected to your Mastodon instance
5. Review the permissions and authorize the Bridgy app
6. You'll be redirected back to Bridgy

### Step 3: Configure Bridgy Settings

After connecting your account:

1. **Enable "Responses"** - This enables webmention backfeed
2. **Poll frequency** - Default is every 30 minutes (automatic)
3. **Response types** - Enable all:
   - Likes
   - Reposts/Boosts
   - Replies
   - Mentions
4. **Verify webmention endpoint** - Bridgy should auto-detect `https://webmention.io/seanwooj.in/webmention`

### Step 4: Verify Detection

Bridgy needs to find your webmention endpoint:

1. Go to your Bridgy account page
2. Check if webmention endpoint is detected
3. If not detected, ensure your site has this in `<head>`:
   ```html
   <link rel="webmention" href="https://webmention.io/seanwooj.in/webmention">
   ```

### Step 5: Test Backfeed

To test the full workflow:

1. **Publish a post** on seanwooj.in
2. **Share the post** on your connected social platform (e.g., Mastodon)
   - Include the full URL to your post
   - Make sure it's a public post
3. **Interact with the post** (like, reply, or boost from another account)
4. **Wait for Bridgy to poll** (up to 30 minutes) or trigger manually:
   - Go to your Bridgy account page
   - Click "Poll now" button
5. **Check Webmention.io dashboard**
   - Visit https://webmention.io/seanwooj.in
   - Login with GitHub
   - Look for new webmentions from Bridgy
6. **Rebuild your site** to fetch the new webmentions
7. **Verify** webmentions appear on your post

## Understanding Bridgy's Workflow

1. **You post** on your site (canonical version)
2. **You syndicate** to social media with a link back
3. **People interact** on the social post (like, reply, boost)
4. **Bridgy polls** your social account (every 30 min)
5. **Bridgy finds** your post and its responses
6. **Bridgy sends** webmentions to your site
7. **Webmention.io** receives and stores them
8. **Your site fetches** webmentions during next build
9. **Webmentions appear** on your post

## Connecting Additional Platforms

### Twitter/X

1. Click "Twitter" on Bridgy homepage
2. Authorize with your Twitter account
3. Enable "Responses"
4. Note: Twitter API limitations may affect functionality

### Bluesky

1. Click "Bluesky" on Bridgy homepage
2. Enter your Bluesky handle and app password
3. Enable "Responses"

### Other Platforms

Bridgy also supports:
- GitHub (for issue/PR comments)
- Flickr
- Instagram (limited functionality)

## Troubleshooting

### Bridgy Can't Find My Posts

- Ensure your social posts include the full URL to your canonical post
- Verify the URL exactly matches (including trailing slash)
- Check that your post has h-entry microformats
- Make posts public (Bridgy can't see private posts)

### Webmentions Not Appearing

- Check Webmention.io dashboard to verify receipt
- Rebuild your site to fetch latest webmentions
- Verify your site's webmention fetch logic is working
- Check browser console for API errors

### Bridgy Shows Errors

- Review your Bridgy account page for error messages
- Check if OAuth token expired (re-authorize if needed)
- Verify your social account is still accessible
- Check Bridgy's status page for service issues

## Monitoring and Maintenance

### Regular Checks

- Visit your Bridgy dashboard weekly
- Check for error messages or warnings
- Monitor poll status (should show "Last poll: X minutes ago")
- Verify OAuth connections are active

### When to Manually Poll

- Right after syndicating a new post
- When you know there are new responses
- If automatic polls seem delayed
- Before rebuilding your site to fetch webmentions

### Re-authorization

OAuth tokens may expire. If Bridgy stops working:
1. Go to your Bridgy account page
2. Look for "Re-authorize" button
3. Follow the OAuth flow again
4. Check that responses are enabled

## Privacy Considerations

### What Bridgy Accesses

- Public posts from your social accounts
- Responses to posts that link to your domain
- Your public profile information

### What Bridgy Does NOT Access

- Private/direct messages
- Posts that don't link to your domain
- Non-public content
- Personal data beyond public profile

### Deleting Data

To remove your data from Bridgy:
1. Go to your Bridgy account page
2. Click "Disable" for each connected platform
3. Click "Delete my account" at the bottom
4. This removes your data from Bridgy but not from social platforms

## Best Practices

1. **Post canonically first** - Always publish on your site before syndicating
2. **Add syndication links** - Update post frontmatter with syndication URLs
3. **Monitor regularly** - Check Bridgy dashboard weekly
4. **Rebuild periodically** - Rebuild your site to fetch new webmentions
5. **Test the flow** - Verify backfeed works after setup
6. **Keep tokens fresh** - Re-authorize if you see auth errors

## Related Documentation

- [POSSE Workflow](./POSSE_WORKFLOW.md) - How to publish and syndicate posts
- [Webmentions Setup](./WEBMENTIONS.md) - How webmention receiving works
- [Bridgy Documentation](https://brid.gy/about) - Official Bridgy docs

## Getting Help

- Bridgy GitHub: https://github.com/snarfed/bridgy
- IndieWeb Chat: https://chat.indieweb.org/
- Webmention.io Docs: https://webmention.io/
