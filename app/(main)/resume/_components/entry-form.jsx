// app/resume/_components/entry-form.jsx
"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { format, parse } from "date-fns";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { experienceSchema, educationSchema, projectSchema } from "@/app/lib/schema";
import { Sparkles, PlusCircle, X, Pencil, Save, Loader2 } from "lucide-react";
import { improveWithAI } from "@/actions/resume";
import { toast } from "sonner";
import useFetch from "@/hooks/use-fetch";

const formatDisplayDate = (dateString) => {
  if (!dateString) return "";
  const date = parse(dateString, "yyyy-MM", new Date());
  return format(date, "MMM yyyy");
};

export function EntryForm({ type, entries, onChange }) {
  const [isAdding, setIsAdding] = useState(false);

  // Select schema based on type
  const getSchema = () => {
    if (type.toLowerCase() === "experience") return experienceSchema;
    if (type.toLowerCase() === "education") return educationSchema;
    if (type.toLowerCase() === "project") return projectSchema;
    return experienceSchema; // default
  };

  const isProject = type.toLowerCase() === "project";
  const isEducation = type.toLowerCase() === "education";
  const isExperience = type.toLowerCase() === "experience";

  const {
    register,
    handleSubmit: handleValidation,
    formState: { errors },
    reset,
    watch,
    setValue,
  } = useForm({
    resolver: zodResolver(getSchema()),
    defaultValues: {
      title: "",
      organization: isProject ? "" : "",
      startDate: "",
      endDate: "",
      description: "",
      projectLink: "",
      current: false,
    },
  });

  const current = watch("current");

  const handleAdd = handleValidation((data) => {
    const formattedEntry = {
      ...data,
      startDate: data.startDate ? formatDisplayDate(data.startDate) : "",
      endDate: isEducation 
        ? formatDisplayDate(data.endDate) 
        : (data.current ? "" : (data.endDate ? formatDisplayDate(data.endDate) : "")),
      // Remove projectLink if empty for non-projects
      ...(isProject ? { projectLink: data.projectLink || "" } : {}),
    };

    onChange([...entries, formattedEntry]);

    reset();
    setIsAdding(false);
  });

  const handleDelete = (index) => {
    const newEntries = entries.filter((_, i) => i !== index);
    onChange(newEntries);
  };

  const {
    loading: isImproving,
    fn: improveWithAIFn,
    data: improvedContent,
    error: improveError,
  } = useFetch(improveWithAI);

  // Add this effect to handle the improvement result
  useEffect(() => {
    if (improvedContent && !isImproving) {
      setValue("description", improvedContent);
      toast.success("Description improved successfully!");
    }
    if (improveError) {
      toast.error(improveError.message || "Failed to improve description");
    }
  }, [improvedContent, improveError, isImproving, setValue]);

  // Replace handleImproveDescription with this
  const handleImproveDescription = async () => {
    const description = watch("description");
    if (!description) {
      toast.error("Please enter a description first");
      return;
    }

    await improveWithAIFn({
      current: description,
      type: type.toLowerCase(), // 'experience', 'education', or 'project'
    });
  };

  return (
    <div className="space-y-4">
      <div className="space-y-4">
        {entries.map((item, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {item.title} {item.organization ? `@ ${item.organization}` : ""}
              </CardTitle>
              <Button
                variant="outline"
                size="icon"
                type="button"
                onClick={() => handleDelete(index)}
              >
                <X className="h-4 w-4" />
              </Button>
            </CardHeader>
            <CardContent>
              {(item.startDate || item.endDate) && (
                <p className="text-sm text-muted-foreground">
                  {item.current
                    ? `${item.startDate} - Present`
                    : item.startDate && item.endDate
                    ? `${item.startDate} - ${item.endDate}`
                    : item.startDate
                    ? item.startDate
                    : ""}
                </p>
              )}
              <p className="mt-2 text-sm whitespace-pre-wrap">
                {item.description}
              </p>
              {isProject && item.projectLink && (
                <a
                  href={item.projectLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-2 text-sm text-primary hover:underline inline-flex items-center gap-1"
                >
                  🔗 View Project
                </a>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {isAdding && (
        <Card>
          <CardHeader>
            <CardTitle>Add {type}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Input
                  placeholder={
                    isProject
                      ? "Project Name"
                      : isEducation
                      ? "Degree/Certification"
                      : "Title/Position"
                  }
                  {...register("title")}
                  error={errors.title}
                />
                {errors.title && (
                  <p className="text-sm text-red-500">{errors.title.message}</p>
                )}
              </div>
              {!isProject && (
                <div className="space-y-2">
                  <Input
                    placeholder={
                      isEducation ? "Institution Name" : "Organization/Company"
                    }
                    {...register("organization")}
                    error={errors.organization}
                  />
                  {errors.organization && (
                    <p className="text-sm text-red-500">
                      {errors.organization.message}
                    </p>
                  )}
                </div>
              )}
              {isProject && (
                <div className="space-y-2">
                  <Input
                    placeholder="Organization/Company (Optional)"
                    {...register("organization")}
                    error={errors.organization}
                  />
                  {errors.organization && (
                    <p className="text-sm text-red-500">
                      {errors.organization.message}
                    </p>
                  )}
                </div>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">
                  {isProject ? "Start Date (Optional)" : "Start Date"}
                </label>
                <Input
                  type="month"
                  {...register("startDate")}
                  error={errors.startDate}
                />
                {errors.startDate && (
                  <p className="text-sm text-red-500">
                    {errors.startDate.message}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">
                  {isProject ? "End Date (Optional)" : "End Date"}
                </label>
                <Input
                  type="month"
                  {...register("endDate")}
                  disabled={isExperience && current}
                  error={errors.endDate}
                />
                {errors.endDate && (
                  <p className="text-sm text-red-500">
                    {errors.endDate.message}
                  </p>
                )}
              </div>
            </div>

            {isExperience && (
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="current"
                  {...register("current")}
                  onChange={(e) => {
                    setValue("current", e.target.checked);
                    if (e.target.checked) {
                      setValue("endDate", "");
                    }
                  }}
                />
                <label htmlFor="current">Current Position</label>
              </div>
            )}

            {isProject && (
              <div className="space-y-2">
                <label className="text-sm font-medium">Project Link (Optional)</label>
                <Input
                  type="url"
                  placeholder="https://github.com/username/project or https://project-demo.com"
                  {...register("projectLink")}
                  error={errors.projectLink}
                />
                {errors.projectLink && (
                  <p className="text-sm text-red-500">
                    {errors.projectLink.message}
                  </p>
                )}
              </div>
            )}

            <div className="space-y-2">
              <label className="text-sm font-medium">
                {isProject
                  ? "Project Description"
                  : isEducation
                  ? "Description (e.g., GPA, achievements, coursework)"
                  : "Description"}
              </label>
              <Textarea
                placeholder={
                  isProject
                    ? "Describe your project, technologies used, and key features..."
                    : isEducation
                    ? "Describe your degree, achievements, relevant coursework..."
                    : "Describe your role, responsibilities, and achievements..."
                }
                className="h-32"
                {...register("description")}
                error={errors.description}
              />
              {errors.description && (
                <p className="text-sm text-red-500">
                  {errors.description.message}
                </p>
              )}
            </div>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={handleImproveDescription}
              disabled={isImproving || !watch("description")}
            >
              {isImproving ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Improving...
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4 mr-2" />
                  Improve with AI
                </>
              )}
            </Button>
          </CardContent>
          <CardFooter className="flex justify-end space-x-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                reset();
                setIsAdding(false);
              }}
            >
              Cancel
            </Button>
            <Button type="button" onClick={handleAdd}>
              <PlusCircle className="h-4 w-4 mr-2" />
              Add Entry
            </Button>
          </CardFooter>
        </Card>
      )}

      {!isAdding && (
        <Button
          className="w-full"
          variant="outline"
          onClick={() => setIsAdding(true)}
        >
          <PlusCircle className="h-4 w-4 mr-2" />
          Add {type}
        </Button>
      )}
    </div>
  );
}
