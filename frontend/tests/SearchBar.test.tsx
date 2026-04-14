// tests/SearchBar.test.tsx
import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import SearchBar from "../src/components/SearchBar";

// ✅ Mock Zustand store
const mockSetTasks = jest.fn();
const mockTasks = [
  { id: 1, title: "Task A", priority: "high", status: "pending" },
  { id: 2, title: "Another Task", priority: "low", status: "completed" },
];

jest.mock("../src/store", () => ({
  useTaskStore: () => ({
    tasks: mockTasks,
    setTasks: mockSetTasks,
  }),
}));

describe("SearchBar Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders the search input", () => {
    render(<SearchBar />);
    expect(screen.getByLabelText("Search tasks")).toBeInTheDocument();
  });

  it("does not filter when input is less than 2 characters", async () => {
    render(<SearchBar />);
    fireEvent.change(screen.getByLabelText("Search tasks"), {
      target: { value: "A" },
    });
    await waitFor(() => {
      expect(mockSetTasks).not.toHaveBeenCalled();
    });
  });

  it("filters tasks when input has 2+ characters", async () => {
    render(<SearchBar />);
    fireEvent.change(screen.getByLabelText("Search tasks"), {
      target: { value: "Task" },
    });
    await waitFor(() => {
      expect(mockSetTasks).toHaveBeenCalledWith(
        expect.arrayContaining([
          expect.objectContaining({ title: "Task A" }),
          expect.objectContaining({ title: "Another Task" }),
        ])
      );
    });
  });

  it("resets tasks when input is cleared", async () => {
    render(<SearchBar />);
    fireEvent.change(screen.getByLabelText("Search tasks"), {
      target: { value: "Task" },
    });
    fireEvent.change(screen.getByLabelText("Search tasks"), {
      target: { value: "" },
    });
    await waitFor(() => {
      expect(mockSetTasks).toHaveBeenCalledWith(mockTasks);
    });
  });
});
