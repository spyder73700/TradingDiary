import React from 'react'
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";



function Navbar1() {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Optional: clear user session / Firebase signOut
    // await signOut(auth);

    navigate("/"); // 👈 go back to Home page
  };
  return (
    <div>
      <div className="navbar px-[100px] bg-base-100 shadow-sm">
        <div className="navbar-start">
          <div className="dropdown">
            <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h8m-8 6h16" />
              </svg>
            </div>
            <ul
              tabIndex={0}
              className="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow">
              {/* Add dropdown links if needed */}
            </ul>
          </div>
          <a className="btn btn-ghost text-xl">Trading Diary</a>
        </div>

        <div className="navbar-end">
          <ul className="menu menu-horizontal px-1">
            <li>
              <Link
                to="/add"
                className="hover:text-yellow-400 hover:underline hover:underline-offset-4 hover:scale-110 transition-all duration-200"
              >
                News
              </Link>
            </li>
            <li>
              <Link
                to="/ai-chatbox"
                className="hover:text-yellow-400 hover:underline hover:underline-offset-4 hover:scale-110 transition-all duration-200"
              >
                AI Trainer
              </Link>
            </li>
            <li>
              <Link
                to="/trade"
                className="hover:text-yellow-400 hover:underline hover:underline-offset-4 hover:scale-110 transition-all duration-200"
              >
                Trades
              </Link>
            </li>
            
          </ul>

          <button
  onClick={handleLogout}
  className="px-3 py-1 rounded-md bg-red-500 text-white-bold hover:bg-white hover:text-black  transition-all duration-200"
>
  LogOut
</button>
        </div>
      </div>
    </div>
  )
}

export default Navbar1;
