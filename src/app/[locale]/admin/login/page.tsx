"use client";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";

export default function AdminLoginPage() {
  const router = useRouter();
  const pathname = usePathname();
  const locale = pathname.split("/")[1] || "en";
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showReset, setShowReset] = useState(false);
  const [phone, setPhone] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [resetError, setResetError] = useState("");
  const [resetSuccess, setResetSuccess] = useState("");
  const [phoneChecked, setPhoneChecked] = useState(false);

  const handleLogin = async () => {
    const res = await fetch(`/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });

    if (res.ok) {
      router.push(`/${locale}/admin/dashboard/`);
    } else {
      setError("Invalid credentials");
    }
  };

  const handleReset = async () => {
    setResetError("");
    setResetSuccess("");
    const res = await fetch(`/api/auth/reset-password`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ phone, newPassword }),
    });
    if (res.ok) {
      setResetSuccess("Password reset successfully!");
      setShowReset(false);
    } else {
      setResetError("Invalid phone number");
    }
  };

  const handleCheckPhone = async () => {
    setResetError("");
    setResetSuccess("");
    // Gửi request kiểm tra số điện thoại
    const res = await fetch(`/api/auth/check-phone`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ phone }),
    });
    if (res.ok) {
      setPhoneChecked(true);
    } else {
      setResetError("Số điện thoại không đúng");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-full max-w-md flex flex-col items-center">
        <div className="text-4xl font-bold">Admin Login</div>
        <div className="flex flex-col gap-5 mt-6">
          <label className="input validato bg-primary-2">
            <svg
              className="h-[1em] opacity-50"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
            >
              <g
                strokeLinejoin="round"
                strokeLinecap="round"
                strokeWidth="2.5"
                fill="none"
                stroke="currentColor"
              >
                <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path>
                <circle cx="12" cy="7" r="4"></circle>
              </g>
            </svg>
            <input
              type="text"
              required
              placeholder="Username"
              onChange={(e) => setUsername(e.target.value)}
              title="Only letters, numbers or dash"
            />
          </label>

          <label className="input validator bg-primary-2">
            <svg
              className="h-[1em] opacity-50"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
            >
              <g
                strokeLinejoin="round"
                strokeLinecap="round"
                strokeWidth="2.5"
                fill="none"
                stroke="currentColor"
              >
                <path d="M2.586 17.414A2 2 0 0 0 2 18.828V21a1 1 0 0 0 1 1h3a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h1a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h.172a2 2 0 0 0 1.414-.586l.814-.814a6.5 6.5 0 1 0-4-4z"></path>
                <circle cx="16.5" cy="7.5" r=".5" fill="currentColor"></circle>
              </g>
            </svg>
            <input
              type="password"
              required
              placeholder="Password"
              onChange={(e) => setPassword(e.target.value)}
              title="Must be more than 8 characters, including number, lowercase letter, uppercase letter"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleLogin();
                }
              }}
            />
          </label>
          {/* <p className="validator-hint hidden">
          Must be more than 8 characters, including
          <br />
          At least one number <br />
          At least one lowercase letter <br />
          At least one uppercase letter
        </p> */}

          <button
            onClick={handleLogin}
            className="btn btn-active btn-primary text-black"
          >
            Login
          </button>
          {error && <p style={{ color: "red" }}>{error}</p>}
          <button
            onClick={() => setShowReset(true)}
            className="text-blue-500 underline mt-2 cursor-pointer hover:text-blue-700"
            type="button"
          >
            Quên mật khẩu?
          </button>
          {showReset && (
            <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
              <div className="bg-primary-2 p-6 rounded shadow flex flex-col gap-3">
                <h2 className="font-bold text-lg">Đặt lại mật khẩu</h2>
                {!phoneChecked ? (
                  <>
                    <input
                      type="text"
                      placeholder="Số điện thoại"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="input input-bordered"
                    />
                    <div className="flex gap-2">
                      <button
                        onClick={handleCheckPhone}
                        className="btn btn-neutral"
                        type="button"
                      >
                        Kiểm tra số điện thoại
                      </button>
                      <button
                        onClick={() => setShowReset(false)}
                        className="btn"
                        type="button"
                      >
                        Hủy
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    <input
                      type="password"
                      placeholder="Mật khẩu mới"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="input input-bordered"
                    />
                    <div className="flex gap-2">
                      <button
                        onClick={handleReset}
                        className="btn btn-neutral"
                        type="button"
                      >
                        Đổi mật khẩu
                      </button>
                      <button
                        onClick={() => {
                          setShowReset(false);
                          setPhoneChecked(false);
                          setPhone("");
                          setNewPassword("");
                        }}
                        className="btn"
                        type="button"
                      >
                        Hủy
                      </button>
                    </div>
                  </>
                )}
                {resetError && <p className="text-red-500">{resetError}</p>}
                {resetSuccess && (
                  <p className="text-green-500">{resetSuccess}</p>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
