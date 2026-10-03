import About from "../sections/about";
import Publications from "../sections/publications";
import Updates from "../sections/updates";

function Home({ activeTheme, initialState = {} }) {
  return (
    <main className="custom-container" style={{ marginTop: "2rem" }}>
      <About activeTheme={activeTheme} initialPhdYearLabel={initialState.phdYearLabel} />
      <Publications initialItems={initialState.content?.publications} />
      <Updates initialContent={initialState.content} />
    </main>
  );
}

export default Home;
