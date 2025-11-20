import React from 'react';
import { Link } from 'react-router-dom';

const TermsOfService = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <main className="pt-10 pb-3 flex-grow">
        <div className="container mx-auto px-4 py-12">
          <h1 className="font-serif text-4xl md:text-5xl font-bold text-primary mb-4">
            Terms & Conditions
          </h1>
          <p className="text-muted-foreground mb-8">
            Last updated: October 25, 2025
          </p>

          <div className="prose prose-lg max-w-none space-y-6 text-muted-foreground">
            <p>
              Please read these Terms and Conditions ("Terms") carefully before using the SaanJ website
              (the "Service") operated by SaanJ ("us", "we", or "our").
            </p>
            <p>
              Your access to and use of the Service is conditioned on your acceptance of and compliance with
              these Terms. These Terms apply to all visitors, users, and others who access or use the Service.
              By accessing or using the Service, you agree to be bound by these Terms.
            </p>

            <h2 className="font-serif text-2xl font-semibold text-primary pt-4">1. Accounts</h2>
            <p>
              When you create an account with us, you must provide accurate and complete information at all times.
              We use Google Authentication for account creation. You are responsible for safeguarding the Google
              account that you use to access the Service and for any activities or actions under your account.
            </p>

            <h2 className="font-serif text-2xl font-semibold text-primary pt-4">2. Products and Orders</h2>
            <p>
              We make every effort to display as accurately as possible the colors and images of our
              products. However, we cannot guarantee that your device’s display of any color will be accurate.
            </p>
            <p>
              Once an order is placed and confirmed, it cannot be cancelled, modified, or refunded under any circumstances.  
              Please review your order carefully before completing your purchase.
            </p>
            <p>
              All sales made through SaanJ are final. We do not offer returns, exchanges, or refunds for any reason,
              including dissatisfaction, incorrect size selection, or change of mind.
            </p>
            <p>
              We reserve the right to refuse or cancel an order only in exceptional cases such as suspected fraud
              or inventory unavailability. In such cases, we will notify you by email.
            </p>

            <h2 className="font-serif text-2xl font-semibold text-primary pt-4">3. Payments</h2>
            <p>
              All payments are securely processed through Razorpay. We do not collect or store your payment
              card details. That information is provided directly to Razorpay, whose use of your personal
              information is governed by their Privacy Policy.
            </p>

            <h2 className="font-serif text-2xl font-semibold text-primary pt-4">4. Shipping Policy</h2>
            <p>
              Orders are shipped to the address provided during checkout. Delivery timelines are estimates
              and may vary based on location and courier availability. We are not responsible for delays
              caused by third-party logistics partners or factors beyond our control.
            </p>

            <h2 className="font-serif text-2xl font-semibold text-primary pt-4">5. Returns, Refunds & Cancellations</h2>
            <p>
              No returns, no refunds, and no order cancellations are accepted once an order has been placed.
              This policy is strictly enforced to maintain product quality and order integrity.
            </p>
            <p>
              Please ensure you review all product details, descriptions, and sizing information before placing your order.
            </p>

            <h2 className="font-serif text-2xl font-semibold text-primary pt-4">6. Intellectual Property</h2>
            <p>
              The Service and all original content, including text, graphics, logos, and images, are and will
              remain the exclusive property of SaanJ and its licensors. Unauthorized use or reproduction
              of our intellectual property is strictly prohibited.
            </p>

            <h2 className="font-serif text-2xl font-semibold text-primary pt-4">7. Limitation of Liability</h2>
            <p>
              In no event shall SaanJ, its directors, employees, partners, or affiliates be liable
              for any indirect, incidental, special, or consequential damages, including loss of profits,
              data, or goodwill, resulting from your use of the Service or purchase of any products.
            </p>

            <h2 className="font-serif text-2xl font-semibold text-primary pt-4">8. Governing Law</h2>
            <p>
              These Terms shall be governed and construed in accordance with the laws of India,
              without regard to its conflict of law provisions. Any disputes shall be subject to the
              exclusive jurisdiction of the courts in [Your City, India].
            </p>

            <h2 className="font-serif text-2xl font-semibold text-primary pt-4">9. Changes to Terms</h2>
            <p>
              We may update or modify these Terms at any time without prior notice. Changes will take effect
              immediately upon posting. Continued use of our Service after such updates constitutes your
              acceptance of the revised Terms.
            </p>

            <h2 className="font-serif text-2xl font-semibold text-primary pt-4">10. Contact Us</h2>
            <p>
              For any questions or concerns about these Terms, please contact us at:
              <a href="mailto:support@saanj.com" className="text-accent font-medium ml-2">
                support@saanj.com
              </a>
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default TermsOfService;
