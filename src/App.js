const NUMBER_IDS = [
    "zero",
    "one",
    "two",
    "three",
    "four",
    "five",
    "six",
    "seven",
    "eight",
    "nine"
];

class Buttons extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
        this.handleNumber = this.handleNumber.bind(this);
        this.handleOperator = this.handleOperator.bind(this);
        this.handleMem = this.handleMem.bind(this);
        this.handleEquals = this.handleEquals.bind(this);
    }
    handleNumber(e) {
        this.props.click(e.target.value, "number");
    }
    handleOperator(e) {
        this.props.click(e.target.value, "operator");
    }
    handleMem(e) {
        this.props.click(e.target.value, "mem");
    }
    handleEquals(e) {
        this.props.click(e.target.value, "equals");
    }
    render() {
        const array = NUMBER_IDS.map((num, idx) => (
            <button
                id={num}
                className="btn"
                type="button"
                key={idx}
                value={idx}
                onClick={this.handleNumber}
            >
                {idx}
            </button>
        ));
        return (
            <form id="button-container" action="">
                {array}
                <button
                    id="decimal"
                    className="btn"
                    type="button"
                    value="."
                    onClick={this.handleNumber}
                >
                    .
                </button>
                <button
                    id="pos-neg"
                    className="btn"
                    type="button"
                    value="+/-"
                    onClick={this.handleNumber}
                >
                    +/-
                </button>
                <button
                    id="add"
                    className="btn"
                    type="button"
                    value="+"
                    onClick={this.handleOperator}
                >
                    +
                </button>
                <button
                    id="subtract"
                    className="btn"
                    type="button"
                    value="-"
                    onClick={this.handleOperator}
                >
                    -
                </button>
                <button
                    id="multiply"
                    className="btn"
                    type="button"
                    value="*"
                    onClick={this.handleOperator}
                >
                    x
                </button>
                <button
                    id="divide"
                    className="btn"
                    type="button"
                    value="/"
                    onClick={this.handleOperator}
                >
                    &divide;
                </button>
                <button
                    id="clear"
                    className="btn"
                    type="button"
                    value="AC"
                    onClick={this.handleMem}
                >
                    AC
                </button>
                <button
                    id="cancel-entry"
                    className="btn"
                    type="button"
                    value="CE"
                    onClick={this.handleMem}
                >
                    CE
                </button>
                <button
                    id="equals"
                    className="btn"
                    type="button"
                    value="="
                    onClick={this.handleEquals}
                >
                    =
                </button>
            </form>
        );
    }
}

class ButtonContainer extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            rawNum: "0",
            lastInputType: "number",
            array: []
        };
        this.handleClick = this.handleClick.bind(this);
        this.doMath = this.doMath.bind(this);
    }
    handleClick(value, type) {
        const lastRaw = this.state.rawNum;
        const lastArr = [...this.state.array];
        const lastInput = this.state.lastInputType;
        const isEmptyArr = Boolean(lastArr.length === 0);
        const isEmpty = Boolean(lastRaw === "0");
        const poppedArray = [...this.state.array].slice(0, -1);
        switch (type) {
            case "number":
                switch (value) {
                    case ".":
                        if (!/\./.test(lastRaw)) {
                            this.props.display(
                            	lastArr,
                            	(lastRaw + value).replace(/^0+(?=\d)/, "")
                        	);
                        	this.setState({
                            	rawNum: lastRaw + value,
                            	lastInputType: type
                        	});
                        }
                        break;
                    case "+/-":
                        if (!isEmpty) {
                            const posneg = String(Number(lastRaw) * -1);
                            this.props.display(lastArr, posneg);
                            this.setState({
                                rawNum: posneg,
                                lastInputType: type
                            });
                        }
                        break;
                    default:
                        this.props.display(
                            lastArr,
                            (lastRaw + value).replace(/^0+(?=\d)/, "")
                        );
                        this.setState({
                            rawNum: lastRaw + value,
                            lastInputType: type
                        });
                }
                break;
            case "operator":
                switch (lastInput) {
                    case "operator":
                        this.props.display(poppedArray, value);
                        this.setState({
                            array: [...poppedArray, value]
                        });
                        break;
                    case "mem":
                        if (isEmpty) {
                            if (
                                typeof lastArr[lastArr.length - 1] === "number"
                            ) {
                                this.props.display([...lastArr], value);
                                this.setState({
                                    lastInputType: type,
                                    array: [...lastArr, value]
                                });
                            } else {
                                this.props.display(poppedArray, value);
                                this.setState({
                                    lastInputType: type,
                                    array: [...poppedArray, value]
                                });
                            }
                            if (isEmptyArr) {
                                this.props.display([Number("0")], value);
                                this.setState({
                                    lastInputType: type,
                                    array: [Number("0"), value]
                                });
                            }
                        } else {
                            this.props.display(
                                [...lastArr, Number(lastRaw)],
                                value
                            );
                            this.setState({
                                rawNum: "0",
                                lastInputType: type,
                                array: [...lastArr, Number(lastRaw), value]
                            });
                        }
                        break;
                    default:
                        this.props.display(
                            [...lastArr, Number(lastRaw)],
                            value
                        );
                        this.setState({
                            rawNum: "0",
                            lastInputType: type,
                            array: [...lastArr, Number(lastRaw), value]
                        });
                }
                break;
            case "mem":
                switch (value) {
                    case "AC":
                        this.props.display([], "0");
                        this.setState({
                            rawNum: "0",
                            lastInputType: type,
                            array: []
                        });
                        break;
                    case "CE":
                        if (!isEmpty) {
                            this.props.display(lastArr, isEmptyArr ? "0" : "");
                            this.setState({
                                rawNum: "0",
                                lastInputType: type
                            });
                        } else {
                            if (!isEmptyArr) {
                                if (
                                    typeof lastArr[lastArr.length - 1] ===
                                    "number"
                                ) {
                                    this.props.display(
                                        poppedArray,
                                        poppedArray.length === 0 ? "0" : ""
                                    );
                                    this.setState({
                                        rawNum: "0",
                                        lastInputType: type,
                                        array: poppedArray
                                    });
                                } else {
                                    this.props.display(
                                        [...lastArr].slice(0, -2),
                                        lastArr[lastArr.length - 2]
                                    );
                                    this.setState({
                                        rawNum: String(
                                            lastArr[lastArr.length - 2]
                                        ),
                                        lastInputType: type,
                                        array: [...lastArr].slice(0, -2)
                                    });
                                }
                            }
                        }
                        break;
                    default:
                }
                break;
            case "equals":
                if (lastInput !== "equals") {
                    const result = this.doMath(
                        isEmpty && !isEmptyArr
                            ? [...lastArr]
                            : [...lastArr, Number(lastRaw)]
                    );
                    this.props.display([], String(result));
                    this.setState({
                        rawNum: String(result),
                        lastInputType: type,
                        array: []
                    });
                }
                break;
            default:
        }
    }
    doMath(input) {
        const math = {
            "+": (x, y) => x + y,
            "-": (x, y) => x - y,
            "*": (x, y) => x * y,
            "/": (x, y) => x / y
        };
        let resultArr = [...input];
        if (typeof resultArr[resultArr.length - 1] !== "number") {
            resultArr.splice(-1, 1);
        }
        //console.log("Input value: ", resultArr);
        while (resultArr.indexOf("/") !== -1) {
            resultArr.splice(
                resultArr.indexOf("/") - 1,
                3,
                math["/"](
                    resultArr[resultArr.indexOf("/") - 1],
                    resultArr[resultArr.indexOf("/") + 1]
                )
            );
        }
        //console.log("Divide: ", resultArr);
        while (resultArr.indexOf("*") !== -1) {
            resultArr.splice(
                resultArr.indexOf("*") - 1,
                3,
                math["*"](
                    resultArr[resultArr.indexOf("*") - 1],
                    resultArr[resultArr.indexOf("*") + 1]
                )
            );
        }
        //console.log("Multiply: ", resultArr);
        while (resultArr.indexOf("-") !== -1) {
            resultArr.splice(
                resultArr.indexOf("-") - 1,
                3,
                math["-"](
                    resultArr[resultArr.indexOf("-") - 1],
                    resultArr[resultArr.indexOf("-") + 1]
                )
            );
        }
        //console.log("Subtract: ", resultArr);
        while (resultArr.indexOf("+") !== -1) {
            resultArr.splice(
                resultArr.indexOf("+") - 1,
                3,
                math["+"](
                    resultArr[resultArr.indexOf("+") - 1],
                    resultArr[resultArr.indexOf("+") + 1]
                )
            );
        }
        //console.log("Add => Result: ", resultArr);
        resultArr[0] =
            Math.round(resultArr[0] * Math.pow(10, 5)) / Math.pow(10, 5);
        return resultArr[0];
    }
    render() {
        return <Buttons click={this.handleClick} />;
    }
}

class CalculatorApp extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            display: "0"
        };
        this.handleDisplay = this.handleDisplay.bind(this);
    }
    handleDisplay(arr, value) {
        value =
            Number(value) && Number(value) < 0 && arr.length > 0
                ? `(${value})`
                : value;
        const result =
            arr
                .map((item) =>
                    typeof item === "number" && item < 0 ? `(${item})` : item
                )
                .join("") + value;
        this.setState({
            display: result
        });
    }
    render() {
        return (
            <div id="wrapper">
                <div id="calculator">
                    <h4 id="header">Calculator</h4>
                    <div id="display-container">
                        <bdi id="display">{this.state.display}</bdi>
                    </div>
                    <ButtonContainer display={this.handleDisplay} />
                </div>
            </div>
        );
    }
}

ReactDOM.render(<CalculatorApp />, document.getElementById("App"));