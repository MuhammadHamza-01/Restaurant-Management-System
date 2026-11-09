
import { Link } from "react-router-dom";
import { ClipboardList, ShoppingCart } from "lucide-react";
import POS from "../admin/POS";

const StaffPOS = () => {
  return (
    <div>
      <div className="flex items-center justify-between border-b bg-white px-6 py-4">
        <div>
          <h1 className="text-lg font-bold text-gray-900">
            Staff POS
          </h1>
          <p className="text-sm text-gray-500">
            Create restaurant orders
          </p>
        </div>

        <div className="flex gap-3">
          <Link
            to="/staff/pos"
            className="flex items-center gap-2 rounded-lg bg-orange-500 px-4 py-2 text-sm font-medium text-white"
          >
            <ShoppingCart size={17} />
            POS
          </Link>

          <Link
            to="/staff/orders"
            className="flex items-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            <ClipboardList size={17} />
            Ready Orders
          </Link>
        </div>
      </div>

      <POS />
    </div>
  );
};

export default StaffPOS;
