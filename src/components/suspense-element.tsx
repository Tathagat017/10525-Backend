import React, { Suspense } from "react";
import SuspenseLoader from "./suspense-loader";

interface Props {
  children: React.ReactNode;
}

const SuspenseElement = ({ children }: Props) => {
  return <Suspense fallback={<SuspenseLoader />}>{children}</Suspense>;
};

export default SuspenseElement;
