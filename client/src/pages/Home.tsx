import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowRight, Users, Building2, Award, TrendingUp, BookOpen, Briefcase, GraduationCap } from "lucide-react";
import logoUrl from "@assets/logo_1761740236721.png";

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
        <div className="container max-w-7xl mx-auto px-4 md:px-8">
          <div className="flex items-center justify-between h-18">
            <div className="flex items-center">
              <img src={logoUrl} alt="Programmers Point" className="h-12" data-testid="img-logo" />
            </div>
            <div className="hidden md:flex items-center gap-8">
              <Link href="/" className="text-foreground hover:text-primary transition-colors" data-testid="link-home">
                <span className="font-medium">Home</span>
              </Link>
              <Link href="/placements" className="text-foreground hover:text-primary transition-colors" data-testid="link-placements">
                <span className="font-medium">Placements</span>
              </Link>
              <Link href="/courses" className="text-foreground hover:text-primary transition-colors" data-testid="link-courses">
                <span className="font-medium">Courses</span>
              </Link>
              <Link href="/inquiry" data-testid="link-inquiry">
                <Button size="lg" className="min-h-12">
                  APPLY NOW
                </Button>
              </Link>
            </div>
            <div className="md:hidden">
              <Link href="/inquiry" data-testid="link-inquiry-mobile">
                <Button size="lg">
                  APPLY NOW
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-[85vh] flex items-center bg-gradient-to-br from-primary/10 via-background to-secondary/10">
        <div className="container max-w-7xl mx-auto px-4 md:px-8 py-16 md:py-24">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold font-heading tracking-tight" data-testid="text-hero-title">
                Switch Your Career From <span className="text-primary">Non-IT</span> to <span className="text-secondary">IT Sector</span>
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground leading-relaxed" data-testid="text-hero-subtitle">
                Join India's leading programming institute with 95% placement success rate. 
                Expert training in React, Java, Python, Node.js, and cutting-edge technologies.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/inquiry" data-testid="button-get-started">
                  <Button size="lg" className="min-h-14 text-base font-semibold tracking-wide">
                    GET STARTED <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <Link href="/courses" data-testid="button-explore-courses">
                  <Button size="lg" variant="outline" className="min-h-14 text-base font-semibold tracking-wide">
                    EXPLORE COURSES
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
            <Card className="p-6 text-center hover-elevate transition-all duration-300">
              <Users className="h-12 w-12 mx-auto mb-4 text-primary" />
              <p className="text-3xl md:text-4xl font-bold mb-2" data-testid="stat-placements">500+</p>
              <p className="text-sm text-muted-foreground">Placements</p>
            </Card>
            <Card className="p-6 text-center hover-elevate transition-all duration-300">
              <Award className="h-12 w-12 mx-auto mb-4 text-secondary" />
              <p className="text-3xl md:text-4xl font-bold mb-2" data-testid="stat-experience">15+</p>
              <p className="text-sm text-muted-foreground">Years Experience</p>
            </Card>
            <Card className="p-6 text-center hover-elevate transition-all duration-300">
              <Building2 className="h-12 w-12 mx-auto mb-4 text-primary" />
              <p className="text-3xl md:text-4xl font-bold mb-2" data-testid="stat-companies">50+</p>
              <p className="text-sm text-muted-foreground">Partner Companies</p>
            </Card>
            <Card className="p-6 text-center hover-elevate transition-all duration-300">
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
            <h2 className="text-3xl md:text-4xl font-bold font-heading mb-4" data-testid="text-section-title">
              Your Path to IT Success
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Explore our comprehensive programs designed to transform your career
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <Link href="/placements" data-testid="card-placements">
              <Card className="p-8 hover-elevate transition-all duration-300 cursor-pointer h-full">
                <Briefcase className="h-16 w-16 mb-6 text-primary" />
                <h3 className="text-2xl font-semibold font-heading mb-3">Our Placements</h3>
                <p className="text-muted-foreground mb-4">
                  Discover success stories of our students placed in top companies like TCS, Infosys, Wipro, and more.
                </p>
                <Button variant="ghost" className="p-0 h-auto">
                  View Placements <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Card>
            </Link>
            <Link href="/courses" data-testid="card-courses">
              <Card className="p-8 hover-elevate transition-all duration-300 cursor-pointer h-full">
                <BookOpen className="h-16 w-16 mb-6 text-secondary" />
                <h3 className="text-2xl font-semibold font-heading mb-3">Explore Courses</h3>
                <p className="text-muted-foreground mb-4">
                  Interactive course explorer with real-time job market data. Discover your perfect tech stack.
                </p>
                <Button variant="ghost" className="p-0 h-auto">
                  Explore Now <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Card>
            </Link>
            <Link href="/inquiry" data-testid="card-inquiry">
              <Card className="p-8 hover-elevate transition-all duration-300 cursor-pointer h-full">
                <GraduationCap className="h-16 w-16 mb-6 text-primary" />
                <h3 className="text-2xl font-semibold font-heading mb-3">Apply Now</h3>
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

      {/* Footer */}
      <footer className="bg-card border-t mt-auto">
        <div className="container max-w-7xl mx-auto px-4 md:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="md:col-span-1">
              <img src={logoUrl} alt="Programmers Point" className="h-12 mb-4" />
              <p className="text-sm text-muted-foreground">
                Earning Trust In Education
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="/" className="hover:text-primary transition-colors">Home</Link></li>
                <li><Link href="/placements" className="hover:text-primary transition-colors">Placements</Link></li>
                <li><Link href="/courses" className="hover:text-primary transition-colors">Courses</Link></li>
                <li><Link href="/inquiry" className="hover:text-primary transition-colors">Apply Now</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Contact</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>Phone: +91 XXXXXXXXXX</li>
                <li>Email: info@programmerspoint.com</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Follow Us</h4>
              <div className="flex gap-4">
                {/* Social icons would go here */}
              </div>
            </div>
          </div>
          <div className="border-t mt-8 pt-8 text-center text-sm text-muted-foreground">
            <p>&copy; {new Date().getFullYear()} Programmers Point. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
