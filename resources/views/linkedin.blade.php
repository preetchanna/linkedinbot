@extends('layouts.app')

@section('title', 'jhkjgkhj')

@section('content')

<div class="row wrapper border-bottom white-bg page-heading">
    <div class="col-lg-10">
        <h2>LinkedIn Bot Accounts</h2>
    </div>
    <div class="col-lg-2"></div>
</div>

<div class="wrapper wrapper-content animated fadeInRight">
<div class="row">
    <div class="col-lg-12">
    <div class="ibox ">
        <div class="ibox-title">
            <h5>List</h5>
        </div>
        <div class="ibox-content">
            @if (Session::has('message'))
                <div class="alert alert-info">{{ Session::get('message') }}</div>
            @endif
            <div class="float-right m-b">
                <form method="post" action="{{ route('create_account') }}">
                @csrf
                <button type="submit" class="btn btn-primary btn-lg">Create Account</button>
                </form>
            </div>
            
            <div class="table-responsive">
            <table class="table table-bordered">
                <thead>
                    <tr>
                        <th>Username/Phone</th>
                        <th>Name</th>
                        <th>Screenshots</th>
                    </tr>
                </thead>
                <tbody>
                @if( count($accounts) )
                    @foreach($accounts as $account)
                    <tr>
                        <td>{{ $account["phone_or_email"] }}</td>
                        <td>{{ $account["firstname"] }} {{ $account["lastname"] }}</td>
                        <td>
                        <div class="lightBoxGallery">
                            <a href="{{ asset('storage/'.$account['phone_or_email'].'/step1.png') }}" title="Image from Unsplash" data-gallery=""><img src="{{ asset('storage/'.$account['phone_or_email'].'/step1.png') }}" height="50px" width="50px"></a>
                            <a href="{{ asset('storage/'.$account['phone_or_email'].'/step2.png') }}" title="Image from Unsplash" data-gallery=""><img src="{{ asset('storage/'.$account['phone_or_email'].'/step2.png') }}" height="50px" width="50px"></a>
                            <div id="blueimp-gallery" class="blueimp-gallery">
                                <div class="slides"></div>
                                <h3 class="title"></h3>
                                <a class="prev">‹</a>
                                <a class="next">›</a>
                                <a class="close">×</a>
                                <a class="play-pause"></a>
                                <ol class="indicator"></ol>
                            </div>
                        </div>
                        </td>
                    </tr>
                    @endforeach
                @else 
                    <tr>
                        <td colspan="100%">No results found</td>
                    </tr>
                @endif
                </tbody> 
                <tfoot>  
                    <tr>
                        <td colspan="100%">
                            <div class="float-right">{{ $accounts->links() }}</div>
                        </td>
                    </tr>
                </tfoot>
            </table>
            </div>

        </div>
    </div>
    </div>
</div>
</div>

@endsection