/*
 * angular-marked 0.0.15
 * (c) 2015 J. Harshbarger
 * Licensed MIT
 */
!function(){"use strict";"undefined"!=typeof module&&"object"==typeof exports&&(module.exports="hc.marked"),angular.module("hc.marked",[]).provider("marked",function(){var a=this;a.setRenderer=function(a){this.renderer=a},a.setOptions=function(a){this.defaults=a},a.$get=["$window","$log",function(b,c){var d=function(){return"undefined"!=typeof module&&"object"==typeof exports?require("marked"):b.marked||marked}();if(angular.isUndefined(d))return void c.error("angular-marked Error: marked not loaded.  See installation instructions.");if(a.renderer){for(var e=new d.Renderer,f=Object.keys(a.renderer),g=f.length;g--;)e[f[g]]=a.renderer[f[g]];a.defaults=a.defaults?a.defaults.renderer=e:a.defaults={renderer:e}}return d.setOptions(a.defaults),d}]}).directive("marked",["marked",function(a){return{restrict:"AE",replace:!0,scope:{opts:"=",marked:"="},link:function(b,c,d){function e(d){c.html(a(d||"",b.opts||null))}e(b.marked||c.text()||""),d.marked&&b.$watch("marked",e)}}}])}();