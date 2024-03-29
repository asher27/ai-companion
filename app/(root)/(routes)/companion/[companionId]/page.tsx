import prismadb from '@/lib/prismadb';
import CompanionForm from '@/app/(root)/(routes)/companion/[companionId]/components/companion-form';
import { auth, redirectToSignIn } from '@clerk/nextjs';
import { checkSubscription } from '@/lib/subscription';
import { redirect } from 'next/navigation';

interface CompanionIdPageProps {
  params: {
    companionId: string;
  };
}

const CompanionIdPage = async ({ params }: CompanionIdPageProps) => {
  const { userId } = auth();
  if (!userId) return redirectToSignIn();

  const isPro = await checkSubscription();
  if (!isPro) {
    return redirect('/');
  }

  const companion = await prismadb.companion.findUnique({
    where: {
      id: params.companionId,
      userId
    }
  });
  const categories = await prismadb.category.findMany();

  return <CompanionForm initialData={companion} categories={categories} />;
};

export default CompanionIdPage;
