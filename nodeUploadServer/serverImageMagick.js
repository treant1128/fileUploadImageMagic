var im = require('imagemagick');
//var imgPath = '/home/treant/imgs/o22.tif';
im.identify('/home/treant/nodeJS/nodeUploadServer/public/files/VMware10_Key.txt', function(err, features){
	if(err){
    console.log('---------------Error-----------------');
    console.log(err.constructor);
    console.log('***************Error*****************');
    console.log(err.toString());
    console.log('###############Error#################');
    throw err;
  }
	console.log(features);
});
//
//var imgPath = '/home/treant/imgs/CoolShow_A000035.jpg';
//im.convert([
//    imgPath, 
//    '-define', 
//    'tiff:tile-geometry=256x256', 
//    '-compress', 
//    'jpeg', 
//    'ptif:/home/treant/imgs/o35Treant.tif'
//    ], 
//    function(err, stdout){
//      if(err) throw err;
//      console.log('====================================');
//      console.log('Stdout: ' + stdout);
//});
