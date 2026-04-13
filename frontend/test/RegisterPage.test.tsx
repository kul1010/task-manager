import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import RegisterPage from "../src/components/RegisterPage";
import { MemoryRouter } from "react-router-dom";

// ✅ mock useNavigate
const mockNavigate = jest.fn();

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
}));

const renderComponent = () =>
  render(
    <MemoryRouter>
      <RegisterPage />
    </MemoryRouter>
  );

beforeEach(() => {
  jest.clearAllMocks();
  global.fetch = jest.fn();
  jest.useFakeTimers();
});

afterEach(() => {
  jest.runOnlyPendingTimers();
  jest.useRealTimers();
});
``