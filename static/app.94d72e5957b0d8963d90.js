webpackJsonp([21],{MMvR:function(e,n){},NHnr:function(e,n,t){"use strict";Object.defineProperty(n,"__esModule",{value:!0});var r=t("7+uW"),a={render:function(){var e=this.$createElement,n=this._self._c||e;return n("div",{attrs:{id:"app"}},[n("router-view")],1)},staticRenderFns:[]};var o=t("VU/8")({name:"App",data:function(){return{}}},a,!1,function(e){t("MMvR")},null,null).exports,u=t("/ocq");r.default.use(u.a);var i=new u.a({routes:[{path:"/",redirect:"login",hidden:!0,meta:{name:"主页",requireAuth:!0}},{path:"/login",name:"Login",hidden:!0,meta:{name:"登录"},component:function(){return t.e(13).then(t.bind(null,"r99a"))}},{path:"/home",name:"Home",redirect:"/store",meta:{name:"首页",requireAuth:!0},component:function(){return t.e(1).then(t.bind(null,"zp0o"))},children:[{path:"/store",name:"Store",component:function(){return Promise.all([t.e(0),t.e(3)]).then(t.bind(null,"h8e8"))},meta:{name:"商城管理",requireAuth:!0}},{path:"/partner",name:"Partner",component:function(){return Promise.all([t.e(0),t.e(6)]).then(t.bind(null,"bLbm"))},meta:{name:"合作伙伴管理",requireAuth:!0}}]},{path:"/swiper",name:"Swiper",meta:{name:"轮播图",requireAuth:!0},component:function(){return t.e(1).then(t.bind(null,"zp0o"))},children:[{path:"/swiper",name:"Swiper",component:function(){return Promise.all([t.e(0),t.e(15)]).then(t.bind(null,"9Czm"))},meta:{name:"轮播图管理",requireAuth:!0}}]},{path:"/product",name:"Product",meta:{name:"产品和方案",requireAuth:!0},component:function(){return t.e(1).then(t.bind(null,"zp0o"))},children:[{path:"/product",name:"Product",component:function(){return Promise.all([t.e(0),t.e(16)]).then(t.bind(null,"oYtj"))},meta:{name:"添加解决方案",requireAuth:!0}}]},{path:"/casepresent",name:"CasePresent",meta:{name:"案例展示",requireAuth:!0},component:function(){return t.e(1).then(t.bind(null,"zp0o"))},children:[{path:"/case",name:"Case",component:function(){return Promise.all([t.e(0),t.e(5)]).then(t.bind(null,"eu/e"))},meta:{name:"案例管理",requireAuth:!0}},{path:"/category",name:"Category",component:function(){return t.e(4).then(t.bind(null,"aVK3"))},meta:{name:"分类管理",requireAuth:!0}}]},{path:"/support",name:"Support",meta:{name:"服务与支持",requireAuth:!0},component:function(){return t.e(1).then(t.bind(null,"zp0o"))},children:[{path:"/support",name:"Support",component:function(){return Promise.all([t.e(0),t.e(2)]).then(t.bind(null,"KB9Y"))},meta:{name:"常见问题",requireAuth:!0}}]},{path:"/about",name:"About",meta:{name:"关于我们",requireAuth:!0},component:function(){return t.e(1).then(t.bind(null,"zp0o"))},children:[{path:"/compan",name:"Compan",component:function(){return Promise.all([t.e(0),t.e(18)]).then(t.bind(null,"zEiQ"))},meta:{name:"公司环境",requireAuth:!0}},{path:"/leadMember",name:"LeadMember",component:function(){return Promise.all([t.e(0),t.e(11)]).then(t.bind(null,"8uuj"))},meta:{name:"主要成员",requireAuth:!0}},{path:"/vitality",name:"Vitality",component:function(){return Promise.all([t.e(0),t.e(7)]).then(t.bind(null,"JBEK"))},meta:{name:"活力团队",requireAuth:!0}},{path:"/overseasTeam",name:"OverseasTeam",component:function(){return Promise.all([t.e(0),t.e(19)]).then(t.bind(null,"Mc7R"))},meta:{name:"境外团队",requireAuth:!0}}]},{path:"/thesea",name:"TheSea",meta:{name:"那片海咖啡",requireAuth:!0},component:function(){return t.e(1).then(t.bind(null,"zp0o"))},children:[{path:"/seaManger",name:"SeaManger",component:function(){return Promise.all([t.e(0),t.e(10)]).then(t.bind(null,"zu51"))},meta:{name:"那片海咖啡管理",requireAuth:!0}},{path:"/businscope",name:"BusinScope",component:function(){return Promise.all([t.e(0),t.e(8)]).then(t.bind(null,"bSFO"))},meta:{name:"经营范围管理",requireAuth:!0}},{path:"/coffeeenvir",name:"CoffeeEnvir",component:function(){return Promise.all([t.e(0),t.e(17)]).then(t.bind(null,"e5jW"))},meta:{name:"环境管理",requireAuth:!0}}]},{path:"/servicecenter",name:"ServiceCenter",meta:{name:"服务中心"},component:function(){return t.e(1).then(t.bind(null,"zp0o"))},children:[{path:"/reservat",name:"Reservat",component:function(){return t.e(12).then(t.bind(null,"tKYt"))},meta:{name:"预约订餐",requireAuth:!0}},{path:"/callus",name:"CallUs",component:function(){return Promise.all([t.e(0),t.e(14)]).then(t.bind(null,"8HJ1"))},meta:{name:"致电我们",requireAuth:!0}},{path:"/joinus",name:"JoinUs",component:function(){return t.e(9).then(t.bind(null,"Ty5M"))},meta:{name:"加入我们",requireAuth:!0}}]}]}),m=t("zL8q"),c=t.n(m),l=(t("tvR6"),t("//Fk")),s=t.n(l),p=t("mtWM"),h=t.n(p),d=new r.default({router:i}),f=h.a.create({timeout:7e3,baseURL:"http://test.sotofish.com/index.php",withCredentials:!0,headers:{"Content-Type":"application/json"}});function b(e,n,t,r){f({method:e,url:n,data:"POST"===e||"PUT"===e?t:null,params:"GET"===e||"DELETE"===e?t:null}).then(function(e){r(e)}).catch(function(e){r(e)})}f.interceptors.request.use(function(e){return sessionStorage.getItem("token")&&(e.headers.Authorization=sessionStorage.getItem("token")),e},function(e){return s.a.reject(e)}),f.interceptors.response.use(function(e){var n=e.data.code;return 0==n?s.a.resolve(e):1006==n||1007==n?(m.Message.error(e.data.msg),sessionStorage.removeItem("token"),d.$router.push({path:"/login"}),m.Message.error(e.data.msg),s.a.reject(e)):void m.Message.error(e.data.msg)},function(e){if(e.data.code){switch(response.data.code){case 401:case 403:Object(m.Message)({message:"登录过期，请重新登录",duration:1e3,forbidClick:!0}),sessionStorage.removeItem("token"),store.commit("loginSuccess",null),setTimeout(function(){i.replace({path:"/login",query:{redirect:i.currentRoute.fullPath}})},1e3);break;case 404:Object(m.Message)({message:"网络请求不存在",duration:1500,forbidClick:!0});break;default:Object(m.Message)({message:e.response.data.message,duration:1500,forbidClick:!0})}return s.a.reject(e)}});var g={get:function(e,n,t){return b("GET",e,n,t)},post:function(e,n,t){return b("POST",e,n,t)},put:function(e,n,t){return b("PUT",e,n,t)},delete:function(e,n,t){return b("DELETE",e,n,t)}};r.default.use(c.a),r.default.prototype.$api=g,r.default.prototype.$axios=h.a;var A=u.a.prototype.push;u.a.prototype.push=function(e){return A.call(this,e).catch(function(e){return e})},new r.default({el:"#app",router:i,components:{App:o},template:"<App/>"})},tvR6:function(e,n){}},["NHnr"]);
//# sourceMappingURL=app.94d72e5957b0d8963d90.js.map