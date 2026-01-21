import React, { useState, useEffect } from 'react';
import { supabaseService } from '../services/supabaseService';
import { DonationDetails } from '../types';

const Donation: React.FC = () => {
  const [donorName, setDonorName] = useState('');
  const [amount, setAmount] = useState('');
  const [transactionId, setTransactionId] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isGenerating, setIsGenerating] = useState(false);
  const [details, setDetails] = useState<DonationDetails | null>(null);

  useEffect(() => {
    supabaseService
      .getDonationDetails()
      .then(setDetails)
      .catch(console.error);
  }, []);

  const handleGenerateReceipt = (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors: Record<string, string> = {};

    if (donorName.trim().length < 2)
      newErrors.name = 'Valid name required (min 2 characters).';

    if (!amount || Number(amount) <= 0)
      newErrors.amount = 'Positive amount required.';

    if (transactionId.trim().length < 4)
      newErrors.txn = 'Transaction ID required.';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    setIsGenerating(true);

    const safeName = donorName.trim();
    const safeAmount = amount.trim();
    const safeTxn = transactionId.trim();

    setTimeout(() => {
      const date = new Date().toLocaleDateString('en-IN', {
        dateStyle: 'long'
      });

      const receiptHtml = `
        <html>
          <head>
            <title>Receipt - Roti Bank Bettiah</title>
            <style>
              body { font-family: Inter, sans-serif; padding: 40px; background: #f8fafc; }
              .card { max-width: 550px; margin: auto; background: white; padding: 50px; border-radius: 32px; }
              h1 { color: #059669; }
              .row { display: flex; justify-content: space-between; margin-bottom: 16px; }
              .label { color: #64748b; font-size: 12px; }
              .value { font-weight: 700; }
            </style>
          </head>
          <body>
            <div class="card">
              <h1>Donation Receipt</h1>
              <div class="row"><span class="label">Donor Name</span><span class="value">${safeName}</span></div>
              <div class="row"><span class="label">Amount</span><span class="value">₹ ${safeAmount}</span></div>
              <div class="row"><span class="label">Transaction ID</span><span class="value">${safeTxn}</span></div>
              <div class="row"><span class="label">Date</span><span class="value">${date}</span></div>
              <p style="margin-top:40px;color:#64748b;font-size:12px">
                This is a system generated receipt for tax and record purposes.
              </p>
            </div>
          </body>
        </html>
      `;

      const win = window.open('', '_blank');
      if (win) {
        win.document.write(receiptHtml);
        win.document.close();
        win.print();
      }

      setIsGenerating(false);
    }, 1200);
  };

  return (
    <section id="donation" className="py-24 bg-slate-50">
      <div className="container mx-auto px-6">
        <h2 className="text-3xl font-extrabold text-center mb-16">
          Support Our Mission
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
          {/* QR Panel */}
          <div className="bg-white p-12 rounded-3xl shadow-xl text-center">
            <img
              src={details?.qrUrl || 'QR.png.jpg'}
              alt="QR Code"
              className="w-56 h-56 mx-auto rounded-3xl"
            />
            <p className="mt-6 font-bold">Secure Bank Transfer</p>
          </div>

          {/* Receipt Generator */}
          <div className="bg-slate-900 p-12 rounded-3xl text-white">
            <form onSubmit={handleGenerateReceipt} className="space-y-6">
              <input
                placeholder="Full Name"
                value={donorName}
                onChange={e => setDonorName(e.target.value)}
                className="w-full px-6 py-4 rounded-xl text-black"
              />
              {errors.name && <p className="text-red-400 text-xs">{errors.name}</p>}

              <input
                type="number"
                placeholder="Amount (INR)"
                value={amount}
                onChange={e => setAmount(e.target.value)}
                className="w-full px-6 py-4 rounded-xl text-black"
              />
              {errors.amount && <p className="text-red-400 text-xs">{errors.amount}</p>}

              <input
                placeholder="Transaction ID"
                value={transactionId}
                onChange={e => setTransactionId(e.target.value)}
                className="w-full px-6 py-4 rounded-xl text-black"
              />
              {errors.txn && <p className="text-red-400 text-xs">{errors.txn}</p>}

              <button
                disabled={isGenerating}
                className="w-full py-4 bg-emerald-600 rounded-xl font-bold"
              >
                {isGenerating ? 'Generating…' : 'Generate Receipt'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Donation;
