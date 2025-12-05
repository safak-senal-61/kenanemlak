import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { email, name, phone } = body

    if (!email || !name) {
      return NextResponse.json(
        { error: 'Email ve İsim zorunludur.' },
        { status: 400 }
      )
    }

    // Check if already subscribed
    const existingSubscriber = await prisma.subscriber.findUnique({
      where: { email },
    })

    if (existingSubscriber) {
      return NextResponse.json(
        { error: 'Bu email adresi zaten kayıtlı.' },
        { status: 400 }
      )
    }

    const subscriber = await prisma.subscriber.create({
      data: {
        email,
        name,
        phone,
      },
    })

    return NextResponse.json(subscriber)
  } catch (error) {
    console.error('Subscription error:', error)
    return NextResponse.json(
      { error: 'Abone olunurken bir hata oluştu.' },
      { status: 500 }
    )
  }
}
