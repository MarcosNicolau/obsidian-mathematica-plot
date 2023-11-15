import { promisify } from "util";
import { exec } from "child_process";
import { mathematicaParser2D, mathematicaParser3D } from "./parsers";
import { Settings } from "types/plot";

export const getBase64Plot = async (
	plot: string
): Promise<{ error: string; base64: string }> => {
	const { stdout, stderr } = await promisify(exec)(
		`wolframscript --code 'ExportString[${plot}, {"Base64", "PNG"}]'`
	);
	if (stderr || stdout.contains("Invalid"))
		return { error: stderr || stdout, base64: "" };
	return { error: "", base64: stdout };
};

// Parses the JSON (codeblock) to Wolfram Mathematica
export const parseCodeBlock = (
	code: string
): { error: string; code: string } => {
	try {
		const settings: Settings = JSON.parse(code);
		let parsedCode = "";
		if (settings.raster.type == "2D")
			parsedCode = mathematicaParser2D(settings);
		if (settings.raster.type == "3D")
			parsedCode = mathematicaParser3D(settings);

		return { code: parsedCode.replace(/\s/g, ""), error: "" };
	} catch (err) {
		console.log(err);
		return { error: err.message, code: "" };
	}
};

export const buildBase64URL = (base64: string, format: string) =>
	`data:image/${format};base64,${base64}`;
