/*
Zort plugin - Sort/filter tables
*/
(function ($) {
    var backup, total, table;

    $.fn.zort = function() {
        backup = this.html();
        total = this.find("tr").length - 1;
        table = this;
        setHandlers();
        return this;
    };

    function setHandlers() {
        table.find("th").click(function(ev) {
            handler(this, ev);
        });
    };

    function handler(th, ev) {
        var $th = $(th);
        var index = $(th).index();

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

                if (!isNaN(val1)) val1 = val1 * 1;
                if (!isNaN(val2)) val2 = val2 * 1;

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
        for (i = 1; i <= total; ++i) {
            var row = $(table.find("tr")[i]);
            var cells = row.find("td");
            var visible = false;

            for (j = 0; j < cells.length; ++j) {
                if (cells[j].innerHTML.indexOf(str) > -1) {
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
}(jQuery));
