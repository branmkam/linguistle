import { afterEach, describe, expect, it, vi } from "vitest";
import { getCurrentDay } from "./utils";

describe("getCurrentDay", () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it("returns day 77 on November 17, 2026", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date(Date.UTC(2026, 10, 17, 12)));

    expect(getCurrentDay()).toBe(77);
  });

  it("advances the day at UTC midnight", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date(Date.UTC(2026, 10, 17, 23, 59, 59)));
    expect(getCurrentDay()).toBe(77);

    vi.setSystemTime(new Date(Date.UTC(2026, 10, 18)));
    expect(getCurrentDay()).toBe(78);
  });
});
