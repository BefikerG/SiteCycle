import { notFound } from 'next/navigation';
import { findAllMatchesAction } from '@/app/actions';
import { TransferPlanClient } from './transfer-plan-client';

export default async function TransferPage({
  params,
}: {
  params: { id: string };
}) {
  const matches = await findAllMatchesAction();
  const match = matches.find((m) => m.project.id === params.id);

  if (!match) {
    notFound();
  }

  return <TransferPlanClient match={match} />;
}
