import { relations } from "drizzle-orm";
import { account, session, user } from "./auth.ts";
import { ideas } from "./ideas.ts";

export const userRelations = relations(user, ({ many }) => ({
  sessions: many(session),
  accounts: many(account),
  ideas: many(ideas),
}));

export const sessionRelations = relations(session, ({ one }) => ({
  user: one(user, {
    fields: [session.userId],
    references: [user.id],
  }),
}));

export const accountRelations = relations(account, ({ one }) => ({
  user: one(user, {
    fields: [account.userId],
    references: [user.id],
  }),
}));

export const ideasRelations = relations(ideas, ({ one }) => ({
  user: one(user, {
    fields: [ideas.userId],
    references: [user.id],
  }),
}));
