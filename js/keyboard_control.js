var button_focus = {
	x: null,
	y: null
};
var focus_color = "#C2D8F2";
var focus_color = "#99F261";
var color_before_focus;
var focus_index;
var first_push = false; //первое нажатие стрелок
var x;
var y;
var H_index = 0;

function coords_go_index_2(x,y) {
    var N = n*(h - y) + x - 1;
    return N;
}

function index_go_coordinates(index) {
    var object = {
        x: buttons[index].getAttribute('x')*1,
        y: buttons[index].getAttribute('y')*1
    };
    return object;
}

document.addEventListener("keydown", function(event) {
    if ((event.keyCode == 40 ||	//DOWN
    	event.keyCode == 39 ||	//RIGHT
    	event.keyCode == 38 ||	//UP
    	event.keyCode == 37) && //LEFT
        message.html() != fail_message) {
        /**********ПЕРВОЕ НАЖАТИЕ НА ОДНУ ИЗ КЛАВИШ ПЕРЕНОСИТ ФОКУС НА 1 АКТИВНОЕ ПОЛЕ(НЕ БАРЬЕР ТО БИШЬ)**********/	
    	if (!first_push) {
    		color_before_focus = $(".field:first").css("background");
    		first_push = true;
    		start_x = $(".field:first").attr("x")*1;
			start_y = $(".field:first").attr("y")*1;
    		button_focus.x = start_x;
    		button_focus.y = start_y;
    		focus_index = coords_go_index_2(start_x,start_y);
    		buttons[focus_index].style.background = focus_color;

    		$("#focus_coords td[name=x]").html(button_focus.x);
    		$("#focus_coords td[name=y]").html(button_focus.y);
    		$("#focus_coords td[name=index]").html(focus_index);
    	}
    	else {
            /*ДО НАЖАТИЯ ENTER'А ГУЛЯЕМ СВОБОДНО ПО ПОЛЮ*/
            if (enter_count == 0) {
                if (event.keyCode == 39) { //RIGHT
                    button_focus.x++;
                    if (button_focus.x > n) {
                        button_focus.x = 1;
                    }
                }
                if (event.keyCode == 37) { //LEFT
                    button_focus.x--;
                    if (button_focus.x < 1) {
                        button_focus.x = n;
                    }
                }
                if (event.keyCode == 40) { //DOWN
                    button_focus.y--;
                    if (button_focus.y < 1) {
                        button_focus.y = h;
                    }
                }
                if (event.keyCode == 38) { //UP
                    button_focus.y++;
                    if (button_focus.y > h) {
                        button_focus.y = 1;
                    }
                }

                x = 1*button_focus.x;
                y = 1*button_focus.y;

                buttons[focus_index].style.background = color_before_focus;
                focus_index = coords_go_index_2(x,y);
            }
            /*ПОСЛЕ НАЖАТИЯ ENTER'а ГУЛЯЕМ ТОЛЬКО ПО H'кам*/
            else {
                if (event.keyCode == 39) { // RIGHT
                    H_index++;
                    if (H_index > array_H.length-1) {
                        H_index = 0;
                    }
                }
                if (event.keyCode == 37) { // LEFT
                    H_index--;
                    if (H_index < 0) {
                        H_index = array_H.length-1;
                    }  
                }
                buttons[focus_index].style.background = color_before_focus;
                focus_index = array_H[H_index];
            }
            color_before_focus = buttons[focus_index].style.background;
            buttons[focus_index].style.background = focus_color;
		}
	}
});


var enter_count = 0;
document.addEventListener("keydown", function(event) {
	if(event.keyCode == 13) {
        array_H = [];
        //ENTER ВО ВРЕМЯ ИГРЫ
        if (message.html() != fail_message && first_push) {
            var push = index_go_coordinates(focus_index);
            if (enter_count == 0) {
                $(".field[x="+push.x+"][y="+push.y+"]").click();
                color_before_focus = $(".field[x="+x+"][y="+y+"]").css("background");
                enter_count++;
            }
            else {
                if (buttons[focus_index].value == "H") {
                    $(".field[x="+push.x+"][y="+push.y+"]").click();
                    color_before_focus = H_color;
                }
            }
            focus_index = array_H[0];//после каждого нажатия фокусируется на кнопку с индексом array_H[0]
            if (focus_index) {
                buttons[focus_index].style.background = focus_color;
            }
        }
        //ENTER ПОСЛЕ ПРОИГРЫША РЕСТАРТИТ
        else {
            restart.click();
        }
	}
});