<?
function my_hash($string) {
	$salt1 = 'cobra';
	$salt2 = 'copter';
	$salt_string = $salt1.$string.$salt2;
	$hash = md5($salt_string);
	return $hash;
}

require_once 'php/db_connect.php';
$db_server = mysqli_connect($db_host, $db_user);
mysqli_select_db($db_server, $db_name);

if (isset($_POST['reg'])) {
	//берём данные из формы
	$nickname = $_POST['nickname'];
	$password = $_POST['password'];
	$email = $_POST['email'];
	$today = date("Y-m-d H:i:s"); // момент регистрации

	//проверяем никнейм на индивидуальность
	$query = "SELECT nickname FROM users WHERE nickname='$nickname'";
	$result = mysqli_query($db_server, $query);
	$all_rows = mysqli_num_rows($result);
	if ($all_rows > 0) {
		die('<div class="die">этот никнейм уже занят</div>');
	}
	//сохраняем ник в куках на полгода
	setcookie('linx_nickname', $nickname, time()+60*60*24*7*4*6, '/');

	//хешируем пароль
	$db_password = my_hash($password);

	//вносим данные в БД
	$query = "INSERT INTO users(nickname, password, email, reg_date) 
	VALUES('$nickname', '$db_password', '$email', '$today')";
	mysqli_query($db_server, $query);
	header("Location: yourpage.php");
}

?>

<!DOCTYPE html>
<html>
<head>
	<meta charset='utf-8'>
	<link rel="SHORTCUT ICON" href="H.png" type="image/x-icon">
	<link href="https://fonts.googleapis.com/css?family=Press+Start+2P" rel="stylesheet">
	<link rel="stylesheet" type="text/css" href="css/reg.css">
	<title>Регистрация</title>
</head>
<body>
	<div id='field'>
		<form method='POST' atcion=<?echo $_SERVER['PHP_SELF'];?> >
			<p>nickname</p>
			<input id='nickname' name='nickname' type='text'>
			<p>password</p>
			<input id='password' name='password' type='text'>
			<p>email</p>
			<input id='email' name='email' type='text'><br>
			<input type='submit' name='reg' id='reg_btn' value='Зарегистрироваться'>
		</form>
	</div>
<script type="text/javascript" src='js/reg.js'></script>
</body>
</html>