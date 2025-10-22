# Dibo - WhatsApp Bot

<div align="center">

Production-ready WhatsApp bot with 4-level role system and Redis-powered access control.

![Version](https://img.shields.io/badge/version-0.0.0-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)
![Bun](https://img.shields.io/badge/Bun-%3E%3D1.2.22-orange.svg)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue.svg)

</div>

## Features

- **4-Level Role System** - Normal, Akses, Admin, Owner with granular permissions
- **Redis Access Control** - Persistent user permissions via Upstash Redis
- **Production Ready** - TypeScript strict mode, error handling, auto-reconnect
- **Message Store** - Proper encryption handling, no re-join required after pairing

## Tech Stack

- **Runtime**: Bun v1.2.22+
- **Language**: TypeScript 5+ (strict mode)
- **WhatsApp API**: baileys-mod v6.8.5
- **Database**: Upstash Redis v1.35.6

## Installation

### Prerequisites

- [Bun.js](https://bun.sh/docs/installation) v1.2.22 or higher
- [Upstash Redis](https://console.upstash.com/) account (free tier available)
- WhatsApp phone number for bot

### Setup

1. Clone and install dependencies:
   ```bash
   git clone https://github.com/solyren/dibo.git
   cd dibo
   bun install
   ```

2. Configure environment:
   ```bash
   cp .env.example .env
   ```

3. Edit `.env` with your Upstash credentials:
   ```env
   UPSTASH_REDIS_REST_URL=https://your-redis-url.upstash.io
   UPSTASH_REDIS_REST_TOKEN=your-redis-token-here
   ```

4. Edit `src/config/index.ts` and set owner number:
   ```typescript
   ownerNumber: '628123456789', // Your number without +
   ```

5. Setup WhatsApp connection:
   ```bash
   bun setup
   # Enter phone number and scan pairing code in WhatsApp
   ```

6. Run the bot:
   ```bash
   bun start          # Production
   bun run dev        # Development (auto-reload)
   ```

## Role System

| Role | Requirements | Access |
|------|-------------|--------|
| Owner | Configured in config | All commands |
| Admin | Group admin + Special access | Admin + Akses + Normal |
| Akses | Special access only | Akses + Normal |
| Normal | None | Normal commands only |

**Access Management:**
- Owner grants access via `.addakses <number>`
- Access stored in Redis (persistent)
- Akses users don't need to be group admin

## Configuration

Edit `src/config/index.ts`:

```typescript
export const config: BotConfig = {
  prefix: '.',                          // Command prefix
  botName: 'Dibo Bot',                  // Bot name
  ownerNumber: '628123456789',         // Owner number (no +)
  redis: {
    url: process.env.UPSTASH_REDIS_REST_URL || '',
    token: process.env.UPSTASH_REDIS_REST_TOKEN || '',
  },
};
```

## Project Structure

```
dibo/
├── src/
│   ├── commands/
│   │   ├── normal/      # Normal user commands
│   │   ├── akses/       # Special access commands
│   │   ├── admin/       # Admin commands
│   │   └── owner/       # Owner commands
│   ├── services/        # Database & access control
│   ├── handlers/        # Command handler
│   └── config/          # Bot configuration
├── auth_info/           # WhatsApp session (gitignored)
└── .env                 # Environment variables (gitignored)
```

## Development

### Adding New Commands

1. Create command file in `src/commands/[role]/[name].ts`
2. Register in `src/handlers/commandHandler.ts`
3. Update README.md with documentation

### Scripts

```bash
bun start         # Run bot (production)
bun run dev       # Run with auto-reload
bun setup         # Generate pairing code
bun run lint      # Check code style
bun run lint:fix  # Auto-fix linting issues
```

## Troubleshooting

**Bot not responding:**
- Verify bot is running: `Bot is running!` should appear
- Check prefix matches (default: `.`)
- Test with `.ping` command

**Redis not connected:**
- Verify `.env` file exists with correct credentials
- Get credentials from [Upstash Console](https://console.upstash.com/)
- Restart bot after updating `.env`

**Permission denied:**
- For akses commands: Grant access with `.addakses <number>`
- For owner commands: Only configured owner can execute
- Check access list with `.listakses`

**Connection issues:**
- Delete `auth_info/` and re-pair
- Check internet connection
- Ensure no other device logged in with same number

## Contributing

1. Fork the repository
2. Create feature branch: `git checkout -b feature/name`
3. Make changes and test: `bun run lint`
4. Update README.md if adding features
5. Commit: `git commit -m "feat: description"`
6. Push and create Pull Request

## License

MIT License - see [LICENSE](LICENSE) file.

**Key points:**
- Commercial use, modification, and distribution allowed
- No warranty provided
- Authors not liable for damages

## Links

- **Repository**: [github.com/solyren/dibo](https://github.com/solyren/dibo)
- **Issues**: [Report bugs](https://github.com/solyren/dibo/issues)
- **Upstash**: [console.upstash.com](https://console.upstash.com/)
- **Bun**: [bun.sh](https://bun.sh/)

---

**Important**: This is an unofficial WhatsApp bot. Use responsibly and comply with WhatsApp's Terms of Service.
