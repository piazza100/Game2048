import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, PanResponder, TouchableOpacity } from 'react-native';

const generateEmptyGrid = () => {
  return Array(4)
    .fill(null)
    .map(() => Array(4).fill(0));
};

const addNumber = (grid) => {
  const emptyCells = [];
  grid.forEach((row, rowIndex) =>
    row.forEach((cell, colIndex) => {
      if (cell === 0) emptyCells.push({ row: rowIndex, col: colIndex });
    })
  );
  if (emptyCells.length === 0) return grid;

  const { row, col } = emptyCells[Math.floor(Math.random() * emptyCells.length)];
  grid[row][col] = Math.random() > 0.5 ? 2 : 4;
  return grid;
};

const getEmojiForNumber = (num) => {
  switch (num) {
    case 2:
      return '🌱'; // 잔디
    case 4:
      return '🌿'; // 작은 풀
    case 8:
      return '🌲'; // 나무
    case 16:
      return '🪵'; // 나무조각
    case 32:
      return '⛺'; // 텐트
    case 64:
      return '🏕'; // 캠핑장
    case 128:
      return '🏠'; // 작은 집
    case 256:
      return '🏘️'; // 집
    case 512:
      return '🏢'; // 빌딩
    case 1024:
      return '🏬'; // 상가 빌딩
    case 2048:
      return '🏙️'; // 도시
    default:
      return ''; // 기본적으로 빈 칸
  }
};

const Game2048 = () => {
  const [grid, setGrid] = useState(generateEmptyGrid());
  const [score, setScore] = useState(0);

  const restartGame = () => {
    let newGrid = generateEmptyGrid();
    newGrid = addNumber(addNumber(newGrid));
    setGrid(newGrid);
    setScore(0);
  };

  useEffect(() => {
    restartGame();
  }, []);

  const moveLeft = (grid) => {
    let newGrid = grid.map((row) => {
      let newRow = row.filter((val) => val);
      while (newRow.length < 4) newRow.push(0);
      return newRow;
    });
    return newGrid;
  };

  const moveRight = (grid) => {
    let newGrid = grid.map((row) => {
      let newRow = row.filter((val) => val);
      while (newRow.length < 4) newRow.unshift(0);
      return newRow;
    });
    return newGrid;
  };

  const moveUp = (grid) => {
    let newGrid = generateEmptyGrid();
    for (let col = 0; col < 4; col++) {
      let newCol = grid.map((row) => row[col]).filter((val) => val);
      while (newCol.length < 4) newCol.push(0);
      newCol.forEach((val, row) => (newGrid[row][col] = val));
    }
    return newGrid;
  };

  const moveDown = (grid) => {
    let newGrid = generateEmptyGrid();
    for (let col = 0; col < 4; col++) {
      let newCol = grid.map((row) => row[col]).filter((val) => val);
      while (newCol.length < 4) newCol.unshift(0);
      newCol.forEach((val, row) => (newGrid[row][col] = val));
    }
    return newGrid;
  };

const mergeGrid = (grid, direction) => {
    let newScore = score;
    switch (direction) {
        case 'left':
            for (let row = 0; row < 4; row++) {
                for (let col = 0; col < 3; col++) {
                    if (grid[row][col] && grid[row][col] === grid[row][col + 1]) {
                        grid[row][col] *= 2;
                        newScore += grid[row][col];
                        grid[row][col + 1] = 0;
                    }
                }
            }
            break;
        case 'right':
            for (let row = 0; row < 4; row++) {
                for (let col = 3; col > 0; col--) {
                    if (grid[row][col] && grid[row][col] === grid[row][col - 1]) {
                        grid[row][col] *= 2;
                        newScore += grid[row][col];
                        grid[row][col - 1] = 0;
                    }
                }
            }
            break;
        case 'up':
            for (let col = 0; col < 4; col++) {
                for (let row = 0; row < 3; row++) {
                    if (grid[row][col] && grid[row][col] === grid[row + 1][col]) {
                        grid[row][col] *= 2;
                        newScore += grid[row][col];
                        grid[row + 1][col] = 0;
                    }
                }
            }
            break;
        case 'down':
            for (let col = 0; col < 4; col++) {
                for (let row = 3; row > 0; row--) {
                    if (grid[row][col] && grid[row][col] === grid[row - 1][col]) {
                        grid[row][col] *= 2;
                        newScore += grid[row][col];
                        grid[row - 1][col] = 0;
                    }
                }
            }
            break;
        default:
            break;
    }
    setScore(newScore);
    return grid;
};


const handleMove = (direction) => {
    let newGrid;
    switch (direction) {
        case 'left':
            newGrid = moveLeft(grid);
            newGrid = mergeGrid(newGrid, direction);
            newGrid = moveLeft(newGrid);
            break;
        case 'right':
            newGrid = moveRight(grid);
            newGrid = mergeGrid(newGrid, direction);
            newGrid = moveRight(newGrid);
            break;
        case 'up':
            newGrid = moveUp(grid);
            newGrid = mergeGrid(newGrid, direction);
            newGrid = moveUp(newGrid);
            break;
        case 'down':
            newGrid = moveDown(grid);
            newGrid = mergeGrid(newGrid, direction);
            newGrid = moveDown(newGrid);
            break;
        default:
            return;
    }
    newGrid = addNumber(newGrid);
    setGrid(newGrid);

    if (isGameOver(newGrid)) {
        alert('Game Over! No more moves available.');
    }
};


  const isGameOver = (grid) => {
    for (let row = 0; row < 4; row++) {
      for (let col = 0; col < 4; col++) {
        if (grid[row][col] === 0) return false;
        if (col < 3 && grid[row][col] === grid[row][col + 1]) return false;
        if (row < 3 && grid[row][col] === grid[row + 1][col]) return false;
      }
    }
    return true;
  };

  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onMoveShouldSetPanResponder: () => true,
    onPanResponderRelease: (evt, gestureState) => {
      const { dx, dy } = gestureState;
      if (Math.abs(dx) > Math.abs(dy)) {
        if (dx > 0) {
          handleMove('right');
        } else {
          handleMove('left');
        }
      } else {
        if (dy > 0) {
          handleMove('down');
        } else {
          handleMove('up');
        }
      }
    },
  });

  return (
    <View style={styles.container} {...panResponder.panHandlers}>
      <Text style={styles.title}>2048</Text>
      <Text style={styles.score}>Score: {score}</Text>
      <View style={styles.grid}>
        {grid.map((row, rowIndex) => (
          <View style={styles.row} key={rowIndex}>
            {row.map((cell, colIndex) => (
              <View style={styles.cell} key={colIndex}>
                <Text style={styles.cellText}>{getEmojiForNumber(cell)}</Text>
              </View>
            ))}
          </View>
        ))}
      </View>
      <TouchableOpacity style={styles.restartButton} onPress={restartGame}>
        <Text style={styles.restartButtonText}>Restart</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 32,
    marginBottom: 20,
  },
  score: {
    fontSize: 24,
    marginBottom: 20,
  },
  grid: {
    backgroundColor: '#BBADA0',
    padding: 10,
    borderRadius: 10,
  },
  row: {
    flexDirection: 'row',
  },
  cell: {
    width: 70,
    height: 70,
    margin: 5,
    backgroundColor: '#CDC1B4',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cellText: {
    fontSize: 40, // 이모티콘 크기를 더 크게 설정
    fontWeight: 'bold',
    textAlign: 'center',
  },
  restartButton: {
    marginTop: 20,
    padding: 10,
    backgroundColor: '#8f7a66',
    borderRadius: 5,
  },
  restartButtonText: {
    fontSize: 18,
    color: '#fff',
  },
});

export default Game2048;


