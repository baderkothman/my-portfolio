import React, { useMemo, useState } from "react";
import { profile, posts } from "./data/profile";
import TopBar from "./components/TopBar";
import SideNav from "./components/SideNav";
import BottomNav from "./components/BottomNav";
import ProfilePage from "./pages/ProfilePage";
import PostModal from "./components/PostModal";

export default function App() {
  const [active, setActive] = useState("profile"); // profile | projects | skills | contact
  const [selectedPost, setSelectedPost] = useState(null);

  const activeTitle = useMemo(() => {
    switch (active) {
      case "projects":
        return "Projects";
      case "skills":
        return "Skills";
      case "contact":
        return "Contact";
      default:
        return "Profile";
    }
  }, [active]);

  return (
    <div className="appShell">
      {/* Desktop sidebar */}
      <SideNav active={active} onChange={setActive} profile={profile} />

      {/* Main */}
      <div className="mainArea">
        {/* Mobile top bar */}
        <TopBar title={activeTitle} username={profile.username} />

        <main className="content">
          <ProfilePage
            profile={profile}
            posts={posts}
            active={active}
            onChangeTab={setActive}
            onOpenPost={setSelectedPost}
          />
        </main>

        {/* Mobile bottom nav */}
        <BottomNav active={active} onChange={setActive} />
      </div>

      {/* Post details modal */}
      <PostModal post={selectedPost} onClose={() => setSelectedPost(null)} />
    </div>
  );
}
