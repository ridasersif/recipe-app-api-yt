import {pgTable, serial, text, timestamp, integer} from 'drizzle-orm/pg-core';
export const favoritesTble = pgTable('favoritesTble', {
  id: serial('id').primaryKey(),
  userId: text('user_id').notNull(),
  recipeId: integer('recipe_id').notNull(),
  title: text('title').notNull(),
  image: text('image').notNull(),
  cookTime: integer('cook_time').notNull(),
  servings: integer('servings').notNull(),
  createdAt: timestamp('created_at', {withTimezone: true}).defaultNow(),
});