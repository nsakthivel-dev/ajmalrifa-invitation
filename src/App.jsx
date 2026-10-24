import React, { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Calendar,
  MapPin,
  Heart,
  VolumeX,
  ChevronDown,
  Sparkles,
  Clock,
  Copy,
  MessageCircle,
  Navigation,
} from "lucide-react";

// Calendar Page Unit with realistic back-to-front shift animation & centered numbers
function CalendarPageFlip({ value, label }) {
  const formatted = String(value).padStart(2, "0");

  return (
    <div className="calendar-unit flex flex-col items-center">
      {/* Calendar Card Stack */}
      <div
        className="calendar-stack relative w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 flex items-center justify-center"
        style={{ perspective: "800px" }}
      >
        {/* Layer 2: Deepest paper sheet in stack */}
        <div className="absolute inset-x-2 -bottom-2 h-full bg-[#ede7dc] rounded-2xl border border-[#2c3e38]/10 shadow-sm pointer-events-none" />
        {/* Layer 1: Middle paper sheet in stack */}
        <div className="absolute inset-x-1 -bottom-1 h-full bg-[#f7f3eb] rounded-2xl border border-[#2c3e38]/15 shadow-sm pointer-events-none" />

        {/* Shifting Paper Page (Emerging from Back to Front) */}
        <div className="relative w-full h-full overflow-hidden rounded-2xl shadow-md border border-[#2c3e38]/15 bg-white">
          <AnimatePresence mode="popLayout" initial={false}>
            <motion.div
              key={formatted}
              initial={{
                opacity: 0,
                scale: 0.88,
                y: -14,
                rotateX: 18,
              }}
              animate={{
                opacity: 1,
                scale: 1,
                y: 0,
                rotateX: 0,
                transition: {
                  duration: 0.4,
                  ease: [0.16, 1, 0.3, 1], // Smooth back-to-front animation
                },
              }}
              exit={{
                opacity: 0,
                scale: 1.08,
                y: 14,
                rotateX: -18,
                transition: {
                  duration: 0.3,
                  ease: "easeIn",
                },
              }}
              className="absolute inset-0 w-full h-full bg-gradient-to-b from-white via-[#fdfcf9] to-[#f9f6f0] flex items-center justify-center rounded-2xl"
            >
              {/* Subtle inner inset border */}
              <div className="absolute inset-1.5 rounded-xl border border-[#2c3e38]/5 pointer-events-none" />

              {/* Dead Center Large Serif Numeral */}
              <span className="calendar-num text-3xl sm:text-4xl md:text-5xl text-[#2c3e38] font-bold font-['Playfair_Display',serif] tracking-tight tabular-nums select-none">
                {formatted}
              </span>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Unit Label Cleanly Positioned Below Card */}
      <div className="calendar-label-wrap mt-3 text-center">
        <span className="calendar-label text-[10px] sm:text-xs uppercase tracking-[0.25em] text-[#5a6b65] font-semibold block">
          {label}
        </span>
      </div>
    </div>
  );
}

export default function App() {
  // State
  const [isPlayingMusic, setIsPlayingMusic] = useState(() => {
    if (typeof document !== "undefined") {
      const audio = document.getElementById("bg-music");
      return Boolean(audio && !audio.paused);
    }
    return false;
  });
  const [isAutoScrolling] = useState(true);
  const [autoScrollSpeed] = useState(1.5);
  const [toastMessage, setToastMessage] = useState(null);

  // Wedding data
  const weddingData = {
    names: "Ajmal Ahamed R & Rifa J",
    groomName: "Ajmal Ahamed R",
    groomResidence: "Pondicherry",
    brideName: "Rifa J",
    brideResidence: "Pondicherry",
    date: "Saturday, 26th December 2026",
    islamicDate: "17 Rajab 1448 AH",
    time: "5:00 PM",
    venue: "Santho Lawn",
    location: "Pondicherry",
    venueFull: "Santho Lawn, Pondicherry",
    polaroidImage: "/wedding/nithya_arun.png",
    polaroidCaption: "Ajmal Ahamed R & Rifa J",
    musicUrl: "/audio/dheema.mp4",
    subtitle: "With the Blessings of Allah",
    invitationMessage:
      "“We cordially invite you to join us in celebrating the Nikkah of our beloved children. Your gracious presence, heartfelt duas, and blessings will make this blessed occasion even more meaningful and memorable for both our families.”",
    introduction:
      "In sha Allah, to be solemnized in the gracious presence of family and loved ones.",
    countdownDescription:
      "Counting down every blessed moment until we celebrate together in Pondicherry.",
    events: [
      {
        id: "nikah",
        title: "The Nikkah Ceremony (Solemn Covenant)",
        dateTime: "Saturday, 26th December 2026 • 5:00 PM",
        time: "5:00 PM",
        details:
          "The holy marriage contract solemnized with prayers and duas for a blessed union."
      },
      {
        id: "reception",
        title: "The Reception (Celebration Feast)",
        dateTime: "Saturday, 26th December 2026 • 6:30 PM",
        time: "6:30 PM",
        details:
          "A celebratory feast to felicitate the newlyweds and share delightful moments with family and friends."
      }
    ],
    duaArabic: "بَارَكَ اللَّهُ لَكَ وَبَارَكَ عَلَيْكَ وَجَمَعَ بَيْنَكُمَا فِي خَيْرٍ",
    duaEnglish:
      "“May Allah bless you, shower His blessings upon you, and unite you both in goodness.”",
    closingMessage:
      "“May Allah bless this union with love, mercy, understanding, and happiness. We humbly request your presence and duas as our families come together to celebrate this blessed occasion.”",
    additionalMessage: "Your presence and prayers are sincerely appreciated.",
    complimentsIntro: "With Warm Compliments & Duas From:",
    complimentsFamily: "The Families of Ajmal Ahamed & Rifa",
    complimentsOthers: "Relatives, Friends, and Well-Wishers in Pondicherry"
  };


  // Countdown State
  const [countdown, setCountdown] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  const htmlAudioRef = useRef(null);
  const scrollIntervalRef = useRef(null);

  // Show Toast
  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Music controls
  const playAudio = useCallback(() => {
    const audio = htmlAudioRef.current || document.getElementById("bg-music");
    if (!audio) return;
    audio.muted = false;
    audio.loop = true;
    audio
      .play()
      .then(() => {
        setIsPlayingMusic(true);
      })
      .catch((e) => {
        console.log("Audio playback prevented:", e);
        setIsPlayingMusic(false);
      });
  }, []);

  const pauseAudio = useCallback(() => {
    const audio = htmlAudioRef.current || document.getElementById("bg-music");
    if (!audio) return;
    audio.pause();
    setIsPlayingMusic(false);
  }, []);

  const toggleMusic = () => {
    if (isPlayingMusic) {
      pauseAudio();
    } else {
      playAudio();
    }
  };

  // Sync background audio player initialized in index.html
  useEffect(() => {
    const audio = document.getElementById("bg-music");
    if (!audio) return;
    htmlAudioRef.current = audio;
    audio.muted = false;
    audio.loop = true;

    const onPlay = () => setIsPlayingMusic(true);
    const onPause = () => setIsPlayingMusic(false);
    const onError = (e) => {
      console.warn("Audio playback error:", e);
      setIsPlayingMusic(false);
    };

    audio.addEventListener("play", onPlay);
    audio.addEventListener("pause", onPause);
    audio.addEventListener("playing", onPlay);
    audio.addEventListener("error", onError);

    // Initial check
    if (!audio.paused) {
      setIsPlayingMusic(true);
    } else {
      audio.muted = false;
      audio
        .play()
        .then(() => setIsPlayingMusic(true))
        .catch(() => { });
    }

    const userGestureEvents = ["pointerdown", "touchstart", "touchend", "click", "keydown", "mousedown"];
    const startOnInteraction = () => {
      if (audio.paused) {
        audio.muted = false;
        audio
          .play()
          .then(() => {
            setIsPlayingMusic(true);
            removeInteractionListeners();
          })
          .catch(() => { });
      } else {
        removeInteractionListeners();
      }
    };

    const removeInteractionListeners = () => {
      userGestureEvents.forEach((evt) => {
        window.removeEventListener(evt, startOnInteraction, true);
        document.removeEventListener(evt, startOnInteraction, true);
      });
    };

    userGestureEvents.forEach((evt) => {
      window.addEventListener(evt, startOnInteraction, { capture: true, passive: true });
      document.addEventListener(evt, startOnInteraction, { capture: true, passive: true });
    });

    return () => {
      audio.removeEventListener("play", onPlay);
      audio.removeEventListener("pause", onPause);
      audio.removeEventListener("playing", onPlay);
      audio.removeEventListener("error", onError);
      removeInteractionListeners();
    };
  }, []);

  // Autoscroll functionality - always enabled by default on page load
  useEffect(() => {
    let resumeTimeout = null;

    const startAutoScroll = () => {
      if (scrollIntervalRef.current) return;
      scrollIntervalRef.current = setInterval(() => {
        // Stop scrolling when reaching the end of content
        if (
          window.innerHeight + window.scrollY >=
          document.documentElement.scrollHeight - 50
        ) {
          if (scrollIntervalRef.current) {
            clearInterval(scrollIntervalRef.current);
            scrollIntervalRef.current = null;
          }
          return;
        }
        window.scrollBy({ top: autoScrollSpeed, behavior: "smooth" });
      }, 40);
    };

    if (isAutoScrolling) {
      startAutoScroll();
    }

    // Pause on user manual scroll/wheel/touch to preserve normal manual interaction
    const handleUserScroll = (e) => {
      if (e.isTrusted) {
        if (scrollIntervalRef.current) {
          clearInterval(scrollIntervalRef.current);
          scrollIntervalRef.current = null;
        }
        if (resumeTimeout) clearTimeout(resumeTimeout);
        // Resume auto-scroll when manual user interaction ceases, if not at page bottom
        resumeTimeout = setTimeout(() => {
          if (
            window.innerHeight + window.scrollY <
            document.documentElement.scrollHeight - 50
          ) {
            startAutoScroll();
          }
        }, 1500);
      }
    };

    window.addEventListener("wheel", handleUserScroll, { passive: true });
    window.addEventListener("touchstart", handleUserScroll, { passive: true });
    window.addEventListener("touchmove", handleUserScroll, { passive: true });

    return () => {
      if (scrollIntervalRef.current) {
        clearInterval(scrollIntervalRef.current);
        scrollIntervalRef.current = null;
      }
      if (resumeTimeout) clearTimeout(resumeTimeout);
      window.removeEventListener("wheel", handleUserScroll);
      window.removeEventListener("touchstart", handleUserScroll);
      window.removeEventListener("touchmove", handleUserScroll);
    };
  }, [isAutoScrolling, autoScrollSpeed]);

  // Countdown timer logic - target: 26 December 2026 at 5:00 PM, Asia/Kolkata
  useEffect(() => {
    const targetDate = new Date("2026-12-26T17:00:00+05:30").getTime();

    const updateCountdown = () => {
      const now = new Date().getTime();
      const distance = targetDate - now;

      if (distance <= 0) {
        setCountdown({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }

      setCountdown({
        days: Math.floor(distance / (1000 * 60 * 60 * 24)),
        hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((distance % (1000 * 60)) / 1000)
      });
    };

    updateCountdown();
    const timer = setInterval(updateCountdown, 1000);
    return () => clearInterval(timer);
  }, []);

  // Google Maps navigation handler - Santho Lawn, Pondicherry
  const openMapsDirections = () => {
    window.open(
      "https://www.google.com/maps/dir/?api=1&destination=Santho+Lawn,+Pondicherry",
      "_blank"
    );
  };

  // Add Nikkah to Google Calendar (Saturday, 26 December 2026, 5:00 PM to 6:00 PM IST)
  const addNikahToCalendar = () => {
    const title = encodeURIComponent("The Nikkah Ceremony: Ajmal Ahamed R & Rifa J");
    const details = encodeURIComponent(
      "In sha Allah, to be solemnized in the gracious presence of family and loved ones.\n\nEvent: The Nikkah Ceremony\nDate: Saturday, 26th December 2026\nIslamic Date: 17 Rajab 1448 AH\nTime: 5:00 PM to 6:00 PM\nVenue: Santho Lawn, Pondicherry"
    );
    const location = encodeURIComponent("Santho Lawn, Pondicherry");
    // 26 Dec 2026 17:00 to 18:00 IST (UTC+05:30 -> 11:30 to 12:30 UTC)
    const dates = "20261226T113000Z/20261226T123000Z";
    const gcalUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&details=${details}&location=${location}&dates=${dates}&ctz=Asia/Kolkata`;
    window.open(gcalUrl, "_blank");
  };

  // Add specific event to calendar
  const addEventToCalendar = (event) => {
    const title = encodeURIComponent(`${event.title} - Ajmal Ahamed R & Rifa J`);
    const details = encodeURIComponent(
      `${event.details}\n\nVenue: Santho Lawn, Pondicherry`
    );
    const location = encodeURIComponent("Santho Lawn, Pondicherry");
    let dates = "20261226T113000Z/20261226T123000Z";
    if (event.id === "reception") {
      // 6:30 PM to 9:30 PM IST (UTC 13:00 to 16:00)
      dates = "20261226T130000Z/20261226T160000Z";
    }
    const gcalUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&details=${details}&location=${location}&dates=${dates}&ctz=Asia/Kolkata`;
    window.open(gcalUrl, "_blank");
  };

  // WhatsApp Share with prefilled details
  const handleWhatsAppShare = () => {
    const text = `With hearts full of happiness 💕,

We invite you to join us as we begin a beautiful new chapter of our lives. Your presence, prayers, and blessings would make our special day even more memorable. ✨

With love ❤️,
*Ajmal Ahamed R & Rifa J*

💌 Our Wedding Invitation:
https://ajmalrifa-invitation.vercel.app/`;
    window.open(
      `https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`,
      "_blank"
    );
  };

  // Copy Link to Clipboard
  const handleCopyLink = async () => {
    const link = "https://ajmalrifa-invitation.vercel.app/";
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(link);
      } else {
        const textArea = document.createElement("textarea");
        textArea.value = link;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand("copy");
        document.body.removeChild(textArea);
      }
      showToast("Invitation link copied to clipboard!");
    } catch (err) {
      showToast("Link: " + link);
    }
  };

  // Copy Venue Address to Clipboard
  const handleCopyAddress = async () => {
    try {
      const address = "Near Moratandi Tollgate, Near Jipmer Hospital.";
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(address);
      } else {
        const textArea = document.createElement("textarea");
        textArea.value = address;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand("copy");
        document.body.removeChild(textArea);
      }
      showToast("Venue address copied to clipboard!");
    } catch (err) {
      showToast("Near Moratandi Tollgate, Near Jipmer Hospital.");
    }
  };




  return (
    <div className="min-h-screen bg-[#fcfbf9] text-[#2c3e38] font-['Playfair_Display',serif] selection:bg-[#d8406b]/20 selection:text-[#d8406b] relative overflow-x-hidden">
      {/* Floating Music Audio Toggle Button */}
      <div className="fixed top-6 right-6 z-50">
        <button
          onClick={toggleMusic}
          aria-label={isPlayingMusic ? "Pause background music" : "Play background music"}
          className="w-12 h-12 rounded-full bg-white/80 backdrop-blur-md border border-[#2c3e38]/10 shadow-lg flex items-center justify-center text-[#2c3e38] hover:scale-105 hover:bg-white transition-all cursor-pointer"
        >
          {isPlayingMusic ? (
            <div className="flex gap-0.5 items-end justify-center h-4 w-4">
              <span className="w-0.5 h-3 bg-[#d8406b] animate-pulse rounded-full" />
              <span className="w-0.5 h-4 bg-[#d8406b] animate-pulse rounded-full delay-75" />
              <span className="w-0.5 h-2 bg-[#d8406b] animate-pulse rounded-full delay-150" />
              <span className="w-0.5 h-3.5 bg-[#d8406b] animate-pulse rounded-full delay-100" />
            </div>
          ) : (
            <VolumeX size={18} className="text-[#2c3e38]/70" />
          )}
        </button>
      </div>



      {/* SECTION 1: HERO VIEWPORT */}
      <section className="relative w-full h-[100dvh] overflow-hidden bg-[#fcfbf9]">
        {/* Bougainvillea Floral Artwork */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 2, ease: "easeOut" }}
          className="absolute inset-0 z-0"
        >
          <img
            src="/wedding/hridayam_floral_wide.png"
            alt="Bougainvillea Floral Aesthetic"
            className="w-full h-full object-cover object-[20%_top] md:object-left-top opacity-60 md:opacity-100"
          />
          <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-l from-[#fcfbf9]/95 md:from-[#fcfbf9]/40 via-[#fcfbf9]/60 md:via-transparent to-transparent" />
        </motion.div>

        {/* Hero Title Overlay */}
        <div className="absolute inset-0 z-10 w-full max-w-7xl mx-auto px-6 md:px-12 flex flex-col justify-center items-center md:items-end">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, delay: 0.3, ease: "easeOut" }}
            className="flex flex-col items-center text-center md:text-right w-full max-w-4xl"
          >
            {/* Nikkah - Replicating Hridayam Position & Scale */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.5 }}
              className="hero-nikkah-title text-6xl sm:text-7xl md:text-8xl lg:text-9xl tracking-tight drop-shadow-sm md:drop-shadow-none text-center md:text-right"
              style={{ fontFamily: "'Playfair Display', serif", color: "#2c3e38" }}
            >
              Nikkah
            </motion.h1>
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-[#2c3e38]/60 pointer-events-none"
        >
          <span className="text-[10px] uppercase tracking-[0.2em] font-medium">
            Scroll to Discover
          </span>
          <ChevronDown size={14} className="text-[#d8406b]" />
        </motion.div>
      </section>

      {/* SECTION 2: WEDDING INVITATION & NIKKAH CEREMONY HERO */}
      <section className="relative w-full py-16 sm:py-24 px-6 md:px-12 bg-[#fcfbf9] z-20">
        <div className="max-w-6xl mx-auto">
          {/* Two-Column Grid directly on the clean page background */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
            {/* Left Side: Wedding Invitation */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 1 }}
              className="col-span-1 lg:col-span-6 flex flex-col space-y-4 text-center lg:text-left"
            >
              <div>
                <span className="inline-block text-[10px] uppercase tracking-[0.4em] font-bold text-[#d8406b] border border-[#d8406b]/20 px-4 py-1.5 rounded-full">
                  WITH THE BLESSINGS OF ALLAH
                </span>
              </div>

              <h2 className="text-3xl sm:text-4xl md:text-5xl text-[#2c3e38] font-['Playfair_Display',serif] leading-tight font-bold">
                Wedding Invitation
              </h2>

              <p
                className="text-left text-[#5a6b65] font-light leading-relaxed text-base sm:text-lg pt-1 font-['Playfair_Display',serif]"
                style={{ textAlign: "left" }}
              >
                {weddingData.invitationMessage}
              </p>
            </motion.div>

            {/* Right Side: Nikkah Ceremony & Original Individual Name Cards */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 1 }}
              className="col-span-1 lg:col-span-6 flex flex-col space-y-4 text-center lg:text-left"
            >
              <div>
                <span className="inline-block text-[10px] uppercase tracking-[0.4em] font-bold text-[#d8406b] border border-[#d8406b]/20 px-4 py-1.5 rounded-full">
                  FELICITOUS OCCASION
                </span>
              </div>

              <h3 className="text-3xl sm:text-4xl md:text-5xl text-[#2c3e38] font-['Playfair_Display',serif] font-bold leading-tight">
                The Nikkah Ceremony
              </h3>

              <p className="text-[#5a6b65] font-light leading-relaxed text-base sm:text-lg pt-1 font-['Playfair_Display',serif]">
                In sha Allah, to be solemnized in the gracious presence of family and loved ones
              </p>

              {/* Original Individual Name Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 pt-2 w-full">
                {/* Card 1: Ajmal Ahamed R */}
                <div className="bg-white/85 backdrop-blur-md rounded-3xl p-6 sm:p-8 border border-[#2c3e38]/10 shadow-[0_10px_30px_-15px_rgba(44,62,56,0.06)] hover:shadow-[0_15px_35px_-10px_rgba(216,64,107,0.12)] transition-all duration-300 relative text-center group flex flex-col items-center justify-center overflow-hidden">
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-28 h-[2px] bg-gradient-to-r from-transparent via-[#d8406b]/40 to-transparent" />
                  <div className="text-xl sm:text-2xl text-[#2c3e38] font-['Playfair_Display',serif] font-bold italic tracking-tight py-2">
                    Ajmal Ahamed R
                  </div>
                </div>

                {/* Card 2: Rifa J */}
                <div className="bg-white/85 backdrop-blur-md rounded-3xl p-6 sm:p-8 border border-[#2c3e38]/10 shadow-[0_10px_30px_-15px_rgba(44,62,56,0.06)] hover:shadow-[0_15px_35px_-10px_rgba(216,64,107,0.12)] transition-all duration-300 relative text-center group flex flex-col items-center justify-center overflow-hidden">
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-28 h-[2px] bg-gradient-to-r from-transparent via-[#d8406b]/40 to-transparent" />
                  <div className="text-xl sm:text-2xl text-[#2c3e38] font-['Playfair_Display',serif] font-bold italic tracking-tight py-2">
                    Rifa J
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* SECTION 3: EVENT DETAILS & COUNTDOWN */}
      <section className="section-event-countdown relative w-full py-16 sm:py-24 px-6 md:px-12 bg-white border-t border-[#2c3e38]/5">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12 md:mb-14">
            <div className="mb-3">
              <span className="inline-block text-[10px] uppercase tracking-[0.4em] font-bold text-[#d8406b] border border-[#d8406b]/20 px-4 py-1.5 rounded-full">
                OUR BLESSED BEGINNING
              </span>
            </div>
            <h2 className="text-4xl sm:text-5xl md:text-6xl text-[#2c3e38] font-['Playfair_Display',serif] tracking-tight font-bold">
              A Day to Remember
            </h2>
            <p className="text-[#5a6b65] font-light text-base md:text-lg italic mt-3 max-w-xl mx-auto font-['Playfair_Display',serif]">
              Join us as we celebrate a cherished union blessed by Allah, surrounded by love, prayers, and the warmth of our families.
            </p>
          </div>

          {/* Trendy Dual Luxury Event Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 items-stretch">
            {/* Card 1: Sacred Date & Time */}
            <motion.div
              whileHover={{ y: -4 }}
              transition={{ duration: 0.3 }}
              className="card-datetime group relative bg-gradient-to-br from-white via-white/90 to-[#fdfbf7] rounded-[2rem] p-7 sm:p-9 md:p-10 border border-[#d8406b]/15 shadow-[0_15px_40px_-15px_rgba(216,64,107,0.08)] hover:shadow-[0_25px_50px_-12px_rgba(216,64,107,0.15)] transition-all flex flex-col justify-between overflow-hidden"
            >
              {/* Decorative Corner Flourish Glow */}
              <div className="absolute top-0 right-0 w-36 h-36 bg-[#f4ebd8] rounded-full blur-2xl opacity-60 pointer-events-none group-hover:scale-125 transition-transform" />
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-[2px] bg-gradient-to-r from-transparent via-[#d8406b]/50 to-transparent" />

              <div className="space-y-6 relative z-10">
                {/* Badge Header */}
                <div className="card-badge-header flex items-center justify-between">
                  <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#d8406b]/10 border border-[#d8406b]/20 text-[#d8406b]">
                    <Calendar size={14} />
                    <span className="text-[10px] uppercase tracking-[0.25em] font-bold">
                      Date &amp; Time
                    </span>
                  </div>
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#2c3e38]/5 text-[#2c3e38] text-[11px] font-medium font-['Playfair_Display',serif]">
                    <Sparkles size={11} className="text-[#d8406b]" />
                    {weddingData.islamicDate}
                  </span>
                </div>

                {/* Date Highlight */}
                <div className="space-y-2">
                  <span className="text-xs uppercase tracking-[0.3em] text-[#5a6b65] font-semibold block">
                    Saturday
                  </span>
                  <div className="card-date-title text-3xl sm:text-4xl text-[#2c3e38] font-['Playfair_Display',serif] font-bold tracking-tight">
                    26th December 2026
                  </div>
                </div>

                {/* Time Highlight with Icon */}
                <div className="flex items-center gap-3 pt-4 border-t border-[#2c3e38]/10">
                  <div className="w-10 h-10 rounded-full bg-[#fcfbf9] border border-[#d8406b]/20 flex items-center justify-center text-[#d8406b] shadow-sm">
                    <Clock size={16} />
                  </div>
                  <div>
                    <span className="text-[10px] uppercase tracking-[0.2em] text-[#5a6b65] font-semibold block">
                      Propitious Time
                    </span>
                    <span className="text-lg font-bold text-[#2c3e38] font-['Playfair_Display',serif]">
                      5:00 PM
                    </span>
                  </div>
                </div>
              </div>

            </motion.div>

            {/* Card 2: Sacred Venue */}
            <motion.div
              whileHover={{ y: -4 }}
              transition={{ duration: 0.3 }}
              className="card-venue group relative bg-gradient-to-br from-white via-white/90 to-[#fdfbf7] rounded-[2rem] p-7 sm:p-9 md:p-10 border border-[#d8406b]/15 shadow-[0_15px_40px_-15px_rgba(216,64,107,0.08)] hover:shadow-[0_25px_50px_-12px_rgba(216,64,107,0.15)] transition-all flex flex-col justify-between overflow-hidden"
            >
              {/* Decorative Corner Flourish Glow */}
              <div className="absolute top-0 right-0 w-36 h-36 bg-[#f4ebd8] rounded-full blur-2xl opacity-60 pointer-events-none group-hover:scale-125 transition-transform" />
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-[2px] bg-gradient-to-r from-transparent via-[#d8406b]/50 to-transparent" />

              <div className="space-y-6 relative z-10">
                {/* Badge Header */}
                <div className="card-badge-header flex items-center justify-between">
                  <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#d8406b]/10 border border-[#d8406b]/20 text-[#d8406b]">
                    <MapPin size={14} />
                    <span className="text-[10px] uppercase tracking-[0.25em] font-bold">
                      Wedding Venue
                    </span>
                  </div>
                  <span className="text-xs text-[#5a6b65] tracking-widest uppercase font-medium">
                    Celebration Site
                  </span>
                </div>

                {/* Venue Name Highlight */}
                <div className="space-y-2">
                  <span className="text-xs uppercase tracking-[0.3em] text-[#5a6b65] font-semibold block">
                    Solemnization &amp; Feast
                  </span>
                  <div className="card-venue-title text-3xl sm:text-4xl text-[#2c3e38] font-['Playfair_Display',serif] font-bold tracking-tight">
                    Santho Lawn
                  </div>
                </div>

                {/* City & Address */}
                <div className="flex items-center gap-3 pt-4 border-t border-[#2c3e38]/10">
                  <div className="w-10 h-10 rounded-full bg-[#fcfbf9] border border-[#d8406b]/20 flex items-center justify-center text-[#d8406b] shadow-sm">
                    <MapPin size={16} />
                  </div>
                  <div>
                    <span className="text-[10px] uppercase tracking-[0.2em] text-[#5a6b65] font-semibold block">
                      Destination
                    </span>
                    <span className="text-lg font-bold text-[#2c3e38] font-['Playfair_Display',serif]">
                      Pondicherry
                    </span>
                  </div>
                </div>
              </div>

            </motion.div>
          </div>

          {/* Action Callout: Add Nikkah to Google Calendar */}
          <div className="text-center mt-8 sm:mt-10">
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              onClick={addNikahToCalendar}
              className="cal-btn-wrapper inline-flex items-center gap-3 px-8 sm:px-10 py-3.5 sm:py-4 bg-[#2c3e38] hover:bg-[#1a2522] text-white rounded-full text-xs uppercase tracking-[0.2em] font-bold shadow-xl hover:shadow-2xl transition-all border border-white/20 cursor-pointer group"
            >
              <div className="w-6 h-6 rounded-full bg-[#d8406b] flex items-center justify-center text-white group-hover:rotate-12 transition-transform">
                <Calendar size={13} />
              </div>
              <span>Add Nikkah to Google Calendar</span>
            </motion.button>
          </div>

          {/* Countdown to the Nikkah - Classic Stationery Style */}
          <div className="mt-12 sm:mt-16 pt-10 sm:pt-12 border-t border-[#2c3e38]/10 text-center">
            <div className="mb-2.5">
              <span className="inline-block text-[10px] uppercase tracking-[0.4em] font-bold text-[#d8406b] border border-[#d8406b]/20 px-4 py-1.5 rounded-full">
                COUNTDOWN TO THE NIKKAH
              </span>
            </div>

            <p className="text-[#5a6b65] font-light max-w-md mx-auto text-sm md:text-base mb-8 sm:mb-10 font-['Playfair_Display',serif] italic">
              {weddingData.countdownDescription}
            </p>

            {/* Calendar Page Shifting Suite */}
            <div className="countdown-suite flex items-center justify-center gap-2 sm:gap-4 md:gap-6 max-w-lg sm:max-w-xl md:max-w-2xl mx-auto px-2">
              <CalendarPageFlip value={countdown.days} label="Days" />
              <div className="countdown-colon text-xl sm:text-3xl text-[#2c3e38]/25 font-serif font-light self-center -mt-6 sm:-mt-8 select-none">
                :
              </div>
              <CalendarPageFlip value={countdown.hours} label="Hours" />
              <div className="countdown-colon text-xl sm:text-3xl text-[#2c3e38]/25 font-serif font-light self-center -mt-6 sm:-mt-8 select-none">
                :
              </div>
              <CalendarPageFlip value={countdown.minutes} label="Minutes" />
              <div className="countdown-colon text-xl sm:text-3xl text-[#2c3e38]/25 font-serif font-light self-center -mt-6 sm:-mt-8 select-none">
                :
              </div>
              <CalendarPageFlip value={countdown.seconds} label="Seconds" />
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 5: PROGRAM OF WEDDING CELEBRATIONS */}
      <section className="relative w-full py-16 sm:py-24 px-6 md:px-12 bg-[#fcfbf9] border-t border-[#2c3e38]/5">
        <div className="max-w-4xl mx-auto">
          {/* Header - Harmonious balanced relationship between pill, heading, and intro paragraph */}
          <div className="text-center mb-10 md:mb-14">
            <div className="mb-5 sm:mb-6">
              <span className="inline-block text-[10px] uppercase tracking-[0.4em] font-bold text-[#d8406b] border border-[#d8406b]/20 px-4 py-1.5 rounded-full">
                PROGRAMME OF CELEBRATIONS
              </span>
            </div>

            <h2 className="text-3xl sm:text-4xl md:text-5xl text-[#2c3e38] font-['Cormorant_Garamond',serif] font-bold">
              Program of Wedding Celebrations
            </h2>

            <p className="text-[#5a6b65] font-light italic text-base sm:text-lg max-w-lg mx-auto font-['Cormorant_Garamond',serif] mt-4">
              By the grace of Almighty Allah, we warmly invite you to celebrate these cherished moments with our families.
            </p>
          </div>

          {/* Program Events Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
            {weddingData.events.map((event, index) => {
              const isNikah = event.id === "nikah";
              return (
                <motion.div
                  key={event.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.15 }}
                  className="bg-white rounded-2xl p-5 sm:p-7 border border-[#c5a059]/35 shadow-sm hover:shadow-md transition-shadow relative text-center flex flex-col justify-between"
                >
                  {/* Traditional Inner Frame */}
                  <div className="border border-[#c5a059]/20 rounded-xl p-5 sm:p-7 flex flex-col justify-between h-full">
                    <div className="space-y-3">
                      {/* Event Number Kicker */}
                      <span className="text-[11px] font-semibold uppercase tracking-[0.3em] text-[#8c6b2d] block font-sans">
                        {isNikah ? "Event I" : "Event II"}
                      </span>

                      {/* Event Title */}
                      <h3 className="text-2xl sm:text-3xl text-[#2c3e38] font-['Cormorant_Garamond',serif] font-bold tracking-tight">
                        {isNikah ? "The Nikkah Ceremony" : "The Reception"}
                      </h3>

                      {/* Traditional Gold Filigree Divider */}
                      <div className="py-1.5 flex items-center justify-center gap-3">
                        <span className="h-px w-10 bg-[#c5a059]/30" />
                        <Heart className="w-4 h-4 text-[#d8406b] fill-[#d8406b]" />
                        <span className="h-px w-10 bg-[#c5a059]/30" />
                      </div>

                      {/* Date & Time Block */}
                      <div className="space-y-1 py-1">
                        <p className="text-base sm:text-lg text-[#2c3e38] font-['Cormorant_Garamond',serif] font-semibold tracking-wide">
                          Saturday, 26th December 2026
                        </p>
                        <p className="text-xs text-[#8c6b2d] uppercase tracking-[0.18em] font-sans font-medium">
                          {event.time} {isNikah ? "• 17 Rajab 1448 AH" : "Onward"}
                        </p>
                      </div>

                      {/* Traditional Phrasing */}
                      <p className="text-[#5a6b65] font-light text-xs sm:text-sm leading-relaxed max-w-xs mx-auto pt-1 font-['Playfair_Display',serif] italic">
                        {event.details}
                      </p>
                    </div>

                    {/* Add to Calendar Action Button */}
                    <div className="mt-6 pt-4 border-t border-[#c5a059]/15 flex justify-center">
                      <button
                        onClick={() => addEventToCalendar(event)}
                        className="inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-full bg-[#2c3e38] hover:bg-[#1a2522] text-white text-[11px] uppercase tracking-[0.18em] font-medium shadow-sm hover:shadow-md transition-all border border-[#c5a059]/40 cursor-pointer"
                      >
                        <Calendar size={13} className="text-[#c5a059]" />
                        <span>Add To Calendar</span>
                      </button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* SECTION 6: THE WEDDING VENUE */}
      <section className="section-celebration-venue relative w-full px-6 md:px-12 bg-white border-t border-[#2c3e38]/5">
        <div className="max-w-4xl mx-auto">
          {/* Unified Royal Heirloom Venue Card */}
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="bg-gradient-to-b from-[#ffffff] via-[#fdfbf7] to-[#f9f5ec] rounded-3xl sm:rounded-[2.5rem] p-6 sm:p-10 md:p-12 border border-[#c5a059]/40 shadow-[0_12px_40px_-12px_rgba(44,62,56,0.08)] relative overflow-hidden"
          >
            {/* Traditional Inner Hairline Frame */}
            <div className="absolute inset-3 sm:inset-4 rounded-2xl sm:rounded-[2rem] border border-[#c5a059]/25 pointer-events-none" />

            {/* Venue Header & Details */}
            <div className="text-center relative z-10 space-y-2.5 max-w-2xl mx-auto">
              {/* Header Kicker */}
              <div className="mb-4">
                <span className="inline-block text-[10px] uppercase tracking-[0.4em] font-bold text-[#d8406b] border border-[#d8406b]/20 px-4 py-1.5 rounded-full">
                  CELEBRATION VENUE
                </span>
              </div>

              {/* Main Heading */}
              <h2 className="text-3xl sm:text-4xl md:text-5xl text-[#2c3e38] font-['Cormorant_Garamond',serif] font-bold tracking-tight">
                The Wedding Venue
              </h2>

              {/* Venue Name Highlight */}
              <div className="pt-1">
                <p className="text-2xl sm:text-3xl text-[#d8406b] font-['Playfair_Display',serif] font-bold tracking-tight">
                  Santho Lawn
                </p>
              </div>

              {/* Traditional Gold Filigree Divider */}
              <div className="py-1.5 flex items-center justify-center gap-3">
                <span className="h-px w-12 bg-[#c5a059]/30" />
                <Heart className="w-4 h-4 text-[#d8406b] fill-[#d8406b]" />
                <span className="h-px w-12 bg-[#c5a059]/30" />
              </div>

              {/* Full Address Block */}
              <p className="text-base sm:text-lg text-[#2c3e38] font-['Cormorant_Garamond',serif] font-medium leading-relaxed">
                Near Moratandi Tollgate, Near Jipmer Hospital.
              </p>

              {/* Traditional Welcome Wording */}
              <p className="text-xs sm:text-sm text-[#5a6b65] font-light italic leading-relaxed pt-1 font-['Playfair_Display',serif]">
                We warmly look forward to welcoming you and your family to celebrate the wedding ceremony and evening feast amidst the open-air lawns under the starlit skies.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center justify-center gap-3.5 pt-3">
                <button
                  onClick={openMapsDirections}
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-[#2c3e38] hover:bg-[#1a2522] text-white text-xs uppercase tracking-wider font-semibold shadow-md hover:shadow-lg transition-all border border-[#c5a059]/40 cursor-pointer whitespace-nowrap"
                >
                  <Navigation size={13} className="text-[#c5a059] shrink-0" />
                  <span>Get Directions</span>
                </button>
                <button
                  onClick={handleCopyAddress}
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-white hover:bg-[#fcfbf9] text-[#2c3e38] text-xs uppercase tracking-wider font-semibold border border-[#c5a059]/35 shadow-xs hover:shadow-sm transition-all cursor-pointer whitespace-nowrap"
                >
                  <Copy size={13} className="text-[#d8406b] shrink-0" />
                  <span>Copy Address</span>
                </button>
              </div>
            </div>

            {/* Framed Interactive Map */}
            <div className="w-full h-80 sm:h-[400px] rounded-2xl overflow-hidden border border-[#c5a059]/35 shadow-inner bg-white mt-8 sm:mt-9 relative z-10">
              <iframe
                title="Santho Lawn Pondicherry Map"
                src="https://maps.google.com/maps?q=Santho+Lawn,+Pondicherry&t=&z=15&ie=UTF8&iwloc=&output=embed"
                className="w-full h-full border-none"
                loading="lazy"
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* SECTION 7: CLOSING DUA, BLESSINGS & FAMILY COMPLIMENTS */}
      <section className="section-dua-blessings relative w-full px-6 md:px-12 bg-white border-t border-[#2c3e38]/5 text-center overflow-hidden">
        <div className="max-w-3xl mx-auto space-y-8 sm:space-y-9">
          {/* Arabic Dua */}
          <div className="space-y-3">
            <span className="inline-block text-[10px] uppercase tracking-[0.4em] font-bold text-[#d8406b] border border-[#d8406b]/20 px-4 py-1.5 rounded-full">
              DUA &amp; BLESSINGS
            </span>

            <div className="py-2.5 sm:py-3">
              <span
                dir="rtl"
                lang="ar"
                className="text-2xl sm:text-3xl md:text-4xl text-[#2c3e38] font-medium tracking-wide leading-loose block"
              >
                {weddingData.duaArabic}
              </span>
            </div>

            <p className="text-[#d8406b] font-medium italic text-base md:text-lg max-w-xl mx-auto font-['Playfair_Display',serif]">
              {weddingData.duaEnglish}
            </p>
          </div>

          <div className="flex items-center justify-center gap-3">
            <div className="h-px w-16 bg-gradient-to-r from-transparent to-[#d8406b]/40" />
            <Heart className="w-4 h-4 text-[#d8406b] fill-[#d8406b]" />
            <div className="h-px w-16 bg-gradient-to-l from-transparent to-[#d8406b]/40" />
          </div>

          {/* Closing Message */}
          <div className="space-y-3 sm:space-y-3.5">
            <p className="text-[#2c3e38] text-base md:text-lg leading-relaxed font-light max-w-2xl mx-auto font-['Playfair_Display',serif]">
              {weddingData.closingMessage}
            </p>

            <p className="text-sm uppercase tracking-[0.2em] font-semibold text-[#5a6b65]">
              {weddingData.additionalMessage}
            </p>
          </div>

          {/* Family Compliments Card */}
          <div className="mt-8 sm:mt-10 pt-6 sm:pt-7 border-t border-[#2c3e38]/10 bg-[#fcfbf9] p-6 sm:p-8 md:p-9 rounded-3xl border border-[#2c3e38]/5 shadow-sm space-y-2.5">
            <span className="text-xs uppercase tracking-[0.25em] text-[#d8406b] font-bold block">
              {weddingData.complimentsIntro}
            </span>

            <h3 className="text-xl md:text-2xl text-[#2c3e38] font-bold font-['Playfair_Display',serif]">
              {weddingData.complimentsFamily}
            </h3>

            <p className="text-[#5a6b65] text-sm md:text-base font-light">
              {weddingData.complimentsOthers}
            </p>
          </div>
        </div>
      </section>

      {/* SECTION 8: SHARE THIS INVITATION */}
      <section className="relative w-full py-12 sm:py-16 px-6 md:px-12 bg-[#fcfbf9] border-t border-[#2c3e38]/5 text-center">
        <div className="max-w-xl mx-auto space-y-4 sm:space-y-5">
          <h2 className="text-3xl md:text-4xl text-[#2c3e38] font-['Playfair_Display',serif]">
            Share This Invitation
          </h2>

          <p className="text-[#5a6b65] font-light text-sm md:text-base leading-relaxed">
            Share our wedding card with your family, relatives, and friends on WhatsApp or copy the link to share.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 pt-2 sm:pt-3">
            {/* WhatsApp Share Button */}
            <button
              onClick={handleWhatsAppShare}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-6 py-3.5 bg-[#25D366] hover:bg-[#20ba59] text-white rounded-full text-xs uppercase tracking-[0.15em] font-bold shadow-md hover:scale-105 transition-all cursor-pointer"
            >
              <MessageCircle size={16} />
              Share on WhatsApp
            </button>

            {/* Copy Link Button */}
            <button
              onClick={handleCopyLink}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-6 py-3.5 bg-[#2c3e38] hover:bg-[#1a2522] text-white rounded-full text-xs uppercase tracking-[0.15em] font-bold shadow-md hover:scale-105 transition-all cursor-pointer"
            >
              <Copy size={16} className="text-[#d8406b]" />
              Copy Invitation Link
            </button>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-8 sm:py-10 bg-[#fcfbf9] text-center border-t border-[#2c3e38]/5">
        <p className="text-[#5a6b65] text-xs font-medium tracking-[0.3em] uppercase">
          A Blessed Journey of Love &amp; Duas
        </p>
        <p className="text-[#2c3e38]/60 text-sm mt-2 font-['Playfair_Display',serif]">
          {weddingData.names} • 2026
        </p>
      </footer>



      {/* Toast Notification */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-20 left-1/2 -translate-x-1/2 bg-[#2c3e38] text-white text-xs px-5 py-2.5 rounded-full shadow-2xl z-50 border border-white/10"
          >
            {toastMessage}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
