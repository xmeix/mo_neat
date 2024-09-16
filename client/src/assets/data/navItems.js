import ShoppingCartRoundedIcon from "@mui/icons-material/ShoppingCartRounded";
import ListAltRoundedIcon from "@mui/icons-material/ListAltRounded";
import DiscountRoundedIcon from "@mui/icons-material/DiscountRounded";
import LocationOnRoundedIcon from "@mui/icons-material/LocationOnRounded";
import LocalShippingRoundedIcon from "@mui/icons-material/LocalShippingRounded";
import PublicRoundedIcon from "@mui/icons-material/PublicRounded";
import StoreMallDirectoryRoundedIcon from "@mui/icons-material/StoreMallDirectoryRounded";
import LogoutRoundedIcon from "@mui/icons-material/LogoutRounded";

export const navItems = [
  {
    title: "Orders Management",
    path: "",
    icon: ShoppingCartRoundedIcon,
    children: [
      {
        title: "View All Orders",
        icon: ListAltRoundedIcon,
        path: "/admin/orders",
      },
    ],
  },
  {
    title: "Products Management",
    path: "",
    icon: StoreMallDirectoryRoundedIcon,
    children: [
      {
        title: "View All Products",
        icon: ListAltRoundedIcon,
        path: "/admin/products",
      },
    ],
  },
  {
    title: "Coupons Management",
    path: "",
    icon: DiscountRoundedIcon,
    children: [
      {
        title: "View All Coupons",
        icon: ListAltRoundedIcon,
        path: "/admin/coupons",
      },
    ],
  },
  {
    title: "Geographical Management",
    path: "",
    icon: LocationOnRoundedIcon,
    children: [
      {
        title: "View Wilayas",
        icon: PublicRoundedIcon,
        path: "/admin/geographical/wilayas",
      },
      {
        title: "View Stop Desks",
        icon: LocalShippingRoundedIcon,
        path: "/admin/geographical/stopDesks",
      },
    ],
  },
  {
    title: "Log Out",
    path: "/logout",
    icon: LogoutRoundedIcon,
  },
];
