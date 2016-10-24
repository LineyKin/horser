'use strict';
var buttons = $('#table td input');//все кнопки, включая барьеры
var active_buttons = $('.field');//все кнопки, по которым можно ходить
var restart = $('#restart'); //кнопка рестарта, в случае проигрыша
var table = $('#table');
var message = $('#message');
var conf_level_index = $('#this_level').val()-1;//номер текущего уровня минус 1, для массива конфигураций
var n = $('#level_width').val();//ширина квадрата (или прямоугольника)
var h = $("#table tr").length; // высота квадрата (или прямоугольника)
var all_buttons = buttons.length;
var last_step = active_buttons.length;// количество шагов в уровне (для фиксации победы)
var const_message = message.html();
var fail_message = 'Вы проиграли';
var number = 0;					
var attempt = 1;//счётчик попыток
var count_H = 0;//количество возможных шагов (H) после последнего клика (для фиксации проигрыша)
var array_H = [];  //для keyboard_control.js
var win_table_color  = level_config[conf_level_index]['win_table_color']; //из файла config.js

/*связь между индексом элемента и координатами ходов в поле*/
function coords_go_index(x,y) {
	var N = n*(n - y) + x - 1;
	return N;
}

function change_css_class(obj, class_name) {
	obj.removeAttribute('class');
	obj.setAttribute('class', class_name);
}


/*************МЕТОД ПОКАЗА СЛЕДУЮЩИХ ШАГОВ (H)***************/
function show_next_steps(index) {
	var x = buttons[index];
	if (!x.value.match(/[0-9]+/)) {
		change_css_class(x, "H");
		x.value = 'H';
		x.disabled = false;
		count_H++;
		array_H.push(index); // для keyboard_control.js
	};
};
/***********************************************************/


/******************КОГДА СДЕЛАЛ(А) ШАГ*********************/
buttons.on("click", function() {
	restart.css('visibility', 'visible');
	active_buttons.each( function() {
		$(this).prop('disabled', true);
		var this_val = $(this).val();
		if (this_val == 'H') {
			$(this).val(" ");
			change_css_class(this,'field')
		};
		if (this_val.match(/[0-9]+/) && this_val == number ) {
			change_css_class(this, 'after_step') //сокрытие цифр
		};

	});

	number++;
	message.html('Идёт игра. Попытка '+attempt);
	if ($(this).attr('class') != 'barrier') {
		change_css_class(this, 'this_step');
		$(this).val(number);
		$(this).prop('disabled', true);
	};
	
	/************ПОБЕДА И ЕЁ СЛЕДСТВИЯ**************/
	if (number == last_step) {
		var next_level = $('#next');
		next_level.css('visibility', 'visible');
		restart.hide();
		table.css('background', win_table_color);
		message.html('Победа');
		active_buttons.each( function() {
			change_css_class(this, 'win');
		});
	};
	/**********************************************/

	/**********координаты возможных ходов**********/
	var index = buttons.index(this);
	if (index < n) {
		var x = index + 1;
	}
	else {
		x = index%n + 1;
	}
	var y = -(index - x - n*n + 1)/n;

	var possible_step = [];
	possible_step[0] = coords_go_index(x + 1, y + 2);
	possible_step[1] = coords_go_index(x + 2, y + 1);
	possible_step[2] = coords_go_index(x + 2, y - 1);
	possible_step[3] = coords_go_index(x + 1, y - 2);
	possible_step[4] = coords_go_index(x - 1, y - 2);
	possible_step[5] = coords_go_index(x - 2, y - 1);
	possible_step[6] = coords_go_index(x - 2, y + 1);
	possible_step[7] = coords_go_index(x - 1, y + 2);

	/********фильтр координат возможных ходов********/
	for (var i = 0; i < 8; i++) {
		var pos_step = possible_step[i];
		if (!buttons[pos_step] || buttons[pos_step].className == "barrier") {
			continue;
		};
		if (n==5) {
			if (x == 1 && pos_step%n > 2) {
				continue;
			};
			if (x == 2 && pos_step%n > 3) {
				continue;
			};
			if (x == 4 && pos_step%n < 1) {
				continue;
			};
			if (x == 5 && pos_step%n < 2) {
				continue;
			};
		}
		else {
			if (x < 3 && pos_step%n > n - 3) {
				continue;
			};
			if (x > n - 3 && pos_step%n < 2) {
				continue;
			};
		};
		
		/**появление возможных ходов после фильтрации**/
		show_next_steps(pos_step);
	};
	if (count_H == 0 && number != last_step) {
		message.html(fail_message);
		first_push = false;
	};
	count_H = 0;
});
/**************КОГДА СДЕЛАЛ(А) ШАГ (КОНЕЦ)*******************/






/*************************ЧИСТИЛЬЩИК*************************/
restart.on("click", function() {
	$(this).css('visibility', 'hidden');
	active_buttons.each( function() {
		$(this).prop('disabled', false);
		change_css_class(this, 'field');
		$(this).val(" ");
	});
	number = 0;
	message.html(const_message);
	enter_count = 0;
	attempt++;
	$('#attempts').val(attempt);//запись кол-ва попыток в форму для последующей отправки в БД
});
/***********************************************************/