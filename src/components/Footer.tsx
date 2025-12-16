import { Link } from "react-router-dom";
import { motion } from "framer-motion";

export default function Footer() {
  return (
    <footer className="relative bg-footer text-white overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl float-slow"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl float-slow-delay"></div>
        <div className="absolute top-10 left-1/2 w-60 h-60 bg-cyan-500/5 rounded-full blur-3xl float-slow"></div>
      </div>

      <div className="relative z-10 py-4 md:py-10 md:px-8 lg:px-10">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55 }}
            className="grid grid-cols-1 md:grid-cols-4 gap-12"
          >
            {/* Brand Section */}
            <div className="md:col-span-1">
              <div className="flex items-center gap-3 mb-6">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl blur-md opacity-50"></div>
                  <div className="relative bg-gradient-to-r from-blue-600 to-purple-600 p-3 rounded-xl shadow-lg">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="28"
                      height="28"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="white"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="h-6 w-6"
                    >
                      <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
                      <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2-2v16" />
                    </svg>
                  </div>
                </div>
                <span className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  Job Plus
                </span>
              </div>
              <p className="text-gray-300 mb-6 leading-relaxed">
                Find your dream job or the perfect candidate with our comprehensive job portal.
                Connecting talent with opportunity.
              </p>
              <div className="flex gap-4">
                <div className="flex items-center gap-2 text-sm text-gray-400">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span>24/7 Support</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-400">
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                  <span>Verified Jobs</span>
                </div>
              </div>
            </div>

            {/* Job Seekers Section */}
            <div className="group">
              <h3 className="font-bold text-lg mb-6 text-white relative">
                For Job Seekers
                <div className="absolute -bottom-2 left-0 w-12 h-0.5 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full group-hover:w-full transition-all duration-300"></div>
              </h3>
              <ul className="space-y-3">
                {["Browse Jobs", "Create Resume", "Job Alerts", "Career Advice"].map((item, index) => (
                  <li key={index} className="transform transition-all duration-200 hover:translate-x-2">
                    <Link
                      to="#"
                      className="text-gray-300 hover:text-white relative group/link flex items-center gap-2"
                    >
                      <div className="w-1 h-1 bg-blue-500 rounded-full group-hover/link:w-2 group-hover/link:h-2 transition-all duration-200"></div>
                      {item}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Employers Section */}
            <div className="group">
              <h3 className="font-bold text-lg mb-6 text-white relative">
                For Employers
                <div className="absolute -bottom-2 left-0 w-12 h-0.5 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full group-hover:w-full transition-all duration-300"></div>
              </h3>
              <ul className="space-y-3">
                {["Post a Job", "Browse Candidates", "Pricing Plans", "Recruitment Tools"].map((item, index) => (
                  <li key={index} className="transform transition-all duration-200 hover:translate-x-2">
                    <Link
                      to="#"
                      className="text-gray-300 hover:text-white relative group/link flex items-center gap-2"
                    >
                      <div className="w-1 h-1 bg-purple-500 rounded-full group-hover/link:w-2 group-hover/link:h-2 transition-all duration-200"></div>
                      {item}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact Section */}
            <div className="group">
              <h3 className="font-bold text-lg mb-6 text-white relative">
                Contact Us
                <div className="absolute -bottom-2 left-0 w-12 h-0.5 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full group-hover:w-full transition-all duration-300"></div>
              </h3>
              <ul className="space-y-4">
                <li className="flex items-center gap-3 text-gray-300">
                  <div className="w-5 h-5 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                    <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"></path>
                      <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"></path>
                    </svg>
                  </div>
                  <span>ibrahimsheikh772@gmail.com</span>
                </li>
                <li className="flex items-center gap-3 text-gray-300">
                  <div className="w-5 h-5 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center">
                    <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z"></path>
                    </svg>
                  </div>
                  <span>+923431223329</span>
                </li>
                <li className="flex items-center gap-3 text-gray-300">
                  <div className="w-5 h-5 bg-gradient-to-r from-red-500 to-pink-500 rounded-full flex items-center justify-center">
                    <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd"></path>
                    </svg>
                  </div>
                  <span>Zaitoon Ashraf IT Park</span>
                </li>
              </ul>

              {/* Social Links */}
              <div className="flex gap-4 mt-6">
                {[
                     {
                    name: "GitHub",
                    icon: "M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z",
                    color: "from-gray-700 to-gray-600",
                    url: "https://github.com/Ibrahimkhan432"
                  },
                  {
                    name: "Facebook",
                    icon: "M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z",
                    color: "from-blue-600 to-blue-500",
                    url: "https://www.facebook.com/ibrahim.khan.324538"
                  },
                  {
                    name: "Instagram",
                    icon: "M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63z",
                    color: "from-pink-500 to-purple-500",
                    url: "https://instagram.com/ibrahimkhan5353"
                  },
               
                ].map((social, index) => (
                  <a
                    key={index}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group/social"
                    aria-label={social.name}
                  >
                    <div className={`w-10 h-10 bg-gradient-to-r ${social.color} rounded-full flex items-center justify-center transition-all duration-300 group-hover/social:scale-110 group-hover/social:shadow-lg`}>
                      <svg className="h-5 w-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                        <path fillRule="evenodd" d={social.icon} clipRule="evenodd" />
                      </svg>
                    </div>
                  </a>
                ))}
              </div>

            </div>
          </motion.div>

          {/* Bottom Section */}
          <div className="mt-4 pt-2 border-t border-white/10">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <p className="text-gray-400 text-sm">
                © {new Date().getFullYear()} Job Plus. All rights reserved.
              </p>
              <div className="flex items-center gap-6 text-sm text-gray-400">
                <Link to="#" className="hover:text-white transition-colors">Privacy Policy</Link>
                <Link to="#" className="hover:text-white transition-colors">Terms of Service</Link>
                <Link to="#" className="hover:text-white transition-colors">Cookie Policy</Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}