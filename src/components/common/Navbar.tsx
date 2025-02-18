import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="bg-white shadow-lg border ">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          <div className="text-2xl font-bold text-blue-600">
            <Link href="/">RecipeFinder</Link>
          </div>
          <div className="flex space-x-8 ">
            <Link
              href="/"
              className="text-gray-700 hover:text-blue-600 transition-colors relative group"
            >
              Home
              <span className="absolute left-0 bottom-0 h-0.5 w-0 bg-blue-600 transition-all group-hover:w-full"></span>
            </Link>
            <Link
              href="/recipe"
              className="text-gray-700 hover:text-blue-600 transition-colors relative group"
            >
              Recipe
              <span className="absolute left-0 bottom-0 h-0.5 w-0 bg-blue-600 transition-all group-hover:w-full"></span>
            </Link>
            <Link
              href="/about"
              className="text-gray-700 hover:text-blue-600 transition-colors relative group"
            >
              About Us
              <span className="absolute left-0 bottom-0 h-0.5 w-0 bg-blue-600 transition-all group-hover:w-full"></span>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
