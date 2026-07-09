// "use client";

// const partners = [
//   {
//     id: 1,
//     name: "Amazon",
//     image:
//       "https://static.vecteezy.com/system/resources/previews/019/766/240/non_2x/amazon-logo-amazon-icon-transparent-free-png.png",
//     className: "amazonLogo",
//   },
//   {
//     id: 2,
//     name: "Flipkart",
//     image:
//       "https://upload.wikimedia.org/wikipedia/commons/e/e5/Flipkart_logo_%282026%29.svg",
//     className: "flipkartLogo",
//   },
// ];

// export default function OfficialPartners() {
//   return (
//     <section className="officialPartnersSection">
//       <h2 className="officialPartnersTitle">Official Partners</h2>

//       <div className="partnersLogoRow">
//         {partners.map((partner) => (
//           <div className="partnerLogoBox" key={partner.id}>
//             <img
//               src={partner.image}
//               alt={partner.name}
//               className={`partnerLogo ${partner.className}`}
//               draggable="false"
//             />
//           </div>
//         ))}
//       </div>

//       <style jsx>{`
//         .officialPartnersSection {
//           width: 100%;
//           height: 370px;
//           background: #ffffff;
//           border-top: 1px solid #e6e6e6;
//           border-bottom: 1px solid #e6e6e6;
//           display: flex;
//           flex-direction: column;
//           align-items: center;
//           justify-content: flex-start;
//           overflow: hidden;
//         }

//         .officialPartnersTitle {
//           margin: 68px 0 0;
//           padding: 0;
//           font-size: 22px;
//           line-height: 1.2;
//           font-weight: 700;
//           color: #000000;
//           text-align: center;
//           letter-spacing: -0.2px;
//         }

//         .partnersLogoRow {
//           width: 100%;
//           max-width: 720px;
//           margin-top: 72px;
//           display: flex;
//           align-items: center;
//           justify-content: center;
//           gap: 105px;
//         }

//         .partnerLogoBox {
//           display: flex;
//           align-items: center;
//           justify-content: center;
//           flex: 0 0 auto;
//         }

//         .partnerLogo {
//           display: block;
//           object-fit: contain;
//           user-select: none;
//           pointer-events: none;
//         }

//         .amazonLogo {
//           width: 255px;
//           height: auto;
//         }

//         .flipkartLogo {
//           width: 240px;
//           height: auto;
//         }

//         @media (max-width: 768px) {
//           .officialPartnersSection {
//             height: auto;
//             min-height: 320px;
//             padding: 58px 20px 58px;
//           }

//           .officialPartnersTitle {
//             margin-top: 0;
//             font-size: 21px;
//           }

//           .partnersLogoRow {
//             max-width: 600px;
//             margin-top: 58px;
//             gap: 70px;
//           }

//           .amazonLogo {
//             width: 190px;
//           }

//           .flipkartLogo {
//             width: 180px;
//           }
//         }

//         @media (max-width: 520px) {
//           .officialPartnersSection {
//             padding: 52px 16px 50px;
//             min-height: 300px;
//           }

//           .officialPartnersTitle {
//             font-size: 20px;
//           }

//           .partnersLogoRow {
//             max-width: 100%;
//             margin-top: 50px;
//             gap: 34px;
//             flex-wrap: wrap;
//           }

//           .partnerLogoBox {
//             width: calc(50% - 18px);
//           }

//           .amazonLogo {
//             width: 165px;
//           }

//           .flipkartLogo {
//             width: 155px;
//           }
//         }

//         @media (max-width: 390px) {
//           .partnersLogoRow {
//             gap: 24px;
//           }

//           .amazonLogo {
//             width: 145px;
//           }

//           .flipkartLogo {
//             width: 138px;
//           }
//         }
//       `}</style>
//     </section>
//   );
// }


















"use client";

const partners = [
  {
    id: 1,
    image:
      "images/logo/amazon.png",
    className: "amazonLogo",
  },
  {
    id: 2,
    image:
      "images/logo/flipkart.png",
    className: "flipkartLogo",
  },
];

export default function OfficialPartners() {
  return (
    <section className="officialPartnersSection">
      <div className="sectionGlow sectionGlowOne" />
      <div className="sectionGlow sectionGlowTwo" />

      <div className="officialPartnersInner">
        <span className="officialPartnersBadge">Marketplace Network</span>

        <h2 className="officialPartnersTitle">Official Partners</h2>

        <p className="officialPartnersSubtitle">
          Trusted platforms where our products are available with confidence.
        </p>

        <div className="partnersLogoRow">
          {partners.map((partner, index) => (
            <div
              className="partnerLogoBox"
              key={partner.id}
              style={{ "--delay": `${index * 120}ms` }}
            >
              <span className="logoShine" />

              <img
                src={partner.image}
                alt={partner.name}
                className={`partnerLogo ${partner.className}`}
                draggable="false"
              />

              <span className="partnerName">{partner.name}</span>
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        .officialPartnersSection {
          position: relative;
          width: 100%;
          min-height: 420px;
          background:
            radial-gradient(circle at 50% 0%, rgba(0, 0, 0, 0.055), transparent 34%),
            linear-gradient(180deg, #ffffff 0%, #fbfbfb 52%, #ffffff 100%);
          border-top: 1px solid rgba(0, 0, 0, 0.08);
          border-bottom: 1px solid rgba(0, 0, 0, 0.08);
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
          padding: 74px 24px 76px;
        }

        .officialPartnersInner {
          position: relative;
          z-index: 2;
          width: 100%;
          max-width: 920px;
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
        }

        .sectionGlow {
          position: absolute;
          border-radius: 999px;
          filter: blur(44px);
          opacity: 0.42;
          pointer-events: none;
          animation: softFloat 8s ease-in-out infinite;
        }

        .sectionGlowOne {
          width: 260px;
          height: 260px;
          top: -120px;
          left: 12%;
          background: rgba(0, 0, 0, 0.06);
        }

        .sectionGlowTwo {
          width: 220px;
          height: 220px;
          right: 10%;
          bottom: -110px;
          background: rgba(0, 0, 0, 0.055);
          animation-delay: 1.4s;
        }

        .officialPartnersBadge {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          padding: 8px 16px;
          border: 1px solid rgba(0, 0, 0, 0.1);
          border-radius: 999px;
          background: rgba(255, 255, 255, 0.72);
          backdrop-filter: blur(14px);
          box-shadow: 0 12px 34px rgba(0, 0, 0, 0.04);
          color: rgba(0, 0, 0, 0.62);
          font-size: 12px;
          line-height: 1;
          font-weight: 700;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          animation: fadeUp 700ms ease both;
        }

        .officialPartnersTitle {
          margin: 22px 0 0;
          padding: 0;
          font-size: clamp(28px, 3vw, 42px);
          line-height: 1.08;
          font-weight: 800;
          color: #070707;
          letter-spacing: -1.2px;
          animation: fadeUp 750ms ease both;
          animation-delay: 80ms;
        }

        .officialPartnersSubtitle {
          max-width: 520px;
          margin: 14px auto 0;
          color: rgba(0, 0, 0, 0.56);
          font-size: 15px;
          line-height: 1.7;
          font-weight: 500;
          animation: fadeUp 760ms ease both;
          animation-delay: 150ms;
        }

        .partnersLogoRow {
          width: 100%;
          margin-top: 54px;
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 28px;
        }

        .partnerLogoBox {
          position: relative;
          min-height: 168px;
          border-radius: 30px;
          background:
            linear-gradient(180deg, rgba(255, 255, 255, 0.94), rgba(250, 250, 250, 0.82)),
            #ffffff;
          border: 1px solid rgba(0, 0, 0, 0.075);
          box-shadow:
            0 26px 70px rgba(0, 0, 0, 0.075),
            inset 0 1px 0 rgba(255, 255, 255, 0.95);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 18px;
          overflow: hidden;
          transform: translateY(22px);
          opacity: 0;
          animation:
            cardEnter 780ms cubic-bezier(0.22, 1, 0.36, 1) both,
            premiumFloat 5.6s ease-in-out infinite;
          animation-delay: var(--delay), calc(var(--delay) + 900ms);
          transition:
            transform 360ms ease,
            box-shadow 360ms ease,
            border-color 360ms ease;
        }

        .partnerLogoBox::before {
          content: "";
          position: absolute;
          inset: 0;
          border-radius: inherit;
          background:
            radial-gradient(circle at 50% 0%, rgba(0, 0, 0, 0.055), transparent 38%),
            linear-gradient(135deg, rgba(255, 255, 255, 0.95), transparent 44%);
          opacity: 0.9;
          pointer-events: none;
        }

        .partnerLogoBox::after {
          content: "";
          position: absolute;
          inset: 1px;
          border-radius: 29px;
          border: 1px solid rgba(255, 255, 255, 0.85);
          pointer-events: none;
        }

        .partnerLogoBox:hover {
          transform: translateY(-8px) scale(1.015);
          border-color: rgba(0, 0, 0, 0.14);
          box-shadow:
            0 34px 90px rgba(0, 0, 0, 0.11),
            inset 0 1px 0 rgba(255, 255, 255, 1);
        }

        .logoShine {
          position: absolute;
          top: -80%;
          left: -40%;
          width: 42%;
          height: 250%;
          background: linear-gradient(
            90deg,
            transparent,
            rgba(255, 255, 255, 0.95),
            transparent
          );
          transform: rotate(22deg);
          opacity: 0;
          animation: shineMove 4.2s ease-in-out infinite;
          animation-delay: calc(var(--delay) + 1s);
          pointer-events: none;
        }

        .partnerLogo {
          position: relative;
          z-index: 2;
          display: block;
          object-fit: contain;
          user-select: none;
          pointer-events: none;
          filter: drop-shadow(0 10px 18px rgba(0, 0, 0, 0.09));
          transition: transform 360ms ease, filter 360ms ease;
        }

        .partnerLogoBox:hover .partnerLogo {
          transform: scale(1.045);
          filter: drop-shadow(0 14px 22px rgba(0, 0, 0, 0.12));
        }

        .amazonLogo {
          width: min(255px, 72%);
          height: auto;
        }

        .flipkartLogo {
          width: min(235px, 70%);
          height: auto;
        }

        .partnerName {
          position: relative;
          z-index: 2;
          color: rgba(0, 0, 0, 0.46);
          font-size: 13px;
          line-height: 1;
          font-weight: 700;
          letter-spacing: 0.08em;
          text-transform: uppercase;
        }

        @keyframes fadeUp {
          from {
            opacity: 0;
            transform: translateY(14px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes cardEnter {
          from {
            opacity: 0;
            transform: translateY(26px) scale(0.96);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        @keyframes premiumFloat {
          0%,
          100% {
            translate: 0 0;
          }
          50% {
            translate: 0 -7px;
          }
        }

        @keyframes softFloat {
          0%,
          100% {
            transform: translate3d(0, 0, 0) scale(1);
          }
          50% {
            transform: translate3d(0, 18px, 0) scale(1.04);
          }
        }

        @keyframes shineMove {
          0%,
          56% {
            opacity: 0;
            left: -45%;
          }
          68% {
            opacity: 0.8;
          }
          82%,
          100% {
            opacity: 0;
            left: 125%;
          }
        }

        @media (max-width: 768px) {
          .officialPartnersSection {
            min-height: 390px;
            padding: 66px 18px 68px;
          }

          .officialPartnersTitle {
            letter-spacing: -0.8px;
          }

          .officialPartnersSubtitle {
            font-size: 14px;
            max-width: 430px;
          }

          .partnersLogoRow {
            margin-top: 44px;
            gap: 22px;
          }

          .partnerLogoBox {
            min-height: 150px;
            border-radius: 26px;
          }

          .partnerLogoBox::after {
            border-radius: 25px;
          }

          .amazonLogo {
            width: min(205px, 76%);
          }

          .flipkartLogo {
            width: min(195px, 74%);
          }
        }

        @media (max-width: 560px) {
          .officialPartnersSection {
            padding: 58px 16px 60px;
          }

          .officialPartnersBadge {
            font-size: 11px;
            padding: 8px 14px;
          }

          .officialPartnersTitle {
            font-size: 30px;
          }

          .officialPartnersSubtitle {
            margin-top: 12px;
            font-size: 13.5px;
            line-height: 1.65;
          }

          .partnersLogoRow {
            grid-template-columns: 1fr;
            max-width: 340px;
            margin-top: 38px;
            gap: 18px;
          }

          .partnerLogoBox {
            min-height: 138px;
            border-radius: 24px;
          }

          .partnerLogoBox::after {
            border-radius: 23px;
          }

          .amazonLogo {
            width: min(190px, 72%);
          }

          .flipkartLogo {
            width: min(180px, 70%);
          }

          .partnerName {
            font-size: 12px;
          }
        }

        @media (max-width: 390px) {
          .officialPartnersTitle {
            font-size: 27px;
          }

          .officialPartnersSubtitle {
            font-size: 13px;
          }

          .partnerLogoBox {
            min-height: 128px;
          }

          .amazonLogo {
            width: 165px;
          }

          .flipkartLogo {
            width: 158px;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .officialPartnersBadge,
          .officialPartnersTitle,
          .officialPartnersSubtitle,
          .partnerLogoBox,
          .sectionGlow,
          .logoShine {
            animation: none;
          }

          .partnerLogoBox {
            opacity: 1;
            transform: none;
          }

          .partnerLogoBox:hover {
            transform: none;
          }
        }
      `}</style>
    </section>
  );
}