export default function Navbar({ setPage, token, setToken }) {
    return (
      <nav className="bg-gray-800 p-4 flex justify-between text-white">
        <div className="space-x-4">
          <button onClick={() => setPage('register')} className="hover:underline">Register</button>
          <button onClick={() => setPage('login')} className="hover:underline">Login</button>
          {token && (
            <>
              <button onClick={() => setPage('profile')} className="hover:underline">Profile</button>
              <button onClick={() => setPage('recommendation')} className="hover:underline">Recommendation</button>
            </>
          )}
        </div>
        {token && (
          <button onClick={() => { setToken(''); localStorage.removeItem('token'); setPage('login'); }} className="text-red-400 hover:underline">
            Logout
          </button>
        )}
      </nav>
    );
  }
  