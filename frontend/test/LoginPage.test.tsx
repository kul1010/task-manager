import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import LoginPage from "../src/components/LoginPage";
import { MemoryRouter } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

// ✅ Mock jwt-decode
jest.mock("jwt-decode", () => ({
  jwtDecode: jest.fn(),
}));

const mockOnLogin = jest.fn();

const renderComponent = () =>
  render(
    <MemoryRouter>
      <LoginPage onLogin={mockOnLogin} />
    </MemoryRouter>
  );

beforeEach(() => {
  mockOnLogin.mockReset();
  (global.fetch as jest.Mock) = jest.fn();
  localStorage.clear();
});

afterEach(() => {
  jest.clearAllMocks();
});