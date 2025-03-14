import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { ArrowRight, Box, GraduationCap, BookOpen, Users, ChevronDown } from 'lucide-react';

const Index = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  const features = [
    {
      icon: GraduationCap,
      title: 'Virtual Classrooms',
      description: 'Create and manage digital learning spaces for your students.'
    },
    {
      icon: Box,
      title: 'AR Experiences',
      description: 'Build interactive augmented reality elements to enhance learning.'
    },
    {
      icon: BookOpen,
      title: 'Educational Content',
      description: 'Organize learning materials and resources in one place.'
    },
    {
      icon: Users,
      title: 'Student Engagement',
      description: 'Boost participation with immersive learning experiences.'
    }
  ];

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <header
        className={`sticky top-0 z-40 w-full transition-all duration-300 ${
          scrolled ? 'bg-background/95 backdrop-blur shadow-sm' : 'bg-transparent'
        }`}
      >
        <div className="container flex h-16 items-center justify-between">
          <Link to="/" className="flex items-center gap-2 font-semibold">
            <Box className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold">AR4Learn</span>
          </Link>
          
          <nav className="hidden md:flex items-center gap-6">
            <Link to="/about" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              About
            </Link>
            <Link to="/features" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              Features
            </Link>
            <Button variant="ghost">
              <Link to="/login">Sign in</Link>
            </Button>
            <Button className="button-effect">
              <Link to="/register">Get Started</Link>
            </Button>
          </nav>

          <div className="flex md:hidden">
            <Button asChild variant="ghost" size="icon">
              <Link to="/login">
                <ArrowRight className="h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="w-full py-14 md:py-24 lg:py-32 xl:py-36 overflow-hidden">
        <div className="container px-4 md:px-6 space-y-10 xl:space-y-16">
          <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_550px]">
            <div className="flex flex-col justify-center space-y-4 animate-fade-in">
              <div className="inline-block rounded-lg bg-primary/10 px-3 py-1 text-sm text-primary">
                Educational Innovation
              </div>
              <h1 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl lg:text-6xl">
                Transform classroom learning with Augmented Reality
              </h1>
              <p className="max-w-[600px] text-muted-foreground md:text-xl">
                AR4Learn helps educators create immersive augmented reality experiences for enhanced student engagement and learning outcomes.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 min-[400px]:flex-row">
                <Button size="lg" className="button-effect">
                  <Link to="/register" className="flex items-center gap-1">
                    Get started for free
                    <ArrowRight className="h-4 w-4 ml-1" />
                  </Link>
                </Button>
                <Button variant="outline" size="lg">
                  <Link to="/login">Sign in</Link>
                </Button>
              </div>
            </div>
            <div className="flex items-center justify-center">
              <div className="w-full h-[350px] lg:h-[400px] rounded-lg overflow-hidden shadow-lg glassmorphism p-4 relative animate-scale-in">
                <div className="absolute inset-0 bg-primary/5 backdrop-blur-sm rounded-lg"></div>
                <div className="absolute inset-0 p-6 flex flex-col justify-between z-10">
                  <div className="space-y-2">
                    <h3 className="text-xl font-semibold">AR Solar System</h3>
                    <p className="text-sm text-muted-foreground">
                      Interactive 3D models of the planets
                    </p>
                  </div>
                  <div className="grid grid-cols-3 gap-3 mt-4">
                    {Array.from({ length: 6 }).map((_, i) => (
                      <div key={i} className="aspect-square rounded-md bg-primary/10 flex items-center justify-center shadow-sm overflow-hidden">
                        <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                          <Box className="h-6 w-6 text-primary/70" />
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="flex justify-end">
                    <Button size="sm" variant="secondary">
                      View Experience
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="w-full py-12 md:py-24 lg:py-32 bg-muted/40">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <div className="inline-block rounded-lg bg-primary/10 px-3 py-1 text-sm text-primary">
                Features
              </div>
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
                Everything you need to enhance learning
              </h2>
              <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                AR4Learn provides powerful tools for creating engaging educational experiences with augmented reality technology.
              </p>
            </div>
          </div>
          <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4 mt-12 animate-slide-in">
            {features.map((feature, i) => (
              <div key={i} className="flex flex-col p-6 space-y-4 bg-card rounded-lg border shadow-sm h-full card-hover">
                <div className="p-2 bg-primary/10 rounded-full w-fit">
                  <feature.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold">{feature.title}</h3>
                <p className="text-muted-foreground flex-1">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="w-full py-16 md:py-24">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
                Ready to transform your classroom?
              </h2>
              <p className="max-w-[600px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Join thousands of educators already using AR4Learn to create immersive learning experiences.
              </p>
            </div>
            <div className="flex flex-col gap-2 min-[400px]:flex-row">
              <Button size="lg" className="button-effect">
                <Link to="/register" className="flex items-center gap-1">
                  Get started for free
                  <ArrowRight className="h-4 w-4 ml-1" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="w-full border-t py-6 md:py-8">
        <div className="container flex flex-col items-center justify-between gap-4 md:flex-row">
          <div className="flex items-center gap-2">
            <Box className="h-5 w-5 text-primary" />
            <p className="text-sm text-muted-foreground">
              &copy; {new Date().getFullYear()} AR4Learn. All rights reserved.
            </p>
          </div>
          <nav className="flex items-center gap-4 text-sm">
            <Link to="/about" className="text-muted-foreground hover:text-foreground transition-colors">
              About
            </Link>
            <Link to="/features" className="text-muted-foreground hover:text-foreground transition-colors">
              Features
            </Link>
            <Link to="/terms" className="text-muted-foreground hover:text-foreground transition-colors">
              Terms
            </Link>
            <Link to="/privacy" className="text-muted-foreground hover:text-foreground transition-colors">
              Privacy
            </Link>
          </nav>
        </div>
      </footer>
    </div>
  );
};

export default Index;
