import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { insertInquirySchema, type InsertInquiry } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { CheckCircle2, ArrowLeft } from "lucide-react";
import { Link } from "wouter";
import logoUrl from "@assets/logo_1761740236721.png";
import { useToast } from "@/hooks/use-toast";

const courses = [
  "C/C++",
  "J2SE (CORE JAVA)",
  "J2EE (Advance JAVA)",
  "Python",
  "Django",
  "Data Science",
  "Machine Learning",
  "DBMS",
  "JAVA Full Stack",
  "Python Full Stack",
  "React",
  "PHP Web Development",
  "Date Structure",
  "IOT",
  "Spring",
  "Hibernate",
  "Android",
  "MEAN / MERN",
  "Others"
];

export default function InquiryForm() {
  const [isSuccess, setIsSuccess] = useState(false);
  const { toast } = useToast();

  const form = useForm<InsertInquiry>({
    resolver: zodResolver(insertInquirySchema),
    defaultValues: {
      name: "",
      fatherName: "",
      phone: "+91",
      email: "",
      dob: "",
      courseInterest: "",
      college: "",
      branch: "",
    },
  });

  const mutation = useMutation({
    mutationFn: async (data: InsertInquiry) => {
      // Write to Google Sheets instead of local database
      return await apiRequest("POST", "/api/sheets/inquiries", data);
    },
    onSuccess: () => {
      setIsSuccess(true);
      form.reset({
        name: "",
        fatherName: "",
        phone: "+91",
        email: "",
        dob: "",
        courseInterest: "",
        college: "",
        branch: "",
      });
      toast({
        title: "Success!",
        description: "Thank you! We'll contact you soon.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to submit form. Please try again.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: InsertInquiry) => {
    mutation.mutate(data);
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="max-w-md w-full p-8 text-center space-y-6">
          <div className="flex justify-center">
            <div className="bg-green-100 dark:bg-green-900 p-4 rounded-full">
              <CheckCircle2 className="h-16 w-16 text-green-600 dark:text-green-400" />
            </div>
          </div>
          <div>
            <h2 className="text-2xl font-bold font-heading mb-2" data-testid="text-success-title">Thank You!</h2>
            <p className="text-muted-foreground">
              We've received your inquiry. Our team will contact you soon.
            </p>
          </div>
          <div className="flex flex-col gap-3">
            <Button
              onClick={() => setIsSuccess(false)}
              size="lg"
              className="w-full min-h-14"
              data-testid="button-submit-another"
            >
              SUBMIT ANOTHER INQUIRY
            </Button>
            <Link href="/">
              <Button variant="outline" size="lg" className="w-full min-h-14" data-testid="button-back-home">
                <ArrowLeft className="mr-2 h-5 w-5" />
                BACK TO HOME
              </Button>
            </Link>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-card border-b">
        <div className="container max-w-7xl mx-auto px-4 md:px-8 py-6">
          <Link href="/">
            <img src={logoUrl} alt="Programmers Point" className="h-12" data-testid="img-logo" />
          </Link>
        </div>
      </div>

      <div className="container max-w-2xl mx-auto px-4 py-12">
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold font-heading mb-3" data-testid="text-form-title">
            Start Your IT Journey
          </h1>
          <p className="text-muted-foreground">
            Fill out the form below and our team will get in touch with you
          </p>
        </div>

        <Card className="p-6 md:p-8">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* Personal Details */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold font-heading">Personal Details</h3>
                
                <div className="grid md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Name *</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="Enter your name"
                            className="h-14"
                            data-testid="input-name"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="fatherName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Father's Name *</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="Enter father's name"
                            className="h-14"
                            data-testid="input-father-name"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Contact Number *</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="+91XXXXXXXXXX"
                            className="h-14"
                            data-testid="input-phone"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email *</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            type="email"
                            placeholder="your.email@example.com"
                            className="h-14"
                            data-testid="input-email"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="dob"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Date of Birth (DD/MM/YYYY) *</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="DD/MM/YYYY"
                          className="h-14"
                          data-testid="input-dob"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Course Details */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold font-heading">Course Details</h3>
                
                <FormField
                  control={form.control}
                  name="courseInterest"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Interested In *</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger className="h-14" data-testid="select-course">
                            <SelectValue placeholder="Select a course" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {courses.map((course) => (
                            <SelectItem key={course} value={course}>
                              {course}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Academic Details */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold font-heading">Academic Details</h3>
                
                <FormField
                  control={form.control}
                  name="college"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>College *</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="Enter your college name"
                          className="h-14"
                          data-testid="input-college"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="branch"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Branch *</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="e.g., Computer Science, Mechanical, etc."
                          className="h-14"
                          data-testid="input-branch"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <Button
                type="submit"
                size="lg"
                className="w-full min-h-14 text-base font-semibold tracking-wide"
                disabled={mutation.isPending}
                data-testid="button-submit-form"
              >
                {mutation.isPending ? "SUBMITTING..." : "SUBMIT INQUIRY"}
              </Button>
            </form>
          </Form>
        </Card>
      </div>
    </div>
  );
}
