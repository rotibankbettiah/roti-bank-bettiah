import React from 'react';

interface VolunteerFormProps {
  isModal?: boolean;
  onClose?: () => void;
}

export const GOOGLE_FORM_URL = "https://docs.google.com/forms/d/e/1FAIpQLSfzN4WcusmcUmAKrpnpf4J8128O37tf7MpuJ_P96uKmX-sKsg/viewform?usp=dialog";
export const GOOGLE_FORM_EMBED_URL = "https://docs.google.com/forms/d/e/1FAIpQLSfzN4WcusmcUmAKrpnpf4J8128O37tf7MpuJ_P96uKmX-sKsg/viewform?embedded=true";

export const VolunteerForm: React.FC<VolunteerFormProps> = ({ isModal = false, onClose }) => {
  return (
    <div className={`relative bg-white rounded-3xl ${isModal ? 'p-6 md:p-8 max-h-[90vh] overflow-y-auto' : 'p-6 md:p-10 shadow-xl border border-slate-100'}`}>
      {/* Modal Close Button */}
      {isModal && onClose && (
        <button
          type="button"
          onClick={onClose}
          aria-label="Close form"
          className="absolute top-6 right-6 w-10 h-10 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition-all z-10"
        >
          <i className="fas fa-times"></i>
        </button>
      )}

      {/* Header with verified badge and direct action button */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-slate-100 mb-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-emerald-50 text-emerald-800 rounded-lg text-xs font-bold uppercase tracking-wider mb-2">
            <i className="fas fa-hands-helping text-emerald-600"></i>
            Official Volunteer Application
          </div>
          <h3 className="text-xl md:text-2xl font-extrabold text-slate-900 tracking-tight">
            Join Our Volunteer Family
          </h3>
          <p className="text-slate-500 text-xs md:text-sm mt-1">
            Fill out the official Google Form below or open directly in Google Forms.
          </p>
        </div>

        <a
          href={GOOGLE_FORM_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="px-5 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-all shadow-md active:scale-95 flex items-center gap-2 whitespace-nowrap"
          id="open-google-form-direct-btn"
        >
          <span>Open Google Form</span>
          <i className="fas fa-external-link-alt text-[10px]"></i>
        </a>
      </div>

      {/* Embedded Google Form directly */}
      <div className="w-full bg-slate-50 rounded-2xl overflow-hidden border border-slate-200 shadow-inner min-h-[750px] relative">
        <iframe
          src={GOOGLE_FORM_EMBED_URL}
          width="100%"
          height="800"
          frameBorder="0"
          marginHeight={0}
          marginWidth={0}
          className="w-full rounded-2xl"
          title="Official Roti Bank Bettiah Volunteer Google Form"
        >
          Loading Volunteer Form…
        </iframe>
      </div>
    </div>
  );
};

export default VolunteerForm;
