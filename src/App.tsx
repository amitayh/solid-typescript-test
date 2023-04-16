import { createSignal, For, Switch, Match } from "solid-js";
import { Select } from "./Select";
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

const defaultFilter: Filter = {
  field: "name",
  operator: Operator.Equals,
  value: "",
};

const filterGroupOperators = { and: "And", or: "Or" };

function FilterGroupWidget(props: {
  filterGroup: FilterGroup;
  onChange?: (f: FilterGroup) => void;
}) {
  const onOperatorChange = (operator: "and" | "or") => {
    if (props.onChange) {
      props.onChange({ operator, filters: props.filterGroup.filters });
    }
  };
  const onFilterChange = (index: number, filter: Filter) => {
    if (props.onChange) {
      const filters = [...props.filterGroup.filters];
      filters[index] = filter;
      props.onChange({ ...props.filterGroup, filters });
    }
  };
  const removeFilter = (index: number) => {
    if (props.onChange) {
      const filters = props.filterGroup.filters.filter(
        (_, filterIndex) => index != filterIndex
      );
      props.onChange({ ...props.filterGroup, filters });
    }
  };
  const addFilter = () => {
    if (props.onChange) {
      const filters = [...props.filterGroup.filters];
      filters.push(defaultFilter);
      props.onChange({ ...props.filterGroup, filters });
    }
  };
  const addFilterGroup = () => {
    if (props.onChange) {
      const filters = [...props.filterGroup.filters];
      filters.push({
        operator: "and",
        filters: [defaultFilter],
      });
      props.onChange({ ...props.filterGroup, filters });
    }
  };

  return (
    <>
      <ul>
        <For each={props.filterGroup.filters}>
          {(filter, i) => (
            <li>
              <Switch fallback={props.filterGroup.operator}>
                <Match when={i() == 0}>Where</Match>
                <Match when={i() == 1}>
                  <Select
                    options={filterGroupOperators}
                    selected={props.filterGroup.operator}
                    onChange={onOperatorChange}
                  />
                </Match>
              </Switch>{" "}
              <FilterWidget
                filter={filter}
                onChange={(updated) => onFilterChange(i(), updated)}
              />
              <button onClick={() => removeFilter(i())}>Remove</button>
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

const stringOperators = {
  [Operator.Equals]: "=",
  [Operator.NotEquals]: "≠",
  [Operator.Contains]: "contains",
  [Operator.DoesNotContain]: "doesn't contain",
};

function StringWidget(props: {
  value: StringValue;
  onChange?: (value: StringValue) => void;
}) {
  return (
    <>
      <Select
        options={stringOperators}
        selected={props.value.operator}
        onChange={(operator) =>
          props.onChange && props.onChange({ ...props.value, operator })
        }
      />
      <input
        value={props.value.value}
        onChange={(e) =>
          props.onChange &&
          props.onChange({ ...props.value, value: e.currentTarget.value })
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

function NumberWidget(props: {
  value: NumberValue;
  onChange?: (value: NumberValue) => void;
}) {
  const { value, onChange } = props;
  if ("value" in value) {
    return (
      <>
        <Select
          options={numberOperators}
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
        <Select
          options={numberOperators}
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

function DateInput(props: { date: Date }) {
  const dateString = () => props.date.toISOString().substring(0, 10);
  return <input type="date" value={dateString()} />;
}

function DateWidget(props: { value: DateValue }) {
  if (
    props.value.operator == Operator.Equals ||
    props.value.operator == Operator.GreaterThan ||
    props.value.operator == Operator.LessThan ||
    props.value.operator == Operator.Between ||
    props.value.operator == Operator.NotBetween
  ) {
    return (
      <>
        <Select options={dateOperators} selected={props.value.operator} />
        {"value" in props.value ? (
          <DateInput date={props.value.value} />
        ) : (
          <>
            <DateInput date={props.value.range[0]} />
            {" and "}
            <DateInput date={props.value.range[1]} />
          </>
        )}
      </>
    );
  }
}

const fields = {
  none: "",
  name: "Name",
  age: "Age",
  dob: "Daye of birth",
  country: "Country",
  married: "Married?",
};

function FieldWidget(props: { field: Field; onChange?: (field: Field) => void }) {
  switch (props.field.field) {
    case "name":
      return (
        <>
          <Select options={fields} selected={props.field.field} />
          <StringWidget
            value={props.field}
            onChange={(value) =>
              props.onChange && props.onChange({ ...value, field: "name" })
            }
          />
        </>
      );

    case "age":
      return (
        <>
          Age:{" "}
          <NumberWidget
            value={props.field}
            onChange={(value) =>
              props.onChange && props.onChange({ ...value, field: "age" })
            }
          />
        </>
      );

    case "dob":
      return (
        <>
          Date of birth: <DateWidget value={props.field} />
        </>
      );

    case "country":
      return <>Country: {JSON.stringify(props.field.values)}</>;

    case "married":
      return (
        <>
          Married:{" "}
          <input
            type="checkbox"
            checked={props.field.value}
            onChange={(e) =>
              props.onChange &&
              props.onChange({
                field: "married",
                value: e.currentTarget.checked,
              })
            }
          />
        </>
      );
  }
}

function FilterWidget(props: {
  filter: Filter;
  onChange?: (filter: Filter) => void;
}) {
  if ("field" in props.filter) {
    return (
      <FieldWidget
        field={props.filter}
        onChange={(filter) => props.onChange && props.onChange(filter)}
      />
    );
  } else {
    return (
      <FilterGroupWidget filterGroup={props.filter} onChange={props.onChange} />
    );
  }
}

function App() {
  const [getFilter, setFilter] = createSignal(filter);

  return (
    <div class="App">
      <h1>Vite + Solid!</h1>
      <FilterWidget filter={getFilter()} onChange={setFilter} />
      <pre>{JSON.stringify(getFilter(), null, 2)}</pre>
    </div>
  );
}

export default App;
