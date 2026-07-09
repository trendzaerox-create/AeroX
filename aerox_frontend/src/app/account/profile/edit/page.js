

// "use client";

// import { useEffect, useState } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { useRouter } from "next/navigation";

// import {
//   loadProfile,
//   updateUserProfile,
//   removeAccount
// } from "@/features/user/userSlice";

// export default function EditProfilePage(){

//   const dispatch = useDispatch();
//   const router = useRouter();

//   const { profile } = useSelector((state)=>state.user);

//   const [name,setName] = useState("");
//   const [phone,setPhone] = useState("");

//   useEffect(()=>{
//     dispatch(loadProfile());
//   },[dispatch]);

//   useEffect(()=>{

//     if(profile){
//       setName(profile.name || "");
//       setPhone(profile.phone || "");
//     }

//   },[profile]);

//   const handleSubmit = async (e)=>{

//     e.preventDefault();

//     await dispatch(updateUserProfile({
//       name,
//       phone
//     }));

//     alert("Profile updated");

//     router.push("/account/profile");

//   };

//   const handleDelete = ()=>{

//     if(confirm("Delete account permanently?")){
//       dispatch(removeAccount());
//       router.push("/");
//     }

//   };

//   if(!profile) return <p>Loading...</p>;

//   return(

//     <div style={{padding:40,maxWidth:500}}>

//       <h2>Edit Profile</h2>

//       <form onSubmit={handleSubmit}>

//         <div style={{marginBottom:10}}>
//           <label>Name</label>

//           <input
//             value={name}
//             onChange={(e)=>setName(e.target.value)}
//             style={{width:"100%"}}
//           />

//         </div>

//         <div style={{marginBottom:20}}>
//           <label>Phone</label>

//           <input
//             value={phone}
//             onChange={(e)=>setPhone(e.target.value)}
//             style={{width:"100%"}}
//           />

//         </div>

//         <button type="submit">
//           Update Profile
//         </button>

//       </form>

//       <hr style={{margin:"20px 0"}}/>

//       <button
//         onClick={handleDelete}
//         style={{color:"red"}}
//       >
//         Delete Account
//       </button>

//     </div>

//   );

// }



"use client";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import {
  HiOutlineUser,
  HiOutlinePhone,
  HiOutlineTrash,
  HiOutlineExclamationTriangle,
} from "react-icons/hi2";

import {
  loadProfile,
  updateUserProfile,
  removeAccount,
} from "@/features/user/userSlice";

export default function EditProfilePage() {
  const dispatch = useDispatch();
  const router = useRouter();

  const { profile } = useSelector((state) => state.user);

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");

  useEffect(() => {
    dispatch(loadProfile());
  }, [dispatch]);

  useEffect(() => {
    if (profile) {
      setName(profile.name || "");
      setPhone(profile.phone || "");
    }
  }, [profile]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    await dispatch(
      updateUserProfile({
        name,
        phone,
      })
    );

    alert("Profile updated");

    router.push("/account/profile");
  };

  const handleDelete = () => {
    if (confirm("Delete account permanently?")) {
      dispatch(removeAccount());
      router.push("/");
    }
  };

  if (!profile)
    return (
      <main className="min-h-screen bg-[#f7f7f5] px-4 py-10 sm:px-6 lg:px-10">
        <div className="mx-auto max-w-5xl">
          <div className="rounded-3xl border border-neutral-200 bg-white p-8 shadow-[0_20px_60px_rgba(0,0,0,0.06)]">
            <div className="h-5 w-40 animate-pulse rounded-full bg-neutral-200" />
            <div className="mt-4 h-10 w-64 animate-pulse rounded-full bg-neutral-200" />
            <div className="mt-8 space-y-4">
              <div className="h-12 animate-pulse rounded-2xl bg-neutral-100" />
              <div className="h-12 animate-pulse rounded-2xl bg-neutral-100" />
            </div>
          </div>
        </div>
      </main>
    );

  return (
    <main className="min-h-screen bg-[#f7f7f5] px-4 py-8 sm:px-6 lg:px-10">
      <div className="mx-auto max-w-5xl">
        <div className="mb-8">
          <p className="text-sm font-medium uppercase tracking-[0.25em] text-neutral-500">
            Account Settings
          </p>

          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-neutral-950 sm:text-4xl">
            Edit Profile
          </h1>

          <p className="mt-3 max-w-2xl text-sm leading-6 text-neutral-600 sm:text-base">
            Update your personal details and manage your Trendz AeroX account
            information.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1fr_380px]">
          <section className="rounded-3xl border border-neutral-200 bg-white shadow-[0_20px_60px_rgba(0,0,0,0.06)]">
            <div className="border-b border-neutral-100 px-6 py-6 sm:px-8">
              <h2 className="text-xl font-semibold text-neutral-950">
                Profile Information
              </h2>

              <p className="mt-2 text-sm leading-6 text-neutral-500">
                Keep your name and phone number updated for a smoother shopping
                experience.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6 px-6 py-7 sm:px-8">
              <div>
                <label className="mb-2 block text-sm font-medium text-neutral-800">
                  Name
                </label>

                <div className="relative">
                  <HiOutlineUser className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-neutral-400" />

                  <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your name"
                    className="h-12 w-full rounded-2xl border border-neutral-200 bg-neutral-50 pl-12 pr-4 text-sm text-neutral-950 outline-none transition placeholder:text-neutral-400 focus:border-neutral-900 focus:bg-white focus:ring-4 focus:ring-neutral-900/10"
                  />
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-neutral-800">
                  Phone
                </label>

                <div className="relative">
                  <HiOutlinePhone className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-neutral-400" />

                  <input
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="Enter your phone number"
                    className="h-12 w-full rounded-2xl border border-neutral-200 bg-neutral-50 pl-12 pr-4 text-sm text-neutral-950 outline-none transition placeholder:text-neutral-400 focus:border-neutral-900 focus:bg-white focus:ring-4 focus:ring-neutral-900/10"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="h-12 w-full rounded-2xl bg-neutral-950 px-5 text-sm font-semibold text-white shadow-lg shadow-neutral-950/15 transition hover:bg-neutral-800 active:scale-[0.99]"
              >
                Update Profile
              </button>
            </form>
          </section>

          <aside className="space-y-6">
            <div className="rounded-3xl border border-neutral-200 bg-neutral-950 p-6 text-white shadow-[0_20px_60px_rgba(0,0,0,0.12)] sm:p-8">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10">
                <HiOutlineUser className="h-6 w-6 text-white" />
              </div>

              <h3 className="mt-6 text-xl font-semibold">
                Your personal details
              </h3>

              <p className="mt-3 text-sm leading-6 text-neutral-300">
                Your profile information helps us identify your account and
                improve your order experience.
              </p>

              <div className="mt-8 rounded-2xl border border-white/10 bg-white/5 p-4">
                <p className="text-sm font-medium text-white">
                  Account connected
                </p>

                <p className="mt-1 break-all text-sm text-neutral-400">
                  {profile.email || "Email not available"}
                </p>
              </div>
            </div>

            <div className="rounded-3xl border border-red-100 bg-white p-6 shadow-[0_20px_60px_rgba(0,0,0,0.05)] sm:p-8">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-red-50">
                <HiOutlineExclamationTriangle className="h-6 w-6 text-red-600" />
              </div>

              <h3 className="mt-5 text-lg font-semibold text-neutral-950">
                Danger Zone
              </h3>

              <p className="mt-2 text-sm leading-6 text-neutral-500">
                Deleting your account is permanent. This action cannot be
                undone.
              </p>

              <button
                onClick={handleDelete}
                className="mt-6 flex h-12 w-full items-center justify-center gap-2 rounded-2xl border border-red-200 bg-red-50 px-5 text-sm font-semibold text-red-600 transition hover:border-red-300 hover:bg-red-100 active:scale-[0.99]"
              >
                <HiOutlineTrash className="h-5 w-5" />
                Delete Account
              </button>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}