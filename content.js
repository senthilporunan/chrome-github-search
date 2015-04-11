


function GitHubSearch() {
	init();
}

var init = function() {
	var preDefinedValues = {
		'Repositories' : {
			'in': ['eg: name,description,readme,title'],
			'size': ['e.g: >= 10000'],
			'forks': ['e.g: 10..100'],
			'fork': ['e.g: true,false,only'],
			'created': ['e.g: <2011-01-01'],
			'pushed': ['e.g: <2011-01-01'],
			'user': ['eg: princejwesley'],
			'language': ['e.g: java,python,perl'],
			'stars': ['e.g: 10..20']
		},
		'Code': {
			'in': ['eg: file,path'], 
			'language': ['eg: java,javascript,python,perl'],
			'fork': ['eg: >=10'],
			'size': ['eg: <=1000'],
			'filename':['eg: circular-slider'],
			'path':['eg: foo/bar'],
			'extension':['eg: js,java,py,pl,sh'],
			'repo':['eg: jrate'],
			'user':['eg: senthilporunan']
		},
		'Issues': {
			'type': ['eg: pr,issue'], 
			'commenter': ['eg: defunkt'],
			'in': ['eg: title,body,comment'],
			'is': ['eg: public|private,open|closed,pr|issue,merged|unmerged'],
			'author':['eg: defunkt'],
			'assignee':['eg: vmg'],
			'mentions':['eg: defunkt'],
			'involves':['eg: jlord,mdo'],
			'team':['eg: senthilporunan/atom-cubic-bezier'],
			'state':['eg: closed|open'],
			'label':['eg: bug,priority,resolved'],
			'no': ['eg: label,milestone,assignee'],
			'language': ['eg: ruby, bash'],
			'created': ['e.g: >=2011-01-01'],
			'updated': ['e.g: >=2014-06-01'],
			'merged': ['e.g: <2015-05-15'],
			'closed': ['e.g: <2016-07-01'],
			'comments': ['eg: 500..1000']
		}
	};
	
	var preDefinedType = '';
	$('.codesearch-aside').find('nav').find('a').each(function() {
		if (this.className.indexOf('selected') !== -1) {
			preDefinedType = this.href.split('&type=')[1].split('&')[0];
		}
	});
	if (preDefinedType === 'undefined' || preDefinedType == null || preDefinedType.length <= 0
			|| preDefinedValues[preDefinedType] === 'null' || preDefinedValues[preDefinedType] === 'undefined')  preDefinedType = 'Code';
	
	return {
		getPreDefinedValues: function(){
			return preDefinedValues; 
		},
		getPreDefinedType: function(){
			return preDefinedType; 
		}
	};
};

/**
  * Add new save macro button 
  *
**/
GitHubSearch.prototype.addSaveMacro = function() {
    var searchDiv = $("div").find(".search-form-fluid div:nth-last-child(1)");
    searchDiv.append("<button class=\"btn button\" type=\"submit\" id=\"save-me\">Save Macro</button>");
	this.showSavedTemplate();
}

/**
  * Add templates into chrome storage space
  *
**/
GitHubSearch.prototype.saveChanges = function() {
    var searchText = $('.js-search-query').val();
  
    if (!searchText) {
        alert('Error: No value specified');
        return;
    }
  
	var saveTemplate = prompt('Save Search template : ', searchText);
	
	var jsonObj = {};
	jsonObj[saveTemplate] = searchText;
    chrome.storage.sync.set(jsonObj, function() {
        
    });
}

/**
  * Form url links for user
  *
**/
var formLinks = function(searchText, searchProperty) {
	var returnValue="";
	returnValue += searchProperty.replace(/:/g,'%3A').replace(/ /g,'+');
	console.log("R2: "+returnValue);
	return returnValue;
}

/**
  * Will help to show already saved templates in left side
  *
**/
GitHubSearch.prototype.showSavedTemplate = function() {
	var codeSearchDiv = $("div").find(".codesearch-aside");
    codeSearchDiv.append("<h3>Saved Templates</h3>");
	codeSearchDiv.append("<nav class=\"menu\">");
	
	chrome.storage.sync.get(null, function(items) {
		var allKeys = Object.keys(items);
		var codeSearchNav = $("div").find(".codesearch-aside").find("nav").last();
		for (var idx in allKeys) {
			var key = allKeys[idx];
			var value = items[key];
			console.log("Key: "+key+" Value: "+value); 
			codeSearchNav.append("<a class=\"menu-item\" href=\""+window.location.origin+"/search?q="+formLinks(key, value)+"&utf8=%E2%9C%93&type="+init().getPreDefinedType()+"&ref=searchresults\"><span class=\"octicon octicon-search\"></span>  "+key+"<span class=\"octicon octicon-x\" class=\"toolitup-cross-id\"style=\"float:right;\"></span></a>");
		}
		codeSearchDiv.append("</nav>");
	});
}

/**
  * If user clicks cross button it will call
  * Not working have to check this one
**/
var removeElement = function() {
console.log('Before click cross box');
	$('.toolitup-cross-id').click(function() {
		console.log('Inside click cross box');
		chrome.storage.sync.get(null, function(items) {
			var allKeys = Object.keys(items);
			for (var idx in allKeys) {
				var key = allKeys[idx];
				var value = items[key];
				if (key === 'jrate') {
					chrome.storage.sync.remove(key,function() {
						alert("item removed");
					});
				}
			}
		});
	});
}

/**
  * Will help to add option div after text box
  *
**/
var formSearchString = function(event, searchingValue) {
	var returnString = '';
	var temp = init().getPreDefinedValues();
	var type = init().getPreDefinedType();
	var allKeys = Object.keys(temp[type]);
	for (var idx in allKeys) {
		var key = allKeys[idx];
		var value = temp[type][key];
		if (searchingValue.indexOf(key+':') === -1)
			returnString +=  "<p style=\"cursor:pointer;font-weight:600;z-index:98; \"> "+key+" :<span style=\"font-style:italic;padding-left:"+(110-key.length*8)+"px; \">"+value[0]+"</span></p>";
	}
	returnString +=  "<p>/***  - will work in opposite manner  ***/</p>";
	return returnString;
};

var hideSearchPopupBox = function() {
	console.log('Inside hideSearchPopupBox');
	var searchQueryBox = $(".flex-table-item-primary");
	
	$('.js-search-query').focusout(function() {
		console.log('Focus out');
		searchQueryBox.find('.toolitup-option-values').remove();
	});
}

GitHubSearch.prototype.showSearchBox = function() {
	console.log('Inside showSearchBox');
	var searchQueryBox = $(".flex-table-item-primary");

	$('.js-search-query').keypress(function(e) {
		$(".js-search-query").attr('name','');
		searchQueryBox.find('.toolitup-option-values').remove();
		console.log('KeyPress');
		var searchingValue = $(".js-search-query").val();
		searchQueryBox.append("<div style=\"background-color:yellow;width:75%;z-index:98;position: absolute;\" class=\"toolitup-option-values\">"+formSearchString(e, searchingValue)+"</div>");
		
	});
	hideSearchPopupBox();
}


/**
  * Not using this function
 */
function object(obj) {
    function F() {}
    F.prototype = obj;
    return new F();
}

$(document).ready(function() {  

	//chrome.storage.sync.clear();  //Temporary for testing
    var gitHub = new GitHubSearch();
    gitHub.addSaveMacro();
    
    $('#save-me').click('on',function() {
        gitHub.saveChanges();
    });

	gitHub.showSearchBox();
	removeElement();
    console.log("Last Line");
    
});


