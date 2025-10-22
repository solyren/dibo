# <p align="center">🤖 Dibo - WhatsApp Bot</p>

<div align="center">
    <strong>Production-ready WhatsApp bot with advanced 4-level role system, Redis-powered access control, and seamless message handling built with Bun, TypeScript, and Baileys.</strong>
</div>

<br/>

<div align="center">

![Version](https://img.shields.io/badge/version-0.0.0-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)
![Bun](https://img.shields.io/badge/Bun-%3E%3D1.2.22-orange.svg)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue.svg)
![Status](https://img.shields.io/badge/status-active-success.svg)

</div>

<br/>

> [!IMPORTANT]
>
> 1. **Self-Host Requirement**: This bot is designed for self-hosting. Deploy your own instance for personal or organizational use.
> 2. **No Official WhatsApp Affiliation**: This is an unofficial WhatsApp bot using the baileys-mod library. It is not affiliated with or endorsed by WhatsApp Inc.
> 3. **Responsible Use**: Use this bot responsibly and in accordance with WhatsApp's Terms of Service. The developers are not responsible for any misuse.
> 4. **Privacy**: Your WhatsApp session data (auth_info) stays on your server. Never share or commit this folder.

> [!NOTE]
>
> **PERATURAN MUTLAK**: When adding new features or commands, **ALWAYS UPDATE README.md** dengan dokumentasi lengkap. README is the primary documentation for users.

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Installation](#installation)
  - [Prerequisites](#prerequisites)
  - [Local Setup](#local-setup)
  - [Environment Configuration](#environment-configuration)
- [Usage](#usage)
  - [Setup Bot](#setup-bot)
  - [Run Bot](#run-bot)
- [Commands](#commands)
  - [Normal Commands](#normal-commands)
  - [Akses Commands](#akses-commands)
  - [Owner Commands](#owner-commands)
- [Role System](#role-system)
- [Configuration](#configuration)
- [Architecture](#architecture)
- [Development](#development)
- [Troubleshooting](#troubleshooting)
- [Contributing](#contributing)
- [License](#license)
- [Support](#support)

---

## ✨ Features

### 🎭 **4-Level Role System**
- **Normal**: Basic commands for all users
- **Akses**: Commands for users with special access (no admin required)
- **Admin**: Commands for group admins with special access
- **Owner**: Full control with exclusive commands

### 🔐 **Advanced Access Control**
- Redis-based permission management
- Granular access control per user
- Owner-managed access grants/revokes
- Persistent access list

### 💾 **Database Integration**
- Upstash Redis for access control
- Persistent WhatsApp session
- Reliable data storage

### 🚀 **Production-Ready**
- Type-safe with TypeScript strict mode
- Comprehensive error handling
- Automatic reconnection
- Message store for decryption
- Clean, minimal logging

### 🔧 **Developer-Friendly**
- Modular command structure
- Easy to extend
- Hot-reload in development
- ESLint configured
- Full documentation

### 📦 **Modern Stack**
- **Bun** runtime (fast & efficient)
- **TypeScript** (type safety)
- **baileys-mod** (WhatsApp Web API)
- **Upstash Redis** (serverless database)

---

## 🛠 Tech Stack

### Runtime & Language
- **Bun**: v1.2.22+ (Package manager, runtime, bundler)
- **TypeScript**: v5+ with strict mode
- **Node.js**: Compatible types

### Core Dependencies
```json
{
  "baileys-mod": "^6.8.5",        // WhatsApp Web API
  "@upstash/redis": "^1.35.6",    // Serverless Redis
  "pino": "^10.1.0",               // Fast logger
  "@hapi/boom": "^10.0.1",         // Error handling
  "cheerio": "^1.1.2",             // HTML parser
  "jimp": "^0.16.13"               // Image processing
}
```

### External Services
- **Upstash Redis**: [Sign up](https://console.upstash.com/)
- **WhatsApp Web**: Via baileys-mod

---

## 💻 Installation

### Prerequisites

Make sure you have installed:

1. **Bun.js** v1.2.22 or higher
   ```bash
   # Install Bun (Linux & macOS)
   curl -fsSL https://bun.sh/install | bash
   
   # Or visit: https://bun.sh/docs/installation
   ```

2. **Upstash Redis Account**
   - Sign up at [Upstash Console](https://console.upstash.com/)
   - Create a new Redis database
   - Get your REST URL and REST TOKEN

3. **WhatsApp Account**
   - Need a phone number for the bot
   - Can use primary or secondary number

### Local Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/solyren/dibo.git
   cd dibo
   ```

2. **Install dependencies**
   ```bash
   bun install
   ```

3. **Create environment file**
   ```bash
   cp .env.example .env
   ```

4. **Configure environment variables**
   
   Edit `.env` and add your Upstash credentials:
   ```env
   UPSTASH_REDIS_REST_URL=https://your-redis-url.upstash.io
   UPSTASH_REDIS_REST_TOKEN=your-redis-token-here
   ```

5. **Configure owner number**
   
   Edit `src/config/index.ts`:
   ```typescript
   export const config: BotConfig = {
     // ... other config
     ownerNumber: '628123456789', // Replace with your number (without +)
   };
   ```

### Environment Configuration

Create `.env` file in root directory:

```env
# Upstash Redis Configuration
UPSTASH_REDIS_REST_URL=https://your-endpoint.upstash.io
UPSTASH_REDIS_REST_TOKEN=AXxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

# Optional: Custom Configuration
# Prefix can be changed in src/config/index.ts
```

**Get Upstash Credentials**:
1. Go to [console.upstash.com](https://console.upstash.com/)
2. Create new Redis database
3. Copy **REST URL** and **REST TOKEN**
4. Paste into `.env` file

---

## 🚀 Usage

### Setup Bot

**First-time setup with pairing code:**

```bash
bun setup
```

Follow the prompts:
1. Enter your WhatsApp phone number (e.g., 628123456789)
2. You'll receive a pairing code
3. Open WhatsApp on your phone
4. Go to **Linked Devices** → **Link a Device**
5. Enter the pairing code
6. Wait for "Setup complete!" message

### Run Bot

**Production mode:**
```bash
bun start
```

**Development mode** (with auto-reload):
```bash
bun run dev
```

**Check code quality:**
```bash
bun run lint          # Check for issues
bun run lint:fix      # Auto-fix issues
```

When bot is running, you should see:
```
✅ Redis connected
Bot is running!
```

---

## 📝 Commands

All commands use prefix: `.` (configurable in `src/config/index.ts`)

### Normal Commands

Available to **all users** in groups and private chats.

#### `.ping`
Test bot responsiveness.

**Usage:**
```
.ping
```

**Response:**
```
Pong! 🏓
```

---

### Akses Commands

Available to users with **special access** granted by owner. No group admin required.

#### `.hidetag <message>`
Send message with hidden mention to all group members.

**Requirements:**
- Special access from owner
- Used in groups only

**Usage:**
```
.hidetag Hello everyone! 👋
```

**Response:**
Sends message with all members mentioned (without showing mention list)

**Error Messages:**
- `❌ This command can only be used in groups.` - Used in private chat
- `❌ You need special access to use this command. Contact the owner.` - No access
- `❌ Failed to send hidetag. Make sure the bot is admin.` - Bot not admin

---

### Owner Commands

Available to **bot owner** only (configured in `src/config/index.ts`).

#### `.addakses <number>`
Grant special access to a user.

**Usage:**
```
.addakses 628123456789
```

**Response:**
```
✅ Access granted to: 628123456789@s.whatsapp.net

User can now use akses commands.
```

**Note:** User can now execute akses commands (e.g., hidetag) without being group admin.

---

#### `.removeakses <number>`
Revoke special access from a user.

**Usage:**
```
.removeakses 628123456789
```

**Response:**
```
✅ Access removed from: 628123456789@s.whatsapp.net

User can no longer use akses commands.
```

---

#### `.listakses`
List all users with special access.

**Usage:**
```
.listakses
```

**Response (with users):**
```
📋 *Access List*

Users with special access:
1. 628123456789@s.whatsapp.net
2. 628987654321@s.whatsapp.net

Total: 2 user(s)
```

**Response (empty):**
```
📋 *Access List*

No users with special access.
```

---

## 🎭 Role System

### Role Hierarchy

```
Owner (Full Access)
  ├── Owner Commands (addakses, removeakses, listakses)
  ├── Akses Commands (hidetag)
  └── Normal Commands (ping)

Admin (Group Admin + Special Access)
  ├── Akses Commands (hidetag) ✅
  └── Normal Commands (ping) ✅

Akses (Special Access dari Owner)
  ├── Akses Commands (hidetag) ✅
  └── Normal Commands (ping) ✅

Normal User
  └── Normal Commands (ping) ✅
```

### Permission Logic

| Role | Requirements | Access Level |
|------|-------------|--------------|
| **Owner** | Configured in `config.ownerNumber` | All commands |
| **Admin** | Group admin + Special access (from owner) | Admin + Akses + Normal commands |
| **Akses** | Special access (from owner) | Akses + Normal commands |
| **Normal** | None | Normal commands only |

### How to Grant Access

1. **Owner identifies user** by phone number
2. **Owner runs command**: `.addakses 628123456789`
3. **User gains access** to akses commands immediately
4. **No group admin required** for akses role

### How Access is Stored

- Stored in **Upstash Redis** (Set data structure)
- Key: `bot:access:users`
- Persistent across bot restarts
- Fast lookup for permission checks

---

## ⚙️ Configuration

### Main Configuration

Edit `src/config/index.ts`:

```typescript
export const config: BotConfig = {
  usePairingCode: true,                    // Use pairing code (true) or QR (false)
  customPairingCode: 'DIBOBOTT',          // Custom pairing code prefix
  prefix: '.',                             // Command prefix
  botName: 'Dibo Bot',                     // Bot display name
  ownerNumber: '628123456789',            // Owner phone number (no +)
  redis: {
    url: process.env.UPSTASH_REDIS_REST_URL || '',
    token: process.env.UPSTASH_REDIS_REST_TOKEN || '',
  },
};
```

### Environment Variables

`.env` file:
```env
UPSTASH_REDIS_REST_URL=https://your-endpoint.upstash.io
UPSTASH_REDIS_REST_TOKEN=your-token-here
```

### TypeScript Configuration

`tsconfig.json` (already configured):
```json
{
  "compilerOptions": {
    "strict": true,
    "target": "ESNext",
    "module": "Preserve",
    "moduleResolution": "bundler"
  }
}
```

---

## 🏗 Architecture

### Project Structure

```
dibo/
├── src/
│   ├── index.ts              # Main entry point
│   ├── setup.ts              # Pairing code setup
│   ├── config/
│   │   └── index.ts          # Bot configuration
│   ├── services/
│   │   ├── database.ts       # Redis operations
│   │   └── accessControl.ts  # Permission logic
│   ├── handlers/
│   │   └── commandHandler.ts # Command processor
│   ├── commands/
│   │   ├── normal/           # Normal user commands
│   │   ├── akses/            # Special access commands
│   │   ├── admin/            # Admin commands (future)
│   │   └── owner/            # Owner commands
│   └── types/
│       └── index.ts          # TypeScript types
├── auth_info/                # WhatsApp session (GITIGNORED)
├── package.json              # Dependencies & scripts
├── tsconfig.json             # TypeScript config
├── eslint.config.mjs         # ESLint rules
└── .env                      # Environment variables (GITIGNORED)
```

### Message Flow

```
User sends message
    ↓
messages.upsert event
    ↓
Loop all messages in batch
    ↓
Filter: from bot? no message? → skip
    ↓
Extract text & check prefix
    ↓
Parse command name & args
    ↓
Get command from registry
    ↓
Check user permissions
    ↓
Execute command OR send error
```

### Key Components

#### **Message Store**
```typescript
const store = makeInMemoryStore({
  logger: pino().child({ level: 'silent', stream: 'store' }),
});
```
- Caches messages for decryption
- Prevents "Invalid PreKey ID" errors
- No need to re-join groups after pairing

#### **getMessage Function**
```typescript
getMessage: async (key) => {
  if (store) {
    const msg = await store.loadMessage(key.remoteJid, key.id);
    return msg?.message || undefined;
  }
  return undefined;
}
```
- Required by baileys for message decryption
- Handles replied/forwarded messages
- Maintains session continuity

---

## 👨‍💻 Development

### Adding New Commands

1. **Create command file** in appropriate role folder:
   ```typescript
   // src/commands/normal/example.ts
   import type { WASocket } from 'baileys-mod';
   import type { Command } from '../../types';
   
   const execute = async (sock: WASocket, msg: any, args: string[]): Promise<void> => {
     const jid = msg.key.remoteJid;
     
     try {
       // Your command logic here
       await sock.sendMessage(jid, { text: 'Response message' });
     } catch (error) {
       console.error('❌ Error in example command:', error);
     }
   };
   
   export const exampleCommand: Command = {
     name: 'example',
     role: 'normal',  // or 'akses', 'admin', 'owner'
     execute,
   };
   ```

2. **Register command** in `src/handlers/commandHandler.ts`:
   ```typescript
   import { exampleCommand } from '../commands/normal/example';
   
   const registerCommands = (): void => {
     normalCommands.set(exampleCommand.name, exampleCommand);
     // ... other commands
   };
   ```

3. **Update README.md** with command documentation (MANDATORY!)


### Coding Standards

- **TypeScript**: Strict mode, explicit types
- **Naming**: camelCase for functions/variables
- **Error Handling**: Try-catch for all async operations
- **Logging**: Minimal, errors only in production
- **Comments**: Only for complex logic

### Testing

```bash
# Lint check
bun run lint

# Lint and auto-fix
bun run lint:fix

# Run bot in dev mode
bun run dev
```

### Git Workflow

**Before commit:**
```bash
# 1. Lint code
bun run lint:fix

# 2. Check changes
git status
git diff

# 3. Commit with clear message
git add .
git commit -m "feat: Add new command

```

---

## 🐛 Troubleshooting

### Bot not responding to commands

**Symptoms**: Commands sent but no response

**Solutions**:
1. Check bot is running: `Bot is running!` should appear
2. Verify prefix matches (default: `.`)
3. Check Redis connection: `✅ Redis connected` should appear
4. Try `.ping` first to test basic functionality

### Connection Issues

**Symptoms**: Bot disconnects/reconnects repeatedly

**Solutions**:
1. Check internet connection
2. Delete `auth_info/` and re-pair
3. Check no other device logged in with same number
4. Verify baileys-mod version is compatible

### Permission Denied

**Symptoms**: `❌ You do not have permission to use this command.`

**Solutions**:
- For akses commands: Grant access with `.addakses <number>`
- For admin commands: User must be group admin + have special access
- For owner commands: Only bot owner can execute
- Check with `.listakses` to see who has access

### Redis Not Connected

**Symptoms**: `⚠️ Redis credentials not configured. Access control disabled.`

**Solutions**:
1. Check `.env` file exists
2. Verify `UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN` are set
3. Get correct credentials from [Upstash Console](https://console.upstash.com/)
4. Restart bot after updating `.env`

### Commands require multiple attempts

**Symptoms**: Need to send command 2-3 times before it works

**Solutions**:
- This should be **fixed** in current version
- If still occurs, try: Delete `auth_info/` and re-pair
- Update baileys-mod: `bun update baileys-mod`

---

## 🤝 Contributing

Contributions are welcome! Here's how:

1. **Fork** the repository
2. **Create** a feature branch: `git checkout -b feature/amazing-feature`
3. **Make** your changes
4. **Update** README.md if adding features (MANDATORY!)
5. **Test** thoroughly: `bun run lint`
6. **Commit**: `git commit -m "feat: Add amazing feature"`
7. **Push**: `git push origin feature/amazing-feature`
8. **Open** a Pull Request

### Contribution Guidelines

✅ **DO**:
- Write clear commit messages
- Add documentation for new features
- Follow existing code style
- Test before submitting
- Update README.md with your changes

❌ **DON'T**:
- Commit `auth_info/` or `.env`
- Change core architecture without discussion
- Skip linting
- Add dependencies without reason

---

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

### What this means:
- ✅ Commercial use allowed
- ✅ Modification allowed
- ✅ Distribution allowed
- ✅ Private use allowed
- ❌ Liability: No warranty provided
- ❌ Authors not liable for damages

---

## 💖 Support

### Found this useful?

- ⭐ **Star this repository**
- 🍴 **Fork and customize**
- 📢 **Share with others**
- 🐛 **Report bugs** via [Issues](https://github.com/solyren/dibo/issues)
- 💡 **Suggest features** via [Issues](https://github.com/solyren/dibo/issues)

### Documentation

- **README.md**: This file (complete user guide)
- **[LICENSE](LICENSE)**: License information

### Community

- **Issues**: [GitHub Issues](https://github.com/solyren/dibo/issues)
- **Discussions**: [GitHub Discussions](https://github.com/solyren/dibo/discussions)

---

## 🙏 Acknowledgments

### Built With
- [Bun](https://bun.sh/) - Fast JavaScript runtime
- [baileys-mod](https://github.com/WhiskeySockets/Baileys) - WhatsApp Web API
- [Upstash Redis](https://upstash.com/) - Serverless Redis
- [TypeScript](https://www.typescriptlang.org/) - Type safety

### Inspired By
- Previous project: [genz-cc](https://github.com/solyren/genz-cc)

---

<div align="center">
  
**Made with ❤️ by the Dibo Team**

</div>

<div align="center">
  
[![GitHub](https://img.shields.io/badge/GitHub-solyren%2Fdibo-blue?logo=github)](https://github.com/solyren/dibo)
[![Issues](https://img.shields.io/github/issues/solyren/dibo)](https://github.com/solyren/dibo/issues)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)

</div>
