function shape(canvas,copy,cobj){
	this.canvas=canvas;
	this.copy=copy;
	this.cobj=cobj;
	this.width=this.canvas.width;
	this.height=this.canvas.height;
	this.type="line";      //要画的类型
	this.style="stroke";    //默认填充   stroke无填充   fill填充
	this.strokeStyle="#000";  //默认边框颜色
	this.fillStyle="#000";  //默认填充颜色
	this.lineWidth=1;  //默认边框宽度
	this.history=[];     //定义一个空数组，用来记录每次填充完的位置信息
	this.bianNum=5;
	this.jiaoNum=5;
	this.isback=true;   //标识
	this.xpsize=10;
	this.isshowxp=true;
}
shape.prototype={
	init:function(){    //实例化
		this.cobj.lineWidth=this.lineWidth;
		this.cobj.strokeStyle=this.strokeStyle;
		this.cobj.fillStyle=this.fillStyle;
		$(".xp").css("display","none");
	},
	draw:function(){
		var that=this;
		this.copy.onmousedown=function(e){
			var startx=e.offsetX;
			var starty=e.offsetY;
			that.copy.onmousemove=function(e){
				that.isback=true;
				that.init();
				var endx=e.offsetX;
				var endy=e.offsetY;
				that.cobj.clearRect(0,0,that.width,that.height);
				if(that.history.length>0){
					that.cobj.putImageData(that.history[that.history.length-1],0,0);
				}
				that.cobj.beginPath();
				that[that.type](startx,starty,endx,endy);  //调用
			}
			that.copy.onmouseup=function(){
				that.history.push(that.cobj.getImageData(0,0,that.width,that.height));
				that.copy.onmousemove=null;
				that.copy.onmouseup=null;
			}
		}
	},
	line:function(x,y,x1,y1){
		this.cobj.moveTo(x,y);
		this.cobj.lineTo(x1,y1);
		this.cobj.stroke();
	},
	rect:function(x,y,x1,y1){
		this.cobj.rect(x,y,x1-x,y1-y);
		this.cobj[this.style]();
	},
	arc:function(x,y,x1,y1){
		var r=Math.sqrt((x1-x)*(x1-x)+(y1-y)*(y1-y));
		this.cobj.arc(x,y,r,0,2*Math.PI);
		this.cobj[this.style]();
	},
	bian:function(x,y,x1,y1){
		var angle=360/this.bianNum*Math.PI/180;   //每条边对应的弧度
		var r=Math.sqrt((x1-x)*(x1-x)+(y1-y)*(y1-y));   //半径
		for(var i=0;i<this.bianNum;i++){       
			this.cobj.lineTo(Math.cos(angle*i)*r+x,Math.sin(angle*i)*r+y);
		}
		this.cobj.closePath();
		this.cobj[this.style]();
	},
	jiao:function(x,y,x1,y1){
		var angle=360/(this.bianNum*2)*Math.PI/180;   //每条边对应的弧度
		var r=Math.sqrt((x1-x)*(x1-x)+(y1-y)*(y1-y));   //半径
		var r1=r/1.5;
		for(var i=0;i<this.bianNum*2;i++){       
			if(i%2==0){
				this.cobj.lineTo(Math.cos(angle*i)*r+x,Math.sin(angle*i)*r+y);
			}else{
				this.cobj.lineTo(Math.cos(angle*i)*r1+x,Math.sin(angle*i)*r1+y);
			}			
		}
		this.cobj.closePath();
		this.cobj[this.style]();
	},
	pen:function(){
		var that=this;
		this.copy.onmousedown=function(e){
			var startx=e.offsetX;
			var starty=e.offsetY;
			that.cobj.beginPath();
			that.cobj.moveTo(startx,starty);
			that.copy.onmousemove=function(e){
				that.init();
				var endx=e.offsetX;
				var endy=e.offsetY;
				that.cobj.clearRect(0,0,that.width,that.height);
				if(that.history.length>0){
					that.cobj.putImageData(that.history[that.history.length-1],0,0);
				}
				
				that.cobj.lineTo(endx,endy);  //调用
				that.cobj.stroke();
			}
			that.copy.onmouseup=function(){
				that.history.push(that.cobj.getImageData(0,0,that.width,that.height));
				that.copy.onmousemove=null;
				that.copy.onmouseup=null;
			}
		}
	},
	xp:function(xpObj){
		var that=this;
		that.copy.onmousemove=function(e){
			if(!that.isshowxp){
				return false;
			}
			var movex=e.offsetX;  
			var movey=e.offsetY;
			var lefts=movex-that.xpsize/2;
			var tops=movey-that.xpsize/2;
			if(lefts<0){lefts=0;}   //边界值判断
			if(lefts>that.width-that.xpsize){lefts=that.width-that.xpsize;}
			if(tops<0){tops=0;}
			if(tops>that.height-that.xpsize){tops=that.height-that.xpsize;}
			xpObj.css({ 
				display:"block", 
				left:lefts,top:tops, 
				width:that.xpsize, 
				height:that.xpsize 
			});
			that.copy.onmousedown=function(){
				that.copy.onmousemove=function(e){
					var movex=e.offsetX;
					var movey=e.offsetY;
					var lefts=movex-that.xpsize/2;
					var tops=movey-that.xpsize/2;
					if(lefts<0){lefts=0;}
					if(lefts>that.width-that.xpsize){lefts=that.width-that.xpsize;}
					if(tops<0){tops=0;}
					if(tops>that.height-that.xpsize){tops=that.height-that.xpsize;}
					xpObj.css({
						display:"block",
						left:lefts,top:tops,
						width:that.xpsize,
						height:that.xpsize
					})
					that.cobj.clearRect(lefts,tops,that.xpsize,that.xpsize);
				}
				that.copy.onmouseup=function(){
					that.copy.onmousemove=null;
					that.copy.onmouseup=null;
					that.xp(xpObj);
					that.history.push(that.cobj.getImageData(0,0,that.width,that.height));
				}
			}
		}
	}
}
