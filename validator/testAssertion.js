// jshint node:true
// jshint shadow:true
module.exports = testAssertion;

var includeExternalDocument = require('./includeExternalDocument');

function testAssertion(test, context, select, xmlDoc, externalDir, xmlSnippetMaxLength) {
    var results = [];
    
    // Determine the sections within context
    var selected = [];
    if (context) {
        if (context.indexOf('/')) {
            context = '//' + context;
        }
        selected = select(context, xmlDoc);
    }
    else {
        selected = [xmlDoc];
    }
    
    // Extract values from external document and modify test if a document call is made
    var originalTest = test;
    try {
        test = includeExternalDocument(test, externalDir);
    }
    catch (err) {
        return { ignored: true, errorMessage: err.message };
    }
    
    // Check against non-regular expressions with mutually exclusive bracket groups
    var falsePositive = false;
    if (test.indexOf('[') > 0) {
        var bracketDepth = 0;
        for (var i = test.indexOf('['); i < test.length; i++) {
            if (!bracketDepth && test[i] !== '[') {
                falsePositive = true;
            }
            if (test[i] === '[') {
                bracketDepth++;
            }
            else if (test[i] === ']') {
                bracketDepth--;
            }
        }
    }
    // Determine whether the test has a predicate or IS a predicate
    if (/^[^\[\]]+(\[.+\])+$/.test(test) && !falsePositive) { // has predicate(s), acts as a selector
        // Extract predicate and base element
        var matches = /^[^\[\]]+(\[.+\])+$/.exec(test);
        var predicate = matches[1].slice(1, -1).split('][').pop();
        var base = test.slice(0, -(predicate.length + 2));

        // For each section within context..
        for (var i = 0; i < selected.length; i++) {
            // For each element to test predicate on..
            try {
                var elements = select(base, selected[i]);
                var valid = false;
                for (var j = 0; j < elements.length; j++) {
                    // Test predicate on element
                    try {
                        var result = select('boolean(' + predicate + ')', elements[j]);
                        if (result) {
                            valid = result;
                            break;
                        }
                    }
                    catch (err) {
                        return { ignored: true, errorMessage: err.message };
                    }
                }
                var lineNumber = null;
                var xmlSnippet = null;
                var modifiedTest = null;
                if (selected[i].lineNumber) {
                    lineNumber = selected[i].lineNumber;
                    xmlSnippet = selected[i].toString();
                }
                if (xmlSnippet && xmlSnippet.length > (xmlSnippetMaxLength || 1e308)) {
                    xmlSnippet = xmlSnippet.slice(0, (xmlSnippetMaxLength || 1e308)) + '...';
                }
                if (originalTest !== test) {
                    modifiedTest = test;
                }
                results.push({ result: valid, line: lineNumber, path: getXPath(selected[i]), xml: xmlSnippet, modifiedTest: modifiedTest });
            }
            catch (err) {
                return { ignored: true, errorMessage: err.message };
            }
        }
    }
    else { // is a predicate, returns a boolean
        // For each section within context..
        for (var i = 0; i < selected.length; i++) {
            // Test predicate
            try {
                var result = select('boolean(' + test + ')', selected[i]);
                var lineNumber = null;
                var xmlSnippet = null;
                var modifiedTest = null;
                if (selected[i].lineNumber) {
                    lineNumber = selected[i].lineNumber;
                    xmlSnippet = selected[i].toString();
                }
                if (xmlSnippet && xmlSnippet.length > (xmlSnippetMaxLength || 1e308)) {
                    xmlSnippet = xmlSnippet.slice(0, (xmlSnippetMaxLength || 1e308)) + '...';
                }
                if (originalTest !== test) {
                    modifiedTest = test;
                }
                results.push({ result: result, line: lineNumber, path: getXPath(selected[i]), xml: xmlSnippet, modifiedTest: modifiedTest });
            }
            catch (err) {
                return { ignored: true, errorMessage: err.message };
            }
        }
    }
    
    for (var i = 0; i < results.length; i++) {
        if (results[i].result !== true && results[i].result !== false) {
            return { ignored: true, errorMessage: 'Test returned non-boolean result' };
        }
    }
    return results;
}

function getXPath(node, path) {
    var top = !path ? true : false;
    path = path || [];
    if (node.parentNode) {
        path = getXPath(node.parentNode, path);
    }

    var count = 1;
    if (node.previousSibling) {
        var sibling = node.previousSibling;
        do {
            if (sibling.nodeType === 1 && sibling.nodeName === node.nodeName) {
                count++;
            }
            sibling = sibling.previousSibling;
        } while (sibling);
        if (count === 1) {
            count = null;
        }
    }
    else if (node.nextSibling) {
        var sibling = node.nextSibling;
        do {
            if (sibling.nodeType === 1 && sibling.nodeName === node.nodeName) {
                var count = 1;
                sibling = null;
            } else {
                var count = null;
                sibling = sibling.previousSibling;
            }
        } while (sibling);
    }

    if (node.nodeType === 1) {
        path.push(node.nodeName + ('[' + (count || 1) + ']'));
    }
    return top ? '/' + path.join('/') : path;
}