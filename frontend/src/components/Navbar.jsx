import { Link, useNavigate, useLocation } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const username = localStorage.getItem("username");

  // ✅ Do not render Navbar on Verify OTP page
  if (location.pathname === "/verify-otp") {
    return null;
  }

  const handleLogout = () => {
    localStorage.removeItem("isVerified");
    localStorage.removeItem("username");
    localStorage.removeItem("email");
    navigate("/login");
    window.location.reload();
  };

  return (
    <nav className="bg-white shadow-lg border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/predict" className="flex-shrink-0 flex items-center">
              <svg className="h-8 w-8 text-indigo-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
              </svg>
              <span className="ml-2 text-xl font-bold text-gray-800">CancerDetect</span>
            </Link>
          </div>
          
          <div className="hidden md:flex items-center space-x-4">
            {/* Username display with icon */}
            {username && (
              <div className="flex items-center px-3 py-2 text-sm font-medium text-gray-600">
                <svg className="h-4 w-4 mr-1 text-indigo-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                Welcome, <span className="font-semibold ml-1">{username}</span>
              </div>
            )}
            
            <Link 
              to="/upload" 
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-300 ${location.pathname === '/upload' ? 'bg-indigo-100 text-indigo-700' : 'text-gray-600 hover:text-indigo-600 hover:bg-gray-100'}`}
            >
              Upload
            </Link>
            <Link 
              to="/result" 
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-300 ${location.pathname === '/result' ? 'bg-indigo-100 text-indigo-700' : 'text-gray-600 hover:text-indigo-600 hover:bg-gray-100'}`}
            >
              Results
            </Link>
            <button 
              onClick={handleLogout}
              className="px-3 py-2 rounded-md text-sm font-medium text-gray-600 hover:text-indigo-600 hover:bg-gray-100 transition-colors duration-300 flex items-center"
            >
              <svg className="h-4 w-4 mr-1" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              Logout
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button className="inline-flex items-center justify-center p-2 rounded-md text-gray-600 hover:text-indigo-600 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500">
              <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu, show/hide based on menu state */}
      <div className="md:hidden hidden">
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white border-t border-gray-200">
          {/* Username display for mobile with icon */}
          {username && (
            <div className="flex items-center px-3 py-2 text-base font-medium text-gray-600 border-b border-gray-200">
              <svg className="h-5 w-5 mr-2 text-indigo-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              Welcome, <span className="font-semibold ml-1">{username}</span>
            </div>
          )}
          
          <Link 
            to="/upload" 
            className={`block px-3 py-2 rounded-md text-base font-medium transition-colors duration-300 ${location.pathname === '/upload' ? 'bg-indigo-100 text-indigo-700' : 'text-gray-600 hover:text-indigo-600 hover:bg-gray-100'}`}
          >
            Upload
          </Link>
          <Link 
            to="/result" 
            className={`block px-3 py-2 rounded-md text-base font-medium transition-colors duration-300 ${location.pathname === '/result' ? 'bg-indigo-100 text-indigo-700' : 'text-gray-600 hover:text-indigo-600 hover:bg-gray-100'}`}
          >
            Results
          </Link>
          <button 
            onClick={handleLogout}
            className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-600 hover:text-indigo-600 hover:bg-gray-100 transition-colors duration-300"
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;