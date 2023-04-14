import { createSignal, For, Switch, Match } from "solid-js";
import {
  DateValue,
  filter,
  NumberValue,
  Operator,
  StringValue,
} from "./filter";
import type { Filter, Field } from "./filter";
import "./App.css";

function FilterGroup({
  filters,
  operator,
  onGroupOperatorChange,
}: {
  filters: Filter[];
  operator: "And" | "Or";
  onGroupOperatorChange?: (o: string) => void;
}) {
  return (
    <>
      <ul>
        <For each={filters}>
          {(filter, i) => (
            <li>
              <Switch fallback={operator}>
                <Match when={i() == 0}>Where</Match>
                <Match when={i() == 1}>
                  <select
                    onChange={(e) =>
                      onGroupOperatorChange &&
                      onGroupOperatorChange(e.currentTarget.value)
                    }
                  >
                    <option value="And">And</option>
                    <option value="Or">Or</option>
                  </select>
                </Match>
              </Switch>{" "}
              <FilterWidget filter={filter} />
            </li>
          )}
        </For>
        <li>
          <button>Add filter</button> | <button>Add filter group</button>
        </li>
      </ul>
    </>
  );
}

type Operators = { [K in Operator]?: string };

function OperatorSelector({
  operators,
  selected,
  onChange,
}: {
  operators: Operators;
  selected: Operator;
  onChange?: (operator: Operator) => void;
}) {
  // const
  return (
    <select
      onChange={(e) => onChange && onChange(parseInt(e.currentTarget.value))}
    >
      <For each={Object.entries(operators)}>
        {([operator, name]) => (
          <option
            value={operator}
            selected={parseInt(operator, 10) == selected}
          >
            {name}
          </option>
        )}
      </For>
    </select>
  );
}

const stringOperators = {
  [Operator.Equals]: "=",
  [Operator.NotEquals]: "≠",
  [Operator.Contains]: "contains",
  [Operator.DoesNotContain]: "doesn't contain",
};

function StringWidget({ value }: { value: StringValue }) {
  return (
    <>
      <OperatorSelector operators={stringOperators} selected={value.operator} />
      <input value={value.value} />
    </>
  );
}

const numberOperators = {
  [Operator.Equals]: "=",
  [Operator.NotEquals]: "≠",
  [Operator.GreaterThan]: ">",
  [Operator.GreaterThanEquals]: "≥",
  [Operator.LessThan]: "<",
  [Operator.LessThanEquals]: "≤",
  [Operator.Between]: "between",
  [Operator.NotBetween]: "not between",
};

function NumberWidget({ value }: { value: NumberValue }) {
  if ("value" in value) {
    return (
      <>
        <OperatorSelector
          operators={numberOperators}
          selected={value.operator}
        />
        <input type="number" value={value.value} />;
      </>
    );
  } else {
    const [from, to] = value.range;
    return (
      <>
        <OperatorSelector
          operators={numberOperators}
          selected={value.operator}
        />
        <input type="number" value={from} />
        and
        <input type="number" value={to} />
      </>
    );
  }
}

const dateOperators = {
  [Operator.Equals]: "on",
  [Operator.GreaterThan]: "after",
  [Operator.LessThan]: "before",
  [Operator.Between]: "between",
  [Operator.NotBetween]: "not between",
};

function DateInput({ date }: { date: Date }) {
  const dateString = date.toISOString().substring(0, 10);
  return <input type="date" value={dateString} />;
}

function DateWidget({ value }: { value: DateValue }) {
  if ("value" in value) {
    return (
      <>
        <OperatorSelector operators={dateOperators} selected={value.operator} />
        <DateInput date={value.value} />
      </>
    );
  } else {
    const [from, to] = value.range;
    return (
      <>
        <OperatorSelector operators={dateOperators} selected={value.operator} />
        <DateInput date={from} /> and <DateInput date={to} />
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
      return <FilterGroup filters={filter.filters} operator="And" />;
    case "or":
      return <FilterGroup filters={filter.filters} operator="Or" />;
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
