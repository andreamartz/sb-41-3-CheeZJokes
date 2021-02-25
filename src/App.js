import React from "react";
// import JokeList from "./JokeList";
import JokeListClassBased from "./JokeListClassBased";

function App() {
  return (
    <div className="App">
      {/*<JokeList />*/}
      <JokeListClassBased numJokesToGet={8}/>
    </div>
  );
}

export default App;
