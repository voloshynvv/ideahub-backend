import { relations } from "drizzle-orm";
import { account, session, user } from "./auth.ts";
import { ideas } from "./ideas.ts";
import { likes } from "./likes.ts";

export const userRelations = relations(user, ({ many }) => ({
  sessions: many(session),
  accounts: many(account),
  ideas: many(ideas),
  likes: many(likes),
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

export const ideasRelations = relations(ideas, ({ one, many }) => ({
  user: one(user, {
    fields: [ideas.userId],
    references: [user.id],
  }),
  likes: many(likes),
}));

export const likesRelations = relations(likes, ({ one }) => ({
  idea: one(ideas, {
    fields: [likes.ideaId],
    references: [ideas.id],
  }),
  user: one(user, {
    fields: [likes.userId],
    references: [user.id],
  }),
}));
