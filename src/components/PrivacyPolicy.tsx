import React, { useEffect } from 'react';
import { ArrowLeft, Shield, Lock, FileText, CheckCircle, Mail, Phone, MapPin } from 'lucide-react';
import { MotionFadeIn } from './MotionPrimitives';

interface PrivacyPolicyProps {
  onBack: () => void;
}

const PrivacyPolicy: React.FC<PrivacyPolicyProps> = ({ onBack }) => {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    document.title = 'Privacy Policy | Roti Bank Bettiah Trust';
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
              <Shield className="w-6 h-6" />
            </span>
            <span className="text-xs font-semibold uppercase tracking-widest text-emerald-400">
              Trust Compliance & Legal
            </span>
          </div>

          <h1 className="text-3xl md:text-5xl font-black tracking-tight text-white mb-4">
            Privacy Policy
          </h1>
          <p className="text-slate-400 text-sm md:text-base leading-relaxed">
            Roti Bank Bettiah Trust (Registration No. 5071/2023). Last updated: January 2025.
          </p>
        </div>
      </div>

      {/* Main Content Body */}
      <div className="container mx-auto px-6 max-w-4xl -mt-6">
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-8 md:p-12 space-y-10 text-slate-700 leading-relaxed text-sm md:text-base">
          
          {/* Section 1 */}
          <MotionFadeIn>
            <section className="space-y-4">
              <h2 className="text-xl md:text-2xl font-bold text-slate-900 flex items-center gap-2.5">
                <span className="text-emerald-600 font-mono text-base">01.</span>
                Introduction and Commitment
              </h2>
              <p>
                Roti Bank Bettiah Trust (&quot;we,&quot; &quot;our,&quot; or &quot;the Trust&quot;) is a registered non-profit charitable trust established under Indian law with Registration No. <strong>5071/2023</strong> in West Champaran, Bihar. We are committed to protecting the privacy, confidentiality, and security of our donors, volunteers, beneficiaries, and visitors who interact with our website (<a href="https://rotibankbettiah.org/" className="text-emerald-600 underline">https://rotibankbettiah.org/</a>).
              </p>
              <p>
                This Privacy Policy explains what information we collect, how it is used for our charitable activities, and how we safeguard your personal data in accordance with the Information Technology Act, 2000 and the Digital Personal Data Protection Act (DPDPA), 2023.
              </p>
            </section>
          </MotionFadeIn>

          {/* Section 2 */}
          <MotionFadeIn>
            <section className="space-y-4 border-t border-slate-100 pt-8">
              <h2 className="text-xl md:text-2xl font-bold text-slate-900 flex items-center gap-2.5">
                <span className="text-emerald-600 font-mono text-base">02.</span>
                Information We Collect
              </h2>
              <p>When you donate, volunteer, or subscribe to our newsletter, we may collect:</p>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-3 pl-2">
                <li className="flex items-start gap-2.5 bg-slate-50 p-3.5 rounded-xl border border-slate-100">
                  <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-slate-900 block text-sm">Identity & Contact</strong>
                    <span className="text-xs text-slate-500">Name, mobile phone number, email address, and mailing address.</span>
                  </div>
                </li>
                <li className="flex items-start gap-2.5 bg-slate-50 p-3.5 rounded-xl border border-slate-100">
                  <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-slate-900 block text-sm">Statutory 80G Tax Details</strong>
                    <span className="text-xs text-slate-500">Permanent Account Number (PAN) required under Section 80G of the Indian Income Tax Act for issuing valid tax exemption receipts.</span>
                  </div>
                </li>
                <li className="flex items-start gap-2.5 bg-slate-50 p-3.5 rounded-xl border border-slate-100">
                  <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-slate-900 block text-sm">Payment Transaction Metadata</strong>
                    <span className="text-xs text-slate-500">Transaction ID, donation amount, date, and payment status returned by Razorpay.</span>
                  </div>
                </li>
                <li className="flex items-start gap-2.5 bg-slate-50 p-3.5 rounded-xl border border-slate-100">
                  <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-slate-900 block text-sm">Volunteer & Intern Applications</strong>
                    <span className="text-xs text-slate-500">Educational background, availability, and motivation statements submitted through application forms.</span>
                  </div>
                </li>
              </ul>
            </section>
          </MotionFadeIn>

          {/* Section 3 */}
          <MotionFadeIn>
            <section className="space-y-4 border-t border-slate-100 pt-8">
              <h2 className="text-xl md:text-2xl font-bold text-slate-900 flex items-center gap-2.5">
                <span className="text-emerald-600 font-mono text-base">03.</span>
                Payment Processing and Financial Security
              </h2>
              <p>
                All online transactions are processed through <strong>Razorpay Software Private Limited</strong>, an RBI-authorized payment aggregator compliant with the highest PCI-DSS (Payment Card Industry Data Security Standard) Level 1 standards.
              </p>
              <div className="bg-emerald-50/60 border border-emerald-200/60 p-5 rounded-xl flex items-start gap-3.5">
                <Lock className="w-5 h-5 text-emerald-700 shrink-0 mt-1" />
                <div className="text-sm text-emerald-900">
                  <strong>Zero Financial Data Retention:</strong> Roti Bank Bettiah Trust does NOT collect, store, or process your credit/debit card numbers, CVV codes, net banking passwords, or UPI MPINs on our servers. All sensitive financial authentication takes place securely within Razorpay&apos;s encrypted vault.
                </div>
              </div>
            </section>
          </MotionFadeIn>

          {/* Section 4 */}
          <MotionFadeIn>
            <section className="space-y-4 border-t border-slate-100 pt-8">
              <h2 className="text-xl md:text-2xl font-bold text-slate-900 flex items-center gap-2.5">
                <span className="text-emerald-600 font-mono text-base">04.</span>
                How We Use Your Information
              </h2>
              <p>Your information is used strictly for non-profit and statutory trust purposes:</p>
              <ul className="space-y-2 list-disc pl-5 text-slate-600">
                <li>Issuing electronic receipts, acknowledgment letters, and statutory Section 80G tax exemption certificates.</li>
                <li>Filing statutory annual returns (Form 10BD) with the Income Tax Department of India for donor tax deduction claims.</li>
                <li>Sharing periodic transparent impact updates, annual reports, and community feeding milestones.</li>
                <li>Processing internship and volunteer certifications upon successful completion of community seva.</li>
                <li>Preventing fraudulent donations and ensuring compliance with NGO auditing standards.</li>
              </ul>
              <p className="font-semibold text-slate-900">
                We strictly DO NOT sell, rent, trade, or monetize donor information with any commercial third party.
              </p>
            </section>
          </MotionFadeIn>

          {/* Section 5 */}
          <MotionFadeIn>
            <section className="space-y-4 border-t border-slate-100 pt-8">
              <h2 className="text-xl md:text-2xl font-bold text-slate-900 flex items-center gap-2.5">
                <span className="text-emerald-600 font-mono text-base">05.</span>
                Data Retention & Beneficiary Dignity
              </h2>
              <p>
                We retain statutory donation records for the duration required by Indian tax laws (ordinarily 7 to 8 financial years). Beneficiary photographs displayed in our impact galleries and reports are taken during public community distribution programs with respect for human dignity and sole intention of demonstrating transparent fund utilization.
              </p>
            </section>
          </MotionFadeIn>

          {/* Section 6 - Grievance Officer */}
          <MotionFadeIn>
            <section className="space-y-4 border-t border-slate-100 pt-8">
              <h2 className="text-xl md:text-2xl font-bold text-slate-900 flex items-center gap-2.5">
                <span className="text-emerald-600 font-mono text-base">06.</span>
                Grievance Officer & Contact Information
              </h2>
              <p>
                In compliance with the Information Technology Rules, 2021, if you have any questions, concerns, or requests regarding your personal data or wish to opt out of communication, please contact our designated Grievance Officer:
              </p>

              <div className="bg-slate-50 border border-slate-200 rounded-xl p-6 grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-xs uppercase font-bold text-slate-400 block mb-1">Organization</span>
                  <span className="font-bold text-slate-900">Roti Bank Bettiah Trust</span>
                  <span className="text-xs text-slate-500 block">Registration No: 5071/2023</span>
                </div>
                <div>
                  <span className="text-xs uppercase font-bold text-slate-400 block mb-1">Location</span>
                  <span className="font-semibold text-slate-800 flex items-center gap-1.5">
                    <MapPin className="w-4 h-4 text-emerald-600 shrink-0" />
                    Kalibag Chowk, Bettiah, Bihar - 845438
                  </span>
                </div>
                <div>
                  <span className="text-xs uppercase font-bold text-slate-400 block mb-1">Email Inquiries</span>
                  <a href="mailto:rotibankbettiah@gmail.com" className="font-semibold text-emerald-700 flex items-center gap-1.5 hover:underline">
                    <Mail className="w-4 h-4 text-emerald-600 shrink-0" />
                    rotibankbettiah@gmail.com
                  </a>
                </div>
                <div>
                  <span className="text-xs uppercase font-bold text-slate-400 block mb-1">Helpline Phone</span>
                  <a href="tel:+919473228888" className="font-semibold text-emerald-700 flex items-center gap-1.5 hover:underline">
                    <Phone className="w-4 h-4 text-emerald-600 shrink-0" />
                    +91 9473228888
                  </a>
                </div>
              </div>
            </section>
          </MotionFadeIn>

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

export default PrivacyPolicy;
