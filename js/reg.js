var field = document.getElementById('field');
var reg_btn = document.getElementById('reg_btn');

var reg_data = {
	nickname: {
		elem: document.getElementById('nickname'),
		regexp: /^\w{2,}$/
	},
	password: {
		elem: document.getElementById('password'),  
		regexp: /^\w{6,}$/
	},
	email: {
		elem: document.getElementById('email'),
		regexp: /^[a-z0-9\.\-\_]+@{1}\w+\.{1}\w+$/
	}
};

field.oninput = function() {
	var good_bg = '#04FF00';
	var count = 0;
	for (key in reg_data) {
		var e = reg_data[key].elem;
		var v = e.value;
		var r = new RegExp(reg_data[key].regexp,'ig')
		if (v.match(r)) {
			e.classList.remove("bad_text");
			e.classList.add("good_text");
			count++;
		}
		else {
			e.classList.remove("good_text");
			e.classList.add("bad_text");
		}
	}
	if (count == 3) {
		reg_btn.style.display = 'inline';
	}
	else {
		reg_btn.style.display = 'none';
	}
}
