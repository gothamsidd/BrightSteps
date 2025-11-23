"use server";

import { db } from "@/lib/prisma";
import { checkUser } from "@/lib/checkUser";
import { revalidatePath } from "next/cache";
import { generateAIInsights } from "./dashboard";

export async function updateUser(data) {
  const user = await checkUser();
  if (!user) throw new Error("Unauthorized");

  try {
    console.log("updateUser called with data: " + JSON.stringify(data));

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

          if (!insights || typeof insights !== "object" || Array.isArray(insights)) {
            throw new Error("Invalid AI Insights generated");
          }

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

        // Check if user is trying to update name
        const userToUpdate = await tx.user.findUnique({
          where: { id: user.id },
          select: { nameUpdated: true }
        });

        if (data.name && data.name !== user.name) {
          if (userToUpdate.nameUpdated) {
            throw new Error("Name can only be changed once.");
          }
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
            name: data.name,
            nameUpdated: data.name && data.name !== user.name ? true : undefined,
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
