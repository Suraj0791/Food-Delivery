import {
  Loader2,
  LocateIcon,
  Mail,
  MapPin,
  MapPinnedIcon,
  Plus,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { FormEvent, useRef, useState, useEffect } from "react";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Button } from "./ui/button";
import axios from "axios";

const Profile = () => {
  const [profileData, setProfileData] = useState({
    fullname: "",
    email: "",
    address: "",
    city: "",
    country: "",
    profilePicture: "",
  });

  const imageRef = useRef<HTMLInputElement | null>(null);
  const [selectedProfilePicture, setSelectedProfilePicture] = useState<string>("");
  const [loading, setLoading] = useState(false);

  // Fetch profile data when the component mounts
  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        setLoading(true);
        const response = await axios.get("http://localhost:3000/api/v1/user/profile"); // Adjust the endpoint as needed
        setProfileData(response.data);
        setSelectedProfilePicture(response.data.profilePicture);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching profile data:", error);
        setLoading(false);
      }
    };

    fetchProfileData();
  }, []);

  const fileChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setSelectedProfilePicture(result);
        setProfileData((prevData) => ({
          ...prevData,
          profilePicture: result,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfileData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      setLoading(true);
      await axios.put("/api/profile", profileData); // Adjust the endpoint as needed
      setLoading(false);
      alert("Profile updated successfully!");
    } catch (error) {
      console.error("Error updating profile:", error);
      setLoading(false);
    }
  };

  return (
    <div className="profile-section">
      <h1 className="text-2xl font-bold mb-4">Profile</h1>
      {loading ? (
        <Loader2 className="animate-spin" />
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label>Full Name</Label>
            <Input
              type="text"
              name="fullname"
              value={profileData.fullname}
              onChange={handleChange}
              placeholder="Enter your full name"
              required
            />
          </div>
          <div>
            <Label>Email</Label>
            <Input
              type="email"
              name="email"
              value={profileData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              required
            />
          </div>
          <div>
            <Label>Contact</Label>
            <Input
              type="text"
              name="contact"
              value={profileData.contact}
              onChange={handleChange}
              placeholder="Enter your contact number"
              required
            />
          </div>
          <div>
            <Label>Address</Label>
            <Input
              type="text"
              name="address"
              value={profileData.address}
              onChange={handleChange}
              placeholder="Enter your address"
              required
            />
          </div>
          <div>
            <Label>City</Label>
            <Input
              type="text"
              name="city"
              value={profileData.city}
              onChange={handleChange}
              placeholder="Enter your city"
              required
            />
          </div>
          <div>
            <Label>State</Label>
            <Input
              type="text"
              name="state"
              value={profileData.state}
              onChange={handleChange}
              placeholder="Enter your state"
              required
            />
          </div>
          <div>
            <Label>Zip Code</Label>
            <Input
              type="text"
              name="zipCode"
              value={profileData.zipCode}
              onChange={handleChange}
              placeholder="Enter your zip code"
              required
            />
          </div>
          <div>
            <Label>Country</Label>
            <Input
              type="text"
              name="country"
              value={profileData.country}
              onChange={handleChange}
              placeholder="Enter your country"
              required
            />
          </div>
          <div>
            <Label>Profile Picture</Label>
            <input
              type="file"
              ref={imageRef}
              onChange={fileChangeHandler}
              accept="image/*"
              className="hidden"
            />
            <Avatar className="w-24 h-24">
              <AvatarImage src={selectedProfilePicture} alt="Profile Picture" />
              <AvatarFallback>Profile</AvatarFallback>
            </Avatar>
            <Button type="button" onClick={() => imageRef.current?.click()}>
              Upload Picture
            </Button>
          </div>
          <Button type="submit" className="bg-blue-500 hover:bg-blue-700" disabled={loading}>
            {loading ? <Loader2 className="animate-spin" /> : "Update Profile"}
          </Button>
        </form>
      )}
    </div>
  );
};

export default Profile;