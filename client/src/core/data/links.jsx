import {
  HiUsers,
  HiUserGroup,
  HiTrash,
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
        icon: <HiUsers />,
        subLinks: [
          { name: "All Users", url: "/dashboard/users", icon: <HiUserGroup /> },
          {
            name: "Deleted Users",
            url: "/dashboard/users/deleted",
            icon: <HiTrash />,
          },
          {
            name: "Inactive Users",
            url: "/dashboard/users/inactive",
            icon: <HiUserRemove />,
          },
        ],
      },
    ],
  },
  {
    title: "User Panel",
    roles: ["admin", "user"],
    links: [
      { name: "My Profile", url: "/profile", icon: <HiUserCircle /> },
      { name: "Settings", url: "/settings", icon: <HiCog /> },
    ],
  },
];
