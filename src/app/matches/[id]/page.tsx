import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { findAllMatchesAction } from '@/app/actions';
import { MatchDetailClient } from './match-detail-client';

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  return {
    title: `Match Detail — SiteCycle`,
    description: `View detailed match analysis for project ${id}`,
  };
}

export default async function MatchDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const matches = await findAllMatchesAction();
  const match = matches.find((m) => m.project.id === id);

  if (!match) {
    notFound();
  }

  return <MatchDetailClient match={match} />;
}