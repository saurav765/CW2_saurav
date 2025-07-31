import { Link } from 'react-router-dom';
import React, { useState } from 'react';
import {
  Dumbbell,
  Users,
  Calendar,
  MapPin,
  Phone,
  Mail,
  Menu,
  X,
  Trophy,
  Activity
} from 'lucide-react';

const LandingPage = () => {
  const [mobileMenu, setMobileMenu] = useState(false);

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
    }
    setMobileMenu(false); // Close mobile menu after clicking
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900">
      {/* Navigation */}
      <nav className="bg-black/20 backdrop-blur-md border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Dumbbell className="h-8 w-8 text-blue-400" />
              <span className="ml-2 text-xl font-bold text-white">AthletiQ</span>
            </div>
            
            {/* Desktop Menu */}
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-4">
                <button onClick={() => scrollToSection('home')} className="text-white hover:text-blue-400 px-3 py-2 rounded-md text-sm font-medium transition-colors">Home</button>
                <button onClick={() => scrollToSection('about')} className="text-gray-300 hover:text-blue-400 px-3 py-2 rounded-md text-sm font-medium transition-colors">About</button>
                <button onClick={() => scrollToSection('services')} className="text-gray-300 hover:text-blue-400 px-3 py-2 rounded-md text-sm font-medium transition-colors">Services</button>
                <button onClick={() => scrollToSection('contact')} className="text-gray-300 hover:text-blue-400 px-3 py-2 rounded-md text-sm font-medium transition-colors">Contact</button>
              </div>
            </div>

            <div className="hidden md:block">
              <div className="ml-4 flex items-center md:ml-6 space-x-3">
                <Link to="/login">
                  <button className="text-white hover:text-blue-400 px-3 py-2 rounded-md text-sm font-medium transition-colors">
                    Login
                  </button>
                </Link>
                <Link to="/register">
                  <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors">
                    Join Now
                  </button>
                </Link>
              </div>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                onClick={() => setMobileMenu(!mobileMenu)}
                className="text-gray-400 hover:text-white focus:outline-none focus:text-white"
              >
                {mobileMenu ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenu && (
          <div className="md:hidden bg-black/40 backdrop-blur-md">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              <button onClick={() => scrollToSection('home')} className="text-white block px-3 py-2 rounded-md text-base font-medium w-full text-left">Home</button>
              <button onClick={() => scrollToSection('about')} className="text-gray-300 hover:text-white block px-3 py-2 rounded-md text-base font-medium w-full text-left">About</button>
              <button onClick={() => scrollToSection('services')} className="text-gray-300 hover:text-white block px-3 py-2 rounded-md text-base font-medium w-full text-left">Services</button>
              <button onClick={() => scrollToSection('contact')} className="text-gray-300 hover:text-white block px-3 py-2 rounded-md text-base font-medium w-full text-left">Contact</button>
              <Link to="/login">
                <button className="text-white block px-3 py-2 rounded-md text-base font-medium w-full text-left">Login</button>
              </Link>
              <Link to="/register">
                <button className="bg-blue-600 text-white block px-3 py-2 rounded-md text-base font-medium w-full text-left">Join Now</button>
              </Link>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section id="home" className="relative py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
            Transform Your Body,
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
              Transform Your Life
            </span>
          </h1>
          <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
            Welcome to AthletiQ, Nepal's premier fitness destination. Join our community of fitness enthusiasts and achieve your health goals with expert guidance.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link to="/register">
              <button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold py-3 px-8 rounded-lg text-lg transition-all transform hover:scale-105">
                Start Your Journey
              </button>
            </Link>
            <button
              onClick={() => scrollToSection('about')}
              className="border-2 border-white text-white hover:bg-white hover:text-gray-900 font-bold py-3 px-8 rounded-lg text-lg transition-all"
            >
              Learn More
            </button>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-16 px-4 sm:px-6 lg:px-8 bg-black/20">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">About AthletiQ</h2>
            <p className="text-gray-300 text-lg max-w-3xl mx-auto">
              Located in the heart of Nepal, AthletiQ has been empowering fitness journeys since 2020. 
              We combine state-of-the-art equipment with expert trainers to deliver exceptional results.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6 rounded-lg bg-white/5 backdrop-blur-sm border border-white/10">
              <Trophy className="h-12 w-12 text-yellow-400 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-white mb-2">Award Winning</h3>
              <p className="text-gray-300">Recognized as Nepal's best gym for 3 consecutive years</p>
            </div>
            
            <div className="text-center p-6 rounded-lg bg-white/5 backdrop-blur-sm border border-white/10">
              <Users className="h-12 w-12 text-green-400 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-white mb-2">Expert Trainers</h3>
              <p className="text-gray-300">Certified professionals dedicated to your success</p>
            </div>
            
            <div className="text-center p-6 rounded-lg bg-white/5 backdrop-blur-sm border border-white/10">
              <Activity className="h-12 w-12 text-blue-400 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-white mb-2">Modern Equipment</h3>
              <p className="text-gray-300">Latest fitness technology for optimal results</p>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Our Services</h2>
            <p className="text-gray-300 text-lg">Comprehensive fitness solutions tailored to your needs</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: Dumbbell, title: 'Weight Training', desc: 'Build strength with guided weight training' },
              { icon: Activity, title: 'Cardio Classes', desc: 'High-energy cardio sessions' },
              { icon: Users, title: 'Personal Training', desc: 'One-on-one fitness coaching' },
              { icon: Calendar, title: 'Group Classes', desc: 'Fun group workout sessions' }
            ].map((service, index) => (
              <div key={index} className="p-6 rounded-lg bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10 transition-all">
                <service.icon className="h-10 w-10 text-blue-400 mb-4" />
                <h3 className="text-lg font-bold text-white mb-2">{service.title}</h3>
                <p className="text-gray-300 text-sm">{service.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-16 px-4 sm:px-6 lg:px-8 bg-black/20">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Contact Us</h2>
            <p className="text-gray-300 text-lg">Get in touch to start your fitness journey</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <MapPin className="h-8 w-8 text-blue-400 mx-auto mb-4" />
              <h3 className="text-lg font-bold text-white mb-2">Location</h3>
              <p className="text-gray-300">Kathmandu, Bagmati Province<br />Nepal</p>
            </div>
            
            <div className="text-center p-6">
              <Phone className="h-8 w-8 text-green-400 mx-auto mb-4" />
              <h3 className="text-lg font-bold text-white mb-2">Phone</h3>
              <p className="text-gray-300">+977-1-4444444<br />+977-9841234567</p>
            </div>
            
            <div className="text-center p-6">
              <Mail className="h-8 w-8 text-purple-400 mx-auto mb-4" />
              <h3 className="text-lg font-bold text-white mb-2">Email</h3>
              <p className="text-gray-300">info@athletiq.com.np<br />support@athletiq.com.np</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black/40 border-t border-white/10 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <div className="flex items-center justify-center mb-4">
            <Dumbbell className="h-6 w-6 text-blue-400" />
            <span className="ml-2 text-lg font-bold text-white">AthletiQ</span>
          </div>
          <p className="text-gray-400 text-sm">© 2025 AthletiQ. All rights reserved. Empowering fitness in Nepal.</p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;