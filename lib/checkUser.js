import { verifyAuth } from "./auth";
import { db } from "./prisma";

export const checkUser = async () => {
  try {
    const session = await verifyAuth();
    if (!session) return null;

    const user = await db.user.findUnique({
      where: { id: session.userId },
    });

    return user;
  } catch (error) {
    console.error("checkUser error:", error);
    return null;
  }
};
