// @vitest-environment jsdom

import { cleanup, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { afterEach, describe, expect, it, vi } from "vitest";
import type { User } from "@supabase/supabase-js";
import Archive from "./Archive";

const { getCurrentDayMock, getUserGamesMock } = vi.hoisted(() => ({
  getCurrentDayMock: vi.fn(() => 50),
  getUserGamesMock: vi.fn().mockResolvedValue([]),
}));

vi.mock("../utils/utils", () => ({
  getCurrentDay: getCurrentDayMock,
}));

vi.mock("../../supabase/gameService", () => ({
  getUserGames: getUserGamesMock,
}));

describe("Archive", () => {
  afterEach(() => {
    cleanup();
  });

  it("shows exactly the ten days before the current day", async () => {
    render(
      <MemoryRouter>
        <Archive user={{ id: "test-user" } as User} />
      </MemoryRouter>,
    );

    await waitFor(() => {
      expect(getUserGamesMock).toHaveBeenCalledOnce();
    });

    const displayedDays = screen
      .getAllByRole("heading", { name: /^#\d+$/ })
      .map((heading) => Number(heading.textContent?.slice(1)));

    expect(getCurrentDayMock).toHaveBeenCalled();
    expect(displayedDays).toEqual([49, 48, 47, 46, 45, 44, 43, 42, 41, 40]);

    const archiveLinks = screen.getAllByRole("link");
    expect(archiveLinks).toHaveLength(10);
    expect(archiveLinks[0].getAttribute("href")).toBe("/archive/49");
    expect(archiveLinks[9].getAttribute("href")).toBe("/archive/40");
    expect(screen.getAllByRole("button", { name: "Play" })).toHaveLength(10);
  });
});
