/*
Zort plugin - Sort/filter tables
*/
(function ($) {
    /**
     * Sort table 
     */
    function doSort(th, backup, onSort) {
        var $th = $(th);
        var $table = $th.parents('table');
        var index = $th.index();
        var direction = "asc";
        $th.siblings().removeClass('asc desc');

        if ($th.hasClass("asc")) { //already sorted asc, sort desc
            $th.removeClass("asc");
            $th.addClass("desc");
            direction = "desc";
            _sort($table, index, "desc");
        } else if ($th.hasClass("desc")) { //sorted desc, reset table
            $th.removeClass("desc");
            clearSort($table, backup);
            direction = undefined;
        } else { //not sorted, sort asc
            $th.addClass("asc");
            _sort($table, index, "asc");
        }

        // Hook
        onSort($table, index, direction);
    }

    function _sort($table, colIndex, order) {
        var total = $table.find('tr').length - 1;

        for (j = 0; j < total; ++j) {
            for (i = 1; i < total - j; ++i) {
                var row1 = $($table.find("tr")[i]);
                var row2 = $($table.find("tr")[i + 1]);
                var val1 = row1.find("td")[colIndex].innerHTML;
                var val2 = row2.find("td")[colIndex].innerHTML;

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
    }

    /**
     * Clears the sorting
     */
    function clearSort($table, backup) {
        var backTable = $('<table/>');
        backTable.html(backup);
        var trs = backTable.find("tr");

        $table.find("tr").each(function(i, el) {
            var tr = $(trs[i]);

            $(el).find("td, th").each(function(j, cell) {
                var td = $(tr.find("td, th")[j]);
                $(cell).html(td.html());
            });
        });
    }

    /**
     * Toggle a column
     */
    function toggleColumn($table, colIndex, onToggle) {
        var $th = $($table.find("th")[colIndex]);

        if ($th.hasClass("zort-toggled")) {
            $th.removeClass("zort-toggled");
        } else {
            $th.addClass("zort-toggled");
        }

        var trs = $table.find("tr");

        trs.each(function(i, tr) {
            var tds = $(tr).find("td, th");

            tds.each(function(j, td) {
                if (j == colIndex) {
                    $(td).toggle();
                }
            });
        });

        // Hook
        onToggle($table, colIndex);
    }

    /**
     * Filters the table data
     */
    function doFilter($table, searchStr, colIndex, onFilter) {
        var total = $table.find("tr").length - 1;
        nsearchStr = searchStr.toLowerCase();
        nsearchStr = nsearchStr.replace("<", "&lt;").replace(">", "&gt;");

        for (i = 1; i <= total; ++i) {
            var row = $($table.find("tr")[i]);
            var cells = row.find("td");
            var visible = false;

            for (j = 0; j < cells.length; ++j) {
                if (colIndex == undefined || colIndex == j) {
                    var text = cells[j].innerHTML.toLowerCase();

                    if (text.indexOf(nsearchStr) > -1) {
                        visible = true;
                    }
                }
            }

            if (!visible) {
                row.hide();
            } else {
                row.show();
            }
        }

        // Hook
        onFilter($table, searchStr, colIndex);
    }

    /**
     * Clear th context menu 
     */
    function clearMenu() {
        $('.zort-menu').remove();
    }

    /**
     * Draws the th context menu
     */
    function showMenu(th, ev, options) {
        var $th = $(th);
        var $table = $th.parents('table');
        clearMenu();

        // menu
        var menu = $('<div class="zort-menu">');
        menu.css({
            position: "absolute",
            top: ev.clientY + "px",
            left: ev.clientX + "px",
            background: "#ccc",
            border: "1px solid #000",
            padding: "4px",
            "font-family": "Arial, sans",
            "font-size": "80%"
        });

        // toggle th's
        $table.find("th").each(function(i, el) {
            var $el = $(el);
            var val = $el.hasClass("zort-toggled") ? "" : "checked";
            var input = '<input ' + val + ' id="' + i + '" type="checkbox" />';
            var link = $('<label>' + input + $el.html() + '</label><br />');
            link.css("cursor", "pointer");
            link.find('input').click(function(ev) {
                toggleColumn($table, this.id, options.onToggle);
            });
            menu.append(link);
        });

        // filter box
        menu.append("<hr />");
        var input = $('<input/>');
        input.addClass("zort-filter");
        input.attr("placeholder", "Search " + $th.html() + "...");
        input.keyup(function(ev) {
            doFilter($table, this.value, $th.index(), options.onFilter);
        });
        menu.append(input);

        close = $('<button>Close</button>');
        close.css({display: "block", margin: "4px auto 0 auto"});
        close.click(function() { clearMenu(); });
        menu.append(close);

        $("body").append(menu);
    }




    /**
     * Plugin code
     */
    $.fn.zort = function(obj) {
        var options = $.extend({
            onFilter: function() {},
            onSort: function() {},
            onToggle: function() {}
        }, obj);

        return this.each(function () {
            var $table = $(this);
            var backup = $table.html();

            // Set the sorting/toggling handlers
            $table.find("th")
                  .click(function(ev) { doSort(this, backup, options.onSort); })
                  .contextmenu(function(ev) { showMenu(this, ev, options); return false; })
                  .css("cursor", "pointer")
                  .addClass("zort-handler");

            // Add table filter box
            var filterBox = $('<div/>');
            var input = $('<input/>');
            input.attr("placeholder", "Search table...");
            input.attr("class", "zort-filter");
            input.keyup(function(ev) {
                doFilter($table, this.value, undefined, options.onFilter);
            });
            filterBox.append(input);
            $table.after(filterBox);
        });
    };
}(jQuery));
