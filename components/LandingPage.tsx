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
    <div className="landing-wrapper flex min-h-screen flex-col">
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-b from-background to-muted">
          <div className="container mx-auto px-4 md:px-6 max-w-7xl">
            <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_500px] items-center">
              <div className="flex flex-col justify-center space-y-4 text-center lg:text-left">
                <div className="space-y-2">
                  <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none text-primary">
                    FIND THE NEEDLE IN THE HAYSTACK
                  </h1>
                  <p className="max-w-[600px] text-muted-foreground md:text-xl">
                    Rare diseases hiding in plain sight? Not anymore.
                  </p>
                  <p className="max-w-[600px] text-muted-foreground md:text-xl">
                    Physicians hunt for rare diagnoses among countless symptoms
                    daily. Our tracker turns this challenge into precision
                    medicine.
                  </p>
                </div>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Link href="/dashboard">
                    <Button
                      size="lg"
                      className="bg-primary text-primary-foreground"
                    >
                      Get Started
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                  <Button size="lg" variant="outline">
                    Learn More
                  </Button>
                </div>
              </div>
              <div className="flex items-center justify-center">
                <div className="relative h-[350px] w-[350px] md:h-[400px] md:w-[400px] lg:h-[450px] lg:w-[450px]">
                  <Image
                    src="/placeholder.svg"
                    alt="Medical diagnostic illustration"
                    fill
                    className="object-cover rounded-lg"
                    priority
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="why" className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                WHY IT MATTERS: A PHYSICIAN'S STORY
              </h2>
            </div>
            <div className="mx-auto max-w-3xl">
              <blockquote className="border-l-4 border-primary pl-6 italic text-xl text-muted-foreground">
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
              <p className="mt-8 text-center text-lg font-medium">
                When preparation meets opportunity, lives are saved.
                <br />
                Our tracker is that preparation—systematized.
              </p>
            </div>
          </div>
        </section>

        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <Tabs defaultValue="patients" className="w-full">
              <div className="flex flex-col items-center justify-center space-y-4 text-center mb-8">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                  Choose Your Path
                </h2>
                <p className="max-w-[700px] text-muted-foreground md:text-xl/relaxed">
                  SymptomDx offers specialized tools for both patients and
                  medical professionals.
                </p>
                <TabsList className="grid w-full max-w-md grid-cols-2 mt-6">
                  <TabsTrigger value="patients" className="text-lg py-3">
                    <Users className="mr-2 h-4 w-4" />
                    Patients
                  </TabsTrigger>
                  <TabsTrigger value="medical" className="text-lg py-3">
                    <Stethoscope className="mr-2 h-4 w-4" />
                    Medical Professionals
                  </TabsTrigger>
                </TabsList>
              </div>

              <TabsContent value="patients" className="space-y-8">
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  <div className="flex flex-col items-start gap-2 rounded-lg border p-6 shadow-sm">
                    <div className="rounded-full bg-primary/10 p-2">
                      <CheckCircle className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="text-xl font-bold">Symptom Checklists</h3>
                    <p className="text-muted-foreground">
                      Access 200+ symptom checklists to better communicate with
                      your doctor and advocate for yourself.
                    </p>
                  </div>
                  <div className="flex flex-col items-start gap-2 rounded-lg border p-6 shadow-sm">
                    <div className="rounded-full bg-primary/10 p-2">
                      <Heart className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="text-xl font-bold">Expecting Mothers</h3>
                    <p className="text-muted-foreground">
                      Specialized checklists and resources for pregnancy and
                      prenatal care.
                    </p>
                  </div>
                  <div className="flex flex-col items-start gap-2 rounded-lg border p-6 shadow-sm">
                    <div className="rounded-full bg-primary/10 p-2">
                      <FileText className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="text-xl font-bold">Children's Health</h3>
                    <p className="text-muted-foreground">
                      Age-appropriate symptom tracking and health monitoring for
                      children.
                    </p>
                  </div>
                  <div className="flex flex-col items-start gap-2 rounded-lg border p-6 shadow-sm">
                    <div className="rounded-full bg-primary/10 p-2">
                      <Activity className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="text-xl font-bold">Cancer Screening</h3>
                    <p className="text-muted-foreground">
                      Age and risk-appropriate cancer screening recommendations
                      and symptom tracking.
                    </p>
                  </div>
                  <div className="flex flex-col items-start gap-2 rounded-lg border p-6 shadow-sm">
                    <div className="rounded-full bg-primary/10 p-2">
                      <Users className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="text-xl font-bold">Male Health</h3>
                    <p className="text-muted-foreground">
                      Specialized resources for male-specific health concerns
                      and preventive care.
                    </p>
                  </div>
                  <div className="flex flex-col items-start gap-2 rounded-lg border p-6 shadow-sm">
                    <div className="rounded-full bg-primary/10 p-2">
                      <Heart className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="text-xl font-bold">Female Health</h3>
                    <p className="text-muted-foreground">
                      Comprehensive resources for female-specific health
                      concerns across all life stages.
                    </p>
                  </div>
                </div>
                <div className="flex justify-center mt-8">
                  <Link href="/dashboard">
                    <Button size="lg">
                      Access Patient Resources
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </TabsContent>

              <TabsContent value="medical" className="space-y-8">
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
                  <div className="flex flex-col items-start gap-2 rounded-lg border p-6 shadow-sm">
                    <div className="rounded-full bg-primary/10 p-2">
                      <Activity className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="text-xl font-bold">ECG Tool</h3>
                    <p className="text-muted-foreground">
                      Advanced ECG analysis and interpretation assistance.
                    </p>
                  </div>
                  <div className="flex flex-col items-start gap-2 rounded-lg border p-6 shadow-sm">
                    <div className="rounded-full bg-primary/10 p-2">
                      <FileText className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="text-xl font-bold">
                      Radiograph / X-ray Tool
                    </h3>
                    <p className="text-muted-foreground">
                      Systematic approach to radiographic interpretation.
                    </p>
                  </div>
                  <div className="flex flex-col items-start gap-2 rounded-lg border p-6 shadow-sm">
                    <div className="rounded-full bg-primary/10 p-2">
                      <Stethoscope className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="text-xl font-bold">POCUS Tool</h3>
                    <p className="text-muted-foreground">
                      Point-of-care ultrasound guidance and interpretation.
                    </p>
                  </div>
                  <div className="flex flex-col items-start gap-2 rounded-lg border p-6 shadow-sm">
                    <div className="rounded-full bg-primary/10 p-2">
                      <CheckCircle className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="text-xl font-bold">SOAP Note Generator</h3>
                    <p className="text-muted-foreground">
                      From symptom checker to complete SOAP notes in minutes.
                    </p>
                  </div>
                  <div className="flex flex-col items-start gap-2 rounded-lg border p-6 shadow-sm">
                    <div className="rounded-full bg-primary/10 p-2">
                      <FileText className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="text-xl font-bold">Medical Techniques</h3>
                    <p className="text-muted-foreground">
                      Step-by-step walkthroughs of essential medical procedures
                      and techniques.
                    </p>
                  </div>
                  <div className="flex flex-col items-start gap-2 rounded-lg border p-6 shadow-sm">
                    <div className="rounded-full bg-primary/10 p-2">
                      <Activity className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="text-xl font-bold">
                      Fracture/Dislocation Management
                    </h3>
                    <p className="text-muted-foreground">
                      Comprehensive guides for assessment, reduction, and
                      management of fractures and dislocations.
                    </p>
                  </div>
                </div>
                <div className="flex justify-center mt-8">
                  <Link href="/dashboard">
                    <Button size="lg">
                      Access Medical Tools
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </section>

        <section
          id="features"
          className="w-full py-12 md:py-24 lg:py-32 bg-muted"
        >
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                  PILOT-INSPIRED. PHYSICIAN-DRIVEN.
                </h2>
                <p className="max-w-[700px] text-muted-foreground md:text-xl/relaxed">
                  Pilots use checklists to navigate emergencies. Emergency
                  physicians should too.
                </p>
                <p className="max-w-[700px] text-muted-foreground md:text-xl/relaxed">
                  Our symptom tracker brings aviation-grade precision to your
                  diagnostic process:
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl items-center gap-6 py-12 lg:grid-cols-2 lg:gap-12">
              <Image
                src="/placeholder.svg"
                width={500}
                height={400}
                alt="Medical checklist illustration"
                className="mx-auto aspect-video overflow-hidden rounded-xl object-cover object-center sm:w-full lg:order-last"
              />
              <div className="flex flex-col justify-center space-y-4">
                <ul className="grid gap-6">
                  <li className="flex items-start gap-4">
                    <div className="rounded-full bg-primary/10 p-1 mt-1">
                      <CheckCircle className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold">DOCUMENT</h3>
                      <p className="text-muted-foreground">
                        Symptoms systematically
                      </p>
                    </div>
                  </li>
                  <li className="flex items-start gap-4">
                    <div className="rounded-full bg-primary/10 p-1 mt-1">
                      <CheckCircle className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold">DETECT</h3>
                      <p className="text-muted-foreground">
                        Subtle patterns instantly
                      </p>
                    </div>
                  </li>
                  <li className="flex items-start gap-4">
                    <div className="rounded-full bg-primary/10 p-1 mt-1">
                      <CheckCircle className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold">DIAGNOSE</h3>
                      <p className="text-muted-foreground">With confidence</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-4">
                    <div className="rounded-full bg-primary/10 p-1 mt-1">
                      <CheckCircle className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold">DELIVER</h3>
                      <p className="text-muted-foreground">
                        Results consistently
                      </p>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        <section id="about" className="w-full py-12 md:py-24 lg:py-32 bg-muted">
          <div className="container px-4 md:px-6">
            <div className="grid gap-10 md:gap-16 lg:grid-cols-2">
              <div className="space-y-4">
                <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">
                  EMERGENCY MEDICINE REVOLUTIONIZED
                </h2>
                <p className="text-muted-foreground md:text-xl">
                  In high-stakes moments, checklists save lives. Your diagnostic
                  accuracy shouldn't depend on memory alone.
                </p>
                <ul className="space-y-2">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-primary" />
                    <span>No more missed signals</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-primary" />
                    <span>No more diagnostic blind spots</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-primary" />
                    <span>No more documentation gaps</span>
                  </li>
                </ul>
              </div>
              <div className="space-y-4">
                <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">
                  FROM HAYSTACK TO NEEDLE. EVERY TIME.
                </h2>
                <p className="text-muted-foreground md:text-xl">
                  Join physicians who've transformed their diagnostic approach.
                </p>
                <div className="flex justify-start mt-6">
                  <Link href="/dashboard">
                    <Button
                      size="lg"
                      className="bg-primary text-primary-foreground"
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

        <section className="w-full py-12 md:py-24 lg:py-32 border-t">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                Ready to transform your diagnostic approach?
              </h2>
              <p className="max-w-[700px] text-muted-foreground md:text-xl/relaxed">
                Join SymptomDx today and experience the difference that
                systematic symptom tracking can make.
              </p>
              <div className="flex flex-col gap-2 min-[400px]:flex-row mt-6">
                <Link href="/dashboard">
                  <Button
                    size="lg"
                    className="bg-primary text-primary-foreground"
                  >
                    Sign Up Now
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
                <Button size="lg" variant="outline">
                  Contact Us
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer className="w-full border-t py-6 md:py-0">
        <div className="container flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row">
          <div className="flex items-center gap-2 font-bold">
            <Activity className="h-5 w-5 text-primary" />
            <span>SymptomDx</span>
          </div>
          <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
            &copy; {new Date().getFullYear()} SymptomDx. All rights reserved.
          </p>
          <div className="flex gap-4">
            <Link
              href="#"
              className="text-sm text-muted-foreground hover:text-primary"
            >
              Privacy Policy
            </Link>
            <Link
              href="#"
              className="text-sm text-muted-foreground hover:text-primary"
            >
              Terms of Service
            </Link>
            <Link
              href="#"
              className="text-sm text-muted-foreground hover:text-primary"
            >
              Contact
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
