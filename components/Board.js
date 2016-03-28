import React, { Component, PropTypes } from 'react'

const Board = ({ width, height,  snake, candy }) => {
  let rows = [];
  for (let y = 0; y < height; y++) {
    let cols = [];
    for (let x = 0; x < width; x++) {
      let gridStyle = (x === candy.x && y === candy.y) ? 'candy' : '';
      for (let s = 0; s < snake.length; s++) {
        if (snake[s].x === x && snake[s].y === y) {
          gridStyle = 'snake'
        }
      }
      cols.push(
        <div
          className={'cols ' + gridStyle}
          key={'c' + x}
        />
      );      
    }
    rows.push(
      <div
        className="rows"
        key={'r' + y}
      >
        {cols}
      </div>    
    )
  }

  return (
    <div className="board">{rows}</div>
  );
}

export default Board
