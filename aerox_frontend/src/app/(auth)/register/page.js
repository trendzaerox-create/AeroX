


// "use client";

// import { useState } from "react";
// import { useDispatch } from "react-redux";
// import { register } from "../../../features/auth/authSlice";
// import { useRouter } from "next/navigation";

// export default function RegisterPage() {

//   const dispatch = useDispatch();
//   const router = useRouter();

//   const [form, setForm] = useState({
//     name: "",
//     email: "",
//     phone: "",
//     password: ""
//   });

//   const [loading, setLoading] = useState(false);

//   const handleChange = (e) => {

//     const { name, value } = e.target;

//     setForm({
//       ...form,
//       [name]: value
//     });

//   };

//   const handleSubmit = async (e) => {

//     e.preventDefault();

//     try {

//       setLoading(true);

//       await dispatch(register(form)).unwrap();

//       alert("Registration successful!");

//       router.push("/login");

//     } catch (error) {

//       alert(error || "Registration failed"); // ✅ CHANGE

//     } finally {

//       setLoading(false);

//     }

//   };

//   return (

//     <div style={{
//       maxWidth: "420px",
//       margin: "auto",
//       padding: "40px"
//     }}>

//       <h2>Create Account</h2>

//       <form onSubmit={handleSubmit}>

//         <div>
//           <label>Name</label>

//           <input
//             name="name"
//             value={form.name}
//             onChange={handleChange}
//             placeholder="Full name"
//             required
//           />
//         </div>

//         <div>
//           <label>Email</label>

//           <input
//             name="email"
//             type="email"
//             value={form.email}
//             onChange={handleChange}
//             placeholder="Email address"
//             required
//           />
//         </div>

//         <div>
//           <label>Phone</label>

//           <input
//             name="phone"
//             pattern="[0-9]{10}" // ✅ CHANGE
//             maxLength="10" // ✅ CHANGE
//             value={form.phone}
//             onChange={handleChange}
//             placeholder="10 digit phone"
//             required
//           />
//         </div>

//         <div>
//           <label>Password</label>

//           <input
//             name="password"
//             type="password"
//             value={form.password}
//             onChange={handleChange}
//             placeholder="Password"
//             required
//           />
//         </div>

//         <button
//           type="submit"
//           disabled={loading}
//         >
//           {loading ? "Creating..." : "Register"}
//         </button>

//       </form>

//       <p style={{marginTop:"20px"}}>
//         Already have an account? <a href="/login">Login</a>
//       </p>

//     </div>

//   );
// }
























"use client";

import { useState } from "react";
import { useDispatch } from "react-redux";
import { register } from "../../../features/auth/authSlice";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function RegisterPage() {
  const dispatch = useDispatch();
  const router = useRouter();

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "phone") {
      const onlyNumbers = value.replace(/\D/g, "").slice(0, 10);

      setForm((prev) => ({
        ...prev,
        phone: onlyNumbers,
      }));

      return;
    }

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      await dispatch(register(form)).unwrap();

      alert("Registration successful!");
      router.push("/login");
    } catch (error) {
      alert(error || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="register-page">
      <div className="bg-blur bg-blur-one" />
      <div className="bg-blur bg-blur-two" />

      <section className="register-card">
        <div className="visual-side">
          <div className="visual-overlay" />

          <div className="brand-box">
            <span className="brand-tag">TRENDZ AEROX</span>

            <h1>
              Premium tech
              <br />
              starts here.
            </h1>

            <p>
              Create your account and explore smartwatches, wireless earbuds,
              and modern electronics designed for everyday lifestyle.
            </p>

            <div className="feature-row">
              <span>Wireless Earbuds</span>
              <span>Smart Watches</span>
              <span>Fast Checkout</span>
            </div>
          </div>

          <div className="floating-product product-one">
            <span>40H</span>
            <small>Battery</small>
          </div>

          <div className="floating-product product-two">
            <span>IPX</span>
            <small>Protection</small>
          </div>
        </div>

        <div className="form-side">
          <div className="form-header">
            <span className="mini-label">Start your journey</span>
            <h2>Create Account</h2>
            <p>Join Trendz AeroX and shop premium electronics with confidence.</p>
          </div>

          <form onSubmit={handleSubmit} className="register-form">
            <div className="input-group">
              <label>Name</label>

              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Full name"
                autoComplete="name"
                required
              />
            </div>

            <div className="input-group">
              <label>Email</label>

              <input
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                placeholder="Email address"
                autoComplete="email"
                required
              />
            </div>

            <div className="input-group">
              <label>Phone</label>

              <input
                name="phone"
                type="tel"
                inputMode="numeric"
                pattern="[0-9]{10}"
                maxLength="10"
                value={form.phone}
                onChange={handleChange}
                placeholder="10 digit phone"
                autoComplete="tel"
                required
              />
            </div>

            <div className="input-group">
              <label>Password</label>

              <div className="password-box">
                <input
                  name="password"
                  type={showPassword ? "text" : "password"}
                  value={form.password}
                  onChange={handleChange}
                  placeholder="Password"
                  autoComplete="new-password"
                  required
                />

                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="show-btn"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  title={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M3 3L21 21"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M10.58 10.58C10.22 10.94 10 11.44 10 12C10 13.1 10.9 14 12 14C12.56 14 13.06 13.78 13.42 13.42"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M9.88 5.09C10.57 5.03 11.28 5 12 5C16.5 5 20.3 7.61 22 12C21.55 13.16 20.88 14.21 20.04 15.08"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M6.61 6.61C4.61 7.74 3.02 9.6 2 12C3.7 16.39 7.5 19 12 19C13.55 19 15.01 18.69 16.3 18.12"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  ) : (
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M2 12C3.7 7.61 7.5 5 12 5C16.5 5 20.3 7.61 22 12C20.3 16.39 16.5 19 12 19C7.5 19 3.7 16.39 2 12Z"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M12 15C13.66 15 15 13.66 15 12C15 10.34 13.66 9 12 9C10.34 9 9 10.34 9 12C9 13.66 10.34 15 12 15Z"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            <button type="submit" disabled={loading} className="submit-btn">
              <span>{loading ? "Creating Account..." : "Register"}</span>
            </button>
          </form>

          <p className="login-text">
            Already have an account? <Link href="/login">Login</Link>
          </p>
        </div>
      </section>

      <style jsx global>{`
        html,
        body {
          height: 100%;
          overflow: hidden;
        }
      `}</style>

      <style jsx>{`
        .register-page {
          width: 100%;
          height: 100dvh;
          max-height: 100dvh;
          position: relative;
          overflow: hidden;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 18px;
          background:
            radial-gradient(
              circle at top left,
              rgba(255, 255, 255, 0.16),
              transparent 34%
            ),
            linear-gradient(135deg, #050505 0%, #1a1a1a 42%, #eeeeee 100%);
          font-family:
            Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont,
            "Segoe UI", sans-serif;
        }

        .bg-blur {
          position: absolute;
          border-radius: 999px;
          filter: blur(70px);
          opacity: 0.35;
          animation: pulseGlow 6s ease-in-out infinite alternate;
          pointer-events: none;
        }

        .bg-blur-one {
          width: 230px;
          height: 230px;
          background: #ffffff;
          top: 4%;
          left: 8%;
        }

        .bg-blur-two {
          width: 290px;
          height: 290px;
          background: #6f6f6f;
          right: 7%;
          bottom: 4%;
          animation-delay: 1.5s;
        }

        .register-card {
          width: min(100%, 1020px);
          height: min(620px, calc(100dvh - 36px));
          max-height: calc(100dvh - 36px);
          position: relative;
          z-index: 2;
          display: grid;
          grid-template-columns: 1.04fr 0.96fr;
          border: 1px solid rgba(255, 255, 255, 0.22);
          border-radius: 32px;
          overflow: hidden;
          background: rgba(255, 255, 255, 0.78);
          box-shadow:
            0 35px 90px rgba(0, 0, 0, 0.35),
            inset 0 1px 0 rgba(255, 255, 255, 0.8);
          backdrop-filter: blur(22px);
          animation: cardEnter 0.9s ease forwards;
        }

        .visual-side {
          position: relative;
          height: 100%;
          overflow: hidden;
          background-image:
            linear-gradient(
              135deg,
              rgba(0, 0, 0, 0.82),
              rgba(0, 0, 0, 0.48)
            ),
            url("/images/auth/aerox-register.jpg");
          background-size: cover;
          background-position: center;
          display: flex;
          align-items: flex-end;
          padding: 38px;
        }

        .visual-side::before {
          content: "";
          position: absolute;
          inset: 0;
          background:
            radial-gradient(
              circle at 30% 20%,
              rgba(255, 255, 255, 0.18),
              transparent 28%
            ),
            linear-gradient(120deg, rgba(255, 255, 255, 0.08), transparent 45%);
          z-index: 1;
        }

        .visual-side::after {
          content: "";
          position: absolute;
          inset: -40%;
          background: linear-gradient(
            115deg,
            transparent 35%,
            rgba(255, 255, 255, 0.2) 48%,
            transparent 58%
          );
          transform: translateX(-45%);
          animation: shineMove 5s ease-in-out infinite;
          z-index: 2;
        }

        .visual-overlay {
          position: absolute;
          inset: 0;
          background:
            linear-gradient(to top, rgba(0, 0, 0, 0.82), transparent 58%),
            linear-gradient(to right, rgba(0, 0, 0, 0.65), transparent);
          z-index: 2;
        }

        .brand-box {
          position: relative;
          z-index: 4;
          color: #ffffff;
          max-width: 430px;
          animation: fadeUp 0.9s ease 0.25s both;
        }

        .brand-tag {
          display: inline-flex;
          align-items: center;
          width: fit-content;
          padding: 8px 14px;
          margin-bottom: 16px;
          border: 1px solid rgba(255, 255, 255, 0.32);
          border-radius: 999px;
          background: rgba(255, 255, 255, 0.12);
          backdrop-filter: blur(12px);
          color: #f4f4f4;
          font-size: 11px;
          font-weight: 800;
          letter-spacing: 2px;
        }

        .brand-box h1 {
          margin: 0;
          color: #ffffff;
          font-size: clamp(32px, 3.8vw, 50px);
          line-height: 0.98;
          letter-spacing: -2px;
          font-weight: 900;
        }

        .brand-box p {
          margin: 16px 0 0;
          color: rgba(255, 255, 255, 0.78);
          font-size: 14px;
          line-height: 1.65;
        }

        .feature-row {
          display: flex;
          flex-wrap: wrap;
          gap: 9px;
          margin-top: 22px;
        }

        .feature-row span {
          padding: 8px 12px;
          border-radius: 999px;
          background: rgba(255, 255, 255, 0.14);
          border: 1px solid rgba(255, 255, 255, 0.18);
          color: #ffffff;
          font-size: 11px;
          font-weight: 700;
          backdrop-filter: blur(10px);
        }

        .floating-product {
          position: absolute;
          z-index: 5;
          width: 82px;
          height: 82px;
          border-radius: 24px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          background: rgba(255, 255, 255, 0.16);
          border: 1px solid rgba(255, 255, 255, 0.26);
          backdrop-filter: blur(18px);
          color: #ffffff;
          box-shadow: 0 18px 45px rgba(0, 0, 0, 0.28);
          animation: floatCard 4.5s ease-in-out infinite;
        }

        .floating-product span {
          font-size: 21px;
          font-weight: 900;
          letter-spacing: -0.5px;
        }

        .floating-product small {
          margin-top: 3px;
          font-size: 11px;
          font-weight: 700;
          color: rgba(255, 255, 255, 0.72);
        }

        .product-one {
          top: 32px;
          right: 32px;
        }

        .product-two {
          top: 132px;
          right: 108px;
          animation-delay: 1.2s;
        }

        .form-side {
          height: 100%;
          min-height: 0;
          padding: 38px 42px;
          display: flex;
          flex-direction: column;
          justify-content: center;
          overflow: hidden;
          background:
            radial-gradient(
              circle at top right,
              rgba(0, 0, 0, 0.06),
              transparent 34%
            ),
            linear-gradient(180deg, #ffffff 0%, #f4f4f4 100%);
        }

        .form-header {
          animation: fadeUp 0.8s ease 0.35s both;
        }

        .mini-label {
          color: #646464;
          font-size: 11px;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 1.8px;
        }

        .form-header h2 {
          margin: 8px 0 7px;
          color: #080808;
          font-size: 34px;
          line-height: 1.05;
          letter-spacing: -1.3px;
          font-weight: 900;
        }

        .form-header p {
          margin: 0;
          color: #696969;
          font-size: 13px;
          line-height: 1.5;
        }

        .register-form {
          margin-top: 24px;
          display: flex;
          flex-direction: column;
          gap: 13px;
          animation: fadeUp 0.8s ease 0.48s both;
        }

        .input-group {
          display: flex;
          flex-direction: column;
          gap: 7px;
        }

        .input-group label {
          color: #191919;
          font-size: 12px;
          font-weight: 800;
        }

        .input-group input {
          width: 100%;
          height: 47px;
          border: 1px solid #d5d5d5;
          border-radius: 15px;
          outline: none;
          padding: 0 15px;
          background: #ffffff;
          color: #111111;
          font-size: 14px;
          font-weight: 600;
          transition:
            border-color 0.25s ease,
            box-shadow 0.25s ease,
            transform 0.25s ease,
            background 0.25s ease;
        }

        .input-group input::placeholder {
          color: #9a9a9a;
          font-weight: 500;
        }

        .input-group input:focus {
          border-color: #111111;
          background: #fbfbfb;
          box-shadow: 0 12px 30px rgba(0, 0, 0, 0.08);
          transform: translateY(-1px);
        }

        .password-box {
          position: relative;
        }

        .password-box input {
          padding-right: 56px;
        }

        .show-btn {
          position: absolute;
          top: 50%;
          right: 9px;
          transform: translateY(-50%);
          width: 34px;
          height: 34px;
          border: none;
          border-radius: 12px;
          padding: 0;
          background: #111111;
          color: #ffffff;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition:
            background 0.25s ease,
            transform 0.25s ease,
            box-shadow 0.25s ease;
        }

        .show-btn:hover {
          background: #3a3a3a;
          transform: translateY(-50%) scale(1.05);
          box-shadow: 0 8px 18px rgba(0, 0, 0, 0.22);
        }

        .show-btn:focus-visible {
          outline: 2px solid #111111;
          outline-offset: 3px;
        }

        .show-btn svg {
          display: block;
          flex-shrink: 0;
        }

        .submit-btn {
          position: relative;
          height: 50px;
          margin-top: 4px;
          border: none;
          border-radius: 16px;
          overflow: hidden;
          background: #070707;
          color: #ffffff;
          cursor: pointer;
          font-size: 15px;
          font-weight: 900;
          letter-spacing: 0.2px;
          box-shadow: 0 18px 36px rgba(0, 0, 0, 0.24);
          transition:
            transform 0.25s ease,
            box-shadow 0.25s ease,
            opacity 0.25s ease;
        }

        .submit-btn::before {
          content: "";
          position: absolute;
          inset: 0;
          background: linear-gradient(
            115deg,
            transparent 0%,
            rgba(255, 255, 255, 0.24) 45%,
            transparent 75%
          );
          transform: translateX(-100%);
          transition: transform 0.7s ease;
        }

        .submit-btn:hover::before {
          transform: translateX(100%);
        }

        .submit-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 24px 44px rgba(0, 0, 0, 0.3);
        }

        .submit-btn:disabled {
          opacity: 0.72;
          cursor: not-allowed;
          transform: none;
        }

        .submit-btn span {
          position: relative;
          z-index: 2;
        }

        .login-text {
          margin: 18px 0 0;
          color: #666666;
          text-align: center;
          font-size: 14px;
          font-weight: 600;
          animation: fadeUp 0.8s ease 0.58s both;
        }

        .login-text :global(a) {
          color: #080808;
          font-weight: 900;
          text-decoration: none;
          border-bottom: 1px solid #080808;
          transition: color 0.25s ease;
        }

        .login-text :global(a:hover) {
          color: #666666;
        }

        @keyframes cardEnter {
          from {
            opacity: 0;
            transform: translateY(22px) scale(0.98);
          }

          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        @keyframes fadeUp {
          from {
            opacity: 0;
            transform: translateY(16px);
          }

          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes floatCard {
          0%,
          100% {
            transform: translateY(0);
          }

          50% {
            transform: translateY(-12px);
          }
        }

        @keyframes shineMove {
          0%,
          45% {
            transform: translateX(-55%) rotate(8deg);
          }

          75%,
          100% {
            transform: translateX(55%) rotate(8deg);
          }
        }

        @keyframes pulseGlow {
          from {
            transform: scale(1);
            opacity: 0.22;
          }

          to {
            transform: scale(1.12);
            opacity: 0.42;
          }
        }

        @media (max-width: 900px) {
          .register-page {
            padding: 12px;
          }

          .register-card {
            width: min(100%, 520px);
            height: calc(100dvh - 24px);
            max-height: calc(100dvh - 24px);
            grid-template-columns: 1fr;
            grid-template-rows: 0.72fr 1.28fr;
            border-radius: 26px;
          }

          .visual-side {
            min-height: 0;
            padding: 24px;
          }

          .brand-tag {
            margin-bottom: 10px;
            padding: 7px 12px;
            font-size: 10px;
          }

          .brand-box h1 {
            font-size: 28px;
            letter-spacing: -1.2px;
          }

          .brand-box p {
            margin-top: 10px;
            font-size: 12px;
            line-height: 1.45;
          }

          .feature-row {
            margin-top: 14px;
            gap: 7px;
          }

          .feature-row span {
            font-size: 10px;
            padding: 7px 9px;
          }

          .form-side {
            padding: 24px 24px 22px;
          }

          .form-header h2 {
            font-size: 29px;
          }

          .form-header p {
            font-size: 12px;
          }

          .register-form {
            margin-top: 18px;
            gap: 10px;
          }

          .input-group {
            gap: 5px;
          }

          .input-group input {
            height: 43px;
            border-radius: 13px;
          }

          .show-btn {
            width: 32px;
            height: 32px;
            border-radius: 11px;
          }

          .submit-btn {
            height: 47px;
          }

          .login-text {
            margin-top: 13px;
            font-size: 13px;
          }

          .product-one {
            width: 68px;
            height: 68px;
            border-radius: 20px;
            top: 18px;
            right: 18px;
          }

          .product-one span {
            font-size: 17px;
          }

          .product-one small {
            font-size: 10px;
          }

          .product-two {
            display: none;
          }
        }

        @media (max-width: 480px) {
          .register-page {
            padding: 10px;
          }

          .register-card {
            height: calc(100dvh - 20px);
            max-height: calc(100dvh - 20px);
            grid-template-rows: 0.62fr 1.38fr;
            border-radius: 23px;
          }

          .visual-side {
            padding: 20px;
          }

          .brand-box h1 {
            font-size: 25px;
          }

          .brand-box p {
            font-size: 11px;
          }

          .feature-row span {
            font-size: 9.5px;
            padding: 6px 8px;
          }

          .form-side {
            padding: 20px 18px 18px;
          }

          .mini-label {
            font-size: 10px;
          }

          .form-header h2 {
            font-size: 27px;
          }

          .register-form {
            margin-top: 15px;
            gap: 9px;
          }

          .input-group label {
            font-size: 11px;
          }

          .input-group input {
            height: 41px;
            font-size: 13px;
          }

          .show-btn {
            width: 30px;
            height: 30px;
            border-radius: 10px;
          }

          .show-btn svg {
            width: 17px;
            height: 17px;
          }

          .submit-btn {
            height: 44px;
            font-size: 14px;
          }

          .login-text {
            font-size: 12px;
          }
        }

        @media (max-height: 720px) and (min-width: 901px) {
          .register-card {
            height: calc(100dvh - 28px);
            max-height: calc(100dvh - 28px);
          }

          .visual-side {
            padding: 30px;
          }

          .brand-box h1 {
            font-size: 40px;
          }

          .brand-box p {
            font-size: 13px;
            line-height: 1.45;
          }

          .feature-row {
            margin-top: 16px;
          }

          .form-side {
            padding: 28px 38px;
          }

          .form-header h2 {
            font-size: 30px;
          }

          .register-form {
            margin-top: 18px;
            gap: 10px;
          }

          .input-group {
            gap: 5px;
          }

          .input-group input {
            height: 42px;
          }

          .show-btn {
            width: 31px;
            height: 31px;
          }

          .submit-btn {
            height: 45px;
          }

          .login-text {
            margin-top: 12px;
          }
        }
      `}</style>
    </main>
  );
}