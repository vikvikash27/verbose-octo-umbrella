import React from 'react';
import Input from './ui/Input';
import Button from './ui/Button';
import { AppStoreBadgeIcon, GooglePlayBadgeIcon, QrCodeIcon } from './icons';

const AppDownloadBanner: React.FC = () => {
  const VerticalDivider = () => (
    <div className="self-stretch items-center justify-center hidden lg:flex">
       <div className="flex flex-col items-center justify-center h-full gap-2">
            <div className="w-px flex-grow bg-slate-200"></div>
            <span className="flex-shrink-0 text-xs font-semibold text-slate-400 border-2 border-slate-200 rounded-full w-9 h-9 flex items-center justify-center">OR</span>
            <div className="w-px flex-grow bg-slate-200"></div>
       </div>
    </div>
  );
  
  const HorizontalDivider = () => (
     <div className="self-stretch items-center justify-center flex lg:hidden w-full my-6">
       <div className="flex items-center justify-center w-full gap-2">
            <div className="h-px flex-grow bg-slate-200"></div>
            <span className="flex-shrink-0 text-xs font-semibold text-slate-400 border-2 border-slate-200 rounded-full w-9 h-9 flex items-center justify-center">OR</span>
            <div className="h-px flex-grow bg-slate-200"></div>
       </div>
    </div>
  );

  return (
    <section className="bg-subtle-bg">
        <div className="container mx-auto px-6 py-12">
            <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
                    {/* Left side: Text content */}
                    <div className="lg:col-span-1 text-center lg:text-left">
                        <h2 className="text-3xl font-bold text-slate-800">Experience Convenience</h2>
                        <p className="text-slate-600 mt-2">Get the EasyOrganic app for a faster, easier shopping experience.</p>
                        <div className="mt-6 flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                            <AppStoreBadgeIcon className="h-12 w-auto cursor-pointer"/>
                            <GooglePlayBadgeIcon className="h-12 w-auto cursor-pointer"/>
                        </div>
                    </div>

                    <VerticalDivider />

                    {/* Right side: QR code and link form */}
                    <div className="lg:col-span-1 flex flex-col items-center">
                        <div className="flex flex-col md:flex-row lg:flex-col items-center gap-8 w-full justify-center">
                            <div className="text-center">
                                <QrCodeIcon className="w-28 h-28 mx-auto text-slate-700"/>
                                <p className="mt-2 font-semibold text-slate-700">Scan to Download</p>
                            </div>
                            
                            <HorizontalDivider />

                            <form className="w-full max-w-sm" onSubmit={(e) => e.preventDefault()}>
                                <p className="font-semibold text-slate-700 mb-2 text-center md:text-left lg:text-center">Get the download link</p>
                                <div className="flex flex-col sm:flex-row gap-2">
                                    <Input type="tel" placeholder="Enter phone number" className="flex-grow" containerClassName="w-full" />
                                    <Button type="submit">Send</Button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>
  );
};

export default AppDownloadBanner;
