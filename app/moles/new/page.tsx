import { redirect } from 'next/navigation';
import { sessionUserId } from '@/auth';
import { prisma } from '@/lib/prisma';
import AddWizard from '@/components/AddWizard';

export default async function NewMolePage({
  searchParams,
}: {
  searchParams: Promise<{ moleId?: string }>;
}) {
  const userId = await sessionUserId();
  if (!userId) redirect('/login');

  const { moleId } = await searchParams;

  // Режим повторного скана: проверяем, что родинка существует и принадлежит пользователю
  let rescanMole: { id: number; name: string } | null = null;
  if (moleId && Number.isInteger(Number(moleId))) {
    rescanMole = await prisma.mole.findFirst({
      where: { id: Number(moleId), userId },
      select: { id: true, name: true },
    });
  }

  const count = await prisma.mole.count({ where: { userId } });

  return (
    <AddWizard
      rescanMoleId={rescanMole?.id ?? null}
      rescanMoleName={rescanMole?.name ?? null}
      defaultName={`Родинка #${count + 1}`}
    />
  );
}
