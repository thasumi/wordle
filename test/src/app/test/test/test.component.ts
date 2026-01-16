import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormsModule } from '@angular/forms';

type CellResult = 'green' | 'yellow' | 'grey' | '';

@Component({
  selector: 'app-test',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './test.component.html',
  styleUrl: './test.component.css'
})
export class TestComponent implements OnInit {

  grid: string[][] = Array(6).fill(null).map(() => Array(5).fill(''));
  results: string[][] = Array(6).fill(null).map(() => Array(5).fill(''));
  currentRow = 0;
  currentCol = 0;
  target: string = '';
  gameOver = false;
  congratsMessage = '';
  constructor() {

  }

  ngOnInit(): void {
  }


  submitGuess() {
    if (this.gameOver) return;

    const row = this.grid[this.currentRow];
    const isRowComplete = row.every(cell => cell && cell.trim().length === 1);

    if (!isRowComplete) {
      alert("Word too short!");
      return;
    }

    if (!this.target || this.target.length !== 5) {
      alert("Please set a 5 letter target word first!");
      return;
    }

    const currentGuess = row.join('').toLowerCase();
    const rowResult = this.checkWord(currentGuess, this.target.toLowerCase());
    this.results[this.currentRow] = rowResult as CellResult[];

    const allGreen = rowResult.every(color => color === 'green');

    if (allGreen) {
      this.congratsMessage = 'Congratulations! You guessed the word!';
      this.gameOver = true;
      alert(this.congratsMessage);
      return;
    }

    if (this.currentRow < 5) {
      this.currentRow++;
      this.currentCol = 0;
      this.focusCell(this.currentRow, 0);
    } else {
      alert("Game Over!");
      this.gameOver = true;
    }
  }


  checkWord(input: string, target: string) {
    const result = [];
    const counter: any = {};
    for (let letter of target) {
      counter[letter] = (counter[letter] ?? 0) + 1
    }

    for (let i = 0; i < target.length; i++) {
      if (input[i] === target[i]) {
        result[i] = 'green';
        counter[input[i]]--;
      }
    }

    for (let i = 0; i < target.length; i++) {
      if (result[i]) continue;
      if (counter[input[i]] > 0) {
        result[i] = 'yellow';
        counter[input[i]]--;
      } else {
        result[i] = 'grey';
      }
    }
    return result;
  }

  setCellValue(event: Event, i: number, j: number) {
    const input = event.target as HTMLInputElement;
    let value = (input.value || '').toUpperCase();

    if (value.length > 1) {
      value = value.slice(-1);
    }

    input.value = value;
    this.grid[i][j] = value;
    this.currentCol = j;

    if (value && j < this.grid[i].length - 1) {
      const nextCol = j + 1;
      this.focusCell(i, nextCol);
      this.currentCol = nextCol;
    }
  }

  onEnter(row: number, col: number) {
    if (row === this.currentRow && col === this.grid[row].length - 1) {
      this.submitGuess();
    }
  }

  trackRow(index: number): number {
    return index;
  }

  trackCol(index: number): number {
    return index;
  }

  getCellId(row: number, col: number): string {
    return `cell-${row}-${col}`;
  }

  focusCell(row: number, col: number): void {
    setTimeout(() => {
      const element = document.getElementById(this.getCellId(row, col)) as HTMLInputElement | null;
      if (element) {
        element.focus();
        element.select();
      }
    });
  }


}
