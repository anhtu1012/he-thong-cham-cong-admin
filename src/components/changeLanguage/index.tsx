"use client";

import { useEffect, useState } from "react";
import setLanguageValue from "@/utils/servers/set-language-action";
import { Select } from "antd";
import Image from "next/image";
import "./index.scss";

export default function LocaleSwitcher() {
  const [locale, setLocale] = useState<string>("vi"); // Default value
  const [mounted, setMounted] = useState(false);

  // Get cookie when component is mounted
  useEffect(() => {
    setMounted(true);
    const storedLocale = document.cookie
      .split("; ")
      .find((row) => row.startsWith("language="))
      ?.split("=")[1];

    if (storedLocale) {
      setLocale(storedLocale); // Update state when cookie is found
    }
  }, []);

  const handleChange = (value: string) => {
    setLanguageValue(value); // Call function to update language
    setLocale(value); // Update state when user selects new language
    document.cookie = `language=${value}; path=/`; // Update cookie
  };

  // Prevent hydration mismatch by rendering a simplified version before mounting
  if (!mounted) {
    return <div className="select" style={{ width: 98 }} />;
  }

  return (
    <div className="select">
      <Select
        value={locale}
        style={{ width: "98px" }}
        dropdownAlign={{ points: ["tr", "br"] }}
        dropdownRender={(menu) => <div className="custom-dropdown">{menu}</div>}
        onChange={handleChange}
        options={[
          {
            value: "en",
            label: (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-evenly",
                }}
              >
                <Image
                  src="/assets/image/FlagsE.png"
                  alt="En"
                  width={35}
                  height={25}
                />
                <span
                  style={{
                    padding: "0px 5px",
                  }}
                >
                  Eng
                </span>
              </div>
            ),
          },
          {
            value: "vi",
            label: (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-evenly",
                }}
              >
                <Image
                  src="/assets/image/Flags.png"
                  alt="Vied"
                  width={35}
                  height={25}
                />
                <span
                  style={{
                    padding: "0px 5px",
                  }}
                >
                  Vie
                </span>
              </div>
            ),
          },
        ]}
        dropdownStyle={{ minWidth: 130 }}
      />
    </div>
  );
}
