import NextAuth from 'next-auth';
import Google from 'next-auth/providers/google';
import Credentials from 'next-auth/providers/credentials';
import { prisma } from '@/lib/prisma';

const hasGoogle = !!process.env.AUTH_GOOGLE_ID && !!process.env.AUTH_GOOGLE_SECRET;
/** Демо-вход включён, когда нет Google-кредов или явно AUTH_GUEST=1. */
export const guestEnabled = !hasGoogle || process.env.AUTH_GUEST === '1';

const DEMO_USER = {
  id: 'demo-user',
  email: 'demo@freeskin.local',
  name: 'Демо-пользователь',
  avatarUrl: null as string | null,
};

export const { handlers, auth, signIn, signOut } = NextAuth({
  trustHost: true,
  session: { strategy: 'jwt' },
  pages: { signIn: '/login' },
  providers: [
    ...(hasGoogle
      ? [
          Google({
            clientId: process.env.AUTH_GOOGLE_ID,
            clientSecret: process.env.AUTH_GOOGLE_SECRET,
          }),
        ]
      : []),
    ...(guestEnabled
      ? [
          Credentials({
            id: 'guest',
            name: 'Демо-режим',
            credentials: {},
            async authorize() {
              return { id: DEMO_USER.id, email: DEMO_USER.email, name: DEMO_USER.name };
            },
          }),
        ]
      : []),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      // Сохраняем/обновляем пользователя в БД (аналог services/auth.ts)
      const id = account?.provider === 'google' ? (profile?.sub ?? user.id!) : DEMO_USER.id;
      await prisma.user.upsert({
        where: { id },
        update: {
          email: user.email ?? '',
          name: user.name ?? '',
          avatarUrl: user.image ?? null,
        },
        create: {
          id,
          email: user.email ?? '',
          name: user.name ?? '',
          avatarUrl: user.image ?? null,
        },
      });
      return true;
    },
    async jwt({ token, account, profile }) {
      if (account?.provider === 'google' && profile?.sub) token.uid = profile.sub;
      else if (account?.provider === 'guest') token.uid = DEMO_USER.id;
      return token;
    },
    async session({ session, token }) {
      if (token.uid) session.user.id = token.uid as string;
      return session;
    },
  },
});

/** Возвращает id пользователя сессии или null. Для guard'ов страниц и API. */
export async function sessionUserId(): Promise<string | null> {
  const session = await auth();
  return session?.user?.id ?? null;
}
