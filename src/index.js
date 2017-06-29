import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

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

function Square(props) {
    return (
        <button className={"square " + (props.win ? "winner" : "")} onClick={props.onClick}>
            {props.value}
        </button>
    );
}

class Board extends React.Component {
    renderSquare(j) {
        return (
            <Square
                key={j}
                value={this.props.squares[j]}
                onClick={() => this.props.onClick(j)}
                win={this.props.winnerLine !== null && lines[this.props.winnerLine].indexOf(j) !== -1}
                    />
        );
    }

    render() {
        let rows = [];
        for (let i = 0; i < 3; ++i) {
            let cells = [];
            for (let j = 0; j < 3; ++j) {
                cells.push(this.renderSquare(i*3 + j));
            }
            rows.push(<div key={i*3} className="board-row">{cells}</div>)
        }
        return <div>{rows}</div>;
    }
}

function calculateWinner(squares) {
    for (let i = 0; i < lines.length; i++) {
        const [a, b, c] = lines[i];
        if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
            return i;
        }
    }
    return null;
}

class Game extends React.Component {
    constructor() {
        super();
        this.state = {
            history: [{
                squares: Array(9).fill(null),
                clickedCell: null
            }],
            player: 'X',
            stepNumber: 0,
            reverse: false
        }
    }

    nextPlayer() {
        return this.state.player === 'X' ? 'O' : 'X';
    }

    handleClick(i) {
        const history = this.state.history.slice(0, this.state.stepNumber + 1);
        const current = history[this.state.stepNumber];
        const squares = current.squares.slice();
        if (!calculateWinner(squares) && !squares[i]) {
            squares[i] = this.state.player;

            this.setState({
                stepNumber: history.length,
                history: history.concat([{
                    squares: squares,
                    clickedCell: i
                }]),
                player: this.nextPlayer()
            });
        }
    }

    jumpTo(i) {
        this.setState({
            stepNumber: i,
            player: i % 2 ? 'O' : 'X'
        })
    }

    render() {
        const history = this.state.history;
        const current = history[this.state.stepNumber];
        const winnerLine = calculateWinner(current.squares);

        const moves = history.map((move, index) => {
            const movePlayer = index % 2 ? 'X' : 'O';
            const moveCell = move.clickedCell;
            const desc = index ? `${movePlayer} move (${Math.floor(1 + (moveCell / 3))} , ${(1 + moveCell % 3)})`:
                'Game start';
            return (
                <li key={index} className={index === this.state.stepNumber ? 'currentMove' : ''}>
                    <a href="#" onClick={() => this.jumpTo(index)}>{desc}</a>
                </li>
            );
        });

        let status;
        if (winnerLine !== null) {
            status = 'Winner: ' + current.squares[lines[winnerLine][0]];
        } else {
            status = 'Next player: ' + this.state.player;
        }

        return (
            <div className="game">
                <div className="game-board">
                    <Board
                        onClick={(i) => this.handleClick(i)}
                        squares={current.squares}
                        winnerLine={winnerLine}
                    />
                </div>
                <div className="game-info">
                    <div className="status">{status}</div>
                    <button onClick={() => this.setState({reverse: !this.state.reverse})}>Sort</button>
                    <ol className={this.state.reverse ? 'reverse' : ''}>{moves}</ol>
                </div>
            </div>
        );
    }
}

// ========================================

ReactDOM.render(
    <Game />,
    document.getElementById('root')
);
