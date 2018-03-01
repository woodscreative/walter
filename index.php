<!--doctype html-->
<html>
<head>
  <link href="walter.css?v=<?=time();?>" rel="stylesheet" type="text/css">
  <script type="text/javascript" src="walter.js?v=<?=time();?>"></script>
</head>
<body>
   
<?php
function createAnimation($i, $name, $dir)
{
  $id = 'anim-' . $i;
  $path = dirname(__FILE__) . '/' . $dir;
  $files = glob($path . '/*', GLOB_BRACE);
  asort($files, SORT_REGULAR);
  $files = array_reverse($files);
  $json = [];
  foreach ($files as $f)
    $json['frames'][] = $dir . '/' . basename($f);
?>

<h2><?=$name;?></h2>
<div
id="anim-<?=$i;?>"
class="anim"
data-walter='<?=json_encode($json);?>'>
</div>
<div id="debug-<?=$i;?>" class="debug"></div>

<?php
};
?>

<h2>Walter Global Controls</h2>
<button
id="controls-start"
type="button"
data-walter-control='{"action":"start"}'>
  Start
</button>
<button
id="controls-stop"
type="button"
data-walter-control='{"action":"stop"}'>
  Stop
</button>
<p>
  <strong>Live Settings</strong>
</p>
<p>
  <label for="settings-fps">Walter.config.fps</label>
  <input id="settings-fps" type="range" min="1" max="60" value="10">
  <input id="settings-fps-value" type="text" value="0" style="width:50px;"> fps
</p>

<?php
echo createAnimation(1, "Example 1", '2203_Scenario');
echo createAnimation(2, "Example 2", '2203_Tech');
?>

<script>
/**
 * Initialise Walter
 */
var anim = new Walter({
  selector : '.anim'
});
// Test callbacks
anim.setCallback('init', function() {
  console.log('init');
});
// Test callbacks on frame change
anim.setCallback('onChange', function() {
  var debug1 = document.getElementById("debug-1");
  var debug2 = document.getElementById("debug-2");
  var animation1 = anim.get("#anim-1");
  var animation2 = anim.get("#anim-2");
  debug1.innerHTML = animation1.getActiveFrameSrc();
  debug2.innerHTML = animation2.getActiveFrameSrc();
});
anim.init();

/**
 * Live Settings
 */
var rangeFps = document.getElementById('settings-fps');
var rangeFpsValue = document.getElementById('settings-fps-value');
rangeFps.onchange = function()
{
  settingsUpdateFps(this.value);
};
function settingsUpdateFps($fps)
{
  rangeFps.value = $fps;
  rangeFpsValue.value = $fps;
  anim.config.fps = $fps; 
};
settingsUpdateFps(anim.config.fps);
</script>

</body>
</html>
