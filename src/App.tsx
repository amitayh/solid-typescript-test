import { createSignal, For, Show } from "solid-js";
import solidLogo from "./assets/solid.svg";
import { DateValue, filter, NumberValue, StringValue } from "./filter";
import type { Filter, Field } from "./filter";
import "./App.css";

function AndWidget({ filters }: { filters: Filter[] }) {
  return (
    <ul>
      <For each={filters}>
        {(filter, i) => (
          <li>
            <Show when={i() > 0} fallback="Where">
              And
            </Show>{" "}
            <FilterWidget filter={filter} />
          </li>
        )}
      </For>
    </ul>
  );
}

function OrWidget({ filters }: { filters: Filter[] }) {
  return (
    <ul>
      <For each={filters}>
        {(filter, i) => (
          <li>
            <Show when={i() > 0} fallback="Where">
              Or
            </Show>{" "}
            <FilterWidget filter={filter} />
          </li>
        )}
      </For>
    </ul>
  );
}

function StringWidget({ value }: { value: StringValue }) {
  return (
    <>
      <select>
        <For each={["=", "≠", "contains", "does not contain"]}>
          {(option) => <option>{option}</option>}
        </For>
      </select>
      <input value={value.value} />
    </>
  );
}

function NumberWidget({ value }: { value: NumberValue }) {
  if ("value" in value) {
    return <input type="number" value={value.value} />;
  } else {
    return (
      <>
        <input type="number" value={value.range[0]} />{" "}
        <input type="number" value={value.range[1]} />
      </>
    );
  }
}

function DateInput({ date }: { date: Date }) {
  const dateString = date.toISOString().substring(0, 10);
  return <input type="date" value={dateString} />;
}

function DateWidget({ value }: { value: DateValue }) {
  if ("value" in value) {
    return <DateInput date={value.value} />;
  } else {
    const [from, to] = value.range;
    return (
      <>
        <DateInput date={from} /> <DateInput date={to} />
      </>
    );
  }
}

function FieldWidget({ field }: { field: Field }) {
  switch (field.field) {
    case "name":
      return (
        <>
          Name: <StringWidget value={field} />
        </>
      );

    case "age":
      return (
        <>
          Age: <NumberWidget value={field} />
        </>
      );

    case "dob":
      return (
        <>
          Date of birth: <DateWidget value={field} />
        </>
      );

    case "country":
      return <>Country: {JSON.stringify(field.values)}</>;

    case "married":
      return (
        <>
          Married: <input type="checkbox" checked={field.value} />
        </>
      );
  }
}

function FilterWidget({ filter }: { filter: Filter }) {
  switch (filter.kind) {
    case "and":
      return <AndWidget filters={filter.filters} />;
    case "or":
      return <OrWidget filters={filter.filters} />;
    case "field":
      return <FieldWidget field={filter} />;
  }
}

function App() {
  const [getFilter, setFilter] = createSignal(filter);

  return (
    <div class="App">
      <h1>Vite + Solid!</h1>
      <FilterWidget filter={getFilter()} />
    </div>
  );
}

export default App;
