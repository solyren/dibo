# dibo - WhatsApp Bot with Role System

WhatsApp Bot dengan sistem role 3 level (normal, admin, owner) menggunakan Bun, TypeScript, dan Baileys.

## Quick Start

### 1. Install Dependencies
```bash
bun install
```

### 2. Setup Environment
```bash
# Copy template
cp .env.example .env

# Edit .env, isi Redis credentials dari https://console.upstash.com/
```

### 3. Configure Owner
Edit `src/config/index.ts`:
```typescript
ownerNumber: '628123456789', // Ganti dengan nomor owner
```

### 4. Setup WhatsApp
```bash
bun setup
# Masukkan nomor WA, scan pairing code
```

### 5. Run Bot
```bash
# Development (auto-reload)
bun run dev

# Production
bun start
```

## Features

### 🎭 Role System
- **Normal**: Commands untuk semua user (`.ping`)
- **Admin**: Commands untuk admin grup + special access (`.hidetag`)
- **Owner**: Commands eksklusif bot owner (`.addakses`, `.removeakses`, `.listakses`)

### 💾 Database
- Upstash Redis untuk access control
- Persistent WhatsApp session

### 🔐 Permission Logic
- Owner: Full access semua command
- Admin commands: Butuh admin grup + special access
- Normal commands: Semua user bisa akses

## Commands

**Owner Commands:**
- `.addakses <nomor>` - Grant special access
- `.removeakses <nomor>` - Revoke special access
- `.listakses` - List users with special access

**Admin Commands (requires admin + access):**
- `.hidetag <message>` - Tag all members without notification

**Normal Commands:**
- `.ping` - Test bot responsiveness

## Documentation

📖 **Full Documentation**: See [AGENTS.md](AGENTS.md)
🚀 **Setup Guide**: See [SETUP_GUIDE.md](SETUP_GUIDE.md)
📝 **Changelog**: See [.CHANGELOG.md](.CHANGELOG.md)

## Tech Stack

- **Runtime**: Bun v1.2.22+
- **Language**: TypeScript (strict mode)
- **WhatsApp API**: baileys-mod v6.8.5
- **Database**: Upstash Redis v1.35.6
- **Logger**: pino

## Project Structure

```
src/
├── index.ts              # Main entry point
├── setup.ts              # Pairing code setup
├── config/               # Bot configuration
├── services/             # Database & access control
├── handlers/             # Command processor with roles
├── commands/             # Commands by role
│   ├── normal/          # User commands
│   ├── admin/           # Admin commands
│   └── owner/           # Owner commands
└── types/               # TypeScript interfaces
```

## Scripts

```bash
bun setup          # Generate pairing code
bun start          # Run bot
bun run dev        # Development mode (auto-reload)
bun run lint       # Check code style
bun run lint:fix   # Auto-fix linting issues
```

---

**Built with**: Bun v1.2.22 | [Documentation](https://bun.com)
**License**: See [LICENSE](LICENSE)
