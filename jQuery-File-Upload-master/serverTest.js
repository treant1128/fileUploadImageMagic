var urlArray = [
	'http://113.142.37.186/group2/M02/01/F3/wKgAD1NotNeAVIPhAB1JJg8PqBI005.jpg',
	'http://113.142.37.186/group2/M01/01/F4/wKgAD1NotQ2AV3sZABjgRw-8sLA653.jpg',
	'http://113.142.37.186/group2/M06/01/F4/wKgAD1NotUaAScqAACMBVFaK81E675.jpg',
	'http://113.142.37.186/group2/M01/01/F5/wKgAD1NotXSAWXkJABn4oAEeUCI866.jpg',
	'http://113.142.37.186/group2/M00/01/F5/wKgAD1NotbWAY0ZcAB16phtI2QE468.jpg',
	'http://113.142.37.186/group2/M05/01/F5/wKgAD1Notd6AW97XABZNFn3vJ_U076.jpg',
	'http://113.142.37.186/group2/M06/01/F8/wKgAD1NouPSADz4MABkKLXgFCXQ712.jpg',
	'http://113.142.37.186/group2/M07/01/F8/wKgAD1NouR6AOuN8ABkyj2rZBLg469.jpg',
	'http://113.142.37.186/group2/M02/01/F9/wKgAD1NouUqAKkXuABjakToNppI675.jpg',
	'http://113.142.37.186/group2/M04/01/FA/wKgAD1NouXSAdi7TABZ6UDlCDZk042.jpg',
];

var express = require('express');
var app = express();
app.listen(9876);
console.log("Listening Port 9876...");

var o = new Object();
var count = 0;

app.get('/', function(req, res){
	count++;
	o.mei = 'MEI:' + count;
	o.date =  new Date().toString();
	o.outline = 'My Theme is ' + count;
	o.model = count + ' is Your Model';
//	console.log(count/urlArray.length);
	o.url = urlArray[count%urlArray.length];
	res.send(o);
});

