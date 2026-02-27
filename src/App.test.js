import { render, screen } from "@testing-library/react";
import App from "./App";

test("renders homepage branding", () => {
  render(<App />);
  const brandElement = screen.getByRole("heading", { level: 1, name: /taehyun yang/i });
  expect(brandElement).toBeInTheDocument();
});
