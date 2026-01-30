import React, { useMemo, useState } from "react";
import { profile, posts } from "./data/profile";
import TopBar from "./components/TopBar";
import SideNav from "./components/SideNav";
import BottomNav from "./components/BottomNav";
import ProfilePage from "./pages/ProfilePage";
import PostModal from "./components/PostModal";

export default function App() {
  const [active, setActive] = useState("projects"); // projects | skills | contact
  const [selectedPost, setSelectedPost] = useState(null);

  const activeTitle = useMemo(() => {
    switch (active) {
      case "skills":
        return "Skills";
      case "profile":
        return "Overview";
      case "contact":
        return "Contact";
      default:
        return "Work";
    }
  }, [active]);

  return (
    <div className="appShell">
      <a className="skipLink" href="#main">
        Skip to content
      </a>

      <SideNav active={active} onChange={setActive} profile={profile} />

      <div className="mainArea">
        <TopBar
          title={activeTitle}
          username={profile.username}
          profile={profile}
        />

        <main id="main" className="content" tabIndex={-1}>
          <ProfilePage
            profile={profile}
            posts={posts}
            active={active}
            onChangeTab={setActive}
            onOpenPost={setSelectedPost}
          />
        </main>

        <BottomNav active={active} onChange={setActive} />
      </div>

      <PostModal post={selectedPost} onClose={() => setSelectedPost(null)} />
    </div>
  );
}
