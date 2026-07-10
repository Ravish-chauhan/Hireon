const { UserSubscription, SubscriptionPlan } = require('../../models/Subscription');

// Check if user has active subscription
const checkSubscription = async (req, res, next) => {
  try {
    const subscription = await UserSubscription.findOne({
      userId: req.user.id,
      status: 'active',
      endDate: { $gt: new Date() }
    });

    req.subscription = subscription;
    req.isSubscribed = !!subscription;
    
    if (subscription) {
      const plan = await SubscriptionPlan.findOne({ planId: subscription.planId });
      req.subscriptionPlan = plan;
    }
    
    next();
  } catch (error) {
    res.status(500).json({ success: false, message: 'Subscription check failed' });
  }
};

// Check specific feature access
const checkFeatureAccess = (featureName) => {
  return async (req, res, next) => {
    try {
      if (!req.subscription) {
        return res.status(403).json({ 
          success: false, 
          message: 'Subscription required',
          feature: featureName,
          upgradeRequired: true
        });
      }

      const plan = await SubscriptionPlan.findOne({ planId: req.subscription.planId });
      const feature = plan.features.find(f => f.name === featureName);
      
      if (!feature || !feature.included) {
        return res.status(403).json({ 
          success: false, 
          message: 'Feature not included in your plan',
          feature: featureName,
          upgradeRequired: true
        });
      }

      // Check usage limits
      if (feature.limit > 0) {
        const currentUsage = req.subscription.usage[featureName] || 0;
        if (currentUsage >= feature.limit) {
          return res.status(403).json({ 
            success: false, 
            message: 'Feature limit exceeded',
            feature: featureName,
            limit: feature.limit,
            used: currentUsage,
            upgradeRequired: true
          });
        }
      }

      req.featureLimit = feature.limit;
      req.featureUsage = req.subscription.usage[featureName] || 0;
      next();
    } catch (error) {
      res.status(500).json({ success: false, message: 'Feature access check failed' });
    }
  };
};

// Update feature usage
const updateFeatureUsage = async (userId, featureName, increment = 1) => {
  try {
    const subscription = await UserSubscription.findOne({
      userId,
      status: 'active'
    });

    if (subscription) {
      const updateField = `usage.${featureName}`;
      await UserSubscription.updateOne(
        { _id: subscription._id },
        { $inc: { [updateField]: increment } }
      );
    }
  } catch (error) {
    console.error('Failed to update feature usage:', error);
  }
};

// Get user's feature limits and usage
const getFeatureLimits = async (userId) => {
  try {
    const subscription = await UserSubscription.findOne({
      userId,
      status: 'active'
    });

    if (!subscription) {
      return {
        plan: 'free',
        features: {
          ai_assessments: { limit: 1, used: 0 },
          consultations: { limit: 1, used: 0 }
        }
      };
    }

    const plan = await SubscriptionPlan.findOne({ planId: subscription.planId });
    const limits = {};
    
    plan.features.forEach(feature => {
      limits[feature.name] = {
        limit: feature.limit,
        used: subscription.usage[feature.name] || 0,
        unlimited: feature.limit === -1
      };
    });

    return {
      plan: subscription.planId,
      features: limits
    };
  } catch (error) {
    console.error('Failed to get feature limits:', error);
    return null;
  }
};

module.exports = {
  checkSubscription,
  checkFeatureAccess,
  updateFeatureUsage,
  getFeatureLimits
};