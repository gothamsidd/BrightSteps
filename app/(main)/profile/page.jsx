import { checkUser } from "@/lib/checkUser";
import { redirect } from "next/navigation";
import ProfileForm from "./_components/profile-form";

export default async function ProfilePage() {
    const user = await checkUser();

    if (!user) {
        redirect("/login");
    }

    return (
        <div className="container mx-auto py-10 px-4">
            <h1 className="text-3xl font-bold mb-8 gradient-title">Your Profile</h1>
            <ProfileForm user={user} />
        </div>
    );
}
