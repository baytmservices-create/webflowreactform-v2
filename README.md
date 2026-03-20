# Insurance Quote Form

A multi-step insurance quote form built with Next.js. Submissions are sent to Customer.io for lead tracking.

## Quick Start

### 1. Install dependencies

```bash
npm install
```

### 2. Set up environment variables

Copy the example file and fill in your Customer.io credentials:

```bash
cp .env.example .env.local
```

Edit `.env.local`:

```
CUSTOMERIO_SITE_ID=your_site_id_here
CUSTOMERIO_API_KEY=your_api_key_here
```

You can find these in your Customer.io account under **Settings > Account Settings > API Credentials**. Use the **Track API** Site ID and API Key.

### 3. Run locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the form.

### 4. Build for production

```bash
npm run build
npm start
```

## Deployment

This is a standard Next.js app. It can be deployed anywhere that supports Node.js:

### Vercel (easiest)

1. Push the repo to GitHub
2. Import it at [vercel.com/new](https://vercel.com/new)
3. Add the two environment variables (`CUSTOMERIO_SITE_ID`, `CUSTOMERIO_API_KEY`) in the Vercel project settings under **Settings > Environment Variables**
4. Deploy

### Other platforms (Netlify, Railway, AWS, any Node server)

Any platform that can run `npm run build` and `npm start` will work. Just make sure:

- **Node.js 18+** is available
- The two environment variables are set in the platform's config
- Port is configurable via the `PORT` env var (Next.js respects this automatically)

For a plain server:

```bash
npm install
npm run build
PORT=3000 npm start
```

## Embeddable Widget

The form is also available as a standalone widget that can be embedded on any website (e.g., Webflow, WordPress).

### Build the widget

```bash
npm run build:widget
```

This outputs two files in `dist-widget/`:
- `insurance-form.js`
- `insurance-form.css`

### Embed on any page

Add this to the host page's HTML:

```html
<link rel="stylesheet" href="insurance-form.css" />
<div id="insurance-form" data-api-url="https://YOUR-DOMAIN.com/api/submit"></div>
<script src="insurance-form.js"></script>
```

Replace `YOUR-DOMAIN.com` with wherever the Next.js app is hosted. The widget calls that URL to submit form data.

**Important:** The `data-api-url` must point to the deployed Next.js app's `/api/submit` endpoint, because that's where the Customer.io credentials live. The widget itself is just static JS/CSS and holds no secrets.

## Project Structure

```
src/
  app/
    page.tsx          # Full-page form (Next.js)
    api/submit/       # API route that talks to Customer.io
    globals.css       # Page styles
  widget/
    InsuranceForm.tsx  # Embeddable widget version
    widget.css        # Widget styles (namespaced with .ifw)
    index.tsx         # Widget entry point / auto-init
```

## Environment Variables

| Variable | Description |
|---|---|
| `CUSTOMERIO_SITE_ID` | Customer.io Track API Site ID |
| `CUSTOMERIO_API_KEY` | Customer.io Track API Key |
