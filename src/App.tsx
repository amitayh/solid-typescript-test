import { createSignal, For, Switch, Match, Accessor } from "solid-js";
import {
  DateValue,
  filter,
  FilterGroup,
  NumberValue,
  Operator,
  StringValue,
} from "./filter";
import type { Filter, Field } from "./filter";
import "./App.css";

function Option(props: { value: string; selected: string; label: string }) {
  return (
    <option value={props.value} selected={props.value == props.selected}>
      {props.label}
    </option>
  );
}

function FilterGroupWidget({
  filterGroup,
  onChange,
}: {
  filterGroup: FilterGroup;
  onChange?: (f: FilterGroup) => void;
}) {
  const operator = filterGroup.kind;
  const onOperatorChange = (e: { currentTarget: HTMLSelectElement }) => {
    const value = e.currentTarget.value;
    if (onChange && (value == "and" || value == "or")) {
      onChange({ kind: value, filters: filterGroup.filters });
    }
  };
  const onFilterChange = (index: number, filter: Filter) => {
    if (onChange) {
      const filters = [...filterGroup.filters];
      filters[index] = filter;
      onChange({ ...filterGroup, filters });
    }
  };
  const addFilter = () => {
    if (onChange) {
      const filters = [...filterGroup.filters];
      filters.push({
        kind: "field",
        field: "name",
        operator: Operator.Equals,
        value: "",
      });
      onChange({ ...filterGroup, filters });
    }
  };
  const addFilterGroup = () => {};

  return (
    <>
      <ul>
        <For each={filterGroup.filters}>
          {(filter, i) => (
            <li>
              <Switch fallback={filterGroup.kind}>
                <Match when={i() == 0}>Where</Match>
                <Match when={i() == 1}>
                  <select onChange={onOperatorChange}>
                    <Option value="and" selected={operator} label="And" />
                    <Option value="or" selected={operator} label="Or" />
                  </select>
                </Match>
              </Switch>{" "}
              <FilterWidget
                filter={filter}
                onChange={(updated) => onFilterChange(i(), updated)}
              />
            </li>
          )}
        </For>
        <li>
          <button onClick={addFilter}>Add filter</button>
          {" | "}
          <button onClick={addFilterGroup}>Add filter group</button>
        </li>
      </ul>
    </>
  );
}

function OperatorSelector<T extends string>({
  operators,
  selected,
  onChange,
}: {
  operators: { [key in T]?: string };
  selected: T;
  onChange?: (operator: T) => void;
}) {
  return (
    <select onChange={(e) => onChange && onChange(e.currentTarget.value as T)}>
      <For each={Object.entries(operators)}>
        {([operator, label]) => (
          <Option value={operator} selected={selected} label={label} />
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

function StringWidget({
  value,
  onChange,
}: {
  value: StringValue;
  onChange?: (v: StringValue) => void;
}) {
  return (
    <>
      <OperatorSelector
        operators={stringOperators}
        selected={value.operator}
        onChange={(operator) => onChange && onChange({ ...value, operator })}
      />
      <input
        value={value.value}
        onChange={(e) =>
          onChange && onChange({ ...value, value: e.currentTarget.value })
        }
      />
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

function NumberWidget({
  value,
  onChange,
}: {
  value: NumberValue;
  onChange?: (v: NumberValue) => void;
}) {
  if ("value" in value) {
    return (
      <>
        <OperatorSelector
          operators={numberOperators}
          selected={value.operator}
          onChange={(operator) => onChange && onChange({ ...value, operator })}
        />
        <input
          type="number"
          value={value.value}
          onChange={(e) =>
            onChange &&
            onChange({
              operator: value.operator,
              value: parseInt(e.currentTarget.value),
            })
          }
        />
        ;
      </>
    );
  } else {
    const [from, to] = value.range;
    return (
      <>
        <OperatorSelector
          operators={numberOperators}
          selected={value.operator}
          onChange={(operator) => onChange && onChange({ ...value, operator })}
        />
        <input
          type="number"
          value={from}
          onChange={(e) =>
            onChange &&
            onChange({
              operator: value.operator,
              range: [parseInt(e.currentTarget.value), to],
            })
          }
        />
        and
        <input
          type="number"
          value={to}
          onChange={(e) =>
            onChange &&
            onChange({
              operator: value.operator,
              range: [from, parseInt(e.currentTarget.value)],
            })
          }
        />
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

function FieldWidget({
  field,
  onChange,
}: {
  field: Field;
  onChange?: (f: Field) => void;
}) {
  switch (field.field) {
    case "name":
      return (
        <>
          Name:{" "}
          <StringWidget
            value={field}
            onChange={(v) => onChange && onChange({ ...v, field: "name" })}
          />
        </>
      );

    case "age":
      return (
        <>
          Age:{" "}
          <NumberWidget
            value={field}
            onChange={(v) => onChange && onChange({ ...v, field: "age" })}
          />
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

function FilterWidget({
  filter,
  onChange,
}: {
  filter: Filter;
  onChange?: (f: Filter) => void;
}) {
  switch (filter.kind) {
    case "and":
    case "or":
      return <FilterGroupWidget filterGroup={filter} onChange={onChange} />;
    case "field":
      return (
        <FieldWidget
          field={filter}
          onChange={(f) => onChange && onChange({ ...f, kind: "field" })}
        />
      );
  }
}

function App() {
  const [getFilter, setFilter] = createSignal(filter);

  return (
    <div class="App">
      <h1>Vite + Solid!</h1>
      <FilterWidget
        filter={getFilter()}
        onChange={(updated) => {
          // console.log("@@@", updated);
          setFilter(updated);
        }}
      />
      <pre>{JSON.stringify(getFilter(), null, 2)}</pre>
    </div>
  );
}

export default App;
