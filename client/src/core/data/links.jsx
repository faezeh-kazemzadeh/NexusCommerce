import {
  HiUsers,
  HiUserGroup,
  HiTag,
  HiUserRemove,
  HiUserCircle,
  HiCog,
  HiChartPie,
} from "react-icons/hi";

export const links = [
  {
    title: "Admin Panel",
    roles: ["admin"],
    links: [
      {
        name: "Users Management",
        url: "/dashboard/users",
        icon: <HiUserGroup />,
        // subLinks: [
        //   { name: "All Users", url: "/dashboard/users", icon: <HiUserGroup /> },
        //   {
        //     name: "Deleted Users",
        //     url: "/dashboard/users/deleted",
        //     icon: <HiTrash />,
        //   },
        //   {
        //     name: "Inactive Users",
        //     url: "/dashboard/users/inactive",
        //     icon: <HiUserRemove />,
        //   },
        // ],
      },
      { name: "Tags", url: "/dashboard/tags", icon: <HiTag /> },
    ],
  },
  {
    title: "User Panel",
    roles: ["admin", "user"],
    links: [
      { name: "My Profile", url: "/dashboard/profile", icon: <HiUserCircle /> },
      { name: "Settings", url: "/settings", icon: <HiCog /> },
    ],
  },
];
