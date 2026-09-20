/**
 * Tecton Autocomplete.
 *
 * A field that narrows a long list as the person types. Give it `options` when
 * the list is known up front, or `onSearch` when it has to be fetched — it
 * debounces and cancels for you either way.
 */
import {useMemo} from 'react';
import {Typeahead} from '@astryxdesign/core/Typeahead';
import {resolveIcon, type TectonIconRef} from '../../icons/renderIcon.js';
import type {ControlSize, FieldStatus} from '../../types/field.js';

/** One suggestion. */
export interface AutocompleteOption {
  /** Identifies the suggestion. */
  id: string;
  /** What the suggestion is called — what the person reads and matches on. */
  label: string;
}

export interface AutocompleteProps {
  /** Label shown above the field; always rendered for assistive technology. */
  label: string;
  /** The chosen suggestion, or `null` when nothing is chosen. */
  value: AutocompleteOption | null;
  /** Called with the suggestion the user chose, or `null` when it is cleared. */
  onChange: (option: AutocompleteOption | null) => void;
  /** The suggestions, when the list is known up front. */
  options?: readonly AutocompleteOption[];
  /**
   * Finds the suggestions for a query, when the list has to be fetched. Takes
   * precedence over `options`.
   */
  onSearch?: (
    query: string,
  ) => readonly AutocompleteOption[] | Promise<readonly AutocompleteOption[]>;
  /**
   * Control height.
   * @default 'md'
   */
  size?: ControlSize;
  /** Ghost text shown while the field is empty. */
  placeholder?: string;
  /** Helper text shown under the field. */
  description?: string;
  /** Glyph rendered inside the leading edge of the field. */
  startIcon?: TectonIconRef;
  /** Validation feedback; an error also sets `aria-invalid`. */
  status?: FieldStatus;
  /**
   * How many suggestions to show at once.
   * @default 10
   */
  maxSuggestions?: number;
  /**
   * How many characters must be typed before the list opens.
   * @default 1
   */
  minQueryLength?: number;
  /**
   * How long to wait after the last keystroke before searching, in
   * milliseconds. Set it to 0 for a list that is already in memory.
   * @default 150
   */
  debounceMs?: number;
  /**
   * Opens the list on focus, before anything has been typed.
   * @default false
   */
  hasSuggestionsOnFocus?: boolean;
  /**
   * Shows a clear button once a suggestion is chosen.
   * @default true
   */
  hasClear?: boolean;
  /**
   * Visually hides the label, keeping it for assistive technology.
   * @default false
   */
  isLabelHidden?: boolean;
  /**
   * Prevents interaction and dims the field.
   * @default false
   */
  isDisabled?: boolean;
  /**
   * Marks the field required.
   * @default false
   */
  isRequired?: boolean;
  /**
   * What the list says when nothing matches.
   * @default 'No results found'
   */
  emptyText?: string;
  /** Width of the whole field — a number is pixels, a string is used as-is. */
  width?: number | string;
  /** Test hook. */
  'data-testid'?: string;
}

export function Autocomplete({
  label,
  value,
  onChange,
  options,
  onSearch,
  size = 'md',
  placeholder,
  description,
  startIcon,
  status,
  maxSuggestions = 10,
  minQueryLength = 1,
  debounceMs = 150,
  hasSuggestionsOnFocus = false,
  hasClear = true,
  isLabelHidden = false,
  isDisabled = false,
  isRequired = false,
  emptyText = 'No results found',
  width,
  'data-testid': testId,
}: AutocompleteProps) {
  const source = useMemo(() => {
    const all = options ?? [];
    return {
      search: async (query: string) => {
        if (onSearch !== undefined) return [...(await onSearch(query))];
        const needle = query.trim().toLowerCase();
        return all.filter(option =>
          option.label.toLowerCase().includes(needle),
        );
      },
      bootstrap: () => [...all].slice(0, maxSuggestions),
    };
  }, [options, onSearch, maxSuggestions]);

  return (
    <Typeahead<AutocompleteOption>
      label={label}
      value={value}
      onChange={onChange}
      searchSource={source}
      size={size}
      placeholder={placeholder}
      description={description}
      startIcon={resolveIcon(startIcon)}
      status={status}
      statusVariant="detached"
      maxMenuItems={maxSuggestions}
      minQueryLength={minQueryLength}
      debounceMs={debounceMs}
      hasEntriesOnFocus={hasSuggestionsOnFocus}
      hasClear={hasClear}
      isLabelHidden={isLabelHidden}
      isDisabled={isDisabled}
      isRequired={isRequired}
      emptySearchResultsText={emptyText}
      width={width}
      data-testid={testId}
    />
  );
}

Autocomplete.displayName = 'Autocomplete';
