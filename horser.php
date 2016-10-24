<?
session_start();
require_once 'php/levels.php'; //конфигурации уровней
require_once 'php/classes.php'; //классы

if (!isset($_COOKIE['horser_progress'])) {
	setcookie('horser_progress',0,time()+60*60*24*30*6);
}
$current_lvl = $_COOKIE['horser_progress']+1;//уровень который игрок ещё не прошёл, актуальный уровень

if (!isset($_SESSION['horser_this_level'])) { 
	$_SESSION['horser_this_level'] = $current_lvl; //при первом запуске игрок переносится на актуальный,непройденный уровень
}

/**************ПУЛЬТ ДЛЯ ПЕРЕЩЁЛКИВАНИЯ УРОВНЕЙ**************/
for ($i=1; $i <= $current_lvl; $i++) { 
	$prev_name = "previous_".$i;
	if (isset($_POST[$prev_name])) {
		$_SESSION['horser_this_level'] = $i;

		//не допускаем повторную отправку формы:
		$_POST = NULL;
		header("Location: ".$_SERVER["REQUEST_URI"]);
	}
}
/************************************************************/

/****************ПЕРЕХОД НА СЛЕДУЮЩИЙ УРОВЕНЬ****************/
if (isset($_POST['next'])) {
	if ($_SESSION['horser_this_level'] < $current_lvl) { //если переигрываете старые уровни, куки(прогресс) не меняем
		$_SESSION['horser_this_level']++;
	}
	else {
		setcookie('horser_progress',$current_lvl,time()+60*60*24*30*6); //тут должен быть запрос в БД, увеличивающий $progress на 1.Пока вместо этого куки.
		$_SESSION['horser_this_level']++;
	}
	
	//не допускаем повторную отправку формы:
	$_POST = NULL;
	header("Location: ".$_SERVER["REQUEST_URI"]);
}
/************************************************************/

$this_level = $_SESSION['horser_this_level'];

// конфигурации из levels.php
$h = $level[$this_level]['h'];
$w = $level[$this_level]['w'];
$barriers = $level[$this_level]['barriers'];
$message = $level[$this_level]['message'];

function coords_go_index($x,$y) { // связь между индексом элемента и координатами ходов в поле
	global $w;
	$N = $w*($y - 1) + $x - 1;
	return $N;
}

?>








<!DOCTYPE HTML>
<html>
<head>
	<meta charset="utf-8">
	<title>Уровень <?echo $this_level;?></title>
	<link href="https://fonts.googleapis.com/css?family=Press+Start+2P" rel="stylesheet">
	<link rel="stylesheet" type="text/css" href="css/basis.css">	
	<link rel="stylesheet" type="text/css" href="css/levels/lvl<?echo $this_level;?>.css">
	<script src = "js/lib/jquery-1.11.3.js"></script>
	<script src = "js/config.js"></script>
	<link rel="SHORTCUT ICON" href="H.png" type="image/x-icon">
</head>
<body>

<form method='POST' action=<?echo $_SERVER['PHP_SELF'];?> >
	<table id='level_bar'>
		<tr> <!-- тут СТРОИТСЯ пульт дл перещелкивания уровней, он же пагинатор -->
			<?php html::paginator($current_lvl, $this_level);?> <!-- classes.php -->
		</tr>
	</table>
</form>
<br>
<div id="message"><?echo $message;?> поле</div>


<!-- ******************************** ИГРОВОЕ ПОЛЕ ******************************** -->
<table id="table">
	<?php html::game_field($h, $w, $barriers);?> <!-- classes.php -->
</table>
<!-- ***************************** ИГРОВОЕ ПОЛЕ (КОНЕЦ) ***************************** -->


<input type="button" id="restart" value="Рестарт" visibility="hidden">

<div>
	<form method='POST' action=<?echo $_SERVER['PHP_SELF'];?>>
		<input type='hidden' id='attempts' value='1'>
		<input type="submit" name="next" id="next" class="buttons" value="На следующий уровень">
	</form>
</div>

<div id='to_my_page'><a href="yourpage.php">К себе</a></div>

<table id='js_info'>
	<tr>
		<td><input id='level_width' type='button' value=<?echo $w;?>></td>
		<td><input id='this_level' type='button' value=<?echo $this_level;?>></td>
	</tr>
</table>

<script src = "js/horser.js"></script>
<script src = "js/keyboard_control.js"></script> <!-- тут серьёзные баги -->

</body>
</html>