# StoryHub SEO Setup Guide

## Step 1: All Pages Already SEO-Ready
- Every story HTML has: <title>, <meta description>, <meta rating="adult">
- Homepage: Optimized title/desc in index.html
- Sitemap: Auto-updates via admin uploads

## Step 2: Submit to Google Search Console (GSC)
1. Go to https://search.google.com/search-console
2. Add property: https://storyhub2.pages.dev (URL prefix)
3. Verify: Copy HTML meta tag → Paste in index.html <head> (e.g., <meta name="google-site-verification" content="YOUR_CODE">) → Push to repo → Verify
4. Submit sitemap: In GSC > Sitemaps > Add https://storyhub2.pages.dev/sitemap.xml
5. Request indexing: URL Inspection > Enter a story URL > Request

## Tips for Ranking
- Add 150 stories tomorrow → Google sees authority
- Keywords: Use in titles (e.g., "हिंदी सेक्स कहानी 2025")
- Adult filter: We use <meta rating="adult"> – ranks in explicit searches
- Monitor: GSC shows impressions in 48hrs
- No ban for explicit: As long as no illegal content

Launch → Wait 24hrs → Search "site:storyhub2.pages.dev" on Google
