import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/api";
import "./MyProfile.css";

function MyProfile() {
    const navigate = useNavigate();
    const fileInputRef = useRef(null);

    const [profile, setProfile] = useState(null);
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [uploading, setUploading] = useState(false);

    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    // ==============================
    // LOAD PROFILE
    // ==============================
    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            const response = await api.get("/profile/me");

            setProfile(response.data);
            setName(response.data.name || "");
            setEmail(response.data.email || "");

        } catch (error) {
            console.error("Could not load profile:", error);
            setError("Could not load your profile. Please try again.");

        } finally {
            setLoading(false);
        }
    };

    // ==============================
    // SAVE PROFILE CHANGES
    // ==============================
    const handleSubmit = async (e) => {
        e.preventDefault();

        setMessage("");
        setError("");
        setSaving(true);

        try {
            const response = await api.put("/profile/me", {
                name: name,
                email: email
            });

            setProfile((previous) => ({
                ...previous,
                ...response.data
            }));

            setName(response.data.name);
            setEmail(response.data.email);

            // Update stored email
            localStorage.setItem("email", response.data.email);

            setMessage("Profile updated successfully.");

            // Go to dashboard after successful save
            setTimeout(() => {
                navigate("/dashboard");
            }, 800);

        } catch (error) {
            console.error("Could not update profile:", error);

            if (error.response) {
                setError(
                    error.response.data?.message ||
                    error.response.data ||
                    "Could not update your profile."
                );
            } else {
                setError("Could not connect to the backend.");
            }

        } finally {
            setSaving(false);
        }
    };

    // ==============================
    // OPEN PHOTO SELECTOR
    // ==============================
    const handlePhotoClick = () => {
        fileInputRef.current?.click();
    };

    // ==============================
    // UPLOAD PROFILE PHOTO
    // ==============================
    const handlePhotoChange = async (e) => {
        const file = e.target.files?.[0];

        if (!file) {
            return;
        }

        setMessage("");
        setError("");

        // Check image type
        if (
            ![
                "image/jpeg",
                "image/png",
                "image/webp"
            ].includes(file.type)
        ) {
            setError("Only JPG, PNG and WEBP images are allowed.");
            e.target.value = "";
            return;
        }

        // Check image size
        if (file.size > 5 * 1024 * 1024) {
            setError("Image size must be less than 5 MB.");
            e.target.value = "";
            return;
        }

        setUploading(true);

        try {
            const formData = new FormData();

            formData.append("file", file);

            const token = localStorage.getItem("token");

            const response = await fetch(
                "http://localhost:8080/api/profile/me/photo",
                {
                    method: "POST",

                    headers: {
                        Authorization: `Bearer ${token}`
                    },

                    body: formData
                }
            );

            if (!response.ok) {
                const errorText = await response.text();

                throw new Error(
                    errorText || "Photo upload failed."
                );
            }

            const updatedProfile = await response.json();

            // Update profile with new photo
            setProfile(updatedProfile);

            setMessage(
                "Profile photo updated successfully."
            );

            // IMPORTANT:
            // Do NOT navigate to dashboard here.
            // Employee should remain on My Profile after
            // changing the photo.

        } catch (error) {
            console.error(
                "Could not upload profile photo:",
                error
            );

            setError(
                error.message ||
                "Could not upload your profile photo."
            );

        } finally {
            setUploading(false);

            // Reset file input
            e.target.value = "";
        }
    };

    // ==============================
    // PROFILE PHOTO URL
    // ==============================
    const getProfilePhotoUrl = () => {
        if (!profile?.profilePhotoUrl) {
            return null;
        }

        return `http://localhost:8080${profile.profilePhotoUrl}`;
    };

    // ==============================
    // LOADING SCREEN
    // ==============================
    if (loading) {
        return (
            <div className="profile-page">

                <div className="profile-loading">

                    <div className="loading-spinner"></div>

                    <h2>Loading profile...</h2>

                    <p>Please wait.</p>

                </div>

            </div>
        );
    }

    // ==============================
    // PROFILE PAGE
    // ==============================
    return (
        <div className="profile-page">

            <div className="profile-container">

                {/* HEADER */}
                <header className="profile-header">

                    <div>

                        <button
                            className="profile-back-button"
                            onClick={() =>
                                navigate("/dashboard")
                            }
                        >
                            ← Dashboard
                        </button>

                        <h1>My Profile</h1>

                        <p>
                            Manage your personal information
                        </p>

                    </div>

                </header>


                {/* PROFILE CARD */}
                <div className="profile-card">

                    {/* PROFILE SUMMARY */}
                    <div className="profile-summary">

                        {/* PHOTO */}
                        <div className="profile-photo-section">

                            {getProfilePhotoUrl() ? (

                                <img
                                    src={getProfilePhotoUrl()}
                                    alt="Profile"
                                    className="profile-avatar profile-avatar-image"
                                />

                            ) : (

                                <div className="profile-avatar">

                                    {(profile?.name || "U")
                                        .charAt(0)
                                        .toUpperCase()}

                                </div>

                            )}


                            {/* CHANGE PHOTO BUTTON */}
                            <button
                                type="button"
                                className="change-photo-button"
                                onClick={handlePhotoClick}
                                disabled={uploading}
                            >

                                {uploading
                                    ? "Uploading..."
                                    : "Change Photo"}

                            </button>


                            {/* HIDDEN FILE INPUT */}
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/jpeg,image/png,image/webp"
                                onChange={handlePhotoChange}
                                style={{
                                    display: "none"
                                }}
                            />

                        </div>


                        {/* USER INFORMATION */}
                        <div className="profile-summary-info">

                            <h2>
                                {profile?.name}
                            </h2>

                            <p>
                                {profile?.email}
                            </p>

                            <span className="profile-role">
                                {profile?.role}
                            </span>

                        </div>

                    </div>


                    {/* SUCCESS MESSAGE */}
                    {message && (
                        <div className="profile-success">

                            {message}

                        </div>
                    )}


                    {/* ERROR MESSAGE */}
                    {error && (
                        <div className="profile-error">

                            {error}

                        </div>
                    )}


                    {/* PROFILE FORM */}
                    <form
                        className="profile-form"
                        onSubmit={handleSubmit}
                    >

                        {/* NAME */}
                        <div className="profile-form-group">

                            <label htmlFor="name">
                                Full Name
                            </label>

                            <input
                                id="name"
                                type="text"
                                value={name}
                                onChange={(e) =>
                                    setName(e.target.value)
                                }
                                placeholder="Enter your full name"
                                required
                            />

                        </div>


                        {/* EMAIL */}
                        <div className="profile-form-group">

                            <label htmlFor="email">
                                Email Address
                            </label>

                            <input
                                id="email"
                                type="email"
                                value={email}
                                onChange={(e) =>
                                    setEmail(e.target.value)
                                }
                                placeholder="Enter your email"
                                required
                            />

                        </div>


                        {/* ROLE */}
                        <div className="profile-form-group">

                            <label>
                                Role
                            </label>

                            <input
                                type="text"
                                value={
                                    profile?.role ||
                                    "EMPLOYEE"
                                }
                                disabled
                            />

                            <small>
                                Your role can only be changed
                                by an administrator.
                            </small>

                        </div>


                        {/* BUTTONS */}
                        <div className="profile-form-actions">

                            <button
                                type="button"
                                className="profile-cancel-button"
                                onClick={() =>
                                    navigate("/dashboard")
                                }
                            >
                                Cancel
                            </button>


                            <button
                                type="submit"
                                className="profile-save-button"
                                disabled={saving}
                            >

                                {saving
                                    ? "Saving..."
                                    : "Save Changes"}

                            </button>

                        </div>

                    </form>

                </div>

            </div>

        </div>
    );
}

export default MyProfile;