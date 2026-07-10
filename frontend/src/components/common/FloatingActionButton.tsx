import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Sparkles, MessagesSquare, MessageCircle } from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";
import { FeedbackPopup } from './FeedbackPopup';

const FloatingActionButton: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const hiddenPages = [
    "/login",
    "/register",
    "/book-consultation",
    "/my-consultations",
    "/dashboard",
    "/assessment",
    "/connect",
    "/resume-form"
  ];
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const fab = document.getElementById("fab-wrapper");
      if (fab && !fab.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  if (hiddenPages.includes(location.pathname)) return null;

  return (
    <div id="fab-wrapper" className="fixed bottom-12 right-6 sm:bottom-6 sm:right-6 z-50 flex flex-col items-end pointer-events-none" onClick={(e) => { if (open) e.stopPropagation(); }}>

      {/* Options */}
      <div
        className={`flex flex-col items-end mb-3 space-y-3 transition-all duration-500 ${open
          ? "opacity-100 translate-y-0 pointer-events-auto"
          : "opacity-0 translate-y-4 pointer-events-none"
          }`}
      >
        <button
          onClick={() => navigate("/book-consultation")}
          className="option-btn flex items-center gap-2 live-badge-btn"
        >
          <MessagesSquare size={18} /> Talk to Expert
          <span className="live-pill">LIVE</span>
        </button>

        <button
          onClick={() => {
            setIsFeedbackOpen(true);
            setOpen(false);
          }}
          className="option-btn flex items-center gap-2"
        >
          <MessageCircle size={18} /> Give Feedback
        </button>

        <button
          onClick={() => {
            const message = encodeURIComponent("Hi! I'm interested in taking admission through EduNiaa. Kindly assist me.");
            window.open(`https://wa.me/919163591151?text=${message}`, '_blank');
          }}
          className="option-btn whatsapp-btn flex items-center gap-2"
        >
          <FaWhatsapp size={18} /> WhatsApp Us
        </button>
      </div>

      {/* Main Floating Button */}

      <button
        onClick={(e) => {
          e.stopPropagation();
          setOpen(!open);
        }}
        className={`fab-bubble mobile-fab ${open ? "fab-open" : ""} pointer-events-auto`}
      >
        {open ? (
          <span className="text-white text-xl font-bold">✕</span>
        ) : (
          /* 🔥 NEW ATTRACTIVE ICON FOR GUIDANCE/CONSULTATION */
          <Sparkles size={30} color="white" strokeWidth={2.2} />
        )}
      </button>

      <FeedbackPopup 
        isOpen={isFeedbackOpen} 
        onClose={() => setIsFeedbackOpen(false)} 
      />

      <style>{`

      
        .fab-bubble {
          background: linear-gradient(135deg, #0B2447 0%, #19376D 100%);
          width: 70px;      /* Laptop size */
          height: 70px;     /* Laptop size */
          padding: 14px;
          border-radius: 50px 50px 20px 50px;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 3px solid white;
          box-shadow: 0 10px 25px rgba(0,0,0,0.22);
          transition: transform 220ms cubic-bezier(.2,.9,.3,1), box-shadow 220ms ease;
    cursor: pointer;

  

        }

       /* Hover: smooth and noticeable but not janky */
  .fab-bubble:hover {
    transform: translateY(-4px) scale(1.04); /* tweak scale here */
    box-shadow: 0 14px 30px rgba(11,36,71,0.36);
  }

        /*  MOBILE RESPONSIVE SIZE (Edit freely!) */
        @media (max-width: 480px) {
          .fab-bubble {
            width: 52px;     /* <-- adjust mobile width here */
            height: 52px;    /* <-- adjust mobile height here */
            padding: 8px;   /* <-- adjust mobile padding here */
            border-radius: 40px 40px 15px 40px;
          }
          .fab-bubble svg {
            width: 22px;     /* <-- icon size for mobile */
            height: 22px;    /* <-- icon size for mobile */
          }
            .mobile-fab {
        margin-right: -14px;
        margin-bottom: -14px;}

        .option-btn {
        margin-right: -14px;
       padding: 8px 14px !important;
       font-size: 14px !important;
        }

       .live-pill {
       padding: 1.3px 6px .7px 6px!important;
       right: -8px !important;
       font-size: 9px !important;
       }
        }


        .fab-open {
          transform: scale(1.05);

        
        }


         .option-btn {
    background: rgba(11, 36, 71, 0.94);
    color: #fff;
    padding: 10px 18px;
    border-radius: 14px;
    font-size: 15px;
    font-weight: 600;
    backdrop-filter: blur(6px);
    border: 1px solid rgba(255,255,255,0.18);
    box-shadow: 0 6px 14px rgba(4,16,30,0.18);
    transition: transform 180ms ease, background 180ms ease;
  }


          .option-btn:hover { transform: translateX(-6px); background: rgba(15,45,90,1); }

          .whatsapp-btn {
            background: linear-gradient(135deg, #25D366 0%, #128C7E 100%);
            border: 1px solid rgba(255,255,255,0.3);
          }

          .whatsapp-btn:hover {
            background: linear-gradient(135deg, #20BA5A 0%, #0E7A6E 100%);
            transform: translateX(-6px) scale(1.02);
          }

          /* Soft glowing pulse + gentle float */
.fab-bubble:not(.fab-open) {
  animation: subtle-float 3.5s ease-in-out infinite, 
             glow-pulse 4s ease-in-out infinite;
}

/* Light floating motion */
@keyframes subtle-float {
  0% { transform: translateY(0); }
  50% { transform: translateY(-4.5px); }
  100% { transform: translateY(0); }
}

/* Soft ambient glow effect */
@keyframes glow-pulse {
  0% {
    box-shadow: 0 10px 25px rgba(11,36,71,0.28);
  }
  50% {
    box-shadow: 0 14px 32px rgba(11,36,71,0.38);
  }
  100% {
    box-shadow: 0 10px 25px rgba(11,36,71,0.28);
  }
}

.live-badge-btn {
  position: relative;
}

.live-pill {
  position: absolute;
  top: -9.8px;
  right: -12px;
  background: red;     /* Premium red */
  color: white;
  font-size: 10px;
  font-weight: 700;
  padding: 2px 8px;
  border-radius: 15px;
  border: 1.7px solid white;
  box-shadow: 0 2px 6px rgba(0,0,0,0.25);
}



      `}</style>
    </div>
  );
};

export default FloatingActionButton;



