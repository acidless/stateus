import React from "react";
import { render, screen, act } from "@testing-library/react";
import { createStore } from "../../src/react";

describe("react createStore", () => {
    it("should provide initial state via useStore", () => {
        const counterStore = createStore({ counter: 0 });

        function Counter() {
            const count = counterStore.useStore((s) => s.counter);
            return <div data-testid="count">{count}</div>;
        }

        render(<Counter />);
        expect(screen.getByTestId("count")).toHaveTextContent("0");
    });

    it("should re-render when state changes", () => {
        const counterStore = createStore({ counter: 0 });

        function Counter() {
            const count = counterStore.useStore((s) => s.counter);
            return <div data-testid="count">{count}</div>;
        }

        render(<Counter />);

        act(() => {
            counterStore.setState({ counter: 1 });
        });

        expect(screen.getByTestId("count")).toHaveTextContent("1");
    });

    it("should not re-render if selector value does not change", () => {
        const store = createStore({ a: 1, b: 2 });

        let renderCount = 0;
        function A() {
            renderCount++;
            const a = store.useStore((s) => s.a);
            return <div data-testid="a">{a}</div>;
        }

        render(<A />);

        act(() => {
            store.setState({ b: 3 });
        });

        expect(screen.getByTestId("a")).toHaveTextContent("1");
        expect(renderCount).toBe(1);
    });

    it("should allow multiple components to subscribe to the same store", () => {
        const counterStore = createStore({ counter: 0 });

        function Counter1() {
            const count = counterStore.useStore((s) => s.counter);
            return <div data-testid="c1">{count}</div>;
        }

        function Counter2() {
            const count = counterStore.useStore((s) => s.counter);
            return <div data-testid="c2">{count}</div>;
        }

        render(
            <>
                <Counter1 />
            <Counter2 />
            </>
        );

        act(() => {
            counterStore.setState({ counter: 42 });
        });

        expect(screen.getByTestId("c1")).toHaveTextContent("42");
        expect(screen.getByTestId("c2")).toHaveTextContent("42");
    });
});

describe("createStore fallback without useSyncExternalStore", () => {
    const originalUseSyncExternalStore = (React as any).useSyncExternalStore;

    beforeEach(() => {
        (React as any).useSyncExternalStore = undefined;
    });

    afterEach(() => {
        (React as any).useSyncExternalStore = originalUseSyncExternalStore;
    });

    it("should return initial selected state", () => {
        const store = createStore({ counter: 5 });

        function Counter() {
            const count = store.useStore((s) => s.counter);
            return <div data-testid="count">{count}</div>;
        }

        render(<Counter />);
        expect(screen.getByTestId("count")).toHaveTextContent("5");
    });

    it("should update selected state when store changes", () => {
        const store = createStore({ counter: 0 });

        function Counter() {
            const count = store.useStore((s) => s.counter);
            return <div data-testid="count">{count}</div>;
        }

        render(<Counter />);

        expect(screen.getByTestId("count")).toHaveTextContent("0");

        act(() => {
            store.setState({ counter: 10 });
        });

        expect(screen.getByTestId("count")).toHaveTextContent("10");
    });

    it("should not re-render if selected value is the same", () => {
        const store = createStore({ counter: 0 });
        const renderSpy = jest.fn();

        function Counter() {
            const count = store.useStore((s) => s.counter);
            renderSpy(count);
            return <div data-testid="count">{count}</div>;
        }

        render(<Counter />);

        act(() => {
            store.setState({ counter: 0 });
        });

        expect(renderSpy).toHaveBeenCalledTimes(1);
    });
});