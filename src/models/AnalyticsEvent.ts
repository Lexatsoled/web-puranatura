import mongoose from 'mongoose';
import { nanoid } from 'nanoid';

const analyticsEventSchema = new mongoose.Schema(
  {
    _id: {
      type: String,
      default: () => nanoid(),
    },
    category: {
      type: String,
      required: true,
      enum: [
        'page_view',
        'product',
        'cart',
        'checkout',
        'search',
        'user',
        'blog',
        'therapy',
      ],
    },
    action: {
      type: String,
      required: true,
    },
    label: String,
    value: Number,
    metadata: mongoose.Schema.Types.Mixed,
    sessionId: {
      type: String,
      required: true,
    },
    userId: String,
    ip: String,
    userAgent: String,
    referrer: String,
    timestamp: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
    collection: 'analytics_events',
  }
);

// Índices para consultas comunes
analyticsEventSchema.index({ category: 1, action: 1 });
analyticsEventSchema.index({ sessionId: 1 });
analyticsEventSchema.index({ userId: 1 });
analyticsEventSchema.index({ timestamp: 1 });
analyticsEventSchema.index({ 'metadata.productId': 1 }, { sparse: true });

// Métodos estáticos para análisis comunes
analyticsEventSchema.statics.getPageViews = async function (
  startDate: Date,
  endDate: Date
) {
  return this.aggregate([
    {
      $match: {
        category: 'page_view',
        timestamp: {
          $gte: startDate,
          $lte: endDate,
        },
      },
    },
    {
      $group: {
        _id: '$metadata.page_path',
        views: { $sum: 1 },
        uniqueSessions: { $addToSet: '$sessionId' },
      },
    },
    {
      $project: {
        page: '$_id',
        views: 1,
        uniqueViews: { $size: '$uniqueSessions' },
      },
    },
    {
      $sort: { views: -1 },
    },
  ]);
};

analyticsEventSchema.statics.getProductAnalytics = async function (
  productId: string,
  startDate: Date,
  endDate: Date
) {
  return this.aggregate([
    {
      $match: {
        category: 'product',
        'metadata.productId': productId,
        timestamp: {
          $gte: startDate,
          $lte: endDate,
        },
      },
    },
    {
      $group: {
        _id: '$action',
        count: { $sum: 1 },
        uniqueUsers: { $addToSet: '$sessionId' },
      },
    },
    {
      $project: {
        action: '$_id',
        count: 1,
        uniqueUsers: { $size: '$uniqueUsers' },
      },
    },
  ]);
};

analyticsEventSchema.statics.getUserJourney = async function (
  sessionId: string
) {
  return this.find({ sessionId }).sort({ timestamp: 1 }).select('-__v').lean();
};

export const AnalyticsEvent = mongoose.model(
  'AnalyticsEvent',
  analyticsEventSchema
);
