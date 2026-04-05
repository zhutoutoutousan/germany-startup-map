/** Chat threads require user_a_id < user_b_id (DB constraint). */
export function sortParticipantIds(a: string, b: string): [string, string] {
  return a < b ? [a, b] : [b, a]
}
