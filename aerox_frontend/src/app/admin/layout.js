
"use client";

import AuthGuard from "../../lib/authGuard";
import AdminSidebar from "@/components/admin/AdminSidebar";

export default function AdminLayout({ children }) {
  return (
    <AuthGuard>
      <>
        <style jsx global>{`
          html,
          body {
            margin: 0;
            padding: 0;
            width: 100%;
            min-height: 100%;
            background: #f5f5f7;
          }

          * {
            box-sizing: border-box;
          }

          body {
            overflow: hidden;
          }

          .admin-shell {
            display: flex;
            width: 100%;
            min-height: 100vh;
            background: #f5f5f7;
          }

          .admin-content-wrap {
            flex: 1;
            min-width: 0;
            height: 100vh;
            overflow: hidden;
            display: flex;
            flex-direction: column;
          }

          .admin-main-scroll {
            flex: 1;
            min-width: 0;
            min-height: 0;
            overflow-y: auto;
            overflow-x: hidden;
            padding: 28px;
            -webkit-overflow-scrolling: touch;
          }

          @media (max-width: 900px) {
            .admin-main-scroll {
              padding: 76px 16px 18px;
            }
          }
        `}</style>

        <div className="admin-shell">
          <AdminSidebar />
          <div className="admin-content-wrap">
            <main className="admin-main-scroll">{children}</main>
          </div>
        </div>
      </>
    </AuthGuard>
  );
}