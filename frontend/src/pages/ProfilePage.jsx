import { useState } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { Camera, CircleAlert, Copy, Lock, Mail, Pencil, Send, User } from "lucide-react";
import toast from "react-hot-toast";

const ProfilePage = () => {
  const { authUser, isUpdatingProfile, updateProfile } = useAuthStore();
  const [selectedImg, setSelectedImg] = useState(null);
  const storedSecretKey = localStorage.getItem(`secretKey-${authUser.email}`);
  const [secretKey, setSecretKey] = useState(storedSecretKey || "");
  const [isEditing, setIsEditing] = useState(!storedSecretKey); 

  const saveSecretKey = () => {
    if (!secretKey.trim()) {
      toast.error("Secret key cannot be empty");
      return;
    }
    localStorage.setItem(`secretKey-${authUser.email}`, secretKey);
    setIsEditing(false);
    toast.success("Secret key saved");
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();

    reader.readAsDataURL(file);

    reader.onload = async () => {
      const base64Image = reader.result;
      setSelectedImg(base64Image);
      await updateProfile({ profilePic: base64Image });
    };
  };

  return (
    <div className="min-h-screen pt-20">
      <div className="max-w-2xl mx-auto p-4 py-8">
        <div className="bg-base-300 rounded-xl p-6 space-y-8">
          <div className="text-center">
            <h1 className="text-2xl font-semibold ">Profile</h1>
            <p className="mt-2">Your profile information</p>
          </div>

          {/* avatar upload section */}

          <div className="flex flex-col items-center gap-4">
            <div className="relative">
              <img
                src={selectedImg || authUser.profilePic || "/avatar.png"}
                alt="Profile"
                className="size-32 rounded-full object-cover border-4 "
              />
              <label
                htmlFor="avatar-upload"
                className={`
                  absolute bottom-0 right-0 
                  bg-base-content hover:scale-105
                  p-2 rounded-full cursor-pointer 
                  transition-all duration-200
                  ${isUpdatingProfile ? "animate-pulse pointer-events-none" : ""}
                `}
              >
                <Camera className="w-5 h-5 text-base-200" />
                <input
                  type="file"
                  id="avatar-upload"
                  className="hidden"
                  accept="image/*"
                  onChange={handleImageUpload}
                  disabled={isUpdatingProfile}
                />
              </label>
            </div>
            <p className="text-sm text-zinc-400">
              {isUpdatingProfile ? "Uploading..." : "Click the camera icon to update your photo"}
            </p>
          </div>

          <div className="space-y-6">
            <div className="space-y-1.5">
              <div className="text-sm text-zinc-400 flex items-center gap-2">
                <User className="w-4 h-4" />
                Full Name
              </div>
              <p className="px-4 py-2.5 bg-base-200 rounded-lg border">{authUser?.fullName}</p>
            </div>

            <div className="space-y-1.5">
              <div className="text-sm text-zinc-400 flex items-center gap-2">
                <Mail className="w-4 h-4" />
                Email Address
              </div>
              <p className="px-4 py-2.5 bg-base-200 rounded-lg border">{authUser?.email}</p>
            </div>
            <div className="space-y-1.5">
            <div className="text-sm text-zinc-400 flex items-center gap-2">
              <Lock className="w-4 h-4" />
              Secret Key
            </div>

            {isEditing ? (
              <div className="px-4 py-2.5 bg-base-200 rounded-lg border flex justify-between items-center h-10">
                <input
                  type="text"
                  className="w-full outline-none focus:ring-0 bg-transparent"
                  value={secretKey}
                  onChange={(e) => setSecretKey(e.target.value)}
                  placeholder="Enter secret key"
                />
                <Send
                  className="w-5 h-5 text-blue-500 cursor-pointer hover:scale-105 transition"
                  onClick={saveSecretKey}
                />
              </div>
            ) : (
              <div className="px-4 py-2.5 bg-base-200 rounded-lg border flex justify-between items-center">
                <p className="select-all">{secretKey}</p>
                <div className="flex items-center gap-3">
                  <Copy
                    className="w-4 h-4 cursor-pointer hover:text-blue-500"
                    onClick={() =>
                      navigator.clipboard.writeText(secretKey).then(() => toast.success("Copied to clipboard"))
                    }
                  />
                  <Pencil
                    className="w-4 h-4 cursor-pointer hover:text-yellow-500"
                    onClick={() => setIsEditing(true)}
                  />
                </div>
              </div>
            )}
          </div>
          </div>

          <div className="mt-6 bg-base-300 rounded-xl p-6">
            <h2 className="text-lg font-medium  mb-4">Account Information</h2>
            <div className="space-y-3 text-sm">
              <div className="flex items-center justify-between py-2 border-b border-zinc-700">
                <span>Member Since</span>
                <span>{authUser.createdAt?.split("T")[0]}</span>
              </div>
              <div className="flex items-center justify-between py-2">
                <span>Account Status</span>
                <span className="text-green-500">Active</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default ProfilePage;
