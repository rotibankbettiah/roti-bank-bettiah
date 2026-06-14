import React, { useState, useEffect } from 'react';
import { supabaseService } from '../services/supabaseService';
import { razorpayService, DONATION_TIERS } from '../services/razorpayService';
import { DonationDetails } from '../types';
import Confetti from 'react-confetti';
import { motion } from 'framer-motion';

const Donation: React.FC = () => {
  const [selectedAmount, setSelectedAmount] = useState<number>(500);
  const [customAmount, setCustomAmount] = useState('');
  const [isCustom, setIsCustom] = useState(false);
  const [donorName, setDonorName] = useState('');
  const [donorEmail, setDonorEmail] = useState('');
  const [donorPhone, setDonorPhone] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [paymentError, setPaymentError] = useState('');
  const [paymentId, setPaymentId] = useState('');
  const [details, setDetails] = useState<DonationDetails | null>(null);
  const [showBankDetails, setShowBankDetails] = useState(true);
  const [windowSize, setWindowSize] = useState({ width: window.innerWidth, height: window.innerHeight });

  useEffect(() => {
    const handleResize = () => setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    supabaseService
      .getDonationDetails()
      .then(setDetails)
      .catch(console.error);
  }, []);

  const getActiveAmount = () => {
    if (isCustom && customAmount) return parseInt(customAmount);
    return selectedAmount;
  };

  const triggerPrintReceipt = (
    name: string,
    email: string,
    phone: string,
    amountVal: string | number,
    paymentIdVal: string
  ) => {
    const safeName = name.trim() || 'Valued Donor';
    const safeEmail = email.trim() || 'N/A';
    const safePhone = phone.trim() || 'N/A';
    const date = new Date().toLocaleDateString('en-IN', {
      dateStyle: 'long'
    });
    const receiptNo = `RBB-${Date.now().toString().slice(-6)}-${paymentIdVal.slice(-6).toUpperCase()}`;

    // Convert amount to words
    const amountInWords = (num: number): string => {
      const a = [
        '', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten',
        'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'
      ];
      const b = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];
      
      const numToWords = (n: number): string => {
        if (n < 20) return a[n];
        const digit = n % 10;
        if (n < 100) return b[Math.floor(n / 10)] + (digit ? ' ' + a[digit] : '');
        if (n < 1000) return a[Math.floor(n / 100)] + ' Hundred' + (n % 100 === 0 ? '' : ' and ' + numToWords(n % 100));
        return '';
      };
      
      if (num === 0) return 'Zero';
      
      let words = '';
      let tempNum = num;
      if (tempNum >= 1000) {
        words += numToWords(Math.floor(tempNum / 1000)) + ' Thousand ';
        tempNum %= 1000;
      }
      if (tempNum > 0) {
        words += numToWords(tempNum);
      }
      return words + ' Rupees Only';
    };

    const amtNum = typeof amountVal === 'string' ? parseInt(amountVal) || 0 : amountVal;
    const wordsText = amountInWords(amtNum);

    const receiptHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Receipt_${receiptNo}</title>
          <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;700;900&display=swap" rel="stylesheet" />
          <style>
            @page {
              size: A4;
              margin: 15mm;
            }
            body {
              font-family: 'Outfit', sans-serif;
              color: #1e293b;
              background: #fff;
              margin: 0;
              padding: 0;
              -webkit-print-color-adjust: exact;
              print-color-adjust: exact;
            }
            .receipt-box {
              border: 1px solid #e2e8f0;
              border-radius: 24px;
              padding: 30px;
              max-width: 175mm;
              margin: auto;
              position: relative;
              background: #fff;
            }
            .header {
              display: flex;
              justify-content: space-between;
              align-items: center;
              border-bottom: 2px solid #10b981;
              padding-bottom: 20px;
              margin-bottom: 25px;
            }
            .logo-details {
              display: flex;
              align-items: center;
              gap: 15px;
            }
            .logo-details img {
              width: 60px;
              height: 60px;
              border-radius: 50%;
            }
            .org-title {
              font-size: 24px;
              font-weight: 900;
              color: #065f46;
              margin: 0;
            }
            .org-subtitle {
              font-size: 11px;
              color: #64748b;
              margin: 3px 0 0 0;
              font-weight: 700;
              text-transform: uppercase;
              letter-spacing: 0.05em;
            }
            .reg-info {
              text-align: right;
              font-size: 11px;
              color: #475569;
            }
            .reg-badge {
              background: #ecfdf5;
              color: #065f46;
              padding: 4px 10px;
              border-radius: 12px;
              font-weight: 700;
              display: inline-block;
              margin-bottom: 5px;
            }
            .receipt-title-bar {
              text-align: center;
              margin-bottom: 30px;
            }
            .receipt-title {
              font-size: 20px;
              font-weight: 900;
              color: #0f172a;
              text-transform: uppercase;
              letter-spacing: 0.1em;
              margin: 0;
              display: inline-block;
              border-bottom: 3px solid #10b981;
              padding-bottom: 5px;
            }
            .tax-80g-alert {
              background: #f0fdf4;
              border: 1px dashed #bbf7d0;
              color: #166534;
              padding: 12px;
              border-radius: 12px;
              font-size: 12px;
              font-weight: 700;
              text-align: center;
              margin-bottom: 25px;
            }
            .info-grid {
              display: grid;
              grid-template-columns: 1fr 1fr;
              gap: 15px;
              margin-bottom: 30px;
            }
            .info-item {
              background: #f8fafc;
              padding: 15px;
              border-radius: 16px;
              border: 1px solid #f1f5f9;
            }
            .info-label {
              font-size: 10px;
              color: #64748b;
              text-transform: uppercase;
              letter-spacing: 0.05em;
              font-weight: 700;
              margin-bottom: 4px;
            }
            .info-value {
              font-size: 14px;
              font-weight: 700;
              color: #0f172a;
            }
            .amount-section {
              background: linear-gradient(135deg, #065f46, #0f766e);
              color: white;
              padding: 20px 25px;
              border-radius: 18px;
              display: flex;
              justify-content: space-between;
              align-items: center;
              margin-bottom: 30px;
            }
            .amount-num {
              font-size: 28px;
              font-weight: 900;
            }
            .amount-words {
              font-size: 13px;
              font-weight: 700;
              opacity: 0.9;
              max-width: 60%;
              text-align: right;
            }
            .receipt-table {
              width: 100%;
              border-collapse: collapse;
              margin-bottom: 40px;
            }
            .receipt-table th {
              background: #f1f5f9;
              text-align: left;
              padding: 12px;
              font-size: 11px;
              font-weight: 700;
              color: #475569;
              text-transform: uppercase;
            }
            .receipt-table td {
              padding: 15px 12px;
              border-bottom: 1px solid #e2e8f0;
              font-size: 13px;
            }
            .footer-section {
              display: flex;
              justify-content: space-between;
              align-items: flex-end;
              margin-top: 50px;
            }
            .signature-block {
              text-align: center;
              width: 150px;
            }
            .signature-line {
              border-top: 1px solid #94a3b8;
              margin-top: 40px;
              padding-top: 8px;
              font-size: 11px;
              font-weight: 700;
              color: #475569;
            }
            .stamp {
              width: 80px;
              height: 80px;
              border-radius: 50%;
              border: 2px dashed #065f46;
              display: flex;
              align-items: center;
              justify-content: center;
              color: #065f46;
              font-weight: 900;
              font-size: 10px;
              text-transform: uppercase;
              letter-spacing: 0.05em;
              opacity: 0.4;
              margin: 0 auto 5px auto;
              transform: rotate(-10deg);
            }
            .legal-disclaimer {
              font-size: 10px;
              color: #94a3b8;
              text-align: center;
              border-top: 1px solid #e2e8f0;
              margin-top: 40px;
              padding-top: 15px;
              line-height: 1.5;
            }
            @media print {
              .receipt-box {
                border: none;
                padding: 0;
              }
            }
          </style>
        </head>
        <body>
          <div class="receipt-box">
            <div class="header">
              <div class="logo-details">
                <img src="/logo.png" alt="Roti Bank Bettiah Logo" />
                <div>
                  <h1 class="org-title">ROTI BANK BETTIAH</h1>
                  <p class="org-subtitle">Nourishing Lives, Sharing Compassion</p>
                </div>
              </div>
              <div class="reg-info">
                <span class="reg-badge">Govt. Registered NGO</span><br/>
                Reg No: <strong>5071/2023</strong><br/>
                ISO Certified non-profit
              </div>
            </div>

            <div class="receipt-title-bar">
              <h2 class="receipt-title">Donation Receipt</h2>
            </div>

            <div class="tax-80g-alert">
              ✓ All Donations are Tax Exempt under Section 80G of the Income Tax Act, 1961
            </div>

            <div class="info-grid">
              <div class="info-item">
                <div class="info-label">Receipt Number</div>
                <div class="info-value">${receiptNo}</div>
              </div>
              <div class="info-item">
                <div class="info-label">Date of Payment</div>
                <div class="info-value">${date}</div>
              </div>
              <div class="info-item">
                <div class="info-label">Donor Name</div>
                <div class="info-value">${safeName}</div>
              </div>
              <div class="info-item">
                <div class="info-label">Payment Mode</div>
                <div class="info-value">Online Gateway (Razorpay)</div>
              </div>
            </div>

            <table class="receipt-table">
              <thead>
                <tr>
                  <th>Description</th>
                  <th style="text-align: right;">Amount (INR)</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td style="font-weight: 700;">Charitable Contribution to Roti Bank Bettiah <br/>
                  <span style="font-size: 11px; font-weight: normal; color: #64748b;">Eradication of Hunger & Food Security Operations</span></td>
                  <td style="text-align: right; font-weight: 900; font-size: 16px;">₹${amtNum.toLocaleString('en-IN')}.00</td>
                </tr>
              </tbody>
            </table>

            <div class="amount-section">
              <div class="amount-num">Total: ₹${amtNum.toLocaleString('en-IN')}.00</div>
              <div class="amount-words">${wordsText}</div>
            </div>

            <div class="footer-section">
              <div style="font-size: 12px; color: #475569;">
                <strong>Contact Details:</strong><br/>
                Kalibag Chowk, Bettiah, Bihar - 845438<br/>
                Email: rotibankbettiah@gmail.com<br/>
                Phone: +91 9473228888
              </div>
              
              <div class="signature-block">
                <div class="stamp">ROTI BANK<br/>BETTIAH</div>
                <div class="signature-line">Authorized Signatory</div>
              </div>
            </div>

            <div class="legal-disclaimer">
              This is a computer-generated receipt issued in respect of the contribution received towards Roti Bank Bettiah.<br/>
              No signature is required. Thank you for your support.
            </div>
          </div>
          <script>
            window.onload = function() {
              window.print();
            }
          </script>
        </body>
      </html>
    `;

    const win = window.open('', '_blank');
    if (win) {
      win.document.write(receiptHtml);
      win.document.close();
    }
  };

  const handleRazorpayPayment = async () => {
    const amt = getActiveAmount();
    if (!amt || amt < 1) return;

    setIsProcessing(true);
    setPaymentSuccess(false);
    setPaymentError('');

    const result = await razorpayService.openCheckout(
      amt,
      donorName || undefined,
      donorEmail || undefined,
      donorPhone || undefined
    );

    setIsProcessing(false);

    if (result.success && result.paymentId) {
      setPaymentSuccess(true);
      setPaymentId(result.paymentId);
      
      // Automatically trigger receipt printing/PDF saving!
      triggerPrintReceipt(
        donorName || 'Valued Donor',
        donorEmail || '',
        donorPhone || '',
        amt,
        result.paymentId
      );
    } else if (result.error) {
      setPaymentError(result.error);
    }
  };

  const currentImpact = razorpayService.getImpactForAmount(getActiveAmount());

  return (
    <section id="donation" className="py-24 bg-gradient-to-br from-slate-50 via-white to-emerald-50 relative overflow-hidden scroll-mt-24">
      {paymentSuccess && (
        <div className="fixed inset-0 z-50 pointer-events-none">
          <Confetti 
            width={windowSize.width} 
            height={windowSize.height} 
            recycle={false} 
            numberOfPieces={800} 
            gravity={0.15}
          />
        </div>
      )}
      {/* Decorative elements */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-100/30 rounded-full blur-3xl -mr-40 -mt-40"></div>
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-emerald-100/30 rounded-full blur-3xl -ml-40 -mb-40"></div>

      <div className="container mx-auto px-6 relative z-10">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="inline-block px-5 py-2 bg-emerald-100 text-emerald-700 rounded-full text-[10px] font-black uppercase tracking-[0.2em] mb-6">
            <i className="fas fa-hand-holding-heart mr-2"></i>Make a Difference
          </span>
          <h2 className="text-3xl md:text-5xl font-extrabold text-slate-900 section-title tracking-tight">
            Support Our Mission
          </h2>
          <p className="text-slate-500 mt-6 max-w-2xl mx-auto text-lg">
            Every rupee you donate helps us serve warm meals to the hungry. Your generosity can change lives.
          </p>
        </div>

        {/* Impact Indicators */}
        <div className="flex flex-wrap justify-center gap-6 mb-16">
          {[
            { icon: 'fa-utensils', text: '₹10 = 1 Meal', color: 'emerald' },
            { icon: 'fa-people-group', text: '₹100 = 10 Meals', color: 'emerald' },
            { icon: 'fa-house-chimney', text: '₹500 = Family/Week', color: 'emerald' },
          ].map((item, i) => (
            <div key={i} className="flex items-center gap-3 px-6 py-3 bg-white rounded-full shadow-md border border-emerald-100 trust-badge">
              <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center">
                <i className={`fas ${item.icon} text-emerald-600 text-xs`}></i>
              </div>
              <span className="text-sm font-bold text-slate-700">{item.text}</span>
            </div>
          ))}
        </div>

        <div className="max-w-6xl mx-auto">
          {/* Main Donation Flow */}
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">
            {/* Left: Amount Selection (3 cols) */}
            <div className="lg:col-span-3 space-y-8">
              {/* Preset Amount Cards */}
              <div className="bg-white p-8 md:p-10 rounded-[2.5rem] shadow-xl shadow-emerald-100/30 border border-emerald-50">
                <h3 className="text-xl font-bold text-slate-900 mb-2">
                  <i className="fas fa-coins text-emerald-500 mr-2"></i>Choose Donation Amount
                </h3>
                <p className="text-slate-400 text-sm mb-8">Select a preset amount or enter your own</p>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
                  {DONATION_TIERS.map((tier) => (
                    <motion.button
                      key={tier.amount}
                      whileHover={{ scale: 1.05, y: -5 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => { setSelectedAmount(tier.amount); setIsCustom(false); }}
                      className={`p-5 rounded-2xl border-2 text-left transition-colors glow-card-emerald ${
                        !isCustom && selectedAmount === tier.amount
                          ? 'border-emerald-500 bg-emerald-50/50 shadow-lg shadow-emerald-500/20'
                          : 'border-slate-100 bg-slate-50 hover:border-emerald-200'
                      }`}
                    >
                      <i className={`fas ${tier.icon} text-emerald-500 text-lg mb-3 block`}></i>
                      <p className="text-2xl font-black text-slate-900">{tier.label}</p>
                      <p className="text-[11px] text-emerald-600 font-bold mt-1">{tier.impact}</p>
                    </motion.button>
                  ))}

                  {/* Custom amount */}
                  <motion.button
                    whileHover={{ scale: 1.05, y: -5 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setIsCustom(true)}
                    className={`p-5 rounded-2xl border-2 text-left transition-colors glow-card-emerald ${
                      isCustom ? 'border-emerald-500 bg-emerald-50/50 shadow-lg shadow-emerald-500/20' : 'border-slate-100 bg-slate-50 hover:border-emerald-200'
                    }`}
                  >
                    <i className="fas fa-pen text-emerald-500 text-lg mb-3 block"></i>
                    <p className="text-lg font-black text-slate-900">Custom</p>
                    <p className="text-[11px] text-emerald-600 font-bold mt-1">Enter any amount</p>
                  </motion.button>
                </div>

                {isCustom && (
                  <div className="mb-6">
                    <div className="relative">
                      <span className="absolute left-5 top-1/2 -translate-y-1/2 text-2xl font-bold text-slate-400">₹</span>
                      <input
                        type="number"
                        min="1"
                        placeholder="Enter amount"
                        value={customAmount}
                        onChange={(e) => setCustomAmount(e.target.value)}
                        className="w-full pl-12 pr-6 py-5 text-2xl font-bold rounded-2xl border-2 border-emerald-200 focus:border-emerald-500 focus:outline-none focus:ring-4 focus:ring-emerald-500/10 transition-all bg-emerald-50/30"
                        id="custom-amount-input"
                      />
                    </div>
                  </div>
                )}

                {/* Current Impact */}
                <div className="bg-emerald-50 p-5 rounded-2xl border border-emerald-100 flex items-center gap-4">
                  <div className="w-12 h-12 bg-emerald-600 rounded-xl flex items-center justify-center flex-shrink-0">
                    <i className="fas fa-seedling text-white text-lg"></i>
                  </div>
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-emerald-600 mb-1">Your Impact</p>
                    <p className="text-slate-700 font-bold">{currentImpact}</p>
                  </div>
                </div>

                {/* Donor Info (optional) */}
                <div className="mt-6 space-y-3">
                  <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">
                    <i className="fas fa-user mr-1"></i> Donor Information (optional)
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <input
                      placeholder="Full Name"
                      value={donorName}
                      onChange={(e) => setDonorName(e.target.value)}
                      className="px-5 py-3.5 rounded-xl border border-slate-200 focus:border-emerald-500 focus:outline-none focus:ring-4 focus:ring-emerald-500/10 text-sm transition-all"
                      id="donor-name-input"
                    />
                    <input
                      type="email"
                      placeholder="Email"
                      value={donorEmail}
                      onChange={(e) => setDonorEmail(e.target.value)}
                      className="px-5 py-3.5 rounded-xl border border-slate-200 focus:border-emerald-500 focus:outline-none focus:ring-4 focus:ring-emerald-500/10 text-sm transition-all"
                      id="donor-email-input"
                    />
                    <input
                      type="tel"
                      placeholder="Phone"
                      value={donorPhone}
                      onChange={(e) => setDonorPhone(e.target.value)}
                      className="px-5 py-3.5 rounded-xl border border-slate-200 focus:border-emerald-500 focus:outline-none focus:ring-4 focus:ring-emerald-500/10 text-sm transition-all"
                      id="donor-phone-input"
                    />
                  </div>
                </div>

                {/* Pay Button */}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleRazorpayPayment}
                  disabled={isProcessing || (!selectedAmount && !customAmount)}
                  className="w-full mt-8 py-5 bg-emerald-600 text-white rounded-2xl font-black text-lg uppercase tracking-wider shadow-[0_0_40px_rgba(16,185,129,0.3)] hover:shadow-[0_0_60px_rgba(16,185,129,0.5)] transition-all disabled:opacity-50 disabled:cursor-not-allowed donate-btn-shimmer flex items-center justify-center gap-3 relative overflow-hidden group"
                  id="razorpay-donate-btn"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 to-emerald-400 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  <span className="relative z-10 flex items-center gap-3">
                    {isProcessing ? (
                      <>
                        <i className="fas fa-spinner fa-spin"></i> Processing...
                      </>
                    ) : (
                      <>
                        <i className="fas fa-lock text-sm"></i>
                        Donate ₹{getActiveAmount().toLocaleString('en-IN')} Securely
                        <i className="fas fa-arrow-right text-sm group-hover:translate-x-1 transition-transform"></i>
                      </>
                    )}
                  </span>
                </motion.button>

                {/* Payment error message */}
                {paymentError && (
                  <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-2xl flex items-start gap-3">
                    <i className="fas fa-circle-exclamation text-red-500 mt-1"></i>
                    <p className="text-sm text-red-700 font-medium leading-relaxed">{paymentError}</p>
                  </div>
                )}

                {/* Payment success message */}
                {paymentSuccess && (
                  <div className="mt-6 p-6 bg-emerald-50 border-2 border-emerald-200 rounded-2xl text-center">
                    <div className="w-16 h-16 bg-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4 animate-glow">
                      <i className="fas fa-check text-white text-2xl animate-bounce"></i>
                    </div>
                    <h4 className="text-xl font-bold text-emerald-800 mb-2">Thank You! 🙏</h4>
                    <p className="text-emerald-600 text-sm mb-2 font-bold">Your donation was successful!</p>
                    <p className="text-xs text-slate-500 mb-4">Payment ID: <strong>{paymentId}</strong></p>
                    
                    <div className="p-4 bg-white/80 rounded-2xl border border-emerald-100 flex flex-col items-center gap-3">
                      <p className="text-xs text-slate-500 leading-relaxed font-medium">
                        Your official A4 tax-exemption receipt has been generated automatically.
                      </p>
                      <div className="flex flex-col sm:flex-row gap-3 w-full justify-center">
                        <button
                          onClick={() => triggerPrintReceipt(donorName, donorEmail, donorPhone, getActiveAmount(), paymentId)}
                          className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-2 active:scale-95 shadow-sm"
                        >
                          <i className="fas fa-print"></i> Print Receipt
                        </button>
                        <button
                          onClick={() => triggerPrintReceipt(donorName, donorEmail, donorPhone, getActiveAmount(), paymentId)}
                          className="px-5 py-2.5 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-2 active:scale-95 shadow-sm"
                        >
                          <i className="fas fa-file-pdf text-red-500"></i> Save as PDF (A4)
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Trust badges */}
                <div className="flex flex-wrap justify-center gap-4 mt-8">
                  {[
                    { icon: 'fa-shield-halved', text: '256-bit Encrypted' },
                    { icon: 'fa-building-columns', text: 'RBI Regulated' },
                    { icon: 'fa-file-invoice', text: '80G Tax Benefit' },
                  ].map((badge, i) => (
                    <div key={i} className="flex items-center gap-2 text-[10px] text-slate-400 font-bold uppercase tracking-wider trust-badge">
                      <i className={`fas ${badge.icon} text-emerald-500`}></i>
                      {badge.text}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right: Bank Transfer & Receipt (2 cols) */}
            <div className="lg:col-span-2 space-y-8">
              {/* Alternative: Bank Transfer */}
              <div className="bg-white p-8 rounded-[2.5rem] shadow-xl shadow-slate-100/50 border border-slate-100">
                <button
                  onClick={() => setShowBankDetails(!showBankDetails)}
                  className="w-full flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center">
                      <i className="fas fa-building-columns text-slate-500"></i>
                    </div>
                    <div className="text-left">
                      <h3 className="font-bold text-slate-900">Bank Transfer / UPI</h3>
                      <p className="text-xs text-slate-400">Alternative payment method</p>
                    </div>
                  </div>
                  <i className={`fas fa-chevron-${showBankDetails ? 'up' : 'down'} text-slate-400`}></i>
                </button>

                {showBankDetails && (
                  <div className="mt-6 space-y-6">
                    {/* QR Code */}
                    <div className="text-center">
                      <div className="bg-white p-4 rounded-2xl shadow-inner border border-slate-100 inline-block">
                        <img
                          src={details?.qrUrl || 'QR.png.jpg'}
                          alt="UPI QR Code for Roti Bank Bettiah Donation"
                          className="w-48 h-48 rounded-xl"
                        />
                      </div>
                      <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-4">
                        <i className="fas fa-mobile-screen mr-1"></i> Scan with any UPI App
                      </p>
                    </div>

                    {/* Bank Details */}
                    <div className="space-y-3">
                      <h4 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-4">
                        <i className="fas fa-university mr-1"></i> Bank Details
                      </h4>
                      {[
                        { label: 'Account Holder', value: details?.accountHolder || 'ROTI BANK BETTIAH' },
                        { label: 'Bank', value: details?.bankName || 'Punjab National Bank' },
                        { label: 'Account No.', value: details?.accountNumber || '1919202100001486' },
                        { label: 'IFSC Code', value: details?.ifscCode || 'PUNB0191920' },
                      ].map((item, i) => (
                        <div key={i} className="flex justify-between items-center py-2.5 border-b border-slate-50">
                          <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">{item.label}</span>
                          <span className="text-sm font-bold text-slate-800 font-mono">{item.value}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Razorpay badge */}
              <div className="text-center">
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest flex items-center justify-center gap-2">
                  <i className="fas fa-lock text-emerald-500"></i>
                  Secured by Razorpay
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Donation;
