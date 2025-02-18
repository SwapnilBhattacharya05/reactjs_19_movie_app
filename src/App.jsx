import { useState } from "react";
import Search from "./components/Search";

const App = () => {
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <main>
      <div className="pattern">
        <div className="wrapper">
          <header>
            <img src="/hero.png" alt="Hero Banner" />
            <h1>
              Find <span className="text-gradient">Movies</span> You'll Enjoy
              Without the Hassle
            </h1>
          </header>
          <p>
            <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
            <h1>{searchTerm}</h1>
          </p>
        </div>
      </div>
    </main>
  );
};

export default App;
