// tests/TaskList.test.tsx
import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import TaskList from "../src/components/TaskList";

// Mock store
const mockSetTasks = jest.fn();
const mockTasks = [
  { id: 1, title: "Task A", priority: "high", status: "pending" },
];

jest.mock("../src/store", () => ({
  useTaskStore: () => ({
    tasks: mockTasks,
    setTasks: mockSetTasks,
  }),
}));

beforeEach(() => {
  jest.clearAllMocks();
  global.fetch = jest.fn();
  localStorage.setItem("token", "mock-token");
});

describe("TaskList Component", () => {
  it("renders tasks", () => {
    render(<TaskList />);
    expect(screen.getByText("Task A")).toBeInTheDocument();
    expect(screen.getByText(/Priority: high/)).toBeInTheDocument();
    expect(screen.getByText(/Status: pending/)).toBeInTheDocument();
  });

  it("opens edit dialog when Edit button clicked", () => {
    render(<TaskList />);
    fireEvent.click(screen.getByText("Edit"));
    expect(screen.getByText("Edit Task")).toBeInTheDocument();
  });

  it("opens delete dialog when Delete button clicked", () => {
    render(<TaskList />);
    fireEvent.click(screen.getByText("Delete"));
    expect(screen.getByText("Confirm Delete")).toBeInTheDocument();
  });
});
