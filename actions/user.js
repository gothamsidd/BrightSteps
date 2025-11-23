"use server";

import { db } from "@/lib/prisma";
import { checkUser } from "@/lib/checkUser";
import { revalidatePath } from "next/cache";
import { generateAIInsights } from "./dashboard";

export async function updateUser(data) {
  const user = await checkUser();
  if (!user) throw new Error("Unauthorized");

  try {
    console.log("updateUser called with data:", data);

    // Start a transaction to handle both operations
    const result = await db.$transaction(
      async (tx) => {
        console.log("Transaction started");

        // First check if industry exists
        let industryInsight = await tx.industryInsight.findUnique({
          where: {
            industry: data.industry,
          },
        });
        console.log("Industry check done:", industryInsight ? "Found" : "Not Found");

        // If industry doesn't exist, create it with default values
        if (!industryInsight) {
          console.log("Generating AI insights for:", data.industry);
          const insights = await generateAIInsights(data.industry);
          console.log("AI Insights generated");

          industryInsight = await db.industryInsight.create({
            data: {
              industry: data.industry,
              ...insights,
              nextUpdate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
            },
          });
          console.log("Industry insight created");
        }

        // Now update the user
        console.log("Updating user:", user.id);
        const updatedUser = await tx.user.update({
          where: {
            id: user.id,
          },
          data: {
            industry: data.industry,
            experience: data.experience,
            bio: data.bio,
            skills: data.skills,
          },
        });
        console.log("User updated");

        return { updatedUser, industryInsight };
      },
      {
        timeout: 10000, // default: 5000
      }
    );

    revalidatePath("/");
    return result.updatedUser;
  } catch (error) {
    console.log("CAUGHT ERROR TYPE:", typeof error);
    console.log("CAUGHT ERROR STRING:", String(error));
    console.log("CAUGHT ERROR OBJECT:", JSON.stringify(error, Object.getOwnPropertyNames(error)));
    console.error("Error updating user and industry:", error);
    throw new Error("Failed to update profile: " + (error.message || String(error)));
  }
}

export async function getUserOnboardingStatus() {
  const user = await checkUser();
  if (!user) throw new Error("Unauthorized");

  try {
    const userWithIndustry = await db.user.findUnique({
      where: {
        id: user.id,
      },
      select: {
        industry: true,
      },
    });

    return {
      isOnboarded: !!userWithIndustry?.industry,
    };
  } catch (error) {
    console.error("Error checking onboarding status:", error);
    throw new Error("Failed to check onboarding status");
  }
}
