import { relations } from "drizzle-orm"
import { decimal, index, integer, pgTable, text, varchar } from "drizzle-orm/pg-core"

import { generateId } from "@/lib/id"

import { lifecycleDates } from "./utils"
import { productVariants, productVariantValues } from "./variants"
import { products } from "./products"

export const stocks = pgTable(
  "stocks",
  {
    id: varchar("id", { length: 30 })
      .$defaultFn(() => generateId())
      .primaryKey(),
    // productVariantId: varchar("product_variant_id", { length: 30 })
    //   .references(() => productVariants.id, { onDelete: "cascade" })
    //   .notNull(),
    productId: varchar("product_id", { length: 30 })
      .references(() => products.id, { onDelete: "cascade" })
      .notNull(),
    variantCode: text("variant_code").notNull(),
    skuCode: varchar("sku_code", { length: 30 }).notNull(),
    quantity: integer("quantity").notNull().default(0),
    price: decimal("price", { precision: 10, scale: 2 }).notNull().default("0"),
    originalPrice: decimal("original_price", {
      precision: 10,
      scale: 2,
    }).default("0"),
    ...lifecycleDates,
  },
  (table) => ({
    // productVariantId: index("stocks_product_variant_id_idx").on(
    //   table.productVariantId
    // ),
    productId: index("stocks_product_id_idx").on(table.productId),  
  })
)

export const stocksRelations = relations(stocks, ({ one }) => ({
    skus: one(products, {
    fields: [stocks.productId],
    references: [products.id],
  }),
  // productVariant: one(productVariants, {
  //   fields: [stocks.productVariantId],
  //   references: [productVariants.id],
  // }),
  // productVariantValues: one(productVariantValues, {
  //   fields: [stocks.productVariantId],
  //   references: [productVariantValues.productVariantId],
  // }),
}))

export type Stock = typeof stocks.$inferSelect
export type NewStock = typeof stocks.$inferInsert
