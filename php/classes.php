<?php

class html {
	
	static function paginator($current_lvl, $this_level) {
		for ($i=1; $i <= $current_lvl; $i++) {
			if ($i == $this_level) {
				$id = "id='match'"; // кнопка активного уровня имеет другой цвет
			}
			else {
				$id = NULL;
			}
			echo "<td><input name='previous_$i' type='submit' $id class='level_bar' value='$i'></td>";
		}
	}


	static function game_field($h, $w, $barriers) {
		if ($barriers == NULL) {
			for ($i=0; $i < $h; $i++) { 
				$r = $i+1;
				$y = $h-$i;
				echo "<tr>";
				for ($j=0; $j < $w; $j++) { 
					$c = $j+1;
					echo "<td><input x=$c y=$y type='button' value=' ' class='field'></td>";
				}
				echo "</tr>";
			}
		}
		else {
			for ($i=0; $i < $h; $i++) { 
				$r = $i+1;
				$y = $h-$i;
				echo "<tr>";
				for ($j=0; $j < $w; $j++) { 
					$c = $j+1;
					$b = coords_go_index($c,$r);
					if (in_array($b, $barriers)) {
						echo "<td><input x=$c y=$y type='button' value=' ' class='barrier' disabled='true'></td>";
					}
					else {
						echo "<td><input x=$c y=$y type='button' value=' ' class='field'></td>";
					}
				}
				echo "</tr>";
			}
		}
	}

}

?>