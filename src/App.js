import React from "react";
import Die from "./components/Die";
import NumRolls from "./components/NumRolls";
import HighScore from "./components/HighScore";
import { nanoid } from "nanoid";
import Confetti from "react-confetti";

function App() {
  const [dice, setDice] = React.useState(allNewDice);
  const [tenzies, setTenzies] = React.useState(false);
  const [roll, setRoll] = React.useState(0);
  const [highScore, setHighScore] = React.useState(
    Number(JSON.parse(localStorage.getItem("highscore"))) || 0
  );

  React.useEffect(() => {
    const allHeld = dice.every((die) => die.isHeld);
    const firstValue = dice[0].value;
    const allSameValue = dice.every((die) => die.value === firstValue);

    if (allHeld && allSameValue) {
      setTenzies(true);
    }
  }, [dice]);

  function generateNewDie() {
    return {
      value: Math.ceil(Math.random() * 6),
      isHeld: false,
      id: nanoid(),
    };
  }

  function allNewDice() {
    const newDice = [];
    for (let i = 0; i < 10; i++) {
      newDice.push(generateNewDie());
    }
    return newDice;
  }

  function handleRoll() {
    if (!tenzies) {
      setDice((oldDice) =>
        oldDice.map((die) => {
          return die.isHeld ? die : generateNewDie();
        })
      );
      setRoll((prevState) => (prevState += 1));
    } else {
      setTenzies(false);
      setDice(allNewDice());
      setRoll(0);
      renderHighScore();
    }
  }

  function holdDice(id) {
    setDice((oldDice) =>
      oldDice.map((die) => {
        return die.id === id ? { ...die, isHeld: !die.isHeld } : die;
      })
    );
  }

  function renderHighScore() {
    if (highScore === 0) {
      setHighScore(roll);
    } else if (roll < highScore) {
      setHighScore(roll);
      localStorage.setItem("highscore", JSON.stringify(roll));
    }
  }

  const renderDice = dice.map((die) => {
    return (
      <Die
        key={die.id}
        value={die.value}
        isHeld={die.isHeld}
        holdDice={() => holdDice(die.id)}
      />
    );
  });

  return (
    <main>
      {tenzies && <Confetti />}
      <h1 className="title">Tenzies</h1>
      <NumRolls rolls={roll} />
      <HighScore score={highScore} />
      <p className="instructions">
        Roll until all dice are the same. Click each die to freeze it at its
        current value between rolls.
      </p>
      <div className="dice-container">{renderDice}</div>
      <button className="roll-dice" onClick={handleRoll}>
        {tenzies ? "Reset Game" : "Roll"}
      </button>
    </main>
  );
}

export default App;
