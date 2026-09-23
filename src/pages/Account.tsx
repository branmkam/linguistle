import { Button, Modal, UsernameEditor } from "../components";
import { supabase } from "../../supabase/supabase";
import type { User } from "@supabase/supabase-js";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { TitleCard } from "../components/TitleCard";

type AccountProps = {
  user: User | null;
  setUser: (user: User | null) => void;
};

export default function Account({ user, setUser }: AccountProps) {
  const navigate = useNavigate();
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleteError, setDeleteError] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  async function handleSignOut() {
    const { error } = await supabase.auth.signOut();

    if (error) {
      console.error(error.message);
      return;
    }

    setUser(null);
    navigate("/login");
  }

  async function handleDeleteAccount() {
    if (!user) {
      console.error("No user is currently signed in.");
      return;
    }

    setDeleteError("");
    setIsDeleting(true);

    const { error } = await supabase.functions.invoke("delete-user", {
      body: {},
    });

    if (error) {
      console.error("Account deletion failed:", error);
      setDeleteError(error.message);
      setIsDeleting(false);
      return;
    }

    await supabase.auth.signOut();
    setUser(null);
    setIsDeleting(false);
    setIsDeleteModalOpen(false);
    navigate("/login");
  }

  const displayName =
    user?.user_metadata?.display_name ??
    user?.user_metadata?.username ??
    user?.email ??
    "User";

  return (
    <div className="justify-center items-center flex-col flex gap-4">
      <TitleCard eyebrow="Account" title="Change or delete your account here." />

      <div className="flex items-center gap-3">
        <p>User: {displayName}</p>
        {user && <UsernameEditor user={user} setUser={setUser} />}
      </div>
      {user && <div className="flex items-center gap-3">
        <p>Email: {user?.email}</p>
      </div>}
      <div className="flex gap-4">
        <Button
          className="bg-blue-600 rounded-lg px-4 py-2"
          onClick={handleSignOut}
        >
          <Link to="/login">Sign Out</Link>
        </Button>
        <Button
          className="bg-red-600 rounded-lg px-4 py-2"
          onClick={() => setIsDeleteModalOpen(true)}
        >
          Delete Account
        </Button>
      </div>
      {isDeleteModalOpen && (
        <Modal>
          <h2 className="text-xl font-bold">Delete your account?</h2>
          <p className="text-center">This action cannot be undone.</p>
          {deleteError && (
            <p className="text-red-500 text-center" role="alert">
              {deleteError}
            </p>
          )}
          <div className="flex gap-4 mt-4">
            <Button
              className="bg-gray-300 px-4 py-2"
              disabled={isDeleting}
              onClick={() => setIsDeleteModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              className="bg-red-600 text-white px-4 py-2"
              disabled={isDeleting}
              onClick={handleDeleteAccount}
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </Button>
          </div>
        </Modal>
      )}
    </div>
  );
}
