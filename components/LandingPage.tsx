'use client';

import React, { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  ChevronDown,
  FileCheck,
  Gauge,
  Headphones,
  Lightbulb,
  Users,
  Stethoscope,
  CheckCircle,
  Heart,
  FileText,
  Activity,
  ArrowRight,
  Menu,
  X,
} from 'lucide-react';

export default function Home() {
  const sectionsRef = useRef<HTMLDivElement[]>([]);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('patients');

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

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <div
      className="vercel-landing"
      style={{ background: '#102a43', color: 'white' }}
    >
      <header
        className="sticky top-0 z-50 border-b border-opacity-30"
        style={{ background: '#102a43', borderColor: '#334e68' }}
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 md:h-20">
            <div className="flex items-center">
              <Link href="/" className="flex items-center space-x-2">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="w-6 h-6 md:w-8 md:h-8 text-blue-500"
                >
                  <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
                </svg>
                <span className="text-xl font-semibold">
                  <span className="text-white">Symptom</span>
                  <span style={{ color: '#2dd4bf' }}>Dx</span>
                </span>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-6">
              <div className="relative group">
                <button className="flex items-center space-x-1 text-gray-300 hover:text-teal-400">
                  <span>Features</span>
                  <ChevronDown className="h-4 w-4" />
                </button>
              </div>
              <Link
                href="#hiw"
                className="text-gray-300 hover:text-teal-400 font-medium"
              >
                How it Works
              </Link>
              <Link href="/blog" className="text-gray-300 hover:text-teal-400">
                Blog
              </Link>
              <Link
                href="/patients"
                className="text-gray-300 hover:text-teal-400"
              >
                For Patients
              </Link>
            </nav>

            <div className="flex items-center space-x-4">
              <Link
                href="/login"
                className="hidden md:inline-flex items-center justify-center px-4 py-2 border rounded-md text-sm font-medium text-white hover:bg-opacity-80"
                style={{ borderColor: '#486581', background: '#243b53' }}
              >
                Log In
              </Link>
              <Link
                href="/dashboard"
                className="hidden sm:inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white hover:bg-opacity-90"
                style={{ background: '#0967d2' }}
              >
                Try for Free
              </Link>
              <button
                className="md:hidden text-white"
                onClick={toggleMobileMenu}
                aria-label="Toggle menu"
              >
                {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Navigation Menu */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 z-40 md:hidden"
          style={{ background: 'rgba(16, 42, 67, 0.95)' }}
        >
          <div className="flex flex-col items-center justify-center h-full space-y-8 p-4">
            <Link
              href="#hiw"
              className="text-xl text-white font-medium"
              onClick={() => setMobileMenuOpen(false)}
            >
              How it Works
            </Link>
            <Link
              href="/blog"
              className="text-xl text-white"
              onClick={() => setMobileMenuOpen(false)}
            >
              Blog
            </Link>
            <Link
              href="/patients"
              className="text-xl text-white"
              onClick={() => setMobileMenuOpen(false)}
            >
              For Patients
            </Link>
            <div className="flex flex-col space-y-4 w-full mt-6">
              <Link
                href="/login"
                className="w-full inline-flex items-center justify-center px-4 py-3 border rounded-md text-base font-medium text-white"
                style={{ borderColor: '#486581', background: '#243b53' }}
                onClick={() => setMobileMenuOpen(false)}
              >
                Log In
              </Link>
              <Link
                href="/dashboard"
                className="w-full inline-flex items-center justify-center px-4 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white"
                style={{ background: '#0967d2' }}
                onClick={() => setMobileMenuOpen(false)}
              >
                Try for Free
              </Link>
            </div>
          </div>
        </div>
      )}

      <main className="flex-grow md:vercel-snap-y md:vercel-snap-mandatory">
        {/* Hero Section */}
        <section
          ref={addToRefs}
          className="min-h-screen py-16 md:py-0 flex flex-col justify-center md:vercel-snap-start"
          id="hero"
          style={{ background: '#102a43' }}
        >
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="text-center md:text-left">
                <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
                  FIND THE NEEDLE
                  <br />
                  IN THE HAYSTACK
                </h1>
                <p className="text-base sm:text-lg text-gray-300 mb-4">
                  Rare diseases hiding in plain sight? Not anymore.
                </p>
                <p className="text-base sm:text-lg text-gray-300 mb-8">
                  Physicians hunt for rare diagnoses among countless symptoms
                  daily. Our tracker turns this challenge into precision
                  medicine.
                </p>
                <div className="space-y-4">
                  <Link
                    href="/dashboard"
                    className="inline-flex items-center justify-center px-5 py-2 sm:px-6 sm:py-3 border border-transparent rounded-md shadow-sm text-sm sm:text-base font-medium text-white"
                    style={{ background: '#0967d2' }}
                  >
                    Get Started
                  </Link>
                  <p className="text-xs sm:text-sm text-gray-400">
                    No credit card needed
                  </p>
                </div>
                <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 mt-6 sm:mt-8">
                  <div
                    className="flex-shrink-0 p-2 rounded-md"
                    style={{ background: '#243b53' }}
                  >
                    <p className="text-xs" style={{ color: '#2dd4bf' }}>
                      HIPAA Compliant
                    </p>
                  </div>
                  <div
                    className="flex-shrink-0 p-2 rounded-md"
                    style={{ background: '#243b53' }}
                  >
                    <p className="text-xs" style={{ color: '#2dd4bf' }}>
                      SOC 2
                    </p>
                  </div>
                </div>
              </div>
              <div
                className="rounded-lg shadow-lg p-4 sm:p-6 border border-opacity-30 mt-8 md:mt-0"
                style={{ background: '#243b53', borderColor: '#334e68' }}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-2">
                    <FileCheck
                      className="h-5 w-5"
                      style={{ color: '#2dd4bf' }}
                    />
                    <span className="font-semibold">SymptomDx</span>
                  </div>
                </div>
                <div className="flex flex-col items-center justify-center h-48 sm:h-64">
                  <p className="text-xl mb-4">Listening...</p>
                  <div className="w-full h-16 flex justify-center items-center">
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
                  <div className="mt-6 sm:mt-8 flex space-x-3 sm:space-x-4">
                    <button
                      className="px-3 py-2 sm:px-4 sm:py-2 text-white rounded-md flex items-center space-x-2 text-sm sm:text-base"
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
                      className="p-2 rounded-md"
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

        {/* Why It Matters Section */}
        <section
          ref={addToRefs}
          className="min-h-screen py-16 md:py-0 flex flex-col justify-center md:vercel-snap-start"
          id="why-it-matters"
          style={{ background: '#102a43' }}
        >
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-10 md:mb-16">
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
                WHY IT MATTERS: A PHYSICIAN'S STORY
              </h2>
            </div>

            <div className="max-w-4xl mx-auto">
              <div
                className="rounded-lg p-5 sm:p-8 shadow-lg border border-opacity-30 mb-6 sm:mb-8"
                style={{ background: '#243b53', borderColor: '#334e68' }}
              >
                <p className="text-gray-300 mb-4 sm:mb-6 text-base sm:text-lg italic">
                  "My first weekend after residency, I spent all my spare time
                  consuming FOAMed—Free Open Access Medical education—including
                  podcasts, blogposts, and videos, especially Airway
                  Interventions and Management in Emergencies (AIME).
                </p>
                <p className="text-gray-300 mb-4 sm:mb-6 text-base sm:text-lg italic">
                  The very next weekend, a patient arrived VSA from a fire:
                  inhalation injury, soot-filled airway, burns to 25% of their
                  body. It was the most difficult airway I've ever encountered.
                </p>
                <p className="text-gray-300 text-base sm:text-lg italic">
                  Without those resources and systematic approach, that patient
                  wouldn't have survived."
                </p>
              </div>

              <div className="text-center">
                <p
                  className="text-lg sm:text-xl font-bold mb-2 sm:mb-4"
                  style={{ color: '#2dd4bf' }}
                >
                  When preparation meets opportunity, lives are saved.
                </p>
                <p className="text-base sm:text-lg text-gray-300">
                  Our tracker is that preparation—systematized.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* How it Works Section */}
        <section
          ref={addToRefs}
          className="min-h-screen py-16 md:py-0 flex flex-col justify-center md:vercel-snap-start"
          id="hiw"
          style={{ background: '#102a43' }}
        >
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-10 md:mb-16">
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
                PILOT-INSPIRED. PHYSICIAN-DRIVEN.
              </h2>
              <p className="text-base sm:text-lg text-gray-300 max-w-3xl mx-auto">
                Pilots use checklists to navigate emergencies. Emergency
                physicians should too. Our symptom tracker brings aviation-grade
                precision to your diagnostic process:
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8 max-w-6xl mx-auto">
              {/* Step 1 */}
              <div className="flex flex-col">
                <div
                  className="rounded-xl overflow-hidden mb-4 sm:mb-6 aspect-square flex items-center justify-center border border-opacity-30"
                  style={{
                    background:
                      'linear-gradient(to bottom right, #243b53, #03449e)',
                    borderColor: '#334e68',
                  }}
                >
                  <div className="w-3/5 h-3/5 relative">
                    <div
                      className="w-full h-full rounded-lg flex items-center justify-center"
                      style={{ background: 'rgba(51, 78, 104, 0.5)' }}
                    >
                      <span
                        className="text-4xl sm:text-6xl font-bold"
                        style={{ color: '#2dd4bf' }}
                      >
                        1
                      </span>
                    </div>
                  </div>
                </div>
                <h3 className="text-lg sm:text-xl font-bold mb-2 sm:mb-3">
                  01. Capture
                </h3>
                <p className="text-sm sm:text-base text-gray-300">
                  Select "Capture visit" when your visit begins. SymptomDx can
                  listen for up to three hours, whether it's a virtual or office
                  visit.
                </p>
              </div>

              {/* Step 2 */}
              <div className="flex flex-col">
                <div
                  className="rounded-xl overflow-hidden mb-4 sm:mb-6 aspect-square flex items-center justify-center border border-opacity-30"
                  style={{
                    background:
                      'linear-gradient(to bottom right, #243b53, #03449e)',
                    borderColor: '#334e68',
                  }}
                >
                  <div className="w-3/5 h-3/5 relative">
                    <div
                      className="w-full h-full rounded-lg flex items-center justify-center"
                      style={{ background: 'rgba(51, 78, 104, 0.5)' }}
                    >
                      <span
                        className="text-4xl sm:text-6xl font-bold"
                        style={{ color: '#2dd4bf' }}
                      >
                        2
                      </span>
                    </div>
                  </div>
                </div>
                <h3 className="text-lg sm:text-xl font-bold mb-2 sm:mb-3">
                  02. Edit
                </h3>
                <p className="text-sm sm:text-base text-gray-300">
                  Select "End visit." Your medical documentation will be ready
                  in one minute. Edit to help SymptomDx learn your style.
                </p>
              </div>

              {/* Step 3 */}
              <div className="flex flex-col">
                <div
                  className="rounded-xl overflow-hidden mb-4 sm:mb-6 aspect-square flex items-center justify-center border border-opacity-30"
                  style={{
                    background:
                      'linear-gradient(to bottom right, #243b53, #03449e)',
                    borderColor: '#334e68',
                  }}
                >
                  <div className="w-3/5 h-3/5 relative">
                    <div
                      className="w-full h-full rounded-lg flex items-center justify-center"
                      style={{ background: 'rgba(51, 78, 104, 0.5)' }}
                    >
                      <span
                        className="text-4xl sm:text-6xl font-bold"
                        style={{ color: '#2dd4bf' }}
                      >
                        3
                      </span>
                    </div>
                  </div>
                </div>
                <h3 className="text-lg sm:text-xl font-bold mb-2 sm:mb-3">
                  03. Sign off
                </h3>
                <p className="text-sm sm:text-base text-gray-300">
                  Send simple patient instructions, then copy/paste or integrate
                  with your EHR.
                </p>
              </div>
            </div>

            <div className="text-center mt-10 sm:mt-16">
              <Link
                href="/dashboard"
                className="inline-flex items-center justify-center px-5 py-2 sm:px-6 sm:py-3 border border-transparent rounded-md shadow-sm text-sm sm:text-base font-medium text-white"
                style={{ background: '#0967d2' }}
              >
                Try for Free
              </Link>
            </div>
          </div>
        </section>

        {/* Choose Your Path Section */}
        <section
          ref={addToRefs}
          className="min-h-screen py-16 md:py-0 flex flex-col justify-center md:vercel-snap-start"
          id="choose-path"
          style={{ background: '#102a43' }}
        >
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
            <div className="flex flex-col items-center justify-center space-y-4 text-center mb-8 sm:mb-12">
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
                Choose Your Path
              </h2>
              <p className="max-w-[700px] text-gray-300 text-base sm:text-lg">
                SymptomDx offers specialized tools for both patients and medical
                professionals.
              </p>
            </div>

            <div className="vercel-tabs">
              <div className="flex justify-center mb-6 sm:mb-8">
                <div
                  className="grid w-full max-w-xs sm:max-w-md grid-cols-2 p-1 rounded-lg"
                  style={{ background: '#243b53' }}
                >
                  <button
                    className={`text-sm sm:text-lg py-2 sm:py-3 px-2 rounded-md flex items-center justify-center ${
                      activeTab === 'patients'
                        ? 'vercel-tab-active'
                        : 'text-gray-300 hover:text-white'
                    }`}
                    onClick={() => setActiveTab('patients')}
                  >
                    <Users className="mr-1 sm:mr-2 h-4 w-4 sm:h-5 sm:w-5" />
                    <span className="hidden xs:inline">Patients</span>
                  </button>
                  <button
                    className={`text-sm sm:text-lg py-2 sm:py-3 px-2 rounded-md flex items-center justify-center ${
                      activeTab === 'medical'
                        ? 'vercel-tab-active'
                        : 'text-gray-300 hover:text-white'
                    }`}
                    onClick={() => setActiveTab('medical')}
                  >
                    <Stethoscope className="mr-1 sm:mr-2 h-4 w-4 sm:h-5 sm:w-5" />
                    <span className="hidden xs:inline">
                      Medical Professionals
                    </span>
                  </button>
                </div>
              </div>

              <div
                className={
                  activeTab === 'patients' ? 'space-y-6 sm:space-y-8' : 'hidden'
                }
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                  {[
                    {
                      icon: (
                        <CheckCircle
                          className="h-5 w-5 sm:h-6 sm:w-6"
                          style={{ color: '#2dd4bf' }}
                        />
                      ),
                      title: 'Symptom Checklists',
                      description:
                        'Access 200+ symptom checklists to better communicate with your doctor and advocate for yourself.',
                    },
                    {
                      icon: (
                        <Heart
                          className="h-5 w-5 sm:h-6 sm:w-6"
                          style={{ color: '#2dd4bf' }}
                        />
                      ),
                      title: 'Expecting Mothers',
                      description:
                        'Specialized checklists and resources for pregnancy and prenatal care.',
                    },
                    {
                      icon: (
                        <FileText
                          className="h-5 w-5 sm:h-6 sm:w-6"
                          style={{ color: '#2dd4bf' }}
                        />
                      ),
                      title: "Children's Health",
                      description:
                        'Age-appropriate symptom tracking and health monitoring for children.',
                    },
                    {
                      icon: (
                        <Activity
                          className="h-5 w-5 sm:h-6 sm:w-6"
                          style={{ color: '#2dd4bf' }}
                        />
                      ),
                      title: 'Cancer Screening',
                      description:
                        'Age and risk-appropriate cancer screening recommendations and symptom tracking.',
                    },
                    {
                      icon: (
                        <Users
                          className="h-5 w-5 sm:h-6 sm:w-6"
                          style={{ color: '#2dd4bf' }}
                        />
                      ),
                      title: 'Male Health',
                      description:
                        'Specialized resources for male-specific health concerns and preventive care.',
                    },
                    {
                      icon: (
                        <Heart
                          className="h-5 w-5 sm:h-6 sm:w-6"
                          style={{ color: '#2dd4bf' }}
                        />
                      ),
                      title: 'Female Health',
                      description:
                        'Comprehensive resources for female-specific health concerns across all life stages.',
                    },
                  ].map((item, index) => (
                    <div
                      key={index}
                      className="flex flex-col items-start gap-2 sm:gap-3 rounded-xl p-4 sm:p-6 shadow-sm hover:shadow-md transition-shadow h-full border border-opacity-30"
                      style={{ background: '#243b53', borderColor: '#334e68' }}
                    >
                      <div
                        className="rounded-full p-2 sm:p-3"
                        style={{ background: '#334e68' }}
                      >
                        {item.icon}
                      </div>
                      <h3 className="text-lg sm:text-xl font-bold text-white">
                        {item.title}
                      </h3>
                      <p className="text-sm sm:text-base text-gray-300">
                        {item.description}
                      </p>
                    </div>
                  ))}
                </div>
                <div className="flex justify-center mt-6 sm:mt-10">
                  <Link
                    href="/dashboard"
                    className="inline-flex items-center justify-center px-5 py-2 sm:px-8 sm:py-3 h-10 sm:h-11 rounded-md shadow-sm text-sm sm:text-base font-medium text-white"
                    style={{ background: '#0967d2' }}
                  >
                    Access Patient Resources
                    <ArrowRight className="ml-1 sm:ml-2 h-4 w-4" />
                  </Link>
                </div>
              </div>

              <div
                className={
                  activeTab === 'medical' ? 'space-y-6 sm:space-y-8' : 'hidden'
                }
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                  {[
                    {
                      icon: (
                        <Activity
                          className="h-5 w-5 sm:h-6 sm:w-6"
                          style={{ color: '#2dd4bf' }}
                        />
                      ),
                      title: 'ECG Tool',
                      description:
                        'Advanced ECG analysis and interpretation assistance.',
                    },
                    {
                      icon: (
                        <FileText
                          className="h-5 w-5 sm:h-6 sm:w-6"
                          style={{ color: '#2dd4bf' }}
                        />
                      ),
                      title: 'Radiograph / X-ray Tool',
                      description:
                        'Systematic approach to radiographic interpretation.',
                    },
                    {
                      icon: (
                        <Stethoscope
                          className="h-5 w-5 sm:h-6 sm:w-6"
                          style={{ color: '#2dd4bf' }}
                        />
                      ),
                      title: 'POCUS Tool',
                      description:
                        'Point-of-care ultrasound guidance and interpretation.',
                    },
                    {
                      icon: (
                        <CheckCircle
                          className="h-5 w-5 sm:h-6 sm:w-6"
                          style={{ color: '#2dd4bf' }}
                        />
                      ),
                      title: 'SOAP Note Generator',
                      description:
                        'From symptom checker to complete SOAP notes in minutes.',
                    },
                    {
                      icon: (
                        <FileText
                          className="h-5 w-5 sm:h-6 sm:w-6"
                          style={{ color: '#2dd4bf' }}
                        />
                      ),
                      title: 'Medical Techniques',
                      description:
                        'Step-by-step walkthroughs of essential medical procedures and techniques.',
                    },
                    {
                      icon: (
                        <Activity
                          className="h-5 w-5 sm:h-6 sm:w-6"
                          style={{ color: '#2dd4bf' }}
                        />
                      ),
                      title: 'Fracture/Dislocation Management',
                      description:
                        'Comprehensive guides for assessment, reduction, and management of fractures and dislocations.',
                    },
                  ].map((item, index) => (
                    <div
                      key={index}
                      className="flex flex-col items-start gap-2 sm:gap-3 rounded-xl p-4 sm:p-6 shadow-sm hover:shadow-md transition-shadow h-full border border-opacity-30"
                      style={{ background: '#243b53', borderColor: '#334e68' }}
                    >
                      <div
                        className="rounded-full p-2 sm:p-3"
                        style={{ background: '#334e68' }}
                      >
                        {item.icon}
                      </div>
                      <h3 className="text-lg sm:text-xl font-bold text-white">
                        {item.title}
                      </h3>
                      <p className="text-sm sm:text-base text-gray-300">
                        {item.description}
                      </p>
                    </div>
                  ))}
                </div>
                <div className="flex justify-center mt-6 sm:mt-10">
                  <Link
                    href="/dashboard"
                    className="inline-flex items-center justify-center px-5 py-2 sm:px-8 sm:py-3 h-10 sm:h-11 rounded-md shadow-sm text-sm sm:text-base font-medium text-white"
                    style={{ background: '#0967d2' }}
                  >
                    Access Medical Tools
                    <ArrowRight className="ml-1 sm:ml-2 h-4 w-4" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section
          ref={addToRefs}
          className="min-h-screen py-16 md:py-0 flex flex-col justify-center md:vercel-snap-start"
          id="features"
          style={{ background: '#102a43' }}
        >
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-10 md:mb-16">
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
                Your trusted AI scribe
              </h2>
              <p className="text-base sm:text-lg text-gray-300">
                Clinical precision without the documentation stress
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 max-w-6xl mx-auto">
              {/* Feature 1 */}
              <div
                className="rounded-lg p-5 sm:p-8 shadow-sm border border-opacity-30"
                style={{ background: '#243b53', borderColor: '#334e68' }}
              >
                <div
                  className="w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center mb-4 sm:mb-6"
                  style={{ background: '#334e68' }}
                >
                  <Gauge
                    className="h-5 w-5 sm:h-6 sm:w-6"
                    style={{ color: '#2dd4bf' }}
                  />
                </div>
                <h3 className="text-lg sm:text-xl font-bold mb-2 sm:mb-4">
                  Notes in your style, 10x faster
                </h3>
                <p className="text-sm sm:text-base text-gray-300">
                  SymptomDx learns your style and format with every edit. Get
                  customized notes in seconds.
                </p>
              </div>

              {/* Feature 2 */}
              <div
                className="rounded-lg p-5 sm:p-8 shadow-sm border border-opacity-30"
                style={{ background: '#243b53', borderColor: '#334e68' }}
              >
                <div
                  className="w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center mb-4 sm:mb-6"
                  style={{ background: '#334e68' }}
                >
                  <Headphones
                    className="h-5 w-5 sm:h-6 sm:w-6"
                    style={{ color: '#2dd4bf' }}
                  />
                </div>
                <h3 className="text-lg sm:text-xl font-bold mb-2 sm:mb-4">
                  Works in every setting
                </h3>
                <p className="text-sm sm:text-base text-gray-300">
                  Accurately capture AI medical notes for any specialty visit
                  and in multiple languages.
                </p>
              </div>

              {/* Feature 3 */}
              <div
                className="rounded-lg p-5 sm:p-8 shadow-sm border border-opacity-30"
                style={{ background: '#243b53', borderColor: '#334e68' }}
              >
                <div
                  className="w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center mb-4 sm:mb-6"
                  style={{ background: '#334e68' }}
                >
                  <Lightbulb
                    className="h-5 w-5 sm:h-6 sm:w-6"
                    style={{ color: '#2dd4bf' }}
                  />
                </div>
                <h3 className="text-lg sm:text-xl font-bold mb-2 sm:mb-4">
                  Easy to use
                </h3>
                <p className="text-sm sm:text-base text-gray-300">
                  Copy and paste into your "favorite EHR," or explore our
                  integration options.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section
          ref={addToRefs}
          className="min-h-screen py-16 md:py-0 flex flex-col justify-center md:vercel-snap-start"
          id="cta"
          style={{ background: '#102a43' }}
        >
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto text-center">
              <div
                className="p-6 sm:p-8 md:p-12 rounded-2xl shadow-lg"
                style={{ background: '#0967d2' }}
              >
                <h2 className="text-xl sm:text-2xl md:text-3xl font-bold tracking-tight mb-4 sm:mb-6">
                  Ready to transform your diagnostic approach?
                </h2>
                <p className="text-blue-100 text-sm sm:text-base md:text-lg mb-6 sm:mb-8 max-w-2xl mx-auto">
                  Join SymptomDx today and experience the difference that
                  systematic symptom tracking can make.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link href="/dashboard">
                    <div
                      className="inline-flex items-center justify-center w-full sm:w-auto px-6 py-2 sm:px-8 sm:py-3 h-10 sm:h-11 rounded-md shadow-sm text-sm sm:text-base font-medium"
                      style={{ background: 'white', color: '#0967d2' }}
                    >
                      Sign Up Now
                      <ArrowRight className="ml-1 sm:ml-2 h-4 w-4" />
                    </div>
                  </Link>
                  <div className="inline-flex items-center justify-center w-full sm:w-auto px-6 py-2 sm:px-8 sm:py-3 h-10 sm:h-11 rounded-md shadow-sm text-sm sm:text-base font-medium text-white border border-white bg-transparent hover:bg-opacity-20">
                    Contact Us
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer
        className="py-8 sm:py-12 border-t border-opacity-30"
        style={{ background: '#243b53', borderColor: '#334e68' }}
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between">
            <div className="mb-8 md:mb-0 text-center md:text-left">
              <Link
                href="/"
                className="flex items-center space-x-2 justify-center md:justify-start"
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="w-6 h-6 md:w-8 md:h-8 text-blue-500"
                >
                  <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
                </svg>
                <span className="text-xl font-semibold">
                  <span className="text-white">Symptom</span>
                  <span style={{ color: '#2dd4bf' }}>Dx</span>
                </span>
              </Link>
              <p className="mt-2 text-sm text-gray-400">
                LESS PAPERWORK, MORE CARE
              </p>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 sm:gap-8 text-center md:text-left">
              <div>
                <h3 className="text-sm font-semibold text-white tracking-wider uppercase mb-2 sm:mb-4">
                  Product
                </h3>
                <ul className="space-y-2">
                  <li>
                    <Link
                      href="#"
                      className="text-xs sm:text-sm text-gray-400 hover:text-teal-400"
                    >
                      Features
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="#"
                      className="text-xs sm:text-sm text-gray-400 hover:text-teal-400"
                    >
                      How it Works
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="#"
                      className="text-xs sm:text-sm text-gray-400 hover:text-teal-400"
                    >
                      Pricing
                    </Link>
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-white tracking-wider uppercase mb-2 sm:mb-4">
                  Company
                </h3>
                <ul className="space-y-2">
                  <li>
                    <Link
                      href="#"
                      className="text-xs sm:text-sm text-gray-400 hover:text-teal-400"
                    >
                      About
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="#"
                      className="text-xs sm:text-sm text-gray-400 hover:text-teal-400"
                    >
                      Blog
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="#"
                      className="text-xs sm:text-sm text-gray-400 hover:text-teal-400"
                    >
                      Careers
                    </Link>
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-white tracking-wider uppercase mb-2 sm:mb-4">
                  Support
                </h3>
                <ul className="space-y-2">
                  <li>
                    <Link
                      href="#"
                      className="text-xs sm:text-sm text-gray-400 hover:text-teal-400"
                    >
                      Help Center
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="#"
                      className="text-xs sm:text-sm text-gray-400 hover:text-teal-400"
                    >
                      Contact Us
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="#"
                      className="text-xs sm:text-sm text-gray-400 hover:text-teal-400"
                    >
                      Privacy
                    </Link>
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-white tracking-wider uppercase mb-2 sm:mb-4">
                  Legal
                </h3>
                <ul className="space-y-2">
                  <li>
                    <Link
                      href="#"
                      className="text-xs sm:text-sm text-gray-400 hover:text-teal-400"
                    >
                      Privacy Policy
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="#"
                      className="text-xs sm:text-sm text-gray-400 hover:text-teal-400"
                    >
                      Terms of Service
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="#"
                      className="text-xs sm:text-sm text-gray-400 hover:text-teal-400"
                    >
                      Cookie Policy
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <div
            className="mt-8 sm:mt-12 border-t border-opacity-30 pt-6 sm:pt-8"
            style={{ borderColor: '#334e68' }}
          >
            <p className="text-xs sm:text-sm text-gray-400 text-center">
              &copy; {new Date().getFullYear()} SymptomDx. All rights reserved.
            </p>
          </div>
        </div>
      </footer>

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
