import { useState, useCallback, useEffect, useReducer, useRef } from "react";
import classNames from "classnames";
import "./App.css";

import { useLoop } from "./hooks/useLoop";
import { useStore } from "./hooks/useStore";

// enum ActionKind {
//   LEFT = "LEFT",
//   LEFT_PRESSED = "LEFT_PRESSED",
//   RIGHT = "RIGHT",
//   RIGHT_PRESSED = "RIGHT_PRESSED",
//   UP = "UP",
//   UP_PRESSED = "UP_PRESSED",
//   DOWN = "DOWN",
//   DOWN_PRESSED = "DOWN_PRESSED",
//   SET_STAGE = "SET_STAGE",
//   SET_HERO = "SET_HERO",
//   SET_COLLIDING_WITH = "SET_COLLIDING_WITH",
// }

// interface Action {
//   type: ActionKind;
//   payload?: any;
// }

// interface State {
//   posX: number;
//   posY: number;
//   upPressed: boolean;
//   rightPressed: boolean;
//   downPressed: boolean;
//   leftPressed: boolean;
//   speed: number;
//   stage: HTMLElement;
//   hero: HTMLElement | null;
//   colliding_with?: number | null;
// }

export const HERO_SIZE = 64;

function App() {
  const state = useStore((state) => state);
  const { move, downPressed, setHero, setStage, stuff } = state;
  const [time, setTime] = useState(0);
  const stageRef = useRef(null);
  const heroRef = useRef(null);

  useLoop((time: number) => {
    setTime(time);
  }, state);

  const handleKeyPress = useCallback((event: KeyboardEvent) => {
    const { key } = event;
    switch (key) {
      case "w":
        move("up");
        break;

      case "a":
        move("left");

        break;

      case "s":
        move("down");
        break;

      case "d":
        move("right");
        break;

      default:
        break;
    }
  }, []);

  const handleKeyRelease = useCallback((event: KeyboardEvent) => {
    const { key } = event;
    switch (key) {
      case "w":
        move("up", false);
        break;

      case "a":
        move("left", false);
        break;

      case "s":
        move("down", false);
        break;

      case "d":
        move("right", false);
        break;

      default:
        break;
    }
  }, []);

  useEffect(() => {
    document.addEventListener("keydown", handleKeyPress);
    document.addEventListener("keyup", handleKeyRelease);
    if (stageRef.current) {
      setStage(stageRef.current);
    }
    if (heroRef.current) {
      setHero(heroRef.current);
    }

    return () => {
      document.removeEventListener("keydown", handleKeyPress);
      document.removeEventListener("keyup", handleKeyRelease);
    };
  }, []);

  return (
    <main ref={stageRef} className="stage">
      <div
        ref={heroRef}
        className={classNames("hero", {
          moving_right: state.rightPressed,
          moving_left: state.leftPressed,
          moving_up: state.upPressed,
          moving_down: state.downPressed,
        })}
        style={{
          left: state.posX,
          top: state.posY,
          width: HERO_SIZE,
        }}
      ></div>
      {stuff.map(({ x, y, width, height, background, name }) => (
        <div
          key={name}
          className="thing"
          style={{
            left: `${x}px`,
            top: `${y}px`,
            height: `${height}px`,
            width: `${width}px`,
            background,
          }}
        >
          {name}
        </div>
      ))}
      colliding: {state.colliding_with}
    </main>
  );
}

export default App;
