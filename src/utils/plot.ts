import { promisify } from "util";
import { exec } from "child_process";
import { mathematicaParser2D, mathematicaParser3D } from "./parsers";
import { PlotSettings } from "types/plot";
import { parseYaml } from "obsidian";
import { MathematicaPlotSettings } from "types/plugin";

const isValidBase64 = (string: string) =>
	/^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=|[A-Za-z0-9+/]{4})$/.test(
		string
	);

export type GetBase64PlotSettings = Pick<
	MathematicaPlotSettings,
	"useCloud" | "wolframScriptPath"
>;

export const getBase64Plot = async (
	plot: string,
	{ useCloud, wolframScriptPath }: GetBase64PlotSettings
): Promise<{ error: string; base64: string }> => {
	const { stdout, stderr } = await promisify(exec)(
		`${wolframScriptPath ? wolframScriptPath : "wolframscript"} ${
			useCloud ? "--cloud" : ""
		}  --code 'ExportString[${plot}, {"Base64", "PNG"}]'`
	);
	if (stderr) return { error: stderr, base64: "" };
	// If it is not a valid image, it means there was a mistake in the wolfram syntax
	// So we return the base64 to debug the err, since it tells you whats wrong.
	if (!isValidBase64(stdout)) return { error: stdout, base64: "" };
	return { error: "", base64: stdout };
};

// Parses the YAML (codeblock) to Wolfram Mathematica
export const parseCodeBlock = (
	code: string
): { error: string; code: string } => {
	try {
		const settings: PlotSettings = parseYaml(code);
		let parsedCode = "";
		if (settings.raster.dim == "2D")
			parsedCode = mathematicaParser2D(settings);
		if (settings.raster.dim == "3D")
			parsedCode = mathematicaParser3D(settings);
		return { code: parsedCode.replace(/\s/g, ""), error: "" };
	} catch (err) {
		console.log(err);
		return { error: err.message, code: "" };
	}
};

export const buildBase64URL = (base64: string, format: string) =>
	`data:image/${format};base64,${base64}`;
