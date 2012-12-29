/*
JSONParse.js
A JSON Parser for the Unity Game Engine
 
Based on json_parse by Douglas Crockford
Ported by Philip Peterson (ironmagma/ppeterson)

Made usable on iOS (which requires strict typing) by Tonio Loewald
Also used more modern UnityScript features (put back the "switch" statements)
And fixed an error which prevented whitespace being used in one legitimate case
And consequently wrapped everything in a convenient container class

Usage:
var parsed : json = json.fromString( json_string );
var json_string = json.stringify();

var json_obj = json._object(); // new empty object
json_obj._set("key", json._string("value")); 
Debug.Log( json_obj.stringify() ); // {"key":"value"}

var json_array = json._array();
json_array._push(1)._push("two")._push( json._object()._set("foo","bar") );
Debug.Log( json_array.stringify() ); // [ 1, "two", {"foo":"bar"} ];
*/

#pragma strict

enum jsonType {
    _object = 0,
    _array = 1,
    _undefined = 2,
    _null = 3,
    _number = 4,
    _string = 5,
    _boolean = 6
}

class json {
    var type: jsonType = jsonType._undefined;
    var keys: String[];
    var values: json[];
    var number_value: double = 0;
    var string_value: String = "";
    var boolean_value: boolean = false;

    private static function error(json_obj: json, msg: String): void {
        if (json_obj) {
            msg += "\n" + json_obj.toString();
        }
        throw new System.Exception("json error -- " + msg);
    }

    static function fromString(s: String): json {
        return JSONParse.JSONParse(s);
    }

    function toString(): String {
        var s: String;
        var i: int;
        switch (type) {
            case jsonType._string:
            case jsonType._undefined:
            case jsonType._null:
            case jsonType._boolean:
                s = string_value;
                break;
            case jsonType._array:
                s = "[";
                for (i = 0; i < values.length; i++) {
                    s += i == 0 ? values[i].toString() : "," + values[i].toString();
                }
                s += "]";
                break;
            case jsonType._object:
                s = "{";
                for (i = 0; i < values.length; i++) {
                    s += i == 0 ? keys[i] + ": " + values[i].toString() : "," + keys[i] + ": " + values[i].toString();
                }
                s += "}";
                break;
            case jsonType._number:
                s = "" + number_value;
                break;
        }
        return s;
    }
    
    public static function json_encode(source:String) : String{
    	var s: String;
    	var i: int;
    	
		for (i = 0; i < source.length; i++) {
			switch (source[i]) {
				case '\n':
					s += "\\n";
					break;
				case "\f":
					s += "\\f";
					break;
				case "\\":
					s += "\\\\";
					break;
				case "/":
					s += "/";
					break;
				case "\r":
					s += "\\r";
				case "\t":
					s += "\\t";
				default:
					s += source[i];
			}
		}
		
		return s;
    }

    function stringify(): String {
        var s: String = "";
        var c: String;
        var i: int;
        switch (type) {
            case jsonType._string:
                s = "\"" + json_encode(string_value) + "\"";
                break;
            case jsonType._undefined:
            case jsonType._null:
            case jsonType._boolean:
                s = string_value;
                break;
            case jsonType._array:
                s = "[";
                for (i = 0; i < values.length; i++) {
                    s += i == 0 ? values[i].stringify() : "," + values[i].stringify();
                }
                s += "]";
                break;
            case jsonType._object:
                s = "{";
                for (i = 0; i < values.length; i++) {
                    s += i > 0 ? "," : "";
                    s += "\"" + json_encode(keys[i]) + "\":" + values[i].stringify();
                }
                s += "}";
                break;
            case jsonType._number:
                s = "" + number_value;
                break;
        }
        return s;
    }

    static function _undefined():json {
        var j = new json();
        j.string_value = "undefined";
        j.boolean_value = false;
        return j;
    }

    static function _array():json {
        var j = new json();
        j.type = jsonType._array;
        j.values = new json[0];
        return j;
    }

    function _push(val: json):json{
        var v: Array = new Array(values);
        v.push(val);
        values = v.ToBuiltin(json);
        return this;
    }
    
    function _push(d: double):json{
    	return _push( _number(d) );
    }
    
    function _push(s: String):json{
    	return _push( _string(s) );
    }

    static function _object(): json {
        var j = new json();
        j.type = jsonType._object;
        j.keys = new String[0];
        j.values = new json[0];
        return j;
    }

    function _set(key: String, value: json): json {
        if (type == jsonType._object) {
            for (var i = 0; i < keys.length; i++) {
                if (keys[i] === key) {
                    values[i] = value;
                    return;
                }
            }
            var k = new Array(keys);
            var v = new Array(values);
            k.push(key);
            v.push(value);
            keys = k.ToBuiltin(String);
            values = v.ToBuiltin(json);
        } else {
            error(this, "_set called on non-object");
        }
        return this;
    }
    
    function _set(key: String, d: double): json {
    	return _set( key, _number(d) );
    }
    
    function _set(key: String, s : String): json {
    	return _set( key, _string(s) );
    }
    
    function _get(key: String): json {
        if (type == jsonType._object) {
            for (var i = 0; i < keys.length; i++) {
                if (keys[i] == key) {
                    return values[i];
                }
            }
        }
        return _undefined(); // undefined!
    }
    
    function _get(index: int): json{
    	if (type == jsonType._array) {
    		if( index < values.length ){
    			return values[index];
    		} else {
    			error(this, "index out of bounds: " + index);
    		}
    	} else {
    		error(this, "not an array");
    	}
    	return _undefined();
    }

    static function _null(): json {
        var j = new json();
        j.string_value = "null";
        j.boolean_value = false;
        j.type = jsonType._null;
        return j;
    }

    static function _boolean(b: boolean): json {
        var j = new json();
        j.type = jsonType._boolean;
        j.boolean_value = b;
        j.string_value = b ? "true" : "false";
        j.number_value = b ? 1 : 0;
        return j;
    }

    static function _true(): json {
        return _boolean(true);
    }

    static function _false(): json {
        return _boolean(false);
    }

    static function _string(s: String): json {
        var j = new json();
        j.type = jsonType._string;
        j.string_value = s;
        return j;
    }

    static function _number(d: double): json {
        var j = new json();
        j.type = jsonType._number;
        j.number_value = d;
        return j;
    }

    static function _NaN(): json {
        var j = new json();
        j.type = jsonType._number;
        j.number_value = 0;
        return j;
    }
    
    static function test(){
		var s = "{ \"foo\": \"bar\", \"baz\" : [ 17, 18, 19, { \"fish\" : \"soup\" } ]}";
	
		Debug.Log( "JSONParse Unit Tests" );
		var j:json = json.fromString(s);
		Debug.Log( "tostring: " + j.toString() );
		Debug.Log( "stringified: " + j.stringify() );
	
		Debug.Log( "obj.foo: " + j._get("foo").toString() );
		Debug.Log( "obj.baz[2]: " + j._get("baz")._get(2).toString() );
		Debug.Log( "obj.baz[3].fish: " + j._get("baz")._get(3)._get("fish").toString() );
	
		var json_obj:json = json._object(); // new empty object
		json_obj._set("key", json._string("value")); 
		Debug.Log( json_obj.stringify() ); // {"key":"value"}

		var json_array = json._array();
		json_array._push(1)._push("two")._push( json._object()._set("foo","bar") );
		Debug.Log( json_array.stringify() ); // [ 1, "two", {"foo":"bar"} ];
	}
} /* END of json implementation */

private static var at: int;
private static var ch: String;
private static var escapee = {
    "\"": "\"",
    "\\": "\\",
    "/": "/",
    "b": "b",
    "f": "\f",
    "n": "\n",
    "r": "\r",
    "t": "\t"
};
private static var text: String;

private static function error(m): void {
    throw new System.Exception("SyntaxError: \nMessage: " + m +
        "\nAt: " + at +
        "\nText: " + text);
}

private static function next(c): System.String {
    if (c && c != ch) {
        error("Expected '" + c + "' instead of '" + ch + "'");
    }


    if (text.length >= at + 1) {
        ch = text.Substring(at, 1);
    } else {
        ch = "";
    }

    at++;
    return ch;

}

private static function next() {
    return next(null);
}

private static function number(): json {
    var number;
    var string = "";

    // Debug.Log("JSONParse number");

    if (ch == "-") {
        string = "-";
        next("-");
    }
    while (ch in ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"]) {
        string += ch;
        next();
    }
    if (ch == ".") {
        string += ".";
        while (next() && ch in ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"]) {
            string += ch;
        }
    }
    if (ch == "e" || ch == "E") {
        string += ch;
        next();
        if (ch == "-" || ch == "+") {
            string += ch;
            next();
        }
        while (ch in ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"]) {
            string += ch;
            next();
        }
    }
    number = Number.Parse(string);

    if (System.Double.IsNaN(number)) {
        return json._NaN();
    } else {
        return json._number(number);
    }

}

private static function string(): json {
    var hex: int;
    var i: int;
    var string: String = "";
    var uffff: int;

    // Debug.Log("JSONParse string");

    if (ch == "\"") {
        while (next()) {
            if (ch == "\"") {
                next();
                return json._string(string);
            } else if (ch == "\\") {
                next();
                if (ch == "u") {
                    uffff = 0;
                    for (i = 0; i < 4; i++) {
                        hex = System.Convert.ToInt32(next(), 16);
                        if (hex == Mathf.Infinity || hex == Mathf.NegativeInfinity) {
                            break;
                        }
                        uffff = uffff * 16 + hex;
                    }
                    var m: char = uffff;
                    string += m;
                } else if (ch in escapee) {
                    string += escapee[ch];
                } else {
                    break;
                }
            } else {
                string += ch;
            }
        }
    }
    error("Bad string");
    return json._undefined();
};

private static function white(): void {
    while (ch && (ch.length >= 1 && ch.Chars[0] <= 32)) { // if it's whitespace
        next();
    }
}

private static function value(): json {
    var obj: json;
    white();

    // Debug.Log("JSONParse value");

    switch (ch) {
        case "{":
            obj = object();
            break;
        case "[":
            obj = array();
            break;
        case "\"":
            obj = string();
            break;
        case "-":
            obj = number();
            break;
        default:
            obj = (ch in ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"]) ? number() : word();
    }

    return obj;
};

private static function word(): json {
    var obj: json;
    // Debug.Log("JSONParse word");

    switch (ch) {
        case "t":
            next("t");
            next("r");
            next("u");
            next("e");
            obj = json._true();
        case "f":
            next("f");
            next("a");
            next("l");
            next("s");
            next("e");
            obj = json._false();
        case "n":
            next("n");
            next("u");
            next("l");
            next("l");
            obj = json._null();
        default:
            obj = json._undefined();
    }

    error("Unexpected '" + ch + "'");
    return obj;
}

private static function array(): json {
    var j = json._array();

    // Debug.Log("JSONParse array");

    if (ch == "[") {
        next("[");
        white();
        if (ch == "]") {
            next("]");
            return j; // empty array
        }
        while (ch) {
            j._push(value());
            white();
            if (ch == "]") {
                next("]");
                return j;
            }
            next(",");
            white();
        }
    }
    error("Bad array");
    return json._undefined();
};

private static function object() {
    var key: json;
    var val: json;
    var object = json._object();

    // Debug.Log("JSONParse object");

    if (ch == "{") {
        next("{");
        white();
        if (ch == "}") {
            next("}");
            return object; // empty object
        }
        while (ch) {
            key = string();
            white();
            next(":");
            white();
            val = value();
            object._set(key.string_value, val);
            // Debug.Log( key.string_value + " = " + val.toString() );
            white();
            if (ch == "}") {
                next("}");
                return object;
            }
            next(",");
            white();
        }
    }
    
    error("Bad object");
    return json._undefined();
}

public static function JSONParse(source): json {
    var result: json;

    text = source;
    at = 0;
    ch = " ";
    result = value();
    white();
    if (ch) {
        error("Syntax error");
    }

    // Debug.Log("JSONParse -- parsed " + result.type + "\n" + result.toString());
    return result;
}
