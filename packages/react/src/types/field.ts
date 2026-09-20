/**
 * Shapes shared by every Tecton form control.
 */

/** Validation feedback attached to a field. */
export interface FieldStatus {
  /** Which kind of feedback this is. */
  type: 'error' | 'warning' | 'success';
  /** The message shown under the field. */
  message?: string;
}

/** The two control heights Tecton draws: `md` is 32px, `sm` is 28px. */
export type ControlSize = 'sm' | 'md';
