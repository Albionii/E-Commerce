import { Card, CardContent } from "@/components/ui/card"
import { Mail, Phone, MapPin, Clock, MessageCircle, HelpCircle } from "lucide-react"

export function ContactInfo() {
  const contactMethods = [
    {
      icon: Mail,
      title: "Email Us",
      description: "Send us an email anytime",
      value: "support@ecommerce.com",
      action: "mailto:support@ecommerce.com",
    },
    {
      icon: Phone,
      title: "Call Us",
      description: "Mon-Fri from 8am to 6pm",
      value: "+1 (555) 123-4567",
      action: "tel:+15551234567",
    },
    {
      icon: MapPin,
      title: "Visit Us",
      description: "Come say hello at our office",
      value: "123 Business St, Suite 100\nSan Francisco, CA 94105",
      action: null,
    },
  ]

  const quickHelp = [
    {
      icon: MessageCircle,
      title: "Live Chat",
      description: "Chat with our support team",
      available: true,
    },
    {
      icon: HelpCircle,
      title: "Help Center",
      description: "Find answers to common questions",
      available: true,
    },
    {
      icon: Clock,
      title: "Response Time",
      description: "We typically respond within 24 hours",
      available: true,
    },
  ]

  return (
    <div className="space-y-6">
      {/* Contact Methods */}
      <div className="space-y-4">
        {contactMethods.map((method) => (
          <Card key={method.title} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <method.icon className="h-6 w-6 text-blue-600" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 mb-1">{method.title}</h3>
                  <p className="text-sm text-gray-600 mb-2">{method.description}</p>
                  {method.action ? (
                    <a href={method.action} className="text-blue-600 hover:text-blue-700 font-medium text-sm">
                      {method.value}
                    </a>
                  ) : (
                    <p className="text-gray-900 font-medium text-sm whitespace-pre-line">{method.value}</p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Help */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Help</h3>
        <div className="space-y-3">
          {quickHelp.map((item) => (
            <div key={item.title} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
              <item.icon className="h-5 w-5 text-gray-600" />
              <div>
                <p className="font-medium text-gray-900 text-sm">{item.title}</p>
                <p className="text-xs text-gray-600">{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Business Hours */}
      <Card>
        <CardContent className="p-6">
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
        </CardContent>
      </Card>
    </div>
  )
}
