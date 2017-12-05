window.onload = function(){
	playNext("mp3/03.mp3");
};

var music = {
	mark:false,
	init:function(){
		//1:音频上下文===html5+ajax+audioContext   html5+audio+audioContext  
		window.AudioContext = window.AudioContext || window.webkitAudioContext || window.mozAudioContext || window.msAudioContext;
		/*动画执行的兼容写法*/
		window.requestAnimationFrame = window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.msRequestAnimationFrame;
		//2:初始化音轨对象
		var audioContext = new window.AudioContext();
		return audioContext;
	},
	parse:function(audioContext,audioDom,callback){
		try{
			//拿到播放器去解析你音乐文件
			var audioBufferSouceNode = audioContext.createMediaElementSource(audioDom);
			//创建解析对象
			var analyser = audioContext.createAnalyser();
			//将source与分析器连接
			audioBufferSouceNode.connect(analyser); 
			//将分析器与destination连接，这样才能形成到达扬声器的通路
			analyser.connect(audioContext.destination);
			music.data(analyser,callback);
		}catch(e){
			
		}
	},
	data:function(analyser,callback){
		if(music.mark){
			var array = new Uint8Array(analyser.frequencyBinCount);
			analyser.getByteFrequencyData(array);
			if(callback)callback(array);
			requestAnimationFrame(function(){
				music.data(analyser,callback);
			});
		}
	}
};

function initBar(){
	//每个元素的宽度
	var mw = 7;
	//盒子的宽度
	var boxDom = document.getElementById("musicbox");
	var boxWidth = boxDom.offsetWidth;//取的boxDom的可见宽度
	var cells = Math.floor(boxWidth / mw);
	var arr = [];
	for(var i = 0; i < cells; i++){
		var spanDom = document.createElement("span");
		spanDom.style.left = (i * mw) + "px";
		arr.push(spanDom);
		boxDom.appendChild(spanDom);
	}

	return arr;
};
function playNext(src){
	
	//初始化柱形
	var arr = initBar();
	
	//创建音乐播放器
	var audio = document.createElement("audio");
	
	audio.src = src;
	audio.controls = "controls";
	
	//将音乐播放器放入到盒子中
	document.getElementById("audiobox").innerHTML = "";
	document.getElementById("audiobox").appendChild(audio);
	
	//audioContext初始化
	var audioContext = music.init();
	
	//播放解析
	audio.onplay = function(){
		//打开解析播放器分析器开关
		music.mark = true;
		//开始解析
		music.parse(audioContext,audio,function(array){//array 1024长度与
			console.log(array);
			for(var i = 0; i < arr.length; i++){
				arr[i].style.height = array[i]+"px";
				arr[i].style.background = "linear-gradient(red 5%,green 60%,#fff 100%)";
			}
		});
	};
	
	audio.onended = function(){
		music.mark = false;
	};
}
