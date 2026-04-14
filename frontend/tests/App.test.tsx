import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import App from "../src/App";

test("renders app title", () => {
  render(<App />);
  expect(screen.getByText(/Team Task Manager/i)).toBeInTheDocument();
});
