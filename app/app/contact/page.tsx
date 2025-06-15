import { Navbar } from "@/components/layout/navbar"
import { ContactFormWorking } from "@/components/contact/contact-form-working"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Contact Us - E-Commerce App",
  description: "Get in touch with our team. We're here to help with any questions or concerns.",
}

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main>
        {/* Hero Section */}
        <section className="bg-gray-50 py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-6">Contact Us</h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Have a question or need help? We're here to assist you. Send us a message and we'll get back to you as
              soon as possible.
            </p>
          </div>
        </section>

        {/* Contact Section */}
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {/* Contact Form */}
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Send us a message</h2>
                <ContactFormWorking />
              </div>

              {/* Contact Information */}
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Get in touch</h2>
                <div className="space-y-6">
                  <div className="bg-white p-6 rounded-lg shadow-md">
                    <div className="flex items-start space-x-4">
                      <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                        <span className="text-blue-600 text-xl">📧</span>
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-1">Email Us</h3>
                        <p className="text-sm text-gray-600 mb-2">Send us an email anytime</p>
                        <a
                          href="mailto:support@ecommerce.com"
                          className="text-blue-600 hover:text-blue-700 font-medium"
                        >
                          support@ecommerce.com
                        </a>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white p-6 rounded-lg shadow-md">
                    <div className="flex items-start space-x-4">
                      <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                        <span className="text-blue-600 text-xl">📞</span>
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-1">Call Us</h3>
                        <p className="text-sm text-gray-600 mb-2">Mon-Fri from 8am to 6pm</p>
                        <a href="tel:+15551234567" className="text-blue-600 hover:text-blue-700 font-medium">
                          +383 44 123 456
                        </a>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white p-6 rounded-lg shadow-md">
                    <div className="flex items-start space-x-4">
                      <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                        <span className="text-blue-600 text-xl">📍</span>
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-1">Visit Us</h3>
                        <p className="text-sm text-gray-600 mb-2">Come say hello at our office</p>
                        <p className="text-gray-900 font-medium">
                          10000, Pejton
                          <br />
                          Prishtine
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Business Hours */}
                  <div className="bg-white p-6 rounded-lg shadow-md">
                    <h3 className="font-semibold text-gray-900 mb-4">Business Hours</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Monday - Friday</span>
                        <span className="text-gray-900">8:00 AM - 6:00 PM</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Saturday</span>
                        <span className="text-gray-900">9:00 AM - 4:00 PM</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Sunday</span>
                        <span className="text-gray-900">Closed</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}
