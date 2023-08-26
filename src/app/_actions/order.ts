"use server"

import { cookies } from "next/headers"
import { db } from "@/db"
import { carts, orders, products } from "@/db/schema"
import type { CheckoutItem } from "@/types"
import { desc, eq, inArray } from "drizzle-orm"
import { type z } from "zod"

import { stripe } from "@/lib/stripe"
import type {
  getCheckoutSessionProductsSchema,
  getOrderedProductsSchema,
} from "@/lib/validations/order"

export async function getOrderedProducts(
  input: z.infer<typeof getOrderedProductsSchema>
) {
  try {
    const orderedProducts = await db
      .select({
        id: products.id,
        name: products.name,
        price: products.price,
        images: products.images,
        storeId: products.storeId,
      })
      .from(products)
      .where(
        inArray(
          products.id,
          input.checkoutItems.map((item) => item.productId)
        )
      )
      .orderBy(desc(products.createdAt))

    const productsWithQuantity = orderedProducts.map((product) => {
      const quantity = input.checkoutItems.find(
        (item) => item.productId === product.id
      )?.quantity

      return {
        ...product,
        quantity: quantity ?? 0,
      }
    })

    return productsWithQuantity
  } catch (err) {
    console.error(err)
    return []
  }
}

export async function getCheckoutSessionProducts(
  input: z.infer<typeof getCheckoutSessionProductsSchema>
) {
  try {
    if (!input.storeId) {
      throw new Error("Store ID is required.")
    }

    const cartId = Number(cookies().get("cartId")?.value)

    const cart = await db.query.carts.findFirst({
      columns: {
        checkoutSessionId: true,
      },
      where: eq(carts.id, cartId),
    })

    if (!cart || !cart.checkoutSessionId) {
      throw new Error("Cart not found.")
    }

    // Clear the cart
    await db.update(carts).set({ items: [] }).where(eq(carts.id, cartId))

    // Retrieve the checkout session
    const checkoutSession = await stripe.checkout.sessions.retrieve(
      cart.checkoutSessionId
    )

    // Get checkout items from the checkout session metadata
    const checkoutItems = JSON.parse(
      checkoutSession?.metadata?.items ?? ""
    ) as unknown as CheckoutItem[]

    // TODO: Create order on webhook instead
    // Create or update the order
    const order = await db.query.orders.findFirst({
      columns: {
        id: true,
      },
      where: eq(orders.storeId, input.storeId),
    })

    if (order) {
      await db
        .update(orders)
        .set({
          items: checkoutItems,
          stripePaymentIntentId: String(checkoutSession.payment_intent),
          stripePaymentIntentStatus: checkoutSession.payment_status,
        })
        .where(eq(orders.id, order.id))
    } else {
      await db.insert(orders).values({
        storeId: input.storeId,
        items: checkoutItems,
        stripePaymentIntentId: String(checkoutSession.payment_intent),
        stripePaymentIntentStatus: checkoutSession.payment_status,
      })
    }

    // Get products from the checkout items
    const orderedProducts = await db
      .select({
        id: products.id,
        name: products.name,
        price: products.price,
        images: products.images,
        storeId: products.storeId,
      })
      .from(products)
      .where(
        inArray(
          products.id,
          checkoutItems.map((item) => item.productId)
        )
      )
      .orderBy(desc(products.createdAt))

    const productsWithQuantity = orderedProducts.map((product) => {
      const quantity = checkoutItems.find(
        (item) => item.productId === product.id
      )?.quantity

      return {
        ...product,
        quantity: quantity ?? 0,
      }
    })

    return productsWithQuantity
  } catch (err) {
    console.error(err)
    return []
  }
}
