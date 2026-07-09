// "use client";

// import { useState } from "react";
// import api from "@/lib/apiClient";

// export default function SecurityPage(){

//   const [currentPassword,setCurrentPassword] = useState("");
//   const [newPassword,setNewPassword] = useState("");

//   const handleSubmit = async (e)=>{

//     e.preventDefault();

//     try{

//       await api.put("/api/user/change-password",{
//         currentPassword,
//         newPassword
//       });

//       alert("Password updated");

//       setCurrentPassword("");
//       setNewPassword("");

//     }catch(err){

//       alert("Password change failed");

//     }

//   };

//   return(

//     <div style={{maxWidth:400,padding:40}}>

//       <h2>Security</h2>

//       <form onSubmit={handleSubmit}>

//         <div>
//           <label>Current Password</label>

//           <input
//             type="password"
//             value={currentPassword}
//             onChange={(e)=>setCurrentPassword(e.target.value)}
//           />
//         </div>

//         <div>
//           <label>New Password</label>

//           <input
//             type="password"
//             value={newPassword}
//             onChange={(e)=>setNewPassword(e.target.value)}
//           />
//         </div>

//         <button type="submit">
//           Change Password
//         </button>

//       </form>

//     </div>

//   );
// }







"use client";

import { useState } from "react";
import { HiOutlineLockClosed } from "react-icons/hi2";
import api from "@/lib/apiClient";

export default function SecurityPage() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await api.put("/api/user/change-password", {
        currentPassword,
        newPassword,
      });

      alert("Password updated");

      setCurrentPassword("");
      setNewPassword("");
    } catch (err) {
      alert("Password change failed");
    }
  };

  return (
    <main className="min-h-screen bg-[#f7f7f5] px-4 py-8 sm:px-6 lg:px-10">
      <div className="mx-auto max-w-5xl">
        <div className="mb-8">
          <p className="text-sm font-medium uppercase tracking-[0.25em] text-neutral-500">
            Account Settings
          </p>

          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-neutral-950 sm:text-4xl">
            Security
          </h1>

          <p className="mt-3 max-w-2xl text-sm leading-6 text-neutral-600 sm:text-base">
            Manage your password and keep your Trendz AeroX account protected.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1fr_380px]">
          <section className="rounded-3xl border border-neutral-200 bg-white shadow-[0_20px_60px_rgba(0,0,0,0.06)]">
            <div className="border-b border-neutral-100 px-6 py-6 sm:px-8">
              <h2 className="text-xl font-semibold text-neutral-950">
                Change Password
              </h2>

              <p className="mt-2 text-sm leading-6 text-neutral-500">
                Use a strong password that you have not used before.
              </p>
            </div>

            <form
              onSubmit={handleSubmit}
              className="space-y-6 px-6 py-7 sm:px-8"
            >
              <div>
                <label className="mb-2 block text-sm font-medium text-neutral-800">
                  Current Password
                </label>

                <input
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="Enter current password"
                  className="h-12 w-full rounded-2xl border border-neutral-200 bg-neutral-50 px-4 text-sm text-neutral-950 outline-none transition placeholder:text-neutral-400 focus:border-neutral-900 focus:bg-white focus:ring-4 focus:ring-neutral-900/10"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-neutral-800">
                  New Password
                </label>

                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Enter new password"
                  className="h-12 w-full rounded-2xl border border-neutral-200 bg-neutral-50 px-4 text-sm text-neutral-950 outline-none transition placeholder:text-neutral-400 focus:border-neutral-900 focus:bg-white focus:ring-4 focus:ring-neutral-900/10"
                />
              </div>

              <div className="rounded-2xl bg-neutral-50 p-4">
                <p className="text-sm font-medium text-neutral-800">
                  Password tips
                </p>

                <p className="mt-1 text-sm leading-6 text-neutral-500">
                  Choose a password with uppercase letters, lowercase letters,
                  numbers, and symbols for better protection.
                </p>
              </div>

              <button
                type="submit"
                className="h-12 w-full rounded-2xl bg-neutral-950 px-5 text-sm font-semibold text-white shadow-lg shadow-neutral-950/15 transition hover:bg-neutral-800 active:scale-[0.99]"
              >
                Change Password
              </button>
            </form>
          </section>

          <aside className="rounded-3xl border border-neutral-200 bg-neutral-950 p-6 text-white shadow-[0_20px_60px_rgba(0,0,0,0.12)] sm:p-8">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10">
              <HiOutlineLockClosed className="h-6 w-6 text-white" />
            </div>

            <h3 className="mt-6 text-xl font-semibold">
              Your account security matters
            </h3>

            <p className="mt-3 text-sm leading-6 text-neutral-300">
              Update your password regularly and never share your login details
              with anyone.
            </p>

            <div className="mt-8 space-y-4">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <p className="text-sm font-medium text-white">
                  Secure checkout
                </p>

                <p className="mt-1 text-sm text-neutral-400">
                  Your account helps protect orders, addresses, and wishlist.
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <p className="text-sm font-medium text-white">
                  Private by design
                </p>

                <p className="mt-1 text-sm text-neutral-400">
                  Keep your password unique and avoid reusing old passwords.
                </p>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}