import { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useLanguage } from "../contexts/LanguageContext";
import Header from "@/components/Header";

export default function Home() {
  const location = useLocation();
  const navigate = useNavigate();
  const { translate } = useLanguage();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isChatbotOpen, setIsChatbotOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState([]);
  const [chatInput, setChatInput] = useState("");

  const contactRef = useRef(null);

  useEffect(() => {
    if (location.state?.scrollToContact && contactRef.current) {
      setTimeout(() => {
        contactRef.current.scrollIntoView({ behavior: "smooth" });
      }, 100); // delay to ensure the DOM is rendered
    }
  }, [location]);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const toggleChatbot = () => {
    setIsChatbotOpen(!isChatbotOpen);
  };

  const sendMessage = () => {
    if (chatInput.trim() === "") return;

    const newMessage = {
      text: chatInput,
      sender: "user",
    };

    setChatMessages([...chatMessages, newMessage]);
    setChatInput("");

    setTimeout(() => {
      const botResponse = {
        text: "Thank you for your question. Our legal assistant will respond shortly.",
        sender: "bot",
      };
      setChatMessages((prev) => [...prev, botResponse]);
    }, 1000);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      sendMessage();
    }
  };

  return (
    <div className="font-sans bg-white">
      {/* Navigation Bar */}
      <Header />

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-[#141E28] via-[#1a2838] to-[#1e3044] text-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 py-24 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6">
              Making Legal Aid Simple and Accessible
            </h1>
            <p className="max-w-2xl mx-auto text-xl md:text-2xl mb-8">
              Voice-powered legal aid for every Indian citizen. File your legal
              applications in your own language.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <button
                onClick={() => navigate("/login")}
                className="bg-[#33FEBF] text-[#141E28] hover:bg-[#2ae8af] font-bold py-3 px-8 rounded-lg transition duration-300 transform hover:scale-105"
              >
                Start Your Legal Application
              </button>
              <button onClick={() => navigate('/ask-vaani-nyay')} className="bg-transparent hover:bg-white hover:bg-opacity-10 font-bold py-3 px-8 border-2 border-white rounded-lg transition duration-300 transform hover:scale-105">
                Get Legal Assistance
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-extrabold text-center text-[#141E28] mb-12">
            How Vaani-Nyay Works
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Step 1 */}
            <div className="bg-gray-50 p-8 rounded-xl transition duration-300 ease-in-out hover:shadow-lg">
              <div className="flex items-center justify-center h-12 w-12 rounded-md bg-[#33FEBF] text-[#141E28] mb-4">
                <span className="text-xl font-bold">1</span>
              </div>
              <h3 className="text-lg font-medium text-[#141E28] mb-2">
                Speak Your Issue
              </h3>
              <p className="text-gray-600">
                Describe your legal problem in your own words using voice or
                text in Hindi or English.
              </p>
            </div>

            {/* Step 2 */}
            <div className="bg-gray-50 p-8 rounded-xl transition duration-300 ease-in-out hover:shadow-lg">
              <div className="flex items-center justify-center h-12 w-12 rounded-md bg-[#33FEBF] text-[#141E28] mb-4">
                <span className="text-xl font-bold">2</span>
              </div>
              <h3 className="text-lg font-medium text-[#141E28] mb-2">
                Auto-Generate Form
              </h3>
              <p className="text-gray-600">
                Our AI converts your description into a proper legal application
                form automatically.
              </p>
            </div>

            {/* Step 3 */}
            <div className="bg-gray-50 p-8 rounded-xl transition duration-300 ease-in-out hover:shadow-lg">
              <div className="flex items-center justify-center h-12 w-12 rounded-md bg-[#33FEBF] text-[#141E28] mb-4">
                <span className="text-xl font-bold">3</span>
              </div>
              <h3 className="text-lg font-medium text-[#141E28] mb-2">
                Submit & Track
              </h3>
              <p className="text-gray-600">
                Verify with Aadhaar OTP and submit. Track your case status
                anytime.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:text-center">
            <h2 className="text-3xl font-extrabold text-[#141E28] mb-2">
              Why Choose Vaani-Nyay?
            </h2>
            <p className="max-w-2xl mx-auto text-xl text-gray-600 mb-12">
              Designed specifically for rural and underserved communities
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Feature 1 */}
            <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition duration-300 transform hover:-translate-y-1">
              <div className="flex items-center justify-center h-12 w-12 rounded-md bg-[#33FEBF] bg-opacity-20 text-[#33FEBF] mb-4">
                <i className="fas fa-microphone text-xl"></i>
              </div>
              <h3 className="text-lg font-medium text-[#141E28] mb-2">
                Voice Interface
              </h3>
              <p className="text-gray-600">
                No need to type. Speak naturally in Hindi or English.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition duration-300 transform hover:-translate-y-1">
              <div className="flex items-center justify-center h-12 w-12 rounded-md bg-[#33FEBF] bg-opacity-20 text-[#33FEBF] mb-4">
                <i className="fas fa-language text-xl"></i>
              </div>
              <h3 className="text-lg font-medium text-[#141E28] mb-2">
                Multilingual
              </h3>
              <p className="text-gray-600">
                Supports Hindi, English and regional languages.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition duration-300 transform hover:-translate-y-1">
              <div className="flex items-center justify-center h-12 w-12 rounded-md bg-[#33FEBF] bg-opacity-20 text-[#33FEBF] mb-4">
                <i className="fas fa-shield-alt text-xl"></i>
              </div>
              <h3 className="text-lg font-medium text-[#141E28] mb-2">
                Secure
              </h3>
              <p className="text-gray-600">
                Aadhaar-based verification ensures security.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition duration-300 transform hover:-translate-y-1">
              <div className="flex items-center justify-center h-12 w-12 rounded-md bg-[#33FEBF] bg-opacity-20 text-[#33FEBF] mb-4">
                <i className="fas fa-robot text-xl"></i>
              </div>
              <h3 className="text-lg font-medium text-[#141E28] mb-2">
                AI Assistance
              </h3>
              <p className="text-gray-600">
                Smart chatbot helps with legal questions 24/7.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-[#141E28] text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-extrabold mb-6">
            Ready to File Your Legal Application?
          </h2>
          <p className="text-xl mb-8 max-w-3xl mx-auto">
            Get started in less than 5 minutes. No legal knowledge required.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <button
              onClick={() => navigate("/login")}
              className="bg-[#33FEBF] text-[#141E28] hover:bg-[#2ae8af] font-bold py-3 px-8 rounded-lg transition duration-300 transform hover:scale-105"
            >
              Start with Voice
            </button>
            <button
              onClick={() => navigate("/login")}
              className="bg-transparent hover:bg-white hover:bg-opacity-10 font-bold py-3 px-8 border-2 border-white rounded-lg transition duration-300 transform hover:scale-105"
            >
              Start with Text
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
     {/* Footer with Contact Section */}
      <footer ref={contactRef} className="bg-[#141E28] text-white pt-11 pb-7">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">Vaani-Nyay</h3>
              <p className="text-gray-400">
                Voice-powered legal aid platform for Indian citizens.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li>
                  <button
                    onClick={() => navigate("/login")}
                    className="text-gray-400 hover:text-[#33FEBF] transition"
                  >
                    Apply Now
                  </button>
                </li>
                <li>
                  <button className="text-gray-400 hover:text-[#33FEBF] transition">
                    Track Case
                  </button>
                </li>
                <li>
                  <button className="text-gray-400 hover:text-[#33FEBF] transition">
                    Legal Aid
                  </button>
                </li>
                <li>
                  <button className="text-gray-400 hover:text-[#33FEBF] transition">
                    About Us
                  </button>
                </li>
              </ul>
            </div>

            <div>
              <h3 id="contact" className="text-lg font-semibold mb-4">
                Contact
              </h3>
              <ul className="space-y-2">
                <li className="text-gray-400">
                  <i className="fas fa-phone-alt mr-2"></i> +91 1800 123 4567
                </li>
                <li className="text-gray-400">
                  <i className="fas fa-envelope mr-2"></i> help@vaani-nyay.in
                </li>
                <li className="text-gray-400">
                  <i className="fas fa-map-marker-alt mr-2"></i> New Delhi,
                  India
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Follow Us</h3>
              <div className="flex space-x-4">
                <a
                  href="#"
                  className="text-gray-400 hover:text-[#33FEBF] transition"
                >
                  <i className="fab fa-facebook-f"></i>
                </a>
                <a
                  href="#"
                  className="text-gray-400 hover:text-[#33FEBF] transition"
                >
                  <i className="fab fa-twitter"></i>
                </a>
                <a
                  href="#"
                  className="text-gray-400 hover:text-[#33FEBF] transition"
                >
                  <i className="fab fa-instagram"></i>
                </a>
                <a
                  href="#"
                  className="text-gray-400 hover:text-[#33FEBF] transition"
                >
                  <i className="fab fa-linkedin-in"></i>
                </a>
              </div>
            </div>
          </div>

          <div className="border-t border-[#1e2a38] mt-8 pt-6 text-center text-gray-400">
            <p>&copy; 2025 Vaani-Nyay. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}


