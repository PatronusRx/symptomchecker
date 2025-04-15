import Link from 'next/link';
import Image from 'next/image';
import {
  ArrowRight,
  CheckCircle,
  Stethoscope,
  Users,
  FileText,
  Heart,
  Activity,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import '../app/landing.css';

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-b from-white to-gray-50">
      <main className="flex-1">
        {/* Hero Section - Modernized with better centering */}
        <section className="w-full py-16 md:py-24 lg:py-32 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-indigo-50 opacity-70"></div>
          <div className="container relative mx-auto px-4 md:px-6 max-w-6xl">
            <div className="grid gap-8 lg:grid-cols-2 items-center">
              <div className="flex flex-col justify-center space-y-6 text-center lg:text-left">
                <div className="space-y-4">
                  <h1 className="text-4xl font-bold tracking-tight sm:text-5xl xl:text-6xl text-blue-600">
                    FIND THE NEEDLE IN THE HAYSTACK
                  </h1>
                  <p className="text-xl text-gray-600 max-w-[600px] mx-auto lg:mx-0">
                    Rare diseases hiding in plain sight? Not anymore.
                  </p>
                  <p className="text-lg text-gray-600 max-w-[600px] mx-auto lg:mx-0">
                    Physicians hunt for rare diagnoses among countless symptoms
                    daily. Our tracker turns this challenge into precision
                    medicine.
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                  <Link href="/dashboard">
                    <Button
                      size="lg"
                      className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white font-medium"
                    >
                      Get Started
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                  <Button
                    size="lg"
                    variant="outline"
                    className="w-full sm:w-auto border-blue-200 hover:bg-blue-50"
                  >
                    Learn More
                  </Button>
                </div>
              </div>
              <div className="flex items-center justify-center">
                <div className="relative h-[300px] w-full md:h-[400px] lg:h-[450px] rounded-2xl overflow-hidden shadow-lg">
                  <Image
                    src="/placeholder.svg"
                    alt="Medical diagnostic illustration"
                    fill
                    className="object-cover"
                    priority
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Why It Matters Section - Improved formatting */}
        <section id="why" className="w-full py-16 md:py-24 bg-white">
          <div className="container mx-auto px-4 md:px-6 max-w-5xl">
            <div className="flex flex-col items-center justify-center space-y-6 text-center mb-12">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl text-gray-900">
                WHY IT MATTERS: A PHYSICIAN'S STORY
              </h2>
            </div>
            <div className="mx-auto max-w-3xl bg-blue-50 p-8 rounded-2xl shadow-sm">
              <blockquote className="border-l-4 border-blue-500 pl-6 italic text-xl text-gray-700 leading-relaxed">
                "My first weekend after residency, I spent all my spare time
                consuming FOAMed—Free Open Access Medical education—including
                podcasts, blogposts, and videos, especially Airway Interventions
                and Management in Emergencies (AIME).
                <br />
                <br />
                The very next weekend, a patient arrived VSA from a fire:
                inhalation injury, soot-filled airway, burns to 25% of their
                body. It was the most difficult airway I've ever encountered.
                <br />
                <br />
                Without those resources and systematic approach, that patient
                wouldn't have survived."
              </blockquote>
              <p className="mt-8 text-center text-lg font-medium text-blue-800">
                When preparation meets opportunity, lives are saved.
                <br />
                Our tracker is that preparation—systematized.
              </p>
            </div>
          </div>
        </section>

        {/* Choose Your Path Section - Modernized tabs */}
        <section className="w-full py-16 md:py-24 bg-gray-50">
          <div className="container mx-auto px-4 md:px-6 max-w-6xl">
            <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl text-gray-900">
                Choose Your Path
              </h2>
              <p className="max-w-[700px] text-gray-600 text-lg">
                SymptomDx offers specialized tools for both patients and medical
                professionals.
              </p>
            </div>

            <Tabs defaultValue="patients" className="w-full">
              <TabsList className="grid w-full max-w-md grid-cols-2 mx-auto mb-8 p-1 bg-gray-100 rounded-lg">
                <TabsTrigger
                  value="patients"
                  className="text-lg py-3 data-[state=active]:bg-white data-[state=active]:shadow rounded-md"
                >
                  <Users className="mr-2 h-5 w-5" />
                  Patients
                </TabsTrigger>
                <TabsTrigger
                  value="medical"
                  className="text-lg py-3 data-[state=active]:bg-white data-[state=active]:shadow rounded-md"
                >
                  <Stethoscope className="mr-2 h-5 w-5" />
                  Medical Professionals
                </TabsTrigger>
              </TabsList>

              <TabsContent value="patients" className="space-y-8">
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {[
                    {
                      icon: <CheckCircle className="h-6 w-6 text-blue-500" />,
                      title: 'Symptom Checklists',
                      description:
                        'Access 200+ symptom checklists to better communicate with your doctor and advocate for yourself.',
                    },
                    {
                      icon: <Heart className="h-6 w-6 text-blue-500" />,
                      title: 'Expecting Mothers',
                      description:
                        'Specialized checklists and resources for pregnancy and prenatal care.',
                    },
                    {
                      icon: <FileText className="h-6 w-6 text-blue-500" />,
                      title: "Children's Health",
                      description:
                        'Age-appropriate symptom tracking and health monitoring for children.',
                    },
                    {
                      icon: <Activity className="h-6 w-6 text-blue-500" />,
                      title: 'Cancer Screening',
                      description:
                        'Age and risk-appropriate cancer screening recommendations and symptom tracking.',
                    },
                    {
                      icon: <Users className="h-6 w-6 text-blue-500" />,
                      title: 'Male Health',
                      description:
                        'Specialized resources for male-specific health concerns and preventive care.',
                    },
                    {
                      icon: <Heart className="h-6 w-6 text-blue-500" />,
                      title: 'Female Health',
                      description:
                        'Comprehensive resources for female-specific health concerns across all life stages.',
                    },
                  ].map((item, index) => (
                    <div
                      key={index}
                      className="flex flex-col items-start gap-3 rounded-xl border border-gray-200 p-6 bg-white shadow-sm hover:shadow-md transition-shadow"
                    >
                      <div className="rounded-full bg-blue-50 p-3">
                        {item.icon}
                      </div>
                      <h3 className="text-xl font-bold text-gray-900">
                        {item.title}
                      </h3>
                      <p className="text-gray-600">{item.description}</p>
                    </div>
                  ))}
                </div>
                <div className="flex justify-center mt-10">
                  <Link href="/dashboard">
                    <Button
                      size="lg"
                      className="bg-blue-600 hover:bg-blue-700 text-white"
                    >
                      Access Patient Resources
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </TabsContent>

              <TabsContent value="medical" className="space-y-8">
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {[
                    {
                      icon: <Activity className="h-6 w-6 text-blue-500" />,
                      title: 'ECG Tool',
                      description:
                        'Advanced ECG analysis and interpretation assistance.',
                    },
                    {
                      icon: <FileText className="h-6 w-6 text-blue-500" />,
                      title: 'Radiograph / X-ray Tool',
                      description:
                        'Systematic approach to radiographic interpretation.',
                    },
                    {
                      icon: <Stethoscope className="h-6 w-6 text-blue-500" />,
                      title: 'POCUS Tool',
                      description:
                        'Point-of-care ultrasound guidance and interpretation.',
                    },
                    {
                      icon: <CheckCircle className="h-6 w-6 text-blue-500" />,
                      title: 'SOAP Note Generator',
                      description:
                        'From symptom checker to complete SOAP notes in minutes.',
                    },
                    {
                      icon: <FileText className="h-6 w-6 text-blue-500" />,
                      title: 'Medical Techniques',
                      description:
                        'Step-by-step walkthroughs of essential medical procedures and techniques.',
                    },
                    {
                      icon: <Activity className="h-6 w-6 text-blue-500" />,
                      title: 'Fracture/Dislocation Management',
                      description:
                        'Comprehensive guides for assessment, reduction, and management of fractures and dislocations.',
                    },
                  ].map((item, index) => (
                    <div
                      key={index}
                      className="flex flex-col items-start gap-3 rounded-xl border border-gray-200 p-6 bg-white shadow-sm hover:shadow-md transition-shadow"
                    >
                      <div className="rounded-full bg-blue-50 p-3">
                        {item.icon}
                      </div>
                      <h3 className="text-xl font-bold text-gray-900">
                        {item.title}
                      </h3>
                      <p className="text-gray-600">{item.description}</p>
                    </div>
                  ))}
                </div>
                <div className="flex justify-center mt-10">
                  <Link href="/dashboard">
                    <Button
                      size="lg"
                      className="bg-blue-600 hover:bg-blue-700 text-white"
                    >
                      Access Medical Tools
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </section>

        {/* Pilot-Inspired Section - Better spacing and contrast */}
        <section id="features" className="w-full py-16 md:py-24 bg-blue-50">
          <div className="container mx-auto px-4 md:px-6 max-w-6xl">
            <div className="flex flex-col items-center justify-center space-y-6 text-center mb-12">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl text-gray-900">
                PILOT-INSPIRED. PHYSICIAN-DRIVEN.
              </h2>
              <div className="max-w-2xl text-center">
                <p className="text-gray-700 text-lg mb-2">
                  Pilots use checklists to navigate emergencies. Emergency
                  physicians should too.
                </p>
                <p className="text-gray-700 text-lg">
                  Our symptom tracker brings aviation-grade precision to your
                  diagnostic process:
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl items-center gap-8 py-12 lg:grid-cols-2">
              <Image
                src="/placeholder.svg"
                width={500}
                height={400}
                alt="Medical checklist illustration"
                className="mx-auto rounded-2xl shadow-lg object-cover w-full max-w-md lg:order-last"
              />
              <div className="flex flex-col justify-center space-y-6">
                <ul className="grid gap-6">
                  {[
                    {
                      title: 'DOCUMENT',
                      description: 'Symptoms systematically',
                    },
                    {
                      title: 'DETECT',
                      description: 'Subtle patterns instantly',
                    },
                    { title: 'DIAGNOSE', description: 'With confidence' },
                    { title: 'DELIVER', description: 'Results consistently' },
                  ].map((item, index) => (
                    <li
                      key={index}
                      className="flex items-start gap-4 bg-white p-4 rounded-xl shadow-sm"
                    >
                      <div className="rounded-full bg-blue-100 p-2 mt-1">
                        <CheckCircle className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-gray-900">
                          {item.title}
                        </h3>
                        <p className="text-gray-600">{item.description}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Emergency Medicine Revolutionized Section - More visual appeal */}
        <section id="about" className="w-full py-16 md:py-24 bg-white">
          <div className="container mx-auto px-4 md:px-6 max-w-6xl">
            <div className="grid gap-10 md:gap-16 lg:grid-cols-2">
              <div className="bg-gray-50 p-8 rounded-2xl shadow-sm space-y-6">
                <h2 className="text-3xl font-bold tracking-tight text-gray-900">
                  EMERGENCY MEDICINE REVOLUTIONIZED
                </h2>
                <p className="text-gray-700 text-lg">
                  In high-stakes moments, checklists save lives. Your diagnostic
                  accuracy shouldn't depend on memory alone.
                </p>
                <ul className="space-y-3">
                  {[
                    'No more missed signals',
                    'No more diagnostic blind spots',
                    'No more documentation gaps',
                  ].map((item, index) => (
                    <li
                      key={index}
                      className="flex items-center gap-3 bg-white p-3 rounded-lg"
                    >
                      <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                      <span className="text-gray-800">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="bg-blue-600 text-white p-8 rounded-2xl shadow-sm space-y-6">
                <h2 className="text-3xl font-bold tracking-tight">
                  FROM HAYSTACK TO NEEDLE. EVERY TIME.
                </h2>
                <p className="text-blue-50 text-lg">
                  Join physicians who've transformed their diagnostic approach.
                </p>
                <div className="flex justify-start mt-8">
                  <Link href="/dashboard">
                    <Button
                      size="lg"
                      className="bg-white text-blue-600 hover:bg-blue-50"
                    >
                      Get Started Now
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section - Improved call to action */}
        <section className="w-full py-16 md:py-24 bg-gradient-to-b from-gray-50 to-white">
          <div className="container mx-auto px-4 md:px-6 max-w-4xl text-center">
            <div className="bg-blue-600 text-white p-8 md:p-12 rounded-2xl shadow-lg">
              <h2 className="text-3xl font-bold tracking-tight mb-6">
                Ready to transform your diagnostic approach?
              </h2>
              <p className="text-blue-100 text-lg mb-8 max-w-2xl mx-auto">
                Join SymptomDx today and experience the difference that
                systematic symptom tracking can make.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/dashboard">
                  <Button
                    size="lg"
                    className="w-full sm:w-auto bg-white text-blue-600 hover:bg-blue-50"
                  >
                    Sign Up Now
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
                <Button
                  size="lg"
                  variant="outline"
                  className="w-full sm:w-auto bg-transparent border-white text-white hover:bg-blue-700"
                >
                  Contact Us
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer - Simplified and centered */}
      <footer className="w-full border-t py-8 bg-white">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-2 font-bold">
              <Activity className="h-5 w-5 text-blue-600" />
              <span>SymptomDx</span>
            </div>
            <p className="text-center text-sm text-gray-600">
              &copy; {new Date().getFullYear()} SymptomDx. All rights reserved.
            </p>
            <div className="flex gap-6">
              <Link
                href="#"
                className="text-sm text-gray-600 hover:text-blue-600"
              >
                Privacy Policy
              </Link>
              <Link
                href="#"
                className="text-sm text-gray-600 hover:text-blue-600"
              >
                Terms of Service
              </Link>
              <Link
                href="#"
                className="text-sm text-gray-600 hover:text-blue-600"
              >
                Contact
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
