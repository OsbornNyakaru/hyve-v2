import { Link } from 'react-router-dom';
import { Leaf, Mail, Phone, MapPin } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-primary dark:bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <Link to="/" className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-accent rounded-lg flex items-center justify-center">
                <Leaf className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold">Hyve</span>
            </Link>
            <p className="text-gray-300 mb-4 max-w-md">
              Empowering Kilimani residents to create environmental change through smart waste management and carbon credit rewards.
            </p>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <MapPin className="w-4 h-4 text-accent" />
                <span className="text-sm text-gray-300">Kilimani, Nairobi, Kenya</span>
              </div>
              <div className="flex items-center space-x-2">
                <Mail className="w-4 h-4 text-accent" />
                <span className="text-sm text-gray-300">hello@hyve.co.ke</span>
              </div>
              <div className="flex items-center space-x-2">
                <Phone className="w-4 h-4 text-accent" />
                <span className="text-sm text-gray-300">+254 700 123 456</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/report" className="text-gray-300 hover:text-accent transition-colors duration-200">
                  Report Waste
                </Link>
              </li>
              <li>
                <Link to="/map" className="text-gray-300 hover:text-accent transition-colors duration-200">
                  View Map
                </Link>
              </li>
              <li>
                <Link to="/dashboard" className="text-gray-300 hover:text-accent transition-colors duration-200">
                  Dashboard
                </Link>
              </li>
              <li>
                <Link to="/login" className="text-gray-300 hover:text-accent transition-colors duration-200">
                  Login
                </Link>
              </li>
            </ul>
          </div>

          {/* Community */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Community</h3>
            <ul className="space-y-2">
              <li>
                <a href="/about" className="text-gray-300 hover:text-accent transition-colors duration-200">
                  About Us
                </a>
              </li>
              <li>
                <a href="/contact" className="text-gray-300 hover:text-accent transition-colors duration-200">
                  Contact
                </a>
              </li>
              <li>
                <a href="/privacy" className="text-gray-300 hover:text-accent transition-colors duration-200">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="/terms" className="text-gray-300 hover:text-accent transition-colors duration-200">
                  Terms of Service
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-12 pt-8 text-center">
          <p className="text-gray-300">
            © 2025 Hyve. All rights reserved. Building a cleaner Kilimani, together.
          </p>
        </div>
      </div>
    </footer>
  );
}