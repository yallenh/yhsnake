/* global document */

import React, { Component, PropTypes } from 'react'
import Board from './Board'

class App extends Component {

  // private utils
  _equalPos(a, b) {
    return a && b && (a.x === b.x) && (a.y === b.y);
  }
  _inSnake(coordinate, defaultSnake) {
    const snake = defaultSnake || (this.state && this.state.snake) || [];
    const length = snake.length
    for (let i = 0; i < length; i++) {
      if (this._equalPos(coordinate, snake[i])) {
        return true;
      }
    }
    return false;
  }
  _randomCoordinate(snake) {
    const width = this.props.width
    const height = this.props.height
    let coordinate
    if (width && height) {
      do {
        coordinate = {
          x: parseInt((Math.random() * 100) % width, 10),
          y: parseInt((Math.random() * 100) % height, 10)
        }
      } while(this._inSnake(coordinate, snake))
    }
    return coordinate
  }
  _clearInterval() {
    if (this.state && this.state.interval) {
      clearInterval(this.state.interval)
      this.state.interval = null
    }
  }

  _addKeyBoardListener() {
    if (typeof document !== 'undefined') {
      document.addEventListener("keydown", (e) => {
        if (e.keyCode >= 37 && e.keyCode <= 40) {
          const snakeHead = this.state.snake[0];
          const changeLength = this.state.change.length;
          let changeLast = changeLength ? this.state.change[changeLength - 1] : null;

          if (this._equalPos(changeLast, snakeHead)) {
            changeLast.move = e.keyCode;
          } else if (!changeLast || changeLast && changeLast.move !== e.keyCode) {
            this.state.change.push({
              x: snakeHead.x,
              y: snakeHead.y,
              life: this.state.snake.length,
              move: e.keyCode
            })
          }
        }
      }, false);
    }
  }


  // component life cycle
  constructor(props) {
    super(props)
    let snake = this._randomCoordinate()
    const x = snake.x
    const y = snake.y
    const move = parseInt(Math.random() * (41 - 37)) + 37 // 37: left, 38: up, 39: right, 40: down
    const life = 1

    this.state = {
      snake: [{ x, y, move }],
      change: [{ x, y, move, life }],
      candy: this._randomCoordinate(snake),
      interval: null
    };
  }

  componentDidMount() {
    this._addKeyBoardListener()

    const height = this.props.height
    const width = this.props.width

    this.state.interval = setInterval(() => {

      // update snake
      const originalLast = this.state.snake[this.state.snake.length ? this.state.snake.length - 1 : 0]
      const len = this.state.change.length
      let snake = this.state.snake.map((s) => {
        let move = s.move
        for (let c = 0; c < len; c++) {
          let change = this.state.change[c]
          if (this._equalPos(s, change)) {
            move = change.move
            change.life--
            break
          }
        }
        return {
          x: (s.x + (move === 37 ? -1 : (move === 39 ? 1 : 0)) + width) % width,
          y: (s.y + (move === 38 ? -1 : (move === 40 ? 1 : 0)) + height) % height,
          move
        };
      })

      // check death
      const first = snake[0]
      const last = snake[snake.length - 1]
      if (this._inSnake(first)) {
        this._clearInterval()
        return
      }

      // update candy with change
      let candy = this.state.candy
      let change
      if (this._equalPos(first, candy)) {
        snake.push({
          x: originalLast.x,
          y: originalLast.y,
          move: last.move
        });
        candy = this._randomCoordinate(snake)
        change = this.state.change.map((change) => {
          let newChange = change
          change.life++;
          return newChange
        })
      } else {
        change = this.state.change.filter((c) => {
          return c.life
        })
      }

      // re-render
      this.setState({ snake, change, candy })
    }, 200)
  }

  componentWillUnMount() {
    this._clearInterval()
  }

  render() {
    return (
      <Board
        {...this.props}
        {...this.state}
      />
    )
  }
}

export default App
