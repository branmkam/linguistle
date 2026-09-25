import { useState, type FormEvent } from "react";
import type { User } from "@supabase/supabase-js";
import { updateUsername } from "../../supabase/gameService";
import { Button } from "./Button";
import { Modal } from "./Modal";

type UsernameEditorProps = {
  user: User;
  setUser: (user: User | null) => void;
};

export function UsernameEditor({ user, setUser }: UsernameEditorProps) {
  const currentUsername =
    user.user_metadata?.username ?? user.user_metadata?.display_name ?? "";
  const [isOpen, setIsOpen] = useState(false);
  const [username, setUsername] = useState(currentUsername);
  const [errorMessage, setErrorMessage] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  function openEditor() {
    setUsername(currentUsername);
    setErrorMessage("");
    setIsOpen(true);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const normalizedUsername = username.trim();

    if (!/^[A-Za-z0-9_]{4,}$/.test(normalizedUsername)) {
      setErrorMessage(
        "Username must be at least 4 characters and contain only letters, numbers, or _."
      );
      return;
    }

    setErrorMessage("");
    setIsSaving(true);

    try {
      const updatedUser = await updateUsername(user, normalizedUsername);
      setUser(updatedUser);
      setIsOpen(false);
    } catch (error) {
      console.error("Username update failed:", error);
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Unable to update your username. Please try again."
      );
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <>
      <Button
        className="bg-gray-800 text-white rounded-lg px-3 py-1 text-sm"
        onClick={openEditor}
      >
        Edit username
      </Button>
      {isOpen && (
        <Modal>
          <h2 className="text-xl font-bold">Edit your username</h2>
          <form
            className="flex flex-col items-center gap-3 mt-3"
            onSubmit={handleSubmit}
          >
            <input
              autoFocus
              required
              value={username}
              onChange={(event) => setUsername(event.target.value)}
              className="border border-gray-300 rounded py-2 px-4"
              placeholder="Username"
            />
            {errorMessage && (
              <p className="text-red-500 text-sm text-center" role="alert">
                {errorMessage}
              </p>
            )}
            <div className="flex gap-4 mt-2">
              <Button
                type="button"
                className="bg-gray-300 px-4 py-2"
                onClick={() => setIsOpen(false)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSaving}
                className="bg-blue-600 text-white px-4 py-2"
              >
                {isSaving ? "Saving..." : "Save"}
              </Button>
            </div>
          </form>
        </Modal>
      )}
    </>
  );
}
