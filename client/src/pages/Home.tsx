import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { ArrowRight, Users, Building2, Award, TrendingUp, BookOpen, Briefcase, GraduationCap } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />

      {/* Hero Section */}
      <section className="relative min-h-[85vh] flex items-center bg-gradient-to-br from-primary/10 via-background to-secondary/10">
        <div className="container max-w-7xl mx-auto px-4 md:px-8 py-16 md:py-24">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight" data-testid="text-hero-title">
                Transform Your Career with <span className="text-primary">Programmers Point</span>
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground leading-relaxed" data-testid="text-hero-subtitle">
                India's leading programming institute with 95% placement success rate. 
                Expert training in React, Java, Python, Node.js, and cutting-edge technologies.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 mt-12">
                <Link href="/inquiry">
                  <Button size="lg" className="min-h-[48px] text-base font-semibold tracking-wide w-full sm:w-auto" data-testid="button-start-journey">
                    Start Your Journey <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <Link href="/courses">
                  <Button size="lg" variant="outline" className="min-h-[48px] text-base font-semibold tracking-wide w-full sm:w-auto" data-testid="button-explore-courses">
                    Explore Courses
                  </Button>
                </Link>
              </div>
            </div>
            <div className="hidden md:block">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-2xl transform rotate-3"></div>
                <div className="relative bg-card rounded-2xl shadow-2xl p-8 space-y-6">
                  <div className="flex items-center gap-4">
                    <div className="bg-primary/10 p-4 rounded-lg">
                      <GraduationCap className="h-8 w-8 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Expert Instructors</p>
                      <p className="text-2xl font-bold">15+ Years</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="bg-secondary/10 p-4 rounded-lg">
                      <Briefcase className="h-8 w-8 text-secondary" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Success Stories</p>
                      <p className="text-2xl font-bold">500+ Placements</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="bg-primary/10 p-4 rounded-lg">
                      <Building2 className="h-8 w-8 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Hiring Partners</p>
                      <p className="text-2xl font-bold">50+ Companies</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="py-12 md:py-16 bg-card/50">
        <div className="container max-w-7xl mx-auto px-4 md:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
            <Card className="p-6 text-center hover:shadow-lg transition-all duration-300">
              <Users className="h-12 w-12 mx-auto mb-4 text-primary" />
              <p className="text-3xl md:text-4xl font-bold mb-2" data-testid="stat-placements">500+</p>
              <p className="text-sm text-muted-foreground">Placements</p>
            </Card>
            <Card className="p-6 text-center hover:shadow-lg transition-all duration-300">
              <Award className="h-12 w-12 mx-auto mb-4 text-secondary" />
              <p className="text-3xl md:text-4xl font-bold mb-2" data-testid="stat-experience">15+</p>
              <p className="text-sm text-muted-foreground">Years Experience</p>
            </Card>
            <Card className="p-6 text-center hover:shadow-lg transition-all duration-300">
              <Building2 className="h-12 w-12 mx-auto mb-4 text-primary" />
              <p className="text-3xl md:text-4xl font-bold mb-2" data-testid="stat-companies">50+</p>
              <p className="text-sm text-muted-foreground">Partner Companies</p>
            </Card>
            <Card className="p-6 text-center hover:shadow-lg transition-all duration-300">
              <TrendingUp className="h-12 w-12 mx-auto mb-4 text-secondary" />
              <p className="text-3xl md:text-4xl font-bold mb-2" data-testid="stat-success">95%</p>
              <p className="text-sm text-muted-foreground">Success Rate</p>
            </Card>
          </div>
        </div>
      </section>

      {/* Quick Links Section */}
      <section className="py-16 md:py-24">
        <div className="container max-w-7xl mx-auto px-4 md:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4" data-testid="text-section-title">
              Your Path to IT Success
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Explore our comprehensive programs designed to transform your career
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <Link href="/courses">
              <Card className="p-8 hover:shadow-lg transition-all duration-300 cursor-pointer h-full" data-testid="card-courses">
                <BookOpen className="h-16 w-16 mb-6 text-primary" />
                <h3 className="text-2xl font-semibold mb-3">Course Explorer</h3>
                <p className="text-muted-foreground mb-4">
                  Interactive course explorer with real-time job market data. Discover your perfect tech stack.
                </p>
                <Button variant="ghost" className="p-0 h-auto">
                  Explore Now <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Card>
            </Link>
            <Link href="/placements">
              <Card className="p-8 hover:shadow-lg transition-all duration-300 cursor-pointer h-full" data-testid="card-placements">
                <Briefcase className="h-16 w-16 mb-6 text-secondary" />
                <h3 className="text-2xl font-semibold mb-3">Placements</h3>
                <p className="text-muted-foreground mb-4">
                  Discover success stories of our students placed in top companies like TCS, Infosys, Wipro, and more.
                </p>
                <Button variant="ghost" className="p-0 h-auto">
                  View Placements <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Card>
            </Link>
            <Link href="/inquiry">
              <Card className="p-8 hover:shadow-lg transition-all duration-300 cursor-pointer h-full" data-testid="card-inquiry">
                <GraduationCap className="h-16 w-16 mb-6 text-primary" />
                <h3 className="text-2xl font-semibold mb-3">Apply Now</h3>
                <p className="text-muted-foreground mb-4">
                  Start your journey today. Fill out our inquiry form and our team will get in touch with you.
                </p>
                <Button variant="ghost" className="p-0 h-auto">
                  Get Started <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Card>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
