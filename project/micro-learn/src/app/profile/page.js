import { Suspense } from "react";
import ClientProfilePage from "../../Components/ComponentsProfile/ProfilePageContent";

export default function ProfilePage() {
  return (
    <Suspense fallback={<div>Loading profile...</div>}>
      <ClientProfilePage />
    </Suspense>
  );
}
