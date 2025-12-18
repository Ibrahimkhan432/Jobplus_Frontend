import { useSelector } from "react-redux";

function ProfileCompletionBanner() {
    const { user } = useSelector((store: any) => store.auth);

    if (!user) return null;

    const profileFields = [
        user?.fullName,
        user?.email,
        user?.phoneNumber,
        user?.profile?.bio,
        user?.profile?.skills && user.profile.skills.length > 0,
        user?.profile?.resume,
        user?.profile?.profilePhoto,
    ];
    const filledFields = profileFields.filter(Boolean).length;
    const totalFields = profileFields.length;
    const completion = Math.round((filledFields / totalFields) * 100);

    if (completion === 100) return null;

    return (
        <div className="w-full bg-yellow-100 border-b border-yellow-400  px-4 shadow-md p-1">
            <div className="max-w-4xl mx-auto flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                    <span className="text-yellow-800 font-bold">
                        Profile {completion}% Complete 🎉
                    </span>
                    <p className="text-yellow-800 text-sm">
                        Complete your profile to get the best job matches and recommendations.
                    </p>
                </div>
                <a
                    href="/profile"
                    className="text-center bg-yellow-500 text-white font-semibold px-4  rounded-lg hover:bg-yellow-600 transition whitespace-nowrap"
                >
                    Complete Profile
                </a>
            </div>
        </div>
    );
}

export default ProfileCompletionBanner;
