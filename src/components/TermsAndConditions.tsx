import React, { useEffect } from 'react';
import { ArrowLeft, FileText, CheckCircle2, AlertCircle, Scale, Mail, Phone, MapPin } from 'lucide-react';
import { MotionFadeIn } from './MotionPrimitives';

interface TermsProps {
  onBack: () => void;
}

const TermsAndConditions: React.FC<TermsProps> = ({ onBack }) => {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    document.title = 'Terms & Conditions | Roti Bank Bettiah Trust';
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 pt-28 pb-20">
      {/* Top Banner / Header */}
      <div className="bg-slate-900 text-white py-16 border-b border-slate-800">
        <div className="container mx-auto px-6 max-w-4xl">
          <button
            onClick={onBack}
            className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-400 hover:text-emerald-300 transition-colors mb-6 group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Back to Home
          </button>
          
          <div className="flex items-center gap-3 mb-4">
            <span className="p-2.5 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-emerald-400">
              <Scale className="w-6 h-6" />
            </span>
            <span className="text-xs font-semibold uppercase tracking-widest text-emerald-400">
              Legal Framework & Guidelines
            </span>
          </div>

          <h1 className="text-3xl md:text-5xl font-black tracking-tight text-white mb-4">
            Terms & Conditions
          </h1>
          <p className="text-slate-400 text-sm md:text-base leading-relaxed">
            Roti Bank Bettiah Trust (Registration No. 5071/2023). Governed under Indian Trusts Act & relevant state laws.
          </p>
        </div>
      </div>

      {/* Main Content Body */}
      <div className="container mx-auto px-4 sm:px-6 max-w-4xl -mt-6">
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-5 sm:p-8 md:p-12 space-y-8 sm:space-y-10 text-slate-700 leading-relaxed text-sm md:text-base break-words">
          
          {/* Section 1 */}
          <MotionFadeIn>
            <section className="space-y-4">
              <h2 className="text-xl md:text-2xl font-bold text-slate-900 flex items-center gap-2.5">
                <span className="text-emerald-600 font-mono text-base">01.</span>
                Acceptance of Terms
              </h2>
              <p>
                By accessing, browsing, or donating through the official website of Roti Bank Bettiah Trust (<a href="https://rotibankbettaih.org/" className="text-emerald-600 underline">https://rotibankbettaih.org/</a>), you acknowledge that you have read, understood, and agree to be bound by these Terms &amp; Conditions. If you do not agree to these terms, please do not use our online services.
              </p>
            </section>
          </MotionFadeIn>

          {/* Section 2 */}
          <MotionFadeIn>
            <section className="space-y-4 border-t border-slate-100 pt-8">
              <h2 className="text-xl md:text-2xl font-bold text-slate-900 flex items-center gap-2.5">
                <span className="text-emerald-600 font-mono text-base">02.</span>
                Charitable Nature of Contributions
              </h2>
              <p>
                All funds received through this platform represent voluntary charitable contributions designated solely to support our core humanitarian missions: daily meal preparation, nutritious ration kit distribution, emergency hospital patient feeding, and child nutrition across Bettiah and West Champaran district.
              </p>
              <div className="bg-slate-50 border border-slate-200 p-5 rounded-xl space-y-2">
                <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  Tax Exemption under Section 80G
                </div>
                <p className="text-xs text-slate-600">
                  Donations made to Roti Bank Bettiah Trust are eligible for tax deduction under Section 80G of the Income Tax Act, 1961. Donors seeking tax exemption certificates must provide their valid Permanent Account Number (PAN) and mailing address at the time of contribution.
                </p>
              </div>
            </section>
          </MotionFadeIn>

          {/* Section 3 - Cancellation & Refund Policy */}
          <MotionFadeIn>
            <section className="space-y-4 border-t border-slate-100 pt-8">
              <h2 className="text-xl md:text-2xl font-bold text-slate-900 flex items-center gap-2.5">
                <span className="text-emerald-600 font-mono text-base">03.</span>
                Donation Cancellation & Refund Policy
              </h2>
              <p>
                As a registered charitable trust operating daily meal programs, resources are rapidly converted into food grain purchases, fresh ingredients, and kitchen operations. Consequently:
              </p>
              <ul className="space-y-3 pl-2">
                <li className="flex items-start gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-600 mt-2 shrink-0"></div>
                  <span><strong>Erroneous or Duplicate Transactions:</strong> If a technical glitch causes a duplicate deduction or you enter an unintended amount, notify us at <a href="mailto:rotibankbettiah@gmail.com" className="text-emerald-700 font-medium underline">rotibankbettiah@gmail.com</a> within <strong>48 hours</strong> of the transaction with proof of payment.</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-600 mt-2 shrink-0"></div>
                  <span><strong>Refund Review:</strong> Legitimate refund requests reviewed and approved by the trustees will be credited back via the original payment channel (Razorpay/bank account) within 7 to 10 working days, subject to payment gateway charges.</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-600 mt-2 shrink-0"></div>
                  <span><strong>Post-Certificate Issuance:</strong> Once an official 80G tax exemption receipt has been generated and filed in statutory IT returns, contributions cannot be refunded under Income Tax Department rules.</span>
                </li>
              </ul>
            </section>
          </MotionFadeIn>

          {/* Section 4 */}
          <MotionFadeIn>
            <section className="space-y-4 border-t border-slate-100 pt-8">
              <h2 className="text-xl md:text-2xl font-bold text-slate-900 flex items-center gap-2.5">
                <span className="text-emerald-600 font-mono text-base">04.</span>
                Volunteer & Student Internship Guidelines
              </h2>
              <p>
                Individuals participating in our volunteer or student internship drives commit to:
              </p>
              <ul className="list-disc pl-5 space-y-1.5 text-slate-600">
                <li>Treating every food beneficiary with unconditional respect, warmth, and dignity.</li>
                <li>Adhering strictly to food hygiene standards, wearing hair caps, gloves, and sanitizing hands before food handling.</li>
                <li>Recognizing that certificates of internship/volunteering are awarded strictly based on verified attendance, active participation, and genuine community seva.</li>
              </ul>
            </section>
          </MotionFadeIn>

          {/* Section 5 */}
          <MotionFadeIn>
            <section className="space-y-4 border-t border-slate-100 pt-8">
              <h2 className="text-xl md:text-2xl font-bold text-slate-900 flex items-center gap-2.5">
                <span className="text-emerald-600 font-mono text-base">05.</span>
                Intellectual Property & Website Media
              </h2>
              <p>
                The Roti Bank Bettiah emblem, logo, activity photographs, video recordings, and site materials are the property of Roti Bank Bettiah Trust. Unauthorized reproduction, commercial exploitation, or misrepresentation of our brand for personal collection or unauthorized third-party donation drives is strictly prohibited under Indian law.
              </p>
            </section>
          </MotionFadeIn>

          {/* Section 6 */}
          <MotionFadeIn>
            <section className="space-y-4 border-t border-slate-100 pt-8">
              <h2 className="text-xl md:text-2xl font-bold text-slate-900 flex items-center gap-2.5">
                <span className="text-emerald-600 font-mono text-base">06.</span>
                Governing Law & Jurisdiction
              </h2>
              <p>
                These Terms and Conditions shall be governed by and construed in accordance with the laws of the Republic of India. Any legal dispute, arbitration, or proceeding arising out of or related to our website, donations, or trust operations shall fall under the exclusive jurisdiction of the competent courts in <strong>Bettiah, District West Champaran, Bihar</strong>.
              </p>
            </section>
          </MotionFadeIn>

          {/* Contact Details */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-6 text-sm">
            <h3 className="font-bold text-slate-900 mb-3">Official Trust Contact</h3>
            <p className="text-slate-600 mb-2">
              For any official clarifications regarding our terms or donations, reach out directly:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
              <div className="flex items-center gap-2 text-slate-700">
                <MapPin className="w-4 h-4 text-emerald-600 shrink-0" />
                Kalibag Chowk, Bettiah, Bihar - 845438
              </div>
              <div className="flex items-center gap-2 text-slate-700">
                <Mail className="w-4 h-4 text-emerald-600 shrink-0" />
                rotibankbettiah@gmail.com
              </div>
              <div className="flex items-center gap-2 text-slate-700">
                <Phone className="w-4 h-4 text-emerald-600 shrink-0" />
                +91 9473228888
              </div>
            </div>
          </div>

          {/* Action button */}
          <div className="pt-6 border-t border-slate-100 flex justify-center">
            <button
              onClick={onBack}
              className="px-8 py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-sm transition-all shadow-sm hover:shadow active:scale-95 inline-flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Return to Main Portal
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};

export default TermsAndConditions;
