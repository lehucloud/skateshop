import * as z from "zod"

export const getOrderLineItemsSchema = z.object({
  storeId: z.string(),
  items: z.string().optional(),
})

export const verifyOrderSchema = z.object({
  deliveryPostalCode: z.string().min(1, {
    message: "Please enter a valid postal code",
  }),
})

export const createOrderSchema = z.object({
    storeId: z.string(),
    items: z.array(z.object({
        productId: z.string(),
        options: z.array(z.string()).optional(),
        price: z.number(),
        quantity: z.number(),
    })).optional(),
    quantity: z.number(),
    amount: z.string(),
    payClient: z.string(),
    storeOrderNo: z.string(),
    status: z.string(),
    userId: z.string()
}) 

export type CreateOrderSchema = z.infer<typeof createOrderSchema>