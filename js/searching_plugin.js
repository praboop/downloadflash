// $(document).ready(setUpSearch).on('page:load', setUpSearch);
window.extension = window.extension || {};
window.extension.downloadlinks = window.extension.downloadlinks || {};

window.extension.downloadlinks.initSearch = function() {
    $(".search_input").on("keyup", searchInTable);
    $("#ShowChecked").on("click", handleCheck);
}

function handleCheck() {
    $(".search_input").keyup();
}

function searchInTable() {
    var text = $(this).val().toLowerCase().trim();
    var table = $(this).closest("table");
    removeTextHighlighting($("#highlight"));
    var isShowOnlyCheckedItems = $("#ShowChecked").prop('checked');
    console.log('In searchInTable')

    table.find('tbody > tr').each(function() {
        console.log('finding in table')
        var $row = $(this);
        var firstCol = table.find('thead > tr:eq(1) > th:first').data('sort');
        var $tdElement = $row.find("td");
        if (firstCol === 'index') {
            $tdElement = $row.find("td").slice(3);
        }
        var rowText = $tdElement.text().toLowerCase().trim();
        var $inputElement = $row.find("input");
        var isRowChecked = $inputElement.prop('checked');

        if (rowText.indexOf(text) !== -1) {
            addTextHighlighting($tdElement, text);
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
            var newText = $(this).text().replace(text, highlightedText);
            $(this).html(newText);
        }
    });
}