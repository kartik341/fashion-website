import { NextRequest } from 'next/server';
import crypto from 'crypto';
import { getSession } from '@/lib/auth';

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session) return Response.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const { razorpayOrderId, razorpayPaymentId, razorpaySignature } = await req.json();

    const keySecret = process.env.RAZORPAY_KEY_SECRET!;
    const body = `${razorpayOrderId}|${razorpayPaymentId}`;
    const expectedSignature = crypto
      .createHmac('sha256', keySecret)
      .update(body)
      .digest('hex');

    if (expectedSignature !== razorpaySignature) {
      return Response.json({ verified: false, error: 'Invalid signature' }, { status: 400 });
    }

    return Response.json({ verified: true });
  } catch (err) {
    console.error('Razorpay verify error:', err);
    return Response.json({ error: 'Verification failed' }, { status: 500 });
  }
}
