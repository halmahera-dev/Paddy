import { auth } from "@tigris/auth";

const handler = (request: Request) => auth.handler(request);

export { handler as GET, handler as POST };
