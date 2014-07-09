
var express=require('express');
var fs=require('fs');
var async = require('async');
var path = require('path');
var app=express();
var server=require('http').createServer(app);

//存放号码包的主文件夹全路径  无论是否以'/'结尾
//var rootPath = 'F:' + path.sep + 'coolpad' + path.sep + 'selector_slider' + path.sep;
var rootPath = '/home/treant/nodeJS/nodeUploadServer/public/convertTIFF';

var port = 9999;
app.listen(port, function(){
	console.log('Converted TIFF Images Service Listening: ' + port);
});

//组合绝对路径  针对文件夹路径是否以'/'结尾
var composePath = function(parentPath, child){
	return parentPath + (parentPath.charAt(parentPath.length - 1) == path.sep ? '' : path.sep) + child;
};

app.all('/', function(req, res, next){
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
	next();
});

app.get('/', function(req, res){res.send('Wha u do, Treant?');});

app.get('/getImages', function(req, res){
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested_with");

    async.waterfall([
         function(cb){
        	fs.readdir(rootPath, function(err, files){
        		cb(err, files);
        	});
         },
    	
        function(files, cb){
			if(files.constructor === Array){
				console.log('根目录下所有子文件夹: ' + files);
				var objs = new Array();
				for(f in files){
					var absPath = 
					console.log('根目录下第%d个子文件夹路径: %s', f,  composePath(rootPath, files[f]));
					var oo = new Object();
//					oo.id = f;
					oo.text = files[f];
					oo.id = composePath(rootPath, files[f]);
					objs.push(oo);		
				}  
				cb(null, (objs));
            }
         }
         ], function(err, result){
			if(err) throw err;
    		res.send(result);
         }
    );

});
