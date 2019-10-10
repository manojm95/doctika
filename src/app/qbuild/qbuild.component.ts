import { Component, OnInit, AfterViewInit } from "@angular/core";
import { getESBool } from "../../app/vendor/query-builder-elasticsearch-ang.js";
// import * as $ from 'jquery';
declare var $: any;
// https://stackoverflow.com/questions/44820788/how-to-use-jquery-query-builder-in-angular
@Component({
  selector: "app-qbuild",
  templateUrl: "./qbuild.component.html",
  styleUrls: ["./qbuild.component.css"]
})
export class QbuildComponent implements AfterViewInit, OnInit {
  protected rules_basic = {
    condition: "AND",
    rules: [
      {
        id: "price",
        operator: "less",
        value: 10.25
      },
      {
        condition: "OR",
        rules: [
          {
            id: "category",
            operator: "equal",
            value: 2
          },
          {
            id: "category",
            operator: "equal",
            value: 1
          }
        ]
      }
    ]
  };

  ngAfterViewInit(): void {
    this.getQueryBuilder();
  }

  private getQueryBuilder() {
    $("#builder").queryBuilder({
      plugins: ["bt-tooltip-errors"],

      filters: [
        {
          id: "name",
          label: "Name",
          type: "string",
          operators: ["equal", "not_equal"]
        },
        {
          id: "category",
          label: "Category",
          type: "integer",
          input: "select",
          values: {
            1: "Books",
            2: "Movies",
            3: "Music",
            4: "Tools",
            5: "Goodies",
            6: "Clothes"
          },
          operators: [
            "equal",
            "not_equal",
            "in",
            "not_in",
            "is_null",
            "is_not_null"
          ]
        },
        {
          id: "in_stock",
          label: "In stock",
          type: "integer",
          input: "radio",
          values: {
            1: "Yes",
            0: "No"
          },
          operators: ["equal"]
        },
        {
          id: "price",
          label: "Price",
          type: "double",
          validation: {
            min: 0,
            step: 0.01
          }
        },
        {
          id: "id",
          label: "Identifier",
          type: "string",
          placeholder: "____-____-____",
          operators: ["equal", "not_equal"],
          validation: {
            format: /^.{4}-.{4}-.{4}$/
          }
        }
      ],

      rules: this.rules_basic
    });
  }

  constructor() {}

  ngOnInit() {
    $("#btn1").on("click", function() {
      // $('#builder-basic').queryBuilder('reset');
      console.log("MMMMM");
    });
    $("#btn-reset").on("click", function() {
      $("#builder").queryBuilder("reset");
    });

    $("#btn-set").on("click", function() {
      console.log("MMMMM");
      $("#builder").queryBuilder("setRules", this.rules_basic);
    });

    $("#btn-get").on("click", function() {
      var result = $("#builder").queryBuilder("getRules");
      let test = getESBool(result);
      console.log("BBBBB111", JSON.stringify(test));

      var esQuery = $("#builder").queryBuilder("getESBool");
      console.log("BBBBB222", JSON.stringify(esQuery));
      if (!$.isEmptyObject(result)) {
        alert(JSON.stringify(result, null, 2));
      }
    });
  }
}
