'use client';

import React, { useEffect, useRef } from 'react';
import Link from 'next/link';
import { FileCheck } from 'lucide-react';

export default function Home() {
  const sectionsRef = useRef<HTMLDivElement[]>([]);

  useEffect(() => {
    // Only enable section snapping on larger screens
    if (window.innerWidth >= 768) {
      const handleScroll = () => {
        const scrollPosition = window.scrollY;

        let closestSection = 0;
        let closestDistance = Math.abs(
          sectionsRef.current[0]?.offsetTop - scrollPosition
        );

        sectionsRef.current.forEach((section, index) => {
          if (!section) return;
          const distance = Math.abs(section.offsetTop - scrollPosition);
          if (distance < closestDistance) {
            closestDistance = distance;
            closestSection = index;
          }
        });

        // Only snap if we're not in the middle of a manual scroll
        if (!document.body.classList.contains('vercel-scrolling')) {
          document.body.classList.add('vercel-scrolling');
          sectionsRef.current[closestSection]?.scrollIntoView({
            behavior: 'smooth',
          });
          setTimeout(() => {
            document.body.classList.remove('vercel-scrolling');
          }, 1000);
        }
      };

      let scrollTimeout: NodeJS.Timeout;
      window.addEventListener('scroll', () => {
        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(handleScroll, 100);
      });

      return () => {
        window.removeEventListener('scroll', handleScroll);
        clearTimeout(scrollTimeout);
      };
    }
  }, []);

  const addToRefs = (el: HTMLDivElement) => {
    if (el && !sectionsRef.current.includes(el)) {
      sectionsRef.current.push(el);
    }
  };

  return (
    <div
      className="landingPageWrapper vercel-landing"
      style={{ background: '#102a43', color: 'white' }}
    >
      <main className="landingPageMain flex-grow md:vercel-snap-y md:vercel-snap-mandatory">
        {/* Hero Section - The main introduction section with a call to action */}
        <section
          ref={addToRefs}
          className="heroSection min-h-screen py-16 md:py-0 flex flex-col justify-center md:vercel-snap-start"
          id="hero"
          style={{ background: '#102a43' }}
        >
          <div className="heroContainer container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="heroContent grid md:grid-cols-2 gap-12 items-center">
              <div className="heroTextContent text-center md:text-left">
                <h1 className="heroTitle text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
                  FIND THE NEEDLE
                  <br />
                  IN THE HAYSTACK
                </h1>
                <p className="heroSubtitle text-base sm:text-lg text-gray-300 mb-4">
                  Rare diseases hiding in plain sight? Not anymore.
                </p>
                <p className="heroDescription text-base sm:text-lg text-gray-300 mb-8">
                  Physicians hunt for rare diagnoses among countless symptoms
                  daily. Our tracker turns this challenge into precision
                  medicine.
                </p>
                <div className="heroCtaWrapper space-y-4">
                  <Link
                    href="/dashboard"
                    className="primaryCta inline-flex items-center justify-center px-5 py-2 sm:px-6 sm:py-3 border border-transparent rounded-md shadow-sm text-sm sm:text-base font-medium text-white"
                    style={{ background: '#0967d2' }}
                  >
                    Get Started
                  </Link>
                  <p className="ctaDisclaimer text-xs sm:text-sm text-gray-400">
                    No credit card needed
                  </p>
                </div>
                <div className="trustBadges flex flex-wrap items-center justify-center md:justify-start gap-3 mt-6 sm:mt-8">
                  {/* Trust badges would go here */}
                </div>
              </div>
              <div
                className="demoCardWrapper rounded-lg shadow-lg p-4 sm:p-6 border border-opacity-30 mt-8 md:mt-0"
                style={{ background: '#243b53', borderColor: '#334e68' }}
              >
                <div className="demoCardHeader flex items-center justify-between mb-4">
                  <div className="demoCardTitle flex items-center space-x-2">
                    <FileCheck
                      className="demoCardIcon h-5 w-5"
                      style={{ color: '#2dd4bf' }}
                    />
                    <span className="font-semibold">SymptomDx</span>
                  </div>
                </div>
                <div className="demoCardContent flex flex-col items-center justify-center h-48 sm:h-64">
                  <p className="demoCardStatus text-xl mb-4">Listening...</p>
                  <div className="audioWaveform w-full h-16 flex justify-center items-center">
                    <svg
                      width="90%"
                      height="40"
                      viewBox="0 0 200 40"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      className="max-w-full"
                    >
                      <path
                        d="M10 20 Q 20 5, 30 20 Q 40 35, 50 20 Q 60 5, 70 20 Q 80 35, 90 20 Q 100 5, 110 20 Q 120 35, 130 20 Q 140 5, 150 20 Q 160 35, 170 20 Q 180 5, 190 20"
                        stroke="#2dd4bf"
                        strokeWidth="2"
                      />
                    </svg>
                  </div>
                  <div className="demoCardActions mt-6 sm:mt-8 flex space-x-3 sm:space-x-4">
                    <button
                      className="endVisitButton px-3 py-2 sm:px-4 sm:py-2 text-white rounded-md flex items-center space-x-2 text-sm sm:text-base"
                      style={{ background: '#0967d2' }}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="hidden sm:inline-block mr-1"
                      >
                        <circle cx="12" cy="12" r="10"></circle>
                        <rect x="9" y="9" width="6" height="6"></rect>
                      </svg>
                      <span>End Visit</span>
                    </button>
                    <button
                      className="pauseButton p-2 rounded-md"
                      style={{ background: '#334e68' }}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="sm:w-6 sm:h-6"
                      >
                        <rect x="6" y="4" width="4" height="16"></rect>
                        <rect x="14" y="4" width="4" height="16"></rect>
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Why It Matters Section - Personal story to build credibility */}
        <section
          ref={addToRefs}
          className="physicianStorySection min-h-screen py-16 md:py-0 flex flex-col justify-center md:vercel-snap-start"
          id="why-it-matters"
          style={{ background: '#102a43' }}
        >
          <div className="storyContainer container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="sectionHeader text-center mb-10 md:mb-16">
              <h2 className="sectionTitle text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
                WHY IT MATTERS: A PHYSICIAN&apos;S STORY
              </h2>
            </div>

            <div className="testimonialWrapper max-w-4xl mx-auto">
              <div
                className="physicianTestimonial rounded-lg p-5 sm:p-8 shadow-lg border border-opacity-30 mb-6 sm:mb-8"
                style={{ background: '#243b53', borderColor: '#334e68' }}
              >
                <p className="testimonialText text-gray-300 mb-4 sm:mb-6 text-base sm:text-lg italic">
                  &quot;My first weekend after residency, I spent all my spare
                  time consuming FOAMed—Free Open Access Medical
                  education—including podcasts, blogposts, and videos,
                  especially Airway Interventions and Management in Emergencies
                  (AIME).
                </p>
                <p className="testimonialText text-gray-300 mb-4 sm:mb-6 text-base sm:text-lg italic">
                  The very next weekend, a patient arrived VSA from a fire:
                  inhalation injury, soot-filled airway, burns to 25% of their
                  body. It was the most difficult airway I&apos;ve ever
                  encountered.
                </p>
                <p className="testimonialText text-gray-300 text-base sm:text-lg italic">
                  Without those resources and systematic approach, that patient
                  wouldn&apos;t have survived.&quot;
                </p>
                <div className="testimonialAuthor mt-6 flex items-center">
                  <div className="authorAvatar h-12 w-12 rounded-full overflow-hidden bg-blue-900 flex items-center justify-center text-2xl font-bold text-white">
                    M
                  </div>
                  <div className="authorInfo ml-4">
                    <p className="authorName text-white font-medium">
                      Dr. Michael T.
                    </p>
                    <p className="authorTitle text-sm text-gray-400">
                      Emergency Medicine Physician
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* More sections would follow... */}
      </main>

      <style jsx global>{`
        @media (max-width: 640px) {
          html,
          body {
            font-size: 14px;
          }
        }

        .vercel-landing {
          font-family: Inter, ui-sans-serif, system-ui, -apple-system,
            BlinkMacSystemFont, 'Segoe UI', Roboto;
          min-height: 100vh;
        }

        @media (min-width: 768px) {
          .vercel-snap-y {
            scroll-snap-type: y mandatory;
          }
          .vercel-snap-mandatory {
            scroll-snap-type: mandatory;
          }
          .vercel-snap-start {
            scroll-snap-align: start;
            scroll-snap-stop: always;
          }
        }

        .vercel-scrolling {
          scroll-behavior: smooth;
        }

        .vercel-tab-active {
          background-color: #334e68;
          color: white;
          box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
          border-bottom: 2px solid #2dd4bf;
        }

        /* Add more responsive utility classes */
        .xs\\:inline {
          @media (min-width: 480px) {
            display: inline;
          }
        }
      `}</style>
    </div>
  );
}
