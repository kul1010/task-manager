// tests/RegisterPage.test.tsx
import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import RegisterPage from "../src/components/RegisterPage";

// ✅ Mock navigate from react-router-dom
const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
}));

beforeEach(() => {
  jest.clearAllMocks();
  global.fetch = jest.fn();
});

describe("RegisterPage Component", () => {
  it("renders form fields", () => {
    render(<RegisterPage />);
    expect(screen.getByLabelText(/First Name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Last Name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Username/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Password/i)).toBeInTheDocument();
    expect(screen.getByText(/Register/i)).toBeInTheDocument();
  });

  it("shows validation errors when fields are empty", async () => {
    render(<RegisterPage />);
    fireEvent.click(screen.getByText(/Register/i));
    await waitFor(() => {
      // Example: check that at least one error message appears
      expect(screen.getByText(/required/i)).toBeInTheDocument();
    });
  });

  it("shows error snackbar when backend returns error", async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      json: async () => ({ error: "User already exists" }),
    });

    render(<RegisterPage />);
    fireEvent.change(screen.getByLabelText(/First Name/i), { target: { value: "John" } });
    fireEvent.change(screen.getByLabelText(/Last Name/i), { target: { value: "Doe" } });
    fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: "john@example.com" } });
    fireEvent.change(screen.getByLabelText(/Username/i), { target: { value: "johndoe" } });
    fireEvent.change(screen.getByLabelText(/Password/i), { target: { value: "password123" } });
    fireEvent.click(screen.getByText(/Register/i));

    await waitFor(() => {
      expect(screen.getByText("User already exists")).toBeInTheDocument();
    });
  });

  it("shows success snackbar and navigates to login on success", async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      json: async () => ({ id: 1, username: "johndoe", email: "john@example.com" }),
    });

    render(<RegisterPage />);
    fireEvent.change(screen.getByLabelText(/First Name/i), { target: { value: "John" } });
    fireEvent.change(screen.getByLabelText(/Last Name/i), { target: { value: "Doe" } });
    fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: "john@example.com" } });
    fireEvent.change(screen.getByLabelText(/Username/i), { target: { value: "johndoe" } });
    fireEvent.change(screen.getByLabelText(/Password/i), { target: { value: "password123" } });
    fireEvent.click(screen.getByText(/Register/i));

    await waitFor(() => {
      expect(screen.getByText("Registration successful, redirecting to login...")).toBeInTheDocument();
    });

    // Simulate timeout
    jest.advanceTimersByTime(2000);
    expect(mockNavigate).toHaveBeenCalledWith("/login");
  });
});
