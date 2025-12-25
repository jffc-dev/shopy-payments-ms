import { Injectable, RawBodyRequest } from '@nestjs/common';
import { envs } from 'src/config';
import Stripe from 'stripe';
import { PaymentSessionDto } from './dto/create-payment.dto';
import { Request, Response } from 'express';

@Injectable()
export class PaymentsService {
  private readonly stripe = new Stripe(envs.stripeSecret);

  async createPaymentSession(paymentSessionDto: PaymentSessionDto) {
    const { currency, items } = paymentSessionDto;
    const lineItems = items.map((item) => {
      return {
        price_data: {
          currency,
          product_data: {
            name: item.name,
          },
          unit_amount: Math.round(item.price * 100),
        },
        quantity: item.quantity,
      };
    });
    const session = await this.stripe.checkout.sessions.create({
      // fill with the order id
      payment_intent_data: {
        metadata: {},
      },
      line_items: lineItems,
      mode: 'payment',
      success_url: 'http://localhost:3003/payments/success',
      cancel_url: 'http://localhost:3003/payments/cancel',
    });

    return session;
  }

  stripeWebhook(req: RawBodyRequest<Request>, res: Response) {
    const signature = req.headers['stripe-signature'];
    const endpointSecret = envs.stripeEndpointSecret;

    if (!signature) {
      console.log('No stripe signature found');
      return res.sendStatus(400);
    }

    const rawBody = req.rawBody;

    if (!rawBody) {
      console.log('No raw body found');
      return res.sendStatus(400);
    }

    let event: Stripe.Event;
    try {
      event = this.stripe.webhooks.constructEvent(
        rawBody,
        signature,
        endpointSecret,
      );
    } catch (err) {
      console.log(
        `Webhook signature verification failed: ${(err as Error).message}`,
      );
      return res.sendStatus(400);
    }

    console.log(event);
    // console.log('Webhook verified successfully:', event.type);
    // // Handle different event types here
    // switch (event.type) {
    //   case 'charge.succeeded':
    //     console.log('Payment succeeded:', event.data.object);
    //     break;
    //   case 'charge.failed':
    //     console.log('Payment failed:', event.data.object);
    //     break;
    //   default:
    //     console.log(`Unhandled event type ${event.type}`);
    // }

    return res.json({ received: true });
  }
}
