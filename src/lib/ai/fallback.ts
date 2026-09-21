import { AIProvider, MatchExplanationInput, TransferPlanInput } from './provider';
import {
  MaterialExtractionResult,
  MatchExplanation,
  TransferRecommendation,
} from './schemas';
import { resolveMaterialKey, getMaterialDisplayName, getMaterialUnit } from '@/lib/materials/taxonomy';

export function createDeterministicFallbackProvider(): AIProvider {
  return {
    async extractMaterials(text: string): Promise<MaterialExtractionResult> {
      const materials: MaterialExtractionResult['materials'] = [];
      const unparsed: string[] = [];

      // Use regex to find all quantity + material patterns
      // Pattern: quantity (with commas) followed by material description
      // Matches: "1,200 hollow blocks", "20 steel beams", "45 sheets of plywood"
      const pattern = /(\d{1,3}(?:,\d{3})*(?:\.\d+)?)\s+(?:about|around|approximately\s+)?([^,;]+?)(?=\s*(?:[,;]|and\s+|$))/gi;
      
      let match;
      let lastIndex = 0;
      while ((match = pattern.exec(text)) !== null) {
        const quantityStr = match[1];
        const quantity = parseFloat(quantityStr.replace(/,/g, ''));
        const materialText = match[2].trim()
          .replace(/^(about|around|approximately)\s+/i, '')
          .replace(/^\s+/, '');
        
        const materialKey = resolveMaterialKey(materialText);

        if (materialKey !== 'unknown') {
          materials.push({
            rawText: match[0].trim(),
            material: materialKey,
            displayName: getMaterialDisplayName(materialKey),
            quantity,
            unit: getMaterialUnit(materialKey),
            confidence: 0.7,
          });
        } else {
          unparsed.push(match[0].trim());
        }
        lastIndex = match.index + match[0].length;
      }

      // Check for any remaining text after the last match
      const remaining = text.slice(lastIndex).trim();
      if (remaining && remaining.length > 2) {
        // Try to extract from remaining
        const qtyMatch = remaining.match(/(\d{1,3}(?:,\d{3})*(?:\.\d+)?)/);
        if (qtyMatch) {
          const quantity = parseFloat(qtyMatch[1].replace(/,/g, ''));
          const materialText = remaining.replace(qtyMatch[0], '').trim()
            .replace(/^(about|around|approximately)\s+/i, '');
          const materialKey = resolveMaterialKey(materialText);
          
          if (materialKey !== 'unknown') {
            materials.push({
              rawText: remaining,
              material: materialKey,
              displayName: getMaterialDisplayName(materialKey),
              quantity,
              unit: getMaterialUnit(materialKey),
              confidence: 0.7,
            });
          } else {
            unparsed.push(remaining);
          }
        } else {
          unparsed.push(remaining);
        }
      }

      return { materials, unparsed };
    },

    async explainMatch(facts: MatchExplanationInput): Promise<MatchExplanation> {
      const coverage = Math.min(facts.availableQuantity / facts.neededQuantity, 1);
      const coveragePct = Math.round(coverage * 100);

      let summary = `${facts.overallScore}% match: ${facts.destinationProject} needs ${facts.neededQuantity.toLocaleString()} ${facts.material.toLowerCase()}, `;
      summary += `you have ${facts.availableQuantity.toLocaleString()} available (${coveragePct}% coverage), `;
      summary += `${facts.distanceKm.toFixed(1)} km away. `;

      if (facts.condition === 'good') summary += 'Materials are in good condition. ';
      else if (facts.condition === 'fair') summary += 'Materials are in fair condition. ';
      else summary += 'Material condition is unknown. ';

      if (facts.urgencyStatus === 'comfortable') summary += 'Timeline is comfortable for transfer.';
      else if (facts.urgencyStatus === 'tight') summary += 'Timeline is tight but feasible.';
      else if (facts.urgencyStatus === 'late') summary += 'Transfer would be slightly late.';
      else summary += 'Timeline is flexible.';

      const highlights: string[] = ['Same material'];
      if (coverage >= 1) highlights.push('Quantity exceeds demand');
      else if (coverage >= 0.5) highlights.push('Sufficient quantity');
      if (facts.distanceKm <= 10) highlights.push('Very close distance');
      else if (facts.distanceKm <= 25) highlights.push('Within local radius');
      if (facts.condition === 'good') highlights.push('Good condition');
      if (facts.urgencyStatus === 'comfortable' || facts.urgencyStatus === 'flexible') highlights.push('Compatible timeline');

      return { summary, highlights };
    },

    async generateTransferPlan(facts: TransferPlanInput): Promise<TransferRecommendation> {
      const materialsList = facts.materials
        .map((m) => `${m.quantity.toLocaleString()} ${m.material}`)
        .join(', ');

      let recommendation = `Coordinate transfer of ${materialsList} from ${facts.sourceProject} to ${facts.destinationProject}; `;

      if (facts.distanceKm <= 10) {
        recommendation += `at ${facts.distanceKm.toFixed(1)} km this is a very short local transfer.`;
      } else if (facts.distanceKm <= 25) {
        recommendation += `at ${facts.distanceKm.toFixed(1)} km this is a short local transfer well suited to a single truck run.`;
      } else {
        recommendation += `at ${facts.distanceKm.toFixed(1)} km this is a moderate distance transfer requiring coordination.`;
      }

      return { recommendation };
    },
  };
}

export const fallbackProvider = createDeterministicFallbackProvider();