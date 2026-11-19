export type MoveState =
  'in progress' | 'review' | 'queued' | 'someday' | 'overdue' | 'resolved'

export type Mark = '!' | '?' | '✓' | '✗'

export type Subitem = {
  id: string
  title: string
  done: boolean
}

export type Move = {
  id: string
  turn: number
  title: string
  state: MoveState
  due: string
  dueSoon?: boolean
  mark?: Mark
  note?: string
  window?: string
  variation?: string
  subitems?: Subitem[]
}

export type Game = {
  id: string
  index: number
  title: string
  moves: Move[]
}

export const board = {
  title: 'Launch v0.4',
  week: '44',
  span: '17–23 Nov',
  resumed: '09:41',
  sheet: 'sheet 1 / 3',
}

export const games: Game[] = [
  {
    id: 'game-1',
    index: 1,
    title: 'Ships this week',
    moves: [
      {
        id: '118',
        turn: 1,
        title: 'Storage adapter behind the interface',
        state: 'in progress',
        due: 'Thu 19',
        window: '18 → 20 Nov',
        variation: 'local → hosted',
        subitems: [],
      },
      {
        id: '119',
        turn: 2,
        title: 'Board view — inline cell editing',
        state: 'review',
        due: 'Fri 20',
        dueSoon: true,
        mark: '!',
        note: 'Row height must not jump when editing starts. Reserve the height, then swap in the input — no modal for a field edit.',
        window: '18 → 21 Nov',
        variation: 'board → timeline',
        subitems: [
          { id: '119.1', title: 'Focus ring on the active cell', done: true },
          { id: '119.2', title: 'Enter commits, Esc reverts', done: false },
          { id: '119.3', title: 'Arrow keys walk the grid', done: false },
        ],
      },
      {
        id: '120',
        turn: 3,
        title: 'Invoice — Northwind retainer',
        state: 'in progress',
        due: 'Sat 21',
        window: '19 → 21 Nov',
        variation: 'draft → sent',
      },
    ],
  },
  {
    id: 'game-2',
    index: 2,
    title: 'Next up',
    moves: [
      {
        id: '121',
        turn: 4,
        title: 'Timeline — drag to resize a range',
        state: 'queued',
        due: 'Mon 23',
        window: '23 → 26 Nov',
        variation: 'timeline → board',
      },
      {
        id: '122',
        turn: 5,
        title: 'Linear algebra ps6 — eigenvalues',
        state: 'queued',
        due: 'Tue 24',
        mark: '?',
        note: 'Problem 4 needs the lecture notes from week 6. Decide whether to re-derive or ask.',
        window: '24 → 25 Nov',
        variation: 'study → review',
      },
      {
        id: '123',
        turn: 6,
        title: 'Command palette — fuzzy ranking',
        state: 'queued',
        due: 'Wed 25',
        window: '25 → 27 Nov',
        variation: 'list → palette',
      },
    ],
  },
  {
    id: 'game-3',
    index: 3,
    title: 'Adjourned',
    moves: [
      {
        id: '124',
        turn: 7,
        title: 'Docs — attach a note to a board',
        state: 'someday',
        due: 'Dec',
        window: 'Dec',
        variation: 'docs → board',
      },
      {
        id: '125',
        turn: 8,
        title: 'Renew pivot.dev domain',
        state: 'overdue',
        due: '14 Nov',
        mark: '✗',
        note: 'Registrar holds the domain for 30 days after expiry. Renew before 14 Dec to keep it.',
        window: '14 Nov — expired',
        variation: 'none',
      },
    ],
  },
]

export const allMoves: Move[] = games.flatMap((game) => game.moves)

export function getMove(id: string): Move | undefined {
  return allMoves.find((move) => move.id === id)
}
