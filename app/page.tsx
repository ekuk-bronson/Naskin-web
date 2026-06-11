import { redirect } from 'next/navigation';
import { sessionUserId } from '@/auth';
import { prisma } from '@/lib/prisma';
import { serializeMole } from '@/lib/serializeMole';
import Shell from '@/components/Shell';
import DashboardClient from '@/components/DashboardClient';

export default async function HomePage() {
  const userId = await sessionUserId();
  if (!userId) redirect('/login');

  const moles = (
    await prisma.mole.findMany({ where: { userId }, orderBy: { createdAt: 'desc' } })
  ).map(serializeMole);

  return (
    <Shell>
      <DashboardClient moles={moles} />
    </Shell>
  );
}
