/**
 * Created by jnaadjie on 9/6/15.
 */
(function () {
	//e.g contains([1,2,3],3) returns true
	exports.contains = function contains(a, obj) {
		for (var i = 0; i < a.length; i++) {
			if (isalreadySaved(a[i],obj)) {
				return true;
			}
		}
		return false;
	};

//checks if two objects are equal
//e.g movie1 = {title: "Batman Begins", Year: "2005"} is equivalent to movie2 = {title: "Batman Begins", Year: "2005"}
//which indicates it's already saved
	function isalreadySaved(a, b) {
		// Create arrays of property names
		var aProps = Object.getOwnPropertyNames(a);
		var bProps = Object.getOwnPropertyNames(b);

		// If number of properties is different,
		// objects are not equivalent
		if (aProps.length != bProps.length) {
			return false;
		}

		for (var i = 0; i < aProps.length; i++) {
			var propName = aProps[i];

			// If values of same property are not equal,
			// objects are not equivalent
			if (a[propName] !== b[propName]) {
				return false;
			}
		}
		// If we made it this far, objects
		// are considered equivalent
		return true;
	}
}());