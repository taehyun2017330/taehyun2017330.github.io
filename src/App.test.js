import { act, render, screen } from "@testing-library/react";
import App from "./App";

beforeEach(() => {
  global.fetch = jest.fn().mockResolvedValue({ ok: false });
  jest.spyOn(HTMLMediaElement.prototype, "pause").mockImplementation(() => {});
});

afterEach(() => {
  jest.restoreAllMocks();
  delete global.fetch;
});

test("renders homepage branding", async () => {
  await act(async () => {
    render(<App />);
  });
  const brandElement = screen.getByRole("heading", { level: 1, name: /taehyun yang/i });
  expect(brandElement).toBeInTheDocument();
});
