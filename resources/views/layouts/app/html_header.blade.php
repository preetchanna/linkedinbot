<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<meta http-equiv="X-UA-Compatible" content="IE=edge">
<!-- CSRF Token -->
<meta name="csrf-token" content="{{ csrf_token() }}">
<title>{{ config('app.name') }} | @yield('title','Title Here')</title>

@include('layouts.favicon')

@include('layouts.app.scripts_header')

@stack('scripts_header')