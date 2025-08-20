import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import Signup from "./Auth";

// Mock global fetch
global.fetch = vi.fn();

describe("Signup Component", () => {
  beforeEach(() => {
    fetch.mockClear();
  });

  test("renders signup form with inputs and button", () => {
    render(<Signup />);
    expect(screen.getByPlaceholderText("Email")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Password")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Confirm Password")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /sign up/i })
    ).toBeInTheDocument();
  });

  test("shows alert if fields are empty", () => {
    window.alert = vi.fn(); // mock alert
    render(<Signup />);
    fireEvent.click(screen.getByRole("button", { name: /sign up/i }));
    expect(window.alert).toHaveBeenCalledWith("please fill the all fields");
  });

  test("shows alert if passwords do not match", () => {
    window.alert = vi.fn();
    render(<Signup />);
    fireEvent.change(screen.getByPlaceholderText("Email"), {
      target: { value: "test@example.com" },
    });
    fireEvent.change(screen.getByPlaceholderText("Password"), {
      target: { value: "123456" },
    });
    fireEvent.change(screen.getByPlaceholderText("Confirm Password"), {
      target: { value: "654321" },
    });
    fireEvent.click(screen.getByRole("button", { name: /sign up/i }));
    expect(window.alert).toHaveBeenCalledWith("passwords do not match!");
  });

  test("sends fetch request on valid form submit", async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ idToken: "fake-token" }),
    });

    render(<Signup />);
    fireEvent.change(screen.getByPlaceholderText("Email"), {
      target: { value: "test@example.com" },
    });
    fireEvent.change(screen.getByPlaceholderText("Password"), {
      target: { value: "123456" },
    });
    fireEvent.change(screen.getByPlaceholderText("Confirm Password"), {
      target: { value: "123456" },
    });
    fireEvent.click(screen.getByRole("button", { name: /sign up/i }));

    await waitFor(() =>
      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining("identitytoolkit.googleapis.com"),
        expect.objectContaining({
          method: "POST",
          body: JSON.stringify({
            email: "test@example.com",
            password: "123456",
            returnSecureToken: true,
          }),
        })
      )
    );
  });

  test("shows error alert when fetch fails", async () => {
    window.alert = vi.fn();
    fetch.mockResolvedValueOnce({
      ok: false,
      json: async () => ({ error: { message: "EMAIL_EXISTS" } }),
    });

    render(<Signup />);
    fireEvent.change(screen.getByPlaceholderText("Email"), {
      target: { value: "already@exists.com" },
    });
    fireEvent.change(screen.getByPlaceholderText("Password"), {
      target: { value: "123456" },
    });
    fireEvent.change(screen.getByPlaceholderText("Confirm Password"), {
      target: { value: "123456" },
    });
    fireEvent.click(screen.getByRole("button", { name: /sign up/i }));

    await waitFor(() =>
      expect(window.alert).toHaveBeenCalledWith("EMAIL_EXISTS")
    );
  });
});
