# Sean Kim Portfolio

Personal portfolio site showcasing interactive systems, generative art, and biometric experiments.

## Overview

This is a standalone portfolio site extracted from the visualizations monorepo, featuring:
- **Work showcase**: Wooj Lighting, interactive visualizations, biometric installations
- **Writing**: Technical articles on generative systems, biometrics, and rendering
- **About**: Background, practice, and collaboration interests

## Stack

- **Static HTML/CSS** - Clean, minimal design
- **http-server** - Simple static file server
- **Docker** - Containerized development with Claude Code support

## Quick Start

### Local Development

```bash
# Start container
docker-compose up -d

# View site
open http://localhost:8081

# Stop container
docker-compose down
```

### Development with Claude Code

```bash
# Enter container
./enter-container.sh

# Inside container: configure Claude (first time)
export ANTHROPIC_API_KEY="your-key"

# Run Claude autonomously
claude --dangerously-skip-permissions "your task"
```

## Project Structure

```
portfolio/
├── index.html              # Main work page
├── about.html              # About/bio page
├── writing.html            # Writing index
├── css/
│   └── style.css          # Styles
├── writing/               # Writing content (placeholder)
├── Dockerfile.dev         # Docker container definition
├── docker-compose.yml     # Container orchestration
├── docker-entrypoint.sh   # Permission fixing
├── enter-container.sh     # Helper to enter container
├── dev-start.sh          # Server startup script
└── package.json          # Node dependencies (http-server)
```

## Configuration

- **External Port**: 8081 (configurable in docker-compose.yml)
- **Internal Port**: 8000
- **Claude Data**: Persisted in named volume `portfolio_claude-data`
- **Resources**: 2 CPUs, 4G RAM (configurable)

## Deployment

The site is designed for static hosting:

- **Vercel**: Deploy directly from git
- **Netlify**: Drag & drop or git integration
- **GitHub Pages**: Static site hosting
- **Any static host**: Just serve the HTML/CSS files

## Links to Visualizations

The portfolio currently links to placeholder URLs for visualizations:
- `https://visualizations.example.com/flocking/`
- `https://visualizations.example.com/coherence/`
- `https://visualizations.example.com/clouds/`

Update these URLs in `index.html` once the visualizations are deployed.

## Local Development (Without Docker)

```bash
# Install http-server
npm install

# Start server
npm start

# Visit
open http://localhost:8000
```

## Docker Setup

This project uses the [claude-docker-template](../claude-docker-template/) for:
- Safe autonomous Claude Code operation
- Non-root user setup (required for `--dangerously-skip-permissions`)
- Volume persistence for Claude auth and history
- Real-time code sync between host and container
- Resource limits to prevent runaway processes

See `DOCKER_SETUP.md` for complete Docker documentation.

## Git Workflow

```bash
# Before autonomous tasks
git add . && git commit -m "Before Claude task"

# After task
git diff  # Review changes
git add . && git commit -m "Task completed"

# Rollback if needed
git reset --hard HEAD
```

## Customization

### Update Contact Info

Edit the following files:
- `index.html` - Footer links
- `about.html` - Contact section and social links
- `writing.html` - Footer links

### Update Visualization Links

In `index.html`, update the placeholder URLs:
```html
<a href="https://your-viz-domain.com/flocking/" ...>
```

### Add Writing Content

Create HTML files in `writing/` directory and link from `writing.html`.

## Tech Stack Details

- **Design**: Swiss minimalism, precise typography
- **CSS**: Custom styles, no frameworks
- **JavaScript**: None required (static site)
- **Server**: http-server (Node.js-based)
- **Deployment**: Static hosting compatible

## Future Enhancements

- [ ] Update visualization demo links
- [ ] Add writing content pages
- [ ] Implement contact form
- [ ] Add project detail pages
- [ ] Create case studies for each work
- [ ] Add analytics (optional)
- [ ] SEO optimization
- [ ] Open graph meta tags

## License

Personal portfolio site - All rights reserved.

---

**Live at**: http://localhost:8081 (local development)

**Repository**: Independent from visualizations monorepo

**Contact**: Update placeholder email/social links in HTML files
