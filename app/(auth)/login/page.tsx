// "use client";

// import { useRouter } from "next/navigation";
// import React, { useState } from "react";
// // import { useAuthStore } from "../store/authStore";
// // import { useNavigate } from "react-router-dom";

// const LoginPage = () => {
//   //   const navigate = useNavigate();
//   // const login = useAuthStore((state) => state.login);

//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [loading, setLoading] = useState(false);
//   // const [remember, setRemember] = useState(false);

//   const login = () => {};

//   const router = useRouter();

//   const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
//     e.preventDefault();
//     setLoading(true);

//     try {
//       await router.push("/dashboard");
//     } catch (err) {
//       console.error(err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
//   //   e.preventDefault();
//   //   setLoading(true);

//   //     router.push("/dashboard");
//   //   //   const success = await login(email, password);
//   //   //   setLoading(false);

//   //   //   if (success) {
//   //   //     navigate("/dashboard");
//   //   //   }
//   //   //   else {
//   //   //     alert("Invalid credentials, please try again.");
//   //   //   }
//   // };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
//       <div className="w-full max-w-4xl bg-white shadow-lg rounded-2xl overflow-hidden grid md:grid-cols-2">
//         {/* Left side (image / decoration) */}
//         <div className="hidden md:block bg-gradient-to-br from-blue-500 to-purple-600">
//           {/* You can place an image here if you want */}
//         </div>

//         {/* Right side (form) */}
//         <div className="p-8 md:p-12 flex flex-col justify-center">
//           <h1 className="text-2xl font-bold text-gray-800 mb-2">
//             <span className="flex items-center space-x-2">
//               {/* <img
//                 src="/images/logo.png"
//                 alt="Logo"
//                 className="w-15 h-20 object-contain"
//               /> */}
//               <span className="text-black">SAFF ENTERPSISES</span>
//             </span>
//           </h1>
//           <p className="text-gray-500 mb-6">
//             Welcome back! Log in to your account.
//           </p>

//           <form onSubmit={handleSubmit} className="space-y-5">
//             {/* Email */}
//             <div>
//               <label
//                 htmlFor="userEmail"
//                 className="block text-sm font-medium text-gray-700 mb-1"
//               >
//                 Email address
//               </label>
//               <input
//                 type="email"
//                 id="userEmail"
//                 placeholder="Email"
//                 className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//                 value={email}
//                 onChange={(e) => setEmail(e.target.value)}
//               />
//             </div>

//             {/* Password */}
//             <div>
//               <label
//                 htmlFor="userPassword"
//                 className="block text-sm font-medium text-gray-700 mb-1"
//               >
//                 Password
//               </label>
//               <input
//                 type="password"
//                 id="userPassword"
//                 placeholder="Password"
//                 className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//                 value={password}
//                 onChange={(e) => setPassword(e.target.value)}
//               />
//             </div>

//             {/* Remember Me */}
//             {/* <div className="flex items-center">
//               <input
//                 type="checkbox"
//                 id="authCheck"
//                 className="h-4 w-4 text-blue-600 border-gray-300 rounded"
//                 checked={remember}
//                 onChange={(e) => setRemember(e.target.checked)}
//               />
//               <label
//                 htmlFor="authCheck"
//                 className="ml-2 block text-sm text-gray-600"
//               >
//                 Remember me
//               </label>
//             </div> */}

//             {/* Buttons */}
//             <button
//               type="submit"
//               disabled={loading}
//               className="w-full sm:w-auto px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
//             >
//               {loading ? "Logging in..." : "Login"}
//             </button>
//           </form>
//         </div>
//       </div>
//     </div>
//   );
// };
// export default React.memo(LoginPage);
"use client";

import { useLogin } from "@/app/hooks/authHook/useAuth";
import BrandLogo, { BrandTitle } from "@/app/utilsComponents/BrandLogo";
import { BRAND } from "@/app/config/brand";
import { Eye, EyeOff } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const router = useRouter();
  const { mutate: login, isPending: loading } = useLogin();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMsg("");

    login(
      { email, password },
      {
        onSuccess: () => {
          router.push("/dashboard");
        },
        onError: (error: any) => {
          setErrorMsg(
            error?.response?.data?.message ||
              "Invalid credentials, please try again."
          );
        },
      }
    );
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-4xl bg-white shadow-lg rounded-2xl overflow-hidden grid md:grid-cols-2">
        {/* Left side (image / decoration) */}
        <div
          className="hidden md:flex flex-col items-center justify-center p-10 text-white"
          style={{ background: `linear-gradient(135deg, ${BRAND.primary}, ${BRAND.accent})` }}
        >
          <BrandLogo variant="onDark" className="mb-4" />
          <BrandTitle size="lg" light className="mb-1" />
          <p className="text-sm font-semibold text-white/85 tracking-wide">
            {BRAND.tagline}
          </p>
        </div>

        {/* Right side (form) */}
        <div className="p-8 md:p-12 flex flex-col justify-center">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="mb-2 flex flex-col items-center text-center">
              <BrandLogo variant="default" width={280} />
              <p className="mt-3 text-sm text-gray-500">
                Welcome back! Log in to your account.
              </p>
            </div>

            {/* Email */}
            <div>
              <label
                htmlFor="userEmail"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Email address
              </label>
              <input
                type="email"
                id="userEmail"
                placeholder="Email"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            {/* Password */}
            <div>
              <label
                htmlFor="userPassword"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Password
              </label>

              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  id="userPassword"
                  placeholder="Password"
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 pr-10"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-3 flex items-center text-gray-500"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>
            {/* <div>
              <label
                htmlFor="userPassword"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Password
              </label>
              <input
                type="password"
                id="userPassword"
                placeholder="Password"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div> */}

            {/* Error Message */}
            {errorMsg && <p className="text-sm text-red-500">{errorMsg}</p>}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full sm:w-auto px-6 py-2 text-white rounded-lg transition disabled:opacity-50 hover:opacity-90"
              style={{ backgroundColor: BRAND.primary }}
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default React.memo(LoginPage);
