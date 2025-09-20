"use client"

export default function ExchangePolicy() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-[#1a5ca4] mb-6">Exchange Policy</h1>
          <p className="text-gray-600 mb-8">Last Updated: July 25, 2025</p>
          
          <div className="prose prose-lg max-w-none">
            <p className="text-gray-700 mb-6">
              SolarExpress.pk offers flexible exchange options to ensure you get the right solar solution 
              for your needs. Our exchange policy is designed to provide convenience while maintaining 
              product quality and fairness for all customers.
            </p>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-[#1a5ca4] mb-4">1. Exchange Eligibility</h2>
              
              <div className="bg-green-50 border-l-4 border-green-400 p-4 mb-4">
                <p className="text-green-700 font-semibold">
                  ✅ 7-day exchange window from delivery date for unused products
                </p>
              </div>
              
              <h3 className="text-xl font-semibold text-gray-800 mb-3">Products Eligible for Exchange</h3>
              <ul className="list-disc list-inside text-gray-700 mb-6 ml-4">
                <li>Solar panels (same wattage category)</li>
                <li>Inverters (similar capacity range)</li>
                <li>Batteries (same type and capacity)</li>
                <li>Solar accessories and components</li>
                <li>Installation tools and equipment</li>
                <li>Monitoring systems and controllers</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-800 mb-3">Exchange Requirements</h3>
              <ul className="list-disc list-inside text-gray-700 mb-4 ml-4">
                <li>Product in original, unused condition</li>
                <li>All original packaging, manuals, and accessories</li>
                <li>No signs of installation or mounting attempts</li>
                <li>Protective films and seals intact</li>
                <li>Valid proof of purchase</li>
                <li>Exchange authorization from our team</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-[#1a5ca4] mb-4">2. Types of Exchanges</h2>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div className="border border-gray-200 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-[#1a5ca4] mb-3">🔄 Like-for-Like Exchange</h3>
                  <p className="text-gray-700 mb-3">Same product, different specifications:</p>
                  <ul className="list-disc list-inside text-gray-700 text-sm space-y-1">
                    <li>Same brand, different model</li>
                    <li>Same capacity, different features</li>
                    <li>Color or design variations</li>
                    <li>Updated version of same product</li>
                  </ul>
                  <p className="text-green-600 font-semibold mt-3">No exchange fee for price differences under PKR 5,000</p>
                </div>
                
                <div className="border border-gray-200 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-[#1a5ca4] mb-3">⬆️ Upgrade Exchange</h3>
                  <p className="text-gray-700 mb-3">Exchange for higher-value product:</p>
                  <ul className="list-disc list-inside text-gray-700 text-sm space-y-1">
                    <li>Pay price difference</li>
                    <li>Better specifications or features</li>
                    <li>Higher capacity or efficiency</li>
                    <li>Premium brand options</li>
                  </ul>
                  <p className="text-blue-600 font-semibold mt-3">Additional payment required for price difference</p>
                </div>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-[#1a5ca4] mb-4">3. Exchange Process</h2>
              
              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Step-by-Step Exchange Process</h3>
                <ol className="list-decimal list-inside text-gray-700 space-y-3">
                  <li><strong>Contact Request:</strong> WhatsApp +92 333 0505000 within 7 days</li>
                  <li><strong>Product Assessment:</strong> Share photos/videos of current product condition</li>
                  <li><strong>Exchange Options:</strong> Our team will present available alternatives</li>
                  <li><strong>Price Calculation:</strong> Any price differences calculated and confirmed</li>
                  <li><strong>Authorization:</strong> Receive exchange authorization number</li>
                  <li><strong>Product Return:</strong> Send original product using provided instructions</li>
                  <li><strong>Inspection:</strong> Quality check upon receipt (2-3 business days)</li>
                  <li><strong>New Product Dispatch:</strong> Replacement product shipped (3-5 business days)</li>
                  <li><strong>Delivery Confirmation:</strong> Confirmation of successful exchange</li>
                </ol>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-[#1a5ca4] mb-4">4. Exchange Fees & Costs</h2>
              
              <div className="overflow-x-auto">
                <table className="min-w-full border border-gray-200 rounded-lg">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="border border-gray-200 px-4 py-3 text-left font-semibold text-gray-800">Exchange Type</th>
                      <th className="border border-gray-200 px-4 py-3 text-left font-semibold text-gray-800">Processing Fee</th>
                      <th className="border border-gray-200 px-4 py-3 text-left font-semibold text-gray-800">Shipping Cost</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="border border-gray-200 px-4 py-3">Defective Product</td>
                      <td className="border border-gray-200 px-4 py-3 text-green-600">Free</td>
                      <td className="border border-gray-200 px-4 py-3 text-green-600">We cover both ways</td>
                    </tr>
                    <tr className="bg-gray-50">
                      <td className="border border-gray-200 px-4 py-3">Wrong Item Delivered</td>
                      <td className="border border-gray-200 px-4 py-3 text-green-600">Free</td>
                      <td className="border border-gray-200 px-4 py-3 text-green-600">We cover both ways</td>
                    </tr>
                    <tr>
                      <td className="border border-gray-200 px-4 py-3">Like-for-Like (Same Price)</td>
                      <td className="border border-gray-200 px-4 py-3">PKR 500</td>
                      <td className="border border-gray-200 px-4 py-3">Customer pays return</td>
                    </tr>
                    <tr className="bg-gray-50">
                      <td className="border border-gray-200 px-4 py-3">Upgrade Exchange</td>
                      <td className="border border-gray-200 px-4 py-3">PKR 1,000</td>
                      <td className="border border-gray-200 px-4 py-3">Customer pays return</td>
                    </tr>
                    <tr>
                      <td className="border border-gray-200 px-4 py-3">Downgrade Exchange</td>
                      <td className="border border-gray-200 px-4 py-3">PKR 1,500</td>
                      <td className="border border-gray-200 px-4 py-3">Customer pays both ways</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-[#1a5ca4] mb-4">5. Special Exchange Scenarios</h2>
              
              <div className="space-y-4">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-blue-800 mb-2">🔧 Technical Compatibility Issues</h3>
                  <p className="text-blue-700 mb-2">If purchased product doesn't work with your existing system:</p>
                  <ul className="list-disc list-inside text-blue-700 text-sm ml-4">
                    <li>Free exchange within 7 days with technical documentation</li>
                    <li>Our technical team will verify compatibility issues</li>
                    <li>Alternative product suggestions provided</li>
                  </ul>
                </div>
                
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-yellow-800 mb-2">📏 Size or Capacity Mismatch</h3>
                  <p className="text-yellow-700 mb-2">When physical dimensions or capacity don't meet requirements:</p>
                  <ul className="list-disc list-inside text-yellow-700 text-sm ml-4">
                    <li>Measurement verification required</li>
                    <li>Alternative sizing options provided</li>
                    <li>Installation consultation included if needed</li>
                  </ul>
                </div>
                
                <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-purple-800 mb-2">🎯 Performance Expectations</h3>
                  <p className="text-purple-700 mb-2">If product performance doesn't meet documented specifications:</p>
                  <ul className="list-disc list-inside text-purple-700 text-sm ml-4">
                    <li>Performance testing may be required</li>
                    <li>Exchange for comparable or superior product</li>
                    <li>Technical support to optimize existing setup</li>
                  </ul>
                </div>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-[#1a5ca4] mb-4">6. Exchange Limitations</h2>
              
              <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-red-800 mb-3">Items NOT Eligible for Exchange:</h3>
                <ul className="list-disc list-inside text-red-700 space-y-1">
                  <li>Customized or specially ordered products</li>
                  <li>Products showing signs of use or installation</li>
                  <li>Items damaged by customer negligence</li>
                  <li>Clearance or final sale items</li>
                  <li>Consumable products (cables, fuses, etc.)</li>
                  <li>Digital products or software licenses</li>
                  <li>Items purchased more than 7 days ago</li>
                  <li>Products without original packaging or accessories</li>
                  <li>Items returned without proper authorization</li>
                </ul>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-[#1a5ca4] mb-4">7. Exchange Timeline</h2>
              
              <div className="grid md:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className="text-2xl font-bold text-[#1a5ca4] mb-2">24 hrs</div>
                  <p className="text-gray-700 text-sm">Exchange request response</p>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className="text-2xl font-bold text-[#1a5ca4] mb-2">3-5 days</div>
                  <p className="text-gray-700 text-sm">Product inspection & processing</p>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className="text-2xl font-bold text-[#1a5ca4] mb-2">5-7 days</div>
                  <p className="text-gray-700 text-sm">New product delivery</p>
                </div>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-[#1a5ca4] mb-4">8. Quality Assurance</h2>
              <p className="text-gray-700 mb-4">
                All exchange products undergo rigorous quality checks:
              </p>
              <ul className="list-disc list-inside text-gray-700 mb-4 ml-4">
                <li>Visual inspection for physical damage</li>
                <li>Electrical testing for functional components</li>
                <li>Packaging integrity verification</li>
                <li>Accessory and documentation completeness check</li>
                <li>Serial number and warranty validation</li>
                <li>Performance specifications verification</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-[#1a5ca4] mb-4">9. Exchange Support</h2>
              
              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-800 mb-3">Dedicated Exchange Support Team</h3>
                <p className="text-gray-700 font-semibold mb-2">SolarExpress.pk Exchange Department</p>
                <p className="text-gray-700">Office #24, 2nd Floor, Johar Business Center</p>
                <p className="text-gray-700">Main University Road, Karachi, Pakistan</p>
                <div className="mt-4 space-y-1">
                  <p className="text-gray-700">📞 Exchange Hotline: +92 333 0505000</p>
                  <p className="text-gray-700">💬 WhatsApp Support: +92 333 0505000</p>
                  <p className="text-gray-700">✉️ Email: exchanges@solarexpress.pk</p>
                  <p className="text-gray-700">⏰ Support Hours: 9 AM - 6 PM (Monday to Saturday)</p>
                  <p className="text-gray-700">🎯 Average Response Time: 2-4 hours</p>
                </div>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-[#1a5ca4] mb-4">10. Technical Consultation</h2>
              <p className="text-gray-700 mb-4">
                Free technical consultation for all exchange requests:
              </p>
              <ul className="list-disc list-inside text-gray-700 mb-4 ml-4">
                <li>System compatibility analysis</li>
                <li>Performance optimization recommendations</li>
                <li>Future expansion planning</li>
                <li>Cost-benefit analysis for upgrades</li>
                <li>Installation guidance and support</li>
              </ul>
            </section>

            <div className="bg-green-50 border border-green-200 rounded-lg p-6 mt-8">
              <h3 className="text-lg font-semibold text-green-800 mb-2">💡 Pro Tip for Customers</h3>
              <p className="text-green-700">
                Before requesting an exchange, consider reaching out to our technical support team. 
                Many perceived compatibility or performance issues can be resolved through proper 
                configuration or additional components, saving you time and exchange fees while 
                getting optimal performance from your current setup.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
