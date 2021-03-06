import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props) {
    return (
        <button
            className="square"
            onClick={props.onClick}
            style={props.highlighted ? { color: 'green' } : { color: 'black' }}
        >
            {props.value}
        </button>
    );
}

class Board extends React.Component {
    renderSquare(i) {
        return (
            <Square
                value={this.props.squares[i]}
                onClick={() => this.props.onClick(i)}
                highlighted={this.props.winLine ? this.props.winLine.includes(i) : false}
                key={i}
            />
        );
    }

    render() {
        const lines = (i) => {
            const arr = [];
            for (let j = 0; j < 3; j++) {
                arr.push(
                    this.renderSquare(i + j)
                )
            }
            return arr;
        }

        const rows = () => {
            const arr = [];
            for (let i = 0; i < 7; i = i + 3) {
                arr.push(
                    <div className="board-row" key={i}>
                        {lines(i)}
                    </div>)
            }
            return arr;
        }

        return (
            <div>
                {rows()}
            </div>
        )
    }
}

function Toggle(props) {
    return (
        <button onClick={props.onClick}>Change to : {props.isAscendingOrder ? 'Descending order' : 'Ascending order'}</button>
    )
}

class Game extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            history: [{
                squares: Array(9).fill(null),
            }],
            stepNumber: 0,
            xIsNext: true,
            currentStep: 0,
            isAscendingOrder: true,
        }
    }

    handleClick(i) {
        const history = this.state.history.slice(0, this.state.stepNumber + 1);
        const current = history[history.length - 1];
        const squares = current.squares.slice();
        if (calculateWinner(squares) || squares[i]) {
            return;
        }
        squares[i] = this.state.xIsNext ? 'X' : 'O';
        this.setState({
            history: history.concat([{
                squares: squares,
            }]),
            stepNumber: history.length,
            xIsNext: !this.state.xIsNext,
        });
    }

    jumpTo(step) {
        this.setState({
            stepNumber: step,
            xIsNext: (step % 2) === 0,
        })
    }

    handleToggle() {
        this.setState({
            isAscendingOrder: !this.state.isAscendingOrder,
        })
    }

    render() {
        const history = this.state.history;
        const current = history[this.state.stepNumber];
        const winner = calculateWinner(current.squares);
        const nowinner = !winner && isGameFinished(current.squares);

        const moves = history.map((step, move) => {
            const mover = (move % 2) === 0 ? 'O' : 'X';

            let desc = '';
            if (move !== 0) {
                // Determines the index of the new move between last step and current one
                let i = 0;
                while (i < 9 && step.squares[i] === history[move - 1].squares[i]) {
                    i++;
                }

                // Determines the x and y coords of the move
                const x = i < 3 ? i : (i < 6 ? i - 3 : i - 6);
                const y = i < 3 ? 0 : (i < 6) ? 1 : 2;

                desc = 'Go to move #' + move + '. ' + mover + ' at (' + x + ',' + y + ')';
            }
            else {
                desc = 'Go to start move';
            }

            return (
                <li key={move}>
                    <button
                        onClick={() => this.jumpTo(move)}
                        style={this.state.stepNumber === move ? { fontWeight: 'bold' } : null}
                    >
                        {desc}
                    </button>
                </li>
            )
        })
        let status;
        if (winner) {
            status = 'Winner: ' + current.squares[winner[0]];
        } else {
            if (nowinner) {
                status = 'No one wins ! Reload to play again'
            } else {
                status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
            }
        }

        return (
            <div className="game">
                <div className="game-board">
                    <Board
                        squares={current.squares}
                        onClick={(i) => this.handleClick(i)}
                        winLine={winner}
                    />
                </div>
                <div className="game-info">
                    <div>{status}</div>
                    <div style={{ marginTop: 10 }}>
                        <Toggle isAscendingOrder={this.state.isAscendingOrder} onClick={() => this.handleToggle()} />
                    </div>
                    <ol>{moves.sort((a, b) => this.state.isAscendingOrder ? a.key - b.key : b.key - a.key)}</ol>
                </div>
            </div>
        );
    }
}


ReactDOM.render(<Game />, document.getElementById('root'));

function calculateWinner(squares) {
    const lines = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6],
    ];
    for (let i = 0; i < lines.length; i++) {
        const [a, b, c] = lines[i];
        if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
            return [a, b, c];
        }
    }
    return null;
}

function isGameFinished(squares) {
    let i = 0;
    while (i < 9 && squares[i] != null) {
        i++;
    }
    return i === 9;
}