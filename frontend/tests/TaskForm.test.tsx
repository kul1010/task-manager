// tests/TaskForm.test.tsx
import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import TaskForm from "../src/components/TaskForm";

// ✅ Mock Zustand store
const mockSetTasks = jest.fn();

jest.mock("../src/store", () => ({
  useTaskStore: () => ({
    setTasks: mockSetTasks,
  }),
}));

beforeEach(() => {
  jest.clearAllMocks();
  global.fetch = jest.fn();
  localStorage.clear();
});

describe("TaskForm Component", () => {
  it("renders form fields", () => {
    render(<TaskForm />);
    expect(screen.getByLabelText("Title")).toBeInTheDocument();
    expect(screen.getByLabelText("Description")).toBeInTheDocument();
    expect(screen.getByText("Add Task")).toBeInTheDocument();
  });

  it("shows validation error when title is empty", async () => {
    render(<TaskForm />);
    fireEvent.click(screen.getByText("Add Task"));
    await waitFor(() => {
      expect(screen.getByText("Title is required")).toBeInTheDocument();
    });
  });

  it("shows snackbar error when no token is found", async () => {
    render(<TaskForm />);
    fireEvent.change(screen.getByLabelText("Title"), {
      target: { value: "New Task" },
    });
    fireEvent.click(screen.getByText("Add Task"));
    await waitFor(() => {
      expect(screen.getByText("No token found, please login again")).toBeInTheDocument();
    });
  });

  it("submits successfully when token exists", async () => {
    localStorage.setItem("token", "mock-token");
    (global.fetch as jest.Mock)
      .mockResolvedValueOnce({}) // POST /tasks
      .mockResolvedValueOnce({
        json: async () => [{ id: 1, title: "New Task", priority: "low", status: "pending" }],
      }); // GET /tasks

    render(<TaskForm />);
    fireEvent.change(screen.getByLabelText("Title"), {
      target: { value: "New Task" },
    });
    fireEvent.click(screen.getByText("Add Task"));

    await waitFor(() => {
      expect(mockSetTasks).toHaveBeenCalledWith([
        expect.objectContaining({ title: "New Task" }),
      ]);
      expect(screen.getByText("Task added successfully!")).toBeInTheDocument();
    });
  });
});
