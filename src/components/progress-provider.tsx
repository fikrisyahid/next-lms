"use client";

import { ProgressProvider as ProgressBar } from "@bprogress/next/app";

const Providers = ({ children }: { children: React.ReactNode }) => {
  return (
    <ProgressBar
      height="4px"
      color="#9FFF91"
      options={{ showSpinner: false }}
      shallowRouting
    >
      {children}
    </ProgressBar>
  );
};

export default Providers;
