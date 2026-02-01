import TopBar from "../components/TopBar";

export default function CvPage({ theme, onToggleTheme, cvUrl }) {
  return (
    <div className="appShell">
      <TopBar
        name="CV"
        theme={theme}
        onToggleTheme={onToggleTheme}
        showNav={false}
      />

      <main className="content">
        <section className="section card sectionCard">
          <div className="cvHeader">
            <div className="cvTitle">
              <h2 className="sectionTitle">Curriculum Vitae</h2>
              <div className="muted">Preview</div>
            </div>

            <div className="cvActions" aria-label="CV actions">
              <a
                className="btnGhost"
                href={cvUrl}
                target="_blank"
                rel="noreferrer"
              >
                Open in new tab
              </a>
              <a className="btnPrimary" href={cvUrl} download>
                Download
              </a>
            </div>
          </div>

          <div className="cvFrameWrap">
            <iframe className="cvFrame" title="CV Preview" src={cvUrl} />
          </div>

          <p className="cvHint muted">
            If the preview is blocked, use <b>Open in new tab</b> or{" "}
            <b>Download</b>.
          </p>
        </section>
      </main>
    </div>
  );
}
