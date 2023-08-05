import { NextRequest, NextResponse } from 'next/server';
import { currentUser } from '@clerk/nextjs';
import prismadb from '@/lib/prismadb';
import {checkSubscription} from "@/lib/subscription";

export async function POST(req: NextRequest) {
  try {
    const user = await currentUser();
    const body = await req.json();
    const { src, name, description, instructions, seed, categoryId } = body;

    if (!user || !user.id || !user.firstName) {
      return new NextResponse('Unauthorized', { status: 401 });
    }
    if (!src || !name || !description || !instructions || !seed || !categoryId) {
      return new NextResponse('Missing required fields', { status: 400 });
    }


    const isPro = await checkSubscription();
    if (!isPro) {
      return new NextResponse('Pro subscription required', { status: 403 });
    }

    const companion = await prismadb.companion.create({
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
    console.log('[COMPANION_POST]', e);
    return new NextResponse('Internal Error', { status: 500 });
  }
}
