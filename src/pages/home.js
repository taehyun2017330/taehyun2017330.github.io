import About from "../sections/about";
import Publications from "../sections/publications";
import Updates from "../sections/updates";

function Home() {
  return (
    <div className="custom-container" style={{ marginTop: "2rem" }}>
      <About />
      <Publications />
      <Updates />
    </div>
  );
}

export default Home;
