# SEO Documentation - DankDeals

## Overview
This document outlines all SEO best practices implemented across the DankDeals cannabis e-commerce platform.

## 1. Sitemap (sitemap.xml)

**Location**: `/src/app/sitemap.ts`

**Features**:
- Dynamic generation based on database content
- Automatically includes all active products
- Includes all product categories
- Revalidates every hour (3600 seconds)
- Proper priority and change frequency settings:
  - Homepage: Priority 1.0, Daily updates
  - Menu/Products: Priority 0.9, Daily updates
  - Categories: Priority 0.85, Daily updates
  - Individual Products: Priority 0.7, Weekly updates
  - Static pages: Priority 0.6-0.8, Monthly/Weekly updates

**Access**: https://dankdealsmn.com/sitemap.xml

## 2. Robots.txt

**Location**: `/src/app/robots.ts`

**Features**:
- Allows all bots to crawl public pages
- Blocks sensitive areas:
  - `/admin/` - Admin dashboard
  - `/account/` - User accounts
  - `/api/` - API endpoints
  - `/checkout` - Checkout flow
  - `/orders/` - Order details
- Blocks AI crawlers (GPTBot, ChatGPT-User) from scraping content
- References sitemap location

**Access**: https://dankdealsmn.com/robots.txt

## 3. Structured Data (JSON-LD)

### Homepage - LocalBusiness Schema
**Location**: `/src/app/page.tsx`

```json
{
  "@type": "LocalBusiness",
  "name": "DankDeals",
  "description": "Premium cannabis delivery service",
  "address": "Minneapolis, MN",
  "geo": { "latitude": 44.9778, "longitude": -93.2650 },
  "openingHours": "09:00-21:00 Daily",
  "areaServed": ["Minneapolis", "St. Paul"]
}
```

### Product Pages - Product Schema
**Location**: `/src/app/products/[category]/[id]/page.tsx`

```json
{
  "@type": "Product",
  "name": "Product Title",
  "sku": "product-id",
  "brand": "DankDeals",
  "offers": {
    "price": "XX.XX",
    "priceCurrency": "USD",
    "availability": "InStock/OutOfStock"
  }
}
```

## 4. Meta Tags

### Global Metadata
**Location**: `/src/app/layout.tsx`

- **Title Template**: "%s | DankDeals"
- **Keywords**: Targeted local cannabis delivery terms
  - "cannabis delivery minneapolis"
  - "cannabis delivery st paul"
  - "weed delivery twin cities"
  - "minnesota cannabis delivery"
  - "same day cannabis delivery"
  - "cannabis flower delivery"
  - "edibles delivery minneapolis"
  - "thc delivery mn"
  - "legal cannabis minnesota"
  - "cannabis dispensary near me"

### Page-Specific Metadata

#### Product Pages
- Dynamic titles: "{Product Name} - Cannabis Delivery"
- Custom descriptions with local targeting
- Canonical URLs
- OpenGraph Product type
- Product images for social sharing

#### Category Pages
- Titles: "{Category} - Cannabis Delivery Minneapolis | DankDeals"
- SEO-optimized descriptions per category:
  - **Flower**: Mentions strains (indica, sativa, hybrid)
  - **Edibles**: Lists product types (gummies, chocolates, baked goods)
  - **Vapes**: Emphasizes discretion and convenience
  - **Concentrates**: Highlights quality (wax, shatter, dabs)
  - **Pre-rolls**: Focuses on convenience
  - **Accessories**: Broad product range
  - **Topicals**: Mentions localized relief

## 5. OpenGraph & Social Media

### Features Across All Pages
- OpenGraph titles and descriptions
- OpenGraph images (1200x630px)
- Twitter Card support (summary_large_image)
- Proper URL canonicalization
- Alt text for all images

### Homepage Social Sharing
- Image: `/og-image.jpg`
- Type: website
- Locale: en_US

### Product Social Sharing
- Image: Product's first image or placeholder
- Type: product
- Dynamic titles and descriptions per product

### Category Social Sharing
- Image: Category hero images
- Type: website
- Category-specific messaging

## 6. Canonical URLs

**Implementation**: All pages include canonical URLs to prevent duplicate content issues

- Homepage: `https://dankdealsmn.com/`
- Products: `https://dankdealsmn.com/products/{category}/{id}`
- Categories: `https://dankdealsmn.com/products/{category}`

## 7. Technical SEO

### Performance
- Next.js 15 App Router for optimal performance
- Image optimization (WebP, AVIF formats)
- Static page generation where possible
- Incremental Static Regeneration for product pages

### Mobile Optimization
- Viewport meta tag configured
- Responsive design (mobile-first)
- Theme color for browser UI
- Touch-friendly interface

### Security Headers
**Location**: `next.config.js`

- HSTS (Strict-Transport-Security)
- X-Content-Type-Options: nosniff
- X-Frame-Options: DENY
- X-XSS-Protection
- Referrer-Policy
- Permissions-Policy (restricts camera, microphone, geolocation)
- Powered-by header removed

## 8. Local SEO

### Geographic Targeting
- Minneapolis and St. Paul specifically mentioned
- Coordinates included in structured data
- Area served explicitly defined
- Delivery zones highlighted

### Local Keywords
Primary targets:
- "cannabis delivery minneapolis"
- "cannabis delivery st paul"
- "weed delivery twin cities"
- "minnesota cannabis"
- "same day delivery minneapolis"

## 9. Content Strategy

### H1 Tags
- Homepage: "Coming Soon to the Twin Cities"
- Category pages: "{Category Name}" (e.g., "Premium Flower")
- Product pages: Product title

### Descriptions
- Unique meta descriptions for every page
- Call-to-action included ("Browse", "Shop", "Delivered same-day")
- Location targeting in descriptions
- Product benefits highlighted

## 10. Verification & Analytics

### Google Search Console
- Verification meta tag placeholder added
- **Action Required**: Replace 'google-site-verification-code' with actual code

### Analytics
- Vercel Analytics integrated
- Track user behavior and conversions
- Monitor page performance

## 11. Future SEO Enhancements

### Recommended Next Steps
1. **Submit sitemap to Google Search Console**
2. **Add business schema for delivery areas**
3. **Implement breadcrumb schema**
4. **Add FAQ schema on category pages**
5. **Create blog content for long-tail keywords**
6. **Build local citations and backlinks**
7. **Optimize for "near me" searches**
8. **Add customer review schema (when reviews exist)**
9. **Create location-specific landing pages**
10. **Implement hreflang for multi-language support (if needed)**

## 12. Monitoring

### Regular SEO Audits
- Check Google Search Console for crawl errors
- Monitor Core Web Vitals
- Track keyword rankings for target terms
- Analyze organic traffic in analytics
- Review and update meta descriptions quarterly
- Ensure all product images have alt text
- Verify canonical URLs resolve correctly

### Key Metrics to Track
- Organic search traffic
- Keyword rankings for local terms
- Click-through rate from search
- Page load speed (Core Web Vitals)
- Mobile usability
- Index coverage
- Backlink profile

## 13. SEO Checklist

- [x] Sitemap created and dynamic
- [x] Robots.txt configured
- [x] Structured data on homepage
- [x] Structured data on product pages
- [x] Meta titles optimized
- [x] Meta descriptions optimized
- [x] Canonical URLs implemented
- [x] OpenGraph tags added
- [x] Twitter Card tags added
- [x] Mobile-friendly design
- [x] Security headers configured
- [x] Image alt text (ongoing)
- [x] Local SEO targeting
- [ ] Google Search Console verification
- [ ] Submit sitemap to GSC
- [ ] Build quality backlinks
- [ ] Create blog content
- [ ] Implement review schema

---

**Last Updated**: November 30, 2025
**Maintained By**: DankDeals Development Team
