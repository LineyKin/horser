var buttons = $('#table td input');//все кнопки, включая барьеры
var field = $('.field');//все кнопки, по которым можно ходить
var restart = $('#restart'); //кнопка рестарта, в случае проигрыша
var table = $('#table');
var message = $('#message');
var conf_level_index = $('#this_level').val()-1;//номер текущего уровня минус 1, для массива конфигураций
var n = $('#level_width').val();//ширина квадрата (или прямоугольника)
var h = $("#table tr").length; // высота квадрата (или прямоугольника)
var all_buttons = buttons.length;
var last_step = field.length;// количество шагов в уровне (для фиксации победы)
var const_message = message.html();
var fail_message = 'Вы проиграли';
var number = 0;					
var attempt = 1;//счётчик попыток
var count_H = 0;//количество возможных шагов (H) после последнего клика (для фиксации проигрыша)
var array_H = [];



/*************************из файла config.js*************************/
var H_color 		 = level_config[conf_level_index]['H_color'];
var win_table_color  = level_config[conf_level_index]['win_table_color'];
var color_after_step = level_config[conf_level_index]['color_after_step'];
var sign_color 		 = level_config[conf_level_index]['color'];



/*связь между индексом элемента и координатами ходов в поле*/
function coords_go_index(x,y) {
	var N = n*(n - y) + x - 1;
	return N;
}


/****************КЛАСС СЛЕДУЮЩИХ ШАГОВ (H)******************/
function next_step(index) {
	this.background = H_color;
	this.value = 'H';
	this.ind = index;
	this.appear = function() {
		var x = buttons[this.ind];
		var regexp = /[0-9]+/;
		if (!regexp.test(x.value)) {
			x.style.background = this.background;
			x.style.color = sign_color;
			x.value = this.value;
			x.disabled = false;
			count_H++;
			array_H.push(this.ind);
		};
	};
};
/***********************************************************/


/******************КОГДА СДЕЛАЛ(А) ШАГ*********************/
buttons.click( function() {
	/*if (first_push) {
		first_push = false;
		buttons[focus_index].style.background = color_before_focus;
	};*/
	restart.css('visibility', 'visible');
	field.each( function() {
		$(this).prop('disabled', true);
		var this_val = $(this).val();
		if (this_val == 'H') {
			$(this).val(" ");
			$(this).css("background", "white");
		};
		if (this_val != " " && $(this).css("color") != color_after_step && this_val <= number) {
			$(this).css("color", color_after_step);
		};
	});

	number++;
	message.html('Идёт игра. Попытка '+attempt);
	if ($(this).attr('class') != 'barrier') {
		$(this).css("background", color_after_step);
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
		field.each( function() {
			$(this).css({'background': H_color, 'color': H_color});
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
		if (!buttons[possible_step[i]] || buttons[possible_step[i]].className == "barrier") {
			continue;
		};
		if (n==5) {
			if (x == 1 && possible_step[i]%n > 2) {
				continue;
			};
			if (x == 2 && possible_step[i]%n > 3) {
				continue;
			};
			if (x == 4 && possible_step[i]%n < 1) {
				continue;
			};
			if (x == 5 && possible_step[i]%n < 2) {
				continue;
			};
		}
		else {
			if (x < 3 && possible_step[i]%n > n - 3) {
				continue;
			};
			if (x > n - 3 && possible_step[i]%n < 2) {
				continue;
			};
		};
		
		/**появление возможных ходов после фильтрации**/
		var H = new next_step(possible_step[i]);
		H.appear();
	};
	if (count_H == 0 && number != last_step) {
		message.html(fail_message);
		first_push = false;
	};
	count_H = 0;
});
/**************КОГДА СДЕЛАЛ(А) ШАГ (КОНЕЦ)*******************/






/*************************ЧИСТИЛЬЩИК*************************/
restart.click( function() {
	$(this).css('visibility', 'hidden');
	field.each( function() {
		$(this).css({'background':'white',color:sign_color});
		$(this).prop('disabled', false);
		$(this).val(" ");
	});
	number = 0;
	message.html(const_message);
	enter_count = 0;
	attempt++;
	$('#attempts').val(attempt);//запись кол-ва попыток в форму для последующей отправки в БД
});
/***********************************************************/