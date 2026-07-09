


"use client";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";

import { fetchUsers, removeUser } from "@/features/user/userSlice";

export default function AdminUsersPage() {
  const dispatch = useDispatch();
  const router = useRouter();

  const { users } = useSelector((state) => state.user);

  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);

  const pageStyle = {
    minHeight: "100%",
    padding: "clamp(14px, 2vw, 28px)",
    background:
      "linear-gradient(180deg, #f8f8f8 0%, #f3f4f6 45%, #efefef 100%)",
  };

  const headerWrapStyle = {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "12px",
    flexWrap: "wrap",
    marginBottom: "20px",
  };

  const headingStyle = {
    margin: 0,
    fontSize: "clamp(22px, 3vw, 34px)",
    fontWeight: 700,
    color: "#111827",
    letterSpacing: "-0.03em",
  };

  const subTextStyle = {
    margin: "6px 0 0",
    color: "#6b7280",
    fontSize: "clamp(13px, 1.5vw, 15px)",
  };

  const tableWrapperStyle = {
    width: "100%",
    overflowX: "auto",
    borderRadius: "22px",
    background: "rgba(255,255,255,0.9)",
    border: "1px solid rgba(17,24,39,0.08)",
    boxShadow:
      "0 12px 30px rgba(17,24,39,0.06), 0 3px 10px rgba(17,24,39,0.04)",
    backdropFilter: "blur(10px)",
  };

  const tableStyle = {
    borderCollapse: "separate",
    borderSpacing: 0,
    width: "100%",
    minWidth: "900px",
  };

  const thStyle = {
    textAlign: "left",
    padding: "16px 18px",
    fontSize: "12px",
    fontWeight: 700,
    letterSpacing: "0.08em",
    color: "#6b7280",
    background: "linear-gradient(180deg, #fafafa 0%, #f3f4f6 100%)",
    borderBottom: "1px solid rgba(17,24,39,0.08)",
    whiteSpace: "nowrap",
    position: "sticky",
    top: 0,
    zIndex: 1,
  };

  const tdStyle = {
    padding: "16px 18px",
    fontSize: "14px",
    color: "#111827",
    borderBottom: "1px solid rgba(17,24,39,0.06)",
    verticalAlign: "middle",
    wordBreak: "break-word",
    background: "rgba(255,255,255,0.88)",
  };

  const idBadgeStyle = {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    minWidth: "38px",
    minHeight: "34px",
    padding: "6px 10px",
    borderRadius: "999px",
    background: "rgba(17,24,39,0.06)",
    border: "1px solid rgba(17,24,39,0.08)",
    color: "#111827",
    fontWeight: 700,
    fontSize: "12px",
  };

  const nameStyle = {
    fontWeight: 700,
    color: "#111827",
    fontSize: "14px",
  };

  const emailStyle = {
    color: "#4b5563",
    fontSize: "14px",
  };

  const roleBadgeStyle = (role) => {
    const normalizedRole = String(role || "").toUpperCase();
    const isAdmin = normalizedRole === "ADMIN";

    return {
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "8px 12px",
      borderRadius: "999px",
      fontSize: "12px",
      fontWeight: 700,
      letterSpacing: "0.04em",
      border: isAdmin
        ? "1px solid rgba(168,85,247,0.22)"
        : "1px solid rgba(59,130,246,0.18)",
      background: isAdmin
        ? "rgba(168,85,247,0.12)"
        : "rgba(59,130,246,0.10)",
      color: isAdmin ? "#7c3aed" : "#1d4ed8",
      whiteSpace: "nowrap",
    };
  };

  const phoneStyle = {
    color: "#374151",
    fontWeight: 500,
    whiteSpace: "nowrap",
  };

  const actionWrapStyle = {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    flexWrap: "wrap",
  };

  const editButtonStyle = {
    border: "1px solid rgba(17,24,39,0.08)",
    background: "linear-gradient(135deg, #111827 0%, #1f2937 100%)",
    color: "#ffffff",
    borderRadius: "12px",
    padding: "10px 16px",
    minHeight: "40px",
    fontSize: "13px",
    fontWeight: 700,
    letterSpacing: "0.03em",
    cursor: "pointer",
    transition: "all 0.25s ease",
    boxShadow: "0 8px 18px rgba(17,24,39,0.14)",
  };

  const deleteButtonStyle = {
    border: "1px solid rgba(239,68,68,0.14)",
    background: "linear-gradient(135deg, #fff5f5 0%, #fef2f2 100%)",
    color: "#dc2626",
    borderRadius: "12px",
    padding: "10px 16px",
    minHeight: "40px",
    fontSize: "13px",
    fontWeight: 700,
    letterSpacing: "0.03em",
    cursor: "pointer",
    transition: "all 0.25s ease",
    boxShadow: "0 6px 14px rgba(239,68,68,0.08)",
  };

  const mobileCardsWrapStyle = {
    display: "grid",
    gap: "14px",
  };

  const mobileCardStyle = {
    position: "relative",
    overflow: "hidden",
    borderRadius: "20px",
    padding: "16px",
    background:
      "linear-gradient(135deg, rgba(255,255,255,0.98) 0%, rgba(249,250,251,0.96) 100%)",
    border: "1px solid rgba(17,24,39,0.08)",
    boxShadow:
      "0 10px 26px rgba(17,24,39,0.06), 0 3px 10px rgba(17,24,39,0.04)",
    transition: "transform 0.25s ease, box-shadow 0.25s ease",
  };

  const mobileRowStyle = {
    display: "flex",
    justifyContent: "space-between",
    gap: "10px",
    padding: "8px 0",
    borderBottom: "1px solid rgba(17,24,39,0.06)",
    alignItems: "flex-start",
  };

  const mobileLabelStyle = {
    fontSize: "11px",
    fontWeight: 700,
    letterSpacing: "0.08em",
    color: "#6b7280",
    minWidth: "72px",
    flexShrink: 0,
  };

  const mobileValueStyle = {
    fontSize: "14px",
    color: "#111827",
    fontWeight: 600,
    textAlign: "right",
    wordBreak: "break-word",
  };

  const emptyStateStyle = {
    borderRadius: "20px",
    padding: "32px 20px",
    textAlign: "center",
    background: "rgba(255,255,255,0.9)",
    border: "1px solid rgba(17,24,39,0.08)",
    color: "#6b7280",
    boxShadow: "0 10px 30px rgba(17,24,39,0.05)",
  };

  return (
    <div style={pageStyle}>
      <style jsx>{`
        .users-table-wrap::-webkit-scrollbar {
          height: 10px;
        }

        .users-table-wrap::-webkit-scrollbar-track {
          background: transparent;
        }

        .users-table-wrap::-webkit-scrollbar-thumb {
          background: rgba(17, 24, 39, 0.14);
          border-radius: 999px;
        }

        .users-row {
          transition: transform 0.22s ease, background 0.22s ease;
        }

        .users-row:hover td {
          background: rgba(249, 250, 251, 1);
        }

        .action-btn:hover {
          transform: translateY(-2px);
        }

        .mobile-user-card:hover {
          transform: translateY(-3px);
          box-shadow: 0 16px 34px rgba(17, 24, 39, 0.1),
            0 4px 14px rgba(17, 24, 39, 0.05);
        }

        .desktop-users-view {
          display: block;
        }

        .mobile-users-view {
          display: none;
        }

        @media (max-width: 768px) {
          .desktop-users-view {
            display: none;
          }

          .mobile-users-view {
            display: block;
          }
        }
      `}</style>

      <div style={headerWrapStyle}>
        <div>
          <h2 style={headingStyle}>All Users</h2>
          <p style={subTextStyle}>
            Clean, responsive, premium user management for every device.
          </p>
        </div>
      </div>

      {users?.length > 0 ? (
        <>
          <div className="desktop-users-view">
            <div
              className="users-table-wrap"
              style={tableWrapperStyle}
            >
              <table style={tableStyle}>
                <thead>
                  <tr>
                    <th style={{ ...thStyle, borderTopLeftRadius: "22px" }}>ID</th>
                    <th style={thStyle}>Name</th>
                    <th style={thStyle}>Email</th>
                    <th style={thStyle}>Role</th>
                    <th style={thStyle}>Phone</th>
                    <th style={{ ...thStyle, borderTopRightRadius: "22px" }}>
                      Action
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {users.map((user, index) => (
                    <tr key={user.id} className="users-row">
                      <td
                        style={{
                          ...tdStyle,
                          borderBottom:
                            index === users.length - 1
                              ? "none"
                              : tdStyle.borderBottom,
                        }}
                      >
                        <span style={idBadgeStyle}>{user.id}</span>
                      </td>

                      <td
                        style={{
                          ...tdStyle,
                          borderBottom:
                            index === users.length - 1
                              ? "none"
                              : tdStyle.borderBottom,
                        }}
                      >
                        <div style={nameStyle}>{user.name}</div>
                      </td>

                      <td
                        style={{
                          ...tdStyle,
                          borderBottom:
                            index === users.length - 1
                              ? "none"
                              : tdStyle.borderBottom,
                        }}
                      >
                        <div style={emailStyle}>{user.email}</div>
                      </td>

                      <td
                        style={{
                          ...tdStyle,
                          borderBottom:
                            index === users.length - 1
                              ? "none"
                              : tdStyle.borderBottom,
                        }}
                      >
                        <span style={roleBadgeStyle(user.role)}>{user.role}</span>
                      </td>

                      <td
                        style={{
                          ...tdStyle,
                          borderBottom:
                            index === users.length - 1
                              ? "none"
                              : tdStyle.borderBottom,
                        }}
                      >
                        <span style={phoneStyle}>{user.phone || "—"}</span>
                      </td>

                      <td
                        style={{
                          ...tdStyle,
                          borderBottom:
                            index === users.length - 1
                              ? "none"
                              : tdStyle.borderBottom,
                        }}
                      >
                        <div style={actionWrapStyle}>
                          <button
                            className="action-btn"
                            onClick={() => router.push(`/admin/users/edit/${user.id}`)}
                            style={editButtonStyle}
                          >
                            Edit
                          </button>

                          <button
                            className="action-btn"
                            onClick={() => dispatch(removeUser(user.id))}
                            style={deleteButtonStyle}
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="mobile-users-view">
            <div style={mobileCardsWrapStyle}>
              {users.map((user) => (
                <div
                  key={user.id}
                  className="mobile-user-card"
                  style={mobileCardStyle}
                >
                  <div
                    style={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      right: 0,
                      height: "4px",
                      background:
                        "linear-gradient(90deg, #111827 0%, #4b5563 50%, #d1d5db 100%)",
                    }}
                  />

                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      gap: "12px",
                      marginBottom: "14px",
                    }}
                  >
                    <div style={nameStyle}>{user.name}</div>
                    <span style={roleBadgeStyle(user.role)}>{user.role}</span>
                  </div>

                  <div style={mobileRowStyle}>
                    <span style={mobileLabelStyle}>ID</span>
                    <span style={mobileValueStyle}>{user.id}</span>
                  </div>

                  <div style={mobileRowStyle}>
                    <span style={mobileLabelStyle}>EMAIL</span>
                    <span style={mobileValueStyle}>{user.email}</span>
                  </div>

                  <div style={mobileRowStyle}>
                    <span style={mobileLabelStyle}>PHONE</span>
                    <span style={mobileValueStyle}>{user.phone || "—"}</span>
                  </div>

                  <div
                    style={{
                      ...actionWrapStyle,
                      marginTop: "14px",
                    }}
                  >
                    <button
                      className="action-btn"
                      onClick={() => router.push(`/admin/users/edit/${user.id}`)}
                      style={{ ...editButtonStyle, flex: 1 }}
                    >
                      Edit
                    </button>

                    <button
                      className="action-btn"
                      onClick={() => dispatch(removeUser(user.id))}
                      style={{ ...deleteButtonStyle, flex: 1 }}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      ) : (
        <div style={emptyStateStyle}>
          <h3
            style={{
              margin: "0 0 8px",
              fontSize: "20px",
              color: "#111827",
            }}
          >
            No users found
          </h3>
          <p style={{ margin: 0, fontSize: "14px" }}>
            User records will appear here once accounts are created.
          </p>
        </div>
      )}
    </div>
  );
}