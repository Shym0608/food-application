import { ArrowLeft } from "lucide-react";
import { Phone } from "lucide-react";
import { Mail } from "lucide-react";
import { HelpCircle } from "lucide-react";
import { Clock } from "lucide-react";
import { Package } from "lucide-react";
import { CreditCard } from "lucide-react";
import { MapPin } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function HelpAndSupport() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#FDFDFD] font-sans">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-white border-b border-gray-100 px-6 py-4 flex items-center">
        <button
          onClick={() => navigate(-1)}
          className="p-2 bg-gray-50 rounded-full mr-4"
        >
          <ArrowLeft className="w-5 h-5 text-gray-900" />
        </button>
        <h1 className="text-sm font-black uppercase tracking-[0.2em] text-gray-700">
          Help & Support
        </h1>
      </div>

      {/* Content */}
      <div className="px-6 py-8 space-y-8">
        {/* Intro */}
        <div className="text-center">
          <div className="w-14 h-14 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <HelpCircle className="w-7 h-7 text-orange-500" />
          </div>
          <h2 className="text-xl font-bold text-gray-900">
            How can we help you?
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Get quick help for your food orders and account
          </p>
        </div>

        {/* Quick Help Cards */}
        <div className="grid grid-cols-1 gap-4">
          <HelpCard
            icon={Package}
            title="Order Issues"
            desc="Track order, delayed delivery, wrong items"
          />
          <HelpCard
            icon={CreditCard}
            title="Payments & Refunds"
            desc="Payment failed, refund status, billing issues"
          />
          <HelpCard
            icon={MapPin}
            title="Address & Delivery"
            desc="Change address, delivery partner issues"
          />
        </div>

        {/* FAQ Section */}
        <div>
          <h3 className="text-lg font-bold text-gray-900 mb-4">
            Frequently Asked Questions
          </h3>

          <div className="space-y-4">
            <FAQ
              q="My order is delayed. What should I do?"
              a="Delivery times are estimates. If your order is delayed beyond the expected time, please contact support."
            />
            <FAQ
              q="Payment was deducted but order failed."
              a="Don’t worry. The amount will be refunded within 3–5 business days automatically."
            />
            <FAQ
              q="Received wrong or missing items."
              a="You can report the issue within 24 hours from the order details page."
            />
            <FAQ
              q="Can I cancel my order?"
              a="Orders cannot be cancelled once the restaurant starts preparing food."
            />
          </div>
        </div>

        {/* Contact Support */}
        <div className="bg-white rounded-3xl border border-gray-100 p-6 space-y-4">
          <h3 className="text-lg font-bold text-gray-900">Contact Support</h3>

          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center">
              <Phone className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-900">
                +91 1234567890
              </p>
              <p className="text-xs text-gray-500">Customer Support</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center">
              <Mail className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-900">
                support@foodapp.com
              </p>
              <p className="text-xs text-gray-500">Email Support</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-orange-50 flex items-center justify-center">
              <Clock className="w-5 h-5 text-orange-600" />
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-900">
                9:00 AM – 9:00 PM
              </p>
              <p className="text-xs text-gray-500">All Days</p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center text-xs text-gray-400 pt-6">
          © {new Date().getFullYear()} Food Application. We’re happy to serve
          you 🍽️
        </div>
      </div>
    </div>
  );
}

/* Reusable Components */

function HelpCard({ icon: Icon, title, desc }: any) {
  return (
    <div className="flex items-center gap-4 bg-white p-4 rounded-2xl border border-gray-100">
      <div className="w-12 h-12 rounded-xl bg-orange-50 flex items-center justify-center">
        <Icon className="w-6 h-6 text-orange-500" />
      </div>
      <div>
        <p className="font-bold text-gray-900">{title}</p>
        <p className="text-sm text-gray-500">{desc}</p>
      </div>
    </div>
  );
}

function FAQ({ q, a }: any) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-4">
      <p className="font-semibold text-gray-900 text-sm">{q}</p>
      <p className="text-sm text-gray-500 mt-1">{a}</p>
    </div>
  );
}
