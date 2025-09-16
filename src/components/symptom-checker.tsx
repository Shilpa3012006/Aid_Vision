"use client";

import { useState, useRef } from 'react';
import Image from 'next/image';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Loader2, Upload, X, AlertTriangle, HeartPulse, ListOrdered } from "lucide-react";

import { generateFirstAidGuide, type GenerateFirstAidGuideOutput } from "@/ai/flows/generate-first-aid-guide";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { cn } from '@/lib/utils';

const formSchema = z.object({
  description: z.string().min(10, {
    message: "Please describe the symptom or injury in at least 10 characters.",
  }),
});

export function SymptomChecker() {
  const [isLoading, setIsLoading] = useState(false);
  const [aiResponse, setAiResponse] = useState<GenerateFirstAidGuideOutput | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageData, setImageData] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      description: "",
    },
  });

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setImagePreview(result);
        setImageData(result);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setImagePreview(null);
    setImageData(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setAiResponse(null);
    try {
      const response = await generateFirstAidGuide({
        description: values.description,
        photoDataUri: imageData ?? undefined,
      });
      setAiResponse(response);
    } catch (error) {
      console.error("AI Error:", error);
      toast({
        variant: "destructive",
        title: "An error occurred",
        description: "Failed to get first-aid guide. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  }
  
  const getSeverityBadge = (severity: string) => {
    const commonClasses = "capitalize text-sm px-3 py-1";
    switch (severity.toLowerCase()) {
      case 'critical':
        return <Badge variant="destructive" className={commonClasses}>{severity}</Badge>;
      case 'urgent':
        return <Badge className={cn("bg-warning text-warning-foreground border-transparent hover:bg-warning/80", commonClasses)}>{severity}</Badge>;
      case 'minor':
        return <Badge className={cn("bg-accent text-accent-foreground border-transparent hover:bg-accent/80", commonClasses)}>{severity}</Badge>;
      default:
        return <Badge variant="outline" className={commonClasses}>{severity}</Badge>;
    }
  };

  return (
    <div className="space-y-8">
      <Card className="w-full shadow-lg">
        <CardHeader>
          <CardTitle>Symptom Details</CardTitle>
          <CardDescription>
            Provide as much detail as possible for a more accurate guide.
          </CardDescription>
        </CardHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardContent className="space-y-6">
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Symptom or Injury Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="e.g., 'Deep cut on my index finger from a kitchen knife, bleeding moderately.'"
                        className="resize-none min-h-[120px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="space-y-2">
                <FormLabel>Upload Image (Optional)</FormLabel>
                {imagePreview ? (
                  <div className="relative w-full max-w-sm mx-auto">
                    <Image
                      src={imagePreview}
                      alt="Symptom preview"
                      width={400}
                      height={300}
                      className="rounded-lg object-cover w-full h-auto border"
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      className="absolute top-2 right-2 h-8 w-8 rounded-full"
                      onClick={removeImage}
                    >
                      <X className="h-4 w-4" />
                      <span className="sr-only">Remove image</span>
                    </Button>
                  </div>
                ) : (
                  <Button type="button" variant="outline" className="w-full" onClick={() => fileInputRef.current?.click()}>
                    <Upload className="mr-2 h-4 w-4" />
                    Upload Image
                  </Button>
                )}
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleImageChange}
                  className="hidden"
                  accept="image/*"
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button type="submit" disabled={isLoading} className="w-full bg-accent text-accent-foreground hover:bg-accent/90 text-base font-semibold py-6">
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  "Get First-Aid Guide"
                )}
              </Button>
            </CardFooter>
          </form>
        </Form>
      </Card>

      {isLoading && (
        <div className="flex flex-col items-center justify-center gap-4 py-8">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
          <p className="text-muted-foreground">Our AI is analyzing your symptoms...</p>
        </div>
      )}

      {aiResponse && (
        <Card className="w-full text-left animate-in fade-in-50 duration-500 shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl flex items-center gap-2">
              <HeartPulse className="h-6 w-6 text-primary" />
              Your AI-Generated First-Aid Guide
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {aiResponse.professional_help_needed && (
              <Alert variant="destructive">
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>Seek Professional Help Immediately</AlertTitle>
                <AlertDescription>
                  Based on the provided information, we strongly recommend seeking professional medical attention. This guide is for immediate first-aid only.
                </AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
                <h3 className="text-lg font-semibold">Severity Assessment</h3>
                {getSeverityBadge(aiResponse.severity)}
            </div>
            
            <div className="space-y-2">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                    <ListOrdered className="h-5 w-5" />
                    First-Aid Steps
                </h3>
                <ol className="list-decimal list-inside space-y-2 pl-2 text-base marker:font-semibold marker:text-primary">
                    {aiResponse.steps.map((step, index) => (
                        <li key={index} className="pl-2">{step}</li>
                    ))}
                </ol>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
