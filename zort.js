/*
Zort plugin - Sort/filter tables
*/
(function ($) {
    $.fn.zort = function() {
        return this.each(function () {

            var backup = $(this).html()
            var total = $(this).find("tr").length - 1
            var table = $(this);
            table.css("position", "relative");

            function addFilter() {
                var search = $('<div>');
                var input = $('<input>');
                input.attr("placeholder", "Enter search string...");
                input.keyup(function(ev) {
                    filter(this.value);
                });

                search.append(input);
                table.after(search);
            };

            function setHandlers() {
                table.find("th").click(function(ev) {
                    handler(this, ev);
                }).css("cursor", "pointer").addClass("zort");
            };

            function handler(th, ev) {
                var $th = $(th);
                var index = $(th).index();
                $th.siblings().removeClass('asc desc');

                if ($th.hasClass("asc")) { //already sorted asc, sort desc
                    $th.removeClass("asc");
                    $th.addClass("desc");
                    sort(index, "desc");
                } else if ($th.hasClass("desc")) { //sorted desc, reset table
                    reset();
                } else { //not sorted, sort asc
                    $th.addClass("asc");
                    sort(index, "asc");
                }
            };

            function sort(col, order) {
                for (j = 0; j < total; ++j) {
                    for (i = 1; i < total - j; ++i) {
                        var row1 = $(table.find("tr")[i]);
                        var row2 = $(table.find("tr")[i + 1]);
                        var val1 = row1.find("td")[col].innerHTML;
                        var val2 = row2.find("td")[col].innerHTML;

                        if (val1 != "" && !isNaN(val1)) val1 = val1 * 1;
                        if (val2 != "" && !isNaN(val2)) val2 = val2 * 1;

                        if (order == "asc") {
                            if (val1 > val2) {
                                row1.before(row2);
                            }
                        } else if (order == "desc"){
                            if (val1 < val2) {
                                row1.before(row2);
                            }
                        }
                    }
                }
            };

            function filter(str) {
                str = str.toLowerCase();

                for (i = 1; i <= total; ++i) {
                    var row = $(table.find("tr")[i]);
                    var cells = row.find("td");
                    var visible = false;

                    for (j = 0; j < cells.length; ++j) {
                        var text = cells[j].innerHTML.toLowerCase();

                        if (text.indexOf(str) > -1) {
                            visible = true;
                        }
                    }

                    if (!visible) {
                        row.hide();
                    } else {
                        row.show();
                    }
                }
            };

            function reset() {
                table.html(backup);
                setHandlers();
            };

            // Init
            setHandlers();
            addFilter();
        });
    };
}(jQuery));
