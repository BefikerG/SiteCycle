import { AIProvider, MatchExplanationInput, TransferPlanInput } from './provider';
import {
  MaterialExtractionResult,
  MaterialExtractionResultSchema,
  MatchExplanation,
  MatchExplanationSchema,
  TransferRecommendation,
  TransferRecommendationSchema,
} from './schemas';
import { EXTRACTION_PROMPT, MATCH_EXPLANATION_PROMPT, TRANSFER_PLAN_PROMPT } from './prompts';

const OPENROUTER_API_URL = 'https://openrouter.ai/api/v1/chat/completions';
const DEFAULT_MODEL = process.env.OPENROUTER_MODEL || 'nvidia/nemotron-3-ultra';

async function callOpenRouter(
  messages: { role: string; content: string }[],
  responseSchema: any,
  maxRetries = 1
): Promise<any> {
  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) {
    throw new Error('OPENROUTER_API_KEY not configured');
  }

  const response = await fetch(OPENROUTER_API_URL, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
      'HTTP-Referer': 'https://sitecycle.app',
      'X-Title': 'SiteCycle',
    },
    body: JSON.stringify({
      model: DEFAULT_MODEL,
      messages,
      response_format: { type: 'json_object' },
      temperature: 0.1,
      max_tokens: 1000,
    }),
    signal: AbortSignal.timeout(8000),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`OpenRouter error: ${response.status} ${error}`);
  }

  const data = await response.json();
  const content = data.choices?.[0]?.message?.content;
  if (!content) {
    throw new Error('Empty response from OpenRouter');
  }

  let parsed: any;
  try {
    parsed = JSON.parse(content);
  } catch {
    throw new Error('Invalid JSON from OpenRouter');
  }

  const validation = responseSchema.safeParse(parsed);
  if (!validation.success) {
    if (maxRetries > 0) {
      const retryMessages = [
        ...messages,
        { role: 'assistant', content },
        {
          role: 'user',
          content: `The previous response failed validation: ${validation.error.message}. Please provide a corrected JSON response that matches the schema exactly.`,
        },
      ];
      return callOpenRouter(retryMessages, responseSchema, maxRetries - 1);
    }
    throw new Error(`Schema validation failed: ${validation.error.message}`);
  }

  return validation.data;
}

export const openRouterProvider: AIProvider = {
  async extractMaterials(text: string): Promise<MaterialExtractionResult> {
    const messages = [
      { role: 'system', content: EXTRACTION_PROMPT },
      { role: 'user', content: `Extract materials from: "${text}"` },
    ];
    return callOpenRouter(messages, MaterialExtractionResultSchema);
  },

  async explainMatch(facts: MatchExplanationInput): Promise<MatchExplanation> {
    const prompt = MATCH_EXPLANATION_PROMPT
      .replace('{sourceProject}', facts.sourceProject)
      .replace('{destinationProject}', facts.destinationProject)
      .replace('{material}', facts.material)
      .replace('{availableQuantity}', facts.availableQuantity.toLocaleString())
      .replace('{neededQuantity}', facts.neededQuantity.toLocaleString())
      .replace('{distanceKm}', facts.distanceKm.toFixed(1))
      .replace('{condition}', facts.condition)
      .replace('{urgencyStatus}', facts.urgencyStatus)
      .replace('{overallScore}', facts.overallScore.toString());

    const messages = [
      { role: 'system', content: prompt },
      { role: 'user', content: 'Generate explanation.' },
    ];
    return callOpenRouter(messages, MatchExplanationSchema);
  },

  async generateTransferPlan(facts: TransferPlanInput): Promise<TransferRecommendation> {
    const materialsList = facts.materials
      .map((m) => `${m.quantity.toLocaleString()} ${m.material} (${m.unit})`)
      .join(', ');

    const prompt = TRANSFER_PLAN_PROMPT
      .replace('{sourceProject}', facts.sourceProject)
      .replace('{destinationProject}', facts.destinationProject)
      .replace('{materialsList}', materialsList)
      .replace('{distanceKm}', facts.distanceKm.toFixed(1));

    const messages = [
      { role: 'system', content: prompt },
      { role: 'user', content: 'Generate transfer recommendation.' },
    ];
    return callOpenRouter(messages, TransferRecommendationSchema);
  },
};

export function getAIProvider(): AIProvider {
  return openRouterProvider;
}