function timeStamp(){return window.performance.now?window.performance.now():Date.now()}function isVisible(el){var r=el.getBoundingClientRect();return r.top+r.height>=0&&r.left+r.width>=0&&r.bottom-r.height<=(window.innerHeight||document.documentElement.clientHeight)&&r.right-r.width<=(window.innerWidth||document.documentElement.clientWidth)}function Star(x,y,z){this.x=x,this.y=y,this.z=z,this.size=.5+Math.random()}function WarpSpeed(targetId,config){if(this.targetId=targetId,void 0==WarpSpeed.RUNNING_INSTANCES&&(WarpSpeed.RUNNING_INSTANCES={}),WarpSpeed.RUNNING_INSTANCES[targetId]&&WarpSpeed.RUNNING_INSTANCES[targetId].destroy(),config=config||{},"string"==typeof config)try{config=JSON.parse(config)}catch(e){config={}}this.SPEED=void 0==config.speed||config.speed<0?.7:config.speed,this.TARGET_SPEED=void 0==config.targetSpeed||config.targetSpeed<0?this.SPEED:config.targetSpeed,this.SPEED_ADJ_FACTOR=void 0==config.speedAdjFactor?.03:config.speedAdjFactor<0?0:config.speedAdjFactor>1?1:config.speedAdjFactor,this.DENSITY=void 0==config.density||config.density<=0?.7:config.density,this.USE_CIRCLES=void 0==config.shape?!0:"circle"==config.shape,this.DEPTH_ALPHA=void 0==config.depthFade?!0:config.depthFade,this.WARP_EFFECT=void 0==config.warpEffect?!0:config.warpEffect,this.WARP_EFFECT_LENGTH=void 0==config.warpEffectLength?5:config.warpEffectLength<0?0:config.warpEffectLength,this.STAR_SCALE=void 0==config.starSize||config.starSize<=0?3:config.starSize,this.BACKGROUND_COLOR=void 0==config.backgroundColor?"hsl(263,45%,7%)":config.backgroundColor;var canvas=document.getElementById(this.targetId);canvas.width=1,canvas.height=1;var ctx=canvas.getContext("2d");ctx.fillStyle=this.BACKGROUND_COLOR,ctx.fillRect(0,0,1,1),ctx.fillStyle=void 0==config.starColor?"#FFFFFF":config.starColor,ctx.fillRect(0,0,1,1);var color=ctx.getImageData(0,0,1,1).data;this.STAR_R=color[0],this.STAR_G=color[1],this.STAR_B=color[2],this.prevW=-1,this.prevH=-1,this.stars=[];for(var i=0;i<1e3*this.DENSITY;i++)this.stars.push(new Star(1e3*(Math.random()-.5),1e3*(Math.random()-.5),1e3*Math.random()));this.lastMoveTS=timeStamp(),this.drawRequest=null,this.LAST_RENDER_T=0,WarpSpeed.RUNNING_INSTANCES[targetId]=this,this.draw()}window.requestAnimationFrame=window.requestAnimationFrame||function(callback,element){setTimeout(callback,1e3/60)},WarpSpeed.prototype={constructor:WarpSpeed,draw:function(){var TIME=timeStamp();if(!document.getElementById(this.targetId))return void this.destroy();this.move();var canvas=document.getElementById(this.targetId);if(!this.PAUSED&&isVisible(canvas)){(this.prevW!=canvas.clientWidth||this.prevH!=canvas.clientHeight)&&(canvas.width=(canvas.clientWidth<10?10:canvas.clientWidth)*(window.devicePixelRatio||1),canvas.height=(canvas.clientHeight<10?10:canvas.clientHeight)*(window.devicePixelRatio||1)),this.size=(canvas.height<canvas.width?canvas.height:canvas.width)/(10/(this.STAR_SCALE<=0?0:this.STAR_SCALE)),this.WARP_EFFECT&&(this.maxLineWidth=this.size/30);var ctx=canvas.getContext("2d");ctx.fillStyle=this.BACKGROUND_COLOR,ctx.fillRect(0,0,canvas.width,canvas.height);for(var rgb="rgb("+this.STAR_R+","+this.STAR_G+","+this.STAR_B+")",rgba="rgba("+this.STAR_R+","+this.STAR_G+","+this.STAR_B+",",i=0;i<this.stars.length;i++){var s=this.stars[i],xOnDisplay=s.x/s.z,yOnDisplay=s.y/s.z;if(this.WARP_EFFECT||!(-.5>xOnDisplay||xOnDisplay>.5||-.5>yOnDisplay||yOnDisplay>.5)){var size=s.size*this.size/s.z;if(!(.3>size)){if(this.DEPTH_ALPHA){var alpha=(1e3-s.z)/1e3;ctx.fillStyle=rgba+(alpha>1?1:alpha)+")"}else ctx.fillStyle=rgb;if(this.WARP_EFFECT){ctx.beginPath();var x2OnDisplay=s.x/(s.z+this.WARP_EFFECT_LENGTH*this.SPEED),y2OnDisplay=s.y/(s.z+this.WARP_EFFECT_LENGTH*this.SPEED);if(-.5>x2OnDisplay||x2OnDisplay>.5||-.5>y2OnDisplay||y2OnDisplay>.5)continue;ctx.moveTo(canvas.width*(xOnDisplay+.5)-size/2,canvas.height*(yOnDisplay+.5)-size/2),ctx.lineTo(canvas.width*(x2OnDisplay+.5)-size/2,canvas.height*(y2OnDisplay+.5)-size/2),ctx.lineWidth=size>this.maxLineWidth?this.maxLineWidth:size,this.USE_CIRCLES?ctx.lineCap="round":ctx.lineCap="butt",ctx.strokeStyle=ctx.fillStyle,ctx.stroke()}else this.USE_CIRCLES?(ctx.beginPath(),ctx.arc(canvas.width*(xOnDisplay+.5)-size/2,canvas.height*(yOnDisplay+.5)-size/2,size/2,0,2*Math.PI),ctx.fill()):ctx.fillRect(canvas.width*(xOnDisplay+.5)-size/2,canvas.height*(yOnDisplay+.5)-size/2,size,size)}}}this.prevW=canvas.clientWidth,this.prevH=canvas.clientHeight}-1!=this.drawRequest&&(this.drawRequest=requestAnimationFrame(this.draw.bind(this))),this.LAST_RENDER_T=timeStamp()-TIME},move:function(){var t=timeStamp(),speedMulF=(t-this.lastMoveTS)/(1e3/60);if(this.lastMoveTS=t,!this.PAUSED){var speedAdjF=Math.pow(this.SPEED_ADJ_FACTOR<0?0:this.SPEED_ADJ_FACTOR>1?1:this.SPEED_ADJ_FACTOR,1/speedMulF);this.SPEED=this.TARGET_SPEED*speedAdjF+this.SPEED*(1-speedAdjF),this.SPEED<0&&(this.SPEED=0);for(var speed=this.SPEED*speedMulF,i=0;i<this.stars.length;i++){var s=this.stars[i];for(s.z-=speed;s.z<1;)s.z+=1e3,s.x=(Math.random()-.5)*s.z,s.y=(Math.random()-.5)*s.z}}},destroy:function(targetId){if(targetId)WarpSpeed.RUNNING_INSTANCES[targetId]&&WarpSpeed.RUNNING_INSTANCES[targetId].destroy();else{try{cancelAnimationFrame(this.drawRequest)}catch(e){this.drawRequest=-1}WarpSpeed.RUNNING_INSTANCES[this.targetId]=void 0}},pause:function(){this.PAUSED=!0},resume:function(){this.PAUSED=!1}},WarpSpeed.destroy=WarpSpeed.prototype.destroy;


