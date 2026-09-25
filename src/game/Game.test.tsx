// @vitest-environment jsdom

import { cleanup, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { ComponentProps, ReactNode } from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import type { Language } from "../utils/types";
import Game from "./Game";

const { createGameMock, languages } = vi.hoisted(() => ({
  createGameMock: vi.fn(),
  languages: [
    ["English", "eng"],
    ["Spanish", "spa"],
    ["French", "fra"],
    ["German", "deu"],
    
    ["Italian", "ita"],
    ["Portuguese", "por"],
    ["Russian", "rus"],
    ["Chinese", "zho"],
    ["Arabic", "ara"],
  ].map(([Name, iso6393]) => ({
    Name,
    iso6393,
    nativeSpeakers: 20_000_000,
    Countries: "",
    mainScript: "",
    Macroarea: "Europe",
    Latitude: 0,
    Longitude: 0,
    path: "",
    top_family: "",
  })),
}));

vi.mock("../data/withFamily.json", () => ({ default: languages }));

vi.mock("../../supabase/gameService", () => ({
  createGame: createGameMock,
}));

vi.mock("../../supabase/supabase", () => ({
  supabase: {
    auth: {
      getUser: vi.fn().mockResolvedValue({ data: { user: { id: "test-user" } } }),
    },
    from: vi.fn(() => {
      const response = Promise.resolve({ data: [], error: null });
      return {
        select: () => ({
          eq: () => ({ eq: () => ({ eq: () => response }) }),
        }),
      };
    }),
  },
}));

vi.mock("../utils", () => ({
  getCurrentDay: () => 0,
  haversineKm: () => 0,
  score: () => 123.5,
  shuffleWithSeed: (items: Language[]) => items,
  SEED: 1,
}));

vi.mock("./GameMap", () => ({ default: () => null }));

vi.mock("../components", async () => {
  const React = await import("react");

  return {
    Button: (props: ComponentProps<"button">) =>
      React.createElement("button", props, props.children),
    LangSearch: (props: {
      languages: Language[];
      onSelect: (language: Language) => void;
    }) =>
      React.createElement(
        "div",
        null,
        props.languages.map((language) =>
          React.createElement(
            "button",
            {
              key: language.iso639_3,
              type: "button",
              onClick: () => props.onSelect(language),
            },
            language.languageName,
          ),
        ),
      ),
    Modal: ({ children }: { children: ReactNode }) =>
      React.createElement("div", { role: "dialog" }, children),
    TableCell: ({ children }: { children: ReactNode }) =>
      React.createElement("div", null, children),
    LangRow: ({ language }: { language: Language }) =>
      React.createElement("div", null, language.languageName),
  };
});

describe("Game completion saves", () => {
  beforeEach(() => {
    createGameMock.mockReset().mockResolvedValue(undefined);
  });

  afterEach(() => {
    cleanup();
  });

  it("saves a win with the submitted guesses and solved flag", async () => {
    const user = userEvent.setup();
    render(<Game day={0} />);

    await user.click(screen.getByRole("button", { name: "English" }));

    await waitFor(() => {
      expect(createGameMock).toHaveBeenCalledWith(
        ["eng"],
        true,
        0,
        "normal",
        124,
      );
    });
  });

  it("shows a copied confirmation after sharing the score", async () => {
    const user = userEvent.setup();
    const writeText = vi.fn().mockResolvedValue(undefined);
    Object.defineProperty(navigator, "clipboard", {
      configurable: true,
      value: { writeText },
    });
    render(<Game day={0} />);

    await user.click(screen.getByRole("button", { name: "English" }));
    await user.click(screen.getByRole("button", { name: "Share" }));

    expect(writeText).toHaveBeenCalledOnce();
    expect(screen.getByRole("button", { name: "Copied!" })).toBeTruthy();
  });

  it("saves a given-up game with its guesses and an unsolved flag", async () => {
    const user = userEvent.setup();
    render(<Game day={0} />);

    await user.click(screen.getByRole("button", { name: "Spanish" }));
    await user.click(screen.getByRole("button", { name: "French" }));
    await user.click(screen.getByRole("button", { name: "Give up" }));

    await waitFor(() => {
      expect(createGameMock).toHaveBeenCalledWith(
        ["spa", "fra"],
        false,
        0,
        "normal",
        124,
      );
    });
  });

  it("saves a game after eight incorrect guesses as unsolved", async () => {
    const user = userEvent.setup();
    render(<Game day={0} />);

    for (const language of [
      "Spanish",
      "French",
      "German",
      "Italian",
      "Portuguese",
      "Russian",
      "Chinese",
      "Arabic",
    ]) {
      await user.click(screen.getByRole("button", { name: language }));
    }

    await waitFor(() => {
      expect(createGameMock).toHaveBeenCalledWith(
        ["spa", "fra", "deu", "ita", "por", "rus", "zho", "ara"],
        false,
        0,
        "normal",
        124,
      );
    });
  });
});