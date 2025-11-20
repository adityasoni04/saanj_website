import React from 'react';
import { Link } from 'react-router-dom';

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <main className="pt-10 pb-3 flex-grow">
        <div className="container mx-auto px-4 py-12">
          <h1 className="font-serif text-4xl md:text-5xl font-bold text-primary mb-4">
            Privacy Policy
          </h1>
          <p className="text-muted-foreground mb-8">
            Last updated: October 25, 2025
          </p>

          <div className="prose prose-lg max-w-none space-y-6 text-muted-foreground">
            <p>
              SaanJ ("us", "we", or "our") operates the SaanJ website (the "Service").
              This page informs you of our policies regarding the collection, use, and disclosure of
              personal information when you use our Service.
            </p>

            <h2 className="font-serif text-2xl font-semibold text-primary pt-4">1. Information We Collect</h2>
            <p>We collect several types of information for various purposes to provide and improve our Service to you.</p>
            
            <h3 className="font-serif text-xl font-semibold text-primary pt-2">A. Information You Provide</h3>
            <ul className="list-disc list-inside space-y-1">
              <li>
                Account Information: When you register an account using Google, we
                receive your name, email address, and profile picture from Google.
              </li>
              <li>
                Order Information: When you place an order, we collect information
                necessary to process it, such as your shipping address and phone number.
              </li>
              <li>
                Cart & Wishlist: We store information about the items you add to your
                cart and wishlist, linking them to your account if you are logged in.
              </li>
            </ul>

            <h3 className="font-serif text-xl font-semibold text-primary pt-2">B. Payment Information</h3>
            <p>
              We do not collect or store your financial information such as credit or debit card numbers. 
              All payments are processed securely by our third-party payment processor, Razorpay. 
              We only receive a confirmation of your payment.
            </p>
            
            <h3 className="font-serif text-xl font-semibold text-primary pt-2">C. Usage Data</h3>
            <p>
              We may also collect information on how the Service is accessed and used ("Usage Data").
              This may include information such as your device’s IP address, browser type,
              browser version, pages visited, time spent, and other diagnostic data.
            </p>

            <h2 className="font-serif text-2xl font-semibold text-primary pt-4">2. How We Use Your Information</h2>
            <p>We use the collected data for various purposes:</p>
            <ul className="list-disc list-inside space-y-1">
              <li>To provide and maintain our Service</li>
              <li>To manage your account</li>
              <li>To process your orders and manage your cart and wishlist</li>
              <li>To notify you about changes to our Service</li>
              <li>To provide customer support</li>
              <li>To monitor and improve the performance of our Service</li>
            </ul>

            <h2 className="font-serif text-2xl font-semibold text-primary pt-4">3. How We Share Your Information</h2>
            <p>We do not sell your personal information. We may share it in the following limited circumstances:</p>
            <ul className="list-disc list-inside space-y-1">
              <li>
                Service Providers: With third-party companies that perform services on our
                behalf, such as payment processing (Razorpay) and order fulfillment (shipping carriers).
              </li>
              <li>
                For Legal Reasons: If required by law or to respond to valid requests
                by public authorities.
              </li>
            </ul>

            <h2 className="font-serif text-2xl font-semibold text-primary pt-4">4. Data Security</h2>
            <p>
              The security of your data is important to us. We use secure (HTTPS) connections and take
              reasonable measures to protect your personal information. However, please note that no
              method of transmission over the Internet or electronic storage is completely secure.
            </p>

            <h2 className="font-serif text-2xl font-semibold text-primary pt-4">5. Your Data Rights</h2>
            <p>
              Depending on your location, you may have certain rights regarding your personal information,
              such as the right to access, update, or delete the information we have on you. You can
              manage your account information through your profile page or by contacting us.
            </p>

            <h2 className="font-serif text-2xl font-semibold text-primary pt-4">6. Changes to This Policy</h2>
            <p>
              We may update our Privacy Policy from time to time. Any changes will be posted on this page
              with an updated revision date. Continued use of our Service after changes are made will
              indicate your acceptance of the updated policy.
            </p>

            <h2 className="font-serif text-2xl font-semibold text-primary pt-4">7. Contact Us</h2>
            <p>
              If you have any questions about this Privacy Policy, please contact us at:
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

export default PrivacyPolicy;
