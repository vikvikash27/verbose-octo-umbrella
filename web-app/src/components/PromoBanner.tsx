import React from 'react';

// Using a placeholder image URL to avoid build errors if the local file is missing.
const promoBannerImageUrl = 'https://i.imgur.com/08sJ47j.png';

const PromoBanner: React.FC = () => {
  return (
    <section className="bg-slate-50">
      <div className="container mx-auto px-4 sm:px-6 py-4 md:py-6">
        {/* The banner is made clickable, pointing to a potential promotion page. */}
        <a href="#" aria-label="Discover our range of EasyOrganic Honey products.">
          <img
            src={promoBannerImageUrl}
            alt="Promotional banner for EasyOrganic honey, showing various jars and bottles of honey with a honeycomb on a yellow background."
            className="w-full h-auto rounded-xl shadow-lg hover:shadow-2xl transition-shadow duration-300"
          />
        </a>
      </div>
    </section>
  );
};

export default PromoBanner;
