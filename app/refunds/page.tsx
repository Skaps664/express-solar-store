"use client"

export default function RefundPolicy() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-[#1a5ca4] mb-6">Refund Policy</h1>
          <p className="text-gray-600 mb-8">Last Updated: July 25, 2025</p>
          
          <div className="prose prose-lg max-w-none">
            <p className="text-gray-700 mb-6">
              At SolarExpress.pk, we strive to ensure complete customer satisfaction. This comprehensive 
              refund policy outlines the circumstances under which refunds are processed and the procedures 
              involved.
            </p>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-[#1a5ca4] mb-4">1. Refund Eligibility</h2>
              
              <h3 className="text-xl font-semibold text-gray-800 mb-3">Standard Refund Conditions</h3>
              <div className="bg-blue-50 border-l-4 border-[#1a5ca4] p-4 mb-4">
                <p className="text-gray-700">
                  <strong>7-day refund window</strong> from delivery date with a 10% restocking fee for non-faulty items.
                </p>
              </div>
              
              <ul className="list-disc list-inside text-gray-700 mb-6 ml-4">
                <li>Item must be in original, unused condition</li>
                <li>Original packaging and all accessories included</li>
                <li>No installation or modification attempts</li>
                <li>Valid proof of purchase required</li>
                <li>Return authorization obtained from our team</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-800 mb-3">Immediate Refund Conditions</h3>
              <p className="text-gray-700 mb-4">Full refund without restocking fee for:</p>
              <ul className="list-disc list-inside text-gray-700 mb-4 ml-4">
                <li>Damaged items received</li>
                <li>Wrong products delivered</li>
                <li>Manufacturing defects discovered within 7 days</li>
                <li>Significantly different specifications than advertised</li>
                <li>Missing components or accessories</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-[#1a5ca4] mb-4">2. Refund Process & Timeline</h2>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-gray-50 p-6 rounded-lg">
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">Step-by-Step Process</h3>
                  <ol className="list-decimal list-inside text-gray-700 space-y-2">
                    <li>Contact customer service</li>
                    <li>Receive return authorization</li>
                    <li>Package and ship item</li>
                    <li>Quality inspection by our team</li>
                    <li>Refund approval and processing</li>
                    <li>Refund completion notification</li>
                  </ol>
                </div>
                
                <div className="bg-gray-50 p-6 rounded-lg">
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">Processing Timeline</h3>
                  <ul className="text-gray-700 space-y-2">
                    <li><strong>Request Response:</strong> 24 hours</li>
                    <li><strong>Return Authorization:</strong> 1-2 days</li>
                    <li><strong>Inspection:</strong> 2-3 days</li>
                    <li><strong>Refund Processing:</strong> 3-7 days</li>
                    <li><strong>Bank Transfer:</strong> 1-5 days</li>
                  </ul>
                </div>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-[#1a5ca4] mb-4">3. Refund Methods</h2>
              
              <div className="space-y-4">
                <div className="border border-gray-200 rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">💳 Credit/Debit Cards</h3>
                  <p className="text-gray-700">Refund to original payment method within 5-10 business days</p>
                </div>
                
                <div className="border border-gray-200 rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">📱 Mobile Wallets (JazzCash/Easypaisa)</h3>
                  <p className="text-gray-700">Direct refund to original account within 3-5 business days</p>
                </div>
                
                <div className="border border-gray-200 rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">🏦 Bank Transfer</h3>
                  <p className="text-gray-700">For COD orders or special cases, requires bank account details</p>
                </div>
                
                <div className="border border-gray-200 rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">💰 Cash on Delivery (COD) Orders</h3>
                  <p className="text-gray-700">Bank transfer after providing account details and verification</p>
                </div>

                <div className="bg-gray-50 border rounded-lg p-4">
                  <p className="font-semibold">Bank Details for Transfers</p>
                  <p className="text-sm">Account Title: <strong>Solar Express LLP</strong></p>
                  <p className="text-sm">Account Number: <strong>6-4-54-20311-714-130309</strong></p>
                  <p className="text-sm">IBAN: <strong>PK24MPBL0454027140130309</strong></p>
                </div>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-[#1a5ca4] mb-4">4. Partial Refunds</h2>
              <p className="text-gray-700 mb-4">Partial refunds may apply in the following situations:</p>
              
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <ul className="list-disc list-inside text-gray-700 space-y-2">
                  <li><strong>Restocking Fee (10%):</strong> For non-faulty returns of unused items</li>
                  <li><strong>Return Shipping:</strong> Customer bears cost unless item was faulty</li>
                  <li><strong>Used Items:</strong> Depreciated value based on usage and condition</li>
                  <li><strong>Missing Accessories:</strong> Cost of missing items deducted</li>
                  <li><strong>Damaged Packaging:</strong> If original packaging is significantly damaged</li>
                </ul>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-[#1a5ca4] mb-4">5. Non-Refundable Items</h2>
              
              <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-red-800 mb-3">Items Not Eligible for Refund:</h3>
                <ul className="list-disc list-inside text-red-700 space-y-1">
                  <li>Custom-made or personalized products</li>
                  <li>Software licenses and digital products</li>
                  <li>Consumable items (batteries after first use)</li>
                  <li>Items marked as "Final Sale" or "Clearance"</li>
                  <li>Products damaged by customer misuse</li>
                  <li>Items returned without authorization</li>
                  <li>Products returned after 7-day window</li>
                  <li>Professional installation services (unless service failure)</li>
                </ul>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-[#1a5ca4] mb-4">6. International Orders</h2>
              <p className="text-gray-700 mb-4">
                For international customers, additional considerations apply:
              </p>
              <ul className="list-disc list-inside text-gray-700 mb-4 ml-4">
                <li>Customer responsible for return shipping costs and customs duties</li>
                <li>Extended processing time due to international logistics</li>
                <li>Currency conversion rates at the time of refund processing</li>
                <li>Compliance with destination country regulations</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-[#1a5ca4] mb-4">7. Bulk Order Refunds</h2>
              <p className="text-gray-700 mb-4">
                For bulk orders (10+ units or orders above PKR 500,000):
              </p>
              <ul className="list-disc list-inside text-gray-700 mb-4 ml-4">
                <li>Special refund terms may apply</li>
                <li>Consultation with account manager required</li>
                <li>Possible negotiation of refund percentage</li>
                <li>Extended inspection period for quality verification</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-[#1a5ca4] mb-4">8. Dispute Resolution</h2>
              <p className="text-gray-700 mb-4">
                If you disagree with our refund decision:
              </p>
              <ol className="list-decimal list-inside text-gray-700 mb-4 ml-4">
                <li>Contact our customer service manager</li>
                <li>Provide additional documentation if required</li>
                <li>Request escalation to senior management</li>
                <li>Utilize third-party mediation if necessary</li>
                <li>Legal recourse as per Pakistani consumer protection laws</li>
              </ol>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-[#1a5ca4] mb-4">9. Refund Tracking</h2>
              <p className="text-gray-700 mb-4">
                Stay updated on your refund status:
              </p>
              <ul className="list-disc list-inside text-gray-700 mb-4 ml-4">
                <li>Email notifications at each stage</li>
                <li>SMS updates for status changes</li>
                <li>Reference number for tracking</li>
                <li>Customer portal access for real-time status</li>
                <li>Direct contact with refund processing team</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-[#1a5ca4] mb-4">10. Contact Information</h2>
              <p className="text-gray-700 mb-4">
                For refund-related queries and assistance:
              </p>
              <div className="bg-gray-50 p-6 rounded-lg">
                <p className="text-gray-700 font-semibold mb-2">Refund Support Team</p>
                <p className="text-gray-700">SolarExpress.pk (Private) Limited</p>
                <p className="text-gray-700">Office #24, 2nd Floor, Johar Business Center</p>
                <p className="text-gray-700">Main University Road, Karachi, Pakistan</p>
                <p className="text-gray-700 mt-2">📞 Refund Hotline: +92 333 0505000</p>
                <p className="text-gray-700">✉️ refunds@solarexpress.pk</p>
                <p className="text-gray-700">💬 WhatsApp: +92 333 0505000</p>
                <p className="text-gray-700">⏰ Support Hours: 9 AM - 6 PM (Monday to Saturday)</p>
              </div>
            </section>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mt-8">
              <h3 className="text-lg font-semibold text-blue-800 mb-2">📋 Important Reminder</h3>
              <p className="text-blue-700">
                This refund policy works in conjunction with our Return & Exchange Policy and Terms of Service. 
                For complete protection and understanding of your rights, please review all policies. 
                We reserve the right to modify this policy with appropriate notice to customers.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
