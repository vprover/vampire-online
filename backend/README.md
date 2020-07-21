# Vampire REST API

This is a NodeJS/Express server providing a REST API for Vampire.

It also has additional endpoints for use with the frontend application.

## Running

This API is tightly coupled to Vampire, and vampire executable needs to be present on the machine running the server. To make things easy there is a dockerfile which builds the latest version of vampire (with z3) and hosts the server. You will need to have docker installed and run 
```
docker build --tag <name>:<tag> .
docker run -p <local_machine_port>:8080/tcp <name>:<tag>
```
*You could add `-d` to the run command to start the container in detached mode*

## Authorisation

Accessing any endpoint is restricted by having a valid JSON Web Token.  
Requests needs to set an authorisation header as such `Bearer <JWT>`.

### Users

Not every user should have access to everything vampire could do (e.g. use all cores on the host machine, run forever). Different user types are used for accessing privileged options.

The types of users and their associated restrictions can be edited in `/src/options_utils/restricted_options.js`

There is also an **admin** user type which may be used only for generating new tokens, but has no policies associated with it. (see *[/generate-tokens](#gentokens)*)

On startup the server generates and outputs to stdout two JWTs

1. admin
2. frontend

## Endpoints

Any optional field will be marked by square brackets. (e.g. [optionalFiled])

**POST** */parse*  
Checks if the input is formatted correctly.  
Uses ./vampire --mode output.  

Request
  ```
  {
    clauses: String
  }
  ```
Response
  ```
  {
    error: Object { 
        type: "parse_error" | "user_error", 
        text: String,
        [line]: Line number in clauses
    } 
  }
  ```
  If no parsing error was detected the error object is empty = {}.

**POST** */solve*  
Calls ./vampire with the args provided and passes the clauses as stdin.


Request
  ```
  {
    clauses: String,
    args: Object { arg1Name: arg1Value, arg2Name: arg2Value }
  }
  ```

Response
  ```
  {
    rawOutput: String (Stdout produced by running vampire on the input)
    [error]: Object (Same as for /parse)
    [info]: String
  }
  ```

**GET** */options*?[sections=true|false]  
Returns the options available in vampire and injects the restrictions depending on JWT used for authentication.  
Uses ./vampire --show_options on 

Response  
Array of sections if sections=true
 ```
 [
   name: String
   options: Array
 ]
 ```
Array of options if sections=false or if not present

An option has the following format
  ```
  {
    name: String
    [shortName]: String
    description: String
    default: String
    values: Array | null
    [restriction]: true | Object {
      [minValue]: Number,
      [maxValue]: Number
    }
  }
  ```


**POST** */string-strategy/decode*  
Decodes a string strategy with the format ```<sa><s>_<awr>_<arg1=val1:arg2=val2...>_<t>```
into args.

Request
```
{
  stringStrategy: String
}
```

Resoponse  
```
{
  args: Object (as used for /solve)
}
```

**POST** */string-strategy/encode*  
Encodes an args object to a string strategy.  
Mirrors the request and response from */decode*.  
Uses ./vampire --encode on.

**GET** */problem-library*
Table of contents of problem library.  
Response
```
[
  name: String (section name)
  problems: Array[String] (problem names)
]
```

**GET** */problem-library/{section}*  
Array of problem names in that section.

**GET** */problem-library/{section_name}/{problem_name}*  
Problem file.

**GET** */tutorial*  
Table of contents and tutorial pages as JSON.  
Response
```
{
  toc: Array
  sections: Array
}
```
```
toc_entry: {
  name: String
  headings: Array [{content, slug, lvl, i, seen}]
}

sections_entry: {
  name: String
  content: String
}
```

**POST** <a name="gentokens"></a> */access-tokens*  
Generates access tokens for the specified users.  
Only requests using an **admin** JWT will be allowed.  
Request
```
[
  {
    userName: String,
    [userType]: "any" | "sudo" | "admin"
    [expiresIn]: "<number>s|m|d"
  },
  ...
]
```
If userType is not specified it defaults to "any".  
If expiresIn is not specified the token will never expire.

Response
```
  [
    {
      userName: String,
      token: String
    },
    ...
  ]
```

A token can be appended to the root link for the frontend application to allow privileged use.

If the frontend is hosted at `vampire-frontend.com` and we have a sudo token, using `vampire-frontend.com/?token=<JWT>` will give the desired access, **as long as** the frontend is **not** refreshed. If refreshed, you will need to use the token URL again.

**POST** */upload-problem*  
Request
```
{
  clauses: String,
  description: String,
}
```
Response  
Error message if something goes wrong.
