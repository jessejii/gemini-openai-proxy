// src/chatwrapper.ts
import {
  AuthType,
  createContentGeneratorConfig,
  createContentGenerator,
} from '@google/gemini-cli-core/dist/src/core/contentGenerator.js';

/* ------------------------------------------------------------------ */
/* 1.  Build the ContentGenerator exactly like the CLI does           */
/* ------------------------------------------------------------------ */
let modelName: string;                      // we'll fill this once
const generatorPromise = (async () => {
  // Pass undefined for model so the helper falls back to DEFAULT_GEMINI_MODEL
  const cfg = await createContentGeneratorConfig(
    undefined,                     // let helper pick default (Gemini-2.5-Pro)
    AuthType.USE_GEMINI            // same mode the CLI defaults to
  );
  modelName = cfg.model;           // remember the actual model string
  return await createContentGenerator(cfg);
})();

/* ------------------------------------------------------------------ */
/* 2.  Helpers consumed by server.ts                                   */
/* ------------------------------------------------------------------ */
type GenConfig = Record<string, unknown>;

export async function sendChat({
  contents,
  generationConfig = {},
}: {
  contents: any[];
  generationConfig?: GenConfig;
  tools?: unknown;                // accepted but ignored for now
}) {
  const generator: any = await generatorPromise;
  return await generator.generateContent({
    model: modelName,
    contents,
    config: generationConfig,
  });
}

export async function* sendChatStream({
  contents,
  generationConfig = {},
}: {
  contents: any[];
  generationConfig?: GenConfig;
  tools?: unknown;
}) {
  const generator: any = await generatorPromise;
  const stream = await generator.generateContentStream({
    model: modelName,
    contents,
    config: generationConfig,
  });
  for await (const chunk of stream) yield chunk;
}

/* ------------------------------------------------------------------ */
/* 3.  Minimal stubs so server.ts compiles (extend later)              */
/* ------------------------------------------------------------------ */
export function listModels() {
  return [{ id: modelName }];
}

export async function embed(_input: unknown) {
  throw new Error('Embeddings endpoint not implemented yet.');
}
