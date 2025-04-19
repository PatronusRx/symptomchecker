"use client"

import { useEffect, useRef } from "react"
import Image from "next/image"
import Link from "next/link"
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
} from "lucide-react"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"

export default function Home() {
  const sectionsRef = useRef<HTMLDivElement[]>([])

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY
      const windowHeight = window.innerHeight

      let closestSection = 0
      let closestDistance = Math.abs(sectionsRef.current[0]?.offsetTop - scrollPosition)

      sectionsRef.current.forEach((section, index) => {
        if (!section) return
        const distance = Math.abs(section.offsetTop - scrollPosition)
        if (distance < closestDistance) {
          closestDistance = distance
          closestSection = index
        }
      })

      // Only snap if we're not in the middle of a manual scroll
      if (!document.body.classList.contains("scrolling")) {
        document.body.classList.add("scrolling")
        sectionsRef.current[closestSection]?.scrollIntoView({ behavior: "smooth" })
        setTimeout(() => {
          document.body.classList.remove("scrolling")
        }, 1000)
      }
    }

    let scrollTimeout: NodeJS.Timeout
    window.addEventListener("scroll", () => {
      clearTimeout(scrollTimeout)
      scrollTimeout = setTimeout(handleScroll, 100)
    })

    return () => {
      window.removeEventListener("scroll", handleScroll)
      clearTimeout(scrollTimeout)
    }
  }, [])

  const addToRefs = (el: HTMLDivElement) => {
    if (el && !sectionsRef.current.includes(el)) {
      sectionsRef.current.push(el)
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-navy-900 text-white">
      <header className="sticky top-0 z-50 bg-navy-900 border-b border-navy-700">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 md:h-20">
            <div className="flex items-center">
              <Link href="/" className="flex items-center space-x-2">
                <Image
                  src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/IMG_6295.jpg-7qKURRLXg61XWnv3AXprZpek8NwaNt.jpeg"
                  alt="SymptomDx Logo"
                  width={40}
                  height={40}
                  className="rounded-full"
                />
                <span className="text-xl font-semibold">
                  <span className="text-white">Symptom</span>
                  <span className="text-teal-400">Dx</span>
                </span>
              </Link>
            </div>
            <nav className="hidden md:flex items-center space-x-6">
              <div className="relative group">
                <button className="flex items-center space-x-1 text-gray-300 hover:text-teal-400">
                  <span>Features</span>
                  <ChevronDown className="h-4 w-4" />
                </button>
              </div>
              <Link href="#hiw" className="text-gray-300 hover:text-teal-400 font-medium">
                How it Works
              </Link>
              <Link href="/blog" className="text-gray-300 hover:text-teal-400">
                Blog
              </Link>
              <Link href="/patients" className="text-gray-300 hover:text-teal-400">
                For Patients
              </Link>
            </nav>
            <div className="flex items-center space-x-4">
              <Link
                href="/login"
                className="hidden md:inline-flex items-center justify-center px-4 py-2 border border-navy-600 rounded-md text-sm font-medium text-white bg-navy-800 hover:bg-navy-700"
              >
                Log In
              </Link>
              <Link
                href="/try"
                className="inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
              >
                Try for Free
              </Link>
              <button className="md:hidden">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="3" y1="12" x2="21" y2="12"></line>
                  <line x1="3" y1="6" x2="21" y2="6"></line>
                  <line x1="3" y1="18" x2="21" y2="18"></line>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-grow snap-y snap-mandatory">
        {/* Hero Section */}
        <section ref={addToRefs} className="h-screen flex items-center snap-start" id="hero">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
                  FIND THE NEEDLE
                  <br />
                  IN THE HAYSTACK
                </h1>
                <p className="text-lg text-gray-300 mb-4">Rare diseases hiding in plain sight? Not anymore.</p>
                <p className="text-lg text-gray-300 mb-8">
                  Physicians hunt for rare diagnoses among countless symptoms daily. Our tracker turns this challenge
                  into precision medicine.
                </p>
                <div className="space-y-4">
                  <Link
                    href="/get-started"
                    className="inline-flex items-center justify-center px-6 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-blue-600 hover:bg-blue-700"
                  >
                    Get Started
                  </Link>
                  <p className="text-sm text-gray-400">No credit card needed</p>
                </div>
                <div className="flex items-center space-x-4 mt-8">
                  <div className="flex-shrink-0 bg-navy-800 p-2 rounded-md">
                    <p className="text-xs text-teal-400">HIPAA Compliant</p>
                  </div>
                  <div className="flex-shrink-0 bg-navy-800 p-2 rounded-md">
                    <p className="text-xs text-teal-400">SOC 2</p>
                  </div>
                </div>
              </div>
              <div className="bg-navy-800 rounded-lg shadow-lg p-6 border border-navy-700">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-2">
                    <FileCheck className="h-5 w-5 text-teal-400" />
                    <span className="font-semibold">SymptomDx</span>
                  </div>
                </div>
                <div className="flex flex-col items-center justify-center h-64">
                  <p className="text-xl mb-4">Listening...</p>
                  <div className="w-full h-16 flex justify-center items-center">
                    <svg width="200" height="40" viewBox="0 0 200 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path
                        d="M10 20 Q 20 5, 30 20 Q 40 35, 50 20 Q 60 5, 70 20 Q 80 35, 90 20 Q 100 5, 110 20 Q 120 35, 130 20 Q 140 5, 150 20 Q 160 35, 170 20 Q 180 5, 190 20"
                        stroke="#2dd4bf"
                        strokeWidth="2"
                      />
                    </svg>
                  </div>
                  <div className="mt-8 flex space-x-4">
                    <button className="px-4 py-2 bg-blue-600 text-white rounded-md flex items-center space-x-2">
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
                      >
                        <circle cx="12" cy="12" r="10"></circle>
                        <rect x="9" y="9" width="6" height="6"></rect>
                      </svg>
                      <span>End Visit</span>
                    </button>
                    <button className="p-2 bg-navy-700 rounded-md">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
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

        {/* How it Works Section */}
        <section ref={addToRefs} className="h-screen flex items-center snap-start" id="hiw">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
                PILOT-INSPIRED. PHYSICIAN-DRIVEN.
              </h2>
              <p className="text-lg text-gray-300 max-w-3xl mx-auto">
                Pilots use checklists to navigate emergencies. Emergency physicians should too. Our symptom tracker
                brings aviation-grade precision to your diagnostic process:
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {/* Step 1 */}
              <div className="flex flex-col">
                <div className="rounded-xl overflow-hidden mb-6 bg-gradient-to-br from-navy-800 to-blue-900 aspect-square flex items-center justify-center border border-navy-700">
                  <div className="w-3/5 h-3/5 relative">
                    <Image
                      src="/placeholder.svg?height=300&width=300"
                      alt="Capture"
                      width={300}
                      height={300}
                      className="object-contain"
                    />
                  </div>
                </div>
                <h3 className="text-xl font-bold mb-3">01. Capture</h3>
                <p className="text-gray-300">
                  Select "Capture visit" when your visit begins. SymptomDx can listen for up to three hours, whether
                  it's a virtual or office visit.
                </p>
              </div>

              {/* Step 2 */}
              <div className="flex flex-col">
                <div className="rounded-xl overflow-hidden mb-6 bg-gradient-to-br from-navy-800 to-blue-900 aspect-square flex items-center justify-center border border-navy-700">
                  <div className="w-3/5 h-3/5 relative">
                    <Image
                      src="/placeholder.svg?height=300&width=300"
                      alt="Edit"
                      width={300}
                      height={300}
                      className="object-contain"
                    />
                  </div>
                </div>
                <h3 className="text-xl font-bold mb-3">02. Edit</h3>
                <p className="text-gray-300">
                  Select "End visit." Your medical documentation will be ready in one minute. Edit to help SymptomDx
                  learn your style.
                </p>
              </div>

              {/* Step 3 */}
              <div className="flex flex-col">
                <div className="rounded-xl overflow-hidden mb-6 bg-gradient-to-br from-navy-800 to-blue-900 aspect-square flex items-center justify-center border border-navy-700">
                  <div className="w-3/5 h-3/5 relative">
                    <Image
                      src="/placeholder.svg?height=300&width=300"
                      alt="Sign off"
                      width={300}
                      height={300}
                      className="object-contain"
                    />
                  </div>
                </div>
                <h3 className="text-xl font-bold mb-3">03. Sign off</h3>
                <p className="text-gray-300">
                  Send simple patient instructions, then copy/paste or integrate with your EHR.
                </p>
              </div>
            </div>

            <div className="text-center mt-16">
              <Link
                href="/try"
                className="inline-flex items-center justify-center px-6 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-blue-600 hover:bg-blue-700"
              >
                Try for Free
              </Link>
            </div>
          </div>
        </section>

        {/* Choose Your Path Section */}
        <section ref={addToRefs} className="h-screen flex items-center snap-start" id="choose-path">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
            <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">Choose Your Path</h2>
              <p className="max-w-[700px] text-gray-300 text-lg">
                SymptomDx offers specialized tools for both patients and medical professionals.
              </p>
            </div>

            <Tabs defaultValue="patients" className="w-full">
              <TabsList className="grid w-full max-w-md grid-cols-2 mx-auto mb-8 p-1 bg-navy-800 rounded-lg">
                <TabsTrigger
                  value="patients"
                  className="text-lg py-3 px-2 data-[state=active]:bg-navy-700 data-[state=active]:shadow rounded-md flex items-center justify-center"
                >
                  <Users className="mr-2 h-5 w-5" />
                  Patients
                </TabsTrigger>
                <TabsTrigger
                  value="medical"
                  className="text-lg py-3 px-2 data-[state=active]:bg-navy-700 data-[state=active]:shadow rounded-md flex items-center justify-center"
                >
                  <Stethoscope className="mr-2 h-5 w-5" />
                  Medical Professionals
                </TabsTrigger>
              </TabsList>

              <TabsContent value="patients" className="space-y-8 mt-6">
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {[
                    {
                      icon: <CheckCircle className="h-6 w-6 text-teal-400" />,
                      title: "Symptom Checklists",
                      description:
                        "Access 200+ symptom checklists to better communicate with your doctor and advocate for yourself.",
                    },
                    {
                      icon: <Heart className="h-6 w-6 text-teal-400" />,
                      title: "Expecting Mothers",
                      description: "Specialized checklists and resources for pregnancy and prenatal care.",
                    },
                    {
                      icon: <FileText className="h-6 w-6 text-teal-400" />,
                      title: "Children's Health",
                      description: "Age-appropriate symptom tracking and health monitoring for children.",
                    },
                    {
                      icon: <Activity className="h-6 w-6 text-teal-400" />,
                      title: "Cancer Screening",
                      description: "Age and risk-appropriate cancer screening recommendations and symptom tracking.",
                    },
                    {
                      icon: <Users className="h-6 w-6 text-teal-400" />,
                      title: "Male Health",
                      description: "Specialized resources for male-specific health concerns and preventive care.",
                    },
                    {
                      icon: <Heart className="h-6 w-6 text-teal-400" />,
                      title: "Female Health",
                      description:
                        "Comprehensive resources for female-specific health concerns across all life stages.",
                    },
                  ].map((item, index) => (
                    <div
                      key={index}
                      className="flex flex-col items-start gap-3 rounded-xl border border-navy-700 p-6 bg-navy-800 shadow-sm hover:shadow-md transition-shadow h-full"
                    >
                      <div className="rounded-full bg-navy-700 p-3">{item.icon}</div>
                      <h3 className="text-xl font-bold text-white">{item.title}</h3>
                      <p className="text-gray-300">{item.description}</p>
                    </div>
                  ))}
                </div>
                <div className="flex justify-center mt-10">
                  <Link href="/dashboard">
                    <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white">
                      Access Patient Resources
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </TabsContent>

              <TabsContent value="medical" className="space-y-8 mt-6">
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {[
                    {
                      icon: <Activity className="h-6 w-6 text-teal-400" />,
                      title: "ECG Tool",
                      description: "Advanced ECG analysis and interpretation assistance.",
                    },
                    {
                      icon: <FileText className="h-6 w-6 text-teal-400" />,
                      title: "Radiograph / X-ray Tool",
                      description: "Systematic approach to radiographic interpretation.",
                    },
                    {
                      icon: <Stethoscope className="h-6 w-6 text-teal-400" />,
                      title: "POCUS Tool",
                      description: "Point-of-care ultrasound guidance and interpretation.",
                    },
                    {
                      icon: <CheckCircle className="h-6 w-6 text-teal-400" />,
                      title: "SOAP Note Generator",
                      description: "From symptom checker to complete SOAP notes in minutes.",
                    },
                    {
                      icon: <FileText className="h-6 w-6 text-teal-400" />,
                      title: "Medical Techniques",
                      description: "Step-by-step walkthroughs of essential medical procedures and techniques.",
                    },
                    {
                      icon: <Activity className="h-6 w-6 text-teal-400" />,
                      title: "Fracture/Dislocation Management",
                      description:
                        "Comprehensive guides for assessment, reduction, and management of fractures and dislocations.",
                    },
                  ].map((item, index) => (
                    <div
                      key={index}
                      className="flex flex-col items-start gap-3 rounded-xl border border-navy-700 p-6 bg-navy-800 shadow-sm hover:shadow-md transition-shadow h-full"
                    >
                      <div className="rounded-full bg-navy-700 p-3">{item.icon}</div>
                      <h3 className="text-xl font-bold text-white">{item.title}</h3>
                      <p className="text-gray-300">{item.description}</p>
                    </div>
                  ))}
                </div>
                <div className="flex justify-center mt-10">
                  <Link href="/dashboard">
                    <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white">
                      Access Medical Tools
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </section>

        {/* Testimonials Section */}
        <section ref={addToRefs} className="h-screen flex items-center snap-start" id="why-it-matters">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
                WHY IT MATTERS: A PHYSICIAN'S STORY
              </h2>
            </div>

            <div className="max-w-4xl mx-auto">
              <div className="bg-navy-800 rounded-lg p-8 shadow-lg border border-navy-700 mb-8">
                <p className="text-gray-300 mb-6 text-lg italic">
                  "My first weekend after residency, I spent all my spare time consuming FOAMed—Free Open Access Medical
                  education—including podcasts, blogposts, and videos, especially Airway Interventions and Management in
                  Emergencies (AIME).
                </p>
                <p className="text-gray-300 mb-6 text-lg italic">
                  The very next weekend, a patient arrived VSA from a fire: inhalation injury, soot-filled airway, burns
                  to 25% of their body. It was the most difficult airway I've ever encountered.
                </p>
                <p className="text-gray-300 text-lg italic">
                  Without those resources and systematic approach, that patient wouldn't have survived."
                </p>
              </div>

              <div className="text-center">
                <p className="text-xl text-teal-400 font-bold mb-4">
                  When preparation meets opportunity, lives are saved.
                </p>
                <p className="text-lg text-gray-300">Our tracker is that preparation—systematized.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials Carousel */}
        <section ref={addToRefs} className="h-screen flex items-center snap-start bg-navy-800" id="reviews">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
                Loved by over 17,000 clinicians
              </h2>
              <p className="text-lg text-gray-300">(and their families)</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {/* Testimonial 1 */}
              <div className="bg-navy-700 rounded-lg p-6 shadow-md border border-navy-600">
                <div className="mb-4">
                  <p className="font-medium text-white">Psychiatric Mental Health</p>
                  <p className="text-gray-400">Kristy, NP</p>
                </div>
                <p className="text-gray-300 mb-4">
                  "SymptomDx is the best AI medical scribe I've used. It saves me so much time on clinical
                  documentation. I get to focus on my patients instead of my keyboard."
                </p>
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <svg
                      key={i}
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="#2dd4bf"
                      stroke="#2dd4bf"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                    </svg>
                  ))}
                </div>
              </div>

              {/* Testimonial 2 */}
              <div className="bg-navy-700 rounded-lg p-6 shadow-md border border-navy-600">
                <div className="mb-4">
                  <p className="font-medium text-white">ARNP</p>
                  <p className="text-gray-400">Erica D.</p>
                </div>
                <p className="text-gray-300 mb-4">
                  "SymptomDx is the best AI medical scribe I've used. It saves me so much time on clinical
                  documentation. I get to focus on my patients instead of my keyboard."
                </p>
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <svg
                      key={i}
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="#2dd4bf"
                      stroke="#2dd4bf"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                    </svg>
                  ))}
                </div>
              </div>

              {/* Testimonial 3 */}
              <div className="bg-navy-700 rounded-lg p-6 shadow-md border border-navy-600">
                <div className="mb-4">
                  <p className="font-medium text-white">Psychiatry</p>
                  <p className="text-gray-400">Dawn, DNP</p>
                </div>
                <p className="text-gray-300 mb-4">"I am glad to have my time back!!"</p>
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <svg
                      key={i}
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="#2dd4bf"
                      stroke="#2dd4bf"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                    </svg>
                  ))}
                </div>
              </div>
            </div>

            <div className="text-center mt-12">
              <button className="inline-flex items-center justify-center px-6 py-3 border border-navy-600 rounded-md shadow-sm text-base font-medium text-white bg-navy-700 hover:bg-navy-600">
                View More
              </button>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section ref={addToRefs} className="h-screen flex items-center snap-start" id="features">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">Your trusted AI scribe</h2>
              <p className="text-lg text-gray-300">Clinical precision without the documentation stress</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {/* Feature 1 */}
              <div className="bg-navy-800 rounded-lg p-8 shadow-sm border border-navy-700">
                <div className="w-12 h-12 bg-navy-700 rounded-full flex items-center justify-center mb-6">
                  <Gauge className="h-6 w-6 text-teal-400" />
                </div>
                <h3 className="text-xl font-bold mb-4">Notes in your style, 10x faster</h3>
                <p className="text-gray-300">
                  SymptomDx learns your style and format with every edit. Get customized notes in seconds.
                </p>
              </div>

              {/* Feature 2 */}
              <div className="bg-navy-800 rounded-lg p-8 shadow-sm border border-navy-700">
                <div className="w-12 h-12 bg-navy-700 rounded-full flex items-center justify-center mb-6">
                  <Headphones className="h-6 w-6 text-teal-400" />
                </div>
                <h3 className="text-xl font-bold mb-4">Works in every setting</h3>
                <p className="text-gray-300">
                  Accurately capture AI medical notes for any specialty visit and in multiple languages.
                </p>
              </div>

              {/* Feature 3 */}
              <div className="bg-navy-800 rounded-lg p-8 shadow-sm border border-navy-700">
                <div className="w-12 h-12 bg-navy-700 rounded-full flex items-center justify-center mb-6">
                  <Lightbulb className="h-6 w-6 text-teal-400" />
                </div>
                <h3 className="text-xl font-bold mb-4">Easy to use</h3>
                <p className="text-gray-300">
                  Copy and paste into your "favorite EHR," or explore our integration options.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Partners Section */}
        <section
          ref={addToRefs}
          className="h-screen flex items-center snap-start border-t border-navy-700"
          id="partners"
        >
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">Our Partners</h2>
              <p className="text-lg text-gray-300">Trusted by leading healthcare organizations</p>
            </div>

            <div className="flex flex-wrap justify-center items-center gap-8 md:gap-12">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="opacity-60 hover:opacity-100 transition-opacity">
                  <Image
                    src="/placeholder.svg?height=40&width=120"
                    alt={`Partner ${i + 1}`}
                    width={120}
                    height={40}
                    className="h-8 object-contain invert"
                  />
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-navy-800 py-12 border-t border-navy-700">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between">
            <div className="mb-8 md:mb-0">
              <Link href="/" className="flex items-center space-x-2">
                <Image
                  src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/IMG_6295.jpg-7qKURRLXg61XWnv3AXprZpek8NwaNt.jpeg"
                  alt="SymptomDx Logo"
                  width={40}
                  height={40}
                  className="rounded-full"
                />
                <span className="text-xl font-semibold">
                  <span className="text-white">Symptom</span>
                  <span className="text-teal-400">Dx</span>
                </span>
              </Link>
              <p className="mt-2 text-sm text-gray-400">LESS PAPERWORK, MORE CARE</p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              <div>
                <h3 className="text-sm font-semibold text-white tracking-wider uppercase">Product</h3>
                <ul className="mt-4 space-y-2">
                  <li>
                    <Link href="#" className="text-sm text-gray-400 hover:text-teal-400">
                      Features
                    </Link>
                  </li>
                  <li>
                    <Link href="#" className="text-sm text-gray-400 hover:text-teal-400">
                      How it Works
                    </Link>
                  </li>
                  <li>
                    <Link href="#" className="text-sm text-gray-400 hover:text-teal-400">
                      Pricing
                    </Link>
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-white tracking-wider uppercase">Company</h3>
                <ul className="mt-4 space-y-2">
                  <li>
                    <Link href="#" className="text-sm text-gray-400 hover:text-teal-400">
                      About
                    </Link>
                  </li>
                  <li>
                    <Link href="#" className="text-sm text-gray-400 hover:text-teal-400">
                      Blog
                    </Link>
                  </li>
                  <li>
                    <Link href="#" className="text-sm text-gray-400 hover:text-teal-400">
                      Careers
                    </Link>
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-white tracking-wider uppercase">Support</h3>
                <ul className="mt-4 space-y-2">
                  <li>
                    <Link href="#" className="text-sm text-gray-400 hover:text-teal-400">
                      Help Center
                    </Link>
                  </li>
                  <li>
                    <Link href="#" className="text-sm text-gray-400 hover:text-teal-400">
                      Contact Us
                    </Link>
                  </li>
                  <li>
                    <Link href="#" className="text-sm text-gray-400 hover:text-teal-400">
                      Privacy
                    </Link>
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-white tracking-wider uppercase">Legal</h3>
                <ul className="mt-4 space-y-2">
                  <li>
                    <Link href="#" className="text-sm text-gray-400 hover:text-teal-400">
                      Privacy Policy
                    </Link>
                  </li>
                  <li>
                    <Link href="#" className="text-sm text-gray-400 hover:text-teal-400">
                      Terms of Service
                    </Link>
                  </li>
                  <li>
                    <Link href="#" className="text-sm text-gray-400 hover:text-teal-400">
                      Cookie Policy
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <div className="mt-12 border-t border-navy-700 pt-8">
            <p className="text-sm text-gray-400 text-center">
              &copy; {new Date().getFullYear()} SymptomDx. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
