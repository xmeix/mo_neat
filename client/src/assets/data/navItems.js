import ShoppingCartRoundedIcon from "@mui/icons-material/ShoppingCartRounded";
import ListAltRoundedIcon from "@mui/icons-material/ListAltRounded";
import DiscountRoundedIcon from "@mui/icons-material/DiscountRounded";
import LocationOnRoundedIcon from "@mui/icons-material/LocationOnRounded";
import LocalShippingRoundedIcon from "@mui/icons-material/LocalShippingRounded";
import PublicRoundedIcon from "@mui/icons-material/PublicRounded";
import StoreMallDirectoryRoundedIcon from "@mui/icons-material/StoreMallDirectoryRounded";
import LogoutRoundedIcon from "@mui/icons-material/LogoutRounded";
import ImportExportRoundedIcon from "@mui/icons-material/ImportExportRounded";

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
    title: "Delivery Management",
    path: "",
    icon: LocationOnRoundedIcon,
    children: [
      {
        title: "Import/Export",
        icon: ImportExportRoundedIcon,
        path: "/admin/geographical/import-export",
      },
      {
        title: "Delivery Methods",
        icon: LocalShippingRoundedIcon,
        path: "/admin/geographical/delivery",
      },
      {
        title: "Shipping zones",
        icon: PublicRoundedIcon,
        path: "/admin/geographical/shipping-zones",
      },
    ],
  },
  {
    title: "Log Out",
    path: "/logout",
    icon: LogoutRoundedIcon,
    children: [],
  },
];
