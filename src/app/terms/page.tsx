import React from 'react';
import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms of Service | DankDeals',
  description: 'Terms of Service for DankDeals - Read our terms and conditions for using our cannabis delivery service.',
  robots: 'noindex, nofollow',
};

export default function TermsOfServicePage() {
  return (
    <div className="min-h-screen bg-navy-900 py-12 px-4">
      <div className="container mx-auto max-w-4xl">
        <div className="bg-navy-800 rounded-lg border border-gold/30 p-8 md:p-12">
          <h1 className="font-display text-4xl md:text-5xl text-gold mb-4">Terms of Service</h1>
          <p className="text-gold/70 mb-8">Last Updated: December 2, 2024</p>

          <div className="prose prose-invert prose-gold max-w-none">
            {/* Introduction */}
            <section className="mb-8">
              <h2 className="text-2xl font-display text-gold mb-4">1. Acceptance of Terms</h2>
              <p className="text-white/90 leading-relaxed mb-4">
                Welcome to DankDeals, operated by Viral Ventures LLC ("Company," "we," "us," or "our"). These Terms of Service ("Terms") govern your access to and use of our website, mobile application, and cannabis delivery services (collectively, the "Services").
              </p>
              <p className="text-white/90 leading-relaxed mb-4">
                By accessing or using our Services, you agree to be bound by these Terms and our <Link href="/privacy" className="text-gold hover:text-gold-400 underline">Privacy Policy</Link>. If you do not agree to these Terms, you may not use our Services.
              </p>
              <div className="bg-navy-700 border border-gold/20 rounded-lg p-4 mb-4">
                <h3 className="text-gold text-lg font-semibold mb-2">Company Information</h3>
                <p className="text-white/90 mb-1"><strong>Viral Ventures LLC</strong></p>
                <p className="text-white/90 mb-1">PO Box 27322</p>
                <p className="text-white/90 mb-1">Minneapolis, MN 55427</p>
                <p className="text-white/90 mb-1">Phone: <a href="tel:612-930-1390" className="text-gold hover:text-gold-400">612-930-1390</a></p>
                <p className="text-white/90">Email: <a href="mailto:support@dankdealsmn.com" className="text-gold hover:text-gold-400">support@dankdealsmn.com</a></p>
              </div>
            </section>

            {/* Eligibility */}
            <section className="mb-8">
              <h2 className="text-2xl font-display text-gold mb-4">2. Eligibility and Age Requirements</h2>

              <h3 className="text-xl text-gold/90 mb-3 mt-6">2.1 Age Verification</h3>
              <p className="text-white/90 leading-relaxed mb-4">
                <strong>You must be at least 21 years of age to use our Services.</strong> By using our Services, you represent and warrant that:
              </p>
              <ul className="list-disc list-inside text-white/90 space-y-2 mb-4 ml-4">
                <li>You are at least 21 years old</li>
                <li>You possess a valid government-issued photo ID proving your age</li>
                <li>You will provide accurate age verification information</li>
                <li>You will present valid ID upon delivery as required by Minnesota law</li>
              </ul>
              <p className="text-white/90 leading-relaxed mb-4">
                We reserve the right to verify your age at any time. Failure to provide valid age verification will result in order cancellation and potential account termination.
              </p>

              <h3 className="text-xl text-gold/90 mb-3 mt-6">2.2 Geographic Restrictions</h3>
              <p className="text-white/90 leading-relaxed mb-4">
                Our Services are only available in areas where adult-use cannabis is legal under Minnesota state law. Currently, we serve the Minneapolis-St. Paul metropolitan area and surrounding suburbs. You agree to:
              </p>
              <ul className="list-disc list-inside text-white/90 space-y-2 mb-4 ml-4">
                <li>Provide a valid delivery address within our service area</li>
                <li>Not attempt to use our Services if you are located outside Minnesota</li>
                <li>Comply with all local ordinances regarding cannabis possession and use</li>
              </ul>

              <h3 className="text-xl text-gold/90 mb-3 mt-6">2.3 Account Requirements</h3>
              <p className="text-white/90 leading-relaxed mb-4">
                To use our Services, you must:
              </p>
              <ul className="list-disc list-inside text-white/90 space-y-2 mb-4 ml-4">
                <li>Create an account with accurate and complete information</li>
                <li>Maintain the security of your account credentials</li>
                <li>Notify us immediately of any unauthorized use of your account</li>
                <li>Accept responsibility for all activities under your account</li>
                <li>Not share your account with others or create multiple accounts</li>
              </ul>
            </section>

            {/* Products and Services */}
            <section className="mb-8">
              <h2 className="text-2xl font-display text-gold mb-4">3. Products and Services</h2>

              <h3 className="text-xl text-gold/90 mb-3 mt-6">3.1 Product Information</h3>
              <p className="text-white/90 leading-relaxed mb-4">
                We strive to provide accurate product descriptions, including:
              </p>
              <ul className="list-disc list-inside text-white/90 space-y-2 mb-4 ml-4">
                <li>Product names, strains, and categories</li>
                <li>THC/CBD content (potency percentages)</li>
                <li>Weight/quantity information</li>
                <li>Pricing and availability</li>
                <li>Product images (for illustrative purposes only)</li>
              </ul>
              <p className="text-white/90 leading-relaxed mb-4">
                We do not guarantee that product descriptions are error-free. Product images may not reflect actual product appearance. THC/CBD percentages are approximate and may vary by batch.
              </p>

              <h3 className="text-xl text-gold/90 mb-3 mt-6">3.2 Purchase Limits</h3>
              <p className="text-white/90 leading-relaxed mb-4">
                In compliance with Minnesota cannabis regulations, we enforce the following purchase limits:
              </p>
              <ul className="list-disc list-inside text-white/90 space-y-2 mb-4 ml-4">
                <li>Maximum purchase limits per transaction as defined by state law</li>
                <li>Daily purchase limits tracked across all orders</li>
                <li>Product-specific quantity restrictions</li>
              </ul>
              <p className="text-white/90 leading-relaxed mb-4">
                We reserve the right to refuse or cancel orders that exceed legal limits or appear suspicious.
              </p>

              <h3 className="text-xl text-gold/90 mb-3 mt-6">3.3 Availability and Stock</h3>
              <p className="text-white/90 leading-relaxed mb-4">
                Product availability is subject to change without notice. We reserve the right to:
              </p>
              <ul className="list-disc list-inside text-white/90 space-y-2 mb-4 ml-4">
                <li>Limit quantities available for purchase</li>
                <li>Discontinue products at any time</li>
                <li>Modify product offerings and pricing</li>
                <li>Refuse or cancel orders due to stock availability</li>
              </ul>
            </section>

            {/* Ordering and Delivery */}
            <section className="mb-8">
              <h2 className="text-2xl font-display text-gold mb-4">4. Ordering and Delivery</h2>

              <h3 className="text-xl text-gold/90 mb-3 mt-6">4.1 Order Process</h3>
              <p className="text-white/90 leading-relaxed mb-4">
                When you place an order:
              </p>
              <ul className="list-disc list-inside text-white/90 space-y-2 mb-4 ml-4">
                <li>You make an offer to purchase products at the listed price</li>
                <li>We send an order confirmation email (this is not acceptance)</li>
                <li>We accept your order when we begin preparing it for delivery</li>
                <li>A contract is formed when we accept your order</li>
                <li>We reserve the right to refuse or cancel orders for any reason</li>
              </ul>

              <h3 className="text-xl text-gold/90 mb-3 mt-6">4.2 Delivery Requirements</h3>
              <p className="text-white/90 leading-relaxed mb-4">
                For successful delivery, you must:
              </p>
              <ul className="list-disc list-inside text-white/90 space-y-2 mb-4 ml-4">
                <li>Provide a valid delivery address within our service area</li>
                <li>Be present at the delivery address to receive the order</li>
                <li>Present valid government-issued photo ID proving you are 21+</li>
                <li>Ensure someone 21+ is available to receive delivery (ID required)</li>
                <li>Not request delivery to public places, businesses, or restricted areas</li>
              </ul>

              <h3 className="text-xl text-gold/90 mb-3 mt-6">4.3 Delivery Fees and Times</h3>
              <p className="text-white/90 leading-relaxed mb-4">
                Delivery fees vary by location and are displayed at checkout. Estimated delivery times are approximate and not guaranteed. Delays may occur due to:
              </p>
              <ul className="list-disc list-inside text-white/90 space-y-2 mb-4 ml-4">
                <li>High order volume</li>
                <li>Weather conditions</li>
                <li>Traffic or road conditions</li>
                <li>Address verification issues</li>
              </ul>

              <h3 className="text-xl text-gold/90 mb-3 mt-6">4.4 Failed Deliveries</h3>
              <p className="text-white/90 leading-relaxed mb-4">
                If delivery cannot be completed due to:
              </p>
              <ul className="list-disc list-inside text-white/90 space-y-2 mb-4 ml-4">
                <li>No one 21+ available to receive order</li>
                <li>Invalid or missing ID</li>
                <li>Recipient appears intoxicated</li>
                <li>Unsafe delivery conditions</li>
                <li>Incorrect or inaccessible address</li>
              </ul>
              <p className="text-white/90 leading-relaxed mb-4">
                Your order will be cancelled, you will not receive a refund, and a delivery fee may still apply.
              </p>

              <h3 className="text-xl text-gold/90 mb-3 mt-6">4.5 Order Modifications and Cancellations</h3>
              <p className="text-white/90 leading-relaxed mb-4">
                You may cancel or modify orders before they are prepared for delivery. Contact us immediately at <a href="tel:612-930-1390" className="text-gold hover:text-gold-400">612-930-1390</a>. Once an order is being prepared or out for delivery, it cannot be cancelled or modified.
              </p>
            </section>

            {/* Pricing and Payment */}
            <section className="mb-8">
              <h2 className="text-2xl font-display text-gold mb-4">5. Pricing and Payment</h2>

              <h3 className="text-xl text-gold/90 mb-3 mt-6">5.1 Pricing</h3>
              <p className="text-white/90 leading-relaxed mb-4">
                All prices are in U.S. Dollars and include:
              </p>
              <ul className="list-disc list-inside text-white/90 space-y-2 mb-4 ml-4">
                <li>Product price</li>
                <li>Minnesota sales tax (6.875%)</li>
                <li>Cannabis excise tax (10%)</li>
                <li>Delivery fee (varies by zone)</li>
                <li>Optional tip for driver</li>
              </ul>
              <p className="text-white/90 leading-relaxed mb-4">
                Prices are subject to change without notice. The price charged will be the price displayed at checkout.
              </p>

              <h3 className="text-xl text-gold/90 mb-3 mt-6">5.2 Payment Methods</h3>
              <p className="text-white/90 leading-relaxed mb-4">
                We accept:
              </p>
              <ul className="list-disc list-inside text-white/90 space-y-2 mb-4 ml-4">
                <li>Cash on delivery</li>
                <li>Debit cards</li>
                <li>Credit cards (where permitted by processor)</li>
                <li>Digital payment methods (where available)</li>
              </ul>
              <p className="text-white/90 leading-relaxed mb-4">
                Payment is due at the time of delivery. You authorize us to charge your payment method for the total amount including all fees and taxes.
              </p>

              <h3 className="text-xl text-gold/90 mb-3 mt-6">5.3 Promotional Codes</h3>
              <p className="text-white/90 leading-relaxed mb-4">
                Promotional codes and discounts:
              </p>
              <ul className="list-disc list-inside text-white/90 space-y-2 mb-4 ml-4">
                <li>Must be applied at checkout before order completion</li>
                <li>Cannot be combined with other offers unless specified</li>
                <li>May have expiration dates and usage limits</li>
                <li>Are subject to terms and conditions specific to each promotion</li>
                <li>Cannot be redeemed for cash</li>
              </ul>

              <h3 className="text-xl text-gold/90 mb-3 mt-6">5.4 Taxes</h3>
              <p className="text-white/90 leading-relaxed mb-4">
                You are responsible for all applicable taxes. We collect and remit Minnesota sales tax and cannabis excise tax as required by law. Tax rates are subject to change based on state and local regulations.
              </p>
            </section>

            {/* Returns and Refunds */}
            <section className="mb-8">
              <h2 className="text-2xl font-display text-gold mb-4">6. Returns and Refunds</h2>

              <h3 className="text-xl text-gold/90 mb-3 mt-6">6.1 No Returns Policy</h3>
              <p className="text-white/90 leading-relaxed mb-4">
                Due to the nature of cannabis products and health and safety regulations, <strong>all sales are final</strong>. We cannot accept returns or exchanges of cannabis products once delivered.
              </p>

              <h3 className="text-xl text-gold/90 mb-3 mt-6">6.2 Damaged or Incorrect Orders</h3>
              <p className="text-white/90 leading-relaxed mb-4">
                If your order arrives damaged or incorrect:
              </p>
              <ul className="list-disc list-inside text-white/90 space-y-2 mb-4 ml-4">
                <li>Inspect your order immediately upon delivery</li>
                <li>Report issues to the driver before they leave</li>
                <li>Contact customer support within 24 hours at <a href="tel:612-930-1390" className="text-gold hover:text-gold-400">612-930-1390</a></li>
                <li>Provide photos of damaged products or packaging</li>
              </ul>
              <p className="text-white/90 leading-relaxed mb-4">
                We will review your claim and may offer a replacement, credit, or refund at our discretion.
              </p>

              <h3 className="text-xl text-gold/90 mb-3 mt-6">6.3 Refund Processing</h3>
              <p className="text-white/90 leading-relaxed mb-4">
                Approved refunds will be processed to the original payment method within 5-10 business days. Delivery fees are non-refundable unless the error was on our part.
              </p>
            </section>

            {/* User Conduct */}
            <section className="mb-8">
              <h2 className="text-2xl font-display text-gold mb-4">7. User Conduct and Prohibited Activities</h2>

              <h3 className="text-xl text-gold/90 mb-3 mt-6">7.1 Acceptable Use</h3>
              <p className="text-white/90 leading-relaxed mb-4">
                You agree to use our Services only for lawful purposes and in accordance with these Terms. You agree NOT to:
              </p>
              <ul className="list-disc list-inside text-white/90 space-y-2 mb-4 ml-4">
                <li>Violate any local, state, or federal laws</li>
                <li>Provide false or misleading information</li>
                <li>Use our Services if you are under 21 years of age</li>
                <li>Resell or distribute products purchased from us</li>
                <li>Purchase products for anyone under 21</li>
                <li>Use our Services while intoxicated</li>
                <li>Harass, threaten, or abuse our staff or delivery drivers</li>
                <li>Attempt to circumvent purchase limits or age verification</li>
                <li>Use automated tools (bots, scrapers) to access our Services</li>
                <li>Reverse engineer or attempt to extract source code</li>
              </ul>

              <h3 className="text-xl text-gold/90 mb-3 mt-6">7.2 Account Suspension and Termination</h3>
              <p className="text-white/90 leading-relaxed mb-4">
                We reserve the right to suspend or terminate your account and refuse service if you:
              </p>
              <ul className="list-disc list-inside text-white/90 space-y-2 mb-4 ml-4">
                <li>Violate these Terms</li>
                <li>Engage in fraudulent activity</li>
                <li>Provide false information</li>
                <li>Abuse our staff or delivery personnel</li>
                <li>Repeatedly fail to complete deliveries</li>
                <li>Engage in conduct we deem inappropriate or harmful</li>
              </ul>
            </section>

            {/* Intellectual Property */}
            <section className="mb-8">
              <h2 className="text-2xl font-display text-gold mb-4">8. Intellectual Property</h2>

              <h3 className="text-xl text-gold/90 mb-3 mt-6">8.1 Our Content</h3>
              <p className="text-white/90 leading-relaxed mb-4">
                All content on our Services, including text, graphics, logos, images, software, and design, is owned by or licensed to Viral Ventures LLC and protected by copyright, trademark, and other intellectual property laws.
              </p>

              <h3 className="text-xl text-gold/90 mb-3 mt-6">8.2 Limited License</h3>
              <p className="text-white/90 leading-relaxed mb-4">
                We grant you a limited, non-exclusive, non-transferable license to access and use our Services for personal, non-commercial purposes. You may not:
              </p>
              <ul className="list-disc list-inside text-white/90 space-y-2 mb-4 ml-4">
                <li>Modify, copy, or distribute our content</li>
                <li>Use our trademarks or branding without permission</li>
                <li>Create derivative works</li>
                <li>Use our content for commercial purposes</li>
              </ul>

              <h3 className="text-xl text-gold/90 mb-3 mt-6">8.3 User Content</h3>
              <p className="text-white/90 leading-relaxed mb-4">
                If you submit reviews, feedback, or other content to our Services, you grant us a worldwide, royalty-free, perpetual license to use, modify, and display that content. You represent that you own or have rights to any content you submit.
              </p>
            </section>

            {/* Disclaimers */}
            <section className="mb-8">
              <h2 className="text-2xl font-display text-gold mb-4">9. Disclaimers and Warnings</h2>

              <h3 className="text-xl text-gold/90 mb-3 mt-6">9.1 Health and Safety Warnings</h3>
              <div className="bg-red-900/20 border border-red-500/50 rounded-lg p-4 mb-4">
                <p className="text-white font-semibold mb-2">⚠️ IMPORTANT HEALTH AND SAFETY INFORMATION</p>
                <ul className="list-disc list-inside text-white/90 space-y-2 ml-4">
                  <li>Cannabis products contain THC and can impair your ability to drive or operate machinery</li>
                  <li>Do not use cannabis products if you are pregnant or breastfeeding</li>
                  <li>Cannabis use may increase heart rate and affect blood pressure</li>
                  <li>Cannabis products can be psychoactive and may cause anxiety or paranoia in some users</li>
                  <li>Keep all cannabis products away from children and pets</li>
                  <li>Cannabis products may interact with medications - consult your doctor</li>
                  <li>Edibles can take 30 minutes to 2 hours to take effect - start with low doses</li>
                  <li>Do not drive or operate machinery while using cannabis products</li>
                </ul>
              </div>

              <h3 className="text-xl text-gold/90 mb-3 mt-6">9.2 Legal Disclaimer</h3>
              <p className="text-white/90 leading-relaxed mb-4">
                Cannabis remains illegal under federal law. Our products are only legal under Minnesota state law. You assume all legal risk for possessing and using cannabis products. We are not responsible for:
              </p>
              <ul className="list-disc list-inside text-white/90 space-y-2 mb-4 ml-4">
                <li>Federal prosecution or enforcement actions</li>
                <li>Drug testing failures (employment, legal, athletic)</li>
                <li>Travel with cannabis products across state lines (illegal)</li>
                <li>Use of products outside Minnesota</li>
              </ul>

              <h3 className="text-xl text-gold/90 mb-3 mt-6">9.3 Service Disclaimer</h3>
              <p className="text-white/90 leading-relaxed mb-4">
                OUR SERVICES ARE PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTIES OF ANY KIND, EXPRESS OR IMPLIED. WE DISCLAIM ALL WARRANTIES INCLUDING:
              </p>
              <ul className="list-disc list-inside text-white/90 space-y-2 mb-4 ml-4">
                <li>Merchantability and fitness for a particular purpose</li>
                <li>Accuracy, reliability, or completeness of content</li>
                <li>Uninterrupted or error-free operation</li>
                <li>Security or freedom from viruses</li>
              </ul>
            </section>

            {/* Limitation of Liability */}
            <section className="mb-8">
              <h2 className="text-2xl font-display text-gold mb-4">10. Limitation of Liability</h2>
              <p className="text-white/90 leading-relaxed mb-4">
                TO THE MAXIMUM EXTENT PERMITTED BY LAW, VIRAL VENTURES LLC, ITS OFFICERS, DIRECTORS, EMPLOYEES, AND AGENTS SHALL NOT BE LIABLE FOR:
              </p>
              <ul className="list-disc list-inside text-white/90 space-y-2 mb-4 ml-4">
                <li>Indirect, incidental, special, consequential, or punitive damages</li>
                <li>Loss of profits, revenue, data, or business opportunities</li>
                <li>Personal injury or property damage from product use</li>
                <li>Adverse health effects from cannabis use</li>
                <li>Legal consequences of cannabis possession or use</li>
                <li>Delivery delays or service interruptions</li>
              </ul>
              <p className="text-white/90 leading-relaxed mb-4">
                OUR TOTAL LIABILITY SHALL NOT EXCEED THE AMOUNT YOU PAID FOR THE SPECIFIC ORDER GIVING RISE TO THE CLAIM, OR $100, WHICHEVER IS LESS.
              </p>
              <p className="text-white/90 leading-relaxed mb-4">
                Some jurisdictions do not allow limitation of certain damages, so some limitations may not apply to you.
              </p>
            </section>

            {/* Indemnification */}
            <section className="mb-8">
              <h2 className="text-2xl font-display text-gold mb-4">11. Indemnification</h2>
              <p className="text-white/90 leading-relaxed mb-4">
                You agree to indemnify, defend, and hold harmless Viral Ventures LLC, its affiliates, officers, directors, employees, and agents from any claims, damages, losses, liabilities, and expenses (including legal fees) arising from:
              </p>
              <ul className="list-disc list-inside text-white/90 space-y-2 mb-4 ml-4">
                <li>Your use of our Services</li>
                <li>Your violation of these Terms</li>
                <li>Your violation of any laws or regulations</li>
                <li>Your violation of third-party rights</li>
                <li>Any content you submit to our Services</li>
              </ul>
            </section>

            {/* Dispute Resolution */}
            <section className="mb-8">
              <h2 className="text-2xl font-display text-gold mb-4">12. Dispute Resolution and Arbitration</h2>

              <h3 className="text-xl text-gold/90 mb-3 mt-6">12.1 Informal Resolution</h3>
              <p className="text-white/90 leading-relaxed mb-4">
                Before filing a claim, you agree to contact us at <a href="mailto:support@dankdealsmn.com" className="text-gold hover:text-gold-400">support@dankdealsmn.com</a> and attempt to resolve the dispute informally. We will attempt to resolve disputes within 30 days.
              </p>

              <h3 className="text-xl text-gold/90 mb-3 mt-6">12.2 Binding Arbitration</h3>
              <p className="text-white/90 leading-relaxed mb-4">
                If informal resolution fails, disputes will be resolved through binding arbitration in accordance with the American Arbitration Association (AAA) rules. Arbitration will take place in Minneapolis, Minnesota.
              </p>

              <h3 className="text-xl text-gold/90 mb-3 mt-6">12.3 Class Action Waiver</h3>
              <p className="text-white/90 leading-relaxed mb-4">
                YOU AGREE TO RESOLVE DISPUTES ON AN INDIVIDUAL BASIS ONLY. YOU WAIVE ANY RIGHT TO PARTICIPATE IN CLASS ACTIONS, CLASS ARBITRATIONS, OR REPRESENTATIVE ACTIONS.
              </p>

              <h3 className="text-xl text-gold/90 mb-3 mt-6">12.4 Exceptions</h3>
              <p className="text-white/90 leading-relaxed mb-4">
                Either party may seek injunctive or equitable relief in court for intellectual property infringement or unauthorized access to our Services.
              </p>
            </section>

            {/* Governing Law */}
            <section className="mb-8">
              <h2 className="text-2xl font-display text-gold mb-4">13. Governing Law and Jurisdiction</h2>
              <p className="text-white/90 leading-relaxed mb-4">
                These Terms are governed by the laws of the State of Minnesota, without regard to conflict of law principles. Any disputes not subject to arbitration shall be brought exclusively in state or federal courts located in Hennepin County, Minnesota.
              </p>
            </section>

            {/* Severability */}
            <section className="mb-8">
              <h2 className="text-2xl font-display text-gold mb-4">14. Severability and Waiver</h2>
              <p className="text-white/90 leading-relaxed mb-4">
                If any provision of these Terms is found to be unenforceable, the remaining provisions will remain in full effect. Our failure to enforce any right or provision does not constitute a waiver of that right or provision.
              </p>
            </section>

            {/* Changes to Terms */}
            <section className="mb-8">
              <h2 className="text-2xl font-display text-gold mb-4">15. Changes to Terms</h2>
              <p className="text-white/90 leading-relaxed mb-4">
                We reserve the right to modify these Terms at any time. Changes will be effective when posted on our website with an updated "Last Updated" date. Material changes will be communicated via email.
              </p>
              <p className="text-white/90 leading-relaxed mb-4">
                Your continued use of our Services after changes constitutes acceptance of the modified Terms. If you do not agree to changes, you must stop using our Services.
              </p>
            </section>

            {/* Contact */}
            <section className="mb-8">
              <h2 className="text-2xl font-display text-gold mb-4">16. Contact Information</h2>
              <p className="text-white/90 leading-relaxed mb-4">
                Questions about these Terms? Contact us:
              </p>
              <div className="bg-navy-700 border border-gold/20 rounded-lg p-6 mb-4">
                <p className="text-white/90 mb-2"><strong className="text-gold">Viral Ventures LLC</strong></p>
                <p className="text-white/90 mb-2"><strong>Attn:</strong> Legal Department</p>
                <p className="text-white/90 mb-2">PO Box 27322</p>
                <p className="text-white/90 mb-2">Minneapolis, MN 55427</p>
                <p className="text-white/90 mb-2">
                  <strong>Phone:</strong> <a href="tel:612-930-1390" className="text-gold hover:text-gold-400">612-930-1390</a>
                </p>
                <p className="text-white/90 mb-2">
                  <strong>Email:</strong> <a href="mailto:support@dankdealsmn.com" className="text-gold hover:text-gold-400">support@dankdealsmn.com</a>
                </p>
                <p className="text-white/90">
                  <strong>Website:</strong> <a href="https://dankdealsmn.com" className="text-gold hover:text-gold-400">dankdealsmn.com</a>
                </p>
              </div>
            </section>

            {/* Entire Agreement */}
            <section className="mb-8">
              <h2 className="text-2xl font-display text-gold mb-4">17. Entire Agreement</h2>
              <p className="text-white/90 leading-relaxed mb-4">
                These Terms, together with our <Link href="/privacy" className="text-gold hover:text-gold-400 underline">Privacy Policy</Link>, constitute the entire agreement between you and Viral Ventures LLC regarding our Services and supersede all prior agreements and understandings.
              </p>
            </section>

            {/* Acknowledgment */}
            <section className="mb-8">
              <div className="bg-gold/10 border border-gold/30 rounded-lg p-6">
                <h2 className="text-2xl font-display text-gold mb-4">Acknowledgment</h2>
                <p className="text-white/90 leading-relaxed mb-4">
                  BY USING OUR SERVICES, YOU ACKNOWLEDGE THAT:
                </p>
                <ul className="list-disc list-inside text-white/90 space-y-2 ml-4">
                  <li>You have read and understood these Terms of Service</li>
                  <li>You agree to be bound by these Terms</li>
                  <li>You are at least 21 years of age</li>
                  <li>You understand the health risks and legal status of cannabis</li>
                  <li>You will comply with all applicable laws and regulations</li>
                  <li>You accept the limitations of liability and dispute resolution terms</li>
                </ul>
              </div>
            </section>
          </div>

          {/* Footer Navigation */}
          <div className="mt-12 pt-8 border-t border-gold/20">
            <div className="flex flex-wrap gap-4 justify-center">
              <Link href="/" className="text-gold hover:text-gold-400 transition-colors">
                Home
              </Link>
              <span className="text-gold/30">•</span>
              <Link href="/privacy" className="text-gold hover:text-gold-400 transition-colors">
                Privacy Policy
              </Link>
              <span className="text-gold/30">•</span>
              <Link href="/products" className="text-gold hover:text-gold-400 transition-colors">
                Shop Products
              </Link>
              <span className="text-gold/30">•</span>
              <a href="mailto:support@dankdealsmn.com" className="text-gold hover:text-gold-400 transition-colors">
                Contact Support
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
