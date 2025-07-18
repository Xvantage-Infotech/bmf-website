"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link"; // ✅ use this instead of 'wouter'
import { useAuth } from "@/contexts/AuthContext";
import ProfileEditDialog from "@/components/profile/ProfileEditDialog";
import { Pencil } from "lucide-react";
import { format } from "date-fns";
import { USER_PROFILE_IMAGE_BASE_URL } from "@/lib/utils";
import PublicPageLayout from "../Layout/PublicPageLayout";
import AuthModal from "@/components/auth/AuthModal";
import { useRouter } from "next/navigation";

export default function Profiles() {
  const { user, isAuthenticated, authInitialized } = useAuth();
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [modalDismissed, setModalDismissed] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (authInitialized && !isAuthenticated) {
      setAuthModalOpen(true);
    }
  }, [authInitialized, isAuthenticated]);

  useEffect(() => {
    if (modalDismissed && !user?.token) {
      router.push("/");
    }
  }, [modalDismissed, user]);

  // if (!authInitialized) return null;
  // if (!isAuthenticated && !authModalOpen) return null;

  const isLoading = !authInitialized || (!isAuthenticated && !authModalOpen);

  if (isLoading) {
    return (
      <PublicPageLayout>
        <div className="min-h-screen flex flex-col justify-center items-center bg-white">
          <img
            src="/bmflogofoot.svg"
            alt="Book My Farm Logo"
            className="w-40 h-40 md:w-60 md:h-60 animate-pulse mb-6"
          />
          <p className="text-neutral-500 text-sm animate-pulse">
            Loading your profile...
          </p>
        </div>
      </PublicPageLayout>
    );
  }

  return (
    <PublicPageLayout>
      <div className="max-w-md mx-auto py-10 px-4">
        {/* Profile Card */}
        <div className="flex flex-col items-center bg-white rounded-2xl shadow p-6 mb-8 relative">
          <button
            onClick={() => setIsEditDialogOpen(true)}
            className="absolute top-4 right-4 p-2 bg-primary/10 rounded-full hover:bg-primary/20 transition-colors"
            aria-label="Edit Profile"
          >
            <Pencil className="h-5 w-5 text-primary" />
          </button>

          {user?.profile_image ? (
            <img
              src={`${USER_PROFILE_IMAGE_BASE_URL}/${user.profile_image}`}
              alt="Profile"
              className="w-24 h-24 rounded-full object-cover mb-4 border-4 border-primary"
            />
          ) : (
            <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center mb-4 border-4 border-primary">
              <span className="text-2xl font-bold text-primary">
                {user?.name?.charAt(0)?.toUpperCase() || "U"}
              </span>
            </div>
          )}

          <h2 className="text-xl font-bold mb-1">{user?.name}</h2>
          <p className="text-neutral-600 mb-2">
            {user?.city || "No location set"}
          </p>

          <div className="w-full text-left space-y-2 mt-4">
            <div>
              <span className="font-medium">Email:</span>{" "}
              {user?.email || "Not provided"}
            </div>
            <div>
              <span className="font-medium">Phone:</span>{" "}
              {user?.phone_number || "Not provided"}
            </div>
            <div>
              <span className="font-medium">DOB:</span>{" "}
              {user?.date_of_birth
                ? format(new Date(user.date_of_birth), "PPP")
                : "Not provided"}
            </div>
            <div>
              <span className="font-medium">Address:</span>{" "}
              {user?.street || "Not provided"}
            </div>
          </div>
        </div>

        {/* Edit Dialog */}
        <ProfileEditDialog
          isOpen={isEditDialogOpen}
          onClose={() => setIsEditDialogOpen(false)}
        />

        {/* Partner Section */}
        <div className="bg-primary/5 rounded-2xl p-6 text-center">
          <h3 className="text-lg font-semibold mb-2 text-primary">
            Partner with Us
          </h3>
          <p className="text-neutral-700 mb-4">
            List your property and start earning, or manage your existing
            listings.
          </p>

          {user?.is_owner ? (
            <Link href="/owner/bookings">
              <Button className="w-full bg-primary text-white hover:bg-primary/90">
                Go to Owner Dashboard
              </Button>
            </Link>
          ) : (
            <Link href="/owner/register">
              <Button className="w-full bg-primary text-white hover:bg-primary/90">
                Register Your Farm
              </Button>
            </Link>
          )}
        </div>
      </div>

      {/* Auth Modal */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => {
          setAuthModalOpen(false);
          setModalDismissed(true);
        }}
      />
    </PublicPageLayout>
  );
}
