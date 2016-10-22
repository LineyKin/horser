// возвращает cookie с именем name, если есть, если нет, то undefined
function getCookie(name) {
 	var matches = document.cookie.match(new RegExp(
 	 	"(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
 	));
 	return matches ? decodeURIComponent(matches[1]) : null;
}

var nickname = getCookie('linx_nickname');
var greetings = document.getElementById('h1');
if (nickname) {
	greetings.innerHTML = "Привет "+nickname;
}
else {
	greetings.innerHTML = "Привет незнакомец";
}
