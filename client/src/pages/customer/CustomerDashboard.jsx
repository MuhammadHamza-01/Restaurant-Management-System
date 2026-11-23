
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import {
  UserRound,
  Mail,
  ShieldCheck,
  Utensils,
  ClipboardList,
  ArrowRight,
  Clock3,
  Info,
} from "lucide-react";

const CustomerDashboard = () => {
  const { user } = useAuth();

  const firstName = user?.name?.trim().split(" ")[0] || "Customer";

  return (
    <div className="space-y-7">
      {/* Welcome section */}
      <section className="relative overflow-hidden rounded-2xl bg-[#18181b] p-6 text-white shadow-sm sm:p-8">
        <div className="relative z-10 max-w-2xl">
          <span className="inline-flex items-center gap-2 rounded-full bg-orange-500/15 px-3 py-1.5 text-xs font-semibold text-orange-300">
            <span className="h-2 w-2 rounded-full bg-orange-400" />
            Customer workspace
          </span>

          <h1 className="mt-5 text-2xl font-bold sm:text-3xl">
            Welcome back, {firstName}!
          </h1>

          <p className="mt-3 text-sm leading-6 text-gray-400 sm:text-base">
            Welcome to Pizza Mahal. Manage your account and explore our
            delicious menu from your personal dashboard.
          </p>

          <Link
            to="/menu"
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-orange-500 px-5 py-3 text-sm font-bold text-white transition hover:bg-orange-600"
          >
            Explore Our Menu
            <ArrowRight size={17} />
          </Link>
        </div>

        <div className="pointer-events-none absolute -right-10 -top-16 h-64 w-64 rounded-full border-[35px] border-white/5" />
        <div className="pointer-events-none absolute -bottom-24 right-24 h-48 w-48 rounded-full bg-orange-500/10 blur-3xl" />
      </section>

      {/* Account information */}
      <section>
        <div className="mb-4">
          <h2 className="text-lg font-bold text-gray-900">
            Account Overview
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            Your registered account information.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="rounded-xl bg-orange-50 p-3 text-orange-600">
                <UserRound size={22} />
              </div>

              <div>
                <p className="text-xs font-medium text-gray-400">
                  Full Name
                </p>
                <p className="mt-1 font-semibold text-gray-900">
                  {user?.name || "Not available"}
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="rounded-xl bg-blue-50 p-3 text-blue-600">
                <Mail size={22} />
              </div>

              <div className="min-w-0">
                <p className="text-xs font-medium text-gray-400">
                  Email Address
                </p>
                <p className="mt-1 truncate font-semibold text-gray-900">
                  {user?.email || "Not available"}
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm sm:col-span-2">
            <div className="flex items-center gap-3">
              <div className="rounded-xl bg-emerald-50 p-3 text-emerald-600">
                <ShieldCheck size={22} />
              </div>

              <div>
                <p className="text-xs font-medium text-gray-400">
                  Account Role
                </p>
                <p className="mt-1 font-semibold capitalize text-gray-900">
                  {user?.role || "Customer"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Order history placeholder */}
      <section className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
        <div className="border-b border-gray-100 p-5">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-orange-50 p-3 text-orange-600">
              <ClipboardList size={22} />
            </div>

            <div>
              <h2 className="text-lg font-bold text-gray-900">
                My Orders
              </h2>
              <p className="mt-1 text-sm text-gray-500">
                Your restaurant order history will appear here.
              </p>
            </div>
          </div>
        </div>

        <div className="px-5 py-12 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-gray-50 text-gray-400">
            <Clock3 size={30} />
          </div>

          <h3 className="mt-4 font-bold text-gray-900">
            Customer ordering is coming soon
          </h3>

          <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-gray-500">
            Online ordering and customer order history have not been
            implemented yet. Once available, you will be able to track
            your orders and view previous purchases here.
          </p>

          <div className="mx-auto mt-5 flex max-w-md items-start gap-2 rounded-xl bg-blue-50 p-4 text-left text-xs leading-5 text-blue-700">
            <Info size={17} className="mt-0.5 shrink-0" />
            <p>
              Your current restaurant system supports dine-in orders
              created by staff through POS.
            </p>
          </div>
        </div>
      </section>

      {/* Explore menu */}
      <section className="flex flex-col justify-between gap-5 rounded-2xl border border-orange-100 bg-orange-50/60 p-6 sm:flex-row sm:items-center">
        <div className="flex items-center gap-4">
          <div className="rounded-xl bg-white p-3 text-orange-600 shadow-sm">
            <Utensils size={24} />
          </div>

          <div>
            <h3 className="font-bold text-gray-900">
              Hungry for something delicious?
            </h3>
            <p className="mt-1 text-sm text-gray-600">
              Explore our pizzas and discover your favorites.
            </p>
          </div>
        </div>

        <Link
          to="/menu"
          className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-orange-500 px-5 py-3 text-sm font-bold text-white transition hover:bg-orange-600"
        >
          Browse Menu
          <ArrowRight size={17} />
        </Link>
      </section>
    </div>
  );
};

export default CustomerDashboard;
