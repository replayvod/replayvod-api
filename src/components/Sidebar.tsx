import React, { useState, useEffect, useRef } from "react";
import { Icon } from "@iconify/react";
import { useTranslation } from "react-i18next";

interface SidebarProps {
  isOpenSideBar: boolean;
  onCloseSidebar: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpenSideBar, onCloseSidebar }) => {
  const { t } = useTranslation();
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const pageClickEvent = (e: MouseEvent) => {
      if (dropdownRef.current !== null && !dropdownRef.current.contains(e.target as Node)) {
        onCloseSidebar();
      }
    };
    window.addEventListener("click", pageClickEvent);
    return () => {
      window.removeEventListener("click", pageClickEvent);
    };
  }, [onCloseSidebar]);

  const [navLinks, setNavLinks] = useState([
    {
      href: "/",
      icon: "mdi:view-dashboard",
      text: t("Dashboard"),
    },
    {
      href: "/vod",
      icon: "mdi:play",
      text: t("Videos"),
    },
    {
      icon: "mdi:tray-arrow-down",
      text: t("Recording"),
      dropdown: true,
      items: [
        { href: "/schedule/add", text: t("Schedule Videos") },
        { href: "/schedule/manage", text: t("Manage Videos") },
        { href: "/schedule/following", text: t("Followed Channels") },
      ],
    },
    {
      icon: "fluent:shifts-activity-24-filled",
      text: t("Activity"),
      dropdown: true,
      items: [
        { href: "/activity/queue", text: t("Queue") },
        { href: "/activity/history", text: t("History") },
      ],
    },
    {
      href: "/settings",
      icon: "mdi:cog",
      text: t("Settings"),
    },
    {
      icon: "mdi:laptop",
      text: t("System"),
      dropdown: true,
      items: [
        { href: "/system/status", text: t("Status") },
        { href: "/system/tasks", text: t("Tasks") },
        { href: "/system/logs", text: t("Log Files") },
      ],
    },
  ]);

  const toggleDropdown = (index: number) => {
    let updatedLinks = [...navLinks];
    if (updatedLinks[index].dropdown !== undefined) {
      updatedLinks[index].dropdown = !updatedLinks[index].dropdown;
    }
    setNavLinks(updatedLinks);
  };

  return (
    <>
      <aside
        id="logo-sidebar"
        className={`fixed top-0 left-0 z-40 w-64 h-screen pt-20 transition-transform ${
          isOpenSideBar ? "-translate-x-0" : "-translate-x-full"
        } bg-white border-r border-gray-200 sm:translate-x-0 dark:bg-gray-800 dark:border-gray-700`}
        aria-label="Sidebar"
      >
        <div className="h-full px-3 pb-4 overflow-y-auto bg-white dark:bg-gray-800">
          <ul className="space-y-2 font-normal">
            {navLinks.map((link, index) => (
              <li key={index}>
                {link.items ? (
                  <>
                    <button
                      onClick={() => toggleDropdown(index)}
                      className="flex items-center w-full p-2 text-gray-900 transition duration-75 rounded-lg group hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700"
                      aria-controls="dropdown"
                      data-collapse-toggle="dropdown"
                    >
                      <Icon icon={link.icon} width="18" height="18" />
                      <span className="flex-1 ml-3 text-left whitespace-nowrap" sidebar-toggle-item="true">
                        {link.text}
                      </span>
                      <Icon icon="mdi:chevron-down" width="18" height="18" />
                    </button>
                    {link.dropdown && (
                      <ul id="dropdown" className="py-2 space-y-2">
                        {link.items.map((item, i) => (
                          <li key={i}>
                            <a
                              href={item.href}
                              className="flex items-center w-full p-2 text-gray-900 transition duration-75 rounded-lg pl-11 group hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700"
                            >
                              {item.text}
                            </a>
                          </li>
                        ))}
                      </ul>
                    )}
                  </>
                ) : (
                  <a
                    href={link.href}
                    className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    <Icon icon={link.icon} width="18" height="18" />
                    <span className="ml-3">{link.text}</span>
                  </a>
                )}
              </li>
            ))}
          </ul>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
