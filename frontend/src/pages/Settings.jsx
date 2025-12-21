import React, { useEffect, useMemo, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useGetUsersPage, useUpdateUser } from "../api/users.api";
import Toast from "../components/ui/Toast";

const Settings = () => {
  const { user } = useAuth();
  const emailFromAuth = user?.email || "";

  const { data: usersPage, isLoading } = useGetUsersPage(emailFromAuth, 0, 1);
  const { mutateAsync: updateUser, isPending } = useUpdateUser();

  const matchedUser = useMemo(() => {
    const list = usersPage?.content || [];
    if (!emailFromAuth) return list[0];
    return list.find((u) => u.email?.toLowerCase() === emailFromAuth.toLowerCase()) || list[0];
  }, [usersPage, emailFromAuth]);

  const [form, setForm] = useState({ email: emailFromAuth, password: "", confirm: "" });
  const [toast, setToast] = useState(null);

  useEffect(() => {
    if (matchedUser?.email) {
      setForm((prev) => ({ ...prev, email: matchedUser.email }));
    }
  }, [matchedUser]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!matchedUser?.id) {
      setToast({ message: "Unable to load user record.", type: "error" });
      return;
    }

    if (!form.password || !form.confirm) {
      setToast({ message: "Please enter and confirm a new password.", type: "error" });
      return;
    }

    if (form.password.length < 6) {
      setToast({ message: "Password must be at least 6 characters.", type: "error" });
      return;
    }

    if (form.password !== form.confirm) {
      setToast({ message: "Passwords do not match.", type: "error" });
      return;
    }

    try {
      await updateUser({
        userId: matchedUser.id,
        payload: { email: matchedUser.email, rawPassword: form.password },
      });
      setToast({ message: "Settings updated successfully.", type: "success" });
      setForm((prev) => ({ ...prev, password: "", confirm: "" }));
    } catch (err) {
      const message = err?.response?.data?.message || "Failed to update settings.";
      setToast({ message, type: "error" });
    }
  };

  return (
    <div className="space-y-6">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      <div>
        <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
        <p className="text-sm text-muted-foreground mt-1">Manage your account details.</p>
      </div>

      <div className="bg-card border border-border rounded-lg shadow-sm p-6 max-w-2xl">
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <label className="text-sm font-medium">Email</label>
            <input
              type="email"
              value={form.email}
              className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-1 focus:ring-primary"
              disabled
              readOnly
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">New Password</label>
              <input
                type="password"
                value={form.password}
                onChange={(e) => setForm((prev) => ({ ...prev, password: e.target.value }))}
                className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                disabled={isLoading || isPending}
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Confirm Password</label>
              <input
                type="password"
                value={form.confirm}
                onChange={(e) => setForm((prev) => ({ ...prev, confirm: e.target.value }))}
                className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                disabled={isLoading || isPending}
                required
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => setForm({ email: matchedUser?.email || emailFromAuth, password: "", confirm: "" })}
              className="px-4 py-2 rounded-md border border-input bg-background hover:bg-muted text-sm font-medium"
              disabled={isLoading || isPending}
            >
              Reset
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-md bg-accent hover:bg-accent/90 text-white text-sm font-medium shadow-sm"
              disabled={isLoading || isPending}
            >
              {isPending ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Settings;
