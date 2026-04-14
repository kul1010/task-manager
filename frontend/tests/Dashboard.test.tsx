// tests/Dashboard.test.tsx
import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import Dashboard from "../src/components/Dashboard";

// ✅ Mock Zustand store
const mockSetTasks = jest.fn();

jest.mock("../src/store", () => ({
  useTaskStore: () => ({
    setTasks: mockSetTasks,
  }),
}));

// ✅ Mock child components
jest.mock("../src/components/Header", () => (props: any) => (
  <div>
    <span>Header Component</span>
    <span>{props.user.username}</span>
    <button onClick={props.onLogout}>Logout</button>
  </div>
));

jest.mock("../src/components/TaskForm", () => () => (
  <div>TaskForm Component</div>
));

jest.mock("../src/components/TaskList", () => () => (
  <div>TaskList Component</div>
));

const mockUser = {
  username: "johndoe",
  firstName: "John",
  lastName: "Doe",
};

const mockLogout = jest.fn();

const renderComponent = () =>
  render(<Dashboard user={mockUser} onLogout={mockLogout} />);

beforeEach(() => {
  jest.clearAllMocks();
  global.fetch = jest.fn();
  localStorage.clear();
});

describe("Dashboard Component", () => {
  it("renders header with username", () => {
    renderComponent();
    expect(screen.getByText("Header Component")).toBeInTheDocument();
    expect(screen.getByText("johndoe")).toBeInTheDocument();
  });

  it("renders TaskForm and TaskList components", () => {
    renderComponent();
    expect(screen.getByText("TaskForm Component")).toBeInTheDocument();
    expect(screen.getByText("TaskList Component")).toBeInTheDocument();
  });

  it("calls onLogout when logout button clicked", () => {
    renderComponent();
    fireEvent.click(screen.getByText("Logout"));
    expect(mockLogout).toHaveBeenCalledTimes(1);
  });

  it("fetches tasks on mount and calls setTasks", async () => {
    const fakeTasks = [{ id: 1, title: "Task A", priority: "high", status: "pending" }];
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      json: async () => fakeTasks,
    });

    localStorage.setItem("token", "mock-token");
    renderComponent();

    await waitFor(() => {
      expect(mockSetTasks).toHaveBeenCalledWith(fakeTasks);
    });
  });
});
