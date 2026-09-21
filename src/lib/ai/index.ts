import { AIProvider } from './provider';
import { openRouterProvider } from './openrouter';
import { fallbackProvider } from './fallback';

let aiProvider: AIProvider | null = null;

export function getAIProvider(): AIProvider {
  if (aiProvider) return aiProvider;

  const hasApiKey = !!process.env.OPENROUTER_API_KEY;

  if (hasApiKey) {
    aiProvider = {
      async extractMaterials(text) {
        try {
          return await openRouterProvider.extractMaterials(text);
        } catch (error) {
          console.warn('[AI] Extraction failed, using fallback:', error);
          return fallbackProvider.extractMaterials(text);
        }
      },
      async explainMatch(facts) {
        try {
          return await openRouterProvider.explainMatch(facts);
        } catch (error) {
          console.warn('[AI] Explanation failed, using fallback:', error);
          return fallbackProvider.explainMatch(facts);
        }
      },
      async generateTransferPlan(facts) {
        try {
          return await openRouterProvider.generateTransferPlan(facts);
        } catch (error) {
          console.warn('[AI] Transfer plan failed, using fallback:', error);
          return fallbackProvider.generateTransferPlan(facts);
        }
      },
    };
  } else {
    console.log('[AI] No API key configured, using deterministic fallback');
    aiProvider = fallbackProvider;
  }

  return aiProvider;
}

export function resetAIProvider() {
  aiProvider = null;
}