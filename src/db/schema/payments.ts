import { relations } from "drizzle-orm"
import {
  boolean,
  index,
  pgTable,
  timestamp,
  varchar,
  json,
  pgEnum,
} from "drizzle-orm/pg-core"

import { generateId } from "@/lib/id"

import { stores } from "./stores"
import { lifecycleDates } from "./utils"

export const payChannelEnum = pgEnum("pay_channel", ["wxpay", "alipay"])

export type PayConfSchema = {
    key: string,
    value: string,
}

// @see: https://github.com/jackblatch/OneStopShop/blob/main/db/schema.ts
export const payments = pgTable(
  "payments",
  {
    id: varchar("id", { length: 30 })
      .$defaultFn(() => generateId())
      .primaryKey(), // prefix_ + nanoid (12)
    storeId: varchar("store_id", { length: 30 })
      .references(() => stores.id, { onDelete: "cascade" })
      .notNull(),
    channel: payChannelEnum("pay_channel").notNull(),
    icon: varchar("icon").notNull(),
    config: json("config").$type<PayConfSchema | null>().default(null),
    enabled: boolean("enabled").notNull().default(true),
    stripeAccountId: varchar("stripe_account_id", { length: 256 }).notNull(),
    stripeAccountCreatedAt: timestamp("stripe_account_created_at"),
    stripeAccountExpiresAt: timestamp("stripe_account_expires_at"),
    detailsSubmitted: boolean("details_submitted").notNull().default(false),
    ...lifecycleDates,
  },
  (table) => ({
    storeIdIdx: index("payments_store_id_idx").on(table.storeId),
  })
)

export const paymentsRelations = relations(payments, ({ one }) => ({
  store: one(stores, { fields: [payments.storeId], references: [stores.id] }),
}))

export type Payment = typeof payments.$inferSelect
export type NewPayment = typeof payments.$inferInsert
