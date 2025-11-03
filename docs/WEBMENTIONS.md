# Webmention Setup Guide

This document explains how to set up and use Webmention.io for receiving webmentions on your portfolio site.

## What are Webmentions?

Webmentions are a web standard for conversations and interactions across different websites. When someone mentions your site on their blog, social media (via Bridgy), or another IndieWeb-enabled site, you can receive a notification and display those interactions on your site.

## Service: Webmention.io

We use [Webmention.io](https://webmention.io/) as a hosted service for receiving and storing webmentions. This eliminates the need for server-side infrastructure while maintaining full IndieWeb compatibility.

**Why Webmention.io?**
- Free, open-source service maintained by the IndieWeb community
- No server-side code required (perfect for static sites)
- Provides both webmention and legacy pingback support
- Simple JSON API for fetching received mentions
- Works seamlessly with Bridgy for social media backfeed

## Setup Instructions

### Step 1: Sign Up for Webmention.io

1. Visit [https://webmention.io/](https://webmention.io/)
2. Click "Sign in with GitHub" or "Sign in with email"
3. Authorize the application if using GitHub
4. You'll be redirected to the Webmention.io dashboard

### Step 2: Add Your Domain

1. In the dashboard, enter your domain: `seanwooj.in`
2. Click "Add Domain"

### Step 3: Verify Domain Ownership

Webmention.io needs to verify that you own the domain. It does this by checking for `rel="me"` links on your site.

**Good news:** This is already set up! In Phase 1 of IndieWeb integration, we added `rel="me"` links to your GitHub and Instagram profiles in the footer:

```html
<a href="https://github.com/seanwoojinkim" rel="me">GitHub</a>
<a href="https://instagram.com/seanwooj" rel="me">Instagram</a>
```

**To complete verification:**

1. Make sure your GitHub profile (https://github.com/seanwoojinkim) links back to `seanwooj.in` in the website field
2. In Webmention.io dashboard, select "GitHub" as verification method
3. Click "Verify"
4. Verification should succeed immediately

**Alternative verification methods (if needed):**
- Add your website URL to your GitHub profile's website field
- Add your website URL to your Instagram bio (if verification supports it)
- Add a meta tag to your site's head (less elegant)

### Step 4: Endpoint Discovery

The webmention endpoint is already configured in your site's HTML head:

```html
<link rel="webmention" href="https://webmention.io/seanwooj.in/webmention" />
<link rel="pingback" href="https://webmention.io/seanwooj.in/xmlrpc" />
```

These tags tell other sites where to send webmentions when they mention your content.

**What each endpoint does:**
- `rel="webmention"` - Modern IndieWeb webmention protocol
- `rel="pingback"` - Legacy XML-RPC pingback protocol (WordPress, Blogger)

## Testing Webmention Reception

### Method 1: Use Webmention.rocks (Recommended)

[Webmention.rocks](https://webmention.rocks/) is a validator and testing tool for webmentions.

1. Visit https://webmention.rocks/receive/1
2. Enter one of your post URLs (e.g., `https://seanwooj.in/writing/2024-07-21-design-is-more-than`)
3. Click "Send Webmention"
4. Check your Webmention.io dashboard to see if it was received

### Method 2: Manual Test with curl

Send a test webmention from the command line:

```bash
curl -i -d "source=https://example.com/post&target=https://seanwooj.in" \
  https://webmention.io/seanwooj.in/webmention
```

**Expected response:**
```
HTTP/1.1 201 Created
Location: https://webmention.io/seanwooj.in/webmention/...
```

### Method 3: Ask a Friend

If you have a friend with an IndieWeb-enabled site, ask them to write a post mentioning your site. Their site should automatically send a webmention to yours.

## Viewing Received Webmentions

### Webmention.io Dashboard

1. Visit [https://webmention.io/dashboard](https://webmention.io/dashboard)
2. Sign in with your authentication method
3. You'll see a list of all received webmentions
4. Each mention shows:
   - Source URL (where the mention came from)
   - Target URL (which of your pages was mentioned)
   - Type (mention, reply, like, repost, bookmark)
   - Timestamp
   - Author information (if available)

### API Access

Fetch webmentions programmatically using the JSON API:

```bash
curl "https://webmention.io/api/mentions.jf2?domain=seanwooj.in"
```

**API Response Format:**
```json
{
  "type": "feed",
  "name": "Webmentions",
  "children": [
    {
      "type": "entry",
      "author": {
        "type": "card",
        "name": "Author Name",
        "photo": "https://...",
        "url": "https://..."
      },
      "url": "https://source-site.com/post",
      "published": "2025-11-02T12:00:00+00:00",
      "wm-received": "2025-11-02T12:05:00+00:00",
      "wm-id": 123456,
      "wm-source": "https://source-site.com/post",
      "wm-target": "https://seanwooj.in/writing/...",
      "wm-property": "in-reply-to",
      "content": {
        "html": "...",
        "text": "..."
      }
    }
  ]
}
```

**API Filters:**

Filter by target page:
```bash
curl "https://webmention.io/api/mentions.jf2?target=https://seanwooj.in/writing/..."
```

Filter by type:
```bash
curl "https://webmention.io/api/mentions.jf2?domain=seanwooj.in&wm-property=like-of"
```

Available properties: `in-reply-to`, `like-of`, `repost-of`, `bookmark-of`, `mention-of`

## Integration with Bridgy (Phase 5)

In Phase 5, we'll set up [Bridgy](https://brid.gy/) to backfeed social media interactions as webmentions:

- Twitter/X likes, replies, and retweets → webmentions
- Mastodon favorites, replies, and boosts → webmentions
- Instagram likes and comments → webmentions

Bridgy polls your social accounts and sends webmentions to your site on your behalf, aggregating all interactions in one place.

## Troubleshooting

### Webmentions not being received

1. **Check endpoint discovery:**
   - View source on your site and confirm the `<link rel="webmention">` tag is present
   - Verify the URL is correct: `https://webmention.io/seanwooj.in/webmention`

2. **Check domain verification:**
   - Log in to Webmention.io dashboard
   - Ensure your domain shows as "Verified"
   - If not, re-run verification

3. **Check the sender:**
   - Some sites may not support sending webmentions
   - Try using webmention.rocks to send a test mention
   - Check if the source page has proper microformats2 markup

4. **Check Webmention.io status:**
   - Visit https://webmention.io/dashboard
   - Check if the service is operational
   - Look for any error messages

### API not returning data

1. **Check domain parameter:**
   - Ensure you're using `domain=seanwooj.in` (no www, no https://)

2. **Wait for propagation:**
   - There may be a few minutes delay between receiving and API availability

3. **Check API endpoint:**
   - Verify you're using the correct endpoint: `https://webmention.io/api/mentions.jf2`
   - Try fetching in a browser to see the raw response

### Domain verification failing

1. **Check rel="me" links:**
   - Ensure GitHub and Instagram links in footer have `rel="me"` attribute
   - Verify these links are on your homepage

2. **Check GitHub profile:**
   - Visit your GitHub profile settings
   - Add `https://seanwooj.in` to the Website field
   - Save changes

3. **Try alternative methods:**
   - Use email verification if GitHub isn't working
   - Add a verification meta tag to your site if needed

## Security and Privacy

### What data does Webmention.io store?

- Source URL (where the mention came from)
- Target URL (which of your pages was mentioned)
- Timestamp of when the mention was received
- Author information from the source page (name, photo, URL)
- Mention content/context

### Who can see your webmentions?

- Anyone can fetch webmentions via the public API
- This is intentional: webmentions represent public interactions
- The API only returns mentions you've received (not private data)

### Deleting webmentions

If you need to delete a webmention:
1. Log in to Webmention.io dashboard
2. Find the mention in your list
3. Click the delete button

### Handling spam

Webmention.io has basic spam filtering built-in, but you may want to:
- Monitor your dashboard regularly
- Delete spam mentions manually
- In Phase 3, implement client-side filtering in your display component

## Next Steps

After completing Phase 2 setup:

1. **Phase 3: Webmention Display**
   - Create an Astro component to display received webmentions
   - Fetch webmentions at build time
   - Style the display to match your site

2. **Phase 5: POSSE & Backfeed**
   - Set up Bridgy for social media backfeed
   - Add syndication links to posts
   - Document POSSE workflow

## Resources

- [Webmention.io Documentation](https://github.com/aaronpk/webmention.io)
- [IndieWeb Webmention Spec](https://indieweb.org/Webmention)
- [Webmention.rocks Testing Tool](https://webmention.rocks/)
- [Bridgy Documentation](https://brid.gy/about)
- [Microformats2 Spec](https://microformats.org/wiki/microformats2)

## Support

- IndieWeb Wiki: https://indieweb.org/Webmention
- IndieWeb Chat: https://indieweb.org/discuss
- Webmention.io GitHub Issues: https://github.com/aaronpk/webmention.io/issues
