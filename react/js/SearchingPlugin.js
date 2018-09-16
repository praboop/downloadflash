// $(document).ready(setUpSearch).on('page:load', setUpSearch);
 window.extension = window.extension || {};
 window.extension.downloadlinks = window.extension.downloadlinks || {};

window.extension.downloadlinks.initSearch = function() {
    //console.log('search - initialized' + ' search nos: ' + $(".search_input").length)
    $(".search_input").on("keyup", searchInTable);
    $("#ShowChecked").on("click", handleCheck);
}

function handleCheck() {
    $(".search_input").keyup();
}

function searchInTable() {
    var text = $(this).val().toLowerCase().trim();
    var table = $(".EasyTableSearch");
    removeTextHighlighting($("#highlight"));

    var isShowOnlyCheckedItems = $("#ShowChecked").prop('checked');
    //console.log('search - started')

    table.find('tbody > tr').each(function() {
        //console.log('search - finding in tr')
        var $row = $(this);
        //var firstCol = table.find('thead > tr:eq(0) > th:first').data('sort');
        var $tdElement = $row.find("td");
        var $tdSearchTarget = $tdElement.slice(3);

        /*
        if (firstCol === 'index') {
            $tdElement = $row.find("td").slice(3);
        }
        */

        var rowText = $tdSearchTarget.text().toLowerCase().trim();
        var $inputElement = $row.find("input");
        var isRowChecked = $inputElement.prop('checked');

        if (rowText.indexOf(text) !== -1) {
            addTextHighlighting($tdSearchTarget, text);
            if (isShowOnlyCheckedItems && isRowChecked)
                $row.show();
            else if (!isShowOnlyCheckedItems)
                $row.show();
            else
                $row.hide();
        } else {
            $row.hide();
        }
    });
    resetIndexes(table);
}

function resetIndexes(table) {
    var row = 1;
    table.find('td:nth-child(1)').each(function() {
        var $row = $(this).closest('tr');
        if ($row.is(":visible")) {
            $(this).text(row++);
        }
    });
}

function removeTextHighlighting(element) {
    element.each(function() {
        $(this).replaceWith($(this).html());
    });
}

function addTextHighlighting(columns, text) {
    var highlightedText = '<span id="highlight" class="findElement">' + text + '</span>';
    columns.each(function() {
        if ($(this).text().length !==0 ) {
            var newText = $(this).text().toLowerCase().replace(text, highlightedText);
            // console.log("search - Replacing with new text: " + newText);
            $(this).html(newText);
        }
    });
}