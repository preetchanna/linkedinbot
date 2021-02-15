<!DOCTYPE html>
<html lang="{{ app()->getLocale() }}">
	<head>
		@include('layouts.app.html_header')
	</head>
	<body>
		<div id="wrapper">
			<!-- BEGIN LEFT SIDEBAR -->
			<nav class="navbar-default navbar-static-side" role="navigation">
	        <div class="sidebar-collapse">
	            <ul class="nav metismenu" id="side-menu">
	            	@include('layouts.app.left_bar')
	            </ul>
	        </div>
    		</nav>
			<!-- END LEFT SIDEBAR -->
			<div id="page-wrapper" class="gray-bg">
			<div class="row border-bottom">
        	<nav class="navbar navbar-static-top" role="navigation" style="margin-bottom: 0">
        		@include('layouts.app.right_bar')
        	</nav>
        	</div>
        	<!-- BEGIN CONTENT -->
			@yield('content')
			<!-- END CONTENT -->
			@include('layouts.app.body_footer')
			</div>
		</div>
		@include('layouts.app.html_footer')
	</body>
</html>