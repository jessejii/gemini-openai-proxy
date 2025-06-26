# Gemini ↔︎ OpenAI Proxy

Serve **Google Gemini 2.5 Pro** (or Flash) through an **OpenAI-compatible API**.  
Plug-and-play with clients that already speak OpenAI—SillyTavern, llama.cpp, LangChain, the VS Code *Cline* extension, etc.

---

## ✨ Features

| ✔ | Feature | Notes |
|---|---------|-------|
| `/v1/chat/completions` | Non-stream & stream (SSE) | Works with curl, ST, LangChain… |
| Vision support | `image_url` → Gemini `inlineData` | |
| Function / Tool calling | OpenAI “functions” → Gemini Tool Registry | |
| Reasoning / chain-of-thought | Sends `enable_thoughts:true`, streams `<think>` chunks | ST shows grey bubbles |
| 1 M-token context | Proxy auto-lifts Gemini CLI’s default 200 k cap | |
| CORS | Enabled (`*`) by default | Ready for browser apps |
| Zero external deps | Node 22 + TypeScript only | No Express |

---

## 🚀 Quick start (local)

```bash
git clone https://huggingface.co/engineofperplexity/gemini-openai-proxy
cd gemini-openai-proxy
npm ci                        # install deps & ts-node

# launch on port 11434
npx ts-node src/server.ts
Optional env vars
PORT=3000 change listen port
GEMINI_API_KEY=<key> use your own key

Minimal curl test
bash
Copy
Edit
curl -X POST http://localhost:11434/v1/chat/completions \
     -H "Content-Type: application/json" \
     -d '{
       "model": "gemini-2.5-pro-latest",
       "messages":[{"role":"user","content":"Hello Gemini!"}]
     }'
SillyTavern settings
Field	Value
API Base URL	http://127.0.0.1:11434/v1
Model	gemini-2.5-pro-latest
Streaming	On
Reasoning	On → grey <think> lines appear

🐳 Docker
bash
Copy
Edit
# build once
docker build -t gemini-openai-proxy .

# run
docker run -p 11434:11434 \
           -e GEMINI_API_KEY=$GEMINI_API_KEY \
           gemini-openai-proxy
🗂 Project layout
pgsql
Copy
Edit
src/
  server.ts        – minimalist HTTP server
  mapper.ts        – OpenAI ⇄ Gemini transforms
  chatwrapper.ts   – thin wrapper around @google/genai
  remoteimage.ts   – fetch + base64 for vision
package.json       – deps & scripts
Dockerfile
README.md
📜 License
MIT – free for personal & commercial use.