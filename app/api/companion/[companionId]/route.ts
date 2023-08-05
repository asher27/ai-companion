import { NextRequest, NextResponse } from 'next/server';
import { auth, currentUser } from '@clerk/nextjs';
import prismadb from '@/lib/prismadb';
import {checkSubscription} from "@/lib/subscription";

export async function PATCH(
  req: NextRequest,
  {
    params
  }: {
    params: {
      companionId: string;
    };
  }
) {
  try {
    const user = await currentUser();
    const body = await req.json();
    const { src, name, description, instructions, seed, categoryId } = body;

    if (!params.companionId) {
      return new NextResponse('Companion Id required', { status: 400 });
    }

    if (!user || !user.id || !user.firstName) {
      return new NextResponse('Unauthrized', { status: 401 });
    }

    if (!src || !name || !description || !instructions || !seed || !categoryId) {
      return new NextResponse('Missing required fields', { status: 400 });
    }


    const isPro = await checkSubscription();
    if (!isPro) {
      return new NextResponse('Pro subscription required', { status: 403 });
    }

    const companion = await prismadb.companion.update({
      where: {
        id: params.companionId,
        userId: user.id
      },
      data: {
        src,
        name,
        description,
        instructions,
        seed,
        categoryId,
        userId: user.id,
        userName: user.firstName
      }
    });

    return NextResponse.json(companion);
  } catch (e) {
    console.log('[COMPANION_PATCH]', e);
    return new NextResponse('Internal Error', { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { companionId: string } }) {
  try {
    const { userId } = auth();

    if (!userId) return new NextResponse('Unauthorized', { status: 401 });

    const companion = await prismadb.companion.delete({
      where: {
        id: params.companionId,
        userId
      }
    });

    return NextResponse.json(companion);
  } catch (e) {
    console.log('COMPANION_DELETE', e);
    return new NextResponse('Internal Error', { status: 500 });
  }
}
