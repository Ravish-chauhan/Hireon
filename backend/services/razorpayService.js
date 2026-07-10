const Razorpay = require('razorpay');
const crypto = require('crypto');

class RazorpayService {
  constructor() {
    // Only initialize Razorpay if credentials are available
    if (process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET) {
      this.razorpay = new Razorpay({
        key_id: process.env.RAZORPAY_KEY_ID,
        key_secret: process.env.RAZORPAY_KEY_SECRET,
      });
      this.isConfigured = true;
    } else {
      console.warn('⚠️  Razorpay credentials not found. Payment features will be disabled.');
      this.isConfigured = false;
    }
  }

  _checkConfiguration() {
    if (!this.isConfigured) {
      throw new Error('Razorpay is not configured. Please add RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET to your environment variables.');
    }
  }

  // Create subscription plan in Razorpay
  async createPlan(planData) {
    this._checkConfiguration();
    try {
      const plan = await this.razorpay.plans.create({
        period: planData.period, // 'monthly' or 'yearly'
        interval: 1,
        item: {
          name: planData.name,
          amount: planData.amount * 100, // Convert to paise
          currency: 'INR',
          description: planData.description
        }
      });
      return plan;
    } catch (error) {
      throw new Error(`Failed to create plan: ${error.message}`);
    }
  }

  // Create customer
  async createCustomer(customerData) {
    this._checkConfiguration();
    try {
      const customer = await this.razorpay.customers.create({
        name: customerData.name,
        email: customerData.email,
        contact: customerData.phone || '',
        notes: {
          userId: customerData.userId
        }
      });
      return customer;
    } catch (error) {
      throw new Error(`Failed to create customer: ${error.message}`);
    }
  }

  // Create subscription
  async createSubscription(subscriptionData) {
    this._checkConfiguration();
    try {
      const subscription = await this.razorpay.subscriptions.create({
        plan_id: subscriptionData.planId,
        customer_id: subscriptionData.customerId,
        quantity: 1,
        total_count: subscriptionData.totalCount || 12, // 12 for yearly, adjust as needed
        start_at: subscriptionData.startAt || Math.floor(Date.now() / 1000),
        notes: {
          userId: subscriptionData.userId,
          planType: subscriptionData.planType
        }
      });
      return subscription;
    } catch (error) {
      throw new Error(`Failed to create subscription: ${error.message}`);
    }
  }

  // Create order for one-time payment
  async createOrder(orderData) {
    this._checkConfiguration();
    try {
      const order = await this.razorpay.orders.create({
        amount: orderData.amount * 100, // Convert to paise
        currency: 'INR',
        receipt: `order_${Date.now()}`,
        notes: {
          userId: orderData.userId,
          planId: orderData.planId,
          subscriptionType: orderData.subscriptionType
        }
      });
      return order;
    } catch (error) {
      throw new Error(`Failed to create order: ${error.message}`);
    }
  }

  // Verify payment signature
  verifyPaymentSignature(paymentData) {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = paymentData;
    
    const body = razorpay_order_id + '|' + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest('hex');

    return expectedSignature === razorpay_signature;
  }

  // Verify subscription signature
  verifySubscriptionSignature(subscriptionData) {
    const { razorpay_subscription_id, razorpay_payment_id, razorpay_signature } = subscriptionData;
    
    const body = razorpay_payment_id + '|' + razorpay_subscription_id;
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest('hex');

    return expectedSignature === razorpay_signature;
  }

  // Cancel subscription
  async cancelSubscription(subscriptionId) {
    try {
      const subscription = await this.razorpay.subscriptions.cancel(subscriptionId, {
        cancel_at_cycle_end: 1
      });
      return subscription;
    } catch (error) {
      throw new Error(`Failed to cancel subscription: ${error.message}`);
    }
  }

  // Get subscription details
  async getSubscription(subscriptionId) {
    try {
      const subscription = await this.razorpay.subscriptions.fetch(subscriptionId);
      return subscription;
    } catch (error) {
      throw new Error(`Failed to fetch subscription: ${error.message}`);
    }
  }

  // Get payment details
  async getPayment(paymentId) {
    try {
      const payment = await this.razorpay.payments.fetch(paymentId);
      return payment;
    } catch (error) {
      throw new Error(`Failed to fetch payment: ${error.message}`);
    }
  }
}

module.exports = new RazorpayService();