import { useState, useCallback, useEffect, useRef } from "react";
import classNames from "classnames";
import "./App.css";

import { useLoop } from "./hooks/useLoop";
import { useStore } from "./hooks/useStore";
import { createPortal } from "react-dom";

export const HERO_SIZE = 64;

function App() {
    const state = useStore((state) => state);
    const {
        setHero,
        setStage,
        stuff,
        perform,
        rightPressed,
        leftPressed,
        upPressed,
        downPressed,
        posX,
        posY,
    } = state;
    const [time, setTime] = useState(0);
    const stageRef = useRef(null);
    const heroRef = useRef(null);

    useLoop((time: number) => {
        const {
            moveUp,
            moveDown,
            moveLeft,
            moveRight,
            downPressed,
            upPressed,
            leftPressed,
            rightPressed,
        } = state;
        if (downPressed) {
            moveDown();
        }
        if (upPressed) {
            moveUp();
        }
        if (leftPressed) {
            moveLeft();
        }
        if (rightPressed) {
            moveRight();
        }
        setTime(time);
    }, state);

    const handleKeyPress = useCallback((event: KeyboardEvent) => {
        const { key, code } = event;
        console.log(key, code);
        switch (code) {
            case "KeyW":
            case "ArrowUp":
                perform("up");
                break;

            case "KeyA":
            case "ArrowLeft":
                perform("left");

                break;

            case "KeyS":
            case "ArrowDown":
                perform("down");
                break;

            case "KeyD":
            case "ArrowRight":
                perform("right");
                break;

            case "Space":
                perform("interact");
                break;

            default:
                break;
        }
    }, []);

    const handleKeyRelease = useCallback((event: KeyboardEvent) => {
        const { key } = event;
        switch (key) {
            case "w":
            case "W":
            case "ArrowUp":
                perform("up", false);
                break;

            case "a":
            case "A":
            case "ArrowLeft":
                perform("left", false);
                break;

            case "s":
            case "S":
            case "ArrowDown":
                perform("down", false);
                break;

            case "d":
            case "D":
            case "ArrowRight":
                perform("right", false);
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
                    moving_right: rightPressed,
                    moving_left: leftPressed,
                    moving_up: upPressed,
                    moving_down: downPressed,
                })}
                style={{
                    left: posX,
                    top: posY,
                    width: HERO_SIZE,
                }}
            ></div>
            {stuff.map(
                ({
                    x,
                    y,
                    width,
                    height,
                    background,
                    name,
                    isInteracting,
                    canCollide,
                    pickedUp,
                    loading,
                    contents = [],
                }) =>
                    pickedUp ? (
                        createPortal(
                            <div
                                className="thingWrapper"
                                style={{
                                    height: `${height}px`,
                                    width: `${width}px`,
                                    backgroundColor: background,
                                }}
                            >
                                <div
                                    className={classNames("thing", name)}
                                ></div>
                            </div>,
                            heroRef.current!,
                        )
                    ) : (
                        <div
                            key={name}
                            className="thingWrapper"
                            style={{
                                left: `${x}px`,
                                top: `${y}px`,
                                height: `${height}px`,
                                width: `${width}px`,
                                backgroundColor: background,
                                ...(isInteracting &&
                                    canCollide && { outline: `1px solid red` }),
                            }}
                        >
                            <div
                                className={classNames("thing", name, {
                                    loading,
                                })}
                            ></div>
                            {canCollide ? (
                                <div>
                                    {contents.map((item, index) => (
                                        <div
                                            key={index}
                                            className={classNames(
                                                "thing",
                                                item.name,
                                                {
                                                    dropped:
                                                        index + 1 ===
                                                        contents.length,
                                                },
                                            )}
                                            style={{
                                                height: `${item.height}px`,
                                                width: `${item.width}px`,
                                            }}
                                        >
                                            {/* {item.name} */}
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <span
                                    className={classNames("tooltip", {
                                        tooltipShow: isInteracting,
                                    })}
                                >
                                    {name}
                                </span>
                            )}
                        </div>
                    ),
            )}
        </main>
    );
}

export default App;
