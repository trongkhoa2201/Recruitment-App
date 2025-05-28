import React, { useState, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../store/hook";
import { fetchJobLogs } from "../features/jobs/jobLogSlice";

const NotificationJobLog: React.FC = () => {
  const dispatch = useAppDispatch();
  const { logs, loading } = useAppSelector((state) => state.jobLog);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (open) {
      dispatch(fetchJobLogs());
    }
  }, [open, dispatch]);

  return (
    <div
      style={{
        position: "relative",
        display: "inline-block",
        textAlign: "left",
      }}
    >
      {/* Notification Button */}
      <button
        onClick={() => setOpen(!open)}
        style={{
          padding: "8px 16px",
          backgroundColor: "#f8f9fa",
          border: "none",
          borderRadius: "4px",
          cursor: "pointer",
          transition: "background-color 0.2s",
        }}
        onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "#e5e7eb")}
        onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "#f3f4f6")}
      >
        Notifications
      </button>

      {/* Dropdown Menu */}
      {open && (
        <div
          style={{
            position: "absolute",
            right: 0,
            top: "100%",
            marginTop: "8px",
            width: "300px",
            backgroundColor: "#ffffff",
            border: "1px solid #e5e7eb",
            borderRadius: "4px",
            boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
            zIndex: 50,
          }}
        >
          {/* Notification List with Scroll */}
          <div style={{ maxHeight: "240px", overflowY: "auto", width: "100%" }}>
            {loading ? (
              <div
                style={{
                  padding: "8px 12px",
                  color: "#6b7280",
                  fontSize: "14px",
                }}
              >
                Loading...
              </div>
            ) : logs.length === 0 ? (
              <div
                style={{
                  padding: "8px 12px",
                  color: "#6b7280",
                  fontSize: "14px",
                }}
              >
                No notifications
              </div>
            ) : (
              <ul style={{ listStyleType: "none", padding: 0, margin: 0 }}>
                {logs.map((log, index) => (
                  <li
                    key={log._id}
                    style={{
                      padding: "8px 12px",
                      borderBottom:
                        index === logs.length - 1
                          ? "none"
                          : "1px solid #e5e7eb",
                    }}
                  >
                    <p
                      style={{ color: "#374151", fontSize: "14px", margin: 0 }}
                    >
                      {log.description}
                    </p>
                    <p
                      style={{
                        color: "#6b7280",
                        fontSize: "12px",
                        margin: "2px 0 0",
                      }}
                    >
                      {new Date(log.timestamp).toLocaleTimeString()}
                    </p>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationJobLog;
