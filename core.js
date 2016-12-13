Object.prototype.extend = function(o){
	for(p in o) this[p] = o[p];
};
Object.prototype.extend({
	is:function(){
		var name;
		name = Object.prototype.toString.call(this);
		name = name.slice(8,name.length-1);
		return arguments.length !== 0 ? name === arguments[0] : name;
	},
	hasProp:function(p){
		return (p in this);
	}
});