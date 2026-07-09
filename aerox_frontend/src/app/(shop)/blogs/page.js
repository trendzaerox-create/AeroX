// import Link from "next/link";

// export const metadata = {
//   title: "Blogs | Trendz AeroX",
//   description:
//     "Read Trendz AeroX blogs about earbuds, smartwatches, ANC, ENC, battery saving tips, calling, gaming, and product guides.",
// };

// const blogs = [
//   {
//     title: "Best Earbuds Under ₹1500",
//     category: "Earbuds Guide",
//     readTime: "4 min read",
//     content:
//       "Earbuds under ₹1500 are perfect for daily music, calls, online classes, travel, and gaming. While buying, check battery backup, mic quality, bass, comfort, Bluetooth stability, and fast charging. A good budget earbud should offer clear sound, decent calling, comfortable ear tips, and long battery life with the charging case.",
//     points: [
//       "30–40 hours total playtime is good",
//       "ENC or quad mic helps in calling",
//       "Low latency mode is useful for gaming",
//       "Fast charging is helpful for daily users",
//     ],
//   },
//   {
//     title: "How to Choose the Right Smartwatch",
//     category: "Smartwatch Guide",
//     readTime: "5 min read",
//     content:
//       "Before buying a smartwatch, decide your main need. Some users want Bluetooth calling, some want fitness tracking, some want premium looks, and some want long battery backup. A good smartwatch should have a bright display, comfortable strap, useful health features, sports modes, and strong battery performance.",
//     points: [
//       "Choose Bluetooth calling for daily convenience",
//       "AMOLED or HD display gives a premium feel",
//       "Check battery backup before buying",
//       "Comfortable strap is important for long use",
//     ],
//   },
//   {
//     title: "ANC vs ENC Explained",
//     category: "Technology",
//     readTime: "3 min read",
//     content:
//       "ANC and ENC are different features. ANC means Active Noise Cancellation. It reduces outside noise while listening to music. ENC means Environmental Noise Cancellation. It improves your voice clarity during calls by reducing background noise picked up by the microphone.",
//     points: [
//       "ANC is useful for music and travel",
//       "ENC is useful for calls and meetings",
//       "Gamers benefit from ENC during voice chat",
//       "For best use, choose earbuds with clear mic quality",
//     ],
//   },
//   {
//     title: "Smartwatch Battery Saving Tips",
//     category: "Tips",
//     readTime: "4 min read",
//     content:
//       "Smartwatch battery life depends on brightness, calling usage, notifications, watch faces, health tracking, and Bluetooth connection. You can improve battery backup by using smart settings and avoiding unnecessary features when they are not needed.",
//     points: [
//       "Reduce screen brightness",
//       "Turn off unused app notifications",
//       "Avoid always-on display when not needed",
//       "Use simple watch faces",
//       "Disable Bluetooth calling when not in use",
//     ],
//   },
//   {
//     title: "Best Earbuds for Calling and Gaming",
//     category: "Buying Guide",
//     readTime: "4 min read",
//     content:
//       "For calling and gaming, earbuds should have clear microphone quality, low latency mode, stable Bluetooth connection, good bass, and comfortable fitting. ENC support helps during calls, while low latency mode improves gaming and video experience.",
//     points: [
//       "Low latency mode reduces sound delay",
//       "ENC improves call clarity",
//       "Comfortable fit is important for long gaming",
//       "Strong battery backup is useful for daily use",
//     ],
//   },
//   {
//     title: "Trendz AeroX Product Guides",
//     category: "Brand Guide",
//     readTime: "5 min read",
//     content:
//       "Trendz AeroX product guides help customers understand earbuds and smartwatches before buying. These guides explain features like calling, gaming, ANC, ENC, battery life, smartwatch display, Bluetooth calling, and product care.",
//     points: [
//       "Earbuds guide for calling and gaming",
//       "Smartwatch guide for daily lifestyle",
//       "Battery saving tips",
//       "Product care and usage support",
//     ],
//   },
// ];

// export default function BlogsPage() {
//   return (
//     <main className="blogsPage">
//       <section className="hero">
//         <span className="badge">Trendz AeroX Blogs</span>

//         <h1>Smart Guides for Earbuds & Smartwatches</h1>

//         <p>
//           Helpful buying guides, product tips, and feature explanations for
//           customers who want to choose the right Trendz AeroX electronics.
//         </p>

//         <div className="heroBtns">
//           <Link href="/products" className="primaryBtn">
//             Shop Products
//           </Link>

//           <Link href="/bestsellers" className="secondaryBtn">
//             View Bestsellers
//           </Link>
//         </div>
//       </section>

//       <section className="blogsSection">
//         <div className="sectionHead">
//           <span>Latest Guides</span>
//           <h2>Read Before You Buy</h2>
//         </div>

//         <div className="blogsGrid">
//           {blogs.map((blog, index) => (
//             <article className="blogCard" key={index}>
//               <div className="cardTop">
//                 <span>{blog.category}</span>
//                 <small>{blog.readTime}</small>
//               </div>

//               <h3>{blog.title}</h3>

//               <p>{blog.content}</p>

//               <ul>
//                 {blog.points.map((point, pointIndex) => (
//                   <li key={pointIndex}>{point}</li>
//                 ))}
//               </ul>

//               <Link href="/products" className="shopLink">
//                 Explore Products →
//               </Link>
//             </article>
//           ))}
//         </div>
//       </section>

//       <section className="bottomCta">
//         <div>
//           <span>Trendz AeroX</span>
//           <h2>Find the Right Product for Your Lifestyle</h2>
//           <p>
//             Browse premium earbuds and smartwatches made for music, calling,
//             gaming, fitness, travel, and everyday use.
//           </p>
//         </div>

//         <Link href="/products" className="ctaBtn">
//           Shop Now
//         </Link>
//       </section>

//       <style>{`
//         .blogsPage {
//           width: 100%;
//           min-height: 100vh;
//           background:
//             radial-gradient(circle at top left, rgba(219, 234, 254, 0.9), transparent 34%),
//             linear-gradient(180deg, #ffffff 0%, #f7f9fc 50%, #ffffff 100%);
//           color: #111827;
//         }

//         .hero {
//           max-width: 1100px;
//           margin: 0 auto;
//           padding: 86px 20px 52px;
//           text-align: center;
//         }

//         .badge {
//           display: inline-flex;
//           padding: 9px 18px;
//           border-radius: 999px;
//           background: rgba(17, 24, 39, 0.06);
//           color: #111827;
//           font-size: 13px;
//           font-weight: 800;
//           letter-spacing: 0.08em;
//           text-transform: uppercase;
//           margin-bottom: 20px;
//         }

//         .hero h1 {
//           max-width: 850px;
//           margin: 0 auto;
//           font-size: clamp(36px, 5vw, 68px);
//           line-height: 1.04;
//           letter-spacing: -0.06em;
//           font-weight: 900;
//         }

//         .hero p {
//           max-width: 680px;
//           margin: 22px auto 0;
//           color: #5f6b7a;
//           font-size: 17px;
//           line-height: 1.7;
//         }

//         .heroBtns {
//           display: flex;
//           justify-content: center;
//           gap: 14px;
//           flex-wrap: wrap;
//           margin-top: 34px;
//         }

//         .primaryBtn,
//         .secondaryBtn,
//         .ctaBtn {
//           display: inline-flex;
//           align-items: center;
//           justify-content: center;
//           min-height: 48px;
//           padding: 0 24px;
//           border-radius: 999px;
//           font-size: 14px;
//           font-weight: 900;
//           text-decoration: none;
//           transition: 0.25s ease;
//         }

//         .primaryBtn,
//         .ctaBtn {
//           background: #111827;
//           color: #ffffff;
//           box-shadow: 0 16px 40px rgba(17, 24, 39, 0.18);
//         }

//         .secondaryBtn {
//           background: #ffffff;
//           color: #111827;
//           border: 1px solid rgba(17, 24, 39, 0.12);
//         }

//         .primaryBtn:hover,
//         .secondaryBtn:hover,
//         .ctaBtn:hover {
//           transform: translateY(-2px);
//         }

//         .blogsSection {
//           max-width: 1180px;
//           margin: 0 auto;
//           padding: 10px 20px 70px;
//         }

//         .sectionHead {
//           margin-bottom: 28px;
//         }

//         .sectionHead span {
//           display: block;
//           color: #2563eb;
//           font-size: 13px;
//           font-weight: 900;
//           letter-spacing: 0.12em;
//           text-transform: uppercase;
//           margin-bottom: 8px;
//         }

//         .sectionHead h2 {
//           margin: 0;
//           font-size: clamp(28px, 3vw, 44px);
//           letter-spacing: -0.04em;
//         }

//         .blogsGrid {
//           display: grid;
//           grid-template-columns: repeat(3, minmax(0, 1fr));
//           gap: 22px;
//         }

//         .blogCard {
//           position: relative;
//           overflow: hidden;
//           padding: 24px;
//           border-radius: 30px;
//           background: rgba(255, 255, 255, 0.92);
//           border: 1px solid rgba(17, 24, 39, 0.08);
//           box-shadow: 0 22px 55px rgba(15, 23, 42, 0.08);
//           transition: 0.25s ease;
//         }

//         .blogCard::before {
//           content: "";
//           position: absolute;
//           width: 150px;
//           height: 150px;
//           right: -60px;
//           top: -60px;
//           border-radius: 50%;
//           background: rgba(37, 99, 235, 0.08);
//         }

//         .blogCard:hover {
//           transform: translateY(-5px);
//           box-shadow: 0 28px 70px rgba(15, 23, 42, 0.12);
//         }

//         .cardTop {
//           position: relative;
//           z-index: 1;
//           display: flex;
//           justify-content: space-between;
//           gap: 12px;
//           margin-bottom: 20px;
//         }

//         .cardTop span,
//         .cardTop small {
//           color: #4b5563;
//           font-size: 12px;
//           font-weight: 800;
//         }

//         .blogCard h3 {
//           position: relative;
//           z-index: 1;
//           margin: 0;
//           font-size: 24px;
//           line-height: 1.15;
//           letter-spacing: -0.04em;
//         }

//         .blogCard p {
//           position: relative;
//           z-index: 1;
//           margin: 14px 0 0;
//           color: #667085;
//           font-size: 14px;
//           line-height: 1.75;
//         }

//         .blogCard ul {
//           position: relative;
//           z-index: 1;
//           margin: 16px 0 0;
//           padding-left: 18px;
//         }

//         .blogCard li {
//           color: #374151;
//           font-size: 14px;
//           line-height: 1.6;
//           margin-bottom: 7px;
//         }

//         .shopLink {
//           position: relative;
//           z-index: 1;
//           display: inline-flex;
//           margin-top: 18px;
//           color: #111827;
//           font-size: 14px;
//           font-weight: 900;
//           text-decoration: none;
//         }

//         .bottomCta {
//           max-width: 1180px;
//           margin: 0 auto 80px;
//           padding: 34px;
//           border-radius: 34px;
//           background: #111827;
//           color: #ffffff;
//           display: flex;
//           justify-content: space-between;
//           align-items: center;
//           gap: 24px;
//           box-shadow: 0 24px 70px rgba(17, 24, 39, 0.2);
//         }

//         .bottomCta span {
//           display: block;
//           color: rgba(255, 255, 255, 0.7);
//           font-size: 13px;
//           font-weight: 900;
//           text-transform: uppercase;
//           letter-spacing: 0.12em;
//           margin-bottom: 10px;
//         }

//         .bottomCta h2 {
//           margin: 0;
//           font-size: clamp(26px, 3vw, 42px);
//           letter-spacing: -0.05em;
//         }

//         .bottomCta p {
//           max-width: 680px;
//           margin: 12px 0 0;
//           color: rgba(255, 255, 255, 0.72);
//           line-height: 1.7;
//         }

//         .bottomCta .ctaBtn {
//           background: #ffffff;
//           color: #111827;
//           flex-shrink: 0;
//           box-shadow: none;
//         }

//         @media (max-width: 980px) {
//           .blogsGrid {
//             grid-template-columns: repeat(2, minmax(0, 1fr));
//           }

//           .bottomCta {
//             flex-direction: column;
//             align-items: flex-start;
//           }
//         }

//         @media (max-width: 640px) {
//           .hero {
//             padding: 62px 16px 42px;
//             text-align: left;
//           }

//           .hero p {
//             margin-left: 0;
//           }

//           .heroBtns {
//             justify-content: flex-start;
//           }

//           .blogsSection {
//             padding-left: 16px;
//             padding-right: 16px;
//           }

//           .blogsGrid {
//             grid-template-columns: 1fr;
//           }

//           .blogCard {
//             border-radius: 24px;
//           }

//           .primaryBtn,
//           .secondaryBtn,
//           .ctaBtn {
//             width: 100%;
//           }

//           .bottomCta {
//             margin: 0 16px 60px;
//             padding: 26px;
//             border-radius: 26px;
//           }
//         }
//       `}</style>
//     </main>
//   );
// }































import Link from "next/link";

export const metadata = {
  title: "Blogs | Trendz AeroX",
  description:
    "Read Trendz AeroX blogs about earbuds, smartwatches, ANC, ENC, battery saving tips, calling, gaming, and product guides.",
};

const blogs = [
  {
    title: "Best Earbuds Under ₹1500",
    category: "Earbuds Guide",
    readTime: "4 min read",
    content:
      "Earbuds under ₹1500 are perfect for daily music, calls, online classes, travel, and gaming. While buying, check battery backup, mic quality, bass, comfort, Bluetooth stability, and fast charging. A good budget earbud should offer clear sound, decent calling, comfortable ear tips, and long battery life with the charging case.",
    points: [
      "30–40 hours total playtime is good",
      "ENC or quad mic helps in calling",
      "Low latency mode is useful for gaming",
      "Fast charging is helpful for daily users",
    ],
  },
  {
    title: "How to Choose the Right Smartwatch",
    category: "Smartwatch Guide",
    readTime: "5 min read",
    content:
      "Before buying a smartwatch, decide your main need. Some users want Bluetooth calling, some want fitness tracking, some want premium looks, and some want long battery backup. A good smartwatch should have a bright display, comfortable strap, useful health features, sports modes, and strong battery performance.",
    points: [
      "Choose Bluetooth calling for daily convenience",
      "AMOLED or HD display gives a premium feel",
      "Check battery backup before buying",
      "Comfortable strap is important for long use",
    ],
  },
  {
    title: "ANC vs ENC Explained",
    category: "Technology",
    readTime: "3 min read",
    content:
      "ANC and ENC are different features. ANC means Active Noise Cancellation. It reduces outside noise while listening to music. ENC means Environmental Noise Cancellation. It improves your voice clarity during calls by reducing background noise picked up by the microphone.",
    points: [
      "ANC is useful for music and travel",
      "ENC is useful for calls and meetings",
      "Gamers benefit from ENC during voice chat",
      "For best use, choose earbuds with clear mic quality",
    ],
  },
  {
    title: "Smartwatch Battery Saving Tips",
    category: "Tips",
    readTime: "4 min read",
    content:
      "Smartwatch battery life depends on brightness, calling usage, notifications, watch faces, health tracking, and Bluetooth connection. You can improve battery backup by using smart settings and avoiding unnecessary features when they are not needed.",
    points: [
      "Reduce screen brightness",
      "Turn off unused app notifications",
      "Avoid always-on display when not needed",
      "Use simple watch faces",
      "Disable Bluetooth calling when not in use",
    ],
  },
  {
    title: "Best Earbuds for Calling and Gaming",
    category: "Buying Guide",
    readTime: "4 min read",
    content:
      "For calling and gaming, earbuds should have clear microphone quality, low latency mode, stable Bluetooth connection, good bass, and comfortable fitting. ENC support helps during calls, while low latency mode improves gaming and video experience.",
    points: [
      "Low latency mode reduces sound delay",
      "ENC improves call clarity",
      "Comfortable fit is important for long gaming",
      "Strong battery backup is useful for daily use",
    ],
  },
  {
    title: "Trendz AeroX Product Guides",
    category: "Brand Guide",
    readTime: "5 min read",
    content:
      "Trendz AeroX product guides help customers understand earbuds and smartwatches before buying. These guides explain features like calling, gaming, ANC, ENC, battery life, smartwatch display, Bluetooth calling, and product care.",
    points: [
      "Earbuds guide for calling and gaming",
      "Smartwatch guide for daily lifestyle",
      "Battery saving tips",
      "Product care and usage support",
    ],
  },
];

export default function BlogsPage() {
  return (
    <main className="blogsPage">
      <section className="hero">
        <span className="badge">Trendz AeroX Blogs</span>

        <h1>Smart Guides for Earbuds & Smartwatches</h1>

        <p>
          Helpful buying guides, product tips, and feature explanations for
          customers who want to choose the right Trendz AeroX electronics.
        </p>

        <div className="heroBtns">
          <Link href="/products" className="primaryBtn">
            Shop Products
          </Link>

          <Link href="/bestsellers" className="secondaryBtn">
            View Bestsellers
          </Link>
        </div>
      </section>

      <section className="blogsSection">
        <div className="sectionHead">
          <span>Latest Guides</span>
          <h2>Read Before You Buy</h2>
        </div>

        <div className="blogsGrid">
          {blogs.map((blog, index) => (
            <article className="blogCard" key={index}>
              <div className="cardTop">
                <span>{blog.category}</span>
                <small>{blog.readTime}</small>
              </div>

              <h3>{blog.title}</h3>

              <p>{blog.content}</p>

              <ul>
                {blog.points.map((point, pointIndex) => (
                  <li key={pointIndex}>{point}</li>
                ))}
              </ul>

              <Link href="/products" className="shopLink">
                Explore Products →
              </Link>
            </article>
          ))}
        </div>
      </section>

      <section className="bottomCta">
        <div>
          <span>Trendz AeroX</span>
          <h2>Find the Right Product for Your Lifestyle</h2>
          <p>
            Browse premium earbuds and smartwatches made for music, calling,
            gaming, fitness, travel, and everyday use.
          </p>
        </div>

        <Link href="/products" className="ctaBtn">
          Shop Now
        </Link>
      </section>

      <style>{`
        .blogsPage {
          width: 100%;
          min-height: 100vh;
          padding-bottom: 90px;
          background:
            radial-gradient(circle at top left, rgba(219, 234, 254, 0.9), transparent 34%),
            linear-gradient(180deg, #ffffff 0%, #f7f9fc 50%, #ffffff 100%);
          color: #111827;
        }

        .hero {
          max-width: 1100px;
          margin: 0 auto;
          padding: 86px 20px 52px;
          text-align: center;
        }

        .badge {
          display: inline-flex;
          padding: 9px 18px;
          border-radius: 999px;
          background: rgba(17, 24, 39, 0.06);
          color: #111827;
          font-size: 13px;
          font-weight: 800;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          margin-bottom: 20px;
        }

        .hero h1 {
          max-width: 850px;
          margin: 0 auto;
          font-size: clamp(36px, 5vw, 68px);
          line-height: 1.04;
          letter-spacing: -0.06em;
          font-weight: 900;
        }

        .hero p {
          max-width: 680px;
          margin: 22px auto 0;
          color: #5f6b7a;
          font-size: 17px;
          line-height: 1.7;
        }

        .heroBtns {
          display: flex;
          justify-content: center;
          gap: 14px;
          flex-wrap: wrap;
          margin-top: 34px;
        }

        .primaryBtn,
        .secondaryBtn,
        .ctaBtn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          min-height: 48px;
          padding: 0 24px;
          border-radius: 999px;
          font-size: 14px;
          font-weight: 900;
          text-decoration: none;
          transition: 0.25s ease;
        }

        .primaryBtn,
        .ctaBtn {
          background: #111827;
          color: #ffffff;
          box-shadow: 0 16px 40px rgba(17, 24, 39, 0.18);
        }

        .secondaryBtn {
          background: #ffffff;
          color: #111827;
          border: 1px solid rgba(17, 24, 39, 0.12);
        }

        .primaryBtn:hover,
        .secondaryBtn:hover,
        .ctaBtn:hover {
          transform: translateY(-2px);
        }

        .blogsSection {
          max-width: 1180px;
          margin: 0 auto;
          padding: 10px 20px 70px;
        }

        .sectionHead {
          margin-bottom: 28px;
        }

        .sectionHead span {
          display: block;
          color: #2563eb;
          font-size: 13px;
          font-weight: 900;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          margin-bottom: 8px;
        }

        .sectionHead h2 {
          margin: 0;
          font-size: clamp(28px, 3vw, 44px);
          letter-spacing: -0.04em;
        }

        .blogsGrid {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 22px;
        }

        .blogCard {
          position: relative;
          overflow: hidden;
          padding: 24px;
          border-radius: 30px;
          background: rgba(255, 255, 255, 0.92);
          border: 1px solid rgba(17, 24, 39, 0.08);
          box-shadow: 0 22px 55px rgba(15, 23, 42, 0.08);
          transition: 0.25s ease;
        }

        .blogCard::before {
          content: "";
          position: absolute;
          width: 150px;
          height: 150px;
          right: -60px;
          top: -60px;
          border-radius: 50%;
          background: rgba(37, 99, 235, 0.08);
        }

        .blogCard:hover {
          transform: translateY(-5px);
          box-shadow: 0 28px 70px rgba(15, 23, 42, 0.12);
        }

        .cardTop {
          position: relative;
          z-index: 1;
          display: flex;
          justify-content: space-between;
          gap: 12px;
          margin-bottom: 20px;
        }

        .cardTop span,
        .cardTop small {
          color: #4b5563;
          font-size: 12px;
          font-weight: 800;
        }

        .blogCard h3 {
          position: relative;
          z-index: 1;
          margin: 0;
          font-size: 24px;
          line-height: 1.15;
          letter-spacing: -0.04em;
        }

        .blogCard p {
          position: relative;
          z-index: 1;
          margin: 14px 0 0;
          color: #667085;
          font-size: 14px;
          line-height: 1.75;
        }

        .blogCard ul {
          position: relative;
          z-index: 1;
          margin: 16px 0 0;
          padding-left: 18px;
        }

        .blogCard li {
          color: #374151;
          font-size: 14px;
          line-height: 1.6;
          margin-bottom: 7px;
        }

        .shopLink {
          position: relative;
          z-index: 1;
          display: inline-flex;
          margin-top: 18px;
          color: #111827;
          font-size: 14px;
          font-weight: 900;
          text-decoration: none;
        }

        .bottomCta {
          max-width: 1180px;
          margin: 0 auto;
          padding: 34px;
          border-radius: 34px;
          background: #111827;
          color: #ffffff;
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 24px;
          box-shadow: 0 24px 70px rgba(17, 24, 39, 0.2);
        }

        .bottomCta span {
          display: block;
          color: rgba(255, 255, 255, 0.7);
          font-size: 13px;
          font-weight: 900;
          text-transform: uppercase;
          letter-spacing: 0.12em;
          margin-bottom: 10px;
        }

        .bottomCta h2 {
          margin: 0;
          font-size: clamp(26px, 3vw, 42px);
          letter-spacing: -0.05em;
        }

        .bottomCta p {
          max-width: 680px;
          margin: 12px 0 0;
          color: rgba(255, 255, 255, 0.72);
          line-height: 1.7;
        }

        .bottomCta .ctaBtn {
          background: #ffffff;
          color: #111827;
          flex-shrink: 0;
          box-shadow: none;
        }

        @media (max-width: 980px) {
          .blogsGrid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }

          .bottomCta {
            flex-direction: column;
            align-items: flex-start;
          }
        }

        @media (max-width: 640px) {
          .blogsPage {
            padding-bottom: 70px;
          }

          .hero {
            padding: 62px 16px 42px;
            text-align: left;
          }

          .hero p {
            margin-left: 0;
          }

          .heroBtns {
            justify-content: flex-start;
          }

          .blogsSection {
            padding-left: 16px;
            padding-right: 16px;
          }

          .blogsGrid {
            grid-template-columns: 1fr;
          }

          .blogCard {
            border-radius: 24px;
          }

          .primaryBtn,
          .secondaryBtn,
          .ctaBtn {
            width: 100%;
          }

          .bottomCta {
            margin: 0 16px;
            padding: 26px;
            border-radius: 26px;
          }
        }
      `}</style>
    </main>
  );
}