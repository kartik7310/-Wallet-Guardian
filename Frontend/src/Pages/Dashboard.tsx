import AppNavbar from "../Components/AppNavbar";

AppNavbar

const Dashboard = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <AppNavbar />
      <main className="p-6">Welcome to your Dashboard!</main>
    </div>
  );
};

export default Dashboard;
