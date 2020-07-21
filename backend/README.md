# Vampire REST API

This is a NodeJS/Express server providing a REST API for Vampire.

It also has additional endpoints for use with the frontend application.

## Run

This API is tightly coupled to Vampire, and vampire executable needs to be present on the machine running the server. To make things easy there is a dockerfile which builds the latest version of vampire (with z3) and hosts the server. You will need to have docker installed and run 
```
docker build --tag <name>:<tag> .
docker run -p <local_machine_port>:8080/tcp <name>:<tag>
```
*You could add `-d` to the run command to start the container in detached mode*

## Deployment notes

The tutorial and problem library rely on static data which is likely to be updated over time and its source location might change over time. We use container bind mounts (container dirs correspond to actual dirs on the host machine) to solve this. To check/update the mapping see *volumes* in `docker-compose.yml` in the project root.

The host machine will need to be set-up such that those (source) folders exist and that they have the desired content. Maybe have a scheduled task updating them.

A similar approach is taken for uploading problems. A scheduled task which backs up the files might be useful.

The deployment instructions are present in the main readme of this project.

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

## Problem library

It has a two-level file structure. Everything on the top level should be a directory whose name indicates a class of problems. The second level should consist of problem files only.

```
 - problem_library
  | - short_problems
    | - problem1.p
    | - problem2.p
  | - medium_problems
    | - problem3.p
    | - problem4.smt2
  ...
```

## Tutorials

Each tutorial page should be given as a separate markdown file.
To specify their order please start the file's name with `<idx>-` or `<idx>_`. This order will be used when serving the pages to the frontend and when generating the table of contents.

Other files/dirs are allowed (e.g. for storing images), but only top level markdowns will be send through the */tutorial* endpoint.

Code/Problem samples are provided using markdown's code syntax. (code is placed between a pair of triple backquotes). If you would like to provide some default args along with the problem text write those args on the first line of the code section using standard vampire long name arg format, e.g. "--time_limit 6 --input_syntax smtlib2".

In the frontend the editors displaying code have parsing enabled by default. If you would like to turn this off write "noparse" immediately after the opening triple quotes. (It may be useful for teaching tptp syntax.)

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
