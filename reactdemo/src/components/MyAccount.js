import React, { Component } from "react";
import {
  FaUser,
  FaAddressCard,
  FaPhone,
  FaEnvelope,
  FaBirthdayCake,
} from "react-icons/fa";
import { toast } from "react-toastify";
import "../css/MyAccount.css";
import HomePage from "./HomePage";

export default class MyAccount extends Component {
  state = {
    firstName: "",
    lastName: "",
    age: "",
    gender: "",
    address: "",
    phoneNumber: "",
    email: "", // Add email to the state
  };

  componentDidMount() {
    // Fetch user profile details from backend API
    const userId = localStorage.getItem("userId");
    const firstName = localStorage.getItem("firstName");
    const lastName = localStorage.getItem("lastName");
    const email = localStorage.getItem("userEmail");

    if (firstName && lastName) {
      this.setState({ firstName });
      this.setState({ lastName });
      this.setState({ email });
    }
    console.log("fullName :", firstName + " " + lastName);
    console.log("userId :", userId);
    this.setState({ userId }); // Set userId in the state
    this.fetchUserProfile(userId);
  }

  fetchUserProfile = async (userId) => {
    try {
      const response = await fetch(
        process.env.REACT_APP_API_URL + `user/profile/${userId}`
      );

      console.log("RES", response);
      if (response.ok) {
        const userData = await response.json();
        // Update state with user profile details
        this.setState({
          firstName: userData.firstName,
          lastName: userData.lastName,
          address: userData.address,
          phoneNumber: userData.phoneNumber,
          email: userData.email, // Set the email from the response
          age: userData.age,
          gender: userData.gender,
        });
      } else if (response.status === 404) {
        // Handle case where user profile is not found
        console.error("User profile not found");
        toast.error("User profile not found");
      } else {
        // Handle error scenario`

        console.error("Failed to fetch user profile");
        toast.error("Failed to fetch user profile");
      }
    } catch (error) {
      console.error("Error fetching user profile:", error);
      toast.error("Error fetching user profile");
    }
  };

  handleUpdateProfile = async () => {
    // Prepare the updated profile data
    const { userId } = this.state;
    const updatedProfileData = {
      firstName: this.state.firstName,
      lastName: this.state.lastName,
      address: this.state.address,
      phoneNumber: this.state.phoneNumber,
      email: this.state.email,
      age: this.state.age,
      gender: this.state.gender,
    };

    try {
      const response = await fetch(
        process.env.REACT_APP_API_URL + `user/profile/update/${userId}`,
        {
          method: "PUT",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedProfileData),
        }
      );
      console.log("Update", response);
      if (response.ok) {
        const userId = localStorage.getItem("userId");
        this.fetchUserProfile(userId);
        toast.success("Profile updated successfully");
      } else {
        // Handle error scenario
        console.error("Failed to update user profile");
        toast.error("Failed to update user profile");
      }
    } catch (error) {
      console.error("Error updating user profile:", error);
      toast.error("Error updating user profile");
    }
  };

  render() {
    return (
      <diV>
        <div className="my-account-container">
          <h2>My Account</h2>
          <div className="profile-details">
            <div className="profile-item">
              <FaUser />
              <input
                type="text"
                value={this.state.firstName}
                onChange={(e) => this.setState({ firstName: e.target.value })}
                placeholder="First Name"
              />
              <input
                type="text"
                value={this.state.lastName}
                onChange={(e) => this.setState({ lastName: e.target.value })}
                placeholder="Last Name"
              />
            </div>
            <div className="profile-item">
              <FaAddressCard />
              <input
                type="text"
                value={this.state.address}
                onChange={(e) => this.setState({ address: e.target.value })}
                placeholder="Address"
              />
            </div>
            <div className="profile-item">
              <FaPhone />
              <input
                type="text"
                value={this.state.phoneNumber}
                onChange={(e) => this.setState({ phoneNumber: e.target.value })}
                placeholder="Phone Number"
              />
              <FaBirthdayCake />
              <input
                type="text"
                value={this.state.age}
                onChange={(e) => this.setState({ age: e.target.value })}
                placeholder="Age"
              />
            </div>
            <div className="profile-item">
              <FaUser />
              <select
                value={this.state.gender}
                onChange={(e) => this.setState({ gender: e.target.value })}
              >
                <option value="">Select Gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
              </select>
            </div>
            <div className="profile-item">
              <FaEnvelope />
              <input
                type="email"
                value={this.state.email}
                readOnly // Make the email input read-only
                placeholder="Email"
              />
            </div>
          </div>
          <button
            className="update-profile-btn"
            onClick={this.handleUpdateProfile}
          >
            Update Profile
          </button>
        </div>
      </diV>
    );
  }
}
