import { varchar, pgTable as table } from "drizzle-orm/pg-core";
import { nanoid } from "nanoid";

export const redirectsTable = table("redirects", {
  id: varchar("id")
    .primaryKey()
    .$defaultFn(() => nanoid()),
  slug: varchar("slug").unique().notNull(),
  url: varchar("url").notNull(),
});
