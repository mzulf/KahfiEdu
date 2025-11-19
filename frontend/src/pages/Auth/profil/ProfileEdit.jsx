import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiEdit } from "react-icons/fi";

const ProfileEdit = () => {
  const navigate = useNavigate();

  const initialUserData = {
    name: "John Bee",
    class: "Kelas 2",
    username: "John",
    phone: "+62 8123 456 78",
    email: "siswa@gmail.com",
    gender: "Male",
    birthDate: "2 Jan 2015",
    password: "********",
    address: "Kab. Kuta, Bali, Indonesia"
  };

  const [userData, setUserData] = useState(initialUserData);
  const [isEditing, setIsEditing] = useState(true);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCancel = () => {
    setIsEditing(false);
    navigate(-1);
  };

  const handleSave = () => {
    setIsEditing(false);
    navigate("/siswa/profile-detail");
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      {/* Main Content */}
      <main className="max-w-2xl mx-auto p-4">
        <div className="bg-white rounded-xl p-6 mt-4">
          {/* User Profile */}
          <div className="flex flex-col items-center mb-8">
            <div className="relative mb-4">
              <img
                src="https://cdn-icons-png.flaticon.com/512/4333/4333609.png"
                alt="Profile"
                className="w-28 h-28 rounded-full bg-blue-100"
              />
              <div className="absolute bottom-0 right-0 bg-black text-white rounded-full p-1">
                <FiEdit className="text-sm" />
              </div>
            </div>
            <h2 className="text-xl font-semibold">{userData.name}</h2>
            <p className="text-sm text-gray-600">{userData.class}</p>
          </div>

          {/* User Information */}
          <div className="space-y-4">
            {[
              { label: "Username", name: "username" },
              { label: "No. Telp", name: "phone" },
              { label: "Email", name: "email" },
              { label: "Gender", name: "gender" },
              { label: "Tanggal lahir", name: "birthDate" },
              { label: "Password", name: "password", type: "password" },
              { label: "Alamat", name: "address" }
            ].map(({ label, name, type }) => (
              <div key={name} className="border-b pb-2">
                <div className="flex justify-between items-center">
                  <div className="text-sm text-gray-600">{label}</div>
                  {isEditing && name !== "email" ? (
                    <input
                      type={type || "text"}
                      name={name}
                      value={userData[name]}
                      onChange={handleChange}
                      className={`text-right w-full px-2 py-1 ${name === "email" ? "text-gray-500" : ""}`}
                      disabled={name === "email"} // Email is not editable in design
                    />
                  ) : (
                    <div className="text-right">
                      {name === "email" ? (
                        <a href={`mailto:${userData.email}`} className="text-blue-600">
                          {userData.email}
                        </a>
                      ) : (
                        userData[name]
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="mt-8 flex justify-center gap-4">
            <button
              onClick={handleCancel}
              className="px-6 py-2 border border-gray-300 rounded-md hover:bg-gray-100 transition"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition"
            >
              Save
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ProfileEdit;