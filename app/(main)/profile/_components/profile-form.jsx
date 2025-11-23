"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { updateUser } from "@/actions/user";
import { toast } from "sonner";
import useFetch from "@/hooks/use-fetch";
import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { industries } from "@/data/industries";

const profileSchema = z.object({
    name: z.string().min(1, "Name is required"),
    bio: z.string().optional(),
    industry: z.string().min(1, "Industry is required"),
    experience: z
        .number()
        .min(0, "Experience must be at least 0 years")
        .int("Must be an integer"),
    skills: z.string().transform((str) => str.split(",").map((s) => s.trim())),
});

export default function ProfileForm({ user }) {
    const {
        register,
        handleSubmit,
        setValue,
        watch,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(profileSchema),
        defaultValues: {
            name: user.name || "",
            email: user.email || "",
            bio: user.bio || "",
            industry: user.industry || "",
            experience: user.experience || 0,
            skills: user.skills ? user.skills.join(", ") : "",
        },
    });

    // State for industry selection
    const [selectedIndustry, setSelectedIndustry] = useState(null);
    const [selectedSubIndustry, setSelectedSubIndustry] = useState("");

    // Parse initial industry
    useEffect(() => {
        if (user.industry) {
            // Try to find the matching industry and subIndustry
            // This is a bit tricky because we store a combined string.
            // We'll iterate through all industries to find a match.
            for (const ind of industries) {
                const foundSub = ind.subIndustries.find(
                    (sub) =>
                        `${ind.id}-${sub.toLowerCase().replace(/ /g, "-")}` ===
                        user.industry
                );
                if (foundSub) {
                    setSelectedIndustry(ind);
                    setSelectedSubIndustry(foundSub);
                    break;
                }
            }
        }
    }, [user.industry]);

    const {
        loading: isSaving,
        fn: saveProfileFn,
        data: saveResult,
        error: saveError,
    } = useFetch(updateUser);

    const onSubmit = async (data) => {
        // If industry/subIndustry changed, we need to format it
        // But the form data 'industry' field should already be updated by the Selects?
        // Actually, we need to ensure the 'industry' field in data is the formatted string.
        // Let's handle it manually or ensure setValue updates it.

        // If the user selected a new industry/subIndustry via the UI state:
        if (selectedIndustry && selectedSubIndustry) {
            const formattedIndustry = `${selectedIndustry.id}-${selectedSubIndustry
                .toLowerCase()
                .replace(/ /g, "-")}`;
            data.industry = formattedIndustry;
        }

        await saveProfileFn(data);
    };

    useEffect(() => {
        if (saveResult && !isSaving) {
            toast.success("Profile updated successfully!");
        }
        if (saveError) {
            toast.error(saveError.message || "Failed to update profile");
        }
    }, [saveResult, saveError, isSaving]);

    return (
        <div className="max-w-3xl mx-auto space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>Personal Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Full Name</label>
                        <Input
                            {...register("name")}
                            placeholder="Your Name"
                            disabled={user.nameUpdated}
                        />
                        {user.nameUpdated ? (
                            <p className="text-xs text-red-500">
                                Name has already been changed once and cannot be changed again.
                            </p>
                        ) : (
                            <p className="text-xs text-muted-foreground">
                                You can change your name only once.
                            </p>
                        )}
                        {errors.name && (
                            <p className="text-sm text-red-500">{errors.name.message}</p>
                        )}
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Email</label>
                        <Input {...register("email")} placeholder="Your Email" disabled />
                        <p className="text-xs text-muted-foreground">
                            Email cannot be changed
                        </p>
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Bio / Headline</label>
                        <Textarea
                            {...register("bio")}
                            placeholder="Tell us about yourself..."
                            className="h-32"
                        />
                        {errors.bio && (
                            <p className="text-sm text-red-500">{errors.bio.message}</p>
                        )}
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Professional Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Industry</label>
                        <Select
                            value={selectedIndustry?.id || ""}
                            onValueChange={(value) => {
                                const ind = industries.find((i) => i.id === value);
                                setSelectedIndustry(ind);
                                setSelectedSubIndustry(""); // Reset sub-industry
                                setValue("industry", ""); // Clear form value until sub-industry selected
                            }}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Select Industry" />
                            </SelectTrigger>
                            <SelectContent>
                                {industries.map((ind) => (
                                    <SelectItem key={ind.id} value={ind.id}>
                                        {ind.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    {selectedIndustry && (
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Specialization</label>
                            <Select
                                value={selectedSubIndustry || ""}
                                onValueChange={(value) => {
                                    setSelectedSubIndustry(value);
                                    const formattedIndustry = `${selectedIndustry.id}-${value
                                        .toLowerCase()
                                        .replace(/ /g, "-")}`;
                                    setValue("industry", formattedIndustry);
                                }}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select Specialization" />
                                </SelectTrigger>
                                <SelectContent>
                                    {selectedIndustry.subIndustries.map((sub) => (
                                        <SelectItem key={sub} value={sub}>
                                            {sub}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {errors.industry && (
                                <p className="text-sm text-red-500">{errors.industry.message}</p>
                            )}
                        </div>
                    )}

                    <div className="space-y-2">
                        <label className="text-sm font-medium">Years of Experience</label>
                        <Input
                            type="number"
                            {...register("experience", { valueAsNumber: true })}
                            placeholder="0"
                        />
                        {errors.experience && (
                            <p className="text-sm text-red-500">{errors.experience.message}</p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium">Skills</label>
                        <Input
                            {...register("skills")}
                            placeholder="React, Node.js, Python (comma separated)"
                        />
                        <p className="text-xs text-muted-foreground">
                            Separate skills with commas
                        </p>
                        {errors.skills && (
                            <p className="text-sm text-red-500">{errors.skills.message}</p>
                        )}
                    </div>
                </CardContent>
            </Card>

            <div className="flex justify-end">
                <Button onClick={handleSubmit(onSubmit)} disabled={isSaving} size="lg">
                    {isSaving ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Saving...
                        </>
                    ) : (
                        "Save Changes"
                    )}
                </Button>
            </div>
        </div>
    );
}
