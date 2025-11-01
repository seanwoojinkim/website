# Docker Setup for portfolio

This project uses Docker for safe autonomous Claude Code operation.

## Quick Start

```bash
# Build container
docker-compose build

# Start container
docker-compose up -d

# Enter container as non-root user
./enter-container.sh

# Inside container: Configure Claude (first time)
export ANTHROPIC_API_KEY="your-key-here"

# Inside container: Run Claude autonomously
claude --dangerously-skip-permissions "your task"
```

## Configuration

- **External Port**: 8080
- **Internal Port**: 8000
- **Stack**: static
- **Non-root User**: node
- **Resources**: 2 CPUs, 4G RAM

## Access

- From host: http://localhost:8080
- Inside container: http://localhost:8000

## Helper Scripts

- `./enter-container.sh` - Enter container as non-root user
- `./dev-start.sh` - Start development server

## Important Notes

- Always enter container with `./enter-container.sh` or `docker-compose exec -u node portfolio-dev bash`
- Claude data (auth, history) persists in named volume
- Changes sync between host and container in real-time

## Rebuilding

```bash
docker-compose down
docker-compose build --no-cache
docker-compose up -d
```

## Troubleshooting

### Permission Issues

```bash
# Enter as root to fix
docker-compose exec -u root portfolio-dev bash
chown -R node:node /workspace /home/node
exit

# Re-enter as non-root user
./enter-container.sh
```

### Port Already in Use

Change `8080` in `docker-compose.yml` to a different port.

## Generated Files

- `Dockerfile.dev` - Container definition
- `docker-compose.yml` - Container orchestration
- `docker-entrypoint.sh` - Permission fixing entrypoint
- `.dockerignore` - Files to exclude from build
- `enter-container.sh` - Helper to enter container
- `dev-start.sh` - Server startup script
- `package.json` - Node dependencies
