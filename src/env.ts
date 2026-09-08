export interface Env {
  APP_KV?: KVNamespace;
  ASSETS?: Fetcher;
  ADMIN_TOKEN?: string;
  MCP_ACCESS_TOKEN?: string;
  GEMINI_API_KEY?: string; GEMINI_MODEL?: string;
  OPENAI_API_KEY?: string; OPENAI_MODEL?: string;
  OPENAI_COMPAT_API_KEY?: string; OPENAI_COMPAT_BASE_URL?: string; OPENAI_COMPAT_MODEL?: string;
  DEFAULT_CHAT_PROVIDER?: string;
  GOOGLE_CLIENT_ID?: string; GOOGLE_CLIENT_SECRET?: string; GOOGLE_REFRESH_TOKEN?: string;
  TELEGRAM_BOT_TOKEN?: string; TELEGRAM_WEBHOOK_SECRET?: string;
  DB_HOST?: string; DB_PORT?: string; DB_NAME?: string; DB_USER?: string; DB_PASSWORD?: string;
}