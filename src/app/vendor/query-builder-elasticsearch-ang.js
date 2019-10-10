"use strict";

let OPERATORS = {
  equal: {
    type: "equal",
    nb_inputs: 1,
    multiple: false,
    apply_to: ["string", "number", "datetime", "boolean"]
  },
  less: {
    type: "less",
    nb_inputs: 1,
    multiple: false,
    apply_to: ["number", "datetime"]
  },
  not_equal: {
    type: "not_equal",
    nb_inputs: 1,
    multiple: false,
    apply_to: ["string", "number", "datetime", "boolean"]
  },
  in: {
    type: "in",
    nb_inputs: 1,
    multiple: true,
    apply_to: ["string", "number", "datetime"]
  },
  not_in: {
    type: "not_in",
    nb_inputs: 1,
    multiple: true,
    apply_to: ["string", "number", "datetime"]
  },
  less_or_equal: {
    type: "less_or_equal",
    nb_inputs: 1,
    multiple: false,
    apply_to: ["number", "datetime"]
  },
  greater: {
    type: "greater",
    nb_inputs: 1,
    multiple: false,
    apply_to: ["number", "datetime"]
  },
  greater_or_equal: {
    type: "greater_or_equal",
    nb_inputs: 1,
    multiple: false,
    apply_to: ["number", "datetime"]
  },
  between: {
    type: "between",
    nb_inputs: 2,
    multiple: false,
    apply_to: ["number", "datetime"]
  },
  not_between: {
    type: "not_between",
    nb_inputs: 2,
    multiple: false,
    apply_to: ["number", "datetime"]
  },
  begins_with: {
    type: "begins_with",
    nb_inputs: 1,
    multiple: false,
    apply_to: ["string"]
  },
  not_begins_with: {
    type: "not_begins_with",
    nb_inputs: 1,
    multiple: false,
    apply_to: ["string"]
  },
  contains: {
    type: "contains",
    nb_inputs: 1,
    multiple: false,
    apply_to: ["string"]
  },
  not_contains: {
    type: "not_contains",
    nb_inputs: 1,
    multiple: false,
    apply_to: ["string"]
  },
  ends_with: {
    type: "ends_with",
    nb_inputs: 1,
    multiple: false,
    apply_to: ["string"]
  },
  not_ends_with: {
    type: "not_ends_with",
    nb_inputs: 1,
    multiple: false,
    apply_to: ["string"]
  },
  is_empty: {
    type: "is_empty",
    nb_inputs: 0,
    multiple: false,
    apply_to: ["string"]
  },
  is_not_empty: {
    type: "is_not_empty",
    nb_inputs: 0,
    multiple: false,
    apply_to: ["string"]
  },
  is_null: {
    type: "is_null",
    nb_inputs: 0,
    multiple: false,
    apply_to: ["string", "number", "datetime", "boolean"]
  },
  is_not_null: {
    type: "is_not_null",
    nb_inputs: 0,
    multiple: false,
    apply_to: ["string", "number", "datetime", "boolean"]
  }
};
// DEFAULT CONFIG
// ===============================

function ESBoolOperators(cond) {
  if (cond === "equal") {
    return v => v;
  } else if (cond === "not_equal") {
    return v => v;
  } else if (cond === "less") {
    return v => {
      return { lt: v };
    };
  } else if (cond === "less_or_equal") {
    return v => {
      return { lte: v };
    };
  } else if (cond === "greater") {
    return v => {
      return { gt: v };
    };
  } else if (cond === "greater_or_equal") {
    return v => {
      return { gte: v };
    };
  } else if (cond === "between") {
    return v => {
      return { gte: v[0], lte: v[1] };
    };
  } else if (cond === "in") {
    return v =>
      v.split(",").map(function(e) {
        return e.trim();
      });
  } else if (cond === "not_in") {
    return v =>
      v.split(",").map(function(e) {
        return e.trim();
      });
  } else if (cond === "is_null") {
    return v => v;
  } else if (cond === "is_not_null") {
    return v => v;
  }
}
function ESQueryStringQueryOperators(cond) {
  if (cond === "is_not_null") {
    return "_exists_:";
  } else if (cond === "is_null") {
    return "_missing_";
  } else if (cond === "contains") {
    return v;
  } else if (cond === "between") {
    return "[" + v[0] + " TO " + v[1] + "]";
  }
}

export function getESBool(data) {
  var that = this;

  return (function parse(data) {
    if (!data.condition) {
      data.condition = "AND";
    }

    if (["AND", "OR"].indexOf(data.condition.toUpperCase()) === -1) {
      throw new Error(
        'Unable to build Elasticsearch bool query with condition "{0}"'.replace(
          "{0}",
          data.condition
        )
      );
    }

    if (!data.rules) {
      return {};
    }

    var parts = {};
    parts.add = function(k, v) {
      if (this.hasOwnProperty(k)) {
        this[k].push(v);
      } else {
        this[k] = [v];
      }
    };
    console.log("MMMMMMMM", parts);

    data.rules.map(rule => {
      function get_value(rule) {
        if (rule.data && rule.data.hasOwnProperty("transform")) {
          return window[rule.data.transform].call(this, rule.value);
        } else {
          return rule.value;
        }
      }

      function make_query(rule) {
        let ope;
        var mdb = ESBoolOperators(rule.operator);
        let chk = OPERATORS.hasOwnProperty(rule.operator);
        if (chk) ope = OPERATORS[rule.operator];
        console.log("MMMMMMMM ope", ope);
        console.log("MMMMMMMM ope", mdb);
        let part = {};

        if (mdb === undefined) {
          throw new Error(
            'Unknown elasticsearch operation for operator "{0}"'.replace(
              "{0}",
              rule.operator
            )
          );
        }

        if (ope.nb_inputs !== 0) {
          var es_key_val = {};
          es_key_val[rule.field] = mdb.call(that, get_value(rule));
          part[getQueryDSLWord(rule)] = es_key_val;
        }

        if (rule.operator === "is_null" || rule.operator === "is_not_null") {
          part = { exists: { field: rule.field } };
        }
        console.log("MMMMMMMM part11111", part);
        // this is a corner case, when we have an "or" group and a negative operator,
        // we express this with a sub boolean query and must_not.
        if (
          data.condition === "OR" &&
          (rule.operator === "not_equal" ||
            rule.operator === "not_in" ||
            rule.operator === "is_null")
        ) {
          return { bool: { must_not: [part] } };
        } else {
          return part;
        }
      }

      var clause = getClauseWord(data.condition, rule.operator);

      if (rule.rules && rule.rules.length > 0) {
        parts.add(clause, parse(rule));
      } else {
        parts.add(clause, make_query(rule));
      }
    });

    delete parts.add;
    console.log("MMMMMMMM", parts);
    return { bool: parts };
  })(data);
}

/**
 * Get the right type of query term in elasticsearch DSL
 */
function getQueryDSLWord(rule) {
  var term = /^(equal|not_equal)$/.exec(rule.operator),
    wildcard = /.(\*|\?)/.exec(rule.value),
    terms = /^(in|not_in)$/.exec(rule.operator);

  if (term !== null && wildcard !== null) {
    return "wildcard";
  }
  if (term !== null) {
    return "term";
  }
  if (terms !== null) {
    return "terms";
  }
  return "range";
}

/**
 * Get the right type of clause in the bool query
 */
function getClauseWord(condition, operator) {
  if (
    condition === "AND" &&
    (operator !== "not_equal" &&
      operator !== "not_in" &&
      operator !== "is_null")
  ) {
    return "must";
  }
  if (
    condition === "AND" &&
    (operator === "not_equal" || operator == "not_in" || operator === "is_null")
  ) {
    return "must_not";
  }
  if (condition === "OR") {
    return "should";
  }
}
