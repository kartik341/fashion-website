import { NextRequest } from 'next/server';
import razorpay from '@/lib/razorpay';
import { getSession } from '@/lib/auth';

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session) return Response.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const { amount } = await req.json(); // amount in paise (INR * 100)
    if (!amount || amount < 100) {
      return Response.json({ error: 'Invalid amount' }, { status: 400 });
    }

    const order = await razorpay.orders.create({
      amount: Math.round(amount),
      currency: 'INR',
      receipt: `rcpt_${Date.now()}`,
    });

    return Response.json({ orderId: order.id, amount: order.amount, currency: order.currency });
  } catch (err) {
    console.error('Razorpay create order error:', err);
    return Response.json({ error: 'Failed to create payment order' }, { status: 500 });
  }
}
