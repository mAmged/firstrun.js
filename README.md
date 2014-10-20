firstrun.js
===========

check if it's the user first time visiting your page<br>
Can be used in hybrid phonegap apps<br>
<h1>example</h1>
<pre>
	firstRun.init(function(check){
	    alert(firstRun.get('mm')+' minutes \n | '+
	    firstRun.get('mm', true)+' minutes\n | '+
	    firstRun.get('hh', true)+' hours')
	});
</pre>