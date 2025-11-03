import { Mail, Phone, MapPin } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-gray-100 dark:bg-gray-900 border-t mt-auto">
      <div className="container mx-auto px-6 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="font-bold text-lg mb-4" data-testid="text-footer-about">About Programmers Point</h3>
            <p className="text-sm text-muted-foreground">
              Leading programming institute offering comprehensive courses in web development,
              mobile app development, and software engineering.
            </p>
          </div>

          <div>
            <h3 className="font-bold text-lg mb-4" data-testid="text-footer-contact">Contact Us</h3>
            <div className="space-y-2 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4" />
                <span data-testid="text-phone">+91 XXXXXXXXXX</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                <span data-testid="text-email">info@programmerspoint.com</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                <span data-testid="text-address">Location, City, State</span>
              </div>
            </div>
          </div>

          <div>
            <h3 className="font-bold text-lg mb-4" data-testid="text-footer-hours">Operating Hours</h3>
            <div className="space-y-2 text-sm text-muted-foreground">
              <p>Monday - Saturday: 9:00 AM - 8:00 PM</p>
              <p>Sunday: Closed</p>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t text-center text-sm text-muted-foreground">
          <p data-testid="text-copyright">
            © {new Date().getFullYear()} Programmers Point. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
