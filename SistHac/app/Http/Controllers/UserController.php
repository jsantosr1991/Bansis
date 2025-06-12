<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\DB;
use Illuminate\Http\Request;

class UserController extends Controller
{
    //
    public function index()
    {
        $users = DB::connection('mysql')->select('select * from w_usersrols');
        return response()->json($users);
    }
}
