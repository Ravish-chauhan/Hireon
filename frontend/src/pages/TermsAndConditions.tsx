import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Header } from '../components/layout/Header';
import { Footer } from '../components/layout/Footer';
import { seoConfig } from '../config/seoConfig';

const TermsAndConditions = () => {
  return (
    <div className="min-h-screen bg-white">
      <Helmet>
        <title>{seoConfig.termsAndConditions.title}</title>
        <meta name="description" content={seoConfig.termsAndConditions.description} />
        <meta name="keywords" content={seoConfig.termsAndConditions.keywords} />
        <link rel="canonical" href={seoConfig.termsAndConditions.canonical} />
      </Helmet>
      <Header />
      
      <div className="pt-24 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8 text-center">
            End User License Agreement
          </h1>
          
          <div className="prose prose-lg max-w-none">
            <p className="text-sm text-gray-600 mb-8">Last Updated: {new Date().toLocaleDateString()}</p>
            
            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-8">
              <p className="text-sm font-medium text-yellow-800">
                PLEASE READ CAREFULLY: This End User License Agreement ("Agreement") is a legally binding electronic contract between You ("User") and Eduniaa Education Services Pvt. Ltd. ("Company").
                BY CLICKING "I AGREE", REGISTERING, OR ACCESSING THE PLATFORM, YOU ACKNOWLEDGE THAT YOU HAVE READ, UNDERSTOOD, AND AGREE TO BE BOUND BY THIS AGREEMENT.
              </p>
            </div>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">1. GRANT OF LICENSE</h2>
              
              <h3 className="text-xl font-semibold text-gray-800 mb-3">1.1 Limited License:</h3>
              <p className="mb-4">
                Subject to your compliance with this Agreement and payment of applicable fees, Eduniaa grants you a personal, non-exclusive, non-transferable, revocable, and limited license to access and use the Platform and the educational content therein ("Licensed Content") solely for your personal, non-commercial educational purposes.
              </p>
              
              <h3 className="text-xl font-semibold text-gray-800 mb-3">1.2 Restrictions:</h3>
              <p className="mb-2">You shall not, and shall not permit any third party to:</p>
              <ul className="list-disc pl-6 mb-4">
                <li><strong>Commercialize:</strong> Rent, lease, lend, sell, redistribute, or sublicense the Licensed Content.</li>
                <li><strong>Reverse Engineer:</strong> Decompile, reverse engineer, disassemble, or attempt to derive the source code of the Platform.</li>
                <li><strong>Derivative Works:</strong> Copy, modify, or create derivative works of the Licensed Content.</li>
                <li><strong>Sharing:</strong> Share your login credentials with any other individual. Detection of simultaneous logins from disparate locations may result in immediate account suspension.</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">2. USER CONDUCT AND OBLIGATIONS</h2>
              
              <h3 className="text-xl font-semibold text-gray-800 mb-3">2.1 Prohibited Content:</h3>
              <p className="mb-2">You agree not to host, display, upload, modify, publish, transmit, store, update, or share any information on the Platform (including in doubt forums or chat sections) that:</p>
              <ul className="list-disc pl-6 mb-4">
                <li>Belongs to another person and to which You do not have any right;</li>
                <li>Is obscene, pornographic, pedophilic, invasive of another's privacy, including bodily privacy, insulting or harassing on the basis of gender, racially or ethnically objectionable, relating or encouraging money laundering or gambling, or otherwise inconsistent with or contrary to proprietary rights;</li>
                <li>Deceives or misleads the addressee about the origin of the message or knowingly and intentionally communicates any information which is patently false or misleading in nature but may reasonably be perceived as a fact;</li>
                <li>Threatens the unity, integrity, defense, security or sovereignty of India, friendly relations with foreign states, or public order.</li>
              </ul>
              
              <h3 className="text-xl font-semibold text-gray-800 mb-3">2.2 Platform Integrity:</h3>
              <p className="mb-4">
                You agree not to use any automated means (such as robots, spiders, or scripts) to access the Platform or collect data ("Scraping").
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">3. INTELLECTUAL PROPERTY RIGHTS</h2>
              
              <h3 className="text-xl font-semibold text-gray-800 mb-3">3.1 Company IP:</h3>
              <p className="mb-4">
                All rights, title, and interest in and to the Platform, including the curriculum, video lectures, quizzes, software code, and graphics (excluding User Content), are and will remain the exclusive property of Eduniaa.
              </p>
              
              <h3 className="text-xl font-semibold text-gray-800 mb-3">3.2 User Content License:</h3>
              <p className="mb-4">
                By posting questions, doubts, or assignments ("User Content") on the Platform, you grant Eduniaa a worldwide, non-exclusive, royalty-free, perpetual, and sub-licensable license to use, reproduce, display, distribute, and create derivative works of such User Content for the purpose of operating, promoting, and improving the Services. You represent that you own the User Content and that it does not violate any third-party rights.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">4. PAYMENTS AND REFUNDS</h2>
              
              <h3 className="text-xl font-semibold text-gray-800 mb-3">4.1 Fees:</h3>
              <p className="mb-4">
                You agree to pay the fees associated with the specific course or subscription plan you select. All fees are inclusive of applicable taxes unless stated otherwise.
              </p>
              
              <h3 className="text-xl font-semibold text-gray-800 mb-3">4.2 Refund Policy:</h3>
              <ul className="list-disc pl-6 mb-4">
                <li><strong>Course Refund Window:</strong> For self-paced courses, we offer a refund within seven (7) days of purchase, provided you have accessed less than 10% of the content.</li>
                <li><strong>Live Batches:</strong> For live cohort-based courses, refunds are not permitted after the batch commencement date.</li>
                <li><strong>Method:</strong> Refunds will be processed to the original method of payment within 7-14 business days.</li>
                <li><strong>Payment Failures:</strong> In the event of a deduction where the service is not provided due to a technical glitch, the amount will be automatically reversed by the Payment Gateway as per their settlement cycle (typically 5-7 days).</li>
              </ul>
              
              <h3 className="text-xl font-semibold text-gray-800 mb-3">4.3 Cancellations:</h3>
              <p className="mb-4">
                We reserve the right to cancel any course or batch. In such an event, a full pro-rata refund will be issued for the unconsumed portion of the service.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">5. DISCLAIMER OF WARRANTIES AND LIMITATION OF LIABILITY</h2>
              
              <h3 className="text-xl font-semibold text-gray-800 mb-3">5.1 Educational Disclaimer:</h3>
              <p className="mb-4 font-medium text-gray-700">
                THE PLATFORM IS PROVIDED ON AN "AS-IS" BASIS. EDUNIAA MAKES NO REPRESENTATIONS OR WARRANTIES REGARDING THE OUTCOME OF YOUR USE OF THE SERVICES, INCLUDING ANY GUARANTEE OF PASSING EXAMS, OBTAINING ADMISSION, OR ACADEMIC IMPROVEMENT.
              </p>
              
              <h3 className="text-xl font-semibold text-gray-800 mb-3">5.2 Limitation of Liability:</h3>
              <p className="mb-4 font-medium text-gray-700">
                TO THE FULLEST EXTENT PERMITTED BY LAW, EDUNIAA SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, OR ANY LOSS OF PROFITS OR REVENUES. IN NO EVENT SHALL EDUNIAA'S AGGREGATE LIABILITY EXCEED THE TOTAL FEES PAID BY YOU TO EDUNIAA IN THE SIX (6) MONTHS PRECEDING THE EVENT GIVING RISE TO THE CLAIM.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">6. GOVERNING LAW AND DISPUTE RESOLUTION</h2>
              
              <h3 className="text-xl font-semibold text-gray-800 mb-3">6.1 Governing Law:</h3>
              <p className="mb-4">
                This Agreement shall be governed by the laws of India.
              </p>
              
              <h3 className="text-xl font-semibold text-gray-800 mb-3">6.2 Arbitration:</h3>
              <p className="mb-4">
                Any dispute arising out of or in connection with this Agreement shall be referred to and finally resolved by arbitration by a sole arbitrator appointed by Eduniaa. The seat and venue of arbitration shall be New Delhi, India. The language of arbitration shall be English. The award shall be final and binding.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Contact Information</h2>
              <p className="mb-2">
                If you have any questions about these Terms and Conditions, please contact us at:
              </p>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p><strong>Email:</strong> legal@eduniaa.com</p>
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

export default TermsAndConditions;