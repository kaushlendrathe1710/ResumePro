import { getStripeSync, getUncachableStripeClient } from './stripeClient';
import { storage } from './storage';

export class WebhookHandlers {
  static async processWebhook(payload: Buffer, signature: string): Promise<void> {
    if (!Buffer.isBuffer(payload)) {
      throw new Error(
        'STRIPE WEBHOOK ERROR: Payload must be a Buffer. ' +
        'Received type: ' + typeof payload + '. ' +
        'This usually means express.json() parsed the body before reaching this handler. ' +
        'FIX: Ensure webhook route is registered BEFORE app.use(express.json()).'
      );
    }

    const sync = await getStripeSync();
    await sync.processWebhook(payload, signature);
  }

  static async handleCheckoutSessionFromWebhook(payload: any): Promise<void> {
    try {
      const payloadStr = payload.toString();
      const body = JSON.parse(payloadStr);
      
      if (body.type === 'checkout.session.completed') {
        const session = body.data?.object;
        if (session) {
          await WebhookHandlers.activateSubscriptionFromSession(session);
        }
      }
    } catch (err) {
      console.error('Error parsing webhook for subscription activation:', err);
    }
  }

  static async activateSubscriptionFromSession(session: any): Promise<void> {
    const userId = session.metadata?.userId || session.client_reference_id;
    const planId = session.metadata?.planId;
    const sessionId = session.id;

    if (!userId || !planId) {
      console.log('Checkout session missing metadata:', { userId, planId });
      return;
    }

    if (session.payment_status !== 'paid') {
      console.log('Payment not completed for session:', sessionId);
      return;
    }

    try {
      const existingSub = await storage.getUserSubscriptionWithPlan(userId);
      
      if (existingSub && existingSub.subscription.stripePaymentId === sessionId) {
        console.log('Subscription already activated for session:', sessionId);
        return;
      }

      const plan = await storage.getSubscriptionPlan(planId);
      if (!plan) {
        console.error('Plan not found for webhook:', planId);
        return;
      }

      if (existingSub?.subscription.isActive) {
        await storage.deactivateUserSubscription(existingSub.subscription.id);
      }

      const startDate = new Date();
      const endDate = new Date();
      endDate.setDate(endDate.getDate() + plan.validityDays);

      await storage.createUserSubscription({
        userId,
        planId: plan.id,
        startDate,
        endDate,
        isActive: true,
        downloadsRemaining: plan.downloadLimit,
        stripePaymentId: sessionId,
      });

      console.log('Subscription activated via webhook for user:', userId);
    } catch (error) {
      console.error('Error activating subscription via webhook:', error);
    }
  }
}
