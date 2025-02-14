"use client";

import type React from "react";
import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { gsap } from "gsap";
import { Gift, PackageOpenIcon as GiftOpen, Handshake } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// Replace these links with your actual emoji icon URLs
const confettiIcon1 = "/images/daria_crying.jpg";
const confettiIcon2 = "/images/mem_crying.jpg";

const ValentineFlirt: React.FC = () => {
  const [step, setStep] = useState(0);
  const [showConfetti, setShowConfetti] = useState(false);
  const [isGiftOpen, setIsGiftOpen] = useState(false);
  const noButtonRef = useRef<HTMLButtonElement>(null);
  const confettiRef = useRef<HTMLDivElement>(null);
  const emojiConfettiRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const giftRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  // Auto-advance for specific steps
  useEffect(() => {
    if ([0, 1, 3, 4, 7, 8].includes(step)) {
      const timer = setTimeout(() => {
        animateTransition(() => setStep(step + 1));
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [step]);

  // Animate default confetti (colorful circles) for steps other than the last
  useEffect(() => {
    if (showConfetti && step !== 9 && confettiRef.current) {
      gsap.to(confettiRef.current.children, {
        y: "100vh",
        duration: 2,
        ease: "power1.out",
        stagger: 0.1,
      });
    }
  }, [showConfetti, step]);

  // Animate emoji confetti for the final step
  useEffect(() => {
    if (showConfetti && step === 9 && emojiConfettiRef.current) {
      gsap.to(emojiConfettiRef.current.children, {
        y: "96vh",
        duration: () => Math.random() * 3 + 4,
        ease: "power1.out",
        stagger: 0.1,
      });
    }
  }, [showConfetti, step]);

  // Slow appearance for the gift block (case 5)
  useEffect(() => {
    if (step === 5 && giftRef.current) {
      gsap.from(giftRef.current, { opacity: 0, duration: 1.5 });
    }
  }, [step]);

  const moveNoButton = () => {
    if (noButtonRef.current) {
      const buttonRect = noButtonRef.current.getBoundingClientRect();
      const parentRect =
        noButtonRef.current.parentElement!.getBoundingClientRect();

      const maxX = parentRect.width - buttonRect.width;
      const maxY = parentRect.height - buttonRect.height;

      gsap.to(noButtonRef.current, {
        x: Math.random() * maxX,
        y: Math.random() * maxY,
        duration: 0.2,
        ease: "power1.out",
      });
    }
    toast({
      title: "Warning!",
      description: "Don't even think about clicking no!",
      variant: "destructive",
    });
  };

  const handleYesClick = () => {
    animateTransition(() => setStep(step + 1));
  };

  const handleGiftClick = () => {
    setIsGiftOpen(true);
    setShowConfetti(true);
    animateTransition(() => setStep(step + 1));
  };

  const animateTransition = (callback: () => void) => {
    gsap.to(contentRef.current, {
      opacity: 0,
      duration: 0.5,
      onComplete: () => {
        callback();
        gsap.to(contentRef.current, {
          opacity: 1,
          duration: 0.5,
        });
      },
    });
  };

  const renderStep = () => {
    switch (step) {
      case 0:
        return (
          <div className="text-center">
            <h2 className="text-4xl text-blue-800 font-bold mb-4">
              Hi Daria! This is Mehmet.
            </h2>
          </div>
        );
      case 1:
        return (
          <div className="text-center">
            <h2 className="text-4xl text-blue-800 font-bold mb-4">
              He wants to ask you something...
            </h2>
          </div>
        );
      case 2:
        return (
          <div className="text-center">
            <h2 className="text-4xl text-blue-800 font-bold mb-4">
              Are you Single Daria?
            </h2>
            <div className="flex justify-center gap-4">
              <button
                onClick={handleYesClick}
                className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-6 rounded"
              >
                Yes
              </button>
              <button
                ref={noButtonRef}
                onMouseEnter={moveNoButton}
                onClick={moveNoButton}
                className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-6 rounded"
              >
                No
              </button>
            </div>
          </div>
        );
      case 3:
        return (
          <div className="text-center">
            <h2 className="text-4xl text-blue-800 font-bold mb-4">
              Hmm. Let me think...
            </h2>
          </div>
        );
      case 4:
        return (
          <div className="text-center">
            <h2 className="text-4xl text-blue-800 font-bold mb-4">
              Ohh I found it! 😊
            </h2>
          </div>
        );
      case 5:
        return (
          <div ref={giftRef} className="text-center">
            <div className="flex justify-center space-x-4 mb-4">
              <div>
                <Image
                  src="/images/mem.jpg?height=150&width=150"
                  alt="Me"
                  width={150}
                  height={150}
                  className="rounded-full"
                  priority={true}
                />
                <p className="mt-2 text-black">Social Points: -12</p>
              </div>
            </div>
            <p className="text-xl text-black font-bold mb-4">
              This man is also single and wants to give you a gift.
            </p>
            <p className="text-md text-gray font-bold mb-4">
              Please Click the Giftbox!
            </p>
            <button
              onClick={handleGiftClick}
              className="bg-pink-500 hover:bg-pink-600 text-white font-bold p-4 rounded-full"
            >
              {isGiftOpen ? <GiftOpen size={32} /> : <Gift size={32} />}
            </button>
          </div>
        );
      case 6:
        return (
          <div className="text-center">
            <h2 className="text-4xl text-blue-800 font-bold mb-4">Surprise!</h2>
            <div className="bg-white border-2 border-gray-300 p-6 rounded-lg text-black shadow-md">
              <div className="grid grid-cols-2 gap-4 items-center mb-4">
                <div className="text-xl text-blue-800 font-bold">
                  Turkish Airlines
                </div>
                <div className="text-xl text-black font-bold">
                  Boarding Pass
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <div className="text-sm text-gray-600">Passenger Name</div>
                  <div className="font-semibold">Daria aka Diandra</div>
                </div>
                <div>
                  <div className="text-sm text-gray-600">Flight No.</div>
                  <div className="font-semibold">TK1402</div>
                </div>
                <div>
                  <div className="text-sm text-gray-600">From</div>
                  <div className="font-semibold">Belarus (BLR)</div>
                </div>
                <div>
                  <div className="text-sm text-gray-600">To</div>
                  <div className="font-semibold">Istanbul (IST)</div>
                </div>
                <div>
                  <div className="text-sm text-gray-600">Date</div>
                  <div className="font-semibold">Whenever she wants</div>
                </div>
                <div>
                  <div className="text-sm text-gray-600">Seat</div>
                  <div className="font-semibold">NEXT2ME</div>
                </div>
              </div>
              <div className="text-sm italic mt-4">
                Ready for our adventure?
              </div>
            </div>
            <div className="mt-6 flex justify-center gap-4">
              <button
                onClick={handleYesClick}
                className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-6 rounded"
              >
                Yes
              </button>
              <button
                ref={noButtonRef}
                onMouseEnter={moveNoButton}
                onClick={moveNoButton}
                className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-6 rounded"
              >
                No
              </button>
            </div>
          </div>
        );
      case 7:
        return (
          <div className="text-center">
            <h2 className="text-4xl text-blue-800 font-bold mb-4">
              You made this guy the happiest now...
            </h2>
          </div>
        );
      case 8:
        return (
          <div className="text-center">
            <h2 className="text-4xl text-blue-800 font-bold mb-4">
              Now you are giving him 12 social points
            </h2>
          </div>
        );
      case 9:
        return (
          <div className="text-center">
            <div className="flex justify-center space-x-4 mb-4">
              <div>
                <Image
                  src="/images/daria.jpg?height=150&width=150"
                  alt="You"
                  width={150}
                  height={150}
                  className="rounded-full"
                />
                <p className="mt-2 text-black">Social Points: ♾️</p>
              </div>
              <div>
                <Image
                  src="/images/mem.jpg?height=150&width=150"
                  alt="Me"
                  width={150}
                  height={150}
                  className="rounded-full"
                />
                <p className="mt-2 text-black">Social Points: 0</p>
              </div>
            </div>
            <Handshake size={48} className="mx-auto mb-4 text-black" />
            <p className="text-xl text-black font-bold">
              Thanks for the agreement!
            </p>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-pink-300 via-purple-300 to-indigo-400">
      <div className="bg-white p-8 rounded-lg shadow-xl max-w-md w-full -mt-24">
        <div ref={contentRef}>{renderStep()}</div>
      </div>
      {showConfetti &&
        (step === 9 ? (
          <div
            ref={emojiConfettiRef}
            className="fixed top-0 left-0 w-full h-full pointer-events-none"
          >
            {[...Array(50)].map((_, i) => {
              const icon = Math.random() > 0.5 ? confettiIcon1 : confettiIcon2;
              return (
                <img
                  key={i}
                  src={icon}
                  alt="confetti emoji"
                  className="absolute w-12 h-12 rounded-full"
                  style={{
                    left: `${Math.random() * 100}%`,
                    top: "-20px",
                    transform: `rotate(${Math.random() * 360}deg)`,
                  }}
                />
              );
            })}
          </div>
        ) : (
          <div
            ref={confettiRef}
            className="fixed top-0 left-0 w-full h-full pointer-events-none"
          >
            {[...Array(50)].map((_, i) => (
              <div
                key={i}
                className="absolute w-4 h-4 rounded-full"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: "-20px",
                  backgroundColor: `hsl(${Math.random() * 360}, 100%, 50%)`,
                }}
              />
            ))}
          </div>
        ))}
    </div>
  );
};

export default ValentineFlirt;
