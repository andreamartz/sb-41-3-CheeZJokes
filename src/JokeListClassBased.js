import React, { Component } from "react";
import axios from "axios";
// import Joke from "./Joke";
import JokeClassBased from "./JokeClassBased";
import "./JokeList.css";

class JokeListClassBased extends Component {
  static defaultProps = { numJokesToGet: 10 }
  constructor({ numJokesToGet }) {
    super({ numJokesToGet });
    this.jokesInitialState = [];
    this.state = { jokes: this.jokesInitialState };  // initial state for jokes
    this.generateNewJokes = this.generateNewJokes.bind(this);
    this.vote = this.vote.bind(this);
  }
 
  // method to empty the joke list (update state)
  generateNewJokes() {
    this.setState({ jokes: this.jokesInitialState });
  }

  /* method to change vote for this id by delta (+1 or -1) */
  vote(id, delta) {
    const allJokes = this.state.jokes.map(j => (j.id === id ? { ...j, votes: j.votes + delta} : j));
    this.setState( { jokes: [...allJokes] });
  }

  async getJokes() {
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
          console.error("duplicate found!");
        } 
      }
      this.setState({jokes: j})  // update state for jokes
    } catch (e) {
      console.log(e);
    }
  }

  componentDidMount() {
    if (this.state.jokes.length === 0) this.getJokes();
  }

  componentDidUpdate() {
    if (this.state.jokes.length === 0) this.getJokes();
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
            <JokeClassBased text={j.joke} key={j.id} id={j.id} votes={j.votes} vote={this.vote}/>
          ))}
        </div>
      );
    }

    return null;
  }
}

export default JokeListClassBased;

