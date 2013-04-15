JSONParse.js
============

New Stuff!
----------

JSONParse is much more pleasant to use now. Indeed, it's pleasant enough that you might enjoy
using json objects for conveniently storing values for other purposes (since it gives you a
lot of the nice qualities of a JavaScript dynamic object).

As before, you can simply do something like:

var json_value : json = json.fromString( .... );

In particular, there are convenience functions for grabbing values with no pesky underscores. These are:

json_value.getNumber( index: int OR key: string ): double
json_value.getString( index: int OR key: string ): String
json_value.getBoolean( index: int OR key: string): boolean
json_value.getArray( index: int OR key: string): json
json_value.getObject( index: int OR key: string): json
json_value.getRect( index: int OR key: string): Rect // expects x, y, width, height
json_value.getVector2( index: int OR key: string): Vector2 // expects x, y
json_value.getVector3( index: int OR key: string): Vector3 // expects x, y, z

All of these will throw Debug.LogErrors if the expected value is not present, making debugging easier.

There's also some other handy stuff such as:

json_value.has( key: String ): boolean // does this key exist?
json_value.length(): int // length of array or object property list, or 0
json_value.indexOf( key: String ): int // index of the key, or -1 if not found

I've used this to rewrite my own GUI library and it's almost pleasant to use it.

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
