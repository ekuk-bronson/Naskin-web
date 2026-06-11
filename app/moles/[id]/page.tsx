import { notFound, redirect } from 'next/navigation';
import { sessionUserId } from '@/auth';
import { prisma } from '@/lib/prisma';
import { serializeMole } from '@/lib/serializeMole';
import MoleDetailClient from '@/components/MoleDetailClient';

export default async function MoleDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const userId = await sessionUserId();
  if (!userId) redirect('/login');

  const { id } = await params;
  const numId = Number(id);
  if (!Number.isInteger(numId)) notFound();

  const mole = await prisma.mole.findFirst({ where: { id: numId, userId } });
  if (!mole) notFound();

  return <MoleDetailClient mole={serializeMole(mole)} />;
}
