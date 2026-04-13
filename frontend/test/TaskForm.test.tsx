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

const renderComponent = () => render(<TaskForm />);

beforeEach(() => {
  jest.clearAllMocks();
  global.fetch = jest.fn();
  localStorage.clear();
});