import React from 'react';
import { Link } from 'react-router-dom';
import { LogIn } from 'lucide-react';
import Header from "../components/Header";
import Footer from '@/components/Footer';

const About = () => {
  const features = [
    "Multilingual voice and text input",
    "AI-powered form filling and auto-correction",
    "Secure digital signing with Aadhaar",
    "Real-time case tracking",
    "24/7 legal assistance chatbot"
  ];

  const team = [
    {
      name: "Legal Experts",
      description: "Experienced lawyers and paralegals ensuring accurate legal guidance"
    },
    {
      name: "Technology Team",
      description: "Skilled developers creating accessible solutions"
    },
    {
      name: "Community Partners",
      description: "NGOs and grassroots organizations helping reach underserved communities"
    }
  ];

  return (
    <div className="min-h-screen bg-[#141E28] text-white">
      <Header />

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Header Text */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4 text-[#33FEBF]">About Vaani-Nyay</h1>
            <p className="text-xl text-gray-200">Voice for Justice - Accessible Legal Aid Platform</p>
          </div>

          <div className="space-y-12">
            {/* Mission */}
            <div className="bg-white text-[#141E28] rounded-xl p-8 shadow-lg border border-[#33FEBF]/50">
              <h2 className="text-2xl font-bold text-[#33FEBF] mb-4">Our Mission</h2>
              <p className="leading-relaxed text-gray-800">
                Vaani-Nyay aims to democratize access to legal aid by providing an accessible platform that bridges the gap between citizens and the justice system through technology. We believe that every Indian citizen deserves equal access to justice, regardless of their location, language, or technical expertise.
              </p>
            </div>

            {/* Features */}
            <div className="bg-[#1F2A38] rounded-xl p-8 shadow-lg border border-white/10">
              <h2 className="text-2xl font-bold text-[#33FEBF] mb-6">Key Features</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {features.map((feature, index) => (
                  <div key={index} className="flex items-start">
                    <span className="text-[#33FEBF] mr-3 text-xl">✓</span>
                    <span className="text-white">{feature}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Team */}
            <div className="bg-white text-[#141E28] rounded-xl p-8 shadow-lg">
              <h2 className="text-2xl font-bold text-[#33FEBF] mb-6">Our Team</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {team.map((member, index) => (
                  <div key={index} className="bg-[#F9FAFB] p-6 rounded-lg border border-gray-200">
                    <h3 className="font-bold text-gray-900 mb-3">{member.name}</h3>
                    <p className="text-sm text-gray-700">{member.description}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Contact */}
            <div className="bg-[#1F2A38] text-white rounded-xl p-8 shadow-lg border border-white/10">
              <h2 className="text-2xl font-bold text-[#33FEBF] mb-6">Contact Us</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-medium text-white mb-2">Email</h3>
                  <p className="text-gray-300">contact@vaani-nyay.org</p>
                </div>
                <div>
                  <h3 className="font-medium text-white mb-2">Phone</h3>
                  <p className="text-gray-300">1800-123-4567</p>
                </div>
              </div>
            </div>

            {/* CTA */}
            <div className="bg-white text-[#141E28] rounded-xl p-8 text-center shadow-xl border border-[#33FEBF]/30">
              <h2 className="text-2xl font-bold mb-4">Ready to Get Started?</h2>
              <p className="mb-6">Join thousands of citizens who have already benefited from our platform.</p>
              <Link
                to="/login"
                className="bg-[#33FEBF] text-[#141E28] hover:bg-[#2adfa6] font-bold py-3 px-8 rounded-lg transition duration-300 transform hover:scale-105 inline-flex items-center"
              >
                <LogIn className="mr-2" size={20} />
                Get Started
              </Link>
              
            </div>
            <Footer/>
          </div>
        </div>
      </div>
    </div>
    
  );
};

export default About;
