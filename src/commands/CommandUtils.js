// Parses command arguements, joining quoted strings as one.
// Not ideal because of there is a lot of regexing happening, and it treats single/double quotes as the same thing, but good enough for now.
const splitArgs = (message) => {
	const firstPass = message.split(" ");
	const secondPass = [];
	let openQuote = false;

	let j = 0;
	for(let i=0; i<firstPass.length; i++) {
		if (firstPass[i].includes("\"") || firstPass[i].includes("'")) {
			if (openQuote) {
				secondPass[j] = secondPass[j].concat(` ${firstPass[i].replace("\"", "").replace("'", "")}`);
				j++;
				openQuote = false;
			} else {
				secondPass.push(firstPass[i].replace("\"", "").replace("'", ""));
				openQuote = true;
			}
		} else {
			if (openQuote) {
				secondPass[j] = secondPass[j].concat(` ${firstPass[i].replace("\"", "").replace("'", "")}`);
			} else {
				secondPass.push(firstPass[i]);
				j++;
			}	 
		}
	}

	return secondPass;
};

exports.splitArgs = splitArgs;