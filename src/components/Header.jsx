
import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"

export default function Header({ isAdmin = false }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { currentUser, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate("/login")
  }

  return (
    <header className="bg-white shadow">
      <div className="container px-4 mx-auto">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="text-xl font-bold text-indigo-600">
              Inquiry System
            </Link>
          </div>

          <div className="hidden md:block">
            <div className="flex items-center space-x-4">
              {isAdmin ? (
                <Link to="/admin" className="px-3 py-2 text-sm font-medium text-gray-900 rounded-md hover:bg-gray-100">
                  Admin Dashboard
                </Link>
              ) : (
                <Link
                  to="/dashboard"
                  className="px-3 py-2 text-sm font-medium text-gray-900 rounded-md hover:bg-gray-100"
                >
                  My Inquiries
                </Link>
              )}

              {currentUser?.role === "admin" && !isAdmin && (
                <Link to="/admin" className="px-3 py-2 text-sm font-medium text-gray-900 rounded-md hover:bg-gray-100">
                  Admin Dashboard
                </Link>
              )}

              <div className="relative ml-3">
                <button
                  type="button"
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  className="flex items-center max-w-xs text-sm bg-gray-100 rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  <span className="sr-only">Open user menu</span>
                  <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-white">
                    {currentUser?.name?.charAt(0) || "U"}
                  </div>
                </button>

                {isMenuOpen && (
                  <div
                    className="absolute right-0 z-10 w-48 py-1 mt-2 origin-top-right bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <div className="px-4 py-2 text-sm text-gray-900 border-b">{currentUser?.name}</div>
                    <button
                      onClick={handleLogout}
                      className="block w-full px-4 py-2 text-sm text-left text-gray-700 hover:bg-gray-100"
                    >
                      Sign out
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="flex -mr-2 md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="inline-flex items-center justify-center p-2 text-gray-400 rounded-md hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
            >
              <span className="sr-only">Open main menu</span>
              <svg
                className={`${isMenuOpen ? "hidden" : "block"} h-6 w-6`}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
              <svg
                className={`${isMenuOpen ? "block" : "hidden"} h-6 w-6`}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {isMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {isAdmin ? (
              <Link
                to="/admin"
                className="block px-3 py-2 text-base font-medium text-gray-900 rounded-md hover:bg-gray-100"
              >
                Admin Dashboard
              </Link>
            ) : (
              <Link
                to="/dashboard"
                className="block px-3 py-2 text-base font-medium text-gray-900 rounded-md hover:bg-gray-100"
              >
                My Inquiries
              </Link>
            )}

            {currentUser?.role === "admin" && !isAdmin && (
              <Link
                to="/admin"
                className="block px-3 py-2 text-base font-medium text-gray-900 rounded-md hover:bg-gray-100"
              >
                Admin Dashboard
              </Link>
            )}
          </div>
          <div className="pt-4 pb-3 border-t border-gray-200">
            <div className="px-5 py-2">
              <div className="text-base font-medium text-gray-800">{currentUser?.name}</div>
            </div>
            <div className="mt-3 px-2 space-y-1">
              <button
                onClick={handleLogout}
                className="block w-full px-3 py-2 text-base font-medium text-left text-gray-900 rounded-md hover:bg-gray-100"
              >
                Sign out
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}

