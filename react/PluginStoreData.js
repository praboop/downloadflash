const DEFAULT_STORE_DATA = Object.freeze({
	schema : 1.0,
	general : { 
		saveAsPromptDisabled : true,
		preview: { 'Images': false, 'Video': false, 'Text' : false }
	},
	mediaAssociation : [
		{ 
		  mediaType: 'Audio',      
		  icon: 'musicIcon',     
		  extensions: ['MP3','WAV','OGG','WMA','AIF','CDA','MID'],
		  userExtensions:[],
		  downloadDir: 'default'
		},
		{ 
			mediaType: 'Video',      
			icon: 'videoIcon',     
			extensions: ['MP4','AVI','FLV','MOV','WMV'],
			userExtensions:[],
			downloadDir: 'default'
		},
		{ 
			mediaType: 'Images',      
			icon: 'pictureIcon', 
			extensions: ['JPEG','JPG','PNG','GIF'],
			userExtensions:[],
			downloadDir: 'default'
		},
		{ 
			mediaType: 'Text',      
			icon: 'textIcon',     
			extensions: ['PDF','TXT','DOC','DOCX','RTF','ODT','TEX','WPD','CSV','DAT','JSON','LOG','SQL','XML','DTD'],
			userExtensions:[],
			downloadDir: 'default'
		},
		{ 
			mediaType: 'Compressed Files',      
			icon: 'compressedIcon',     
			extensions: ['7Z','ARJ','DEB','PKG','RAR','RPM','TAR.GZ','Z','ZIP','TAR'],
			userExtensions:[],
			downloadDir: 'default'
		},
		{ 
			mediaType: 'Others',      
			icon: 'otherIcon',     
			extensions: [],
			userExtensions:[],
			downloadDir: 'default'
		},
	],
	"renameTags": [
		{
		  "tag": "title",
		  "description": "Title as specified in the link",
		  "stock": true,
		  "script": "function getValue(linkData)\n{\n  return linkData.attributes.title;    \n}\n",
		  "testUrl": {
			"url": "http://nosite/path/visual_designs.pdf?chapter=1",
			"text": "Chapter1",
			"attributes": {
			  "title": "Introduction to visual designs"
			}
		  }
		},
		{
		  "tag": "name",
		  "description": "Name of the file without extension",
		  "stock": true,
		  "script": "function getValue(linkData)\n{\n  var url = linkData.url;\n  \n  var fullName = url.substring(url.lastIndexOf('/')+1);\n  \n  return fullName.split('.')[0];\n  \n}\n",
		  "testUrl": {
			"url": "http://nosite/path/visual_designs.pdf?chapter=1",
			"text": "Chapter1",
			"attributes": {
			  "title": "Introduction to visual designs"
			}
		  }
		},
		{
		  "tag": "ext",
		  "description": "Extension of the file",
		  "stock": true,
		  "script": "function getValue(linkData)\n{\n  var url = linkData.url;\n  var nameAndQuery = url.substring(url.lastIndexOf('/')+1);\n  \n  // Remove the query params\n  var nameOnly = nameAndQuery.split('?')[0];\n  \n  // Retrieve the extension part\n  return nameOnly.split('.')[1];\n  \n}\n",
		  "testUrl": {
			"url": "http://nosite/path/visual_designs.pdf?chapter=1",
			"text": "Chapter1",
			"attributes": {
			  "title": "Introduction to visual designs"
			}
		  }
		},
		{
		  "tag": "protocol",
		  "description": "Retrieve protocol part of the URL",
		  "stock": true,
		  "script": "function getValue(linkData)\n{\n  var x = linkData.url.substring(0,4);\n  return x;   \n  \n}\n",
		  "testUrl": {
			"url": "http://nosite/path/visual_designs.pdf?chapter=1",
			"text": "Chapter1",
			"attributes": {
			  "title": "Introduction to visual designs"
			}
		  }
		},
		{
		  "tag": "dow",
		  "description": "Returns Day of the Week",
		  "stock": true,
		  "script": "function getValue(linkData)\n{\n  var d = new Date();\n  var days = [\"Sunday\", \"Monday\", \"Tuesday\", \"Wednesday\", \"Thursday\", \"Friday\", \"Saturday\"];\n  return days[d.getDay()]; \n  \n}\n",
		  "testUrl": {
			"url": "http://nosite/path/visual_designs.pdf?chapter=1",
			"text": "Chapter1",
			"attributes": {
			  "title": "Introduction to visual designs"
			}
		  }
		},
		{
		  "tag": "dd",
		  "description": "Today date - numerical value between 1-31",
		  "stock": true,
		  "script": "function getValue(linkData)\n{\n  var d = new Date();\n  return d.getDate();\n}\n",
		  "testUrl": {
			"url": "http://nosite/path/visual_designs.pdf?chapter=1",
			"text": "Chapter1",
			"attributes": {
			  "title": "Introduction to visual designs"
			}
		  }
		},
    {
      "tag": "text",
      "description": "Retrieve the text of the link as displayed in web-page",
      "stock": true,
      "script": "function getValue(linkData)\n{\n  return linkData.text;\n}\n",
      "testUrl": {
        "url": "http://nosite/path/visual_designs.pdf?chapter=1",
        "text": "Chapter1",
        "attributes": {
          "title": "Introduction to visual designs"
        }
      }
    },
    {
      "tag": "mm",
      "description": "Get the current month as a number (1-12)",
      "stock": true,
      "script": "function getValue(linkData)\n{\n  return new Date().getMonth() + 1; \n}\n",
      "testUrl": {
        "url": "http://nosite/path/visual_designs.pdf?chapter=1",
        "text": "Chapter1",
        "attributes": {
          "title": "Introduction to visual designs"
        }
      }
    },
    {
      "tag": "yyyy",
      "description": "Get the year as a four digit number",
      "stock": true,
      "script": "function getValue(linkData)\n{\n\n  return new Date().getFullYear();  \n  \n}\n",
      "testUrl": {
        "url": "http://nosite/path/visual_designs.pdf?chapter=1",
        "text": "Chapter1",
        "attributes": {
          "title": "Introduction to visual designs"
        }
      }
    },
    {
      "tag": "h",
      "description": "Get the current hour (0-23)",
      "stock": true,
      "script": "function getValue(linkData)\n{\n\n  return new Date().getHours();  \n  \n}\n",
      "testUrl": {
        "url": "http://nosite/path/visual_designs.pdf?chapter=1",
        "text": "Chapter1",
        "attributes": {
          "title": "Introduction to visual designs"
        }
      }
    },
    {
      "tag": "m",
      "description": "Get he current minute (0-59)",
      "stock": true,
      "script": "function getValue(linkData)\n{\n\n  return new Date().getMinutes();  \n  \n}\n",
      "testUrl": {
        "url": "http://nosite/path/visual_designs.pdf?chapter=1",
        "text": "Chapter1",
        "attributes": {
          "title": "Introduction to visual designs"
        }
      }
    },
    {
      "tag": "s",
      "description": "Get the current second (0-59)",
      "stock": true,
      "script": "function getValue(linkData)\n{\n\n  return new Date().getSeconds()\n  \n}\n",
      "testUrl": {
        "url": "http://nosite/path/visual_designs.pdf?chapter=1",
        "text": "Chapter1",
        "attributes": {
          "title": "Introduction to visual designs"
        }
      }
    }		
	  ]
});

module.exports = {DEFAULT_DATA: DEFAULT_STORE_DATA} 