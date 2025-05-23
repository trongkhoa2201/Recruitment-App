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
    <div className="position-relative inline-block text-left">
      {/* Notification Button */}
      <button
        onClick={() => setOpen(!open)}
        className="px-4 py-1 bg-gray-100 border border-none text-black font-medium hover:bg-gray-200 transition-colors"
        style={{ borderRadius: "4px" }}
      >
        Notifications

      </button>

      {/* Dropdown Menu */}
      {open && (
        <div
          className="position-absolute right-0 mt-2 w-64 bg-white border border-gray-300 z-500"
          style={{ borderRadius: "4px" }}
        >
          {/* Notification List with Scroll */}
          <div className="max-h-60 overflow-y-auto">
            {loading ? (
              <div className="px-2 py-1 text-gray-500">Loading...</div>
            ) : logs.length === 0 ? (
              <div className="px-2 py-1 text-gray-500">No notifications</div>
            ) : (
              <ul>
                {logs.map((log) => (
                  <li
                    key={log._id}
                    className="px-2 py-1 border-b border-gray-100 text-sm"
                  >
                    <p className="text-gray-700">
                      {log.action}: {log.description}
                    </p>
                    <p className="text-xs text-gray-500">
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
