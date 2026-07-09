


"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import {
  FaLinkedinIn,
  FaGithub,
  FaEnvelope,
  FaPhoneAlt,
  FaMapMarkerAlt,
  FaArrowLeft,
} from "react-icons/fa";

export default function AboutAuthor() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    setShow(true);
  }, []);

  const skills = [
    "Java",
    "Spring Boot",
    "Next.js",
    "React.js",
    "React Native",
    "Node.js",
    "Express.js",
    "PostgreSQL",
    "MongoDB",
    "MySQL",
    "JWT Authentication",
    "Redux Toolkit",
    "Docker",
    "CI/CD",
    "Git & GitHub",
    "REST APIs",
    "AI Chatbots",
    "n8n Automation",
    "Vercel",
    "Render",
  ];

  return (
    <section className="relative min-h-screen bg-black text-white overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-0 left-0 w-60 h-60 md:w-72 md:h-72 bg-blue-500/20 blur-3xl rounded-full"></div>

      <div className="absolute bottom-0 right-0 w-60 h-60 md:w-72 md:h-72 bg-cyan-500/20 blur-3xl rounded-full"></div>

      {/* Back Button Top Left Mobile */}
      <div className="absolute top-5 left-5 z-30">
        <Link href="/">
          <button className="flex items-center gap-2 px-4 py-2 md:px-6 md:py-3 rounded-xl border border-blue-500/40 bg-blue-500/10 hover:bg-blue-500 hover:text-black transition duration-300 font-medium text-sm md:text-base">
            <FaArrowLeft />
            Back Home
          </button>
        </Link>
      </div>

      <div className="relative z-10 container mx-auto px-4 sm:px-6 py-24 md:py-16 flex items-center justify-center min-h-screen">
        <div
          className={`w-full max-w-6xl transition-all duration-1000 ${
            show
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-10"
          }`}
        >
          <div className="grid lg:grid-cols-2 gap-10 lg:gap-14 items-center">
            {/* LEFT SIDE */}
            <div className="text-center lg:text-left">
              {/* Intro */}
              <p className="uppercase tracking-[3px] md:tracking-[4px] text-blue-400 text-xs sm:text-sm mb-4">
                Full Stack Developer
              </p>

              {/* Name */}
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold leading-tight">
                Md. Nouman <br />

                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">
                  Molla
                </span>
              </h1>

              {/* Qualification */}
              <p className="mt-4 text-base md:text-lg text-gray-400">
                B.Tech, MS (Computer)
              </p>

              {/* Description */}
              <p className="mt-6 md:mt-8 text-gray-300 text-sm sm:text-base md:text-lg leading-relaxed max-w-2xl mx-auto lg:mx-0">
                Passionate Full Stack Software Developer specializing in
                modern web and mobile application development. Skilled in
                building scalable, secure, and production-ready platforms
                with clean architecture, high performance, and modern UI/UX.
                Focused on delivering business-driven solutions that create
                real impact for startups, companies, and clients worldwide.
              </p>

              {/* Social Icons */}
              <div className="flex gap-4 mt-8 md:mt-10 justify-center lg:justify-start">
                {/* LinkedIn */}
                <a
                  href="https://www.linkedin.com/in/md-nouman-molla-5644271b4/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-11 h-11 md:w-12 md:h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-blue-500 transition duration-300 text-lg md:text-xl"
                >
                  <FaLinkedinIn />
                </a>

                {/* GitHub */}
                <a
                  href="https://github.com/noumanmolla12"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-11 h-11 md:w-12 md:h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-blue-500 transition duration-300 text-lg md:text-xl"
                >
                  <FaGithub />
                </a>
              </div>
            </div>

            {/* RIGHT SIDE CARD */}
            <div className="relative">
              <div className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-2xl p-5 sm:p-6 md:p-8 shadow-2xl">
                {/* Top Section */}
                <div className="flex items-center gap-4 sm:gap-5">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-r from-blue-500 to-cyan-400 flex items-center justify-center text-2xl sm:text-3xl font-bold shadow-lg shrink-0">
                    NM
                  </div>

                  <div>
                    <h2 className="text-xl sm:text-2xl font-bold">
                      Software Engineer
                    </h2>

                    <p className="text-gray-400 mt-1 text-sm sm:text-base">
                      Full Stack & Mobile App Developer
                    </p>
                  </div>
                </div>

                {/* Divider */}
                <div className="w-full h-px bg-white/10 my-6 md:my-8"></div>

                {/* Skills */}
                <div>
                  <h3 className="text-lg sm:text-xl font-semibold mb-4 md:mb-5">
                    Technical Expertise
                  </h3>

                  <div className="flex flex-wrap gap-2 sm:gap-3">
                    {skills.map((skill, index) => (
                      <span
                        key={index}
                        className="px-3 py-2 sm:px-4 rounded-full text-xs sm:text-sm bg-gradient-to-r from-blue-500/10 to-cyan-500/10 border border-white/10 hover:border-cyan-400 hover:scale-105 transition duration-300"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Contact Section */}
                <div className="mt-8 md:mt-10 space-y-5">
                  {/* Email */}
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-blue-500/10 flex items-center justify-center text-cyan-400 shrink-0">
                      <FaEnvelope />
                    </div>

                    <div className="min-w-0">
                      <p className="text-gray-400 text-xs sm:text-sm">
                        Email
                      </p>

                      <p className="text-white text-sm sm:text-base break-all">
                        noumanmolla12@gmail.com
                      </p>
                    </div>
                  </div>

                  {/* Phone */}
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-blue-500/10 flex items-center justify-center text-cyan-400 shrink-0">
                      <FaPhoneAlt />
                    </div>

                    <div>
                      <p className="text-gray-400 text-xs sm:text-sm">
                        Phone
                      </p>

                      <p className="text-white text-sm sm:text-base">
                        +91 9733116221
                      </p>
                    </div>
                  </div>

                  {/* Location */}
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-blue-500/10 flex items-center justify-center text-cyan-400 shrink-0">
                      <FaMapMarkerAlt />
                    </div>

                    <div>
                      <p className="text-gray-400 text-xs sm:text-sm">
                        Location
                      </p>

                      <p className="text-white text-sm sm:text-base">
                        Nalhati, West Bengal, India
                      </p>
                    </div>
                  </div>
                </div>

                {/* Footer */}
                <div className="mt-8 md:mt-10 pt-5 md:pt-6 border-t border-white/10 text-center">
                  <p className="text-gray-500 text-xs sm:text-sm">
                    ©️ 2026 Md. Nouman Molla. All rights reserved.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}