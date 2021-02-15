<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use App\Models\LinkedinAccounts;

use Facebook\WebDriver\Remote\DesiredCapabilities;
use Facebook\WebDriver\Remote\RemoteWebDriver;
use Facebook\WebDriver\WebDriverBy;

class LinkedinBotController extends Controller
{
    public function list(Request $request){
        $accounts = LinkedinAccounts::paginate(10);
        return view('linkedin', ['accounts' => $accounts]);
    }

    public function send(Request $request){
        try{
            /*$validatedData = $request->validate([
                'phone_or_email'    => ['required', 'unique:linkedin_accounts', 'max:255'],
                'password'          => ['required'],
                'firstname'         => ['required', 'max:255'],
                'lastname'          => ['required', 'max:255'],
            ]);

            $username   = $request->input('phone_or_email');
            $password   = $request->input('password');
            $firstname  = $request->input('firstname');
            $lastname   = $request->input('lastname');*/

            // use the factory to create a Faker\Generator instance
            $faker      = \Faker\Factory::create();
            $username   = $faker->freeEmail;
            $password   = $faker->password;
            $firstname  = $faker->firstName;
            $lastname   = $faker->lastName;

            $serverUrl = 'http://localhost:4444';
            // Chrome
            $driver = RemoteWebDriver::create($serverUrl, DesiredCapabilities::chrome());

            // navigate to linked signup page
            $driver->get('https://www.linkedin.com/signup/cold-join');
            
            // Find Email/Phone input Element & Fill
            $driver->findElement(WebDriverBy::id('email-or-phone'))
            ->sendKeys($username);

            //Save the screenshot at this step
            $path1 = storage_path('app/public/'.$username.'/step1.png');
            $driver->takeScreenshot($path1);

            // Find Password input Element & Fill
            $driver->findElement(WebDriverBy::id('password'))
            ->sendKeys($password);
            
            // Click on the Form Submit button for next step
            $driver->findElement(WebDriverBy::id('join-form-submit'))->click();

            // Find First Name input Element & Fill
            $driver->findElement(WebDriverBy::id('first-name')) // find search input element
            ->sendKeys($firstname);

            $path2 = storage_path('app/public/'.$username.'/step2.png');
            $driver->takeScreenshot($path2);

            // Find Last Name input Element & Fill
            $driver->findElement(WebDriverBy::id('last-name')) // find search input element
            ->sendKeys($lastname)
            ->submit();
            
            // Click on the Form Submit button to create account
            $driver->findElement(WebDriverBy::id('join-form-submit'))->click();

            // close the browser
            $driver->quit();

            // Create account in the System
            $this->create($username, $password, $firstname, $lastname);

            return redirect()->back()->with('message', 'Account has not created successfully as it is not able to perform manual security check!');
            
        } catch(Throwable $e){
            report($e);

            return false;
        }
        
    }

    protected function create($username, $password, $firstname, $lastname){
        LinkedinAccounts::create([
                    'phone_or_email'    => $username,
                    'password'          => Hash::make($password),
                    'firstname'         => $firstname,
                    'lastname'          => $lastname,
            ]);
    }
}
