import { For } from "solid-js";

export function Select<T extends string>(props: {
  options: { [key in T]: string };
  selected: T;
  onChange?: (option: T) => void;
}) {
  return (
    <select
      onChange={(e) =>
        props.onChange && props.onChange(e.currentTarget.value as T)
      }
    >
      <For each={Object.entries<string>(props.options)}>
        {([value, label]) => (
          <option value={value} selected={value == props.selected}>
            {label}
          </option>
        )}
      </For>
    </select>
  );
}
