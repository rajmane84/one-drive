import React from "react";

const Container = ({ children }: { children: React.ReactNode }) => {
  return <div className="flex-1 pt-16 min-h-[calc(100vh-4rem)] w-full">{children}</div>;
};

export default Container