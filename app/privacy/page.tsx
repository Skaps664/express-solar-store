"use client"

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-[#1a5ca4] mb-6">Privacy Policy</h1>
          <p className="text-gray-600 mb-8">Last Updated: July 25, 2025</p>
          
          <div className="prose prose-lg max-w-none">
            <p className="text-gray-700 mb-6">
              This Privacy Policy explains how Solar Express ("Site", "we", "our", or "us") collects, uses, and 
              protects your personal information when you access or use our website SolarExpress.pk (the 
              "Site") and its services (the "Services"). This policy applies whether you're browsing, placing an 
              order, or communicating with us.
            </p>
            
            <p className="text-gray-700 mb-8">
              By using our Services, you consent to the terms of this Privacy Policy. If you do not agree, 
              please discontinue use of the Site and Services.
            </p>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-[#1a5ca4] mb-4">📝 Updates to This Policy</h2>
              <p className="text-gray-700">
                We may revise this Privacy Policy periodically to reflect updates in laws, regulations, or our 
                practices. The updated version will always be posted here with the latest effective date.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-[#1a5ca4] mb-4">📊 What Information We Collect</h2>
              <p className="text-gray-700 mb-4">
                We collect personal and technical information based on your interaction with our platform:
              </p>
              
              <h3 className="text-xl font-semibold text-gray-800 mb-3">Information You Provide Directly</h3>
              <ul className="list-disc list-inside text-gray-700 mb-6 ml-4">
                <li>Contact details: Name, email, phone number, billing and shipping address</li>
                <li>Order information: Items ordered, payment status, shipping preferences</li>
                <li>Account details: Username, password, saved preferences</li>
                <li>Communication history: Customer support chats, form submissions</li>
                <li>Reviews and feedback on products and services</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-800 mb-3">Cookies and Tracking</h3>
              <p className="text-gray-700 mb-4">
                We collect anonymous data through cookies and similar tools to improve performance, such as:
              </p>
              <ul className="list-disc list-inside text-gray-700 mb-4 ml-4">
                <li>IP address and browser type</li>
                <li>Device info and location (approximate)</li>
                <li>Pages visited, cart behavior, session time</li>
                <li>Referral sources and search terms</li>
              </ul>
              <p className="text-gray-700">
                You can disable cookies in your browser settings, but doing so may affect site performance.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-[#1a5ca4] mb-4">🎯 How We Use Your Information</h2>
              <p className="text-gray-700 mb-4">Your personal information is used to:</p>
              <ul className="list-disc list-inside text-gray-700 mb-4 ml-4">
                <li>Process and fulfill orders</li>
                <li>Communicate order status and shipping details</li>
                <li>Provide customer support</li>
                <li>Show relevant product recommendations</li>
                <li>Improve website performance and UX</li>
                <li>Send promotional offers (if opted in)</li>
                <li>Detect and prevent fraud</li>
                <li>Comply with legal obligations</li>
                <li>Analyze usage patterns to enhance our services</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-[#1a5ca4] mb-4">🤝 Who We Share Information With</h2>
              <p className="text-gray-700 mb-4">
                We do not sell your information. We may share limited data only when necessary:
              </p>
              <ul className="list-disc list-inside text-gray-700 mb-4 ml-4">
                <li>Payment processors (e.g. banks, Easypaisa, JazzCash) to complete transactions</li>
                <li>Shipping partners for order delivery</li>
                <li>IT providers for site security and maintenance</li>
                <li>Marketing tools for promotions, only if consent is given</li>
                <li>Law enforcement when required under applicable law</li>
                <li>Business partners for joint promotions (with your consent)</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-[#1a5ca4] mb-4">🔗 Third-Party Services & Links</h2>
              <p className="text-gray-700">
                Our Site may include third-party services like banks, courier tracking systems, or product videos 
                hosted on YouTube. We are not responsible for the privacy practices of these external 
                platforms. Please review their respective policies.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-[#1a5ca4] mb-4">👶 Children's Privacy</h2>
              <p className="text-gray-700">
                SolarExpress.pk is not intended for children under 13 years old. We do not knowingly collect 
                data from minors. If we learn of any such data, we will delete it promptly.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-[#1a5ca4] mb-4">🔒 Data Security & Retention</h2>
              <p className="text-gray-700 mb-4">
                We apply industry-standard security protocols to protect your data including:
              </p>
              <ul className="list-disc list-inside text-gray-700 mb-4 ml-4">
                <li>SSL encryption for data transmission</li>
                <li>Secure servers with regular security updates</li>
                <li>Access controls and authentication measures</li>
                <li>Regular security audits and monitoring</li>
              </ul>
              <p className="text-gray-700 mb-4">
                However, no system is 100% secure. We retain your information only as long as needed to:
              </p>
              <ul className="list-disc list-inside text-gray-700 mb-4 ml-4">
                <li>Complete your orders</li>
                <li>Provide customer service</li>
                <li>Fulfill legal or regulatory requirements</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-[#1a5ca4] mb-4">⚖️ Your Rights & Choices</h2>
              <p className="text-gray-700 mb-4">You may:</p>
              <ul className="list-disc list-inside text-gray-700 mb-4 ml-4">
                <li>Request access to your personal data</li>
                <li>Request correction or deletion</li>
                <li>Opt-out of promotional emails anytime</li>
                <li>Request data portability (export your data)</li>
                <li>Withdraw consent for data processing</li>
                <li>File a complaint with relevant authorities</li>
              </ul>
              <p className="text-gray-700">
                To exercise any of these rights, email us at privacy@solarexpress.pk
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-[#1a5ca4] mb-4">📞 Contact Us</h2>
              <p className="text-gray-700 mb-4">
                If you have questions about our Privacy Policy or need help with your data:
              </p>
              <div className="bg-gray-50 p-6 rounded-lg">
                <p className="text-gray-700 font-semibold mb-2">Solar Express (Private) Limited</p>
                <p className="text-gray-700">Office #24, 2nd Floor, Johar Business Center</p>
                <p className="text-gray-700">Main University Road, Karachi, Pakistan</p>
                <p className="text-gray-700 mt-2">📞 +92 333 0505000</p>
                <p className="text-gray-700">✉️ privacy@solarexpress.pk</p>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  )
}
