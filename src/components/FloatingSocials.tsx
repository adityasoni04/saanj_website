import React from "react";
import { Instagram } from "lucide-react";

// ✅ Official WhatsApp SVG
const WhatsAppIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 448 512"
    fill="currentColor"
    {...props}
  >
    <path d="M380.9 97.1C339 55.1 283.2 32 224.9 32 106.1 32 9.4 128.7 9.4 247.5c0 42.7 11.2 84.2 32.5 120.8L0 480l116.3-41.2c34.9 19 74.3 29 115.6 29h.1c118.8 0 215.5-96.7 215.5-215.5.1-58.3-23-114.1-65-156.2zM224.9 438.6h-.1c-36.5 0-72.3-9.8-103.4-28.3l-7.4-4.4-69 24.4 23.1-70.7-4.8-7.3c-20.4-31.4-31.2-68.1-31.2-105.8 0-108.7 88.5-197.2 197.2-197.2 52.7 0 102.3 20.5 139.6 57.8s57.8 87 57.8 139.6c0 108.7-88.5 197.2-197.2 197.2zm101.2-138.2c-5.5-2.8-32.8-16.2-37.9-18-5.1-1.9-8.8-2.8-12.5 2.8-3.7 5.5-14.3 18-17.5 21.8-3.2 3.7-6.4 4.1-11.9 1.4-5.5-2.8-23.2-8.5-44.2-27-16.3-14.5-27.3-32.4-30.5-37.9s-.3-8.4 2.5-11.1c2.6-2.6 5.8-6.8 8.7-10.2 2.9-3.4 3.8-5.8 5.8-9.6 1.9-3.7.9-7-0.5-9.8-1.4-2.8-12.5-30-17.1-41.1-4.5-10.8-9.1-9.3-12.5-9.5-3.2-.2-7-.3-10.8-.3s-9.8 1.4-14.9 7c-5.1 5.5-19.6 19.1-19.6 46.7 0 27.6 20.1 54.3 22.9 58 2.8 3.7 39.5 60.3 95.7 84.5 13.4 5.8 23.8 9.3 31.9 11.9 13.4 4.2 25.6 3.6 35.3 2.2 10.8-1.6 32.8-13.4 37.4-26.4 4.6-13 4.6-24.1 3.2-26.4-1.3-2.3-5-3.7-10.5-6.5z" />
  </svg>
);

const FloatingSocials = () => {
  return (
    <>
      {/* Custom smooth pulse animation */}
      <style>{`
        @keyframes smoothPulse {
          0%, 100% {
            transform: scale(1);
            box-shadow: 0 10px 20px rgba(0, 0, 0, 0.35);
          }
          50% {
            transform: scale(1.06);
            box-shadow: 0 14px 28px rgba(0, 0, 0, 0.45);
          }
        }
      `}</style>

      <div className="fixed right-5 bottom-8 z-50 flex flex-col gap-5">
        {/* WhatsApp */}
        {/* <a
          href="https://wa.me/91YOURPHONENUMBER"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Chat on WhatsApp"
          className="relative group"
        >
          <div
            className="h-12 w-12 rounded-full flex items-center justify-center 
                       bg-[#25D366] text-white 
                       shadow-[0_10px_20px_rgba(0,0,0,0.35),inset_0_2px_5px_rgba(255,255,255,0.2)]
                       border border-gray-300/60 backdrop-blur-md
                       transition-all duration-1000 ease-out 
                       animate-[smoothPulse_6s_ease-in-out_infinite]
                       hover:scale-110 hover:shadow-[0_12px_30px_rgba(37,211,102,0.6)]
                       transform hover:-translate-y-2"
          >
            <WhatsAppIcon className="h-7 w-7 drop-shadow-[0_2px_3px_rgba(0,0,0,0.5)]" />
          </div>
          <span
            className="absolute right-full top-1/2 -translate-y-1/2 mr-3 
                       bg-gray-900/90 text-white text-sm font-semibold px-3 py-1.5 rounded-lg
                       opacity-0 group-hover:opacity-100 
                       transition-all duration-300 ease-in-out
                       transform translate-x-2 group-hover:translate-x-0
                       shadow-xl"
          >
            WhatsApp
            <div
              className="absolute left-full top-1/2 -translate-y-1/2 
                          w-0 h-0 
                          border-t-[6px] border-t-transparent
                          border-b-[6px] border-b-transparent
                          border-l-[6px] border-l-gray-900"
            />
          </span>
        </a> */}

        {/* Instagram */}
        <a
          href="https://instagram.com/saanj1808"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Follow on Instagram"
          className="relative group"
        >
          <div
            className="h-12 w-12 rounded-full flex items-center justify-center 
                       bg-gradient-to-br from-pink-500 via-red-500 to-yellow-400 text-white 
                       shadow-[0_10px_20px_rgba(0,0,0,0.35),inset_0_2px_5px_rgba(255,255,255,0.2)]
                       border border-gray-300/60 backdrop-blur-md
                       transition-all duration-1000 ease-out
                       animate-[smoothPulse_6s_ease-in-out_infinite]
                       hover:scale-110 hover:shadow-[0_12px_30px_rgba(255,105,180,0.6)]
                       transform hover:-translate-y-2"
          >
            <Instagram className="h-7 w-7 drop-shadow-[0_2px_3px_rgba(0,0,0,0.5)]" />
          </div>

          {/* Tooltip */}
          <span
            className="absolute right-full top-1/2 -translate-y-1/2 mr-3 
                       bg-gray-900/90 text-white text-sm font-semibold px-3 py-1.5 rounded-lg
                       opacity-0 group-hover:opacity-100 
                       transition-all duration-300 ease-in-out
                       transform translate-x-2 group-hover:translate-x-0
                       shadow-xl"
          >
            Instagram
            <div
              className="absolute left-full top-1/2 -translate-y-1/2 
                          w-0 h-0 
                          border-t-[6px] border-t-transparent
                          border-b-[6px] border-b-transparent
                          border-l-[6px] border-l-gray-900"
            />
          </span>
        </a>
      </div>
    </>
  );
};

export default FloatingSocials;
