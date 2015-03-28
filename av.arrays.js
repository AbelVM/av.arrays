/**
*:: AV.arrays ::
*Xtra-methods for javascript arrays,
*including basic Descriptive Statistics functions	
*@author	Abel Vázquez <abel.vm@gmail.com>
*@version	1.0.4
*@since		2015-03-28
*/

(function(){
	'use strict';
	var _array = Array.prototype;
	//solid
	_array.isSolid = function(){
		return this.every(function(a){return a!==undefined&&a!=='undefined'&&a!==void(0)&&a!==null});
	};
	//solid
	_array.solid = function(){
		return this.filter(function(a){return a!==undefined&&a!=='undefined'&&a!==void(0)&&a!==null});
	};
	// isNaN
	_array.isNaN = function(){
		return this.some(function(a){return isNaN(a)});
	};
	//unique
	_array.unique = function () {
		return this.filter(function (a, b, c){return c.indexOf(a, b + 1) < 0}) 
	};
	//union
	_array.OR = function (arrB) {
		var tmpa = this.concat(arrB).unique();
		return (tmpa.isNaN()) ? tmpa.solid().sort() : tmpa.solid().sort(function(a, b){return a-b});
	};
	//intersection
	_array.AND = function (arrB) {
		var tmpa = this.filter(function (a){return arrB.indexOf(a)>-1}).unique();
		return (tmpa.isNaN()) ? tmpa.solid().sort() : tmpa.solid().sort(function(a, b){return a-b});
	};
	//not in common
	_array.XOR = function (arrB) {
		return this.filter(function (a){return arrB.indexOf(a)<0}).unique().OR(arrB.filter(function (b){return this.indexOf(b)<0}, this).unique());
	};
	// min
	_array.min = function() {
		return (this.isNaN())?this.solid().sort()[0]:Math.min.apply(Math, this.solid());		
	};
	// max
	_array.max = function() {
		return (this.isNaN())?this.solid().sort().reverse()[0]:Math.max.apply(Math, this.solid());	
	};
	// range
	_array.range = function () {
		return [this.min(), this.max()];
	}	
	// sum
	_array.sum = function() {
		return this.solid().reduce(function(a,b){return a+b;});
	};
	// stack
	_array.stack = function () {
		return this.map(function(a,b){return this.reduce(function(c,d,e){return c+((e<=b)?d:0)})}, this);
	}
	// module
	_array.module = function() {
		return Math.sqrt(this.solid().reduce(function(a,b){return a+b*b;},0));
	};
	// normalize
	_array.normalize = function() {
		var tmpa = this.module();
		return (tmpa!=0)? this.map(function(a,b){return a/tmpa;}):null;
	};
	// mean (-1:harmo, 0: geo, 1: arit, 2: quad,... n: n-mean)
	_array.mean = function(m){
		var tmpa = this.solid(),
			tmpb = tmpa.length;
		return (tmpb == 0)? null:(m==0)? tmpa.reduce(function(a,b){return a*b;})/tmpb : Math.pow(tmpa.reduce(function(a,b){return a+Math.pow(b,m)},0)/tmpb,(1/m));
	};
	// median
	_array.median = function(){
		return this.P(50);
	};
	// frequency
	_array.freq = function(){
		return this.reduce(function(a,b){
			a[b] = (a[b] + 1) || 1;
			return a;
		},{});
	};
	// mode
	_array.mode = function(){
		var tmpo = this.freq(),
			mx = Math.max.apply(Math, Object.keys(tmpo).map(function(key){return tmpo[key]}));
		return Object.keys(tmpo).filter(function(a){return tmpo[a]==mx}).map(function(a){return isNaN(a)?a:1*a});	
	};
	// percentile
	_array.P = function(i) {
		var	tmpa = (this.isNaN())?this.solid().sort():this.solid().sort(function(a, b){return a-b}),
			n = Math.floor(tmpa.length * i / 100),
			m = (tmpa.length * i) % 100;
		return (m==0)?(tmpa[n-1]+tmpa[n])/2:tmpa[n];
	};
	// population variance
	_array.pvariance = function (){
		var	tmpa = this.solid(),
			tmpb = this.mean(1);
		return (tmpa.length <2)? null : tmpa.reduce(function(a,b){return a+Math.pow(b-tmpb,2)},0) / tmpa.length;
	};
	// variance
	_array.variance = function (){
		var	tmpa = this.solid(),
			tmpb = this.mean(1);
		if (tmpa.length <2) return null;
		return tmpa.reduce(function(a,b){return a+Math.pow(b-tmpb,2)},0) / (tmpa.length-1);
	};
	// covariance
	_array.covariance = function (arrB){
		if (this.length!=arrB.length) return null;
		var tmpa = this.map(function(a,b){return a*arrB[b];});
		return tmpa.mean(1) - (this.mean(1)*arrB.mean(1));
	};
	// population standard deviation
	_array.pstdDev = function (){
		var tmpa = this.pvariance();
		return (tmpa!= null) ? Math.sqrt(tmpa) : null;
	};
	// standard deviation
	_array.stdDev = function (){
		var tmpa = this.variance();
		return (tmpa!= null) ? Math.sqrt(tmpa) : null;
	};
	// correlation
	_array.correlation = function(arrB) {
		var tmp= this.variance();
		return (tmp==null || tmp==0 || arrB.variance ==0)?null:this.covariance(arrB) / (tmp*arrB.variance());
	};
	// coefficient of variation
	_array.CV = function() {
		return (this.mean(1)!=0)? this.stdDev()/this.mean(1):null;
	};
	//skew (Fisher)
	_array.skew = function() {
		var tmpa = this.solid(),
			amean= this.mean(1),
			tmpb = tmpa.map(function(a){return Math.pow(a-amean,3);});
		return (this.stdDev()!=0)? tmpb.mean(1)/Math.pow(this.stdDev(),3):null;
	};
	//excess kurtosis
	_array.kurtosis = function() {
		var tmpa = this.solid(),
			amean= this.mean(1),
			tmpb = tmpa.map(function(a){return Math.pow(a-amean,4);});
		return (this.stdDev()!=0)? (tmpb.mean(1)/Math.pow(this.stdDev(),4))-3:null;
	};
})();