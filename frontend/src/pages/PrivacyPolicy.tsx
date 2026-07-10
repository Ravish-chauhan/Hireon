import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Header } from '../components/layout/Header';
import { Footer } from '../components/layout/Footer';
import { seoConfig } from '../config/seoConfig';

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-white">
      <Helmet>
        <title>{seoConfig.privacyPolicy.title}</title>
        <meta name="description" content={seoConfig.privacyPolicy.description} />
        <meta name="keywords" content={seoConfig.privacyPolicy.keywords} />
        <link rel="canonical" href={seoConfig.privacyPolicy.canonical} />
      </Helmet>
      <Header />
      
      <div className="pt-24 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8 text-center">
            Privacy Policy
          </h1>
          
          <div className="prose prose-lg max-w-none">
            <p className="text-sm text-gray-600 mb-8">Last Updated: {new Date().toLocaleDateString()}</p>
            
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">1. INTRODUCTION</h2>
              <p className="mb-4">
                Eduniaa Education Services Pvt. Ltd. ("Eduniaa", "We", "Us", or "Our") operates the website www.eduniaa.com and associated mobile applications (collectively, the "Platform"). We recognize the critical importance of your privacy and are committed to protecting the personal data of our users ("User", "You", "Data Principal").
              </p>
              <p className="mb-4">
                This Privacy Policy is formulated in accordance with the Digital Personal Data Protection Act, 2023 (DPDP Act), the Information Technology Act, 2000, and the Information Technology (Reasonable Security Practices and Procedures and Sensitive Personal Data or Information) Rules, 2011. It details how we collect, process, store, and share your data. By accessing the Platform, you consent to the practices described herein.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">2. DATA WE COLLECT AND PROCESSED</h2>
              <p className="mb-4">
                We engage in the processing of personal data only for specific, lawful purposes ("Specified Purposes"). The categories of data include:
              </p>
              
              <div className="overflow-x-auto mb-6">
                <table className="min-w-full border border-gray-300">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="border border-gray-300 px-4 py-2 text-left font-semibold">Data Category</th>
                      <th className="border border-gray-300 px-4 py-2 text-left font-semibold">Specific Data Points</th>
                      <th className="border border-gray-300 px-4 py-2 text-left font-semibold">Purpose of Processing (Lawful Basis)</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="border border-gray-300 px-4 py-2 font-medium">Identity Data</td>
                      <td className="border border-gray-300 px-4 py-2">Name, Date of Birth, Gender, Photograph.</td>
                      <td className="border border-gray-300 px-4 py-2">User authentication, Age verification (DPDP Act compliance), and creating your academic profile.</td>
                    </tr>
                    <tr className="bg-gray-50">
                      <td className="border border-gray-300 px-4 py-2 font-medium">Contact Data</td>
                      <td className="border border-gray-300 px-4 py-2">Email address, Mobile number, Residential address.</td>
                      <td className="border border-gray-300 px-4 py-2">Delivery of course materials, account administration, and verifiable parental consent communication.</td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 px-4 py-2 font-medium">Academic Data</td>
                      <td className="border border-gray-300 px-4 py-2">School/College name, Grades, Test scores, Course progress.</td>
                      <td className="border border-gray-300 px-4 py-2">Personalizing learning paths, generating report cards, and academic counseling.</td>
                    </tr>
                    <tr className="bg-gray-50">
                      <td className="border border-gray-300 px-4 py-2 font-medium">Technical Data</td>
                      <td className="border border-gray-300 px-4 py-2">IP address, Device ID (IMEI/MAC), Browser type, OS version.</td>
                      <td className="border border-gray-300 px-4 py-2">Fraud prevention, session management, and ensuring Platform security.</td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 px-4 py-2 font-medium">Payment Data</td>
                      <td className="border border-gray-300 px-4 py-2">Transaction ID, Payment status, Bank Name (Partial).</td>
                      <td className="border border-gray-300 px-4 py-2">Processing course fees and refunds. Note: We do not store complete Credit/Debit card numbers or CVV.</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              
              <h3 className="text-xl font-semibold text-gray-800 mb-3">2.3 Sensitive Personal Data:</h3>
              <p className="mb-4">
                We strictly limit the collection of Sensitive Personal Data (as defined under the IT Rules). We do not collect biometric data, health data, or genetic data unless explicitly required for a specific feature (e.g., disability accommodation), for which separate, explicit consent will be sought.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">3. CHILDREN'S PRIVACY AND PARENTAL CONSENT</h2>
              
              <h3 className="text-xl font-semibold text-gray-800 mb-3">3.1 Definition of Child:</h3>
              <p className="mb-4">
                For the purposes of this Policy and complying with the DPDP Act, a "Child" is defined as any individual who has not completed eighteen (18) years of age.
              </p>
              
              <h3 className="text-xl font-semibold text-gray-800 mb-3">3.2 Verifiable Parental Consent:</h3>
              <p className="mb-4">
                We do not knowingly collect or process the personal data of a Child without the prior, verifiable consent of a parent or lawful guardian.
              </p>
              <ul className="list-disc pl-6 mb-4">
                <li><strong>Registration Gating:</strong> During registration, if the date of birth indicates the User is a Child, the account creation process will be paused.</li>
                <li><strong>Consent Mechanism:</strong> The User must provide the contact details of a parent/guardian. We will contact the parent/guardian to verify their identity and obtain explicit consent for the Child to use the Platform.</li>
                <li><strong>Withdrawal:</strong> Parents may review the data collected about their Child, request its deletion, and refuse to allow further collection or use of the data.</li>
              </ul>
              
              <h3 className="text-xl font-semibold text-gray-800 mb-3">3.3 Prohibited Activities regarding Children:</h3>
              <p className="mb-2">In strict compliance with Section 9 of the DPDP Act:</p>
              <ul className="list-disc pl-6 mb-4">
                <li>We do not track the behavioral monitoring of Children.</li>
                <li>We do not direct targeted advertising at Children.</li>
                <li>We do not engage in any processing that is likely to cause any detrimental effect on the well-being of a Child.</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">4. DATA RETENTION POLICY</h2>
              
              <h3 className="text-xl font-semibold text-gray-800 mb-3">4.1 Retention Period:</h3>
              <p className="mb-4">
                We retain Personal Data only for as long as necessary to fulfill the purposes for which it was collected, including for the purposes of satisfying any legal, accounting, or reporting requirements.
              </p>
              <ul className="list-disc pl-6 mb-4">
                <li><strong>Active Accounts:</strong> Data is retained for the duration of the account's activity.</li>
                <li><strong>Inactive Accounts:</strong> In compliance with the directions for intermediaries, we may retain basic account data and transaction logs for a period of three (3) years following account deletion or strict inactivity to facilitate law enforcement requests.</li>
                <li><strong>Transaction Records:</strong> Financial data is retained for a period of eight (8) years as mandated by Indian tax laws.</li>
              </ul>
              
              <h3 className="text-xl font-semibold text-gray-800 mb-3">4.2 Erasure:</h3>
              <p className="mb-4">
                Upon the expiry of the applicable retention period, or upon your valid request for erasure (where no legal override exists), your data will be securely deleted or anonymized in a manner that it is irretrievable.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">5. DATA SHARING AND DISCLOSURE</h2>
              
              <h3 className="text-xl font-semibold text-gray-800 mb-3">5.1 Service Providers (Data Processors):</h3>
              <p className="mb-2">We may share your data with third-party vendors who perform services on our behalf, such as:</p>
              <ul className="list-disc pl-6 mb-4">
                <li><strong>Cloud Hosting:</strong> (e.g., AWS, Google Cloud) for secure data storage.</li>
                <li><strong>Payment Gateways:</strong> (e.g., Razorpay, Stripe) for processing fees.</li>
                <li><strong>Communication Services:</strong> (e.g., SMS/Email providers) for sending OTPs and alerts.</li>
              </ul>
              <p className="mb-4">
                We ensure that all Data Processors are contractually bound to process data only on our instructions and maintain security standards equivalent to those prescribed under Indian law.
              </p>
              
              <h3 className="text-xl font-semibold text-gray-800 mb-3">5.2 Legal Requirements:</h3>
              <p className="mb-4">
                We may disclose your data if required to do so by law or in the good-faith belief that such action is necessary to comply with a legal obligation (e.g., a court order or a request from a law enforcement agency under Section 91 of the CrPC).
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">6. YOUR RIGHTS AND GRIEVANCE REDRESSAL</h2>
              
              <h3 className="text-xl font-semibold text-gray-800 mb-3">6.1 Your Rights:</h3>
              <p className="mb-2">Under the DPDP Act, you have the right to:</p>
              <ul className="list-disc pl-6 mb-4">
                <li><strong>Access:</strong> Request a summary of your personal data processed by us.</li>
                <li><strong>Correction:</strong> Request correction of inaccurate or misleading data.</li>
                <li><strong>Erasure:</strong> Request deletion of your data (Subject to Section 4).</li>
                <li><strong>Nomination:</strong> Nominate an individual to exercise your rights in the event of death or incapacity.</li>
              </ul>
              
              <h3 className="text-xl font-semibold text-gray-800 mb-3">6.2 Grievance Officer:</h3>
              <p className="mb-4">
                In accordance with the IT Act 2000 and the DPDP Act 2023, if you have any concerns regarding the processing of your data, you may contact our designated Grievance Officer:
              </p>
              <div className="bg-gray-50 p-4 rounded-lg mb-4">
                <p><strong>Name:</strong> [Name of Officer]</p>
                <p><strong>Designation:</strong> Grievance Officer</p>
                <p><strong>Email:</strong> grievance@eduniaa.com</p>
                <p><strong>Address:</strong> [Physical Address in India]</p>
              </div>
              <p className="mb-4">
                We will acknowledge your complaint within twenty-four (24) hours and resolve it within fifteen (15) days from the date of its receipt.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Contact Information</h2>
              <p className="mb-2">
                If you have any questions about this Privacy Policy, please contact us at:
              </p>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p><strong>Email:</strong> privacy@eduniaa.com</p>
                <p><strong>Address:</strong> Eduniaa Education Services Pvt. Ltd., India</p>
              </div>
            </section>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default PrivacyPolicy;