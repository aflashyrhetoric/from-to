import { useEffect } from "react";
import { useFromTo } from "../../src/core";

export function App() {
    // animate({
    //   from: {},
    //   to: {},
    // })
    // from().to();

    const [raised, setRaised, { add, setRef }] = useFromTo();

    useEffect(() => {
        add({
            from: {
                display: "block",
                opacity: 1,
            },
            to: {
                display: "none",
                opacity: 0,
            },
        });
    }, []);

    return (
        <>
            <button
                onClick={() => {
                    setRaised(!raised);
                }}
            >
                Play
            </button>
            <div
                style={{
                    height: "20px",
                    width: "500px",
                    border: "1px solid black",
                    backgroundColor: "lightgreen",
                }}
            />
            <div
                ref={setRef}
                style={{
                    height: "300px",
                    width: "500px",
                    backgroundColor: "lightblue",
                    padding: "16px",
                    fontSize: "24px",
                    color: "black",
                }}
            >
                hello
            </div>
            <div
                ref={setRef}
                style={{
                    height: "300px",
                    width: "500px",
                    backgroundColor: "lightblue",
                    padding: "16px",
                    fontSize: "24px",
                    color: "black",
                }}
            >
                hello
            </div>
            <div
                style={{
                    height: "20px",
                    width: "500px",
                    border: "1px solid black",
                    backgroundColor: "lightgreen",
                }}
            />
        </>
    );
}
