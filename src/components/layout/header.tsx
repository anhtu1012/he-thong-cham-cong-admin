"use client";

import React from "react";
import "./index.scss";

interface HeaderProps {
  collapsed?: boolean;
  setCollapsed?: (collapsed: boolean) => void;
}

const HeaderComponent: React.FC<HeaderProps> = () => {
  return <>header</>;
};

export default HeaderComponent;
