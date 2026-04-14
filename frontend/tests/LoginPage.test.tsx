// tests/LoginPage.test.tsx
import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import { MemoryRouter } from "react-router-dom";
import LoginPage from "../src/components/LoginPage";

// Mock jwt-decode so we can control decoding
jest.mock("jwt-decode", () => ({
  jwtDecode: jest.fn(() => ({
    id: "1",
    username: "johndoe",
    email: "john@example.com",
    firstName: "John",
    lastName: "Doe",
  })),
}));

const mockOnLogin = jest.fn();

beforeEach(() => {
  jest.clearAllMocks();
  global.fetch = jest.fn();
  localStorage.clear();
});

describe("LoginPage Component", () => {
  it("shows validation errors when fields are empty", async () => {
    render(
      <MemoryRouter>
        <LoginPage onLogin={mockOnLogin} />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByText(/Login/i));

    await waitFor(() => {
      expect(screen.getByText(/Username or Email/i)).toBeInTheDocument();
      expect(screen.getByText(/Password/i)).toBeInTheDocument();
    });
  });

  it("shows error snackbar when backend returns error", async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      json: async () => ({ error: "Invalid credentials" }),
    });

    render(<MemoryRouter><LoginPage onLogin={mockOnLogin} /></MemoryRouter>);
    fireEvent.change(screen.getByLabelText(/Username or Email/i), {
      target: { value: "johndoe" },
    });
    fireEvent.change(screen.getByLabelText(/Password/i), {
      target: { value: "wrongpass" },
    });
    fireEvent.click(screen.getByText(/Login/i));

    await waitFor(() => {
      expect(screen.getByText("Invalid credentials")).toBeInTheDocument();
    });
  });

  // it("calls onLogin and shows success snackbar when backend returns valid token", async () => {
  //   (global.fetch as jest.Mock).mockResolvedValueOnce({
  //     json: async () => ({ token: "valid.jwt.token" }),
  //   });

  //   render(<MemoryRouter><LoginPage onLogin={mockOnLogin} /></MemoryRouter>);
  //   fireEvent.change(screen.getByLabelText(/Username or Email/i), {
  //     target: { value: "johndoe" },
  //   });
  //   fireEvent.change(screen.getByLabelText(/Password/i), {
  //     target: { value: "correctpass" },
  //   });
  //   fireEvent.click(screen.getByText(/Login/i));

  //   await waitFor(() => {
  //     expect(mockOnLogin).toHaveBeenCalledWith(
  //       "valid.jwt.token",
  //       expect.objectContaining({ username: "johndoe" })
  //     );
  //     expect(screen.getByText("Login successful!")).toBeInTheDocument();
  //   });
  // });

  // it("shows error snackbar when token decoding fails", async () => {
  //   // Override jwtDecode to throw
  //   const { jwtDecode } = require("jwt-decode");
  //   (jwtDecode as jest.Mock).mockImplementationOnce(() => {
  //     throw new Error("Bad token");
  //   });

  //   (global.fetch as jest.Mock).mockResolvedValueOnce({
  //     json: async () => ({ token: "invalid.jwt.token" }),
  //   });

  //   render(<MemoryRouter><LoginPage onLogin={mockOnLogin} /></MemoryRouter>);
  //   fireEvent.change(screen.getByLabelText(/Username or Email/i), {
  //     target: { value: "johndoe" },
  //   });
  //   fireEvent.change(screen.getByLabelText(/Password/i), {
  //     target: { value: "correctpass" },
  //   });
  //   fireEvent.click(screen.getByText(/Login/i));

  //   await waitFor(() => {
  //     expect(screen.getByText("Invalid token received")).toBeInTheDocument();
  //   });
  // });
});
