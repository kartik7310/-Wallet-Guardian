import HomeNavbar from "../Components/HomeNavbar";
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div className="min-h-screen bg-white text-gray-800 flex flex-col">
      <HomeNavbar />

      {/* Hero Section */}
      <section className="flex flex-col items-center justify-center text-center px-4 sm:px-6 py-20 bg-gray-50">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-indigo-600 mb-4 leading-tight">
          Take Control of Your Finances
        </h1>
        <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-2xl mb-6">
          WalletGuardian helps you manage budgets, track expenses, and make smart financial decisions—all in one place.
        </p>
        <Link
          to="/signup"
          className="bg-indigo-600 text-white font-semibold px-5 sm:px-6 py-3 rounded-md text-base sm:text-lg hover:bg-indigo-700 transition"
        >
          Get Started Free
        </Link>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 sm:px-6 max-w-7xl mx-auto">
        <h2 className="text-2xl sm:text-3xl font-bold text-center mb-12 text-gray-800">
          Why Choose WalletGuardian?
        </h2>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[
            {
              title: "Smart Budgeting",
              desc: "Set monthly budgets, track spending, and stay on top of your finances effortlessly.",
            },
            {
              title: "Transaction Tracking",
              desc: "Automatically categorize and monitor all your transactions in one place.",
            },
            {
              title: "Insightful Reports",
              desc: "Get meaningful insights with visual charts to understand your financial habits.",
            },
          ].map((feature, idx) => (
            <div
              key={idx}
              className="bg-white shadow-md hover:shadow-lg transition rounded-lg p-6 text-center"
            >
              <h3 className="text-lg sm:text-xl font-semibold text-indigo-600 mb-2">
                {feature.title}
              </h3>
              <p className="text-gray-600 text-sm sm:text-base">{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Call to Action */}
      <section className="bg-indigo-500 py-12 px-4 sm:px-6 text-white text-center">
        <h2 className="text-2xl sm:text-3xl font-bold mb-4">
          Start Your Financial Journey Today
        </h2>
        <p className="text-base sm:text-lg mb-6">
          Join thousands of users who trust WalletGuardian to manage their money.
        </p>
        <Link
          to="/signup"
          className="bg-white text-indigo-600 font-semibold px-5 sm:px-6 py-3 rounded-md hover:bg-gray-100 transition"
        >
          Create an Account
        </Link>
      </section>

      {/* Footer */}
      <footer className="bg-gray-100 text-center py-6 text-gray-600 text-sm mt-auto">
        © {new Date().getFullYear()} WalletGuardian. All rights reserved.
      </footer>
    </div>
  );
};

export default Home;
