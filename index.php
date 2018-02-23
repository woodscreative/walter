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
  <label for="settings-delay">Walter.config.delay</label>
  <input id="settings-delay" type="range" min="50" max="400" value="50" id="delay">
  <input id="settings-delay-value" type="text" value="0" style="width:50px;"> ms
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
var rangeDelay = document.getElementById('settings-delay');
var rangeDelayValue = document.getElementById('settings-delay-value');
rangeDelay.onchange = function()
{
  settingsUpdateDelay(this.value);
};
function settingsUpdateDelay($delay)
{
  rangeDelay.value = $delay;
  rangeDelayValue.value = $delay;
  anim.config.delay = $delay; 
};
settingsUpdateDelay(anim.config.delay);
</script>

</body>
</html>
