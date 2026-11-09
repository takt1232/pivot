export type UserTint = 'indigo' | 'emerald' | 'amber' | 'rose'

export type User = {
  id: string
  name: string
  role: string
  bio: string
  initials: string
  tint: UserTint
}

export const users: User[] = [
  {
    id: '1',
    name: 'Ada Lovelace',
    role: 'Systems architect',
    bio: 'Wrote the first published algorithm intended for a machine. Now she reviews pull requests with unnerving precision.',
    initials: 'AL',
    tint: 'indigo',
  },
  {
    id: '2',
    name: 'Grace Hopper',
    role: 'Compiler engineer',
    bio: 'Convinced the world that code could be written in human language. Keeps a clock that runs counter-clockwise.',
    initials: 'GH',
    tint: 'emerald',
  },
  {
    id: '3',
    name: 'Alan Turing',
    role: 'Research lead',
    bio: 'Asked whether machines can think, then built the test to find out. Prefers long runs and short proofs.',
    initials: 'AT',
    tint: 'amber',
  },
  {
    id: '4',
    name: 'Katherine Johnson',
    role: 'Flight dynamics',
    bio: 'Checked the math that put people in orbit and on the moon. Accuracy was never optional.',
    initials: 'KJ',
    tint: 'rose',
  },
]

export const tintClasses: Record<UserTint, string> = {
  indigo: 'bg-indigo-500',
  emerald: 'bg-emerald-500',
  amber: 'bg-amber-500',
  rose: 'bg-rose-500',
}

export function getUser(id: string): User | undefined {
  return users.find((user) => user.id === id)
}

export function getNextUser(id: string): User {
  const index = users.findIndex((user) => user.id === id)
  const nextIndex = index === -1 ? 0 : (index + 1) % users.length

  return users[nextIndex] ?? users[0]!
}
