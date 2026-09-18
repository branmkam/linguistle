import { Button, Modal } from "../components";
import { supabase } from "../../supabase/supabase";
import type { User } from "@supabase/supabase-js";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";

type AccountProps = {
  user: User | null;
  setUser: (user: User | null) => void;
};

export default function Account({ user, setUser }: AccountProps) {
  const navigate = useNavigate();
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

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

      

      const { error } = await supabase.functions.invoke("delete-user");

      if (error) {
        console.error(error.message);
        return;
      }

      setUser(null);
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
      <h1 className="text-xl font-ultra md:text-3xl">Account Page</h1>
      <p>User: {displayName}</p>
      <div className="flex gap-4">
        <Button className="bg-blue-600 rounded-lg px-4 py-2" onClick={handleSignOut}>
          <Link to="/login">Sign Out</Link>
        </Button>
        <Button className="bg-red-600 rounded-lg px-4 py-2" onClick={() => setIsDeleteModalOpen(true)}>
          Delete Account
        </Button>
      </div>
      {isDeleteModalOpen && (
        <Modal>
          <h2 className="text-xl font-bold">Delete your account?</h2>
          <p className="text-center">This action cannot be undone.</p>
          <div className="flex gap-4 mt-4">
            <Button
              className="bg-gray-300 px-4 py-2"
              onClick={() => setIsDeleteModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              className="bg-red-600 text-white px-4 py-2"
              onClick={handleDeleteAccount}
            >
              Delete
            </Button>
          </div>
        </Modal>
      )}
    </div>
  );
}
