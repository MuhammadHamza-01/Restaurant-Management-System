
import { Link } from "react-router-dom";
import {
  Truck,
  MapPin,
  ClipboardList,
  Clock3,
  PackageCheck,
  Info,
  ArrowRight,
} from "lucide-react";

const DeliveryDashboard = () => {
  return (
    <div className="space-y-7">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-orange-500" />
          <p className="text-xs font-semibold uppercase tracking-wider text-orange-600">
            Delivery workspace
          </p>
        </div>

        <h1 className="mt-2 text-2xl font-bold text-gray-900 sm:text-3xl">
          Delivery Dashboard
        </h1>

        <p className="mt-1 text-sm text-gray-500">
          Your workspace for managing restaurant deliveries.
        </p>
      </div>

      {/* Setup notice */}
      <section className="overflow-hidden rounded-2xl border border-orange-100 bg-white shadow-sm">
        <div className="bg-[#18181b] p-6 text-white sm:p-8">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-orange-500">
              <Truck size={32} />
            </div>

            <div>
              <span className="inline-flex rounded-full bg-orange-500/15 px-3 py-1 text-xs font-semibold text-orange-300">
                Coming soon
              </span>

              <h2 className="mt-3 text-xl font-bold sm:text-2xl">
                Delivery operations are not active yet
              </h2>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-gray-400">
                The current restaurant system supports dine-in orders.
                Delivery order assignment and tracking will be available
                when the delivery module is implemented.
              </p>
            </div>
          </div>
        </div>

        <div className="p-6 sm:p-8">
          <div className="flex items-start gap-3 rounded-xl border border-blue-100 bg-blue-50 p-4">
            <Info size={20} className="mt-0.5 shrink-0 text-blue-600" />

            <div>
              <p className="font-semibold text-blue-900">
                No delivery tasks assigned
              </p>
              <p className="mt-1 text-sm leading-6 text-blue-700">
                There are currently no delivery jobs to display. Your
                dashboard will show assigned orders once delivery
                management is enabled.
              </p>
            </div>
          </div>

          {/* Planned features */}
          <div className="mt-8">
            <h3 className="text-lg font-bold text-gray-900">
              Delivery workspace features
            </h3>

            <p className="mt-1 text-sm text-gray-500">
              These features can be connected when we build the delivery
              workflow.
            </p>

            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              {[
                {
                  icon: ClipboardList,
                  title: "Assigned Orders",
                  description:
                    "View orders assigned to your delivery account.",
                },
                {
                  icon: MapPin,
                  title: "Delivery Addresses",
                  description:
                    "Access customer addresses and delivery details.",
                },
                {
                  icon: Clock3,
                  title: "Delivery Status",
                  description:
                    "Track pending, picked-up, and delivered orders.",
                },
                {
                  icon: PackageCheck,
                  title: "Delivery History",
                  description:
                    "Review your previously completed deliveries.",
                },
              ].map((feature) => {
                const Icon = feature.icon;

                return (
                  <div
                    key={feature.title}
                    className="rounded-xl border border-gray-100 p-5"
                  >
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-orange-50 text-orange-600">
                      <Icon size={21} />
                    </div>

                    <h4 className="mt-4 font-semibold text-gray-900">
                      {feature.title}
                    </h4>

                    <p className="mt-1 text-sm leading-6 text-gray-500">
                      {feature.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Back to dashboard */}
      <Link
        to="/"
        className="inline-flex items-center gap-2 text-sm font-semibold text-orange-600 transition hover:text-orange-700"
      >
        Return to restaurant website
        <ArrowRight size={16} />
      </Link>
    </div>
  );
};

export default DeliveryDashboard;
