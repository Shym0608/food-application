import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function TermsAndConditions() {
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
          Terms & Conditions
        </h1>
      </div>

      {/* Content */}
      <div className="px-6 py-8 space-y-6 text-gray-700">
        <section>
          <h2 className="text-lg font-bold text-gray-900 mb-2">Introduction</h2>
          <p className="text-sm leading-relaxed">
            Welcome to our food delivery application. By accessing or using this
            application, you agree to be bound by these Terms & Conditions.
            Please read them carefully before using our services.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-gray-900 mb-2">User Account</h2>
          <ul className="list-disc pl-5 space-y-2 text-sm">
            <li>You must provide accurate and complete information.</li>
            <li>
              You are responsible for maintaining account confidentiality.
            </li>
            <li>Any activity under your account is your responsibility.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-bold text-gray-900 mb-2">Food Orders</h2>
          <ul className="list-disc pl-5 space-y-2 text-sm">
            <li>Orders once placed cannot be cancelled after preparation.</li>
            <li>Menu prices and availability may change without notice.</li>
            <li>Images are for representation only.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-bold text-gray-900 mb-2">
            Payments & Refunds
          </h2>
          <ul className="list-disc pl-5 space-y-2 text-sm">
            <li>All payments are processed securely.</li>
            <li>Refunds are subject to our refund policy.</li>
            <li>Refunds may take 3–7 business days to reflect.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-bold text-gray-900 mb-2">
            Delivery Policy
          </h2>
          <ul className="list-disc pl-5 space-y-2 text-sm">
            <li>Delivery times are estimates and may vary.</li>
            <li>Incorrect address may lead to failed delivery.</li>
            <li>We are not responsible for delays beyond our control.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-bold text-gray-900 mb-2">User Conduct</h2>
          <p className="text-sm leading-relaxed">
            Users must not misuse the application, perform fraudulent
            activities, or violate any applicable laws. Such actions may result
            in account suspension or termination.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-gray-900 mb-2">
            Limitation of Liability
          </h2>
          <p className="text-sm leading-relaxed">
            We shall not be liable for any indirect, incidental, or
            consequential damages arising from the use of this application.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-gray-900 mb-2">
            Changes to Terms
          </h2>
          <p className="text-sm leading-relaxed">
            We reserve the right to update or modify these Terms & Conditions at
            any time. Continued use of the application implies acceptance of the
            updated terms.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-gray-900 mb-2">
            Contact Information
          </h2>
          <p className="text-sm leading-relaxed">
            For any questions regarding these Terms & Conditions, please contact
            our support team.
          </p>
        </section>

        <div className="pt-6 border-t border-gray-200 text-center text-xs text-gray-400">
          © {new Date().getFullYear()} Food Application. All rights reserved.
        </div>
      </div>
    </div>
  );
}
