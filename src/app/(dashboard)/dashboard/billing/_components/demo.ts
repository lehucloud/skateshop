import { PlanWithPrice, UserPlan } from "@/types"

// Mock function for getting current user's plan
async function getPlan(): Promise<UserPlan> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 500))

  return {
    id: "free",
    title: "string",
    description: "string",
    features: [],
    stripePriceId: "string",
    stripeSubscriptionId: "1",
    stripeCurrentPeriodEnd: "2",
    stripeCustomerId: "3",
    isSubscribed: true,
    isCanceled: false,
    isActive: true,
    limits: {
      stores: 1,
      products: 2,
      tags: 1,
      variants: 2,
    },
  }
}

// Mock function for getting available plans
async function getPlans(): Promise<PlanWithPrice[]> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 500))

  return [
    {
      id: "free",
      title: "string",
      price: "0.0",
      stripePriceId: "string",
      description: "string",
      features: [],
      limits: {
        stores: 1,
        products: 2,
        tags: 1,
        variants: 2,
      },
    },
    {
      id: "standard",
      title: "string",
      price: "0.0",
      stripePriceId: "string",
      description: "string",
      features: [],
      limits: {
        stores: 1,
        products: 2,
        tags: 1,
        variants: 2,
      },
    },
    {
      id: "pro",
      title: "string",
      price: "0.0",
      stripePriceId: "string",
      description: "string",
      features: [],
      limits: {
        stores: 1,
        products: 2,
        tags: 1,
        variants: 2,
      },
    },
  ]
}

export { getPlan, getPlans }
