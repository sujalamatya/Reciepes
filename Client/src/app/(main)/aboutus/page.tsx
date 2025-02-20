import Navbar from "@/components/common/Navbar";
import Head from "next/head";

export default function AboutUs() {
  return (
    <>
      <Navbar />
      <Head>
        <title>About Us - Recipe Website</title>
        <meta
          name="description"
          content="Learn more about our recipe website and the team behind it."
        />
      </Head>

      {/* Hero Section */}
      <div className="bg-gradient-to-r from-orange-400 to-red-500 py-20">
        <div className="container mx-auto text-center">
          <h1 className="text-5xl font-bold text-white mb-4">About Us</h1>
          <p className="text-xl text-white">
            Discover the story behind our passion for food and recipes.
          </p>
        </div>
      </div>

      {/* About Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6">Our Mission</h2>
          <p className="text-gray-700 text-lg leading-relaxed">
            At Tasty Bites, we believe that cooking should be fun, accessible,
            and rewarding for everyone. Our mission is to provide you with
            delicious, easy-to-follow recipes that inspire you to get creative
            in the kitchen. Whether you're a seasoned chef or a beginner, we're
            here to help you make every meal a masterpiece.
          </p>
        </div>
      </div>

      {/* Team Section */}
      <div className="bg-gray-100 py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">
            Meet Our Team
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Team Member 1 */}
            <div className="bg-white p-6 rounded-lg shadow-lg text-center">
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/8/89/Portrait_Placeholder.png"
                alt="Team Member 1"
                className="w-32 h-32 rounded-full mx-auto mb-4"
              />
              <h3 className="text-xl font-bold mb-2">Luzza Dangol</h3>
              <p className="text-gray-600">Frontend</p>
            </div>

            {/* Team Member 2 */}
            <div className="bg-white p-6 rounded-lg shadow-lg text-center">
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/8/89/Portrait_Placeholder.png"
                alt="Team Member 2"
                className="w-32 h-32 rounded-full mx-auto mb-4"
              />
              <h3 className="text-xl font-bold mb-2">Gaurav Neupane</h3>
              <p className="text-gray-600">Backend</p>
            </div>

            {/* Team Member 3 */}
            <div className="bg-white p-6 rounded-lg shadow-lg text-center">
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/8/89/Portrait_Placeholder.png"
                alt="Team Member 3"
                className="w-32 h-32 rounded-full mx-auto mb-4"
              />
              <h3 className="text-xl font-bold mb-2">Sujal Amatya</h3>
              <p className="text-gray-600">Frontend</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
