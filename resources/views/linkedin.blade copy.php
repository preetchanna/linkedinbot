<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">

        <title>Linkedin Bot Accounts</title>

        <!-- Fonts -->
        <link href="https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700&display=swap" rel="stylesheet">
        <style>
            body {
                font-family: 'Nunito';
            }
        </style>
    </head>
    <body>
        <!--@if($errors->any())
            {{ implode('', $errors->all('<div>:message</div>')) }}
        @endif-->

        @if (Session::has('message'))

            <div class="alert alert-info">{{ Session::get('message') }}</div>

        @endif
        
        <form method="post" action="{{ route('create_account') }}">
            @csrf
            <input type="text" name="phone_or_email" placeholder="Username/Phone">
            <input type="password" name="password" placeholder="Password">
            <input type="text" name="firstname" placeholder="First Name">
            <input type="text" name="lastname" placeholder="Last Name">
            <input type="submit" value="Create Account">
        </form>
        <table>
            <tr>
                <th>Username/Phone</th>
                <th>Name</th>
                <th>Screenshots</th>
            </tr>
            @foreach($accounts as $account)
                <tr>
                    <td>{{ $account["phone_or_email"] }}</td>
                    <td>{{ $account["firstname"] }} {{ $account["lastname"] }}</td>
                    <td><a href="{{ asset('storage/'.$account['phone_or_email'].'/step1.png') }}">Step 1</a><a href="{{ asset('storage/'.$account['phone_or_email'].'/step2.png') }}">Step 2</a></td>
                </tr>
            @endforeach
        </table>
    </body>
</html>
