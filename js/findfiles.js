var allLinks = document.querySelectorAll("a");
var links = [];
for (let link of allLinks) {
	links.push({url: link.href, text: link.text, attributes: {'title': link.title} } );
}

document.querySelectorAll("[src]").forEach( 
    element => {
        links.push({url: element.src, text: element.text, attributes: {'title': element.title} } ); 
    }
);

Array.prototype.unique = function(mutate) {
    var unique = this.reduce(function(accumArray, current) {
        // console.log('accum ' + JSON.stringify(accumArray) + '\ncurrent '  + JSON.stringify(current));

        if (current === null)
            return accum;

        var alreadyExists = false;
        for (var i=0; i<accumArray.length; i++) {
            var accum = accumArray[i];
            if (accum.url.indexOf(current.url) >= 0) {
                alreadyExists = true;
                break;
            }
        }
        
        if (!alreadyExists) {
            accumArray.push(current);
        }

        return accumArray;
    }, []);
    if (mutate) {
        this.length = 0;
        for (let i = 0; i < unique.length; ++i) {
            this.push(unique[i]);
        }
        return this;
    }
    return unique;
}

links.unique(true);
