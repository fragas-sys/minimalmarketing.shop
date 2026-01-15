import { NextRequest, NextResponse } from 'next/server';

/**
 * Endpoint de teste para verificar se webhooks estão chegando
 * Acesse: http://localhost:3000/api/webhooks/stripe/test
 */
export async function GET(req: NextRequest) {
  return NextResponse.json({
    status: 'ok',
    message: 'Webhook endpoint is accessible',
    timestamp: new Date().toISOString(),
    env: {
      hasWebhookSecret: !!process.env.STRIPE_WEBHOOK_SECRET,
      hasStripeKey: !!process.env.STRIPE_SECRET_KEY,
      webhookSecretPrefix: process.env.STRIPE_WEBHOOK_SECRET?.substring(0, 10) + '...',
    },
  });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.text();
    const signature = req.headers.get('stripe-signature');

    return NextResponse.json({
      status: 'received',
      message: 'Test webhook received successfully',
      timestamp: new Date().toISOString(),
      hasSignature: !!signature,
      bodyLength: body.length,
      signaturePrefix: signature?.substring(0, 20) + '...',
    });
  } catch (error: any) {
    return NextResponse.json({
      status: 'error',
      message: error.message,
    }, { status: 500 });
  }
}
