import { render, screen, waitFor } from "@testing-library/react";
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