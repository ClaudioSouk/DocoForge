import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { FileText, Mail, CreditCard, Check, ChevronDown, ArrowRight, Code, Database, Sparkles, Server } from "lucide-react";
import Logo from "../components/Logo";
import { useAuth } from "../context/AuthContext";
import AnimatedGradientText from "../components/animations/AnimatedGradientText";
import FloatingElements from "../components/animations/FloatingElements";
import ParallaxCard from "../components/animations/ParallaxCard";
import ScrollReveal from "../components/animations/ScrollReveal";
import { 
  Carousel, 
  CarouselContent, 
  CarouselItem, 
  CarouselNext, 
  CarouselPrevious 
} from "@/components/ui/carousel";
import { Slider } from "@/components/ui/slider";

const Index: React.FC = () => {
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();
  const [activeSlide, setActiveSlide] = useState(0);
  const [autoplay, setAutoplay] = useState(true);

  const heroSlides = [
    {
      title: "Smart Freelance Tools, Simplified",
      description: "Generate professional proposals, onboarding emails, and invoices in seconds. Streamline your workflow and impress your clients.",
      image: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=1200&h=675&q=80",
      alt: "Team Collaboration Meeting"
    },
    {
      title: "AI-Powered Document Generation",
      description: "Let our AI create perfect client-ready documents based on your project details. Professional results in a fraction of the time.",
      image: "https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=1200&h=675&q=80",
      alt: "Digital Document Creation"
    },
    {
      title: "Get Paid Faster with Smart Invoices",
      description: "Create professional invoices with built-in tracking and automated reminders to improve your cash flow.",
      image: "https://images.unsplash.com/photo-1521791055366-0d553872125f?auto=format&fit=crop&w=1200&h=675&q=80",
      alt: "Financial Planning and Invoicing"
    }
  ];

  useEffect(() => {
    if (!isLoading && user) {
      navigate("/dashboard");
    }
  }, [user, isLoading, navigate]);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    
    if (autoplay) {
      interval = setInterval(() => {
        setActiveSlide((prev) => (prev + 1) % heroSlides.length);
      }, 5000);
    }
    
    return () => clearInterval(interval);
  }, [autoplay, heroSlides.length]);

  const scrollToFeatures = () => {
    const featuresSection = document.getElementById("features");
    if (featuresSection) {
      featuresSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
      <header className="fixed w-full z-50 bg-gray-900/80 backdrop-blur-md border-b border-gray-700">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Logo size="md" />
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              className="text-gray-300 hover:text-white hover:bg-gray-800"
              onClick={() => navigate("/login")}
            >
              Sign In
            </Button>
            <Button 
              className="bg-gradient-to-r from-brand-600 to-purple-600 hover:from-brand-700 hover:to-purple-700 transition-all duration-500"
              onClick={() => navigate("/register")}
            >
              Get Started
            </Button>
          </div>
        </div>
      </header>

      <main>
        {/* Hero Section with Fixed Left Content and Carousel Images */}
        <section className="min-h-screen w-full flex items-center justify-center pt-16 relative overflow-hidden">
          <FloatingElements count={20} tech={true} density="medium">
            <div className="container mx-auto px-4 relative z-10 py-20">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                {/* Left side - Fixed content that always stays visible */}
                <div className="space-y-6">
                  <ScrollReveal delay={100}>
                    <AnimatedGradientText 
                      text="Smart Freelance Tools, Simplified"
                      className="mb-6"
                    />
                  </ScrollReveal>
                  
                  <ScrollReveal delay={200}>
                    <p className="text-xl text-gray-300 mb-8">
                      Generate professional proposals, onboarding emails, and invoices in seconds. 
                      Streamline your workflow and impress your clients.
                    </p>
                  </ScrollReveal>
                  
                  <ScrollReveal delay={300}>
                    <div className="flex flex-col md:flex-row gap-4">
                      <Button
                        size="lg"
                        className="bg-gradient-to-r from-brand-600 to-purple-600 hover:from-brand-700 hover:to-purple-700 transition-all duration-500"
                        onClick={() => navigate("/register")}
                      >
                        Start Free Trial
                      </Button>
                      <Button
                        size="lg"
                        variant="outline"
                        className="border-gray-600 text-gray-300 hover:bg-gray-800 group"
                        onClick={scrollToFeatures}
                      >
                        See Features
                        <ChevronDown className="ml-1 group-hover:translate-y-1 transition-transform" />
                      </Button>
                    </div>
                  </ScrollReveal>
                </div>
                
                {/* Right side - Carousel that changes images */}
                <div className="relative">
                  <Carousel 
                    className="w-full"
                    setApi={(api) => {
                      if (api) {
                        api.on('select', () => {
                          setActiveSlide(api.selectedScrollSnap());
                        });
                      }
                    }}
                  >
                    <CarouselContent>
                      {heroSlides.map((slide, index) => (
                        <CarouselItem key={index} className="w-full">
                          <div className="relative">
                            <div className="absolute inset-0 bg-gradient-to-br from-brand-500/30 via-purple-500/20 to-transparent rounded-xl blur-2xl"></div>
                            <div className="relative z-10 rounded-lg overflow-hidden border border-brand-500/20 shadow-2xl transform transition-all duration-700">
                              <div className="absolute inset-0 bg-gradient-to-tr from-brand-900/30 to-transparent z-10"></div>
                              <img 
                                src={slide.image} 
                                alt={slide.alt} 
                                className="w-full object-cover aspect-video"
                              />
                              {/* Tech overlay */}
                              <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent_39px,rgba(139,92,246,0.1)_39px,rgba(139,92,246,0.1)_41px,transparent_41px),linear-gradient(180deg,transparent_39px,rgba(139,92,246,0.1)_39px,rgba(139,92,246,0.1)_41px,transparent_41px)] bg-[length:40px_40px] opacity-40 mix-blend-overlay pointer-events-none"></div>
                            </div>
                          </div>
                        </CarouselItem>
                      ))}
                    </CarouselContent>
                    
                    <div className="flex items-center justify-center mt-8">
                      <div className="flex space-x-3">
                        {heroSlides.map((_, index) => (
                          <button
                            key={index}
                            onClick={() => setActiveSlide(index)}
                            className={`w-3 h-3 rounded-full transition-all duration-300 ${
                              activeSlide === index 
                                ? "bg-brand-500 w-8" 
                                : "bg-gray-600 hover:bg-gray-500"
                            }`}
                            aria-label={`Go to slide ${index + 1}`}
                          />
                        ))}
                      </div>
                    </div>
                  </Carousel>
                </div>
              </div>
            </div>
          </FloatingElements>

          {/* Tech background elements */}
          <div className="absolute inset-0 overflow-hidden z-0 opacity-10">
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-brand-500 to-transparent"></div>
            <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-purple-500 to-transparent"></div>
            <div className="absolute top-0 bottom-0 left-0 w-px bg-gradient-to-b from-transparent via-brand-500 to-transparent"></div>
            <div className="absolute top-0 bottom-0 right-0 w-px bg-gradient-to-b from-transparent via-purple-500 to-transparent"></div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-20 relative">
          <div className="absolute inset-0 bg-gradient-to-b from-gray-900 to-gray-800 z-0"></div>
          <div className="container mx-auto px-4 relative z-10">
            <ScrollReveal>
              <div className="flex items-center justify-center mb-3">
                <div className="h-px w-12 bg-brand-500"></div>
                <span className="mx-4 text-brand-400">FEATURES</span>
                <div className="h-px w-12 bg-brand-500"></div>
              </div>
              <h2 className="text-3xl font-bold text-center mb-12 bg-gradient-to-r from-brand-400 to-purple-400 bg-clip-text text-transparent">
                Powerful Tools for Freelancers
              </h2>
            </ScrollReveal>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <ScrollReveal delay={100} direction="left">
                <ParallaxCard className="h-full">
                  <div className="bg-gray-800/50 backdrop-blur-sm p-6 rounded-lg border border-gray-700 h-full relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-20 h-20 bg-brand-500/10 blur-xl rounded-full -mr-10 -mt-10"></div>
                    <div className="bg-gradient-to-br from-brand-500/20 to-brand-700/20 w-12 h-12 rounded-lg flex items-center justify-center mb-4 relative">
                      <FileText className="h-6 w-6 text-brand-400" />
                    </div>
                    <h3 className="text-xl font-bold mb-2 text-white">Proposal Generator</h3>
                    <p className="text-gray-300 mb-4">
                      Create professionally formatted proposals with customized project details, pricing, and timelines in seconds.
                    </p>
                    <ul className="space-y-2 mb-6">
                      <li className="flex items-start">
                        <Check className="h-5 w-5 text-brand-500 mr-2 flex-shrink-0 mt-0.5" />
                        <span className="text-sm text-gray-300">Professional introduction</span>
                      </li>
                      <li className="flex items-start">
                        <Check className="h-5 w-5 text-brand-500 mr-2 flex-shrink-0 mt-0.5" />
                        <span className="text-sm text-gray-300">Detailed services section</span>
                      </li>
                      <li className="flex items-start">
                        <Check className="h-5 w-5 text-brand-500 mr-2 flex-shrink-0 mt-0.5" />
                        <span className="text-sm text-gray-300">Project timeline</span>
                      </li>
                    </ul>
                    <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-brand-500/5 blur-xl rounded-full"></div>
                  </div>
                </ParallaxCard>
              </ScrollReveal>

              <ScrollReveal delay={200}>
                <ParallaxCard className="h-full">
                  <div className="bg-gray-800/50 backdrop-blur-sm p-6 rounded-lg border border-gray-700 h-full relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-20 h-20 bg-purple-500/10 blur-xl rounded-full -mr-10 -mt-10"></div>
                    <div className="bg-gradient-to-br from-purple-500/20 to-purple-700/20 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                      <Mail className="h-6 w-6 text-purple-400" />
                    </div>
                    <h3 className="text-xl font-bold mb-2 text-white">Onboarding Emails</h3>
                    <p className="text-gray-300 mb-4">
                      Welcome new clients with professional onboarding emails that outline next steps and build strong relationships.
                    </p>
                    <ul className="space-y-2 mb-6">
                      <li className="flex items-start">
                        <Check className="h-5 w-5 text-purple-500 mr-2 flex-shrink-0 mt-0.5" />
                        <span className="text-sm text-gray-300">Welcoming message</span>
                      </li>
                      <li className="flex items-start">
                        <Check className="h-5 w-5 text-purple-500 mr-2 flex-shrink-0 mt-0.5" />
                        <span className="text-sm text-gray-300">Project overview</span>
                      </li>
                      <li className="flex items-start">
                        <Check className="h-5 w-5 text-purple-500 mr-2 flex-shrink-0 mt-0.5" />
                        <span className="text-sm text-gray-300">Clear next steps</span>
                      </li>
                    </ul>
                    <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-purple-500/5 blur-xl rounded-full"></div>
                  </div>
                </ParallaxCard>
              </ScrollReveal>

              <ScrollReveal delay={300} direction="right">
                <ParallaxCard className="h-full">
                  <div className="bg-gray-800/50 backdrop-blur-sm p-6 rounded-lg border border-gray-700 h-full relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-20 h-20 bg-indigo-500/10 blur-xl rounded-full -mr-10 -mt-10"></div>
                    <div className="bg-gradient-to-br from-indigo-500/20 to-indigo-700/20 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                      <CreditCard className="h-6 w-6 text-indigo-400" />
                    </div>
                    <h3 className="text-xl font-bold mb-2 text-white">Invoice Generator</h3>
                    <p className="text-gray-300 mb-4">
                      Generate professional invoices with itemized services, payment details, and branding to get paid faster.
                    </p>
                    <ul className="space-y-2 mb-6">
                      <li className="flex items-start">
                        <Check className="h-5 w-5 text-indigo-500 mr-2 flex-shrink-0 mt-0.5" />
                        <span className="text-sm text-gray-300">Itemized services</span>
                      </li>
                      <li className="flex items-start">
                        <Check className="h-5 w-5 text-indigo-500 mr-2 flex-shrink-0 mt-0.5" />
                        <span className="text-sm text-gray-300">Automatic calculations</span>
                      </li>
                      <li className="flex items-start">
                        <Check className="h-5 w-5 text-indigo-500 mr-2 flex-shrink-0 mt-0.5" />
                        <span className="text-sm text-gray-300">Professional formatting</span>
                      </li>
                    </ul>
                    <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-indigo-500/5 blur-xl rounded-full"></div>
                  </div>
                </ParallaxCard>
              </ScrollReveal>
            </div>
            
            {/* Tech features */}
            <ScrollReveal delay={400}>
              <div className="mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                <div className="bg-gray-800/30 backdrop-blur-sm rounded-lg p-6 border border-gray-700 text-center">
                  <div className="mx-auto w-12 h-12 rounded-full bg-brand-900/50 flex items-center justify-center mb-4">
                    <Code className="h-6 w-6 text-brand-400" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2 text-white">AI Templates</h3>
                  <p className="text-gray-300 text-sm">Smart templates that adapt to your project needs</p>
                </div>
                <div className="bg-gray-800/30 backdrop-blur-sm rounded-lg p-6 border border-gray-700 text-center">
                  <div className="mx-auto w-12 h-12 rounded-full bg-purple-900/50 flex items-center justify-center mb-4">
                    <Database className="h-6 w-6 text-purple-400" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2 text-white">Cloud Storage</h3>
                  <p className="text-gray-300 text-sm">Access your documents from anywhere, anytime</p>
                </div>
                <div className="bg-gray-800/30 backdrop-blur-sm rounded-lg p-6 border border-gray-700 text-center">
                  <div className="mx-auto w-12 h-12 rounded-full bg-indigo-900/50 flex items-center justify-center mb-4">
                    <Sparkles className="h-6 w-6 text-indigo-400" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2 text-white">Smart Formatting</h3>
                  <p className="text-gray-300 text-sm">Perfect layouts with automatic formatting</p>
                </div>
                <div className="bg-gray-800/30 backdrop-blur-sm rounded-lg p-6 border border-gray-700 text-center">
                  <div className="mx-auto w-12 h-12 rounded-full bg-brand-900/50 flex items-center justify-center mb-4">
                    <Server className="h-6 w-6 text-brand-400" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2 text-white">Real-time Sync</h3>
                  <p className="text-gray-300 text-sm">Changes sync instantly across all devices</p>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </section>

        {/* Pricing Section */}
        <section className="py-20 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-gray-800 to-gray-900 z-0"></div>
          <div className="absolute w-72 h-72 bg-purple-900/20 rounded-full blur-3xl top-20 -left-20"></div>
          <div className="absolute w-80 h-80 bg-brand-900/20 rounded-full blur-3xl bottom-20 -right-20"></div>
          
          <div className="container mx-auto px-4 relative z-10">
            <ScrollReveal>
              <div className="flex items-center justify-center mb-3">
                <div className="h-px w-12 bg-brand-500"></div>
                <span className="mx-4 text-brand-400">PRICING</span>
                <div className="h-px w-12 bg-brand-500"></div>
              </div>
              <h2 className="text-3xl font-bold text-center mb-3 bg-gradient-to-r from-brand-400 to-purple-400 bg-clip-text text-transparent">
                Simple Pricing
              </h2>
              <p className="text-xl text-gray-300 text-center mb-12 max-w-2xl mx-auto">
                Transparent pricing that scales with your freelance business
              </p>
            </ScrollReveal>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              <ScrollReveal delay={100} direction="left">
                <ParallaxCard>
                  <div className="border border-gray-700 bg-gray-800/50 backdrop-blur-sm rounded-lg p-6 h-full">
                    <div className="absolute top-0 right-0 w-20 h-20 bg-brand-500/10 blur-xl rounded-full -mr-10 -mt-10"></div>
                    <h3 className="text-xl font-bold mb-2 text-white">Monthly</h3>
                    <div className="text-3xl font-bold mb-4 text-white">
                      $29<span className="text-lg font-normal text-gray-400">/month</span>
                    </div>

                    <ul className="space-y-3 mb-6">
                      <li className="flex items-start">
                        <Check className="h-5 w-5 text-brand-500 mr-2 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-300">Unlimited proposals</span>
                      </li>
                      <li className="flex items-start">
                        <Check className="h-5 w-5 text-brand-500 mr-2 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-300">Unlimited onboarding emails</span>
                      </li>
                      <li className="flex items-start">
                        <Check className="h-5 w-5 text-brand-500 mr-2 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-300">Unlimited invoices</span>
                      </li>
                      <li className="flex items-start">
                        <Check className="h-5 w-5 text-brand-500 mr-2 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-300">PDF exports</span>
                      </li>
                    </ul>

                    <Button
                      className="w-full bg-brand-600 hover:bg-brand-700 text-white"
                      onClick={() => navigate("/register")}
                    >
                      Start Free Trial
                    </Button>
                    <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-brand-500/5 blur-xl rounded-full"></div>
                  </div>
                </ParallaxCard>
              </ScrollReveal>

              <ScrollReveal delay={200} direction="right">
                <ParallaxCard>
                  <div className="border-2 border-brand-500 bg-gray-800/50 backdrop-blur-sm rounded-lg p-6 relative h-full">
                    <div className="absolute top-0 right-0 bg-gradient-to-r from-brand-500 to-purple-600 text-white px-3 py-1 rounded-bl-lg rounded-tr-lg text-sm font-medium">
                      Best Value
                    </div>
                    <div className="absolute top-0 right-0 w-20 h-20 bg-purple-500/10 blur-xl rounded-full -mr-10 -mt-10"></div>
                    <h3 className="text-xl font-bold mb-2 text-white">Annual</h3>
                    <div className="text-3xl font-bold mb-4 text-white">
                      $290
                      <span className="text-lg font-normal text-gray-400">/year</span>
                    </div>
                    <p className="text-sm text-green-400 mb-4">Save $58 annually</p>

                    <ul className="space-y-3 mb-6">
                      <li className="flex items-start">
                        <Check className="h-5 w-5 text-purple-500 mr-2 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-300">Everything in monthly</span>
                      </li>
                      <li className="flex items-start">
                        <Check className="h-5 w-5 text-purple-500 mr-2 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-300">Custom branding</span>
                      </li>
                      <li className="flex items-start">
                        <Check className="h-5 w-5 text-purple-500 mr-2 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-300">Priority support</span>
                      </li>
                      <li className="flex items-start">
                        <Check className="h-5 w-5 text-purple-500 mr-2 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-300">Bulk document generation</span>
                      </li>
                    </ul>

                    <Button
                      className="w-full bg-gradient-to-r from-brand-600 to-purple-600 hover:from-brand-700 hover:to-purple-700 transition-all duration-500 text-white"
                      onClick={() => navigate("/register")}
                    >
                      Start Free Trial
                    </Button>
                    <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-purple-500/5 blur-xl rounded-full"></div>
                  </div>
                </ParallaxCard>
              </ScrollReveal>
            </div>

            <ScrollReveal delay={300}>
              <p className="text-center mt-8 text-gray-400">
                All plans include a 14-day free trial. No credit card required.
              </p>
            </ScrollReveal>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-brand-900 to-purple-900"></div>
          <FloatingElements count={8} tech={true}>
            <div className="container mx-auto px-4 text-center relative z-10">
              <ScrollReveal>
                <h2 className="text-3xl font-bold mb-4 text-white">
                  Ready to Streamline Your Freelance Business?
                </h2>
                <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
                  Join thousands of freelancers and small agencies who are saving
                  time and winning more clients.
                </p>
                <Button
                  size="lg"
                  className="bg-white text-brand-600 hover:bg-gray-100 hover:scale-105 transition-all duration-300"
                  onClick={() => navigate("/register")}
                >
                  Get Started Today
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </ScrollReveal>
            </div>
          </FloatingElements>
          
          {/* Tech background elements */}
          <div className="absolute inset-0 overflow-hidden z-0 opacity-5">
            <div className="absolute top-1/4 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white to-transparent"></div>
            <div className="absolute top-2/4 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white to-transparent"></div>
            <div className="absolute top-3/4 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white to-transparent"></div>
            <div className="absolute top-0 bottom-0 left-1/4 w-px bg-gradient-to-b from-transparent via-white to-transparent"></div>
            <div className="absolute top-0 bottom-0 left-2/4 w-px bg-gradient-to-b from-transparent via-white to-transparent"></div>
            <div className="absolute top-0 bottom-0 left-3/4 w-px bg-gradient-to-b from-transparent via-white to-transparent"></div>
          </div>
        </section>
      </main>

      <footer className="bg-gray-900 text-white py-12 border-t border-gray-800">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-6 md:mb-0">
              <Logo size="md" withText={true} />
              <p className="text-gray-400 mt-2 max-w-xs">
                Professional document automation and management platform for businesses.
              </p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
              <div>
                <h3 className="text-lg font-bold mb-4">Product</h3>
                <ul className="space-y-2">
                  <li>
                    <button className="text-gray-400 hover:text-white transition-colors">
                      Features
                    </button>
                  </li>
                  <li>
                    <button className="text-gray-400 hover:text-white transition-colors">
                      Pricing
                    </button>
                  </li>
                  <li>
                    <button className="text-gray-400 hover:text-white transition-colors">
                      FAQ
                    </button>
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-bold mb-4">Company</h3>
                <ul className="space-y-2">
                  <li>
                    <button className="text-gray-400 hover:text-white transition-colors">
                      About
                    </button>
                  </li>
                  <li>
                    <button className="text-gray-400 hover:text-white transition-colors">
                      Blog
                    </button>
                  </li>
                  <li>
                    <button className="text-gray-400 hover:text-white transition-colors">
                      Contact
                    </button>
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-bold mb-4">Legal</h3>
                <ul className="space-y-2">
                  <li>
                    <button className="text-gray-400 hover:text-white transition-colors">
                      Privacy
                    </button>
                  </li>
                  <li>
                    <button className="text-gray-400 hover:text-white transition-colors">
                      Terms
                    </button>
                  </li>
                  <li>
                    <button className="text-gray-400 hover:text-white transition-colors">
                      Security
                    </button>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-12 pt-6 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-500">
              © {new Date().getFullYear()} DocuForge. All rights reserved.
            </p>
            <div className="flex space-x-4 mt-4 md:mt-0">
              <button className="text-gray-400 hover:text-white transition-colors">Twitter</button>
              <button className="text-gray-400 hover:text-white transition-colors">LinkedIn</button>
              <button className="text-gray-400 hover:text-white transition-colors">Facebook</button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
