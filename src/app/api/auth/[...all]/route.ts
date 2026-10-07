import { createAuth } from "@/lib/auth-config";
import { db } from "@/lib/db";
import { toNextJsHandler } from "better-auth/next-js";

const { GET, POST } = toNextJsHandler(createAuth(db).handler);

export { GET, POST };
