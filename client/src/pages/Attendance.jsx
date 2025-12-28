import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import toast from "react-hot-toast";
import api from "../api/axios";

export default function Attendance() {
  const { id } = useParams(); // eventId

  const [eventName, setEventName] = useState("");
  const [users, setUsers] = useState([]);
  const [loadingUser, setLoadingUser] = useState(null);

  // Load event name
  const loadEvent = async () => {
    try {
      const res = await api.get(`/events/${id}`);
      setEventName(res.data.title);
    } catch {
      toast.error("Failed to load event");
    }
  };

  // Load registered users + attendance
  const loadUsers = async () => {
    try {
      const res = await api.get(`/attendance/${id}`);
      setUsers(res.data);
    } catch {
      toast.error("Failed to load users");
    }
  };

  useEffect(() => {
    loadEvent();
    loadUsers();
  }, [id]);

  // Mark a user as present
  const markPresent = async (userId) => {
    try {
      setLoadingUser(userId);

      await api.post(`/attendance/${id}/mark`, { userId });

      toast.success("Marked present");
      loadUsers();
    } catch {
      toast.error("Failed to mark present");
    } finally {
      setLoadingUser(null);
    }
  };

  // ✅ EXPORT ATTENDANCE TO EXCEL
  const exportExcel = async () => {
    try {
      const res = await api.get(`/export/attendance/${id}`, {
        responseType: "blob",
      });

      const blob = new Blob([res.data], {
        type:
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });

      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");

      link.href = url;
      link.download = "attendance.xlsx";
      document.body.appendChild(link);
      link.click();

      link.remove();
      window.URL.revokeObjectURL(url);

      toast.success("Attendance exported");
    } catch {
      toast.error("Failed to export attendance");
    }
  };

  return (
    <>
      <Navbar />

      <div className="p-6">
        {/* Event Name */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold">
            Attendance – {eventName || "Loading..."}
          </h2>

          {/* ✅ Export Button */}
          <button
            onClick={exportExcel}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
          >
            Export to Excel
          </button>
        </div>

        {users.map((user) => (
          <div
            key={user.id}
            className="flex justify-between items-center bg-white p-3 mb-2 rounded shadow"
          >
            <div>
              <div className="font-medium">{user.name}</div>
              <div className="text-xs text-gray-500">
                Status:{" "}
                <span
                  className={`font-semibold ${
                    user.present ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {user.present ? "Present" : "Absent"}
                </span>
              </div>
            </div>

            <button
              onClick={() => markPresent(user.id)}
              disabled={loadingUser === user.id || user.present}
              className={`px-3 py-1 rounded text-white text-sm ${
                user.present
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-green-600 hover:bg-green-700"
              }`}
            >
              {user.present ? "Already Marked" : "Mark Present"}
            </button>
          </div>
        ))}

        {users.length === 0 && (
          <div className="text-gray-500 mt-4">No registered users</div>
        )}
      </div>
    </>
  );
}
