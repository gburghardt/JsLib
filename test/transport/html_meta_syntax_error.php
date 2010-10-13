<?php

$json = '{"foo":bar"}';

header("X-META-JSON: " . $json);

echo '<p>Finished!</p>';

?>