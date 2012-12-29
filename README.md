JSONParse.js
============

What?
-----

It's a library for parsing JSON, using UnityScript (the programming language used in Unity).

Tonio adds: and now it works for mobile and is written in more idiomatic code.

Why?
----

Because JSON is the fat-free XML, and because UnityScript is not JavaScript (even though 
everybody says it is.).

Tonio adds: and exactly how else are your mobile apps supposed to chat with servers?

Who?
----

[Philip Peterson](http://ironmagma.com/).

[Tonio Loewald](http://loewald.com/).

Demo
----
```javascript

var s = "{ \"foo\": \"bar\", \"baz\" : [ 17, 18, 19, { \"fish\" : \"soup\" } ]}";

var j:json = json.fromString(s);
print( "tostring: " + j.toString() );
print( "stringified: " + j.stringify() );

print( "obj.foo: " + j._get("foo").toString() );
print( "obj.baz[2]: " + j._get("baz")._get(2).toString() );
print( "obj.baz[3].fish: " + j._get("baz")._get(3)._get("fish").toString() );

var json_obj = json._object(); // new empty object
json_obj._set("key", json._string("value")); // note that the string could have been passed "unwrapped"
print( json_obj.stringify() ); // {"key":"value"}

var json_array = json._array();
json_array._push(1)._push("two")._push( json._object()._set("foo","bar") ); // chaining, jQuery-style
print( json_array.stringify() ); // [ 1, "two", {"foo":"bar"} ];

```
