
export default function Navbar({ onLogout }) {
  return (
    <nav className="bg-green-600 p-3 flex justify-between items-center shadow-md">
      <h1 className="text-white text-xl font-bold">💬 ChatApp</h1>
      {onLogout && (
        <button
          onClick={onLogout}
          className="bg-white text-green-600 px-4 py-1 rounded-lg hover:bg-gray-200"
        >
          Logout
        </button>
      )}
    </nav>
  );
}
