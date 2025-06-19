import {
  Package,
  CreditCard,
  User,
  Settings,
  Heart,
  LogOut,
} from "lucide-react";
import { Link } from "react-router-dom";

interface AccountNavProps {
  active: "profile" | "orders" | "subscriptions" | "wishlist" | "settings";
}

export default function AccountNav({ active }: AccountNavProps) {
  const navItems = [
    {
      label: "Profile",
      to: "/account",
      icon: <User className="h-5 w-5" />,
      value: "profile",
    },
    {
      label: "Orders",
      to: "/account/orders",
      icon: <Package className="h-5 w-5" />,
      value: "orders",
    },
    {
      label: "Subscriptions",
      to: "/account/subscriptions",
      icon: <CreditCard className="h-5 w-5" />,
      value: "subscriptions",
    },
    {
      label: "Wishlist",
      to: "/account/wishlist",
      icon: <Heart className="h-5 w-5" />,
      value: "wishlist",
    },
    {
      label: "Settings",
      to: "/account/settings",
      icon: <Settings className="h-5 w-5" />,
      value: "settings",
    },
  ];

  return (
    <div className="bg-white border rounded-lg overflow-hidden sticky top-24">
      <div className="p-6 border-b">
        <h2 className="font-medium">Account</h2>
      </div>
      <nav className="p-2">
        <ul className="space-y-1">
          {navItems.map((item) => (
            <li key={item.value}>
              <Link
                to={item.to}
                className={`flex items-center gap-3 px-4 py-2 rounded-md ${
                  active === item.value
                    ? "bg-amber-100 text-amber-800"
                    : "hover:bg-stone-50 text-stone-700 hover:text-stone-900"
                }`}
              >
                {item.icon}
                <span>{item.label}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      <div className="p-4 border-t">
        <button className="flex items-center gap-3 px-4 py-2 w-full text-left rounded-md hover:bg-stone-50 text-stone-700 hover:text-stone-900">
          <LogOut className="h-5 w-5" />
          <span>Sign Out</span>
        </button>
      </div>
    </div>
  );
}
