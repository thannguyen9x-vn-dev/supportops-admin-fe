import { fireEvent, screen } from "@testing-library/react";

export function selectFirstRow() {
  const checkboxes = screen.getAllByRole("checkbox");
  if (checkboxes.length > 1) {
    fireEvent.click(checkboxes[1]);
  }
}

export function clickToolbarAction(label: RegExp) {
  fireEvent.click(screen.getByRole("button", { name: label }));
}
