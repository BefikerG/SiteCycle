'use client';

import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Loader2, Sparkles, CheckCircle2, AlertCircle, Plus, Trash2, ArrowRight, Package, PenLine } from 'lucide-react';
import { getMaterialDisplayName, getMaterialUnit, getAllMaterials, CANONICAL_MATERIALS } from '@/lib/materials/taxonomy';
import { MaterialKey, MaterialUnit, MaterialCondition } from '@/lib/types';
import { cn } from '@/lib/utils';

const DEMO_TEXT =
  'We have about 1,200 hollow blocks, 20 steel beams and around 45 sheets of plywood left over.';

const STEPS = ['Describe surplus', 'Review & edit', 'Confirm'];

interface ExtractedMaterial {
  rawText: string;
  material: MaterialKey | 'unknown';
  displayName: string;
  quantity: number;
  unit: MaterialUnit;
  confidence: number;
  condition: MaterialCondition;
  id: string;
}

const CONDITION_OPTIONS: { value: MaterialCondition; label: string }[] = [
  { value: 'good', label: 'Good' },
  { value: 'fair', label: 'Fair' },
  { value: 'poor', label: 'Poor' },
  { value: 'unknown', label: 'Unknown' },
];

const MATERIAL_OPTIONS = getAllMaterials().map((m) => ({ value: m.key, label: m.name }));

function confidenceTone(confidence: number) {
  if (confidence >= 0.8) return 'bg-success';
  if (confidence >= 0.6) return 'bg-warning';
  return 'bg-destructive';
}

export default function DeclareSurplusPage() {
  const [rawText, setRawText] = useState(DEMO_TEXT);
  const [extractedMaterials, setExtractedMaterials] = useState<ExtractedMaterial[]>([]);
  const [isExtracting, setIsExtracting] = useState(false);
  const [extractionError, setExtractionError] = useState<string | null>(null);
  const [step, setStep] = useState<'input' | 'review' | 'confirm'>('input');
  const [confirmedMaterials, setConfirmedMaterials] = useState<ExtractedMaterial[]>([]);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const stepIndex = step === 'input' ? 0 : step === 'review' ? 1 : 2;

  const handleExtract = async () => {
    if (!rawText.trim()) return;

    setIsExtracting(true);
    setExtractionError(null);

    try {
      const response = await fetch('/api/ai/extract', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: rawText }),
      });

      if (!response.ok) throw new Error('Extraction failed');

      const data = await response.json();
      const materials: ExtractedMaterial[] = data.materials.map((m: any, i: number) => ({
        ...m,
        condition: 'unknown' as MaterialCondition,
        id: `ext-${Date.now()}-${i}`,
      }));

      setExtractedMaterials(materials);
      if (data.unparsed.length > 0) {
        setExtractionError(`Could not parse: ${data.unparsed.join(', ')}`);
      }
      setStep('review');
    } catch (error) {
      setExtractionError('AI extraction unavailable. Please enter materials manually.');
      setStep('review');
    } finally {
      setIsExtracting(false);
    }
  };

  const handleConfirm = () => {
    setConfirmedMaterials(extractedMaterials);
    setStep('confirm');
  };

  const handleAddManual = () => {
    const newMaterial: ExtractedMaterial = {
      id: `manual-${Date.now()}`,
      rawText: '',
      material: 'concrete_block',
      displayName: 'Hollow Concrete Block',
      quantity: 1,
      unit: 'piece',
      confidence: 1,
      condition: 'unknown',
    };
    setExtractedMaterials([...extractedMaterials, newMaterial]);
  };

  const updateMaterial = (id: string, updates: Partial<ExtractedMaterial>) => {
    setExtractedMaterials(extractedMaterials.map((m) => (m.id === id ? { ...m, ...updates } : m)));
  };

  const removeMaterial = (id: string) => {
    setExtractedMaterials(extractedMaterials.filter((m) => m.id !== id));
  };

  const handleSave = async () => {
    alert('Materials saved! In the full app, this would redirect to /matches');
  };

  if (step === 'confirm') {
    return (
      <div className="container-padded section-spacing max-w-3xl">
        <StepIndicator current={stepIndex} />
        <div className="mt-10 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-success/15">
            <CheckCircle2 className="h-7 w-7 text-success" />
          </div>
          <h1 className="mt-5 text-3xl font-bold tracking-tight">Surplus Confirmed</h1>
          <p className="mt-2 text-muted-foreground">
            {confirmedMaterials.length} material
            {confirmedMaterials.length === 1 ? '' : 's'} added to inventory.
          </p>
        </div>

        <Card className="mt-8">
          <CardContent className="p-6">
            <div className="space-y-3">
              {confirmedMaterials.map((material) => (
                <div
                  key={material.id}
                  className="flex items-center justify-between rounded-lg border border-border/70 p-4"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-success/15">
                      <CheckCircle2 className="h-4 w-4 text-success" />
                    </div>
                    <div>
                      <p className="font-medium">{material.displayName}</p>
                      <p className="text-sm text-muted-foreground tabular-nums">
                        {material.quantity.toLocaleString()} {material.unit}
                        {material.confidence < 0.6 && (
                          <Badge variant="destructive" className="ml-2">
                            Low Confidence
                          </Badge>
                        )}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-6 flex gap-3">
              <Button onClick={() => setStep('review')} variant="outline">
                Edit Materials
              </Button>
              <Button onClick={handleSave} className="gap-2">
                Find Matches
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container-padded section-spacing max-w-4xl">
      <div className="max-w-2xl">
        <div className="page-eyebrow">
          <Package className="h-3.5 w-3.5" />
          Declare surplus
        </div>
        <h1 className="page-title">What&apos;s left on your site?</h1>
        <p className="page-description">
          Describe surplus materials in plain language. AI extracts structured data for you to
          review and confirm.
        </p>
      </div>

      <div className="mt-8">
        <StepIndicator current={stepIndex} />
      </div>

      <Card className="mt-8">
        <CardHeader className="border-b border-border/70 pb-4">
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-primary" />
            Step 1 · Describe surplus
          </CardTitle>
          <CardDescription>
            Enter a natural-language description of leftover materials on your site.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <Textarea
            ref={textareaRef}
            value={rawText}
            onChange={(e) => setRawText(e.target.value)}
            placeholder={DEMO_TEXT}
            className="min-h-[116px] font-mono text-sm leading-6"
            rows={4}
          />
          <div className="mt-4 flex flex-wrap items-center gap-3">
            <Button
              onClick={handleExtract}
              disabled={isExtracting || !rawText.trim()}
              className="gap-2"
            >
              {isExtracting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Understanding…
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4" />
                  Extract with AI
                </>
              )}
            </Button>
            <Button variant="outline" onClick={handleAddManual}>
              <Plus className="h-4 w-4" />
              Add Manually
            </Button>
          </div>
          {extractionError && (
            <div className="mt-4 flex items-center gap-2 rounded-lg border border-warning/20 bg-warning/10 p-3 text-sm text-warning">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{extractionError}</span>
            </div>
          )}
        </CardContent>
      </Card>

      {extractedMaterials.length > 0 && (
        <Card className="mt-6 overflow-hidden">
          <CardHeader className="border-b border-border/70 pb-4">
            <CardTitle className="flex items-center gap-2">
              <PenLine className="h-4 w-4 text-primary" />
              Step 2 · Review & edit
            </CardTitle>
            <CardDescription>
              Edit quantities, units, or conditions before confirming.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Material</TableHead>
                    <TableHead className="text-right">Quantity</TableHead>
                    <TableHead>Unit</TableHead>
                    <TableHead>Condition</TableHead>
                    <TableHead>Confidence</TableHead>
                    <TableHead />
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {extractedMaterials.map((material) => (
                    <TableRow key={material.id}>
                      <TableCell>
                        <Select
                          value={material.material}
                          onValueChange={(value) => {
                            const selected = CANONICAL_MATERIALS.find((m) => m.key === value);
                            updateMaterial(material.id, {
                              material: value as MaterialKey,
                              displayName: selected?.name ?? value,
                              unit: (selected?.unit ?? 'piece') as MaterialUnit,
                            });
                          }}
                        >
                          <SelectTrigger className="w-[210px]">
                            <SelectValue placeholder="Select material" />
                          </SelectTrigger>
                          <SelectContent>
                            {MATERIAL_OPTIONS.map((opt) => (
                              <SelectItem key={opt.value} value={opt.value}>
                                {opt.label}
                              </SelectItem>
                            ))}
                            <SelectItem value="unknown">Unknown / Other</SelectItem>
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell>
                        <Input
                          type="number"
                          value={material.quantity}
                          onChange={(e) =>
                            updateMaterial(material.id, {
                              quantity: parseFloat(e.target.value) || 0,
                            })
                          }
                          min="0"
                          step="1"
                          className="h-9 w-24 text-right tabular-nums"
                        />
                      </TableCell>
                      <TableCell>
                        <Select
                          value={material.unit}
                          onValueChange={(value) =>
                            updateMaterial(material.id, { unit: value as MaterialUnit })
                          }
                        >
                          <SelectTrigger className="w-[116px]">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="piece">Piece</SelectItem>
                            <SelectItem value="sheet">Sheet</SelectItem>
                            <SelectItem value="box">Box</SelectItem>
                            <SelectItem value="bag">Bag</SelectItem>
                            <SelectItem value="ton">Ton</SelectItem>
                            <SelectItem value="m3">m³</SelectItem>
                            <SelectItem value="m2">m²</SelectItem>
                            <SelectItem value="linear_m">Linear m</SelectItem>
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell>
                        <Select
                          value={material.condition || 'unknown'}
                          onValueChange={(value) =>
                            updateMaterial(material.id, {
                              condition: value as MaterialCondition,
                            })
                          }
                        >
                          <SelectTrigger className="w-[116px]">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {CONDITION_OPTIONS.map((opt) => (
                              <SelectItem key={opt.value} value={opt.value}>
                                {opt.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div className="flex-1 max-w-[80px]">
                            <div className="h-1.5 overflow-hidden rounded-full bg-muted">
                              <div
                                className={cn(
                                  'h-full rounded-full',
                                  confidenceTone(material.confidence)
                                )}
                                style={{ width: `${material.confidence * 100}%` }}
                              />
                            </div>
                          </div>
                          <span className="w-10 text-right text-xs text-muted-foreground tabular-nums">
                            {Math.round(material.confidence * 100)}%
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-muted-foreground hover:text-destructive"
                          onClick={() => removeMaterial(material.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                          <span className="sr-only">Remove {material.displayName}</span>
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            <div className="flex flex-col gap-3 border-t border-border/70 bg-muted/30 p-4 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm text-muted-foreground tabular-nums">
                {extractedMaterials.length} material{extractedMaterials.length === 1 ? '' : 's'} to
                confirm
                <Button variant="ghost" size="sm" onClick={handleAddManual} className="ml-2">
                  <Plus className="h-3.5 w-3.5" />
                  Add another
                </Button>
              </p>
              <Button
                onClick={handleConfirm}
                className="gap-2"
                disabled={extractedMaterials.length === 0}
              >
                Confirm & Find Matches
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <Card className="mt-6 border-border/70">
        <CardContent className="flex items-start gap-3 p-5">
          <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
          <div className="text-sm leading-6 text-muted-foreground">
            <p className="font-medium text-foreground">Demo tip</p>
            <p className="mt-1">
              Try the example: <code className="rounded bg-muted px-1.5 py-0.5 text-xs">{DEMO_TEXT}</code>
            </p>
            <p className="mt-1">
              Or describe your own: &quot;50 bags of cement, 10 tons of rebar, 200 roofing sheets&quot;
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function StepIndicator({ current }: { current: number }) {
  return (
    <ol className="flex items-center gap-2" aria-label="Progress">
      {STEPS.map((label, index) => {
        const state = index < current ? 'done' : index === current ? 'active' : 'upcoming';
        return (
          <li key={label} className="flex flex-1 items-center gap-2">
            <span
              className={cn(
                'flex h-6 w-6 shrink-0 items-center justify-center rounded-full border text-xs font-semibold tabular-nums',
                state === 'done' && 'border-success bg-success text-success-foreground',
                state === 'active' && 'border-primary bg-primary text-primary-foreground',
                state === 'upcoming' && 'border-border bg-background text-muted-foreground'
              )}
            >
              {state === 'done' ? <CheckCircle2 className="h-3.5 w-3.5" /> : index + 1}
            </span>
            <span
              className={cn(
                'hidden text-xs font-medium sm:block',
                state === 'active' ? 'text-foreground' : state === 'upcoming' ? 'text-muted-foreground' : 'text-foreground'
              )}
            >
              {label}
            </span>
            {index < STEPS.length - 1 && (
              <span
                className={cn(
                  'h-px flex-1',
                  state === 'done' || (index + 1 === current)
                    ? 'bg-border'
                    : 'bg-border/50'
                )}
                aria-hidden="true"
              />
            )}
          </li>
        );
      })}
    </ol>
  );
}