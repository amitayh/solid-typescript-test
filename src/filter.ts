export enum Operator {
  Equals,
  NotEquals,
  GreaterThan,
  GreaterThanEquals,
  LessThan,
  LessThanEquals,
  Between,
  NotBetween,
  Contains,
  DoesNotContain,
  In,
  NotIn,
}

export type StringValue = {
  operator:
    | Operator.Equals
    | Operator.NotEquals
    | Operator.Contains
    | Operator.DoesNotContain;
  value: string;
};

export type BooleanValue = { value: boolean };

export type SingleComparableValue<T> = {
  operator:
    | Operator.Equals
    | Operator.NotEquals
    | Operator.GreaterThan
    | Operator.GreaterThanEquals
    | Operator.LessThan
    | Operator.LessThanEquals;
  value: T;
};

export type RangeValue<T> = {
  operator: Operator.Between | Operator.NotBetween;
  range: [T, T];
};

export type ListValue<T> = {
  operator: Operator.In | Operator.NotIn;
  values: T[];
};

export type ComparableValue<T> = SingleComparableValue<T> | RangeValue<T>;

export type NumberValue = ComparableValue<number>;

export type DateValue = ComparableValue<Date>;

export type StringListValue = ListValue<string>;

export type Field =
  | ({ field: "name" } & StringValue)
  | ({ field: "age" } & NumberValue)
  | ({ field: "dob" } & DateValue)
  | ({ field: "country" } & StringListValue)
  | ({ field: "married" } & BooleanValue);

export type Filters = { filters: Filter[] };

export type Filter =
  | ({ kind: "field" } & Field)
  | ({ kind: "and" } & Filters)
  | ({ kind: "or" } & Filters);

export const filter: Filter = {
  kind: "and",
  filters: [
    {
      kind: "field",
      field: "name",
      operator: Operator.Contains,
      value: "John",
    },
    {
      kind: "or",
      filters: [
        {
          kind: "field",
          field: "age",
          operator: Operator.Between,
          range: [25, 30],
        },
        {
          kind: "field",
          field: "dob",
          operator: Operator.GreaterThan, // after
          value: new Date("1986-07-09"),
        },
      ],
    },
    {
      kind: "field",
      field: "country",
      operator: Operator.In, // is
      values: ["IL"], // Israel
    },
    {
      kind: "field",
      field: "married",
      value: true,
    },
  ],
};
