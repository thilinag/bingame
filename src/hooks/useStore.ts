import { create } from "zustand";
import { HERO_SIZE } from "../App";

type Direction = "up" | "down" | "left" | "right";

interface Thing {
    x: number;
    y: number;
    width: number;
    height: number;
    background: string;
    name: string;
    isColliding: boolean;
}

interface State {
    posX: number;
    posY: number;
    upPressed: boolean;
    rightPressed: boolean;
    downPressed: boolean;
    leftPressed: boolean;
    speed: number;
    stage: HTMLElement | null;
    hero: HTMLElement | null;
    stuff: Thing[];
    press: (direction: Direction, stopped?: boolean) => void;
    moveUp: () => void;
    moveDown: () => void;
    moveLeft: () => void;
    moveRight: () => void;
    setStage: (ref: HTMLElement) => void;
    setHero: (ref: HTMLElement) => void;
    setCollidingWith: (itemIndex: number) => void;
}

function isColliding(state: State) {
    const {
        hero,
        stage,
        speed,
        upPressed,
        downPressed,
        rightPressed,
        leftPressed,
        stuff,
        setCollidingWith,
    } = state;

    if (!hero || !stage) return false;

    const {
        x: heroX1,
        y: heroY1,
        width: w1,
        height: h1,
    } = hero.getBoundingClientRect();
    const { x: stageX1, y: stageY1 } = stage.getBoundingClientRect();

    const x1 = heroX1 - stageX1;
    const y1 = heroY1 - stageY1;

    // return stuff.some((thing) => {
    //   const { x: x2, y: y2, width: w2, height: h2 } = thing;
    //   return (
    //     x1 + w1 + (rightPressed ? speed : 0) + (leftPressed ? speed * -1 : 0) >
    //       x2 &&
    //     x1 + (rightPressed ? speed : 0) + (leftPressed ? speed * -1 : 0) <
    //       x2 + w2 &&
    //     y1 + (downPressed ? speed : 0) + (upPressed ? speed * -1 : 0) + h1 > y2 &&
    //     y1 + (downPressed ? speed : 0) + (upPressed ? speed * -1 : 0) < y2 + h2
    //   );
    // });

    const collidingIndex = stuff.findIndex((thing) => {
        const { x: x2, y: y2, width: w2, height: h2 } = thing;
        return (
            x1 +
                w1 +
                (rightPressed ? speed : 0) +
                (leftPressed ? speed * -1 : 0) >=
                x2 &&
            x1 + (rightPressed ? speed : 0) + (leftPressed ? speed * -1 : 0) <=
                x2 + w2 &&
            y1 +
                (downPressed ? speed : 0) +
                (upPressed ? speed * -1 : 0) +
                h1 >=
                y2 &&
            y1 + (downPressed ? speed : 0) + (upPressed ? speed * -1 : 0) <=
                y2 + h2
        );
    });

    const isColliding = collidingIndex > -1;
    setCollidingWith(collidingIndex);

    return isColliding;
}

function getNextPos(direction: Direction, state: State) {
    const stagePos = state.stage && state.stage.getBoundingClientRect();

    switch (direction) {
        case "up":
            const nextUpPos = state.posY - state.speed;
            if (nextUpPos < 0 || isColliding(state)) {
                return state.posY;
            }
            return nextUpPos;

        case "right":
            const nextRightPos = state.posX + state.speed;
            if (
                nextRightPos + HERO_SIZE > (stagePos?.width ?? 0) ||
                isColliding(state)
            ) {
                return state.posX;
            }
            return nextRightPos;

        case "down":
            const nextDownPos = state.posY + state.speed;
            if (
                nextDownPos + HERO_SIZE > (stagePos?.height ?? 0) ||
                isColliding(state)
            ) {
                return state.posY;
            }
            return nextDownPos;

        case "left":
            const nextLeftPos = state.posX - state.speed;
            if (nextLeftPos < 0 || isColliding(state)) {
                return state.posX;
            }
            return nextLeftPos;

        default:
            return 0;
    }
}

export const useStore = create<State>()((set) => ({
    posX: 0,
    posY: 0,
    upPressed: false,
    rightPressed: false,
    downPressed: false,
    leftPressed: false,
    speed: 4,
    stage: null,
    hero: null,
    stuff: [
        {
            x: 100,
            y: 100,
            width: 100,
            height: 50,
            background: "blue",
            name: "thing1a",
            isColliding: false,
        },
        {
            x: 400,
            y: 200,
            width: 50,
            height: 50,
            background: "green",
            name: "thing2",
            isColliding: false,
        },
    ],
    press: (direction, moving = true) =>
        set(() => {
            return {
                ...(direction === "up" && { upPressed: moving }),
                ...(direction === "down" && { downPressed: moving }),
                ...(direction === "left" && { leftPressed: moving }),
                ...(direction === "right" && { rightPressed: moving }),
            };
        }),
    moveUp: () =>
        set((state) => ({
            posY: getNextPos("up", state),
        })),
    moveDown: () =>
        set((state) => ({
            posY: getNextPos("down", state),
        })),
    moveLeft: () =>
        set((state) => ({
            posX: getNextPos("left", state),
        })),
    moveRight: () =>
        set((state) => ({
            posX: getNextPos("right", state),
        })),
    setStage: (ref) =>
        set(() => ({
            stage: ref,
        })),
    setHero: (ref) =>
        set(() => ({
            hero: ref,
        })),
    setCollidingWith: (itemIndex) =>
        set((state) => {
            const stuff = state.stuff.map((thing, index) => ({
                ...thing,
                isColliding: index === itemIndex,
            }));

            return { stuff };
        }),
}));
