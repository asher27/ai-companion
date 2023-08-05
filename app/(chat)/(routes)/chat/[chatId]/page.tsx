import { auth, redirectToSignIn } from '@clerk/nextjs';
import prismadb from '@/lib/prismadb';
import { redirect } from 'next/navigation';
import ChatClient from './components/chat-client';

interface ChatIdPageProps {
  params: {
    chatId: string;
  };
}

const ChatIdPage = async ({ params }: ChatIdPageProps) => {
  const { userId } = auth();
  if (!userId) return redirectToSignIn();

  const companion = await prismadb.companion.findUnique({
    where: {
      id: params.chatId
    },
    include: {
      messages: {
        where: {
          userId
        },
        orderBy: {
          createdAt: 'asc'
        }
      },
      _count: {
        select: {
          messages: true
        }
      }
    }
  });

  if (!companion) return redirect('/');

  return <ChatClient companion={companion} />;
};

export default ChatIdPage;
