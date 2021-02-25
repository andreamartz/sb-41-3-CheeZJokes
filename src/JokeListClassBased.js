import React, { Component } from "react";
import axios from "axios";
import Joke from "./Joke";
import "./JokeList.css";

class JokeList extends Component {
  static defaultProps = {numJokesToGet: 10}
  constructor({ numJokesToGet }) {
    super({ numJokesToGet });
    this.state = {jokes: []};  // initial state for jokes
    this.generateNewJokes = this.generateNewJokes.bind(this);
  }

  // method to empty the joke list (update state)
  generateNewJokes() {
    this.setState({ jokes: [] });
  }

  /* method to change vote for this id by delta (+1 or -1) */
  // vote(id, delta) {

  // }

  async componentDidMount() {
    let j = [...this.state.jokes];
    let seenJokes = new Set();
    try {
      while (j.length < this.props.numJokesToGet) {
        let res = await axios.get("https://icanhazdadjoke.com", {
          headers: { Accept: "application/json" }
        });
        let { status, ...jokeObj } = res.data;
  
        if (!seenJokes.has(jokeObj.id)) {
          seenJokes.add(jokeObj.id);
          j.push({ ...jokeObj, votes: 0 });
        } else {
          console.error("duplate found!");
        } 
      }
      this.setState({jokes: j})  // update state for jokes
    } catch (e) {
      console.log(e);
    }
  }

  async componentDidUpdate() {

  }
  
  render() {
    if (this.state.jokes.length) {
      let sortedJokes = [...this.state.jokes].sort((a, b) => b.votes - a.votes);
      return (
        <div className="JokeList">
          <button className="JokeList-getmore" onClick={this.generateNewJokes}>
            Get New Jokes
          </button>

          {sortedJokes.map(j => (
            <Joke text={j.joke} key={j.id} id={j.id} votes={j.votes} />
          ))}
        </div>
      );
    }

    return null;
  }
}

export default JokeList;
