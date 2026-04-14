// tests/LoginPage.test.tsx
import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import LoginPage from "../src/components/LoginPage";

// ✅ Mock onLogin callback
const mockOnLogin = jest.fn();

beforeEach(() => {
  jest.clearAllMocks();
  global.fetch = jest.fn();
  localStorage.clear();
});

test("renders login form", () => {
  render(<LoginPage onLogin={mockOnLogin} />);
  expect(screen.getByText(/Login/i)).toBeInTheDocument();
});

describe("LoginPage Component", () => {
  it("renders form fields", () => {
    render(<LoginPage onLogin={mockOnLogin} />);
    expect(screen.getByLabelText(/Username or Email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Password/i)).toBeInTheDocument();
    expect(screen.getByText(/Login/i)).toBeInTheDocument();
  });

  it("shows validation errors when fields are empty", async () => {
    render(<LoginPage onLogin={mockOnLogin} />);
    fireEvent.click(screen.getByText(/Login/i));
    await waitFor(() => {
      expect(screen.getByText(/required/i)).toBeInTheDocument();
    });
  });

  it("shows error snackbar when backend returns error", async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      json: async () => ({ error: "Invalid credentials" }),
    });

    render(<LoginPage onLogin={mockOnLogin} />);
    fireEvent.change(screen.getByLabelText(/Username or Email/i), { target: { value: "johndoe" } });
    fireEvent.change(screen.getByLabelText(/Password/i), { target: { value: "wrongpass" } });
    fireEvent.click(screen.getByText(/Login/i));

    await waitFor(() => {
      expect(screen.getByText("Invalid credentials")).toBeInTheDocument();
    });
  });

  it("calls onLogin and shows success snackbar when backend returns token", async () => {
    const fakeToken = "mock.jwt.token";
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      json: async () => ({ token: fakeToken }),
    });

    render(<LoginPage onLogin={mockOnLogin} />);
    fireEvent.change(screen.getByLabelText(/Username or Email/i), { target: { value: "johndoe" } });
    fireEvent.change(screen.getByLabelText(/Password/i), { target: { value: "password123" } });
    fireEvent.click(screen.getByText(/Login/i));

    await waitFor(() => {
      expect(mockOnLogin).toHaveBeenCalledWith(expect.any(String), expect.any(Object));
      expect(screen.getByText("Login successful!")).toBeInTheDocument();
    });
  });
});
