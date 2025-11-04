
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { useState } from "react";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-background border-b sticky top-0 z-50">
      <div className="container max-w-7xl mx-auto px-4 md:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/">
            <div className="flex items-center space-x-2 cursor-pointer">
              <img 
                src="/attached_assets/logo_1761740236721.png" 
                alt="Programmers Point Logo" 
                className="h-10 w-10"
              />
              <span className="text-xl font-bold" data-testid="text-logo">
                Programmers Point
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            <Link href="/">
              <span className="hover:text-primary cursor-pointer transition-colors" data-testid="link-home">
                Home
              </span>
            </Link>
            <Link href="/courses">
              <span className="hover:text-primary cursor-pointer transition-colors" data-testid="link-courses">
                Courses
              </span>
            </Link>
            <Link href="/placements">
              <span className="hover:text-primary cursor-pointer transition-colors" data-testid="link-placements">
                Placements
              </span>
            </Link>
            <Link href="/inquiry">
              <Button className="min-h-[48px]" data-testid="button-inquiry">
                Enquire Now
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
          >
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden py-4 space-y-4">
            <Link href="/">
              <div className="block hover:text-primary cursor-pointer transition-colors" onClick={() => setIsOpen(false)}>
                Home
              </div>
            </Link>
            <Link href="/courses">
              <div className="block hover:text-primary cursor-pointer transition-colors" onClick={() => setIsOpen(false)}>
                Courses
              </div>
            </Link>
            <Link href="/placements">
              <div className="block hover:text-primary cursor-pointer transition-colors" onClick={() => setIsOpen(false)}>
                Placements
              </div>
            </Link>
            <Link href="/inquiry">
              <Button className="w-full min-h-[48px]" onClick={() => setIsOpen(false)}>
                Enquire Now
              </Button>
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
}
