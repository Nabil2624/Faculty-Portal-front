import React, { Suspense } from "react"; // 👈 add Suspense here
import AppRouter from "./Protected-Routing/AppRouter";
import LoadingSpinner from "./components/LoadingSpinner";

export default function App() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <AppRouter />
    </Suspense>
  );
}
