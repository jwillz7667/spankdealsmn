import React from 'react';
import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy | DankDeals',
  description: 'Privacy Policy for DankDeals - Learn how we collect, use, and protect your personal information.',
  robots: 'noindex, nofollow',
};

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-navy-900 py-12 px-4">
      <div className="container mx-auto max-w-4xl">
        <div className="bg-navy-800 rounded-lg border border-gold/30 p-8 md:p-12">
          <h1 className="font-display text-4xl md:text-5xl text-gold mb-4">Privacy Policy</h1>
          <p className="text-gold/70 mb-8">Last Updated: December 2, 2024</p>

          <div className="prose prose-invert prose-gold max-w-none">
            {/* Introduction */}
            <section className="mb-8">
              <p className="text-white/90 leading-relaxed mb-4">
                DankDeals ("we," "us," or "our") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website and use our cannabis delivery services in the Minneapolis-St. Paul, Minnesota area.
              </p>
              <p className="text-white/90 leading-relaxed mb-4">
                This policy is operated by Viral Ventures LLC. By using our services, you agree to the collection and use of information in accordance with this policy.
              </p>
              <div className="bg-navy-700 border border-gold/20 rounded-lg p-4 mb-4">
                <h3 className="text-gold text-lg font-semibold mb-2">Contact Information</h3>
                <p className="text-white/90 mb-1"><strong>Viral Ventures LLC</strong></p>
                <p className="text-white/90 mb-1">PO Box 27322</p>
                <p className="text-white/90 mb-1">Minneapolis, MN 55427</p>
                <p className="text-white/90 mb-1">Phone: <a href="tel:612-930-1390" className="text-gold hover:text-gold-400">612-930-1390</a></p>
                <p className="text-white/90">Email: <a href="mailto:privacy@dankdealsmn.com" className="text-gold hover:text-gold-400">privacy@dankdealsmn.com</a></p>
              </div>
            </section>

            {/* Information We Collect */}
            <section className="mb-8">
              <h2 className="text-2xl font-display text-gold mb-4">1. Information We Collect</h2>

              <h3 className="text-xl text-gold/90 mb-3 mt-6">1.1 Personal Information You Provide</h3>
              <p className="text-white/90 leading-relaxed mb-4">
                When you register for an account or place an order, we collect:
              </p>
              <ul className="list-disc list-inside text-white/90 space-y-2 mb-4 ml-4">
                <li><strong>Account Information:</strong> Full name, email address, phone number, date of birth</li>
                <li><strong>Delivery Information:</strong> Delivery address, apartment/unit number, delivery instructions</li>
                <li><strong>Age Verification:</strong> Government-issued ID information to verify you are 21 years or older (as required by Minnesota law)</li>
                <li><strong>Payment Information:</strong> Payment method details (processed securely by third-party payment processors)</li>
                <li><strong>Order History:</strong> Products purchased, quantities, pricing, delivery dates and times</li>
                <li><strong>Communications:</strong> Messages, feedback, and customer support inquiries</li>
              </ul>

              <h3 className="text-xl text-gold/90 mb-3 mt-6">1.2 Information Collected Automatically</h3>
              <p className="text-white/90 leading-relaxed mb-4">
                When you access our website, we automatically collect:
              </p>
              <ul className="list-disc list-inside text-white/90 space-y-2 mb-4 ml-4">
                <li><strong>Device Information:</strong> IP address, browser type, operating system, device identifiers</li>
                <li><strong>Usage Data:</strong> Pages viewed, time spent on pages, click patterns, referring URLs</li>
                <li><strong>Location Data:</strong> Approximate location based on IP address (with consent for precise location)</li>
                <li><strong>Cookies and Tracking:</strong> Session cookies, preference cookies, analytics cookies</li>
              </ul>

              <h3 className="text-xl text-gold/90 mb-3 mt-6">1.3 Third-Party Information</h3>
              <p className="text-white/90 leading-relaxed mb-4">
                We may receive information from third parties such as:
              </p>
              <ul className="list-disc list-inside text-white/90 space-y-2 mb-4 ml-4">
                <li>Social media platforms (if you choose to sign in via Google OAuth)</li>
                <li>Identity verification services for age verification compliance</li>
                <li>Payment processors for transaction verification</li>
                <li>Analytics providers (Google Analytics via Google Tag Manager)</li>
              </ul>
            </section>

            {/* How We Use Your Information */}
            <section className="mb-8">
              <h2 className="text-2xl font-display text-gold mb-4">2. How We Use Your Information</h2>
              <p className="text-white/90 leading-relaxed mb-4">
                We use the information we collect for the following purposes:
              </p>

              <h3 className="text-xl text-gold/90 mb-3 mt-6">2.1 Service Delivery</h3>
              <ul className="list-disc list-inside text-white/90 space-y-2 mb-4 ml-4">
                <li>Process and fulfill your orders</li>
                <li>Arrange same-day delivery to your specified address</li>
                <li>Send order confirmations, delivery updates, and receipts</li>
                <li>Provide customer support and respond to inquiries</li>
                <li>Maintain your account and purchase history</li>
              </ul>

              <h3 className="text-xl text-gold/90 mb-3 mt-6">2.2 Legal Compliance</h3>
              <ul className="list-disc list-inside text-white/90 space-y-2 mb-4 ml-4">
                <li>Verify you are 21 years of age or older (Minnesota cannabis law requirement)</li>
                <li>Maintain records required by Minnesota cannabis regulations</li>
                <li>Comply with state and local cannabis delivery laws</li>
                <li>Prevent fraud and unauthorized transactions</li>
                <li>Respond to legal requests and prevent illegal activity</li>
              </ul>

              <h3 className="text-xl text-gold/90 mb-3 mt-6">2.3 Business Operations</h3>
              <ul className="list-disc list-inside text-white/90 space-y-2 mb-4 ml-4">
                <li>Improve and personalize your experience</li>
                <li>Analyze site usage and optimize our services</li>
                <li>Develop new products and features</li>
                <li>Send promotional offers and updates (with your consent)</li>
                <li>Manage loyalty programs and rewards</li>
              </ul>

              <h3 className="text-xl text-gold/90 mb-3 mt-6">2.4 Marketing Communications</h3>
              <p className="text-white/90 leading-relaxed mb-4">
                With your explicit consent, we may send you:
              </p>
              <ul className="list-disc list-inside text-white/90 space-y-2 mb-4 ml-4">
                <li>Email newsletters about new products and promotions</li>
                <li>SMS messages for order updates and special offers</li>
                <li>Push notifications (if enabled on your device)</li>
              </ul>
              <p className="text-white/90 leading-relaxed mb-4">
                You may opt out of marketing communications at any time by clicking "unsubscribe" in emails, replying STOP to SMS messages, or adjusting your account preferences.
              </p>
            </section>

            {/* Information Sharing */}
            <section className="mb-8">
              <h2 className="text-2xl font-display text-gold mb-4">3. How We Share Your Information</h2>
              <p className="text-white/90 leading-relaxed mb-4">
                We do not sell your personal information. We share information only in the following circumstances:
              </p>

              <h3 className="text-xl text-gold/90 mb-3 mt-6">3.1 Service Providers</h3>
              <p className="text-white/90 leading-relaxed mb-4">
                We share information with trusted third-party service providers who assist us in operating our business:
              </p>
              <ul className="list-disc list-inside text-white/90 space-y-2 mb-4 ml-4">
                <li><strong>Supabase:</strong> Database hosting and authentication services</li>
                <li><strong>Twilio:</strong> SMS delivery for order notifications and phone authentication</li>
                <li><strong>Resend:</strong> Email delivery for order confirmations and communications</li>
                <li><strong>Google:</strong> Analytics (via Google Tag Manager), Maps API, OAuth authentication</li>
                <li><strong>Payment Processors:</strong> Secure payment processing (we do not store full credit card numbers)</li>
                <li><strong>Delivery Partners:</strong> Third-party delivery drivers (only delivery address and order details)</li>
              </ul>

              <h3 className="text-xl text-gold/90 mb-3 mt-6">3.2 Legal Requirements</h3>
              <p className="text-white/90 leading-relaxed mb-4">
                We may disclose your information if required by law or in response to:
              </p>
              <ul className="list-disc list-inside text-white/90 space-y-2 mb-4 ml-4">
                <li>Court orders, subpoenas, or legal processes</li>
                <li>Requests from law enforcement or regulatory agencies</li>
                <li>Compliance with Minnesota cannabis regulations</li>
                <li>Protection of our rights, property, or safety</li>
              </ul>

              <h3 className="text-xl text-gold/90 mb-3 mt-6">3.3 Business Transfers</h3>
              <p className="text-white/90 leading-relaxed mb-4">
                In the event of a merger, acquisition, or sale of assets, your information may be transferred to the acquiring entity. We will notify you of any such change in ownership.
              </p>

              <h3 className="text-xl text-gold/90 mb-3 mt-6">3.4 With Your Consent</h3>
              <p className="text-white/90 leading-relaxed mb-4">
                We may share information with other third parties when you provide explicit consent.
              </p>
            </section>

            {/* Data Security */}
            <section className="mb-8">
              <h2 className="text-2xl font-display text-gold mb-4">4. Data Security</h2>
              <p className="text-white/90 leading-relaxed mb-4">
                We implement industry-standard security measures to protect your personal information:
              </p>
              <ul className="list-disc list-inside text-white/90 space-y-2 mb-4 ml-4">
                <li><strong>Encryption:</strong> All data transmitted between your device and our servers is encrypted using TLS/SSL</li>
                <li><strong>Secure Storage:</strong> Personal data is stored in encrypted databases with restricted access</li>
                <li><strong>Access Controls:</strong> Only authorized personnel have access to personal information</li>
                <li><strong>Regular Audits:</strong> Security practices are regularly reviewed and updated</li>
                <li><strong>Payment Security:</strong> We are PCI DSS compliant and do not store full credit card numbers</li>
                <li><strong>Authentication:</strong> Multi-factor authentication options available for account protection</li>
              </ul>
              <p className="text-white/90 leading-relaxed mb-4">
                While we take reasonable measures to protect your information, no method of transmission over the internet is 100% secure. We cannot guarantee absolute security.
              </p>
            </section>

            {/* Cookies and Tracking */}
            <section className="mb-8">
              <h2 className="text-2xl font-display text-gold mb-4">5. Cookies and Tracking Technologies</h2>
              <p className="text-white/90 leading-relaxed mb-4">
                We use cookies and similar tracking technologies to improve your experience:
              </p>

              <h3 className="text-xl text-gold/90 mb-3 mt-6">5.1 Types of Cookies</h3>
              <ul className="list-disc list-inside text-white/90 space-y-2 mb-4 ml-4">
                <li><strong>Essential Cookies:</strong> Required for site functionality (login, shopping cart, security)</li>
                <li><strong>Preference Cookies:</strong> Remember your settings and preferences</li>
                <li><strong>Analytics Cookies:</strong> Help us understand how visitors use our site (Google Analytics)</li>
                <li><strong>Marketing Cookies:</strong> Track your activity for personalized advertising (with consent)</li>
              </ul>

              <h3 className="text-xl text-gold/90 mb-3 mt-6">5.2 Managing Cookies</h3>
              <p className="text-white/90 leading-relaxed mb-4">
                You can control cookies through your browser settings. Note that disabling cookies may affect site functionality. Most browsers allow you to:
              </p>
              <ul className="list-disc list-inside text-white/90 space-y-2 mb-4 ml-4">
                <li>View and delete cookies</li>
                <li>Block third-party cookies</li>
                <li>Block all cookies (may limit site features)</li>
                <li>Delete cookies when you close your browser</li>
              </ul>

              <h3 className="text-xl text-gold/90 mb-3 mt-6">5.3 Do Not Track Signals</h3>
              <p className="text-white/90 leading-relaxed mb-4">
                Our website does not currently respond to "Do Not Track" (DNT) browser signals. You can control tracking through your browser cookie settings.
              </p>
            </section>

            {/* Your Privacy Rights */}
            <section className="mb-8">
              <h2 className="text-2xl font-display text-gold mb-4">6. Your Privacy Rights</h2>
              <p className="text-white/90 leading-relaxed mb-4">
                Depending on your location, you may have the following rights regarding your personal information:
              </p>

              <h3 className="text-xl text-gold/90 mb-3 mt-6">6.1 California Residents (CCPA)</h3>
              <p className="text-white/90 leading-relaxed mb-4">
                If you are a California resident, you have the right to:
              </p>
              <ul className="list-disc list-inside text-white/90 space-y-2 mb-4 ml-4">
                <li><strong>Know:</strong> Request disclosure of personal information collected, used, and shared</li>
                <li><strong>Delete:</strong> Request deletion of your personal information (subject to legal exceptions)</li>
                <li><strong>Opt-Out:</strong> Opt out of the sale of personal information (we do not sell personal data)</li>
                <li><strong>Non-Discrimination:</strong> Not be discriminated against for exercising your rights</li>
              </ul>

              <h3 className="text-xl text-gold/90 mb-3 mt-6">6.2 All Users</h3>
              <p className="text-white/90 leading-relaxed mb-4">
                All users may:
              </p>
              <ul className="list-disc list-inside text-white/90 space-y-2 mb-4 ml-4">
                <li><strong>Access:</strong> Request a copy of your personal information</li>
                <li><strong>Correct:</strong> Update or correct inaccurate information via your account settings</li>
                <li><strong>Delete:</strong> Request deletion of your account and associated data</li>
                <li><strong>Object:</strong> Object to processing of your personal information</li>
                <li><strong>Restrict:</strong> Request restriction of processing</li>
                <li><strong>Portability:</strong> Request transfer of your data to another service</li>
                <li><strong>Withdraw Consent:</strong> Withdraw consent for marketing communications at any time</li>
              </ul>

              <h3 className="text-xl text-gold/90 mb-3 mt-6">6.3 Exercising Your Rights</h3>
              <p className="text-white/90 leading-relaxed mb-4">
                To exercise your privacy rights, contact us at:
              </p>
              <ul className="list-disc list-inside text-white/90 space-y-2 mb-4 ml-4">
                <li>Email: <a href="mailto:privacy@dankdealsmn.com" className="text-gold hover:text-gold-400">privacy@dankdealsmn.com</a></li>
                <li>Phone: <a href="tel:612-930-1390" className="text-gold hover:text-gold-400">612-930-1390</a></li>
                <li>Mail: PO Box 27322, Minneapolis, MN 55427</li>
              </ul>
              <p className="text-white/90 leading-relaxed mb-4">
                We will respond to your request within 30 days. We may require verification of your identity before processing requests.
              </p>
            </section>

            {/* Data Retention */}
            <section className="mb-8">
              <h2 className="text-2xl font-display text-gold mb-4">7. Data Retention</h2>
              <p className="text-white/90 leading-relaxed mb-4">
                We retain your personal information for as long as necessary to:
              </p>
              <ul className="list-disc list-inside text-white/90 space-y-2 mb-4 ml-4">
                <li>Provide our services and maintain your account</li>
                <li>Comply with legal obligations (Minnesota cannabis regulations require 5-year record retention)</li>
                <li>Resolve disputes and enforce our agreements</li>
                <li>Maintain business records and analytics</li>
              </ul>
              <p className="text-white/90 leading-relaxed mb-4">
                When information is no longer needed, we securely delete or anonymize it. Account data may be retained for up to 7 years to comply with legal requirements.
              </p>
            </section>

            {/* Children's Privacy */}
            <section className="mb-8">
              <h2 className="text-2xl font-display text-gold mb-4">8. Children's Privacy</h2>
              <p className="text-white/90 leading-relaxed mb-4">
                Our services are only available to individuals 21 years of age or older. We do not knowingly collect information from anyone under 21. If we discover we have collected information from someone under 21, we will delete it immediately.
              </p>
              <p className="text-white/90 leading-relaxed mb-4">
                If you believe we have collected information from someone under 21, please contact us immediately at <a href="mailto:privacy@dankdealsmn.com" className="text-gold hover:text-gold-400">privacy@dankdealsmn.com</a>.
              </p>
            </section>

            {/* Third-Party Links */}
            <section className="mb-8">
              <h2 className="text-2xl font-display text-gold mb-4">9. Third-Party Links</h2>
              <p className="text-white/90 leading-relaxed mb-4">
                Our website may contain links to third-party websites. We are not responsible for the privacy practices of these external sites. We encourage you to read the privacy policies of any third-party sites you visit.
              </p>
            </section>

            {/* International Users */}
            <section className="mb-8">
              <h2 className="text-2xl font-display text-gold mb-4">10. International Users</h2>
              <p className="text-white/90 leading-relaxed mb-4">
                Our services are provided from the United States and are intended for users in Minnesota. If you access our services from outside the United States, your information will be transferred to and processed in the United States. By using our services, you consent to this transfer.
              </p>
              <p className="text-white/90 leading-relaxed mb-4">
                Please note that cannabis remains illegal under U.S. federal law and in many jurisdictions. We only serve customers in areas where adult-use cannabis is legal.
              </p>
            </section>

            {/* Changes to Privacy Policy */}
            <section className="mb-8">
              <h2 className="text-2xl font-display text-gold mb-4">11. Changes to This Privacy Policy</h2>
              <p className="text-white/90 leading-relaxed mb-4">
                We may update this Privacy Policy from time to time. When we make changes, we will:
              </p>
              <ul className="list-disc list-inside text-white/90 space-y-2 mb-4 ml-4">
                <li>Update the "Last Updated" date at the top of this policy</li>
                <li>Notify you via email for material changes</li>
                <li>Post a notice on our website</li>
                <li>Require re-acceptance for significant changes</li>
              </ul>
              <p className="text-white/90 leading-relaxed mb-4">
                Continued use of our services after changes constitutes acceptance of the updated policy.
              </p>
            </section>

            {/* Contact Us */}
            <section className="mb-8">
              <h2 className="text-2xl font-display text-gold mb-4">12. Contact Us</h2>
              <p className="text-white/90 leading-relaxed mb-4">
                If you have questions, concerns, or requests regarding this Privacy Policy or our data practices, please contact us:
              </p>
              <div className="bg-navy-700 border border-gold/20 rounded-lg p-6 mb-4">
                <p className="text-white/90 mb-2"><strong className="text-gold">Viral Ventures LLC</strong></p>
                <p className="text-white/90 mb-2"><strong>Attn:</strong> Privacy Department</p>
                <p className="text-white/90 mb-2">PO Box 27322</p>
                <p className="text-white/90 mb-2">Minneapolis, MN 55427</p>
                <p className="text-white/90 mb-2">
                  <strong>Phone:</strong> <a href="tel:612-930-1390" className="text-gold hover:text-gold-400">612-930-1390</a>
                </p>
                <p className="text-white/90 mb-2">
                  <strong>Email:</strong> <a href="mailto:privacy@dankdealsmn.com" className="text-gold hover:text-gold-400">privacy@dankdealsmn.com</a>
                </p>
                <p className="text-white/90">
                  <strong>Website:</strong> <a href="https://dankdealsmn.com" className="text-gold hover:text-gold-400">dankdealsmn.com</a>
                </p>
              </div>
              <p className="text-white/90 leading-relaxed mb-4">
                We will respond to all privacy inquiries within 30 business days.
              </p>
            </section>

            {/* Minnesota-Specific Information */}
            <section className="mb-8">
              <h2 className="text-2xl font-display text-gold mb-4">13. Minnesota-Specific Information</h2>
              <p className="text-white/90 leading-relaxed mb-4">
                As a Minnesota-based cannabis delivery service, we comply with all state regulations including:
              </p>
              <ul className="list-disc list-inside text-white/90 space-y-2 mb-4 ml-4">
                <li>Minnesota Cannabis Regulations (Minn. Stat. Chapter 342)</li>
                <li>Age verification requirements (21+ only)</li>
                <li>Purchase limits and transaction tracking</li>
                <li>Mandatory record retention (5-7 years)</li>
                <li>Delivery area restrictions (licensed zones only)</li>
                <li>Data sharing with state regulatory authorities as required by law</li>
              </ul>
            </section>
          </div>

          {/* Footer Navigation */}
          <div className="mt-12 pt-8 border-t border-gold/20">
            <div className="flex flex-wrap gap-4 justify-center">
              <Link href="/" className="text-gold hover:text-gold-400 transition-colors">
                Home
              </Link>
              <span className="text-gold/30">•</span>
              <Link href="/terms" className="text-gold hover:text-gold-400 transition-colors">
                Terms of Service
              </Link>
              <span className="text-gold/30">•</span>
              <Link href="/products" className="text-gold hover:text-gold-400 transition-colors">
                Shop Products
              </Link>
              <span className="text-gold/30">•</span>
              <a href="mailto:privacy@dankdealsmn.com" className="text-gold hover:text-gold-400 transition-colors">
                Contact Privacy Team
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
