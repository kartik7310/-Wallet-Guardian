import AppNavbar from "../Components/AppNavbar";

const About = () => {
  return (
    <div className="min-h-screen flex flex-col bg-white text-gray-800">
      <AppNavbar />
      <main className="flex-grow max-w-5xl mx-auto px-4 py-12">
        <h1 className="text-3xl md:text-4xl font-bold text-indigo-600 mb-6">
          About WalletGuardian
        </h1>
        <p className="text-lg mb-6 leading-relaxed">
          WalletGuardian is a powerful SaaS platform that helps individuals and small businesses
          track their expenses, manage budgets, and visualize their financial health.
          With real-time transaction tracking, secure authentication, and insightful dashboards,
          our mission is to make money management simple and effective for everyone.
        </p>

        <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-10">
          <div className="border border-gray-200 p-6 rounded-lg shadow-sm hover:shadow-md transition">
            <h2 className="text-xl font-semibold mb-2 text-indigo-500">Secure & Private</h2>
            <p className="text-gray-600">
              We use industry-standard encryption and privacy-first practices to ensure your data stays safe.
            </p>
          </div>
          <div className="border border-gray-200 p-6 rounded-lg shadow-sm hover:shadow-md transition">
            <h2 className="text-xl font-semibold mb-2 text-indigo-500">Real-Time Tracking</h2>
            <p className="text-gray-600">
              Keep track of your income, expenses, and budgets in real time with our intuitive dashboard.
            </p>
          </div>
          <div className="border border-gray-200 p-6 rounded-lg shadow-sm hover:shadow-md transition">
            <h2 className="text-xl font-semibold mb-2 text-indigo-500">Smart Budgeting</h2>
            <p className="text-gray-600">
              Set monthly budgets and get personalized insights to help you save better and spend smarter.
            </p>
          </div>
        </section>

        <div className="mt-12 text-center">
          <p className="text-gray-700 text-base">
            Have questions or feedback?{" "}
            <a href="/contact" className="text-indigo-600 underline hover:text-indigo-800">
              Contact us
            </a>{" "}
            — we’d love to hear from you!
          </p>
        </div>
      </main>
    </div>
  );
};

export default About;
