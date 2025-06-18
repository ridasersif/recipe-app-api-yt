CREATE TABLE "favoritesTble" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"recipe_id" integer NOT NULL,
	"title" text NOT NULL,
	"image" text NOT NULL,
	"cook_time" integer NOT NULL,
	"servings" integer NOT NULL,
	"created_at" timestamp with time zone DEFAULT now()
);
