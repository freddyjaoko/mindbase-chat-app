<img width="890" height="930" alt="Screenshot 2026-04-21 130949" src="https://github.com/user-attachments/assets/56a5ff12-50a2-4780-ad93-021760db9e25" />
<img width="1909" height="947" alt="Screenshot 2026-04-21 130829" src="https://github.com/user-attachments/assets/4e4a1bb7-f3fd-4293-bb88-139949947be0" />

# Mindbase

Mindbase is a multi-tenant RAG chatbot that uses [Ragie Connect](https://www.ragie.ai/connectors?utm_source=mindbase-readme) to allow users to connect and chat with their organization's knowledgebase. It serves as a reference application showcasing [Ragie](https://www.ragie.ai/?utm_source=mindbase-readme)'s features.

> **NOTE**: This project is under active development and may include breaking changes in subsequent releases.

## Features

- **Multi-tenant Architecture**: Support for multiple organizations in a single deployment
- **RAG (Retrieval-Augmented Generation)**: AI responses enhanced with knowledge from your organization's documents
- **Knowledge Management**: Connect to various data sources through Ragie Connect
- **Authentication**: Secure login using Auth.js with Google provider support
- **Customization**: Add your organization's logo and customize the chat interface
- **Multiple LLM Support**: Compatible with OpenAI, Google AI, Anthropic, Groq, and more

## Prerequisites

- Node.js 22+
- PostgreSQL database
- Ragie API key (get one at [ragie.ai](https://ragie.ai))
- API keys for supported LLM providers (OpenAI, Google AI, Anthropic, or Groq)
- Google OAuth credentials (for authentication)

## Setup

Mindbase is built with [Next.js](https://nextjs.org/) and uses [Auth.js](https://authjs.dev/) for authentication.

1. **Clone and install dependencies**

   ```bash
   git clone https://github.com/freddyjaoko/mindbase-chat-app.git
   cd mindbase-chat-app
   npm install
   ```

2. **Database setup**

   ```bash
   # Create PostgreSQL database
   createdb mindbase
   ```

3. **Environment configuration**

   ```bash
   # Copy environment variables template
   cp env.example .env

   # Edit .env file to add required credentials and configuration
   # Required minimums:
   # - DATABASE_URL
   # - RAGIE_API_KEY
   # - At least one LLM provider API key (OPENAI_API_KEY, GOOGLE_GENERATIVE_AI_API_KEY, etc.)
   # - AUTH_GOOGLE_ID and AUTH_GOOGLE_SECRET
   # - ENCRYPTION_KEY (generate with: openssl rand -hex 32)
   # - DEFAULT_PARTITION_LIMIT
   ```

4. **Set up database schema**

   ```bash
   npm run db:migrate
   ```

5. **Start development server**
   ```bash
   npm run dev
   ```

The application will be available at http://localhost:3000.

## Docker Deployment

Mindbase includes Docker support for easy deployment:

```bash
# Build Docker image
docker build -t mindbase .

# Run container (adjust environment variables as needed)
docker run -p 3000:3000 --env-file .env mindbase
```

## Environment Variables

Key environment variables include:

| Variable                     | Description                              | Required         |
| ---------------------------- | ---------------------------------------- | ---------------- |
| DATABASE_URL                 | PostgreSQL connection string             | Yes              |
| RAGIE_API_KEY                | API key from Ragie                       | Yes              |
| OPENAI_API_KEY               | OpenAI API key                           | One LLM required |
| GOOGLE_GENERATIVE_AI_API_KEY | Google AI API key                        | One LLM required |
| ANTHROPIC_API_KEY            | Anthropic API key                        | One LLM required |
| GROQ_API_KEY                 | Groq API key                             | One LLM required |
| AUTH_GOOGLE_ID               | Google OAuth client ID                   | Yes              |
| AUTH_GOOGLE_SECRET           | Google OAuth client secret               | Yes              |
| ENCRYPTION_KEY               | 32-byte hex key for encryption           | Yes              |
| STORAGE\_\*                  | Object storage settings for logo uploads | No               |

See `env.example` for a complete list of configuration options.

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run db:migrate` - Run database migrations
- `npm run update-api-key` - Update your Ragie API key

## License

Distributed under the Apache License 2.0. See `LICENSE.txt` for more information.

## Links

- [Ragie Website](https://www.ragie.ai/?utm_source=mindbase-readme)
- [Ragie Documentation](https://docs.ragie.ai/?utm_source=mindbase-readme)
- [Ragie Connectors](https://www.ragie.ai/connectors?utm_source=mindbase-readme)
