/**
Utilities for parsing CCG Markup to encode a derivation in JSON
and render it in HTML.

Nathan Schneider (nschneid)
2014-10-22
*/

var CCGMarkup = (function($, window, undefined) {

function assert(condition, message) {
    if (!condition) {
        message = (message || "Assertion failed");
        if (typeof Error !== "undefined") {
            throw new Error(message);
        }
        throw message; // Fallback
    }
}

/* subsequenceMatches([6,3,5,2,6,5,2],[5,2]) returns [2,5]
 * subsequenceMatches([6,3,5,2,6,5,2],[5,2,6]) returns [2]
 * subsequenceMatches([6,3,5,2,6,5,2],[1,2]) returns []
 */
function subsequenceMatches(array, subseq) {
	var result = [];
	var s = subseq[0];
	var a = -1;
	while (array.indexOf(s,a+1)>-1) {
		a = array.indexOf(s,a+1);
		var different = false;
		for (var b=0; b<subseq.length; b++) {
			if (array[a+b]!=subseq[b]) {
				different = true;
				break;
			}
		}
		if (!different)
			result.push(a);
	}
	return result;
}

/** Replace designated ASCII symbols in the markup with Unicode symbols. */
function smartSymbols(markup) {
	// character replacement
	BLANKET_SUBS = [
		['!','λ'], 
		['@','∀'],
		['%','∃'],
		['&&','∧'],
		['||','∨'],
		['^','↑'],
		['~','¬']];
	for (pair of BLANKET_SUBS)
		markup = markup.replace(pair[0],pair[1],'g');
	
	// prime symbol is subtituted for single straight quote in semantics only
	while (markup!=markup.replace(/(\s[:] [^\n\r]* [:] [^\n\r]*)'/g, "$1′")) {
		markup = markup.replace(/(\s[:] [^\n\r]* [:] [^\n\r]*)'/g, "$1′"); // hacky, but it works
	}
	
	return markup;
}

/**
 * Takes a string containing CCG Markup and produces an object containing properties:
 *   - words: array of words in the sentence (not necessarily separate lexical entries)
 *   - allconstits: list of derivation steps following their order in the input.
 *     Entries are structured with pointers to their dependents, so this data structure
 *     is not JSONifiable.
 *
 * The resulting object also has three methods for converting to simple 
 * JSONifiable representations:
 *   - toFlatList()
 *   - toTree()
 *   - toTable()
 * See documentation where these methods are defined.
 */
function parseCCGMarkup(markup) {	
	// split into lines
	var lines = markup.trim().split(/[\r\n]+/);
	var ww = lines[0].trim().split(/[\s]+/);
	// instead of prohibiting duplicate words, we require the lexical entries 
	// to respect the sentence order, and require binary combinators to 
	// take adjacent constituents
	
	var allconstits = [];
	var constitMap = {};	// name => one of the constits with this name (there may be more!)
	var chart = {};		// [start,end] => last constit built with this span
	var readyFrom = {};	// start index => last (largest) constit built so far starting at that index
	var readyTo = {};	// end index => last constit built so far ending at that index
	lines.splice(0,1);	// remove sentence line
	assert(ww.length>0, ww);
	
	var lastWordInLexicalConstit = null;
	var constit = null;
	for (ln of lines) {
		if (ln.trim()==='') continue;
		
		var parts = (' '+ln.trim()+' ').split(/\s+:\s+/);
		if (parts.length==1) {
			assert(parts[0].trim().endsWith(' ::'), 'Invalid line: '+ln);
			parts = parts[0].split(/\s+::\s+/);
			assert(parts.length==2 && parts[0].trim()!='' && parts[1]=='', 'Invalid line: '+ln);
			
			var constitName = parts[0].trim();
			var constitWords = constitName.split(/\s+/);
			var possibleConstitSpans = subsequenceMatches(ww, constitWords);
			var blockedConstit = false;
			for (start of possibleConstitSpans) {
				var end = start+constitWords.length-1;
				if (!([start,end] in chart)) {
					// block this from occurring as a constituent
					chart[[start,end]] = false;
					blockedConstit = true;
					break;
				}
			}
			assert(blockedConstit, 'Unable to block ['+constitName+'] from becoming a constituent')
			continue;
		}
		assert(parts.length>=2 && parts.length<=3, parts);
		//console.log(parts);
		if (parts[0].trim()!=='') {	// this is a new constituent
			var constitName = parts[0].replace(/\s\s+/g, ' ').trim();
			for (w of constitName.split(/\s+/))
				assert(ww.indexOf(w)!=-1, "Constituent name includes words not in the sentence: "+constitName);
			//assert(!(constitName in constitMap), "Constituent is listed twice: "+constitName);
			constit = {"i": allconstits.length, "name": constitName};
			
		}
		else {
			assert(constit!==null, "First constituent needs a name");
		}
		
		// parse the syntactic category/combination rule
		var syn = parts[1];
		var sem = (parts.length>2) ? parts[2].trim() : null;
		var synparts = syn.split(/(\S*[<>]\S*)/);	// split into operators and constituents. () in regexp tells output to include the splitters.
		//console.log(synparts);
		if (synparts[0].trim()=='') {
			assert(synparts[2].trim()=='');
			synparts.splice(2,1);
			synparts.splice(0,1);
		}
		assert(synparts.length==1 || synparts.length==3 || synparts.length==5);
		if (synparts.length==1) {
			assert(!("isLexical" in constit));
			constit["isLexical"] = true;
			assert(!(constitName in constitMap) || (constitMap[constitName].isLexical), "Lexical constituent has the same name as a nonlexical constituent: "+constitName);
			
			constit["cat"] = synparts[0].trim();
			constit["sem"] = sem;
			var constitWords = constitName.split(/\s+/);
			var possibleSpans = subsequenceMatches(ww, constitWords);
			var foundSpan = false;
			for (start of possibleSpans) {
				var end = start+constitWords.length-1;
				if (!([start,end] in chart)) {
					foundSpan = true;
					break;
				}
			}
			assert(foundSpan, 'No spans in the sentence are available for lexical item ['+constitName+']');
			constit["firstWord"] = start;
    		constit["lastWord"] = end;
    		assert(lastWordInLexicalConstit===null || lastWordInLexicalConstit<start, 
    			"The order of lexical entries must respect the order of words in the sentence: "+constitName);
    		lastWordInLexicalConstit = end;
		}
		else if (synparts.length==3) {	// unary combination (e.g. type-raising)
			assert("isLexical" in constit, "Unary rule must not start the syntax of a constituent: " + constitName);
			var combinator = synparts[0], produces = synparts[1], cat = synparts[2].trim();
			assert(combinator.indexOf("<")>-1 || combinator.indexOf(">")>-1);
			assert(produces==='=>');
			assert(cat.indexOf("<")==-1 && cat.indexOf(">")==-1);
			
			constit = {"i": allconstits.length, "name": constitName, "isLexical": constit.isLexical, 
			  "constits": [constit], "combinator": combinator, "cat": cat, "sem": sem,
			  "firstWord": constit.firstWord, "lastWord": constit.lastWord};
		}
		else {	// binary combination
			//assert(!(constitName in constitMap), "Nonlexical constituent is has the same name as another constituent: "+constitName);

			assert(!("isLexical" in constit), "Binary rule may only start the syntax of a constituent: " + constitName);
			constit["isLexical"] = false;
			
			var constitWords = constitName.split(/\s+/);
			var possibleConstitSpans = subsequenceMatches(ww, constitWords);
			var constit1 = null, constit2 = null;
			for (start of possibleConstitSpans) {
				var end = start+constitWords.length-1;
				if (!([start,end] in chart) && readyFrom[start] && readyTo[end] && 
					readyFrom[start].lastWord+1==readyTo[end].firstWord) {
					constit1 = readyFrom[start];
					constit2 = readyTo[end];
					break;
				}
			}
			assert(constit1!==null && constit2!==null, "No available constituents to combine to form ["+constitName+"]");
			
			var constit1Name = synparts[0].replace(/\s\s+/g, ' ').trim();
			var combinator = synparts[1];
			var constit2Name = synparts[2].replace(/\s\s+/g, ' ').trim();
			var produces = synparts[3], cat = synparts[4].trim();
			assert(constit1Name==constit1.name, 'Mother constituent ['+constitName+'] cannot have ['+constit1Name+'] as the left daughter');
			assert(constit2Name==constit2.name, 'Mother constituent ['+constitName+'] cannot have ['+constit2Name+'] as the right daughter');
			assert(constitName==constit1Name+' '+constit2Name, 
				'Constituent [' + constitName + '] must be the concatenation of two adjacent constituents');
			assert(produces==='=>');
			assert(combinator.indexOf("<")>-1 || combinator.indexOf(">")>-1);
			for (pt in [constit1Name, constit2Name, cat])
				assert(pt.indexOf("<")==-1 && pt.indexOf(">")==-1);
			
			// look up constituents of this rule
			assert(constit1Name in constitMap, 'Constituent [' + constitName + '] depends on [' + constit1Name + '], which is not yet declared');
			assert(constit2Name in constitMap, 'Constituent [' + constitName + '] depends on [' + constit2Name + '], which is not yet declared');
			//var constit1 = constitMap[constit1Name], constit2=constitMap[constit2Name];
			
			constit = {"i": allconstits.length, "name": constitName, "isLexical": false, 
			  "constits": [constit1, constit2], "combinator": combinator, 
			  "cat": cat, "sem": sem, 
			  "firstWord": constit1.firstWord, "lastWord": constit2.lastWord};
			  
			readyTo[constit1.lastWord] = null;
			readyFrom[constit2.firstWord] = null;
		}
		

		allconstits.push(constit);
		constitMap[constitName] = constit;
		chart[[constit.firstWord,constit.lastWord]] = constit;
		readyFrom[constit.firstWord] = constit;
		readyTo[constit.lastWord] = constit;
	}
	var result = {words: ww,
		allconstits: allconstits,
		toFlatList: function () {	// list of derivation steps, not including the plain sentence itself
			var list = [];
			for (var j=0; j<this.allconstits.length; j++) {
				var copy = {};
				for (k in this.allconstits[j]) {
					if (k==="constits") {	// store constit IDs rather than pointers to make the list JSONifiable
						copy["constits"] = [];
						for (c of this.allconstits[j].constits)
							copy["constits"].push(c.i);
					}
					else
						copy[k] = this.allconstits[j][k];
				}
				list.push(copy);
			}
			return list;
		},
		toTree: function () {	// WARNING: simply returns the structured derivation 
			// rooted at the last constituent built. Does not ensure that it is a valid tree 
			// or that the sentence has only one root.
			return this.allconstits[this.allconstits.length-1];
		},
		toTable: function () {	// Assuming that the derivation does not contain 
			// any discontinuous or conflicting constituents, 
			// fits the constituents into a grid data structure 
			// where the first row is the words of the sentence, one word per column. 
			// The first row is represented as an array of words; 
			// subsequent rows are represented as arrays of constituents 
			// (with no "filler" entries).
			// Uses toFlatList() so that table entries will not contain pointers to 
			// their dependents. 
			var table = [this.words,[]];
			for (con of this.toFlatList()) {
				var inserted = false;
				for ([j,r] of table.entries()) {
					if (j==0) continue;
					if (r.length==0 || con.lastWord<r[0].firstWord) {
						r.unshift(con);
						inserted = true;
						break;
					}
					else if (con.firstWord>r[r.length-1].lastWord) {
						r.push(con);
						inserted = true;
						break;
					}
				}
				if (!inserted) {	// start a new row
					table.push([con]);
				}
			}
			return table;
		}
	};
	
	return result;
}

function renderHTML(parse, $container, wordsAboveOrBelow) {	// Replaces the contents of $container with a table visualizing the derivation
	var $tbl = $('<table class="visccg"></table>');
	$tbl.addClass(wordsAboveOrBelow);
	var $wrow = $('<tr></tr>');
	var datatbl = parse.toTable();
	// the plain words
	for (w of datatbl[0])
		$wrow.append('<td>'+w+'</td>');
	$tbl.append($wrow);
	// the structure
	for (r of datatbl.slice(1)) {
		$r = $('<tr></tr>');
		var j = 0;
		for (con of r) {
			if (con.firstWord > j)	// insert filler cell
				$r.append('<td colspan="'+(con.firstWord-j)+'"></td>');
			// insert the constituent cell
			var $td = $('<td class="constit" colspan="'+(con.lastWord-con.firstWord+1)+'"></td>');
			$td.append($('<span></span>').text(con.cat).html().replace(/\[([^\]]+)\]/g, '<sub>$1</sub>'));
			if (con.sem) 
				$td.append($('<span class="sem"></span>').text(' : '+con.sem));
			if (con.combinator)
				$td.append($('<span class="combinator"></span>').text(con.combinator));
			$r.append($td);
			j = con.lastWord+1;
		}
		$tbl.append($r);
	}
	if (wordsAboveOrBelow=='wordsbelow') {	// reverse the order of the rows
		$tbl.children('tbody').children().each(function(i,row){$tbl.children('tbody').prepend(row)});
		}
	$container.html($tbl);
}

function renderJSON(data, $container) {
	$container.text(JSON.stringify(data, null, 2));
}

// activate any embedded visualizations on the page
function activate() {
	$('code.language-ccg').each(function (i) {
		try {
			var markup = $(this).text();
			markup = smartSymbols(markup);
			var parse = parseCCGMarkup(markup);
			console.log(parse);
			renderHTML($(this), parse, 'wordsabove');
		} catch (e) {
			$(this).text(e.message);
		}
	});
}

return {activate: activate, 
	smartSymbols: smartSymbols,
	parseCCGMarkup: parseCCGMarkup,
	renderHTML: renderHTML};

})(jQuery, window);
