import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { CheckCircle2 } from "lucide-react";
import { Link } from "wouter";
import { appendToInquiries, fetchAllData } from "@/utils/googleSheets";
import { useToast } from "@/hooks/use-toast";
import type { InquiryFormData } from "@/types";

const inquirySchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  fatherName: z.string().min(2, "Father's name must be at least 2 characters"),
  phone: z.string().regex(/^\+91\d{10}$/, "Phone must be in +91XXXXXXXXXX format"),
  email: z.string().email("Invalid email address"),
  dob: z.string().min(1, "Date of birth is required"),
  courseInterest: z.string().min(1, "Please select a course"),
  college: z.string().min(2, "College name is required"),
  branch: z.string().min(2, "Branch is required"),
});

const branches = [
  "Computer Science Engineering",
  "Information Technology",
  "Electronics and Communication",
  "Mechanical Engineering",
  "Civil Engineering",
  "Electrical Engineering",
  "Other",
];

export default function InquiryForm() {
  const [isSuccess, setIsSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [courses, setCourses] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    loadCourses();
  }, []);

  const loadCourses = async () => {
    try {
      setLoading(true);
      const data = await fetchAllData();
      const courseList = data.combinations.map(c => c.jobRole);
      setCourses(courseList);
    } catch (error) {
      console.error('Failed to load courses:', error);
      setCourses([]);
    } finally {
      setLoading(false);
    }
  };

  const form = useForm<InquiryFormData>({
    resolver: zodResolver(inquirySchema),
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

  const onSubmit = async (data: InquiryFormData) => {
    try {
      setIsSubmitting(true);
      await appendToInquiries(data);
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
    } catch (error: any) {
      console.error('Submission error:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to submit form. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Navbar />
        <LoadingSpinner text="Loading form..." />
        <Footer />
      </div>
    );
  }

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center p-4">
          <Card className="max-w-md w-full p-8 text-center space-y-6">
            <div className="flex justify-center">
              <div className="bg-green-100 dark:bg-green-900 p-4 rounded-full">
                <CheckCircle2 className="h-16 w-16 text-green-600 dark:text-green-400" />
              </div>
            </div>
            <div>
              <h2 className="text-2xl font-bold mb-2" data-testid="text-success-title">Thank You!</h2>
              <p className="text-muted-foreground">
                We've received your inquiry. Our team will contact you soon.
              </p>
            </div>
            <div className="flex flex-col gap-3">
              <Button
                onClick={() => setIsSuccess(false)}
                size="lg"
                className="w-full min-h-[48px]"
                data-testid="button-submit-another"
              >
                Submit Another Inquiry
              </Button>
              <Link href="/">
                <Button variant="outline" size="lg" className="w-full min-h-[48px]" data-testid="button-back-home">
                  Back to Home
                </Button>
              </Link>
            </div>
          </Card>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />

      <div className="container max-w-2xl mx-auto px-4 py-12 flex-1">
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-3" data-testid="text-form-title">
            Start Your IT Journey
          </h1>
          <p className="text-muted-foreground">
            Fill out the form below and our team will get in touch with you
          </p>
        </div>

        <Card className="p-6 md:p-8">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Personal Details</h3>
                
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
                            className="h-[48px]"
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
                            className="h-[48px]"
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
                            className="h-[48px]"
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
                            className="h-[48px]"
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
                      <FormLabel>Date of Birth *</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="date"
                          className="h-[48px]"
                          data-testid="input-dob"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Course Details</h3>
                
                <FormField
                  control={form.control}
                  name="courseInterest"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Course Interest *</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger className="h-[48px]" data-testid="select-course">
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

              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Academic Details</h3>
                
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
                          className="h-[48px]"
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
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger className="h-[48px]" data-testid="select-branch">
                            <SelectValue placeholder="Select your branch" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {branches.map((branch) => (
                            <SelectItem key={branch} value={branch}>
                              {branch}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <Button
                type="submit"
                size="lg"
                className="w-full min-h-[48px] text-base font-semibold tracking-wide"
                disabled={isSubmitting}
                data-testid="button-submit-form"
              >
                {isSubmitting ? <LoadingSpinner size="sm" /> : "SUBMIT INQUIRY"}
              </Button>
            </form>
          </Form>
        </Card>
      </div>

      <Footer />
    </div>
  );
}
