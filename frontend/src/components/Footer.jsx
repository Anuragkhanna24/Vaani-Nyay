

function Footer(){
    return(
        <div>
             
      <footer  className="bg-[#141E28] text-white pt-17 pb-8  ">
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
                <li><button onClick={() => navigate('/login')} className="text-gray-400 hover:text-[#33FEBF] transition">Apply Now</button></li>
                <li><button className="text-gray-400 hover:text-[#33FEBF] transition">Track Case</button></li>
                <li><button className="text-gray-400 hover:text-[#33FEBF] transition">Legal Aid</button></li>
                <li><button className="text-gray-400 hover:text-[#33FEBF] transition">About Us</button></li>
              </ul>
            </div>
            
            <div>
              <h3 id='contact' className="text-lg font-semibold mb-4">Contact</h3>
              <ul className="space-y-2">
                <li className="text-gray-400"><i className="fas fa-phone-alt mr-2"></i> +91 1800 123 4567</li>
                <li className="text-gray-400"><i className="fas fa-envelope mr-2"></i> help@vaani-nyay.in</li>
                <li className="text-gray-400"><i className="fas fa-map-marker-alt mr-2"></i> New Delhi, India</li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Follow Us</h3>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-400 hover:text-[#33FEBF] transition"><i className="fab fa-facebook-f"></i></a>
                <a href="#" className="text-gray-400 hover:text-[#33FEBF] transition"><i className="fab fa-twitter"></i></a>
                <a href="#" className="text-gray-400 hover:text-[#33FEBF] transition"><i className="fab fa-instagram"></i></a>
                <a href="#" className="text-gray-400 hover:text-[#33FEBF] transition"><i className="fab fa-linkedin-in"></i></a>
              </div>
            </div>
          </div>
          
          <div className="border-t border-[#1e2a38] mt-8 pt-6 text-center text-gray-400">
            <p>&copy; 2023 Vaani-Nyay. All rights reserved.</p>
          </div>
        </div>
      </footer>
        </div>
    )
 }
 export default Footer;