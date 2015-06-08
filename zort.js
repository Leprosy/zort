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

            function addFilterBox() {
                var search = $('<div>');
                var input = $('<input>');
                input.attr("placeholder", "Search table...");

                input.keyup(function(ev) {
                    filter(this.value);
                });

                search.append(input);
                table.after(search);
            }

            function setHandlers() {
                table.find("th").click(function(ev) {
                    doSorting(this, ev);
                }).contextmenu(function(ev) {
                    showMenu(this, ev);
                    return false;
                }).css("cursor", "pointer").addClass("zort");
            }

            function showMenu(th, ev) {
                $('.zort-menu').remove();

                // menu
                var menu = $('<div class="zort-menu">');
                menu.css({
                    position: "absolute",
                    top: ev.clientY + "px",
                    left: ev.clientX + "px",
                    background: "#ccc",
                    border: "1px solid #000",
                    padding: "4px"
                });

                // content
                table.find("th").each(function(i, el) {
                    var val = $(el).hasClass("zort-toggled") ? "" : "checked";
                    var link = $('<label><input ' + val + ' id="' + i + '" type="checkbox">' + el.innerHTML + '</label><br />');
                    link.css("cursor", "pointer");
                    link.find('input').click(function(ev) {
                        toggle(this.id);
                    });
                    menu.append(link);
                });

                menu.append("<hr />");
                var input = $('<input>');
                input.attr("placeholder", "Search column...");
                input.keyup(function(ev) {
                    filter(this.value, $(th).index());
                });
                menu.append(input);

                close = $('<br /><br /><button>Close</button>');
                close.click(function() { $('.zort-menu').remove(); });
                menu.append(close);

                $("body").append(menu);
            }

            function toggle(col) {
                var $th = $(table.find("th")[col]);

                if ($th.hasClass("zort-toggled")) {
                    $th.removeClass("zort-toggled");
                } else {
                    $th.addClass("zort-toggled");
                }

                var trs = table.find("tr");

                trs.each(function(i, tr) {
                    var tds = $(tr).find("td, th");

                    tds.each(function(j, td) {
                        if (j == col) {
                            $(td).toggle();
                        }
                    });
                });
            }

            function doSorting(th, ev) {
                var $th = $(th);
                var index = $(th).index();
                $th.siblings().removeClass('asc desc');

                if ($th.hasClass("asc")) { //already sorted asc, sort desc
                    $th.removeClass("asc");
                    $th.addClass("desc");
                    sort(index, "desc");
                } else if ($th.hasClass("desc")) { //sorted desc, reset table
                    $th.removeClass("desc");
                    reset();
                } else { //not sorted, sort asc
                    $th.addClass("asc");
                    sort(index, "asc");
                }
            }

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
            }

            function filter(str, col) {
                str = str.toLowerCase();
                str = str.replace("<", "&lt;").replace(">", "&gt;");

                for (i = 1; i <= total; ++i) {
                    var row = $(table.find("tr")[i]);
                    var cells = row.find("td");
                    var visible = false;

                    for (j = 0; j < cells.length; ++j) {
                        if (col == undefined || col == j) {
                            var text = cells[j].innerHTML.toLowerCase();

                            if (text.indexOf(str) > -1) {
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
            }

            function reset() {
                var backTable = $('<table>');
                backTable.html(backup);
                var trs = backTable.find("tr");

                table.find("tr").each(function(i, el) {
                    var tr = $(trs[i]);

                    $(el).find("td, th").each(function(j, cell) {
                        var td = $(tr.find("td, th")[j]);
                        console.log(td.html(), $(cell).html());
                        $(cell).html(td.html());
                    });
                });
            }

            // Init
            setHandlers();
            addFilterBox();
        });
    };
}(jQuery));
