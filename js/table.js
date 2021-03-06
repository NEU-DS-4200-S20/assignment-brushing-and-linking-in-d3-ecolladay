/* global D3 */

function table() {

  // Based on Mike Bostock's margin convention
  // https://bl.ocks.org/mbostock/3019563
  let ourBrush = null,
    selectableElements = d3.select(null),
    dispatcher;

  // Create the chart by adding an svg to the div with the id 
  // specified by the selector using the given data
  function chart(selector, data) {
    let table = d3.select(selector)
      .append("table")
        .classed("my-table", true);

    // Here, we grab the labels of the first item in the dataset
    //  and store them as the headers of the table.
    let tableHeaders = Object.keys(data[0]);

    // You should append these headers to the <table> element as <th> objects inside
    // a <th>
    // See https://developer.mozilla.org/en-US/docs/Web/HTML/Element/table

    var header = table.append("thead").append("tr")
      .selectAll("th")
      .data(tableHeaders)
      .enter().append("th")
      .text(function(d){
        return d;
      })

    // Then, you add a row for each row of the data.  Within each row, you
    // add a cell for each piece of data in the row.
    // HINTS: For each piece of data, you should add a table row.
    // Then, for each table row, you add a table cell.  You can do this with
    // two different calls to enter() and data(), or with two different loops.

    var rows = table.append("tbody")
      .selectAll("tr")
      .data(data)
      .enter().append("tr");
    var cells = rows.selectAll("td")
      .data(d => d3.values(d))
      .enter().append("td")
      .text(function(d){
        return d
      });
      


    // Then, add code to allow for brushing.  Note, this is handled differently
    // than the line chart and scatter plot because we are not using an SVG.
    // Look at the readme of the assignment for hints.
    // Note: you'll also have to implement linking in the updateSelection function
    // at the bottom of this function.
    // Remember that you have to dispatch that an object was highlighted.  Look
    // in linechart.js and scatterplot.js to see how to interact with the dispatcher.

    // HINT for brushing on the table: keep track of whether the mouse is down or up, 
    // and when the mouse is down, keep track of any rows that have been mouseover'd

    // YOUR CODE HERE

    var mouseover = d3.selectAll("tr") // Here I created a variable mouseover, to implement the reactive highlighting of the rows
      .on("mouseover", (d, val, elements) =>{
      d3.select(elements[val]).classed("mouseover", true)
      if (mouseover) {
        d3.select(elements[val]).classed("selected", true)
        var dispatchString = Object.getOwnPropertyNames(dispatcher._)[0];
        dispatcher.call(dispatchString, here, table.selectAll(".selected").data());
      }
      })
      .on("mouseup", (d,val,elements) => {
        mouseover = false
      })
      .on("mouseover", (d, val, elements) => {
       d3.selectAll(".selected").classed("selected", false)
       mouseover = true
       d3.select(elements[val]).classed("selected", true)
       .style("background-color", "#ffc0cb")
       var dispatchString = Object.getOwnPropertyNames(dispatcher._)[0];
       dispatcher.call(dispatchString, here, table.selectAll(".selected").data());
      })
      .on("mouseoff", (d,val,elements) => {
        d3.select(elements[val]).classed("mouseover", false).style("background-color", "")
        var dispatchString = Object.getOwnPropertyNames(dispatcher._)[0]; // Why does the highlight color stay there?
        dispatcher.call(dispatchString, here, table.selectAll("").data());
      });

    return chart;
  }

  // Gets or sets the dispatcher we use for selection events
  chart.selectionDispatcher = function (_) {
    if (!arguments.length) return dispatcher;
    dispatcher = _;
    return chart;
  };

  // Given selected data from another visualization 
  // select the relevant elements here (linking)
  chart.updateSelection = function (selectedData) {
    if (!arguments.length) return;

    // Select an element if its datum was selected
    d3.selectAll('tr').classed("selected", d => {
      return selectedData.includes(d)
    });
  };

  return chart;
}