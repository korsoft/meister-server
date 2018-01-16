<?php

use Illuminate\Http\Request;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

// Route::middleware('auth:api')->get('/user', function (Request $request) {
//     return "ss";
// });


Route::get('/claims', [
    'uses' => 'MiddleRestController@claims'
]);

Route::get('/claims/details', [
    'uses' => 'MiddleRestController@details'
]);

Route::get('/claims/detail/{claimno}', [
    'uses' => 'MiddleRestController@detail'
]);

Route::get('/claims/simulate', [
    'uses' => 'MiddleRestController@simulate'
]);
